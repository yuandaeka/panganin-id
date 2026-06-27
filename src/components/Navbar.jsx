import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ activePage, setActivePage }) {
  const { t } = useLanguage();
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 text-white border-t border-slate-800 px-6 py-3 rounded-t-3xl flex justify-between items-center z-50 shadow-2xl">
      {/* Nav Item: Home */}
      <button 
        onClick={() => setActivePage('home')} 
        id="nav-btn-home" 
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all-300 ${
          activePage === 'home' ? 'text-emerald-500' : 'text-slate-400 hover:text-white'
        }`}
      >
        <i className="fa-solid fa-house text-lg"></i>
        <span className="text-[9px] font-bold">{t('navHome')}</span>
      </button>

      {/* Nav Item: Portion Planner */}
      <button 
        onClick={() => setActivePage('portion')} 
        id="nav-btn-planner" 
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all-300 ${
          activePage === 'portion' ? 'text-emerald-500' : 'text-slate-400 hover:text-white'
        }`}
      >
        <i className="fa-solid fa-calculator text-lg"></i>
        <span className="text-[9px] font-bold">{t('navPlanner')}</span>
      </button>

      {/* Centered Floating AI Assistant FAB Button */}
      <button 
        onClick={() => setActivePage('chatbot')} 
        className={`w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center -mt-8 shadow-lg shadow-emerald-700/30 transition-all-300 hover:scale-105 active:scale-95 border-4 border-slate-900 relative cursor-pointer ${
          activePage === 'chatbot' ? 'ring-2 ring-emerald-400' : ''
        }`}
        title="Tanya Asisten AI"
      >
        <i className="fa-solid fa-robot text-xl"></i>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-emerald-600 animate-pulse"></span>
      </button>

      {/* Nav Item: HACCP AI */}
      <button 
        onClick={() => setActivePage('haccp')} 
        id="nav-btn-haccp" 
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all-300 ${
          activePage === 'haccp' ? 'text-emerald-500' : 'text-slate-400 hover:text-white'
        }`}
      >
        <i className="fa-solid fa-camera-retro text-lg"></i>
        <span className="text-[9px] font-bold">{t('navHaccp')}</span>
      </button>

      {/* Nav Item: Ledger BC */}
      <button 
        onClick={() => setActivePage('ledger')} 
        id="nav-btn-blockchain" 
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all-300 ${
          activePage === 'ledger' ? 'text-emerald-500' : 'text-slate-400 hover:text-white'
        }`}
      >
        <i className="fa-solid fa-link text-lg"></i>
        <span className="text-[9px] font-bold">{t('navLedger')}</span>
      </button>
    </nav>
  );
}
