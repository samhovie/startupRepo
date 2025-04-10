let scene, camera, renderer, composer;
let galaxy, galaxyCenterLight;
let starTexture;
let zoomedIn = false;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
let currentRotationX = 0, currentRotationY = 0;
let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

init();
animate();

function findPoints(object) {
    if (object.isPoints) return object;
    for (let child of object.children) {
        const points = findPoints(child);
        if (points) return points;
    }
    return null;
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // camera.position.set(0, 0, 4);
    // camera.rotation.set(-Math.PI / 3, 0, 0);
    // camera.lookAt(0, 0, 0)

    camera.position.set(0, -.5, 3);  // Move the camera higher on the Y-axis
    camera.rotation.set(-Math.PI / 6, 0, 0);  // Adjust the rotation angle
    camera.lookAt(0, -1.2, 0);
    const canvas = document.getElementById('modelCanvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    composer = new THREE.EffectComposer(renderer);

    // Set canvas size AFTER renderer/composer are initialized
    updateCanvasSize();

    // Add passes
    composer.addPass(new THREE.RenderPass(scene, camera));
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.7,
        0.225,
        0.001
    );
    // if(isMobile) bloomPass.strength = 1.8
    composer.addPass(bloomPass);

    // galaxyCenterLight = new THREE.PointLight(0xffffff, 1);
    // scene.add(galaxyCenterLight);

    const loader = new THREE.GLTFLoader();
    loader.load('/wp-content/themes/twentytwentyfive/assets/js/scene.gltf', (gltf) => {
        galaxy = gltf.scene;
        galaxy.rotation.x = Math.PI / 6;
        scene.add(galaxy);
        processGalaxy(gltf);
    });

    // if (isMobile) {
    //     // iOS 13+ and some Androids require user interaction to grant permission
    //     if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    //         const button = document.createElement('button');
    //         button.innerText = "Enable Motion";
    //         button.style.position = 'absolute';
    //         button.style.top = '50%';
    //         button.style.left = '50%';
    //         button.style.transform = 'translate(-50%, -50%)';
    //         button.style.padding = '1.5em 2.5em';
    //         button.style.fontSize = '1.2em';
    //         button.style.zIndex = 9999;
    //         document.body.appendChild(button);

    //         button.addEventListener('click', () => {
    //             DeviceOrientationEvent.requestPermission()
    //                 .then(permissionState => {
    //                     if (permissionState === 'granted') {
    //                         window.addEventListener('deviceorientation', onDeviceOrientation);
    //                         button.remove();
    //                     }
    //                     else {
    //                         button.innerText = "Permission Denied";
    //                         // button.remove();
    //                     }
    //                 })
    //                 .catch(console.error);
    //         });
    //     } else {
    //         // Older Android or already allowed
    //         window.addEventListener('deviceorientation', onDeviceOrientation);
    //     }
    // }

    window.addEventListener('resize', onWindowResize);
    if (!isMobile) {
        window.addEventListener('mousemove', onMouseMove);
    }
    // else {
    //     window.addEventListener('deviceorientation', onDeviceOrientation);
    // }

}

function updateCanvasSize() {
    // const canvas = document.getElementById('modelCanvas');
    const width = window.innerWidth;
    const height = window.innerHeight * 2;

    if (renderer && composer) {
        renderer.setSize(width, height);
        composer.setSize(width, height);
    }

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

function onWindowResize() {
    if (isMobile) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    updateCanvasSize();
}

// function onMouseMove(event) {
//     mouseX = (event.clientX / window.innerWidth) * 2 - 1;
//     mouseY = (event.clientY / window.innerHeight) * 2 - 1;

//     targetRotationX = mouseX * 0.2;
//     targetRotationY = -mouseY * 0.1;
// }

// function onMouseMove(event) {
//     mouseX = (event.clientX / window.innerWidth) * 2 - 1;
//     mouseY = (event.clientY / window.innerHeight) * 2 - 1;

//     targetRotationX = mouseX;       // horizontal influence
//     targetRotationY = -mouseY;      // vertical influence (inverted feels more natural)
// }

// function onDeviceOrientation(event) {
//     const gamma = event.gamma || 0; // left to right (-90 to 90)
//     const beta = event.beta || 0;   // front to back (-180 to 180)

//     // Normalize gamma and beta to values between -1 and 1
//     const normGamma = gamma / 45;  // reasonable range is -45 to 45
//     const normBeta = (beta - 45) / 45; // adjust center tilt

//     targetRotationX = normGamma * 0.2;
//     targetRotationY = -normBeta * 0.1;
// }

// function onDeviceOrientation(event) {
//     const gamma = event.gamma || 0;
//     const beta = event.beta || 0;

//     const normGamma = gamma / 45;
//     const normBeta = (beta - 45) / 45;

//     targetRotationX = normGamma;
//     targetRotationY = -normBeta;
// }


function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;

    targetRotationX = mouseX;        // affects speed only slightly
    targetRotationY = -mouseY;       // more noticeable tilt
}

function onDeviceOrientation(event) {
    const gamma = event.gamma || 0; // left to right (-90 to 90)
    const beta = event.beta || 0;   // front to back (-180 to 180)

    const normGamma = gamma / 45;
    const normBeta = (beta - 45) / 45;

    // Increase these multipliers for more influence
    targetRotationX = normGamma * 0.4; // ← was 0.2
    targetRotationY = -normBeta * 0.15; // ← was 0.1
}


function processGalaxy(gltf) {
    const points = findPoints(gltf.scene);
    if (!points) {
        console.error("No Points object found in the model!");
        return;
    }

    const geometry = points.geometry;
    geometry.computeBoundingBox();
    const center = geometry.boundingBox.getCenter(new THREE.Vector3());
    geometry.translate(-center.x, -center.y, -center.z);

    const positions = new Float32Array(geometry.attributes.position.array.buffer);
    const colors = new Float32Array(positions.length);
    const color = new THREE.Color();

    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i], y = positions[i + 1], z = positions[i + 2];
        const distance = Math.sqrt(x * x + y * y + z * z) / 100;

        color.setRGB(
            Math.cos(distance),
            Math.random() * 0.8,
            Math.sin(distance)
        );

        color.toArray(colors, i);
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
        size: 0.00,
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        depthWrite: false
    });

    const stars = new THREE.Points(geometry, starMaterial);
    scene.add(stars);
}

let baseRotationSpeed = 0.0005;
let speedInfluence = 0;
let tiltInfluence = 0;

function animate() {
    // requestAnimationFrame(animate);

    // if (galaxy) {
    //     if (!zoomedIn) {
    //     // if (!zoomedIn && !isMobile) {
    //         galaxy.scale.lerp(new THREE.Vector3(2.7, 2.7, 2.7), 0.02);
    //         if (galaxy.scale.x >= 2.69) zoomedIn = true;
    //     } else if (!isMobile) {
    //         currentRotationX += (targetRotationX - currentRotationX) * 0.1;
    //         currentRotationY += (targetRotationY - currentRotationY) * 0.1;
    //         galaxy.rotation.y = currentRotationX;
    //         galaxy.rotation.x = Math.PI / 6 + currentRotationY;
    //     } else {
    //         // Mobile: Do not change galaxy scale or position on zoom
    //     }
    // }

    // if (galaxy) {
    //     if (!zoomedIn) {
    //         galaxy.scale.lerp(new THREE.Vector3(2.7, 2.7, 2.7), 0.02);
    //         if (galaxy.scale.x >= 2.69) zoomedIn = true;
    //     } else {
    //         // This works for both mobile and desktop now
    //         currentRotationX += (targetRotationX - currentRotationX) * 0.1;
    //         currentRotationY += (targetRotationY - currentRotationY) * 0.1;
    //         galaxy.rotation.y = currentRotationX;
    //         galaxy.rotation.x = Math.PI / 6 + currentRotationY;
    //     }
    // }

    // composer.render();
    requestAnimationFrame(animate);

    if (galaxy) {
        // Smooth damping
        // speedInfluence += (targetRotationX - speedInfluence) * 0.05;
        speedInfluence += (targetRotationX - speedInfluence) * 0.14;
        // speedInfluence = Math.max(Math.min(speedInfluence, 1), -1);
        tiltInfluence += (targetRotationY - tiltInfluence) * 0.05;

        // Horizontal input affects speed a bit — but can't stop rotation
        let adjustedSpeed = baseRotationSpeed + speedInfluence * 0.0003;

        // Apply constant + influenced rotation
        galaxy.rotation.y += adjustedSpeed;

        // Vertical input affects tilt (X axis)
        galaxy.rotation.x = Math.PI / 6 + tiltInfluence * 0.08; // more up/down influence
    }

    composer.render();
}
