import sys
import json
import numpy as np

# Adjust path to allow imports if run from inside python_services
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.tariff_engine import TariffEngine
from app.services.islamic_finance import evaluate_project

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input provided"}))
        sys.exit(1)
        
    try:
        input_data = json.loads(sys.argv[1])
        
        usage = float(input_data.get('usage', 500))
        budget_lakhs = float(input_data.get('budget', 30))
        province = input_data.get('province', 'Punjab')
        
        # Estimate capital cost
        capital_cost = budget_lakhs * 100000
        
        # Determine DISCO based on province (simplified heuristic)
        disco_map = {
            'Punjab': 'LESCO',
            'Sindh': 'K-Electric',
            'KPK': 'IESCO', # IESCO covers Islamabad/Rawalpindi, Peshawar has PESCO (using IESCO as proxy if not in engine)
            'Balochistan': 'MEPCO' # Using MEPCO as proxy for South
        }
        disco = disco_map.get(province, 'LESCO')
        
        engine = TariffEngine(disco)
        
        # Simplified assumption: 1 kW solar generates ~120 kWh/month in Pak
        # Cost of solar is ~150,000 PKR per kW
        system_kw = capital_cost / 150000
        monthly_production = system_kw * 120
        
        cons_array = np.array([usage] * 12)
        prod_array = np.array([monthly_production] * 12)
        
        total_bill, total_savings = engine.get_annual_savings(cons_array, prod_array)
        
        om_cost = capital_cost * 0.01 # 1% O&M
        
        res = evaluate_project(
            capital_cost=capital_cost,
            om_cost_annual=om_cost,
            annual_savings=total_savings,
            structure='A'
        )
        
        # Add system specifics to result
        res['System_kW'] = round(system_kw, 1)
        res['Estimated_Cost'] = budget_lakhs
        res['Annual_Savings'] = round(total_savings, 2)
        
        print(json.dumps(res))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
