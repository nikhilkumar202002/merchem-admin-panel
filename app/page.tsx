"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "./utils/auth";
import DashboardPage from "./dashboard/page";

export default function Home() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const isAuth = isAuthenticated();
    setAuthed(isAuth);
    if (!isAuth) {
      router.replace("/login");
    }
  }, [router]);

  if (authed === null || !authed) {
    return (
      <div className="min-h-screen bg-[#F5F7F6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#980e27] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <DashboardPage />;
}