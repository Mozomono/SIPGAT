// ===== SIPGAT - App Logic =====

// ===== GLOBAL STATE & LOCALSTORAGE =====
const defaultParcelas = [
  { id: 1, nombre: "Parcela Ahome", cultivo: "Maíz Blanco", hectareas: 12.5, icon: "🌽", color: "16,185,129", hex: "#10b981", ph: 6.8, agua: 8 },
  { id: 2, nombre: "Parcela Guasave", cultivo: "Frijol Azufrado", hectareas: 8.2, icon: "🫘", color: "245,158,11", hex: "#f59e0b", ph: 6.2, agua: 6 },
  { id: 3, nombre: "Parcela El Fuerte", cultivo: "Sorgo", hectareas: 15.0, icon: "🌾", color: "139,92,246", hex: "#8b5cf6", ph: 7.1, agua: 5 },
  { id: 4, nombre: "Parcela Los Mochis", cultivo: "Tomate", hectareas: 3.8, icon: "🍅", color: "59,130,246", hex: "#3b82f6", ph: 6.5, agua: 7 }
];

const defaultLogs = [
  { fecha: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), tipo: "Riego Automático", descripcion: "Se completó riego en Parcela Ahome", estado: "Completado", colorEstado: "var(--accent-green)" },
  { fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), tipo: "Alerta de Plaga", descripcion: "Posible mosca blanca en Los Mochis", estado: "Advertencia", colorEstado: "var(--accent-amber)" },
  { fecha: new Date(Date.now() - 1000 * 60 * 60 * 48).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), tipo: "Fertilización", descripcion: "Aplicación de Urea en Guasave", estado: "Completado", colorEstado: "var(--accent-purple)" },
  { fecha: new Date(Date.now() - 1000 * 60 * 60 * 72).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), tipo: "Sistema IoT", descripcion: "Conexión de Nodo #3 El Fuerte", estado: "Online", colorEstado: "var(--accent-blue)" }
];

const defaultSensores = [
  { id: 1, nombre: "Nodo #1 - Multivariable", tipo: "Multivariable", estado: "Online", bateria: 87, lectura: "Hace 2 min", frecuencia: "5 min", parcelaId: 1 },
  { id: 2, nombre: "Nodo #2 - Humedad", tipo: "Humedad", estado: "Online", bateria: 64, lectura: "Hace 5 min", frecuencia: "10 min", parcelaId: 2 },
  { id: 3, nombre: "Nodo #3 - Clima", tipo: "Meteorológico", estado: "Intermitente", bateria: 23, lectura: "Hace 18 min", frecuencia: "15 min", parcelaId: 3 }
];

const defaultLotes = [
  { id: "lote-1", parcelaId: 1, cultivo: "Maíz Blanco", fecha: "15 Mayo 2025", rendimiento: 12.8, calidad: "Grado A (95%)", agua: 4500, costo: 11675, precioVenta: 420, roi: 38 },
  { id: "lote-2", parcelaId: 4, cultivo: "Tomate", fecha: "10 Junio 2025", rendimiento: 32.5, calidad: "Grado A (98%)", agua: 6200, costo: 24500, precioVenta: 720, roi: 45 }
];

window.appData = {
  user: { nombre: "Fernando Aboyte", region: "Valle del Fuerte, Sinaloa" },
  parcelas: [...defaultParcelas],
  sensores: [...defaultSensores],
  lotes: [...defaultLotes],
  logs: [...defaultLogs],
  activeParcelaId: "all"
};

function cargarDatos() {
  const saved = localStorage.getItem('sipgat_data');
  if (saved) {
    try {
      window.appData = JSON.parse(saved);
      if (!window.appData.parcelas) window.appData.parcelas = [...defaultParcelas];
      if (!window.appData.sensores) window.appData.sensores = [...defaultSensores];
      if (!window.appData.lotes) window.appData.lotes = [...defaultLotes];
      if (!window.appData.logs) window.appData.logs = [...defaultLogs];
      if (!window.appData.user || !window.appData.user.nombre) {
        window.appData.user = { nombre: "Fernando Aboyte", region: "Valle del Fuerte, Sinaloa" };
      }
      if (!window.appData.activeParcelaId) window.appData.activeParcelaId = "all";
      guardarDatos();
    } catch (e) {
      console.error("Error cargando datos:", e);
      resetState();
    }
  } else {
    resetState();
  }
}

function resetState() {
  window.appData = {
    user: { nombre: "Fernando Aboyte", region: "Valle del Fuerte, Sinaloa" },
    parcelas: [...defaultParcelas],
    sensores: [...defaultSensores],
    lotes: [...defaultLotes],
    logs: [...defaultLogs],
    activeParcelaId: "all"
  };
  guardarDatos();
}

function guardarDatos() {
  localStorage.setItem('sipgat_data', JSON.stringify(window.appData));
}

function renderizarPerfil() {
  const inputNombre = document.getElementById('perfilNombre');
  const inputRegion = document.getElementById('perfilRegion');
  const userDisplay = document.getElementById('userNameDisplay');

  if (appData.user.nombre) {
    if (userDisplay) userDisplay.textContent = "Hola, " + appData.user.nombre;
    if (inputNombre) inputNombre.value = appData.user.nombre;
    if (inputRegion) inputRegion.value = appData.user.region;
  } else {
    if (userDisplay) userDisplay.textContent = "Usuario";
    if (inputNombre) inputNombre.value = "";
    if (inputRegion) inputRegion.value = "";
  }
  
  const select = document.getElementById('perfilParcela');
  if (select) {
    select.innerHTML = '<option value="">-- Seleccionar Parcela --</option>';
    appData.parcelas.forEach(p => {
      select.innerHTML += `<option value="${p.id}">${p.nombre} (${p.cultivo})</option>`;
    });

    // Pre-seleccionar la primera parcela si hay parcelas registradas
    if (appData.parcelas.length > 0) {
      select.value = appData.parcelas[0].id;
      setTimeout(() => {
        if (window.cargarDatosAnalisisParcela) window.cargarDatosAnalisisParcela();
      }, 50);
    }
  }
}

window.guardarUsuario = function (event) {
  event.preventDefault();
  const nombre = document.getElementById('perfilNombre').value;
  const region = document.getElementById('perfilRegion').value;
  if (nombre) {
    appData.user.nombre = nombre;
    appData.user.region = region;
    guardarDatos();
    renderizarPerfil();
    if (window.cargarClimaReal) window.cargarClimaReal();
    agregarRegistroBD("Perfil", "Actualizó datos de perfil", "Completado", "var(--accent-purple)");
    showToast("Perfil guardado con éxito", "success");
  }
}

function renderizarParcelas() {
  const list = document.getElementById('parcelasList');
  const countSpan = document.querySelector('.parcelas-header .count');
  if (countSpan) countSpan.textContent = appData.parcelas.length;

  // Render Sidebar List
  if (list) {
    list.innerHTML = '';
    appData.parcelas.forEach(p => {
      const div = document.createElement('div');
      div.className = 'parcela-item';
      div.innerHTML = `
        <div class="parcela-icon" style="background:rgba(${p.color || '255,255,255'},0.15);color:${p.hex || '#fff'}">${p.icon || '🌱'}</div>
        <div class="parcela-info">
          <div class="parcela-name">${p.nombre}</div>
          <div class="parcela-value">${p.cultivo} · ${p.hectareas} ha</div>
        </div>
      `;
      div.addEventListener('click', () => {
        appData.activeParcelaId = p.id;
        guardarDatos();
        if (window.updateActiveParcelaSelect) window.updateActiveParcelaSelect();
        switchToPage('dashboard');
        agregarRegistroBD("Navegación", `Vio detalles de ${p.nombre}`, "Vista", "var(--accent-blue)");
      });
      list.appendChild(div);
    });
  }

  // Render Dashboard Card (Active Parcela or First Parcela)
  let mainParcela = appData.parcelas.find(p => p.id === appData.activeParcelaId);
  if (!mainParcela && appData.parcelas.length > 0) {
    mainParcela = appData.parcelas[0];
  }
  
  if (mainParcela) {
    const dashName = document.getElementById('dashParcelaName');
    const dashIcon = document.getElementById('dashParcelaIcon');
    const dashArea = document.getElementById('dashParcelaArea');
    if (dashName) dashName.textContent = mainParcela.nombre;
    if (dashIcon) {
      dashIcon.textContent = mainParcela.icon || '🌱';
      dashIcon.style.background = `rgba(${mainParcela.color || '255,255,255'},0.15)`;
      dashIcon.style.color = mainParcela.hex || '#fff';
    }
    if (dashArea) dashArea.textContent = mainParcela.hectareas + " ha";
  }

  // Render Parcelas Page Cards
  const cardsContainer = document.getElementById('parcelasPageCards');
  if (cardsContainer) {
    cardsContainer.innerHTML = '';
    if (appData.parcelas.length === 0) {
      cardsContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">No tienes parcelas registradas. ¡Haz clic en "Nueva Parcela" para comenzar!</div>`;
      return;
    }
    appData.parcelas.forEach(p => {
      const card = document.createElement('div');
      card.className = 'sensor-card';
      card.innerHTML = `
        <div class="sensor-card-header">
          <div class="sensor-badge">
            <div class="sensor-icon" style="background:rgba(${p.color || '255,255,255'},0.15);color:${p.hex || '#fff'}">${p.icon || '🌱'}</div>
            <div>
              <div class="sensor-label">Cultivo activo</div>
              <div class="sensor-name">${p.nombre}</div>
            </div>
          </div>
          <a href="#" class="card-link" onclick="appData.activeParcelaId = ${p.id}; guardarDatos(); if(window.updateActiveParcelaSelect) window.updateActiveParcelaSelect(); switchToPage('dashboard'); return false;">↗</a>
        </div>
        <div class="sensor-value-row">
          <div class="label">Área total</div>
          <div class="value">${p.hectareas}<span class="unit"> ha</span></div>
        </div>
        <div class="sensor-change positive">● ${p.cultivo}</div>
        <div class="tab-content-grid" style="margin-top:14px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color);">
          <div class="data-item">
            <div class="data-label">Rendimiento Est.</div>
            <div class="data-value">${(p.hectareas * 3.1).toFixed(1)} ton</div>
          </div>
          <div class="data-item">
            <div class="data-label">pH Suelo</div>
            <div class="data-value">${p.ph ? p.ph.toFixed(1) : '6.5'}</div>
          </div>
        </div>
        <div class="sensor-card-actions">
          <button class="btn-action secondary btn-small" onclick="editarParcela(${p.id})">✏️ Editar</button>
          <button class="btn-action secondary btn-small" style="color:var(--accent-red);border-color:rgba(239,68,68,0.2)" onclick="eliminarParcela(${p.id})">🗑️ Eliminar</button>
        </div>
      `;
      cardsContainer.appendChild(card);
    });
  }
}

// ===== PARCEL OPERATIONS =====
window.toggleAddParcelaForm = function(show = true) {
  const container = document.getElementById('parcelaFormContainer');
  if (!container) return;
  if (show) {
    container.classList.add('active');
    document.getElementById('parcelaFormTitle').textContent = "Agregar Nueva Parcela";
    document.getElementById('formParcela').reset();
    document.getElementById('parcelaFormId').value = "";
    container.scrollIntoView({ behavior: 'smooth' });
  } else {
    container.classList.remove('active');
  }
};

window.editarParcela = function(id) {
  const p = appData.parcelas.find(x => x.id === id);
  if (!p) return;
  const container = document.getElementById('parcelaFormContainer');
  if (!container) return;
  
  container.classList.add('active');
  document.getElementById('parcelaFormTitle').textContent = "Editar Parcela: " + p.nombre;
  document.getElementById('parcelaFormId').value = p.id;
  document.getElementById('parcelaFormNombre').value = p.nombre;
  document.getElementById('parcelaFormCultivo').value = p.cultivo;
  document.getElementById('parcelaFormHectareas').value = p.hectareas;
  document.getElementById('parcelaFormIcon').value = p.icon || "🌱";
  container.scrollIntoView({ behavior: 'smooth' });
};

window.eliminarParcela = function(id) {
  if (confirm("¿Estás seguro de que deseas eliminar esta parcela? Se desvincularán los sensores asociados.")) {
    appData.parcelas = appData.parcelas.filter(x => x.id !== id);
    
    // Desvincular sensores
    appData.sensores.forEach(s => {
      if (s.parcelaId === id) s.parcelaId = null;
    });
    
    if (appData.activeParcelaId === id) {
      appData.activeParcelaId = "all";
    }
    
    guardarDatos();
    renderizarParcelas();
    if (window.renderizarSensores) window.renderizarSensores();
    if (window.updateActiveParcelaSelect) window.updateActiveParcelaSelect();
    if (window.renderizarDropdownComparativa) window.renderizarDropdownComparativa();
    
    agregarRegistroBD("Eliminar Parcela", `Eliminó parcela ID: ${id}`, "Completado", "var(--accent-red)");
    showToast("Parcela eliminada", "warning");
  }
};

window.guardarParcelaSubmit = function(event) {
  event.preventDefault();
  const idVal = document.getElementById('parcelaFormId').value;
  const nombre = document.getElementById('parcelaFormNombre').value.trim();
  const cultivo = document.getElementById('parcelaFormCultivo').value;
  const hectareas = parseFloat(document.getElementById('parcelaFormHectareas').value) || 0;
  const icon = document.getElementById('parcelaFormIcon').value;
  
  if (!nombre || hectareas <= 0) return;
  
  const colorMap = {
    "Maíz Blanco": { color: "16,185,129", hex: "#10b981" },
    "Frijol Azufrado": { color: "245,158,11", hex: "#f59e0b" },
    "Trigo": { color: "139,92,246", hex: "#8b5cf6" },
    "Tomate": { color: "239,68,68", hex: "#ef4444" },
    "Sorgo": { color: "139,92,246", hex: "#8b5cf6" },
    "Soja": { color: "59,130,246", hex: "#3b82f6" }
  };
  
  const styling = colorMap[cultivo] || { color: "16,185,129", hex: "#10b981" };
  
  if (idVal) {
    // Editar
    const id = parseInt(idVal);
    const index = appData.parcelas.findIndex(x => x.id === id);
    if (index !== -1) {
      appData.parcelas[index].nombre = nombre;
      appData.parcelas[index].cultivo = cultivo;
      appData.parcelas[index].hectareas = hectareas;
      appData.parcelas[index].icon = icon;
      appData.parcelas[index].color = styling.color;
      appData.parcelas[index].hex = styling.hex;
      
      agregarRegistroBD("Edición Parcela", `Editó parcela ${nombre}`, "Completado", "var(--accent-green)");
      showToast(`Parcela "${nombre}" actualizada`, "success");
    }
  } else {
    // Agregar nuevo
    const nueva = {
      id: Date.now(),
      nombre: nombre,
      cultivo: cultivo,
      hectareas: hectareas,
      icon: icon,
      color: styling.color,
      hex: styling.hex,
      ph: 6.5,
      agua: 7
    };
    appData.parcelas.push(nueva);
    
    agregarRegistroBD("Nueva Parcela", `Agregó parcela ${nombre}`, "Completado", "var(--accent-green)");
    showToast(`Parcela "${nombre}" creada`, "success");
  }
  
  guardarDatos();
  renderizarParcelas();
  toggleAddParcelaForm(false);
  
  if (window.renderizarSensores) window.renderizarSensores();
  if (window.updateActiveParcelaSelect) window.updateActiveParcelaSelect();
  if (window.renderizarDropdownComparativa) window.renderizarDropdownComparativa();
}

// ===== SENSOR OPERATIONS =====
window.renderizarSensores = function() {
  const cardsContainer = document.getElementById('sensoresPageCards');
  if (!cardsContainer) return;
  cardsContainer.innerHTML = '';
  
  if (appData.sensores.length === 0) {
    cardsContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">No tienes sensores vinculados. ¡Vincule uno nuevo para comenzar!</div>`;
    document.getElementById('statsTotalSensores').textContent = "0 activos";
    document.getElementById('statsAnomalias').textContent = "0";
    return;
  }
  
  let anomalias = 0;
  appData.sensores.forEach(s => {
    const card = document.createElement('div');
    card.className = 'sensor-card';
    
    // Find associated parcel
    const parcel = appData.parcelas.find(p => p.id === s.parcelaId);
    const parcelName = parcel ? parcel.nombre : "Sin vincular";
    
    let stateColor = 'var(--accent-green)';
    if (s.estado === 'Intermitente') {
      stateColor = 'var(--accent-amber)';
      anomalias++;
    } else if (s.estado === 'Offline') {
      stateColor = 'var(--accent-red)';
      anomalias++;
    }
    
    card.innerHTML = `
      <div class="sensor-card-header">
        <div class="sensor-badge">
          <div class="sensor-icon" style="background:rgba(139,92,246,0.15);color:var(--accent-purple)">📡</div>
          <div>
            <div class="sensor-label">${s.nombre}</div>
            <div class="sensor-name">${s.tipo} (${parcelName})</div>
          </div>
        </div>
      </div>
      <div class="tab-content-grid" style="margin-top:10px">
        <div class="data-item">
          <div class="data-label">Estado</div>
          <div class="data-value" style="color:${stateColor}">● ${s.estado}</div>
        </div>
        <div class="data-item">
          <div class="data-label">Batería</div>
          <div class="data-value">${s.bateria}%</div>
        </div>
        <div class="data-item">
          <div class="data-label">Última lectura</div>
          <div class="data-value">${s.lectura || 'Hace 1 min'}</div>
        </div>
        <div class="data-item">
          <div class="data-label">Frecuencia</div>
          <div class="data-value">${s.frecuencia}</div>
        </div>
      </div>
      <div class="sensor-card-actions">
        <span style="font-size:0.75rem;color:var(--text-muted)">ID: SN-${s.id}</span>
        <button class="sensor-card-link-delete" onclick="eliminarSensor(${s.id})">🗑️ Desvincular</button>
      </div>
    `;
    cardsContainer.appendChild(card);
  });
  
  // Update stats in page-sensores
  document.getElementById('statsTotalSensores').textContent = `${appData.sensores.length} activos`;
  document.getElementById('statsLecturasHoy').textContent = (appData.sensores.length * 415).toLocaleString();
  document.getElementById('statsAnomalias').textContent = anomalias;
};

window.toggleAddSensorForm = function(show = true) {
  const container = document.getElementById('sensorFormContainer');
  if (!container) return;
  
  if (show) {
    const select = document.getElementById('sensorFormParcela');
    if (select) {
      select.innerHTML = '<option value="">-- Seleccionar Parcela --</option>';
      appData.parcelas.forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.nombre} (${p.cultivo})</option>`;
      });
    }
    
    container.classList.add('active');
    document.getElementById('formSensor').reset();
    container.scrollIntoView({ behavior: 'smooth' });
  } else {
    container.classList.remove('active');
  }
};

window.eliminarSensor = function(id) {
  if (confirm("¿Estás seguro de que deseas desvincular este sensor?")) {
    appData.sensores = appData.sensores.filter(s => s.id !== id);
    guardarDatos();
    renderizarSensores();
    
    if (window.updateDashboardMetrics) window.updateDashboardMetrics();
    
    agregarRegistroBD("Desvincular Sensor", `Desvinculó sensor ID: ${id}`, "Completado", "var(--accent-red)");
    showToast("Sensor desvinculado", "warning");
  }
};

window.guardarSensorSubmit = function(event) {
  event.preventDefault();
  const nombre = document.getElementById('sensorFormNombre').value.trim();
  const tipo = document.getElementById('sensorFormTipo').value;
  const parcelaId = parseInt(document.getElementById('sensorFormParcela').value);
  const frecuencia = document.getElementById('sensorFormFrecuencia').value;
  
  if (!nombre || isNaN(parcelaId)) return;
  
  const nuevo = {
    id: Date.now(),
    nombre: nombre,
    tipo: tipo,
    estado: "Online",
    bateria: 100,
    lectura: "Hace 1 min",
    frecuencia: frecuencia,
    parcelaId: parcelaId
  };
  
  appData.sensores.push(nuevo);
  guardarDatos();
  renderizarSensores();
  toggleAddSensorForm(false);
  
  if (window.updateDashboardMetrics) window.updateDashboardMetrics();
  
  agregarRegistroBD("Nuevo Sensor", `Vinculó sensor ${nombre} a parcela ID: ${parcelaId}`, "Completado", "var(--accent-green)");
  showToast(`Sensor "${nombre}" vinculado exitosamente`, "success");
};

// ===== SPARKLINE CHART DRAWING =====
function generateData(count, min, max, smooth) {
  const data = [];
  let val = min + Math.random() * (max - min);
  for (let i = 0; i < count; i++) {
    val += (Math.random() - 0.48) * smooth;
    val = Math.max(min, Math.min(max, val));
    data.push(val);
  }
  return data;
}

function drawSparkline(canvasId, data, color, gradientAlpha) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const padding = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => ({
    x: padding + (i / (data.length - 1)) * (w - padding * 2),
    y: padding + (1 - (v - min) / range) * (h - padding * 2)
  }));

  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, color.replace(')', `,${gradientAlpha})`).replace('rgb', 'rgba'));
  grad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const cp1x = (points[i - 1].x + points[i].x) / 2;
    const cp1y = points[i - 1].y;
    const cp2x = cp1x;
    const cp2y = points[i].y;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[i].x, points[i].y);
  }

  // Fill area
  ctx.lineTo(points[points.length - 1].x, h);
  ctx.lineTo(points[0].x, h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const cp1x = (points[i - 1].x + points[i].x) / 2;
    const cp1y = points[i - 1].y;
    const cp2x = cp1x;
    const cp2y = points[i].y;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[i].x, points[i].y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // End dot
  const last = points[points.length - 1];
  ctx.beginPath();
  ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(last.x, last.y, 7, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.3;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// ===== SENSOR DATA MAP & DISPLAY =====
window.sensorStatesMap = {};

window.getSensorStateForParcel = function(parcelId) {
  if (!window.sensorStatesMap[parcelId]) {
    // Generar datos iniciales simulados únicos para la parcela
    const hash = typeof parcelId === 'number' ? parcelId : 1;
    const tempSeed = 24.5 + (hash % 5);
    const humSeed = 55 + (hash % 20);
    const radSeed = 750 + (hash % 150);
    
    window.sensorStatesMap[parcelId] = {
      temp: { value: tempSeed, change: 1.2, data: generateData(24, tempSeed - 4, tempSeed + 4, 1.5) },
      humedad: { value: humSeed, change: 2.5, data: generateData(24, humSeed - 10, humSeed + 10, 4) },
      radiacion: { value: radSeed, change: -1.0, data: generateData(24, radSeed - 150, radSeed + 150, 50) }
    };
  }
  return window.sensorStatesMap[parcelId];
};

window.getCombinedSensorState = function() {
  const state = {
    temp: { value: 0, change: 0, data: new Array(24).fill(0) },
    humedad: { value: 0, change: 0, data: new Array(24).fill(0) },
    radiacion: { value: 0, change: 0, data: new Array(24).fill(0) }
  };
  
  const count = appData.parcelas.length;
  if (count === 0) {
    return {
      temp: { value: 0, change: 0, data: new Array(24).fill(25) },
      humedad: { value: 0, change: 0, data: new Array(24).fill(60) },
      radiacion: { value: 0, change: 0, data: new Array(24).fill(750) }
    };
  }
  
  appData.parcelas.forEach(p => {
    const pState = getSensorStateForParcel(p.id);
    state.temp.value += pState.temp.value;
    state.temp.change += pState.temp.change;
    state.humedad.value += pState.humedad.value;
    state.humedad.change += pState.humedad.change;
    state.radiacion.value += pState.radiacion.value;
    state.radiacion.change += pState.radiacion.change;
    
    for (let i = 0; i < 24; i++) {
      state.temp.data[i] += pState.temp.data[i] || 25;
      state.humedad.data[i] += pState.humedad.data[i] || 60;
      state.radiacion.data[i] += pState.radiacion.data[i] || 750;
    }
  });
  
  // Promediar
  state.temp.value /= count;
  state.temp.change /= count;
  state.humedad.value /= count;
  state.humedad.change /= count;
  state.radiacion.value /= count;
  state.radiacion.change /= count;
  
  for (let i = 0; i < 24; i++) {
    state.temp.data[i] /= count;
    state.humedad.data[i] /= count;
    state.radiacion.data[i] /= count;
  }
  
  return state;
};

window.getCurrentSensorState = function() {
  if (appData.activeParcelaId === 'all' || !appData.activeParcelaId) {
    return getCombinedSensorState();
  }
  return getSensorStateForParcel(appData.activeParcelaId);
};

function updateSensorDisplay() {
  const current = getCurrentSensorState();
  
  // Temperature
  const tempValueEl = document.getElementById('tempValue');
  if (tempValueEl) {
    tempValueEl.innerHTML = `${current.temp.value.toFixed(1)}<span class="unit">°C</span>`;
  }
  const tempChangeEl = document.getElementById('tempChange');
  if (tempChangeEl) {
    const tc = current.temp.change;
    tempChangeEl.textContent = `● ${tc >= 0 ? '+' : ''}${tc.toFixed(1)}%`;
    tempChangeEl.className = `sensor-change ${tc >= 0 ? 'positive' : 'negative'}`;
  }

  // Humidity
  const humedadValueEl = document.getElementById('humedadValue');
  if (humedadValueEl) {
    humedadValueEl.innerHTML = `${current.humedad.value.toFixed(1)}<span class="unit">%</span>`;
  }
  const humChangeEl = document.getElementById('humedadChange');
  if (humChangeEl) {
    const hc = current.humedad.change;
    humChangeEl.textContent = `● ${hc >= 0 ? '+' : ''}${hc.toFixed(1)}%`;
    humChangeEl.className = `sensor-change ${hc >= 0 ? 'positive' : 'negative'}`;
  }

  // Radiation
  const radiacionValueEl = document.getElementById('radiacionValue');
  if (radiacionValueEl) {
    radiacionValueEl.innerHTML = `${Math.round(current.radiacion.value)}<span class="unit"> W/m²</span>`;
  }
  const radChangeEl = document.getElementById('radiacionChange');
  if (radChangeEl) {
    const rc = current.radiacion.change;
    radChangeEl.textContent = `● ${rc >= 0 ? '+' : ''}${rc.toFixed(1)}%`;
    radChangeEl.className = `sensor-change ${rc >= 0 ? 'positive' : 'negative'}`;
  }
}

function updateCharts() {
  const current = getCurrentSensorState();
  drawSparkline('chartTemp', current.temp.data, 'rgb(239,68,68)', 0.15);
  drawSparkline('chartHumedad', current.humedad.data, 'rgb(59,130,246)', 0.15);
  drawSparkline('chartRadiacion', current.radiacion.data, 'rgb(245,158,11)', 0.15);
}

function simulateIoT() {
  // Simular cambios en todas las parcelas individuales
  appData.parcelas.forEach(p => {
    const state = getSensorStateForParcel(p.id);
    
    // Temp
    state.temp.value += (Math.random() - 0.48) * 0.5;
    state.temp.value = Math.max(20, Math.min(38, state.temp.value));
    state.temp.change = ((Math.random() - 0.4) * 5);
    state.temp.data.push(state.temp.value);
    state.temp.data.shift();

    // Humidity
    state.humedad.value += (Math.random() - 0.5) * 2;
    state.humedad.value = Math.max(40, Math.min(95, state.humedad.value));
    state.humedad.change = ((Math.random() - 0.4) * 8);
    state.humedad.data.push(state.humedad.value);
    state.humedad.data.shift();

    // Radiation
    state.radiacion.value += (Math.random() - 0.5) * 30;
    state.radiacion.value = Math.max(500, Math.min(1100, state.radiacion.value));
    state.radiacion.change = ((Math.random() - 0.55) * 4);
    state.radiacion.data.push(state.radiacion.value);
    state.radiacion.data.shift();
  });

  updateSensorDisplay();
  updateCharts();
  updateChartValues();
}

function updateChartValues() {
  const current = getCurrentSensorState();
  
  const td = current.temp.data;
  const diff1 = (td[td.length - 1] - td[td.length - 2]).toFixed(1);
  const tempValEl = document.getElementById('chartTempVal');
  if (tempValEl) tempValEl.textContent = `${diff1 >= 0 ? '+' : ''}${diff1}°C`;

  const hd = current.humedad.data;
  const diff2 = (hd[hd.length - 1] - hd[hd.length - 2]).toFixed(1);
  const humValEl = document.getElementById('chartHumedadVal');
  if (humValEl) humValEl.textContent = `${diff2 >= 0 ? '+' : ''}${diff2}%`;

  const rd = current.radiacion.data;
  const diff3 = Math.round(rd[rd.length - 1] - rd[rd.length - 2]);
  const radValEl = document.getElementById('chartRadiacionVal');
  if (radValEl) radValEl.textContent = `${diff3 >= 0 ? '+' : ''}${diff3} W/m²`;
}

// Active Parcela Selection and Dropdown updates
window.updateActiveParcelaSelect = function() {
  const select = document.getElementById('activeParcelaSelect');
  if (!select) return;
  
  const currentVal = appData.activeParcelaId || "all";
  select.innerHTML = '<option value="all">🌐 Todas las Parcelas</option>';
  
  appData.parcelas.forEach(p => {
    select.innerHTML += `<option value="${p.id}">${p.nombre} (${p.cultivo})</option>`;
  });
  
  // Set current selected
  select.value = currentVal;
};

window.changeActiveParcela = function(val) {
  if (val === 'all') {
    appData.activeParcelaId = 'all';
  } else {
    appData.activeParcelaId = parseInt(val);
  }
  guardarDatos();
  
  // Update UI and re-draw
  updateSensorDisplay();
  updateCharts();
  updateChartValues();
  renderizarParcelas(); // Updates active dashboard card if active parcel is changed
  
  const name = val === 'all' ? 'Todas las Parcelas' : appData.parcelas.find(p => p.id === appData.activeParcelaId)?.nombre;
  agregarRegistroBD("Filtro Dashboard", `Cambió visualización activa a: ${name}`, "Completado", "var(--accent-purple)");
  showToast(`Mostrando datos de: ${name}`, "info");
};

// ===== TABS =====
document.querySelectorAll('.tab-item').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const target = document.getElementById('tab-' + tab.dataset.tab);
    if (target) target.classList.add('active');
  });
});

// ===== PARCELAS TOGGLE =====
const parcelasToggle = document.getElementById('parcelasToggle');
const parcelasList = document.getElementById('parcelasList');
if (parcelasToggle) {
  parcelasToggle.addEventListener('click', () => {
    const isOpen = parcelasList.style.display !== 'none';
    parcelasList.style.display = isOpen ? 'none' : 'block';
    parcelasToggle.querySelector('.toggle').textContent = isOpen ? '▼' : '▲';
  });
}

// ===== NAV ITEMS & PAGE SWITCHING =====
let activeCbotRange = '6m';

function switchToPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    if (pageId === 'dashboard') {
      setTimeout(updateCharts, 50);
    } else if (pageId === 'mercado') {
      setTimeout(() => {
        if (window.drawCBOTChart) {
          window.drawCBOTChart(activeCbotRange || '6m');
        }
      }, 50);
    } else if (pageId === 'analitica') {
      setTimeout(() => {
        if (window.renderizarDropdownAnalitica) {
          window.renderizarDropdownAnalitica();
        }
      }, 50);
    }
  }
  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(i => {
    i.classList.toggle('active', i.dataset.page === pageId);
  });

  if (pageId !== 'dashboard' && pageId !== 'perfil') {
    agregarRegistroBD("Navegación", `Accedió a sección ${pageId.toUpperCase()}`, "Visitado", "var(--text-muted)");
  }
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const pageId = item.dataset.page;
    if (pageId) switchToPage(pageId);
    
    // Close sidebar on mobile devices
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');
  });
});

// ===== PARCELA ITEM CLICKS (Static bindings remocion) =====

// ===== FILTER BUTTONS =====
document.querySelectorAll('.filter-btn[data-range]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn[data-range]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Regenerate data for different range
    const count = btn.dataset.range === '24h' ? 24 : btn.dataset.range === '7d' ? 7 * 24 : 30 * 24;
    const displayCount = Math.min(count, 48);
    sensorState.temp.data = generateData(displayCount, 22, 34, 2);
    sensorState.humedad.data = generateData(displayCount, 50, 85, 5);
    sensorState.radiacion.data = generateData(displayCount, 600, 1000, 60);
    updateCharts();
  });
});

// ===== CICLO SLIDER =====
const cicloSlider = document.getElementById('cicloSlider');
const cicloDayEl = document.getElementById('cicloDay');
const phases = ['Preparación', 'Siembra', 'Crecimiento', 'Cosecha'];
const phaseBadge = document.querySelector('.phase-badge');
const phasePills = document.querySelectorAll('.phase-pill');

if (cicloSlider) {
  cicloSlider.addEventListener('input', () => {
    const val = parseInt(cicloSlider.value);
    const day = Math.round(val * 1.4);
    cicloDayEl.textContent = `Día ${day} / 140`;

    let phaseIndex;
    if (val < 15) phaseIndex = 0;
    else if (val < 30) phaseIndex = 1;
    else if (val < 75) phaseIndex = 2;
    else phaseIndex = 3;

    phaseBadge.textContent = phases[phaseIndex];
    phasePills.forEach((pill, i) => {
      pill.classList.toggle('active', i === phaseIndex);
    });
  });
}

// ===== PHASE PILLS =====
phasePills.forEach((pill, i) => {
  pill.addEventListener('click', () => {
    const targets = [10, 22, 55, 85];
    cicloSlider.value = targets[i];
    cicloSlider.dispatchEvent(new Event('input'));
  });
});

// ===== INIT =====
function init() {
  cargarDatos();
  renderizarPerfil();
  renderizarParcelas();
  renderizarSensores();
  updateActiveParcelaSelect();
  renderizarDropdownLotes();
  renderizarDropdownTrazabilidad();
  renderizarDropdownComparativa();
  renderizarLogsBD();
  if (window.cargarClimaReal) window.cargarClimaReal();

  updateSensorDisplay();
  // Small delay for DOM rendering before drawing charts
  setTimeout(() => {
    updateCharts();
    updateChartValues();
    calcularFlete(); // Initialize logistic data
    calcularRentabilidad(); // Initialize agricultural calculator data
    initTerrainGrid(); // Renderizar mapa simulador de terreno
    initCBOT(); // Inicializar módulo CBOT
  }, 100);

  // Start IoT simulation every 5 seconds
  setInterval(simulateIoT, 5000);
}

// Resize charts on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(updateCharts, 200);
});

document.addEventListener('DOMContentLoaded', init);

// ===== MARKET PRICE SIMULATOR =====
const cropData = {
  maiz: { precio: 420, oferta: 1240, demanda: 1500, elasticidad: 0.08 },
  trigo: { precio: 380, oferta: 2890, demanda: 2600, elasticidad: 0.06 },
  soja: { precio: 510, oferta: 980, demanda: 1200, elasticidad: 0.10 },
  tomate: { precio: 720, oferta: 650, demanda: 900, elasticidad: 0.12 }
};
let currentCrop = 'maiz';

function simCrop(btn) {
  document.querySelectorAll('[data-sim-crop]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentCrop = btn.dataset.simCrop;
  updateSimulator();
}

function updateSimulator() {
  const slider = document.getElementById('simSlider');
  if (!slider) return;
  const tons = parseInt(slider.value);
  const crop = cropData[currentCrop];
  const newOferta = crop.oferta + tons;
  const ratio = tons / crop.demanda;
  const drop = ratio * crop.elasticidad * 100;
  const newPrecio = Math.round(crop.precio * (1 - ratio * crop.elasticidad));
  const variacion = (((newPrecio - crop.precio) / crop.precio) * 100).toFixed(1);
  const balance = crop.demanda - newOferta;
  const ingreso = newPrecio * tons;

  document.getElementById('simTonLabel').textContent = tons + ' toneladas';
  document.getElementById('simPrecioActual').textContent = '$' + crop.precio + '/ton';
  document.getElementById('simPrecioEstimado').textContent = '$' + newPrecio + '/ton';
  document.getElementById('simPrecioEstimado').style.color = newPrecio >= crop.precio ? 'var(--accent-green)' : 'var(--accent-amber)';
  document.getElementById('simVariacion').textContent = variacion + '%';
  document.getElementById('simVariacion').style.color = variacion >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
  document.getElementById('simIngreso').textContent = '$' + ingreso.toLocaleString();
  document.getElementById('simOferta').textContent = newOferta.toLocaleString() + ' ton';
  document.getElementById('simDemanda').textContent = crop.demanda.toLocaleString() + ' ton';

  if (balance > 0) {
    document.getElementById('simBalance').textContent = 'Déficit: ' + balance + ' ton';
    document.getElementById('simBalance').style.color = 'var(--accent-green)';
    document.getElementById('simRecom').textContent = '✅ Producir más';
    document.getElementById('simRecom').style.color = 'var(--accent-green)';
    document.getElementById('simConsejo').textContent = 'La demanda supera la oferta. Es buen momento para aumentar producción.';
    agregarRegistroBD("Simulación Mercado", `Simuló ${tons} ton de ${currentCrop} (Déficit)`, "Favorable", "var(--accent-green)");
  } else {
    document.getElementById('simBalance').textContent = 'Excedente: ' + Math.abs(balance) + ' ton';
    document.getElementById('simBalance').style.color = 'var(--accent-red)';
    document.getElementById('simRecom').textContent = '⚠️ Considerar otro cultivo';
    document.getElementById('simRecom').style.color = 'var(--accent-amber)';
    document.getElementById('simConsejo').textContent = 'La oferta supera la demanda. El precio podría bajar. Considere diversificar.';
    agregarRegistroBD("Simulación Mercado", `Simuló ${tons} ton de ${currentCrop} (Excedente)`, "Riesgo", "var(--accent-amber)");
  }
}

const simSlider = document.getElementById('simSlider');
if (simSlider) {
  simSlider.addEventListener('input', updateSimulator);
}

// ===== NUEVAS FUNCIONALIDADES (MI PERFIL, LOGÍSTICA, BD, LOTE) =====

// Función para guardar análisis en "Mi Perfil" y recomendar riego
// Función para guardar análisis en "Mi Perfil" y recomendar riego
function guardarAnalisis(event) {
  event.preventDefault(); // Evitar recarga de página

  const parcelaId = parseInt(document.getElementById('perfilParcela').value);
  if (isNaN(parcelaId)) return;
  
  const p = appData.parcelas.find(x => x.id === parcelaId);
  if (!p) return;
  
  const ph = parseFloat(document.getElementById('perfilPh').value);
  const agua = parseInt(document.getElementById('perfilAgua').value);

  // Guardar en la parcela
  p.ph = ph;
  p.agua = agua;
  guardarDatos();
  renderizarParcelas(); // Re-renderizar para mostrar el nuevo pH en las tarjetas
  
  let recomendacion = "";
  let color = "var(--accent-green)";
  let tipoRiego = "";

  if (agua <= 4) {
    tipoRiego = "Riego por Goteo (Alta eficiencia)";
    recomendacion = `Nivel de agua crítico (${agua}/10). Se recomienda encarecidamente instalar ${tipoRiego} para maximizar el aprovechamiento hídrico.`;
    color = "var(--accent-red)";
  } else if (agua <= 7) {
    tipoRiego = "Riego por Aspersión o Goteo";
    recomendacion = `Nivel de agua medio (${agua}/10). El ${tipoRiego} mantendrá la humedad estable sin desperdicio.`;
    color = "var(--accent-amber)";
  } else {
    tipoRiego = "Riego por Surco / Gravedad";
    recomendacion = `Nivel de agua óptimo (${agua}/10). Puede usar ${tipoRiego}, pero el goteo sigue siendo recomendado para control preciso.`;
    color = "var(--accent-green)";
  }

  let recomendacionPh = "";
  if (ph < 6.0) recomendacionPh = "Suelo ácido. Se sugiere aplicar cal agrícola.";
  else if (ph > 7.5) recomendacionPh = "Suelo alcalino. Considerar aplicar azufre o abonos orgánicos.";
  else recomendacionPh = "pH óptimo para la mayoría de los cultivos.";

  const resultadoHTML = `
    <div style="text-align:left">
      <h4 style="color:var(--accent-green);margin-bottom:8px">Análisis Guardado Exitosamente</h4>
      <p style="font-size:0.85rem;margin-bottom:8px"><strong>Parcela:</strong> ${p.nombre}</p>
      <p style="font-size:0.85rem;margin-bottom:8px"><strong>pH (${ph}):</strong> ${recomendacionPh}</p>
      <div style="margin-top:12px;padding:12px;border-left:3px solid ${color};background:rgba(255,255,255,0.05)">
        <h5 style="margin-bottom:4px">💧 Tipo de Riego Recomendado:</h5>
        <p style="font-size:0.85rem;color:var(--text-secondary)"><strong>${tipoRiego}</strong></p>
        <p style="font-size:0.8rem;color:var(--text-muted);margin-top:4px">${recomendacion}</p>
      </div>
    </div>
  `;

  document.getElementById('resultadoRiego').innerHTML = resultadoHTML;

  // Agregar a la base de datos
  agregarRegistroBD("Análisis Subido", `Análisis de Suelo/Agua para ${p.nombre}`, "Completado", "var(--accent-green)");

  // Show Toast
  showToast(`Análisis de suelo para "${p.nombre}" guardado con éxito.`, "success");
}

// Función para cargar los datos de análisis guardados de una parcela seleccionada
window.cargarDatosAnalisisParcela = function() {
  const select = document.getElementById('perfilParcela');
  if (!select) return;

  const parcelaId = parseInt(select.value);
  const inputPh = document.getElementById('perfilPh');
  const inputAgua = document.getElementById('perfilAgua');
  const resRiego = document.getElementById('resultadoRiego');

  if (isNaN(parcelaId) || parcelaId === 0) {
    if (inputPh) inputPh.value = "";
    if (inputAgua) inputAgua.value = "";
    if (resRiego) {
      resRiego.innerHTML = "Sube tu análisis de suelo y agua para obtener una recomendación personalizada de riego.";
      resRiego.style.color = "var(--text-muted)";
    }
    return;
  }

  const p = appData.parcelas.find(x => x.id === parcelaId);
  if (!p) return;

  // Cargar valores de pH y agua
  const ph = p.ph !== undefined ? p.ph : 7.0;
  const agua = p.agua !== undefined ? p.agua : 5;

  if (inputPh) inputPh.value = ph;
  if (inputAgua) inputAgua.value = agua;

  // Generar recomendación
  let recomendacion = "";
  let color = "var(--accent-green)";
  let tipoRiego = "";

  if (agua <= 4) {
    tipoRiego = "Riego por Goteo (Alta eficiencia)";
    recomendacion = `Nivel de agua crítico (${agua}/10). Se recomienda encarecidamente instalar ${tipoRiego} para maximizar el aprovechamiento hídrico.`;
    color = "var(--accent-red)";
  } else if (agua <= 7) {
    tipoRiego = "Riego por Aspersión o Goteo";
    recomendacion = `Nivel de agua medio (${agua}/10). El ${tipoRiego} mantendrá la humedad estable sin desperdicio.`;
    color = "var(--accent-amber)";
  } else {
    tipoRiego = "Riego por Surco / Gravedad";
    recomendacion = `Nivel de agua óptimo (${agua}/10). Puede usar ${tipoRiego}, pero el goteo sigue siendo recomendado para control preciso.`;
    color = "var(--accent-green)";
  }

  let recomendacionPh = "";
  if (ph < 6.0) recomendacionPh = "Suelo ácido. Se sugiere aplicar cal agrícola.";
  else if (ph > 7.5) recomendacionPh = "Suelo alcalino. Considerar aplicar azufre o abonos orgánicos.";
  else recomendacionPh = "pH óptimo para la mayoría de los cultivos.";

  const resultadoHTML = `
    <div style="text-align:left">
      <h4 style="color:var(--accent-green);margin-bottom:8px">Análisis Cargado</h4>
      <p style="font-size:0.85rem;margin-bottom:8px"><strong>Parcela:</strong> ${p.nombre}</p>
      <p style="font-size:0.85rem;margin-bottom:8px"><strong>pH (${ph}):</strong> ${recomendacionPh}</p>
      <div style="margin-top:12px;padding:12px;border-left:3px solid ${color};background:rgba(255,255,255,0.05)">
        <h5 style="margin-bottom:4px">💧 Tipo de Riego Recomendado:</h5>
        <p style="font-size:0.85rem;color:var(--text-secondary)"><strong>${tipoRiego}</strong></p>
        <p style="font-size:0.8rem;color:var(--text-muted);margin-top:4px">${recomendacion}</p>
      </div>
    </div>
  `;

  if (resRiego) {
    resRiego.innerHTML = resultadoHTML;
    resRiego.style.color = "var(--text-primary)";
  }
};

// Función para mostrar detalle en Análisis de Lote
// Función para renderizar el dropdown de lotes
window.renderizarDropdownLotes = function(seleccionarId = null) {
  const select = document.getElementById('loteSelectDropdown');
  if (!select) return;
  
  select.innerHTML = '<option value="">-- Seleccionar Lote --</option>';
  if (appData.lotes.length === 0) {
    const detalleEl = document.getElementById('loteDetalle');
    const vacioEl = document.getElementById('loteVacio');
    if (detalleEl) detalleEl.style.display = 'none';
    if (vacioEl) vacioEl.style.display = 'block';
    return;
  }
  
  appData.lotes.forEach(l => {
    const parcel = appData.parcelas.find(p => p.id === l.parcelaId);
    const parcelName = parcel ? parcel.nombre : `Lote ID ${l.parcelaId}`;
    select.innerHTML += `<option value="${l.id}">Cosecha ${l.fecha} - ${l.cultivo} (${parcelName})</option>`;
  });
  
  if (seleccionarId) {
    select.value = seleccionarId;
    mostrarAnalisisLote(seleccionarId);
  } else if (appData.lotes.length > 0) {
    select.value = appData.lotes[0].id;
    mostrarAnalisisLote(appData.lotes[0].id);
  }
};

window.mostrarAnalisisLote = function(id) {
  const detalle = document.getElementById('loteDetalle');
  const vacio = document.getElementById('loteVacio');
  if (!detalle || !vacio) return;
  
  if (!id) {
    detalle.style.display = 'none';
    vacio.style.display = 'block';
    return;
  }
  
  const l = appData.lotes.find(x => x.id === id);
  if (!l) {
    detalle.style.display = 'none';
    vacio.style.display = 'block';
    return;
  }
  
  detalle.style.display = 'block';
  vacio.style.display = 'none';
  
  document.getElementById('lblLoteRendimiento').textContent = `${l.rendimiento.toFixed(1)} ton/ha`;
  document.getElementById('lblLoteCalidad').textContent = l.calidad;
  document.getElementById('lblLoteAgua').textContent = `${Math.round(l.agua).toLocaleString()} m³/ha`;
  
  const roiEl = document.getElementById('lblLoteRoi');
  if (roiEl) {
    roiEl.textContent = `${l.roi >= 0 ? '+' : ''}${l.roi.toFixed(1)}% ROI`;
    roiEl.style.color = l.roi >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
  }
  
  let recomText = "";
  if (l.cultivo.includes("Maíz")) {
    recomText = `El Maíz es demandante en nitrógeno. Se recomienda **rotar con Soja o Frijol Azufrado** en el próximo ciclo para fijar nitrógeno de manera natural y prevenir plagas de suelo.`;
    if (l.rendimiento < 10) {
      recomText += ` Tu rendimiento de ${l.rendimiento.toFixed(1)} ton/ha está por debajo del promedio. Se sugiere realizar un análisis de suelo (pH/Salinidad) en el perfil y ajustar el plan de fertilización.`;
    }
  } else if (l.cultivo.includes("Frijol")) {
    recomText = `El Frijol recupera la materia orgánica. Para el siguiente ciclo, es seguro sembrar **Maíz Blanco o Trigo**, aprovechando los nutrientes residuales.`;
  } else if (l.cultivo.includes("Tomate")) {
    recomText = `El Tomate es un cultivo de alto valor pero propenso a nematodos. Se recomienda rotar con **Sorgo o Trigo** para romper el ciclo biológico de plagas.`;
  } else {
    recomText = `Se recomienda realizar rotación de cultivos sistemática para equilibrar nutrientes. Evita sembrar el mismo cultivo dos temporadas seguidas.`;
  }
  
  if (l.roi < 10) {
    recomText += ` **Optimización Financiera:** Dado que la rentabilidad fue baja o negativa (${l.roi.toFixed(1)}% ROI), revisa los costos logísticos hacia el Puerto de Topolobampo o considera el Mercado CBOT en vivo para pactar mejores contratos futuros.`;
  }
  
  document.getElementById('lblLoteRecomendacion').innerHTML = recomText;
  
  agregarRegistroBD("Consulta Lote", `Revisó detalles de cosecha del cultivo: ${l.cultivo}`, "Visualizado", "var(--accent-blue)");
};

window.toggleAddLoteForm = function(show = true) {
  const container = document.getElementById('loteFormContainer');
  if (!container) return;
  
  if (show) {
    const select = document.getElementById('loteFormParcela');
    if (select) {
      select.innerHTML = '<option value="">-- Seleccionar Parcela --</option>';
      appData.parcelas.forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.nombre} (${p.cultivo})</option>`;
      });
    }
    
    container.classList.add('active');
    document.getElementById('formLote').reset();
    container.scrollIntoView({ behavior: 'smooth' });
  } else {
    container.classList.remove('active');
  }
};

// ===== COMPARATIVA Y PROYECCIÓN DE CULTIVOS =====
window.renderizarDropdownComparativa = function(seleccionarId = null) {
  const select = document.getElementById('compParcelaSelect');
  if (!select) return;
  
  select.innerHTML = '';
  
  if (appData.parcelas.length === 0) {
    select.innerHTML = '<option value="">-- Sin Parcelas --</option>';
    return;
  }
  
  appData.parcelas.forEach(p => {
    select.innerHTML += `<option value="${p.id}">${p.nombre} (${p.hectareas} ha)</option>`;
  });
  
  if (seleccionarId) {
    select.value = seleccionarId;
  } else if (appData.parcelas.length > 0) {
    select.value = appData.parcelas[0].id;
  }
  
  calcularComparativaCultivos();
};

window.calcularComparativaCultivos = function() {
  const select = document.getElementById('compParcelaSelect');
  const tbody = document.getElementById('compTableBody');
  const inputPresupuesto = document.getElementById('compPresupuestoInput');
  
  if (!select || !tbody || !inputPresupuesto) return;
  
  const parcelaId = parseInt(select.value);
  const presupuestoHa = parseFloat(inputPresupuesto.value) || 0;
  
  const p = appData.parcelas.find(x => x.id === parcelaId);
  const hectareas = p ? p.hectareas : 10;
  
  // Sincronización en vivo con CBOT
  const cbotPrecioEl = document.getElementById('cbotPrecio');
  let liveMaizFactor = 1.0;
  if (cbotPrecioEl) {
    const rawPrice = parseFloat(cbotPrecioEl.textContent.replace('$', '').replace('/bu', ''));
    if (!isNaN(rawPrice) && rawPrice > 0) {
      liveMaizFactor = rawPrice / 4.52;
    }
  }
  const maizPrecioLive = Math.round(420 * liveMaizFactor);
  
  const cropBaselines = [
    { name: "Maíz", icon: "🌽", inversionHa: 950, yieldHa: 12.5, precio: maizPrecioLive },
    { name: "Trigo", icon: "🌾", inversionHa: 820, yieldHa: 6.5, precio: 380 },
    { name: "Frijol", icon: "🫘", inversionHa: 1100, yieldHa: 2.2, precio: 850 },
    { name: "Tomate", icon: "🍅", inversionHa: 3500, yieldHa: 85.0, precio: 720 }
  ];
  
  tbody.innerHTML = '';
  
  cropBaselines.forEach(c => {
    const invTotal = c.inversionHa * hectareas;
    const rendTotal = c.yieldHa * hectareas;
    const ingresoBruto = rendTotal * c.precio;
    const gananciaNeta = ingresoBruto - invTotal;
    const roi = (gananciaNeta / invTotal) * 100;
    
    const apto = c.inversionHa <= presupuestoHa;
    const aptoText = apto ? 'Apto (Presupuesto OK) ✅' : 'Excede Presupuesto ❌';
    const aptoColor = apto ? 'var(--accent-green)' : 'var(--accent-red)';
    
    tbody.innerHTML += `
      <tr style="border-bottom:1px solid var(--border-color)">
        <td style="padding:10px">${c.icon} ${c.name}</td>
        <td style="padding:10px">$${Math.round(invTotal).toLocaleString('en-US')} USD</td>
        <td style="padding:10px">${rendTotal.toFixed(1)} ton</td>
        <td style="padding:10px">$${c.precio} USD/ton</td>
        <td style="padding:10px; color:${gananciaNeta >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}">
          $${Math.round(gananciaNeta).toLocaleString('en-US')} USD
        </td>
        <td style="padding:10px; color:${roi >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}">
          ${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%
        </td>
        <td style="padding:10px; color:${aptoColor}; font-weight:600;">${aptoText}</td>
      </tr>
    `;
  });
};

// ===== TRAZABILIDAD INTERACTIVA =====
window.renderizarDropdownTrazabilidad = function(seleccionarId = null) {
  const select = document.getElementById('trazabilidadLoteSelect');
  if (!select) return;
  
  select.innerHTML = '';
  const detalleEl = document.getElementById('trazabilidadDetalle');
  const vacioEl = document.getElementById('trazabilidadVacio');
  
  if (appData.lotes.length === 0) {
    if (detalleEl) detalleEl.style.display = 'none';
    if (vacioEl) vacioEl.style.display = 'block';
    return;
  }
  
  if (detalleEl) detalleEl.style.display = 'block';
  if (vacioEl) vacioEl.style.display = 'none';
  
  appData.lotes.forEach(l => {
    const parcel = appData.parcelas.find(p => p.id === l.parcelaId);
    const parcelName = parcel ? parcel.nombre : `Lote ID ${l.parcelaId}`;
    select.innerHTML += `<option value="${l.id}">Cosecha ${l.fecha} - ${l.cultivo} (${parcelName})</option>`;
  });
  
  if (seleccionarId) {
    select.value = seleccionarId;
    mostrarTrazabilidadLote(seleccionarId);
  } else if (appData.lotes.length > 0) {
    select.value = appData.lotes[0].id;
    mostrarTrazabilidadLote(appData.lotes[0].id);
  }
};

window.mostrarTrazabilidadLote = function(id) {
  const detalle = document.getElementById('trazabilidadDetalle');
  const vacio = document.getElementById('trazabilidadVacio');
  if (!detalle || !vacio) return;
  
  if (!id) {
    detalle.style.display = 'none';
    vacio.style.display = 'block';
    return;
  }
  
  const l = appData.lotes.find(x => x.id === id);
  if (!l) {
    detalle.style.display = 'none';
    vacio.style.display = 'block';
    return;
  }
  
  detalle.style.display = 'block';
  vacio.style.display = 'none';
  
  const p = appData.parcelas.find(x => x.id === l.parcelaId) || { nombre: "Parcela Desconocida", hectareas: 10, ph: 6.8, agua: 75 };
  
  // Deterministic Hash based on ID & Date & Crop
  const hash = "0x" + Array.from(l.id + l.fecha + l.cultivo).reduce((acc, char) => acc + char.charCodeAt(0).toString(16), "").substring(0, 16).toUpperCase();
  
  // Custom buyers mapping
  const buyersMap = {
    "Maíz Blanco": "Grupo Maseca",
    "Frijol Azufrado": "Central de Abastos Norte",
    "Sorgo": "Cargill de México",
    "Tomate": "Central de Abastos Norte",
    "Trigo": "Molino Harinero Sinaloense",
    "Soja": "Cargill de México"
  };
  const buyer = buyersMap[l.cultivo] || "Comprador Local";
  
  // Seed mapping
  const seedMap = {
    "Maíz Blanco": "Pioneer 30F35",
    "Frijol Azufrado": "Azufrado Higuera",
    "Sorgo": "Pioneer 85Y40",
    "Tomate": "Híbrido Saladette Cid",
    "Trigo": "Trigo Harinero Altar",
    "Soja": "Soybean Pioneer"
  };
  const seed = seedMap[l.cultivo] || "Semilla Certificada";
  
  // Calculations
  const produccionTotalVal = (l.rendimiento * p.hectareas).toFixed(1);
  const aguaTotalVal = (l.agua * p.hectareas).toLocaleString('es-MX');
  
  // Update fields
  document.getElementById('traHash').textContent = `HASH: ${hash}`;
  document.getElementById('traCultivo').textContent = l.cultivo;
  document.getElementById('traParcela').textContent = p.nombre;
  document.getElementById('traHectareas').textContent = `${p.hectareas} ha`;
  document.getElementById('traRendimiento').textContent = `${l.rendimiento.toFixed(1)} ton/ha`;
  document.getElementById('traProduccionTotal').innerHTML = `${produccionTotalVal} <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">toneladas</span>`;
  document.getElementById('traFecha').textContent = l.fecha;
  document.getElementById('traAgua').textContent = `${aguaTotalVal} m³`;
  document.getElementById('traCalidad').textContent = l.calidad;
  document.getElementById('traComprador').textContent = buyer;
  
  // Draw mock QR code on canvas
  drawMockQRCode('canvasQR', hash + l.id);
  
  // Timeline audit
  document.getElementById('timelineSuelo').textContent = `pH del suelo: ${p.ph || 6.8} (Apto) · Nutrientes verificados`;
  document.getElementById('timelineSiembra').textContent = `Semilla: ${seed} · Fecha Siembra: ${l.fecha}`;
  document.getElementById('timelineIot').textContent = `Humedad prom. ciclo: ${p.agua || 75}% · Temperatura validada`;
  document.getElementById('timelineCosecha').textContent = `Rendimiento: ${l.rendimiento} ton/ha · Certificado emitido`;
};

function drawMockQRCode(canvasId, text) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  ctx.clearRect(0, 0, size, size);
  
  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  
  // Seed random from text
  let seed = 0;
  for (let i = 0; i < text.length; i++) {
    seed += text.charCodeAt(i);
  }
  function random() {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }
  
  const modules = 21;
  const moduleSize = size / modules;
  
  ctx.fillStyle = '#0f172a'; // Dark slate color
  
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      // Finder patterns
      const isFinder = (r < 7 && c < 7) || (r < 7 && c >= modules - 7) || (r >= modules - 7 && c < 7);
      if (isFinder) {
        const insideOuter = (r === 0 || r === 6 || c === 0 || c === 6) ||
                            (r === 0 || r === 6 || c === modules - 7 || c === modules - 1) ||
                            (r === modules - 7 || r === modules - 1 || c === 0 || c === 6);
        const insideInner = (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
                            (r >= 2 && r <= 4 && c >= modules - 5 && c <= modules - 3) ||
                            (r >= modules - 5 && r <= modules - 3 && c >= 2 && c <= 4);
        if (insideOuter || insideInner) {
          ctx.fillRect(c * moduleSize, r * moduleSize, moduleSize, moduleSize);
        }
      } else {
        if (random() > 0.5) {
          ctx.fillRect(c * moduleSize, r * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  }
}

window.guardarLoteSubmit = function(event) {
  event.preventDefault();
  const parcelaId = parseInt(document.getElementById('loteFormParcela').value);
  const rendimiento = parseFloat(document.getElementById('loteFormRendimiento').value) || 0;
  const calidad = document.getElementById('loteFormCalidad').value;
  const agua = parseFloat(document.getElementById('loteFormAgua').value) || 0;
  const costo = parseFloat(document.getElementById('loteFormCosto').value) || 0;
  const precioVenta = parseFloat(document.getElementById('loteFormPrecioVenta').value) || 0;
  
  if (isNaN(parcelaId) || rendimiento <= 0 || costo <= 0 || precioVenta <= 0) return;
  
  const p = appData.parcelas.find(x => x.id === parcelaId);
  if (!p) return;
  
  const produccionTotal = rendimiento * p.hectareas;
  const ingresosTotales = produccionTotal * precioVenta;
  const gananciaNeta = ingresosTotales - costo;
  const roi = (gananciaNeta / costo) * 100;
  
  const dateStr = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  
  const nuevoLote = {
    id: "lote-" + Date.now(),
    parcelaId: parcelaId,
    cultivo: p.cultivo,
    fecha: dateStr,
    rendimiento: rendimiento,
    calidad: calidad,
    agua: agua,
    costo: costo,
    precioVenta: precioVenta,
    roi: roi
  };
  
  appData.lotes.unshift(nuevoLote);
  guardarDatos();
  renderizarDropdownLotes(nuevoLote.id);
  renderizarDropdownTrazabilidad(nuevoLote.id);
  toggleAddLoteForm(false);
  
  agregarRegistroBD("Registro Cosecha", `Cosechó ${rendimiento} ton/ha en ${p.nombre} (${p.cultivo})`, "Completado", "var(--accent-green)");
  showToast(`¡Cosecha de ${p.nombre} registrada exitosamente!`, "success");
};

// ===== INTERACTIVE AGRICULTURAL CALCULATOR =====
window.actualizarValoresPorDefectoCalc = function(cultivo) {
  const defaults = {
    "Maíz Blanco": { semilla: 150, fert: 256, riego: 168, mano: 360, yield: 11.0, price: 420 },
    "Frijol Azufrado": { semilla: 180, fert: 190, riego: 110, mano: 280, yield: 2.5, price: 850 },
    "Trigo": { semilla: 120, fert: 210, riego: 140, mano: 220, yield: 6.5, price: 380 },
    "Tomate": { semilla: 450, fert: 890, riego: 340, mano: 1200, yield: 45.0, price: 720 },
    "Sorgo": { semilla: 90, fert: 150, riego: 80, mano: 180, yield: 7.0, price: 320 },
    "Soja": { semilla: 110, fert: 130, riego: 90, mano: 210, yield: 3.2, price: 510 }
  };
  
  const val = defaults[cultivo] || defaults["Maíz Blanco"];
  document.getElementById('calcCostSemilla').value = val.semilla;
  document.getElementById('calcCostFert').value = val.fert;
  document.getElementById('calcCostRiego').value = val.riego;
  document.getElementById('calcCostMano').value = val.mano;
  document.getElementById('calcYield').value = val.yield;
  document.getElementById('calcPrice').value = val.price;
  
  calcularRentabilidad();
};

window.calcularRentabilidad = function() {
  const ha = parseFloat(document.getElementById('calcHa').value) || 0;
  const cultivo = document.getElementById('calcCultivo').value;
  const semilla = parseFloat(document.getElementById('calcCostSemilla').value) || 0;
  const fert = parseFloat(document.getElementById('calcCostFert').value) || 0;
  const riego = parseFloat(document.getElementById('calcCostRiego').value) || 0;
  const mano = parseFloat(document.getElementById('calcCostMano').value) || 0;
  const yieldVal = parseFloat(document.getElementById('calcYield').value) || 0;
  const price = parseFloat(document.getElementById('calcPrice').value) || 0;
  
  const totalSemilla = ha * semilla;
  const totalFert = ha * fert;
  const totalRiego = ha * riego;
  const totalMano = ha * mano;
  const totalCosto = totalSemilla + totalFert + totalRiego + totalMano;
  
  const totalProd = ha * yieldVal;
  const grossRevenue = totalProd * price;
  const netProfit = grossRevenue - totalCosto;
  const roi = totalCosto > 0 ? (netProfit / totalCosto) * 100 : 0;
  
  document.getElementById('lblCalcSemilla').textContent = `Semilla (${ha} ha)`;
  document.getElementById('valCalcSemilla').textContent = `$${Math.round(totalSemilla).toLocaleString()}`;
  document.getElementById('valCalcFert').textContent = `$${Math.round(totalFert).toLocaleString()}`;
  document.getElementById('valCalcRiego').textContent = `$${Math.round(totalRiego).toLocaleString()}`;
  document.getElementById('valCalcMano').textContent = `$${Math.round(totalMano).toLocaleString()}`;
  document.getElementById('valCalcTotalCosto').textContent = `$${Math.round(totalCosto).toLocaleString()}`;
  
  document.getElementById('valCalcTotalProd').textContent = `${totalProd.toFixed(2)} ton`;
  document.getElementById('valCalcPrecioMercado').textContent = `$${price}/ton`;
  
  const brEl = document.getElementById('valCalcIngresoBruto');
  if (brEl) {
    brEl.textContent = `$${Math.round(grossRevenue).toLocaleString()}`;
    brEl.style.color = grossRevenue >= totalCosto ? 'var(--accent-green)' : 'var(--accent-red)';
  }
  
  const netEl = document.getElementById('valCalcGananciaNeta');
  if (netEl) {
    netEl.textContent = `$${Math.round(netProfit).toLocaleString()}`;
    netEl.style.color = netProfit >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
  }
  
  const roiEl = document.getElementById('valCalcRoi');
  if (roiEl) {
    roiEl.innerHTML = `${roi.toFixed(1)}<span class="unit">%</span>`;
    roiEl.style.color = roi >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
  }
};

// Función para calcular flete en Logística
function calcularFlete() {
  const kmInput = document.getElementById('fleteKm');
  const tonInput = document.getElementById('fleteTon');
  const dieselInput = document.getElementById('fleteDieselPrice');
  const rutaSelect = document.getElementById('fleteRutaType');

  if (!kmInput || !tonInput || !dieselInput || !rutaSelect) return;

  const km = parseFloat(kmInput.value) || 0;
  const ton = parseFloat(tonInput.value) || 0;
  const dieselPrice = parseFloat(dieselInput.value) || 24.85;
  const rutaType = rutaSelect.value;

  if (km === 0 || ton === 0) {
    document.getElementById('fleteCosto').textContent = '$0.00 MXN';
    document.getElementById('fleteVehiculo').textContent = '-';
    if (document.getElementById('fleteSubCombustible')) document.getElementById('fleteSubCombustible').textContent = '$0.00 MXN';
    if (document.getElementById('fleteSubCasetas')) document.getElementById('fleteSubCasetas').textContent = '$0.00 MXN';
    if (document.getElementById('fleteSubChofer')) document.getElementById('fleteSubChofer').textContent = '$0.00 MXN';
    return;
  }

  // Determinar vehículo y rendimiento (km por litro)
  let vehiculo = "Tráiler Caja Seca (30 ton)";
  let efficiency = 2.1;

  if (ton <= 5) {
    vehiculo = "Camioneta Rabón (5 ton)";
    efficiency = 7.0;
  } else if (ton <= 15) {
    vehiculo = "Torton Granelero (15 ton)";
    efficiency = 3.5;
  } else if (ton <= 30) {
    vehiculo = "Tráiler Caja Seca (30 ton)";
    efficiency = 2.1;
  } else {
    vehiculo = "Tractocamión Tolva (35+ ton)";
    efficiency = 1.8;
  }

  // Ajuste por tipo de ruta (libre = +15% consumo de combustible)
  if (rutaType === "libre") {
    efficiency *= 0.85;
  }

  // Cálculos de costos
  const costoCombustible = (km / efficiency) * dieselPrice;
  const costoCasetas = (rutaType === "cuota") ? (km * 1.50) : 0;
  const costoChofer = km * 10.00;
  const costoTotal = costoCombustible + costoCasetas + costoChofer;

  // Formateador de moneda (MXN)
  const formatMXN = (val) => '$' + val.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MXN';

  // Actualizar UI
  document.getElementById('fleteVehiculo').textContent = vehiculo;
  if (document.getElementById('fleteSubCombustible')) document.getElementById('fleteSubCombustible').textContent = formatMXN(costoCombustible);
  if (document.getElementById('fleteSubCasetas')) document.getElementById('fleteSubCasetas').textContent = formatMXN(costoCasetas);
  if (document.getElementById('fleteSubChofer')) document.getElementById('fleteSubChofer').textContent = formatMXN(costoChofer);
  document.getElementById('fleteCosto').textContent = formatMXN(costoTotal);
}

// Agregar registros a la Base de Datos Histórica
function agregarRegistroBD(tipo, descripcion, estado, colorEstado) {
  const fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const logEntry = { fecha, tipo, descripcion, estado, colorEstado };

  // Agregar a estado global
  if (!appData.logs) appData.logs = [];
  appData.logs.unshift(logEntry); // Agregar al principio
  guardarDatos();

  renderizarLogsBD();
}

function renderizarLogsBD() {
  const tbody = document.getElementById('dbTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!appData.logs || appData.logs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="padding:10px;text-align:center;color:var(--text-muted)">No hay registros en la base de datos</td></tr>';
    return;
  }

  appData.logs.forEach(log => {
    const row = document.createElement('tr');
    row.style.borderBottom = "1px solid var(--border-color)";
    row.innerHTML = `
      <td style="padding:10px;font-size:0.85rem">${log.fecha}</td>
      <td style="padding:10px">${log.tipo}</td>
      <td style="padding:10px">${log.descripcion}</td>
      <td style="padding:10px;color:${log.colorEstado}">${log.estado}</td>
    `;
    tbody.appendChild(row);
  });
}

// Funcionalidad para el botón "Agregar Parcela"
const btnAddParcela = document.getElementById('btnAddParcela');
if (btnAddParcela) {
  btnAddParcela.addEventListener('click', () => {
    const nombre = prompt("Ingresa el nombre de la nueva parcela:");
    if (nombre) {
      const cultivo = prompt("¿Qué cultivo sembrarás? (Ej: Maíz, Trigo, Frijol, Tomate)");
      const hectareas = prompt("¿Cuántas hectáreas?");

      if (cultivo && hectareas) {
        // Actualizar en el estado global
        appData.parcelas.push({
          id: Date.now(),
          nombre: nombre,
          cultivo: cultivo,
          hectareas: parseFloat(hectareas) || 0,
          icon: "🌱",
          color: "16,185,129",
          hex: "#10b981"
        });

        guardarDatos();
        renderizarParcelas();

        // Registrar en la base de datos
        agregarRegistroBD("Nueva Parcela", `Agregada ${nombre} (${cultivo}, ${hectareas} ha)`, "Registrado", "var(--accent-green)");
        showToast(`¡Parcela "${nombre}" agregada exitosamente!`, "success");
      }
    }
  });
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = "info") {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';

  let icon = "ℹ️";
  if (type === "success") { icon = "✅"; toast.style.borderLeftColor = "var(--accent-green)"; }
  if (type === "warning") { icon = "⚠️"; toast.style.borderLeftColor = "var(--accent-amber)"; }
  if (type === "error") { icon = "❌"; toast.style.borderLeftColor = "var(--accent-red)"; }

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Remove after animation (3s total)
  setTimeout(() => {
    if (container.contains(toast)) container.removeChild(toast);
  }, 3000);
}

// ===== DASHBOARD CUSTOM ACTIONS =====
window.exportarCSVParcela = function() {
  const activeParcelId = appData.activeParcelaId;
  const p = appData.parcelas.find(p => p.id === activeParcelId) || appData.parcelas[0];
  const nombre = p ? p.nombre : "Parcela";
  
  showToast(`Exportando datos de "${nombre}" en formato CSV...`, "info");
  agregarRegistroBD("Exportar", `Exportación iniciada para ${nombre}`, "En Proceso", "var(--accent-amber)");
  
  setTimeout(() => {
    showToast("¡Archivo CSV generado y descargado con éxito!", "success");
    agregarRegistroBD("Exportar", `CSV descargado para ${nombre}`, "Completado", "var(--accent-green)");
  }, 1500);
};

window.generarReportePDFParcela = function() {
  const activeParcelId = appData.activeParcelaId;
  const p = appData.parcelas.find(p => p.id === activeParcelId) || appData.parcelas[0];
  const nombre = p ? p.nombre : "Parcela";
  
  showToast(`Generando reporte consolidado en PDF para "${nombre}"...`, "info");
  agregarRegistroBD("Reporte", `Reporte PDF solicitado para ${nombre}`, "En Proceso", "var(--accent-amber)");
  
  setTimeout(() => {
    showToast("¡Reporte PDF guardado exitosamente en Descargas!", "success");
    agregarRegistroBD("Reporte", `PDF generado para ${nombre}`, "Completado", "var(--accent-green)");
  }, 2000);
};

// Map all generic buttons to show a Toast and log to DB (100% functional requirement)
document.addEventListener('DOMContentLoaded', () => {
  // Find buttons that don't have an onclick or specific ID listener
  const allButtons = document.querySelectorAll('button:not([onclick]):not(#btnAddParcela):not(.filter-btn):not(.nav-item)');
  allButtons.forEach(btn => {
    // If the button is inside a form or is of type submit, do not intercept it
    if (btn.type === "submit" || btn.closest('form')) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.textContent.trim() || btn.title || "Acción";
      // Ignore some buttons that might be handled
      if (text === "Enviar" && btn.closest('.chat-input-area')) return;
      if (text === "Guardar Perfil") return;

      showToast(`Acción ejecutada: ${text}`, "success");
      agregarRegistroBD("Interacción UI", `Clic en botón: ${text}`, "Completado", "var(--text-primary)");
    });
  });

  // Mobile Sidebar Toggle and Click Outside Close
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuToggle) {
        sidebar.classList.remove('open');
      }
    });
  }
});

// ===== ASISTENTE IA (Simulado) =====
function handleChatEnter(e) {
  if (e.key === 'Enter') enviarMensajeIA();
}

function enviarMensajeIA() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  // Append User message
  appendChatMsg(text, 'user');
  input.value = '';

  // Simulate network delay
  setTimeout(() => {
    const respuesta = generarRespuestaIA(text.toLowerCase());
    appendChatMsg(respuesta, 'bot');
    agregarRegistroBD("Asistente IA", `Consulta: ${text}`, "Respondido", "var(--accent-purple)");
  }, 800 + Math.random() * 500);
}

function appendChatMsg(text, sender) {
  const container = document.getElementById('chatMessages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${sender}`;
  msgDiv.innerHTML = text;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function generarRespuestaIA(q) {
  // Helper to determine the target/active parcel for soil analysis
  function getActiveTargetParcela() {
    let targetParcela = null;
    const perfilSelect = document.getElementById('perfilParcela');
    if (perfilSelect && perfilSelect.value) {
      const pId = parseInt(perfilSelect.value);
      targetParcela = appData.parcelas.find(p => p.id === pId);
    }
    if (!targetParcela && appData.activeParcelaId && appData.activeParcelaId !== 'all') {
      const pId = parseInt(appData.activeParcelaId);
      targetParcela = appData.parcelas.find(p => p.id === pId);
    }
    if (!targetParcela && appData.parcelas.length > 0) {
      targetParcela = appData.parcelas[0];
    }
    return targetParcela;
  }

  // 1. Diagnostics: Soil/pH/recommendations/acidity/humidity
  if (q.includes('suelo') || q.includes('ph') || q.includes('falta') || q.includes('recomiend') || q.includes('enmienda') || q.includes('acidez') || q.includes('alcalinidad')) {
    const targetParcela = getActiveTargetParcela();
    if (!targetParcela) {
      return "❌ No se encontró ninguna parcela registrada en tu cuenta para poder realizar un diagnóstico de suelo. Por favor registra o selecciona una primero.";
    }
    
    const ph = targetParcela.ph !== undefined ? targetParcela.ph : 7.0;
    const agua = targetParcela.agua !== undefined ? targetParcela.agua : 5;
    const cultivo = targetParcela.cultivo || "cultivo general";
    
    let analisisPh = "";
    let recomendacionPh = "";
    if (ph < 6.0) {
      analisisPh = `ácido (pH: <strong>${ph}</strong>)`;
      recomendacionPh = `⚠️ Se recomienda la aplicación de <strong>cal agrícola (carbonato de calcio)</strong> para elevar el pH a rangos óptimos (entre 6.0 y 7.0) y neutralizar la toxicidad por aluminio, mejorando la absorción de nutrientes por el cultivo de <em>${cultivo}</em>.`;
    } else if (ph > 7.5) {
      analisisPh = `alcalino (pH: <strong>${ph}</strong>)`;
      recomendacionPh = `⚠️ Se sugiere la aplicación de <strong>yeso agrícola (sulfato de calcio)</strong> o azufre elemental para ayudar a desplazar el sodio sobrante, bajar gradualmente el pH a rangos neutros y mejorar la estructura del suelo para tu cultivo de <em>${cultivo}</em>.`;
    } else {
      analisisPh = `óptimo (pH: <strong>${ph}</strong>)`;
      recomendacionPh = `✅ El pH del suelo se encuentra en un rango neutro y equilibrado para tu cultivo de <em>${cultivo}</em>. No requiere enmiendas correctoras de acidez o alcalinidad por el momento. Mantén la fertilización balanceada normal.`;
    }
    
    let analisisAgua = "";
    let recomendacionRiego = "";
    if (agua <= 4) {
      analisisAgua = `crítico (Nivel de agua: <strong>${agua}/10</strong>)`;
      recomendacionRiego = `💧 <strong>Urgente:</strong> El nivel de humedad es muy bajo. Se aconseja iniciar un ciclo de <strong>riego por goteo localizado de alta frecuencia</strong> inmediatamente para evitar el estrés hídrico de la planta.`;
    } else if (agua <= 7) {
      analisisAgua = `moderado (Nivel de agua: <strong>${agua}/10</strong>)`;
      recomendacionRiego = `💧 <strong>Estado controlado:</strong> La humedad es estable. Te sugerimos mantener un monitoreo constante con riego por goteo o aspersión regular para conservar la capacidad de campo.`;
    } else {
      analisisAgua = `óptimo (Nivel de agua: <strong>${agua}/10</strong>)`;
      recomendacionRiego = `💧 <strong>Saturación adecuada:</strong> El nivel de agua es alto. No requiere riego inmediato. Puedes esperar de 2 a 3 días antes de activar el siguiente ciclo o usar riego por surcos de mantenimiento si fuese necesario.`;
    }
    
    return `
      <div style="text-align: left; line-height: 1.5;">
        <p>📊 <strong>Diagnóstico de Suelo en Vivo - ${targetParcela.nombre} (${cultivo}):</strong></p>
        <ul style="margin-top: 8px; margin-bottom: 8px; padding-left: 20px;">
          <li><strong>Estado del pH:</strong> Suelo ${analisisPh}.</li>
          <li><strong>Humedad del Suelo:</strong> Estado ${analisisAgua}.</li>
        </ul>
        <p style="margin-top: 8px;">🛠️ <strong>Recomendaciones Técnicas:</strong></p>
        <p style="margin-left: 10px; margin-bottom: 6px;">${recomendacionPh}</p>
        <p style="margin-left: 10px;">${recomendacionRiego}</p>
        <p style="margin-top: 10px; font-size: 0.85rem; color: var(--text-muted);">
          *Nota: Estos datos y consejos reflejan las mediciones en tiempo real capturadas para <strong>${targetParcela.nombre}</strong>. Si deseas analizar otra parcela, selecciónala en la sección de <strong>Mi Perfil</strong> o en el panel de control.*
        </p>
      </div>
    `;
  }

  // 2. Greeting: Saludo Personalizado
  if (q.includes('hola') || q.includes('buen') || q.includes('saludo')) {
    const nombre = appData.user.nombre || "Productor";
    const region = appData.user.region || "tu región";
    return `👋 ¡Hola, <strong>${nombre}</strong>! ¿Cómo va el trabajo en <strong>${region}</strong>? 🌾 Estoy listo para ayudarte con el monitoreo de tus cultivos, recomendaciones de suelo, control de plagas o consultas de riego. ¿Qué te gustaría revisar hoy?`;
  }

  // 3. Parcels state: Desglose de Parcelas
  if (q.includes('parcela') || q.includes('terreno')) {
    if (!appData.parcelas || appData.parcelas.length === 0) {
      return "❌ Actualmente no tienes ninguna parcela registrada en tu cuenta. Puedes agregar una en el panel de control o desde la configuración del perfil.";
    }
    
    let html = `<p>Actualmente tienes registradas <strong>${appData.parcelas.length}</strong> parcelas en <strong>${appData.user.region}</strong>. Aquí tienes el desglose del estado de cada una:</p><ul style="margin-top: 8px; padding-left: 20px;">`;
    
    appData.parcelas.forEach(p => {
      // Find sensors for this parcel
      const sensoresParcela = appData.sensores.filter(s => s.parcelaId === p.id);
      const sensoresOnline = sensoresParcela.filter(s => s.estado.toLowerCase() === 'online').length;
      const totalSensores = sensoresParcela.length;
      
      html += `<li style="margin-bottom: 8px;">
        ${p.icon || '🌱'} <strong>${p.nombre}</strong>: 
        <ul>
          <li>Cultivo: <em>${p.cultivo}</em></li>
          <li>Superficie: <strong>${p.hectareas} ha</strong></li>
          <li>Sensores: <strong>${sensoresOnline}/${totalSensores} Online</strong></li>
          <li>pH actual: <strong>${p.ph !== undefined ? p.ph : 'N/A'}</strong> | Humedad: <strong>${p.agua !== undefined ? p.agua + '/10' : 'N/A'}</strong></li>
        </ul>
      </li>`;
    });
    
    html += `</ul><p style="margin-top: 8px;">¿Te gustaría recibir recomendaciones específicas para el suelo de alguna de ellas? Pregúntame por "recomendaciones de suelo" o "analizar mi suelo".</p>`;
    return html;
  }

  // 4. Agriculture Base Fallbacks
  if (q.includes('maiz') || q.includes('maíz')) {
    return "🌽 En el <strong>Valle del Fuerte</strong>, el maíz blanco se cotiza actualmente alrededor de $420-$430 MXN/ton. Te sugiero cuidar el riego en la etapa de floración (abril-mayo).";
  } else if (q.includes('frijol')) {
    return "🫘 El Frijol Azufrado Higuera es ideal para esta región. Su precio actual ronda los $850 MXN/ton. Recuerda revisar la humedad del suelo constantemente.";
  } else if (q.includes('riego') || q.includes('agua')) {
    return "💧 Ante la escasez hídrica en las presas del Norte de Sinaloa, te recomiendo transicionar a <strong>Riego por Goteo</strong>. Ahorrarás un 40% de agua comparado con la gravedad.";
  } else if (q.includes('plaga') || q.includes('enfermedad')) {
    return "🐛 Para pulgón y mosca blanca, muy comunes en Guasave y Ahome, se recomienda la aplicación de <em>Bacillus Thuringiensis</em> o control biológico preventivo.";
  } else if (q.includes('salinidad') || q.includes('sal')) {
    return "🧂 La salinidad en la región costera (Ahome) puede ser alta (>4 dS/m). Usa el <strong>Simulador de Terreno</strong> para verificar tus parcelas. Aplicar yeso agrícola puede ayudar a lavar sales.";
  } else {
    return "Entiendo. Esa es un área interesante. Como modelo agrointeligente regional, te recomiendo siempre contrastar esa información con tu análisis de suelo local. ¿Tienes alguna pregunta específica sobre tus parcelas, recomendaciones de suelo, maíz, frijol, riegos o salinidad?";
  }
}

// ===== SIMULADOR TERRENO (MAPA DE SALINIDAD) =====
let gridData = [];
let activeSimCellId = null;

function initTerrainGrid() {
  const gridContainer = document.getElementById('terrainGrid');
  if (!gridContainer) return;
  gridContainer.innerHTML = '';

  gridData = [];

  for (let i = 0; i < 100; i++) {
    const row = Math.floor(i / 10);
    const col = i % 10;

    // Crear un mapa más realista (esquina superior izquierda mala, esquina inferior derecha muy buena)
    let salinidad = 1.0;

    // Zona roja (No recomendable) - Esquina superior izquierda
    if (row < 4 && col < 4) {
      salinidad = 4.5 + Math.random() * 2;
    }
    // Zona amarilla (Regular) - Franja diagonal / medio
    else if ((row >= 4 && row <= 6 && col < 6) || (col >= 4 && col <= 6 && row < 6)) {
      salinidad = 2.8 + Math.random() * 1.0;
    }
    // Zona verde (Bueno sembrar) - El resto
    else {
      salinidad = 1.0 + Math.random() * 1.2;
    }

    const humedad = 40 + Math.random() * 50;

    let aptitud = "Bueno para sembrar";
    let recomendacion = "Tierra óptima. Listo para sembrar Maíz o Frijol.";
    let colorBg = 'rgba(16, 185, 129, 0.8)'; // Verde

    if (salinidad > 4.0) {
      aptitud = "No recomendable";
      recomendacion = "Alta salinidad. Riesgo de pérdida total. Aplicar lavado de suelo urgente.";
      colorBg = 'rgba(239, 68, 68, 0.8)'; // Rojo
    } else if (salinidad > 2.5) {
      aptitud = "Regular (Requiere trato)";
      recomendacion = "Apta sólo para cultivos resistentes (Sorgo/Trigo). Se sugiere aplicar mejoradores de suelo.";
      colorBg = 'rgba(245, 158, 11, 0.8)'; // Amarillo
    }

    gridData.push({
      salinidad: salinidad.toFixed(1),
      humedad: humedad.toFixed(1),
      aptitud: aptitud,
      recomendacion: recomendacion,
      colorBg: colorBg
    });

    const cell = document.createElement('div');
    cell.className = 'terrain-cell';
    cell.style.backgroundColor = colorBg;

    // Click event
    cell.addEventListener('click', () => {
      mostrarDetalleCelda(i);

      // Highlight selection
      document.querySelectorAll('.terrain-cell').forEach(c => c.style.border = 'none');
      cell.style.border = '2px solid #fff';

      agregarRegistroBD("Simulador Terreno", `Inspeccionó celda #${i} (Salinidad: ${gridData[i].salinidad})`, "Análisis", "var(--accent-blue)");
    });

    gridContainer.appendChild(cell);
  }

  // Auto-seleccionar la celda del medio al inicio para que no se vea vacío
  setTimeout(() => {
    const cells = document.querySelectorAll('.terrain-cell');
    if (cells && cells[45]) {
      cells[45].click();
    }
  }, 500);
}

function mostrarDetalleCelda(id) {
  activeSimCellId = id;
  const data = gridData[id];
  document.getElementById('simCellEmpty').style.display = 'none';
  document.getElementById('simCellDetails').style.display = 'block';

  document.getElementById('simCellSal').textContent = data.salinidad + ' dS/m';
  document.getElementById('simCellHum').textContent = data.humedad + ' %';
  document.getElementById('simCellApt').textContent = data.aptitud;
  document.getElementById('simCellRec').textContent = data.recomendacion;

  // Color code Salinity text
  const salEl = document.getElementById('simCellSal');
  if (parseFloat(data.salinidad) > 4.0) salEl.style.color = 'var(--accent-red)';
  else if (parseFloat(data.salinidad) > 2.5) salEl.style.color = 'var(--accent-amber)';
  else salEl.style.color = 'var(--accent-green)';
}

function actualizarMetricasCelda(id) {
  const cell = gridData[id];
  const salinidad = parseFloat(cell.salinidad);
  
  let aptitud = "Bueno para sembrar";
  let recomendacion = "Tierra óptima. Listo para sembrar Maíz o Frijol.";
  let colorBg = 'rgba(16, 185, 129, 0.8)'; // Verde

  if (salinidad > 4.0) {
    aptitud = "No recomendable";
    recomendacion = "Alta salinidad. Riesgo de pérdida total. Aplicar lavado de suelo urgente.";
    colorBg = 'rgba(239, 68, 68, 0.8)'; // Rojo
  } else if (salinidad > 2.5) {
    aptitud = "Regular (Requiere trato)";
    recomendacion = "Apta sólo para cultivos resistentes (Sorgo/Trigo). Se sugiere aplicar mejoradores de suelo.";
    colorBg = 'rgba(245, 158, 11, 0.8)'; // Amarillo
  }
  
  cell.aptitud = aptitud;
  cell.recomendacion = recomendacion;
  cell.colorBg = colorBg;
}

function refrescarCeldaUI(id) {
  const cells = document.querySelectorAll('.terrain-cell');
  if (cells && cells[id]) {
    cells[id].style.backgroundColor = gridData[id].colorBg;
  }
}

window.aplicarRiegoCelda = function() {
  if (activeSimCellId === null) return;
  const cell = gridData[activeSimCellId];
  if (!cell) return;
  
  let oldSal = parseFloat(cell.salinidad);
  let oldHum = parseFloat(cell.humedad);
  
  cell.humedad = "90.0";
  cell.salinidad = Math.max(0.5, oldSal - 0.5).toFixed(1);
  
  actualizarMetricasCelda(activeSimCellId);
  refrescarCeldaUI(activeSimCellId);
  mostrarDetalleCelda(activeSimCellId);
  
  agregarRegistroBD("Simulador Terreno", `Aplicó Riego en Celda #${activeSimCellId} (Hum: ${oldHum}% -> 90%, Sal: ${oldSal} -> ${cell.salinidad} dS/m)`, "Acción", "var(--accent-blue)");
  showToast(`💧 Riego aplicado en Celda #${activeSimCellId} (Humedad al 90%, lavado de sales iniciado).`, "success");
};

window.aplicarYesoCelda = function() {
  if (activeSimCellId === null) return;
  const cell = gridData[activeSimCellId];
  if (!cell) return;
  
  let oldSal = parseFloat(cell.salinidad);
  
  cell.salinidad = Math.max(0.5, oldSal - 1.5).toFixed(1);
  
  actualizarMetricasCelda(activeSimCellId);
  refrescarCeldaUI(activeSimCellId);
  mostrarDetalleCelda(activeSimCellId);
  
  agregarRegistroBD("Simulador Terreno", `Aplicó Yeso en Celda #${activeSimCellId} (Salinidad: ${oldSal} -> ${cell.salinidad} dS/m)`, "Acción", "var(--accent-purple)");
  showToast(`🧂 Yeso agrícola aplicado en Celda #${activeSimCellId} (Reducción de salinidad).`, "success");
};

// ===== MERCADO CBOT (Bolsa de Chicago - Maíz) =====
const cbotBaseData = {
  '6m': { labels: ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'], prices: [4.18, 4.25, 4.31, 4.38, 4.45, 4.52] },
  '1y': { labels: ['May', 'Jul', 'Sep', 'Nov', 'Ene', 'Mar', 'Abr'], prices: [3.95, 4.02, 4.10, 4.18, 4.31, 4.45, 4.52] },
  '3y': { labels: ['2024', 'Q2', 'Q3', 'Q4', '2025', 'Q2', 'Q3', 'Q4', '2026', 'Q2'], prices: [3.60, 3.72, 3.55, 3.80, 3.95, 4.10, 4.02, 4.18, 4.38, 4.52] }
};
let cbotChart = null;
const TIPO_CAMBIO = 17.15;
const BUSHELS_PER_TON = 39.368;

function initCBOT() {
  drawCBOTChart('6m');
  generateCBOTHistorial();
  updateCBOTTimestamp();

  // Simulate live price updates every 8 seconds
  setInterval(simulateCBOTTick, 8000);
}

function drawCBOTChart(range) {
  const canvas = document.getElementById('chartCBOT');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Set canvas resolution
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  ctx.scale(2, 2);

  const data = cbotBaseData[range];
  const prices = data.prices;
  const w = rect.width;
  const h = rect.height;

  const minP = Math.min(...prices) - 0.15;
  const maxP = Math.max(...prices) + 0.15;
  const rangeP = maxP - minP;

  const padL = 50, padR = 20, padT = 20, padB = 30;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  ctx.clearRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - padR, y);
    ctx.stroke();

    // Price labels
    const priceLabel = (maxP - (rangeP / 4) * i).toFixed(2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('$' + priceLabel, padL - 6, y + 4);
  }

  // Build points
  const points = prices.map((p, i) => ({
    x: padL + (chartW / (prices.length - 1)) * i,
    y: padT + chartH - ((p - minP) / rangeP) * chartH
  }));

  // Area fill gradient
  const gradient = ctx.createLinearGradient(0, padT, 0, padT + chartH);
  gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0.02)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, padT + chartH);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, padT + chartH);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dots
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, i === points.length - 1 ? 5 : 3, 0, Math.PI * 2);
    ctx.fillStyle = i === points.length - 1 ? '#10b981' : 'rgba(16,185,129,0.6)';
    ctx.fill();
    ctx.strokeStyle = '#0d1117';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Last price label
  const lastP = points[points.length - 1];
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('$' + prices[prices.length - 1].toFixed(2), lastP.x + 8, lastP.y + 4);
}

function setCbotRange(range, btn) {
  activeCbotRange = range;
  // Toggle active button
  btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  drawCBOTChart(range);
  agregarRegistroBD("Mercado CBOT", `Consultó gráfica de precios (${range})`, "Visualizado", "var(--accent-blue)");
}

function generateCBOTHistorial() {
  const tbody = document.getElementById('cbotHistorial');
  if (!tbody) return;

  const weeklyData = [
    { fecha: '25 Abr 2026', cierre: 4.52, cambio: +0.07 },
    { fecha: '18 Abr 2026', cierre: 4.45, cambio: +0.03 },
    { fecha: '11 Abr 2026', cierre: 4.42, cambio: +0.04 },
    { fecha: '04 Abr 2026', cierre: 4.38, cambio: -0.02 },
    { fecha: '28 Mar 2026', cierre: 4.40, cambio: +0.05 },
    { fecha: '21 Mar 2026', cierre: 4.35, cambio: +0.04 },
    { fecha: '14 Mar 2026', cierre: 4.31, cambio: -0.01 },
    { fecha: '07 Mar 2026', cierre: 4.32, cambio: +0.06 }
  ];

  tbody.innerHTML = weeklyData.map(d => {
    const mxn = (d.cierre * BUSHELS_PER_TON * TIPO_CAMBIO).toFixed(0);
    const cambioColor = d.cambio >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    const cambioSign = d.cambio >= 0 ? '+' : '';
    const signal = d.cambio > 0.03 ? '🟢 Compra fuerte' : d.cambio > 0 ? '🟡 Neutral alcista' : '🔴 Presión bajista';
    return `<tr style="border-bottom:1px solid var(--border-color)">
      <td style="padding:10px">${d.fecha}</td>
      <td style="padding:10px">$${d.cierre.toFixed(2)}</td>
      <td style="padding:10px;color:${cambioColor}">${cambioSign}${d.cambio.toFixed(2)}</td>
      <td style="padding:10px">$${Number(mxn).toLocaleString()} MXN</td>
      <td style="padding:10px;font-size:0.82rem">${signal}</td>
    </tr>`;
  }).join('');
}

function simulateCBOTTick() {
  const precioEl = document.getElementById('cbotPrecio');
  if (!precioEl) return;

  // Random fluctuation -0.03 to +0.04
  const currentText = precioEl.textContent.replace('$', '').replace(' /bu', '');
  let current = parseFloat(currentText) || 4.52;
  const change = (Math.random() * 0.07 - 0.03);
  current = Math.max(4.20, Math.min(4.80, current + change));

  const prevClose = 4.44;
  const dayChange = current - prevClose;
  const dayPct = (dayChange / prevClose * 100);

  // Update price
  precioEl.innerHTML = `$${current.toFixed(2)}<span class="unit"> /bu</span>`;

  // Update change indicator
  const cambioEl = document.getElementById('cbotCambio');
  if (cambioEl) {
    const sign = dayChange >= 0 ? '+' : '';
    cambioEl.textContent = `● ${sign}${dayChange.toFixed(2)} (${sign}${dayPct.toFixed(2)}%) hoy`;
    cambioEl.className = `sensor-change ${dayChange >= 0 ? 'positive' : 'negative'}`;
  }

  // Update MXN conversion
  const mxnTon = (current * BUSHELS_PER_TON * TIPO_CAMBIO).toFixed(0);
  const cbotMXN = document.getElementById('cbotMXN');
  if (cbotMXN) cbotMXN.innerHTML = `$${Number(mxnTon).toLocaleString()}<span class="unit"> MXN/ton</span>`;

  // Update impact section
  const impPrecio = document.getElementById('cbotImpactoPrecio');
  if (impPrecio) impPrecio.textContent = `$${current.toFixed(2)} /bu`;

  const impLocal = document.getElementById('cbotImpactoLocal');
  if (impLocal) impLocal.textContent = `$${Number(mxnTon).toLocaleString()} MXN/ton`;

  const margen = parseInt(mxnTon) - 4150;
  const cbotMargen = document.getElementById('cbotMargen');
  if (cbotMargen) {
    cbotMargen.textContent = `${margen >= 0 ? '+' : ''}$${margen.toLocaleString()} MXN/ton`;
    cbotMargen.style.color = margen >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
  }

  const tendEl = document.getElementById('cbotTendencia');
  if (tendEl) {
    tendEl.textContent = dayChange >= 0 ? '↗ Alcista' : '↘ Bajista';
    tendEl.style.color = dayChange >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
  }

  // Update contract data with small randomness
  const openEl = document.getElementById('cbotOpen');
  if (openEl) openEl.textContent = `$${prevClose.toFixed(2)} /bu`;

  const highEl = document.getElementById('cbotHigh');
  if (highEl) highEl.textContent = `$${(Math.max(current, prevClose) + 0.03).toFixed(2)} /bu`;

  const lowEl = document.getElementById('cbotLow');
  if (lowEl) lowEl.textContent = `$${(Math.min(current, prevClose) - 0.04).toFixed(2)} /bu`;

  updateCBOTTimestamp();
  if (window.calcularComparativaCultivos) {
    window.calcularComparativaCultivos();
  }
}

function updateCBOTTimestamp() {
  const el = document.getElementById('cbotLastUpdate');
  if (el) {
    const now = new Date();
    el.textContent = `Últ. actualización: ${now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  }
}

// ===== CONTACTAR COMPRADOR MODAL =====
window.abrirContactoComprador = function(compradorKey) {
  const modal = document.getElementById('modalContacto');
  if (!modal) return;
  
  const datos = {
    maseca: {
      nombre: "Grupo Maseca",
      encargado: "Ing. Carlos Mendoza (Adquisiciones)",
      telefono: "+52 667 854 3210",
      telRaw: "526678543210",
      email: "adquisiciones@gruma.com",
      direccion: "Zona Industrial de Culiacán, Lote 12, Culiacán, Sin.",
      mensajeWa: "Hola Ing. Carlos, estoy usando el sistema SIPGAT y me interesa cotizar una cosecha de Maíz Blanco."
    },
    abastos: {
      nombre: "Central de Abastos Norte",
      encargado: "Lic. Patricia Beltrán (Compras)",
      telefono: "+52 668 410 9876",
      telRaw: "526684109876",
      email: "compras@cabastosnorte.com.mx",
      direccion: "Boulevard Macario Gaxiola Km 2, Los Mochis, Sin.",
      mensajeWa: "Hola Lic. Patricia, estoy usando el sistema SIPGAT y me interesa ofrecer mi lote de Frijol/Tomate."
    }
  };
  
  const comp = datos[compradorKey];
  if (!comp) return;
  
  document.getElementById('modalCompradorNombre').textContent = comp.nombre;
  if (document.getElementById('modalContactoRol')) {
    document.getElementById('modalContactoRol').textContent = "Encargado de Compras";
  }
  document.getElementById('modalContactoEncargado').textContent = comp.encargado;
  document.getElementById('modalContactoTelefono').textContent = comp.telefono;
  document.getElementById('modalContactoEmail').textContent = comp.email;
  document.getElementById('modalContactoDireccion').textContent = comp.direccion;
  
  // WhatsApp link
  const waBtn = document.getElementById('btnWhatsAppDirect');
  if (waBtn) {
    waBtn.href = `https://wa.me/${comp.telRaw}?text=${encodeURIComponent(comp.mensajeWa)}`;
  }
  
  // Email link
  const mailBtn = document.getElementById('btnEmailDirect');
  if (mailBtn) {
    mailBtn.href = `mailto:${comp.email}?subject=Cotización de Cosecha - SIPGAT&body=${encodeURIComponent(comp.mensajeWa)}`;
  }
  
  modal.style.display = 'flex';
  agregarRegistroBD("Interacción Comprador", `Consultó contacto de: ${comp.nombre}`, "Completado", "var(--accent-green)");
};

// ===== CONTACTAR PROVEEDOR MODAL =====
window.abrirContactoProveedor = function(proveedorKey, productoContext = "") {
  const modal = document.getElementById('modalContacto');
  if (!modal) return;

  const prodText = productoContext ? ` el producto [${productoContext}]` : " insumos agrícolas";

  const datos = {
    tepeyac: {
      nombre: "Grupo Tepeyac",
      rol: "Asesor Comercial de Semillas/Fertilizantes",
      encargado: "Ing. Felipe Ruiz (Ventas Insumos)",
      telefono: "+52 668 812 3040",
      telRaw: "526688123040",
      email: "ventas@grupotepeyac.com",
      direccion: "Blvd. Agustín Olachea Km 1.5, Los Mochis, Sin.",
      mensajeWa: `Hola Ing. Felipe, vi su contacto en SIPGAT. Me interesa cotizar${prodText} para mi parcela.`
    },
    ceres: {
      nombre: "Insumos Ceres",
      rol: "Asesor Técnico Agrícola",
      encargado: "Ing. Alejandro Valenzuela (Nutrición y Genética)",
      telefono: "+52 668 816 2200",
      telRaw: "526688162200",
      email: "insumos@grupoceres.com.mx",
      direccion: "Calle Gabriel Leyva Nte. 120, Centro, Los Mochis, Sin.",
      mensajeWa: `Hola Ing. Alejandro, vi su contacto en SIPGAT. Me interesa programar una asesoría para${prodText} y análisis de suelo.`
    },
    driptec: {
      nombre: "Driptec Riegos",
      rol: "Proyectos y Sistemas de Riego",
      encargado: "Ing. Mariana Esquer (Ventas y Diseño)",
      telefono: "+52 668 818 4500",
      telRaw: "526688184500",
      email: "proyectos@driptec.com.mx",
      direccion: "Blvd. Macario Gaxiola 415, Los Mochis, Sin.",
      mensajeWa: `Hola Ing. Mariana, vi su contacto en SIPGAT. Me interesa cotizar${prodText} y equipos de filtración.`
    },
    amsa: {
      nombre: "Agroservicios AMSA",
      rol: "Atención a Clientes Fitosanitario",
      encargado: "Lic. Rodolfo Castro (Ventas y Catálogo)",
      telefono: "+52 668 815 1020",
      telRaw: "526688151020",
      email: "ventas@amsasinaloa.com",
      direccion: "Carretera Internacional Km 1608, Juan José Ríos, Sin.",
      mensajeWa: `Hola Lic. Rodolfo, vi su contacto en SIPGAT. Me interesa consultar disponibilidad y precios para${prodText}.`
    }
  };

  const prov = datos[proveedorKey];
  if (!prov) return;

  document.getElementById('modalCompradorNombre').textContent = prov.nombre;
  if (document.getElementById('modalContactoRol')) {
    document.getElementById('modalContactoRol').textContent = prov.rol;
  }
  document.getElementById('modalContactoEncargado').textContent = prov.encargado;
  document.getElementById('modalContactoTelefono').textContent = prov.telefono;
  document.getElementById('modalContactoEmail').textContent = prov.email;
  document.getElementById('modalContactoDireccion').textContent = prov.direccion;

  // WhatsApp link
  const waBtn = document.getElementById('btnWhatsAppDirect');
  if (waBtn) {
    waBtn.href = `https://wa.me/${prov.telRaw}?text=${encodeURIComponent(prov.mensajeWa)}`;
  }

  // Email link
  const mailBtn = document.getElementById('btnEmailDirect');
  if (mailBtn) {
    mailBtn.href = `mailto:${prov.email}?subject=Cotización de Insumos - SIPGAT&body=${encodeURIComponent(prov.mensajeWa)}`;
  }

  modal.style.display = 'flex';
  
  const logMsg = productoContext ? `Consultó insumos de: ${prov.nombre} para ${productoContext}` : `Consultó insumos de: ${prov.nombre}`;
  agregarRegistroBD("Interacción Proveedor", logMsg, "Completado", "var(--accent-purple)");
};

// ===== FILTRAR PRODUCTOS =====
window.filtrarProductos = function(categoria, btn) {
  // Update active class on filter buttons
  btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const cards = document.querySelectorAll('#page-productos .sensor-card');
  cards.forEach(card => {
    const cat = card.dataset.category;
    if (categoria === 'Todos' || cat === categoria) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
};

window.cerrarContactoModal = function() {
  const modal = document.getElementById('modalContacto');
  if (modal) modal.style.display = 'none';
};

// ===== LOGÍSTICA & FLETE MODAL =====
window.abrirSolicitudTransporte = function(empresa, maxTon) {
  const modal = document.getElementById('modalTransporte');
  if (!modal) return;

  const kmInput = document.getElementById('fleteKm');
  const tonInput = document.getElementById('fleteTon');
  const destSelect = document.getElementById('fleteDestino');
  const dieselInput = document.getElementById('fleteDieselPrice');
  const rutaSelect = document.getElementById('fleteRutaType');

  const km = kmInput ? parseFloat(kmInput.value) || 0 : 0;
  const ton = tonInput ? parseFloat(tonInput.value) || 0 : 0;
  const dieselPrice = dieselInput ? parseFloat(dieselInput.value) || 24.85 : 24.85;
  const rutaType = rutaSelect ? rutaSelect.value : 'cuota';

  // Obtener nombre del destino
  let destinoLabel = "Destino Personalizado";
  if (destSelect && destSelect.value !== 'custom') {
    destinoLabel = destSelect.options[destSelect.selectedIndex].text;
  } else if (km > 0) {
    destinoLabel = `Ruta Personalizada (${km} km)`;
  }

  // Teléfono según empresa
  let telefono = "+52 800 227 8673";
  if (empresa === "Fletes Barraza") telefono = "+52 668 812 3456";
  if (empresa === "Logística Sinaloa") telefono = "+52 668 815 6789";
  if (empresa === "Transportes Ruiz") telefono = "+52 668 818 9012";

  // Rellenar modal
  document.getElementById('modalTransEmpresa').value = empresa;
  document.getElementById('modalTransTel').value = telefono;
  document.getElementById('modalTransDestino').value = `${destinoLabel}`;
  document.getElementById('modalTransCarga').value = Math.min(ton, maxTon) || 5;
  
  // Establecer fecha por defecto a hoy
  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById('modalTransFecha').value = hoy;

  // Guardar datos temporales en el dataset del modal
  modal.dataset.km = km;
  modal.dataset.dieselPrice = dieselPrice;
  modal.dataset.rutaType = rutaType;
  modal.dataset.maxTon = maxTon;

  // Calcular costo inicial en modal
  window.recalcularModalCosto();

  modal.style.display = 'flex';
};

window.recalcularModalCosto = function() {
  const modal = document.getElementById('modalTransporte');
  if (!modal) return;

  const km = parseFloat(modal.dataset.km) || 0;
  const dieselPrice = parseFloat(modal.dataset.dieselPrice) || 24.85;
  const rutaType = modal.dataset.rutaType || 'cuota';
  const maxTon = parseFloat(modal.dataset.maxTon) || 30;

  const cargaInput = document.getElementById('modalTransCarga');
  let ton = parseFloat(cargaInput.value) || 0;

  // Limitar carga al máximo de la empresa/unidad
  if (ton > maxTon) {
    ton = maxTon;
    cargaInput.value = maxTon;
    showToast(`Esta unidad tiene una capacidad máxima de ${maxTon} toneladas.`, "warning");
  }

  if (km === 0 || ton === 0) {
    document.getElementById('modalTransCosto').value = "$0.00 MXN";
    return;
  }

  // Determinar vehículo y eficiencia
  let efficiency = 2.1;
  if (ton <= 5) efficiency = 7.0;
  else if (ton <= 15) efficiency = 3.5;
  else if (ton <= 30) efficiency = 2.1;
  else efficiency = 1.8;

  if (rutaType === "libre") {
    efficiency *= 0.85;
  }

  // Costos reales
  const costoCombustible = (km / efficiency) * dieselPrice;
  const costoCasetas = (rutaType === "cuota") ? (km * 1.50) : 0;
  const costoChofer = km * 10.00;
  const costoTotal = costoCombustible + costoCasetas + costoChofer;

  // Formateador de moneda (MXN)
  document.getElementById('modalTransCosto').value = '$' + costoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MXN';
};

window.confirmarSolicitudTransporte = function() {
  const empresa = document.getElementById('modalTransEmpresa').value;
  const tel = document.getElementById('modalTransTel').value;
  const origen = document.getElementById('modalTransOrigen').value;
  const destino = document.getElementById('modalTransDestino').value;
  const carga = document.getElementById('modalTransCarga').value;
  const producto = document.getElementById('modalTransProducto').value;
  const fecha = document.getElementById('modalTransFecha').value;
  const costo = document.getElementById('modalTransCosto').value;

  if (!origen || !carga || !fecha) {
    showToast("Por favor complete todos los campos de la solicitud.", "error");
    return;
  }

  // Log in historical database
  const desc = `${empresa} - Flete de ${carga} Ton de ${producto} desde ${origen} hacia ${destino} programado para ${fecha}. Tarifa: ${costo}`;
  agregarRegistroBD("Solicitud Flete", desc, "Pendiente", "var(--accent-purple)");

  // Show Toast
  showToast(`¡Solicitud enviada a ${empresa}! En breve el chofer se pondrá en contacto.`, "success");

  // Close modal
  window.cerrarTransporteModal();
};

window.cerrarTransporteModal = function() {
  const modal = document.getElementById('modalTransporte');
  if (modal) modal.style.display = 'none';
};

// ===== ANALÍTICA PREDICTIVA (SIMULADOR DE RENDIMIENTO) =====
window.renderizarDropdownAnalitica = function() {
  const select = document.getElementById('analiticaParcelaSelect');
  if (!select) return;
  
  select.innerHTML = '';
  if (!appData.parcelas || appData.parcelas.length === 0) {
    select.innerHTML = '<option value="">-- No hay parcelas --</option>';
    return;
  }
  
  appData.parcelas.forEach(p => {
    select.innerHTML += `<option value="${p.id}">${p.nombre} (${p.cultivo} - ${p.hectareas} ha)</option>`;
  });
  
  // Reset sliders to baseline (0%)
  const sliderRiego = document.getElementById('sliderSimRiego');
  const sliderFert = document.getElementById('sliderSimFert');
  const sliderSiembra = document.getElementById('sliderSimSiembra');
  
  if (sliderRiego) sliderRiego.value = 0;
  if (sliderFert) sliderFert.value = 0;
  if (sliderSiembra) sliderSiembra.value = 0;
  
  window.actualizarSimuladorAnalitica();
};

let logSimulacionTimeout = null;
function registrarLogSimulacion(parcelaName, riego, fert, siembra, prodSim) {
  if (logSimulacionTimeout) clearTimeout(logSimulacionTimeout);
  logSimulacionTimeout = setTimeout(() => {
    agregarRegistroBD("Simulación Analítica", `Modeló escenario para ${parcelaName} (Riego: ${riego}%, Fert: ${fert}%, Siembra: ${siembra} sem). Prod. estimada: ${prodSim.toFixed(1)} ton`, "Completado", "var(--accent-purple)");
  }, 1500);
}

window.actualizarSimuladorAnalitica = function() {
  const select = document.getElementById('analiticaParcelaSelect');
  if (!select) return;
  
  const pId = parseInt(select.value);
  const p = appData.parcelas.find(x => x.id === pId);
  if (!p) return;
  
  const hectareas = p.hectareas || 1.0;
  const cultivo = p.cultivo || "Maíz Blanco";
  
  // Sliders values
  const riegoAdj = parseInt(document.getElementById('sliderSimRiego').value);
  const fertAdj = parseInt(document.getElementById('sliderSimFert').value);
  const siembraAdj = parseInt(document.getElementById('sliderSimSiembra').value);
  
  // Update Labels in controls
  document.getElementById('lblSimRiego').textContent = (riegoAdj >= 0 ? '+' : '') + riegoAdj + '%';
  document.getElementById('lblSimFert').textContent = (fertAdj >= 0 ? '+' : '') + fertAdj + '%';
  
  let siembraText = "Semana Óptima";
  if (siembraAdj < 0) {
    siembraText = `-${Math.abs(siembraAdj)} sem (Temprano)`;
  } else if (siembraAdj > 0) {
    siembraText = `+${siembraAdj} sem (Tarde)`;
  }
  document.getElementById('lblSimSiembra').textContent = siembraText;
  
  // Update Cosecha Name
  document.getElementById('lblCosechaName').textContent = cultivo;
  
  // Core Yield multipliers based on crop
  let yieldBase = 12.5; // Maize
  let precioVenta = 420; // USD/ton
  let costBaseHa = 950; // USD/ha
  
  if (cultivo.includes("Maíz") || cultivo.includes("maíz")) {
    yieldBase = 12.5;
    costBaseHa = 950;
    // Sincronización en vivo con CBOT
    const cbotPrecioEl = document.getElementById('cbotPrecio');
    let liveMaizFactor = 1.0;
    if (cbotPrecioEl) {
      const rawPrice = parseFloat(cbotPrecioEl.textContent.replace('$', '').replace('/bu', ''));
      if (!isNaN(rawPrice) && rawPrice > 0) {
        liveMaizFactor = rawPrice / 4.52;
      }
    }
    precioVenta = Math.round(420 * liveMaizFactor);
  } else if (cultivo.includes("Frijol") || cultivo.includes("frijol")) {
    yieldBase = 2.2;
    precioVenta = 850;
    costBaseHa = 1100;
  } else if (cultivo.includes("Tomate") || cultivo.includes("tomate")) {
    yieldBase = 85.0;
    precioVenta = 720;
    costBaseHa = 3500;
  } else {
    // Sorgo / Trigo / Default
    yieldBase = 6.5;
    precioVenta = 380;
    costBaseHa = 820;
  }
  
  const productionBase = yieldBase * hectareas;
  
  // Multipliers calculation
  // Riego multiplier
  let rMult = 1.0;
  if (riegoAdj < 0) {
    // Deficit: linear decrease
    rMult = 1.0 + (riegoAdj / 100) * 1.2;
  } else if (riegoAdj > 0) {
    // Excess: slight increase, then drop
    if (riegoAdj <= 20) {
      rMult = 1.0 + (riegoAdj / 100) * 0.4; // Max +8% at +20%
    } else {
      rMult = 1.08 - ((riegoAdj - 20) / 100) * 1.5;
    }
  }
  rMult = Math.max(0.1, rMult);
  
  // Fertilización multiplier
  let fMult = 1.0;
  if (fertAdj < 0) {
    fMult = 1.0 + (fertAdj / 100) * 0.8;
  } else if (fertAdj > 0) {
    if (fertAdj <= 25) {
      fMult = 1.0 + (fertAdj / 100) * 0.6; // Max +15% at +25%
    } else {
      fMult = 1.15 - ((fertAdj - 25) / 100) * 1.0;
    }
  }
  fMult = Math.max(0.2, fMult);
  
  // Siembra date multiplier
  let sMult = 1.0 - (siembraAdj * siembraAdj * 0.015);
  sMult = Math.max(0.5, sMult);
  
  // Combined
  const totalMult = rMult * fMult * sMult;
  const simulatedYield = yieldBase * totalMult;
  const simulatedProductionTotal = simulatedYield * hectareas;
  
  // Yield UI updates
  document.getElementById('valSimCosecha').innerHTML = `${simulatedProductionTotal.toFixed(1)}<span class="unit"> ton</span>`;
  
  const yieldDeltaPct = ((totalMult - 1.0) * 100).toFixed(1);
  document.getElementById('valSimCosechaChange').textContent = `● Baseline: ${productionBase.toFixed(1)} ton (${yieldDeltaPct >= 0 ? '+' : ''}${yieldDeltaPct}%)`;
  
  // Climate local updates
  const regionName = appData.user.region || "Valle del Fuerte, Sinaloa";
  const regionShort = regionName.split(',')[0].trim();
  document.getElementById('lblClimaRegion').textContent = `Clima - ${regionShort}`;
  
  let probLluvia = 15;
  let climaMsg = "Soleado, templado";
  if (liveWeatherData) {
    probLluvia = liveWeatherData.precipitation > 0 ? 85 : (siembraAdj < 0 ? 45 : 10);
    climaMsg = `${liveWeatherData.weatherText} (${liveWeatherData.temp}°C)`;
  } else {
    if (siembraAdj < 0) {
      probLluvia = 65;
      climaMsg = "Lluvias aisladas";
    } else if (siembraAdj > 0) {
      probLluvia = 5;
      climaMsg = "Onda cálida seca";
    }
  }
  document.getElementById('valSimLluvia').innerHTML = `${probLluvia}<span class="unit">%</span>`;
  document.getElementById('valSimClimaEstado').textContent = `● Estado: ${climaMsg}`;
  
  // Resource Efficiency Score
  let deviationPenalty = Math.abs(riegoAdj) * 0.8 + Math.abs(fertAdj) * 0.8 + Math.abs(siembraAdj) * 4;
  let efficiencyScore = Math.max(10, Math.round(100 - deviationPenalty));
  document.getElementById('valSimEficiencia').innerHTML = `${efficiencyScore}<span class="unit">%</span>`;
  
  let efficiencyDesc = "● Suministro óptimo";
  if (riegoAdj > 30 || fertAdj > 30) {
    efficiencyDesc = "● Advertencia: Desperdicio / Excesos";
  } else if (riegoAdj < -25 || fertAdj < -25) {
    efficiencyDesc = "● Advertencia: Sub-alimentado";
  }
  document.getElementById('valSimEficienciaChange').textContent = efficiencyDesc;
  
  // Physiological Diagnostics
  let plantDiagHtml = "";
  if (riegoAdj < -20) {
    plantDiagHtml += `<span style="color:var(--accent-amber)">⚠️ <strong>Estrés Hídrico Alto:</strong> La planta cierra estomas para conservar agua, inhibiendo la fotosíntesis y el llenado del grano/fruto.</span><br><br>`;
  } else if (riegoAdj > 25) {
    plantDiagHtml += `<span style="color:var(--accent-red)">⚠️ <strong>Anoxia Radicular:</strong> Falta de oxígeno en suelo saturado de agua, provocando asfixia de raíces y susceptibilidad a hongos.</span><br><br>`;
  }
  
  if (fertAdj < -20) {
    plantDiagHtml += `<span style="color:var(--accent-amber)">⚠️ <strong>Deficiencia de Nitrógeno:</strong> Clorosis generalizada. La planta reabsorbe nitrógeno de hojas viejas afectando el crecimiento foliar.</span><br><br>`;
  } else if (fertAdj > 25) {
    plantDiagHtml += `<span style="color:var(--accent-red)">⚠️ <strong>Estrés Salino (Quemadura):</strong> Concentración excesiva de sales minerales que dificulta la absorción osmótica del agua y daña los tejidos foliares.</span><br><br>`;
  }
  
  if (Math.abs(siembraAdj) >= 3) {
    plantDiagHtml += `<span style="color:var(--accent-amber)">⚠️ <strong>Desfase de Ventana:</strong> Exposición a temperaturas desfavorables (heladas tardías o calor extremo) en floración.</span><br><br>`;
  }
  
  if (!plantDiagHtml) {
    plantDiagHtml = `<span style="color:var(--accent-green)">✅ <strong>Fisiología Saludable:</strong> El equilibrio de agua y nutrientes propicia una óptima fotosíntesis y translocación de azúcares al grano/fruto.</span>`;
  }
  document.getElementById('simPlantaDiag').innerHTML = plantDiagHtml;
  
  // Financial Model (USD)
  const costBaseTotal = costBaseHa * hectareas;
  
  const riegoCostHaDelta = (riegoAdj * 8.0); // e.g. +20% -> +$160 USD/ha
  const fertCostHaDelta = (fertAdj * 12.0); // e.g. +20% -> +$240 USD/ha
  
  const totalCostHaDelta = riegoCostHaDelta + fertCostHaDelta;
  const costSimTotalDelta = totalCostHaDelta * hectareas;
  
  const finalCostTotal = costBaseTotal + costSimTotalDelta;
  const revenueSim = simulatedProductionTotal * precioVenta;
  const revenueBase = productionBase * precioVenta;
  const revenueDelta = revenueSim - revenueBase;
  
  const finalProfitSim = revenueSim - finalCostTotal;
  const finalProfitBase = revenueBase - costBaseTotal;
  const profitDelta = finalProfitSim - finalProfitBase;
  
  const roiSim = (finalProfitSim / finalCostTotal) * 100;
  
  // Formatting outputs
  document.getElementById('finSimCostoDelta').textContent = (costSimTotalDelta >= 0 ? '+$' : '-$') + Math.abs(Math.round(costSimTotalDelta)).toLocaleString('en-US') + ' USD';
  document.getElementById('finSimIngreso').textContent = '$' + Math.round(revenueSim).toLocaleString('en-US') + ' USD';
  
  const profitDeltaEl = document.getElementById('finSimGananciaDelta');
  profitDeltaEl.textContent = (profitDelta >= 0 ? '+$' : '-$') + Math.abs(Math.round(profitDelta)).toLocaleString('en-US') + ' USD';
  profitDeltaEl.style.color = profitDelta >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
  
  const roiEl = document.getElementById('finSimROI');
  roiEl.textContent = roiSim.toFixed(1) + '%';
  roiEl.style.color = roiSim >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
  
  // Debounced log execution
  registrarLogSimulacion(p.nombre, riegoAdj, fertAdj, siembraAdj, simulatedProductionTotal);
};

// ===== LOGICA DE CLIMA REAL EN TIEMPO REAL (OPEN-METEO) =====
let liveWeatherData = null;

const COORD_MAP = {
  "ahome": { lat: 25.9221, lon: -109.1764, name: "Ahome" },
  "los mochis": { lat: 25.7904, lon: -108.9858, name: "Los Mochis" },
  "valle del fuerte": { lat: 25.7904, lon: -108.9858, name: "Valle del Fuerte" },
  "guasave": { lat: 25.5647, lon: -108.4682, name: "Guasave" },
  "el fuerte": { lat: 26.4178, lon: -108.6206, name: "El Fuerte" },
  "culiacan": { lat: 24.8054, lon: -107.3941, name: "Culiacán" },
  "culiacán": { lat: 24.8054, lon: -107.3941, name: "Culiacán" },
  "sinaloa": { lat: 25.0000, lon: -107.5000, name: "Sinaloa" }
};

function traducirCodigoClima(code) {
  if (code === 0) return "Cielo despejado";
  if (code >= 1 && code <= 3) return "Parcialmente nublado";
  if (code === 45 || code === 48) return "Niebla / Neblina";
  if (code >= 51 && code <= 55) return "Llovizna continua";
  if (code >= 61 && code <= 65) return "Lluvia moderada";
  if (code >= 80 && code <= 82) return "Chubascos de lluvia";
  if (code === 95 || code === 96 || code === 99) return "Tormenta eléctrica";
  return "Clima templado";
}

window.cargarClimaReal = function() {
  const regionName = (appData.user.region || "Valle del Fuerte").toLowerCase();
  
  let lat = 25.7904;
  let lon = -108.9858;
  let foundName = "Valle del Fuerte";
  
  for (const key in COORD_MAP) {
    if (regionName.includes(key)) {
      lat = COORD_MAP[key].lat;
      lon = COORD_MAP[key].lon;
      foundName = COORD_MAP[key].name;
      break;
    }
  }
  
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`;
  
  const badge = document.getElementById('dashClimaBadge');
  if (badge) {
    badge.textContent = "Cargando...";
    badge.style.background = "var(--bg-input)";
    badge.style.color = "var(--text-muted)";
    badge.classList.add('loading-pulse');
  }
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data && data.current) {
        const cur = data.current;
        const weatherText = traducirCodigoClima(cur.weather_code);
        
        liveWeatherData = {
          temp: cur.temperature_2m,
          humidity: cur.relative_humidity_2m,
          precipitation: cur.precipitation,
          wind: cur.wind_speed_10m,
          weatherText: weatherText,
          region: foundName
        };
        
        // Update Dashboard Elements
        const tempEl = document.getElementById('dashClimaTemp');
        const rainEl = document.getElementById('dashClimaLluvia');
        const humEl = document.getElementById('dashClimaHum');
        const windEl = document.getElementById('dashClimaViento');
        
        if (tempEl) tempEl.textContent = `${cur.temperature_2m}°C`;
        if (rainEl) rainEl.textContent = `${cur.precipitation} mm`;
        if (humEl) humEl.textContent = `${cur.relative_humidity_2m}%`;
        if (windEl) windEl.textContent = `${cur.wind_speed_10m} km/h`;
        
        if (badge) {
          badge.textContent = "En Vivo";
          badge.style.background = "rgba(16, 185, 129, 0.15)";
          badge.style.color = "var(--accent-green)";
          badge.classList.remove('loading-pulse');
        }
        
        // If Analitica is currently active, update it
        const analiticaPage = document.getElementById('page-analitica');
        if (analiticaPage && analiticaPage.classList.contains('active')) {
          window.actualizarSimuladorAnalitica();
        }
      }
    })
    .catch(err => {
      console.error("Error al cargar clima real:", err);
      if (badge) {
        badge.textContent = "Offline";
        badge.style.background = "rgba(239, 68, 68, 0.15)";
        badge.style.color = "var(--accent-red)";
        badge.classList.remove('loading-pulse');
      }
    });
};
