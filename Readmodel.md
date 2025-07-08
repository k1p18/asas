<!-- // <section className="w-full min-h-screen px-4 py-8 bg-gray-100 flex flex-col items-center justify-center gap-6">
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
    // </section> -->