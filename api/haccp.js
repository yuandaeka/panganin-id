// Vercel Serverless Function: Panganin HACCP Image Analysis
// Uses Gemini Vision API. Key read from SERVER-side env var (no VITE_ prefix).
// The AI first VALIDATES that the photo matches the selected category
// (dapur / bahan / kemasan), then performs a real HACCP analysis.
// Returns { ok, analysis } or { ok:false, rejected, reason }.

export const config = {
  maxDuration: 60,
};

const CATEGORY_RULES = {
  dapur: {
    label: 'foto dapur / area memasak (kompor, meja saji, talenan, wastafel dapur, peralatan masak)',
    mismatchHint: 'foto ini menunjukkan hal lain seperti ruang tamu, kamar, kantor, halaman, orang, atau benda non-dapur.',
    rejectMsg: 'Foto ini bukan dapur.',
  },
  bahan: {
    label: 'foto bahan baku pangan (sayur, daging, ayam, ikan, telur, buah, bumbu, tepung, bahan segar)',
    mismatchHint: 'foto ini bukan bahan baku pangan mentah.',
    rejectMsg: 'Foto ini bukan bahan baku pangan.',
  },
  kemasan: {
    label: 'foto wadah/kemasan makanan (styrofoam, plastik, kertas box, botol, tempat makan, gelas plastik)',
    mismatchHint: 'foto ini bukan wadah/kemasan pangan.',
    rejectMsg: 'Foto ini bukan kemasan/wadah pangan.',
  },
};

const buildPrompt = (tab, ingredientInput, isBranded) => {
  const rule = CATEGORY_RULES[tab] || CATEGORY_RULES.dapur;

  const analysisInstruction = {
    dapur: 'Audit kebersihan, tata letak, dan sanitasi dapur sesuai HACCP. Berikan skor 0-100, verdict, kategori, suhu lingkungan, material utama, dan rekomendasi perbaikan.',
    bahan: `Identifikasi titik kritis bahaya (CCP) bahan pangan${ingredientInput ? ` dengan deskripsi: ${ingredientInput}` : ''}. Berikan skor 0-100, verdict, kategori, cara penyimpanan, batas waktu simpan, dan 3 jenis cemaran (fisik, kimia, mikrobiologi).${isBranded ? ' Bahan berlabel merek pabrikan (BPOM/HALAL) - nilai risiko lebih rendah.' : ''}`,
    kemasan: 'Uji keamanan bahan kemasan (styrofoam, plastik, kertas, dll) terhadap pangan panas. Berikan skor 0-100, verdict, kategori, batas suhu aman, jenis kemasan, dan rekomendasi.',
  }[tab] || 'Analisis foto untuk audit keamanan pangan HACCP.';

  return `Anda adalah ahli audit HACCP (Hazard Analysis Critical Control Point) yang berpengalaman.

TUGAS: Analisis foto berikut.

LANGKAH 1 - VALIDASI KATEGORI (WAJIB, paling penting):
Pengguna memilih kategori "${tab}". Suatu foto dianggap VALID hanya jika foto tersebut dengan jelas menunjukkan ${rule.label}.
- Jika foto TIDAK menunjukkan hal itu (${rule.mismatchHint}), maka LANGKAH 2 TIDAK PERLU DILAKUKAN. Cukup kembalikan objek JSON dengan "valid": false dan jelaskan alasannya.
- Jika foto VALID, lanjut ke LANGKAH 2.

LANGKAH 2 - ANALISIS HACCP (hanya jika foto valid):
${analysisInstruction}

KEMBALIKAN HANYA SEBUAH OBJEK JSON (tanpa markdown, tanpa komentar) dengan struktur:
{
  "valid": true atau false,
  "rejection": "isi pesan penolakan jika valid=false, contoh: '${rule.rejectMsg} Mohon unggah foto ${tab} yang benar.'",
  "title": "judul singkat hasil analisis (jika valid)",
  "score": "angka/100 contoh: 72/100 (jika valid)",
  "verdictTitle": "judul vonis pendek (jika valid)",
  "verdictDesc": "penjelasan vonis 1-2 kalimat (jika valid)",
  "category": "kategori kontrol (jika valid)",
  "temp": "suhu/cara penyimpanan (jika valid)",
  "packaging": "jenis material / batas waktu (jika valid)",
  "cemaranFisik": "deskripsi bahaya benda asing, khusus tab bahan (jika valid)",
  "cemaranKimia": "deskripsi bahaya zat toksik, khusus tab bahan (jika valid)",
  "cemaranMikrobiologi": "deskripsi bahaya bakteri/patogen, khusus tab bahan (jika valid)",
  "adviceTitle": "judul rekomendasi (jika valid)",
  "adviceText": "rekomendasi tindakan praktis (jika valid)"
}`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }

  const { imageDataUrl, tab = 'dapur', ingredientInput = '', isBranded = false } = body;
  if (!imageDataUrl) {
    res.status(400).json({ error: 'imageDataUrl is required' });
    return;
  }

  const geminiKey = process.env.GEMINI_API_KEY || '';
  if (!geminiKey) {
    res.status(400).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    return;
  }

  const prompt = buildPrompt(tab, ingredientInput, isBranded);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: imageDataUrl.replace(/^data:image\/[a-zA-Z]+;base64,/, '')
                }
              },
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
        }
      })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || 'Koneksi Gemini ditolak.');
    }

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error('Format respon Gemini tidak valid.');

    const parsed = JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, '').trim());

    // Validation rejected the category
    if (parsed.valid === false) {
      const reason = parsed.rejection || 'Foto tidak sesuai dengan kategori yang dipilih.';
      res.status(200).json({ ok: false, rejected: true, reason });
      return;
    }

    const scoreNum = parseInt(String(parsed.score).replace(/\D/g, ''), 10) || 70;
    const boxType = scoreNum >= 65 ? 'safe' : 'danger';
    const isBahanTab = tab === 'bahan';

    res.status(200).json({
      ok: true,
      analysis: {
        title: parsed.title || (isBahanTab ? 'Bahan Baku Pangan' : tab === 'dapur' ? 'Audit Dapur' : 'Bahan Kemas Pangan'),
        boxType,
        boxTag: boxType === 'safe' ? 'CHECKED: AMAN (HACCP)' : 'PERINGATAN: BERISIKO',
        boxStyle: { top: '15%', left: '15%', width: '70%', height: '70%' },
        score: parsed.score || `${scoreNum}/100`,
        scoreClass: boxType === 'safe'
          ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
          : 'text-red-650 bg-red-50 border-red-100',
        verdictTitle: parsed.verdictTitle || 'Analisis AI HACCP Selesai',
        verdictDesc: parsed.verdictDesc || 'Hasil analisis citra oleh Gemini AI.',
        category: parsed.category || 'Analisis Citra AI',
        temp: parsed.temp || 'Data tidak tersedia',
        packaging: parsed.packaging || 'Data tidak tersedia',
        icon: boxType === 'safe' ? 'fa-solid fa-circle-check text-emerald-600' : 'fa-solid fa-triangle-exclamation text-red-650',
        iconBg: boxType === 'safe' ? 'bg-emerald-100' : 'bg-red-100',
        adviceClass: boxType === 'safe' ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' : 'bg-red-50 text-red-900 border border-red-100',
        adviceTitle: parsed.adviceTitle || 'Rekomendasi AI:',
        adviceText: parsed.adviceText || 'Segera lakukan tindakan koreksi sesuai standar HACCP.',
        cemaranFisik: parsed.cemaranFisik || '',
        cemaranKimia: parsed.cemaranKimia || '',
        cemaranMikrobiologi: parsed.cemaranMikrobiologi || '',
        brandedAdvice: isBranded ? '⚠️ BAHAN BERMERK: Periksa keutuhan segel kemasan pabrik dan masa kedaluwarsa pada label.' : '',
        isBahan: isBahanTab
      }
    });
  } catch (err) {
    console.error('Gemini Vision analysis failed:', err);
    res.status(502).json({ error: err.message || 'Analisis gambar gagal.' });
  }
}
