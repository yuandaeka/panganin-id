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
    <section id="screen-home" className="p-4 space-y-6 animate-[fadeIn_0.3s_ease-out] dark:text-slate-100 pb-20">
      {/* Greeting & Header with Location */}
      <div className="space-y-1.5 pt-1">
        <h2 className="font-serif-welcome text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
          Good <span className="text-brand-green font-medium italic">morning!</span>
        </h2>
        <div className="flex items-center text-xs text-slate-600 dark:text-slate-300 font-medium pt-0.5">
          <i className="fa-solid fa-location-dot text-brand-green mr-1.5 text-sm"></i>
          <span>{profileName} • {t('tagDapur')}</span>
          <i className="fa-solid fa-chevron-down ml-1.5 text-[10px] text-slate-400"></i>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1.5">
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/50">
            <i className="fa-solid fa-hotel mr-1"></i> {t('tagDapur')}
          </span>
          <span className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold px-2.5 py-1 rounded-full border border-amber-100 dark:border-amber-900/50">
            <i className="fa-solid fa-certificate mr-1"></i> {t('tagHaccp')}
          </span>
        </div>
      </div>

      {/* Hero News & Education Carousel (Interactive Swipeable Slider) */}
      <section className="relative z-0">
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
      </section>

      {/* Global Search Bar */}
      <section className="relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-full shadow-sm p-1.5 flex items-center border border-slate-200/80 dark:border-slate-700/80">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="flex-grow bg-transparent border-none focus:outline-none text-xs px-4 py-2 text-slate-700 dark:text-slate-200 placeholder-slate-400 font-medium"
          />
          <button className="bg-brand-green text-white p-3 rounded-full w-10 h-10 flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shrink-0 shadow-md">
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
          </button>
        </div>
      </section>

      {/* My Meal Plans Section (Reference layout with Panganify data) */}
      <section className="space-y-3">
        <div className="flex justify-between items-end">
          <h3 className="font-serif-welcome text-lg font-bold text-slate-900 dark:text-white">My meal plans</h3>
          <button
            onClick={() => handleFeatureClick('planner')}
            className="text-xs text-brand-green font-semibold hover:underline cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 rounded-3xl p-4 card-shadow flex gap-4 items-center">
          {/* Thumbnail */}
          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative bg-slate-100">
            <img
              alt={t('menuTodayName')}
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"
            />
          </div>

          {/* Info */}
          <div className="flex-grow min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 text-[10px] font-bold uppercase tracking-wide">
                <i className="fa-solid fa-mug-saucer text-[9px]"></i> Makan Siang
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                <i className="fa-solid fa-fire text-amber-500 text-[9px]"></i> 1,000 Porsi
              </span>
            </div>
            <h4 className="font-serif-welcome font-bold text-slate-900 dark:text-white text-base leading-tight truncate">
              {t('menuTodayName')}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 mb-1.5">
              Target: 11:30 WIB • HACCP Score: 98/100
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-brand-green font-semibold">
              <i className="fa-solid fa-truck-fast"></i>
              <span className="truncate">Dapur MBG Solo • Ready for Delivery</span>
            </div>
          </div>
        </div>

        {/* Quick Menu Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => handleFeatureClick('planner')}
            className="pressable bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/50 text-xs font-bold py-2.5 px-3 rounded-2xl transition-all-300 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <i className="fa-solid fa-calculator text-emerald-600 dark:text-emerald-400"></i> {t('btnAdjust')}
          </button>
          <button
            onClick={() => handleFeatureClick('haccp')}
            className="pressable bg-brand-green hover:opacity-95 text-white text-xs font-bold py-2.5 px-3 rounded-2xl transition-all-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <i className="fa-solid fa-camera"></i> {t('btnScan')}
          </button>
        </div>
      </section>

      {/* PANGANIFY Core Features Quick Access Grid (Layanan Utama Panganify) */}
      <div className="space-y-3 pt-2">
        <h3 className="font-serif-welcome text-base font-bold text-slate-900 dark:text-slate-100 tracking-wide">
          {t('layananUtama')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Nav Card 1: AI Portion Planner */}
          <button
            onClick={() => handleFeatureClick('planner')}
            className="pressable flex flex-col text-left p-3.5 bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 rounded-2xl card-shadow group cursor-pointer"
          >
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-200 dark:shadow-none mb-3 group-hover:scale-110 transition-all-300">
              <i className="fa-solid fa-calculator text-lg"></i>
            </div>
            <span className="font-display text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {t('cardPlannerTitle')}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{t('cardPlannerDesc')}</span>
          </button>

          {/* Nav Card 2: AI HACCP Scanner */}
          <button
            onClick={() => handleFeatureClick('haccp')}
            className="pressable flex flex-col text-left p-3.5 bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 rounded-2xl card-shadow group cursor-pointer"
          >
            <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-amber-200 dark:shadow-none mb-3 group-hover:scale-110 transition-all-300">
              <i className="fa-solid fa-camera-retro text-lg"></i>
            </div>
            <span className="font-display text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {t('cardHaccpTitle')}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{t('cardHaccpDesc')}</span>
          </button>

          {/* Nav Card 3: Blockchain Supply */}
          <button
            onClick={() => handleFeatureClick('blockchain')}
            className="pressable flex flex-col text-left p-3.5 bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 rounded-2xl card-shadow group cursor-pointer"
          >
            <div className="w-10 h-10 bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-200 dark:shadow-none mb-3 group-hover:scale-110 transition-all-300">
              <i className="fa-solid fa-cubes text-lg"></i>
            </div>
            <span className="font-display text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {t('cardLedgerTitle')}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{t('cardLedgerDesc')}</span>
          </button>

          {/* Nav Card 4: Waste to Value */}
          <button
            onClick={() => handleFeatureClick('waste')}
            className="pressable flex flex-col text-left p-3.5 bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 rounded-2xl card-shadow group cursor-pointer"
          >
            <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-teal-200 dark:shadow-none mb-3 group-hover:scale-110 transition-all-300">
              <i className="fa-solid fa-recycle text-lg"></i>
            </div>
            <span className="font-display text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {t('cardWasteTitle')}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{t('cardWasteDesc')}</span>
          </button>
        </div>

        {/* Nav Card 5: Emergency Food Supply (Centered below) */}
        <button
          onClick={() => handleFeatureClick('emergency')}
          className="pressable flex items-center gap-3 w-full p-3.5 bg-gradient-to-r from-red-600 to-red-500 dark:from-red-700 dark:to-red-600 text-white border border-red-600/20 rounded-2xl shadow-md shadow-red-200/60 dark:shadow-none group cursor-pointer"
        >
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-all-300">
            <i className="fa-solid fa-truck-ramp-box text-lg"></i>
          </div>
          <div className="flex-1 text-left">
            <span className="font-display text-xs font-bold leading-tight block">{t('cardEmergencyTitle')}</span>
            <span className="text-[10px] text-red-100 block">{t('cardEmergencyDesc')}</span>
          </div>
          <i className="fa-solid fa-chevron-right group-hover:translate-x-1 transition-all-300"></i>
        </button>
      </div>
    </section>
  );
}
