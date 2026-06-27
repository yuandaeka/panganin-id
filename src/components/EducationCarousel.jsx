import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ALL_ARTICLES } from '../data/articles';

export default function EducationCarousel({ onViewAll, onSelectArticle }) {
  const { t, language } = useLanguage();
  
  // We take the first 4 articles for the carousel
  const carouselArticles = ALL_ARTICLES.slice(0, 4);

  return (
    <div className="space-y-3">
      {/* Title Header with interactive stats and "Lebih Lanjut" Action Link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <h3 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">{t('feedTitle')}</h3>
        </div>
        <button 
          onClick={onViewAll} 
          className="text-[10.5px] font-black text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 hover:text-emerald-800 px-3 py-1 rounded-full border border-emerald-100/50 shadow-3xs cursor-pointer transition-all-300 active:scale-95 flex items-center gap-1"
        >
          {t('feedMore')} <i className="fa-solid fa-arrow-right text-[9px]"></i>
        </button>
      </div>
      
      {/* Horizontal scrolling news carousel displaying 4 items */}
      <div className="flex gap-4 overflow-x-auto pb-3 snap-x scroll-smooth no-scrollbar">
        {carouselArticles.map(slide => {
          const title = slide.title[language] || slide.title['id'];
          const desc = slide.desc[language] || slide.desc['id'];
          const tag = slide.tag[language] || slide.tag['id'];

          return (
            <div 
              key={slide.id} 
              onClick={() => onSelectArticle(slide)}
              className="flex-shrink-0 w-72 bg-white border border-slate-100 rounded-3xl p-3 snap-start shadow-sm hover:shadow-md transition-all-300 space-y-3 cursor-pointer group hover:border-emerald-100"
            >
              <div className="h-28 rounded-2xl overflow-hidden relative">
                <img src={slide.image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 inset-x-2 flex justify-between items-center">
                  <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm ${slide.tagColor}`}>
                    {tag}
                  </span>
                  <span className="bg-black/50 backdrop-blur-md text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold font-mono">
                    {slide.time}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-slate-800 leading-snug group-hover:text-emerald-800 transition-colors duration-300">
                  {title}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
