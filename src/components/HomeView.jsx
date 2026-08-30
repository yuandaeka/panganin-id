import React from 'react';
import EducationCarousel from './EducationCarousel';

export default function HomeView({ onSwitchTab }) {
  return (
    <section id="screen-home" className="p-4 space-y-5 animate-[fadeIn_0.3s_ease-out]">
      {/* Greeting & Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Hello Chef Amir!</h2>
        <p className="text-sm text-slate-500 font-medium">Ready to cook nutritious, safe, and clean meals today?</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
            <i className="fa-solid fa-hotel mr-1"></i> Dapur MBG Solo
          </span>
          <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-100">
            <i className="fa-solid fa-certificate mr-1"></i> HACCP Certified
          </span>
        </div>
      </div>

      {/* Hero News & Education Carousel */}
      <section className="relative z-0">
        <EducationCarousel onSelectArticle={() => onSwitchTab('news')} onViewAll={() => onSwitchTab('news')} />
      </section>

      {/* Global Search & Direct Query bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
        <input 
          type="text" 
          placeholder="Cari resep porsi besar, petani lokal, info gizi..." 
          className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all-300 h-12"
        />
      </div>

      {/* PANGANIFY Core Features Quick Access Grid */}
      <div>
        <h3 class="text-xs font-extrabold text-slate-400 tracking-wider uppercase mb-3">Layanan Utama Panganify</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Nav Card 1: AI Portion Planner */}
          <button 
            onClick={() => onSwitchTab('planner')} 
            className="flex flex-col text-left p-3.5 bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100/50 rounded-2xl transition-all-300 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-200 mb-3 group-hover:scale-110 transition-all-300">
              <i className="fa-solid fa-calculator text-lg"></i>
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">AI Portion Planner</span>
            <span className="text-[10px] text-slate-500 mt-1">Estimasi porsi & resep massal</span>
          </button>

          {/* Nav Card 2: AI HACCP Scanner */}
          <button 
            onClick={() => onSwitchTab('haccp')} 
            className="flex flex-col text-left p-3.5 bg-red-50/40 hover:bg-red-50 border border-red-100/50 rounded-2xl transition-all-300 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-red-200 mb-3 group-hover:scale-110 transition-all-300">
              <i className="fa-solid fa-camera-retro text-lg"></i>
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">AI HACCP Scanner</span>
            <span className="text-[10px] text-slate-500 mt-1">Audit kebersihan & wadah AI</span>
          </button>

          {/* Nav Card 3: Blockchain Supply */}
          <button 
            onClick={() => onSwitchTab('blockchain')} 
            className="flex flex-col text-left p-3.5 bg-amber-50/40 hover:bg-amber-50 border border-amber-100/50 rounded-2xl transition-all-300 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-amber-200 mb-3 group-hover:scale-110 transition-all-300">
              <i className="fa-solid fa-cubes text-lg"></i>
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">Blockchain Supply</span>
            <span className="text-[10px] text-slate-500 mt-1">Harga adil & rute tani lokal</span>
          </button>

          {/* Nav Card 4: Waste to Value */}
          <button 
            onClick={() => onSwitchTab('waste')} 
            className="flex flex-col text-left p-3.5 bg-blue-50/40 hover:bg-blue-50 border border-blue-100/50 rounded-2xl transition-all-300 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-200 mb-3 group-hover:scale-110 transition-all-300">
              <i className="fa-solid fa-recycle text-lg"></i>
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">Waste to Value</span>
            <span className="text-[10px] text-slate-500 mt-1">Distribusi pupuk & eco-enzyme</span>
          </button>
        </div>
      </div>

      {/* Today's MBG Menu & Quick Summary Section */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-4 shadow-xl shadow-emerald-900/10 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] bg-emerald-700/80 text-emerald-200 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Jadwal Menu Hari Ini
            </span>
            <h4 className="text-lg font-extrabold mt-1">Nasi Ayam Capcay & Apel</h4>
            <p className="text-[10px] text-emerald-300">
              <i className="fa-solid fa-clock mr-1"></i> Target Distribusi: 11:30 WIB (Makan Siang)
            </p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
            <i className="fa-solid fa-utensils text-emerald-200 text-lg"></i>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center bg-white/5 p-2.5 rounded-2xl border border-white/10">
          <div>
            <span className="text-[9px] text-emerald-300 block">Kebutuhan Porsi</span>
            <span className="text-sm font-bold block">1,000 porsi</span>
          </div>
          <div>
            <span className="text-[9px] text-emerald-300 block">Status Bahan</span>
            <span className="text-sm font-bold text-emerald-300 block flex items-center justify-center gap-1">
              <i className="fa-solid fa-circle-check text-[10px] mr-1"></i> Ready
            </span>
          </div>
          <div>
            <span className="text-[9px] text-emerald-300 block">Skor HACCP</span>
            <span className="text-sm font-bold text-emerald-300 block">98/100</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => onSwitchTab('planner')} 
            className="flex-1 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold py-2.5 px-4 rounded-xl transition-all-300 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <i className="fa-solid fa-calculator"></i> Sesuaikan Porsi
          </button>
          <button 
            onClick={() => onSwitchTab('haccp')} 
            className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-600 text-xs font-bold py-2.5 px-4 rounded-xl transition-all-300 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <i className="fa-solid fa-camera"></i> Mulai Scan HACCP
          </button>
        </div>
      </div>
    </section>
  );
}
