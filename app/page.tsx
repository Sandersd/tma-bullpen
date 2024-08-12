"use client";

import Header from "../components/Header";
import PriceChart from "../components/PriceChart";
import BalanceInfo from "../components/BalanceInfo";
import BottomNav from "../components/BottomNav";
import Image from "next/image";
import { useEffect } from "react";
import WebApp from '@twa-dev/sdk'

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      WebApp.ready();
    }
  }, []);

  const closeApp = () => {
    if (typeof window !== 'undefined') {
      WebApp.close();
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      <PriceChart />
      <BalanceInfo />
      <BottomNav />
    </div>
  );
}
