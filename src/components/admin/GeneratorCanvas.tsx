'use client';

import { useGeneratorStore } from '@/store/useGeneratorStore';
import { useEffect, useState } from 'react';

export function GeneratorCanvas() {
  const {
    isGenerating, generatedLookbookId, generateError,
    selectedProducts, selectedModelUrl, resetResult,
  } = useGeneratorStore();

  const [progressMsg, setProgressMsg] = useState('Initializing AI Core...');

  useEffect(() => {
    if (!isGenerating) return;

    const msgs = [
      'Analyzing mood prompt...',
      'Loading model image...',
      'Synthesizing virtual model...',
      'Applying A.BLUE style transfer...',
      'Sending to AI pipeline...',
    ];

    let i = 0;
    const interval = setInterval(() => {
      setProgressMsg(msgs[i]);
      i++;
      if (i >= msgs.length) clearInterval(interval);
    }, 800);

    return () => clearInterval(interval);
  }, [isGenerating]);

  return (
    <div className="flex-1 bg-[#F5F5F5] h-[calc(100vh-64px)] flex items-center justify-center p-8 relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* State 1: Idle */}
      {!isGenerating && !generatedLookbookId && !generateError && (
        <div className="flex flex-col items-center justify-center text-center opacity-60">
          <div className="w-24 h-24 mb-6 rounded-3xl bg-white shadow-sm flex items-center justify-center">
            <span className="text-4xl text-zinc-300">✦</span>
          </div>
          <h2 className="text-zinc-600 text-lg font-medium">Ready to Generate</h2>
          <p className="text-zinc-400 text-sm mt-2 max-w-sm">
            좌측에서 모델·상품을 선택하고<br />Generate 버튼을 눌러 룩북을 생성하세요.
          </p>
        </div>
      )}

      {/* State 2: Generating */}
      {isGenerating && (
        <div className="flex flex-col items-center justify-center z-10 w-full max-w-md">
          <div className="w-full aspect-[3/4] bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-zinc-100 mb-8 p-1">
            <div className="w-full h-full rounded-xl bg-zinc-50 overflow-hidden relative">
              {selectedModelUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedModelUrl} alt="model" className="w-full h-full object-cover opacity-30" />
              )}
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

      {/* State 3: Error */}
      {generateError && (
        <div className="flex flex-col items-center justify-center text-center z-10 max-w-sm">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-rose-50 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-zinc-800 font-bold mb-2">생성 요청 실패</h2>
          <p className="text-xs text-zinc-500 mb-6">{generateError}</p>
          <button
            onClick={resetResult}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* State 4: Queued (생성 요청 완료 - AI 비동기 처리 중) */}
      {!isGenerating && generatedLookbookId && (
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start z-10 w-full max-w-4xl h-full p-8 overflow-y-auto custom-scrollbar">

          {/* Model Preview */}
          {selectedModelUrl && (
            <div className="w-full max-w-[280px] aspect-[2/3] bg-zinc-100 rounded-2xl shadow-xl overflow-hidden relative ring-1 ring-black/5 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedModelUrl} alt="Selected model" className="object-cover w-full h-full" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-xs font-bold">선택된 모델</p>
              </div>
            </div>
          )}

          {/* Result Info */}
          <div className="flex-1 w-full bg-white p-8 rounded-3xl shadow-xl border border-zinc-100 flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-lime-50 text-lime-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                AI 생성 대기 중
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">생성 요청 완료</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Lookbook #{generatedLookbookId} 가 AI 파이프라인에 전달됐습니다.<br />
                생성 완료 후 검수 대시보드에서 확인할 수 있습니다.
              </p>
            </div>

            {selectedProducts.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Mapped Products</h3>
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
                새 룩북 생성
              </button>
              <a
                href="/hq/curation"
                className="w-full py-4 rounded-xl text-sm font-bold text-zinc-900 bg-lime-400 hover:bg-lime-500 shadow-lg shadow-lime-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>🔍</span> 검수 대시보드
              </a>
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
          80% { transform: scaleX(0.9); }
          100% { transform: scaleX(0.9); }
        }
        .animate-progress {
          animation: progress 4s linear forwards;
        }
      `}} />
    </div>
  );
}
