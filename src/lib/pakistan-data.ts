export interface CityInfo {
  name: string;
  province: string;
  lat: number;
  lon: number;
  disco: string;
  peakSunHours: number;
  windSpeed: 'Low' | 'Medium' | 'High';
  recommendedSystem: string;
  baseLoadSheddingHours: number;
}

export const PAKISTAN_CITIES: Record<string, CityInfo> = {
  // Punjab
  "Lahore": { name: "Lahore", province: "Punjab", lat: 31.5204, lon: 74.3587, disco: "LESCO", peakSunHours: 5.5, windSpeed: "Low", recommendedSystem: "Solar + Battery Hybrid", baseLoadSheddingHours: 4 },
  "Faisalabad": { name: "Faisalabad", province: "Punjab", lat: 31.4187, lon: 73.0791, disco: "FESCO", peakSunHours: 5.6, windSpeed: "Low", recommendedSystem: "Industrial On-Grid Solar", baseLoadSheddingHours: 6 },
  "Multan": { name: "Multan", province: "Punjab", lat: 30.1575, lon: 71.5249, disco: "MEPCO", peakSunHours: 6.2, windSpeed: "Medium", recommendedSystem: "Agricultural Solar Tubewell", baseLoadSheddingHours: 8 },
  "Rawalpindi": { name: "Rawalpindi", province: "Punjab", lat: 33.5651, lon: 73.0169, disco: "IESCO", peakSunHours: 5.3, windSpeed: "Low", recommendedSystem: "Rooftop Net-Metering", baseLoadSheddingHours: 3 },
  "Gujranwala": { name: "Gujranwala", province: "Punjab", lat: 32.1877, lon: 74.1945, disco: "GEPCO", peakSunHours: 5.4, windSpeed: "Low", recommendedSystem: "Commercial Hybrid", baseLoadSheddingHours: 6 },
  "Sialkot": { name: "Sialkot", province: "Punjab", lat: 32.4945, lon: 74.5229, disco: "GEPCO", peakSunHours: 5.4, windSpeed: "Low", recommendedSystem: "Export Industry Solar", baseLoadSheddingHours: 5 },
  "Sheikhupura": { name: "Sheikhupura", province: "Punjab", lat: 31.7167, lon: 73.9850, disco: "LESCO", peakSunHours: 5.5, windSpeed: "Low", recommendedSystem: "Farm + Processing Solar", baseLoadSheddingHours: 7 },
  "Rahim Yar Khan": { name: "Rahim Yar Khan", province: "Punjab", lat: 28.4202, lon: 70.2952, disco: "MEPCO", peakSunHours: 6.4, windSpeed: "Medium", recommendedSystem: "High-Sun Tubewell Hybrid", baseLoadSheddingHours: 10 },
  "Bahawalpur": { name: "Bahawalpur", province: "Punjab", lat: 29.3956, lon: 71.6722, disco: "MEPCO", peakSunHours: 6.3, windSpeed: "Medium", recommendedSystem: "Solar + Storage", baseLoadSheddingHours: 8 },
  "Sargodha": { name: "Sargodha", province: "Punjab", lat: 32.0836, lon: 72.6711, disco: "FESCO", peakSunHours: 5.7, windSpeed: "Low", recommendedSystem: "Citrus Farm Solar", baseLoadSheddingHours: 7 },

  // Sindh
  "Karachi": { name: "Karachi", province: "Sindh", lat: 24.8607, lon: 67.0011, disco: "K-Electric", peakSunHours: 6.1, windSpeed: "High", recommendedSystem: "Wind-Solar Hybrid", baseLoadSheddingHours: 4 },
  "Hyderabad": { name: "Hyderabad", province: "Sindh", lat: 25.3960, lon: 68.3578, disco: "HESCO", peakSunHours: 6.3, windSpeed: "High", recommendedSystem: "Wind + Solar System", baseLoadSheddingHours: 8 },
  "Sukkur": { name: "Sukkur", province: "Sindh", lat: 27.7052, lon: 68.8574, disco: "SEPCO", peakSunHours: 6.5, windSpeed: "Medium", recommendedSystem: "Ultra Solar High Yield", baseLoadSheddingHours: 10 },
  "Larkana": { name: "Larkana", province: "Sindh", lat: 27.5580, lon: 68.2141, disco: "SEPCO", peakSunHours: 6.4, windSpeed: "Medium", recommendedSystem: "Agricultural Solar", baseLoadSheddingHours: 11 },
  "Nawabshah": { name: "Nawabshah", province: "Sindh", lat: 26.2442, lon: 68.4100, disco: "HESCO", peakSunHours: 6.5, windSpeed: "Medium", recommendedSystem: "Farm & Dairy Solar", baseLoadSheddingHours: 9 },
  "Tharparkar": { name: "Tharparkar", province: "Sindh", lat: 24.7394, lon: 69.8118, disco: "HESCO", peakSunHours: 6.7, windSpeed: "High", recommendedSystem: "Off-Grid Solar + Microgrid", baseLoadSheddingHours: 14 },

  // KPK
  "Peshawar": { name: "Peshawar", province: "KPK", lat: 34.0151, lon: 71.5249, disco: "PESCO", peakSunHours: 5.2, windSpeed: "Low", recommendedSystem: "Hybrid Net-Metering", baseLoadSheddingHours: 6 },
  "Mardan": { name: "Mardan", province: "KPK", lat: 34.1989, lon: 72.0231, disco: "PESCO", peakSunHours: 5.2, windSpeed: "Low", recommendedSystem: "Commercial Solar", baseLoadSheddingHours: 7 },
  "Swat": { name: "Swat", province: "KPK", lat: 35.2227, lon: 72.4258, disco: "PESCO", peakSunHours: 4.8, windSpeed: "Medium", recommendedSystem: "Hydro-Solar Micro Hybrid", baseLoadSheddingHours: 8 },
  "Abbottabad": { name: "Abbottabad", province: "KPK", lat: 34.1688, lon: 73.2215, disco: "PESCO", peakSunHours: 4.9, windSpeed: "Medium", recommendedSystem: "Rooftop Hybrid", baseLoadSheddingHours: 5 },
  "Swabi": { name: "Swabi", province: "KPK", lat: 34.1167, lon: 72.4667, disco: "PESCO", peakSunHours: 5.1, windSpeed: "Low", recommendedSystem: "School & Farm Solar", baseLoadSheddingHours: 7 },
  "Dera Ismail Khan": { name: "Dera Ismail Khan", province: "KPK", lat: 31.8320, lon: 70.9017, disco: "PESCO", peakSunHours: 6.0, windSpeed: "Medium", recommendedSystem: "Agricultural Solar Tubewell", baseLoadSheddingHours: 10 },

  // Balochistan
  "Quetta": { name: "Quetta", province: "Balochistan", lat: 30.1798, lon: 66.9750, disco: "QESCO", peakSunHours: 6.8, windSpeed: "High", recommendedSystem: "High Altitude Solar + Wind", baseLoadSheddingHours: 12 },
  "Gwadar": { name: "Gwadar", province: "Balochistan", lat: 25.1264, lon: 62.3225, disco: "QESCO", peakSunHours: 6.5, windSpeed: "High", recommendedSystem: "Coastal Solar Wind Hybrid", baseLoadSheddingHours: 10 },
  "Turbat": { name: "Turbat", province: "Balochistan", lat: 26.0031, lon: 63.0444, disco: "QESCO", peakSunHours: 6.9, windSpeed: "Medium", recommendedSystem: "Max Sun Off-Grid Storage", baseLoadSheddingHours: 14 },
  "Khuzdar": { name: "Khuzdar", province: "Balochistan", lat: 27.8000, lon: 66.6167, disco: "QESCO", peakSunHours: 6.7, windSpeed: "Medium", recommendedSystem: "Deep Well Solar Tubewell", baseLoadSheddingHours: 13 },

  // AJK
  "Muzaffarabad": { name: "Muzaffarabad", province: "AJK", lat: 34.3700, lon: 73.4711, disco: "IESCO", peakSunHours: 4.6, windSpeed: "Medium", recommendedSystem: "Micro-Hydro + Solar", baseLoadSheddingHours: 6 },
  "Mirpur": { name: "Mirpur", province: "AJK", lat: 33.1476, lon: 73.7516, disco: "IESCO", peakSunHours: 5.2, windSpeed: "Low", recommendedSystem: "Rooftop Residential Solar", baseLoadSheddingHours: 4 },

  // Gilgit-Baltistan
  "Gilgit": { name: "Gilgit", province: "Gilgit-Baltistan", lat: 35.9208, lon: 74.3144, disco: "PESCO", peakSunHours: 4.8, windSpeed: "Medium", recommendedSystem: "Alpine Solar + Hydro", baseLoadSheddingHours: 8 },
  "Skardu": { name: "Skardu", province: "Gilgit-Baltistan", lat: 35.2971, lon: 75.6335, disco: "PESCO", peakSunHours: 4.9, windSpeed: "Medium", recommendedSystem: "Off-Grid Alpine Battery Bank", baseLoadSheddingHours: 9 },
};

export interface DISCOTariff {
  name: string;
  fullName: string;
  province: string;
  peakRatePKR: number;
  offPeakRatePKR: number;
  netMeteringBuybackPKR: number;
  fixedMonthlyCharges: number;
}

export const DISCO_TARIFFS: Record<string, DISCOTariff> = {
  "LESCO": { name: "LESCO", fullName: "Lahore Electric Supply Company", province: "Punjab", peakRatePKR: 45.5, offPeakRatePKR: 35.2, netMeteringBuybackPKR: 27.5, fixedMonthlyCharges: 1500 },
  "K-Electric": { name: "K-Electric", fullName: "K-Electric Karachi", province: "Sindh", peakRatePKR: 48.2, offPeakRatePKR: 38.4, netMeteringBuybackPKR: 28.0, fixedMonthlyCharges: 1800 },
  "IESCO": { name: "IESCO", fullName: "Islamabad Electric Supply Company", province: "Punjab/AJK", peakRatePKR: 44.0, offPeakRatePKR: 34.0, netMeteringBuybackPKR: 27.0, fixedMonthlyCharges: 1200 },
  "MEPCO": { name: "MEPCO", fullName: "Multan Electric Power Company", province: "Punjab", peakRatePKR: 46.8, offPeakRatePKR: 36.5, netMeteringBuybackPKR: 27.0, fixedMonthlyCharges: 1400 },
  "PESCO": { name: "PESCO", fullName: "Peshawar Electric Supply Company", province: "KPK", peakRatePKR: 43.5, offPeakRatePKR: 33.5, netMeteringBuybackPKR: 26.5, fixedMonthlyCharges: 1100 },
  "GEPCO": { name: "GEPCO", fullName: "Gujranwala Electric Power Company", province: "Punjab", peakRatePKR: 45.0, offPeakRatePKR: 35.0, netMeteringBuybackPKR: 27.2, fixedMonthlyCharges: 1400 },
  "FESCO": { name: "FESCO", fullName: "Faisalabad Electric Supply Company", province: "Punjab", peakRatePKR: 45.2, offPeakRatePKR: 35.1, netMeteringBuybackPKR: 27.1, fixedMonthlyCharges: 1450 },
  "HESCO": { name: "HESCO", fullName: "Hyderabad Electric Supply Company", province: "Sindh", peakRatePKR: 47.0, offPeakRatePKR: 37.0, netMeteringBuybackPKR: 27.5, fixedMonthlyCharges: 1600 },
  "SEPCO": { name: "SEPCO", fullName: "Sukkur Electric Power Company", province: "Sindh", peakRatePKR: 47.5, offPeakRatePKR: 37.2, netMeteringBuybackPKR: 27.0, fixedMonthlyCharges: 1650 },
  "QESCO": { name: "QESCO", fullName: "Quetta Electric Supply Company", province: "Balochistan", peakRatePKR: 46.0, offPeakRatePKR: 36.0, netMeteringBuybackPKR: 26.0, fixedMonthlyCharges: 1200 },
};

export const SITE_LOAD_PROFILES: Record<string, { daytimeRatio: number; peakHourRatio: number; description: string }> = {
  "Farm": { daytimeRatio: 0.75, peakHourRatio: 0.25, description: "Heavy daytime motor/tubewell pumping" },
  "School": { daytimeRatio: 0.95, peakHourRatio: 0.05, description: "Pure daytime operating hours (8 AM - 3 PM)" },
  "Factory": { daytimeRatio: 0.60, peakHourRatio: 0.40, description: "Continuous double-shift industrial machinery" },
  "Home": { daytimeRatio: 0.35, peakHourRatio: 0.65, description: "Evening AC, lighting, and household appliances heavy load" },
  "Community": { daytimeRatio: 0.50, peakHourRatio: 0.50, description: "Shared multi-building balanced load profile" },
};

export interface EquipmentItem {
  brand: string;
  model: string;
  capacity: string;
  pricePKR: number;
  warrantyYears: number;
}

export const SOLAR_EQUIPMENT = {
  panels: [
    { brand: "Longi Solar", model: "Hi-MO 6 N-type", capacity: "585W", pricePKR: 19500, warrantyYears: 25 },
    { brand: "JA Solar", model: "DeepBlue 4.0 Pro", capacity: "575W", pricePKR: 18800, warrantyYears: 25 },
    { brand: "Canadian Solar", model: "TOPBiHiKu7", capacity: "690W", pricePKR: 23500, warrantyYears: 25 },
    { brand: "Jinko Solar", model: "Tiger Neo N-type", capacity: "600W", pricePKR: 20200, warrantyYears: 25 },
  ],
  inverters: [
    { brand: "Fronius", model: "Symo Advanced 15.0", capacity: "15 kW Hybrid", pricePKR: 480000, warrantyYears: 10 },
    { brand: "Solis", model: "S6 Hybrid Three Phase", capacity: "12 kW", pricePKR: 340000, warrantyYears: 5 },
    { brand: "Huawei", model: "SUN2000-10KTL-M1", capacity: "10 kW Smart", pricePKR: 390000, warrantyYears: 10 },
    { brand: "Growatt", model: "SPH10000TL3 BH-UP", capacity: "10 kW Hybrid", pricePKR: 310000, warrantyYears: 5 },
  ],
  batteries: [
    { brand: "Pylontech", model: "US5000 LiFePO4", capacity: "4.8 kWh", pricePKR: 380000, warrantyYears: 10 },
    { brand: "Dyness", model: "Tower T10", capacity: "10.6 kWh", pricePKR: 790000, warrantyYears: 10 },
    { brand: "Narada", model: "48V 100Ah Lithium", capacity: "4.8 kWh", pricePKR: 320000, warrantyYears: 5 },
  ]
};
