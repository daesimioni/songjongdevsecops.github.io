// Fenda 3D: um icosaedro de arestas acesas girando em WebGL.

const THREE_CDN = "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";

export async function mount(el, api) {
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">cristal da fenda</span>
        <span class="widget-hint">arraste para girar</span>
      </div>
      <div class="three-wrap" id="solid-stage"></div>
      <p class="solid-readout" id="solid-readout">icosaedro · 12 vértices · 20 faces · 30 arestas</p>
      <p class="widget-note">A câmera e a luz são de brinquedo; os triângulos são de verdade. Arraste com o mouse ou o dedo. Quando você solta, o cristal volta a girar sozinho.</p>
    </div>
  `;
  const stage = el.querySelector("#solid-stage");
  const readout = el.querySelector("#solid-readout");

  let THREE = null;
  try {
    THREE = await import(THREE_CDN);
  } catch (e) {
    stage.innerHTML = '<p class="widget-fail" style="padding:18px">WebGL não carregou agora. O texto continua aqui; tente recarregar.</p>';
    console.error("[solid]", e);
    return () => {};
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    stage.innerHTML = '<p class="widget-fail" style="padding:18px">seu navegador não abriu o contexto WebGL.</p>';
    return () => {};
  }

  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(stage.clientWidth || 480, stage.clientHeight || 320);
  renderer.domElement.style.display = "block";
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070f, 0.09);
  const camera = new THREE.PerspectiveCamera(42, (stage.clientWidth || 480) / (stage.clientHeight || 320), 0.1, 100);
  camera.position.set(0, 0.2, 5.1);

  const group = new THREE.Group();
  scene.add(group);

  const geo = new THREE.IcosahedronGeometry(1.35, 0);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x8a6ad0,
    emissive: 0x3a1a66,
    emissiveIntensity: 0.9,
    metalness: 0.55,
    roughness: 0.22,
    flatShading: true,
  });
  const solid = new THREE.Mesh(geo, mat);
  group.add(solid);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geo),
    new THREE.LineBasicMaterial({ color: 0xffa6c9, transparent: true, opacity: 0.85 }),
  );
  group.add(edges);

  const halo = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.55, 1),
    new THREE.MeshBasicMaterial({ color: 0xb48cff, wireframe: true, transparent: true, opacity: 0.09 }),
  );
  group.add(halo);

  const starGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(1600 * 3);
  for (let i = 0; i < 1600; i++) {
    const r = 3.4 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xffd479, size: 0.035, transparent: true, opacity: 0.8 }),
  );
  scene.add(stars);

  scene.add(new THREE.AmbientLight(0x6a5a9a, 1.2));
  const key = new THREE.DirectionalLight(0xfff0dd, 2.2);
  key.position.set(4, 5, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0xff5fa2, 60, 20);
  rim.position.set(-4, -2, 3);
  scene.add(rim);
  const rim2 = new THREE.PointLight(0x61f4c0, 30, 20);
  rim2.position.set(3, -4, -2);
  scene.add(rim2);

  let dragging = false;
  let lastX = 0, lastY = 0;
  let velX = 0.0024, velY = 0.0012;
  let rotX = 0.2, rotY = 0.4;
  let raf = 0;
  let visible = true;
  let destroyed = false;

  function onDown(e) {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    renderer.domElement.setPointerCapture?.(e.pointerId);
  }
  function onMove(e) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    velX = dy * 0.0006;
    velY = dx * 0.0009;
    rotX += velX;
    rotY += velY;
  }
  function onUp() { dragging = false; }
  renderer.domElement.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);

  const ro = new ResizeObserver(() => {
    const w = stage.clientWidth || 480;
    const h = stage.clientHeight || 320;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  ro.observe(stage);

  function frame(now) {
    if (destroyed) return;
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    if (!dragging) {
      velX *= 0.985;
      velY *= 0.985;
      const base = api.reducedMotion ? 0 : 0.0022;
      rotX += velX + base * 0.2;
      rotY += velY + base;
      group.rotation.x = rotX;
      group.rotation.y = rotY;
    } else {
      group.rotation.x = rotX;
      group.rotation.y = rotY;
    }
    stars.rotation.y = now * 0.00003;
    stars.rotation.x = Math.sin(now * 0.00002) * 0.1;
    halo.rotation.x = -rotX * 0.6;
    halo.rotation.y = -rotY * 0.6;
    renderer.render(scene, camera);
    readout.textContent = `rotação x ${rotX.toFixed(2)} rad · y ${rotY.toFixed(2)} rad · arraste para mudar`;
  }
  raf = requestAnimationFrame(frame);

  return () => {
    destroyed = true;
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    geo.dispose();
    mat.dispose();
    edges.geometry.dispose();
    edges.material.dispose();
    halo.geometry.dispose();
    halo.material.dispose();
    starGeo.dispose();
    stars.material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
