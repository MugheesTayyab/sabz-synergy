import { NextResponse } from 'next/server';
import { PAKISTAN_CITIES, DISCO_TARIFFS, SITE_LOAD_PROFILES, SOLAR_EQUIPMENT } from '@/lib/pakistan-data';
import { callOpenRouter } from '@/lib/openrouter';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { province, city, usage = 500, siteType = 'Home', budget = 30 } = body;

    const cityMeta = PAKISTAN_CITIES[city] || PAKISTAN_CITIES[province === 'Sindh' ? 'Karachi' : 'Lahore'];
    const disco = DISCO_TARIFFS[cityMeta.disco] || DISCO_TARIFFS['LESCO'];
    const profile = SITE_LOAD_PROFILES[siteType] || SITE_LOAD_PROFILES['Home'];

    // Sizing Logic
    // Daily usage kWh
    const dailyUsageKWh = usage / 30;
    const peakSunHours = cityMeta.peakSunHours;
    
    // System kW required with 80% system performance factor
    let systemKW = Math.round((dailyUsageKWh / (peakSunHours * 0.8)) * 10) / 10;
    if (systemKW < 3) systemKW = 3;

    // Estimated Panels (585W Panels)
    const panelCount = Math.ceil((systemKW * 1000) / 585);
    const recommendedPanel = SOLAR_EQUIPMENT.panels[0]; // Longi
    
    // Battery sizing: backup for load shedding hours
    const backupHours = Math.min(6, cityMeta.baseLoadSheddingHours);
    const hourlyLoad = dailyUsageKWh / 24;
    const batteryCapacityKWh = Math.round(hourlyLoad * backupHours * 1.2 * 10) / 10;

    // Pick Inverter and Battery spec
    const recommendedInverter = SOLAR_EQUIPMENT.inverters.find(i => parseInt(i.capacity) >= systemKW) || SOLAR_EQUIPMENT.inverters[0];
    const recommendedBattery = SOLAR_EQUIPMENT.batteries[0];

    // Costs (PKR)
    const panelCost = panelCount * recommendedPanel.pricePKR;
    const inverterCost = recommendedInverter.pricePKR;
    const batteryCost = Math.ceil(batteryCapacityKWh / 4.8) * recommendedBattery.pricePKR;
    const installationCost = Math.round((systemKW * 15000) + 50000);
    const totalCostPKR = panelCost + inverterCost + batteryCost + installationCost;
    const estimatedBudgetLakh = Math.round((totalCostPKR / 100000) * 10) / 10;

    // Annual Generation & Tariff Savings
    const annualGenerationKWh = Math.round(systemKW * peakSunHours * 365 * 0.85);
    const annualUsageKWh = usage * 12;
    
    const daytimeGenerationKWh = annualGenerationKWh * profile.daytimeRatio;
    const netExportKWh = Math.max(0, daytimeGenerationKWh - (annualUsageKWh * profile.daytimeRatio));
    const netImportKWh = Math.max(0, annualUsageKWh - daytimeGenerationKWh);

    const billWithoutSolarPKR = annualUsageKWh * disco.offPeakRatePKR + (disco.fixedMonthlyCharges * 12);
    const billWithSolarPKR = (netImportKWh * disco.offPeakRatePKR) - (netExportKWh * disco.netMeteringBuybackPKR) + (disco.fixedMonthlyCharges * 12);
    const annualSavingsPKR = Math.round(Math.max(billWithoutSolarPKR * 0.75, billWithoutSolarPKR - billWithSolarPKR));
    const paybackYears = Math.round((totalCostPKR / annualSavingsPKR) * 10) / 10;
    const irrPct = Math.round((100 / paybackYears) * 1.4 * 10) / 10;
    const co2ReductionTonnes = Math.round((annualGenerationKWh * 0.0006) * 10) / 10;

    // AI Narrative Generation via OpenRouter
    let aiNarrative = "";
    try {
      const prompt = `You are Sabz Saathi, an expert energy AI for Pakistan. Write a 3-sentence concise technical and financial summary for a user in ${city}, ${province} requesting solar sizing for a ${siteType}.
Context:
- System: ${systemKW} kW Solar (${panelCount} x 585W Longi Panels)
- Battery: ${batteryCapacityKWh} kWh Lithium Backup for ${backupHours} hours load shedding
- Estimated Cost: PKR ${estimatedBudgetLakh} Lakh
- Annual Savings: PKR ${(annualSavingsPKR / 100000).toFixed(2)} Lakh
- Payback Period: ${paybackYears} years
- Local DISCO: ${disco.name} (${cityMeta.peakSunHours} peak sun hours/day)
Highlight the ROI, local sun conditions, and suitability for ${siteType}. Keep tone encouraging, professional, and grounded in Pakistan facts.`;
      
      aiNarrative = await callOpenRouter([{ role: 'user', content: prompt }], { max_tokens: 150 });
    } catch {
      aiNarrative = `Based on ${cityMeta.peakSunHours} peak daily sun hours in ${city}, a ${systemKW} kW system will offset ~85% of your ${siteType}'s electricity bill. With ${disco.name} net-metering rates, your PKR ${estimatedBudgetLakh} Lakh investment yields PKR ${(annualSavingsPKR / 100000).toFixed(2)} Lakh in annual savings with a fast ${paybackYears}-year payback period.`;
    }

    return NextResponse.json({
      city: cityMeta.name,
      province: cityMeta.province,
      disco: disco.name,
      siteType,
      systemKW,
      panelCount,
      panelSpec: recommendedPanel,
      inverterSpec: recommendedInverter,
      batteryCapacityKWh,
      batterySpec: recommendedBattery,
      backupHours,
      totalCostPKR,
      estimatedBudgetLakh,
      annualGenerationKWh,
      annualSavingsPKR,
      monthlySavingsPKR: Math.round(annualSavingsPKR / 12),
      paybackYears,
      irrPct,
      co2ReductionTonnes,
      aiNarrative,
    });
  } catch (error: any) {
    console.error("Sizing API error:", error);
    return NextResponse.json({ error: error.message || "Failed to calculate sizing" }, { status: 500 });
  }
}
