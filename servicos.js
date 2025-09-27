
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.grid-item[data-expand-target]');

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-expand-target');
            const content = modalContentData[targetId];
            const expandableContent = card.querySelector('.expandable-content');
            const icon = card.querySelector('.expand-icon');

            if (card.classList.contains('expanded')) {
                // Recolher o conteúdo
                expandableContent.style.maxHeight = '0';
                expandableContent.innerHTML = '';
                card.classList.remove('expanded');
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            } else {
                // Expandir o conteúdo
                expandableContent.innerHTML = `<h4>${content.title}</h4>${content.body}`;
                expandableContent.style.maxHeight = expandableContent.scrollHeight + 'px';
                card.classList.add('expanded');
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        });
    });

    // Conteúdo detalhado para cada modal
    const modalContentData = {
    "topico1-monitoramento-ambiental": {
        "body": `
            <h3>O que é Monitoramento Ambiental?</h3>
            <h3>Como a tecnologia pode ajudar no Monitoramento Ambiental?</h3>
            <h3>Quais tipos de sensores e suas aplicações?</h3>
            <h3>- Sensores de Qualidade do Ar.</h3>
            <h3>- Sensores de Qualidade da Água.</h3>
            <h3>- Sensores de Temperatura e Umidade.</h3>
            <h3>- Sensores de Gases de Efeito Estufa.</h3>
            <h3>- Outros Sensores.</h3>
            <h3>Qual o Impacto e Soluções Tecnológicas?</h3>
            <h3>Veja como está o clima em sua Cidade!</h3>
        `
    },
    "topico1-monitoramento-ambiental-o-que-monitoramento-ambiental-": {
        "title": "O que \u00e9 Monitoramento Ambiental?",
        "body": `
            <p>Monitoramento ambiental refere-se à coleta sistemática de dados sobre o estado do meio ambiente, incluindo ar, água, solo e biodiversidade. O objetivo é avaliar a qualidade ambiental, identificar tendências, prever impactos e fornecer informações para a tomada de decisões e implementação de políticas de proteção ambiental. É uma ferramenta essencial para a gestão sustentável dos recursos naturais e para a saúde pública.</p>
            <a href="https://ambisis.com.br/blog/gestao-ambiental/monitoramento-ambiental/"
                target="_blank" rel="noopener noreferrer">
                Saiba Mais
            </a>
        `
    },
    "topico1-monitoramento-ambiental-como-a-tecnologia-pode-ajudar-no-monitoramento-ambiental-": {
        "title": "Como a tecnologia pode ajudar no Monitoramento Ambiental?",
        "body": `
            <p>A tecnologia desempenha um papel crucial no aprimoramento do monitoramento ambiental, tornando-o mais eficiente, preciso e abrangente. Sensores avançados, plataformas de coleta de dados em tempo real, inteligência artificial e análise de big data permitem a detecção precoce de problemas, a modelagem de cenários e a comunicação eficaz de informações. Isso facilita a resposta rápida a desastres ambientais e a implementação de medidas preventivas.</p>
            <a href="https://manejebem.com/tecnologias-para-monitoramento-ambiental/">Saiba Mais.</a>
        `
    },
    "topico1-monitoramento-ambiental-tipos-de-sensores-e-suas-aplica-es-": {
        "title": "Tipos de sensores e suas aplica\u00e7\u00f5es:",
        "body": `
            <p>Diversos tipos de sensores são utilizados para coletar dados ambientais, cada um com aplicações específicas:</p>
            <a href=""></a>
        `
    },
    "topico1-monitoramento-ambiental-sensores-de-qualidade-do-ar": {
        "title": "Sensores de Qualidade do Ar",
        "body": `
            <p>Estes sensores medem a concentração de poluentes como material particulado (PM2.5, PM10), dióxido de carbono (CO2), monóxido de carbono (CO), dióxido de enxofre (SO2), óxidos de nitrogênio (NOx) e ozônio (O3). São cruciais para monitorar a poluição atmosférica em áreas urbanas e industriais, alertando sobre níveis perigosos e ajudando a formular estratégias de controle da poluição.</p>
            <a href=""></a>
        `
    },
    "topico1-monitoramento-ambiental-sensores-de-qualidade-da-gua": {
        "title": "Sensores de Qualidade da \u00c1gua",
        "body": `
            <p>Utilizados para avaliar parâmetros como pH, turbidez, oxigênio dissolvido, condutividade elétrica, temperatura e presença de contaminantes químicos e biológicos em rios, lagos e oceanos. Essenciais para a gestão de recursos hídricos, detecção de poluição e proteção de ecossistemas aquáticos.</p>
            <a href=""></a>
        `
    },
    "topico1-monitoramento-ambiental-sensores-de-temperatura-e-umidade": {
        "title": "Sensores de Temperatura e Umidade",
        "body": `
            <p>Monitoram as condições climáticas, sendo fundamentais para estudos meteorológicos, agricultura de precisão, previsão de eventos extremos e avaliação das mudanças climáticas. Podem ser encontrados em estações meteorológicas, dispositivos IoT e sistemas de automação.</p>
            <a href=""></a>
        `
    },
    "topico1-monitoramento-ambiental-sensores-de-gases-de-efeito-estufa": {
        "title": "Sensores de Gases de Efeito Estufa",
        "body": `
            <p>Focados na medição de gases como metano (CH4) e dióxido de carbono (CO2) para entender suas concentrações na atmosfera e seu impacto no aquecimento global. São usados em pesquisas climáticas e no monitoramento de emissões industriais.</p>
            <a href=""></a>
        `
    },
    "topico1-monitoramento-ambiental-outros-sensores": {
        "title": "Outros Sensores",
        "body": `
            <p>Incluem sensores de solo (umidade, nutrientes), radiação solar (para energia solar e agricultura) e ruído (para monitoramento da poluição sonora em cidades).</p>
        `
    },
    "topico1-monitoramento-ambiental-outros-sensores-1": {
        "title": "Como funciona, onde pode se encontrar radares de sensores e aplicativos que mostram",
        "body": `
            <p>Sensores ambientais podem ser encontrados em estações de monitoramento fixas, dispositivos móveis, drones e satélites. Em cidades como São Paulo, redes de sensores são instaladas em pontos estratégicos para fornecer dados em tempo real. Aplicativos móveis e plataformas web integram esses dados, permitindo que cidadãos e autoridades visualizem a qualidade do ar, da água e outras informações ambientais. Muitos desses sistemas utilizam APIs para compartilhar dados e integrar-se com outras plataformas.</p>
        `
    },
    "topico1-monitoramento-ambiental-outros-sensores-2": {
        "title": "Alertas e Notificações",
        "body": `
            <p>Sistemas de monitoramento ambiental frequentemente incluem funcionalidades de alerta e notificação, que informam usuários e autoridades sobre condições ambientais que excedem limites seguros ou indicam eventos críticos. Isso permite uma resposta rápida a emergências e a implementação de medidas de mitigação.</p>
        `
    },
    "topico1-monitoramento-ambiental-impacto-e-solu-es-tecnol-gicas": {
        "title": "Impacto e Solu\u00e7\u00f5es Tecnol\u00f3gicas",
        "body": `
            <p>O monitoramento ambiental tecnológico tem um impacto significativo na capacidade de proteger o planeta. Por exemplo, em diversas cidades, a instalação de redes de sensores de qualidade do ar permitiu identificar fontes de poluição e implementar restrições de tráfego, resultando em melhorias na saúde respiratória da população. A detecção precoce de vazamentos em oleodutos por sensores de solo também evitou desastres ecológicos maiores.</p>
        `
    },
    "topico1-monitoramento-ambiental-fatos-reais-em-que-os-sensores-ajudaram-": {
        "title": "Fatos Reais em que os sensores ajudaram:",
        "body": `
            <ul>
                <li>Pequim reduziu a poluição atmosférica mortal em 20% em menos de um ano, usando aprendizado de máquina e big data para direcionar as políticas. 
                    <a href="https://apolitical.co/solution-articles/pt/pequim-usa-maquina-aprendizado-big-data-alvo-poluicao-controles">Saiba Mais.</a></li>
                <li>As tecnologias de Monitoramento de Integridade Estrutural auxiliam na verificação ideal de instalações infraestruturais, sistemas de transportadores, estações de compressão, poços e tubulações para medição de fadiga e carga.
                    <a href="https://www.hbm.com/pt/3951/monitoramento-industria-de-petroleo-e-gas/">Saiba Mais.</a></li>
                <li><strong>Previsão de Inundações:</strong> Em várias regiões, sensores de nível de água em rios e pluviômetros conectados a sistemas de alerta precoce ajudam a prever inundações, dando tempo para a evacuação e proteção de bens. 
                    <a href="">Saiba Mais.</a></li>
                </ul>
            <p>Aplicativos para monitoramento:</p>
            <ul>
                <li><a href="https://www.boletimaomar.com.br/">
                    Boletim ao Mar.</a></li>
                <li><a href="index.html#clima-index">
                    Veja o Clima em sua região</a></li>
            </ul>
        `
    },
    "topico2-energia-limpa": {
        "title": "Energia Limpa",
        "body": `
            <h3>O que é Energia Limpa?</h3>
            <h3>Como a tecnologia pode ajudar na Energia Limpa?</h3>
            <h3>Soluções de sistema de energia limpa e renovável:</h3>
            <h3>- Energia Solar</h3>
            <h3>- Energia Eólica</h3>
            <h3>- Energia Hidrelétrica</h3>
            <h3>- Biomassa e Biogás</h3>
            <h3>- Energia das Marés e Ondas</h3>
            <h3>- Energia Geotérmica</h3>
            <h3>Armazenamento e Integração</h3>
            <h3>Redes Inteligentes (Smart Grids)</h3>
            <h3>Dicas para Reduzir Consumo de Energia (Soluções para casa doméstica)</h3>
            <h3>Como aplicar Automação Residencial e Exemplos.</h3>
        `
    },
    "topico2-energia-limpa-o-que-energia-limpa-": {
        "title": "O que \u00e9 Energia Limpa?",
        "body": `
            <p>Energia limpa, também conhecida como energia renovável, refere-se a fontes de energia que não liberam poluentes na atmosfera ou que têm um impacto ambiental mínimo. Ao contrário dos combustíveis fósseis, que são finitos e contribuem para as mudanças climáticas, as fontes de energia limpa são naturalmente reabastecidas e sustentáveis a longo prazo. Elas são cruciais para a transição energética global e para a redução da pegada de carbono.</p>
        `
    },
    "topico2-energia-limpa-como-a-tecnologia-pode-ajudar-na-energia-limpa-": {
        "title": "Como a tecnologia pode ajudar na Energia Limpa?",
        "body": `
            <p>A tecnologia é a força motriz por trás do avanço e da viabilidade da energia limpa. Inovações em materiais, eletrônica, inteligência artificial e engenharia têm permitido o desenvolvimento de sistemas mais eficientes para captação, conversão, armazenamento e distribuição de energia renovável. A tecnologia também facilita a integração dessas fontes na rede elétrica existente e a otimização do consumo de energia.</p>
        `
    },
    "topico2-energia-limpa-solu-es-de-sistema-de-energia-limpa-e-renov-vel-": {
        "title": "Solu\u00e7\u00f5es de sistema de energia limpa e renov\u00e1vel:",
        "body": `
            <h3>Energia SOlar</h3>
            <h3>Energia Eólica</h3>    
            <h3>Energia Hidrelétrica</h3>
            <h3>Biomassa e Biogás</h3>
            <h3>Energia das Marés e Ondas</h3>
            <h3>Energia Geotérmica</h3>
        `
    },
    "topico2-energia-limpa-energia-solar": {
        "title": "Energia Solar",
        "body": `
            <p>Utiliza a luz do sol para gerar eletricidade (fotovoltaica) ou calor (térmica). A tecnologia fotovoltaica, com painéis solares cada vez mais eficientes e acessíveis, é uma das soluções mais populares para residências, empresas e grandes usinas. O avanço em baterias também permite o armazenamento da energia solar para uso noturno ou em dias nublados.</p>
        `
    },
    "topico2-energia-limpa-energia-e-lica": {
        "title": "Energia E\u00f3lica",
        "body": `
            <p>Converte a força do vento em eletricidade através de turbinas eólicas. Parques eólicos, tanto em terra (onshore) quanto no mar (offshore), são capazes de gerar grandes quantidades de energia. A tecnologia tem focado em turbinas maiores e mais eficientes, capazes de operar em diferentes condições de vento.</p>
        `
    },
    "topico2-energia-limpa-energia-hidrel-trica": {
        "title": "Energia Hidrel\u00e9trica",
        "body": `
            <p>Produz eletricidade a partir da força da água em movimento, geralmente em rios, através de barragens e turbinas. É uma fonte de energia renovável estabelecida, mas seu impacto ambiental (alteração de ecossistemas fluviais) requer planejamento cuidadoso.</p>
        `
    },
    "topico2-energia-limpa-biomassa-e-biog-s": {
        "title": "Biomassa e Biog\u00e1s",
        "body": `
            <p>Biomassa é matéria orgânica (como resíduos agrícolas, florestais ou urbanos) que pode ser queimada para gerar calor e eletricidade, ou convertida em biocombustíveis. Biogás é produzido pela decomposição anaeróbica de matéria orgânica, gerando um gás combustível que pode ser usado para energia. São soluções que aproveitam resíduos, reduzindo o descarte e gerando energia.</p>
        `
    },
    "topico2-energia-limpa-energia-das-mar-s-e-ondas": {
        "title": "Energia das Mar\u00e9s e Ondas",
        "body": `
            <p>Aproveita a energia cinética das marés e das ondas oceânicas para gerar eletricidade. Embora ainda em estágios iniciais de desenvolvimento comercial, essas tecnologias têm um grande potencial em regiões costeiras com condições favoráveis.</p>
        `
    },
    "topico2-energia-limpa-energia-geot-rmica": {
        "title": "Energia Geot\u00e9rmica",
        "body": `
            <p>Utiliza o calor do interior da Terra para aquecimento ou geração de eletricidade. É uma fonte constante e confiável, mas sua viabilidade depende da localização geográfica.</p>
        `
    },
    "topico2-energia-limpa-armazenamento-e-integra-o": {
        "title": "Armazenamento e Integra\u00e7\u00e3o",
        "body": `
            <p>O armazenamento de energia, principalmente através de baterias (como as de íon-lítio), é fundamental para superar a intermitência de fontes como solar e eólica. A integração dessas fontes na rede elétrica é otimizada por sistemas inteligentes que gerenciam o fluxo de energia e garantem a estabilidade do fornecimento.</p>
        `
    },
    "topico2-energia-limpa-redes-inteligentes-smart-grids-": {
        "title": "Redes Inteligentes (Smart Grids)",
        "body": `
            <p>São redes elétricas avançadas que utilizam tecnologia digital para monitorar, controlar e gerenciar o fluxo de eletricidade de todas as fontes de geração para atender à demanda variável dos consumidores. Elas permitem uma maior integração de energias renováveis, otimizam a distribuição e aumentam a resiliência do sistema.</p>
        `
    },
    "topico2-energia-limpa-dicas-para-reduzir-consumo-de-energia-solu-es-para-casa-dom-stica-": {
        "title": "Dicas para Reduzir Consumo de Energia (Solu\u00e7\u00f5es para casa dom\u00e9stica)",
        "body": `
            <ul>
                <li><strong>Iluminação Eficiente:</strong> Substituir lâmpadas incandescentes por LEDs, que consomem significativamente menos energia e têm vida útil mais longa.</li>
                <li><strong>Eletrodomésticos Eficientes:</strong> Optar por aparelhos com selo Procel A (no Brasil) ou ENERGY STAR (internacional), que indicam alta eficiência energética.</li>
                <li><strong>Isolamento Térmico:</strong> Melhorar o isolamento de residências para reduzir a necessidade de aquecimento ou refrigeração.</li>
                <li><strong>Uso Consciente:</strong> Desligar luzes e aparelhos eletrônicos quando não estiverem em uso, tirar da tomada carregadores e dispositivos em stand-by.</li>
            </ul>
        `
    },
    "topico2-energia-limpa-como-aplicar-automa-o-residencial-e-exemplos-": {
        "title": "Como aplicar Automa\u00e7\u00e3o Residencial e Exemplos.",
        "body": `
            <p>A automação residencial, ou casa inteligente, permite controlar e programar dispositivos eletrônicos e sistemas da casa para otimizar o consumo de energia e aumentar o conforto. Exemplos incluem:</p>
            <ul>
                <li><strong>Termostatos Inteligentes:</strong> Ajustam a temperatura automaticamente com base na presença de pessoas, horários e preferências, economizando energia com aquecimento e ar condicionado.</li>
                <li><strong>Iluminação Inteligente:</strong> Lâmpadas e sistemas de iluminação que podem ser controlados remotamente, programados para ligar/desligar ou ajustar a intensidade, e até mesmo reagir à luz natural.</li>
                <li><strong>Tomadas Inteligentes:</strong> Permitem ligar/desligar aparelhos conectados a elas remotamente ou por programação, evitando o consumo de energia em stand-by.</li>
                <li><strong>Sensores de Presença e Abertura:</strong> Acionam luzes ou sistemas de climatização apenas quando há pessoas no ambiente ou quando portas/janelas são abertas, evitando desperdício.</li>
            </ul>
        `
    },
    "topico2-energia-limpa-exemplo-de-integra-o-com-api-conceitual-para-automa-o-residencial-": {
        "title": "Exemplo de Integra\u00e7\u00e3o (Conceitual para Automa\u00e7\u00e3o Residencial)",
        "body": `
            <p>Para automação residencial, muitas plataformas oferecem APIs para integração. Um exemplo notável de plataforma de código aberto é o Home Assistant, que permite um controle local e privado de dispositivos inteligentes. Abaixo, um exemplo conceitual de como você poderia interagir com um dispositivo inteligente (como uma lâmpada) via uma API hipotética, inspirada em conceitos de automação residencial:</p>
            <p>Video de vcs apresentando e.e</p>
            <p><strong>Observação:</strong> A implementação real de controle de dispositivos inteligentes varia muito entre fabricantes e plataformas. Este é um exemplo simplificado para ilustrar o conceito de interação via API. Para um projeto real, seria necessário consultar a documentação específica da plataforma ou dos dispositivos a serem controlados. Plataformas como Home Assistant (código aberto) e Tuya (com plano gratuito para desenvolvedores) são boas opções para explorar.</p>
            `    
        },
    "topico3-consumo-economia-consciente": {
        "title": "Consumo e Economia Consciente",
        "body": `
            <h3>O que é Consumo e Economia Consciente?</h3>
            <h3>Como a tecnologia pode ajudar no Consumo e Economia Consciente?</h3>
            <h3>Soluções para reduzir custos e promover o consumo consciente:</h3>
            <h3>Iluminação LED</h3>
            <h3>Tecnologia e Automação</h3>
            <h3>Tomadas Inteligentes</h3>
            <h3>Sensores de Presença ou Temporizadores</h3>
            <h3>Equipamentos Domésticos com Selo Procel A/ENERGY STAR</h3>
            <h3>Aplicativos para Escanear produtos (Sugestão de Código para API)</h3>
            <h3>Exemplo de código de barras de um produto real (ex: água mineral)</h3>
`
    },
    "topico3-consumo-economia-consciente-o-que-consumo-e-economia-consciente-": {
        "title": "O que \u00e9 Consumo e Economia Consciente?",
        "body": `
            <p>Consumo e economia consciente referem-se a um estilo de vida e a um conjunto de práticas que visam a utilização de recursos de forma mais responsável, minimizando o impacto ambiental e social, e otimizando o uso de bens e serviços. Isso envolve fazer escolhas informadas sobre o que comprar, como usar e como descartar, considerando a origem, o processo de produção, a durabilidade e o destino final dos produtos. O objetivo é promover um equilíbrio entre as necessidades individuais, o bem-estar social e a saúde do planeta.</p>
        `
    },
    "topico3-consumo-economia-consciente-como-a-tecnologia-pode-ajudar-no-consumo-e-economia-consciente-": {
        "title": "Como a tecnologia pode ajudar no Consumo e Economia Consciente?",
        "body": `
            <p>A tecnologia desempenha um papel fundamental na promoção do consumo e da economia consciente, oferecendo ferramentas e soluções que capacitam os indivíduos a tomar decisões mais sustentáveis. Desde aplicativos que monitoram o consumo de energia até plataformas que facilitam a reciclagem e a compra de produtos sustentáveis, a tecnologia torna mais fácil para as pessoas entenderem seu impacto, encontrarem alternativas e adotarem hábitos mais responsáveis. Ela também permite a automação de processos que reduzem o desperdício e otimizam o uso de recursos.</p>
        `
    },
    "topico3-consumo-economia-consciente-solu-es-para-reduzir-custos-e-promover-o-consumo-consciente-": {
        "title": "Solu\u00e7\u00f5es para reduzir custos e promover o consumo consciente:",
        "body": `

`
    },
    "topico3-consumo-economia-consciente-ilumina-o-led": {
        "title": "Ilumina\u00e7\u00e3o LED",
        "body": `
            <p>A substituição de lâmpadas incandescentes e fluorescentes por lâmpadas LED é uma das maneiras mais eficazes de reduzir o consumo de energia em residências e empresas. As LEDs são significativamente mais eficientes, duram muito mais tempo e oferecem melhor qualidade de luz, resultando em economia na conta de luz e menor necessidade de substituição.</p>
        `
    },
    "topico3-consumo-economia-consciente-tecnologia-e-automa-o": {
        "title": "Tecnologia e Automa\u00e7\u00e3o",
        "body": `
            <p>A automação residencial e o uso de tecnologias inteligentes podem otimizar o consumo de energia e recursos. Isso inclui:</p>
            <ul>
                <li><strong>Assistentes Virtuais:</strong> Dispositivos como Amazon Echo ou Google Home podem ser integrados a sistemas de casa inteligente para controlar luzes, termostatos e outros aparelhos, permitindo um gerenciamento mais eficiente do consumo.</li>
                <li><strong>Aplicativos de Monitoramento de Energia:</strong> Existem diversos aplicativos que se conectam a medidores inteligentes ou dispositivos plug-and-play para fornecer dados em tempo real sobre o consumo de energia, ajudando os usuários a identificar padrões de desperdício e a tomar medidas corretivas.</li>
            </ul>
        `
    },
    "topico3-consumo-economia-consciente-tomadas-inteligentes": {
        "title": "Tomadas Inteligentes",
        "body": `
            <p>As tomadas inteligentes permitem ligar e desligar aparelhos eletrônicos remotamente ou programar seu funcionamento. Isso é particularmente útil para eliminar o consumo de energia em modo stand-by (phantom load), que pode representar uma parcela significativa do consumo total de uma residência.</p>
        `
    },
    "topico3-consumo-economia-consciente-sensores-de-presen-a-ou-temporizadores": {
        "title": "Sensores de Presen\u00e7a ou Temporizadores",
        "body": `
            <p>Instalar sensores de presença em ambientes como corredores, banheiros e áreas de serviço garante que as luzes sejam acesas apenas quando necessário e desligadas automaticamente após um período de inatividade. Temporizadores podem ser usados para controlar o funcionamento de sistemas de irrigação, aquecedores de água e outros aparelhos, evitando o uso desnecessário.</p>
        `
    },
    "topico3-consumo-economia-consciente-equipamentos-dom-sticos-com-selo-procel-a-energy-star": {
        "title": "Equipamentos Dom\u00e9sticos com Selo Procel A/ENERGY STAR",
        "body": `
            <p>Ao adquirir novos eletrodomésticos, é fundamental verificar os selos de eficiência energética, como o Procel A no Brasil ou o ENERGY STAR internacional. Esses selos indicam que o aparelho consome menos energia para realizar a mesma função, resultando em economia a longo prazo e menor impacto ambiental.</p>
        `
    },
    "topico3-consumo-economia-consciente-aplicativos-para-escanear-produtos-sugest-o-de-c-digo-para-api-": {
        "title": "Aplicativos para Escanear produtos (Sugest\u00e3o de C\u00f3digo para API)",
        "body": `
            <p>Existem aplicativos que permitem escanear códigos de barras de produtos para obter informações sobre sua origem, composição, impacto ambiental e certificações de sustentabilidade. Para desenvolver uma funcionalidade similar, pode-se utilizar APIs de bancos de dados de produtos ou de organizações que fornecem dados de sustentabilidade. Um excelente exemplo é a API do Open Food Facts, que oferece dados abertos sobre produtos alimentícios. Abaixo, um exemplo de como acessar a API do Open Food Facts usando Python para obter informações de um produto:</p>
            <ul>
                <li><a href=""></a>Aplicativo 1</li>
                <li><a href=""></a>Aplicativo 2</li>
                <li><a href=""></a>Aplicativo 3</li>
            </ul>
            <p>Exemplo de código de barras de um produto real (ex: água mineral)</p>
            <p><strong>Observação:</strong> A API do Open Food Facts é gratuita para uso não comercial e não exige chave de API para leitura de dados. Para operações de escrita (como adicionar novos produtos), é necessário autenticação e um <code>User-Agent</code> personalizado. Este exemplo demonstra como a tecnologia pode ser usada para fornecer transparência e auxiliar o consumo consciente, permitindo que os usuários acessem informações detalhadas sobre os produtos que consomem.</p>
        `
    },
    "topico4-reciclagem-inteligente": {
        "title": "Reciclagem Inteligente",
        "body": `
            <h2>O que é Reciclagem Inteligente?</h2>
            <h2>Como a tecnologia pode ajudar na Reciclagem Inteligente?</h2>
            <h2>Soluções para reciclagem inteligente:</h2>
            <h3>Aplicativos para Escanear produtos</h3>
            <h3>Coleta Inteligente</h3>
            <h3>Triagem Automatizada</h3>
            <h3>Cidades Inteligentes</h3>
            <h2>Locais para coleta de aparelhos tecnológicos</h2>
        `
    },
    "topico4-reciclagem-inteligente-o-que-reciclagem-inteligente-": {
        "title": "O que \u00e9 Reciclagem Inteligente?",
        "body": `
            <p>Reciclagem inteligente é a aplicação de tecnologias avançadas para otimizar e tornar mais eficiente o processo de coleta, triagem e reprocessamento de resíduos. Ela vai além da reciclagem tradicional, utilizando ferramentas digitais, automação e análise de dados para melhorar a taxa de recuperação de materiais, reduzir custos operacionais, aumentar a transparência e engajar os cidadãos de forma mais eficaz. O objetivo é criar um sistema de gestão de resíduos mais sustentável e circular.</p>
        `
    },
    "topico4-reciclagem-inteligente-como-a-tecnologia-pode-ajudar-na-reciclagem-inteligente-": {
        "title": "Como a tecnologia pode ajudar na Reciclagem Inteligente?",
        "body": `
            <p>A tecnologia é um pilar fundamental para a reciclagem inteligente, transformando a maneira como lidamos com o lixo. Ela oferece soluções para desafios como a baixa adesão da população, a contaminação de materiais recicláveis e a ineficiência logística. Através de aplicativos, sensores, inteligência artificial e robótica, a tecnologia permite:</p>
            <ul>
                <li><strong>Engajamento Cidadão:</strong> Facilitar a participação dos indivíduos no processo de reciclagem.</li>
                <li><strong>Otimização da Coleta:</strong> Tornar a coleta de resíduos mais eficiente e econômica.</li>
                <li><strong>Melhora da Triagem:</strong> Aumentar a precisão na separação dos materiais.</li>
                <li><strong>Rastreabilidade:</strong> Monitorar o fluxo dos resíduos do descarte ao reprocessamento.</li>
                <li><strong>Análise de Dados:</strong> Gerar insights para aprimorar continuamente o sistema de reciclagem.</li>
            </ul>
        `
    },
    "topico4-reciclagem-inteligente-solu-es-para-reciclagem-inteligente-": {
        "title": "Solu\u00e7\u00f5es para reciclagem inteligente:",
        "body": `
        `
    },
    "topico4-reciclagem-inteligente-aplicativos-para-escanear-produtos": {
        "title": "Aplicativos para Escanear produtos",
        "body": `
            <p>Assim como no consumo consciente, aplicativos podem ser usados para escanear códigos de barras de produtos e fornecer informações sobre como descartá-los corretamente, quais partes são recicláveis e onde podem ser entregues. Isso educa o consumidor e simplifica o processo de separação de resíduos em casa.</p>
        `
    },
    "topico4-reciclagem-inteligente-coleta-inteligente": {
        "title": "Coleta Inteligente",
        "body": `
            <p>Sistemas de coleta inteligente utilizam sensores em lixeiras e contêineres para monitorar o nível de enchimento em tempo real. Com base nesses dados, rotas de coleta são otimizadas, garantindo que os caminhões só coletem lixo quando os contêineres estão cheios, reduzindo o consumo de combustível, emissões e custos operacionais. Isso também evita o transbordamento de lixeiras e melhora a higiene urbana.</p>
        `
    },
    "topico4-reciclagem-inteligente-triagem-automatizada": {
        "title": "Triagem Automatizada",
        "body": `
            <p>Centros de triagem modernos empregam tecnologias como inteligência artificial, visão computacional e robótica para identificar e separar diferentes tipos de materiais recicláveis (plásticos, metais, papéis, vidros) com alta velocidade e precisão. Isso minimiza a necessidade de mão de obra manual em tarefas repetitivas e perigosas, e aumenta a pureza dos materiais reciclados, tornando-os mais valiosos para a indústria.</p>
        `
    },
    "topico4-reciclagem-inteligente-cidades-inteligentes": {
        "title": "Cidades Inteligentes",
        "body": `
            <p>No contexto de cidades inteligentes, a reciclagem inteligente é integrada a uma infraestrutura urbana mais ampla. Isso pode incluir a instalação de pontos de coleta automatizados, programas de incentivo à reciclagem baseados em recompensas digitais e a utilização de dados para planejar políticas públicas de gestão de resíduos mais eficazes.</p>
        `
    },
    "topico4-reciclagem-inteligente-locais-para-coleta-de-aparelhos-tecnol-gicos": {
        "title": "Locais para coleta de aparelhos tecnol\u00f3gicos",
        "body": `
            <p>O descarte correto de lixo eletrônico (e-lixo) é crucial devido aos componentes tóxicos e valiosos que contém. Muitos fabricantes, varejistas e municípios oferecem pontos de coleta específicos para esses materiais. A tecnologia pode ajudar a localizar esses pontos.</p>
        `
    },
    "topico5-mobilidade-sustentavel": {
        "title": "Mobilidade Sustent\u00e1vel",
        "body": `
            <h3>O que é Mobilidade Sustentável?</h3>
            <h3>Como a tecnologia pode ajudar na Mobilidade Sustentável?</h3>
            <h3>Tipos de transportes sustentáveis:</h3>
            <h3>- Carros (Elétricos, Bateria, Híbridos)</h3>
            <h3>- Transporte Público (Ônibus elétricos, ônibus, trem, metrô)</h3>
            <h3>- Bicicletas</h3>
            <h3>Vantagens e Desafios (Benefícios a longo prazo)</h3>
        `
    },
    "topico5-mobilidade-sustentavel-o-que-mobilidade-sustent-vel-": {
        "title": "O que \u00e9 Mobilidade Sustent\u00e1vel?",
        "body": `
            <p>Mobilidade sustentável refere-se a um conjunto de práticas e tecnologias que visam facilitar o deslocamento de pessoas e bens de forma a minimizar os impactos ambientais, sociais e econômicos negativos. Isso inclui a promoção de meios de transporte com baixa emissão de carbono, como caminhada, ciclismo, transporte público eficiente e veículos elétricos, além do planejamento urbano que reduza a necessidade de longos deslocamentos. O objetivo é criar sistemas de transporte que sejam acessíveis, equitativos, seguros e ecologicamente responsáveis a longo prazo.</p>
        `
    },
    "topico5-mobilidade-sustentavel-como-a-tecnologia-pode-ajudar-na-mobilidade-sustent-vel-": {
        "title": "Como a tecnologia pode ajudar na Mobilidade Sustent\u00e1vel?",
        "body": `
            <p>A tecnologia é um catalisador fundamental para a mobilidade sustentável, oferecendo soluções inovadoras para tornar o transporte mais limpo, eficiente e inteligente. Desde o desenvolvimento de veículos elétricos e infraestruturas de carregamento até aplicativos de planejamento de rotas e sistemas de gerenciamento de tráfego, a tecnologia permite otimizar o uso de recursos, reduzir a poluição e melhorar a experiência do usuário. Ela também facilita a integração de diferentes modais de transporte e a coleta de dados para aprimorar políticas públicas.</p>
        `
    },
    "topico5-mobilidade-sustentavel-tipos-de-transportes-sustent-veis-": {
        "title": "Tipos de transportes sustent\u00e1veis:",
        "body": `
        `
    },
    "topico5-mobilidade-sustentavel-carros-el-tricos-bateria-h-bridos-": {
        "title": "Carros (El\u00e9tricos, Bateria, H\u00edbridos)",
        "body": `
            <ul>
                <li><strong>Carros Elétricos (EVs):</strong> Veículos movidos exclusivamente por motores elétricos, alimentados por baterias recarregáveis. Não emitem poluentes diretamente do escapamento, contribuindo para a melhoria da qualidade do ar nas cidades.</li>
                <li><strong>Carros Híbridos:</strong> Combinam um motor a combustão interna com um motor elétrico. Podem ser híbridos convencionais (HEV), híbridos plug-in (PHEV) ou híbridos leves (MHEV), oferecendo maior eficiência de combustível e menor emissão em comparação com veículos puramente a combustão.</li>
            </ul>
            <p><strong>Tabela de Fabricante, Modelos, Descrição (Exemplo Conceitual):</strong></p>
            <p>| Fabricante | Modelo Principal | Tipo | Descrição Breve |
               | :--------- | :--------------- | :--- | :-------------- |
               | Tesla      | Model 3          | Elétrico | Sedã de alta performance e autonomia, líder de mercado. |
               | Chevrolet  | Bolt EV          | Elétrico | Hatchback compacto com boa autonomia e custo-benefício. |
               | Toyota     | Prius            | Híbrido | Pioneiro entre os híbridos, conhecido pela economia de combustível. |
               | Volvo      | XC60 Recharge    | Híbrido Plug-in | SUV premium com opção de rodar em modo totalmente elétrico. |</p>
        `
    },
    "topico5-mobilidade-sustentavel-transporte-p-blico-nibus-el-tricos-nibus-trem-metr-": {
        "title": "Transporte P\u00fablico (\u00d4nibus el\u00e9tricos, \u00f4nibus, trem, metr\u00f4)",
        "body": `<h3>Transporte Público (Ônibus elétricos, ônibus, trem, metrô)</h3>
<p>O transporte público é intrinsecamente mais sustentável do que o transporte individual, pois transporta um grande número de pessoas com menor pegada de carbono por passageiro. A eletrificação de frotas de ônibus e a expansão de redes de metrô e trem são cruciais para cidades mais verdes. Ônibus elétricos, por exemplo, eliminam emissões locais e reduzem a poluição sonora.</p>
`
    },
    "topico5-mobilidade-sustentavel-bicicletas": {
        "title": "Bicicletas",
        "body": `<h3>Bicicletas</h3>
<p>A bicicleta é um meio de transporte de emissão zero, promovendo saúde e reduzindo o congestionamento. A tecnologia contribui com bicicletas elétricas (e-bikes), sistemas de compartilhamento de bicicletas (bike-sharing) e infraestrutura cicloviária inteligente.</p>
`
    },
    "topico5-mobilidade-sustentavel-vantagens-e-desafios-benef-cios-a-longo-prazo-": {
        "title": "Vantagens e Desafios (Benef\u00edcios a longo prazo)",
        "body": `<h2>Vantagens e Desafios (Benefícios a longo prazo)</h2>
<p><strong>Vantagens:</strong></p>
<ul>
<li><strong>Redução da Poluição:</strong> Menos emissões de gases de efeito estufa e poluentes atmosféricos.</li>
<li><strong>Melhora da Saúde Pública:</strong> Ar mais limpo e incentivo à atividade física.</li>
<li><strong>Economia de Recursos:</strong> Menor dependência de combustíveis fósseis.</li>
<li><strong>Redução do Congestionamento:</strong> Cidades mais fluidas e com menos tempo perdido no trânsito.</li>
<li><strong>Cidades Mais Habitáveis:</strong> Espaços urbanos mais agradáveis e seguros para pedestres e ciclistas.</li>
</ul>
<p><strong>Desafios:</strong></p>
<ul>
<li><strong>Infraestrutura:</strong> Necessidade de mais estações de carregamento para EVs, ciclovias seguras e expansão do transporte público.</li>
<li><strong>Custo Inicial:</strong> Veículos elétricos e infraestrutura podem ter um custo inicial mais alto.</li>
<li><strong>Aceitação Cultural:</strong> Mudança de hábitos e preferência pelo carro particular.</li>
<li><strong>Geração de Energia:</strong> A sustentabilidade dos EVs depende da fonte de energia utilizada para gerar a eletricidade que os alimenta.</li>
</ul>
`
    },
    "topico5-mobilidade-sustentavel-api-de-rotas-para-transporte-verde-na-cidade-sugest-o-de-c-digo-": {
        "title": "API de Rotas para Transporte Verde na Cidade (Sugest\u00e3o de C\u00f3digo)",
        "body": `<h3>API de Rotas para Transporte Verde na Cidade (Sugestão de Código)</h3>
<p>Para promover a mobilidade sustentável, aplicativos podem oferecer rotas que priorizam o transporte público, ciclismo ou caminhada, ou que considerem a menor emissão de carbono. Isso pode ser feito integrando-se a APIs de mapas e transporte que forneçam dados sobre diferentes modais e suas características. Abaixo, um exemplo conceitual de como uma API de rotas sustentáveis poderia ser acessada usando Python:</p>
<p>\`\`\`python
import requests
import json</p>
<h1>Exemplo de uso de uma API de rotas sustentáveis (substitua pela URL e chave da API real)</h1>
<p>def get_sustainable_route(origin, destination, mode, api_key):
    base_url = "https://api.greenroutes.com/v1/route"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    params = {
        "origin": origin,
        "destination": destination,
        "mode": mode,  # Ex: "walking", "bicycling", "transit", "ev_car"
        "optimize": "eco" # Otimizar para menor emissão/consumo
    }
    try:
        response = requests.get(base_url, headers=headers, params=params)
        response.raise_for_status()  # Levanta um erro para códigos de status HTTP ruins
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print(f"Erro ao buscar rota sustentável: {e}")
        return None</p>
<h1>Substitua pelos seus dados reais</h1>
<p>api_key = "SUA_CHAVE_API_DE_ROTAS"
origem = "Rua da Consolação, 2000, São Paulo"
destino = "Avenida Paulista, 1578, São Paulo"</p>
<h1>Exemplo: Rota de bicicleta</h1>
<p>bike_route = get_sustainable_route(origem, destino, "bicycling", api_key)
if bike_route:
    print("Rota de Bicicleta Sustentável:")
    for step in bike_route.get("steps", []):
        print(f"- {step.get("instruction")}")
    print(f"Distância: {bike_route.get("distance")}")
    print(f"Tempo Estimado: {bike_route.get("duration")}")</p>
<h1>Exemplo: Rota de carro elétrico</h1>
<p>ev_car_route = get_sustainable_route(origem, destino, "ev_car", api_key)
if ev_car_route:
    print("\nRota de Carro Elétrico Sustentável:")
    for step in ev_car_route.get("steps", []):
        print(f"- {step.get("instruction")}")
    print(f"Distância: {ev_car_route.get("distance")}")
    print(f"Tempo Estimado: {ev_car_route.get("duration")}")
    print(f"Emissão de CO2 Estimada: {ev_car_route.get("co2_emission")}")
\`\`\`</p>
<p><strong>Observação:</strong> APIs de mapas como Google Maps Platform, HERE Technologies ou Mapbox oferecem funcionalidades de roteamento que podem ser adaptadas para priorizar opções sustentáveis ou calcular emissões. O exemplo acima é conceitual e ilustra a ideia de uma API focada em rotas verdes. A implementação real exigiria a integração com uma dessas plataformas e a lógica para calcular a "sustentabilidade" da rota.</p>`
    },
    "topico6-politicas-legislacao": {
        "title": "T\u00f3pico 6: Pol\u00edticas &amp; Legisla\u00e7\u00e3o",
        "body": `<h1>Tópico 6: Políticas &amp; Legislação</h1>
<h2>O que são Políticas &amp; Legislação?</h2>
<p>Políticas e legislação ambiental e tecnológica referem-se ao conjunto de leis, regulamentos, normas e diretrizes estabelecidas por governos e órgãos internacionais para proteger o meio ambiente, regular o uso da tecnologia e promover o desenvolvimento sustentável. Elas servem como um arcabouço legal para a gestão de recursos naturais, controle da poluição, incentivo a práticas sustentáveis e garantia de que as inovações tecnológicas sejam utilizadas de forma ética e responsável. Essas políticas são essenciais para criar um ambiente de governança que suporte a sustentabilidade e a inovação.</p>
<h2>Como a tecnologia pode ajudar nas Políticas &amp; Legislação?</h2>
<p>A tecnologia desempenha um papel cada vez mais importante no desenvolvimento, implementação e fiscalização de políticas e legislação. Ferramentas digitais podem auxiliar na coleta e análise de dados para informar a criação de leis, monitorar a conformidade, automatizar processos de licenciamento e fiscalização, e aumentar a transparência. Além disso, a tecnologia pode facilitar a comunicação entre cidadãos, empresas e órgãos governamentais, tornando a participação pública mais acessível e eficaz.</p>
<h2>Quais as Normas, Nacionais e Internacionais?</h2>
<h3>Normas Nacionais</h3>
<p>No Brasil, a legislação ambiental é robusta e inclui marcos como a Política Nacional do Meio Ambiente (Lei nº 6.938/81), que estabelece o Sistema Nacional do Meio Ambiente (SISNAMA) e o licenciamento ambiental. Outras leis importantes abrangem a gestão de resíduos sólidos (Lei nº 12.305/10), proteção da flora e fauna, recursos hídricos e unidades de conservação. A tecnologia também é regulamentada por leis de proteção de dados (LGPD), marcos civis da internet e políticas de inovação.</p>
<h3>Normas Internacionais</h3>
<p>Em nível internacional, acordos como o Acordo de Paris sobre mudanças climáticas, a Convenção sobre Diversidade Biológica e a Agenda 2030 para o Desenvolvimento Sustentável (com seus 17 Objetivos de Desenvolvimento Sustentável - ODS) estabelecem metas e diretrizes para a ação global. Organizações como a ISO (International Organization for Standardization) também desenvolvem normas técnicas (ex: ISO 14001 para gestão ambiental) que empresas e governos podem adotar voluntariamente.</p>
<h2>Políticas Públicas</h2>
<p>Políticas públicas são as ações e programas implementados pelo governo para resolver problemas sociais e ambientais. No contexto da sustentabilidade e tecnologia, elas podem incluir:</p>
<ul>
<li><strong>Incentivos Fiscais:</strong> Para empresas que investem em tecnologias limpas ou práticas sustentáveis.</li>
<li><strong>Regulamentação:</strong> Estabelecimento de limites de emissão, padrões de qualidade ambiental e requisitos para o descarte de resíduos.</li>
<li><strong>Investimento em P&amp;D:</strong> Apoio à pesquisa e desenvolvimento de novas tecnologias verdes.</li>
<li><strong>Educação Ambiental:</strong> Programas para conscientizar a população sobre questões ambientais e o uso responsável da tecnologia.</li>
</ul>
<h2>Leis Ambientais e Tecnológicas</h2>
<p>As leis ambientais visam proteger os ecossistemas e a saúde humana, enquanto as leis tecnológicas regulam o uso de novas tecnologias, garantindo a segurança, a privacidade e a ética. A interseção dessas áreas é crescente, com leis que abordam, por exemplo, a responsabilidade ambiental de empresas de tecnologia, a gestão de e-lixo e a segurança de dados em sistemas de monitoramento ambiental.</p>
<h2>Como e onde fazer denúncias</h2>
<p>Para denúncias relacionadas a crimes ambientais ou infrações tecnológicas, a tecnologia pode facilitar o processo. Muitos órgãos governamentais oferecem canais online para denúncias, como sites, aplicativos e ouvidorias digitais. A capacidade de anexar fotos, vídeos e geolocalização torna as denúncias mais eficazes.</p>
<h3>API para Registro de Denúncias Ambientais (Sugestão de Código)</h3>
<p>Um sistema de denúncias pode ser aprimorado com uma API que permita o envio de informações de forma estruturada, facilitando o registro e o encaminhamento para os órgãos competentes. Abaixo, um exemplo conceitual de como uma API de denúncias poderia ser acessada usando Python:</p>
<p>\`\`\`python
import requests
import json</p>
<h1>Exemplo de uso de uma API de denúncias (substitua pela URL e chave da API real)</h1>
<p>def register_environmental_complaint(title, description, location, media_url, contact_info, api_key):
    base_url = "https://api.environmentalcomplaints.gov/v1/complaints"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "title": title,
        "description": description,
        "latitude": location["lat"],
        "longitude": location["lon"],
        "media_url": media_url, # URL de uma imagem ou vídeo anexado
        "contact": contact_info
    }
    try:
        response = requests.post(base_url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()  # Levanta um erro para códigos de status HTTP ruins
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erro ao registrar denúncia: {e}")
        return None</p>
<h1>Substitua pelos seus dados reais</h1>
<p>api_key = "SUA_CHAVE_API_DE_DENUNCIAS"</p>
<p>complaint_title = "Descarte irregular de lixo"
complaint_description = "Grande quantidade de lixo doméstico e entulho descartado em área de preservação."
complaint_location = {"lat": -23.561356, "lon": -46.656596} # Exemplo: Coordenadas de um local em SP
complaint_media = "https://example.com/image_of_dump.jpg"
complaint_contact = {"name": "João Silva", "email": "joao.silva@example.com"}</p>
<p>registration_result = register_environmental_complaint(complaint_title, complaint_description, complaint_location, complaint_media, complaint_contact, api_key)</p>
<p>if registration_result:
    print(f"Denúncia registrada com sucesso! ID: {registration_result.get("complaint_id")}")
else:
    print("Falha ao registrar a denúncia.")
\`\`\`</p>
<p><strong>Observação:</strong> A maioria dos governos e órgãos ambientais possui seus próprios sistemas e APIs para denúncias. O exemplo acima é conceitual e demonstra como a tecnologia pode simplificar e padronizar o processo de denúncia, tornando-o mais acessível e eficiente para os cidadãos. É importante consultar os canais oficiais de cada localidade para informações precisas sobre como e onde fazer denúncias.</p>
<p>[Enviar para Pex da Amanda] - Esta parte será tratada na fase de compilação final, onde o conteúdo da Amanda será incorporado ou referenciado no documento.</p>`
    },
    "topico6-politicas-legislacao-o-que-s-o-pol-ticas-amp-legisla-o-": {
        "title": "O que s\u00e3o Pol\u00edticas &amp; Legisla\u00e7\u00e3o?",
        "body": `<h2>O que são Políticas &amp; Legislação?</h2>
<p>Políticas e legislação ambiental e tecnológica referem-se ao conjunto de leis, regulamentos, normas e diretrizes estabelecidas por governos e órgãos internacionais para proteger o meio ambiente, regular o uso da tecnologia e promover o desenvolvimento sustentável. Elas servem como um arcabouço legal para a gestão de recursos naturais, controle da poluição, incentivo a práticas sustentáveis e garantia de que as inovações tecnológicas sejam utilizadas de forma ética e responsável. Essas políticas são essenciais para criar um ambiente de governança que suporte a sustentabilidade e a inovação.</p>
`
    },
    "topico6-politicas-legislacao-como-a-tecnologia-pode-ajudar-nas-pol-ticas-amp-legisla-o-": {
        "title": "Como a tecnologia pode ajudar nas Pol\u00edticas &amp; Legisla\u00e7\u00e3o?",
        "body": `<h2>Como a tecnologia pode ajudar nas Políticas &amp; Legislação?</h2>
<p>A tecnologia desempenha um papel cada vez mais importante no desenvolvimento, implementação e fiscalização de políticas e legislação. Ferramentas digitais podem auxiliar na coleta e análise de dados para informar a criação de leis, monitorar a conformidade, automatizar processos de licenciamento e fiscalização, e aumentar a transparência. Além disso, a tecnologia pode facilitar a comunicação entre cidadãos, empresas e órgãos governamentais, tornando a participação pública mais acessível e eficaz.</p>
`
    },
    "topico6-politicas-legislacao-quais-as-normas-nacionais-e-internacionais-": {
        "title": "Quais as Normas, Nacionais e Internacionais?",
        "body": `<h2>Quais as Normas, Nacionais e Internacionais?</h2>
`
    },
    "topico6-politicas-legislacao-normas-nacionais": {
        "title": "Normas Nacionais",
        "body": `<h3>Normas Nacionais</h3>
<p>No Brasil, a legislação ambiental é robusta e inclui marcos como a Política Nacional do Meio Ambiente (Lei nº 6.938/81), que estabelece o Sistema Nacional do Meio Ambiente (SISNAMA) e o licenciamento ambiental. Outras leis importantes abrangem a gestão de resíduos sólidos (Lei nº 12.305/10), proteção da flora e fauna, recursos hídricos e unidades de conservação. A tecnologia também é regulamentada por leis de proteção de dados (LGPD), marcos civis da internet e políticas de inovação.</p>
`
    },
    "topico6-politicas-legislacao-normas-internacionais": {
        "title": "Normas Internacionais",
        "body": `<h3>Normas Internacionais</h3>
<p>Em nível internacional, acordos como o Acordo de Paris sobre mudanças climáticas, a Convenção sobre Diversidade Biológica e a Agenda 2030 para o Desenvolvimento Sustentável (com seus 17 Objetivos de Desenvolvimento Sustentável - ODS) estabelecem metas e diretrizes para a ação global. Organizações como a ISO (International Organization for Standardization) também desenvolvem normas técnicas (ex: ISO 14001 para gestão ambiental) que empresas e governos podem adotar voluntariamente.</p>
`
    },
    "topico6-politicas-legislacao-pol-ticas-p-blicas": {
        "title": "Pol\u00edticas P\u00fablicas",
        "body": `<h2>Políticas Públicas</h2>
<p>Políticas públicas são as ações e programas implementados pelo governo para resolver problemas sociais e ambientais. No contexto da sustentabilidade e tecnologia, elas podem incluir:</p>
<ul>
<li><strong>Incentivos Fiscais:</strong> Para empresas que investem em tecnologias limpas ou práticas sustentáveis.</li>
<li><strong>Regulamentação:</strong> Estabelecimento de limites de emissão, padrões de qualidade ambiental e requisitos para o descarte de resíduos.</li>
<li><strong>Investimento em P&amp;D:</strong> Apoio à pesquisa e desenvolvimento de novas tecnologias verdes.</li>
<li><strong>Educação Ambiental:</strong> Programas para conscientizar a população sobre questões ambientais e o uso responsável da tecnologia.</li>
</ul>
`
    },
    "topico6-politicas-legislacao-leis-ambientais-e-tecnol-gicas": {
        "title": "Leis Ambientais e Tecnol\u00f3gicas",
        "body": `<h2>Leis Ambientais e Tecnológicas</h2>
<p>As leis ambientais visam proteger os ecossistemas e a saúde humana, enquanto as leis tecnológicas regulam o uso de novas tecnologias, garantindo a segurança, a privacidade e a ética. A interseção dessas áreas é crescente, com leis que abordam, por exemplo, a responsabilidade ambiental de empresas de tecnologia, a gestão de e-lixo e a segurança de dados em sistemas de monitoramento ambiental.</p>
`
    },
    "topico6-politicas-legislacao-como-e-onde-fazer-den-ncias": {
        "title": "Como e onde fazer den\u00fancias",
        "body": `<h2>Como e onde fazer denúncias</h2>
<p>Para denúncias relacionadas a crimes ambientais ou infrações tecnológicas, a tecnologia pode facilitar o processo. Muitos órgãos governamentais oferecem canais online para denúncias, como sites, aplicativos e ouvidorias digitais. A capacidade de anexar fotos, vídeos e geolocalização torna as denúncias mais eficazes.</p>
`
    },
    "topico6-politicas-legislacao-api-para-registro-de-den-ncias-ambientais-sugest-o-de-c-digo-": {
        "title": "API para Registro de Den\u00fancias Ambientais (Sugest\u00e3o de C\u00f3digo)",
        "body": `<h3>API para Registro de Denúncias Ambientais (Sugestão de Código)</h3>
<p>Um sistema de denúncias pode ser aprimorado com uma API que permita o envio de informações de forma estruturada, facilitando o registro e o encaminhamento para os órgãos competentes. Abaixo, um exemplo conceitual de como uma API de denúncias poderia ser acessada usando Python:</p>
<p>\`\`\`python
import requests
import json</p>
<h1>Exemplo de uso de uma API de denúncias (substitua pela URL e chave da API real)</h1>
<p>def register_environmental_complaint(title, description, location, media_url, contact_info, api_key):
    base_url = "https://api.environmentalcomplaints.gov/v1/complaints"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "title": title,
        "description": description,
        "latitude": location["lat"],
        "longitude": location["lon"],
        "media_url": media_url, # URL de uma imagem ou vídeo anexado
        "contact": contact_info
    }
    try:
        response = requests.post(base_url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()  # Levanta um erro para códigos de status HTTP ruins
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erro ao registrar denúncia: {e}")
        return None</p>
<h1>Substitua pelos seus dados reais</h1>
<p>api_key = "SUA_CHAVE_API_DE_DENUNCIAS"</p>
<p>complaint_title = "Descarte irregular de lixo"
complaint_description = "Grande quantidade de lixo doméstico e entulho descartado em área de preservação."
complaint_location = {"lat": -23.561356, "lon": -46.656596} # Exemplo: Coordenadas de um local em SP
complaint_media = "https://example.com/image_of_dump.jpg"
complaint_contact = {"name": "João Silva", "email": "joao.silva@example.com"}</p>
<p>registration_result = register_environmental_complaint(complaint_title, complaint_description, complaint_location, complaint_media, complaint_contact, api_key)</p>
<p>if registration_result:
    print(f"Denúncia registrada com sucesso! ID: {registration_result.get("complaint_id")}")
else:
    print("Falha ao registrar a denúncia.")
\`\`\`</p>
<p><strong>Observação:</strong> A maioria dos governos e órgãos ambientais possui seus próprios sistemas e APIs para denúncias. O exemplo acima é conceitual e demonstra como a tecnologia pode simplificar e padronizar o processo de denúncia, tornando-o mais acessível e eficiente para os cidadãos. É importante consultar os canais oficiais de cada localidade para informações precisas sobre como e onde fazer denúncias.</p>
<p>[Enviar para Pex da Amanda] - Esta parte será tratada na fase de compilação final, onde o conteúdo da Amanda será incorporado ou referenciado no documento.</p>`
    },
    "topico7-educacao-verde": {
        "title": "T\u00f3pico 7: Educa\u00e7\u00e3o Verde",
        "body": `<h1>Tópico 7: Educação Verde</h1>
<h2>O que é Educação Verde?</h2>
<p>Educação Verde, ou Educação Ambiental, é um processo contínuo e permanente que busca formar indivíduos conscientes e críticos sobre as questões ambientais, incentivando a participação ativa na construção de sociedades sustentáveis. Ela abrange a compreensão das inter-relações entre o ser humano e o meio ambiente, a valorização da biodiversidade, a promoção de hábitos de consumo responsáveis e a defesa da justiça socioambiental. Seu objetivo é desenvolver conhecimentos, habilidades, atitudes e valores que levem à conservação do meio ambiente e à melhoria da qualidade de vida.</p>
<h2>Como a tecnologia pode ajudar na Educação Verde?</h2>
<p>A tecnologia é uma ferramenta poderosa para a Educação Verde, tornando o aprendizado mais acessível, interativo e engajador. Ela permite a criação de conteúdos multimídia ricos, simulações de ecossistemas, jogos educativos, plataformas de e-learning e a disseminação de informações em larga escala. Além disso, a tecnologia pode conectar estudantes e educadores de diferentes partes do mundo, facilitando a troca de experiências e a colaboração em projetos ambientais. Realidade virtual e aumentada, por exemplo, podem transportar os alunos para ambientes naturais ou cenários de impacto ambiental, proporcionando uma experiência imersiva e impactante.</p>
<h2>Quais os objetivos e métodos da Educação Verde?</h2>
<h3>Objetivos</h3>
<ul>
<li><strong>Conscientização:</strong> Desenvolver a percepção e a sensibilidade sobre os problemas ambientais e suas causas.</li>
<li><strong>Conhecimento:</strong> Fornecer informações e compreensão sobre o meio ambiente e a relação humana com ele.</li>
<li><strong>Atitudes:</strong> Promover valores e sentimentos de preocupação com o meio ambiente e motivação para melhorá-lo.</li>
<li><strong>Habilidades:</strong> Desenvolver a capacidade de identificar e resolver problemas ambientais.</li>
<li><strong>Participação:</strong> Incentivar a ação individual e coletiva na resolução de questões ambientais.</li>
</ul>
<h3>Métodos</h3>
<ul>
<li><strong>Aprendizagem Baseada em Projetos:</strong> Envolver os alunos em projetos práticos que abordem problemas ambientais reais.</li>
<li><strong>Aulas de Campo:</strong> Visitas a parques, reservas, estações de tratamento ou empresas com práticas sustentáveis.</li>
<li><strong>Recursos Multimídia:</strong> Utilização de vídeos, documentários, infográficos e plataformas interativas.</li>
<li><strong>Gamificação:</strong> Criação de jogos e desafios que tornem o aprendizado sobre sustentabilidade divertido e competitivo.</li>
<li><strong>Debates e Discussões:</strong> Promover o pensamento crítico e a troca de ideias sobre temas ambientais complexos.</li>
</ul>
<h2>Projetos, Histórias e Workshops</h2>
<ul>
<li><strong>Projetos de Horta Escolar:</strong> Ensinam sobre cultivo orgânico, ciclo da água e alimentação saudável.</li>
<li><strong>Campanhas de Reciclagem:</strong> Envolvem a comunidade na separação e destinação correta de resíduos.</li>
<li><strong>Workshops de Reuso e Upcycling:</strong> Ensinam a transformar materiais descartados em novos produtos, reduzindo o lixo.</li>
<li><strong>Histórias de Sucesso:</strong> Compartilhar exemplos de comunidades ou indivíduos que fizeram a diferença na proteção ambiental.</li>
</ul>
<h2>Benefícios</h2>
<p>Os benefícios da Educação Verde são amplos e de longo prazo:</p>
<ul>
<li><strong>Cidadãos Mais Engajados:</strong> Formação de indivíduos mais conscientes e ativos na defesa do meio ambiente.</li>
<li><strong>Desenvolvimento Sustentável:</strong> Contribuição para a construção de uma sociedade que atenda às necessidades do presente sem comprometer as gerações futuras.</li>
<li><strong>Inovação:</strong> Estímulo à criatividade e ao desenvolvimento de soluções tecnológicas para desafios ambientais.</li>
<li><strong>Saúde e Bem-Estar:</strong> Promoção de ambientes mais saudáveis e de um estilo de vida mais equilibrado.</li>
</ul>
<h2>Vídeos sobre o tema (conteúdo para usuário assistir)</h2>
<p>Recomenda-se a inclusão de vídeos educativos e inspiradores sobre temas como mudanças climáticas, conservação da biodiversidade, energias renováveis e consumo consciente. Esses vídeos podem ser de documentários, canais educativos no YouTube ou produções independentes que abordem a temática de forma didática e envolvente.</p>
<h3>API de Quiz para Educação Verde (Sugestão de Código)</h3>
<p>Para tornar a Educação Verde mais interativa e avaliar o conhecimento dos participantes, pode-se desenvolver um quiz online. Uma API de quiz pode gerenciar perguntas, respostas e pontuações. Abaixo, um exemplo conceitual de como uma API de quiz poderia ser acessada usando Python:</p>
<p>\`\`\`python
import requests
import json</p>
<h1>Exemplo de uso de uma API de quiz (substitua pela URL e chave da API real)</h1>
<p>def get_quiz_questions(topic, num_questions, api_key):
    base_url = "https://api.greenquiz.com/v1/questions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    params = {
        "topic": topic,
        "limit": num_questions
    }
    try:
        response = requests.get(base_url, headers=headers, params=params)
        response.raise_for_status()  # Levanta um erro para códigos de status HTTP ruins
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print(f"Erro ao obter perguntas do quiz: {e}")
        return None</p>
<p>def submit_quiz_answers(user_id, quiz_id, answers, api_key):
    base_url = "https://api.greenquiz.com/v1/submit_answers"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "user_id": user_id,
        "quiz_id": quiz_id,
        "answers": answers
    }
    try:
        response = requests.post(base_url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()  # Levanta um erro para códigos de status HTTP ruins
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erro ao enviar respostas do quiz: {e}")
        return None</p>
<h1>Substitua pelos seus dados reais</h1>
<p>api_key = "SUA_CHAVE_API_DE_QUIZ"
user_id = "user123"</p>
<h1>Obter perguntas sobre "Energia Limpa"</h1>
<p>quiz_questions = get_quiz_questions("energia_limpa", 3, api_key)</p>
<p>if quiz_questions and quiz_questions.get("questions"):
    print("Perguntas do Quiz sobre Energia Limpa:")
    quiz_id = quiz_questions.get("quiz_id")
    user_answers = []
    for i, question in enumerate(quiz_questions["questions"]):
        print(f"\n{i+1}. {question.get("text")}")
        for j, option in enumerate(question.get("options", [])):
            print(f"   {chr(65+j)}. {option}")
        # Simulação de resposta do usuário
        # Em um aplicativo real, o usuário forneceria a resposta
        if i == 0: # Resposta para a primeira pergunta
            user_answers.append({"question_id": question.get("id"), "answer": "B"})
        elif i == 1: # Resposta para a segunda pergunta
            user_answers.append({"question_id": question.get("id"), "answer": "A"})
        elif i == 2: # Resposta para a terceira pergunta
            user_answers.append({"question_id": question.get("id"), "answer": "C"})</p>
<pre><code># Enviar respostas do usuário
submission_result = submit_quiz_answers(user_id, quiz_id, user_answers, api_key)

if submission_result:
    print(f"\nRespostas do quiz enviadas. Pontuação: {submission_result.get("score")}/{submission_result.get("total_questions")}")
    print(f"Feedback: {submission_result.get("feedback")}")
else:
    print("Falha ao enviar respostas do quiz.")
</code></pre>
<p>else:
    print("Não foi possível obter perguntas do quiz.")
\`\`\`</p>
<p><strong>Observação:</strong> Uma API de quiz real precisaria de um backend para armazenar perguntas, validar respostas e calcular pontuações. O exemplo acima é conceitual e ilustra a interação cliente-servidor para um quiz educativo. Existem plataformas de e-learning e ferramentas de quiz que oferecem APIs para integração.</p>`
    },
    "topico7-educacao-verde-o-que-educa-o-verde-": {
        "title": "O que \u00e9 Educa\u00e7\u00e3o Verde?",
        "body": `<h2>O que é Educação Verde?</h2>
<p>Educação Verde, ou Educação Ambiental, é um processo contínuo e permanente que busca formar indivíduos conscientes e críticos sobre as questões ambientais, incentivando a participação ativa na construção de sociedades sustentáveis. Ela abrange a compreensão das inter-relações entre o ser humano e o meio ambiente, a valorização da biodiversidade, a promoção de hábitos de consumo responsáveis e a defesa da justiça socioambiental. Seu objetivo é desenvolver conhecimentos, habilidades, atitudes e valores que levem à conservação do meio ambiente e à melhoria da qualidade de vida.</p>
`
    },
    "topico7-educacao-verde-como-a-tecnologia-pode-ajudar-na-educa-o-verde-": {
        "title": "Como a tecnologia pode ajudar na Educa\u00e7\u00e3o Verde?",
        "body": `<h2>Como a tecnologia pode ajudar na Educação Verde?</h2>
<p>A tecnologia é uma ferramenta poderosa para a Educação Verde, tornando o aprendizado mais acessível, interativo e engajador. Ela permite a criação de conteúdos multimídia ricos, simulações de ecossistemas, jogos educativos, plataformas de e-learning e a disseminação de informações em larga escala. Além disso, a tecnologia pode conectar estudantes e educadores de diferentes partes do mundo, facilitando a troca de experiências e a colaboração em projetos ambientais. Realidade virtual e aumentada, por exemplo, podem transportar os alunos para ambientes naturais ou cenários de impacto ambiental, proporcionando uma experiência imersiva e impactante.</p>
`
    },
    "topico7-educacao-verde-quais-os-objetivos-e-m-todos-da-educa-o-verde-": {
        "title": "Quais os objetivos e m\u00e9todos da Educa\u00e7\u00e3o Verde?",
        "body": `<h2>Quais os objetivos e métodos da Educação Verde?</h2>
`
    },
    "topico7-educacao-verde-objetivos": {
        "title": "Objetivos",
        "body": `<h3>Objetivos</h3>
<ul>
<li><strong>Conscientização:</strong> Desenvolver a percepção e a sensibilidade sobre os problemas ambientais e suas causas.</li>
<li><strong>Conhecimento:</strong> Fornecer informações e compreensão sobre o meio ambiente e a relação humana com ele.</li>
<li><strong>Atitudes:</strong> Promover valores e sentimentos de preocupação com o meio ambiente e motivação para melhorá-lo.</li>
<li><strong>Habilidades:</strong> Desenvolver a capacidade de identificar e resolver problemas ambientais.</li>
<li><strong>Participação:</strong> Incentivar a ação individual e coletiva na resolução de questões ambientais.</li>
</ul>
`
    },
    "topico7-educacao-verde-m-todos": {
        "title": "M\u00e9todos",
        "body": `<h3>Métodos</h3>
<ul>
<li><strong>Aprendizagem Baseada em Projetos:</strong> Envolver os alunos em projetos práticos que abordem problemas ambientais reais.</li>
<li><strong>Aulas de Campo:</strong> Visitas a parques, reservas, estações de tratamento ou empresas com práticas sustentáveis.</li>
<li><strong>Recursos Multimídia:</strong> Utilização de vídeos, documentários, infográficos e plataformas interativas.</li>
<li><strong>Gamificação:</strong> Criação de jogos e desafios que tornem o aprendizado sobre sustentabilidade divertido e competitivo.</li>
<li><strong>Debates e Discussões:</strong> Promover o pensamento crítico e a troca de ideias sobre temas ambientais complexos.</li>
</ul>
`
    },
    "topico7-educacao-verde-projetos-hist-rias-e-workshops": {
        "title": "Projetos, Hist\u00f3rias e Workshops",
        "body": `<h2>Projetos, Histórias e Workshops</h2>
<ul>
<li><strong>Projetos de Horta Escolar:</strong> Ensinam sobre cultivo orgânico, ciclo da água e alimentação saudável.</li>
<li><strong>Campanhas de Reciclagem:</strong> Envolvem a comunidade na separação e destinação correta de resíduos.</li>
<li><strong>Workshops de Reuso e Upcycling:</strong> Ensinam a transformar materiais descartados em novos produtos, reduzindo o lixo.</li>
<li><strong>Histórias de Sucesso:</strong> Compartilhar exemplos de comunidades ou indivíduos que fizeram a diferença na proteção ambiental.</li>
</ul>
`
    },
    "topico7-educacao-verde-benef-cios": {
        "title": "Benef\u00edcios",
        "body": `<h2>Benefícios</h2>
<p>Os benefícios da Educação Verde são amplos e de longo prazo:</p>
<ul>
<li><strong>Cidadãos Mais Engajados:</strong> Formação de indivíduos mais conscientes e ativos na defesa do meio ambiente.</li>
<li><strong>Desenvolvimento Sustentável:</strong> Contribuição para a construção de uma sociedade que atenda às necessidades do presente sem comprometer as gerações futuras.</li>
<li><strong>Inovação:</strong> Estímulo à criatividade e ao desenvolvimento de soluções tecnológicas para desafios ambientais.</li>
<li><strong>Saúde e Bem-Estar:</strong> Promoção de ambientes mais saudáveis e de um estilo de vida mais equilibrado.</li>
</ul>
`
    },
    "topico7-educacao-verde-v-deos-sobre-o-tema-conte-do-para-usu-rio-assistir-": {
        "title": "V\u00eddeos sobre o tema (conte\u00fado para usu\u00e1rio assistir)",
        "body": `<h2>Vídeos sobre o tema (conteúdo para usuário assistir)</h2>
<p>Recomenda-se a inclusão de vídeos educativos e inspiradores sobre temas como mudanças climáticas, conservação da biodiversidade, energias renováveis e consumo consciente. Esses vídeos podem ser de documentários, canais educativos no YouTube ou produções independentes que abordem a temática de forma didática e envolvente.</p>
`
    },
    "topico7-educacao-verde-api-de-quiz-para-educa-o-verde-sugest-o-de-c-digo-": {
        "title": "API de Quiz para Educa\u00e7\u00e3o Verde (Sugest\u00e3o de C\u00f3digo)",
        "body": `<h3>API de Quiz para Educação Verde (Sugestão de Código)</h3>
<p>Para tornar a Educação Verde mais interativa e avaliar o conhecimento dos participantes, pode-se desenvolver um quiz online. Uma API de quiz pode gerenciar perguntas, respostas e pontuações. Abaixo, um exemplo conceitual de como uma API de quiz poderia ser acessada usando Python:</p>
<p>\`\`\`python
import requests
import json</p>
<h1>Exemplo de uso de uma API de quiz (substitua pela URL e chave da API real)</h1>
<p>def get_quiz_questions(topic, num_questions, api_key):
    base_url = "https://api.greenquiz.com/v1/questions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    params = {
        "topic": topic,
        "limit": num_questions
    }
    try:
        response = requests.get(base_url, headers=headers, params=params)
        response.raise_for_status()  # Levanta um erro para códigos de status HTTP ruins
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print(f"Erro ao obter perguntas do quiz: {e}")
        return None</p>
<p>def submit_quiz_answers(user_id, quiz_id, answers, api_key):
    base_url = "https://api.greenquiz.com/v1/submit_answers"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "user_id": user_id,
        "quiz_id": quiz_id,
        "answers": answers
    }
    try:
        response = requests.post(base_url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()  # Levanta um erro para códigos de status HTTP ruins
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erro ao enviar respostas do quiz: {e}")
        return None</p>
<h1>Substitua pelos seus dados reais</h1>
<p>api_key = "SUA_CHAVE_API_DE_QUIZ"
user_id = "user123"</p>
<h1>Obter perguntas sobre "Energia Limpa"</h1>
<p>quiz_questions = get_quiz_questions("energia_limpa", 3, api_key)</p>
<p>if quiz_questions and quiz_questions.get("questions"):
    print("Perguntas do Quiz sobre Energia Limpa:")
    quiz_id = quiz_questions.get("quiz_id")
    user_answers = []
    for i, question in enumerate(quiz_questions["questions"]):
        print(f"\n{i+1}. {question.get("text")}")
        for j, option in enumerate(question.get("options", [])):
            print(f"   {chr(65+j)}. {option}")
        # Simulação de resposta do usuário
        # Em um aplicativo real, o usuário forneceria a resposta
        if i == 0: # Resposta para a primeira pergunta
            user_answers.append({"question_id": question.get("id"), "answer": "B"})
        elif i == 1: # Resposta para a segunda pergunta
            user_answers.append({"question_id": question.get("id"), "answer": "A"})
        elif i == 2: # Resposta para a terceira pergunta
            user_answers.append({"question_id": question.get("id"), "answer": "C"})</p>
<pre><code># Enviar respostas do usuário
submission_result = submit_quiz_answers(user_id, quiz_id, user_answers, api_key)

if submission_result:
    print(f"\nRespostas do quiz enviadas. Pontuação: {submission_result.get("score")}/{submission_result.get("total_questions")}")
    print(f"Feedback: {submission_result.get("feedback")}")
else:
    print("Falha ao enviar respostas do quiz.")
</code></pre>
<p>else:
    print("Não foi possível obter perguntas do quiz.")
\`\`\`</p>
<p><strong>Observação:</strong> Uma API de quiz real precisaria de um backend para armazenar perguntas, validar respostas e calcular pontuações. O exemplo acima é conceitual e ilustra a interação cliente-servidor para um quiz educativo. Existem plataformas de e-learning e ferramentas de quiz que oferecem APIs para integração.</p>`
    },
};

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const modalTargetId = card.getAttribute('data-modal-target');
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
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });


    document.addEventListener("DOMContentLoaded", () => {
        const accordions = document.querySelectorAll(".accordion");

        accordions.forEach(acc => {
            const header = acc.querySelector(".accordion-header");
            header.addEventListener("click", () => {
                // Se quiser permitir múltiplos abertos, basta remover o loop abaixo
                accordions.forEach(a => {
                    if (a !== acc) a.classList.remove("active");
                });

                acc.classList.toggle("active");
            });
        });
    });

});
