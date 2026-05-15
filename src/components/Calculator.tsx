"use client";

import { useState } from "react";
import { MapPin, Zap, Wallet, ArrowRight, Leaf } from "lucide-react";

const provinces = ["Punjab", "Sindh", "KPK", "Balochistan", "AJK", "Gilgit-Baltistan"];
const siteTypes = ["Farm", "School", "Factory", "Home", "Community"];

export default function Calculator() {
  const [step, setStep] = useState(1);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [usage, setUsage] = useState(500);
  const [siteType, setSiteType] = useState("");
  const [budget, setBudget] = useState(30);
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else setShowResult(true);
  };

  return (
    <section id="calculator" className="py-24 px-6 bg-off-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-text-dark text-center mb-3">
          Design Your System in 3 Minutes
        </h2>
        <p className="text-text-muted text-center mb-12">
          No engineering degree required
        </p>

        <div className="flex items-center justify-center gap-0 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= s
                    ? "bg-forest-green text-white"
                    : "bg-warm-sand text-text-muted"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-0.5 ${
                    step > s ? "bg-forest-green" : "bg-warm-sand"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {!showResult ? (
          <div className="bg-card-surface rounded-2xl p-8 shadow-lg border border-sun-gold/10">
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-forest-green mb-4">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">Step 1: Your Location</span>
                </div>
                <div>
                  <label className="text-sm text-text-mid block mb-2">Province</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full border border-warm-sand rounded-lg px-4 py-3 text-text-dark bg-off-white focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
                  >
                    <option value="">Select Province</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-text-mid block mb-2">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Multan, Lahore, Karachi"
                    className="w-full border border-warm-sand rounded-lg px-4 py-3 text-text-dark bg-off-white focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-forest-green mb-4">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">Step 2: Your Usage</span>
                </div>
                <div>
                  <label className="text-sm text-text-mid block mb-2">
                    Monthly Usage: <span className="font-[family-name:var(--font-mono)] text-text-dark font-bold">{usage} kWh</span>
                  </label>
                  <input
                    type="range"
                    min={100}
                    max={5000}
                    step={50}
                    value={usage}
                    onChange={(e) => setUsage(Number(e.target.value))}
                    className="w-full accent-forest-green"
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>100 kWh</span>
                    <span>5,000 kWh</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-text-mid block mb-3">Site Type</label>
                  <div className="flex flex-wrap gap-2">
                    {siteTypes.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSiteType(t)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          siteType === t
                            ? "bg-forest-green text-white border-forest-green"
                            : "bg-off-white text-text-mid border-warm-sand hover:border-forest-green"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-forest-green mb-4">
                  <Wallet className="w-5 h-5" />
                  <span className="font-semibold">Step 3: Your Budget</span>
                </div>
                <div>
                  <label className="text-sm text-text-mid block mb-2">
                    Budget: <span className="font-[family-name:var(--font-mono)] text-text-dark font-bold">PKR {budget} Lakh</span>
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={200}
                    step={5}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-forest-green"
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>PKR 5 Lakh</span>
                    <span>PKR 2 Crore</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-text-mid hover:text-text-dark text-sm"
                >
                  Back
                </button>
              ) : <span />}
              <button
                onClick={handleNext}
                className="bg-forest-green text-white font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all flex items-center gap-2 text-sm"
              >
                {step === 3 ? "Calculate" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-card-surface rounded-2xl p-8 shadow-lg border border-sun-gold/20">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-dark mb-6">
              Recommended System
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-off-white rounded-xl p-5">
                <p className="text-text-muted text-xs mb-1">System Design</p>
                <p className="text-text-dark font-semibold">
                  18 kW Solar + 40 kWh Battery
                </p>
                <p className="text-text-mid text-sm">+ 10 kW Backup Generator</p>
              </div>
              <div className="bg-off-white rounded-xl p-5">
                <p className="text-text-muted text-xs mb-1">Estimated Cost</p>
                <p className="font-[family-name:var(--font-mono)] text-2xl text-text-dark font-bold">
                  PKR 28.4 Lakh
                </p>
              </div>
              <div className="bg-off-white rounded-xl p-5">
                <p className="text-text-muted text-xs mb-1">ROI Timeline</p>
                <p className="font-[family-name:var(--font-mono)] text-2xl text-forest-green font-bold">
                  4.2 Years
                </p>
              </div>
              <div className="bg-off-white rounded-xl p-5">
                <p className="text-text-muted text-xs mb-1">Annual Savings</p>
                <p className="font-[family-name:var(--font-mono)] text-2xl text-sun-gold font-bold">
                  PKR 6.8 Lakh
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-surplus-green/10 rounded-lg p-3 mb-4">
              <Leaf className="w-4 h-4 text-surplus-green" />
              <span className="text-surplus-green text-sm font-medium">
                CO₂ Reduction: 14.2 tonnes/year
              </span>
            </div>

            <div className="bg-forest-green/5 rounded-lg p-3 mb-6">
              <p className="text-forest-green text-sm">
                Islamic Financing Available via Meezan Bank — 0% Ribah Structure ✓
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="bg-sun-gold text-bg-deep font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition-all text-sm">
                Get Full Feasibility Report
              </button>
              <button
                onClick={() => { setShowResult(false); setStep(1); }}
                className="border border-warm-sand text-text-mid px-5 py-3 rounded-lg hover:border-forest-green transition-colors text-sm"
              >
                Recalculate
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
