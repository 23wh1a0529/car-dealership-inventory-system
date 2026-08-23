function App() {
  return (
    <div className="min-h-screen bg-canvas">
      <nav className="bg-surface px-6 py-4 flex items-center justify-between border-b border-teal/15">
        <span className="font-display text-teal text-xl font-semibold tracking-tight">
          AutoLedger
        </span>
        <span className="font-body text-ink/60 text-sm">Dealership Inventory</span>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-ink mb-2">
          Design system check
        </h1>
        <p className="font-body text-ink/70 mb-6">
          Warm ivory background, teal brand accents, gold CTA, and mono data
          styling. If this looks light and airy (not dark), the setup worked.
        </p>

        <div className="bg-surface rounded-xl p-5 shadow-sm border border-ink/10 max-w-sm relative">
          <span className="absolute top-4 right-4 font-mono text-xs text-ink/40 uppercase tracking-wide">
            STK #0042
          </span>
          <p className="font-mono text-2xl text-ink font-medium">$24,000</p>
          <p className="font-body text-ink/60 text-sm mt-1 mb-4">2024 Toyota Corolla</p>

          <div className="h-2 rounded-full bg-ink/10 overflow-hidden mb-4">
            <div className="h-full bg-turquoise" style={{ width: "70%" }}></div>
          </div>

          <button className="bg-gold text-white font-body font-medium text-sm px-4 py-2 rounded-lg">
            Purchase
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
