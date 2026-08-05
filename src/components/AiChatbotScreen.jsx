import React, { useState, useEffect, useRef } from 'react';

const SUGGESTIONS = [
  {
    text: "Bagaimana agar kuah sup porsi besar tidak cepat dingin?",
    label: "🍲 Sup massal tetap hangat?"
  },
  {
    text: "Apa bahaya membungkus makanan panas dengan plastik kresek?",
    label: "⚠️ Bahaya bungkus kresek?"
  },
  {
    text: "Bagaimana sistem blockchain membantu petani lokal?",
    label: "🔗 Peran Blockchain tani?"
  }
];

const SYSTEM_PROMPT = "Anda adalah Panganin AI Assistant, asisten pintar ahli gizi dan konsultan keamanan pangan (HACCP) untuk Program Makan Bergizi Gratis di Indonesia. Bantu jawab pertanyaan seputar gizi masakan massal, regulasi suhu sajian, pencegahan food-waste, harga bahan pangan petani lokal, dan bahaya wadah saji plastik/styrofoam. ATURAN FORMAT JAWABAN: 1) JANGAN gunakan simbol markdown seperti **, *, #, -, atau bullet points. 2) Tulis jawaban dalam bentuk paragraf dan kalimat yang rapi seperti chat assistant profesional. 3) Jika perlu membuat daftar, gunakan angka biasa (1, 2, 3) tanpa simbol apapun. 4) Berikan saran dan rekomendasi praktis di akhir jawaban. 5) Gunakan bahasa Indonesia yang ramah, sopan, dan mudah dipahami. 6) Jawab secara lengkap dan tuntas, jangan terpotong.";

// Parse an SSE (Server-Sent Events) stream and call onChunk for each data payload.
const streamSse = async (response, onChunk) => {
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      message = data.error?.message || data.message || message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  if (!response.body) {
    throw new Error('Streaming tidak didukung oleh browser ini.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const handleLine = (line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('data:')) return;
    const payload = trimmed.slice(5).trim();
    if (!payload || payload === '[DONE]') return;
    try {
      const json = JSON.parse(payload);
      onChunk(json);
    } catch {
      // skip malformed SSE payload
    }
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

export default function AiChatbotScreen({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Halo Chef! Saya **Panganin AI**. Saya siap membantu menjawab pertanyaan seputar standardisasi gizi, porsi makan besar, bahaya wadah (plastik/styrofoam), regulasi suhu, dan pengolahan limbah. Apa yang ingin Anda tanyakan hari ini?"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef(null);

  // Read DeepSeek API Key (primary) and Gemini API Key (fallback) silently
  const deepseekKey = (
    import.meta.env.VITE_DEEPSEEK_API_KEY ||
    localStorage.getItem('panganin_deepseek_key') || 
    ''
  ).trim();
  const geminiKey = (
    import.meta.env.VITE_GEMINI_API_KEY || 
    localStorage.getItem('panganin_gemini_key') || 
    ''
  ).trim();

  // Scroll to bottom whenever messages list changes
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleOfflineReply = (text, loadingId) => {
    let reply = "";
    const lowerQuery = text.toLowerCase();

    if (lowerQuery.includes('dingin') || lowerQuery.includes('masak')) {
      reply = "Untuk menghindari makanan dingin pada program porsi besar (seperti kritik masukan Wapres Gibran): \n\n1. **Prinsip T-T-T (Time, Temp, Trade)**: Jeda waktu antara selesai masak & distribusi tidak boleh lebih dari 4 jam jika tanpa pemanas. \n2. **Gunakan Thermal Insulated Box**: Simpan wadah stainless dalam kotak berisolasi busa poliuretan tebal agar suhu bertahan di atas 60°C.";
    } else if (lowerQuery.includes('plastik') || lowerQuery.includes('kresek') || lowerQuery.includes('styrofoam') || lowerQuery.includes('wadah')) {
      reply = "Wadah non-foodgrade sangat berbahaya bagi kesehatan!\n\n* **Plastik Kresek Hitam**: Hasil daur ulang kotor. Panas memicu perpindahan logam berat & klorin.\n* **Styrofoam**: Mengandung zat residu karsinogenik (Benzena/Stirena). Sangat dilarang untuk kuah bersuhu >70°C.\n* **Rekomendasi**: Gunakan wadah plastik PP (Kode 5) atau kemasan serat tanaman (bagasse) biodegradable yang aman.";
    } else if (lowerQuery.includes('blockchain') || lowerQuery.includes('tani') || lowerQuery.includes('petani')) {
      reply = "Sistem **PANGANIN Blockchain** mencatat data pasokan pangan langsung dari petani lokal tanpa perantara tengkulak. \n\nKeuntungannya: \n1. **Transparansi Harga**: Memastikan harga beli transparan di ledger digital guna mencegah korupsi atau manipulasi anggaran program gizi.\n2. **Rantai Pasok Kilat**: Menghubungkan logistik terdekat sehingga makanan lebih segar saat sampai ke dapur massal.";
    } else if (lowerQuery.includes('haccp')) {
      reply = "Analisis **HACCP (Hazard Analysis Critical Control Point)** di Panganin melacak kebersihan dapur Anda. Anda bisa memoto meja produksi atau wadah penyajian, dan AI kami akan mengukur skor higienitas, potensi cemaran mikroba silang, serta memberikan checklist digital secara otomatis.";
    } else {
      reply = "Terima kasih atas pertanyaannya! Saya dapat memandu Anda untuk optimasi resep massal bergizi, mendeteksi bahaya wadah saji (styrofoam/kresek) dengan AI scanner, serta pencocokan petani lokal via blockchain. Silakan ketik pertanyaan yang lebih spesifik.";
    }

    setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, text: reply, isLoading: false } : m));
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text
    };
    const loadingId = Date.now() + 1;

    // Consolidate state updates to display user message and loading indicator
    setMessages(prev => [
      ...prev,
      userMsg,
      {
        id: loadingId,
        sender: 'ai',
        text: '...',
        isLoading: true
      }
    ]);
    setInputVal('');

    if (!deepseekKey && !geminiKey) {
      // Fallback to offline rule silently if no API key is set
      setTimeout(() => {
        handleOfflineReply(text, loadingId);
      }, 1000);
      return;
    }

    // Try DeepSeek first (primary), then Gemini (fallback), then offline as last resort
    const callDeepSeek = async (onChunk) => {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
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

      await streamSse(response, (json) => {
        const delta = json.choices && json.choices[0] && json.choices[0].delta;
        if (delta && delta.content) {
          onChunk(delta.content);
        }
      });
    };

    const callGemini = async (onChunk) => {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text }] }
          ],
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            thinkingConfig: { thinkingBudget: 0 }
          }
        })
      });

      await streamSse(response, (json) => {
        const chunk = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (chunk) {
          onChunk(chunk);
        } else if (json.error) {
          throw new Error(json.error.message || "Koneksi API ditolak oleh server Gemini.");
        }
      });
    };

    const updateStreaming = (chunk) => {
      setMessages(prev => prev.map(m => m.id === loadingId ? {
        ...m,
        text: (m.text === '...' ? '' : m.text) + chunk,
        isLoading: false,
        isStreaming: true
      } : m));
    };

    const markDone = () => {
      setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, isStreaming: false } : m));
    };

    const errors = [];

    // 1) Try DeepSeek first when key is available
    if (deepseekKey) {
      let streamedAny = false;
      try {
        await callDeepSeek((chunk) => {
          streamedAny = true;
          updateStreaming(chunk);
        });
        markDone();
        return;
      } catch (err) {
        // If DeepSeek already produced partial text, keep it instead of switching
        if (streamedAny) {
          console.error("DeepSeek stream interrupted after partial response:", err);
          markDone();
          return;
        }
        console.error("DeepSeek API failed, switching to Gemini fallback:", err);
        errors.push(`DeepSeek: ${err.message}`);
      }
    }

    // 2) Try Gemini as fallback when DeepSeek missing or failed
    if (geminiKey) {
      let streamedAny = false;
      try {
        await callGemini((chunk) => {
          streamedAny = true;
          updateStreaming(chunk);
        });
        markDone();
        return;
      } catch (err) {
        if (streamedAny) {
          console.error("Gemini stream interrupted after partial response:", err);
          markDone();
          return;
        }
        console.error("Gemini API fallback also failed:", err);
        errors.push(`Gemini: ${err.message}`);
      }
    }

    // 3) Last resort: offline rule-based reply
    if (errors.length > 0) {
      console.warn("Both DeepSeek & Gemini failed. Using offline reply. Reasons:", errors);
    }
    handleOfflineReply(text, loadingId);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputVal);
    }
  };

  const formatMsgText = (text) => {
    let formatted = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    // Clean up any remaining markdown symbols from AI output
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '$1');
    formatted = formatted.replace(/\*(.*?)\*/g, '$1');
    formatted = formatted.replace(/^#{1,6}\s*/gm, '');
    formatted = formatted.replace(/^[-•]\s+/gm, '');
    formatted = formatted.replace(/\n/g, '<br />');

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <div 
      id="ai-chatbot-panel" 
      className="flex-1 flex flex-col animate-[fadeIn_0.3s_ease-out] bg-white relative overflow-hidden"
    >
      {/* Full-Screen Header panel */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white px-4 py-4 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-emerald-700 rounded-full flex items-center justify-center border border-emerald-600 shadow-sm shrink-0">
            <i className="fa-solid fa-robot"></i>
          </div>
          <div>
            <h3 className="font-display text-sm font-extrabold">Panganin AI Assistant</h3>
            <p className="text-[9px] text-emerald-300 flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span> Ahli Gizi & HACCP Pintar
            </p>
          </div>
        </div>
        
        <button 
          onClick={onClose} 
          className="p-1.5 text-emerald-250 hover:text-white transition-all-300 cursor-pointer rounded-full hover:bg-white/10"
          title="Tutup Chat"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      {/* Messages Stream container */}
      <div id="chat-messages-container" className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-2 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto justify-end' : ''
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-[9px] p-1.5 font-black shrink-0 border border-emerald-200 shadow-3xs">
                AI
              </div>
            )}
            <div 
              className={`p-3 rounded-2xl shadow-3xs text-xs leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
              }`}
            >
              {msg.isLoading ? (
                /* Three Typing Dots Animation */
                <div className="flex items-center gap-1 py-1">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              ) : (
                <>
                  {formatMsgText(msg.text)}
                  {msg.isStreaming && (
                    <span className="inline-block w-[2px] h-3 bg-emerald-600 align-middle animate-pulse ml-0.5"></span>
                  )}
                </>
              )}
            </div>
            {msg.sender === 'user' && (
              <div className="w-7 h-7 bg-emerald-700 text-white rounded-full flex items-center justify-center text-[9px] p-1.5 font-black shrink-0 border border-emerald-600 shadow-3xs">
                ME
              </div>
            )}
          </div>
        ))}
        
        {/* Suggestion Chips */}
        {messages.length === 1 && (
          <div className="flex flex-col gap-2 pt-2.5">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rekomendasi Pertanyaan:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSendMessage(s.text)} 
                  className="text-[10px] text-left bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-2 rounded-full border border-emerald-200 transition-all-300 cursor-pointer active:scale-95 shadow-3xs"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat input controls */}
      <div className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0 pb-6 md:pb-3">
        <input 
          type="text" 
          id="chat-user-input" 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ketik pertanyaan gizi/HACCP..." 
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all-300 h-12"
        />
        <button 
          onClick={() => handleSendMessage(inputVal)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4.5 rounded-xl shadow-md shadow-emerald-600/10 transition-all-300 cursor-pointer flex items-center justify-center active:scale-95 h-12 w-12 shrink-0"
          title="Kirim Pesan"
        >
          <i className="fa-solid fa-paper-plane text-sm"></i>
        </button>
      </div>
    </div>
  );
}
