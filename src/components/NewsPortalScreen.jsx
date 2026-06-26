import React, { useState, useEffect } from 'react';

const ALL_ARTICLES = [
  {
    id: 1,
    title: "WHO Rilis Pedoman Baru Gizi Anak Sekolah 2026",
    desc: "Membatasi konsumsi gula tambahan dan lemak jenuh di kantin sekolah seluruh dunia untuk menekan laju obesitas anak.",
    image: "/images/who_school_meal.jpg",
    tag: "GIZI GLOBAL",
    tagColor: "bg-emerald-600 text-emerald-50",
    category: "berita",
    scope: "global",
    time: "Baru Saja",
    author: "Dr. Maria Santos (WHO)",
    fullText: [
      "Organisasi Kesehatan Dunia (WHO) secara resmi merilis panduan gizi anak sekolah tahun 2026. Panduan ini menekankan pentingnya pembatasan gula tambahan hingga maksimal 5% dari total kalori harian dan pengurangan lemak jenuh.",
      "Langkah ini diambil untuk menekan angka obesitas anak global yang meningkat tajam. WHO menyarankan penyedia katering sekolah menyajikan setidaknya 400g buah dan sayuran segar per anak setiap hari.",
      "Penerapan ini diharapkan diadopsi oleh negara-negara berkembang guna mengarahkan penyediaan makanan bergizi gratis yang rendah garam dan tinggi serat mikronutrien."
    ]
  },
  {
    id: 2,
    title: "Modifikasi Resep Capcay Nutrisi Tinggi Dapur Solo",
    desc: "Strategi Dapur MBG Solo memaksimalkan serat sayuran hijau dengan pengadaan bahan baku lokal Boyolali yang terjangkau.",
    image: "/images/capcay_dish.jpg",
    tag: "RESEP LOKAL",
    tagColor: "bg-amber-600 text-amber-50",
    category: "resep",
    scope: "lokal",
    time: "15 Menit Lalu",
    author: "Chef Amir (Dapur MBG)",
    fullText: [
      "Dapur Masak Program Makan Bergizi Gratis (MBG) di Solo sukses menciptakan resep modifikasi capcay dengan kandungan serat tinggi.",
      "Dengan menggunakan kombinasi wortel lokal Boyolali, kembang kol, sawi hijau, dan suwiran ayam sisa pengadaan blockchain, resep ini terbukti disukai anak-anak sekolah dasar. Menu ini menyuplai vitamin A dan C harian secara optimal.",
      "Modifikasi terletak pada teknik penumisan cepat (stir-fry) untuk meminimalkan kerusakan vitamin larut air pada sayuran."
    ]
  },
  {
    id: 3,
    title: "Mengapa Suhu Inti Daging Harus Mencapai 74°C?",
    desc: "Panduan praktis penggunaan termometer tusuk di dapur massal katering skala besar demi menghindari keracunan massal.",
    image: "/images/meat_thermometer.jpg",
    tag: "TIPS GLOBAL",
    tagColor: "bg-blue-600 text-blue-50",
    category: "tips",
    scope: "global",
    time: "2 Jam Lalu",
    author: "HACCP Safety Board",
    fullText: [
      "Dalam dapur katering skala besar, kontaminasi bakteri patogen seperti Salmonella dan E. coli pada daging adalah risiko kritis. Memastikan suhu inti daging matang sempurna sangat penting.",
      "Menggunakan thermometer tusuk untuk memverifikasi suhu inti daging mencapai minimal 74°C (165°F) selama 15 detik adalah keharusan standar HACCP global.",
      "Lakukan penusukan sensor termal di bagian daging paling tebal tanpa menyentuh tulang untuk mendapatkan pembacaan yang akurat dan aman sebelum disajikan."
    ]
  },
  {
    id: 4,
    title: "Bahaya Senyawa Akrilamida Saat Menggoreng Tepung",
    desc: "Menggoreng karbohidrat terlalu panas memicu terbentuknya senyawa akrilamida yang berpotensi karsinogen bagi tubuh.",
    image: "/images/crispy_potatoes.jpg",
    tag: "EDUKASI GLOBAL",
    tagColor: "bg-red-600 text-red-50",
    category: "edukasi",
    scope: "global",
    time: "4 Jam Lalu",
    author: "Global Food Watch",
    fullText: [
      "Akrilamida adalah senyawa kimia berbahaya yang dapat terbentuk pada makanan berkarbohidrat tinggi (seperti kentang atau adonan tepung) ketika digoreng atau dipanggang pada suhu tinggi (>120°C).",
      "Untuk mengurangi pembentukan zat beracun ini, para ahli gizi menyarankan agar tidak menggoreng kentang sampai berwarna cokelat pekat (cukup kuning keemasan).",
      "Merendam kentang di air hangat sebelum dimasak dan beralih ke metode alternatif seperti mengukus atau merebus akan jauh lebih aman bagi kesehatan jangka panjang."
    ]
  },
  {
    id: 5,
    title: "Distribusi Sayur Panen Sragen Capai Dapur Dalam 4 Jam",
    desc: "Pencatatan rantai pasok blockchain berhasil memangkas waktu distribusi sayuran dari Sragen menuju dapur massal di Solo.",
    image: "/images/blockchain_sragen.jpg",
    tag: "BERITA LOKAL",
    tagColor: "bg-teal-600 text-teal-50",
    category: "berita",
    scope: "lokal",
    time: "Hari Ini",
    author: "AgroTech Indonesia",
    fullText: [
      "Rantai pasok sayuran segar dari lahan organik di Sragen menuju dapur katering sekolah di Solo kini terpangkas signifikan berkat pencatatan logistik blockchain.",
      "Sayuran yang dipanen pukul 5 pagi dapat didistribusikan dan diolah di dapur massal pada pukul 9 pagi, menjaga kesegaran nutrisi mikro seperti folat dan vitamin C yang sensitif terhadap waktu.",
      "Sistem ini terbukti meningkatkan kepuasan para petani lokal karena pembayaran adil yang langsung dicairkan tanpa tengkulak."
    ]
  },
  {
    id: 6,
    title: "Panduan Menyusun Manajemen Stok FIFO Dapur Katering",
    desc: "Mencegah pembusukan bahan pangan massal dengan pelabelan tanggal kedatangan dan aturan suhu penyimpanan yang ketat.",
    image: "/images/fifo_inventory.jpg",
    tag: "TIPS GLOBAL",
    tagColor: "bg-indigo-600 text-indigo-50",
    category: "tips",
    scope: "global",
    time: "Kemarin",
    author: "Logistics Expert team",
    fullText: [
      "Mengelola inventaris bahan pangan segar dalam volume besar membutuhkan kedisiplinan tinggi. Dapur wajib menerapkan sistem FIFO (First-In First-Out) dengan memberi label tanggal kedatangan pada setiap bahan.",
      "Selain itu, penyimpanan sayuran hijau harus diatur pada chiller bersuhu 4°C - 7°C, sementara daging mentah wajib disimpan terpisah di freezer bersuhu minimal -18°C untuk menghentikan replikasi mikroba pembusuk.",
      "Audit harian stok sebelum memulai memasak dapat menekan angka kerugian sisa bahan makanan hingga 30%."
    ]
  },
  {
    id: 7,
    title: "Khasiat Gizi Tempe Lokal Sebagai Prebiotik Pencernaan",
    desc: "Proses fermentasi Rhizopus oligosporus memecah fitat dan membuat protein kedelai lebih gampang diserap pencernaan.",
    image: "/images/tempe_superfood.jpg",
    tag: "EDUKASI LOKAL",
    tagColor: "bg-fuchsia-600 text-fuchsia-50",
    category: "edukasi",
    scope: "lokal",
    time: "2 Hari Lalu",
    author: "Balitbang Gizi Nasional",
    fullText: [
      "Tempe tidak hanya murah, tetapi juga kaya protein berkualitas tinggi dan asam amino esensial yang setara dengan protein hewani.",
      "Proses fermentasi kacang kedelai oleh jamur Rhizopus oligosporus memecah fitat dan membuat nutrisi di dalamnya jauh lebih mudah diserap oleh tubuh manusia dibandingkan kedelai rebus biasa.",
      "Tempe juga kaya serat makanan larut air yang mendukung keragaman mikrobioma usus anak-anak, mengoptimalkan daya tahan tubuh alami mereka."
    ]
  },
  {
    id: 8,
    title: "Resep Kolak Pisang & Jahe Bakar Gula Aren Alami",
    desc: "Menu penutup bergizi tinggi menggunakan jahe emprit dan gula aren asli Boyolali untuk mencegah anemia.",
    image: "/images/kolak_boyolali.jpg",
    tag: "RESEP LOKAL",
    tagColor: "bg-lime-600 text-lime-50",
    category: "resep",
    scope: "lokal",
    time: "3 Hari Lalu",
    author: "Dapur Ibu Rahayu",
    fullText: [
      "Menu penutup bergizi tinggi ini dibuat dengan merebus kacang hijau hingga pecah merekah, lalu ditambahkan jahe bakar geprek untuk aroma hangat, santan encer segar, dan pemanis alami berupa sisiran gula aren murni.",
      "Kacang hijau kaya zat besi dan magnesium, menjadikannya pilihan makanan tambahan yang ideal guna mencegah anemia pada anak sekolah.",
      "Jahe bakar memberikan efek antiseptik dan melegakan tenggorokan koki dapur yang lelah."
    ]
  }
];

export default function NewsPortalScreen({ initialArticle, onBackToHome }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [selectedScope, setSelectedScope] = useState('semua');
  const [activeArticle, setActiveArticle] = useState(initialArticle || null);
  const [savedArticles, setSavedArticles] = useState([]);

  // Sync with initialArticle prop changes if any
  useEffect(() => {
    if (initialArticle) {
      setActiveArticle(initialArticle);
    }
  }, [initialArticle]);

  // Filter articles based on input states
  const filteredArticles = ALL_ARTICLES.filter(article => {
    const matchesCategory = selectedCategory === 'semua' || article.category === selectedCategory;
    const matchesScope = selectedScope === 'semua' || article.scope === selectedScope;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.tag.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesScope && matchesSearch;
  });

  const handleToggleSave = (id) => {
    if (savedArticles.includes(id)) {
      setSavedArticles(prev => prev.filter(aId => aId !== id));
    } else {
      setSavedArticles(prev => [...prev, id]);
    }
  };

  return (
    <div id="screen-news-portal" className="h-full flex flex-col bg-slate-50 animate-[fadeIn_0.3s_ease-out]">
      {/* Header bar */}
      <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={activeArticle ? () => setActiveArticle(null) : onBackToHome} 
            className="p-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-full transition-all-300 cursor-pointer h-10 w-10 flex items-center justify-center border border-slate-100"
            title="Kembali"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-800">
              {activeArticle ? "Detail Artikel" : "Portal Edukasi & Gizi"}
            </h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              {activeArticle ? activeArticle.author : "Edukasi Global & Berita Panganin"}
            </p>
          </div>
        </div>

        {!activeArticle && (
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full border border-emerald-200 animate-pulse">
            <i className="fa-solid fa-signal mr-1"></i> LIVE FEED
          </span>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-16">
        
        {activeArticle ? (
          /* READ ARTICLE VIEW */
          <article className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="h-48 rounded-3xl overflow-hidden relative shadow-sm">
              <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md ${activeArticle.tagColor}`}>
                  {activeArticle.tag}
                </span>
                <span className="bg-slate-900/75 backdrop-blur-md text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md font-mono">
                  {activeArticle.scope.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] text-slate-450 font-bold font-mono">
                <span>Diposting: {activeArticle.time}</span>
                <span>Penulis: {activeArticle.author}</span>
              </div>
              <h2 className="text-base font-black text-slate-850 leading-snug">
                {activeArticle.title}
              </h2>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-medium bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs">
              {activeArticle.fullText.map((p, index) => (
                <p key={index}>{p}</p>
              ))}
            </div>

            {/* Share & Save Interactive Bar */}
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => handleToggleSave(activeArticle.id)}
                className={`flex-1 h-12 rounded-2xl text-xs font-bold transition-all-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                  savedArticles.includes(activeArticle.id)
                    ? 'bg-amber-100 text-amber-900 border border-amber-250'
                    : 'bg-white text-slate-750 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <i className={`fa-solid fa-bookmark ${savedArticles.includes(activeArticle.id) ? 'text-amber-600' : ''}`}></i> 
                {savedArticles.includes(activeArticle.id) ? 'Tersimpan' : 'Simpan Artikel'}
              </button>
              <button 
                onClick={() => alert(`Tautan artikel "${activeArticle.title}" disalin ke papan klip!`)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-12 px-6 rounded-2xl transition-all-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-md shadow-emerald-600/10"
              >
                <i className="fa-solid fa-share-nodes"></i> Bagikan
              </button>
            </div>
          </article>
        ) : (
          /* ARTICLES DIRECTORY VIEW */
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <i className="fa-solid fa-magnifying-glass text-xs"></i>
              </span>
              <input 
                type="text" 
                placeholder="Cari berita gizi, resep, atau tips..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-9 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent shadow-3xs"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Bersihkan Pencarian"
                >
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              )}
            </div>

            {/* Scope selection tabs (Semua, Lokal, Global) */}
            <div className="flex bg-slate-200/80 rounded-2xl p-1 text-[10px] font-bold border border-slate-200/40">
              <button 
                onClick={() => setSelectedScope('semua')}
                className={`flex-1 py-2 rounded-xl text-center cursor-pointer transition-all-300 ${
                  selectedScope === 'semua' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-555 hover:text-slate-800'
                }`}
              >
                Semua Cakupan
              </button>
              <button 
                onClick={() => setSelectedScope('lokal')}
                className={`flex-1 py-2 rounded-xl text-center cursor-pointer transition-all-300 ${
                  selectedScope === 'lokal' ? 'bg-emerald-650 text-white shadow-3xs' : 'text-slate-555 hover:text-slate-800'
                }`}
              >
                Lokal (Indonesia)
              </button>
              <button 
                onClick={() => setSelectedScope('global')}
                className={`flex-1 py-2 rounded-xl text-center cursor-pointer transition-all-300 ${
                  selectedScope === 'global' ? 'bg-emerald-650 text-white shadow-3xs' : 'text-slate-555 hover:text-slate-800'
                }`}
              >
                Global (Mancanegara)
              </button>
            </div>

            {/* Category selection chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {['semua', 'edukasi', 'berita', 'resep', 'tips'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)} 
                  className={`text-[10px] font-bold px-3.5 py-1.8 rounded-full border transition-all-305 shrink-0 cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs' 
                      : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'semua' ? 'SEMUA' : cat === 'tips' ? 'TIPS & TRICK' : cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Results metadata */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-extrabold tracking-wider px-1">
              <span>DITEMUKAN {filteredArticles.length} ARTIKEL</span>
              {savedArticles.length > 0 && (
                <span className="text-amber-600 flex items-center gap-1">
                  <i className="fa-solid fa-bookmark"></i> {savedArticles.length} TERSIMPAN
                </span>
              )}
            </div>

            {/* Articles vertical stack */}
            <div className="space-y-3">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12 bg-white border border-slate-100 rounded-3xl text-slate-450 space-y-2">
                  <i className="fa-regular fa-newspaper text-3xl opacity-40"></i>
                  <p className="text-xs font-bold">Tidak ada artikel yang cocok dengan filter Anda.</p>
                </div>
              ) : (
                filteredArticles.map(article => (
                  <div 
                    key={article.id}
                    onClick={() => setActiveArticle(article)}
                    className="bg-white border border-slate-100 rounded-3xl p-3 flex gap-3 shadow-3xs cursor-pointer hover:border-emerald-250 transition-all duration-300 group animate-[fadeIn_0.2s_ease-out]"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100 relative">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[7px] font-extrabold px-1.5 py-0.5 rounded-sm">
                        {article.scope === 'lokal' ? 'ID' : 'WW'}
                      </span>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm ${article.tagColor}`}>
                            {article.tag}
                          </span>
                          <span className="text-[8px] font-bold text-slate-400 font-mono">{article.time}</span>
                        </div>
                        <h4 className="text-xs font-extrabold text-slate-800 leading-snug mt-1.5 group-hover:text-emerald-800 transition-colors duration-300 truncate">
                          {article.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mt-0.5 font-medium">
                          {article.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
