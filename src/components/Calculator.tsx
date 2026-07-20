"use client";

import { useState } from "react";
import { MapPin, Zap, Wallet, ArrowRight, Leaf, Sparkles, FileText, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PAKISTAN_CITIES } from "@/lib/pakistan-data";
import { formatPKR } from "@/lib/formatters";

const provinces = ["Punjab", "Sindh", "KPK", "Balochistan", "AJK", "Gilgit-Baltistan"];
const siteTypes = ["Farm", "School", "Factory", "Home", "Community"];

export default function Calculator() {
  const { t, selectedCity, setSelectedCity, selectedProvince, setSelectedProvince, setSizingResult, setIsChatOpen, setIsReportModalOpen } = useApp();

  const [step, setStep] = useState(1);
  const [usage, setUsage] = useState(600);
  const [siteType, setSiteType] = useState("Farm");
  const [budget, setBudget] = useState(35);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [financeData, setFinanceData] = useState<any>(null);
  const [activeFinanceTab, setActiveFinanceTab] = useState<'musharakah' | 'conventional'>('musharakah');

  // Filter cities by province
  const availableCities = Object.values(PAKISTAN_CITIES).filter(
    (c) => !selectedProvince || c.province === selectedProvince
  );

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      try {
        const res = await fetch("/api/agents/sizing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            province: selectedProvince,
            city: selectedCity,
            usage,
            siteType,
            budget,
          }),
        });
        const data = await res.json();
        setResultData(data);
        setSizingResult(data);

        // Fetch Financial comparison
        const finRes = await fetch("/api/agents/financial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemCostPKR: data.totalCostPKR,
            annualSavingsPKR: data.annualSavingsPKR,
            disco: data.disco,
          }),
        });
        const finData = await finRes.json();
        setFinanceData(finData);

        setShowResult(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <section id="calculator" className="py-24 px-6 bg-off-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-text-dark text-center mb-3">
          {t("calcTitle")}
        </h2>
        <p className="text-text-muted text-center mb-12">
          {t("calcSubtitle")}
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
                  <span className="font-semibold">{t("step1")}</span>
                </div>

                <div>
                  <label className="text-sm text-text-mid block mb-2">{t("province")}</label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => {
                      setSelectedProvince(e.target.value);
                      const firstCityInProv = Object.values(PAKISTAN_CITIES).find(c => c.province === e.target.value);
                      if (firstCityInProv) setSelectedCity(firstCityInProv.name);
                    }}
                    className="w-full border border-warm-sand rounded-lg px-4 py-3 text-text-dark bg-off-white focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
                  >
                    {provinces.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-text-mid block mb-2">{t("city")}</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full border border-warm-sand rounded-lg px-4 py-3 text-text-dark bg-off-white focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
                  >
                    {availableCities.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.disco} • {c.peakSunHours}h Sun)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-forest-green mb-4">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">{t("step2")}</span>
                </div>

                <div>
                  <label className="text-sm text-text-mid block mb-2">
                    {t("monthlyUsage")}: <span className="font-[family-name:var(--font-mono)] text-text-dark font-bold">{usage} kWh</span>
                  </label>
                  <input
                    type="range"
                    min={100}
                    max={5000}
                    step={50}
                    value={usage}
                    onChange={(e) => setUsage(Number(e.target.value))}
                    className="w-full accent-forest-green cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>100 kWh (Home)</span>
                    <span>5,000 kWh (Industrial)</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-text-mid block mb-3">{t("siteType")}</label>
                  <div className="flex flex-wrap gap-2">
                    {siteTypes.map((tName) => (
                      <button
                        key={tName}
                        onClick={() => setSiteType(tName)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          siteType === tName
                            ? "bg-forest-green text-white border-forest-green"
                            : "bg-off-white text-text-mid border-warm-sand hover:border-forest-green"
                        }`}
                      >
                        {tName}
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
                  <span className="font-semibold">{t("step3")}</span>
                </div>
                <div>
                  <label className="text-sm text-text-mid block mb-2">
                    {t("budget")}: <span className="font-[family-name:var(--font-mono)] text-text-dark font-bold">PKR {budget} Lakh</span>
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={200}
                    step={5}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-forest-green cursor-pointer"
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
                  className="text-text-mid hover:text-text-dark text-sm font-medium"
                >
                  {t("back")}
                </button>
              ) : <span />}
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="bg-forest-green text-white font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all flex items-center gap-2 text-sm disabled:opacity-70 shadow-md hover:scale-[1.02]"
              >
                {isLoading ? "Calculating via AI..." : step === 3 ? t("calculate") : t("next")}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-card-surface rounded-2xl p-8 shadow-lg border border-sun-gold/20 animate-fade-up">
            <div className="flex items-center justify-between mb-4 border-b border-warm-sand pb-4">
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-dark">
                {t("recSystem")} ({resultData?.city}, {resultData?.province})
              </h3>
              <span className="bg-forest-green/10 text-forest-green text-xs font-semibold px-3 py-1 rounded-full">
                {resultData?.disco} Net-Metering Enabled
              </span>
            </div>

            {/* AI Narrative */}
            <div className="bg-bg-deep/5 border-l-4 border-sun-gold p-4 rounded-r-xl mb-6 text-sm text-text-dark italic leading-relaxed">
              &ldquo;{resultData?.aiNarrative}&rdquo;
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-off-white rounded-xl p-5 border border-warm-sand">
                <p className="text-text-muted text-xs mb-1">System Design</p>
                <p className="text-text-dark font-semibold text-lg">
                  {resultData?.systemKW || 18} kW Solar Array
                </p>
                <p className="text-text-mid text-xs mt-1">
                  {resultData?.panelCount} x 585W Longi Panels + {resultData?.batteryCapacityKWh} kWh Battery
                </p>
              </div>

              <div className="bg-off-white rounded-xl p-5 border border-warm-sand">
                <p className="text-text-muted text-xs mb-1">{t("estimatedCost")}</p>
                <p className="font-[family-name:var(--font-mono)] text-2xl text-text-dark font-bold">
                  {formatPKR(resultData?.totalCostPKR || 3200000)}
                </p>
              </div>

              <div className="bg-off-white rounded-xl p-5 border border-warm-sand">
                <p className="text-text-muted text-xs mb-1">{t("roiTimeline")}</p>
                <p className="font-[family-name:var(--font-mono)] text-2xl text-forest-green font-bold">
                  {resultData?.paybackYears || 4.2} Years
                </p>
              </div>

              <div className="bg-off-white rounded-xl p-5 border border-warm-sand">
                <p className="text-text-muted text-xs mb-1">{t("annualSavings")}</p>
                <p className="font-[family-name:var(--font-mono)] text-2xl text-sun-gold font-bold">
                  {formatPKR(resultData?.annualSavingsPKR || 750000)} / yr
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-surplus-green/10 rounded-lg p-3.5 mb-6">
              <Leaf className="w-4 h-4 text-surplus-green" />
              <span className="text-surplus-green text-sm font-semibold">
                {t("co2Reduction")}: {resultData?.co2ReductionTonnes || 14.2} Tonnes CO₂ / year
              </span>
            </div>

            {/* Islamic Financing Tab */}
            {financeData && (
              <div className="bg-off-white rounded-xl p-5 border border-sun-gold/30 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-text-dark uppercase tracking-wider">Financing Comparison</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveFinanceTab('musharakah')}
                      className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                        activeFinanceTab === 'musharakah' ? 'bg-forest-green text-white' : 'bg-warm-sand text-text-mid'
                      }`}
                    >
                      Meezan Diminishing Musharakah (Shariah)
                    </button>
                    <button
                      onClick={() => setActiveFinanceTab('conventional')}
                      className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                        activeFinanceTab === 'conventional' ? 'bg-forest-green text-white' : 'bg-warm-sand text-text-mid'
                      }`}
                    >
                      Conventional Loan
                    </button>
                  </div>
                </div>

                {activeFinanceTab === 'musharakah' ? (
                  <div>
                    <p className="text-sm font-semibold text-forest-green flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> {financeData.structures?.diminishingMusharakah?.name}
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                      <div>
                        <span className="text-text-muted">20% Down Payment:</span>
                        <p className="font-bold text-text-dark">{formatPKR(financeData.structures?.diminishingMusharakah?.downPaymentPKR)}</p>
                      </div>
                      <div>
                        <span className="text-text-muted">Monthly Inst. ({financeData.tenureYears} yrs):</span>
                        <p className="font-bold text-text-dark">{formatPKR(financeData.structures?.diminishingMusharakah?.monthlyPaymentPKR)}/mo</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-text-dark">
                      {financeData.structures?.conventional?.name}
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                      <div>
                        <span className="text-text-muted">Down Payment:</span>
                        <p className="font-bold text-text-dark">{formatPKR(financeData.structures?.conventional?.downPaymentPKR)}</p>
                      </div>
                      <div>
                        <span className="text-text-muted">Monthly Loan Payment:</span>
                        <p className="font-bold text-text-dark">{formatPKR(financeData.structures?.conventional?.monthlyPaymentPKR)}/mo</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="bg-sun-gold text-bg-deep font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition-all text-sm flex items-center gap-2 shadow-md hover:scale-[1.02]"
              >
                <FileText className="w-4 h-4" />
                Download Bankable Report
              </button>

              <button
                onClick={() => setIsChatOpen(true)}
                className="border border-forest-green text-forest-green font-semibold px-5 py-3 rounded-lg hover:bg-forest-green/10 transition-colors text-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-sun-gold" />
                Ask Sabz Saathi
              </button>

              <button
                onClick={() => { setShowResult(false); setStep(1); }}
                className="border border-warm-sand text-text-mid px-4 py-3 rounded-lg hover:border-forest-green transition-colors text-sm ml-auto"
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
