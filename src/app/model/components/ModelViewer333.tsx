"use client";

import React, { useEffect, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { PRINTING_CONSTANTS } from "@/app/config";
import { useCart } from "@/app/context/CartContext";
import { estimateWeight } from "./utils/estimateWeight";
import { estimatePrintTime, formatTime } from "./utils/estimatePrintTime";
import { loadModel } from "./utils/loadAndPrepareModel";
import { calculateVolume } from "./utils/calculateVolume";

interface ModelViewerProps {
  file: File | null;
}

interface Metrics {
  volume: string;
  dimensions: string;
  weight: string;
  printTime: string;
  cost: string;
  gst: string;
  totalCostWithGst: string;
}

interface CartItem {
  name: string;
  image: string;
  material: string;
  color: string;
  printTime: string;
  weight: string;
  dimensions: string;
  infill: number;
  totalCost: number;
  quantity: number;
  volume: string;
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
  setError,
  modelRef,
  infill,
  density,
  selectedMaterialName,
  selectedColor,
  rotation,
}: {
  file: File;
  onMetricsReady: (metrics: Metrics) => void;
  setAnalysisProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  modelRef: React.MutableRefObject<THREE.Object3D | null>;
  infill: number;
  density: number;
  selectedMaterialName: string;
  selectedColor: string;
  rotation: [number, number, number];
}) {
  const { scene } = useThree();
  const materialCache = useRef(new Map<string, THREE.MeshStandardMaterial>());

  const getMaterial = (color: string) => {
    if (!materialCache.current.has(color)) {
      materialCache.current.set(
        color,
        new THREE.MeshStandardMaterial({ color: new THREE.Color(color) })
      );
    }
    return materialCache.current.get(color)!;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function loadAndAnalyze() {
      try {
        const object = await loadModel(file);
        if (!object) {
          setError("Failed to load model. Please try another file.");
          return;
        }
        if (!object.position) {
          setError("Loaded model has no position property.");
          return;
        }

        // Center model
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);

        // Uniform scaling
        const maxDimension = Math.max(size.x, size.y, size.z);
        const maxAllowed = PRINTING_CONSTANTS.MAX_MODEL_DIMENSION;
        const scale = maxDimension > maxAllowed ? maxAllowed / maxDimension : 1;
        object.scale.setScalar(scale);

        const scaledBox = new THREE.Box3().setFromObject(object);
        const scaledMin = scaledBox.min;
        object.position.y -= scaledMin.y;

        // Apply rotation (convert degrees to radians)
        object.rotation.set(
          THREE.MathUtils.degToRad(rotation[0]),
          THREE.MathUtils.degToRad(rotation[1]),
          rotation[2]
        );

        // Apply color
        const colorMaterial = getMaterial(selectedColor);
        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = colorMaterial;
          }
        });

        // Remove previous model
        if (modelRef.current) {
          scene.remove(modelRef.current);
        }
        scene.add(object);
        modelRef.current = object;

        // Simulate progress
        let progress = 0;
        interval = setInterval(() => {
          progress += 1;
          setAnalysisProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              const volume = calculateVolume(object);
              const printTime = estimatePrintTime(object, infill);

              const filamentLength =
                (volume * 1000 * infill) /
                PRINTING_CONSTANTS.FILAMENT_CROSS_SECTION;
              const filamentCost =
                (filamentLength / 1000) *
                PRINTING_CONSTANTS.FILAMENT_COST_PER_METER;
              const machineTimeCost =
                (printTime / 3600) *
                PRINTING_CONSTANTS.MACHINE_TIME_COST_PER_HOUR;
              const electricityCost =
                (120 / 1000) *
                (printTime / 3600) *
                PRINTING_CONSTANTS.ELECTRICITY_COST_PER_KWH;
              const marketCost =
                volume * PRINTING_CONSTANTS.MARKET_COST_PER_CM3;
              const materialCost =
                ((volume * density * infill) / 1000) *
                PRINTING_CONSTANTS.MATERIAL_COST_PER_KG;
              const totalCost =
                PRINTING_CONSTANTS.BASE_COST +
                materialCost +
                machineTimeCost +
                PRINTING_CONSTANTS.RISK_FACTOR +
                electricityCost +
                PRINTING_CONSTANTS.LABOR_COST +
                marketCost;
              const gstAmount = totalCost * PRINTING_CONSTANTS.GST_RATE;
              const totalCostWithGst = totalCost + gstAmount;
              const weight = estimateWeight({
                volumeCm3: volume,
                size,
                infill,
                density,
              });

              onMetricsReady({
                volume: volume.toFixed(2) + " cm³",
                dimensions: `${(size.x / 1).toFixed(2)} × ${(
                  size.y / 1
                ).toFixed(2)} × ${(size.z / 1).toFixed(2)} cm`,
                printTime: formatTime(printTime),
                weight: weight.toFixed(2) + " g",
                cost: `₹${totalCost.toFixed(2)}`,
                gst: `₹${gstAmount.toFixed(2)}`,
                totalCostWithGst: `₹${totalCostWithGst.toFixed(2)}`,
              });
            }, 500);
          }
        }, 30);
      } catch (error) {
        console.error("Error loading model:", error);
        setError("An error occurred while loading the model.");
      }
    }

    if (file) {
      loadAndAnalyze();
    }

    return () => clearInterval(interval);
  }, [
    file,
    infill,
    density,
    selectedColor,
    rotation,
    onMetricsReady,
    setAnalysisProgress,
    setError,
  ]);

  return null;
}

const ModelViewer333: React.FC<ModelViewerProps> = ({ file }) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [infill, setInfill] = useState(0.2);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showInfillOptions, setShowInfillOptions] = useState(false);
  const [showMaterialOptions, setShowMaterialOptions] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(materialOptions[0]);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
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
      volume: metrics.volume,
    });
    router.push("/cart");
  };

  const handleRotationChange = (
    axis: "x" | "y",
    value: number | string,
    isManual: boolean = true
  ) => {
    let newValue: number;
    if (typeof value === "string") {
      // Manual input from text field
      newValue = parseFloat(value);
      if (isNaN(newValue)) return;
    } else {
      // Non-manual input (e.g., button click)
      newValue = value;
    }
    const clampedValue = Math.max(-360, Math.min(360, newValue));
    setRotation((prev) => {
      const newRotation: [number, number, number] = [...prev];
      if (axis === "x") newRotation[0] = clampedValue;
      if (axis === "y") newRotation[1] = clampedValue;
      return newRotation;
    });
    setAnalysisProgress(0);
    setMetrics(null);
  };

  const handleRotationIncrement = (axis: "x" | "y") => {
    setRotation((prev) => {
      const newRotation: [number, number, number] = [...prev];
      const currentValue = axis === "x" ? prev[0] : prev[1];
      const newValue = Math.min(currentValue + 10, 360);
      if (axis === "x") newRotation[0] = newValue;
      if (axis === "y") newRotation[1] = newValue;
      handleRotationChange(axis, newValue, false);
      return newRotation;
    });
  };

  const handleRotationDecrement = (axis: "x" | "y") => {
    setRotation((prev) => {
      const newRotation: [number, number, number] = [...prev];
      const currentValue = axis === "x" ? prev[0] : prev[1];
      const newValue = Math.max(currentValue - 10, -360);
      if (axis === "x") newRotation[0] = newValue;
      if (axis === "y") newRotation[1] = newValue;
      handleRotationChange(axis, newValue, false);
      return newRotation;
    });
  };

  return (
    <section className="w-full min-h-screen px-4 py-8 bg-gray-100 flex flex-col items-center justify-center gap-6">
      {error && <div className="text-red-600 text-center">{error}</div>}
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
                  setError={setError}
                  modelRef={modelRef}
                  infill={infill}
                  density={selectedMaterial.value}
                  selectedMaterialName={selectedMaterial.name}
                  selectedColor={selectedColor}
                  rotation={rotation}
                />
              )}
              <OrbitControls
                autoRotate={false}
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
                  GST at the rate of{" "}
                  <strong>{PRINTING_CONSTANTS.GST_RATE * 100}%</strong> is
                  included in the total cost.
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
          {/* Rotation Controls */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Rotation</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="rotation-x" className="text-sm text-gray-800">
                  X Rotation (degrees)
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => handleRotationDecrement("x")}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    aria-label="Decrease X rotation by 10 degrees"
                  >
                    -
                  </button>
                  <input
                    id="rotation-x"
                    type="number"
                    min={-360}
                    max={360}
                    value={rotation[0]}
                    onChange={(e) => handleRotationChange("x", e.target.value, true)}
                    className="w-full p-2 border rounded text-sm"
                    aria-label="X rotation in degrees"
                  />
                  <button
                    onClick={() => handleRotationIncrement("x")}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    aria-label="Increase X rotation by 10 degrees"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="rotation-y" className="text-sm text-gray-800">
                  Y Rotation (degrees)
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => handleRotationDecrement("y")}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    aria-label="Decrease Y rotation by 10 degrees"
                  >
                    -
                  </button>
                  <input
                    id="rotation-y"
                    type="number"
                    min={-360}
                    max={360}
                    value={rotation[1]}
                    onChange={(e) => handleRotationChange("y", e.target.value, true)}
                    className="w-full p-2 border rounded text-sm"
                    aria-label="Y rotation in degrees"
                  />
                  <button
                    onClick={() => handleRotationIncrement("y")}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    aria-label="Increase Y rotation by 10 degrees"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Infill Options */}
          <div className="bg-white rounded-xl shadow p-4">
            <button
              className="w-full text-left font-semibold text-gray-800"
              onClick={() => setShowInfillOptions((prev) => !prev)}
              aria-expanded={showInfillOptions}
              aria-controls="infill-options"
            >
              Infill ▼
            </button>
            <div
              id="infill-options"
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
                        aria-label={`Set infill to ${percent}%`}
                      />
                      <span className="text-sm text-gray-800">{percent}%</span>
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
              aria-expanded={showMaterialOptions}
              aria-controls="material-options"
            >
              Material: {selectedMaterial.name} ▼
            </button>
            <div
              id="material-options"
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
                      aria-label={`Select material ${material.name}`}
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
              aria-expanded={showColorOptions}
              aria-controls="color-options"
            >
              Color:{" "}
              {colorOptions.find((c) => c.value === selectedColor)?.name ||
                "Select"}{" "}
              ▼
            </button>
            <div
              id="color-options"
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
                      aria-label={`Select color ${color.name}`}
                    />
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.value }}
                      aria-hidden="true"
                    />
                    <span className="text-sm text-gray-800">{color.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-2 mt-4">
            <button
              onClick={handleToCart}
              disabled={analysisProgress < 100 || !metrics}
              className={`cursor-pointer rounded-full px-7 py-3 text-base font-medium text-neutral-50 ${
                analysisProgress < 100 || !metrics
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-neutral-800"
              }`}
              aria-disabled={analysisProgress < 100 || !metrics}
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
                className="cursor-pointer rounded-full bg-red-600 px-7 py-3 text-base font-medium text-white hover:bg-red-700"
              >
                Contact Me on Gmail
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModelViewer333;