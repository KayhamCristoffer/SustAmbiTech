// =========================================================
// admin-dashboard.js
// Lógica principal do Dashboard Administrativo (Firebase)
// =========================================================

// --- Importações de Módulos Firebase ---
import { auth, database } from './main.js'; // Importa as instâncias de auth e database
import { get, ref, push, set, update, remove, query, orderByChild, equalTo } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

// --- Elementos UI Gerais ---
const authStatusMessage = document.getElementById('authStatusMessage');
const suggestionsTableBody = document.querySelector('#suggestionsTable tbody');
const activePointsTableBody = document.querySelector('#activePointsTable tbody');
const suggestionsMessageBox = document.getElementById('suggestionsMessageBox');
const activePointsMessageBox = document.getElementById('activePointsMessageBox');

// --- Elementos da NOVA SEÇÃO DE EDIÇÃO (Substitui o modal para pontos ATIVOS) ---
const editSection = document.getElementById('edit-ecoponto-section');
const editForm = document.getElementById('edit-ecoponto-form');
const editSectionMessageBox = document.getElementById('editSectionMessageBox');
const editId = document.getElementById('edit-ecoponto-id');
const editNome = document.getElementById('edit-nome');
const editTipo = document.getElementById('edit-tipo'); // Novo campo na seção para TipoPonto
const editLocalizacao = document.getElementById('edit-localizacao'); // Campo de endereço na seção
const editObservacoes = document.getElementById('edit-observacoes');


// --- Elementos do MODAL DE SUGERIR/EDITAR (Mantido para sugestões e Novo Ponto) ---
const pointModal = document.getElementById('pointModal');
const modalTitle = document.getElementById('modalTitle');
const pointForm = document.getElementById('pointForm');
const pointIdInput = document.getElementById('pointId');
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
const modalAtivo = document.getElementById('modalAtivo');
const modalMessageBox = document.getElementById('modalMessageBox');
const btnAddNewPoint = document.getElementById('btnAddNewPoint');


let currentUser = null;
let currentAdminLevel = 'commum';

// =========================================================
// FUNÇÕES AUXILIARES
// =========================================================

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message-box ${type}`;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
        element.textContent = '';
    }, 5000);
}

// =========================================================
// LÓGICA DE EDIÇÃO NO MODAL (Para Sugestões e Novo Ponto)
// =========================================================

/**
 * Abre o modal de ponto para adição ou edição (USADO POR SUGGESTIONS E ADD NEW POINT).
 * @param {Object|null} pointData Dados do ponto para edição, ou null para adicionar.
 * @param {string|null} id ID do ponto, se for edição.
 */
function openPointModal(pointData = null, id = null) {
    // Esconde a seção de edição ativa, se estiver visível
    closeEditSection();
    
    pointForm.reset();
    pointIdInput.value = '';
    modalOutrosEspecificar.style.display = 'none';
    modalMessageBox.style.display = 'none';

    // Preenche informações do criador no modal
    document.getElementById('display-usuarioId').textContent = pointData?.usuarioId || 'N/A';
    document.getElementById('display-data').textContent = pointData?.data ? new Date(pointData.data).toLocaleString('pt-BR') : 'N/A';
    document.getElementById('modalEmail').value = pointData?.email || '';

    if (pointData && id) {
        modalTitle.textContent = 'Editar Ponto de Coleta (Via Modal)';
        pointIdInput.value = id;
        modalNome.value = pointData.nome || '';
        
        // Lógica para Outros, mantida do seu código
        const tiposPadrao = ['Plástico', 'Vidro', 'Metal', 'Papel', 'Eletrônico'];
        if (pointData.tipoPonto === 'Outros' && pointData.nomeOutrosTipo) { 
            modalTipoPonto.value = 'Outros';
            modalOutrosEspecificar.value = pointData.nomeOutrosTipo;
            modalOutrosEspecificar.style.display = 'block';
        } else if (pointData.tipoPonto && !tiposPadrao.includes(pointData.tipoPonto)) {
            modalTipoPonto.value = 'Outros';
            modalOutrosEspecificar.value = pointData.tipoPonto;
            modalOutrosEspecificar.style.display = 'block';
        } else {
            modalTipoPonto.value = pointData.tipoPonto || '';
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
        modalAtivo.value = pointData.ativo ? 'true' : 'false';
    } else {
        modalTitle.textContent = 'Adicionar Novo Ponto Oficial';
        modalAtivo.value = 'true';
    }
    pointModal.style.display = 'block';
}

function closePointModal() {
    pointModal.style.display = 'none';
}

/**
 * Manipula o envio do formulário do modal para adicionar/editar pontos (USADO POR SUGGESTIONS E ADD NEW POINT).
 */
async function handlePointFormSubmit(event) {
    event.preventDefault();
    modalMessageBox.style.display = 'none';

    // ... (Mantém a lógica de coleta de dados e validação do seu código original) ...
    const id = pointIdInput.value;
    const nome = modalNome.value.trim();
    let tipoPonto = modalTipoPonto.value;
    const outrosEspecificar = modalOutrosEspecificar.value.trim();
    const cep = modalCep.value.trim();
    const rua = modalRua.value.trim();
    const numero = modalNumero.value.trim();
    const bairro = modalBairro.value.trim();
    const cidade = modalCidade.value.trim();
    const estado = modalEstado.value.trim();
    const latitude = parseFloat(modalLatitude.value);
    const longitude = parseFloat(modalLongitude.value);
    const observacoes = modalObservacoes.value.trim();
    const ativo = modalAtivo.value === 'true'; 
    const email = document.getElementById('modalEmail').value.trim();

    if (!nome || !tipoPonto || isNaN(latitude) || isNaN(longitude)) {
        showMessage(modalMessageBox, 'Por favor, preencha todos os campos obrigatórios (Nome, Tipo, Latitude, Longitude).', 'error');
        return;
    }
    if (tipoPonto === 'Outros' && !outrosEspecificar) {
        showMessage(modalMessageBox, 'Por favor, especifique o tipo "Outros".', 'error');
        return;
    }

    const finalTipoPonto = (tipoPonto === 'Outros' && outrosEspecificar) ? outrosEspecificar : tipoPonto;

    const pointData = {
        nome,
        tipoPonto: finalTipoPonto,
        cep: cep || null,
        rua: rua || null,
        numero: numero || null,
        bairro: bairro || null,
        cidade: cidade || null,
        estado: estado || null,
        latitude,
        longitude,
        observacoes: observacoes || null,
        ativo,
        data: new Date().toISOString(),
        usuarioId: currentUser ? currentUser.uid : 'admin_manual',
        email: email || null
    };

    try {
        if (id) {
            // Edição de ponto existente (via Modal)
            await update(ref(database, `pontos/${id}`), pointData);
            showMessage(modalMessageBox, 'Ponto atualizado com sucesso!', 'success');
        } else {
            // Adição de novo ponto
            await push(ref(database, 'pontos'), pointData);
            showMessage(modalMessageBox, 'Novo ponto adicionado com sucesso!', 'success');
        }
        closePointModal();
        loadPoints();
    } catch (error) {
        console.error("Erro ao salvar ponto:", error);
        showMessage(modalMessageBox, `Erro ao salvar ponto: ${error.message}`, 'error');
    }
}


// =========================================================
// LÓGICA DE EDIÇÃO NA SEÇÃO (Para Pontos Ativos)
// =========================================================

/**
 * Abre a seção de edição com os dados do ponto ativo (USADO APENAS PARA PONTOS ATIVOS).
 * @param {Object} pointData Dados completos do ponto.
 * @param {string} id ID do ponto.
 */
function openEditSection(pointData, id) {
    // Esconde o modal, se estiver visível
    closePointModal(); 
    
    // Preenche os campos da SEÇÃO de edição
    editId.value = id;
    editNome.value = pointData.nome || '';
    editTipo.value = pointData.tipoPonto || ''; // O campo "Tipo" na seção
    editLocalizacao.value = `${pointData.rua || ''}, ${pointData.numero || ''} - ${pointData.bairro || ''}`; // Endereço simplificado
    editObservacoes.value = pointData.observacoes || '';

    // Torna a seção de edição visível
    editSection.style.display = 'block';
    showMessage(editSectionMessageBox, 'Edite os dados principais e clique em Salvar.', 'info');
    editSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Fecha a seção de edição.
 */
function closeEditSection() {
    editSection.style.display = 'none';
}

/**
 * Manipula o envio do formulário da seção de edição (Requisição UPDATE no Firebase).
 */
editForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    editSectionMessageBox.style.display = 'none';

    const id = editId.value;
    if (!id) {
        showMessage(editSectionMessageBox, 'Erro: ID do ponto não encontrado.', 'error');
        return;
    }

    // Coleta dados da seção (ajuste para o que você quer atualizar)
    const updatedData = {
        nome: editNome.value.trim(),
        tipoPonto: editTipo.value.trim(),
        observacoes: editObservacoes.value.trim(),
        // ATENÇÃO: Se quiser atualizar Rua, Número e Bairro, 
        // você precisará de campos separados ou parsear o 'editLocalizacao'.
        // Por enquanto, só atualiza os campos simples:
        // rua: <valor_aqui>,
        // numero: <valor_aqui>,
    };
    
    showMessage(editSectionMessageBox, 'Enviando alterações...', 'info');

    try {
        await update(ref(database, `pontos/${id}`), updatedData);
        
        showMessage(editSectionMessageBox, `Ponto ID ${id} atualizado com sucesso! Recarregando lista...`, 'success');
        
        loadPoints(); // Recarrega os dados
        closeEditSection(); // Fecha a seção
    } catch (error) {
        console.error("Erro ao salvar ponto na seção:", error);
        showMessage(editSectionMessageBox, `Erro ao atualizar ponto: ${error.message}`, 'error');
    }
});


// =========================================================
// LÓGICA PRINCIPAL (Carregamento e Renderização)
// =========================================================

/**
 * Carrega todos os pontos do Realtime Database e os renderiza nas tabelas.
 */
async function loadPoints() {
    suggestionsTableBody.innerHTML = '';
    activePointsTableBody.innerHTML = '';
    closeEditSection(); // Garante que a seção de edição está fechada ao recarregar

    showMessage(suggestionsMessageBox, 'Carregando sugestões...', 'info');
    showMessage(activePointsMessageBox, 'Carregando ecopontos...', 'info');

    try {
        const snapshot = await get(ref(database, 'pontos'));
        // ... (Mantém a lógica de iteração e separação em sugestões e ativos) ...
        if (snapshot.exists()) {
            const allPoints = snapshot.val();
            let hasSuggestions = false;
            let hasActivePoints = false;

            Object.keys(allPoints).forEach(id => {
                const point = { id, ...allPoints[id] };
                if (point.ativo === false) {
                    renderSuggestionRow(point);
                    hasSuggestions = true;
                } else {
                    renderActivePointRow(point);
                    hasActivePoints = true;
                }
            });

            // Lógica de mensagens mantida
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
    } catch (error) {
        console.error("Erro ao carregar pontos:", error);
        showMessage(suggestionsMessageBox, `Erro ao carregar sugestões: ${error.message}`, 'error');
        showMessage(activePointsMessageBox, `Erro ao carregar ecopontos: ${error.message}`, 'error');
    }
}

/**
 * Renderiza uma linha na tabela de sugestões.
 * @param {Object} suggestion Os dados da sugestão.
 */
function renderSuggestionRow(suggestion) {
    const row = suggestionsTableBody.insertRow();
    row.insertCell().textContent = suggestion.nome;
    row.insertCell().textContent = suggestion.tipoPonto;
    row.insertCell().textContent = `${suggestion.rua || ''}, ${suggestion.numero || ''} - ${suggestion.cidade || ''}/${suggestion.estado || ''}`;
    row.insertCell().textContent = suggestion.observacoes || 'N/A';
    row.insertCell().textContent = suggestion.email || suggestion.usuarioId;

    const actionsCell = row.insertCell();
    actionsCell.className = 'actions';

    // Botão Aprovar
    const approveBtn = document.createElement('button');
    approveBtn.textContent = 'Aprovar';
    approveBtn.className = 'btn-approve';
    approveBtn.addEventListener('click', () => approveSuggestion(suggestion.id, suggestion));
    actionsCell.appendChild(approveBtn);

    // Botão Editar (Abre o MODAL para SUGERIR)
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'btn-edit';
    editBtn.addEventListener('click', () => openPointModal(suggestion, suggestion.id)); // <-- Usa o MODAL
    actionsCell.appendChild(editBtn);

    // Botão Deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Deletar';
    deleteBtn.className = 'btn-delete';
    deleteBtn.addEventListener('click', () => deletePoint(suggestion.id, 'sugestão'));
    actionsCell.appendChild(deleteBtn);
}

/**
 * Renderiza uma linha na tabela de ecopontos oficiais.
 * @param {Object} point Os dados do ecoponto.
 */
function renderActivePointRow(point) {
    const row = activePointsTableBody.insertRow();
    row.insertCell().textContent = point.nome;
    row.insertCell().textContent = point.tipoPonto;
    row.insertCell().textContent = `${point.rua || ''}, ${point.numero || ''} - ${point.cidade || ''}/${point.estado || ''}`;
    row.insertCell().textContent = point.observacoes || 'N/A';

    const actionsCell = row.insertCell();
    actionsCell.className = 'actions';

    // Botão Desativar
    const deactivateBtn = document.createElement('button');
    deactivateBtn.textContent = 'Desativar';
    deactivateBtn.className = 'btn-deactivate';
    deactivateBtn.addEventListener('click', () => togglePointActive(point.id, point.ativo));
    actionsCell.appendChild(deactivateBtn);

    // Botão Editar (Abre a SEÇÃO DE EDIÇÃO para ATIVOS)
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'btn-edit';
    editBtn.addEventListener('click', () => openEditSection(point, point.id)); // <-- Usa a SEÇÃO
    actionsCell.appendChild(editBtn);

    // Botão Deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Deletar';
    deleteBtn.className = 'btn-delete';
    deleteBtn.addEventListener('click', () => deletePoint(point.id, 'ponto oficial'));
    actionsCell.appendChild(deleteBtn);
}


// As funções 'approveSuggestion', 'togglePointActive' e 'deletePoint' 
// permanecem inalteradas, pois elas só fazem o update ou remove no Firebase.

// ... (approveSuggestion, togglePointActive, deletePoint mantidas) ...

async function approveSuggestion(id, suggestionData) {
    if (!confirm(`Tem certeza que deseja aprovar o ponto "${suggestionData.nome}"? Ele se tornará visível publicamente.`)) {
        return;
    }
    try {
        const pointRef = ref(database, `pontos/${id}`);
        await update(pointRef, { ativo: true });
        showMessage(suggestionsMessageBox, 'Sugestão aprovada com sucesso!', 'success');
        loadPoints();
    } catch (error) {
        console.error("Erro ao aprovar sugestão:", error);
        showMessage(suggestionsMessageBox, `Erro ao aprovar sugestão: ${error.message}`, 'error');
    }
}

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
        loadPoints();
    } catch (error) {
        console.error(`Erro ao ${actionText} ponto:`, error);
        showMessage(activePointsMessageBox, `Erro ao ${actionText} ponto: ${error.message}`, 'error');
    }
}

async function deletePoint(id, type) {
    if (!confirm(`Tem certeza que deseja deletar este ${type} permanentemente?`)) {
        return;
    }
    try {
        await remove(ref(database, `pontos/${id}`));
        showMessage(suggestionsMessageBox, `${type} deletado com sucesso!`, 'success');
        showMessage(activePointsMessageBox, `${type} deletado com sucesso!`, 'success');
        loadPoints();
    } catch (error) {
        console.error("Erro ao deletar ponto:", error);
        showMessage(suggestionsMessageBox, `Erro ao deletar ${type}: ${error.message}`, 'error');
    }
}

// =========================================================
// EVENT LISTENERS
// =========================================================

// Event listener para o botão de CANCELAR na SEÇÃO de edição
document.querySelector('.btn-cancelar').addEventListener('click', closeEditSection);

// Autenticação e Autorização ao carregar a página (Mantido)
document.addEventListener('DOMContentLoaded', () => {
    // ... (Mantém a lógica de onAuthStateChanged e verificação de nível 'admin') ...
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
                    loadPoints();
                } else {
                    showMessage(authStatusMessage, 'Acesso negado: Você não tem permissão para acessar esta página.', 'error');
                    setTimeout(() => { window.location.href = 'index.html'; }, 3000);
                }
            } else {
                showMessage(authStatusMessage, 'Acesso negado: Seu perfil não está configurado como administrador.', 'error');
                setTimeout(() => { window.location.href = 'index.html'; }, 3000);
            }
        } else {
            showMessage(authStatusMessage, 'Acesso negado: Você precisa estar logado para acessar esta página.', 'error');
            setTimeout(() => { window.location.href = 'login.html'; }, 3000);
        }
    });

    // Event listener para o botão "Adicionar Novo Ponto" (Mantido para redirecionar)
    btnAddNewPoint.addEventListener('click', () => {
        window.location.href = 'formulario.html';
    });

    // Event listeners para fechar o modal (Mantido)
    document.querySelectorAll('.close-button').forEach(btn => {
        btn.addEventListener('click', closePointModal);
    });
    window.addEventListener('click', (event) => {
        if (event.target === pointModal) {
            closePointModal();
        }
    });

    // Event listener para o envio do formulário do modal (Mantido para Sugestões)
    pointForm.addEventListener('submit', handlePointFormSubmit);

    // Esconder/Mostrar campo 'Outros' no modal (Mantido)
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

    // Event listener para preencher CEP no modal (ViaCEP) (Mantido)
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
});