// index-scripts.js

// --- Importações de Módulos Firebase ---
import { auth, database } from './main.js'; // Importa as instâncias de auth e database do seu main.js
import { get, ref, query, orderByChild, equalTo } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

// --- Variáveis Globais para o Mapa ---
let mapaIndex = null;
let marcadorLocalizacaoUsuarioIndex = null; // Marcador para a localização do usuário no mapa do index
let currentUserIndex = null; // Para armazenar o usuário logado para o botão dinâmico

const DEFAULT_LAT_INDEX = -23.5505; // Centro padrão para São Paulo
const DEFAULT_LON_INDEX = -46.6333;
const DEFAULT_ZOOM_INDEX = 13;

const tipoParaCorIndex = { // Cores para os tipos de pontos (reutilizado do formulario.html)
    'Posto Eletro': '#FF0000',
    'Eco Posto': '#008000',
    'Descarte de Pilha': '#800080',
    'Reciclagem': '#FFA500',
    'Óleo de Cozinha': '#00CED1',
    'Roupas/Têxtil': '#FF69B4',
    'Pneu': '#696969',
    'Outros': '#000000'
};

// --- Variáveis Globais para o Carrossel ---
const carouselSlide = document.getElementById('carouselSlide');
const carouselPrevBtn = document.getElementById('carouselPrevBtn');
const carouselNextBtn = document.getElementById('carouselNextBtn');

let currentSlideIndex = 0;
let autoSlideInterval;

// Dados do carrossel: imagens e links
const carouselData = [
    { src: 'https://via.placeholder.com/800x400/FF5733/FFFFFF?text=Tema+1:+Reciclagem', link: 'exemplo1.html', alt: 'Imagem de Reciclagem' },
    { src: 'https://via.placeholder.com/800x400/33FF57/FFFFFF?text=Tema+2:+Energia+Sustentavel', link: 'exemplo2.html', alt: 'Imagem de Energia Sustentável' },
    { src: 'https://via.placeholder.com/800x400/3357FF/FFFFFF?text=Tema+3:+Preservacao+da+Agua', link: 'exemplo3.html', alt: 'Imagem de Preservação da Água' },
    { src: 'https://via.placeholder.com/800x400/FF33FF/FFFFFF?text=Tema+4:+Biodiversidade', link: 'exemplo4.html', alt: 'Imagem de Biodiversidade' },
    { src: 'https://via.placeholder.com/800x400/FFFF33/333333?text=Tema+5:+Poluicao+Zero', link: 'exemplo5.html', alt: 'Imagem de Poluição Zero' }
    // Adicione mais até 10 imagens se desejar
];

// --- Funções do Carrossel ---
function loadCarouselImages() {
    carouselSlide.innerHTML = ''; // Limpa qualquer conteúdo pré-existente
    carouselData.forEach(item => {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt;
        img.style.width = '100%'; // Garante que cada imagem ocupe a largura do slide
        img.addEventListener('click', () => {
            window.location.href = item.link;
        });
        carouselSlide.appendChild(img);
    });
    // Ajusta a largura do carouselSlide para caber todas as imagens
    carouselSlide.style.width = (carouselData.length * 100) + '%';
}

function showSlide(index) {
    if (index >= carouselData.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = carouselData.length - 1;
    } else {
        currentSlideIndex = index;
    }
    const offset = -currentSlideIndex * (100 / carouselData.length); // Calcula o deslocamento percentual
    carouselSlide.style.transform = `translateX(${offset}%)`;
}


function nextSlide() {
    showSlide(currentSlideIndex + 1);
    resetAutoSlide();
}

function prevSlide() {
    showSlide(currentSlideIndex - 1);
    resetAutoSlide();
}

function startAutoSlide() {
    stopAutoSlide(); // Garante que apenas um intervalo esteja ativo
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 15000); // 15 segundos
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// --- Funções do Mapa ---

// Função para criar ícones coloridos no mapa (reutilizado do formulario.html)
function criarIconeColoridoIndex(tipo, cor) {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${cor}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid #333;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
}

// Função para preencher a legenda do mapa (reutilizado do formulario.html)
function preencherLegendaIndex() {
    const legendaDiv = document.getElementById('mapIndexLegend');
    let html = '<h4>Legenda de Pontos</h4>';

    for (const tipo in tipoParaCorIndex) {
        const cor = tipoParaCorIndex[tipo];
        html += `
            <div class="legend-item">
                <div class="legend-color-box" style="background-color: ${cor};"></div>
                <span>${tipo}</span>
            </div>
        `;
    }
    legendaDiv.innerHTML = html;
}

// Inicializar Mapa e carregar pontos ATIVOS
async function inicializarMapaIndex(lat, lon, zoom = DEFAULT_ZOOM_INDEX) {
    const center = [lat || DEFAULT_LAT_INDEX, lon || DEFAULT_LON_INDEX];

    if (mapaIndex) {
        mapaIndex.remove(); // Remove o mapa existente se já estiver inicializado
    }

    mapaIndex = L.map('mapaIndex').setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapaIndex);

    try {
        const pontosAtivosQuery = query(ref(database, 'pontos'), orderByChild('ativo'), equalTo(true));
        const snapshot = await get(pontosAtivosQuery);

        if (snapshot.exists()) {
            const pontosData = snapshot.val();
            console.log("Pontos ativos carregados para o mapa do Index:", pontosData);
            Object.keys(pontosData).forEach(key => {
                const ponto = pontosData[key];
                const cor = tipoParaCorIndex[ponto.tipoPonto] || '#000000';
                const icone = criarIconeColoridoIndex(ponto.tipoPonto, cor);

                if (typeof ponto.latitude === 'number' && typeof ponto.longitude === 'number') {
                    L.marker([ponto.latitude, ponto.longitude], { icon: icone })
                        .addTo(mapaIndex)
                        .bindPopup(`<b>${ponto.nome}</b><br>Tipo: ${ponto.tipoPonto}<br>Endereço: ${ponto.rua || 'N/A'}, ${ponto.numero || 'N/A'} - ${ponto.cidade || 'N/A'}/${ponto.estado || 'N/A'}`);
                } else {
                    console.warn(`Ponto "${ponto.nome}" (ID: ${key}) possui coordenadas inválidas e não será exibido no mapa do Index.`);
                }
            });
        } else {
            console.log("Nenhum ecoponto ativo encontrado para o mapa do Index.");
        }
    } catch (error) {
        console.error("Erro ao carregar ecopontos para o mapa do Index:", error);
    }

    mapaIndex.invalidateSize(); // Garante que o mapa renderize corretamente
    preencherLegendaIndex();
}

// Função para localizar usuário no mapa do index
function localizarUsuarioNoMapaIndex() {
    const btnLocateUserMap = document.getElementById('btnLocateUserMap');
    const originalText = 'Localizar Minha Posição';
    const msgElement = document.getElementById('mapIndexLegend'); // Usar a legenda para mensagens temporárias

    btnLocateUserMap.textContent = 'Localizando...';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Centraliza o mapa na localização do usuário
                mapaIndex.setView([lat, lon], 15); 

                // Adiciona um marcador de localização do usuário
                if (marcadorLocalizacaoUsuarioIndex) {
                    mapaIndex.removeLayer(marcadorLocalizacaoUsuarioIndex);
                }
                marcadorLocalizacaoUsuarioIndex = L.marker([lat, lon], {
                    icon: L.divIcon({
                        className: 'custom-user-icon',
                        html: `<div style="font-size: 1.5em; color: #ff0000;">📍</div>`, // Ícone vermelho
                        iconSize: [25, 25],
                        iconAnchor: [12, 25]
                    })
                }).addTo(mapaIndex)
                  .bindPopup(`Você está aqui! (Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)})`).openPopup();

                btnLocateUserMap.textContent = 'Localizado!';
                setTimeout(() => { btnLocateUserMap.textContent = originalText; }, 3000);
            },
            (error) => {
                console.error("Erro de Geolocalização no mapa do Index:", error);
                btnLocateUserMap.textContent = 'Erro!';
                alert(`Erro ao localizar: ${error.message}.`);
                setTimeout(() => { btnLocateUserMap.textContent = originalText; }, 3000);
            }
        );
    } else {
        alert('Seu navegador não suporta geolocalização.');
        btnLocateUserMap.textContent = originalText;
    }
}

// Função para atualizar o botão de "Adicionar Ponto" dinamicamente
function updateAddPointCallToAction(user) {
    const addPointCallToAction = document.getElementById('addPointCallToAction');
    const addPointHeader = document.getElementById('addPointHeader');

    if (user) {
        // Usuário logado
        addPointHeader.textContent = "Participe! Adicione um novo ponto:";
        addPointCallToAction.textContent = "Acessar Formulário de Contribuição";
        addPointCallToAction.href = "formulario.html";
    } else {
        // Usuário não logado
        addPointHeader.textContent = "Quer adicionar um novo ponto?";
        addPointCallToAction.textContent = "Login ou Cadastre-se para Contribuir";
        addPointCallToAction.href = "login.html"; // Redireciona para login
    }
}


// --- Lógica Principal: DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    // Carrossel
    loadCarouselImages();
    showSlide(currentSlideIndex);
    startAutoSlide(); // Inicia o carrossel automático

    carouselPrevBtn.addEventListener('click', prevSlide);
    carouselNextBtn.addEventListener('click', nextSlide);

    // Mapa
    inicializarMapaIndex(); // Inicializa o mapa com a posição padrão

    // Localizar Usuário no Mapa
    const btnLocateUserMap = document.getElementById('btnLocateUserMap');
    if (btnLocateUserMap) {
        btnLocateUserMap.addEventListener('click', localizarUsuarioNoMapaIndex);
    }

    // Gerenciar o botão de "Adicionar Ponto" com base no status de autenticação
    onAuthStateChanged(auth, (user) => {
        currentUserIndex = user; // Atualiza a variável global do usuário
        updateAddPointCallToAction(user);
    });
});

