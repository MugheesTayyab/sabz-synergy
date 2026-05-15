export default function TrustBar() {
  const stats = [
    "Trusted by 200+ farms across Punjab",
    "PKR 4.2 Crore saved in energy costs",
    "12 Provincial Government Projects",
    "World Bank · AEDB · UNDP · USAID Partners",
  ];

  return (
    <section id="trust" className="bg-off-white py-6 overflow-hidden border-y border-warm-sand">
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...stats, ...stats].map((s, i) => (
            <span
              key={i}
              className="mx-12 text-text-muted text-sm font-medium"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
