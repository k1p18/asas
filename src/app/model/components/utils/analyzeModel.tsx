import * as THREE from "three";
import { calculateVolume } from "./calculateVolume";
import { estimatePrintTime, formatTime } from "./estimatePrintTime";

interface Size {
  x: number;
  y: number;
  z: number;
}

interface Metrics {
  volume: string;
  dimensions: string;
  printTime: string;
  weight: string;
  cost: string;
  gst: string;
  totalCostWithGst: string;
}

export function analyzeModel(
  object: THREE.Object3D,
  size: Size,
  scale: number,
  onProgress?: (progress: number) => void
): Promise<Metrics> {
  return new Promise((resolve) => {
    let progress = 0;

    const interval = setInterval(() => {
      progress += 1;
      if (onProgress) onProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        setTimeout(() => {
          const volume = calculateVolume(object);
          const printTime = estimatePrintTime(object);
          const infill = 0.2;
          const density = 1.24;

          const filamentLength = (volume * 1000 * infill) / (0.4 * 0.2);
          const filamentCost = (filamentLength / 1000) * 2;
          const machineTimeCost = (printTime / 3600) * 40;
          const electricityCost = (120 / 1000) * (printTime / 3600) * 10;
          const marketCost = volume * 2;
          const baseCost = 10;
          const riskFactor = 5;
          const materialCost = ((volume * density * infill) / 1000) * 1500;
          const totalCost =
            baseCost +
            materialCost +
            machineTimeCost +
            riskFactor +
            electricityCost +
            filamentCost +
            marketCost;
          const gstAmount = (totalCost * 18) / 100;
          const totalCostWithGst = totalCost + gstAmount;
          const adjustedWeight = volume * infill * density;

          const metrics: Metrics = {
            volume: volume.toFixed(2) + " cm³",
            dimensions: `${((size.x * scale) / 10).toFixed(2)} × ${(
              (size.y * scale) /
              10
            ).toFixed(2)} × ${((size.z * scale) / 10).toFixed(2)} cm`,
            printTime: formatTime(printTime),
            weight: adjustedWeight.toFixed(2) + " g",
            cost: `₹${totalCost.toFixed(2)}`,
            gst: `₹${gstAmount.toFixed(2)}`,
            totalCostWithGst: `₹${totalCostWithGst.toFixed(2)}`,
          };

          resolve(metrics);
        }, 500);
      }
    }, 30);
  });
}
