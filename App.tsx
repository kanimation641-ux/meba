
import React, { useState, useEffect, useRef } from 'react';
import { 
  Calculator, 
  Sparkles, 
  BookOpen, 
  History as HistoryIcon, 
  Gift, 
  Star,
  ChevronLeft,
  ChevronRight,
  Eraser,
  Settings,
  CandyCane,
  Music,
  Snowflake,
  SendHorizontal,
  ArrowRight,
  Zap,
  GraduationCap
} from 'lucide-react';
import Snowfall from './components/Snowfall';
import ResponseView from './components/ResponseView';
import { getGeminiResponse } from './services/geminiService';
import { ToolType, HistoryItem, ViewState } from './types';

const FONTS = [
  { name: 'Quicksand', family: "'Quicksand', sans-serif", label: 'Default' },
  { name: 'Lora', family: "'Lora', serif", label: 'Elegant' },
  { name: 'Courier Prime', family: "'Courier Prime', monospace", label: 'Typewriter' },
  { name: 'Fredoka', family: "'Fredoka', sans-serif", label: 'Playful' },
  { name: 'Mountains of Christmas', family: "'Mountains of Christmas', cursive", label: 'Festive' }
];

const GRADES = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [activeTab, setActiveTab] = useState<ToolType>(ToolType.MATH);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentFont, setCurrentFont] = useState(FONTS[0].family);
  const [showFontSettings, setShowFontSettings] = useState(false);
  const [grade, setGrade] = useState('Grade 6');

  useEffect(() => {
    const savedHistory = localStorage.getItem('tsai-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      } catch (e) { console.error(e); }
    }
    const savedFont = localStorage.getItem('tsai-font');
    if (savedFont) setCurrentFont(savedFont);

    const savedGrade = localStorage.getItem('tsai-grade');
    if (savedGrade) setGrade(savedGrade);
  }, []);

  const handleGradeChange = (newGrade: string) => {
    setGrade(newGrade);
    localStorage.setItem('tsai-grade', newGrade);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setResponse('');
    setSources([]);

    try {
      const result = await getGeminiResponse(input, activeTab, grade);
      setResponse(result.text);
      if (result.sources) setSources(result.sources);
      saveToHistory(activeTab, input, result.text);
    } catch (err) {
      setResponse("TSAI circuits frozen. Try again soon! ❄️");
    } finally {
      setLoading(false);
    }
  };

  const openTool = (type: ToolType) => {
    setActiveTab(type);
    setView(ViewState.TOOL);
    setResponse('');
    setInput('');
  };

  const saveToHistory = (type: ToolType, query: string, res: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      type,
      query,
      response: res,
      timestamp: Date.now(),
    };
    const updatedHistory = [newItem, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem('tsai-history', JSON.stringify(updatedHistory));
  };

  const changeFont = (family: string) => {
    setCurrentFont(family);
    localStorage.setItem('tsai-font', family);
  };

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'red': return { bg: 'bg-red-600/10', border: 'border-red-500/20', text: 'text-red-400' };
      case 'green': return { bg: 'bg-green-600/10', border: 'border-green-500/20', text: 'text-green-400' };
      default: return { bg: 'bg-slate-600/10', border: 'border-slate-500/20', text: 'text-slate-400' };
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ fontFamily: currentFont }}>
      <Snowfall />
      
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 bg-[#060a12] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3d0b0b_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#0b2d1d_0%,transparent_40%)]"></div>
      </div>

      {/* Persistent Settings Button */}
      <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-[60]">
        <button 
          onClick={() => setShowFontSettings(!showFontSettings)} 
          className="p-3 md:p-4 rounded-full bg-white/5 text-slate-400 hover:text-white backdrop-blur-xl border border-white/10 transition-all hover:scale-110 active:scale-95 shadow-xl"
        >
          <Settings className={`w-5 h-5 md:w-4 md:h-4 transition-transform duration-500 ${showFontSettings ? 'rotate-90' : ''}`} />
        </button>
        {showFontSettings && (
          <div className="absolute bottom-14 left-0 bg-black/80 backdrop-blur-2xl border border-white/10 p-3 rounded-2xl w-48 animate-in slide-in-from-bottom-2 shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 px-3">Interface Theme</p>
            {FONTS.map((font) => (
              <button key={font.name} onClick={() => changeFont(font.family)} className={`w-full text-left px-3 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-colors ${currentFont === font.family ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
                {font.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <main className={`flex-1 flex flex-col items-center z-10 w-full ${view === ViewState.HOME ? 'justify-center py-8 md:py-12' : 'pt-12 md:pt-20 pb-12'}`}>
        <div className="w-full max-w-4xl px-4 md:px-6 flex flex-col items-center">
          
          <header className={`text-center transition-all duration-700 ${view === ViewState.HOME ? 'mb-8 md:mb-10 scale-100 md:scale-110' : 'mb-6 md:mb-8 scale-90 md:scale-100 opacity-80'}`}>
            <h1 className="festive-font text-6xl md:text-9xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] tracking-tight">TSAI</h1>
            <div className="flex items-center justify-center gap-2 md:gap-3 mt-1">
              <div className="h-px w-6 md:w-8 bg-gradient-to-r from-transparent to-red-500/50"></div>
              <p className="text-red-500 font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[8px] md:text-[12px] whitespace-nowrap leading-none">The Smartest AI</p>
              <div className="h-px w-6 md:w-8 bg-gradient-to-l from-transparent to-red-500/50"></div>
            </div>
          </header>

          {view === ViewState.HOME ? (
            <div className="w-full flex flex-col items-center gap-8 md:gap-12 animate-in slide-in-from-bottom-12 duration-1000">
              {/* GRADE SELECTOR */}
              <div className="w-full max-w-2xl bg-white/5 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 backdrop-blur-sm flex flex-col items-center shadow-xl">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <GraduationCap className="w-4 h-4 text-red-500" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Current Level Configuration</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 md:gap-2 w-full">
                  {GRADES.map((g) => (
                    <button
                      key={g}
                      onClick={() => handleGradeChange(g)}
                      className={`py-2 md:py-1.5 rounded-lg text-[10px] md:text-[11px] font-bold transition-all border ${
                        grade === g 
                          ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] scale-105 md:scale-110 z-10' 
                          : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {g.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* HOME GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl">
                {[
                  { type: ToolType.MATH, icon: Calculator, title: "Math Wing", desc: "Logic Engine", color: "red" },
                  { type: ToolType.KNOWLEDGE, icon: BookOpen, title: "Global Core", desc: "Universal Data", color: "green" }
                ].map((tool) => {
                  const colors = getColorClasses(tool.color);
                  return (
                    <button 
                      key={tool.type} 
                      onClick={() => openTool(tool.type)} 
                      className="group relative bg-white/5 border border-white/5 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] text-left hover:bg-white/10 transition-all hover:scale-[1.03] backdrop-blur-md shadow-2xl overflow-hidden border-t-white/10 active:scale-95"
                    >
                      <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none`}>
                        <tool.icon className="w-24 h-24 md:w-32 md:h-32" />
                      </div>

                      <div className={`mb-4 md:mb-6 ${colors.bg} w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center border ${colors.border} shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                        <tool.icon className={`w-6 h-6 md:w-7 md:h-7 ${colors.text}`} />
                      </div>
                      
                      <h2 className="festive-font text-3xl md:text-4xl text-white mb-1 md:mb-2 leading-none">{tool.title}</h2>
                      <p className="text-slate-400 text-[10px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black opacity-60 mb-4 md:mb-6">{tool.desc}</p>
                      
                      <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${colors.text} opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0`}>
                        <span>Initiate</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* TOOL VIEW */
            <div className="w-full max-w-xl flex flex-col gap-4 md:gap-6 animate-in slide-in-from-right-6 duration-500">
              <div className="flex flex-row items-center justify-between gap-3 md:gap-4">
                <button 
                  onClick={() => setView(ViewState.HOME)} 
                  className="flex items-center gap-1.5 md:gap-2 text-slate-400 hover:text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl border border-white/5 transition-all hover:bg-white/10 active:scale-95"
                >
                  <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="hidden sm:inline">Return Hub</span><span className="sm:hidden">Back</span>
                </button>
                <div className="flex flex-col items-end gap-1">
                   <div className={`flex items-center gap-1.5 md:gap-2.5 px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl border transition-all shadow-lg ${activeTab === ToolType.MATH ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-green-400 bg-green-500/10 border-green-500/20'}`}>
                    {activeTab === ToolType.MATH ? <Calculator className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none">{activeTab === ToolType.MATH ? "LOGIC ENGINE" : "DATA SCANNER"}</span>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mr-1 md:mr-2">Level: {grade}</span>
                </div>
              </div>

              <div className={`relative group ${loading ? 'opacity-80 scale-[0.98]' : 'hover:scale-[1.01]'} transition-all duration-300`}>
                <div className={`absolute -inset-1 rounded-2xl blur-lg opacity-20 group-focus-within:opacity-40 transition-all duration-500 ${activeTab === ToolType.MATH ? 'bg-red-600' : 'bg-green-600'}`}></div>
                <div className="relative bg-[#0d121b]/90 border border-white/10 rounded-2xl p-2 md:p-2.5 backdrop-blur-3xl shadow-2xl flex items-center gap-2 md:gap-3">
                  <input
                    type="text"
                    value={input}
                    disabled={loading}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder={activeTab === ToolType.MATH ? "Solve equation..." : "Search core data..."}
                    className="flex-1 bg-transparent border-none py-2 md:py-3 px-3 md:px-4 text-white placeholder-slate-600 focus:outline-none text-sm md:text-base font-semibold selection:bg-red-500/30"
                  />
                  <button 
                    onClick={() => handleSubmit()} 
                    disabled={loading || !input.trim()} 
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl transition-all flex items-center justify-center shadow-lg active:scale-90 ${activeTab === ToolType.MATH ? 'bg-red-600 hover:bg-red-500' : 'bg-green-700 hover:bg-green-600'} disabled:opacity-30 disabled:scale-100`}
                  >
                    {loading ? <div className="w-4 h-4 md:w-5 md:h-5 border-2 md:border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : <SendHorizontal className="w-4 h-4 md:w-5 md:h-5" />}
                  </button>
                </div>
              </div>

              <ResponseView content={response} sources={sources} loading={loading} />
            </div>
          )}
        </div>
      </main>

      <footer className="w-full py-8 md:py-10 text-center z-10 mt-auto border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-3 md:gap-4">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          <p className="text-[8px] md:text-[9px] uppercase tracking-[0.5em] md:tracking-[0.7em] text-slate-500 font-black">TSAI NORTH POLE • CORE_4.2</p>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-700 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
        </div>
      </footer>

      {/* Background history toggle - fixed for reachability */}
      <button 
        onClick={() => setShowHistory(!showHistory)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 p-3 md:p-4 rounded-full bg-white/5 text-slate-400 hover:text-white backdrop-blur-xl border border-white/10 transition-all z-[60] shadow-xl active:scale-95"
      >
        <HistoryIcon className="w-5 h-5 md:w-4 md:h-4" />
      </button>

      {showHistory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0c1421] border border-white/10 w-full max-w-lg rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-3xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 border-b border-white/5">
              <h3 className="festive-font text-2xl md:text-3xl text-white">Cache History</h3>
              <button onClick={() => setShowHistory(false)} className="text-slate-500 hover:text-white transition-colors p-2">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-1 space-y-2 md:space-y-3 pr-2">
              {history.length === 0 ? (
                <p className="text-center text-slate-600 py-10 text-[10px] uppercase tracking-widest font-black">Memory Bank Empty</p>
              ) : (
                history.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.type);
                      setResponse(item.response);
                      setInput(item.query);
                      setView(ViewState.TOOL);
                      setShowHistory(false);
                    }}
                    className="w-full text-left bg-white/5 p-4 rounded-xl md:rounded-2xl hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-white font-bold text-xs md:text-sm truncate">{item.query}</p>
                      <p className={`text-[8px] md:text-[9px] uppercase tracking-widest font-black ${item.type === ToolType.MATH ? 'text-red-500' : 'text-green-500'}`}>{item.type}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </button>
                ))
              )}
            </div>
            {history.length > 0 && (
              <button 
                onClick={() => { if(confirm("Purge memory bank?")) { localStorage.removeItem('tsai-history'); setHistory([]); } }}
                className="mt-6 w-full py-3.5 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95"
              >
                Purge System Logs
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
