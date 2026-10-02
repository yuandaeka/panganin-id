import React, { useState } from 'react';
import EducationCarousel from './EducationCarousel';
import { useLanguage } from '../context/LanguageContext';

const KITCHEN_PRESETS = [
  { name: "Dapur MBG Solo", city: "Surakarta, Jawa Tengah", tag: "Dapur Solo" },
  { name: "Dapur MBG Sleman", city: "Sleman, DI Yogyakarta", tag: "Mitra DIY" },
  { name: "Dapur MBG Surabaya", city: "Surabaya, Jawa Timur", tag: "Sentra Jatim" },
  { name: "Dapur MBG Bandung", city: "Bandung, Jawa Barat", tag: "Sentra Pasundan" },
  { name: "Dapur Sentral MBG Jakarta", city: "DKI Jakarta", tag: "Sentral Nasional" },
  { name: "Dapur MBG Semarang", city: "Semarang, Jawa Tengah", tag: "Sentra Pesisir" }
];

export default function HomeScreen({ 
  onSwitchTab, 
  onSelectArticle, 
  profile = {}, 
  setProfile, 
  triggerNotification 
}) {
  const { t } = useLanguage();
  const profileName = profile.name || "Chef Amir";
  const currentDapur = profile.dapur || "Dapur MBG Solo";

  // Location selector modal & GPS states
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [customLocationInput, setCustomLocationInput] = useState('');

  // Handle GPS location request (calls browser Geolocation API)
  const requestGpsLocation = () => {
    setIsLocating(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Browser Anda tidak mendukung fitur Geolocation.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let detectedKitchen = "Dapur MBG (GPS Terdeteksi)";

        // Approximate regional detection based on GPS coordinates
        if (latitude > -7.65 && latitude < -7.45 && longitude > 110.7 && longitude < 110.9) {
          detectedKitchen = "Dapur MBG Solo (Surakarta GPS)";
        } else if (latitude > -7.85 && latitude < -7.65 && longitude > 110.3 && longitude < 110.5) {
          detectedKitchen = "Dapur MBG Sleman (Jogja GPS)";
        } else if (latitude > -7.4 && latitude < -7.15 && longitude > 112.6 && longitude < 112.9) {
          detectedKitchen = "Dapur MBG Surabaya (Jatim GPS)";
        } else if (latitude > -6.35 && latitude < -6.05 && longitude > 106.6 && longitude < 107.0) {
          detectedKitchen = "Dapur Sentral MBG Jakarta (GPS)";
        } else if (latitude > -7.1 && latitude < -6.85 && longitude > 110.3 && longitude < 110.5) {
          detectedKitchen = "Dapur MBG Semarang (GPS)";
        } else {
          detectedKitchen = `Dapur MBG (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`;
        }

        if (setProfile) {
          setProfile(prev => ({ ...prev, dapur: detectedKitchen }));
        }
        setIsLocating(false);
        setShowLocationModal(false);
        if (triggerNotification) {
          triggerNotification(
            "📍 Izin Lokasi Diberikan",
            `Lokasi dapur operasional aktif: ${detectedKitchen}`
          );
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) { // PERMISSION_DENIED
          setLocationError("Izin akses lokasi ditolak di browser. Anda dapat memilih dari daftar atau ketik nama dapur secara manual.");
        } else if (err.code === 2) { // POSITION_UNAVAILABLE
          setLocationError("Sinyal GPS atau lokasi tidak ditemukan. Silakan pilih lokasi dari daftar.");
        } else if (err.code === 3) { // TIMEOUT
          setLocationError("Waktu permintaan lokasi GPS habis. Silakan coba lagi.");
        } else {
          setLocationError("Gagal mengambil lokasi otomatis. Silakan pilih manual.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSelectPreset = (kitchenName) => {
    if (setProfile) {
      setProfile(prev => ({ ...prev, dapur: kitchenName }));
    }
    setShowLocationModal(false);
    if (triggerNotification) {
      triggerNotification("Lokasi Dapur Diperbarui", `Dapur aktif: ${kitchenName}`);
    }
  };

  const handleSaveCustomLocation = (e) => {
    e.preventDefault();
    if (!customLocationInput.trim()) return;
    const newKitchen = customLocationInput.trim();
    if (setProfile) {
      setProfile(prev => ({ ...prev, dapur: newKitchen }));
    }
    setCustomLocationInput('');
    setShowLocationModal(false);
    if (triggerNotification) {
      triggerNotification("Lokasi Dapur Ditambahkan", `Dapur aktif: ${newKitchen}`);
    }
  };

  // Translate internal screen switching to App-level setActivePage mapping
  const handleFeatureClick = (tab) => {
    if (tab === 'planner') onSwitchTab('portion');
    else if (tab === 'blockchain') onSwitchTab('ledger');
    else onSwitchTab(tab);
  };

  return (
    <section id="screen-home" className="p-4 space-y-6 animate-[fadeIn_0.3s_ease-out] dark:text-slate-100 pb-20">
      {/* Greeting & Header with Interactive Location Selector */}
      <div className="space-y-2 pt-1">
        <h2 className="font-serif-welcome text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
          Good <span className="text-brand-green font-medium italic">morning!</span>
        </h2>
        
        {/* Interactive Location Badge button */}
        <button 
          type="button"
          onClick={() => setShowLocationModal(true)}
          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700 text-xs transition-all-300 cursor-pointer shadow-3xs group"
          title="Klik untuk ubah atau izinkan akses lokasi GPS"
        >
          <i className="fa-solid fa-location-dot text-brand-green text-sm group-hover:scale-110 transition-transform"></i>
          <span className="truncate max-w-[210px]">{profileName} • {currentDapur}</span>
          <i className="fa-solid fa-chevron-down ml-1 text-[10px] text-slate-400 group-hover:text-brand-green"></i>
        </button>

        <div className="flex flex-wrap gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => setShowLocationModal(true)}
            className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
          >
            <i className="fa-solid fa-hotel"></i>
            <span>{currentDapur}</span>
            <i className="fa-solid fa-pen text-[8px] opacity-70 ml-0.5"></i>
          </button>
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

      {/* ========================================================================= */}
      {/* INTERACTIVE LOCATION SELECTOR & GPS PERMISSION MODAL                      */}
      {/* ========================================================================= */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white dark:bg-slate-850 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-750 max-h-[90vh] overflow-y-auto space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <h3 className="font-display text-sm font-extrabold text-slate-900 dark:text-white">
                    Atur Lokasi Dapur MBG
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Pilih atau deteksi koordinat lokasi operasional dapur Anda
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Tutup"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* GPS Browser Permission Request Banner */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-800/50 rounded-2xl p-3.5 space-y-2.5 shadow-3xs">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-sm">
                  <i className="fa-solid fa-satellite-dish"></i>
                </div>
                <div className="flex-1">
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300 block">
                    Gunakan Deteksi GPS Otomatis
                  </span>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5 leading-relaxed">
                    Browser akan memunculkan izin akses lokasi (Geolocation) untuk mencocokkan dapur & petani lokal terdekat.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isLocating}
                onClick={requestGpsLocation}
                className="w-full bg-brand-green hover:opacity-95 disabled:opacity-70 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isLocating ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Meminta Izin & Melacak GPS...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-crosshairs"></i>
                    <span>Izinkan & Deteksi Lokasi Saya</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message if GPS permission denied */}
            {locationError && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 p-3 rounded-2xl text-[11px] flex items-start gap-2 animate-[fadeIn_0.2s_ease-out]">
                <i className="fa-solid fa-triangle-exclamation text-amber-600 dark:text-amber-400 mt-0.5 shrink-0"></i>
                <div className="flex-1">
                  <span className="font-bold block">Perhatian Izin Lokasi:</span>
                  <p className="mt-0.5 opacity-90">{locationError}</p>
                </div>
              </div>
            )}

            {/* Preset Kitchen Options */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Dapur Rekomendasi Terdaftar
                </span>
                <span className="text-[9px] text-slate-400">Pilih Cepat</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {KITCHEN_PRESETS.map((k, idx) => {
                  const isCurrent = currentDapur.toLowerCase().includes(k.name.toLowerCase());
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(k.name)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200 shadow-3xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <i className={`fa-solid fa-hotel text-xs ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}></i>
                        <div>
                          <span className="font-bold text-xs block leading-tight">{k.name}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{k.city}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isCurrent ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {isCurrent ? 'Aktif' : k.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual Location Input Form */}
            <form onSubmit={handleSaveCustomLocation} className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Tambah / Ketik Lokasi Manual
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customLocationInput}
                  onChange={(e) => setCustomLocationInput(e.target.value)}
                  placeholder="Contoh: Dapur MBG Wonogiri, Dapur Sekolah 01..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <button
                  type="submit"
                  disabled={!customLocationInput.trim()}
                  className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </form>

            {/* Footer Close */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Selesai / Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
