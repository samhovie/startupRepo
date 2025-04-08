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
    camera.position.set(0, -1, 4);

    const canvas = document.getElementById('modelCanvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    composer = new THREE.EffectComposer(renderer);

    // Set canvas size AFTER renderer/composer are initialized
    updateCanvasSize();

    // Add passes
    composer.addPass(new THREE.RenderPass(scene, camera));
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        2,
        0.225,
        0.001
    );
    composer.addPass(bloomPass);

    galaxyCenterLight = new THREE.PointLight(0xffffff, 0.5);
    scene.add(galaxyCenterLight);

    const loader = new THREE.GLTFLoader();
    loader.load('/wp-content/themes/twentytwentyfive/assets/js/scene.gltf', (gltf) => {
        galaxy = gltf.scene;
        galaxy.rotation.x = Math.PI / 6;
        scene.add(galaxy);
        processGalaxy(gltf);
    });

    window.addEventListener('resize', onWindowResize);
    if (!isMobile) {
        window.addEventListener('mousemove', onMouseMove);
    }
}

function updateCanvasSize() {
    const canvas = document.getElementById('modelCanvas');
    const width = window.innerWidth;

    // More reliable height that accounts for mobile browser UI
    const height = document.documentElement.clientHeight;

    // Add a buffer just in case
    const canvasHeight = height * 2 + 60;

    canvas.width = width;
    canvas.height = canvasHeight;

    if (renderer && composer) {
        renderer.setSize(width, canvasHeight);
        composer.setSize(width, canvasHeight);
    }
}


function onWindowResize() {
    // Update camera aspect ratio and canvas size when the window is resized
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    updateCanvasSize();
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;

    targetRotationX = mouseX * 0.2;
    targetRotationY = -mouseY * 0.1;
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
        map: starTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        depthWrite: false
    });

    const stars = new THREE.Points(geometry, starMaterial);
    scene.add(stars);
}

function animate() {
    requestAnimationFrame(animate);

    if (galaxy) {
        if (!zoomedIn) {
            galaxy.scale.lerp(new THREE.Vector3(2.7, 2.7, 2.7), 0.02);
            if (galaxy.scale.x >= 2.69) zoomedIn = true;
        } else if (!isMobile) {
            currentRotationX += (targetRotationX - currentRotationX) * 0.1;
            currentRotationY += (targetRotationY - currentRotationY) * 0.1;
            galaxy.rotation.y = currentRotationX;
            galaxy.rotation.x = Math.PI / 6 + currentRotationY;
        } else {
            // Mobile: Adjust scale if necessary to fit the screen properly
            galaxy.scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), 0.02);
        }
    }

    composer.render();
}
