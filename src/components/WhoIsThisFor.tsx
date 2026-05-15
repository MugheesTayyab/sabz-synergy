"use client";

import { useState } from "react";
import { Wheat, School, Factory, Home, Landmark, Globe } from "lucide-react";

const tabs = [
  {
    id: "farmers",
    label: "Farmers",
    icon: Wheat,
    pain: [
      "Load shedding destroys tube-well schedules, killing crops",
      "Solar vendors oversell expensive systems with no data backing",
      "No way to track if solar investment is actually paying off",
    ],
    metric: "A 50-acre wheat farm near Multan saves PKR 2.1 lakh/month",
    cta: "Start Farming Smarter",
  },
  {
    id: "schools",
    label: "Schools",
    icon: School,
    pain: [
      "Students lose learning hours to daily power outages",
      "Diesel generators are expensive and unreliable",
      "No funding visibility for solar ROI to present to boards",
    ],
    metric: "Govt. School in Swabi now runs 6 hours on solar with zero outages",
    cta: "Power Your School",
  },
  {
    id: "factories",
    label: "Factories",
    icon: Factory,
    pain: [
      "Unpredictable power costs crush profit margins",
      "Peak-hour tariffs are 3x higher — impossible to plan around",
      "No tools to optimize generator + solar + grid switching",
    ],
    metric: "Textile factory in Faisalabad cut energy costs by 38%",
    cta: "Optimize Your Factory",
  },
  {
    id: "communities",
    label: "Communities",
    icon: Home,
    pain: [
      "Shared microgrids are hard to manage fairly",
      "No transparency on who uses how much energy",
      "Battery degradation goes unnoticed until system failure",
    ],
    metric: "Community microgrid in Thar now serves 80 households reliably",
    cta: "Build Your Microgrid",
  },
  {
    id: "government",
    label: "Government",
    icon: Landmark,
    pain: [
      "No centralized view of provincial energy projects",
      "Reporting is manual and months delayed",
      "Cannot measure impact of renewable investments",
    ],
    metric: "12 provincial projects monitored in real-time across Punjab",
    cta: "Explore Government Dashboard",
  },
  {
    id: "ngos",
    label: "NGOs",
    icon: Globe,
    pain: [
      "Donors demand data-backed impact reports",
      "Field teams lack tools to design proper systems",
      "Carbon offset reporting is manual guesswork",
    ],
    metric: "UNDP partner reduced reporting time by 70% using Sabz Synergy",
    cta: "Power Your Mission",
  },
];

export default function WhoIsThisFor() {
  const [active, setActive] = useState("farmers");
  const tab = tabs.find((t) => t.id === active)!;

  return (
    <section className="py-24 px-6 bg-card-surface">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-text-dark text-center mb-12">
          Built For Every Pakistani Who Needs Power
        </h2>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active === t.id
                  ? "bg-forest-green text-white shadow-md"
                  : "bg-off-white text-text-mid hover:bg-warm-sand"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-off-white rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-text-dark text-lg mb-4">
                Pain Points
              </h3>
              <ul className="space-y-3">
                {tab.pain.map((p) => (
                  <li key={p} className="flex gap-3 text-text-mid text-sm">
                    <span className="text-earth-terracotta font-bold mt-0.5">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-between">
              <div className="bg-card-surface rounded-xl p-5 border border-sun-gold/20">
                <p className="text-text-muted text-xs mb-2">Real Impact</p>
                <p className="text-text-dark font-semibold leading-relaxed">
                  {tab.metric}
                </p>
              </div>
              <a
                href="#calculator"
                className="mt-6 bg-forest-green text-white font-semibold px-6 py-3 rounded-lg text-center hover:brightness-110 transition-all text-sm"
              >
                {tab.cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
