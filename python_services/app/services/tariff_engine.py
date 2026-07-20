import numpy as np

def calculate_net_metering(monthly_consumption, monthly_production, tariff_rate_peak, tariff_rate_off_peak, is_peak_production=False):
    """
    Calculates net metering savings. Assumes simple net billing cycle.
    Ensures baseline bill never goes negative (min fixed charges apply).
    """
    fixed_charge = 1500  # Example minimum fixed charge in PKR
    
    # Calculate energy costs
    cost_without_solar = monthly_consumption * tariff_rate_off_peak
    
    # Calculate energy credits
    # Net metering credits usually calculated at a specific buy-back rate (often off-peak rate or slightly lower)
    buy_back_rate = tariff_rate_off_peak * 0.85
    credits = monthly_production * buy_back_rate
    
    # Calculate new bill
    new_bill = cost_without_solar - credits
    
    # Ensure bill doesn't drop below fixed charges
    final_bill = max(fixed_charge, new_bill)
    savings = cost_without_solar - final_bill
    
    return final_bill, savings

class TariffEngine:
    DISCO_RATES = {
        'LESCO': {'peak': 45.0, 'off_peak': 35.0},
        'K-Electric': {'peak': 48.0, 'off_peak': 38.0},
        'IESCO': {'peak': 44.0, 'off_peak': 34.0},
        'MEPCO': {'peak': 46.0, 'off_peak': 36.0},
    }

    def __init__(self, disco_name):
        if disco_name not in self.DISCO_RATES:
            raise ValueError(f"Unknown DISCO: {disco_name}")
        self.disco = disco_name
        self.rates = self.DISCO_RATES[disco_name]

    def get_annual_savings(self, annual_consumption_array, annual_production_array):
        """
        Takes numpy arrays of 12 months consumption and production.
        Returns total annual savings.
        """
        total_savings = 0
        total_bill = 0
        for m_cons, m_prod in zip(annual_consumption_array, annual_production_array):
            bill, savings = calculate_net_metering(
                m_cons, m_prod,
                self.rates['peak'], self.rates['off_peak']
            )
            total_savings += savings
            total_bill += bill
        return total_bill, total_savings
