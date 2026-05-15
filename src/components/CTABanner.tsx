export default function CTABanner() {
  return (
    <section className="relative py-20 px-6 bg-forest-green overflow-hidden">
      <div className="absolute inset-0 jali-border opacity-20" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <p
          className="text-sun-gold text-2xl mb-3 leading-relaxed"
          dir="rtl"
          style={{ fontFamily: "Noto Nastaliq Urdu, serif" }}
        >
          ابھی شروع کریں — پہلا مہینہ مفت
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold text-white mb-8">
          Join 200+ Pakistani Businesses Saving on Energy
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#calculator"
            className="bg-sun-gold text-bg-deep font-semibold px-8 py-3.5 rounded-lg hover:brightness-110 transition-all hover:scale-[1.02] text-[15px]"
          >
            Create Free Account
          </a>
          <button className="border border-white/40 text-white font-medium px-7 py-3.5 rounded-lg hover:border-sun-gold transition-colors text-[15px]">
            Talk to an Expert
          </button>
        </div>
      </div>
    </section>
  );
}
