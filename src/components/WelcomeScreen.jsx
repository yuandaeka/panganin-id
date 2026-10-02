import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function WelcomeScreen({ onStart }) {
  const { t } = useLanguage();

  return (
    <div className="relative w-full h-full bg-[#fdfdfc] dark:bg-slate-900 overflow-hidden flex flex-col justify-between animate-[fadeIn_0.4s_ease-out]">
      {/* Top section with Hero Image */}
      <div className="relative h-[48%] sm:h-[50%] w-full">
        {/* Hero Image with bottom fade mask */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            alt="Fresh Organic Salad"
            className="w-full h-full object-cover object-center image-fade-bottom opacity-90 transition-transform duration-700 hover:scale-105"
            src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800"
            onError={(e) => {
              // Fallback food photo if image offline
              e.target.src = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800";
            }}
          />
        </div>
      </div>

      {/* Bottom section with Text Headline & Action CTA */}
      <div className="flex-1 flex flex-col justify-end px-8 pb-10 z-10 relative bg-gradient-to-t from-[#fcfcfa] via-[#fcfcfa] to-transparent dark:from-slate-900 dark:via-slate-900 dark:to-transparent pt-4">
        {/* Logo & Headline Text */}
        <div className="text-center mb-8 relative">
          {/* Logo P Standalone replacing Discovery text */}
          <div className="flex justify-center mb-3">
            <img 
              src="/panganify.png" 
              alt="Panganify" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300" 
            />
          </div>

          <h2 className="font-serif-welcome text-[27px] sm:text-[32px] leading-[1.25] font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('welcomeHeadlinePart1')}{' '}
            <span className="text-brand-green italic font-medium">{t('welcomeHeadlinePart2')}</span>{' '}
            {t('welcomeHeadlinePart3')} <br />
            <span className="text-brand-brown">{t('welcomeHeadlinePart4')}</span>
          </h2>

          {/* Decorative scribble underline vector */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-4 pointer-events-none">
            <svg
              className="w-full h-full opacity-80"
              fill="none"
              stroke="#8a735c"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 180 20"
            >
              <path d="M10,10 Q50,0 90,12 T170,8"></path>
            </svg>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="w-full space-y-4 pt-2">
          {/* Primary Sign In Button */}
          <button
            onClick={onStart}
            className="w-full bg-brand-green-gradient text-white rounded-full py-4 text-base font-semibold shadow-[0_8px_20px_rgba(125,189,62,0.35)] transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>{t('welcomeSignInBtn')}</span>
            <i className="fa-solid fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
          </button>

          {/* Secondary Sign Up Prompt */}
          <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {t('welcomeNoAccount')}{' '}
            <button
              onClick={onStart}
              className="text-brand-green font-bold hover:underline cursor-pointer focus:outline-none"
            >
              {t('welcomeSignUpNow')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
