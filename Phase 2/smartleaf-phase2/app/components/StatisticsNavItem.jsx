'use client';
import "@/public/phase1/css/styles.css";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function StatisticsNavItem() {
  const { data: session } = useSession();
  const router = useRouter();

  function handleClick(e) {
    e.preventDefault();
    if (!session) {
      signIn(undefined, { callbackUrl: "/statistics", prompt: "login" });
    } else {
      router.push("/statistics");
    }
  }

  return (
    <a href="/statistics" onClick={handleClick} className="nav-item">
      <i className="fas fa-chart-simple"></i>
    </a>
  );
}
