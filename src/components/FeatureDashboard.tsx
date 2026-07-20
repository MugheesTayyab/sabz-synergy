"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Sun,
  Battery,
  Wifi,
  CloudSun,
  ShieldCheck,
  MapPin,
  RefreshCw
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatPKR } from "@/lib/formatters";
import { PAKISTAN_CITIES } from "@/lib/pakistan-data";

const features = [
  { icon: Activity, text: "Real-time surplus / shortfall calculation" },
  { icon: CloudSun, text: "AI-powered 72-hour solar forecast" },
  { icon: Battery, text: "Battery optimization suggestions" },
  { icon: Wifi, text: "Predicted outage warnings" },
  { icon: Sun, text: "PKR savings & ROI tracking" },
  { icon: ShieldCheck, text: "Carbon reduction certificate" },
];

export default function FeatureDashboard() {
  const { t, selectedCity, setSelectedCity, setIsMicrogridModalOpen } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`/api/agents/dashboard?city=${encodeURIComponent(selectedCity)}&siteType=Farm&systemKW=18`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  const tiles = [
    { label: t("todaysUsage"), value: `${data?.todaysUsageKWh || 180} kWh`, trend: "Live Load" },
    { label: t("solarGenerated"), value: `${data?.todaysSolarKWh || 145} kWh`, trend: `${data?.currentSolarProductionKW || 12.4} kW active` },
    { label: t("batteryLevel"), value: `${data?.batterySOC || 78}%`, trend: "Lithium Storage" },
    { label: t("gridStatus"), value: data?.gridStatus || "OFFLINE", trend: data?.gridStatus === "OFFLINE" ? "Since 2PM" : "Grid Synchronized" },
  ];

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
          {t("dashTitle")}
        </h2>
        <p className="text-white/60 text-center mb-10 max-w-lg mx-auto">
          {t("dashSubtitle")}
        </p>

        {/* Live Insight Banner */}
        <div className="max-w-4xl mx-auto mb-10 bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between text-white shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sun-gold/20 flex items-center justify-center border border-sun-gold/30">
              <Activity className="w-4 h-4 text-sun-gold" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sun-gold tracking-widest block">{t("liveAiInsight")}</span>
              <p className="text-sm font-medium text-white/95">{data?.aiInsight || "Analyzing regional irradiance & weather..."}</p>
            </div>
          </div>
          <button
            onClick={() => setIsMicrogridModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs bg-sun-gold text-bg-deep font-bold px-3.5 py-2 rounded-lg hover:brightness-110 transition-all shadow-sm"
          >
            Microgrid Tool
          </button>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-bg-card rounded-2xl border border-bg-border p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sun-gold" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-bg-deep border border-sun-gold/30 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sun-gold"
                  >
                    {Object.keys(PAKISTAN_CITIES).map((cName) => (
                      <option key={cName} value={cName}>{cName} ({PAKISTAN_CITIES[cName].province})</option>
                    ))}
                  </select>
                </div>
                <span className="text-white/50 font-[family-name:var(--font-mono)] text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-surplus-green animate-pulse" />
                  LIVE {data?.lastUpdated || "14:32 PKT"}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {tiles.map((tItem) => (
                  <div
                    key={tItem.label}
                    className="bg-bg-deep rounded-xl p-4 border-t-2 border-sun-gold/50"
                  >
                    <p className="text-white/50 text-xs mb-1">{tItem.label}</p>
                    <p
                      className={`font-[family-name:var(--font-mono)] text-lg font-medium ${
                        tItem.label === t("gridStatus") && tItem.value === "OFFLINE"
                          ? "text-deficit-red font-bold"
                          : "text-white"
                      }`}
                    >
                      {tItem.value}
                    </p>
                    {tItem.trend && (
                      <p className="text-white/30 text-[11px] mt-0.5">
                        {tItem.trend}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Dynamic 7-Day Chart */}
              <div className="bg-bg-deep rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-white/60 text-xs">
                    Energy Balance — 7 Days + 3-Day Weather Forecast ({selectedCity})
                  </p>
                  <button onClick={fetchDashboardData} className="text-white/40 hover:text-sun-gold transition-colors">
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="h-40 flex items-end gap-2">
                  {(data?.chartData || [
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
                  ]).map((d: any, i: number) => (
                    <div key={i} className="flex-1 flex gap-0.5 items-end h-full">
                      <div
                        className={`flex-1 rounded-t-sm transition-all duration-500 ${
                          d.forecast ? "bg-sun-gold/30 border border-dashed border-sun-gold/40" : "bg-sun-gold/70 hover:bg-sun-gold"
                        }`}
                        style={{ height: `${Math.min(100, d.solar)}%` }}
                        title={`Solar: ${d.solar}`}
                      />
                      <div
                        className={`flex-1 rounded-t-sm transition-all duration-500 ${
                          d.forecast ? "bg-sky-teal/30 border border-dashed border-sky-teal/40" : "bg-sky-teal/70 hover:bg-sky-teal"
                        }`}
                        style={{ height: `${Math.min(100, d.usage)}%` }}
                        title={`Usage: ${d.usage}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-3">
                  <span className="flex items-center gap-1 text-[10px] text-white/50">
                    <span className="w-3 h-2 bg-sun-gold/70 rounded-sm" /> Solar Generation
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-white/50">
                    <span className="w-3 h-2 bg-sky-teal/70 rounded-sm" /> Energy Load
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-white/50">
                    <span className="w-3 h-2 border border-dashed border-white/30 rounded-sm" /> 72h Open-Meteo Forecast
                  </span>
                </div>
              </div>

              <div className="mt-5 bg-bg-deep rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs mb-1">{t("pkrSavingsMonth")}</p>
                  <p className="font-[family-name:var(--font-mono)] text-3xl text-surplus-green font-bold">
                    {formatPKR(data?.monthSavingsPKR || 42800)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-[11px]">DISCO Utility Rate</p>
                  <p className="text-sun-gold text-xs font-semibold">{data?.disco || "LESCO"} Slabs</p>
                </div>
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
