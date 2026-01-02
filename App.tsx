
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DESTINATIONS } from './constants';
import { Destination, Region, TravelType, GeneratedImage, Language, AspectRatio, ClothingStyle, ImageQuality } from './types';
import { translations } from './translations';
import { DestinationCard } from './components/DestinationCard';
import { FaceUpload } from './components/FaceUpload';
import { OutfitUpload } from './components/OutfitUpload';
import { generateSelfie, openApiKeySelector, searchGlobalDestinations, checkApiKeyStatus, getCelebritySuggestions } from './services/gemini';

const App: React.FC = () => {
  // Global Settings
  const [lang, setLang] = useState<Language>('vi');
  const t = translations[lang];

  // Slider Ref
  const sliderRef = useRef<HTMLDivElement>(null);

  // Filtering states
  const [selectedRegion, setSelectedRegion] = useState<Region | 'All'>('All');
  const [selectedType, setSelectedType] = useState<TravelType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalResults, setGlobalResults] = useState<Destination[]>([]);
  const [isSearchingGlobal, setIsSearchingGlobal] = useState(false);
  const [lastGlobalQuery, setLastGlobalQuery] = useState('');

  // Generation states
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [userImages, setUserImages] = useState<string[]>([]);
  const [outfitImages, setOutfitImages] = useState<string[]>([]);
  const [outfitStyle, setOutfitStyle] = useState<ClothingStyle>(ClothingStyle.AUTO);
  const [imageQuality, setImageQuality] = useState<ImageQuality>(ImageQuality.Q1K);
  const [celebrityName, setCelebrityName] = useState('');
  const [celebritySuggestions, setCelebritySuggestions] = useState<string[]>([]);
  const [isSuggestingCelebrity, setIsSuggestingCelebrity] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const lastSelectedCelebrity = useRef<string>('');
  
  const [customPrompt, setCustomPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<React.ReactNode | null>(null);
  
  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter local destinations
  const rankedDestinations = useMemo(() => {
    return [...DESTINATIONS]
      .sort((a, b) => b.checkIns - a.checkIns)
      .filter(dest => {
        const matchesRegion = selectedRegion === 'All' || dest.region === selectedRegion;
        const matchesType = selectedType === 'All' || dest.type === selectedType;
        const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             dest.country.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRegion && matchesType && matchesSearch;
      });
  }, [selectedRegion, selectedType, searchQuery]);

  // Debounce gợi ý người nổi tiếng
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (celebrityName.length >= 2 && !isGenerating && celebrityName !== lastSelectedCelebrity.current) {
        setIsSuggestingCelebrity(true);
        const suggestions = await getCelebritySuggestions(celebrityName, lang);
        setCelebritySuggestions(suggestions);
        setIsSuggestingCelebrity(false);
        setShowSuggestions(suggestions.length > 0);
      } else {
        setCelebritySuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [celebrityName, lang, isGenerating]);

  const handleGlobalSearch = async (queryToSearch: string = searchQuery) => {
    if (!queryToSearch.trim() || isSearchingGlobal) return;
    if (queryToSearch.trim() === lastGlobalQuery) return;

    // Kiểm tra API Key trước khi tìm kiếm
    const hasKey = await checkApiKeyStatus();
    if (!hasKey) {
      await openApiKeySelector();
      // Proceed assuming success as per instructions
    }

    setIsSearchingGlobal(true);
    setError(null);
    setLastGlobalQuery(queryToSearch.trim());
    
    let location: { latitude: number, longitude: number } | undefined;
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    } catch (e) {
      console.log("Location access denied or timed out");
    }

    try {
      const results = await searchGlobalDestinations(queryToSearch, location);
      setGlobalResults(results);
      if (results.length > 0 && !selectedDest) {
        setSelectedDest(results[0]);
      }
    } catch (err: any) {
      if (err.message === "KEY_MISSING") {
        setError(t.errorAuth);
      } else {
        setError(t.errorGeneral);
      }
    } finally {
      setIsSearchingGlobal(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setGlobalResults([]);
      setLastGlobalQuery('');
      return;
    }
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 3 && rankedDestinations.length === 0 && !isSearchingGlobal) {
        handleGlobalSearch(searchQuery);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, rankedDestinations.length]);

  const handleGenerate = async () => {
    if (!selectedDest) {
      setError(t.errorNoDest);
      return;
    }
    if (userImages.length === 0) {
      setError(t.errorNoFace);
      return;
    }

    // Luôn kiểm tra Key khi bắt đầu tạo ảnh
    const hasKey = await checkApiKeyStatus();
    if (!hasKey) {
      await openApiKeySelector();
    }

    setIsGenerating(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const resultUrl = await generateSelfie(
        selectedDest.name,
        userImages,
        outfitImages,
        outfitStyle,
        celebrityName,
        customPrompt,
        aspectRatio,
        imageQuality
      );
      setGeneratedResults(prev => [
        { url: resultUrl, prompt: customPrompt || `Selfie at ${selectedDest.name} with ${celebrityName}`, timestamp: Date.now() },
        ...prev
      ]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      if (err.message === "ENTITY_NOT_FOUND" || err.message === "KEY_MISSING") {
        setError(t.errorAuth);
        await openApiKeySelector();
      } else {
        setError(err.message || t.errorGeneral);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 400;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full overflow-y-auto p-6 flex flex-col space-y-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-indigo-600 tracking-tight flex items-center gap-2">
                <i className="fa-solid fa-earth-americas"></i>
                {t.appName}
              </h1>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-black">
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit">
                <button onClick={() => setLang('vi')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${lang === 'vi' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>VN</button>
                <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${lang === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>EN</button>
              </div>
              <button onClick={openApiKeySelector} className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg font-bold hover:bg-gray-200 transition-colors uppercase tracking-wider">
                <i className="fa-solid fa-key"></i>
              </button>
            </div>
          </div>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-widest">
              <i className="fa-solid fa-user-plus"></i>
              <span>{t.identityTitle}</span>
            </div>
            <FaceUpload images={userImages} onAddImage={(img) => setUserImages(prev => [...prev, img])} onRemoveImage={(idx) => setUserImages(prev => prev.filter((_, i) => i !== idx))} t={t} />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-widest">
              <i className="fa-solid fa-shirt"></i>
              <span>{t.outfitTitle}</span>
            </div>
            <OutfitUpload images={outfitImages} onAddImage={(img) => setOutfitImages(prev => [...prev, img])} onRemoveImage={(idx) => setOutfitImages(prev => prev.filter((_, i) => i !== idx))} t={t} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.outfitPresetLabel}</label>
              <select className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm" value={outfitStyle} onChange={(e) => setOutfitStyle(e.target.value as ClothingStyle)}>
                {Object.values(ClothingStyle).map(style => <option key={style} value={style}>{t.outfitStyles[style]}</option>)}
              </select>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-widest">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              <span>{t.magicSettings}</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.qualityLabel}</label>
                <select className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm" value={imageQuality} onChange={(e) => setImageQuality(e.target.value as ImageQuality)}>
                  {Object.values(ImageQuality).map(q => <option key={q} value={q}>{t.qualityLabels[q]}</option>)}
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.selfieWithLabel}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder={t.selfieWithPlaceholder} 
                    className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 pr-10" 
                    value={celebrityName} 
                    onChange={(e) => {
                      setCelebrityName(e.target.value);
                      lastSelectedCelebrity.current = '';
                    }}
                    onFocus={() => celebritySuggestions.length > 0 && celebrityName !== lastSelectedCelebrity.current && setShowSuggestions(true)}
                  />
                  {isSuggestingCelebrity && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <i className="fa-solid fa-circle-notch animate-spin text-indigo-400 text-xs"></i>
                    </div>
                  )}
                </div>
                {showSuggestions && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {celebritySuggestions.map((name, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          setCelebrityName(name);
                          lastSelectedCelebrity.current = name;
                          setShowSuggestions(false);
                          setCelebritySuggestions([]);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors flex items-center justify-between group"
                      >
                        <span className="font-medium text-gray-700">{name}</span>
                        <i className="fa-solid fa-arrow-right text-[10px] text-gray-300 group-hover:text-indigo-400"></i>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.aspectRatioLabel}</label>
                <select className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}>
                  {Object.values(AspectRatio).map(ratio => <option key={ratio} value={ratio}>{ratio} - {t.ratioLabels[ratio]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.customPromptLabel}</label>
                <textarea placeholder={t.customPromptPlaceholder} rows={3} className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 outline-none resize-none" value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} />
              </div>
            </div>
          </section>

          <div className="pt-4 mt-auto">
            <button onClick={handleGenerate} disabled={isGenerating} className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}>
              {isGenerating ? <><i className="fa-solid fa-circle-notch animate-spin"></i>{t.generatingBtn}</> : <><i className="fa-solid fa-camera-retro"></i>{t.captureBtn}</>}
            </button>
            {error && <div className="mt-4 text-[10px] text-red-500 font-medium bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen" onClick={() => setShowSuggestions(false)}>
        <div className="md:hidden flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-indigo-600 tracking-tight">{t.appName}</h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><i className="fa-solid fa-bars"></i></button>
        </div>

        <div className="mb-10 space-y-6">
          {generatedResults.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><i className="fa-solid fa-images text-indigo-600"></i>{t.recentCaptures}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedResults.map((result, idx) => (
                  <div key={result.timestamp} className="group relative rounded-2xl overflow-hidden shadow-2xl bg-white p-2">
                    <img src={result.url} className="w-full aspect-square object-cover rounded-xl" alt="AI" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <a href={result.url} download={`travel-ai-${idx}.png`} className="bg-white text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 shadow-lg"><i className="fa-solid fa-download"></i></a>
                      <button onClick={() => { const win = window.open(); win?.document.write(`<img src="${result.url}" style="max-width:100%"/>`); }} className="bg-white text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 shadow-lg"><i className="fa-solid fa-eye"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tight text-gray-900 uppercase">{t.tagline}</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input type="text" placeholder={t.searchPlaceholder} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                {isSearchingGlobal && (
                   <div className="absolute right-4 top-1/2 -translate-y-1/2">
                     <i className="fa-solid fa-circle-notch animate-spin text-indigo-500"></i>
                   </div>
                )}
              </div>
              <button 
                onClick={() => handleGlobalSearch()} 
                disabled={isSearchingGlobal || !searchQuery}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:bg-gray-300 transition-all flex items-center gap-2 shadow-lg"
              >
                {isSearchingGlobal ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-globe"></i>}
                {t.searchGlobalBtn}
              </button>
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value as any)}>
                <option value="All">{t.allRegions}</option>
                {Object.values(Region).map(r => <option key={r} value={r}>{t.regions[r]}</option>)}
              </select>
              <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20" value={selectedType} onChange={(e) => setSelectedType(e.target.value as any)}>
                <option value="All">{t.allTypes}</option>
                {Object.values(TravelType).map(tt => <option key={tt} value={tt}>{t.types[tt]}</option>)}
              </select>
            </div>
          </div>
        </div>

        {(globalResults.length > 0 || isSearchingGlobal) && (
          <section className="mb-12 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 transition-all">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-indigo-900">
              <i className={`fa-solid ${isSearchingGlobal ? 'fa-circle-notch animate-spin' : 'fa-map-pin text-red-500 animate-bounce'}`}></i>
              {isSearchingGlobal ? 'Đang tự động tìm kiếm toàn cầu...' : t.globalResultsTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {globalResults.map(dest => (
                <DestinationCard key={dest.id} destination={dest} isSelected={selectedDest?.id === dest.id} onSelect={setSelectedDest} t={t} />
              ))}
              {isSearchingGlobal && globalResults.length === 0 && (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[4/3] bg-indigo-100/50 rounded-2xl animate-pulse flex items-center justify-center">
                    <i className="fa-solid fa-image text-indigo-200 text-3xl"></i>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        <div className="relative group/slider mt-10">
          <button onClick={() => scrollSlider('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-12 h-12 bg-white/80 rounded-full shadow-xl flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all"><i className="fa-solid fa-chevron-left"></i></button>
          <button onClick={() => scrollSlider('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-12 h-12 bg-white/80 rounded-full shadow-xl flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all"><i className="fa-solid fa-chevron-right"></i></button>
          <div ref={sliderRef} className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
            {rankedDestinations.length > 0 ? rankedDestinations.map((dest, idx) => (
              <div key={dest.id} className="min-w-[280px] sm:min-w-[340px] snap-start">
                <DestinationCard destination={dest} isSelected={selectedDest?.id === dest.id} onSelect={setSelectedDest} t={t} rank={idx} />
              </div>
            )) : !isSearchingGlobal && globalResults.length === 0 && (
              <div className="p-12 text-center w-full text-gray-400 italic">
                {t.noDestinations}
              </div>
            )}
          </div>
        </div>
      </main>

      {isGenerating && (
        <div className="fixed inset-0 z-[100] glass flex items-center justify-center text-center p-6">
          <div className="max-w-md w-full">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full animate-ping opacity-25"></div>
              <div className="relative z-10 w-full h-full bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl">
                <i className="fa-solid fa-plane-departure text-4xl animate-pulse"></i>
              </div>
            </div>
            <h3 className="text-3xl font-black text-indigo-900 mb-4">{t.loadingTitle}</h3>
            <p className="text-gray-600 font-medium mb-6">{t.loadingDesc.replace('{name}', selectedDest?.name || '')}</p>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 animate-[loading_3s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
