import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const {
      clientName = "Valued Customer",
      city = "Multan",
      province = "Punjab",
      siteType = "Farm",
      systemKW = 18,
      batteryCapacityKWh = 24,
      totalCostPKR = 3200000,
      annualSavingsPKR = 750000,
      paybackYears = 4.2,
      disco = "MEPCO",
      aiNarrative = ""
    } = await req.json();

    const reportDate = new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' });

    const htmlReport = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sabz Synergy Solar Feasibility Report - ${clientName}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    .header { border-bottom: 3px solid #1A6B3C; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .logo { color: #1A6B3C; font-size: 26px; font-weight: bold; }
    .gold { color: #F5A623; }
    .badge { background: #1A6B3C; color: white; padding: 4px 12px; borderRadius: 4px; font-size: 12px; font-weight: bold; }
    .section-title { font-size: 18px; color: #1A6B3C; border-left: 4px solid #F5A623; padding-left: 10px; margin-top: 30px; font-weight: bold; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
    .card { background: #f8faf9; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
    .card-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
    .card-value { font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 4px; }
    .highlight-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin-top: 20px; color: #166534; font-size: 14px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .table th, .table td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 14px; }
    .table th { background: #f1f5f9; }
    .footer { margin-top: 50px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Sabz Synergy <span class="gold">☀️</span></div>
      <div style="font-size: 13px; color: #64748b;">Pakistan's Smartest Energy Intelligence Platform</div>
    </div>
    <div style="text-align: right;">
      <span class="badge">BANKABLE FEASIBILITY</span>
      <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Date: ${reportDate}</div>
    </div>
  </div>

  <h2 style="margin-top: 25px; color: #0F172A;">Solar System Technical & Financial Feasibility</h2>
  <p style="font-size: 14px; color: #475569;">Prepared for <strong>${clientName}</strong> for site location in <strong>${city}, ${province}</strong> (${disco} Utility Grid Area).</p>

  <div class="section-title">1. System Sizing & Technical Specification</div>
  <div class="grid">
    <div class="card">
      <div class="card-label">Recommended System Capacity</div>
      <div class="card-value">${systemKW} kW Solar</div>
    </div>
    <div class="card">
      <div class="card-label">Battery Storage Capacity</div>
      <div class="card-value">${batteryCapacityKWh} kWh Lithium Bank</div>
    </div>
    <div class="card">
      <div class="card-label">Solar Panels</div>
      <div class="card-value">${Math.ceil((systemKW * 1000) / 585)} x Longi 585W N-type</div>
    </div>
    <div class="card">
      <div class="card-label">Inverter Spec</div>
      <div class="card-value">Fronius / Solis ${systemKW}kW Hybrid</div>
    </div>
  </div>

  <div class="section-title">2. Financial Feasibility & Return on Investment</div>
  <div class="grid">
    <div class="card">
      <div class="card-label">Total Turnkey Capital Cost</div>
      <div class="card-value">PKR ${(totalCostPKR / 100000).toFixed(2)} Lakh</div>
    </div>
    <div class="card">
      <div class="card-label">Estimated Annual Savings</div>
      <div class="card-value" style="color: #1A6B3C;">PKR ${(annualSavingsPKR / 100000).toFixed(2)} Lakh / year</div>
    </div>
    <div class="card">
      <div class="card-label">Equity Payback Period</div>
      <div class="card-value" style="color: #d97706;">${paybackYears} Years</div>
    </div>
    <div class="card">
      <div class="card-label">25-Year Cumulative Savings</div>
      <div class="card-value" style="color: #1A6B3C;">PKR ${((annualSavingsPKR * 25 - totalCostPKR) / 10000000).toFixed(2)} Crore</div>
    </div>
  </div>

  <div class="highlight-box">
    <strong>✓ Meezan Bank Shariah-Compliant Structure Available:</strong><br>
    This project qualifies for Diminishing Musharakah (0% Riba) equity co-ownership financing starting at PKR ${Math.round((totalCostPKR * 0.80) / 60 + (totalCostPKR * 0.005)).toLocaleString()} / month.
  </div>

  <div class="section-title">3. AI Agent Executive Summary</div>
  <p style="font-size: 14px; color: #334155; font-style: italic;">
    "${aiNarrative || `Based on regional sun irradiance in ${city}, this ${systemKW} kW solar installation yields an estimated 85% energy autonomy, shielding ${siteType.toLowerCase()} operations against scheduled ${disco} load shedding and escalating grid tariffs.`}"
  </p>

  <div class="footer">
    Sabz Synergy • Official Hackathon Feasibility Artifact • Generated automatically via Sabz AI Intelligence Suite
  </div>
</body>
</html>
    `;

    return NextResponse.json({
      success: true,
      reportDate,
      htmlReport,
    });
  } catch (error: any) {
    console.error('Report API Error:', error);
    return NextResponse.json({ error: error.message || 'Report generation error' }, { status: 500 });
  }
}
