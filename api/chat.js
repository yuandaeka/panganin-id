// Vercel Serverless Function: Panganin AI Chatbot
// Reads API keys from SERVER-side env vars (no VITE_ prefix, never exposed to browser).
// DeepSeek primary -> Gemini fallback -> offline rule reply.
// Streams SSE back to the client.

export const config = {
  maxDuration: 60,
};

const SYSTEM_PROMPT = "Anda adalah Panganin AI Assistant, asisten pintar ahli gizi dan konsultan keamanan pangan (HACCP) untuk Program Makan Bergizi Gratis di Indonesia. Bantu jawab pertanyaan seputar gizi masakan massal, regulasi suhu sajian, pencegahan food-waste, harga bahan pangan petani lokal, dan bahaya wadah saji plastik/styrofoam. ATURAN FORMAT JAWABAN: 1) JANGAN gunakan simbol markdown seperti **, *, #, -, atau bullet points. 2) Tulis jawaban dalam bentuk paragraf dan kalimat yang rapi seperti chat assistant profesional. 3) Jika perlu membuat daftar, gunakan angka biasa (1, 2, 3) tanpa simbol apapun. 4) Berikan saran dan rekomendasi praktis di akhir jawaban. 5) Gunakan bahasa Indonesia yang ramah, sopan, dan mudah dipahami. 6) Jawab secara lengkap dan tuntas, jangan terpotong.";

function offlineReply(text) {
  const q = text.toLowerCase();
  if (q.includes('dingin') || q.includes('masak')) {
    return "Untuk menghindari makanan dingin pada program porsi besar (seperti kritik masukan Wapres Gibran): \n\n1. Prinsip T-T-T (Time, Temp, Trade): Jeda waktu antara selesai masak & distribusi tidak boleh lebih dari 4 jam jika tanpa pemanas. \n2. Gunakan Thermal Insulated Box: Simpan wadah stainless dalam kotak berisolasi busa poliuretan tebal agar suhu bertahan di atas 60°C.";
  }
  if (q.includes('plastik') || q.includes('kresek') || q.includes('styrofoam') || q.includes('wadah')) {
    return "Wadah non-foodgrade sangat berbahaya bagi kesehatan!\n\n* Plastik Kresek Hitam: Hasil daur ulang kotor. Panas memicu perpindahan logam berat & klorin.\n* Styrofoam: Mengandung zat residu karsinogenik (Benzena/Stirena). Sangat dilarang untuk kuah bersuhu >70°C.\n* Rekomendasi: Gunakan wadah plastik PP (Kode 5) atau kemasan serat tanaman (bagasse) biodegradable yang aman.";
  }
  if (q.includes('blockchain') || q.includes('tani') || q.includes('petani')) {
    return "Sistem PANGANIN Blockchain mencatat data pasokan pangan langsung dari petani lokal tanpa perantara tengkulak. \n\nKeuntungannya: \n1. Transparansi Harga: Memastikan harga beli transparan di ledger digital guna mencegah korupsi atau manipulasi anggaran program gizi.\n2. Rantai Pasok Kilat: Menghubungkan logistik terdekat sehingga makanan lebih segar saat sampai ke dapur massal.";
  }
  if (q.includes('haccp')) {
    return "Analisis HACCP (Hazard Analysis Critical Control Point) di Panganin melacak kebersihan dapur Anda. Anda bisa memoto meja produksi atau wadah penyajian, dan AI kami akan mengukur skor higienitas, potensi cemaran mikroba silang, serta memberikan checklist digital secara otomatis.";
  }
  return "Terima kasih atas pertanyaannya! Saya dapat memandu Anda untuk optimasi resep massal bergizi, mendeteksi bahaya wadah saji (styrofoam/kresek) dengan AI scanner, serta pencocokan petani lokal via blockchain. Silakan ketik pertanyaan yang lebih spesifik.";
}

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

  const text = (body.text || '').toString().trim();
  if (!text) {
    res.status(400).json({ error: 'text is required' });
    return;
  }

  const deepseekKey = process.env.DEEPSEEK_API_KEY || '';
  const geminiKey = process.env.GEMINI_API_KEY || '';

  // SSE headers so the client can stream the typing effect
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (obj) => {
    try { res.write(`data: ${JSON.stringify(obj)}\n\n`); } catch { /* client closed */ }
  };
  const done = () => {
    try {
      res.write('data: [DONE]\n\n');
      res.end();
    } catch { /* ignore */ }
  };

  // Parse an upstream SSE stream and forward each text delta via onChunk
  const pipeUpstream = async (response, extractDelta) => {
    if (!response.ok) {
      let msg = `HTTP ${response.status}`;
      try {
        const data = await response.json();
        msg = data.error?.message || data.message || msg;
      } catch { /* ignore */ }
      throw new Error(msg);
    }
    if (!response.body) throw new Error('Streaming tidak didukung oleh upstream.');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const handleLine = (line) => {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) return;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === '[DONE]') return;
      try {
        const delta = extractDelta(JSON.parse(payload));
        if (delta) send({ chunk: delta });
      } catch { /* skip malformed */ }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      lines.forEach(handleLine);
    }
    if (buffer.trim()) handleLine(buffer);
  };

  try {
    // 1) DeepSeek (primary)
    if (deepseekKey) {
      try {
        const upstream = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${deepseekKey}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: text }
            ],
            temperature: 0.7,
            max_tokens: 8192,
            stream: true
          })
        });
        await pipeUpstream(upstream, (json) =>
          json.choices?.[0]?.delta?.content
        );
        done();
        return;
      } catch (err) {
        console.error('DeepSeek API failed, switching to Gemini fallback:', err);
      }
    }

    // 2) Gemini (fallback)
    if (geminiKey) {
      try {
        const upstream = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text }] }],
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192,
                thinkingConfig: { thinkingBudget: 0 }
              }
            })
          }
        );
        await pipeUpstream(upstream, (json) => {
          if (json.error) throw new Error(json.error.message || 'Gemini error');
          return json.candidates?.[0]?.content?.parts?.[0]?.text;
        });
        done();
        return;
      } catch (err) {
        console.error('Gemini API fallback also failed:', err);
      }
    }

    // 3) Offline rule reply (no keys configured or both failed)
    console.warn('No API key available or both providers failed. Using offline reply.');
    send({ chunk: offlineReply(text) });
    done();
  } catch (err) {
    console.error('AI API Connection failed:', err);
    try {
      send({ chunk: `⚠️ Gagal memuat respon AI\n\nPenyebab: ${err.message}\n\nHarap periksa kembali validitas API Key di environment server (DEEPSEEK_API_KEY / GEMINI_API_KEY).` });
      done();
    } catch { /* ignore */ }
  }
}
