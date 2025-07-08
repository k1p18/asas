// config.ts

export const PRINTING_CONSTANTS = {
  MAX_MODEL_DIMENSION: 250, // This value was not in the hardcoded calculations, keeping it as is.
  FILAMENT_CROSS_SECTION: 0.08, // Changed from 2.405 to 0.4 * 0.2 = 0.08
  FILAMENT_COST_PER_METER: 2, // Changed from 0.1 to 2
  MACHINE_TIME_COST_PER_HOUR: 40, // Changed from 50 to 40
  ELECTRICITY_COST_PER_KWH: 10, // Changed from 8 to 10
  // Note: The hardcoded electricity calculation was (120 / 1000) * (printTime / 3600) * 10
  // This implies 120W power usage and 10 Rs/kWh.
  // The '120' is still a magic number in the calculation, not derived from here.
  MARKET_COST_PER_CM3: 2, // Changed from 0.5 to 2
  MATERIAL_COST_PER_KG: 1500, // Changed from 100 to 1500
  BASE_COST: 10, // Changed from 50 to 10
  LABOR_COST: 30, // Changed from 20 to 30
  RISK_FACTOR: 5, // Changed from 10 to 5
  GST_RATE: 0.18, // Remains 0.18 (18/100)
  LAYER_HEIGHT: 0.2, // mm
  PRINT_SPEED: 50, // mm/s
  PERIMETER_SPEED: 20, // mm/s
  TRAVEL_SPEED: 25, // mm/s
  LAYER_CHANGE_TIME: 1.0, // seconds
  PRINT_TIME_OVERHEAD: 120, // seconds
  WALL_LINE_WIDTH: 0.4, // mm
  WALL_COUNT: 2,
  TOP_BOTTOM_LAYERS: 5,
};

export const CART_CONSTANTS = {
  SHIPPING_COST: 2.0,
  TAX_RATE: 0.18,
};
