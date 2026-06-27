import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Simulated database of farmers and sellers with emergency stocks
const emergencySellers = [
  {
    id: 1,
    name: "Peternak Ayam Berkah Solo",
    category: "Peternak Lokal",
    items: {
      telur: 1200,
      ayam: 500,
      beras: 0,
      sayuran: 0,
      minyak: 0
    },
    distance: 1.8, // km
    address: "Jl. Adi Sucipto No.88, Surakarta",
    phone: "+62 857-1122-3344",
    ledgerId: "BC-EMG-042",
    status: "Sedia Kurir Darurat (Siap 24 Jam)",
    coords: { x: 120, y: 220 },
    price: {
      telur: 25000,
      ayam: 32000
    }
  },
  {
    id: 2,
    name: "Kelompok Tani Rejo Boyolali",
    category: "Petani Utama",
    items: {
      beras: 1500,
      sayuran: 400,
      telur: 0,
      ayam: 0,
      minyak: 0
    },
    distance: 3.2,
    address: "Jl. Raya Boyolali No.12, Boyolali",
    phone: "+62 812-3456-7890",
    ledgerId: "BC-EMG-081",
    status: "Siap Kirim Instan",
    coords: { x: 80, y: 90 },
    price: {
      beras: 14500,
      sayuran: 8000
    }
  },
  {
    id: 3,
    name: "Kolektif Sayur Organik Colomadu",
    category: "Kelompok Wanita Tani",
    items: {
      sayuran: 600,
      telur: 100,
      beras: 0,
      ayam: 0,
      minyak: 0
    },
    distance: 4.1,
    address: "Jl. Adi Sumarmo No.15, Colomadu",
    phone: "+62 821-4455-6677",
    ledgerId: "BC-EMG-067",
    status: "Siap Kirim Instan",
    coords: { x: 70, y: 160 },
    price: {
      sayuran: 7500,
      telur: 27000
    }
  },
  {
    id: 4,
    name: "Koperasi Tani Makmur Karanganyar",
    category: "Koperasi Unit Desa",
    items: {
      beras: 800,
      sayuran: 100,
      telur: 600,
      minyak: 400,
      ayam: 0
    },
    distance: 5.5,
    address: "Jl. Lawu No.45, Karanganyar",
    phone: "+62 812-9876-5432",
    ledgerId: "BC-EMG-102",
    status: "Siap Kirim / Ambil Mandiri",
    coords: { x: 300, y: 110 },
    price: {
      beras: 15000,
      sayuran: 9000,
      telur: 26000,
      minyak: 17000
    }
  },
  {
    id: 5,
    name: "Lumbung Beras Sejahtera Sukoharjo",
    category: "Lumbung Pangan Desa",
    items: {
      beras: 5000,
      minyak: 1000,
      telur: 0,
      sayuran: 0,
      ayam: 0
    },
    distance: 8.7,
    address: "Jl. Solo-Sukoharjo Km 9, Sukoharjo",
    phone: "+62 813-5566-7788",
    ledgerId: "BC-EMG-150",
    status: "Hanya Kirim via Truk Logistik",
    coords: { x: 320, y: 280 },
    price: {
      beras: 14000,
      minyak: 16500
    }
  }
];

const centerCoords = { x: 200, y: 180 }; // Dapur MBG Solo position

export default function EmergencyScreen({ onBackToHome }) {
  const { t, language } = useLanguage();
  const [itemType, setItemType] = useState('beras');
  const [quantity, setQuantity] = useState('50');
  const [isScanning, setIsScanning] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);

  // Run initial search on mount to show closest available food sellers
  useEffect(() => {
    handleSearch(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (isInitial = false) => {
    setIsScanning(true);
    if (!isInitial) {
      setSearchInitiated(true);
    }
    
    // Simulate radar scan duration
    setTimeout(() => {
      const q = parseFloat(quantity) || 0;
      
      // Filter based on selected item type and whether they have stock
      const filtered = emergencySellers
        .map(seller => {
          const availableStock = seller.items[itemType] || 0;
          return {
            ...seller,
            availableStock,
            pricePerUnit: seller.price[itemType] || 0,
            hasEnough: availableStock >= q
          };
        })
        // Sort by distance (closest first)
        .sort((a, b) => a.distance - b.distance);

      setSearchResults(filtered);
      setIsScanning(false);
      
      // Select the first one (closest) by default
      if (filtered.length > 0) {
        setSelectedSeller(filtered[0]);
      } else {
        setSelectedSeller(null);
      }
    }, 1200);
  };

  // Helper for item type labels
  const getItemLabel = (key) => {
    switch (key) {
      case 'beras': return language === 'en' ? 'Rice (Kg)' : 'Beras (Kg)';
      case 'telur': return language === 'en' ? 'Eggs (Kg)' : 'Telur (Kg)';
      case 'sayuran': return language === 'en' ? 'Fresh Vegetables (Kg)' : 'Sayuran Segar (Kg)';
      case 'minyak': return language === 'en' ? 'Cooking Oil (Liter)' : 'Minyak Goreng (Liter)';
      case 'ayam': return language === 'en' ? 'Chicken Meat (Kg)' : 'Daging Ayam (Kg)';
      default: return key;
    }
  };

  // Format currency
  const formatRupiah = (num) => {
    if (!num) return "Rp 0";
    return "Rp " + num.toLocaleString('id-ID');
  };

  return (
    <section id="screen-emergency" className="p-4 space-y-4 animate-[fadeIn_0.3s_ease-out] dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onBackToHome} 
          className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950 text-slate-700 dark:text-slate-350 hover:text-red-700 dark:hover:text-red-400 rounded-full transition-all-300 cursor-pointer h-10 w-10 flex items-center justify-center border border-slate-100 dark:border-slate-750"
          title={language === 'en' ? 'Back to Home' : 'Kembali ke Beranda'}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></span>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">{t('emgTitle')}</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('emgSub')}</p>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
          <i className="fa-solid fa-circle-exclamation text-lg animate-pulse"></i>
          <span className="text-xs font-bold uppercase tracking-wider">{t('emgFormTitle')}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('emgItemLabel')}</label>
            <div className="relative">
              <select 
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-3 pr-8 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none dark:text-white"
              >
                <option value="beras">{language === 'en' ? 'Rice' : 'Beras'}</option>
                <option value="telur">{language === 'en' ? 'Eggs' : 'Telur'}</option>
                <option value="sayuran">{language === 'en' ? 'Fresh Vegetables' : 'Sayuran Segar'}</option>
                <option value="minyak">{language === 'en' ? 'Cooking Oil' : 'Minyak Goreng'}</option>
                <option value="ayam">{language === 'en' ? 'Chicken Meat' : 'Daging Ayam'}</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 text-[10px]">
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('emgQuantityLabel')}</label>
            <div className="relative">
              <input 
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Jumlah..."
                min="1"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-3 pr-10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[10px] text-slate-400 font-bold pointer-events-none">
                {itemType === 'minyak' ? 'L' : 'Kg'}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => handleSearch(false)}
          disabled={isScanning}
          className="w-full bg-red-650 hover:bg-red-600 text-white text-xs font-extrabold py-3 px-4 rounded-xl transition-all-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isScanning ? (
            <>
              <i className="fa-solid fa-spinner animate-spin"></i>
              {t('emgSearchingBtn')}
            </>
          ) : (
            <>
              <i className="fa-solid fa-magnifying-glass-location"></i>
              {t('emgSearchBtn')}
            </>
          )}
        </button>
      </div>

      {/* Simulated Interactive Map */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden aspect-video relative shadow-lg">
        {/* Map Header Overlay */}
        <div className="absolute top-3 left-3 z-10 bg-black/75 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-white">
          <div className="flex items-center gap-1.5 text-[9px] font-extrabold tracking-wider">
            <i className="fa-solid fa-map-location-dot text-emerald-400"></i>
            {t('emgMapTitle')}
          </div>
        </div>

        {/* Scan effect */}
        {isScanning && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center z-20 text-white space-y-3">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 border border-red-500/40 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border border-red-500/60 rounded-full animate-pulse"></div>
              <i className="fa-solid fa-tower-broadcast text-red-500 text-2xl animate-bounce"></i>
            </div>
            <p className="text-[10px] font-extrabold tracking-widest text-red-400 uppercase animate-pulse">{t('emgMapScanning')}</p>
          </div>
        )}

        {/* SVG Map Layout */}
        <svg viewBox="0 0 400 300" className="w-full h-full text-slate-400 fill-current">
          {/* Grid lines background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="fill-slate-900" />

          {/* Simulated Rivers or Parks */}
          <path d="M 0 50 Q 150 40 180 140 T 400 240" fill="none" stroke="#0f172a" strokeWidth="20" opacity="0.3" />
          <path d="M 0 50 Q 150 40 180 140 T 400 240" fill="none" stroke="#083344" strokeWidth="4" opacity="0.4" />
          
          <circle cx="350" cy="50" r="30" className="fill-teal-950/20 stroke-teal-900/10" strokeWidth="1" />

          {/* Simulated Roads / Routes */}
          <g stroke="rgba(255,255,255,0.08)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Main roads */}
            <path d="M 50 0 L 50 300" />
            <path d="M 350 0 L 350 300" />
            <path d="M 0 150 L 400 150" />
            <path d="M 0 250 L 400 250" />
            <path d="M 0 60 L 400 60" />
            {/* Connecting roads */}
            <path d="M 50 60 L 200 180" />
            <path d="M 350 110 L 200 180" strokeDasharray="4 4" />
            <path d="M 200 180 L 320 280" />
          </g>

          {/* Secondary road center lines */}
          <g stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M 50 0 L 50 300" />
            <path d="M 350 0 L 350 300" />
            <path d="M 0 150 L 400 150" />
            <path d="M 200 180 L 320 280" />
          </g>

          {/* Highlighted active route line if a seller is selected */}
          {!isScanning && selectedSeller && (
            <>
              {/* Glow route */}
              <line 
                x1={centerCoords.x} 
                y1={centerCoords.y} 
                x2={selectedSeller.coords.x} 
                y2={selectedSeller.coords.y} 
                stroke="#ef4444" 
                strokeWidth="4" 
                strokeLinecap="round"
                opacity="0.3"
                className="animate-pulse"
              />
              {/* Precision path */}
              <line 
                x1={centerCoords.x} 
                y1={centerCoords.y} 
                x2={selectedSeller.coords.x} 
                y2={selectedSeller.coords.y} 
                stroke="#f87171" 
                strokeWidth="2" 
                strokeLinecap="round"
                strokeDasharray="6 4"
                className="animate-[dash_2s_linear_infinite]"
                style={{
                  strokeDashoffset: 10
                }}
              />
            </>
          )}

          {/* Location markers for sellers */}
          {!isScanning && searchResults.map(seller => {
            const isSelected = selectedSeller && selectedSeller.id === seller.id;
            const hasStock = seller.availableStock >= (parseFloat(quantity) || 0);

            return (
              <g 
                key={seller.id} 
                className="cursor-pointer"
                onClick={() => setSelectedSeller(seller)}
              >
                {/* Ping glow for selected or close sellers */}
                {isSelected && (
                  <circle 
                    cx={seller.coords.x} 
                    cy={seller.coords.y} 
                    r="15" 
                    fill={hasStock ? "rgba(239, 68, 68, 0.4)" : "rgba(245, 158, 11, 0.4)"}
                    className="animate-ping"
                  />
                )}
                <circle 
                  cx={seller.coords.x} 
                  cy={seller.coords.y} 
                  r="9" 
                  className={`${
                    isSelected 
                      ? 'fill-red-600 stroke-white' 
                      : hasStock 
                        ? 'fill-slate-800 stroke-red-500 hover:fill-red-500' 
                        : 'fill-slate-800 stroke-amber-500 hover:fill-amber-500'
                  } transition-all duration-300`}
                  strokeWidth="2"
                />
                {/* Number text marker */}
                <text 
                  x={seller.coords.x} 
                  y={seller.coords.y + 3} 
                  fontSize="8" 
                  fontWeight="black" 
                  fill="white" 
                  textAnchor="middle"
                >
                  {seller.id}
                </text>
                
                {/* Distance tag label */}
                <g transform={`translate(${seller.coords.x}, ${seller.coords.y - 14})`}>
                  <rect 
                    x="-18" 
                    y="-6" 
                    width="36" 
                    height="12" 
                    rx="3" 
                    fill="rgba(0,0,0,0.75)" 
                    stroke={isSelected ? "#f87171" : "none"} 
                    strokeWidth="0.5" 
                  />
                  <text 
                    x="0" 
                    y="2" 
                    fontSize="7" 
                    fontWeight="bold" 
                    fill="#f87171" 
                    textAnchor="middle"
                  >
                    {seller.distance} Km
                  </text>
                </g>
              </g>
            );
          })}

          {/* Dapur Chef Amir Center Marker (Dapur MBG Solo) */}
          <g>
            <circle cx={centerCoords.x} cy={centerCoords.y} r="18" fill="rgba(16, 185, 129, 0.25)" className="animate-pulse" />
            <circle cx={centerCoords.x} cy={centerCoords.y} r="10" className="fill-emerald-600 stroke-white" strokeWidth="2.5" />
            {/* Chef hat or house mini icon */}
            <path 
              d="M 197 177 L 203 177 L 203 183 L 197 183 Z" 
              fill="white" 
            />
            {/* Pulsing indicator tag */}
            <g transform={`translate(${centerCoords.x}, ${centerCoords.y + 18})`}>
              <rect x="-35" y="-5" width="70" height="11" rx="4" fill="rgba(16, 185, 129, 0.9)" />
              <text x="0" y="3" fontSize="6.5" fontWeight="black" fill="white" textAnchor="middle">
                {language === 'en' ? 'SOLO KITCHEN (YOU)' : 'DAPUR MBG SOLO (ANDA)'}
              </text>
            </g>
          </g>
        </svg>

        {/* Legend overlays */}
        <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md p-2 rounded-lg border border-white/5 text-[8px] text-slate-300 space-y-1 max-w-[120px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 border border-white"></span>
            <span>{language === 'en' ? 'Solo Kitchen' : 'Dapur MBG Solo'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 border border-white"></span>
            <span>{language === 'en' ? 'Selected Seller' : 'Penjual Terpilih'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-800 border border-red-500"></span>
            <span>{language === 'en' ? 'Enough Stock' : 'Stok Cukup'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-800 border border-amber-500"></span>
            <span>{language === 'en' ? 'Low Stock' : 'Stok Kurang / Habis'}</span>
          </div>
        </div>
      </div>

      {/* Selected Seller Details Card */}
      {!isScanning && selectedSeller && (
        <div className="bg-white dark:bg-slate-850 border-2 border-red-100 dark:border-red-950 rounded-3xl p-4 shadow-sm space-y-3.5 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-405 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                {t('emgRecLabel')} #{selectedSeller.id}
              </span>
              <h4 className="text-sm font-extrabold text-slate-850 dark:text-slate-100 mt-1">{selectedSeller.name}</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{selectedSeller.address}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-red-650 dark:text-red-400 block bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-lg border border-red-100 dark:border-red-900/50">
                {selectedSeller.distance} Km
              </span>
              <span className="text-[8px] text-slate-400 dark:text-slate-500 block mt-1">Estimasi rute GPS</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 block">{t('emgStockLabel')}</span>
              <span className={`text-xs font-extrabold block ${
                selectedSeller.availableStock >= (parseFloat(quantity) || 0)
                  ? 'text-emerald-700 dark:text-emerald-450'
                  : 'text-amber-700 dark:text-amber-450'
              }`}>
                {selectedSeller.availableStock} {itemType === 'minyak' ? 'L' : 'Kg'} Ready
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 block">{t('emgPriceLabel')}</span>
              <span className="text-xs font-extrabold text-slate-800 dark:text-white block">
                {formatRupiah(selectedSeller.pricePerUnit)} / {itemType === 'minyak' ? 'L' : 'kg'}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs py-1 border-y border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              <span className="text-slate-500 dark:text-slate-450 font-semibold">{t('emgLedgerLabel')}</span>
            </div>
            <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-100/50 dark:border-emerald-900/40">
              {selectedSeller.ledgerId}
            </span>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setShowLedgerModal(true)}
              className="flex-1 bg-red-650 hover:bg-red-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all-300 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer dark:shadow-none"
            >
              <i className="fa-solid fa-link"></i> {t('emgVerifyBtn')}
            </button>
            <a 
              href={`tel:${selectedSeller.phone}`}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-all-300 flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/40 dark:border-slate-700/45"
            >
              <i className="fa-solid fa-phone"></i> {t('emgCallBtn')}
            </a>
          </div>
        </div>
      )}

      {/* No Results Card */}
      {!isScanning && searchResults.length === 0 && searchInitiated && (
        <div className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 text-center space-y-3">
          <i className="fa-solid fa-circle-question text-slate-350 text-3xl"></i>
          <div>
            <h4 className="text-xs font-extrabold text-slate-805 dark:text-white">{t('emgNotFoundTitle')}</h4>
            <p className="text-[10px] text-slate-550 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              {t('emgNotFoundDesc')}
            </p>
          </div>
        </div>
      )}

      {/* Nearby Sellers Directory list */}
      {searchResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 tracking-wider uppercase">{t('emgListTitle')}</h3>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {searchResults.map(seller => {
              const isSelected = selectedSeller && selectedSeller.id === seller.id;
              const hasEnough = seller.availableStock >= (parseFloat(quantity) || 0);

              return (
                <div 
                  key={seller.id}
                  onClick={() => setSelectedSeller(seller)}
                  className={`border rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs hover:border-red-200 dark:hover:border-red-900 transition-all-300 cursor-pointer ${
                    isSelected 
                      ? 'bg-red-50/30 dark:bg-red-950/20 border-red-200 dark:border-red-900' 
                      : 'bg-white dark:bg-slate-850 border-slate-150 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-2xs shrink-0 border ${
                      isSelected 
                        ? 'bg-red-650 text-white border-red-650' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-700'
                    }`}>
                      {seller.id}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-150 flex items-center gap-1.5">
                        {seller.name}
                        {seller.distance <= 2 && (
                          <span className="bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-405 text-[8px] font-black px-1.5 py-0.2 rounded uppercase">
                            {language === 'en' ? 'Very Close' : 'Sangat Dekat'}
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-550 dark:text-slate-400 font-medium mt-0.5">
                        {language === 'en' ? 'Distance' : 'Jarak'}: {seller.distance} Km • {language === 'en' ? 'Stock' : 'Stok'}: {seller.availableStock} {itemType === 'minyak' ? 'L' : 'Kg'}
                      </p>
                      <div className="flex gap-1.5 mt-1">
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400 font-bold px-1.5 py-0.2 rounded font-mono">
                          {seller.ledgerId}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          hasEnough 
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400' 
                            : 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-400'
                        }`}>
                          {hasEnough ? (language === 'en' ? 'Stock OK' : 'Stok Cukup') : (language === 'en' ? 'Low Stock' : 'Stok Kurang')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-slate-800 dark:text-white block">
                      {formatRupiah(seller.pricePerUnit)}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-0.5">
                      per {itemType === 'minyak' ? 'L' : 'kg'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ledger Verification Modal */}
      {showLedgerModal && selectedSeller && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white dark:bg-slate-850 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-red-100 dark:border-red-950 animate-[scaleIn_0.2s_ease-out]">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-700 shrink-0">
                <i className="fa-solid fa-link text-base"></i>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-850 dark:text-white">{t('emgModalTitle')}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{t('emgModalSub')}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl text-xs space-y-2 border border-slate-100 dark:border-slate-700 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">{language === 'en' ? 'Farmer Partner' : 'Mitra Tani'}</span>
                <span className="font-bold text-slate-800 dark:text-white text-right">{selectedSeller.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">{language === 'en' ? 'Staple' : 'Bahan Pokok'}</span>
                <span className="font-bold text-slate-800 dark:text-white">{getItemLabel(itemType)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">{language === 'en' ? 'Current Stock' : 'Stok Terkini'}</span>
                <span className="font-bold text-slate-800 dark:text-white">{selectedSeller.availableStock} {itemType === 'minyak' ? 'L' : 'Kg'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">{language === 'en' ? 'Fixed Price' : 'Harga Tetap'}</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-450">{formatRupiah(selectedSeller.pricePerUnit)}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Block Height</span>
                <span className="font-bold text-slate-800 dark:text-white">#{839000 + selectedSeller.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Tx Hash</span>
                <span className="font-bold text-slate-800 dark:text-white text-[10px] truncate max-w-[120px]" title={selectedSeller.ledgerId}>{selectedSeller.ledgerId}-txhash092b</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Status</span>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">VERIFIED</span>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 text-[10px] p-3 rounded-xl border border-emerald-100/50 dark:border-emerald-900/35 leading-relaxed">
              {t('emgModalNote')}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowLedgerModal(false)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center border border-slate-200/40 dark:border-slate-700/50"
              >
                {t('emgModalClose')}
              </button>
              <a 
                href={`tel:${selectedSeller.phone}`}
                className="flex-1 bg-emerald-600 hover:bg-emerald-550 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center shadow-md shadow-emerald-250 dark:shadow-none flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-phone"></i> {t('emgModalCall')}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
