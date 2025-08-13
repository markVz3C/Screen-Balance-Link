// Variables de estadísticas y alertas
let tiempoEnPantalla = 0;
let tiempoTotal = 0;
let alertas = [];

// Función para agregar alertas sin repetirlas
function agregarAlerta(mensaje) {
    if (!alertas.includes(mensaje)) {
        alertas.push(mensaje);
        actualizarContenedorAlertas();
    }
}

// Función para actualizar contenedor de alertas
function actualizarContenedorAlertas() {
    const contenedor = document.getElementById("alertas-container");

    if (alertas.length === 0) {
        contenedor.innerHTML = '<div class="no-alerts">No hay alertas activas</div>';
    } else {
        contenedor.innerHTML = alertas.map(a => `<p><i class="fas fa-exclamation-circle"></i> ${a}</p>`).join("");
    }
}

// Función para actualizar estadísticas
function actualizarEstadisticas() {
    document.getElementById('tiempo-actual').textContent = tiempoTotal;
    document.getElementById('sesion-actual').textContent = tiempoEnPantalla;
}

// ---- Gráfico con Chart.js ----
const ctx = document.getElementById('graficoTiempo').getContext('2d');
const grafico = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Tiempo en pantalla (min)',
            data: [],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: 'rgba(0,0,0,0.1)', borderDash: [5,5] }, ticks: { color: '#666', maxTicksLimit: 6 } },
            y: { grid: { color: 'rgba(0,0,0,0.1)', borderDash: [5,5] }, ticks: { color: '#666', maxTicksLimit: 5 }, beginAtZero: true }
        },
        elements: { point: { hoverBorderWidth: 3 } },
        interaction: { intersect: false, mode: 'index' }
    }
});

// Función para actualizar gráfico
function actualizarGrafico() {
    const ahora = new Date().toLocaleTimeString();
    grafico.data.labels.push(ahora);
    grafico.data.datasets[0].data.push(tiempoEnPantalla);

    if (grafico.data.labels.length > 10) {
        grafico.data.labels.shift();
        grafico.data.datasets[0].data.shift();
    }

    grafico.update('none');
}

// Inicializar estadísticas y contenedor de alertas
actualizarEstadisticas();
actualizarContenedorAlertas();

// ---- DATOS DEL SERVIDOR ----
async function obtenerDatos() {
    try {
        const respuesta = await fetch('http://172.17.31.156:5000/postura'); // Asegúrate que tu Flask devuelva JSON aquí
        const datos = await respuesta.json();

        // Alertas de postura
        if (datos.mala_postura) {
            agregarAlerta("¡Mala postura detectada! Ajusta tu posición");
        }

        // Actualizar tiempo en pantalla
        if (datos.tiempo_en_pantalla !== undefined) {
            tiempoEnPantalla = datos.tiempo_en_pantalla;
            tiempoTotal = datos.tiempo_total || tiempoTotal; // si envía tiempo total
            actualizarEstadisticas();
            actualizarGrafico();
        }

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

// Llamar al servidor cada 5 segundos
setInterval(obtenerDatos, 5000);
