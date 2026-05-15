import { Zap, TrendingDown, Globe } from "lucide-react";

const problems = [
  {
    icon: Zap,
    stat: "12–18 Hours",
    title: "Load Shedding Daily",
    desc: "Rural areas face crippling power cuts, destroying productivity and livelihoods.",
    color: "text-deficit-red",
  },
  {
    icon: TrendingDown,
    stat: "45%",
    title: "Systems Incorrectly Sized",
    desc: "Nearly half of solar installations are over or under-engineered — wasting crores in investment.",
    color: "text-warning-amber",
  },
  {
    icon: Globe,
    stat: "100%",
    title: "Existing Tools Are Foreign",
    desc: "No local weather data, no PKR pricing, no Urdu support — Pakistan deserves its own tools.",
    color: "text-sky-teal",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-24 px-6 bg-off-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-text-dark text-center mb-4">
          Pakistan&apos;s Energy Crisis Is Solvable
        </h2>
        <p className="text-text-muted text-center mb-14 max-w-lg mx-auto">
          The problem isn&apos;t a lack of sun — it&apos;s a lack of intelligence.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-card-surface rounded-xl p-7 border-l-4 border-earth-terracotta shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 jali-border opacity-40 rounded-bl-3xl" />
              <p.icon className={`w-6 h-6 ${p.color} mb-4`} />
              <p className="font-[family-name:var(--font-mono)] text-3xl font-bold text-text-dark mb-1">
                {p.stat}
              </p>
              <h3 className="font-semibold text-text-dark text-lg mb-2">
                {p.title}
              </h3>
              <p className="text-text-mid text-sm leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="gold-divider mt-16 mx-auto max-w-md" />
      </div>
    </section>
  );
}
