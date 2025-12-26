
import React from 'react';

interface ResponseViewProps {
  content: string;
  sources?: { title: string; uri: string }[];
  loading: boolean;
}

const ResponseView: React.FC<ResponseViewProps> = ({ content, sources, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-3">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs uppercase tracking-[0.2em] font-black text-red-200/50">Elves are thinking...</p>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap leading-relaxed text-slate-200">
        {content}
      </div>
      
      {sources && sources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <h4 className="text-[10px] font-black text-red-400 mb-2 uppercase tracking-widest">TSAI Intelligence Sources:</h4>
          <ul className="space-y-1.5">
            {sources.map((source, idx) => (
              <li key={idx}>
                <a 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline transition-colors flex items-center gap-2 text-[11px] font-medium"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  {source.title}
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
