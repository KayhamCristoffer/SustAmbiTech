
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.grid-item[data-modal-target]');
    const modalOverlay = document.getElementById('serviceModalOverlay');
    const modalCloseButton = document.getElementById('modalCloseButton');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    // Conteúdo detalhado para cada modal
    const modalContentData = {

        "qualidade-ar": {
            title: "Qualidade do Ar",
            body: `
                        <p>Monitore a poluição em áreas urbanas, perto de indústrias ou em grandes rodovias. Acompanhe em tempo real os níveis de poluentes e receba alertas para dias de má qualidade do ar.</p>
                        <p>Essencial para a saúde respiratória e planejamento urbano.</p>
                        <p>
                            **Exemplo de API:**
                            <a href="https://openaq.org/" target="_blank">OpenAQ</a>: Fornece dados em tempo real sobre a qualidade do ar de diversas cidades no mundo.
                        </p>
                    `
        },
        "qualidade-agua": {
            title: "Qualidade da Água",
            body: `
                        <p>Monitore rios, lagos, aquíferos ou a água potável em uma comunidade. Identifique contaminações, variações de pH e outros indicadores para proteger ecossistemas e saúde pública.</p>
                        <p>
                            **Exemplo de API:**
                            <a href="https://data.gov.br/datasets/dados-abertos" target="_blank">Dados Abertos Brasil</a>: Fonte de dados governamentais que pode ser usada para encontrar informações sobre a qualidade da água no Brasil.
                        </p>
                    `
        },
        "analise-dados": {
            title: "Visualização e Análise de Dados",
            body: `
                        <p>Transformamos dados brutos em informações úteis e acionáveis, como alertas e tendências. Utilize nossa plataforma para visualizar gráficos e mapas interativos que ajudam a entender padrões de poluição ao longo do tempo.</p>
                        <p>
                            **Exemplo de Biblioteca de Gráficos:**
                            <a href="https://www.chartjs.org/" target="_blank">Chart.js</a>: Biblioteca JavaScript para criar gráficos dinâmicos.
                        </p>
                        <p>
                            **Exemplo de API de Mapa:**
                            <a href="https://leafletjs.com/" target="_blank">Leaflet</a>: Biblioteca JavaScript de código aberto para mapas interativos.
                        </p>
                    `
        },
        "solucoes-residenciais": {
            title: "Soluções Residenciais",
            body: `
                        <p>Saiba como economizar energia em sua casa com dispositivos inteligentes. Nossos sistemas automatizam o uso de iluminação, aquecimento e outros eletrodomésticos com base em seu consumo diário e nos custos de energia, tudo em tempo real.</p>
                        <p>
                            **Exemplo de API:**
                            <a href="https://www.eia.gov/opendata/" target="_blank">EIA Open Data API</a>: Dados sobre energia para análise de consumo e tendências.
                        </p>
                    `
        },
        "solucoes-empresariais": {
            title: "Soluções Empresariais",
            body: `
                        <p>Oferecemos sistemas de gestão energética para indústrias e grandes empresas. Com painéis de controle detalhados e análises preditivas, você pode identificar ineficiências e otimizar o consumo, gerando economia significativa e reduzindo a pegada de carbono.</p>
                        <p>
                            **Exemplo de API:**
                            <a href="https://www.eia.gov/opendata/" target="_blank">EIA Open Data API</a>: Dados sobre energia para análise de consumo e tendências em larga escala.
                        </p>
                    `
        },
        "engajamento-comunidade": {
            title: "Engajamento da Comunidade",
            body: `
                        <p>Transformamos a reciclagem em uma experiência interativa e recompensadora. Nossos programas utilizam gamificação e incentivos para motivar a população a reciclar de forma correta e eficiente.</p>
                        <p>
                            **Exemplo de API:**
                            <a href="https://data.world/datasets/waste" target="_blank">Data.world - Waste Management Datasets</a>: Base de dados sobre gestão de resíduos para estudos e análises.
                        </p>
                    `
        },
        "transporte-publico": {
            title: "Integração com Transporte Público",
            body: `
                        <p>Nossos sistemas facilitam o planejamento de viagens usando transporte público. Com informações em tempo real sobre rotas, horários e alternativas, ajudamos a diminuir o uso de carros particulares, reduzindo o tráfego e as emissões de poluentes.</p>
                        <p>
                            **Exemplo de API:**
                            <a href="https://developer.transport.gov.scot/api-details#api=travel-time" target="_blank">Travel Time API</a>: API para otimizar rotas e analisar tempos de viagem.
                        </p>
                    `
        },
        "carregamento-veiculos": {
            title: "Infraestrutura de Carregamento",
            body: `
                        <p>Desenvolvemos soluções para a expansão de estações de carregamento para veículos elétricos. Desde o planejamento da rede até a instalação e gerenciamento, garantimos que a transição para a mobilidade elétrica seja prática e eficiente.</p>
                        <p>
                            **Exemplo de API:**
                            <a href="https://developer.transport.gov.scot/api-details#api=travel-time" target="_blank">Travel Time API</a>: API que pode ser utilizada para mapear e gerenciar a infraestrutura de carregamento.
                        </p>
                    `
        },
        "rastreabilidade-produtos": {
            title: "Rastreabilidade de Produtos",
            body: `
                        <p>Utilizamos a tecnologia para rastrear a origem e a cadeia de produção de produtos. Nossa plataforma permite que os consumidores escaneiem um código de barras e vejam o impacto ambiental e social de suas compras, garantindo escolhas mais conscientes.</p>
                        <p>
                            **Exemplo de API:**
                            <a href="https://world.openfoodfacts.org/data" target="_blank">Open Food Facts API</a>: Dados sobre ingredientes e informações nutricionais de produtos.
                        </p>
                    `
        },
        "auditoria-consultoria": {
            title: "Auditoria e Consultoria",
            body: `
                        <p>Nossa equipe especializada em legislação ambiental oferece serviços de auditoria e consultoria. Ajudamos sua empresa a se adequar às normas e a implementar práticas sustentáveis que vão além das exigências legais, fortalecendo sua reputação.</p>
                        <p>
                            **Exemplo de API:**
                            <a href="https://developer.usa.gov/en/environmental_protection.html" target="_blank">USA.gov Environmental Protection API</a>: Dados do governo sobre regulamentações ambientais.
                        </p>
                    `
        },
        "materiais-interativos": {
            title: "Materiais Interativos",
            body: `
                        <p>Promovemos a educação ambiental através de workshops, palestras e materiais interativos, visando conscientizar e engajar a sociedade sobre a importância da sustentabilidade em todos os aspectos da vida. Nossa plataforma oferece recursos de aprendizado lúdicos para todas as idades.</p>
                        <p>
                            **Exemplo de API:**
                            <a href="https://data.gov.br/datasets/dados-abertos" target="_blank">Dados Abertos Brasil</a>: Fonte de dados governamentais que pode ser usada para criar conteúdos educativos.
                        </p>
                    `
        }, // ... dentro do objeto modalContentData

        "iluminacao-led": {
            title: "Iluminação LED",
            body: `
        <p>A substituição das lâmpadas tradicionais por lâmpadas LED é uma das formas mais simples e eficientes de reduzir o consumo de energia. As lâmpadas LED consomem até 80% menos energia do que as lâmpadas incandescentes, além de durar muito mais tempo. Isso não só reduz a conta de luz, mas também diminui o desperdício de energia.</p>
    `
        },
        "controle-celular": {
            title: "Controle de Luz e Aparelhos via Celular",
            body: `
        <p>Além da iluminação LED, é possível controlar a energia de forma inteligente por meio de aplicativos que permitem o gerenciamento remoto de lâmpadas, ventiladores, ar-condicionado e outros aparelhos elétricos.</p>
        <p>Algumas das tecnologias mais comuns são:</p>
        <ul>
            <li><strong>Alexa (Amazon):</strong> Assistentes virtuais como a Alexa permitem programar desligamentos automáticos de luzes, aumentar ou diminuir a temperatura dos cômodos dependendo do tempo ou da presença de pessoas. Por exemplo, é possível programar para que as luzes se desliguem automaticamente quando ninguém estiver em casa ou para que o ar-condicionado ajuste a temperatura de acordo com a hora do dia ou o clima externo.</li>
            <li><strong>Google Home:</strong> Semelhante à Alexa, o Google Home permite o controle remoto de diversos dispositivos da casa, criando uma experiência mais eficiente de economia de energia.</li>
        </ul>
        <p>Esses sistemas podem ser integrados a sensores de movimento e sensores de presença para garantir que a energia só seja consumida quando realmente necessário.</p>
    `
        },
        "dicas-personalizadas": {
            title: "Dicas Personalizadas para Reduzir Consumo",
            body: `
        <p>Além de adotar tecnologias como LEDs e sistemas automatizados, há diversas dicas práticas que podem ser incorporadas no dia a dia para reduzir o consumo de energia:</p>
        <ul>
            <li><strong>Use luz natural:</strong> Aproveitar a luz do sol ao máximo durante o dia pode reduzir significativamente o uso de luz artificial.</li>
            <li><strong>Desligue aparelhos em standby:</strong> Muitos aparelhos continuam consumindo energia mesmo quando estão apagados, no chamado modo standby. Desligá-los completamente pode gerar economia.</li>
            <li><strong>Mantenha os eletrodomésticos limpos:</strong> Aparelhos como geladeiras e condicionadores de ar funcionam de forma mais eficiente quando estão limpos, o que ajuda a evitar o desperdício de energia.</li>
            <li><strong>Utilize timers e programadores:</strong> Para dispositivos como aquecedores de água e lâmpadas, é possível programar horários de funcionamento, evitando que fiquem ligados sem necessidade.</li>
        </ul>
        <br>
        <h3>Dicas de Projetos de Economia de Energia</h3>
        <p>Para quem deseja implementar soluções mais avançadas, é possível criar projetos de casas automatizadas. Tais projetos incluem:</p>
        <ul>
            <li><strong>Monitoramento em tempo real:</strong> Utilização de aplicativos que monitoram o consumo de energia em tempo real e enviam alertas caso haja algum pico ou desperdício.</li>
            <li><strong>Sistemas de controle remoto via smartphone:</strong> Implantação de sistemas de controle remoto para luzes, ventiladores, aparelhos de ar-condicionado e até eletrodomésticos, permitindo programar horários de uso para evitar o desperdício.</li>
        </ul>
    `
        },
        "energia-limpa": {
            title: "Sistemas de Energia Limpa e Renovável",
            body: `
        <p>Uma das formas mais eficazes de reduzir o impacto ambiental e a conta de energia é o uso de energia limpa. Os sistemas de painéis solares, por exemplo, permitem que você gere sua própria energia a partir do sol, reduzindo a dependência da rede elétrica e, consequentemente, seus custos com eletricidade. A instalação de painéis solares pode ser feita tanto em residências quanto em empresas, e ao longo do tempo, o retorno financeiro é bastante significativo.</p>
    `
        },
        "automacao-residencial": {
            title: "Automação Residencial e Casas Inteligentes",
            body: `
        <p>A automação residencial é outra maneira de economizar energia. Sistemas como Casa Inteligente permitem que todos os dispositivos, como luzes, aquecimento, ventilação e eletrodomésticos, sejam controlados de forma integrada por meio de um único aplicativo ou dispositivo. Exemplos incluem:</p>
        <ul>
            <li><strong>Projetos de automação de casas:</strong> A instalação de dispositivos conectados em cada parte da casa, como termostatos inteligentes (Nest), interruptores de luz controlados por aplicativo e câmeras de segurança que monitoram o uso de energia, pode gerar uma economia significativa.</li>
            <li><strong>Prompt para IA:</strong> A inteligência artificial pode ser utilizada para criar automação personalizada, onde o sistema aprende os hábitos dos moradores e ajusta o consumo de energia conforme esses padrões. Por exemplo, a IA pode desligar automaticamente as luzes em uma casa quando todos saem e otimizar o funcionamento do ar-condicionado para garantir um ambiente confortável sem desperdício de energia.</li>
        </ul>
        <br>
        <h3>Cenários de Economia: Exemplos Práticos de Automação</h3>
        <p>A automação residencial pode tornar o processo de economia de energia mais simples e eficiente. Abaixo estão alguns exemplos práticos, ou "cenas", que os usuários podem replicar para controlar e reduzir seu consumo de energia.</p>
        <br>
        <h4>Cena "Saída de Casa"</h4>
        <p><strong>Objetivo:</strong> Desligar todas as luzes e aparelhos em standby ao sair de casa.</p>
        <p><strong>Como Funciona:</strong> Ao sair de casa, um único comando, seja por um aplicativo ou assistente de voz, desliga automaticamente todas as luzes, televisores, computadores e qualquer outro aparelho em modo standby. Isso pode ser integrado a sensores de presença, onde, ao detectar a ausência de pessoas, os aparelhos também são desligados.</p>
        <br>
        <h4>Cena "Economia Noturna"</h4>
        <p><strong>Objetivo:</strong> Desligar as luzes e aparelhos automaticamente após certo horário.</p>
        <p><strong>Como Funciona:</strong> O sistema é configurado para apagar as luzes e desligar os aparelhos em standby automaticamente após um horário específico, como 23h00, por exemplo. Isso pode incluir o desligamento do ar-condicionado, se estiver em modo standby ou funcionando de maneira ineficiente.</p>
        <br>
        <h4>Cena "Economia de Verão"</h4>
        <p><strong>Objetivo:</strong> Programar o ar-condicionado para ligar minutos antes de você chegar em casa, evitando consumo excessivo.</p>
        <p><strong>Como Funciona:</strong> O ar-condicionado é configurado para ligar automaticamente alguns minutos antes da chegada do usuário, garantindo que a casa esteja agradável sem a necessidade de trabalhar em alta potência por um longo período. Esse ajuste pode ser feito de forma inteligente, considerando a temperatura externa, a ocupação da casa e o histórico de uso do ar-condicionado.</p>
    `
        },
        "quiz-consumo": {
            title: "Dicas Personalizadas para Reduzir o Consumo",
            body: `
        <p>A personalização das dicas é fundamental para oferecer soluções práticas e eficientes para cada tipo de usuário. Um quiz interativo pode ajudar a fornecer essas dicas, tornando o processo mais dinâmico e ajustado às necessidades de cada pessoa.</p>
        
        <h3>Quiz de Consumo:</h3>
        <p><strong>Objetivo:</strong> Coletar informações para fornecer recomendações personalizadas.</p>
        <p><strong>Estrutura do Formulário:</strong></p>
        <ul>
            <li>Tipo de moradia: Casa ou apartamento.</li>
            <li>Número de moradores.</li>
            <li>Principais eletrodomésticos: Geladeira, ar-condicionado, máquina de lavar, chuveiro elétrico.</li>
            <li>Hábitos de uso: Horário em que as pessoas ficam em casa, tempo de banho, uso de ar-condicionado, etc.</li>
        </ul>
        <br>
        <p><strong>Exemplo de Perguntas:</strong></p>
        <ul>
            <li>Quantas pessoas moram na sua casa?</li>
            <li>Qual é a sua principal fonte de aquecimento de água?</li>
            <li>Você usa ar-condicionado frequentemente? Em que horários?</li>
        </ul>
        <br>
        <h3>Análise e Feedback:</h3>
        <p>Após preencher o quiz, o site pode gerar um relatório personalizado com as seguintes informações:</p>
        <ul>
            <li><strong>Identificação de "Vilões" do Consumo:</strong> O sistema destaca os aparelhos que mais consomem energia.</li>
            <li><strong>Metas de Economia:</strong> Sugestões realistas para redução de consumo.</li>
            <li><strong>Dicas Acionáveis e Personalizadas:</strong> Exemplo: "Troque lâmpadas fluorescentes por LEDs para economizar R$ 25,00 por mês."</li>
            <li><strong>Recomendação de Produtos:</strong> Exemplo: "Para economizar com sua geladeira, sugerimos o uso de uma tomada inteligente."</li>
        </ul>
    `
        },// ... dentro do objeto modalContentData
        "sobre-economia": {
            title: "Sobre a Economia de Energia",
            body: `
        <p>A economia de energia é o conjunto de ações e medidas adotadas para reduzir o consumo de energia sem comprometer o conforto ou a funcionalidade de um ambiente. Essa prática visa reduzir os custos com eletricidade, diminuir a pegada ambiental e melhorar a eficiência dos sistemas energéticos.</p>
        <p>É um tema essencial nos dias de hoje, especialmente com a crescente preocupação com os impactos ambientais e o aumento dos custos de eletricidade. Existem diversas maneiras de reduzir o consumo de energia de forma inteligente, e uma das opções mais populares é o uso de tecnologias inovadoras que ajudam a otimizar o consumo, como sistemas automatizados e dispositivos conectados. A economia de energia consiste em otimizar o uso de eletricidade, promovendo o consumo responsável. Ela envolve tanto a conscientização sobre o uso excessivo de energia quanto a implementação de tecnologias que ajudam a monitorar e controlar o consumo de forma mais eficiente.</p>
    `
        },// ... dentro do objeto modalContentData
        "dicas-projetos": {
            title: "Dicas de Projetos de Economia de Energia",
            body: `
        <p>Para quem deseja implementar soluções mais avançadas, é possível criar projetos de casas automatizadas. Tais projetos incluem:</p>
        <ul>
            <li><strong>Monitoramento em tempo real:</strong> Utilização de aplicativos que monitoram o consumo de energia em tempo real e enviam alertas caso haja algum pico ou desperdício.</li>
            <li><strong>Sistemas de controle remoto via smartphone:</strong> Implantação de sistemas de controle remoto para luzes, ventiladores, aparelhos de ar-condicionado e até eletrodomésticos, permitindo programar horários de uso para evitar o desperdício.</li>
        </ul>
    `
        },
        "quiz-consumo": {
            title: "Quiz de Consumo",
            body: `
        <p>A personalização das dicas é fundamental para oferecer soluções práticas e eficientes para cada tipo de usuário. Um quiz interativo pode ajudar a fornecer essas dicas, tornando o processo mais dinâmico e ajustado às necessidades de cada pessoa.</p>
        <br>
        <h3>Estrutura do Formulário:</h3>
        <ul>
            <li>Tipo de moradia: Casa ou apartamento.</li>
            <li>Número de moradores.</li>
            <li>Principais eletrodomésticos: Geladeira, ar-condicionado, máquina de lavar, chuveiro elétrico.</li>
            <li>Hábitos de uso: Horário em que as pessoas ficam em casa, tempo de banho, uso de ar-condicionado, etc.</li>
        </ul>
        <br>
        <h3>Exemplo de Perguntas:</h3>
        <ul>
            <li>Quantas pessoas moram na sua casa?</li>
            <li>Qual é a sua principal fonte de aquecimento de água (chuveiro elétrico ou aquecedor solar)?</li>
            <li>Você usa ar-condicionado frequentemente? Em que horários?</li>
        </ul>
        <br>
        <h3>Análise e Feedback:</h3>
        <p>Após preencher o quiz, o site pode gerar um relatório personalizado com as seguintes informações:</p>
        <ul>
            <li><strong>Identificação de "Vilões" do Consumo:</strong> O sistema destaca os aparelhos que mais consomem energia com base nas respostas fornecidas.</li>
            <li><strong>Metas de Economia:</strong> Sugestões realistas para redução de consumo.</li>
            <li><strong>Dicas Acionáveis e Personalizadas:</strong> Exemplo: "Você ainda usa lâmpadas fluorescentes na sala? Considerando que você tem 3 lâmpadas acesas por 6 horas por dia, a troca por LEDs pode economizar R$ 25,00 por mês."</li>
            <li><strong>Recomendação de Produtos:</strong> Exemplo: "Para economizar com sua geladeira, que fica ligada 24 horas por dia, sugerimos o uso de uma tomada inteligente. Esse dispositivo permite que você monitore o consumo e desligue automaticamente quando necessário, economizando até 10% na conta de energia."</li>
        </ul>
        <br>
        <p>Adotar práticas de economia de energia traz benefícios financeiros e ambientais, além de promover um estilo de vida mais consciente. Utilizando tecnologia de automação e implementando pequenas mudanças no cotidiano, é possível reduzir significativamente o consumo de energia, contribuindo para a preservação do meio ambiente e um maior controle sobre as finanças pessoais.</p>
    `
        },// ... dentro do objeto modalContentData

        "sobre-politicas": {
            title: "Sobre a Sustentabilidade Legal",
            body: `
        <p>A sustentabilidade não depende apenas de escolhas individuais ou empresariais. Ela está fortemente vinculada a normas jurídicas, políticas públicas e acordos internacionais que orientam governos, organizações e cidadãos. Nossa equipe acompanha e analisa essas políticas e legislações ambientais, auxiliando empresas e governos a se adequarem às normas e a implementarem práticas que vão além do exigido por lei.</p>
    `
        },
        "normas-internacionais": {
            title: "Normas Internacionais",
            body: `
        <p><strong>Acordo de Paris (2015):</strong> Compromisso global para limitar o aquecimento do planeta a menos de 2 °C em relação aos níveis pré-industriais, com metas conhecidas como NDCs.</p>
        <p><strong>Certificações Ambientais:</strong></p>
        <ul>
            <li><strong>ISO 14001:</strong> Padrão internacional para sistemas de gestão ambiental.</li>
            <li><strong>FSC (Forest Stewardship Council):</strong> Certifica produtos de madeira e papel de origem responsável.</li>
            <li><strong>RSPO (Roundtable on Sustainable Palm Oil):</strong> Certificação voltada ao óleo de palma sustentável.</li>
        </ul>
        <p><strong>Convenções Multilaterais:</strong></p>
        <ul>
            <li><strong>CBD:</strong> Convenção sobre Diversidade Biológica.</li>
            <li><strong>CITES:</strong> Convenção sobre o Comércio Internacional de Espécies Ameaçadas.</li>
            <li><strong>Convenção de Basileia:</strong> Regula o movimento transfronteiriço de resíduos perigosos.</li>
        </ul>
        <p class="source-link">Para mais informações, você pode visitar os sites oficiais das organizações mencionadas, como IEA.org, ISO.org e IBAMA.gov.br.</p>
    `
        },
        "politicas-publicas": {
            title: "Políticas Públicas",
            body: `
        <p><strong>Incentivos Fiscais e Subsídios:</strong></p>
        <ul>
            <li>Redução de impostos para empresas que investem em energias renováveis.</li>
            <li>Financiamentos com juros reduzidos para veículos elétricos e painéis solares.</li>
        </ul>
        <p><strong>Regulamentação e Fiscalização:</strong></p>
        <ul>
            <li>Licenças ambientais e Estudos de Impacto Ambiental (EIA/RIMA).</li>
            <li>Atuação de órgãos como o Ibama e secretarias estaduais/municipais.</li>
        </ul>
        <p><strong>Planos Nacionais e Estaduais:</strong></p>
        <ul>
            <li>Plano Nacional de Resíduos Sólidos (PNRS).</li>
            <li>Políticas de proteção da Amazônia e do Cerrado.</li>
        </ul>
    `
        },
        "leis-ambientais": {
            title: "Leis Ambientais",
            body: `
        <p><strong>Constituição Federal (Art. 225):</strong> Garante a todos o direito ao meio ambiente ecologicamente equilibrado.</p>
        <p><strong>Principais Leis Ambientais:</strong></p>
        <ul>
            <li><strong>Lei de Crimes Ambientais (Lei nº 9.605/1998):</strong> Define sanções administrativas, civis e penais.</li>
            <li><strong>Código Florestal (Lei nº 12.651/2012):</strong> Regula Áreas de Preservação Permanente (APPs) e reservas legais.</li>
            <li><strong>Política Nacional de Resíduos Sólidos (Lei nº 12.305/2010):</strong> Logística reversa e gestão de resíduos.</li>
        </ul>
        <p><strong>Responsabilidade Compartilhada:</strong></p>
        <ul>
            <li><strong>Empresas:</strong> Cumprimento de normas de licenciamento, mitigação de impactos e logística reversa.</li>
            <li><strong>Cidadãos:</strong> Consumo consciente, separação de resíduos e respeito às áreas protegidas.</li>
        </ul>
    `
        },
        "denuncias": {
            title: "Denúncias",
            body: `
        <p>O exercício da cidadania inclui a possibilidade de denunciar crimes ambientais. A denúncia é uma forma de participação social que fortalece a fiscalização e protege o meio ambiente.</p>
        <p><strong>Como proceder:</strong></p>
        <ul>
            <li><strong>Identificação:</strong> Reconhecer o tipo de crime (desmatamento, poluição, maus-tratos a animais).</li>
            <li><strong>Documentação:</strong> Registrar com fotos, vídeos e informações (local, data, hora).</li>
            <li><strong>Encaminhamento:</strong> A denúncia pode ser feita através dos seguintes canais:</li>
        </ul>
        <p><strong>Canais de Denúncia:</strong></p>
        <ul>
            <li><strong>Ibama (Linha Verde – 0800 61 8080):</strong> Para crimes de competência federal.</li>
            <li><strong>Polícia Ambiental:</strong> Para ocorrências estaduais.</li>
            <li><strong>Ministério Público:</strong> Para responsabilização judicial.</li>
        </ul>
        <br>
    `
        },
        "sobre-veiculos-eletricos": {
            title: "Sobre Veículos Elétricos",
            body: `
            <p>O conceito de veículos elétricos engloba todas as formas de transporte que utilizam a eletricidade como principal fonte de energia, reduzindo a dependência de combustíveis fósseis e contribuindo para a sustentabilidade. A mobilidade sustentável busca alternativas de transporte que reduzem a emissão de poluentes, otimizam recursos energéticos e melhoram a qualidade de vida urbana. Os VEs são uma peça-chave nesta transformação.</p>
        `
        },
        "o-que-sao-veiculos-eletricos": {
            title: "O que são Veículos Elétricos?",
            body: `
            <p>Os VEs são movidos a baterias e reduzem a dependência de combustíveis fósseis. Existem três tipos principais:</p>
            <ul>
                <li>**BEV (Battery Electric Vehicle):** 100% elétrico, movido apenas por bateria.</li>
                <li>**HEV (Hybrid Electric Vehicle):** Híbrido, com motor a combustão e elétrico combinados.</li>
                <li>**PHEV (Plug-in Hybrid Electric Vehicle):** Híbrido recarregável em tomadas, com maior autonomia elétrica.</li>
            </ul>
        `
        },
        "vantagens-veiculos-eletricos": {
            title: "Vantagens",
            body: `
            <ul>
                <li>**Economia:** Menor custo por quilômetro rodado.</li>
                <li>**Manutenção:** Mais simples e com menos peças de desgaste.</li>
                <li>**Meio Ambiente:** Redução de emissões de poluentes locais.</li>
                <li>**Incentivos:** Isenção de IPVA e dispensa do rodízio em SP.</li>
                <li>**Conforto:** Condução silenciosa e suave.</li>
            </ul>
        `
        },
        "desafios-veiculos-eletricos": {
            title: "Desafios",
            body: `
            <ul>
                <li>**Custo inicial:** Mais elevado.</li>
                <li>**Autonomia:** Limitada, exigindo planejamento de viagens.</li>
                <li>**Recarga:** Tempo maior em comparação ao abastecimento tradicional.</li>
                <li>**Infraestrutura:** Rede de eletropostos em expansão, mas ainda insuficiente.</li>
            </ul>
        `
        },
        "cenario-brasil": {
            title: "Cenário dos Elétricos no Brasil",
            body: `
            <p>O mercado de VEs no Brasil está em forte expansão, com dados que reforçam esse crescimento:</p>
            <ul>
                <li>A frota de veículos eletrificados cresceu **179%** entre março e agosto de 2024 (ABVE).</li>
                <li>Mais de **10.600** eletropostos instalados no país.</li>
                <li>Vendas de veículos 100% elétricos (BEV) cresceram **156,8%** em setembro de 2024.</li>
                <li>**São Paulo** lidera o número de veículos elétricos emplacados.</li>
            </ul>
        `
        },
        "fabricantes-modelos": {
            title: "Fabricantes e Modelos de Carros Elétricos no Brasil",
            body: `
            <table>
                <thead>
                    <tr>
                        <th>Fabricante</th>
                        <th>Descrição</th>
                        <th>Exemplos de Modelos</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>BYD (China)</td><td>Gigante chinesa de veículos elétricos, maior market share no Brasil.</td><td>Dolphin, Dolphin Mini, Song Plus, Seal, Yuan Plus</td></tr>
                    <tr><td>Volvo (Suécia)</td><td>Pioneira em eletrificação premium, foco em SUVs.</td><td>XC40 Recharge, C40 Recharge, EX30</td></tr>
                    <tr><td>JAC Motors (China)</td><td>Trouxe alguns dos primeiros elétricos acessíveis ao Brasil.</td><td>e-JS1, iEV40, iEV750V</td></tr>
                    <tr><td>GWM (China)</td><td>Investe em híbridos plug-in e elétricos.</td><td>Haval H6 PHEV, Ora 03</td></tr>
                    <tr><td>Nissan (Japão)</td><td>Pioneira global com carros elétricos.</td><td>Leaf</td></tr>
                    <tr><td>BMW (Alemanha)</td><td>Marca premium com portfólio crescente de elétricos.</td><td>iX, i4, iX3</td></tr>
                    <tr><td>Mini (Reino Unido/Alemanha)</td><td>Compactos elétricos de luxo.</td><td>Mini Cooper SE</td></tr>
                    <tr><td>Renault (França)</td><td>Uma das primeiras a vender elétricos no país.</td><td>Zoe, Kwid E-Tech</td></tr>
                    <tr><td>Peugeot (França)</td><td>Atuação crescente em eletrificação.</td><td>e-2008, e-208 GT</td></tr>
                    <tr><td>Chevrolet (EUA)</td><td>GM aposta em eletrificação global.</td><td>Bolt EV, Bolt EUV</td></tr>
                    <tr><td>Toyota (Japão)</td><td>Líder em híbridos; amplia portfólio.</td><td>Corolla Cross Hybrid, Prius, RAV4 Hybrid</td></tr>
                    <tr><td>Volkswagen (Alemanha)</td><td>Investe em eletrificação e prepara modelos.</td><td>ID.4, Golf GTE</td></tr>
                    <tr><td>Stellantis (Europa/EUA)</td><td>Controla Fiat, Jeep, Peugeot e Citroën.</td><td>Fiat 500e, Jeep Compass 4xe, Peugeot e-2008</td></tr>
                    <tr><td>Audi (Alemanha)</td><td>Premium com linha e-tron.</td><td>Q8 e-tron, e-tron GT</td></tr>
                    <tr><td>Neta Auto (China)</td><td>Entrante chinesa recém-chegada.</td><td>Neta Aya, Neta U, Neta GT</td></tr>
                    <tr><td>Lecar (Brasil)</td><td>Montadora nacional em construção.</td><td>Protótipos de SUV e utilitários</td></tr>
                    <tr><td>FNM (Brasil)</td><td>Tradicional marca renascida focada em caminhões.</td><td>FNM 832e, FNM 833e</td></tr>
                </tbody>
            </table>
        `
        },
        "indicadores-mobilidade": {
            title: "Indicadores de Mobilidade Sustentável no Brasil",
            body: `
            <h4>Indicadores de Mobilidade Sustentável no Brasil</h4>
            <table>
                <thead>
                    <tr>
                        <th>Ano</th>
                        <th>Veículos Elétricos (Brasil)</th>
                        <th>Eletropostos</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>2020</td><td>5000</td><td>1500</td></tr>
                    <tr><td>2021</td><td>12000</td><td>3000</td></tr>
        `
        }
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
