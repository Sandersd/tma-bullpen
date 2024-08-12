export default function BalanceInfo() {
  return (
    <section className="p-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg">Your balance</h2>
          <p className="text-sm">Value: $0.00</p>
          <p className="text-sm">Quantity: 0</p>
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded">Buy</button>
      </div>
      <div className="mt-4">
        <h3 className="text-lg">About</h3>
        <p>Popular meme Dogwifhat vibes wif frens onchain @Dogwifcoin on X</p>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <p>Market cap</p>
          <p>$1.7B</p>
        </div>
        <div>
          <p>Volume</p>
          <p>$74.7M</p>
        </div>
        <div>
          <p>All time high</p>
          <p>$4.78</p>
        </div>
        <div>
          <p>All time low</p>
          <p>$0.0512</p>
        </div>
      </div>
    </section>
  );
}
