// exemplo.js

document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.grid-item[data-modal-target]');
    const modalOverlay = document.getElementById('serviceModalOverlay');
    const modalCloseButton = document.getElementById('modalCloseButton');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    // Conteúdo detalhado para cada modal (poderia vir de um JSON ou API)
    const modalContentData = {
        "sensor-baixo-custo": {
            title: "Sensores de Baixo Custo: Detalhes",
            body: `
                <p>Pesquise sobre a viabilidade e a precisão de sensores de baixo custo (como os baseados em Arduino ou Raspberry Pi) que medem parâmetros como material particulado (PM2.5 e PM10), ozônio (O3), dióxido de nitrogênio (NO2) e dióxido de enxofre (SO2) na qualidade do ar. Para a água, inclua sensores que medem pH, turbidez, temperatura e oxigênio dissolvido.</p>
                <ul>
                    <li><strong>PM2.5 e PM10:</strong> Material particulado fino e grosso.</li>
                    <li><strong>Gases:</strong> Ozônio (O3), dióxido de nitrogênio (NO2), dióxido de enxofre (SO2).</li>
                    <li><strong>Parâmetros da Água:</strong> pH, turbidez, temperatura e oxigênio dissolvido.</li>
                </ul>
                <p>Estes sensores são ideais para monitoramento cidadão e projetos educacionais, embora sua precisão possa variar em comparação com equipamentos profissionais.</p>
            `
        },
        "sensor-profissional": {
            title: "Sensores de Nível Profissional: Detalhes",
            body: `
                <p>Compare as tecnologias de sensores de baixo custo com as utilizadas por agências governamentais, como a Agência de Proteção Ambiental (EPA) nos Estados Unidos ou órgãos de controle ambiental no Brasil. Destaque a diferença na precisão e nos custos.</p>
                <p>Sensores profissionais oferecem calibração rigorosa, maior precisão e durabilidade, sendo utilizados em estações de monitoramento oficiais para dados regulatórios.</p>
            `
        },
        "aplicacao-ar": {
            title: "Aplicação: Qualidade do Ar",
            body: `
                <p>Monitore a poluição em áreas urbanas, perto de indústrias ou em grandes rodovias. Acompanhe em tempo real os níveis de poluentes e receba alertas para dias de má qualidade do ar.</p>
                <p>Essencial para a saúde respiratória e planejamento urbano.</p>
            `
        },
        "aplicacao-agua": {
            title: "Aplicação: Qualidade da Água",
            body: `
                <p>Monitore rios, lagos, aquíferos ou a água potável em uma comunidade. Identifique contaminações, variações de pH e outros indicadores para proteger ecossistemas e saúde pública.</p>
            `
        },
        "aplicacao-agricultura": {
            title: "Aplicação: Agricultura Sustentável",
            body: `
                <p>Utilize sensores para otimizar o uso da água na irrigação ou para monitorar a saúde do solo. Garanta o crescimento saudável das culturas com o mínimo de desperdício de recursos.</p>
            `
        },
        "dados-tempo-real": {
            title: "Dados em Tempo Real e APIs de Mapa",
            body: `
                <p>Explore APIs (Interfaces de Programação de Aplicações) de projetos de código aberto ou plataformas de dados ambientais, como o OpenAQ, para mostrar dados de qualidade do ar em tempo real de diversas cidades do mundo. Isso pode ser feito através de mapas interativos ou gráficos.</p>
                <p><strong>Local para a API de Mapa:</strong> O espaço reservado no HTML (<code id="map-api-realtime-data">map-api-realtime-data</code>) é onde você inicializaria e renderizaria um mapa. Por exemplo, usando a API do Google Maps ou Leaflet, você carregaria o mapa e sobreporia dados em tempo real obtidos de APIs como o OpenAQ.</p>
                <pre><code>// Exemplo de código (JavaScript, dentro da função de inicialização da API do seu mapa)
// function initMap() {
//   const map = new google.maps.Map(document.getElementById("map-api-realtime-data"), {
//     center: { lat: -23.55052, lng: -46.633308 }, // Exemplo: São Paulo
//     zoom: 10,
//   });
//   // Lógica para buscar dados do OpenAQ e adicionar marcadores/camadas no mapa
// }
// Para que a API do Google Maps funcione, você precisa incluir o script da API no seu HTML
// &lt;script src="https://maps.googleapis.com/maps/api/js?key=SUA_CHAVE_API&callback=initMap" async defer>&lt;/script>
</code></pre>
            `
        },
        "alertas-notificacoes": {
            title: "Alertas e Notificações Personalizadas",
            body: `
                <p>Implemente um sistema de alertas para os usuários. Por exemplo, eles podem se inscrever para receber notificações por e-mail ou via aplicativo quando os níveis de poluição do ar ou da água atingirem limites perigosos em sua área.</p>
                <p>As notificações podem ser configuradas por região, tipo de poluente e limite, mantendo você sempre informado sobre a qualidade do ambiente ao seu redor.</p>
            `
        },
        "analise-tendencias": {
            title: "Análise de Tendências Ambientais",
            body: `
                <p>Ofereça gráficos que mostrem a evolução da qualidade do ar ou da água ao longo do tempo. Isso permite que os usuários visualizem padrões, como picos de poluição em horários de tráfego intenso ou em determinadas estações do ano.</p>
                <p>Compreender as tendências é fundamental para identificar problemas recorrentes e planejar ações preventivas.</p>
            `
        },
        "impacto-saude": {
            title: "Impacto da Poluição na Saúde",
            body: `
                <p>Conecte os dados de poluição com informações sobre os riscos à saúde. Explique, de forma clara, como a exposição a determinados poluentes (como o PM2.5) pode afetar o sistema respiratório ou cardiovascular.</p>
                <p>Nosso objetivo é conscientizar sobre os efeitos da poluição no bem-estar humano e estimular a adoção de medidas protetivas.</p>
            `
        },
        "mudancas-climaticas": {
            title: "Poluição e Mudanças Climáticas",
            body: `
                <p>Explore a relação entre a poluição e as mudanças climáticas. Por exemplo, como as emissões de dióxido de carbono (CO2) e metano (CH4) são monitoradas e como contribuem para o efeito estufa.</p>
                <p>Compreender essa conexão é crucial para a tomada de decisões que mitiguem o aquecimento global.</p>
            `
        },
        "acoes-individuais": {
            title: "Ações Individuais para um Futuro Mais Verde",
            body: `
                <p>Pequenas atitudes diárias fazem uma grande diferença:</p>
                <ul>
                    <li>Uso de transporte público ou alternativo (bicicleta, caminhada).</li>
                    <li>Redução do consumo de energia em casa.</li>
                    <li>Plantio de árvores e cuidado com áreas verdes.</li>
                    <li>Consumo consciente e redução do desperdício.</li>
                </ul>
            `
        },
        "iniciativas-comunitarias": {
            title: "Iniciativas Comunitarias e Engajamento",
            body: `
                <p>A união faz a força! Engaje-se em iniciativas locais:</p>
                <ul>
                    <li>Participe de programas de reciclagem e compostagem.</li>
                    <li>Apoie campanhas de conscientização sobre a qualidade da água.</li>
                    <li>Envolva-se em projetos de monitoramento ambiental participativo, contribuindo com a coleta de dados e fiscalização.</li>
                </ul>
            `
        }
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

    modalCloseButton.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) { // Só fecha se clicar no overlay, não no conteúdo do modal
            modalOverlay.classList.remove('active');
        }
    });

    // --- Local para inicialização de API de Mapas ---
    // if (document.getElementById('map-api-realtime-data')) {
    //     // Coloque aqui o código para inicializar e renderizar seu mapa.
    //     // Por exemplo, se for Google Maps:
    //     // function initMap() {
    //     //   const map = new google.maps.Map(document.getElementById("map-api-realtime-data"), {
    //     //     center: { lat: -23.55052, lng: -46.633308 }, // Coordenadas de São Paulo
    //     //     zoom: 10,
    //     //   });
    //     //   // ... adicione marcadores, camadas de dados, etc.
    //     // }
    //     // Para carregar o script da API do Google Maps:
    //     // No HTML, inclua: <script src="https://maps.googleapis.com/maps/api/js?key=SUA_CHAVE_API&callback=initMap" async defer></script>
    //     // A função initMap seria chamada automaticamente pelo script da API.
    // }
});
