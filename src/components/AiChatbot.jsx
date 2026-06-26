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

export default function AiChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Halo Chef! Saya **Panganin AI**. Saya siap membantu menjawab pertanyaan seputar standardisasi gizi, porsi makan besar, bahaya wadah (plastik/styrofoam), regulasi suhu, dan pengolahan limbah. Apa yang ingin Anda tanyakan hari ini?"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef(null);

  // Read Gemini API Key from Vite environment variables or localStorage fallback
  const apiKey = (
    import.meta.env.VITE_GEMINI_API_KEY || 
    localStorage.getItem('panganin_gemini_key') || 
    ''
  ).trim();

  // Scroll to bottom whenever messages list changes
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

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

    // Show user message and loading indicator
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

    if (!apiKey) {
      // Fallback to offline rules if no API key is available
      setTimeout(() => {
        handleOfflineReply(text, loadingId);
      }, 1000);
      return;
    }

    // Call Gemini API via fetch REST call
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: text }]
            }
          ],
          systemInstruction: {
            parts: [
              {
                text: "Anda adalah Panganin AI Assistant, asisten pintar ahli gizi dan konsultan keamanan pangan (HACCP) untuk Program Makan Bergizi Gratis di Indonesia. Bantu jawab pertanyaan seputar gizi masakan massal, regulasi suhu sajian, pencegahan food-waste, harga bahan pangan petani lokal, dan bahaya wadah saji plastik/styrofoam. ATURAN FORMAT JAWABAN: 1) JANGAN gunakan simbol markdown seperti **, *, #, -, atau bullet points. 2) Tulis jawaban dalam bentuk paragraf dan kalimat yang rapi seperti chat assistant profesional. 3) Jika perlu membuat daftar, gunakan angka biasa (1, 2, 3) tanpa simbol apapun. 4) Berikan saran dan rekomendasi praktis di akhir jawaban. 5) Gunakan bahasa Indonesia yang ramah, sopan, dan mudah dipahami. 6) Jawab secara lengkap dan tuntas, jangan terpotong."
              }
            ]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            thinkingConfig: {
              thinkingBudget: 0
            }
          }
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "Koneksi API ditolak oleh server Gemini.");
      }

      if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
        const replyText = data.candidates[0].content.parts[0].text;
        setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, text: replyText, isLoading: false } : m));
      } else {
        throw new Error("Format respon API Gemini tidak valid.");
      }
    } catch (err) {
      console.error("Gemini API Connection failed:", err);
      setMessages(prev => prev.map(m => m.id === loadingId ? {
        ...m,
        text: `⚠️ **Gagal memuat respon AI**\n\n*Penyebab:* ${err.message}\n\n*Harap periksa kembali validitas Gemini API Key di file .env.local Anda.*`,
        isLoading: false
      } : m));
    }
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
      className={`absolute inset-0 bg-white z-55 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      }`}
    >
      {/* Full-Screen Header panel */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white px-4 py-4 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-emerald-700 rounded-full flex items-center justify-center border border-emerald-600 shadow-sm shrink-0">
            <i className="fa-solid fa-robot"></i>
          </div>
          <div>
            <h3 className="text-xs font-extrabold">Panganin AI Assistant</h3>
            <p className="text-[9px] text-emerald-300 flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span> Ahli Gizi & HACCP Pintar
            </p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-1.5 text-emerald-200 hover:text-white transition-all-300 cursor-pointer rounded-full hover:bg-white/10"
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
                formatMsgText(msg.text)
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
