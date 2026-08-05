// Vercel Serverless Function: Panganin HACCP Image Analysis
// Uses Gemini Vision API. Key read from SERVER-side env var (no VITE_ prefix).
// Returns a structured analysis object compatible with HaccpScannerScreen.

export const config = {
  maxDuration: 60,
};

const buildPrompt = (tab, ingredientInput, isBranded) => {
  const tabInstruction = {
    dapur: "Analisis foto dapur untuk audit kebersihan, tata letak, dan sanitasi sesuai standar HACCP. Berikan skor 0-100, verdict, kategori, suhu lingkungan, material utama, dan rekomendasi perbaikan.",
    bahan: `Analisis foto bahan pangan${ingredientInput ? ` dengan deskripsi berikut: ${ingredientInput}` : ''} untuk mengidentifikasi potensi bahaya HACCP. Berikan skor 0-100, verdict, kategori, cara penyimpanan, batas waktu simpan, dan 3 jenis cemaran (fisik, kimia, mikrobiologi).${isBranded ? ' Bahan berlabel merek pabrikan (BPOM/HALAL) - nilai risiko lebih rendah.' : ''}`,
    kemasan: "Analisis foto wadah/kemasan makanan untuk menguji keamanan bahan kemasan (styrofoam, plastik, kertas, dll) terhadap pangan panas. Berikan skor 0-100, verdict, kategori, batas suhu aman, jenis kemasan, dan rekomendasi."
  }[tab] || "Analisis foto untuk audit keamanan pangan HACCP.";

  return `${tabInstruction}

SILAKAN JALANKAN ANALISIS DAN KEMBALIKAN HANYA SEBUAH OBJEK JSON (tanpa markdown, tanpa komentar) dengan struktur berikut:
{
  "title": "judul singkat hasil analisis",
  "score": "angka/100 contoh: 72/100",
  "verdictTitle": "judul vonis pendek",
  "verdictDesc": "penjelasan vonis 1-2 kalimat",
  "category": "kategori kontrol",
  "temp": "suhu/cara penyimpanan",
  "packaging": "jenis material / batas waktu",
  "cemaranFisik": "deskripsi bahaya benda asing (hanya untuk tab bahan)",
  "cemaranKimia": "deskripsi bahaya zat toksik (hanya untuk tab bahan)",
  "cemaranMikrobiologi": "deskripsi bahaya bakteri/patogen (hanya untuk tab bahan)",
  "adviceTitle": "judul rekomendasi",
  "adviceText": "rekomendasi tindakan praktis"
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
