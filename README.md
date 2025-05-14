1.✅ SETUP FOR THREEJS

1. Creating the Scene

    const scene = new THREE.Scene();

2. Setting Up the Camera

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 100);

3. Renderer Initialization

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff); // White background
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

4. Lighting Setup

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(1, 1, 1);
    scene.add(ambientLight, dirLight);

5. Controls (OrbitControls)

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate = false;
    controls.enableDamping = true;

6. Animation Loop

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();


7. Responsive Resize Handling

    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || 400;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };


| Step                                        | Purpose                                    |
| ------------------------------------------- | ------------------------------------------ |
| `THREE.Scene()`                             | Create a 3D world.                         |
| `THREE.PerspectiveCamera()`                 | Define a camera with a perspective view.   |
| `THREE.WebGLRenderer()`                     | Renders the scene into a canvas.           |
| Lights (`AmbientLight`, `DirectionalLight`) | Illuminate the scene.                      |
| `OrbitControls`                             | Let user rotate and zoom the view.         |
| `animate()`                                 | Continuously renders the scene.            |
| `handleResize()`                            | Keeps viewer responsive to window changes. |




2.✅ Model Loading & Handling

1. Detecting File Extension

    const ext = file.name.split(".").pop()?.toLowerCase();  //top of code

2. FileReader Setup

    const reader = new FileReader();
    reader.onerror = () => setError("File reading failed");

3. When File Loads

    reader.onload = async (e) => {
     const contents = e.target?.result;
     if (!contents) return;
    }

4. Loading STL Files

    if (ext === "stl") {
       const loader = new STLLoader();
       const geometry = loader.parse(contents as ArrayBuffer);
       const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
       const mesh = new THREE.Mesh(geometry, material);
       loadModel(mesh);
}


5. Loading OBJ Files

else if (ext === "obj") {
  const loader = new OBJLoader();
  const text = new TextDecoder().decode(contents as ArrayBuffer);
  const object = loader.parse(text);
  loadModel(object);
}



6. Unsupported File Types

    else if (ext === "step" || ext === "stp") {
        setError("STEP file support requires a separate library like @shapediver/viewer.");
    } else {
        setError("Unsupported format");
    }

7. Reading the File

    reader.readAsArrayBuffer(file);

✅ Summary of File Handling

| Task           | Code                             | Explanation                                   |
| -------------- | -------------------------------- | --------------------------------------------- |
| Get file type  | `file.name.split(".").pop()`     | Detects if it’s STL or OBJ                    |
| Read file      | `FileReader.readAsArrayBuffer()` | Reads model as binary or text                 |
| STL parsing    | `STLLoader().parse()`            | Loads binary mesh                             |
| OBJ parsing    | `OBJLoader().parse()`            | Parses text geometry                          |
| Load model     | `loadModel(object)`              | Prepares it for rendering and analysis        |
| Error handling | `setError()`                     | Informs user on unsupported files or failures |


3. ✅ loadModel Function — Centering, Scaling, and Metrics

1. Clearing & Adding to Scene

    scene.clear(); //remove old file
    scene.add(ambientLight, dirLight, object);

2. Centering the Model

    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    object.position.sub(center);


3. Scaling the Model

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 30 / maxDim;
    object.scale.setScalar(scale);

4. Calculate Sorted Dimensions

    const sortedDimensions = [
        Math.min(size.x, size.y, size.z),
        Math.max(size.x, size.y, size.z),
    ].sort((a, b) => a - b);

5. Calculate Volume

    const volume = calculateVolume(object); // in cm³

6. Estimate Print Time

    const printTime = estimatePrintTime(volume); // in seconds

7. Calculate Weight & Cost

    const infill = 0.2;
    const density = 1.24; // g/cm³ for PLA
    const adjustedWeight = volume * infill * density; // grams
    const cost = (adjustedWeight / 1000) * costPerKgINR; // INR

8. Set Metrics State

    setMetrics({
        volume: volume.toFixed(2) + " cm³",
        dimensions: `${(sortedDimensions[0] / 10).toFixed(2)} × ${(sortedDimensions[1] / 10).toFixed(2)} × ${(size.z / 10).toFixed(2)} cm`,
        printTime: formatTime(printTime),
        weight: adjustedWeight.toFixed(2) + " g",
        cost: `₹${cost.toFixed(2)}`,
});

9. Adjust Camera Again

    camera.position.set(0, 0, 100);
    camera.lookAt(object.position);
    controls.update();


🧠 Summary: What loadModel Does

| Step                | What it Does                               |
| ------------------- | ------------------------------------------ |
| `scene.clear()`     | Removes previous model                     |
| `center`            | Centers object at origin                   |
| `scale`             | Normalizes model size to fit scene         |
| `calculateVolume`   | Estimates model volume in cm³              |
| `estimatePrintTime` | Uses volume to guess time (in seconds)     |
| `adjustedWeight`    | Estimates weight (g) with infill & density |
| `cost`              | Calculates based on ₹1500/kg               |
| `camera.lookAt()`   | Keeps camera focused on model              |


✅ calculateVolume — Estimating Model Volume from Geometry

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


🕒 estimatePrintTime — Estimating Print Time

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


