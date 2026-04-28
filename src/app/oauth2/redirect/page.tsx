"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function OAuth2RedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const error = searchParams.get("error");

    if (error) {
      const provider = searchParams.get("provider") ?? "";
      const msg =
        error === "ACCOUNT_EXISTS"
          ? `이미 ${provider} 계정으로 가입되어 있습니다.`
          : "로그인에 실패했습니다. 다시 시도해주세요.";
      router.replace(`/?loginError=${encodeURIComponent(msg)}`);
      return;
    }

    fetchMe().then((user) => {
      if (user) {
        router.replace("/");
      } else {
        router.replace("/?loginError=" + encodeURIComponent("인증 정보를 확인할 수 없습니다."));
      }
    });
  }, [searchParams, fetchMe, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white rounded-full animate-spin" />
        <p className="text-sm text-zinc-500">로그인 처리 중...</p>
      </div>
    </div>
  );
}
