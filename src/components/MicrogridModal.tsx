"use client";

import { useState } from "react";
import { X, Users, Sun, Battery, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatPKR } from "@/lib/formatters";

export default function MicrogridModal() {
  const { isMicrogridModalOpen, setIsMicrogridModalOpen, selectedCity, selectedProvince } = useApp();
  const [homes, setHomes] = useState(10);
  const [hasSchool, setHasSchool] = useState(true);
  const [hasMosque, setHasMosque] = useState(true);
  const [hasTubewell, setHasTubewell] = useState(true);

  const [simResult, setSimResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!isMicrogridModalOpen) return null;

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents/microgrid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communityName: `${selectedCity} Community Microgrid`,
          buildingsCount: homes + (hasSchool ? 1 : 0) + (hasMosque ? 1 : 0) + (hasTubewell ? 1 : 0),
          homesCount: homes,
          hasSchool,
          hasMosque,
          hasTubewell,
          province: selectedProvince,
          city: selectedCity,
        }),
      });
      const data = await res.json();
      setSimResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-bg-deep border border-sun-gold/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col text-white shadow-2xl">
        {/* Header */}
        <div className="bg-forest-green px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-sun-gold" />
            <h3 className="font-semibold text-lg">Community Microgrid Optimizer</h3>
          </div>
          <button
            onClick={() => setIsMicrogridModalOpen(false)}
            className="text-white/70 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/70 block mb-1">Number of Households</label>
              <input
                type="number"
                min={2}
                max={100}
                value={homes}
                onChange={(e) => setHomes(Number(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div className="flex flex-col justify-center space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasMosque} onChange={(e) => setHasMosque(e.target.checked)} className="accent-sun-gold" />
                Include Village Mosque
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasSchool} onChange={(e) => setHasSchool(e.target.checked)} className="accent-sun-gold" />
                Include Local Primary School
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasTubewell} onChange={(e) => setHasTubewell(e.target.checked)} className="accent-sun-gold" />
                Include Shared Irrigation Tubewell
              </label>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full bg-sun-gold text-bg-deep font-bold py-3 rounded-xl hover:brightness-110 transition-all text-sm shadow-md"
          >
            {loading ? "Optimizing Microgrid..." : "Calculate Shared Microgrid Feasibility"}
          </button>

          {simResult && (
            <div className="bg-white/5 border border-sun-gold/30 rounded-xl p-5 space-y-4 animate-fade-up text-sm">
              <p className="text-xs text-sun-gold italic leading-relaxed">
                &ldquo;{simResult.aiSummary}&rdquo;
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-black/30 p-3 rounded-lg border border-white/10">
                  <span className="text-[10px] text-white/50 block">Shared Solar</span>
                  <span className="font-bold text-base text-sun-gold">{simResult.requiredSolarKW} kW</span>
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/10">
                  <span className="text-[10px] text-white/50 block">Battery Bank</span>
                  <span className="font-bold text-base text-white">{simResult.requiredBatteryKWh} kWh</span>
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/10">
                  <span className="text-[10px] text-white/50 block">Cost / Home</span>
                  <span className="font-bold text-base text-surplus-green">{formatPKR(simResult.costPerHouseholdPKR)}</span>
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/10">
                  <span className="text-[10px] text-white/50 block">Payback</span>
                  <span className="font-bold text-base text-white">{simResult.paybackYears} yrs</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
