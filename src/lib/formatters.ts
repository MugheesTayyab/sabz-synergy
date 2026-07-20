export function formatPKR(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'PKR 0';
  if (Math.abs(amount) >= 10000000) {
    return `PKR ${(amount / 10000000).toFixed(2)} Crore`;
  }
  if (Math.abs(amount) >= 100000) {
    return `PKR ${(amount / 100000).toFixed(2)} Lakh`;
  }
  return `PKR ${amount.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
}

export function formatUrduNumber(num: number): string {
  try {
    return new Intl.NumberFormat('ur-PK').format(num);
  } catch {
    return num.toString();
  }
}

export function formatEnergy(kwh: number): string {
  if (kwh >= 1000) {
    return `${(kwh / 1000).toFixed(1)} MWh`;
  }
  return `${Math.round(kwh)} kWh`;
}

export function formatCO2(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} Tonnes CO₂`;
  }
  return `${Math.round(kg)} kg CO₂`;
}
