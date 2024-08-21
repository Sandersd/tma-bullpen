"use client";

export default function BalanceInfo() {
  return (
    <section className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Your balance</h2>
          <p className="text-sm text-gray-600">Value: $77.79</p>
        </div>
        <button className="bg-green-500 text-white px-6 py-3 rounded-full text-lg font-semibold">Buy</button>
      </div>
      <div className="flex justify-between mb-8">
        <button className="text-gray-600">Home</button>
        <button className="text-gray-600">Rewards</button>
        <button className="text-gray-600">Holdings</button>
      </div>
    </section>
  );
}
