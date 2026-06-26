import React, { useState } from 'react';

export default function WasteTracker({ 
  onBackToHome, 
  onSubmitWaste, 
  totalWeight = 325, 
  totalPoints = 4500 
}) {
  const [weight, setWeight] = useState('');
  const [wasteType, setWasteType] = useState('organik');
  const [partner, setPartner] = useState('eco');

  const partnerOptions = {
    eco: "CV EcoEnzym Mandiri (Pupuk Organik)",
    kompos: "Rumah Kompos Komunitas Solo"
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const weightVal = parseFloat(weight);
    if (isNaN(weightVal) || weightVal <= 0) {
      alert("Silakan masukkan berat limbah yang valid!");
      return;
    }

    const partnerName = partnerOptions[partner];
    onSubmitWaste(weightVal, wasteType, partnerName);
    setWeight(''); // Reset input
  };

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
          <h2 className="text-xl font-extrabold text-slate-800 leading-tight">Circular Economy Waste Tracker</h2>
          <p className="text-xs text-slate-500">Salurkan limbah pangan, raih bonus insentif hijau</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleFormSubmit} className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-4">
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Catat Sisa Limbah Dapur</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-extrabold block">Berat Limbah (Kg)</label>
            <input 
              type="number" 
              id="waste-weight-input" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
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
              onChange={(e) => setWasteType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-650 h-12 cursor-pointer"
            >
              <option value="organik">Sayuran & Buah Sisa</option>
              <option value="sisa">Makanan Matang Sisa</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-500 font-extrabold block">Mitra Penerima Pengolahan</label>
          <select 
            id="waste-partner-select" 
            value={partner}
            onChange={(e) => setPartner(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-650 h-12 cursor-pointer"
          >
            <option value="eco">{partnerOptions.eco}</option>
            <option value="kompos">{partnerOptions.kompos}</option>
          </select>
        </div>

        {/* Thumb Zone Button (h-12 or h-14) - Fix 1.3 */}
        <button 
          type="submit" 
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold h-12 rounded-2xl transition-all-300 shadow-md shadow-emerald-700/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
        >
          <i className="fa-solid fa-share-nodes"></i> Kirim & Daftarkan di Blockchain
        </button>
      </form>

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
