import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function WelcomeScreen({ onStart }) {
  const { t } = useLanguage();

  return (
    <div className="relative w-full h-full bg-[#fdfdfc] dark:bg-slate-900 overflow-hidden flex flex-col justify-between animate-[fadeIn_0.4s_ease-out]">
      {/* Top section with Hero Image and Logo */}
      <div className="relative h-[55%] w-full">
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

        {/* Brand Logo Header (See Eat! / Panganify signature typography) */}
        <div className="absolute top-[10%] left-0 w-full flex justify-center z-10">
          <div className="text-center font-serif-welcome leading-none tracking-tight drop-shadow-sm">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-baseline justify-center">
              See<span className="text-brand-green text-lg align-top ml-0.5 font-bold">••</span>
            </h1>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white -mt-1 ml-6">
              Eat!
            </h1>
          </div>
        </div>
      </div>

      {/* Bottom section with Text Headline & Action CTA */}
      <div className="flex-1 flex flex-col justify-end px-8 pb-10 z-10 relative bg-gradient-to-t from-[#fcfcfa] via-[#fcfcfa] to-transparent dark:from-slate-900 dark:via-slate-900 dark:to-transparent pt-8">
        {/* Headline Text */}
        <div className="text-center mb-8 relative">
          <h2 className="font-serif-welcome text-[36px] sm:text-[40px] leading-[1.1] font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('welcomeHeadlineMain')} <br />
            <span className="text-brand-green italic font-medium">{t('welcomeHeadlineGreen')}</span> {t('welcomeHeadlineMid')} <br />
            {t('welcomeHeadlineBrown').split(' ')[0]}{' '}
            <span className="text-brand-brown">{t('welcomeHeadlineBrown').split(' ').slice(1).join(' ') || 'Food'}</span>
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
