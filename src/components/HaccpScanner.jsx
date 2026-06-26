import React, { useState, useEffect } from 'react';

const presets = {
  styrofoam: {
    title: "Kuah Styrofoam (Panas)",
    image: "https://placehold.co/600x350/ffe4e6/991b1b?text=Wadah+Sup+Styrofoam+Terbuka",
    boxType: "danger",
    boxTag: "BAHAYA: STYROFOAM DETECTED",
    boxStyle: { top: '25%', left: '30%', width: '40%', height: '50%' },
    score: "42/100",
    scoreClass: "text-red-600 bg-red-50 border-red-100",
    verdictTitle: "Peringatan Kontaminasi Wadah!",
    verdictDesc: "Styrofoam memicu pelepasan bahan berbahaya stirena saat terkena kuah sup bersuhu tinggi (>70°C).",
    category: "Wadah / Kemasan Distribusi",
    temp: "85°C (Terlalu Panas)",
    packaging: "Styrofoam (Dilarang)",
    icon: "fa-solid fa-triangle-exclamation text-red-600",
    iconBg: "bg-red-100",
    adviceClass: "bg-red-50 text-red-900 border border-red-100",
    adviceTitle: "Rekomendasi Tindakan Segera:",
    adviceText: "Hentikan pembagian makanan! Pindahkan sup kuah panas ke wadah plastik kode 5 (PP) atau stainless steel bersertifikasi foodgrade."
  },
  plastic: {
    title: "Kresek Panas Warmindo",
    image: "https://placehold.co/600x350/ffe4e6/991b1b?text=Makanan+Panas+Bungkus+Kresek",
    boxType: "danger",
    boxTag: "RISIKO: PLASTIK KRESEK HITAM",
    boxStyle: { top: '25%', left: '25%', width: '50%', height: '50%' },
    score: "35/100",
    scoreClass: "text-red-600 bg-red-50 border-red-100",
    verdictTitle: "Bahaya Kresek Daur Ulang!",
    verdictDesc: "Plastik kresek hitam terbuat dari daur ulang polimer yang mengandung klorin, berbahaya saat bersentuhan dengan makanan berlemak dan panas.",
    category: "Kebersihan & Penyajian",
    temp: "78°C (Berbahaya)",
    packaging: "Kresek Hitam Daur Ulang",
    icon: "fa-solid fa-triangle-exclamation text-red-600",
    iconBg: "bg-red-100",
    adviceClass: "bg-red-50 text-red-900 border border-red-100",
    adviceTitle: "Rekomendasi Tindakan Segera:",
    adviceText: "Gunakan wadah kertas berlapisan lilin foodgrade atau kemasan kotak biodegradabel berbahan serat tebu/singkong."
  },
  stainless: {
    title: "Wadah Stainless Steel",
    image: "https://placehold.co/600x350/ecfdf5/065f46?text=Stainless+Steel+Wadah+Saji",
    boxType: "safe",
    boxTag: "AMAN: FOOD GRADE STAINLESS",
    boxStyle: { top: '20%', left: '25%', width: '50%', height: '60%' },
    score: "98/100",
    scoreClass: "text-emerald-700 bg-emerald-50 border-emerald-100",
    verdictTitle: "Sangat Higienis & Aman",
    verdictDesc: "Wadah stainless steel meminimalkan risiko perpindahan partikel kimia dan mudah disterilkan secara masif.",
    category: "Material Serving Dapur",
    temp: "65°C (Suhu Hangat Ideal)",
    packaging: "SUS 304 Foodgrade",
    icon: "fa-solid fa-circle-check text-emerald-650",
    iconBg: "bg-emerald-100",
    adviceClass: "bg-emerald-50 text-emerald-900 border border-emerald-100",
    adviceTitle: "Status Verifikasi:",
    adviceText: "Sangat direkomendasikan untuk pendistribusian makanan Program Makan Bergizi Gratis skala besar."
  },
  dirty: {
    title: "Meja Dapur Kotor",
    image: "https://placehold.co/600x350/fffbeb/92400e?text=Dapur+Meja+Saji+Kotor",
    boxType: "danger",
    boxTag: "PERINGATAN: KOTOR & KONTAMINASI",
    boxStyle: { top: '20%', left: '30%', width: '40%', height: '55%' },
    score: "55/100",
    scoreClass: "text-amber-700 bg-amber-50 border-amber-100",
    verdictTitle: "Kebersihan Meja Kurang",
    verdictDesc: "Ditemukan sisa bahan makanan kotor di dekat area pengemasan akhir, berpotensi mengundang lalat dan kontaminasi bakteri.",
    category: "Kebersihan Area Produksi",
    temp: "28°C (Suhu Ruang)",
    packaging: "Stainless Meja Kotor",
    icon: "fa-solid fa-circle-exclamation text-amber-600",
    iconBg: "bg-amber-100",
    adviceClass: "bg-amber-50 text-amber-900 border border-amber-100",
    adviceTitle: "Rekomendasi Tindakan Segera:",
    adviceText: "Bersihkan meja produksi dengan larutan disinfektan klorin 100ppm sebelum memulai proses pengemasan menu selanjutnya."
  }
};

export default function HaccpScanner({ onBackToHome }) {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const handleSimulate = (key) => {
    setIsScanning(true);
    // Smooth transition scanning effect (500ms simulation)
    setTimeout(() => {
      setSelectedPreset(key);
      setCurrentData(presets[key]);
      setIsScanning(false);
    }, 500);
  };

  return (
    <section id="screen-haccp" className="p-4 space-y-5 animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onBackToHome} 
          className="p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-full transition-all-300 cursor-pointer h-10 w-10 flex items-center justify-center border border-slate-100"
          title="Kembali ke Beranda"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 leading-tight">AI HACCP Photo Scanner</h2>
          <p className="text-xs text-slate-500">Uji higienis dapur, kesiapan saji & bahaya wadah</p>
        </div>
      </div>

      {/* Simulated Camera Viewfinder */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl aspect-video relative flex flex-col items-center justify-center group border border-slate-850">
        
        {isScanning ? (
          // Scanning Loading Overlay
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center z-10 text-white space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold tracking-wider text-emerald-400 uppercase animate-pulse">Scanning & Analyzing via Panganin AI...</p>
          </div>
        ) : null}

        {/* Camera Backdrop Simulation */}
        <img 
          id="haccp-camera-img" 
          src={currentData ? currentData.image : "https://placehold.co/600x350/111827/ffffff?text=Pilih+Kondisi+Analisis+Di+Bawah"} 
          alt="Camera View" 
          className="w-full h-full object-cover transition-all duration-300"
        />
        
        {/* Bounding Box Overlay */}
        {!isScanning && currentData && (
          <div 
            className={`absolute border-2 rounded-2xl p-2 animate-[pulse_2s_infinite] ${
              currentData.boxType === 'safe' ? 'border-emerald-500' : 'border-red-500'
            }`} 
            style={currentData.boxStyle}
          >
            <span 
              className={`absolute -top-7 left-0 text-[10px] text-white font-black px-2.5 py-1 rounded-lg shadow-md tracking-wider ${
                currentData.boxType === 'safe' ? 'bg-emerald-600' : 'bg-red-600'
              }`}
            >
              {currentData.boxTag}
            </span>
          </div>
        )}

        {/* Camera Overlay UI elements */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="text-[9px] bg-black/60 backdrop-blur-md text-white font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span> LIVE CAMERA
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="text-[9px] bg-black/60 backdrop-blur-md text-white font-mono px-2 py-1 rounded">ISO 400</span>
        </div>
      </div>

      {/* Choose presets to simulate scanning */}
      <div className="space-y-2.5">
        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Pilih Simulasi Objek Scan:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {Object.keys(presets).map((key) => (
            <button 
              key={key}
              onClick={() => handleSimulate(key)} 
              className={`p-3 border rounded-2xl transition-all-300 text-left flex items-center gap-2.5 cursor-pointer hover:shadow-xs active:scale-98 ${
                selectedPreset === key 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full ${
                presets[key].boxType === 'safe' ? 'bg-emerald-500' : 'bg-red-500'
              }`}></span> 
              <span className="text-xs font-bold">{presets[key].title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI HACCP Checklist & Analysis Outcome */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Hasil Audit AI HACCP</span>
          <span 
            id="haccp-score" 
            className={`text-xs font-black px-3 py-1 rounded-full border shadow-2xs ${
              currentData ? currentData.scoreClass : 'text-slate-400 bg-slate-100 border-slate-200'
            }`}
          >
            {currentData ? currentData.score : "--/100"}
          </span>
        </div>

        {/* Default Placeholder state */}
        {!currentData ? (
          <div id="haccp-placeholder-text" className="text-center py-8 text-slate-400 space-y-3">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 border border-slate-100">
              <i className="fa-solid fa-network-wired text-xl"></i>
            </div>
            <p className="text-xs font-semibold">Silakan pilih salah satu objek simulasi di atas untuk memulai analisis AI.</p>
          </div>
        ) : (
          /* Checklist Result details */
          <div id="haccp-result-details" className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-start gap-3">
              <div id="haccp-indicator-icon" className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mt-0.5 shrink-0 ${currentData.iconBg}`}>
                <i className={currentData.icon}></i>
              </div>
              <div className="flex-1">
                <h4 id="haccp-verdict-title" className="text-sm font-extrabold text-slate-800 leading-tight">{currentData.verdictTitle}</h4>
                <p id="haccp-verdict-desc" className="text-xs text-slate-500 mt-1 leading-relaxed">{currentData.verdictDesc}</p>
              </div>
            </div>

            {/* Detail Checklist Points */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Kategori Kontrol</span>
                <span id="haccp-category-span" className="font-bold text-slate-800">{currentData.category}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Suhu Aman (Serving Temp)</span>
                <span id="haccp-temp-span" className="font-bold text-slate-800">{currentData.temp}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Rekomendasi Wadah</span>
                <span id="haccp-packaging-span" className="font-bold text-slate-800">{currentData.packaging}</span>
              </div>
            </div>

            {/* AI Actionable advice block */}
            <div id="haccp-advice-box" className={`p-3.5 rounded-2xl text-xs space-y-1.5 shadow-2xs ${currentData.adviceClass}`}>
              <p className="font-extrabold">{currentData.adviceTitle}</p>
              <p className="leading-relaxed">{currentData.adviceText}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
