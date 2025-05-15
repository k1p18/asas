// import * as THREE from 'three';

// export function calculateVolume(geometry: THREE.BufferGeometry): number {
//   const position = geometry.attributes.position;
//   let volume = 0;

//   if (!position || position.count < 3) return 0;

//   const p = new THREE.Vector3();
//   const vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();

//   for (let i = 0; i < position.count; i += 3) {
//     vA.fromBufferAttribute(position, i);
//     vB.fromBufferAttribute(position, i + 1);
//     vC.fromBufferAttribute(position, i + 2);

//     volume += signedVolumeOfTriangle(vA, vB, vC);
//   }

//   return Math.abs(volume);
// }

// function signedVolumeOfTriangle(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): number {
//   return p1.dot(p2.clone().cross(p3)) / 6.0;
// }

// import * as THREE from "three";

// export const calculateVolume = (object: THREE.Object3D): number => {
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
//   return Math.abs(volume / 1000);
// };




import * as THREE from "three";

/**
 * @param object - The 3D object to analyze.
 * @param infill - A decimal (e.g., 0.2 for 20%) representing the infill percentage.
 * @returns Volume in cubic centimeters (cm³).
 */
export const calculateVolume = (
  object: THREE.Object3D,
  // infill: number = 1
): number => {
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

  // Convert mm³ to cm³ and apply infill
  return Math.abs((volume / 1000));
};
