// mobilidade.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica para Gráficos Chart.js ---
    const years = ['2020', '2021', '2022', '2023', '2024'];
    const evData = [5000, 12000, 28000, 60000, 167000];
    const chargingStationData = [1500, 3000, 5000, 8000, 10600];

    // Gráfico 1: Crescimento de Veículos Elétricos (Linhas com Marcadores)
    const evGrowthChartCtx = document.getElementById('evGrowthChart');
    if (evGrowthChartCtx) {
        new Chart(evGrowthChartCtx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'Veículos Elétricos (Brasil)',
                    data: evData,
                    borderColor: '#aeea00', // Sua primary-clr
                    backgroundColor: 'rgba(174, 234, 0, 0.2)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 5,
                    pointBackgroundColor: '#aeea00',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 7,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Crescimento de Veículos Elétricos no Brasil',
                        color: '#2c3e50' // dark-heading-clr do card
                    },
                    legend: {
                        labels: {
                            color: '#5b6f82' // dark-text-clr do card
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Ano',
                            color: '#5b6f82'
                        },
                        ticks: {
                            color: '#5b6f82'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Número de Veículos',
                            color: '#5b6f82'
                        },
                        ticks: {
                            color: '#5b6f82'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        }
                    }
                }
            }
        });
    }

    // Gráfico 2: Expansão de Eletropostos (Colunas Agrupadas)
    const chargingStationChartCtx = document.getElementById('chargingStationChart');
    if (chargingStationChartCtx) {
        new Chart(chargingStationChartCtx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'Eletropostos Instalados',
                    data: chargingStationData,
                    backgroundColor: '#aeea00', // Sua primary-clr
                    borderColor: '#aeea00',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Expansão de Eletropostos no Brasil',
                        color: '#2c3e50'
                    },
                    legend: {
                        labels: {
                            color: '#5b6f82'
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Ano',
                            color: '#5b6f82'
                        },
                        ticks: {
                            color: '#5b6f82'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Número de Eletropostos',
                            color: '#5b6f82'
                        },
                        ticks: {
                            color: '#5b6f82'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        }
                    }
                }
            }
        });
    }


    // --- Lógica para Janela Modal (copiada do exemplo.js) ---
    // Apenas para caso você adicione data-modal-target em algum card futuramente
    const serviceCards = document.querySelectorAll('.grid-item[data-modal-target]');
    const modalOverlay = document.getElementById('serviceModalOverlay');
    const modalCloseButton = document.getElementById('modalCloseButton');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    // Conteúdo detalhado para cada modal (deve ser preenchido se for usar modais nesta página)
    const modalContentData = {
        // Exemplo:
        // "vantagens-ve": {
        //     title: "Vantagens dos Veículos Elétricos",
        //     body: "<p>Detalhes sobre as vantagens...</p>"
        // },
        // "desafios-ve": {
        //     title: "Desafios dos Veículos Elétricos",
        //     body: "<p>Detalhes sobre os desafios...</p>"
        // }
    };

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const modalTargetId = card.dataset.modalTarget;
            const content = modalContentData[modalTargetId];

            if (content) {
                modalTitle.textContent = content.title;
                modalBody.innerHTML = content.body;
                modalOverlay.classList.add('active');
            }
        });
    });

    if (modalCloseButton) { // Verificar se o botão existe antes de adicionar listener
        modalCloseButton.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }

    if (modalOverlay) { // Verificar se o overlay existe
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }
});
