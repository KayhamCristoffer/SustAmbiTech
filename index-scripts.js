import { auth, database } from './main.js';
import { get, ref, query, orderByChild, equalTo } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

let mapaIndex = null;
let marcadorLocalizacaoUsuarioIndex = null; 
let currentUserIndex = null;

const DEFAULT_LAT_INDEX = -23.5505; 
const DEFAULT_LON_INDEX = -46.6333;
const DEFAULT_ZOOM_INDEX = 13;

const tipoParaCorIndex = { 
    'Posto Eletro': '#FF0000',
    'Eco Posto': '#008000',
    'Descarte de Pilha': '#800080',
    'Reciclagem': '#FFA500',
    'Óleo de Cozinha': '#00CED1',
    'Roupas/Têxtil': '#FF69B4',
    'Pneu': '#696969',
    'Outros': '#000000'
};

const carouselSlide = document.getElementById('carouselSlide');
const carouselPrevBtn = document.getElementById('carouselPrevBtn');
const carouselNextBtn = document.getElementById('carouselNextBtn');

let currentSlideIndex = 0;
let autoSlideInterval;

const carouselData = [
    { src: './img/img1.png', link: './servicos.html#monitoramento-ambiental', alt: 'Imagem de Monitoramento Ambiental' },
    { src: './img/img2.png', link: './servicos.html#energia-limpa', alt: 'Imagem de Energia Sustentável e Limpa' },
    { src: './img/img3.png', link: './servicos.html#consumo-consciente', alt: 'Imagem de Consumo e Economia Consciente' },
    { src: './img/img4.png', link: './servicos.html#reciclagem-inteligente', alt: 'Imagem de Reciclagem Inteligente' },
    { src: './img/img5.png', link: './servicos.html#mobilidade-sustentavel', alt: 'Imagem de Mobilidade Sustentável' },
    { src: './img/img6.png', link: './servicos.html#politicas-legislacao', alt: 'Imagem de Políticas & Legislação' },
    { src: './img/img7.png', link: './servicos.html#educacao-verde', alt: 'Imagem de Educação Verde' },
    { src: './img/img8.png', link: '#carros-eletricos', alt: 'Imagem de Carros Elétricos' }
];

function loadCarouselImages() {
    carouselSlide.innerHTML = '';
    
    carouselData.forEach(item => {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt;
        
        img.style.width = (100 / carouselData.length) + '%'; 
        
        img.addEventListener('click', () => {
            window.location.href = item.link;
        });
        carouselSlide.appendChild(img);
    });
    
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
    
    const offset = -currentSlideIndex * (100 / carouselData.length);
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
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 7000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

function criarIconeColoridoIndex(tipo, cor) {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${cor}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid #333;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
}

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

async function inicializarMapaIndex(lat, lon, zoom = DEFAULT_ZOOM_INDEX) {
    const center = [lat || DEFAULT_LAT_INDEX, lon || DEFAULT_LON_INDEX];

    if (mapaIndex) {
        mapaIndex.remove();
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
                        .bindPopup(`
                            <b>${ponto.nome}</b><br>
                            Tipo: ${ponto.tipoPonto}<br>
                            Endereço: ${ponto.rua || 'N/A'}, ${ponto.numero || 'S/N'}<br>
                            Bairro: ${ponto.bairro || 'N/A'}<br>
                            Cidade: ${ponto.cidade || 'N/A'} - ${ponto.estado || 'N/A'}<br>
                            CEP: ${ponto.cep || 'N/A'}
                        `);
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

    mapaIndex.invalidateSize();
    preencherLegendaIndex();
}

function localizarUsuarioNoMapaIndex() {
    const btnLocateUserMap = document.getElementById('btnLocateUserMap');
    const originalText = 'Localizar Minha Posição';
    const msgElement = document.getElementById('mapIndexLegend');

    btnLocateUserMap.textContent = 'Localizando...';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                mapaIndex.setView([lat, lon], 15); 

                if (marcadorLocalizacaoUsuarioIndex) {
                    mapaIndex.removeLayer(marcadorLocalizacaoUsuarioIndex);
                }
                marcadorLocalizacaoUsuarioIndex = L.marker([lat, lon], {
                    icon: L.divIcon({
                        className: 'custom-user-icon',
                        html: `<div style="font-size: 1.5em; color: #ff0000;">📍</div>`,
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

function updateAddPointCallToAction(user) {
    const addPointCallToAction = document.getElementById('addPointCallToAction');
    const addPointHeader = document.getElementById('addPointHeader');

    if (user) {
        addPointHeader.textContent = "Participe! Adicione um novo ponto:";
        addPointCallToAction.textContent = "Acessar Formulário de Contribuição";
        addPointCallToAction.href = "formulario.html";
    } else {
        addPointHeader.textContent = "Quer adicionar um novo ponto?";
        addPointCallToAction.textContent = "Login ou Cadastre-se para Contribuir";
        addPointCallToAction.href = "login.html";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCarouselImages();
    showSlide(currentSlideIndex);
    startAutoSlide();

    carouselPrevBtn.addEventListener('click', prevSlide);
    carouselNextBtn.addEventListener('click', nextSlide);

    inicializarMapaIndex();

    const btnLocateUserMap = document.getElementById('btnLocateUserMap');
    if (btnLocateUserMap) {
        btnLocateUserMap.addEventListener('click', localizarUsuarioNoMapaIndex);
    }

    onAuthStateChanged(auth, (user) => {
        currentUserIndex = user;
        updateAddPointCallToAction(user);
    });
});