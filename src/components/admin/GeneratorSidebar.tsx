'use client';

import { useEffect, useRef } from 'react';
import { useGeneratorStore, MOCK_CAFE24_PRODUCTS, type TargetGender, type StyleType, type Season } from '@/store/useGeneratorStore';
import { clsx } from 'clsx';

const STYLE_OPTIONS: { value: StyleType; label: string }[] = [
  { value: 'CASUAL', label: '캐주얼' },
  { value: 'FORMAL', label: '포멀' },
  { value: 'STREET', label: '스트릿' },
  { value: 'SPORTY', label: '스포티' },
];

const SEASON_OPTIONS: { value: Season; label: string }[] = [
  { value: 'SPRING', label: '봄' },
  { value: 'SUMMER', label: '여름' },
  { value: 'FALL', label: '가을' },
  { value: 'WINTER', label: '겨울' },
];

const GENDER_OPTIONS: { value: TargetGender; label: string }[] = [
  { value: 'WOMEN', label: 'WOMEN' },
  { value: 'MEN', label: 'MEN' },
];

export function GeneratorSidebar() {
  const {
    prompt, setPrompt,
    styleType, setStyleType,
    season, setSeason,
    targetGender, setTargetGender,
    ratio, setRatio,
    referenceImageUrl, setReferenceImageUrl,
    selectedProducts, toggleProduct,
    models, selectedModelUrl, setSelectedModelUrl, loadModels, isLoadingModels,
    isGenerating, generate,
  } = useGeneratorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadModels(targetGender);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReferenceImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const canGenerate = !isGenerating && selectedProducts.length > 0 && selectedModelUrl !== null;

  return (
    <aside className="w-[360px] bg-white border-r border-zinc-200 h-full overflow-y-auto p-6 flex flex-col gap-6 shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-10 shrink-0">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-1 tracking-tight">AI Workspace</h2>
        <p className="text-xs text-zinc-500">프로모션을 위한 고퀄리티 룩북 수동 생성</p>
      </div>

      {/* Style & Season */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Style</label>
          <select
            value={styleType}
            onChange={(e) => setStyleType(e.target.value as StyleType)}
            className="w-full p-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:border-zinc-400 focus:bg-white outline-none"
          >
            {STYLE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Season</label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value as Season)}
            className="w-full p-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:border-zinc-400 focus:bg-white outline-none"
          >
            {SEASON_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Mood & Style Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. A fashion model walking on a sunny beach, wearing a signature denim jacket, cinematic lighting..."
          className="w-full h-24 p-3 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-400 focus:bg-white outline-none resize-none transition-all placeholder:text-zinc-400"
        />
      </div>

      {/* Model Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex justify-between items-center">
          <span>Model</span>
          {selectedModelUrl && (
            <span className="text-[10px] font-normal text-lime-600 bg-lime-50 px-2 py-0.5 rounded-full">선택됨</span>
          )}
        </label>

        {/* Gender Tabs */}
        <div className="flex gap-1 bg-zinc-100 p-1 rounded-lg mb-1">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g.value}
              onClick={() => setTargetGender(g.value)}
              className={clsx(
                'flex-1 py-1.5 text-xs font-semibold rounded-md transition-all',
                targetGender === g.value
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              )}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Model Grid */}
        {isLoadingModels ? (
          <div className="h-32 flex items-center justify-center text-xs text-zinc-400">
            Loading models...
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-1.5 max-h-52 overflow-y-auto pr-0.5 custom-scrollbar">
            {models.map((model) => {
              const isSelected = selectedModelUrl === model.imageUrl;
              return (
                <button
                  key={model.imageUrl}
                  onClick={() => setSelectedModelUrl(isSelected ? null : model.imageUrl)}
                  className={clsx(
                    'relative aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all',
                    isSelected
                      ? 'border-zinc-900 shadow-md'
                      : 'border-transparent hover:border-zinc-300'
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={model.imageUrl}
                    alt="model"
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] text-white font-bold">
                        ✓
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
            {models.length === 0 && (
              <div className="col-span-4 h-24 flex items-center justify-center text-xs text-zinc-400">
                모델 이미지를 불러올 수 없습니다.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Mapper */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Product Mapping</label>
        <p className="text-[10px] text-zinc-500 mb-1">이 룩북에 등장할 실제 판매 상품을 엮어주세요.</p>

        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
          {MOCK_CAFE24_PRODUCTS.map((prod) => {
            const isSelected = selectedProducts.some(p => p.productId === prod.productId);
            return (
              <div
                key={prod.productId}
                onClick={() => toggleProduct(prod)}
                className={clsx(
                  'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border',
                  isSelected
                    ? 'border-zinc-900 bg-zinc-50'
                    : 'border-transparent hover:bg-zinc-50'
                )}
              >
                <div className="w-10 h-10 rounded-md bg-zinc-200 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={prod.thumbnailUrl} alt={prod.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-800 truncate">{prod.name}</p>
                  <p className="text-[10px] text-zinc-400">{prod.position} · ₩{prod.price.toLocaleString()}</p>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] text-white">✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ratio */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Aspect Ratio</label>
        <div className="flex gap-2 bg-zinc-100 p-1 rounded-lg">
          {(['1:1', '3:4', '9:16'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRatio(r)}
              className={clsx(
                'flex-1 py-1.5 text-xs font-semibold rounded-md transition-all',
                ratio === r
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Reference Image */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex justify-between">
          <span>Reference Image</span>
          <span className="text-zinc-400 font-normal">Optional</span>
        </label>
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
        {referenceImageUrl ? (
          <div className="relative w-full h-24 rounded-xl overflow-hidden border border-zinc-200 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={referenceImageUrl} alt="Reference" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => setReferenceImageUrl(null)}
                className="text-white text-xs font-bold bg-zinc-900/80 px-3 py-1.5 rounded-md hover:bg-rose-500 transition-colors"
              >
                REMOVE
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-20 border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400 text-sm font-medium hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-600 transition-all flex flex-col items-center justify-center gap-1"
          >
            <span className="text-xl">+</span>
            Upload Reference
          </button>
        )}
      </div>

      {/* Generate Button */}
      <div className="mt-auto pt-4 border-t border-zinc-100">
        {!canGenerate && !isGenerating && (
          <p className="text-[10px] text-zinc-400 text-center mb-2">
            {selectedModelUrl === null ? '모델을 선택해주세요' : '상품을 1개 이상 선택해주세요'}
          </p>
        )}
        <button
          onClick={generate}
          disabled={!canGenerate}
          className="w-full py-4 rounded-xl text-sm font-bold text-zinc-900 bg-lime-400 hover:bg-lime-500 shadow-lg shadow-lime-500/20 transition-all disabled:opacity-40 disabled:shadow-none flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin">✨</span> GENERATING...
            </>
          ) : (
            <>
              <span>✨</span> GENERATE LOOKBOOK
            </>
          )}
        </button>
      </div>

    </aside>
  );
}
