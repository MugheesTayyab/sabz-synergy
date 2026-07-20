import numpy as np
import numpy_financial as npf

def diminishing_musharakah(capital_cost, developer_equity_share, years=10, rental_yield=0.15):
    """
    Structure A: Diminishing Musharakah
    developer_equity_share: Initial share of the developer (e.g., 0.20 for 20%)
    Bank owns the rest. Developer buys back equity over `years`.
    """
    bank_equity = capital_cost * (1 - developer_equity_share)
    equity_buyback_per_year = bank_equity / years
    
    cash_flows = []
    current_bank_equity = bank_equity
    
    for year in range(years):
        rent_payment = current_bank_equity * rental_yield
        total_payment = equity_buyback_per_year + rent_payment
        cash_flows.append(-total_payment)
        current_bank_equity -= equity_buyback_per_year
        
    return np.array(cash_flows)

def conventional_debt(capital_cost, debt_ratio=0.80, years=10, kibor=0.22, margin=0.03):
    """
    Structure B: Conventional Debt with KIBOR + margin
    """
    principal = capital_cost * debt_ratio
    rate = kibor + margin
    
    # Calculate PMT (annual payment)
    payment = npf.pmt(rate, years, -principal)
    
    cash_flows = [-payment] * years
    return np.array(cash_flows)

def evaluate_project(capital_cost, om_cost_annual, annual_savings, structure='A', years=10):
    """
    Returns LCOE, IRR, Equity Payback Period, Accumulated Savings
    """
    if structure == 'A':
        financing_cf = diminishing_musharakah(capital_cost, developer_equity_share=0.20, years=years)
    else:
        financing_cf = conventional_debt(capital_cost, debt_ratio=0.80, years=years)
        
    # Project cash flows
    initial_investment = -capital_cost * 0.20 # Assume 20% equity down payment
    
    net_cash_flows = [initial_investment]
    accumulated_savings = 0
    payback_period = None
    
    # Assume savings degrade slightly or stay constant, let's keep constant for simplicity
    for year in range(years):
        cf = annual_savings - om_cost_annual + financing_cf[year]
        net_cash_flows.append(cf)
        accumulated_savings += cf
        
        # Calculate payback
        if payback_period is None and sum(net_cash_flows) >= 0:
            payback_period = year + 1
            
    irr = npf.irr(net_cash_flows)
    
    # LCOE = Total Lifetime Cost / Total Lifetime Energy Production
    # Simplified LCOE calculation here
    lcoe = (capital_cost + (om_cost_annual * years)) / (annual_savings * years / 30) # rough proxy
    
    return {
        "LCOE": round(lcoe, 2),
        "IRR": round(irr * 100, 2),
        "Payback_Period": payback_period if payback_period else ">10 years",
        "Accumulated_Savings": round(accumulated_savings, 2)
    }
