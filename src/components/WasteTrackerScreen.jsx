import React, { useState } from 'react';

// Recommended waste processors database based on waste type
const RECOMMENDATIONS = {
  organik: [
    {
      id: 'eco-enzym',
      name: "CV EcoEnzym Mandiri Surakarta",
      desc: "Diolah menjadi cairan fermentasi eco-enzyme multiguna.",
      distance: "2.4 Km",
      dealType: "buy",
      priceLabel: "Membeli (Rp 2.000 / Kg)",
      pricePerKg: 2000,
      icon: "fa-leaf",
      iconBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
      btnStyle: { top: '25%', left: '20%' }
    },
    {
      id: 'kompos-laweyan',
      name: "Rumah Kompos Komunitas Solo",
      desc: "Diproses menjadi pupuk kompos organik untuk kelompok tani.",
      distance: "4.1 Km",
      dealType: "free",
      priceLabel: "Menerima Gratis (Donasi)",
      pricePerKg: 0,
      icon: "fa-recycle",
      iconBg: "bg-blue-100 text-blue-800 border-blue-200",
      btnStyle: { top: '70%', left: '35%' }
    },
    {
      id: 'maggot-bsf',
      name: "Pusat Budidaya Maggot BSF Laweyan",
      desc: "Pakan organik tinggi nutrisi untuk pembesaran larva lalat BSF.",
      distance: "6.8 Km",
      dealType: "buy",
      priceLabel: "Membeli (Rp 1.200 / Kg)",
      pricePerKg: 1200,
      icon: "fa-bug",
      iconBg: "bg-amber-100 text-amber-800 border-amber-200",
      btnStyle: { top: '48%', left: '75%' }
    }
  ],
  sisa: [
    {
      id: 'ternak-unggas',
      name: "Peternakan Unggas Mandiri Karanganyar",
      desc: "Diolah kembali dengan aman menjadi konsentrat pakan bebek.",
      distance: "8.5 Km",
      dealType: "buy",
      priceLabel: "Membeli (Rp 1.500 / Kg)",
      pricePerKg: 1500,
      icon: "fa-crow",
      iconBg: "bg-amber-100 text-amber-800 border-amber-200",
      btnStyle: { top: '20%', left: '70%' }
    },
    {
      id: 'biogas-utara',
      name: "Mitra Biogas Komunitas Solo Utara",
      desc: "Sumber biomassa basah untuk pembangkit gas masak komunal.",
      distance: "5.2 Km",
      dealType: "free",
      priceLabel: "Menerima Gratis (Energi)",
      pricePerKg: 0,
      icon: "fa-fire",
      iconBg: "bg-red-100 text-red-800 border-red-200",
      btnStyle: { top: '65%', left: '25%' }
    },
    {
      id: 'foodbank-solo',
      name: "Yayasan Food Bank Solo Raya",
      desc: "Penyaluran sisa layak konsumsi untuk pakan ternak panti sosial.",
      distance: "3.0 Km",
      dealType: "free",
      priceLabel: "Menerima Gratis (Pakan)",
      pricePerKg: 0,
      icon: "fa-hand-holding-heart",
      iconBg: "bg-purple-100 text-purple-800 border-purple-200",
      btnStyle: { top: '45%', left: '48%' }
    }
  ]
};

export default function WasteTrackerScreen({ 
  onBackToHome, 
  onSubmitWaste, 
  totalWeight = 325, 
  totalPoints = 4500 
}) {
  const [weight, setWeight] = useState('');
  const [wasteType, setWasteType] = useState('organik');
  const [isSearching, setIsSearching] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const weightVal = parseFloat(weight);
    if (isNaN(weightVal) || weightVal <= 0) {
      alert("Silakan masukkan berat limbah yang valid!");
      return;
    }

    setIsSearching(true);
    setSelectedPartnerId(null);
    setTimeout(() => {
      setIsSearching(false);
      setShowRecommendations(true);
    }, 1200);
  };

  const handleSelectPartner = (partner) => {
    setSelectedPartnerId(partner.id);
  };

  const handleConfirmDistribution = (partner) => {
    const weightVal = parseFloat(weight);
    let finalPartnerName = partner.name;
    
    if (partner.dealType === 'buy') {
      const payout = partner.pricePerKg * weightVal;
      finalPartnerName = `${partner.name} (${partner.distance}) • Terjual Rp ${payout.toLocaleString()}`;
    } else {
      finalPartnerName = `${partner.name} (${partner.distance}) • Donasi Gratis`;
    }

    onSubmitWaste(weightVal, wasteType, finalPartnerName);
  };

  // Get active recommendations based on input waste type
  const activePartners = RECOMMENDATIONS[wasteType] || [];

  return (
    <section id="screen-waste" className="p-4 space-y-5 animate-[fadeIn_0.3s_ease-out]">
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
          <h2 className="text-xl font-extrabold text-slate-800 leading-tight">Circular Economy Waste Matchmaker</h2>
          <p className="text-xs text-slate-500">Salurkan limbah pangan secara presisi ke pengolah terverifikasi</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSearch} className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-4">
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">1. Input Limbah yang Tersedia</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-extrabold block">Berat Limbah (Kg)</label>
            <input 
              type="number" 
              id="waste-weight-input" 
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                // Reset recommendations if input changes
                setShowRecommendations(false);
              }}
              placeholder="Misal: 25" 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 h-12"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-extrabold block">Jenis Limbah</label>
            <select 
              id="waste-type-select" 
              value={wasteType}
              onChange={(e) => {
                setWasteType(e.target.value);
                // Reset recommendations if input changes
                setShowRecommendations(false);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-605 h-12 cursor-pointer"
            >
              <option value="organik">Sayuran & Buah Sisa (Eco-Enzyme/Kompos)</option>
              <option value="sisa">Makanan Matang Sisa (Pakan Ternak/Biogas)</option>
            </select>
          </div>
        </div>

        {/* Action Button: Cari Rekomendasi Pengelola */}
        <button 
          type="submit" 
          disabled={isSearching}
          className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-800/60 text-white text-xs font-bold h-12 rounded-2xl transition-all-300 shadow-md shadow-emerald-700/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
        >
          {isSearching ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Mencari Pengolah Terdekat...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-magnifying-glass-location"></i>
              <span>Cari Rekomendasi Pengelola</span>
            </>
          )}
        </button>
      </form>

      {/* INTERACTIVE RECOMMENDATION AND MAP SECTION */}
      {showRecommendations && (
        <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
          
          {/* Mock Map Library Component */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-extrabold text-slate-405 tracking-wider uppercase flex items-center gap-1">
                <i className="fa-solid fa-map-location-dot"></i> Radar Penyaluran Limbah (Surakarta)
              </h3>
              <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full border border-slate-200">
                Akurasi GPS Tinggi
              </span>
            </div>
            
            <div className="relative bg-slate-900 rounded-3xl h-52 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Interactive Grid Lines Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-35"></div>
              
              {/* Mock Roads Network SVG */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                <path d="M10,90 Q90,50 180,100 T350,80" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeDasharray="5 3" />
                <path d="M60,10 Q140,110 220,160 T410,130" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeDasharray="5 3" />
                <path d="M30,170 Q160,120 390,190" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeDasharray="5 3" />
              </svg>

              {/* Center Pin: Dapur MBG Solo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
                <span className="absolute animate-ping inline-flex h-8 w-8 rounded-full bg-emerald-450 opacity-40"></span>
                <div className="w-5 h-5 bg-emerald-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg relative">
                  <i className="fa-solid fa-utensils text-[9px] text-white"></i>
                </div>
                <span className="bg-emerald-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-md mt-1 shrink-0 select-none whitespace-nowrap">
                  Dapur Solo (Anda)
                </span>
              </div>

              {/* Connected Lines to Partners pins */}
              <svg className="absolute inset-0 w-full h-full opacity-50 pointer-events-none">
                {activePartners.map(p => {
                  const leftPercent = parseInt(p.btnStyle.left);
                  const topPercent = parseInt(p.btnStyle.top);
                  return (
                    <line 
                      key={`line-${p.id}`}
                      x1="50%" 
                      y1="50%" 
                      x2={`${leftPercent}%`} 
                      y2={`${topPercent}%`} 
                      stroke={selectedPartnerId === p.id ? "#f59e0b" : "#059669"} 
                      strokeWidth={selectedPartnerId === p.id ? "2.5" : "1.5"}
                      strokeDasharray="3 3"
                    />
                  );
                })}
              </svg>

              {/* Dynamic Partner Location Pins */}
              {activePartners.map(p => (
                <button
                  key={`pin-${p.id}`}
                  onClick={() => handleSelectPartner(p)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 transition-all duration-300 hover:scale-110 cursor-pointer`}
                  style={p.btnStyle}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-md transition-colors duration-300 ${
                    selectedPartnerId === p.id
                      ? 'bg-amber-500 border-white text-white ring-4 ring-amber-500/30'
                      : 'bg-slate-800 border-emerald-500 text-emerald-400'
                  }`}>
                    <i className={`fa-solid ${p.icon} text-xs`}></i>
                  </div>
                  <span className={`text-[7px] font-bold px-1 py-0.5 rounded mt-0.5 whitespace-nowrap ${
                    selectedPartnerId === p.id 
                      ? 'bg-amber-500 text-white shadow-sm' 
                      : 'bg-slate-950/85 text-emerald-300'
                  }`}>
                    {p.distance}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recommendations List Container */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-405 tracking-wider uppercase px-1">
              2. Hasil Pencocokan Mitra Terdekat
            </h3>
            
            <div className="space-y-2.5">
              {activePartners.map(partner => (
                <div
                  key={partner.id}
                  onClick={() => handleSelectPartner(partner)}
                  className={`bg-white border rounded-3xl p-3.5 flex flex-col gap-3 shadow-3xs transition-all duration-300 cursor-pointer ${
                    selectedPartnerId === partner.id
                      ? 'border-amber-400 bg-amber-50/20 ring-1 ring-amber-300 shadow-sm'
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center text-sm shadow-3xs shrink-0 ${partner.iconBg}`}>
                        <i className={`fa-solid ${partner.icon}`}></i>
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{partner.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5 leading-snug">{partner.desc}</p>
                      </div>
                    </div>
                    
                    {/* Deal Badge (Price / Free) */}
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border shadow-3xs shrink-0 ${
                      partner.dealType === 'buy'
                        ? 'bg-amber-100 border-amber-250 text-amber-900'
                        : 'bg-emerald-50 border-emerald-150 text-emerald-800'
                    }`}>
                      {partner.priceLabel}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-450 border-t border-slate-100/70 pt-2.5 font-bold">
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-route text-slate-400"></i> Jarak Logistik: {partner.distance}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[9px] text-slate-400">
                      ID PENERIMA: #RC-{partner.id.toUpperCase().substring(0, 5)}
                    </span>
                  </div>

                  {/* Submit Button Inside Focused Partner */}
                  {selectedPartnerId === partner.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmDistribution(partner);
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-11 rounded-xl transition-all-300 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer active:scale-98 animate-[fadeIn_0.2s_ease-out]"
                    >
                      <i className="fa-solid fa-paper-plane"></i>
                      <span>Konfirmasi Penyaluran ke Mitra Ini</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sirkular impact stats */}
      <div className="bg-blue-50/50 rounded-3xl p-4 border border-blue-100/50 space-y-3 shadow-2xs">
        <h4 className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
          <i className="fa-solid fa-circle-nodes"></i> Dampak Ekonomi Sirkular Anda
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
          <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-3xs">
            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">TOTAL DISALURKAN</span>
            <span id="circular-total-weight" className="text-lg font-black text-blue-700">{totalWeight} Kg</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-3xs">
            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">ECO-REWARDS POIN</span>
            <span id="circular-total-points" className="text-lg font-black text-amber-600">{totalPoints.toLocaleString()} Poin</span>
          </div>
        </div>
      </div>
    </section>
  );
}
