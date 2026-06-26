import React, { useState, useEffect } from 'react';

export default function PortionPlanner({ onBackToHome, onConnectFarmers }) {
  const [dish, setDish] = useState('capcay');
  const [customDishText, setCustomDishText] = useState('Nasi Rendang Sapi & Melon');
  const [portionCount, setPortionCount] = useState(500);
  const [budgetOptimizer, setBudgetOptimizer] = useState(true);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [totalPrice, setTotalPrice] = useState(7500000);

  // Run generation simulation when parameters change
  useEffect(() => {
    setIsGenerating(true);
    const timer = setTimeout(() => {
      calculateIngredients();
      setIsGenerating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [dish, customDishText, portionCount, budgetOptimizer]);

  const calculateIngredients = () => {
    let list = [];
    let pricePerPortion = budgetOptimizer ? 12000 : 15000;

    if (dish === 'capcay') {
      list = [
        { name: 'Beras Lokal (Boyolali)', weight: 0.1 * portionCount, unit: 'Kg', icon: 'wheat-awn' },
        { name: 'Daging Ayam Karanganyar', weight: 0.08 * portionCount, unit: 'Kg', icon: 'egg' },
        { name: 'Bawang Merah & Putih Petani', weight: 0.015 * portionCount, unit: 'Kg', icon: 'pepper-hot' },
        { name: 'Wortel & Sayuran Hijau Segar', weight: 0.12 * portionCount, unit: 'Kg', icon: 'seedling' },
        { name: 'Apel Malang Grade B (Surplus)', weight: 1 * portionCount, unit: 'Pcs', icon: 'apple-whole' },
      ];
    } else if (dish === 'taco') {
      list = [
        { name: 'Daging Karkas Ayam Potong', weight: 0.1 * portionCount, unit: 'Kg', icon: 'egg' },
        { name: 'Selada & Kubis Organik', weight: 0.15 * portionCount, unit: 'Kg', icon: 'seedling' },
        { name: 'Minyak Kelapa Sawit Curah', weight: 0.02 * portionCount, unit: 'Liter', icon: 'droplet' },
        { name: 'Jeruk Manis Karanganyar', weight: 1 * portionCount, unit: 'Pcs', icon: 'lemon' },
      ];
    } else if (dish === 'seblak') {
      list = [
        { name: 'Bihun Jagung Sehat', weight: 0.08 * portionCount, unit: 'Kg', icon: 'wheat-awn' },
        { name: 'Suwiran Daging Ayam', weight: 0.06 * portionCount, unit: 'Kg', icon: 'egg' },
        { name: 'Bawang Putih, Kunyit & Rempah', weight: 0.02 * portionCount, unit: 'Kg', icon: 'leaf' },
        { name: 'Pisang Mas Solo Raya', weight: 1 * portionCount, unit: 'Pcs', icon: 'apple-whole' },
      ];
    } else if (dish === 'custom') {
      const lowerCustom = customDishText.toLowerCase();
      let mainProtein = "Protein Utama Pilihan AI";
      let proteinIcon = "egg";
      let mainCarb = "Karbohidrat Pokok Pilihan AI";
      let carbIcon = "wheat-awn";
      let mainVeg = "Sayuran & Bumbu Pelengkap AI";
      let vegIcon = "seedling";
      let mainFruit = "Buah Gizi Pendamping AI";
      let fruitIcon = "apple-whole";

      if (lowerCustom.includes("rendang") || lowerCustom.includes("sapi") || lowerCustom.includes("daging")) {
        mainProtein = "Daging Sapi Lokal (Boyolali)";
        proteinIcon = "cow";
        mainCarb = "Beras Organik Sragen";
        mainVeg = "Rempah Rendang & Santan Kelapa";
        vegIcon = "pepper-hot";
      } else if (lowerCustom.includes("ikan") || lowerCustom.includes("lele") || lowerCustom.includes("nila")) {
        mainProtein = "Ikan Segar Budidaya Mina Tani";
        proteinIcon = "fish";
        mainCarb = "Nasi Putih Premium";
      } else if (lowerCustom.includes("goreng") || lowerCustom.includes("mie") || lowerCustom.includes("nasi")) {
        mainCarb = "Beras/Mie Telur Pilihan";
        mainProtein = "Telur & Suwiran Ayam";
      }

      if (lowerCustom.includes("pisang")) {
        mainFruit = "Pisang Mas Solo Raya";
      } else if (lowerCustom.includes("semangka")) {
        mainFruit = "Semangka Merah Segar";
      } else if (lowerCustom.includes("jeruk")) {
        mainFruit = "Jeruk Manis Karanganyar";
        fruitIcon = "lemon";
      } else if (lowerCustom.includes("melon")) {
        mainFruit = "Melon Madu Grade A";
      }

      list = [
        { name: mainCarb, weight: 0.09 * portionCount, unit: 'Kg', icon: carbIcon },
        { name: mainProtein, weight: 0.07 * portionCount, unit: 'Kg', icon: proteinIcon },
        { name: mainVeg, weight: 0.11 * portionCount, unit: 'Kg', icon: vegIcon },
        { name: mainFruit, weight: 1 * portionCount, unit: 'Pcs', icon: fruitIcon }
      ];
    }

    setIngredients(list);
    setTotalPrice(pricePerPortion * portionCount);
  };

  return (
    <section id="screen-planner" className="p-4 space-y-5 animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onBackToHome} 
          className="p-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-full transition-all-300 cursor-pointer"
          title="Kembali ke Beranda"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 leading-tight">AI Portion & Recipe Planner</h2>
          <p className="text-xs text-slate-500">Hitung presisi bahan, nilai gizi, & minimalisasi food-waste</p>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">1. Pilih Hidangan Utama</label>
          <select 
            id="planner-dish-select" 
            value={dish}
            onChange={(e) => setDish(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all-300 cursor-pointer"
          >
            <option value="capcay">Nasi Ayam Capcay & Apel (Standar Gizi MBG)</option>
            <option value="taco">Chicken Salad Bowl & Jeruk (Diet Sehat / Pekerja)</option>
            <option value="seblak">Soto Ayam Padat Nutrisi & Pisang (Massal / Hajatan)</option>
            <option value="custom">✍️ Tulis Hidangan Sendiri (Input Manual)...</option>
          </select>

          {/* Manual Input Field (Shown based on selection) - Task 2.1 & 2.2 */}
          <div 
            id="custom-dish-input-container" 
            className={`transition-all duration-300 ${dish === 'custom' ? 'block' : 'hidden'}`}
          >
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mt-2">Tulis Hidangan Pilihan Anda</label>
            <input 
              type="text" 
              id="planner-custom-dish" 
              value={customDishText}
              onChange={(e) => setCustomDishText(e.target.value)}
              placeholder="Ketik resep kustom (misal: Nasi Rendang Daging & Melon)..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all-300"
            />
          </div>
        </div>

        {/* Portion Slider - Task 3.2 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">2. Tentukan Jumlah Porsi</label>
            <span id="portion-value-display" className="text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              {portionCount.toLocaleString()} Porsi
            </span>
          </div>
          <input 
            type="range" 
            id="portion-range" 
            min="10" 
            max="2000" 
            value={portionCount} 
            step="10" 
            onChange={(e) => setPortionCount(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>10 Porsi</span>
            <span>1,000 Porsi</span>
            <span>2,000 Porsi</span>
          </div>
        </div>

        {/* Budget Optimizer Switch */}
        <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/30">
          <div className="flex gap-2 items-center">
            <i className="fa-solid fa-coins text-emerald-600 text-sm"></i>
            <div>
              <p className="text-xs font-bold text-slate-800">Optimasi Anggaran AI</p>
              <p className="text-[9px] text-slate-500">Rekomendasikan bahan pangan lokal termurah</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              id="budget-toggle" 
              checked={budgetOptimizer}
              onChange={(e) => setBudgetOptimizer(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>

      {/* Interactive Outputs Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">Estimasi Kebutuhan Bahan Baku</h3>
          
          {/* AI Generated Badge (Pulsing Effect) - Task 2.3 */}
          <div className="flex items-center gap-1.5" id="ai-badge-status">
            {isGenerating ? (
              <span className="bg-amber-100 text-amber-800 text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                <i className="fa-solid fa-wand-magic-sparkles text-amber-600"></i> AI Generating...
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                <i className="fa-solid fa-wand-magic-sparkles text-emerald-600"></i> ✨ AI Generated
              </span>
            )}
            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1"><i className="fa-solid fa-shield-halved"></i> Gizi Seimbang</span>
          </div>
        </div>

        {/* Dynamic Ingredients Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-3">
          <div id="ingredients-container" className="space-y-2.5">
            {ingredients.map((ing, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs hover:bg-slate-100/50 transition-all-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center">
                    <i className={`fa-solid fa-${ing.icon}`}></i>
                  </div>
                  <span className="font-bold text-slate-800">{ing.name}</span>
                </div>
                <span className="font-extrabold text-slate-550 bg-white border border-slate-100 px-2 py-1 rounded-xl shadow-3xs">
                  {ing.weight.toLocaleString(undefined, {maximumFractionDigits: 1})} {ing.unit}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
            <div>
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">ESTIMASI TOTAL BIAYA</span>
              <span id="total-price-display" className="text-base font-extrabold text-emerald-800 flex items-center gap-1">
                Rp {totalPrice.toLocaleString()} 
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-full"><i className="fa-solid fa-link"></i> BC Verified</span>
              </span>
            </div>
            
            {/* Thumb Zone Button (h-12 or h-14) - Fix 1.3 */}
            <button 
              onClick={onConnectFarmers} 
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 h-12 rounded-2xl transition-all-300 flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
            >
              <i className="fa-solid fa-cart-shopping"></i> Hubungkan Petani Lokal
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
