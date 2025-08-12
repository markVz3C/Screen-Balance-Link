// Simulación de recepción de datos
let tiempoEnPantalla = 0;
let tiempoTotal = 0;
let alertas = [];

// Función para agregar alertas
function agregarAlerta(mensaje) {
    alertas.push(mensaje);
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

// Simular incremento de tiempo y alertas
setInterval(() => {
    tiempoEnPantalla += 5;
    tiempoTotal += 5;

    if (tiempoEnPantalla >= 60) {
        agregarAlerta("Has estado 1 hora frente a la pantalla. Tómate un descanso.");
        tiempoEnPantalla = 0;
    }

    actualizarEstadisticas();
    actualizarGrafico();
}, 5000);

// Gráfico con Chart.js mejorado
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
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    borderDash: [5, 5]
                },
                ticks: {
                    color: '#666',
                    maxTicksLimit: 6
                }
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    borderDash: [5, 5]
                },
                ticks: {
                    color: '#666',
                    maxTicksLimit: 5
                },
                beginAtZero: true
            }
        },
        elements: {
            point: {
                hoverBorderWidth: 3
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    }
});

function actualizarGrafico() {
    const ahora = new Date().toLocaleTimeString();
    grafico.data.labels.push(ahora);
    grafico.data.datasets[0].data.push(tiempoEnPantalla);

    // Mantener solo los últimos 10 puntos
    if (grafico.data.labels.length > 10) {
        grafico.data.labels.shift();
        grafico.data.datasets[0].data.shift();
    }

    grafico.update('none');
}

// Inicializar estadísticas
actualizarEstadisticas();