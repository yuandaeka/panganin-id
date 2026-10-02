import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Preset avatar options
const presetAvatars = [
  "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=120&h=120", // Chef 1
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=120&h=120", // Chef 2
  "https://images.unsplash.com/photo-1595273670150-db0d3b668831?auto=format&fit=crop&q=80&w=120&h=120", // Farmer
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120"  // Female Chef/Manager
];

const foodTerms = {
  id: {
    "beras": "Rice (Beras)",
    "telur": "Egg (Telur)",
    "sayuran": "Vegetables (Sayur)",
    "minyak": "Cooking Oil (Minyak Goreng)",
    "ayam": "Chicken Meat (Daging Ayam)",
    "limbah": "Organic Waste (Limbah Organik)",
    "petani": "Local Farmer (Petani Lokal)",
    "darurat": "Emergency Situation (Keadaan Darurat)",
    "pangan": "Food Supply (Pasokan Pangan)",
    "pasar": "Market Price (Harga Pasar)",
    "tengkulak": "Middlemen / Broker"
  },
  en: {
    "rice": "Beras (Rice)",
    "egg": "Telur (Egg)",
    "vegetable": "Sayuran (Vegetable)",
    "oil": "Minyak Goreng (Cooking Oil)",
    "chicken": "Daging Ayam (Chicken)",
    "waste": "Limbah Organik (Organic Waste)",
    "farmer": "Petani Lokal (Local Farmer)",
    "emergency": "Keadaan Darurat (Emergency)",
    "food": "Pasokan Pangan (Food Supply)",
    "price": "Harga Pasar (Market Price)",
    "middlemen": "Tengkulak (Middlemen)"
  }
};

export default function ProfileScreen({ onBackToHome, profile, setProfile, darkMode, setDarkMode }) {
  const { language, setLanguage, t } = useLanguage();
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [dapur, setDapur] = useState(profile.dapur);
  const [translateInput, setTranslateInput] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      name,
      email,
      phone,
      dapur
    }));
    triggerToast(t('toastSaved'));
  };

  const handleLanguageChange = (selectedLang) => {
    setLanguage(selectedLang);
    setProfile(prev => ({
      ...prev,
      language: selectedLang
    }));
    // Get translated toast text
    setTimeout(() => {
      triggerToast(selectedLang === 'en' ? "Language updated successfully!" : "Bahasa berhasil diubah!");
    }, 50);
  };

  const handlePresetSelect = (url) => {
    setProfile(prev => ({
      ...prev,
      image: url
    }));
    triggerToast(t('avatarUpdated') || (language === 'en' ? "Profile picture updated!" : "Foto profil diperbarui!"));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile(prev => ({
        ...prev,
        image: reader.result
      }));
      triggerToast(t('avatarUpdated') || (language === 'en' ? "Profile picture updated!" : "Foto profil diperbarui!"));
    };
    reader.readAsDataURL(file);
  };

  // Simulated instant translator search
  const getTranslation = () => {
    const term = translateInput.trim().toLowerCase();
    if (!term) return '';

    const currentLangTerms = foodTerms[language];
    const match = Object.keys(currentLangTerms).find(k => k.includes(term) || term.includes(k));
    if (match) {
      return currentLangTerms[match];
    }

    if (language === 'id') {
      return `[EN]: ${term.charAt(0).toUpperCase() + term.slice(1)} translation verified`;
    } else {
      return `[ID]: Terjemahan untuk ${term} terverifikasi`;
    }
  };

  return (
    <section id="screen-profile" className="p-4 space-y-5 animate-[fadeIn_0.3s_ease-out] dark:text-slate-100 pb-20">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onBackToHome} 
          className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-350 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-full transition-all-300 cursor-pointer h-10 w-10 flex items-center justify-center border border-slate-100 dark:border-slate-750 shadow-2xs"
          title={language === 'en' ? "Back to Home" : "Kembali ke Beranda"}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-slate-850 dark:text-white leading-tight">{t('profileTitle')}</h2>
          <p className="text-xs text-slate-550 dark:text-slate-400">{t('profileSub')}</p>
        </div>
      </div>

      {/* Success Toast */}
      {toastMsg && (
        <div className="mx-4 bg-emerald-800 dark:bg-emerald-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg animate-bounce z-40 fixed top-20 inset-x-0">
          <i className="fa-solid fa-circle-check text-emerald-300 shrink-0"></i>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Professional Account Card with Background Banner */}
      <div className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all-300">
        {/* Banner Gradient */}
        <div className="h-20 bg-gradient-to-r from-emerald-600 to-teal-700 dark:from-emerald-850 dark:to-teal-900 relative">
          <span className="absolute top-3 right-4 bg-white/20 backdrop-blur-md text-[9px] text-white font-extrabold px-2.5 py-0.5 rounded-full border border-white/10 uppercase tracking-widest">
            {profile.dapur}
          </span>
        </div>

        {/* Profile Info Overlay Row */}
        <div className="px-4 pb-4 -mt-10 flex flex-col sm:flex-row items-center sm:items-end gap-3 text-center sm:text-left">
          {/* Avatar display */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-full bg-emerald-700 dark:bg-emerald-800 text-white font-black text-2xl flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-850 shadow-md">
              {profile.image ? (
                <img src={profile.image} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-650 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-850 cursor-pointer shadow-sm text-xs transition-transform duration-300 hover:scale-110"
              title={t('changeAvatar')}
            >
              <i className="fa-solid fa-camera"></i>
            </button>
          </div>

          <div className="flex-1 pb-1">
            <h3 className="text-base font-extrabold text-slate-850 dark:text-white leading-tight flex items-center justify-center sm:justify-start gap-1.5">
              {profile.name}
              <i className="fa-solid fa-circle-check text-xs text-emerald-600 dark:text-emerald-450" title="Verified Chef"></i>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{profile.email}</p>
          </div>
        </div>

        {/* Preset avatar options list */}
        <div className="px-4 pb-4 pt-2 border-t border-slate-50 dark:border-slate-800 space-y-2">
          <label className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">{t('presetTitle')}</label>
          <div className="flex gap-2.5 justify-center sm:justify-start">
            {presetAvatars.map((url, i) => (
              <button 
                key={i}
                onClick={() => handlePresetSelect(url)}
                className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                  profile.image === url ? 'border-emerald-650 scale-105 ring-2 ring-emerald-100 dark:ring-emerald-950' : 'border-slate-200 dark:border-slate-750'
                }`}
              >
                <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
            <button 
              onClick={() => fileInputRef.current.click()}
              className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 border border-dashed border-slate-350 dark:border-slate-700 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
              title={t('uploadBtn')}
            >
              <i className="fa-solid fa-plus text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-55 dark:border-slate-800">
          <i className="fa-solid fa-user-pen text-base text-emerald-600"></i>
          <span className="text-xs font-extrabold uppercase tracking-wider">{t('editProfile')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('nameLabel')}</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('emailLabel')}</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('phoneLabel')}</label>
            <input 
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('kitchenLabel')}</label>
            <input 
              type="text"
              value={dapur}
              onChange={(e) => setDapur(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-emerald-650 hover:bg-emerald-600 text-white text-xs font-extrabold py-3 px-4 rounded-xl transition-all duration-300 shadow-md shadow-emerald-250 dark:shadow-none cursor-pointer"
        >
          <i className="fa-solid fa-floppy-disk mr-1.5"></i>
          {t('saveBtn')}
        </button>
      </form>

      {/* App Settings Card */}
      <div className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-55 dark:border-slate-800">
          <i className="fa-solid fa-sliders text-base text-emerald-600"></i>
          <span className="text-xs font-extrabold uppercase tracking-wider">{t('settingsTitle')}</span>
        </div>

        <div className="space-y-4">
          {/* Mode Switch (Dark/Light) */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <span className="text-xs font-bold text-slate-805 dark:text-slate-200 block">{t('themeMode')}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">{t('themeDesc')}</span>
            </div>
            
            <button 
              onClick={() => {
                setDarkMode(!darkMode);
                triggerToast(t('toastTheme'));
              }}
              className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 rounded-xl transition-all cursor-pointer font-bold text-[10px] w-28 justify-between shadow-2xs"
            >
              <span className={`flex-1 text-center py-1 rounded-lg transition-all ${!darkMode ? 'bg-emerald-650 text-white shadow-2xs' : 'text-slate-500 dark:text-slate-400'}`}>
                <i className="fa-solid fa-sun mr-1"></i> {t('themeLight')}
              </span>
              <span className={`flex-1 text-center py-1 rounded-lg transition-all ${darkMode ? 'bg-emerald-650 text-white shadow-2xs' : 'text-slate-500 dark:text-slate-450'}`}>
                <i className="fa-solid fa-moon mr-1"></i> {t('themeDark')}
              </span>
            </button>
          </div>

          {/* Language Switch */}
          <div className="flex justify-between items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex-1">
              <span className="text-xs font-bold text-slate-805 dark:text-slate-200 block">{t('langMode')}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">{t('langDesc')}</span>
            </div>

            <div className="flex gap-1.5">
              <button 
                type="button"
                onClick={() => handleLanguageChange('id')}
                className={`text-[10px] font-bold px-3 py-2 rounded-xl transition-all border cursor-pointer ${
                  language === 'id' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250 text-emerald-800 dark:text-emerald-400 font-extrabold' 
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                🇮🇩 IND
              </button>
              <button 
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`text-[10px] font-bold px-3 py-2 rounded-xl transition-all border cursor-pointer ${
                  language === 'en' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250 text-emerald-800 dark:text-emerald-400 font-extrabold' 
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                🇬🇧 ENG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Instant Translator Module */}
      <div className="bg-gradient-to-br from-emerald-850 to-emerald-950 text-white rounded-3xl p-4 shadow-lg space-y-3.5">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-language text-xl text-emerald-300"></i>
          <div>
            <h4 className="text-xs font-extrabold tracking-wider uppercase">{t('translatorTitle')}</h4>
            <p className="text-[9px] text-emerald-200 leading-tight">{t('translatorDesc')}</p>
          </div>
        </div>

        <div className="space-y-2">
          <input 
            type="text"
            value={translateInput}
            onChange={(e) => setTranslateInput(e.target.value)}
            placeholder={t('typePlaceholder')}
            className="w-full bg-white/10 border border-white/20 rounded-xl py-2 px-3 text-xs placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-white font-medium"
          />
          {translateInput.trim() && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 space-y-1 animate-[fadeIn_0.2s_ease-out]">
              <span className="text-[9px] text-emerald-350 block font-bold">{t('transResult')}</span>
              <span className="text-xs font-black block tracking-wide text-emerald-100">
                {getTranslation()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Complete Profile Credentials Details - Visual Dashboard Grid */}
      <div className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-750 dark:text-slate-300 pb-1 border-b border-slate-55 dark:border-slate-800">
          <i className="fa-solid fa-shield-halved text-base text-emerald-600"></i>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider block">{t('detailsTitle')}</span>
            <span className="text-[9px] text-slate-400 block">{t('detailDesc')}</span>
          </div>
        </div>

        {/* Dashboard Grid representation */}
        <div className="grid grid-cols-2 gap-3.5 pt-1 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-2xl space-y-1 text-center">
            <i className="fa-solid fa-certificate text-emerald-600 dark:text-emerald-400 text-base"></i>
            <span className="text-[9px] text-slate-450 dark:text-slate-400 block font-bold uppercase tracking-wider">{t('licenseLabel')}</span>
            <span className="font-extrabold text-slate-800 dark:text-white block mt-0.5">#HACCP-ID-2026</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-2xl space-y-1 text-center">
            <i className="fa-solid fa-link text-emerald-650 dark:text-emerald-450 text-base"></i>
            <span className="text-[9px] text-slate-450 dark:text-slate-400 block font-bold uppercase tracking-wider">{t('ledgerIdLabel')}</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[100px] mx-auto mt-0.5">0xChefAmir849</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-2xl space-y-1 text-center">
            <i className="fa-solid fa-star text-amber-500 text-base"></i>
            <span className="text-[9px] text-slate-450 dark:text-slate-400 block font-bold uppercase tracking-wider">{t('statsLabel')}</span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400 block mt-0.5">98 / 100</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-2xl space-y-1 text-center">
            <i className="fa-solid fa-recycle text-blue-600 dark:text-blue-400 text-base"></i>
            <span className="text-[9px] text-slate-450 dark:text-slate-400 block font-bold uppercase tracking-wider">{t('pointsLabel')}</span>
            <span className="font-extrabold text-slate-800 dark:text-white block mt-0.5">4,500 Pts</span>
          </div>
        </div>
      </div>

      {/* App Version & Brand Footer */}
      <div className="flex flex-col items-center justify-center pt-2 pb-4 text-center space-y-1.5 opacity-80">
        <div className="w-9 h-9 rounded-2xl bg-white dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-slate-700 shadow-2xs flex items-center justify-center">
          <img src="/panganify.png" alt="Panganify" className="w-full h-full object-contain" />
        </div>
        <div>
          <p className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 tracking-tight">PANGANIFY <span className="text-[9px] font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">v2.4</span></p>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">Ekosistem Pangan Sosial Berbasis AI & Blockchain</p>
        </div>
      </div>
    </section>
  );
}
