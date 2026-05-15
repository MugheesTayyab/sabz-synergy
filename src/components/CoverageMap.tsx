"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

const provinces = [
  { name: "Punjab", sunHours: "5.5h", wind: "Low", rec: "Solar + Battery", users: 120, x: 55, y: 42 },
  { name: "Sindh", sunHours: "6.2h", wind: "Medium", rec: "Solar + Wind", users: 45, x: 50, y: 68 },
  { name: "KPK", sunHours: "5.0h", wind: "High", rec: "Hybrid System", users: 30, x: 48, y: 25 },
  { name: "Balochistan", sunHours: "6.8h", wind: "High", rec: "Solar + Wind", users: 15, x: 30, y: 55 },
  { name: "AJK", sunHours: "4.5h", wind: "Medium", rec: "Micro-Hydro + Solar", users: 8, x: 58, y: 22 },
  { name: "GB", sunHours: "4.8h", wind: "Medium", rec: "Hybrid + Hydro", users: 5, x: 55, y: 12 },
];

export default function CoverageMap() {
  const [active, setActive] = useState<string | null>(null);
  const activeData = provinces.find((p) => p.name === active);

  return (
    <section className="py-24 px-6 bg-card-surface">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-text-dark text-center mb-14">
          Pakistan Coverage
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative bg-off-white rounded-2xl p-8 aspect-[4/3] flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full max-w-md">
                <path
                  d="M45,5 L55,8 L62,15 L60,22 L65,28 L60,35 L68,42 L65,50 L70,58 L60,65 L55,75 L50,85 L42,90 L35,82 L25,78 L18,65 L15,55 L20,45 L18,35 L22,28 L30,22 L35,15 L42,10 Z"
                  fill="#1A6B3C"
                  fillOpacity="0.1"
                  stroke="#1A6B3C"
                  strokeWidth="0.5"
                />
                {provinces.map((p) => (
                  <g key={p.name}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={Math.max(2, p.users / 30)}
                      fill="#F5A623"
                      fillOpacity={active === p.name ? 1 : 0.6}
                      stroke="#F5A623"
                      strokeWidth={active === p.name ? 1 : 0}
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setActive(p.name)}
                      onMouseLeave={() => setActive(null)}
                      onClick={() => setActive(active === p.name ? null : p.name)}
                    />
                    <text
                      x={p.x}
                      y={p.y + (p.users > 30 ? 7 : 5)}
                      textAnchor="middle"
                      fill="#4A4A4A"
                      fontSize="2.5"
                      className="pointer-events-none select-none"
                    >
                      {p.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-off-white rounded-xl p-5">
              <p className="text-text-muted text-xs mb-3">Coverage Stats</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-[family-name:var(--font-mono)] text-2xl text-text-dark font-bold">6</p>
                  <p className="text-text-muted text-xs">Provinces</p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-mono)] text-2xl text-text-dark font-bold">42</p>
                  <p className="text-text-muted text-xs">Cities</p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-mono)] text-2xl text-forest-green font-bold">223</p>
                  <p className="text-text-muted text-xs">Active Sites</p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-mono)] text-2xl text-sun-gold font-bold">4.2Cr</p>
                  <p className="text-text-muted text-xs">PKR Saved</p>
                </div>
              </div>
            </div>

            {activeData ? (
              <div className="bg-forest-green/5 rounded-xl p-5 border border-forest-green/10">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-forest-green" />
                  <h4 className="font-semibold text-text-dark">{activeData.name}</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Avg. Peak Sun</span>
                    <span className="font-[family-name:var(--font-mono)] text-text-dark">{activeData.sunHours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Wind Speed</span>
                    <span className="text-text-dark">{activeData.wind}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Recommended</span>
                    <span className="text-forest-green font-medium">{activeData.rec}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Active Users</span>
                    <span className="font-[family-name:var(--font-mono)] text-text-dark">{activeData.users}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-off-white rounded-xl p-5 text-center text-text-muted text-sm">
                Hover over a province on the map to see details
              </div>
            )}

            <div className="text-center">
              <a
                href="#calculator"
                className="inline-block bg-forest-green text-white font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition-all text-sm"
              >
                Check Your Area
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
