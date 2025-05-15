export const estimateWeight = ({
  volumeCm3,
  size,
  infill = 0.2,
  density = 1.24,        // <- dynamic: pass from selected material
  wallLineWidth = 0.4,
  wallCount = 2,
  topBottomLayers = 5,
  layerHeight = 0.2,
}: {
  volumeCm3: number;
  size: { x: number; y: number; z: number };
  infill?: number;
  density?: number;       // <- dynamic density here
  wallLineWidth?: number;
  wallCount?: number;
  topBottomLayers?: number;
  layerHeight?: number;
}): number => {
  // Convert size from mm to cm (assuming size is in mm)
  const x = size.x / 10;
  const y = size.y / 10;
  const z = size.z / 10;

  const wallThicknessCm = (wallLineWidth * wallCount) / 10;
  const topBottomThicknessCm = (layerHeight * topBottomLayers) / 10;

  const topBottomVolume = x * y * topBottomThicknessCm * 2;
  const sideWallArea = 2 * (x + y) * z;
  const sideWallVolume = sideWallArea * wallThicknessCm;

  const shellVolume = topBottomVolume + sideWallVolume;
  const infillVolume = Math.max(volumeCm3 - shellVolume, 0) * infill;

  const totalVolume = shellVolume + infillVolume;
  const weightGrams = totalVolume * density;

  return Number(weightGrams.toFixed(3));
};
