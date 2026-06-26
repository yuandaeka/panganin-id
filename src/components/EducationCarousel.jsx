import React from 'react';

const carouselArticles = [
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
  }
];

export default function EducationCarousel({ onViewAll, onSelectArticle }) {
  return (
    <div className="space-y-3">
      {/* Title Header with interactive stats and "Lebih Lanjut" Action Link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <h3 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">Realtime Feed & Berita Gizi</h3>
        </div>
        <button 
          onClick={onViewAll} 
          className="text-[10.5px] font-black text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 hover:text-emerald-800 px-3 py-1 rounded-full border border-emerald-100/50 shadow-3xs cursor-pointer transition-all-300 active:scale-95 flex items-center gap-1"
        >
          Lebih Lanjut <i className="fa-solid fa-arrow-right text-[9px]"></i>
        </button>
      </div>
      
      {/* Horizontal scrolling news carousel displaying 4 items */}
      <div className="flex gap-4 overflow-x-auto pb-3 snap-x scroll-smooth no-scrollbar">
        {carouselArticles.map(slide => (
          <div 
            key={slide.id} 
            onClick={() => onSelectArticle(slide)}
            className="flex-shrink-0 w-72 bg-white border border-slate-100 rounded-3xl p-3 snap-start shadow-sm hover:shadow-md transition-all-300 space-y-3 cursor-pointer group hover:border-emerald-100"
          >
            <div className="h-28 rounded-2xl overflow-hidden relative">
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 inset-x-2 flex justify-between items-center">
                <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm ${slide.tagColor}`}>
                  {slide.tag}
                </span>
                <span className="bg-black/50 backdrop-blur-md text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold font-mono">
                  {slide.time}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-slate-800 leading-snug group-hover:text-emerald-800 transition-colors duration-300">
                {slide.title}
              </h4>
              <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{slide.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
