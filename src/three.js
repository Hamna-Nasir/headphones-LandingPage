// three.js Headphones Viewer
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

//  Canvas & Scene Setup 
const canvas = document.querySelector("#headphones-canvas");
if (!canvas) console.error("Canvas not found!");

const scene = new THREE.Scene();

// Camera 
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.set(0, 1.4, 4.8);

// Renderer 
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
updateRendererSize();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;



// Lighting 
scene.add(new THREE.AmbientLight(0xffffff, 1.8));
const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// Controls 
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;
controls.target.set(0, 0.5, 0);
controls.update();

//  Load 3D Model 
const loader = new GLTFLoader();
let colorableMeshes = []; 

loader.load(
  "./models/headphones/scene.gltf",
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    //  Auto-center and scale model 
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const isMobile = window.innerWidth < 768;
    const scaleFactor = isMobile
      ? 3.5 / Math.max(size.x, size.y, size.z)
      : 3.2 / Math.max(size.x, size.y, size.z);

    model.scale.setScalar(scaleFactor);
    model.position.sub(center.multiplyScalar(scaleFactor));
    model.position.y += isMobile ? -0.2 : -0.3; 
    model.rotation.y = Math.PI / 6;

    //  Identify all plastic meshes for color changes
    model.traverse((child) => {
      if (child.isMesh && child.name.includes("Plastic")) {
        colorableMeshes.push(child);
        child.material = new THREE.MeshStandardMaterial({
          color: 0x000000, // initial color
          metalness: 0.8,
          roughness: 0.2,
        });
        console.log("Plastic mesh added:", child.name);
      }
    });

    controls.target.set(0, model.position.y + 0.5, 0);
    controls.update();

    console.log("Headphones model loaded, scaled, and positioned lower.");
  },
  undefined,
  (error) => console.error("Error loading model:", error)
);

// Color Change 
const colorPicker = document.getElementById("color-picker");
if (colorPicker) {
  colorPicker.querySelectorAll("div").forEach((button) => {
    button.addEventListener("click", (event) => {
      const color = event.target.getAttribute("data-color");
      if (colorableMeshes.length > 0) {
        colorableMeshes.forEach((mesh) => mesh.material.color.set(color));
      } else {
        console.warn("No colorable mesh found yet.");
      }
    });
  });
}

// Responsive Resize Handling
window.addEventListener("resize", () => {
  updateRendererSize();
});

function updateRendererSize() {
  if (!canvas) return;
  const isMobile = window.innerWidth < 768;

  const width = isMobile ? canvas.clientWidth * 0.9 : canvas.clientWidth;
  const height = isMobile ? canvas.clientHeight * 0.8 : canvas.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

// Animation Loop 
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
