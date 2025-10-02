// admin-dashboard.js

// --- Importações de Módulos Firebase ---
import { auth, database } from './main.js'; // Importa as instâncias de auth e database do seu main.js
import { get, ref, push, set, update, remove, query, orderByChild, equalTo } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

// --- Elementos UI ---
const authStatusMessage = document.getElementById('authStatusMessage');
const suggestionsTableBody = document.querySelector('#suggestionsTable tbody');
const activePointsTableBody = document.querySelector('#activePointsTable tbody');
const suggestionsMessageBox = document.getElementById('suggestionsMessageBox');
const activePointsMessageBox = document.getElementById('activePointsMessageBox');

// Modal Elements
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
const modalSaveButton = document.getElementById('modalSaveButton');
const modalMessageBox = document.getElementById('modalMessageBox');
const closeButton = document.querySelector('.close-button');
const btnAddNewPoint = document.getElementById('btnAddNewPoint');


let currentUser = null; // Para armazenar o usuário logado
let currentAdminLevel = 'commum'; // Para armazenar o nível do usuário

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
    pointForm.reset();
    pointIdInput.value = '';
    modalOutrosEspecificar.style.display = 'none'; // Esconde por padrão
    modalMessageBox.style.display = 'none'; // Limpa mensagens anteriores

    if (pointData && id) {
        modalTitle.textContent = 'Editar Ponto';
        pointIdInput.value = id;
        modalNome.value = pointData.nome || '';
        modalTipoPonto.value = pointData.tipoPonto || '';
        if (pointData.tipoPonto === 'Outros') {
            modalOutrosEspecificar.value = pointData.nomeOutrosTipo || ''; // Assumindo que você pode ter um campo para o texto "Outros"
            modalOutrosEspecificar.style.display = 'block';
        } else {
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
        modalAtivo.checked = pointData.ativo || false;
    } else {
        modalTitle.textContent = 'Adicionar Novo Ponto Oficial';
        modalAtivo.checked = true; // Novo ponto oficial já começa ativo
    }
    pointModal.style.display = 'block';
}

function closePointModal() {
    pointModal.style.display = 'none';
}

// --- Lógica Principal do Dashboard ---

/**
 * Carrega todos os pontos do Realtime Database e os renderiza nas tabelas apropriadas.
 */
async function loadPoints() {
    suggestionsTableBody.innerHTML = ''; // Limpa a tabela de sugestões
    activePointsTableBody.innerHTML = ''; // Limpa a tabela de ecopontos

    showMessage(suggestionsMessageBox, 'Carregando sugestões...', 'info');
    showMessage(activePointsMessageBox, 'Carregando ecopontos...', 'info');

    try {
        const snapshot = await get(ref(database, 'pontos'));
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

            if (!hasSuggestions) {
                showMessage(suggestionsMessageBox, 'Nenhuma sugestão pendente encontrada.', 'info');
            } else {
                suggestionsMessageBox.style.display = 'none'; // Esconde a mensagem se houver dados
            }

            if (!hasActivePoints) {
                showMessage(activePointsMessageBox, 'Nenhum ecoponto oficial encontrado.', 'info');
            } else {
                activePointsMessageBox.style.display = 'none'; // Esconde a mensagem se houver dados
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
    row.insertCell().textContent = suggestion.email || suggestion.usuarioId; // Pode mostrar email ou ID do usuário
    
    const actionsCell = row.insertCell();
    actionsCell.className = 'actions';

    // Botão Aprovar (tornar ativo)
    const approveBtn = document.createElement('button');
    approveBtn.textContent = 'Aprovar';
    approveBtn.className = 'btn-approve';
    approveBtn.addEventListener('click', () => approveSuggestion(suggestion.id, suggestion));
    actionsCell.appendChild(approveBtn);

    // Botão Editar
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'btn-edit';
    editBtn.addEventListener('click', () => openPointModal(suggestion, suggestion.id));
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

    // Botão Desativar (tornar inativo/sugestão)
    const deactivateBtn = document.createElement('button');
    deactivateBtn.textContent = 'Desativar';
    deactivateBtn.className = 'btn-deactivate';
    deactivateBtn.addEventListener('click', () => togglePointActive(point.id, point.ativo));
    actionsCell.appendChild(deactivateBtn);

    // Botão Editar
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'btn-edit';
    editBtn.addEventListener('click', () => openPointModal(point, point.id));
    actionsCell.appendChild(editBtn);

    // Botão Deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Deletar';
    deleteBtn.className = 'btn-delete';
    deleteBtn.addEventListener('click', () => deletePoint(point.id, 'ponto oficial'));
    actionsCell.appendChild(deleteBtn);
}

/**
 * Aprova uma sugestão, tornando-a um ponto ativo.
 * @param {string} id O ID do ponto.
 * @param {Object} suggestionData Os dados da sugestão a ser aprovada.
 */
async function approveSuggestion(id, suggestionData) {
    if (!confirm(`Tem certeza que deseja aprovar o ponto "${suggestionData.nome}"? Ele se tornará visível publicamente.`)) {
        return;
    }

    try {
        // Atualiza o ponto para 'ativo: true'
        const pointRef = ref(database, `pontos/${id}`);
        await update(pointRef, { ativo: true });

        // Opcional: remover campos que só fazem sentido para sugestões (como 'email')
        // await update(pointRef, { email: null });

        showMessage(suggestionsMessageBox, 'Sugestão aprovada com sucesso!', 'success');
        loadPoints(); // Recarrega as tabelas
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
        loadPoints();
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
        showMessage(suggestionsMessageBox, `${type} deletado com sucesso!`, 'success'); // Usa a mesma caixa de mensagem para ambos
        showMessage(activePointsMessageBox, `${type} deletado com sucesso!`, 'success'); // Pode exibir em ambos os locais, ou apenas um
        loadPoints(); // Recarrega as tabelas
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
    const ativo = modalAtivo.checked;

    // Validação básica do formulário
    if (!nome || !tipoPonto || !cep || !numero || isNaN(latitude) || isNaN(longitude)) {
        showMessage(modalMessageBox, 'Por favor, preencha todos os campos obrigatórios (Nome, Tipo, CEP, Número, Latitude, Longitude).', 'error');
        return;
    }
    if (tipoPonto === 'Outros' && !outrosEspecificar) {
        showMessage(modalMessageBox, 'Por favor, especifique o tipo "Outros".', 'error');
        return;
    }

    if (tipoPonto === 'Outros') {
        tipoPonto = outrosEspecificar; // Usa o valor especificado para "Outros"
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
        data: new Date().toISOString(),
        usuarioId: currentUser ? currentUser.uid : 'admin_manual', // Marca quem criou/editou
        email: currentUser ? currentUser.email : 'admin_manual' // Salva o email do admin ou marca como manual
    };

    try {
        if (id) {
            // Edição de ponto existente
            await update(ref(database, `pontos/${id}`), pointData);
            showMessage(modalMessageBox, 'Ponto atualizado com sucesso!', 'success');
        } else {
            // Adição de novo ponto
            await push(ref(database, 'pontos'), pointData);
            showMessage(modalMessageBox, 'Novo ponto adicionado com sucesso!', 'success');
        }
        closePointModal();
        loadPoints(); // Recarrega os pontos para atualizar as tabelas
    } catch (error) {
        console.error("Erro ao salvar ponto:", error);
        showMessage(modalMessageBox, `Erro ao salvar ponto: ${error.message}`, 'error');
    }
}

// --- Event Listeners ---

// Autenticação e Autorização ao carregar a página
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
                    // Usuário é admin, carrega os pontos
                    showMessage(authStatusMessage, `Bem-vindo, Administrador ${userData.nome || user.email}! Carregando dashboard...`, 'info');
                    loadPoints();
                } else {
                    // Não é admin, redireciona
                    showMessage(authStatusMessage, 'Acesso negado: Você não tem permissão para acessar esta página.', 'error');
                    setTimeout(() => {
                        window.location.href = 'index.html'; // Redireciona para a página inicial
                    }, 3000);
                }
            } else {
                // Usuário logado, mas sem dados de perfil ou nível definido (trata como não-admin)
                showMessage(authStatusMessage, 'Acesso negado: Seu perfil não está configurado como administrador.', 'error');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            }
        } else {
            // Nenhum usuário logado, redireciona para login
            showMessage(authStatusMessage, 'Acesso negado: Você precisa estar logado para acessar esta página.', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        }
    });

    // Event listener para o botão "Adicionar Novo Ponto" (Abre o modal em modo adição)
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

    // Event listener para preencher automaticamente CEP no modal (pode ser reutilizado do formulario.js)
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

