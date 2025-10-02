// admin-dashboard.js

// --- Importações de Módulos Firebase ---
import { auth, database } from './main.js'; // Importa as instâncias de auth e database do seu main.js
import { get, ref, push, set, update, remove, query, orderByChild, equalTo, onValue } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

// --- Elementos UI ---
const authStatusMessage = document.getElementById('authStatusMessage');
const suggestionsTableBody = document.querySelector('#suggestionsTable tbody');
const activePointsTableBody = document.querySelector('#activePointsTable tbody');
const suggestionsMessageBox = document.getElementById('suggestionsMessageBox');
const activePointsMessageBox = document.getElementById('activePointsMessageBox');

// Modal Elements (garanta que estes IDs existam no seu HTML da modal!)
const pointModal = document.getElementById('pointModal'); // A modal principal
const modalTitle = document.getElementById('modalTitle'); // Título do modal
const pointForm = document.getElementById('pointForm');   // O formulário dentro do modal
const pointIdInput = document.getElementById('pointId'); // Campo hidden para o ID do ponto
const modalNome = document.getElementById('modalNome');
const modalTipoPonto = document.getElementById('modalTipoPonto');
const modalOutrosEspecificar = document.getElementById('modalOutrosEspecificar');
const modalCep = document.getElementById('modalCep');
const modalRua = document.getElementById('modalRua');
const modalNumero = document.getElementById('modalNumero');
const modalBairro = document.getElementById('modalBairro');
const modalCidade = document.getElementById('modalCidade');
const modalEstado = document.getElementById('modalEstado');
const modalLatitude = document.getElementById('modalLatitude');
const modalLongitude = document.getElementById('modalLongitude');
const modalObservacoes = document.getElementById('modalObservacoes');
const modalAtivo = document.getElementById('modalAtivo'); // Checkbox para 'ativo'
const modalSaveButton = document.getElementById('modalSaveButton');
const modalMessageBox = document.getElementById('modalMessageBox'); // Caixa de mensagem dentro do modal
const closeButton = document.querySelector('.close-button'); // Botão de fechar (X)
const btnAddNewPoint = document.getElementById('btnAddNewPoint'); // Seu botão para adicionar sugestão

// Campos adicionais para exibir dados de leitura na modal (adicione esses elementos no seu HTML da modal)
// Sugiro adicionar algo como: <span id="modalDisplayUsuarioId"></span> e <span id="modalDisplayData"></span> na sua modal HTML
const modalDisplayUsuarioId = document.getElementById('modalDisplayUsuarioId');
const modalDisplayData = document.getElementById('modalDisplayData');


let currentUser = null; // Para armazenar o usuário logado
let currentAdminLevel = 'commum'; // Para armazenar o nível do usuário
let allLoadedPoints = {}; // NOVO: Objeto para armazenar todos os pontos carregados, indexados por ID.

// --- Funções Auxiliares ---

/**
 * Exibe uma mensagem de feedback na UI.
 * @param {HTMLElement} element O elemento onde a mensagem será exibida.
 * @param {string} message O texto da mensagem.
 * @param {'success' | 'error' | 'info'} type O tipo da mensagem (para estilos CSS).
 */
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message-box ${type}`; // Define a classe para o estilo
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
        element.textContent = '';
    }, 5000);
}

/**
 * Abre o modal de ponto para adição ou edição.
 * @param {Object|null} pointData Dados do ponto para edição, ou null para adicionar.
 * @param {string|null} id ID do ponto, se for edição.
 */
function openPointModal(pointData = null, id = null) {
    pointForm.reset(); // Limpa o formulário
    pointIdInput.value = ''; // Limpa o ID do ponto
    modalOutrosEspecificar.style.display = 'none'; // Esconde por padrão
    modalOutrosEspecificar.value = ''; // Limpa o valor
    modalMessageBox.style.display = 'none'; // Limpa mensagens anteriores

    if (pointData && id) { // Modo de Edição
        modalTitle.textContent = 'Editar Ponto';
        pointIdInput.value = id; // Define o ID do ponto no campo hidden

        modalNome.value = pointData.nome || '';
        // É crucial que o valor do select seja uma das opções existentes no HTML.
        // Se pointData.tipoPonto não for uma opção direta, você pode precisar de uma lógica de mapeamento.
        // Por exemplo, se "Outros" é uma opção, e pointData.tipoPonto é um valor customizado,
        // você pode setar modalTipoPonto.value = 'Outros' e o campo de texto.
        modalTipoPonto.value = pointData.tipoPonto || '';

        // Se o tipo do ponto no Firebase é "Outros" ou um valor que foi customizado
        if (modalTipoPonto.value === 'Outros') {
            modalOutrosEspecificar.style.display = 'block';
            modalOutrosEspecificar.setAttribute('required', 'true');
            // Se o valor salvo não é "Outros" mas sim o que foi especificado,
            // precisamos definir o select para "Outros" e preencher o input de texto.
            // Isso depende de como você salva o "Outros" no DB. Se você salva "Outros"
            // no campo tipoPonto e o valor real em outro campo (ex: nomeOutrosTipo),
            // então a lógica abaixo está correta.
            // Para simplificar, assumimos que 'tipoPonto' pode ser o valor customizado,
            // e 'Outros' é uma opção do select que o usuário seleciona para especificá-lo.
            // Se o tipoPonto salvo não está na sua lista de opções do select (e não é "Outros"),
            // você pode querer setar o select para "Outros" e o texto para o valor salvo.
            // Por simplicidade, vamos apenas preencher o modalTipoPonto com o que veio do DB
            // e se for "Outros", mostrar o campo extra.
            // A sua lógica original com `pointData.nomeOutrosTipo` é boa se você tiver esse campo.
            // Se 'tipoPonto' no DB já é o valor customizado e 'Outros' é só uma opção da UI:
            // Verifique se o valor do DB é 'Outros', se sim, mostra o campo.
            // Se o valor do DB não está nas opções fixas do select, pode-se assumir que é 'Outros'
            // e preencher `modalOutrosEspecificar.value = pointData.tipoPonto;`
            modalOutrosEspecificar.value = pointData.nomeOutrosTipo || ''; // ou pointData.tipoPonto se você salva o valor customizado diretamente aqui
        } else {
             modalOutrosEspecificar.style.display = 'none';
             modalOutrosEspecificar.removeAttribute('required');
             modalOutrosEspecificar.value = '';
        }

        modalCep.value = pointData.cep || '';
        modalRua.value = pointData.rua || '';
        modalNumero.value = pointData.numero || '';
        modalBairro.value = pointData.bairro || '';
        modalCidade.value = pointData.cidade || '';
        modalEstado.value = pointData.estado || '';
        modalLatitude.value = pointData.latitude || '';
        modalLongitude.value = pointData.longitude || '';
        modalObservacoes.value = pointData.observacoes || '';
        modalAtivo.checked = pointData.ativo === true; // Garante que o checkbox é setado corretamente (booleano)

        // Exibir dados de criação que não são editáveis (verificar se os elementos existem)
        if (modalDisplayUsuarioId) modalDisplayUsuarioId.textContent = pointData.usuarioId || 'N/A';
        if (modalDisplayData) modalDisplayData.textContent = pointData.data ? new Date(pointData.data).toLocaleString() : 'N/A';

    } else { // Modo de Adição (para pontos oficiais, se você usar este modal para isso)
        modalTitle.textContent = 'Adicionar Novo Ponto Oficial';
        modalAtivo.checked = true; // Novo ponto oficial já começa ativo
        // Limpa os campos de display, pois não há dados de criação ainda
        if (modalDisplayUsuarioId) modalDisplayUsuarioId.textContent = '';
        if (modalDisplayData) modalDisplayData.textContent = '';
    }
    pointModal.style.display = 'block'; // Mostra a modal
}

function closePointModal() {
    pointModal.style.display = 'none';
    pointForm.reset(); // Garante que o formulário seja limpo ao fechar
    // Reseta o estado do campo 'Outros'
    modalOutrosEspecificar.style.display = 'none';
    modalOutrosEspecificar.removeAttribute('required');
    modalOutrosEspecificar.value = '';
}

// --- Lógica Principal do Dashboard ---

/**
 * Carrega todos os pontos do Realtime Database em tempo real e os renderiza nas tabelas apropriadas.
 * Usa onValue para escutar mudanças em tempo real.
 */
function loadPoints() {
    const pointsRef = ref(database, 'pontos');
    onValue(pointsRef, async (snapshot) => { // Usamos onValue para real-time updates
        suggestionsTableBody.innerHTML = ''; // Limpa as tabelas antes de recarregar
        activePointsTableBody.innerHTML = '';
        let hasSuggestions = false;
        let hasActivePoints = false;
        allLoadedPoints = {}; // Zera o cache de pontos

        if (snapshot.exists()) {
            const rawPoints = snapshot.val();
            const pointsArray = [];

            // Popula allLoadedPoints e pointsArray
            Object.keys(rawPoints).forEach(id => {
                const point = { id, ...rawPoints[id] };
                allLoadedPoints[id] = point; // Armazena no cache
                pointsArray.push(point);
            });

            // Renderiza as sugestões (ativo: false)
            for (const point of pointsArray) {
                if (point.ativo === false) {
                    await renderSuggestionRow(point);
                    hasSuggestions = true;
                }
            }

            // Renderiza os pontos ativos (ativo: true)
            for (const point of pointsArray) {
                if (point.ativo === true) {
                    await renderActivePointRow(point);
                    hasActivePoints = true;
                }
            }

            if (!hasSuggestions) {
                showMessage(suggestionsMessageBox, 'Nenhuma sugestão pendente encontrada.', 'info');
            } else {
                suggestionsMessageBox.style.display = 'none';
            }

            if (!hasActivePoints) {
                showMessage(activePointsMessageBox, 'Nenhum ecoponto oficial encontrado.', 'info');
            } else {
                activePointsMessageBox.style.display = 'none';
            }

        } else {
            showMessage(suggestionsMessageBox, 'Nenhuma sugestão pendente encontrada.', 'info');
            showMessage(activePointsMessageBox, 'Nenhum ecoponto oficial encontrado.', 'info');
        }
    }, (error) => {
        console.error("Erro ao carregar pontos em tempo real:", error);
        showMessage(suggestionsMessageBox, `Erro ao carregar sugestões: ${error.message}`, 'error');
        showMessage(activePointsMessageBox, `Erro ao carregar ecopontos: ${error.message}`, 'error');
    });
}

/**
 * Renderiza uma linha na tabela de sugestões.
 * @param {Object} suggestion Os dados da sugestão.
 */
async function renderSuggestionRow(suggestion) {
    const row = suggestionsTableBody.insertRow();
    row.dataset.pointId = suggestion.id; // Armazena o ID do ponto na linha (útil para ações)

    // Obtém o e-mail do usuário que contribuiu (se houver)
    let userDisplayInfo = suggestion.usuarioId; // Default para o ID
    if (suggestion.usuarioId) {
        const userSnapshot = await get(ref(database, `users/${suggestion.usuarioId}`));
        if (userSnapshot.exists()) {
            userDisplayInfo = userSnapshot.val().email || userSnapshot.val().nome || suggestion.usuarioId;
        }
    }

    row.innerHTML = `
        <td>${suggestion.nome || 'N/A'}</td>
        <td>${suggestion.tipoPonto || 'N/A'}</td>
        <td>${suggestion.rua || 'N/A'}, ${suggestion.numero || 'S/N'}, ${suggestion.bairro || 'N/A'}, ${suggestion.cidade || 'N/A'}/${suggestion.estado || 'N/A'} (CEP: ${suggestion.cep || 'N/A'})</td>
        <td>Lat: ${suggestion.latitude}, Lng: ${suggestion.longitude}<br>Obs: ${suggestion.observacoes || 'Nenhuma'}</td>
        <td>${userDisplayInfo}</td>
        <td class="actions">
            <button class="btn-approve" data-id="${suggestion.id}">Aprovar</button>
            <button class="btn-edit" data-id="${suggestion.id}">Editar</button>
            <button class="btn-delete" data-id="${suggestion.id}">Excluir</button>
        </td>
    `;
    // REMOVIDO: Event listeners diretos aqui. Serão tratados por delegação de eventos.
}

/**
 * Renderiza uma linha na tabela de ecopontos oficiais.
 * @param {Object} point Os dados do ecoponto.
 */
async function renderActivePointRow(point) {
    const row = activePointsTableBody.insertRow();
    row.dataset.pointId = point.id; // Armazena o ID do ponto na linha

    row.innerHTML = `
        <td>${point.nome || 'N/A'}</td>
        <td>${point.tipoPonto || 'N/A'}</td>
        <td>${point.rua || 'N/A'}, ${point.numero || 'S/N'}, ${point.bairro || 'N/A'}, ${point.cidade || 'N/A'}/${point.estado || 'N/A'} (CEP: ${point.cep || 'N/A'})</td>
        <td>${point.observacoes || 'Nenhuma'}<br>Lat: ${point.latitude}, Lng: ${point.longitude}</td>
        <td class="actions">
            <button class="btn-deactivate" data-id="${point.id}">Desativar</button>
            <button class="btn-edit" data-id="${point.id}">Editar</button>
            <button class="btn-delete" data-id="${point.id}">Excluir</button>
        </td>
    `;
    // REMOVIDO: Event listeners diretos aqui. Serão tratados por delegação de eventos.
}

/**
 * Aprova uma sugestão, tornando-a um ponto ativo.
 * @param {string} id O ID do ponto.
 * @param {Object} suggestionData Os dados da sugestão a ser aprovada.
 */
async function approveSuggestion(id) { // Removi suggestionData pois os dados já estão em allLoadedPoints
    if (!confirm(`Tem certeza que deseja aprovar este ponto? Ele se tornará visível publicamente.`)) {
        return;
    }

    try {
        const pointRef = ref(database, `pontos/${id}`);
        await update(pointRef, { ativo: true });
        showMessage(suggestionsMessageBox, 'Sugestão aprovada com sucesso!', 'success');
    } catch (error) {
        console.error("Erro ao aprovar sugestão:", error);
        showMessage(suggestionsMessageBox, `Erro ao aprovar sugestão: ${error.message}`, 'error');
    }
}

/**
 * Alterna o status 'ativo' de um ponto.
 * Usado para desativar pontos oficiais ou re-ativar sugestões (se for o caso).
 * @param {string} id O ID do ponto.
 * @param {boolean} currentStatus O status atual (ativo ou inativo).
 */
async function togglePointActive(id, currentStatus) {
    const newStatus = !currentStatus;
    const actionText = newStatus ? 'ativar' : 'desativar';
    const confirmMessage = newStatus
        ? `Tem certeza que deseja ativar este ponto? Ele se tornará visível publicamente.`
        : `Tem certeza que deseja desativar este ponto? Ele não será mais visível publicamente.`;

    if (!confirm(confirmMessage)) {
        return;
    }

    try {
        await update(ref(database, `pontos/${id}`), { ativo: newStatus });
        showMessage(activePointsMessageBox, `Ponto ${actionText}do com sucesso!`, 'success');
    } catch (error) {
        console.error(`Erro ao ${actionText} ponto:`, error);
        showMessage(activePointsMessageBox, `Erro ao ${actionText} ponto: ${error.message}`, 'error');
    }
}

/**
 * Deleta um ponto do Realtime Database.
 * @param {string} id O ID do ponto a ser deletado.
 * @param {string} type O tipo de ponto (para mensagem de confirmação).
 */
async function deletePoint(id, type) {
    if (!confirm(`Tem certeza que deseja deletar este ${type} permanentemente?`)) {
        return;
    }

    try {
        await remove(ref(database, `pontos/${id}`));
        showMessage(suggestionsMessageBox, `${type} deletado com sucesso!`, 'success');
        showMessage(activePointsMessageBox, `${type} deletado com sucesso!`, 'success');
    } catch (error) {
        console.error("Erro ao deletar ponto:", error);
        showMessage(suggestionsMessageBox, `Erro ao deletar ${type}: ${error.message}`, 'error');
    }
}


/**
 * Manipula o envio do formulário do modal para adicionar/editar pontos.
 */
async function handlePointFormSubmit(event) {
    event.preventDefault();
    modalMessageBox.style.display = 'none';

    const id = pointIdInput.value; // Pega o ID do campo hidden, se existir (para edição)
    const nome = modalNome.value.trim();
    let tipoPonto = modalTipoPonto.value; // Valor do select
    const outrosEspecificar = modalOutrosEspecificar.value.trim(); // Valor do campo de texto
    const cep = modalCep.value.trim();
    const rua = modalRua.value.trim();
    const numero = modalNumero.value.trim();
    const bairro = modalBairro.value.trim();
    const cidade = modalCidade.value.trim();
    const estado = modalEstado.value.trim();
    const latitude = parseFloat(modalLatitude.value);
    const longitude = parseFloat(modalLongitude.value);
    const observacoes = modalObservacoes.value.trim();
    const ativo = modalAtivo.checked; // Valor booleano do checkbox

    // Validação básica do formulário
    if (!nome || !tipoPonto || !cep || !numero || isNaN(latitude) || isNaN(longitude)) {
        showMessage(modalMessageBox, 'Por favor, preencha todos os campos obrigatórios (Nome, Tipo, CEP, Número, Latitude, Longitude).', 'error');
        return;
    }
    // Valida o campo "Outros" se for selecionado
    if (tipoPonto === 'Outros' && !outrosEspecificar) {
        showMessage(modalMessageBox, 'Por favor, especifique o tipo "Outros".', 'error');
        return;
    }
    // Se 'Outros' foi selecionado, o tipoPonto final é o valor especificado
    if (tipoPonto === 'Outros') {
        tipoPonto = outrosEspecificar;
    }

    const pointData = {
        nome,
        tipoPonto,
        cep,
        rua: rua || null,
        numero,
        bairro: bairro || null,
        cidade: cidade || null,
        estado: estado || null,
        latitude,
        longitude,
        observacoes: observacoes || null,
        ativo,
    };

    // Campos que são metadados e devem ser definidos apenas para novos pontos
    if (!id) { // Se for um novo ponto, adiciona esses campos
        pointData.data = new Date().toISOString();
        pointData.usuarioId = currentUser ? currentUser.uid : 'admin_manual';
        pointData.email = currentUser ? currentUser.email : 'admin_manual'; // Para novos pontos
    } else {
        // Se for edição, mantém o usuarioId e data originais, mas atualiza o email
        // Assumimos que usuarioId e data não mudam em edições.
        // O email pode ser o do admin que está editando.
        pointData.email = currentUser ? currentUser.email : 'admin_manual'; // Atualiza com o email do editor
    }


    try {
        if (id) {
            // Edição de ponto existente
            const pointRef = ref(database, `pontos/${id}`);
            await update(pointRef, pointData); // Usa update para atualizar apenas os campos fornecidos
            showMessage(modalMessageBox, 'Ponto atualizado com sucesso!', 'success');
        } else {
            // Adição de novo ponto (se este modal for usado para adicionar pontos oficiais)
            await push(ref(database, 'pontos'), pointData);
            showMessage(modalMessageBox, 'Novo ponto adicionado com sucesso!', 'success');
        }
        closePointModal();
    } catch (error) {
        console.error("Erro ao salvar ponto:", error);
        showMessage(modalMessageBox, `Erro ao salvar ponto: ${error.message}`, 'error');
    }
}

// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            const userRef = ref(database, 'users/' + user.uid);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const userData = snapshot.val();
                currentAdminLevel = userData.nivel || 'commum';

                if (currentAdminLevel === 'admin') {
                    showMessage(authStatusMessage, `Bem-vindo, Administrador ${userData.nome || user.email}! Carregando dashboard...`, 'info');
                    loadPoints(); // Chama loadPoints com onValue aqui
                } else {
                    showMessage(authStatusMessage, 'Acesso negado: Você não tem permissão para acessar esta página.', 'error');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 3000);
                }
            } else {
                showMessage(authStatusMessage, 'Acesso negado: Seu perfil não está configurado como administrador.', 'error');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            }
        } else {
            showMessage(authStatusMessage, 'Acesso negado: Você precisa estar logado para acessar esta página.', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        }
    });

    // Event listener para o botão global "Adicionar Nova Sugestão"
    btnAddNewPoint.addEventListener('click', () => {
        window.location.href = 'formulario.html';
    });

    // Event listeners para o modal
    closeButton.addEventListener('click', closePointModal);
    window.addEventListener('click', (event) => {
        if (event.target === pointModal) {
            closePointModal();
        }
    });

    // Event listener para o envio do formulário do modal
    pointForm.addEventListener('submit', handlePointFormSubmit);

    // Esconder/Mostrar campo 'Outros' no modal
    modalTipoPonto.addEventListener('change', (event) => {
        if (event.target.value === 'Outros') {
            modalOutrosEspecificar.style.display = 'block';
            modalOutrosEspecificar.setAttribute('required', 'true');
        } else {
            modalOutrosEspecificar.style.display = 'none';
            modalOutrosEspecificar.removeAttribute('required');
            modalOutrosEspecificar.value = '';
        }
    });

    // Event listener para preencher automaticamente CEP no modal (reutilizado do ViaCEP)
    modalCep.addEventListener('blur', async () => {
        const cep = modalCep.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        try {
            const url = `https://viacep.com.br/ws/${cep}/json/`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.erro) {
                showMessage(modalMessageBox, 'CEP não encontrado ou inválido.', 'error');
                return;
            }
            modalRua.value = data.logradouro || '';
            modalBairro.value = data.bairro || '';
            modalCidade.value = data.localidade || '';
            modalEstado.value = data.uf || '';
            showMessage(modalMessageBox, 'Endereço preenchido via CEP.', 'info');
        } catch (error) {
            console.error("Erro no ViaCEP do modal:", error);
            showMessage(modalMessageBox, 'Erro ao buscar CEP.', 'error');
        }
    });

    // NOVO: Delegação de eventos para os botões das tabelas (Aprovar, Editar, Desativar, Excluir)
    document.addEventListener('click', async (event) => {
        const target = event.target;

        // Verifica se o elemento clicado é um botão e tem um 'data-id'
        if (target.tagName === 'BUTTON' && target.dataset.id) {
            const pointId = target.dataset.id;
            const pointData = allLoadedPoints[pointId]; // Pega os dados do cache

            if (!pointData) {
                console.error(`Dados do ponto ${pointId} não encontrados no cache.`);
                showMessage(activePointsMessageBox, 'Erro: Dados do ponto não carregados. Tente novamente.', 'error');
                return;
            }

            if (target.classList.contains('btn-approve')) {
                await approveSuggestion(pointId);
            } else if (target.classList.contains('btn-deactivate')) {
                await togglePointActive(pointId, pointData.ativo); // Passa o status atual
            } else if (target.classList.contains('btn-delete')) {
                // Determine o tipo de ponto para a mensagem de confirmação
                const type = pointData.ativo === false ? 'sugestão' : 'ponto oficial';
                await deletePoint(pointId, type);
            } else if (target.classList.contains('btn-edit')) {
                openPointModal(pointData, pointId); // Abre a modal com os dados
            }
        }
    });
});
