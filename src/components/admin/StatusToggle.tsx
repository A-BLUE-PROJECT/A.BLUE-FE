"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export function StatusToggle({ lookbookId }: { lookbookId: number }) {
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");

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
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => setStatus("REJECTED")}
        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
      >
        <XCircle className="w-4 h-4" />
        <span className="font-semibold">Reject</span>
      </button>
      <button
        onClick={() => setStatus("APPROVED")}
        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span className="font-semibold">Approve</span>
      </button>
    </div>
  );
}
