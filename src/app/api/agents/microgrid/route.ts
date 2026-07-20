import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const {
      communityName = "Tharparkar Village Solar Microgrid",
      buildingsCount = 12,
      hasMosque = true,
      hasSchool = true,
      hasTubewell = true,
      homesCount = 9,
      province = "Sindh",
      city = "Tharparkar"
    } = await req.json();

    // Microgrid capacity calculation
    const totalDailyKWhNeeded = (homesCount * 12) + (hasMosque ? 15 : 0) + (hasSchool ? 30 : 0) + (hasTubewell ? 60 : 0);
    const requiredSolarKW = Math.round((totalDailyKWhNeeded / (6.5 * 0.8)) * 10) / 10;
    const requiredBatteryKWh = Math.round(totalDailyKWhNeeded * 0.4 * 10) / 10;

    const systemCostPKR = Math.round(requiredSolarKW * 140000 + requiredBatteryKWh * 65000 + 400000);
    const costPerHouseholdPKR = Math.round(systemCostPKR / (homesCount + (hasMosque ? 0.5 : 0) + (hasSchool ? 1 : 0) + (hasTubewell ? 2 : 0)));

    const monthlyGridSavingsPKR = Math.round(totalDailyKWhNeeded * 30 * 36);
    const paybackYears = Math.round((systemCostPKR / (monthlyGridSavingsPKR * 12)) * 10) / 10;

    const loadPriorityRules = [
      { priority: 1, label: "Critical (Mosque & School)", action: "Always Powered (100% Uptime Guarantee)" },
      { priority: 2, label: "Agricultural Tubewell", action: "Active 8 AM - 4 PM during peak sun hours" },
      { priority: 3, label: "Household Lighting & Fans", action: "Active 24/7 buffered by battery bank" },
      { priority: 4, label: "Heavy Home Appliances", action: "Automated shedding during load shedding outages" },
    ];

    return NextResponse.json({
      communityName,
      city,
      province,
      totalDailyKWhNeeded,
      requiredSolarKW,
      requiredBatteryKWh,
      systemCostPKR,
      costPerHouseholdPKR,
      monthlyGridSavingsPKR,
      paybackYears,
      loadPriorityRules,
      aiSummary: `${communityName} in ${city} requires a ${requiredSolarKW} kW shared solar array and ${requiredBatteryKWh} kWh battery bank. By pooling resources across ${buildingsCount} buildings, individual household upfront cost drops to PKR ${(costPerHouseholdPKR / 100000).toFixed(2)} Lakh with guaranteed 24/7 power for the mosque, school, and agricultural tubewells.`,
    });
  } catch (error: any) {
    console.error('Microgrid API Error:', error);
    return NextResponse.json({ error: error.message || 'Microgrid calculation error' }, { status: 500 });
  }
}
