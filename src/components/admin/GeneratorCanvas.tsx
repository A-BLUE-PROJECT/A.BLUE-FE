'use client';

import { useGeneratorStore } from '@/store/useGeneratorStore';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

export function GeneratorCanvas() {
  const { isGenerating, generatedResultUrl, selectedProducts, resetResult } = useGeneratorStore();
  
  // Fake progress sequence
  const [progressMsg, setProgressMsg] = useState('Initializing AI Core...');
  
  useEffect(() => {
    if (!isGenerating) return;
    
    const msgs = [
      'Analyzing mood prompt...',
      'Mapping reference textures...',
      'Synthesizing virtual model...',
      'Applying A.BLUE style transfer...',
      'Finalizing high-res render...'
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setProgressMsg(msgs[i]);
      i++;
      if(i >= msgs.length) clearInterval(interval);
    }, 800);
    
    return () => clearInterval(interval);
  }, [isGenerating]);

  return (
    <div className="flex-1 bg-[#F5F5F5] h-[calc(100vh-64px)] flex items-center justify-center p-8 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* State 1: Idle */}
      {!isGenerating && !generatedResultUrl && (
        <div className="flex flex-col items-center justify-center text-center opacity-60">
          <div className="w-24 h-24 mb-6 rounded-3xl bg-white shadow-sm flex items-center justify-center">
            <span className="text-4xl text-zinc-300">✦</span>
          </div>
          <h2 className="text-zinc-600 text-lg font-medium">Ready to Generate</h2>
          <p className="text-zinc-400 text-sm mt-2 max-w-sm">
            좌측 패널에서 프롬프트와 옵션을 설정한 뒤, <br />Generate 버튼을 눌러 새로운 룩북을 창조하세요.
          </p>
        </div>
      )}

      {/* State 2: Generating */}
      {isGenerating && (
        <div className="flex flex-col items-center justify-center z-10 w-full max-w-md">
          {/* Custom Scanner/Loader UI */}
          <div className="w-full aspect-3/4 bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-zinc-100 mb-8 p-1">
            <div className="w-full h-full rounded-xl bg-zinc-50 overflow-hidden relative">
               <div className="absolute inset-0 bg-linear-to-b from-transparent via-lime-400/20 to-transparent w-full h-[200%] animate-scan" style={{ top: '-100%' }} />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl animate-pulse">✨</div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-1 w-48 bg-zinc-200 rounded-full overflow-hidden mb-4">
               <div className="h-full bg-zinc-900 rounded-full w-full origin-left animate-progress" />
            </div>
            <p className="text-sm font-bold text-zinc-800 tracking-wide uppercase animate-pulse">{progressMsg}</p>
          </div>
        </div>
      )}

      {/* State 3: Result */}
      {!isGenerating && generatedResultUrl && (
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start z-10 w-full max-w-5xl h-full p-8 overflow-y-auto custom-scrollbar">
          
          {/* Main Image */}
          <div className="w-full max-w-[400px] aspect-3/4 bg-zinc-100 rounded-2xl shadow-2xl overflow-hidden relative ring-1 ring-black/5 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={generatedResultUrl} alt="AI Generated" className="object-cover w-full h-full" />
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-2">
              <span className="text-lime-400 text-[10px]">✨</span>
              <span className="text-white text-[10px] font-bold">100% UNIQUE</span>
            </div>
          </div>

          {/* Result Actions & Info */}
          <div className="flex-1 w-full bg-white p-8 rounded-3xl shadow-xl border border-zinc-100 flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Generation Complete</h2>
              <p className="text-sm text-zinc-500 mt-1">이 결과물은 즉시 메인 갤러리 전시가 가능합니다.</p>
            </div>

            {selectedProducts.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Mapped Products</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {selectedProducts.map((p) => (
                    <div key={p.productId} className="w-20 shrink-0 flex flex-col gap-2">
                      <div className="w-full aspect-square bg-zinc-100 rounded-lg overflow-hidden border border-zinc-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.thumbnailUrl} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[10px] text-zinc-600 truncate text-center">{p.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto grid grid-cols-2 gap-4">
              <button
                onClick={resetResult}
                className="w-full py-4 rounded-xl text-sm font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors"
              >
                DISCARD & RE-GENERATE
              </button>
              <button
                onClick={() => {
                  alert('성공적으로 갤러리에 발행(APPROVED) 되었습니다!');
                  resetResult();
                }}
                className="w-full py-4 rounded-xl text-sm font-bold text-zinc-900 bg-lime-400 hover:bg-lime-500 shadow-lg shadow-lime-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>🚀</span> PUBLISH TO PENDING
              </button>
            </div>
          </div>

        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 4s linear forwards;
        }
      `}} />
    </div>
  );
}
