let scene, camera, renderer, composer;
let galaxy;
let zoomProgress = 0;
let zoomDuration = 100; // number of frames (adjust as needed)
let targetCameraZ = 2.5;
let targetCameraY = -0.1
let zoomedOut = false;

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

    // Start in the center of the galaxy
    camera.position.set(0, 5, -0.5);
    // camera.position.set(0, 0.5, -0.5);
    // camera.position.set(0, 0, -10.0);
    camera.lookAt(0, 0, 0);

    const canvas = document.getElementById('modelCanvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    composer = new THREE.EffectComposer(renderer);

    updateCanvasSize();

    composer.addPass(new THREE.RenderPass(scene, camera));
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        2,
        0.225,
        0.001
    );
    composer.addPass(bloomPass);

    const loader = new THREE.GLTFLoader();
    loader.load('/wp-content/themes/twentytwentyfive/assets/js/scene.gltf', (gltf) => {
        galaxy = gltf.scene;
        galaxy.rotation.x = Math.PI / 6;
        galaxy.position.y += .5
        scene.add(galaxy);
        processGalaxy(gltf);
    });

    window.addEventListener('resize', onWindowResize);
    if (!isMobile) {
        window.addEventListener('mousemove', onMouseMove);
    }
}

function updateCanvasSize() {
    const width = window.innerWidth;
    const height = document.documentElement.scrollHeight;
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

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    targetRotationX = mouseX;
    targetRotationY = -mouseY;
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

let baseRotationSpeed = 0.001;
let speedInfluence = 0;
let tiltInfluence = 0;

function animate() {
    requestAnimationFrame(animate);

    // Smoothly zoom out camera
    if (zoomProgress < zoomDuration) {
        zoomProgress++;
        const t = zoomProgress / zoomDuration;
        const ease = t * t * (3 - 2 * t); // smoothstep
        camera.position.z = 0.5 + ease * (targetCameraZ - 0.5);
        camera.position.y = 0 + ease * (targetCameraY - 0);
        camera.lookAt(0, -0.4 * ease, 0);
    }

    if (galaxy) {
        speedInfluence += (targetRotationX - speedInfluence) * 2;
        tiltInfluence += (targetRotationY - tiltInfluence) * 0.1;
        let adjustedSpeed = baseRotationSpeed + speedInfluence * 0.0003;
        galaxy.rotation.y += adjustedSpeed;
        galaxy.rotation.x = Math.PI / 6 + tiltInfluence * 0.08;
    }

    composer.render();
}
