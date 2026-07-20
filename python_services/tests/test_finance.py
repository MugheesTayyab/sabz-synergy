import pytest
import numpy as np
from app.services.tariff_engine import TariffEngine, calculate_net_metering
from app.services.islamic_finance import evaluate_project

def test_net_metering_no_negative_bill():
    # High production, low consumption
    bill, savings = calculate_net_metering(
        monthly_consumption=100, 
        monthly_production=1000, 
        tariff_rate_peak=45.0, 
        tariff_rate_off_peak=35.0
    )
    # The bill should not be negative, it should equal the fixed charge (1500)
    assert bill == 1500
    assert savings > 0

def test_tariff_engine_savings():
    engine = TariffEngine('LESCO')
    cons = np.array([500]*12)
    prod = np.array([400]*12)
    
    total_bill, total_savings = engine.get_annual_savings(cons, prod)
    assert total_bill > 0
    assert total_savings > 0

def test_finance_structures():
    # Test Structure A
    res_a = evaluate_project(
        capital_cost=1000000, 
        om_cost_annual=10000, 
        annual_savings=300000, 
        structure='A'
    )
    assert res_a['IRR'] > 0
    
    # Test Structure B
    res_b = evaluate_project(
        capital_cost=1000000, 
        om_cost_annual=10000, 
        annual_savings=300000, 
        structure='B'
    )
    assert res_b['IRR'] > 0
