
import React from 'react';

interface ResponseViewProps {
  content: string;
  sources?: { title: string; uri: string }[];
  loading: boolean;
}

const ResponseView: React.FC<ResponseViewProps> = ({ content, sources, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="relative">
           <div className="w-10 h-10 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
           </div>
        </div>
        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black text-red-200/40 text-center px-4">The Logic Elves are decoding the core data stream...</p>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="prose prose-invert prose-xs md:prose-sm max-w-none whitespace-pre-wrap leading-relaxed text-slate-200 text-sm md:text-base font-medium">
        {content}
      </div>
      
      {sources && sources.length > 0 && (
        <div className="mt-8 pt-5 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
             <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none">Intelligence Grounding</h4>
          </div>
          <ul className="grid grid-cols-1 gap-2">
            {sources.map((source, idx) => (
              <li key={idx}>
                <a 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/5 border border-white/5 p-2.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-white/10 hover:border-blue-500/20 transition-all flex items-center gap-3 text-xs font-bold truncate group"
                >
                  <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center text-[10px] text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                    {idx + 1}
                  </div>
                  <span className="truncate flex-1">{source.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResponseView;
