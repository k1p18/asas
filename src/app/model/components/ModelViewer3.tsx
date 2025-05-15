"use client";

import React, { useEffect, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { loadModel } from "./utils/loadAndPrepareModel";
import { calculateVolume } from "./utils/calculateVolume";
import { estimatePrintTime, formatTime } from "./utils/estimatePrintTime";

interface ModelViewerProps {
  file: File | null;
}

function Model({
  file,
  onMetricsReady,
  setAnalysisProgress,
  modelRef,
  infill,
}: {
  file: File;
  onMetricsReady: (metrics: any) => void;
  setAnalysisProgress: (progress: number) => void;
  modelRef: React.MutableRefObject<THREE.Object3D | null>;
  infill: number;
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
      const maxAllowed = 50;
      const scale = maxDimension > maxAllowed ? maxAllowed / maxDimension : 1;
      object.scale.setScalar(scale);

      const scaledBox = new THREE.Box3().setFromObject(object);
      const scaledSize = scaledBox.getSize(new THREE.Vector3());
      const scaledMin = scaledBox.min;

      // Step 4: Move the model up so its bottom sits on the grid
      object.position.y -= scaledMin.y;

      // const axesHelper = new THREE.AxesHelper(25);
      // object.add(axesHelper);

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
      }, 30);
    }

    if (file) {
      loadAndAnalyze();
    }

    return () => clearInterval(interval);
  }, [file, infill]);

  return null;
}

const ModelViewer3: React.FC<ModelViewerProps> = ({ file }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [infill, setInfill] = useState(0.2); // Default 20%
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showInfillOptions, setShowInfillOptions] = useState(false);
  const modelRef = useRef<THREE.Object3D | null>(null);

  return (
    // <section className="w-full min-h-screen px-4 py-8 bg-gray-100 flex flex-col items-center justify-center gap-6">
    //   <div className="w-full max-w-3xl">
    //     <div className="w-full h-[500px] bg-white rounded-xl shadow">
    //       <Canvas camera={{ position: [100, 100, 100], fov: 45 }}>
    //         <ambientLight intensity={1.2} />
    //         <directionalLight position={[1, 2, 3]} intensity={1.2} />
    //         {/* <primitive object={new THREE.GridHelper(400, 25)} /> */}
    //         <primitive
    //           object={new THREE.GridHelper(400, 25)}
    //           position={[0, 0, 0]}
    //         />

    //         <primitive object={new THREE.AxesHelper(100)} />

    //         {file && (
    //           <Model
    //             file={file}
    //             onMetricsReady={setMetrics}
    //             setAnalysisProgress={setAnalysisProgress}
    //             modelRef={modelRef}
    //             infill={infill}
    //           />
    //         )}
    //         {/* <OrbitControls enablePan enableZoom enableRotate /> */}

    //         <OrbitControls
    //           autoRotate
    //           autoRotateSpeed={1.2}
    //           enableZoom
    //           enablePan
    //           enableRotate
    //         />
    //       </Canvas>
    //     </div>
    //   </div>

    //   <div className="w-full max-w-3xl rounded-xl overflow-hidden bg-black text-gray-100 text-sm shadow">
    //     <div className="p-4">
    //       {file && (
    //         <h2 className="text-lg text-black font-semibold mb-2">
    //           File: {file.name}
    //         </h2>
    //       )}

    //       {analysisProgress < 100 ? (
    //         <>
    //           <div className="w-full bg-gray-700 h-2 rounded">
    //             <div
    //               className="bg-green-500 h-full rounded"
    //               style={{ width: `${analysisProgress}%` }}
    //             />
    //           </div>
    //           <p className="mt-2">Analyzing... {analysisProgress}%</p>
    //         </>
    //       ) : metrics ? (
    //         <ul className="space-y-2">
    //           <li>
    //             <strong>Volume:</strong> {metrics.volume}
    //           </li>
    //           <li>
    //             <strong>Dimensions:</strong> {metrics.dimensions}
    //           </li>
    //           <li>
    //             <strong>Print Time:</strong> {metrics.printTime}
    //           </li>
    //           <li>
    //             <strong>Total Cost (Incl. GST):</strong>{" "}
    //             {metrics.totalCostWithGst}
    //           </li>
    //         </ul>
    //       ) : null}

    //       {analysisProgress === 100 && (
    //         <div className="mt-4 text-xs text-gray-400">
    //           <p>
    //             GST at the rate of <strong>18%</strong> is included in the total
    //             cost.
    //           </p>
    //           <p>Taxes and additional charges may apply based on the region.</p>
    //         </div>
    //       )}
    //     </div>
    //   </div>

    //   <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6">
    //     {/* Infill Accordion */}
    //     <div className="bg-white shadow rounded-xl w-full lg:w-1/3 p-4">
    //       <div className="mb-4">
    //         <button
    //           className="w-full text-left font-semibold text-gray-800"
    //           onClick={() => setShowInfillOptions((prev) => !prev)}
    //         >
    //           Infill ▼
    //         </button>
    //         {showInfillOptions && (
    //           <div className="mt-3 space-y-2">
    //             {[...Array(10)].map((_, i) => {
    //               const percent = (i + 1) * 10;
    //               return (
    //                 <div key={percent}>
    //                   <label className="inline-flex items-center space-x-2 cursor-pointer">
    //                     <input
    //                       type="checkbox"
    //                       checked={Math.round(infill * 100) === percent}
    //                       onChange={() => {
    //                         setInfill(percent / 100);
    //                         setAnalysisProgress(0); // trigger reanalysis
    //                         setMetrics(null);
    //                         setShowInfillOptions(false);
    //                       }}
    //                       className="form-checkbox text-blue-600"
    //                     />
    //                     <span className="text-sm text-gray-800">
    //                       {percent}%
    //                     </span>
    //                   </label>
    //                 </div>
    //               );
    //             })}
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </section>

    <>
      <section className="w-full min-h-screen px-4 py-8 bg-gray-100 flex flex-col items-center justify-center gap-6">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6">
          {/* Main content: Model viewer + metrics */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="w-full h-[500px] bg-white rounded-xl shadow">
              <Canvas camera={{ position: [100, 100, 100], fov: 45 }}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[1, 2, 3]} intensity={1.2} />
                <primitive
                  object={new THREE.GridHelper(400, 25)}
                  position={[0, 0, 0]}
                />
                <primitive object={new THREE.AxesHelper(100)} />
                {file && (
                  <Model
                    file={file}
                    onMetricsReady={setMetrics}
                    setAnalysisProgress={setAnalysisProgress}
                    modelRef={modelRef}
                    infill={infill}
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
                <h2 className="text-lg text-black font-semibold mb-2">
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

          <div className="hidden lg:block border-l border-gray-300" />

          {/* Infill Accordion */}
          <div className=" w-full lg:w-1/3 p-4 flex flex-col">
            <button
              className="w-fit text-left font-semibold text-gray-800 bg-white p-4"
              onClick={() => setShowInfillOptions((prev) => !prev)}
            >
              Infill ▼
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out
      ${
        showInfillOptions
          ? "max-h-80 opacity-100  bg-white w-20.5 it p-2"
          : "max-h-0 opacity-0 mt-0"
      }`}
            >
              {[...Array(10)].map((_, i) => {
                const percent = (i + 1) * 10;
                return (
                  <div key={percent}>
                    <label className="inline-flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Math.round(infill * 100) === percent}
                        onChange={() => {
                          setInfill(percent / 100);
                          setAnalysisProgress(0);
                          setMetrics(null);
                          setShowInfillOptions(false);
                        }}
                        className="form-checkbox text-blue-600"
                      />
                      <span className="text-sm text-gray-800">{percent}%</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ModelViewer3;
