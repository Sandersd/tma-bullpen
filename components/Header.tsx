"use client";

import Image from "next/image";

interface HeaderProps {
  currentPrice: number;
}

export default function Header({ currentPrice }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-white text-black">
      <button className="text-xl">←</button>
      <div className="flex items-center">
        <Image src="/dogwifhat.jpg" alt="Token Logo" width={40} height={40} className="rounded-full object-cover h-[40px] w-[40px]" />
        <div className="ml-2">
          <h1 className="text-lg font-bold">$WIF</h1>
          <p className="text-green-500">${currentPrice.toFixed(2)} <span className="text-xs">(8.47%)</span></p>
        </div>
      </div>
      <button className="text-xl">⤴</button>
    </header>
  );
}