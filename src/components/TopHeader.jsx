import { useLanguage } from '../context/LanguageContext';

export default function TopHeader({ onNotificationToggle, userInitials = "CA", userImage = null, onProfileClick }) {
  const { t } = useLanguage();
  return (
    <header className="sticky top-3 z-40 bg-white/85 backdrop-blur-xl border border-slate-100/80 rounded-2xl mx-4 mt-3.5 mb-1.5 card-shadow dark:bg-slate-850 dark:border-slate-800 transition-all-300 shrink-0">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-700/20 dark:shadow-none">
            <i className="fa-solid fa-leaf text-white text-lg"></i>
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              PANGANIN
              <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                SMART FOOD
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">{t('brandSub')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onNotificationToggle} 
            className="relative p-2 text-slate-500 hover:text-emerald-600 transition-all-300 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer pressable"
            title="Notifikasi"
          >
            <i className="fa-solid fa-bell text-base"></i>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
          </button>
          
          <button 
            onClick={onProfileClick}
            className="w-8 h-8 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden shadow-sm hover:scale-105 active:scale-95 transition-all-300 cursor-pointer"
            title="Profil Pengguna"
          >
            {userImage ? (
              <img src={userImage} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              userInitials
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
