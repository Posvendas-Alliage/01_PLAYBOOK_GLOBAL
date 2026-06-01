const GLOBE_REGIONS = [
    { id: 'Brasil',    lat: -14.2, lon:  -51.9, label: 'Brasil' },
    { id: 'Argentina', lat: -38.4, lon:  -63.6, label: 'Argentina' },
    { id: 'México',    lat:  23.6, lon: -102.5, label: 'México' },
    { id: 'LATAM',     lat:  -4.0, lon:  -55.0, label: 'LATAM' },
    { id: 'USA',       lat:  37.1, lon:  -95.7, label: 'Estados Unidos' },
    { id: 'ROW',       lat:  51.5, lon:    0.0, label: 'ROW' }
];

const PIN_COLOR_MAP = {
    green: 0x12DF34,
    yellow: 0xE4BF14,
    red: 0xE31424,
    gray: 0x7d8590
};

function getGlobeRegionMetrics(regionData, regionId) {
    if (!regionData) return null;
    const aliases = {
        'M\u00c3\u00a9xico': 'M\u00e9xico',
        'M\u00e9xico': 'M\u00e9xico'
    };
    return regionData[regionId] || regionData[aliases[regionId]] || null;
}

function formatGlobeNumber(value, digits, suffix) {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return Number(value).toLocaleString('pt-BR', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    }) + (suffix || '');
}

function latLonToXYZ(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return {
        x: -(radius * Math.sin(phi) * Math.cos(theta)),
        y:   radius * Math.cos(phi),
        z:   radius * Math.sin(phi) * Math.sin(theta)
    };
}

function initGlobe(containerId, regionData) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    if (typeof THREE === 'undefined') return null;

    const W = container.clientWidth || 600;
    const H = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const globeGeo = new THREE.SphereGeometry(1, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({
        color: 0x1a3a6a,
        specular: 0x4488ff,
        shininess: 15,
        transparent: true,
        opacity: 0.95
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    const atmGeo = new THREE.SphereGeometry(1.02, 64, 64);
    const atmMat = new THREE.MeshPhongMaterial({
        color: 0x0044aa,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide
    });
    scene.add(new THREE.Mesh(atmGeo, atmMat));

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    const pins = [];

    GLOBE_REGIONS.forEach(reg => {
        const metrics = getGlobeRegionMetrics(regionData, reg.id);
        const color = metrics ? PIN_COLOR_MAP[metrics.slaColor] : PIN_COLOR_MAP.gray;
        const pos = latLonToXYZ(reg.lat, reg.lon, 1.02);

        const pinGeo = new THREE.SphereGeometry(0.025, 16, 16);
        const pinMat = new THREE.MeshPhongMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.6
        });
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.position.set(pos.x, pos.y, pos.z);
        pin.userData = { region: reg, metrics };
        globe.add(pin);
        pins.push(pin);
    });

    const tooltip = document.createElement('div');
    tooltip.className = 'globe-tooltip';
    tooltip.style.cssText = [
        'position:absolute', 'display:none', 'pointer-events:none',
        'background:rgba(22,27,34,0.95)', 'border:1px solid #30363d',
        'border-radius:10px', 'padding:12px 16px', 'color:#e6edf3',
        "font-family:'DM Sans',sans-serif", 'font-size:13px',
        'backdrop-filter:blur(8px)', 'min-width:180px',
        'box-shadow:0 8px 32px rgba(0,0,0,0.4)', 'z-index:5'
    ].join(';');
    container.style.position = 'relative';
    container.appendChild(tooltip);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    container.addEventListener('mousemove', e => {
        const rect = container.getBoundingClientRect();
        mouse.x =  ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(pins);

        if (hits.length > 0) {
            const { region, metrics } = hits[0].object.userData;
            const c = metrics ? metrics.slaColor : 'gray';
            const hex = { green: '#12DF34', yellow: '#E4BF14', red: '#E31424', gray: '#7d8590' }[c];
            tooltip.innerHTML = `
                <div style="font-weight:700;font-size:15px;margin-bottom:8px">${region.label}</div>
                <div style="display:flex;justify-content:space-between;gap:16px;margin-bottom:4px">
                    <span style="color:#7d8590">SLA</span>
                    <span style="color:${hex};font-weight:700">
                        ${metrics ? formatGlobeNumber(metrics.slaCompliance, 2, '%') : 'N/A'}
                    </span>
                </div>
                <div style="display:flex;justify-content:space-between;gap:16px;margin-bottom:4px">
                    <span style="color:#7d8590">MTTS</span>
                    <span>${metrics ? formatGlobeNumber(metrics.avgMtts, 2, ' dias') : 'N/A'}</span>
                </div>
                <div style="display:flex;justify-content:space-between;gap:16px;margin-bottom:4px">
                    <span style="color:#7d8590">MTFC</span>
                    <span>${metrics ? formatGlobeNumber(metrics.avgMtfc, 2, ' h') : 'N/A'}</span>
                </div>
                <div style="display:flex;justify-content:space-between;gap:16px">
                    <span style="color:#7d8590">Tickets</span>
                    <span>${metrics ? formatGlobeNumber(metrics.total, 0, '') : 'N/A'}</span>
                </div>
            `;
            tooltip.style.display = 'block';
            tooltip.style.left = (e.clientX - rect.left + 16) + 'px';
            tooltip.style.top  = (e.clientY - rect.top  - 20) + 'px';
            container.style.cursor = 'pointer';
        } else {
            tooltip.style.display = 'none';
            container.style.cursor = 'grab';
        }
    });

    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let autoRotate = true;

    container.addEventListener('mousedown', e => {
        isDragging = true;
        autoRotate = false;
        prevX = e.clientX;
        prevY = e.clientY;
    });
    window.addEventListener('mouseup', () => {
        isDragging = false;
        setTimeout(() => { autoRotate = true; }, 2000);
    });
    container.addEventListener('mousemove', e => {
        if (!isDragging) return;
        globe.rotation.y += (e.clientX - prevX) * 0.005;
        globe.rotation.x += (e.clientY - prevY) * 0.005;
        prevX = e.clientX;
        prevY = e.clientY;
    });

    window.addEventListener('resize', () => {
        const nW = container.clientWidth;
        const nH = container.clientHeight;
        if (!nW || !nH) return;
        camera.aspect = nW / nH;
        camera.updateProjectionMatrix();
        renderer.setSize(nW, nH);
    });

    function animate() {
        requestAnimationFrame(animate);
        if (autoRotate) globe.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    animate();

    return { scene, globe, pins, renderer };
}

function updateGlobePins(globeInstance, regionData) {
    if (!globeInstance) return;
    globeInstance.pins.forEach(pin => {
        const metrics = getGlobeRegionMetrics(regionData, pin.userData.region.id);
        const color = metrics ? PIN_COLOR_MAP[metrics.slaColor] : PIN_COLOR_MAP.gray;
        pin.material.color.setHex(color);
        pin.material.emissive.setHex(color);
        pin.userData.metrics = metrics;
    });
}
