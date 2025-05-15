export function calculateWeight(volume: number, density: number = 1.24): number {
  // Density in g/cm³ (default for PLA). Volume is assumed to be in mm³.
  // Convert volume from mm³ to cm³: 1 cm³ = 1000 mm³
  const volumeInCm3 = volume / 1000;
  return volumeInCm3 * density; // weight in grams
}
