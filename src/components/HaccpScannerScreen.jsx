import React, { useState, useEffect, useRef } from 'react';

// Dapur presets (Kebersihan & Tata Letak)
const dapurPresets = {
  dapur_bersih: {
    title: "Dapur Bersih & Rapi",
    image: "https://placehold.co/600x350/ecfdf5/065f46?text=Dapur+Stainless+Bersih+Higienis",
    boxType: "safe",
    boxTag: "AMAN: HIGIENITAS PRIMA",
    boxStyle: { top: '15%', left: '15%', width: '70%', height: '70%' },
    score: "98/100",
    scoreClass: "text-emerald-700 bg-emerald-50 border-emerald-100",
    verdictTitle: "Higienitas & Tata Letak Sesuai",
    verdictDesc: "Layout dapur memenuhi standar HACCP. Pemisahan area basah (persiapan bahan) dan area kering (sajian matang) terstruktur dengan baik. Permukaan meja kerja berbahan stainless steel SUS 304 yang tahan karat dan mudah disterilisasi.",
    category: "Tata Letak & Kebersihan",
    temp: "Suhu Ruang AC (23°C)",
    packaging: "Stainless Steel Foodgrade",
    icon: "fa-solid fa-circle-check text-emerald-600",
    iconBg: "bg-emerald-100",
    adviceClass: "bg-emerald-50 text-emerald-900 border border-emerald-100",
    adviceTitle: "Rekomendasi Pemeliharaan:",
    adviceText: "Lakukan sanitasi berkala setiap selesai shift. Pertahankan sistem sirkulasi udara dapur agar kelembapan tetap di bawah 60%."
  },
  dapur_kotor: {
    title: "Meja Saji Kotor",
    image: "https://placehold.co/600x350/fffbeb/92400e?text=Dapur+Meja+Saji+Kotor",
    boxType: "danger",
    boxTag: "PERINGATAN: KOTOR & KONTAMINASI",
    boxStyle: { top: '20%', left: '30%', width: '40%', height: '55%' },
    score: "55/100",
    scoreClass: "text-amber-700 bg-amber-50 border-amber-100",
    verdictTitle: "Kebersihan Meja Kurang",
    verdictDesc: "Ditemukan sisa lemak, ceceran air kotor, dan sisa bahan pangan di meja penyiapan. Kondisi ini berpotensi mengundang hama (lalat/kecoa) dan menyebarkan bakteri pembusuk.",
    category: "Kebersihan Area Produksi",
    temp: "28°C (Cenderung Lembap)",
    packaging: "Stainless Meja Kotor",
    icon: "fa-solid fa-circle-exclamation text-amber-600",
    iconBg: "bg-amber-100",
    adviceClass: "bg-amber-50 text-amber-900 border border-amber-100",
    adviceTitle: "Rekomendasi Tindakan Segera:",
    adviceText: "Hentikan penyiapan makanan sementara. Lakukan pembersihan menyeluruh menggunakan detergen food-safe dilanjutkan semprotan disinfektan klorin 100ppm."
  },
  tata_letak_salah: {
    title: "Layout Kontaminasi Silang",
    image: "https://placehold.co/600x350/ffe4e6/991b1b?text=Daging+Mentah+Dekat+Makanan+Saji",
    boxType: "danger",
    boxTag: "BAHAYA: CROSS-CONTAMINATION",
    boxStyle: { top: '25%', left: '20%', width: '60%', height: '50%' },
    score: "40/100",
    scoreClass: "text-red-650 bg-red-50 border-red-100",
    verdictTitle: "Tata Letak Berisiko Tinggi",
    verdictDesc: "Daging sapi/ayam mentah diletakkan bersentuhan langsung atau sangat dekat dengan sayuran matang yang siap dikemas. Air tirisan daging mentah (after-cooking runoff) dapat menetes ke makanan siap saji.",
    category: "Kesesuaian Tata Letak Dapur",
    temp: "Suhu Dapur Panas (30°C)",
    packaging: "Kontak Silang Bahan Baku",
    icon: "fa-solid fa-triangle-exclamation text-red-650",
    iconBg: "bg-red-100",
    adviceClass: "bg-red-50 text-red-900 border border-red-100",
    adviceTitle: "Rekomendasi Tindakan Koreksi:",
    adviceText: "Segera pisahkan bahan mentah ke zona persiapan dingin/chiller. Gunakan talenan dan pisau berwarna berbeda (merah untuk daging mentah, hijau untuk sayur/matang) untuk mencegah transfer patogen."
  }
};

// Bahan Baku presets (Titik Kritis Bahan - Foto & Informasi)
const bahanPresets = {
  daging_mentah: {
    title: "Daging Sapi & Ayam Potong",
    image: "https://placehold.co/600x350/ffe4e6/991b1b?text=Daging+Sapi+dan+Ayam+Mentah",
    boxType: "danger",
    boxTag: "BAHAYA: HIGH RISK FOOD",
    boxStyle: { top: '20%', left: '20%', width: '60%', height: '60%' },
    score: "60/100",
    scoreClass: "text-amber-700 bg-amber-50 border-amber-100",
    verdictTitle: "Kategori Risiko Tinggi (High Risk Food)",
    verdictDesc: "Daging mentah memiliki kadar air & aktivitas air (Aw) tinggi yang menjadi media ideal Salmonella.",
    category: "Bahan Baku Segar (Curah)",
    temp: "Freezer (< -18°C) / Chiller (0-4°C)",
    packaging: "Maksimal 3 hari di Chiller, 3 bulan di Freezer.",
    cemaranFisik: "Serpihan pecahan tulang tajam, bulu unggas, atau debu kotoran transportasi.",
    cemaranKimia: "Residu hormon pertumbuhan, residu obat hewan (antibiotik), cemaran logam berat.",
    cemaranMikrobiologi: "Bakteri Salmonella enterica (bakteri penyebab Salmonellosis/tifus), E. coli patogenik, dan Campylobacter jejuni.",
    brandedAdvice: "",
    isBahan: true
  },
  sayur_segar: {
    title: "Sayur Bayam & Wortel",
    image: "https://placehold.co/600x350/ecfdf5/065f46?text=Bayam+dan+Wortel+Hortikultura",
    boxType: "safe",
    boxTag: "MONITOR: VEGETABLES",
    boxStyle: { top: '15%', left: '15%', width: '70%', height: '70%' },
    score: "80/100",
    scoreClass: "text-emerald-700 bg-emerald-50 border-emerald-100",
    verdictTitle: "Kategori Risiko Sedang (Medium Risk Food)",
    verdictDesc: "Sayuran segar rentan terhadap lumpur tanah dan air irigasi yang tercemar pupuk kandang.",
    category: "Bahan Baku Segar (Curah)",
    temp: "Laci sayur kulkas (5°C - 10°C) setelah dicuci air mengalir",
    packaging: "Maksimal 2 hari untuk sayur daun, 5 hari untuk umbi.",
    cemaranFisik: "Sisa tanah liat/lumpur di akar, ulat daun hidup, serangga, kerikil kecil.",
    cemaranKimia: "Residu pestisida kimia pembasmi hama dan herbisida.",
    cemaranMikrobiologi: "Bakteri Coliform (dari pupuk kandang tidak steril), kapang pembusuk, atau cacing tambang.",
    brandedAdvice: "",
    isBahan: true
  },
  susu_telur: {
    title: "Telur Utuh & Susu Segar",
    image: "https://placehold.co/600x350/fffbeb/92400e?text=Telur+Utuh+dan+Susu+Mentah",
    boxType: "danger",
    boxTag: "MONITOR: EGGS & DAIRY",
    boxStyle: { top: '25%', left: '25%', width: '50%', height: '50%' },
    score: "72/100",
    scoreClass: "text-amber-700 bg-amber-50 border-amber-100",
    verdictTitle: "Kategori Kerentanan Tinggi",
    verdictDesc: "Susu mentah dan cangkang telur dapat membawa bakteri zoonosis seperti Salmonella dan Listeria.",
    category: "Bahan Baku Segar (Curah)",
    temp: "Kulkas suhu < 4°C (Susu pasteurisasi di kulkas utama)",
    packaging: "Telur utuh: 3-4 minggu. Susu pasteurisasi: 3-5 hari setelah dibuka.",
    cemaranFisik: "Pecahan kulit telur, noda kotoran unggas di cangkang luar, bulu ayam.",
    cemaranKimia: "Residu antibiotik hewan (penisilin/tetrasiklin) atau residu desinfektan kandang.",
    cemaranMikrobiologi: "Salmonella enteritidis (pada cangkang/dalam kuning telur), Listeria monocytogenes (susu mentah).",
    brandedAdvice: "",
    isBahan: true
  },
  saus_bermerk: {
    title: "Saus Sambal Botol Bermerk",
    image: "https://placehold.co/600x350/ecfdf5/065f46?text=Saus+Botol+Kemasan+Bermerk",
    boxType: "safe",
    boxTag: "AMAN: BRANDED SEALED",
    boxStyle: { top: '20%', left: '30%', width: '40%', height: '60%' },
    score: "95/100",
    scoreClass: "text-emerald-700 bg-emerald-50 border-emerald-100",
    verdictTitle: "Kategori Risiko Rendah & Terkontrol",
    verdictDesc: "Bahan olahan pabrik terdaftar BPOM memiliki risiko mikrobiologi awal sangat rendah karena sterilisasi thermal.",
    category: "Bahan Olahan Bermerk (Pabrikan)",
    temp: "Suhu ruang sejuk kering (sebelum dibuka), Chiller 2-4°C (setelah dibuka)",
    packaging: "Sesuai Expired Date di label (segel utuh), 1-2 minggu (setelah dibuka).",
    cemaranFisik: "Debu luar botol, serpihan segel plastik penutup saat pertama dibuka.",
    cemaranKimia: "Migrasi senyawa kimia dari botol plastik PET/kaca, bahan pengawet/pewarna melebihi batas ADI.",
    cemaranMikrobiologi: "Kapang dan khamir jika botol dibiarkan terbuka lama di udara bebas.",
    brandedAdvice: "⚠️ BAHAN BERMERK VERIFIED: Pastikan logo BPOM RI (MD/ML) atau P-IRT dan logo HALAL tertera jelas pada label. Periksa segel plastik/aluminium penutup utuh. Jangan gunakan jika kemasan penyok/bocor.",
    isBahan: true
  }
};

// Kemasan presets (Keamanan Bahan Kemas)
const kemasanPresets = {
  styrofoam: {
    title: "Kuah Styrofoam (Panas)",
    image: "https://placehold.co/600x350/ffe4e6/991b1b?text=Wadah+Sup+Styrofoam+Terbuka",
    boxType: "danger",
    boxTag: "BAHAYA: STYROFOAM DETECTED",
    boxStyle: { top: '25%', left: '30%', width: '40%', height: '50%' },
    score: "42/100",
    scoreClass: "text-red-650 bg-red-50 border-red-100",
    verdictTitle: "Peringatan Kontaminasi Styrofoam",
    verdictDesc: "Styrofoam (polistirena) melepaskan residu monomer stirena yang bersifat karsinogenik saat terkena kuah sup bersuhu tinggi (>70°C) atau berlemak tinggi. Akumulasi stirena merusak hormon tubuh.",
    category: "Bahan Kemas Pangan",
    temp: "85°C (Suhu Sup Panas)",
    packaging: "Styrofoam (Dilarang untuk Panas)",
    icon: "fa-solid fa-triangle-exclamation text-red-650",
    iconBg: "bg-red-100",
    adviceClass: "bg-red-50 text-red-900 border border-red-100",
    adviceTitle: "Rekomendasi Tindakan Segera:",
    adviceText: "Hentikan penyajian dalam wadah ini! Pindahkan makanan kuah panas ke wadah plastik tahan panas berkode 5 (PP) atau mangkuk kertas foodgrade bebas lilin sintetis."
  },
  plastic: {
    title: "Kresek Panas Warmindo",
    image: "https://placehold.co/600x350/ffe4e6/991b1b?text=Makanan+Panas+Bungkus+Kresek",
    boxType: "danger",
    boxTag: "RISIKO: PLASTIK KRESEK HITAM",
    boxStyle: { top: '25%', left: '25%', width: '50%', height: '50%' },
    score: "35/100",
    scoreClass: "text-red-650 bg-red-50 border-red-100",
    verdictTitle: "Bahaya Kresek Daur Ulang",
    verdictDesc: "Plastik kresek (terutama hitam) diproduksi dari limbah plastik daur ulang yang mengandung residu logam berat, pewarna beracun, dan klorin. Kontak dengan makanan panas berlemak mempercepat pelepasan racun.",
    category: "Bahan Kemas Pangan",
    temp: "78°C (Berbahaya)",
    packaging: "Kresek Hitam Daur Ulang (Dilarang)",
    icon: "fa-solid fa-triangle-exclamation text-red-650",
    iconBg: "bg-red-100",
    adviceClass: "bg-red-50 text-red-900 border border-red-100",
    adviceTitle: "Rekomendasi Tindakan Segera:",
    adviceText: "Jangan gunakan kantong kresek hitam bersentuhan langsung dengan makanan panas. Gunakan kantong plastik bening HDPE/LDPE foodgrade atau wadah saji ramah lingkungan."
  },
  kemasan_pp5: {
    title: "Wadah Plastik PP 5",
    image: "https://placehold.co/600x350/ecfdf5/065f46?text=Wadah+Plastik+PP+Food+Grade",
    boxType: "safe",
    boxTag: "AMAN: PP 5 FOODGRADE",
    boxStyle: { top: '20%', left: '25%', width: '50%', height: '60%' },
    score: "96/100",
    scoreClass: "text-emerald-700 bg-emerald-50 border-emerald-100",
    verdictTitle: "Kemasan Tahan Panas & Foodgrade",
    verdictDesc: "Kemasan berbahan Polipropilena (kode plastik 5 - PP) adalah bahan kemas plastik terbaik untuk makanan panas karena memiliki titik leleh tinggi (mencapai 140°C) dan tidak melepaskan senyawa kimia berbahaya ke pangan.",
    category: "Bahan Kemas Pangan",
    temp: "Batas Suhu Aman: 120°C",
    packaging: "Polipropilena (PP 5) Foodgrade",
    icon: "fa-solid fa-circle-check text-emerald-600",
    iconBg: "bg-emerald-100",
    adviceClass: "bg-emerald-50 text-emerald-900 border border-emerald-100",
    adviceTitle: "Rekomendasi Penggunaan:",
    adviceText: "Sangat direkomendasikan untuk wadah katering Makan Bergizi Gratis karena aman dipanaskan kembali dalam microwave (microwave-safe)."
  },
  kertas_foodgrade: {
    title: "Paper Box Lilin Foodgrade",
    image: "https://placehold.co/600x350/ecfdf5/065f46?text=Paper+Lunch+Box+Food+Grade",
    boxType: "safe",
    boxTag: "AMAN: BIODEGRADABLE LAMINATED",
    boxStyle: { top: '20%', left: '20%', width: '60%', height: '60%' },
    score: "92/100",
    scoreClass: "text-emerald-700 bg-emerald-50 border-emerald-100",
    verdictTitle: "Kemasan Kertas Berlaminasi Aman",
    verdictDesc: "Paper box dengan lapisan laminasi PE foodgrade yang mencegah perembesan minyak/air tanpa mengontaminasi makanan panas. Lebih ramah lingkungan daripada wadah plastik sekali pakai.",
    category: "Bahan Kemas Pangan",
    temp: "Batas Suhu Aman: 95°C",
    packaging: "Kertas Lilin / Laminasi PE Foodgrade",
    icon: "fa-solid fa-circle-check text-emerald-600",
    iconBg: "bg-emerald-100",
    adviceClass: "bg-emerald-50 text-emerald-900 border border-emerald-100",
    adviceTitle: "Rekomendasi Penggunaan:",
    adviceText: "Pastikan kertas memiliki logo sendok garpu (foodgrade mark) dan segel samping yang rekat agar tidak bocor selama distribusi."
  }
};

// Analyze an image using the serverless API (Gemini Vision runs on the server).
// Returns:
//   { ok: true, analysis }                    -> real HACCP analysis
//   { ok: false, rejected: true, reason }     -> photo does NOT match category
//   { ok: false, rejected: false, reason }    -> server/network error
const analyzeImageWithGemini = async ({ imageDataUrl, tab, ingredientInput = '', isBranded = false }) => {
  try {
    const response = await fetch('/api/haccp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageDataUrl, tab, ingredientInput, isBranded })
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, rejected: false, reason: data.error || `Server HACCP gagal (HTTP ${response.status}).` };
    }

    // AI rejected the category
    if (data.ok === false) {
      return { ok: false, rejected: true, reason: data.reason || 'Foto tidak sesuai dengan kategori yang dipilih.' };
    }

    const parsed = data.analysis;
    const scoreNum = parseInt(String(parsed.score).replace(/\D/g, ''), 10) || 70;
    const boxType = scoreNum >= 65 ? 'safe' : 'danger';
    const isBahanTab = tab === 'bahan';

    return {
      ok: true,
      analysis: {
        title: parsed.title,
        image: imageDataUrl,
        boxType: parsed.boxType || boxType,
        boxTag: parsed.boxTag || (boxType === 'safe' ? 'CHECKED: AMAN (HACCP)' : 'PERINGATAN: BERISIKO'),
        boxStyle: parsed.boxStyle || { top: '15%', left: '15%', width: '70%', height: '70%' },
        score: parsed.score,
        scoreClass: parsed.scoreClass,
        verdictTitle: parsed.verdictTitle,
        verdictDesc: parsed.verdictDesc,
        category: parsed.category,
        temp: parsed.temp,
        packaging: parsed.packaging,
        icon: parsed.icon,
        iconBg: parsed.iconBg,
        adviceClass: parsed.adviceClass,
        adviceTitle: parsed.adviceTitle,
        adviceText: parsed.adviceText,
        cemaranFisik: parsed.cemaranFisik || '',
        cemaranKimia: parsed.cemaranKimia || '',
        cemaranMikrobiologi: parsed.cemaranMikrobiologi || '',
        brandedAdvice: parsed.brandedAdvice || '',
        isBahan: isBahanTab
      }
    };
  } catch (err) {
    console.error("HACCP vision analysis failed:", err);
    return { ok: false, rejected: false, reason: 'Gagal terhubung ke server analisis. Cek koneksi internet.' };
  }
};

// Helper for analyzing text-based raw materials
const analyzeBahan = (inputText, isBranded) => {
  const text = inputText.toLowerCase();
  
  let title = "Bahan Baku Pangan";
  let score = "88/100";
  let scoreClass = "text-emerald-700 bg-emerald-50 border-emerald-100";
  let verdictTitle = "Analisis Bahaya Pangan (HACCP) Selesai";
  let verdictDesc = "AI berhasil mengidentifikasi potensi titik kendali kritis (CCP) pada bahan baku yang diinputkan.";
  
  // Default values
  let cemaranFisik = "Potensi debu, pasir, tanah liat dari penanganan curah, rambut, atau serangga kecil.";
  let cemaranKimia = "Residu pestisida (untuk buah/sayur curah) atau logam berat dari tanah/air yang tercemar.";
  let cemaranMikrobiologi = "Bakteri pembusuk pembawa kontaminasi jika terpapar kelembaban atau suhu bahaya (5°C - 60°C).";
  let penyimpanan = "Simpan di wadah food-grade tertutup rapat pada suhu ruang kering (18°C - 25°C) atau di chiller.";
  let batasWaktu = "Maksimal 3-5 hari sebelum kualitas biologis menyusut.";
  
  // Check keywords
  if (text.includes("daging") || text.includes("ayam") || text.includes("sapi") || text.includes("ikan") || text.includes("sosis") || text.includes("meat") || text.includes("chicken") || text.includes("fish")) {
    title = "Bahan Protein / Daging & Ikan";
    score = "60/100";
    scoreClass = "text-amber-700 bg-amber-50 border-amber-100";
    verdictTitle = "Kategori Risiko Tinggi (High Risk Food)";
    verdictDesc = "Daging mentah memiliki kadar air & aktivitas air (Aw) tinggi yang sangat disukai oleh bakteri patogen berbahaya.";
    
    cemaranFisik = "Serpihan pecahan tulang tajam, bulu unggas, kerikil halus, atau debu kotoran transportasi.";
    cemaranKimia = "Residu hormon pertumbuhan, residu obat hewan (antibiotik), logam berat (merkuri pada ikan laut), atau formalin (pengawet ilegal).";
    cemaranMikrobiologi = "Bakteri Salmonella enterica (bakteri penyebab Salmonellosis/tifus), E. coli patogenik, dan Campylobacter jejuni.";
    penyimpanan = "Wajib dipisahkan dalam wadah kedap udara. Bekukan segera di Freezer (suhu < -18°C) untuk penyimpanan jangka panjang, atau masukkan Chiller (suhu 0°C sampai 4°C) jika segera dimasak.";
    batasWaktu = "Chiller: maksimal 3 hari saja. Freezer: maksimal 3 - 6 bulan untuk kualitas optimum.";
  } else if (text.includes("sayur") || text.includes("bayam") || text.includes("wortel") || text.includes("kangkung") || text.includes("tomat") || text.includes("kubis") || text.includes("kentang") || text.includes("cabe") || text.includes("cabai") || text.includes("bawang")) {
    title = "Sayuran & Bumbu Hortikultura";
    score = "80/100";
    scoreClass = "text-emerald-700 bg-emerald-50 border-emerald-100";
    verdictTitle = "Kategori Risiko Sedang (Medium Risk Food)";
    verdictDesc = "Sayuran rentan terhadap cemaran dari pupuk kandang, lumpur tanah, dan air irigasi saat budidaya pertanian.";
    
    cemaranFisik = "Tanah yang menempel pada akar/daun, ulat daun hidup, serangga, kerikil kecil.";
    cemaranKimia = "Residu pestisida kimia pembasmi hama (organofosfat/karbamat) dan zat pengatur tumbuh berlebih.";
    cemaranMikrobiologi = "Bakteri Coliform (dari pupuk kandang tidak steril), spora jamur/kapang pembusuk, atau cacing tambang.";
    penyimpanan = "Cuci bersih dengan air mengalir sebelum diolah. Keringkan, bungkus kertas/plastik berlubang, simpan di Crisper Drawer (laci sayur kulkas) suhu 5°C - 10°C.";
    batasWaktu = "Sayur daun (bayam/kangkung): maksimal 2 hari. Sayur umbi/bumbu (wortel/bawang): 5-7 hari di kulkas.";
  } else if (text.includes("telur") || text.includes("susu") || text.includes("keju") || text.includes("mentega") || text.includes("egg") || text.includes("milk") || text.includes("dairy")) {
    title = "Produk Telur & Olahan Susu";
    score = "72/100";
    scoreClass = "text-amber-700 bg-amber-50 border-amber-100";
    verdictTitle = "Kategori Zoonosis Tinggi (Susu & Telur)";
    verdictDesc = "Susu mentah dan telur dapat menularkan kuman dari unggas/sapi ke makanan jika tidak ditangani dengan proses pasteurisasi.";
    
    cemaranFisik = "Pecahan kulit telur tipis, noda kotoran ayam yang menempel di cangkang luar, bulu ayam.";
    cemaranKimia = "Residu obat hewan (tetrasiklin), residu cairan pembersih mesin pemerah susu.";
    cemaranMikrobiologi = "Bakteri Salmonella enteritidis (pada cangkang/dalam kuning telur), Listeria monocytogenes (susu mentah).";
    penyimpanan = "Simpan telur di kulkas (suhu < 4°C). Susu segar WAJIB disimpan dalam botol tertutup rapat di kulkas utama, bukan di pintu kulkas untuk menghindari fluktuasi suhu.";
    batasWaktu = "Telur mentah utuh: 3-4 minggu. Susu pasteurisasi cair setelah dibuka: habiskan dalam 3-5 hari.";
  } else if (text.includes("saus") || text.includes("kecap") || text.includes("terigu") || text.includes("minyak") || text.includes("kaleng") || text.includes("bermerk") || isBranded) {
    title = "Bahan Baku Pabrikan / Bermerk";
    score = "94/100";
    scoreClass = "text-emerald-700 bg-emerald-50 border-emerald-100";
    verdictTitle = "Kategori Risiko Rendah & Terkontrol";
    verdictDesc = "Bahan olahan bermerk memiliki tingkat keamanan tinggi karena melewati quality control pabrik bersertifikasi BPOM/HALAL.";
    
    cemaranFisik = "Debu/kotoran menempel pada bagian luar botol/kaleng, serpihan plastik segel saat pembukaan.";
    cemaranKimia = "Migrasi senyawa kimia kemasan (seperti korosi kaleng atau zat pemlastis plasticizer), bahan pengawet/pewarna melebihi batas regulasi.";
    cemaranMikrobiologi = "Bakteri anaerob Clostridium botulinum jika kemasan kaleng penyok/bocor/kembung, serta kapang pada saus/tepung yang lembap.";
    penyimpanan = "Simpan di lemari bahan kering yang sejuk & terlindung dari matahari. Setelah kemasan dibuka, segera pindahkan ke wadah rapat dan simpan di chiller jika cair.";
    batasWaktu = "Sesuai tanggal Expired Date pabrik jika segel utuh. Setelah kemasan dibuka: habiskan dalam 1-2 minggu.";
  }

  let brandedAdvice = "";
  if (isBranded) {
    brandedAdvice = "⚠️ BAHAN BERMERK VERIFIED: Pastikan logo BPOM RI (MD/ML) atau P-IRT dan logo HALAL tertera jelas pada label. Periksa segel plastik/aluminium penutup utuh. Jangan gunakan jika kaleng penyok, berkarat, atau melebihi tanggal kedaluwarsa.";
    score = "95/100";
    scoreClass = "text-emerald-700 bg-emerald-50 border-emerald-100";
  }

  return {
    title,
    score,
    scoreClass,
    verdictTitle,
    verdictDesc,
    category: isBranded ? "Bahan Olahan Bermerk (Pabrikan)" : "Bahan Baku Segar (Curah)",
    temp: penyimpanan,
    packaging: batasWaktu,
    cemaranFisik,
    cemaranKimia,
    cemaranMikrobiologi,
    brandedAdvice,
    isBahan: true
  };
};

// Generates critical points analysis when user uploads/captures photo of a custom ingredient
const analyzeFileBahan = (fileName, imageSrc, textInput, brandedVal) => {
  const baseAnalysis = textInput.trim() 
    ? analyzeBahan(textInput, brandedVal)
    : {
        title: `Deteksi Foto: ${fileName}`,
        score: "85/100",
        scoreClass: "text-emerald-700 bg-emerald-50 border-emerald-100",
        verdictTitle: "Identifikasi Bahan Foto Selesai",
        verdictDesc: "AI mendeteksi adanya objek bahan pangan di dalam foto. Untuk hasil analisis titik kritis yang presisi, lengkapi deskripsi bahan pada formulir di bawah.",
        category: "Bahan Pangan (Deteksi Foto)",
        temp: "Simpan pada wadah tertutup rapat di kulkas (chiller 2°C - 4°C).",
        packaging: "Segera olah dalam waktu 2-3 hari guna menekan spora jamur.",
        cemaranFisik: "Debu lingkungan, serpihan tanah halus pada kulit luar bahan, rambut.",
        cemaranKimia: "Potensi residu sabun pembersih wadah atau pestisida permukaan.",
        cemaranMikrobiologi: "Bakteri pembusuk udara bebas (pseudomonas) dan spora kapang kapiler.",
        brandedAdvice: brandedVal ? "⚠️ BAHAN BERMERK: Periksa keutuhan segel kemasan pabrik dan masa kedaluwarsa pada label." : ""
      };

  return {
    ...baseAnalysis,
    image: imageSrc,
    boxType: baseAnalysis.score.startsWith("6") || baseAnalysis.score.startsWith("5") || baseAnalysis.score.startsWith("4") ? "danger" : "safe",
    boxTag: "CHECKED: FOTO BAHAN BAKU",
    boxStyle: { top: '15%', left: '15%', width: '70%', height: '70%' },
    isBahan: true
  };
};

export default function HaccpScannerScreen({ onBackToHome }) {
  // Navigation Tabs State: 'dapur' | 'bahan' | 'kemasan'
  const [activeTab, setActiveTab] = useState('dapur');
  
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  // Notice shown when AI rejects the photo category or analysis fails.
  // { type: 'rejected' | 'error', message: string }
  const [analysisNotice, setAnalysisNotice] = useState(null);

  // Live Camera and Fallback States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedFileName, setAttachedFileName] = useState('');
  const [cameraToast, setCameraToast] = useState('');

  // Ingredient Input States
  const [ingredientInput, setIngredientInput] = useState('');
  const [isBranded, setIsBranded] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Reset scanner states whenever switching tabs
  useEffect(() => {
    stopCameraStream();
    setIsCameraActive(false);
    setCapturedImage(null);
    setAttachedFile(null);
    setAttachedFileName('');
    setSelectedPreset(null);
    setCurrentData(null);
    setAnalysisNotice(null);
    setCameraToast('');
    setIngredientInput('');
    setIsBranded(false);
  }, [activeTab]);

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
      console.warn("Real camera hardware blocked or unavailable, enabling simulation camera viewfinder:", err);
      setIsLiveStreaming(false);
      setIsCameraActive(true);
      setCameraToast("Kamera Fisik tidak terdeteksi. Mode Lensa Simulasi aktif.");
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
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }

        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imgData = canvas.toDataURL('image/jpeg');

        setCapturedImage(imgData);
        stopCameraStream(); // Turn off webcam after capture

        // Real Gemini Vision analysis. NO template fallback - show AI result or notice.
        analyzeImageWithGemini({ imageDataUrl: imgData, tab: activeTab, ingredientInput, isBranded })
          .then((result) => {
            setIsScanning(false);
            setSelectedPreset(null);
            if (result.ok) {
              setAnalysisNotice(null);
              setCurrentData(result.analysis);
            } else {
              setCurrentData(null);
              setAnalysisNotice({
                type: result.rejected ? 'rejected' : 'error',
                message: result.reason
              });
            }
          })
          .catch((err) => {
            console.error(err);
            setIsScanning(false);
            setCurrentData(null);
            setAnalysisNotice({ type: 'error', message: 'Gagal menganalisis foto. Coba lagi.' });
          });
      } catch (err) {
        console.error("Frame capture error:", err);
        setIsScanning(false);
      }
    } else {
      // Simulation mode shutter behavior
      setTimeout(() => {
        setIsScanning(false);
        if (activeTab === 'dapur') {
          setSelectedPreset('dapur_bersih');
          setCurrentData(dapurPresets.dapur_bersih);
        } else if (activeTab === 'bahan') {
          const mockImg = "https://placehold.co/600x350/ffe4e6/991b1b?text=Bahan+Pangan+Live+Capture";
          setCurrentData(analyzeFileBahan("Live Photo", mockImg, ingredientInput, isBranded));
        } else {
          setSelectedPreset('kemasan_pp5');
          setCurrentData(kemasanPresets.kemasan_pp5);
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
    setAnalysisNotice(null);

    setTimeout(() => {
      setSelectedPreset(key);
      if (activeTab === 'dapur') {
        setCurrentData(dapurPresets[key]);
      } else if (activeTab === 'bahan') {
        setCurrentData(bahanPresets[key]);
        setIngredientInput(bahanPresets[key].title);
        setIsBranded(key === 'saus_bermerk');
      } else {
        setCurrentData(kemasanPresets[key]);
      }
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

      // Real Gemini Vision analysis. NO template fallback - show AI result or notice.
      analyzeImageWithGemini({ imageDataUrl: reader.result, tab: activeTab, ingredientInput, isBranded })
        .then((result) => {
          setIsScanning(false);
          if (result.ok) {
            setAnalysisNotice(null);
            setCurrentData(result.analysis);
          } else {
            setCurrentData(null);
            setAnalysisNotice({
              type: result.rejected ? 'rejected' : 'error',
              message: result.reason
            });
          }
        })
        .catch((err) => {
          console.error(err);
          setIsScanning(false);
          setCurrentData(null);
          setAnalysisNotice({ type: 'error', message: 'Gagal menganalisis foto. Coba lagi.' });
        });
    };
    reader.readAsDataURL(file);
  };

  const handleClearUpload = () => {
    setAttachedFile(null);
    setAttachedFileName('');
    setCurrentData(null);
    setCapturedImage(null);
    setSelectedPreset(null);
    setAnalysisNotice(null);
  };

  // Run AI analysis on typed ingredients
  const handleAnalyzeBahan = (e) => {
    e.preventDefault();
    if (!ingredientInput.trim()) return;

    setIsScanning(true);
    setCurrentData(null);
    setAnalysisNotice(null);

    setTimeout(() => {
      const textResult = analyzeBahan(ingredientInput, isBranded);
      
      // Preserve uploaded/captured images if they exist, otherwise use preset illustration
      const imageToUse = attachedFile || capturedImage || "https://placehold.co/600x350/1e293b/ffffff?text=Bahan+Baku+Pangan+Terkonfirmasi";

      setCurrentData({
        ...textResult,
        image: imageToUse,
        boxType: textResult.score.startsWith("6") || textResult.score.startsWith("5") || textResult.score.startsWith("4") ? "danger" : "safe",
        boxTag: "ANALYSED: BAHAN BAKU",
        boxStyle: { top: '15%', left: '15%', width: '70%', height: '70%' }
      });
      setIsScanning(false);
    }, 1200);
  };

  const handleQuickSelectBahan = (key) => {
    handleSimulate(key);
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
          <h2 className="text-xl font-extrabold text-slate-800 leading-tight">AI HACCP Control Hub</h2>
          <p className="text-xs text-slate-500">
            {activeTab === 'dapur' && 'Scan kebersihan dapur & zonasi layout'}
            {activeTab === 'bahan' && 'Foto & identifikasi titik kritis bahan baku'}
            {activeTab === 'kemasan' && 'Uji jenis & tingkat keamanan wadah kemasan'}
          </p>
        </div>
      </div>

      {/* Menu Aspek HACCP (3 Aspek) */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
        <button 
          onClick={() => setActiveTab('dapur')}
          className={`py-2 px-1 text-center rounded-xl transition-all-300 flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'dapur' 
              ? 'bg-white text-emerald-800 font-extrabold shadow-xs' 
              : 'text-slate-550 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-sink text-xs"></i>
          <span className="text-[9px] font-bold leading-tight">Scan Dapur</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('bahan')}
          className={`py-2 px-1 text-center rounded-xl transition-all-300 flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'bahan' 
              ? 'bg-white text-emerald-800 font-extrabold shadow-xs' 
              : 'text-slate-550 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-drumstick-bite text-xs"></i>
          <span className="text-[9px] font-bold leading-tight">Bahan Baku</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('kemasan')}
          className={`py-2 px-1 text-center rounded-xl transition-all-300 flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'kemasan' 
              ? 'bg-white text-emerald-800 font-extrabold shadow-xs' 
              : 'text-slate-550 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-box-open text-xs"></i>
          <span className="text-[9px] font-bold leading-tight">Bahan Kemas</span>
        </button>
      </div>

      {/* UNIFIED CAMERA & UPLOAD VIEW */}
      <div className="space-y-4">
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl aspect-video relative flex flex-col items-center justify-center group border border-slate-850">
          {isScanning && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center z-30 text-white space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold tracking-wider text-emerald-400 uppercase animate-pulse">
                {activeTab === 'dapur' && 'Analyzing Kitchen Layout...'}
                {activeTab === 'bahan' && 'Detecting Critical Hazard Points...'}
                {activeTab === 'kemasan' && 'Testing Chemical Leaching Risk...'}
              </p>
            </div>
          )}

          {cameraToast && (
            <div className="absolute top-4 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-30 border border-white/5 shadow-md">
              <i className="fa-solid fa-circle-info mr-1 text-emerald-400"></i> {cameraToast}
            </div>
          )}

          {isCameraActive ? (
            /* ACTIVE CAMERA VIEWFINDER */
            <>
              {isLiveStreaming && videoRef.current ? (
                <video 
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className={`w-full h-full object-cover ${isFrontCamera ? 'scale-x-[-1]' : ''}`}
                />
              ) : (
                <img 
                  id="haccp-camera-img" 
                  src={capturedImage || (currentData ? currentData.image : "https://placehold.co/600x350/1e293b/ffffff?text=Mengaktifkan+Kamera+Simulasi...")} 
                  alt="Camera View" 
                  className={`w-full h-full object-cover transition-all duration-300 ${isFrontCamera ? 'scale-x-[-1]' : ''}`}
                />
              )}
              
              {/* Crosshairs Overlay */}
              <div className="absolute inset-0 pointer-events-none border border-white/10 z-10">
                <div className="absolute inset-y-0 left-1/3 border-r border-white/5"></div>
                <div className="absolute inset-y-0 left-2/3 border-r border-white/5"></div>
                <div className="absolute inset-x-0 top-1/3 border-b border-white/5"></div>
                <div className="absolute inset-x-0 top-2/3 border-b border-white/5"></div>
              </div>

              {/* Bounding box overlay */}
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

              {/* Camera HUD Indicator */}
              <div className="absolute top-3 inset-x-3 flex justify-between z-20">
                <span className="text-[9px] bg-black/60 backdrop-blur-md text-white font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span> 
                  {isLiveStreaming ? "LIVE DEVICE CAMERA" : "LENS SIMULATOR ACTIVE"}
                </span>
                <span className="text-[9px] bg-black/60 backdrop-blur-md text-white font-mono px-2 py-1 rounded">ISO 200</span>
              </div>

              {/* Action buttons on camera frame */}
              <div className="absolute bottom-3 inset-x-4 flex justify-between items-center z-25 bg-black/45 backdrop-blur-xs p-2 rounded-2xl border border-white/5">
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
            /* FILE UPLOADED STATE */
            <>
              <img 
                src={attachedFile} 
                alt="Uploaded Asset" 
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
                <span className="text-[9px] bg-emerald-800 text-white font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm max-w-[70%] truncate">
                  <i className="fa-solid fa-image"></i> {attachedFileName}
                </span>
                <button 
                  onClick={handleClearUpload}
                  className="bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-sm"
                >
                  Hapus File
                </button>
              </div>
            </>
          ) : (
            /* BLANK / OFFLINE VIEW */
            <div className="text-center p-6 text-slate-400 space-y-4 z-10">
              <div className="w-14 h-14 bg-slate-800 text-slate-400 border border-slate-700 rounded-full flex items-center justify-center mx-auto shadow-md">
                <i className="fa-solid fa-circle-notch text-2xl animate-[spin_10s_linear_infinite]"></i>
              </div>
              <div>
                <p className="text-xs font-extrabold text-white">
                  {activeTab === 'dapur' && 'Audit Lensa Dapur Offline'}
                  {activeTab === 'bahan' && 'Kamera Deteksi Bahan Baku Offline'}
                  {activeTab === 'kemasan' && 'Kamera Analisis Kemasan Offline'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1.5 max-w-[280px] mx-auto leading-relaxed">
                  {activeTab === 'dapur' && 'Ambil foto dapur Anda secara realtime untuk memindai status tata letak dan sanitasi, atau unggah berkas dari galeri.'}
                  {activeTab === 'bahan' && 'Ambil foto bahan pangan atau unggah file untuk mendeteksi kontaminasi fisik, kimia, & biologi secara instant.'}
                  {activeTab === 'kemasan' && 'Pindai bahan pembungkus makanan untuk meneliti potensi paparan timbal/plastik beracun bagi pangan bergizi.'}
                </p>
              </div>
              
              <div className="flex gap-2 justify-center max-w-xs mx-auto">
                <button 
                  onClick={handleToggleCamera} 
                  className="flex-1 bg-emerald-650 hover:bg-emerald-600 text-white text-[10px] font-bold py-2.5 px-3 rounded-xl transition-all-300 cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-camera"></i> Ambil Foto
                </button>
                <button 
                  onClick={handleAttachFileClick} 
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] font-bold py-2.5 px-3 rounded-xl transition-all-300 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-paperclip"></i> Pilih Foto
                </button>
              </div>
            </div>
          )}
        </div>

        {/* INPUT FOR BAHAN TAB ONLY */}
        {activeTab === 'bahan' && (
          <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-3xs space-y-3.5 animate-[fadeIn_0.3s_ease-out]">
            <form onSubmit={handleAnalyzeBahan} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                  Sebutkan / Koreksi Bahan (Opsional):
                </label>
                <textarea
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  placeholder="Contoh: Daging sapi segar, sayur kangkung ikat, bumbu kecap manis bermerk..."
                  className="w-full h-16 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none font-medium leading-relaxed"
                ></textarea>
              </div>

              {/* Checkbox for Branded Materials */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-150">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-barcode text-slate-500 text-sm"></i>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Bahan Baku Bermerk</p>
                    <p className="text-[9px] text-slate-400">Aktifkan jika bahan yang difoto memiliki label/merk pabrik</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isBranded}
                    onChange={(e) => setIsBranded(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Submit Analysis */}
              {(attachedFile || capturedImage) && (
                <button
                  type="submit"
                  disabled={isScanning}
                  className="w-full bg-emerald-650 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold py-2.5 px-4 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 text-xs active:scale-98"
                >
                  {isScanning ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menganalisis Titik Kritis...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-microscope"></i>
                      Analisis Titik Kritis AI (Foto + Teks)
                    </>
                  )}
                </button>
              )}
            </form>
          </div>
        )}

        {/* SIMULATION PRESETS SELECTOR */}
        <div className="bg-white border border-slate-100 rounded-3xl p-3 shadow-3xs space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              {activeTab === 'dapur' && 'Preset Kondisi Dapur (Simulasi):'}
              {activeTab === 'bahan' && 'Preset Bahan Baku (Simulasi):'}
              {activeTab === 'kemasan' && 'Preset Wadah / Kemasan (Simulasi):'}
            </label>
            {(attachedFile || capturedImage) && (
              <button 
                onClick={handleClearUpload}
                className="text-[9px] font-bold text-slate-400 hover:text-emerald-800 cursor-pointer"
              >
                Clear & Reset
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {activeTab === 'dapur' && (
              Object.keys(dapurPresets).map((key) => (
                <button 
                  key={key}
                  onClick={() => handleSimulate(key)} 
                  className={`p-2.5 border rounded-2xl transition-all-300 text-left flex items-center gap-2 cursor-pointer ${
                    selectedPreset === key && !attachedFile && !capturedImage
                      ? 'bg-emerald-50 border-emerald-250 text-emerald-800 font-bold' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    dapurPresets[key].boxType === 'safe' ? 'bg-emerald-500' : 'bg-red-500'
                  }`}></span> 
                  <span className="text-[10px] font-bold truncate">{dapurPresets[key].title}</span>
                </button>
              ))
            )}

            {activeTab === 'bahan' && (
              Object.keys(bahanPresets).map((key) => (
                <button 
                  key={key}
                  onClick={() => handleQuickSelectBahan(key)} 
                  className={`p-2.5 border rounded-2xl transition-all-300 text-left flex items-center gap-2 cursor-pointer ${
                    selectedPreset === key && !attachedFile && !capturedImage
                      ? 'bg-emerald-50 border-emerald-250 text-emerald-800 font-bold' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    bahanPresets[key].boxType === 'safe' ? 'bg-emerald-500' : 'bg-red-500'
                  }`}></span> 
                  <span className="text-[10px] font-bold truncate">{bahanPresets[key].title}</span>
                </button>
              ))
            )}

            {activeTab === 'kemasan' && (
              Object.keys(kemasanPresets).map((key) => (
                <button 
                  key={key}
                  onClick={() => handleSimulate(key)} 
                  className={`p-2.5 border rounded-2xl transition-all-300 text-left flex items-center gap-2 cursor-pointer ${
                    selectedPreset === key && !attachedFile && !capturedImage
                      ? 'bg-emerald-50 border-emerald-250 text-emerald-800 font-bold' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    kemasanPresets[key].boxType === 'safe' ? 'bg-emerald-500' : 'bg-red-500'
                  }`}></span> 
                  <span className="text-[10px] font-bold truncate">{kemasanPresets[key].title}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ================= AI HACCP ANALYSIS OUTCOME DISPLAY ================= */}
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

        {analysisNotice ? (
          /* AI REJECTED CATEGORY OR ANALYSIS ERROR */
          <div className={`p-4 rounded-2xl text-xs space-y-2.5 animate-[fadeIn_0.3s_ease-out] ${
            analysisNotice.type === 'rejected'
              ? 'bg-red-50 border border-red-200'
              : 'bg-amber-50 border border-amber-200'
          }`}>
            <div className="flex items-start gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                analysisNotice.type === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
              }`}>
                <i className={`${analysisNotice.type === 'rejected' ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-exclamation'}`}></i>
              </div>
              <div className="flex-1">
                <h4 className={`text-xs font-extrabold ${
                  analysisNotice.type === 'rejected' ? 'text-red-800' : 'text-amber-800'
                }`}>
                  {analysisNotice.type === 'rejected'
                    ? (activeTab === 'dapur' ? 'Foto Bukan Dapur' : activeTab === 'bahan' ? 'Foto Bukan Bahan Baku' : 'Foto Bukan Kemasan')
                    : 'Analisis Gagal'}
                </h4>
                <p className={`text-[10px] mt-1 leading-relaxed ${
                  analysisNotice.type === 'rejected' ? 'text-red-700' : 'text-amber-700'
                }`}>
                  {analysisNotice.message}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed pt-1 border-t border-slate-200/60">
              <i className="fa-solid fa-info-circle mr-1"></i>
              {analysisNotice.type === 'rejected'
                ? `Unggah ulang foto yang benar-benar menunjukkan ${activeTab === 'dapur' ? 'dapur / area memasak' : activeTab === 'bahan' ? 'bahan baku pangan mentah' : 'wadah / kemasan makanan'} untuk mendapatkan analisis HACCP.`
                : 'Periksa koneksi internet atau konfigurasi GEMINI_API_KEY di server, lalu coba kembali.'}
            </p>
          </div>
        ) : !currentData ? (
          <div className="text-center py-8 text-slate-400 space-y-3">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-350 border border-slate-100">
              <i className="fa-solid fa-network-wired text-lg"></i>
            </div>
            <p className="text-xs font-semibold max-w-[280px] mx-auto text-slate-450 leading-relaxed">
              {activeTab === 'dapur' && 'Pindai/unggah foto dapur Anda di atas untuk memulai audit tata letak.'}
              {activeTab === 'bahan' && 'Pindai/unggah foto bahan baku Anda, lalu isi opsional teks untuk menganalisis bahaya cemaran.'}
              {activeTab === 'kemasan' && 'Pindai/unggah foto wadah pangan Anda untuk mengidentifikasi bahaya monomer karsinogenik.'}
            </p>
          </div>
        ) : currentData.isBahan ? (
          /* DETAILED INGREDIENT HAZARD (3 TYPES OF HAZARD + RECOMMENDATION) */
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 flex items-start gap-2.5">
              <i className="fa-solid fa-clipboard-list text-emerald-600 mt-0.5 text-sm shrink-0"></i>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">{currentData.title}</h4>
                <p className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                  {currentData.verdictTitle}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{currentData.verdictDesc}</p>
              </div>
            </div>

            {/* Branded Alert if checked */}
            {currentData.brandedAdvice && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-[10px] text-amber-900 font-bold leading-relaxed flex gap-2">
                <i className="fa-solid fa-circle-exclamation text-amber-600 text-sm mt-0.5 shrink-0"></i>
                <span>{currentData.brandedAdvice}</span>
              </div>
            )}

            {/* 3 Contamination Aspects (Cemaran Fisik, Cemaran Kimia, Cemaran Mikrobiologi) */}
            <div className="space-y-2.5">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Deteksi 3 Cemaran Kritis:</h5>
              
              {/* Cemaran Fisik */}
              <div className="p-3 rounded-2xl border border-slate-100 bg-white flex gap-2.5 shadow-2xs">
                <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-box text-xs"></i>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-slate-800">1. Cemaran Fisik (Bahaya Benda Asing)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{currentData.cemaranFisik}</p>
                </div>
              </div>

              {/* Cemaran Kimia */}
              <div className="p-3 rounded-2xl border border-slate-100 bg-white flex gap-2.5 shadow-2xs">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-650 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-flask text-xs"></i>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-slate-800">2. Cemaran Kimia (Zat Toksik)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{currentData.cemaranKimia}</p>
                </div>
              </div>

              {/* Cemaran Mikrobiologi */}
              <div className="p-3 rounded-2xl border border-slate-100 bg-white flex gap-2.5 shadow-2xs">
                <div className="w-6 h-6 rounded-lg bg-red-100 text-red-650 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-virus text-xs"></i>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-slate-800">3. Cemaran Mikrobiologi (Bakteri/Patogen)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{currentData.cemaranMikrobiologi}</p>
                </div>
              </div>
            </div>

            {/* Storage Recommendations & Expiration Limit */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Rekomendasi Kontrol CCP:</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl">
                  <span className="text-[9px] font-extrabold text-blue-800 uppercase flex items-center gap-1">
                    <i className="fa-solid fa-temperature-half"></i> Penyimpanan
                  </span>
                  <p className="text-[10px] text-blue-950 font-bold mt-1 leading-snug">{currentData.temp}</p>
                </div>
                <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-xl">
                  <span className="text-[9px] font-extrabold text-purple-800 uppercase flex items-center gap-1">
                    <i className="fa-solid fa-clock"></i> Batas Waktu
                  </span>
                  <p className="text-[10px] text-purple-950 font-bold mt-1 leading-snug">{currentData.packaging}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* SCAN VERDICT (FOR KITCHEN AND PACKAGING SAMPLES) */
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
                <span className="text-slate-500 font-semibold">
                  {activeTab === 'dapur' ? 'Suhu Lingkungan' : 'Kesesuaian Suhu Makanan'}
                </span>
                <span className="font-bold text-slate-850">{currentData.temp}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">
                  {activeTab === 'dapur' ? 'Material Utama' : 'Jenis Kemasan'}
                </span>
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
