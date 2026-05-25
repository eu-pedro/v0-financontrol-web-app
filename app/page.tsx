"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFinanceStore } from "@/lib/store";

export default function Home() {
  const { isAuthenticated } = useFinanceStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center animate-pulse">
          <span className="text-primary-foreground font-bold text-lg">FC</span>
        </div>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}
