'use client';
import "@/public/phase1/css/styles.css";
import { signIn} from "next-auth/react";


export default function StatisticsNavItem() {
  return (
    <button
      className="nav-item"
      onClick={() => signIn(undefined, { callbackUrl: "/statistics", redirect: true })}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      <i className="fas fa-chart-simple"></i>
    </button>
  );
}
