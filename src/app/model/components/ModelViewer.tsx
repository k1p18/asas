"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three-stdlib";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ModelViewerProps {
  file: File | null;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ file }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({
    volume: "N/A",
    dimensions: "N/A",
    printTime: "N/A",
    weight: "N/A", // Added weight state
    cost: "N/A", // Added cost state
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file || !containerRef.current) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const width = containerRef.current.clientWidth;
    const height = 600;
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff); // White background
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(1, 1, 1);
    scene.add(ambientLight, dirLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    camera.position.set(0, 0, 100);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // const handleResize = () => {
    //   if (!containerRef.current) return;
    //   const newWidth = containerRef.current.clientWidth;
    //   camera.aspect = newWidth / height;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize(newWidth, height);
    // };
    // window.addEventListener("resize", handleResize);

    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || 400;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener("resize", handleResize);

    const loadModel = (object: THREE.Object3D) => {
      scene.clear();
      scene.add(ambientLight, dirLight, object);

      
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      object.position.sub(center);
      
      const maxDim = Math.max(size.x, size.y, size.z);
      // Scale model based on the largest dimension
      // const scale = 50 / Math.max(size.x, size.y, size.z);
      const scale = 30 / maxDim;
      object.scale.setScalar(scale);
      // object.scale.set(scale, scale, scale);

      const sortedDimensions = [
        Math.min(size.x, size.y, size.z),
        Math.max(size.x, size.y, size.z),
      ].sort((a, b) => a - b);

      const volume = calculateVolume(object); // Ensure volume is being calculated properly
      const printTime = estimatePrintTime(volume);

      const infill = 0.2; // 20% infill
      const density = 1.24; // PLA density g/cm³
      // const adjustedWeight = volume * infill * density; // Weight calculation

      // Cost in INR (Indian Rupees)
      const costPerKgINR = 1500; // cost per kg in INR
      const adjustedWeight = volume * infill * density; // Adjusted weight in gram
      const cost = (adjustedWeight / 1000) * costPerKgINR; // Cost calculation in INR

      setMetrics({
        volume: volume.toFixed(2) + " cm³",
        dimensions: `${(sortedDimensions[0] / 10).toFixed(2)} × ${(
          sortedDimensions[1] / 10
        ).toFixed(2)} × ${(size.z / 10).toFixed(2)} cm`, // Dimensions sorted and formatted correctly
        printTime: formatTime(printTime),
        weight: adjustedWeight.toFixed(2) + " g", // Display weight
        cost: `₹${cost.toFixed(2)}`, // Display cost in INR
      });

      // setMetrics({
      //   volume: volume.toFixed(2) + " cm³",
      //   dimensions: `${(size.x / 10).toFixed(1)} × ${(size.y / 10).toFixed(
      //     1
      //   )} × ${(size.z / 10).toFixed(1)} cm`,
      //   printTime: formatTime(printTime),
      //   weight: adjustedWeight.toFixed(2) + " g", // Display weight
      //   cost: `₹${cost.toFixed(2)}`, // Display cost in INR
      // });

      // Adjust the camera position to fit the model into view
      const maxDimension = Math.max(size.x, size.y, size.z);
      // camera.position.set(0, 0, maxDimension * 1.5); // Adjust camera position dynamically
      camera.position.set(0, 0, 100);
      controls.enableZoom = true;
      controls.enablePan = false;
      controls.autoRotate = false;
      controls.enableDamping = true;
      camera.lookAt(object.position);
      controls.update();
    };

    const reader = new FileReader();
    reader.onerror = () => setError("File reading failed");
    reader.onload = async (e) => {
      const contents = e.target?.result;
      if (!contents) return;

      try {
        if (ext === "stl") {
          const loader = new STLLoader();
          const geometry = loader.parse(contents as ArrayBuffer);
          const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
          const mesh = new THREE.Mesh(geometry, material);
          loadModel(mesh);
        } else if (ext === "obj") {
          const loader = new OBJLoader();
          const text = new TextDecoder().decode(contents as ArrayBuffer);
          const object = loader.parse(text);
          loadModel(object);
        } else if (ext === "step" || ext === "stp") {
          setError(
            "STEP file support requires a separate library like @shapediver/viewer."
          );
        } else {
          setError("Unsupported format");
        }
      } catch (err: any) {
        setError("Error parsing model: " + err.message);
      }
    };

    reader.readAsArrayBuffer(file);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [file]);

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
    return Math.abs(volume / 1000); // mm³ to cm³
  };

  const estimatePrintTime = (volume: number): number => {
    const speed = 50; // mm/s
    const layerHeight = 0.2; // mm
    const nozzleDiameter = 0.4; // mm
    const infill = 0.2; // 20% infill

    const volumeMM3 = volume * 1000; // convert cm³ to mm³
    const adjustedVolume = volumeMM3 * infill;
    const extrusionArea = nozzleDiameter * layerHeight; // rectangular bead
    const filamentLength = adjustedVolume / extrusionArea; // mm
    const timeInSeconds = filamentLength / speed;

    return timeInSeconds;
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  return (
    // <div className="p-4 bg-white rounded-xl shadow w-full max-w-3xl mx-auto">
    //   <div ref={containerRef} className="w-full h-[500px]" />
    //   {error && <p className="text-red-600 mt-4">{error}</p>}
    //   {!error && (
    //     <div className="mt-4 space-y-2 text-sm text-gray-100 bg-black p-4">
    //       <div className="flex justify-between">
    //         <p>Volume:</p>
    //         <p>{metrics.volume}</p>
    //       </div>
    //       <div className="flex justify-between">
    //         <p>Dimensions:</p>
    //         <p>{metrics.dimensions}</p>
    //       </div>
    //       <div className="flex justify-between">
    //         <p>Estimated Print Time:</p>
    //         <p>{metrics.printTime}</p>
    //       </div>
    //       <div className="flex justify-between">
    //         <p>Estimated Cost:</p>
    //         <p>{metrics.cost}</p>
    //       </div>
    //     </div>
    //   )}
    // </div>  {/* {error && <p className="text-red-600 mt-4">{error}</p>} */}
    <>
      <section className="w-full min-h-screen px-4 py-8 bg-gray-100 flex flex-col justify-center items-center gap-18">
        {/* Viewer Box */}
        <div className="w-full max-w-3xl">
          <div
            ref={containerRef}
            className="w-full h-[500px] bg-black rounded-xl shadow"
          />
        </div>

        {/* Info Box */}
        <div className="w-full max-w-3xl rounded-xl overflow-hidden mt-12">
          <div className="bg-black text-gray-100 text-sm w-full rounded-xl shadow">
            <table className="w-full table-auto text-left border-collapse">
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-2 px-4 font-medium">Volume</td>
                  <td className="py-2 px-4 text-right">{metrics.volume}</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2 px-4 font-medium">Dimensions</td>
                  <td className="py-2 px-4 text-right">{metrics.dimensions}</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2 px-4 font-medium">
                    Estimated Print Time
                  </td>
                  <td className="py-2 px-4 text-right">{metrics.printTime}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium">Estimated Cost</td>
                  <td className="py-2 px-4 text-right">{metrics.cost}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default ModelViewer;
