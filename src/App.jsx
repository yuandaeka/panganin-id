import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Navbar from './components/Navbar';
import TopHeader from './components/TopHeader';
import HomeScreen from './components/HomeScreen';
import PortionPlannerScreen from './components/PortionPlannerScreen';
import HaccpScannerScreen from './components/HaccpScannerScreen';
import LedgerBcScreen from './components/LedgerBcScreen';
import WasteTrackerScreen from './components/WasteTrackerScreen';
import AiChatbotScreen from './components/AiChatbotScreen';
import NewsPortalScreen from './components/NewsPortalScreen';
import EmergencyScreen from './components/EmergencyScreen';
import ProfileScreen from './components/ProfileScreen';
import './App.css';

export default function App() {
  const [activePage, setActivePage] = useState('welcome');
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "Chef Amir",
    email: "amir.kitchen@panganify.id",
    phone: "+62 812-3456-7890",
    dapur: "Dapur MBG Solo",
    image: null,
    language: "id"
  });
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: "Transaksi Blockchain Terverifikasi",
    desc: "Sisa limbah organik berhasil disalurkan ke CV EcoEnzym Surakarta."
  });

  // Circular economy reward points (synchronized globally)
  const [totalWasteWeight, setTotalWasteWeight] = useState(325);
  const [totalWastePoints, setTotalWastePoints] = useState(4500);

  // Toast notifications helper
  const triggerNotification = (title, desc) => {
    if (title && desc) {
      setToastMessage({ title, desc });
    }
    setShowToast(true);
  };

  // Auto-hide toast after 6 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Handle Waste submission
  const handleSubmitWaste = (weight, type, partnerName) => {
    const pointsEarned = weight * 10;
    setTotalWasteWeight(prev => prev + weight);
    setTotalWastePoints(prev => prev + pointsEarned);

    triggerNotification(
      `Limbah ${weight} Kg Terdaftarkan di Blockchain`,
      `Berhasil disalurkan ke: ${partnerName}.`
    );

    // Auto navigate back to home screen after a short delay
    setTimeout(() => {
      setActivePage('home');
    }, 2500);
  };

  return (
    <div className={`h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-150 antialiased font-sans flex flex-col justify-center items-center overflow-hidden ${darkMode ? 'dark' : ''}`}>
      
      {/* MAIN INTERACTIVE HUB (Locked to Viewport Height to prevent body scroll) */}
      <main className="h-screen max-w-md w-full bg-white dark:bg-slate-900 shadow-xl shadow-slate-100 dark:shadow-slate-950/20 flex flex-col relative overflow-hidden">
        
        {/* Top brand header, hidden on welcome and chatbot screens */}
        {activePage !== 'chatbot' && activePage !== 'welcome' && (
          <TopHeader 
            userInitials={profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            userImage={profile.image}
            onProfileClick={() => setActivePage('profile')}
            onNotificationToggle={() => triggerNotification(
              profile.language === 'id' ? "Transaksi Blockchain Terverifikasi" : "Blockchain Transaction Verified",
              profile.language === 'id' ? "Sisa limbah organik berhasil disalurkan ke CV EcoEnzym Surakarta." : "Organic waste residue successfully distributed to CV EcoEnzym Surakarta."
            )} 
          />
        )}

        {/* Notification Banner Toast (Absolute position below TopHeader) */}
        {showToast && activePage !== 'welcome' && (
          <div 
            id="notification-toast" 
            className="mx-4 bg-emerald-800 text-white p-3 rounded-2xl flex items-start gap-2.5 shadow-lg animate-bounce z-40 absolute top-20 inset-x-0"
          >
            <i className="fa-solid fa-circle-check text-emerald-300 mt-1 shrink-0"></i>
            <div className="flex-1">
              <p className="text-xs font-semibold">{toastMessage.title}</p>
              <p className="text-[10px] text-emerald-100 mt-0.5">{toastMessage.desc}</p>
            </div>
            <button 
              onClick={() => setShowToast(false)} 
              className="text-emerald-200 hover:text-white cursor-pointer rounded-full hover:bg-white/10 p-0.5"
              title="Tutup"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        {activePage === 'welcome' ? (
          <WelcomeScreen onStart={() => setActivePage('home')} />
        ) : activePage !== 'chatbot' ? (
          <div className="flex-1 overflow-y-auto relative pb-28 pt-1">
            {activePage === 'home' && (
              <HomeScreen onSwitchTab={setActivePage} onSelectArticle={setSelectedArticle} profileName={profile.name} />
            )}

            {activePage === 'news' && (
              <NewsPortalScreen 
                initialArticle={selectedArticle} 
                onBackToHome={() => setActivePage('home')} 
              />
            )}

            {activePage === 'portion' && (
              <PortionPlannerScreen 
                onBackToHome={() => setActivePage('home')} 
                onConnectFarmers={() => setActivePage('ledger')} 
              />
            )}

            {activePage === 'haccp' && (
              <HaccpScannerScreen 
                onBackToHome={() => setActivePage('home')} 
              />
            )}

            {activePage === 'ledger' && (
              <LedgerBcScreen 
                onBackToHome={() => setActivePage('home')} 
              />
            )}

            {activePage === 'waste' && (
              <WasteTrackerScreen 
                onBackToHome={() => setActivePage('home')} 
                onSubmitWaste={handleSubmitWaste} 
                totalWeight={totalWasteWeight}
                totalPoints={totalWastePoints}
              />
            )}

            {activePage === 'emergency' && (
              <EmergencyScreen 
                onBackToHome={() => setActivePage('home')} 
              />
            )}

            {activePage === 'profile' && (
              <ProfileScreen 
                onBackToHome={() => setActivePage('home')} 
                profile={profile}
                setProfile={setProfile}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden pb-28 relative">
            <AiChatbotScreen 
              onClose={() => setActivePage('home')} 
            />
          </div>
        )}

        {/* FIXED BOTTOM NAVIGATION BAR */}
        {activePage !== 'welcome' && (
          <Navbar activePage={activePage} setActivePage={setActivePage} />
        )}
      </main>

    </div>
  );
}

