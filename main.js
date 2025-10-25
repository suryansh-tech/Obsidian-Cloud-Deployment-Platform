import { OrbitControls } from 'three/examples/jsm/Addons.js';
import './style.css'
import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import gsap from 'gsap';

import LocomotiveScroll from 'locomotive-scroll';
const locomotiveScroll = new LocomotiveScroll();




// GUI
import * as dat from 'dat.gui';

//scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,1, 1000);
camera.position.z = 2.5;
camera.position.x = 0.5;
camera.position.y = -0.5
scene.add(camera)

// light
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 10, 100);
pointLight.position.set(1, 1, 1);
pointLight.castShadow = true; // Enable shadow casting for this light
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff, 1, 100);
pointLight2.position.set(-4, -4, -4);
pointLight2.castShadow = true; // Enable shadow casting for this light
scene.add(pointLight2);

// Directional light from the right
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-12.7, -2, -47); // Position the light from the right
directionalLight.castShadow = true; // Enable shadow casting for this light
scene.add(directionalLight);

// model
let model;
const loader = new GLTFLoader();
loader.load('./primalclaw.glb', (gltf)=>{
    model = gltf.scene;
    model.position.y = -0.24

    // Traverse 
    model.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshPhysicalMaterial({
                color: "#FE9C9D",
                metalness: 0.6,
                roughness: 0.2,
            });
            child.castShadow = true; // Enable shadow casting for this mesh
            child.receiveShadow = true; // Enable shadow receiving for this mesh
        }
    });

    scene.add(model);

    // GUI metalness and roughness
    // const gui = new dat.GUI();
    // const material = model.children[0].material; 
    // gui.add(material, 'metalness', 0, 1).onChange((value) => {
    //     model.traverse((child) => {
    //         if (child.isMesh) {
    //             child.material.metalness = value;
    //         }
    //     });
    // });
    // gui.add(material, 'roughness', 0, 1).onChange((value) => {
    //     model.traverse((child) => {
    //         if (child.isMesh) {
    //             child.material.roughness = value;
    //         }
    //     });
    // });

    // GUI for pointLight position, rotation, and scale
    // const pointLightFolder = gui.addFolder('Point Light');
    // pointLightFolder.add(pointLight.position, 'x', -10, 10).onChange((value) => {
    //     pointLight.position.x = value;
    // });
    // pointLightFolder.add(pointLight.position, 'y', -10, 10).onChange((value) => {
    //     pointLight.position.y = value;
    // });
    // pointLightFolder.add(pointLight.position, 'z', -10, 10).onChange((value) => {
    //     pointLight.position.z = value;
    // });
    // pointLightFolder.add(pointLight.rotation, 'x', -Math.PI, Math.PI).onChange((value) => {
    //     pointLight.rotation.x = value;
    // });
    // pointLightFolder.add(pointLight.rotation, 'y', -Math.PI, Math.PI).onChange((value) => {
    //     pointLight.rotation.y = value;
    // });
    // pointLightFolder.add(pointLight.rotation, 'z', -Math.PI, Math.PI).onChange((value) => {
    //     pointLight.rotation.z = value;
    // });
    // pointLightFolder.add(pointLight.scale, 'x', 0, 10).onChange((value) => {
    //     pointLight.scale.x = value;
    // });
    // pointLightFolder.add(pointLight.scale, 'y', 0, 10).onChange((value) => {
    //     pointLight.scale.y = value;
    // });
    // pointLightFolder.add(pointLight.scale, 'z', 0, 10).onChange((value) => {
    //     pointLight.scale.z = value;
    // });
  
}, undefined, (e) => {
    console.log("something went wrong", e);
});

// mouse rotation movement
window.addEventListener("mousemove", (e) => {
    if (model) {
        
      gsap.to(model.rotation, { 
        duration: 0.5,
        ease: "power2.out",
        delay: 0.1,
        x: (e.clientY / window.innerHeight - .5) * Math.PI * 0.14,
        y: (e.clientX / window.innerWidth - .5) * Math.PI * 0.14 
    })
    }
  })


// HDRI
const rgbeloader = new RGBELoader();
rgbeloader.load('./sky.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // scene.background = texture;
    scene.environment = texture;
})

//fog
scene.fog = new THREE.FogExp2("#FE9C9D", .1);

//render
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#DDDDDD", 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputEncoding = THREE.SRGBEncoding;
renderer.shadowMap.enabled = true; 
renderer.render(scene, camera);

// headings move
const mov = document.querySelector("#mov");
document.addEventListener("mousemove",function(e){
    gsap.to(mov,{
        duration: 2,
        ease: "power2.out",
        delay: 0.1,
        x: -(e.clientX - mov.offsetWidth / 2) * 0.0196, // Center the element on the cursor
        y: -(e.clientY - mov.offsetHeight / 2) * 0.0196
    })
})

// orbit control
const control = new OrbitControls(camera, renderer.domElement)
control.enableDamping = true;
control.enableRotate = false;



// resize 
window.addEventListener("resize", ()=>{
    const {innerWidth, innerHeight} = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
})

//animate
function animate(){
    window.requestAnimationFrame(animate);
    control.update();
    renderer.render(scene, camera)
}

animate();

