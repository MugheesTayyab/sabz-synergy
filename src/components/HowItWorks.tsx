import { Database, BrainCircuit, BarChart3 } from "lucide-react";

const steps = [
  {
    num: 1,
    icon: Database,
    title: "Connect Your Data",
    desc: "Enter daily usage, solar output, battery status — or connect your smart meter directly.",
  },
  {
    num: 2,
    icon: BrainCircuit,
    title: "AI Analyzes Everything",
    desc: "Local PMD weather, equipment specs, tariff pricing, demand patterns — all crunched in real-time.",
  },
  {
    num: 3,
    icon: BarChart3,
    title: "Get Actionable Intelligence",
    desc: "Dashboard shows what to do, when, and why — in plain Urdu or English.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-warm-sand relative ajrak-pattern">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-text-dark text-center mb-3">
          Simple as 1-2-3
        </h2>
        <p className="text-text-muted text-center mb-16">
          No technical knowledge needed
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {i < 2 && (
                <div className="hidden md:block absolute top-8 left-[calc(100%+0rem)] w-full h-0.5 border-t-2 border-dashed border-sun-gold/40 z-0" style={{width: "calc(100% - 3rem)", left: "calc(50% + 2rem)"}} />
              )}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-forest-green flex items-center justify-center mb-5 shadow-lg">
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <span className="font-[family-name:var(--font-mono)] text-sun-gold text-sm font-bold mb-2">
                  Step {s.num}
                </span>
                <h3 className="font-semibold text-text-dark text-lg mb-2">
                  {s.title}
                </h3>
                <p className="text-text-mid text-sm leading-relaxed max-w-xs">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
