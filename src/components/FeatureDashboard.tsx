"use client";

import {
  Activity,
  Sun,
  Battery,
  Wifi,
  CloudSun,
  ShieldCheck,
} from "lucide-react";

const features = [
  { icon: Activity, text: "Real-time surplus / shortfall calculation" },
  { icon: CloudSun, text: "AI-powered 72-hour solar forecast" },
  { icon: Battery, text: "Battery optimization suggestions" },
  { icon: Wifi, text: "Predicted outage warnings" },
  { icon: Sun, text: "PKR savings & ROI tracking" },
  { icon: ShieldCheck, text: "Carbon reduction certificate" },
];

const tiles = [
  { label: "Today's Usage", value: "180 kWh", trend: "↑ 8%" },
  { label: "Solar Generated", value: "145 kWh", trend: "82% cap" },
  { label: "Battery Level", value: "72%", trend: "" },
  { label: "Grid Status", value: "OFFLINE", trend: "Since 2PM" },
];

export default function FeatureDashboard() {
  return (
    <section id="features" className="py-24 px-6 relative overflow-hidden" style={{ background: "#0B1E14" }}>
      <div className="absolute inset-0 opacity-[0.03]">
        <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path
            d="M200,100 L250,80 L300,120 L350,90 L400,150 L450,130 L500,180 L520,160 L550,200 L500,250 L450,300 L400,350 L350,380 L300,400 L250,380 L200,350 L180,300 L160,250 L170,200 L190,150 Z"
            fill="none"
            stroke="#F5A623"
            strokeWidth="1"
          />
          <circle cx="250" cy="80" r="3" fill="#F5A623" />
          <circle cx="400" cy="150" r="3" fill="#F5A623" />
          <circle cx="300" cy="400" r="3" fill="#F5A623" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-white text-center mb-3">
          Your Farm&apos;s Energy Brain
        </h2>
        <p className="text-white/60 text-center mb-14 max-w-lg mx-auto">
          Live, Predicted, Optimized — see exactly what&apos;s happening now and
          what&apos;s coming tomorrow.
        </p>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-bg-card rounded-2xl border border-bg-border p-6">
              <div className="flex items-center justify-between mb-5 text-sm">
                <span className="text-white/80 font-medium">
                  Ali Farm — Sheikhupura
                </span>
                <span className="text-white/40 font-[family-name:var(--font-mono)] text-xs">
                  LIVE 14:32 PKT
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {tiles.map((t) => (
                  <div
                    key={t.label}
                    className="bg-bg-deep rounded-xl p-4 border-t-2 border-sun-gold/50"
                  >
                    <p className="text-white/50 text-xs mb-1">{t.label}</p>
                    <p
                      className={`font-[family-name:var(--font-mono)] text-lg font-medium ${
                        t.label === "Grid Status"
                          ? "text-deficit-red"
                          : "text-white"
                      }`}
                    >
                      {t.value}
                    </p>
                    {t.trend && (
                      <p className="text-white/30 text-[11px] mt-0.5">
                        {t.trend}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-bg-deep rounded-xl p-5">
                <p className="text-white/60 text-xs mb-4">
                  Energy Balance — Last 7 Days + Forecast
                </p>
                <div className="h-40 flex items-end gap-2">
                  {[
                    { solar: 65, usage: 50 },
                    { solar: 80, usage: 60 },
                    { solar: 55, usage: 70 },
                    { solar: 90, usage: 55 },
                    { solar: 75, usage: 65 },
                    { solar: 85, usage: 60 },
                    { solar: 70, usage: 50 },
                    { solar: 60, usage: 55, forecast: true },
                    { solar: 50, usage: 65, forecast: true },
                    { solar: 45, usage: 60, forecast: true },
                  ].map((d, i) => (
                    <div key={i} className="flex-1 flex gap-0.5 items-end h-full">
                      <div
                        className={`flex-1 rounded-t-sm ${
                          d.forecast ? "bg-sun-gold/30 border border-dashed border-sun-gold/40" : "bg-sun-gold/70"
                        }`}
                        style={{ height: `${d.solar}%` }}
                      />
                      <div
                        className={`flex-1 rounded-t-sm ${
                          d.forecast ? "bg-sky-teal/30 border border-dashed border-sky-teal/40" : "bg-sky-teal/70"
                        }`}
                        style={{ height: `${d.usage}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-3">
                  <span className="flex items-center gap-1 text-[10px] text-white/50">
                    <span className="w-3 h-2 bg-sun-gold/70 rounded-sm" /> Solar
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-white/50">
                    <span className="w-3 h-2 bg-sky-teal/70 rounded-sm" /> Usage
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-white/50">
                    <span className="w-3 h-2 border border-dashed border-white/30 rounded-sm" /> Forecast
                  </span>
                </div>
              </div>

              <div className="mt-5 bg-bg-deep rounded-xl p-4">
                <p className="text-white/60 text-xs mb-3">PKR Savings This Month</p>
                <p className="font-[family-name:var(--font-mono)] text-3xl text-surplus-green font-bold">
                  PKR 42,800
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-5 justify-center">
            {features.map((f, i) => (
              <div key={f.text} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-sun-gold/10 flex items-center justify-center flex-shrink-0 border border-sun-gold/20">
                  <span className="text-sun-gold font-[family-name:var(--font-mono)] text-sm font-bold">
                    {i + 1}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <f.icon className="w-4 h-4 text-sun-gold/60" />
                  <p className="text-white/80 text-sm">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
