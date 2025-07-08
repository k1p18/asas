"use client";

import React, { useEffect, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { loadModel } from "./utils/loadAndPrepareModel";
import { calculateVolume } from "./utils/calculateVolume";
import { estimatePrintTime, formatTime } from "./utils/estimatePrintTime";
import { estimateWeight } from "./utils/estimateWeight";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

interface ModelViewerProps {
  file: File | null;
}

const materialOptions = [
  { name: "PLA", value: 1.24 },
  { name: "ABS", value: 1.04 },
  { name: "PETG", value: 1.27 },
  { name: "TPU", value: 1.21 },
];

const colorOptions = [
  { name: "Red", value: "#ff0000" },
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Green", value: "#00ff00" },
  { name: "Blue", value: "#0000ff" },
];

function Model({
  file,
  onMetricsReady,
  setAnalysisProgress,
  modelRef,
  infill,
  density,
  selectedMaterialName,
  selectedColor,
}: {
  file: File;
  onMetricsReady: (metrics: any) => void;
  setAnalysisProgress: (progress: number) => void;
  modelRef: React.MutableRefObject<THREE.Object3D | null>;
  infill: number;
  density: number;
  selectedMaterialName: string;
  selectedColor: string;
}) {
  const { scene } = useThree();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function loadAndAnalyze() {
      const object = await loadModel(file);
      if (!object) {
        console.error("Failed to load model");
        return;
      }
      if (!object.position) {
        console.error("Loaded model has no position property", object);
        return;
      }

      // // Center model & position on grid
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // // Move model so its center is at the origin (0,0,0)
      // object.position.copy(center).multiplyScalar(-1);
      // object.position.y += size.y / 2;

      // // Apply scale (adjust if needed)
      // const scale = 1;
      // object.scale.setScalar(scale);

      object.position.sub(center);

      // Uniform scaling
      const maxDimension = Math.max(size.x, size.y, size.z);
      const maxAllowed = 25;
      const scale = maxDimension > maxAllowed ? maxAllowed / maxDimension : 1;
      object.scale.setScalar(scale);

      const scaledBox = new THREE.Box3().setFromObject(object);
      const scaledSize = scaledBox.getSize(new THREE.Vector3());
      const scaledMin = scaledBox.min;

      // Step 4: Move the model up so its bottom sits on the grid
      object.position.y -= scaledMin.y;

      // const axesHelper = new THREE.AxesHelper(25);
      // object.add(axesHelper);

      // for color
      const colorMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(selectedColor),
      });

      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = colorMaterial;
        }
      });

      // // Remove previous model safely
      scene.children = scene.children.filter(
        (child) => child !== modelRef.current
      );

      scene.add(object);
      modelRef.current = object;

      // Simulate progress bar for analysis
      let progress = 0;
      interval = setInterval(() => {
        progress += 1;
        setAnalysisProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const volume = calculateVolume(object);
            const printTime = estimatePrintTime(object, infill);
            // const infill = 0.2;
            // const density = 1.24;

            const filamentLength = (volume * 1000 * infill) / (0.4 * 0.2);
            const filamentCost = (filamentLength / 1000) * 2;
            const machineTimeCost = (printTime / 3600) * 40;
            const electricityCost = (120 / 1000) * (printTime / 3600) * 10;
            const marketCost = volume * 2;
            const baseCost = 10;
            const laborCost = 30;
            const riskFactor = 5;
            const materialCost = ((volume * density * infill) / 1000) * 1500;
            const totalCost =
              baseCost +
              materialCost +
              machineTimeCost +
              riskFactor +
              electricityCost +
              laborCost +
              marketCost;
            const gstAmount = (totalCost * 18) / 100;
            const totalCostWithGst = totalCost + gstAmount;
            const weight = estimateWeight({
              volumeCm3: volume,
              size,
              infill,
              density,
            });

            onMetricsReady({
              volume: volume.toFixed(2) + " cm³",
              dimensions: `${(size.x / 1).toFixed(2)} × ${(size.y / 1).toFixed(
                2
              )} × ${(size.z / 1).toFixed(2)} cm`,
              printTime: formatTime(printTime),
              weight: weight.toFixed(2) + " g",
              cost: `₹${totalCost.toFixed(2)}`,
              gst: `₹${gstAmount.toFixed(2)}`,
              totalCostWithGst: `₹${totalCostWithGst.toFixed(2)}`,
            });
          }, 500);
        }
      }, 30);
    }

    if (file) {
      loadAndAnalyze();
    }

    return () => clearInterval(interval);
  }, [file, infill, density, selectedColor]);

  return null;
}

const ModelViewer3: React.FC<ModelViewerProps> = ({ file }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [infill, setInfill] = useState(0.2); // Default 20%
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showInfillOptions, setShowInfillOptions] = useState(false);
  const [showMaterialOptions, setShowMaterialOptions] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(materialOptions[0]);
  const [selectedColor, setSelectedColor] = useState("purple");
  const [showColorOptions, setShowColorOptions] = useState(false);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { addToCart } = useCart();

  const handleToCart = () => {
    if (!file || !metrics || analysisProgress < 100) return;

    const canvasElement = canvasRef.current?.querySelector(
      "canvas"
    ) as HTMLCanvasElement | null;
    const image =
      canvasElement?.toDataURL("image/png") || "/fallback-image.png";

    addToCart({
      name: file.name,
      image,
      material: selectedMaterial.name,
      color: selectedColor,
      printTime: metrics.printTime,
      weight: metrics.weight,
      dimensions: metrics.dimensions,
      infill,
      totalCost: parseFloat(metrics.totalCostWithGst.replace("₹", "")),
      quantity: 1,
    });
    router.push("/cart");
  };

  return (
    <>
      <section className="w-full min-h-screen px-4 py-8 bg-gray-100 flex flex-col items-center justify-center gap-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[2fr_1px_1fr] gap-6">
          {/* Left Column: Model viewer + metrics */}
          <div className="flex flex-col gap-6">
            <div
              className="w-full h-[400px] sm:h-[500px] bg-white rounded-xl shadow"
              ref={canvasRef}
            >
              <Canvas camera={{ position: [100, 100, 100], fov: 45 }}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[1, 2, 3]} intensity={1.2} />
                <primitive object={new THREE.GridHelper(400, 25)} />
                <primitive object={new THREE.AxesHelper(100)} />
                {file && (
                  <Model
                    file={file}
                    onMetricsReady={setMetrics}
                    setAnalysisProgress={setAnalysisProgress}
                    modelRef={modelRef}
                    infill={infill}
                    density={selectedMaterial.value}
                    selectedMaterialName={selectedMaterial.name}
                    selectedColor={selectedColor}
                  />
                )}
                <OrbitControls
                  autoRotate
                  autoRotateSpeed={1.2}
                  enableZoom
                  enablePan
                  enableRotate
                />
              </Canvas>
            </div>

            <div className="rounded-xl overflow-hidden bg-black text-gray-100 text-sm shadow p-4">
              {file && (
                <h2 className="text-lg text-white font-semibold mb-2">
                  File: {file.name}
                </h2>
              )}

              {analysisProgress < 100 ? (
                <>
                  <div className="w-full bg-gray-700 h-2 rounded">
                    <div
                      className="bg-green-500 h-full rounded"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                  <p className="mt-2">Analyzing... {analysisProgress}%</p>
                </>
              ) : metrics ? (
                <ul className="space-y-2">
                  <li>
                    <strong>Volume:</strong> {metrics.volume}
                  </li>
                  <li>
                    <strong>Dimensions:</strong> {metrics.dimensions}
                  </li>
                  <li>
                    <strong>Weight:</strong> {metrics.weight}
                  </li>
                  <li>
                    <strong>Print Time:</strong> {metrics.printTime}
                  </li>
                  <li>
                    <strong>Total Cost (Incl. GST):</strong>{" "}
                    {metrics.totalCostWithGst}
                  </li>
                </ul>
              ) : null}

              {analysisProgress === 100 && (
                <div className="mt-4 text-xs text-gray-400">
                  <p>
                    GST at the rate of <strong>18%</strong> is included in the
                    total cost.
                  </p>
                  <p>
                    Taxes and additional charges may apply based on the region.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-gray-300" />

          {/* Right Column: Options */}
          <div className="flex flex-col gap-4">
            {/* Infill Options */}
            <div className="bg-white rounded-xl shadow p-4">
              <button
                className="w-full text-left font-semibold text-gray-800"
                onClick={() => setShowInfillOptions((prev) => !prev)}
              >
                Infill ▼
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  showInfillOptions
                    ? "max-h-80 opacity-100 mt-2"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {[...Array(10)].map((_, i) => {
                  const percent = (i + 1) * 10;
                  return (
                    <div key={percent}>
                      <label className="inline-flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={Math.round(infill * 100) === percent}
                          onChange={() => {
                            setInfill(percent / 100);
                            setAnalysisProgress(0);
                            setMetrics(null);
                            setShowInfillOptions(false);
                          }}
                          className="form-checkbox text-blue-600"
                        />
                        <span className="text-sm text-gray-800">
                          {percent}%
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Material Options */}
            <div className="bg-white rounded-xl shadow p-4">
              <button
                className="w-full text-left font-semibold text-gray-800"
                onClick={() => setShowMaterialOptions((prev) => !prev)}
              >
                Material: {selectedMaterial.name} ▼
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  showMaterialOptions
                    ? "max-h-80 opacity-100 mt-2"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {materialOptions.map((material) => (
                  <div key={material.name}>
                    <label className="inline-flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="material"
                        checked={selectedMaterial.name === material.name}
                        onChange={() => {
                          setSelectedMaterial(material);
                          setAnalysisProgress(0);
                          setMetrics(null);
                          setShowMaterialOptions(false);
                        }}
                        className="form-radio text-blue-600"
                      />
                      <span className="text-sm text-gray-800">
                        {material.name}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Options */}
            <div className="bg-white rounded-xl shadow p-4">
              <button
                className="w-full text-left font-semibold text-gray-800"
                onClick={() => setShowColorOptions((prev) => !prev)}
              >
                Color: {selectedColor} ▼
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  showColorOptions
                    ? "max-h-80 opacity-100 mt-2"
                    : "max-h-0 opacity-0 overflow-hidden"
                } flex flex-col space-y-2`}
              >
                {colorOptions.map((color) => (
                  <div key={color.value}>
                    <label className="inline-flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="color"
                        checked={selectedColor === color.value}
                        onChange={() => {
                          setSelectedColor(color.value);
                          setAnalysisProgress(0);
                          setMetrics(null);
                          setShowColorOptions(false);
                        }}
                      />
                      <span
                        className="inline-block w-4 h-4 rounded-full"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-sm text-gray-800">
                        {color.name}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* <div>
              <button
                type="button"
                onClick={handleCart}
                className="rounded-full bg-neutral-800 px-7 py-3 text-basex font-medium text-neutral-50"
              >
                Add To Cart
              </button>
            </div> */}
            <div className="mb-2 mt-4">
              <button
                onClick={handleToCart}
                disabled={analysisProgress < 100 || !metrics}
                className={`rounded-full px-7 py-3 text-base font-medium text-neutral-50 ${
                  analysisProgress < 100 || !metrics
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-neutral-800"
                }`}
              >
                Add To Cart
              </button>
            </div>
            <div>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=info.arnobot@gmail.com&su=Hello&body=Hi%20there%2C%20I%20wanted%20to%20reach%20out%20to%20you."
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  type="button"
                  className="rounded-full bg-red-600 px-7 py-3 text-base font-medium text-white hover:bg-red-700"
                >
                  Contact Me on Gmail
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ModelViewer3;
