"use client";

import Header from "../components/Header";
import PriceChart from "../components/PriceChart";
import BalanceInfo from "../components/BalanceInfo";
import BottomNav from "../components/BottomNav";
import { useEffect, useState } from "react";
import WebApp from '@twa-dev/sdk'

export default function Home() {
  const [currentPrice, setCurrentPrice] = useState<number>(1.74);

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
      <Header currentPrice={currentPrice} />
      <PriceChart onPriceHover={setCurrentPrice} />
      <BalanceInfo />
      <BottomNav />
    </div>
  );
}