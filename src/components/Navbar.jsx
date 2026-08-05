import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ activePage, setActivePage }) {
  const { t } = useLanguage();
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-xl text-slate-600 border-t border-slate-200/70 px-6 pt-2 pb-4 rounded-t-3xl flex justify-between items-end z-50 card-shadow">
      {/* Nav Item: Home */}
      <button 
        onClick={() => setActivePage('home')} 
        id="nav-btn-home" 
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all-300 py-1 px-2 rounded-xl ${
          activePage === 'home' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <i className={`fa-solid ${activePage === 'home' ? 'fa-house' : 'fa-house'} text-lg transition-transform duration-300 ${activePage === 'home' ? '-translate-y-0.5 scale-110' : ''}`}></i>
        <span className="text-[9px] font-bold">{t('navHome')}</span>
      </button>

      {/* Nav Item: Portion Planner */}
      <button 
        onClick={() => setActivePage('portion')} 
        id="nav-btn-planner" 
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all-300 py-1 px-2 rounded-xl ${
          activePage === 'portion' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <i className="fa-solid fa-calculator text-lg"></i>
        <span className="text-[9px] font-bold">{t('navPlanner')}</span>
      </button>

      {/* Centered Floating AI Assistant FAB Button */}
      <button 
        onClick={() => setActivePage('chatbot')} 
        className={`w-13 h-13 bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-2xl flex items-center justify-center -mt-9 shadow-lg shadow-emerald-800/30 transition-all-300 hover:scale-105 active:scale-95 border-4 border-white dark:border-slate-900 relative cursor-pointer pressable ${
          activePage === 'chatbot' ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : ''
        }`}
        title="Asisten Panganan Pintar"
      >
        <i className="fa-solid fa-robot text-xl"></i>
      </button>

      {/* Nav Item: HACCP AI */}
      <button 
        onClick={() => setActivePage('haccp')} 
        id="nav-btn-haccp" 
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all-300 py-1 px-2 rounded-xl ${
          activePage === 'haccp' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <i className="fa-solid fa-camera-retro text-lg"></i>
        <span className="text-[9px] font-bold">{t('navHaccp')}</span>
      </button>

      {/* Nav Item: Ledger BC */}
      <button 
        onClick={() => setActivePage('ledger')} 
        id="nav-btn-blockchain" 
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all-300 py-1 px-2 rounded-xl ${
          activePage === 'ledger' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <i className="fa-solid fa-link text-lg"></i>
        <span className="text-[9px] font-bold">{t('navLedger')}</span>
      </button>
    </nav>
  );
}
