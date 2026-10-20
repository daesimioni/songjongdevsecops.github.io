// Ligações: um visualizador 3D de moléculas com Three.js.

const THREE_CDN = "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";

const ATOM = {
  H: { color: 0xe8e4ff, radius: 0.20 },
  O: { color: 0xff6b6b, radius: 0.32 },
  C: { color: 0x5a6280, radius: 0.34 },
  N: { color: 0x6bd5ff, radius: 0.31 },
};

const MOLECULES = {
  water: {
    label: "água · H₂O",
    atoms: [["O", 0, 0, 0], ["H", 0.76, 0.59, 0], ["H", -0.76, 0.59, 0]],
    bonds: [[0, 1], [0, 2]],
    info: "Covalente polar. O oxigênio puxa os elétrons, a molécula fica curvada (≈104,5°) e as pontes de hidrogênio fazem o resto.",
  },
  co2: {
    label: "gás carbônico · CO₂",
    atoms: [["C", 0, 0, 0], ["O", 1.16, 0, 0], ["O", -1.16, 0, 0]],
    bonds: [[0, 1], [0, 2]],
    info: "Duas ligações duplas, geometria linear. Os dipolos se cancelam, então a molécula é apolar, apesar das ligações polares.",
  },
  methane: {
    label: "metano · CH₄",
    atoms: [
      ["C", 0, 0, 0],
      ["H", 0.63, 0.63, 0.63], ["H", -0.63, -0.63, 0.63],
      ["H", -0.63, 0.63, -0.63], ["H", 0.63, -0.63, -0.63],
    ],
    bonds: [[0, 1], [0, 2], [0, 3], [0, 4]],
    info: "Quatro ligações simples, tetraedro perfeito (109,5°). Apolar, porque os quatro hidrogênios se equilibram.",
  },
  ammonia: {
    label: "amônia · NH₃",
    atoms: [
      ["N", 0, 0, 0],
      ["H", 0.94, 0.33, 0], ["H", -0.47, 0.33, 0.81], ["H", -0.47, 0.33, -0.81],
    ],
    bonds: [[0, 1], [0, 2], [0, 3]],
    info: "Três ligações simples e um par de elétrons sobrando no nitrogênio. A forma é piramidal e a molécula é polar.",
  },
};

export async function mount(el, api) {
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">oficina das ligações</span>
        <span class="widget-hint">arraste para girar</span>
      </div>
      <div class="w-tabs" id="mol-tabs"></div>
      <div class="three-wrap" id="mol-stage" style="height:300px"></div>
      <p class="mol-info" id="mol-info"></p>
      <div class="mol-legend">
        <span><i style="background:#e8e4ff"></i>H</span>
        <span><i style="background:#ff6b6b"></i>O</span>
        <span><i style="background:#5a6280"></i>C</span>
        <span><i style="background:#6bd5ff"></i>N</span>
      </div>
      <p class="widget-note">A forma não é enfeite: é o encaixe. Uma enzima reconhece outra molécula pelo desenho tridimensional, não pela fórmula. A ligação química é o que segura esse desenho no lugar.</p>
    </div>
  `;
  const stage = el.querySelector("#mol-stage");
  const info = el.querySelector("#mol-info");
  const tabs = el.querySelector("#mol-tabs");
  // Sem 3D o instrumento continua útil: as abas e a explicação de cada
  // molécula não dependem de WebGL, só o desenho depende.
  function showFallback(reason) {
    stage.hidden = true;
    const hint = el.querySelector(".widget-hint");
    if (hint) hint.textContent = "toque nas abas";
    const note = document.createElement("p");
    note.className = "widget-note";
    note.style.padding = "0 0 10px";
    note.textContent = `${reason} As abas continuam contando a história de cada molécula.`;
    info.before(note);
    Object.entries(MOLECULES).forEach(([key, m], i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "w-tab";
      b.dataset.mol = key;
      b.textContent = m.label;
      b.setAttribute("aria-selected", String(i === 0));
      b.addEventListener("click", () => {
        info.textContent = m.info;
        for (const other of tabs.querySelectorAll("button")) {
          other.setAttribute("aria-selected", String(other === b));
        }
        api.audio.blip();
      });
      tabs.appendChild(b);
    });
    info.textContent = MOLECULES.water.info;
  }

  let THREE;
  try {
    THREE = await import(THREE_CDN);
  } catch (e) {
    showFallback("O visualizador 3D não carregou agora.");
    return () => {};
  }
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    showFallback("Seu navegador não abriu o contexto WebGL.");
    return () => {};
  }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(stage.clientWidth || 480, stage.clientHeight || 300);
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070f, 0.08);
  const camera = new THREE.PerspectiveCamera(42, (stage.clientWidth || 480) / (stage.clientHeight || 300), 0.1, 100);
  camera.position.set(0, 0.15, 4.6);
  scene.add(new THREE.AmbientLight(0x8a7fb8, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0x6bd5ff, 40, 20);
  rim.position.set(-4, -2, 2);
  scene.add(rim);

  const stars = new THREE.Points(
    new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(
      Float32Array.from({ length: 900 }, () => (Math.random() - 0.5) * 9), 3)),
    new THREE.PointsMaterial({ color: 0xb48cff, size: 0.02, transparent: true, opacity: 0.6 }),
  );
  scene.add(stars);

  const group = new THREE.Group();
  scene.add(group);
  let current = null;
  let rotX = 0.12, rotY = 0.4, velX = 0, velY = 0.0016;
  let dragging = false, lastX = 0, lastY = 0;
  let raf = 0;

  function clearGroup() {
    while (group.children.length) {
      const c = group.children.pop();
      c.geometry?.dispose();
      c.material?.dispose();
    }
  }

  function build(key) {
    clearGroup();
    const m = MOLECULES[key];
    if (!m) return;
    const pos = m.atoms.map(([sym, x, y, z]) => {
      const a = ATOM[sym];
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(a.radius, 26, 18),
        new THREE.MeshStandardMaterial({ color: a.color, roughness: 0.35, metalness: 0.15, emissive: new THREE.Color(a.color).multiplyScalar(0.08) }),
      );
      mesh.position.set(x, y, z);
      group.add(mesh);
      return mesh.position;
    });
    for (const [i, j] of m.bonds) {
      const a = pos[i], b = pos[j];
      const dir = new THREE.Vector3().subVectors(b, a);
      const len = dir.length();
      const geo = new THREE.CylinderGeometry(0.055, 0.055, len, 12);
      const bond = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xb8b0d8, roughness: 0.5, metalness: 0.2 }));
      bond.position.copy(a).add(b).multiplyScalar(0.5);
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      group.add(bond);
    }
    current = key;
    info.textContent = m.info;
    for (const b of tabs.querySelectorAll("button")) b.setAttribute("aria-selected", String(b.dataset.mol === key));
  }

  Object.entries(MOLECULES).forEach(([key, m]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "w-tab";
    b.dataset.mol = key;
    b.textContent = m.label;
    b.addEventListener("click", () => { build(key); api.audio.blip(); });
    tabs.appendChild(b);
  });

  function down(e) { dragging = true; lastX = e.clientX; lastY = e.clientY; renderer.domElement.setPointerCapture?.(e.pointerId); }
  function move(e) {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    velX = dy * 0.0007;
    velY = dx * 0.001;
    rotX += velX; rotY += velY;
  }
  function up() { dragging = false; }
  renderer.domElement.addEventListener("pointerdown", down);
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
  const ro = new ResizeObserver(() => {
    const w = stage.clientWidth || 480, h = stage.clientHeight || 300;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  ro.observe(stage);

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!dragging) {
      velX *= 0.98; velY *= 0.985;
      rotX += velX; rotY += velY + 0.0018;
    }
    group.rotation.x = rotX;
    group.rotation.y = rotY;
    stars.rotation.y = now * 0.00003;
    renderer.render(scene, camera);
  }
  build("water");
  raf = requestAnimationFrame(frame);
  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    clearGroup();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
