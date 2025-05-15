// import * as THREE from "three";
// import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

// export async function loadAndPrepareModel(file: File, scene: THREE.Scene): Promise<{
//   object: THREE.Object3D;
//   size: THREE.Vector3;
//   scale: number;
// }> {
//   const ext = file.name.split(".").pop()?.toLowerCase();

//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       const contents = e.target?.result;
//       if (!contents) return reject("File read error");

//       let object: THREE.Object3D | null = null;

//       if (ext === "stl") {
//         const loader = new STLLoader();
//         const geometry = loader.parse(contents as ArrayBuffer);
//         const material = new THREE.MeshStandardMaterial({ color: "#00ff00" });
//         object = new THREE.Mesh(geometry, material);
//       } else if (ext === "obj") {
//         const loader = new OBJLoader();
//         const text = new TextDecoder().decode(contents as ArrayBuffer);
//         object = loader.parse(text);
//         object.traverse((child) => {
//           if ((child as THREE.Mesh).isMesh) {
//             (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
//               color: "#00ff00",
//             });
//           }
//         });
//       } else {
//         return reject("Unsupported file format");
//       }

//       if (!object) return reject("Failed to load object");

//       const box = new THREE.Box3().setFromObject(object);
//       const size = box.getSize(new THREE.Vector3());
//       const center = box.getCenter(new THREE.Vector3());

//       object.position.sub(center);
//       object.position.y += size.y / 2; // place base on grid

//       const targetZHeight = size.z;
//       const scale = targetZHeight / size.z;
//       object.scale.setScalar(scale);

//       scene.clear();
//       scene.add(object);

//       resolve({ object, size, scale });
//     };

//     reader.readAsArrayBuffer(file);
//   });
// }

import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export async function loadModel(file: File): Promise<THREE.Object3D> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result;
      if (!contents) return reject("File read error");

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
            (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
              color: "#00ff00",
            });
          }
        });
      } else {
        return reject("Unsupported file format");
      }

      if (!object) return reject("Failed to load object");

      // Center and position model on the grid:
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      object.position.sub(center);
      object.position.y += size.y / 2; // place base on grid

      resolve(object);
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
