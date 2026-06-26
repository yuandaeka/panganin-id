import React from 'react';

export default function TopHeader({ onNotificationToggle, userInitials = "CA" }) {
  return (
    <header className="sticky top-3 z-40 bg-white/90 backdrop-blur-md border border-slate-100/80 rounded-2xl mx-4 mt-3.5 mb-1.5 shadow-md shadow-slate-100/60 transition-all-300 shrink-0">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
            <i className="fa-solid fa-leaf text-emerald-600 text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-emerald-800 flex items-center gap-1">
              PANGANIN <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">AI & BC</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">PANGAN AMAN & TERINTEGRASI</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onNotificationToggle} 
            className="relative p-2 text-slate-500 hover:text-emerald-600 transition-all-300 rounded-full hover:bg-slate-50 cursor-pointer"
            title="Notifikasi"
          >
            <i className="fa-solid fa-bell text-lg"></i>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs overflow-hidden shadow-sm">
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
}
