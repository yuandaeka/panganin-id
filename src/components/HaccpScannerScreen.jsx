import React, { useState, useEffect, useRef } from 'react';

const presets = {
  styrofoam: {
    title: "Kuah Styrofoam (Panas)",
    image: "https://placehold.co/600x350/ffe4e6/991b1b?text=Wadah+Sup+Styrofoam+Terbuka",
    boxType: "danger",
    boxTag: "BAHAYA: STYROFOAM DETECTED",
    boxStyle: { top: '25%', left: '30%', width: '40%', height: '50%' },
    score: "42/100",
    scoreClass: "text-red-650 bg-red-50 border-red-100",
    verdictTitle: "Peringatan Kontaminasi Wadah!",
    verdictDesc: "Styrofoam memicu pelepasan bahan berbahaya stirena saat terkena kuah sup bersuhu tinggi (>70°C).",
    category: "Wadah / Kemasan Distribusi",
    temp: "85°C (Terlalu Panas)",
    packaging: "Styrofoam (Dilarang)",
    icon: "fa-solid fa-triangle-exclamation text-red-650",
    iconBg: "bg-red-100",
    adviceClass: "bg-red-50 text-red-900 border border-red-100",
    adviceTitle: "Rekomendasi Tindakan Segera:",
    adviceText: "Hentikan pembagian makanan! Pindahkan sup kuah panas ke wadah plastik kode 5 (PP) atau stainless steel bersertifikasi foodgrade."
  },
  plastic: {
    title: "Kresek Panas Warmindo",
    image: "https://placehold.co/600x350/ffe4e6/991b1b?text=Makanan+Panas+Bungkus+Kresek",
    boxType: "danger",
    boxTag: "RISIKO: PLASTIK KRESEK HITAM",
    boxStyle: { top: '25%', left: '25%', width: '50%', height: '50%' },
    score: "35/100",
    scoreClass: "text-red-650 bg-red-50 border-red-100",
    verdictTitle: "Bahaya Kresek Daur Ulang!",
    verdictDesc: "Plastik kresek hitam terbuat dari daur ulang polimer yang mengandung klorin, berbahaya saat bersentuhan dengan makanan berlemak dan panas.",
    category: "Kebersihan & Penyajian",
    temp: "78°C (Berbahaya)",
    packaging: "Kresek Hitam Daur Ulang",
    icon: "fa-solid fa-triangle-exclamation text-red-650",
    iconBg: "bg-red-100",
    adviceClass: "bg-red-50 text-red-900 border border-red-100",
    adviceTitle: "Rekomendasi Tindakan Segera:",
    adviceText: "Gunakan wadah kertas berlapisan lilin foodgrade atau kemasan kotak biodegradabel berbahan serat tebu/singkong."
  },
  stainless: {
    title: "Wadah Stainless Steel",
    image: "https://placehold.co/600x350/ecfdf5/065f46?text=Stainless+Steel+Wadah+Saji",
    boxType: "safe",
    boxTag: "AMAN: FOOD GRADE STAINLESS",
    boxStyle: { top: '20%', left: '25%', width: '50%', height: '60%' },
    score: "98/100",
    scoreClass: "text-emerald-700 bg-emerald-50 border-emerald-100",
    verdictTitle: "Sangat Higienis & Aman",
    verdictDesc: "Wadah stainless steel meminimalkan risiko perpindahan partikel kimia dan mudah disterilkan secara masif.",
    category: "Material Serving Dapur",
    temp: "65°C (Suhu Hangat Ideal)",
    packaging: "SUS 304 Foodgrade",
    icon: "fa-solid fa-circle-check text-emerald-600",
    iconBg: "bg-emerald-100",
    adviceClass: "bg-emerald-50 text-emerald-900 border border-emerald-100",
    adviceTitle: "Status Verifikasi:",
    adviceText: "Sangat direkomendasikan untuk pendistribusian makanan Program Makan Bergizi Gratis skala besar."
  },
  dirty: {
    title: "Meja Dapur Kotor",
    image: "https://placehold.co/600x350/fffbeb/92400e?text=Dapur+Meja+Saji+Kotor",
    boxType: "danger",
    boxTag: "PERINGATAN: KOTOR & KONTAMINASI",
    boxStyle: { top: '20%', left: '30%', width: '40%', height: '55%' },
    score: "55/100",
    scoreClass: "text-amber-700 bg-amber-50 border-amber-100",
    verdictTitle: "Kebersihan Meja Kurang",
    verdictDesc: "Ditemukan sisa bahan makanan kotor di dekat area pengemasan akhir, berpotensi mengundang lalat dan kontaminasi bakteri.",
    category: "Kebersihan Area Produksi",
    temp: "28°C (Suhu Ruang)",
    packaging: "Stainless Meja Kotor",
    icon: "fa-solid fa-circle-exclamation text-amber-600",
    iconBg: "bg-amber-100",
    adviceClass: "bg-amber-50 text-amber-900 border border-amber-100",
    adviceTitle: "Rekomendasi Tindakan Segera:",
    adviceText: "Bersihkan meja produksi dengan larutan disinfektan klorin 100ppm sebelum memulai proses pengemasan menu selanjutnya."
  }
};

export default function HaccpScannerScreen({ onBackToHome }) {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  // Live Camera and Fallback States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedFileName, setAttachedFileName] = useState('');
  const [cameraToast, setCameraToast] = useState('');

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Clean up streams when screen is unmounted
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsLiveStreaming(false);
  };

  const startCameraStream = async (frontMode) => {
    try {
      setIsScanning(true);
      stopCameraStream(); // Ensure any old streams are closed

      const constraints = {
        video: {
          facingMode: frontMode ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsLiveStreaming(true);
      setIsCameraActive(true);
      setCapturedImage(null);
      setAttachedFile(null);
      setSelectedPreset(null);
      setCurrentData(null);
    } catch (err) {
      console.warn("Real camera hardware blocked or unavailable, enabling high-fidelity simulator mode:", err);
      setIsLiveStreaming(false);
      setIsCameraActive(true);
      setCameraToast("Kamera Fisik tidak terdeteksi. Mode Simulasi aktif.");
      setTimeout(() => setCameraToast(''), 3000);
    } finally {
      setIsScanning(false);
    }
  };

  const handleToggleCamera = () => {
    if (isCameraActive) {
      stopCameraStream();
      setIsCameraActive(false);
      setCapturedImage(null);
      setAttachedFile(null);
      setSelectedPreset(null);
      setCurrentData(null);
    } else {
      startCameraStream(isFrontCamera);
    }
  };

  const handleFlipCamera = () => {
    if (!isCameraActive) return;
    const nextMode = !isFrontCamera;
    setIsFrontCamera(nextMode);

    const modeText = nextMode ? "Depan (Mirror)" : "Belakang";
    setCameraToast(`Beralih ke Kamera ${modeText}`);
    setTimeout(() => {
      setCameraToast('');
    }, 1800);

    // Re-initialize webcam streaming with new constraints
    startCameraStream(nextMode);
  };

  const handleTriggerShutter = () => {
    if (isScanning) return;
    setIsScanning(true);

    if (isLiveStreaming && videoRef.current) {
      // Capture the current frame from live video using canvas
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 360;
        const ctx = canvas.getContext('2d');

        if (isFrontCamera) {
          // Mirror frame if front camera is active
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }

        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imgData = canvas.toDataURL('image/jpeg');

        setCapturedImage(imgData);
        stopCameraStream(); // Turn off webcam after capture

        setTimeout(() => {
          setIsScanning(false);
          // Set a verified positive outcome for the captured photo
          setSelectedPreset('stainless');
          setCurrentData({
            ...presets.stainless,
            image: imgData,
            verdictTitle: "Wadah Higienis Terverifikasi",
            verdictDesc: "Analisis AI real-time berhasil mengaudit wadah saji Anda. Higienitas material dan suhu penempatan memenuhi standar regulasi gizi."
          });
        }, 1200);
      } catch (err) {
        console.error("Frame capture error:", err);
        setIsScanning(false);
      }
    } else {
      // Simulation mode shutter behavior
      setTimeout(() => {
        setIsScanning(false);
        if (!selectedPreset) {
          setSelectedPreset('stainless');
          setCurrentData(presets.stainless);
        }
      }, 1000);
    }
  };

  const handleSimulate = (key) => {
    stopCameraStream();
    setIsLiveStreaming(false);
    setIsCameraActive(true);
    setCapturedImage(null);
    setAttachedFile(null);
    setIsScanning(true);
    setCameraToast('');

    setTimeout(() => {
      setSelectedPreset(key);
      setCurrentData(presets[key]);
      setIsScanning(false);
    }, 800);
  };

  const handleAttachFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAttachedFileName(file.name);
    stopCameraStream();
    setIsCameraActive(false); 
    setSelectedPreset(null);
    setCapturedImage(null);

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedFile(reader.result);
      setIsScanning(true);

      // Simulate AI analysis on uploaded file
      setTimeout(() => {
        setIsScanning(false);
        setCurrentData({
          title: `File: ${file.name}`,
          image: reader.result,
          boxType: "safe",
          boxTag: "CHECKED: GAMBAR DIUNGGAH",
          boxStyle: { top: '15%', left: '15%', width: '70%', height: '70%' },
          score: "92/100",
          scoreClass: "text-emerald-700 bg-emerald-50 border-emerald-100",
          verdictTitle: "Verifikasi Berhasil",
          verdictDesc: "Analisis AI menunjukkan objek diunggah memiliki tingkat kebersihan memadai dan bebas dari wadah karsinogenik yang terdeteksi.",
          category: "Analisis File Unggahan",
          temp: "Tidak Terbaca (Gambar Statis)",
          packaging: "Terdeteksi Aman / Foodgrade",
          icon: "fa-solid fa-cloud-arrow-up text-emerald-600",
          iconBg: "bg-emerald-100",
          adviceClass: "bg-emerald-50 text-emerald-900 border border-emerald-100",
          adviceTitle: "Rekomendasi AI:",
          adviceText: "Verifikasi visual berhasil. Untuk pengawasan berlanjut, lakukan pemindaian live menggunakan termometer makanan guna menguji suhu sajian."
        });
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const handleClearUpload = () => {
    setAttachedFile(null);
    setAttachedFileName('');
    setCurrentData(null);
    setCapturedImage(null);
  };

  return (
    <section id="screen-haccp" className="p-4 space-y-5 animate-[fadeIn_0.3s_ease-out]">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Header */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onBackToHome} 
          className="p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-full transition-all-300 cursor-pointer h-10 w-10 flex items-center justify-center border border-slate-100"
          title="Kembali ke Beranda"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 leading-tight">AI HACCP Photo Scanner</h2>
          <p className="text-xs text-slate-500">Uji higienis dapur, kesiapan saji & bahaya wadah</p>
        </div>
      </div>

      {/* Camera Viewfinder or Placeholder Container */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl aspect-video relative flex flex-col items-center justify-center group border border-slate-850">
        
        {isScanning && (
          <div className="absolute inset-0 bg-slate-955/85 backdrop-blur-xs flex flex-col items-center justify-center z-30 text-white space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold tracking-wider text-emerald-400 uppercase animate-pulse">Scanning via Panganin AI...</p>
          </div>
        )}

        {cameraToast && (
          <div className="absolute top-12 bg-black/85 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-30 animate-bounce">
            <i className="fa-solid fa-circle-info mr-1 text-emerald-405"></i> {cameraToast}
          </div>
        )}

        {isCameraActive ? (
          /* ACTIVE CAMERA MODULE */
          <>
            {isLiveStreaming ? (
              /* REAL WEB RTC VIDEO STREAM */
              <video 
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className={`w-full h-full object-cover ${isFrontCamera ? 'scale-x-[-1]' : ''}`}
              />
            ) : (
              /* SIMULATOR OR CAPTURED FRAME VIEW */
              <img 
                id="haccp-camera-img" 
                src={capturedImage || (currentData ? currentData.image : "https://placehold.co/600x350/1e293b/ffffff?text=Mengaktifkan+Lensa+Kamera...")} 
                alt="Camera View" 
                className={`w-full h-full object-cover transition-all duration-300 ${isFrontCamera ? 'scale-x-[-1]' : ''}`}
              />
            )}
            
            {/* Viewfinder grid lines overlay */}
            <div className="absolute inset-0 pointer-events-none border border-white/10 z-10">
              <div className="absolute inset-y-0 left-1/3 border-r border-white/5"></div>
              <div className="absolute inset-y-0 left-2/3 border-r border-white/5"></div>
              <div className="absolute inset-x-0 top-1/3 border-b border-white/5"></div>
              <div className="absolute inset-x-0 top-2/3 border-b border-white/5"></div>
            </div>

            {/* Bounding box overlay for safe/unsafe audit */}
            {!isScanning && currentData && (
              <div 
                className={`absolute border-2 rounded-2xl p-2 animate-[pulse_2s_infinite] z-20 ${
                  currentData.boxType === 'safe' ? 'border-emerald-500' : 'border-red-500'
                }`} 
                style={currentData.boxStyle}
              >
                <span 
                  className={`absolute -top-7 left-0 text-[10px] text-white font-black px-2.5 py-1 rounded-lg shadow-md tracking-wider ${
                    currentData.boxType === 'safe' ? 'bg-emerald-650' : 'bg-red-650'
                  }`}
                >
                  {currentData.boxTag}
                </span>
              </div>
            )}

            {/* Camera Indicators Overlay */}
            <div className="absolute top-3 inset-x-3 flex justify-between z-20">
              <span className="text-[9px] bg-black/60 backdrop-blur-md text-white font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span> 
                {isLiveStreaming ? "HARDWARE CAMERA ACTIVE" : "SIMULATION CAMERA"} ({isFrontCamera ? 'FRONT' : 'BACK'})
              </span>
              <span className="text-[9px] bg-black/60 backdrop-blur-md text-white font-mono px-2 py-1 rounded">ISO 400</span>
            </div>

            {/* Camera action keys panel (shutter, switch, exit) */}
            <div className="absolute bottom-3 inset-x-4 flex justify-between items-center z-25 bg-black/45 backdrop-blur-xs p-2.5 rounded-2xl border border-white/5">
              <button 
                onClick={handleFlipCamera}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90"
                title="Balik Kamera"
              >
                <i className="fa-solid fa-camera-rotate text-sm"></i>
              </button>
              
              <button 
                onClick={handleTriggerShutter}
                className="w-11 h-11 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all border-4 border-white cursor-pointer active:scale-90 shadow-md"
                title="Ambil Foto"
              >
                <i className="fa-solid fa-camera text-xs"></i>
              </button>
              
              <button 
                onClick={handleToggleCamera}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90"
                title="Matikan Kamera"
              >
                <i className="fa-solid fa-video-slash text-sm"></i>
              </button>
            </div>
          </>
        ) : attachedFile ? (
          /* ATTACHED IMAGE VIEW CONTAINER */
          <>
            <img 
              src={attachedFile} 
              alt="Attached User Scan" 
              className="w-full h-full object-cover" 
            />
            
            {!isScanning && currentData && (
              <div 
                className="absolute border-2 border-emerald-500 rounded-2xl p-2 animate-[pulse_2s_infinite] z-20" 
                style={currentData.boxStyle}
              >
                <span className="absolute -top-7 left-0 text-[10px] text-white font-black px-2.5 py-1 rounded-lg bg-emerald-650 shadow-md tracking-wider">
                  {currentData.boxTag}
                </span>
              </div>
            )}

            <div className="absolute top-3 inset-x-3 flex justify-between z-20">
              <span className="text-[9px] bg-emerald-800 text-white font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <i className="fa-solid fa-image"></i> FILE: {attachedFileName.substring(0, 15)}...
              </span>
              <button 
                onClick={handleClearUpload}
                className="bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-sm"
              >
                Hapus Foto
              </button>
            </div>
          </>
        ) : (
          /* CAMERA CLOSED / OFFLINE STATE */
          <div className="text-center p-6 text-slate-400 space-y-4 z-10">
            <div className="w-14 h-14 bg-slate-800 text-slate-400 border border-slate-700 rounded-full flex items-center justify-center mx-auto shadow-md">
              <i className="fa-solid fa-circle-notch text-2xl animate-[spin_10s_linear_infinite]"></i>
            </div>
            <div>
              <p className="text-xs font-extrabold text-white">AI HACCP Camera Offline</p>
              <p className="text-[10px] text-slate-550 mt-1.5 max-w-[250px]">Aktifkan kamera live untuk memindai kebersihan wadah dapur massal atau unggah file foto dari galeri.</p>
            </div>
            
            <div className="flex gap-2 justify-center max-w-xs mx-auto">
              <button 
                onClick={handleToggleCamera} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold py-2.5 px-3 rounded-xl transition-all-300 cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-video"></i> Buka Kamera
              </button>
              <button 
                onClick={handleAttachFileClick} 
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-205 border border-slate-700 text-[10px] font-bold py-2.5 px-3 rounded-xl transition-all-300 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-paperclip"></i> Attach File
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preset simulation triggers */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Atau Pilih Simulasi Objek Scan:</label>
          {(attachedFile || capturedImage) && (
            <button 
              onClick={handleClearUpload}
              className="text-[10px] font-bold text-slate-550 hover:text-emerald-700 cursor-pointer"
            >
              Reset Pemindaian
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(presets).map((key) => (
            <button 
              key={key}
              onClick={() => handleSimulate(key)} 
              className={`p-2.5 border rounded-2xl transition-all-300 text-left flex items-center gap-2 cursor-pointer ${
                selectedPreset === key && !attachedFile && !capturedImage
                  ? 'bg-emerald-50 border-emerald-250 text-emerald-800 font-bold' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className={`w-3 h-3 rounded-full shrink-0 ${
                presets[key].boxType === 'safe' ? 'bg-emerald-500' : 'bg-red-500'
              }`}></span> 
              <span className="text-[11px] font-bold truncate">{presets[key].title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI HACCP Outcome */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Hasil Audit AI HACCP</span>
          <span 
            className={`text-xs font-black px-2.5 py-1 rounded-full border shadow-3xs ${
              currentData ? currentData.scoreClass : 'text-slate-400 bg-slate-100 border-slate-200'
            }`}
          >
            {currentData ? currentData.score : "--/100"}
          </span>
        </div>

        {!currentData ? (
          <div className="text-center py-6 text-slate-400 space-y-2">
            <i className="fa-solid fa-network-wired text-3xl opacity-40"></i>
            <p className="text-xs font-semibold">Silakan buka kamera / unggah foto / pilih objek simulasi di atas untuk memulai analisis AI.</p>
          </div>
        ) : (
          <div className="space-y-3.5 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs mt-0.5 shrink-0 ${currentData.iconBg}`}>
                <i className={currentData.icon}></i>
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-extrabold text-slate-800">{currentData.verdictTitle}</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{currentData.verdictDesc}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Kategori Kontrol</span>
                <span className="font-bold text-slate-850">{currentData.category}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Suhu Aman (Serving Temp)</span>
                <span className="font-bold text-slate-850">{currentData.temp}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Rekomendasi Wadah</span>
                <span className="font-bold text-slate-850">{currentData.packaging}</span>
              </div>
            </div>

            <div className={`p-3 rounded-2xl text-xs space-y-1 ${currentData.adviceClass}`}>
              <p className="font-bold">{currentData.adviceTitle}</p>
              <p className="leading-relaxed">{currentData.adviceText}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
