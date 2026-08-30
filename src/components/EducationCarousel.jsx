import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ALL_ARTICLES } from '../data/articles';

export default function EducationCarousel({ onViewAll, onSelectArticle }) {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Touch swipe handling
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 40;

  // Carousel articles
  const carouselArticles = ALL_ARTICLES.slice(0, 5);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || carouselArticles.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselArticles.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, carouselArticles.length]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? carouselArticles.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % carouselArticles.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) {
      // Swiped left -> Next
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> Prev
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeArticle = carouselArticles[currentIndex] || carouselArticles[0];
  const activeTitle = activeArticle.title[language] || activeArticle.title['id'];
  const activeDesc = activeArticle.desc[language] || activeArticle.desc['id'];
  const activeTag = activeArticle.tag[language] || activeArticle.tag['id'];

  return (
    <div className="space-y-2.5">
      {/* Header bar with Live badge & View All */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <h3 className="font-serif-welcome text-sm font-bold text-slate-800 dark:text-white">
            {language === 'en' ? "Education & Food News" : "Edukasi & Berita Pangan"}
          </h3>
        </div>
        <button 
          onClick={onViewAll} 
          className="text-[11px] font-bold text-brand-green dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1 transition-all-300"
        >
          {t('feedMore')} <i className="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>

      {/* Main Hero Slider Card */}
      <div 
        className="relative w-full h-56 sm:h-64 rounded-3xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 group select-none cursor-pointer bg-slate-900"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => onSelectArticle && onSelectArticle(activeArticle)}
      >
        {/* Background Slide Image with Fade Animation */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            key={activeArticle.id}
            src={activeArticle.image} 
            alt={activeTitle}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800";
            }}
          />
          {/* Rich Gradient Overlays for High Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/20"></div>
        </div>

        {/* Top Badges & Controls Row */}
        <div className="absolute top-3 inset-x-3.5 flex justify-between items-center z-10">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm tracking-wide ${activeArticle.tagColor}`}>
              {activeTag}
            </span>
            <span className="bg-slate-900/70 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-full font-bold font-mono border border-white/10">
              <i className="fa-regular fa-clock mr-1 text-[8px]"></i>{activeArticle.time}
            </span>
          </div>

          <span className="bg-black/50 backdrop-blur-md text-white/90 text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/15">
            {currentIndex + 1} / {carouselArticles.length}
          </span>
        </div>

        {/* Bottom Headline & Info */}
        <div className="absolute bottom-3.5 inset-x-4 z-10 space-y-1.5">
          <h4 className="font-serif-welcome text-white text-base sm:text-lg font-extrabold leading-snug line-clamp-2 drop-shadow-sm group-hover:text-emerald-300 transition-colors duration-300">
            {activeTitle}
          </h4>
          <p className="text-slate-200 text-xs line-clamp-1 leading-relaxed opacity-90 drop-shadow-sm">
            {activeDesc}
          </p>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-[11px] text-emerald-300 font-semibold">
              <i className="fa-solid fa-book-open-reader text-xs"></i>
              <span>{language === 'en' ? "Tap to read full article" : "Ketuk untuk baca artikel"}</span>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {carouselArticles.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex 
                      ? 'w-5 bg-brand-green shadow-sm' 
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Prev / Next Navigation Arrows (Visible on hover or touch) */}
        <button
          onClick={handlePrev}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white flex items-center justify-center backdrop-blur-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 border border-white/10 hover:scale-110 cursor-pointer shadow-md"
          title="Sebelumnya"
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white flex items-center justify-center backdrop-blur-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 border border-white/10 hover:scale-110 cursor-pointer shadow-md"
          title="Selanjutnya"
        >
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>
  );
}
