import React from 'react';
import EducationCarousel from './EducationCarousel';
import { useLanguage } from '../context/LanguageContext';

export default function HomeScreen({ onSwitchTab, onSelectArticle, profileName = "Chef Amir" }) {
  const { t } = useLanguage();

  // Translate internal screen switching to App-level setActivePage mapping
  const handleFeatureClick = (tab) => {
    if (tab === 'planner') onSwitchTab('portion');
    else if (tab === 'blockchain') onSwitchTab('ledger');
    else onSwitchTab(tab);
  };

  return (
    <section id="screen-home" className="p-4 space-y-5 animate-[fadeIn_0.3s_ease-out] dark:text-slate-100">
      {/* Greeting & Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{t('hello')} {profileName}!</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('greetingSub')}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/50">
            <i className="fa-solid fa-hotel mr-1"></i> {t('tagDapur')}
          </span>
          <span className="text-[10px] bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/50">
            <i className="fa-solid fa-certificate mr-1"></i> {t('tagHaccp')}
          </span>
        </div>
      </div>

      {/* Global Search & Direct Query bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
        <input 
          type="text" 
          placeholder={t('searchPlaceholder')}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl py-3.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-750 transition-all-300 h-12 dark:text-white"
        />
      </div>

      {/* PANGANIN Core Features Quick Access Grid */}
      <div>
        <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-3">{t('layananUtama')}</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Nav Card 1: AI Portion Planner */}
          <button 
            onClick={() => handleFeatureClick('planner')} 
            className="flex flex-col text-left p-3.5 bg-emerald-50/60 hover:bg-emerald-50 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl transition-all-300 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-200 dark:shadow-none mb-3 group-hover:scale-110 transition-all-300">
              <i className="fa-solid fa-calculator text-lg"></i>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{t('cardPlannerTitle')}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{t('cardPlannerDesc')}</span>
          </button>

          {/* Nav Card 2: AI HACCP Scanner */}
          <button 
            onClick={() => handleFeatureClick('haccp')} 
            className="flex flex-col text-left p-3.5 bg-red-50/40 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100/50 dark:border-red-900/30 rounded-2xl transition-all-300 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-red-200 dark:shadow-none mb-3 group-hover:scale-110 transition-all-300">
              <i className="fa-solid fa-camera-retro text-lg"></i>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{t('cardHaccpTitle')}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{t('cardHaccpDesc')}</span>
          </button>

          {/* Nav Card 3: Blockchain Supply */}
          <button 
            onClick={() => handleFeatureClick('blockchain')} 
            className="flex flex-col text-left p-3.5 bg-amber-50/40 hover:bg-amber-50 dark:bg-amber-950/10 dark:hover:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30 rounded-2xl transition-all-300 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-amber-200 dark:shadow-none mb-3 group-hover:scale-110 transition-all-300">
              <i className="fa-solid fa-cubes text-lg"></i>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{t('cardLedgerTitle')}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{t('cardLedgerDesc')}</span>
          </button>

          {/* Nav Card 4: Waste to Value */}
          <button 
            onClick={() => handleFeatureClick('waste')} 
            className="flex flex-col text-left p-3.5 bg-blue-50/40 hover:bg-blue-50 dark:bg-blue-950/10 dark:hover:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 rounded-2xl transition-all-300 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-200 dark:shadow-none mb-3 group-hover:scale-110 transition-all-300">
              <i className="fa-solid fa-recycle text-lg"></i>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{t('cardWasteTitle')}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{t('cardWasteDesc')}</span>
          </button>
        </div>

        {/* Nav Card 5: Emergency Food Supply (Centered below) */}
        <div className="flex justify-center mt-3">
          <button 
            onClick={() => handleFeatureClick('emergency')} 
            className="flex items-center gap-3 w-full p-3.5 bg-red-50/60 hover:bg-red-50 dark:bg-red-950/15 dark:hover:bg-red-950/25 border border-red-200/60 dark:border-red-900/40 rounded-2xl transition-all-300 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-red-200 dark:shadow-none shrink-0 group-hover:scale-110 transition-all-300 relative">
              <i className="fa-solid fa-truck-ramp-box text-lg"></i>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-ping"></span>
            </div>
            <div className="flex-1 text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight block">{t('cardEmergencyTitle')}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{t('cardEmergencyDesc')}</span>
            </div>
            <i className="fa-solid fa-chevron-right text-slate-400 group-hover:translate-x-1 transition-all-300"></i>
          </button>
        </div>
      </div>

      {/* Today's MBG Menu & Quick Summary Section */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-4 shadow-xl shadow-emerald-900/10 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] bg-emerald-700/80 text-emerald-200 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {t('menuTodayTitle')}
            </span>
            <h4 className="text-lg font-extrabold mt-1">{t('menuTodayName')}</h4>
            <p className="text-[10px] text-emerald-300">
              <i className="fa-solid fa-clock mr-1"></i> {t('menuTodayTime')}
            </p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
            <i className="fa-solid fa-utensils text-emerald-200 text-lg"></i>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center bg-white/5 p-2.5 rounded-2xl border border-white/10">
          <div>
            <span className="text-[9px] text-emerald-300 block">{t('statsPortion')}</span>
            <span className="text-sm font-bold block">1,000 porsi</span>
          </div>
          <div>
            <span className="text-[9px] text-emerald-300 block">{t('statsStatus')}</span>
            <span className="text-sm font-bold text-emerald-300 block flex items-center justify-center gap-1">
              <i className="fa-solid fa-circle-check text-[10px] mr-1"></i> Ready
            </span>
          </div>
          <div>
            <span className="text-[9px] text-emerald-300 block">{t('statsHaccp')}</span>
            <span className="text-sm font-bold text-emerald-300 block">98/100</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => handleFeatureClick('planner')} 
            className="flex-1 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold py-2.5 px-4 rounded-xl transition-all-300 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <i className="fa-solid fa-calculator"></i> {t('btnAdjust')}
          </button>
          <button 
            onClick={() => handleFeatureClick('haccp')} 
            className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-600 text-xs font-bold py-2.5 px-4 rounded-xl transition-all-300 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <i className="fa-solid fa-camera"></i> {t('btnScan')}
          </button>
        </div>
      </div>

      {/* Global Nutrition News & Global Cooking Tips (Edukasi Global) - Placed at the very bottom of home screen */}
      <div className="pt-2">
        <EducationCarousel 
          onViewAll={() => {
            if (onSelectArticle) onSelectArticle(null);
            onSwitchTab('news');
          }}
          onSelectArticle={(article) => {
            if (onSelectArticle) onSelectArticle(article);
            onSwitchTab('news');
          }}
        />
      </div>
    </section>
  );
}
