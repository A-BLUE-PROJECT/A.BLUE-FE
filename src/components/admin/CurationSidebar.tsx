'use client';

import { useAdminStore } from '@/store/useAdminStore';
import { clsx } from 'clsx';

export function CurationSidebar() {
  const { filterStatus, setFilterStatus, minAiScore, setMinAiScore } = useAdminStore();

  const handleStatusChange = (status: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED') => {
    setFilterStatus(status);
  };

  return (
    <aside className="w-80 bg-white border-r border-zinc-200 h-full overflow-y-auto p-6 flex flex-col gap-8 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
      
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 mb-1">Curation Filters</h2>
        <p className="text-xs text-zinc-500">대기 중인 룩북 검수 및 상태 필터링</p>
      </div>

      {/* Status Segmented Control */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Status</label>
        <div className="flex flex-col gap-2">
          {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status as import('@/store/useAdminStore').LookbookStatus)}
              className={clsx(
                "flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                filterStatus === status 
                  ? "bg-zinc-900 text-white shadow-sm" 
                  : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
              )}
            >
              <span>{status}</span>
              {filterStatus === status && (
                <span className="w-2 h-2 rounded-full bg-lime-400"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* AI Score Filter */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Min AI Score</label>
          <span className="text-sm font-bold text-lime-600">{minAiScore}</span>
        </div>
        <input
          type="range"
          min="0"
          max="99"
          value={minAiScore}
          onChange={(e) => setMinAiScore(Number(e.target.value))}
          className="w-full accent-lime-500 outline-none hover:accent-lime-400"
        />
        <div className="flex justify-between text-[10px] text-zinc-400">
          <span>0</span>
          <span>99</span>
        </div>
      </div>

    </aside>
  );
}
