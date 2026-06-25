const canvas = document.querySelector("[data-three-scene]");

if (canvas && window.THREE) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: window.location.search.includes("verify3d=1"),
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
  camera.position.set(0, 0.2, 8);

  const group = new THREE.Group();
  scene.add(group);

  const ambient = new THREE.AmbientLight(0xffffff, 1.8);
  scene.add(ambient);

  const key = new THREE.PointLight(0x3dd6c6, 14, 18);
  key.position.set(-3.5, 2.4, 4);
  scene.add(key);

  const warm = new THREE.PointLight(0xffb25c, 9, 14);
  warm.position.set(4, -1.4, 3);
  scene.add(warm);

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.15, 0.28, 160, 18),
    new THREE.MeshStandardMaterial({
      color: 0x39b7aa,
      metalness: 0.42,
      roughness: 0.24,
      emissive: 0x062724,
    })
  );
  knot.position.set(2.6, 0.15, -0.8);
  knot.rotation.set(0.35, 0.25, 0);
  group.add(knot);

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1.45, 1.45, 1.45, 6, 6, 6),
    new THREE.MeshStandardMaterial({
      color: 0xd49b45,
      metalness: 0.25,
      roughness: 0.34,
      wireframe: true,
    })
  );
  cube.position.set(-3.1, -0.75, -0.6);
  cube.rotation.set(0.45, 0.35, 0.2);
  group.add(cube);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.25, 0.018, 12, 120),
    new THREE.MeshBasicMaterial({ color: 0xe46d5e, transparent: true, opacity: 0.78 })
  );
  ring.position.set(1.35, 0.05, -1.2);
  ring.rotation.set(1.2, 0.15, 0.35);
  group.add(ring);

  const isCompact = window.matchMedia("(max-width: 700px)").matches;
  const particleCount = isCompact ? 140 : 260;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const palette = [new THREE.Color(0x73efe3), new THREE.Color(0xe7b557), new THREE.Color(0xe07162), new THREE.Color(0xf5f1e8)];

  for (let i = 0; i < particleCount; i += 1) {
    const radius = 2.4 + Math.random() * 4.9;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 5.1;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radius - 2.2;
    const color = palette[i % palette.length];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
    })
  );
  group.add(particles);

  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = [];
  for (let i = 0; i < (isCompact ? 24 : 46); i += 1) {
    const a = i * 6;
    const b = ((i * 6 + 30) % particleCount) * 3;
    linePositions.push(
      positions[a],
      positions[a + 1],
      positions[a + 2],
      positions[b],
      positions[b + 1],
      positions[b + 2]
    );
  }
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(
    lineGeometry,
    new THREE.LineBasicMaterial({ color: 0x73efe3, transparent: true, opacity: 0.16 })
  );
  group.add(lines);

  const pointer = { x: 0, y: 0 };
  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.55;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.35;
  });

  function resize() {
    const { clientWidth, clientHeight } = canvas;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize);
  resize();

  let frame = 0;
  let isVisible = true;
  const sceneObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
  });
  sceneObserver.observe(canvas);

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;
    frame += 0.01;
    group.rotation.y += 0.0025;
    group.rotation.x += (pointer.y - group.rotation.x) * 0.025;
    group.rotation.z += (pointer.x - group.rotation.z) * 0.02;
    knot.rotation.x += 0.006;
    knot.rotation.y += 0.009;
    cube.rotation.x -= 0.004;
    cube.rotation.y += 0.007;
    ring.rotation.z += 0.003;
    particles.rotation.y -= 0.0018;
    camera.position.y = 0.2 + Math.sin(frame) * 0.08;
    renderer.render(scene, camera);
  }

  animate();
}
