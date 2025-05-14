// "use client";

// import React, { useEffect, useState, useRef, Suspense } from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls, useProgress, Html } from "@react-three/drei";
// import * as THREE from "three";
// import { STLLoader } from "three-stdlib";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

// interface ModelViewerProps {
//   file: File | null;
// }

// function Loader() {
//   const { progress } = useProgress();
//   return <Html center>{progress.toFixed(0)} % loaded</Html>;
// }

// function Model({
//   file,
//   onMetricsReady,
// }: {
//   file: File;
//   onMetricsReady: (metrics: any) => void;

// }) {
//   const { scene } = useThree();
//   const modelRef = useRef<THREE.Object3D | null>(null);

//   // Load model when file changes
//   useEffect(() => {
//     const ext = file.name.split(".").pop()?.toLowerCase();
//     const reader = new FileReader();

//     reader.onload = async (e) => {
//       const contents = e.target?.result;
//       if (!contents) {
//         console.error("Failed to read file contents");
//         return;
//       }

//       let object: THREE.Object3D | null = null;

//       try {
//      if (ext === "stl") {
//           const loader = new STLLoader();
//           const geometry = loader.parse(contents as ArrayBuffer);
//           const material = new THREE.MeshStandardMaterial({ color: "#00ff00" });
//           object = new THREE.Mesh(geometry, material);
//         } else if (ext === "obj") {
//           const loader = new OBJLoader();
//           const text = new TextDecoder().decode(contents as ArrayBuffer);
//           object = loader.parse(text);
//           object.traverse((child) => {
//             if ((child as THREE.Mesh).isMesh) {
//               const mesh = child as THREE.Mesh;
//               mesh.material = new THREE.MeshStandardMaterial({ color: "#00ff00" });
//             }
//           });
//         }

//         if (object) {
//           const box = new THREE.Box3().setFromObject(object);
//           const size = box.getSize(new THREE.Vector3());
//           const center = box.getCenter(new THREE.Vector3());
//           object.position.sub(center);

//           const scale = 30 / Math.max(size.x, size.y, size.z);
//           object.scale.setScalar(scale);

//           scene.clear();
//           scene.add(object);
//           modelRef.current = object;

//           const volume = calculateVolume(object);
//           const printTime = estimatePrintTime(volume);
//           const infill = 0.2;
//           const density = 1.24;

//           // Filament-Based Cost
//           const filamentLength = (volume * 1000 * infill) / (0.4 * 0.2); // Filament cross-sectional area
//           const costPerMeter = 2; // ₹ per meter
//           const filamentCost = (filamentLength / 1000) * costPerMeter;

//           // Machine Time Cost
//           const machineRatePerHour = 40; // ₹ per hour
//           const machineTimeCost = (printTime / 3600) * machineRatePerHour;

//           // Electricity Cost
//           const watts = 120; // 120W printer
//           const electricityRate = 10; // ₹ per kWh
//           const electricityCost =
//             (watts / 1000) * (printTime / 3600) * electricityRate;

//           // Market Rate Estimation
//           const marketRatePerCm3 = 2; // ₹ per cm³
//           const marketCost = volume * marketRatePerCm3;
//           const costPerKg = 1500;

//           const baseCost = 10; // ₹ base overhead cost
//           const riskFactor = 5; // Additional 5% risk
//           const materialCost = ((volume * density * infill) / 1000) * costPerKg; // Material cost
//           const totalCost =
//             baseCost +
//             materialCost +
//             machineTimeCost +
//             riskFactor +
//             electricityCost +
//             filamentCost +
//             marketCost;

//           // Calculate GST (Example: 18%)
//           const gstRate = 18; // GST rate in percentage
//           const gstAmount = (totalCost * gstRate) / 100;
//           const totalCostWithGst = totalCost + gstAmount;

//           const adjustedWeight = volume * infill * density;
//           // const printTimeSeconds = estimatePrintTime(volume); // already done above

//           // const materialCost = (adjustedWeight / 1000) * costPerKg;
//           // const timeCost = (printTimeSeconds / 3600) * ratePerHour;
//           // const totalCost = materialCost + timeCost + fixedOverhead;

//           // const printTime = estimatePrintTime(volume);

//           onMetricsReady({
//             volume: volume.toFixed(2) + " cm³",
//             dimensions: `${(size.x / 10).toFixed(2)} × ${(size.y / 10).toFixed(
//               2
//             )} × ${(size.z / 10).toFixed(2)} cm`,
//             printTime: formatTime(printTime),
//             weight: adjustedWeight.toFixed(2) + " g",
//             cost: `₹${totalCostWithGst.toFixed(2)}`,
//           });

//           console.log("Model loaded successfully:", object);
//         } else {
//           console.error("Failed to load model: No object created");
//         }
//       } catch (error) {
//         console.error("Error loading model:", error);
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   }, [file, scene, onMetricsReady]);

// const calculateVolume = (object: THREE.Object3D): number => {
//   let volume = 0;
//   object.traverse((child) => {
//     if ((child as THREE.Mesh).isMesh) {
//       const mesh = child as THREE.Mesh;
//       const geometry = mesh.geometry as THREE.BufferGeometry;
//       const pos = geometry.attributes.position?.array;
//       if (!pos) return;
//       for (let i = 0; i < pos.length; i += 9) {
//         const v1 = new THREE.Vector3(pos[i], pos[i + 1], pos[i + 2]);
//         const v2 = new THREE.Vector3(pos[i + 3], pos[i + 4], pos[i + 5]);
//         const v3 = new THREE.Vector3(pos[i + 6], pos[i + 7], pos[i + 8]);
//         volume += v1.dot(v2.cross(v3)) / 6;
//       }
//     }
//   });
//   return Math.abs(volume / 1000); // mm³ to cm³
// };
// const estimatePrintTime = (volume: number): number => {
//   const speed = 50; // mm/s
//   const layerHeight = 0.2; // mm
//   const nozzleDiameter = 0.4; // mm
//   const infill = 0.2; // 20% infill

//   const volumeMM3 = volume * 1000; // convert cm³ to mm³
//   const adjustedVolume = volumeMM3 * infill;
//   const extrusionArea = nozzleDiameter * layerHeight; // rectangular bead
//   const filamentLength = adjustedVolume / extrusionArea; // mm
//   const timeInSeconds = filamentLength / speed;

//   return timeInSeconds;
// };

// const formatTime = (seconds: number): string => {
//   const hrs = Math.floor(seconds / 3600);
//   const mins = Math.floor((seconds % 3600) / 60);
//   const secs = Math.floor(seconds % 60);
//   return `${hrs.toString().padStart(2, "0")}:${mins
//     .toString()
//     .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

// };

// const ModelViewer1: React.FC<ModelViewerProps> = ({ file }) => {
//   const [metrics, setMetrics] = useState({
//     volume: "N/A",
//     dimensions: "N/A",
//     printTime: "N/A",
//     weight: "N/A",
//     cost: "N/A",
//     gst: "N/A",
//     totalCostWithGst: "N/A",
//   });

//   const containerRef = useRef<HTMLDivElement>(null);

//   if (!file) return <p className="text-center">Upload a model file...</p>;

//   return (
//     <section className="w-full min-h-screen px-4 py-8 bg-gray-100 flex flex-col justify-center items-center gap-18">
//       <div className="w-full.

//       max-w-3xl">
//         <div ref={containerRef} className="w-full h-[500px] bg-black rounded-xl shadow">
//           <Canvas
//             camera={{ position: [0, 0, 100], fov: 75 }}
//             style={{ background: "#fff" }}
//           >
//             <ambientLight intensity={1.2} />
//             <directionalLight position={[1, 1, 1]} intensity={0.8} />
//             <directionalLight position={[-1, -1, -1]} intensity={0.5} />
//             <Suspense fallback={<Loader />}>
//               <Model file={file} onMetricsReady={setMetrics} />
//             </Suspense>
//             <OrbitControls enablePan={false} enableZoom enableDamping />
//           </Canvas>
//         </div>
//       </div>

//       <div className="w-full max-w-3xl rounded-xl overflow-hidden mt-12">
//         <div className="bg-black text-gray-100 text-sm w-full rounded-xl shadow">
//           <div className="p-4">
//             <ul className="space-y-2">
//               <li>
//                 <strong>Volume:</strong> {metrics.volume}
//               </li>
//               <li>
//                 <strong>Dimensions:</strong> {metrics.dimensions}
//               </li>
//               <li>
//                 <strong>Print Time:</strong> {metrics.printTime}
//               </li>
//               <li>
//                 <strong>Weight:</strong> {metrics.weight}
//               </li>
//               <li>
//                 <strong>Cost (Excl. GST):</strong> {metrics.cost}
//               </li>
//               <li>
//                 <strong>GST (18%):</strong> {metrics.gst}
//               </li>
//               <li>
//                 <strong>Total Cost (Incl. GST):</strong> {metrics.totalCostWithGst}
//               </li>
//             </ul>
//             <div className="mt-4 text-xs text-gray-400">
//               <p>
//                 GST at the rate of <strong>18%</strong> is included in the total cost.
//               </p>
//               <p>Taxes and additional charges may apply based on the region.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// // export default ModelViewer1;

// export default ModelViewer1;

"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { STLLoader } from "three-stdlib";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import AxesWithLabels from "./AxesWithLabels";

interface ModelViewerProps {
  file: File | null;
}

function Model({
  file,
  onMetricsReady,
  setAnalysisProgress,
  modelRef,
}: {
  file: File;
  onMetricsReady: (metrics: any) => void;
  setAnalysisProgress: (progress: number) => void;
  modelRef: React.MutableRefObject<THREE.Object3D | null>;
}) {
  const { scene } = useThree();

  useEffect(() => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const reader = new FileReader();

    reader.onload = async (e) => {
      const contents = e.target?.result;
      if (!contents) return;

      let object: THREE.Object3D | null = null;

      if (ext === "stl") {
        const loader = new STLLoader();
        const geometry = loader.parse(contents as ArrayBuffer);
        const material = new THREE.MeshStandardMaterial({ color: "#00ff00" });
        object = new THREE.Mesh(geometry, material);
      } else if (ext === "obj") {
        const loader = new OBJLoader();
        const text = new TextDecoder().decode(contents as ArrayBuffer);
        object = loader.parse(text);
        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshStandardMaterial({
              color: "#00ff00",
            });
          }
        });
      }

      if (object) {
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);
        object.position.y += size.y / 2; // shift upward to place model base on grid
        const targetZHeight = size.z; // mm, adjust based on Robu.in's model size

        const scale = targetZHeight / size.z;
        object.scale.setScalar(scale);

        scene.clear();
        scene.add(object);
        modelRef.current = object;

        // Smooth analysis progress from 0 to 100
        let progress = 0;
        const interval = setInterval(() => {
          progress += 1;
          setAnalysisProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);

            // Run analysis after progress completes
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

              onMetricsReady({
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
              });
            }, 500);
          }
        }, 30); // ~3 seconds total
      }
    };

    reader.readAsArrayBuffer(file);
  }, [file, scene]);

  useEffect(() => {
    const axesHelper = new THREE.AxesHelper(150);
    scene.add(axesHelper);
    return () => scene.remove(axesHelper);
  }, [scene]);

  return null;
}

const calculateVolume = (object: THREE.Object3D): number => {
  let volume = 0;
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const geometry = mesh.geometry as THREE.BufferGeometry;
      const pos = geometry.attributes.position?.array;
      if (!pos) return;
      for (let i = 0; i < pos.length; i += 9) {
        const v1 = new THREE.Vector3(pos[i], pos[i + 1], pos[i + 2]);
        const v2 = new THREE.Vector3(pos[i + 3], pos[i + 4], pos[i + 5]);
        const v3 = new THREE.Vector3(pos[i + 6], pos[i + 7], pos[i + 8]);
        volume += v1.dot(v2.cross(v3)) / 6;
      }
    }
  });
  return Math.abs(volume / 1000);
};

const estimatePrintTime = (object: THREE.Object3D): number => {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const heightMM = size.z;
  const layerHeight = 0.2;
  const printSpeed = 40;
  const perimeterSpeed = 20;
  const travelSpeed = 100;
  const infill = 0.2;
  const layerChangeTime = 1.0;
  // const acceleration = 500;

  const numLayers = Math.ceil(heightMM / layerHeight);
  const perimeterLength = 2 * (size.x + size.y) * 2;
  const infillLength = (size.x * size.y * infill) / (layerHeight * 2);
  const travelLength = perimeterLength * 0.5;

  const timePerLayer =
    perimeterLength / perimeterSpeed +
    infillLength / printSpeed +
    travelLength / travelSpeed;
  let totalTime = (timePerLayer + layerChangeTime) * numLayers;
  totalTime += numLayers * 0.2 * (perimeterLength / printSpeed) * 0.5;
  totalTime += 120;

  return totalTime;
};

const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const ModelViewer1: React.FC<ModelViewerProps> = ({ file }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const modelRef = useRef<THREE.Object3D | null>(null);

  return (
    <section className="w-full min-h-screen px-4 py-8 bg-gray-100 flex flex-col items-center justify-center gap-6">
      <div className="w-full max-w-3xl">
        <div className="w-full h-[500px] bg-white rounded-xl shadow">
          <Canvas camera={{ position: [100, 100, 100], fov: 45 }}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[1, 2, 3]} intensity={1.2} />
            <AxesWithLabels
              xLength={200}
              yLength={120}
              zLength={120}
              lineWidth={0}
            />
            <primitive object={new THREE.GridHelper(200, 20)} />
            <Suspense fallback={<Html center>Loading...</Html>}>
              {file && (
                <Model
                  file={file}
                  onMetricsReady={setMetrics}
                  setAnalysisProgress={setAnalysisProgress}
                  modelRef={modelRef}
                />
              )}
            </Suspense>
            <OrbitControls enablePan enableZoom enableRotate />
          </Canvas>
        </div>
      </div>

      <div className="w-full max-w-3xl rounded-xl overflow-hidden bg-black text-gray-100 text-sm shadow">
        <div className="p-4">
          {file && (
            <h2 className="text-lg font-semibold mb-2">File: {file.name}</h2>
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
                GST at the rate of <strong>18%</strong> is included in the total
                cost.
              </p>
              <p>Taxes and additional charges may apply based on the region.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModelViewer1;
