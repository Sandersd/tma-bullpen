"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import PriceChart from '@/components/PriceChart';
import BalanceInfo from '@/components/BalanceInfo';

export default function Home() {
  const [currentPrice, setCurrentPrice] = useState(1.56);

  const handlePriceHover = (price: number) => {
    setCurrentPrice(price);
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header currentPrice={currentPrice} />
      <PriceChart onPriceHover={handlePriceHover} />
      <BalanceInfo />
    </main>
  );
}