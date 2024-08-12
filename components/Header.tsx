import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-dark text-white">
      <button className="text-xl">←</button>
      <div className="flex items-center">
        <Image src="/dogwifhat.jpg" alt="Token Logo" width={40} height={40} className="rounded-full" />
        <div className="ml-2">
          <h1 className="text-lg font-bold">$WIF</h1>
          <p className="text-green-400">$1.74 <span className="text-xs">(0.901%)</span></p>
        </div>
      </div>
      <button className="text-xl">⤴</button>
    </header>
  );
}
