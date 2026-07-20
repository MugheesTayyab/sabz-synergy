import { NextResponse } from 'next/server';
import { DISCO_TARIFFS } from '@/lib/pakistan-data';

export async function POST(req: Request) {
  try {
    const { systemCostPKR = 3000000, annualSavingsPKR = 650000, disco = 'LESCO', tenureYears = 5 } = await req.json();

    const selectedDisco = DISCO_TARIFFS[disco] || DISCO_TARIFFS['LESCO'];
    const tenureMonths = tenureYears * 12;

    // 1. Meezan Bank Diminishing Musharakah (Shariah Compliant 0% Riba, 20% down payment)
    const musharakahEquityDown = systemCostPKR * 0.20;
    const bankShareInitial = systemCostPKR * 0.80;
    const monthlyPrincipalBuyback = bankShareInitial / tenureMonths;
    // Rental yield ~12% per annum on declining bank equity
    const avgBankShareOverTime = bankShareInitial / 2;
    const avgMonthlyRental = (avgBankShareOverTime * 0.12) / 12;
    const musharakahMonthlyPayment = Math.round(monthlyPrincipalBuyback + avgMonthlyRental);
    const musharakahTotalCost = Math.round(musharakahEquityDown + (musharakahMonthlyPayment * tenureMonths));

    // 2. Ijarah Lease-to-Own Structure
    const ijarahAdvanceRental = systemCostPKR * 0.15;
    const ijarahMonthlyRental = Math.round(((systemCostPKR * 0.85) / tenureMonths) * 1.10); // 10% total fee
    const ijarahTotalCost = Math.round(ijarahAdvanceRental + (ijarahMonthlyRental * tenureMonths));

    // 3. Conventional Commercial Loan (KIBOR 18% + 3% margin = 21%)
    const conventionalDownPayment = systemCostPKR * 0.20;
    const loanPrincipal = systemCostPKR * 0.80;
    const monthlyInterestRate = 0.21 / 12;
    const conventionalMonthlyPayment = Math.round(
      (loanPrincipal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) /
      (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1)
    );
    const conventionalTotalCost = Math.round(conventionalDownPayment + (conventionalMonthlyPayment * tenureMonths));

    // 4. SBP State Bank Concessional Refinance Scheme (6% fixed annual rate)
    const sbpMonthlyRate = 0.06 / 12;
    const sbpMonthlyPayment = Math.round(
      (loanPrincipal * sbpMonthlyRate * Math.pow(1 + sbpMonthlyRate, tenureMonths)) /
      (Math.pow(1 + sbpMonthlyRate, tenureMonths) - 1)
    );
    const sbpTotalCost = Math.round(conventionalDownPayment + (sbpMonthlyPayment * tenureMonths));

    // Net Cash Flow Impact
    const monthlyGridSavings = Math.round(annualSavingsPKR / 12);
    const netMonthlyCostMusharakah = musharakahMonthlyPayment - monthlyGridSavings;

    return NextResponse.json({
      systemCostPKR,
      annualSavingsPKR,
      monthlyGridSavings,
      disco: selectedDisco.name,
      tenureYears,
      structures: {
        diminishingMusharakah: {
          name: "Meezan Bank Diminishing Musharakah",
          shariahCompliant: true,
          downPaymentPKR: musharakahEquityDown,
          monthlyPaymentPKR: musharakahMonthlyPayment,
          totalCostPKR: musharakahTotalCost,
          netMonthlyOutflowPKR: netMonthlyCostMusharakah,
          highlights: "0% Riba, Shariah verified, title transfers progressively"
        },
        ijarah: {
          name: "Meezan Ijarah (Lease to Own)",
          shariahCompliant: true,
          downPaymentPKR: ijarahAdvanceRental,
          monthlyPaymentPKR: ijarahMonthlyRental,
          totalCostPKR: ijarahTotalCost,
          highlights: "Fixed monthly rental, bank maintains takaful insurance"
        },
        conventional: {
          name: "Conventional Commercial Bank Loan",
          shariahCompliant: false,
          downPaymentPKR: conventionalDownPayment,
          monthlyPaymentPKR: conventionalMonthlyPayment,
          totalCostPKR: conventionalTotalCost,
          highlights: "KIBOR + 3% variable interest rate"
        },
        sbpRefinance: {
          name: "State Bank SBP Renewable Energy Scheme",
          shariahCompliant: false,
          downPaymentPKR: conventionalDownPayment,
          monthlyPaymentPKR: sbpMonthlyPayment,
          totalCostPKR: sbpTotalCost,
          highlights: "Concessional 6% fixed rate government incentivized scheme"
        }
      }
    });
  } catch (error: any) {
    console.error('Financial API Error:', error);
    return NextResponse.json({ error: error.message || 'Financial service error' }, { status: 500 });
  }
}
