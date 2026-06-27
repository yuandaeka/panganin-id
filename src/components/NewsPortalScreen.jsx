import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ALL_ARTICLES } from '../data/articles';

export default function NewsPortalScreen({ initialArticle, onBackToHome }) {
  const { language } = useLanguage();
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

  // Translate helpers for article attributes
  const getArticleText = (article) => {
    if (!article) return { title: '', desc: '', tag: '', fullText: [] };
    return {
      title: article.title[language] || article.title['id'],
      desc: article.desc[language] || article.desc['id'],
      tag: article.tag[language] || article.tag['id'],
      fullText: article.fullText[language] || article.fullText['id']
    };
  };

  // Filter articles based on input states and translated texts
  const filteredArticles = ALL_ARTICLES.filter(article => {
    const texts = getArticleText(article);
    const matchesCategory = selectedCategory === 'semua' || article.category === selectedCategory;
    const matchesScope = selectedScope === 'semua' || article.scope === selectedScope;
    const matchesSearch = texts.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          texts.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          texts.tag.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesScope && matchesSearch;
  });

  const handleToggleSave = (id) => {
    if (savedArticles.includes(id)) {
      setSavedArticles(prev => prev.filter(aId => aId !== id));
    } else {
      setSavedArticles(prev => [...prev, id]);
    }
  };

  const activeTexts = getArticleText(activeArticle);

  return (
    <div id="screen-news-portal" className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 animate-[fadeIn_0.3s_ease-out]">
      {/* Header bar */}
      <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-850 sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={activeArticle ? () => setActiveArticle(null) : onBackToHome} 
            className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-350 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-full transition-all-300 cursor-pointer h-10 w-10 flex items-center justify-center border border-slate-100 dark:border-slate-800"
            title={language === 'en' ? "Back" : "Kembali"}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-800 dark:text-white">
              {activeArticle 
                ? (language === 'en' ? "Article Details" : "Detail Artikel") 
                : (language === 'en' ? "Education & Nutrition Portal" : "Portal Edukasi & Gizi")}
            </h2>
            <p className="text-[9px] text-slate-500 dark:text-slate-450 font-bold uppercase tracking-wider">
              {activeArticle 
                ? activeArticle.author 
                : (language === 'en' ? "Global Education & Panganin News" : "Edukasi Global & Berita Panganin")}
            </p>
          </div>
        </div>

        {!activeArticle && (
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-extrabold px-2.5 py-1 rounded-full border border-emerald-250 dark:border-emerald-900 animate-pulse">
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
              <img src={activeArticle.image} alt={activeTexts.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md ${activeArticle.tagColor}`}>
                  {activeTexts.tag}
                </span>
                <span className="bg-slate-900/75 backdrop-blur-md text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md font-mono">
                  {activeArticle.scope.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] text-slate-450 dark:text-slate-400 font-bold font-mono">
                <span>{language === 'en' ? 'Posted' : 'Diposting'}: {activeArticle.time}</span>
                <span>{language === 'en' ? 'Author' : 'Penulis'}: {activeArticle.author}</span>
              </div>
              <h2 className="text-base font-black text-slate-850 dark:text-white leading-snug">
                {activeTexts.title}
              </h2>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-3xs">
              {activeTexts.fullText.map((p, index) => (
                <p key={index}>{p}</p>
              ))}
            </div>

            {/* Share & Save Interactive Bar */}
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => handleToggleSave(activeArticle.id)}
                className={`flex-1 h-12 rounded-2xl text-xs font-bold transition-all-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                  savedArticles.includes(activeArticle.id)
                    ? 'bg-amber-100 dark:bg-amber-955 text-amber-900 dark:text-amber-300 border border-amber-250 dark:border-amber-900'
                    : 'bg-white dark:bg-slate-800 text-slate-750 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <i className={`fa-solid fa-bookmark ${savedArticles.includes(activeArticle.id) ? 'text-amber-600' : ''}`}></i> 
                {savedArticles.includes(activeArticle.id) 
                  ? (language === 'en' ? 'Saved' : 'Tersimpan') 
                  : (language === 'en' ? 'Save Article' : 'Simpan Artikel')}
              </button>
              <button 
                onClick={() => alert(language === 'en' ? `Article link "${activeTexts.title}" copied to clipboard!` : `Tautan artikel "${activeTexts.title}" disalin ke papan klip!`)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-12 px-6 rounded-2xl transition-all-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-md shadow-emerald-600/10 dark:shadow-none"
              >
                <i className="fa-solid fa-share-nodes"></i> {language === 'en' ? 'Share' : 'Bagikan'}
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
                placeholder={language === 'en' ? 'Search nutrition news, recipes, or tips...' : 'Cari berita gizi, resep, atau tips...'} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-2xl py-3 pl-9 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 focus:border-transparent shadow-3xs dark:text-white"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  title={language === 'en' ? "Clear Search" : "Bersihkan Pencarian"}
                >
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              )}
            </div>

            {/* Scope selection tabs (Semua, Lokal, Global) */}
            <div className="flex bg-slate-200/80 dark:bg-slate-800 rounded-2xl p-1 text-[10px] font-bold border border-slate-200/40 dark:border-slate-700">
              <button 
                onClick={() => setSelectedScope('semua')}
                className={`flex-1 py-2 rounded-xl text-center cursor-pointer transition-all-300 ${
                  selectedScope === 'semua' 
                    ? 'bg-white dark:bg-slate-850 text-slate-800 dark:text-white shadow-3xs' 
                    : 'text-slate-555 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {language === 'en' ? 'All Scopes' : 'Semua Cakupan'}
              </button>
              <button 
                onClick={() => setSelectedScope('lokal')}
                className={`flex-1 py-2 rounded-xl text-center cursor-pointer transition-all-300 ${
                  selectedScope === 'lokal' 
                    ? 'bg-emerald-650 text-white shadow-3xs' 
                    : 'text-slate-555 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {language === 'en' ? 'Local (Indonesia)' : 'Lokal (Indonesia)'}
              </button>
              <button 
                onClick={() => setSelectedScope('global')}
                className={`flex-1 py-2 rounded-xl text-center cursor-pointer transition-all-300 ${
                  selectedScope === 'global' 
                    ? 'bg-emerald-650 text-white shadow-3xs' 
                    : 'text-slate-555 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {language === 'en' ? 'Global (Worldwide)' : 'Global (Mancanegara)'}
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
                      : 'bg-white dark:bg-slate-800 text-slate-650 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  {cat === 'semua' 
                    ? (language === 'en' ? 'ALL' : 'SEMUA') 
                    : cat === 'tips' 
                      ? 'TIPS & TRICK' 
                      : cat === 'edukasi'
                        ? (language === 'en' ? 'EDUCATION' : 'EDUKASI')
                        : cat === 'resep'
                          ? (language === 'en' ? 'RECIPES' : 'RESEP')
                          : cat === 'berita'
                            ? (language === 'en' ? 'NEWS' : 'BERITA')
                            : cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Results metadata */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-extrabold tracking-wider px-1">
              <span>
                {language === 'en' 
                  ? `FOUND ${filteredArticles.length} ARTICLES` 
                  : `DITEMUKAN ${filteredArticles.length} ARTIKEL`}
              </span>
              {savedArticles.length > 0 && (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <i className="fa-solid fa-bookmark"></i> 
                  {language === 'en' 
                    ? `${savedArticles.length} SAVED` 
                    : `${savedArticles.length} TERSIMPAN`}
                </span>
              )}
            </div>

            {/* Articles vertical stack */}
            <div className="space-y-3">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl text-slate-450 dark:text-slate-550 space-y-2">
                  <i className="fa-regular fa-newspaper text-3xl opacity-40"></i>
                  <p className="text-xs font-bold">
                    {language === 'en' 
                      ? 'No articles match your filters.' 
                      : 'Tidak ada artikel yang cocok dengan filter Anda.'}
                  </p>
                </div>
              ) : (
                filteredArticles.map(article => {
                  const texts = getArticleText(article);
                  return (
                    <div 
                      key={article.id}
                      onClick={() => setActiveArticle(article)}
                      className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl p-3 flex gap-3 shadow-3xs cursor-pointer hover:border-emerald-250 dark:hover:border-emerald-700 transition-all duration-300 group animate-[fadeIn_0.2s_ease-out]"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 relative animate-pulse-none">
                        <img src={article.image} alt={texts.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[7px] font-extrabold px-1.5 py-0.5 rounded-sm">
                          {article.scope === 'lokal' ? 'ID' : 'WW'}
                        </span>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm ${article.tagColor}`}>
                              {texts.tag}
                            </span>
                            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 font-mono">{article.time}</span>
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-800 dark:text-white leading-snug mt-1.5 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors duration-300 truncate">
                            {texts.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mt-0.5 font-medium">
                            {texts.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
