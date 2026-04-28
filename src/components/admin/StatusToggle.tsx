"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface Props {
  lookbookId: number;
  onDone: () => void;
}

export function StatusToggle({ lookbookId, onDone }: Props) {
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle = async (action: "approve" | "reject") => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.patch(`/adm/v1/lookbooks/${lookbookId}/${action}`);
      setStatus(action === "approve" ? "APPROVED" : "REJECTED");
      setTimeout(onDone, 600);
    } catch (e) {
      setError(e instanceof Error ? e.message : "처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "APPROVED") {
    return (
      <span className="text-green-600 font-bold flex items-center justify-center gap-1 bg-green-50 py-3 rounded-xl">
        <CheckCircle2 className="w-5 h-5" />
        Approved
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="text-zinc-500 font-bold flex items-center justify-center gap-1 bg-zinc-100 py-3 rounded-xl">
        <XCircle className="w-5 h-5" />
        Rejected
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p className="text-xs text-rose-500 text-center bg-rose-50 rounded-lg py-2 px-3">{error}</p>
      )}
    <div className="grid grid-cols-2 gap-3">
      <button
        disabled={loading}
        onClick={() => handle("reject")}
        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        <XCircle className="w-4 h-4" />
        <span className="font-semibold">Reject</span>
      </button>
      <button
        disabled={loading}
        onClick={() => handle("approve")}
        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span className="font-semibold">Approve</span>
      </button>
    </div>
    </div>
  );
}
