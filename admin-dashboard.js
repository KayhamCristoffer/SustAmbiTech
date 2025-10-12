// =========================================================
// admin-dashboard.js
// Lógica principal do Dashboard Administrativo (Firebase)
// Versão SEM MODAL, usando apenas a Seção de Edição.
// =========================================================

// --- Importações de Módulos Firebase ---
import { auth, database } from './main.js'; // Importa as instâncias de auth e database
import { get, ref, push, set, update, remove, query, orderByChild, equalTo } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

// =========================================================
// VARIÁVEIS E CONSTANTES DO MAPA
// =========================================================
let mapaEdicao = null; // Instância do mapa para a seção de edição
let marcadorEdicao = null; // Marcador editável na seção de edição
let isMapInitialized = false; // Flag para garantir que o mapa só é carregado uma vez
const DEFAULT_LAT = -23.5505; // São Paulo
const DEFAULT_LON = -46.6333;
const DEFAULT_ZOOM = 14;

// --- Elementos UI Gerais ---
const authStatusMessage = document.getElementById('authStatusMessage');
const suggestionsTableBody = document.querySelector('#suggestionsTable tbody');
const activePointsTableBody = document.querySelector('#activePointsTable tbody');
const suggestionsMessageBox = document.getElementById('suggestionsMessageBox');
const activePointsMessageBox = document.getElementById('activePointsMessageBox');

// --- Elementos da SEÇÃO DE EDIÇÃO (Única) ---
const editSection = document.getElementById('edit-ecoponto-section');
const editSectionTitle = document.getElementById('editSectionTitle');
const editForm = document.getElementById('edit-ecoponto-form');
const editSectionMessageBox = document.getElementById('editSectionMessageBox');
const btnAddNewPoint = document.getElementById('btnAddNewPoint');
const btnCancelEdit = document.getElementById('btnCancelEdit');

// Campos do Formulário de Edição
const editId = document.getElementById('edit-ecoponto-id');
const editDataCriacao = document.getElementById('edit-data-criacao');
const editUsuarioId = document.getElementById('edit-usuario-id'); // Este é o campo HIDDEN do UID

const editNome = document.getElementById('edit-nome');
const editTipo = document.getElementById('edit-tipo'); 
const editAtivo = document.getElementById('edit-ativo'); 

const editCep = document.getElementById('edit-cep');
const editRua = document.getElementById('edit-rua');
const editNumero = document.getElementById('edit-numero');
const editBairro = document.getElementById('edit-bairro');
const editCidade = document.getElementById('edit-cidade');
const editEstado = document.getElementById('edit-estado');
const editLatitude = document.getElementById('edit-latitude');
const editLongitude = document.getElementById('edit-longitude');
const editObservacoes = document.getElementById('edit-observacoes');
const editEmail = document.getElementById('edit-email'); // Campo readonly

// Campos de Visualização
const displayUsuarioId = document.getElementById('display-usuarioId'); // Usado para mostrar o NOME do contribuinte
const displayData = document.getElementById('display-data');


let currentUser = null;
let currentAdminLevel = 'commum'; 

// =========================================================
// FUNÇÕES AUXILIARES GERAIS
// =========================================================

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message-box ${type}`;
    element.style.display = 'block';
    // Otimizado: remove timeout para mensagens de tabela, mas mantém para formulário
    if (element === editSectionMessageBox) {
        setTimeout(() => {
            element.style.display = 'none';
            element.textContent = '';
        }, 5000);
    }
}

/**
 * Busca o nome do usuário pelo UID na tabela 'users'.
 * @param {string} uid O UID do usuário.
 * @returns {Promise<string>} O nome do usuário ou o UID (como fallback).
 */
async function getUserName(uid) {
    if (!uid) return 'N/A';
    try {
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            return userData.nome ? `${userData.nome} ${userData.sobrenome || ''}`.trim() : uid;
        }
        return `Usuário ID: ${uid}`; // Retorna o ID se não encontrar o nome
    } catch (error) {
        console.error("Erro ao buscar nome do usuário:", error);
        return `Erro: ${uid}`;
    }
}


// =========================================================
// FUNÇÕES AUXILIARES DO MAPA (LEAFLET) - COPIADAS DO FORMULARIO.HTML
// =========================================================

// Função para criar ícones no mapa de edição (usando o ícone padrão Leaflet)
function criarIconePadrao() {
    return L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}

/**
 * Reverte coordenadas para endereço usando Nominatim.
 * @param {number} lat Latitude.
 * @param {number} lon Longitude.
 * @returns {Promise<Object>} Objeto com campos de endereço (rua, cep, etc.).
 */
async function reverterCoordenadas(lat, lon) {
    console.log(`Buscando endereço real para: ${lat}, ${lon}`);
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.address) {
            const addr = data.address;
            let cep = (addr.postcode || '').replace(/\D/g, '');
            if (cep.length >= 8) {
                cep = cep.substring(0, 5) + '-' + cep.substring(5, 8);
            }
            
            return {
                cep: cep,
                rua: addr.road || '',
                bairro: addr.suburb || addr.neighbourhood || addr.village || '',
                cidade: addr.city || addr.town || addr.village || '',
                estado: addr.state_code || addr.state || ''
            };
        }
        return {}; // Retorna objeto vazio se não encontrar
    } catch (error) {
        console.error("Erro na Geocodificação Reversa (Edição):", error);
        return {};
    }
}

/**
 * Inicializa e centraliza o mapa na seção de edição com um marcador arrastável.
 * @param {number} lat Latitude para centralização.
 * @param {number} lon Longitude para centralização.
 * @param {Object} pontoData Dados do ponto (para o popup).
 */
async function inicializarMapaEdicao(lat, lon, pontoData) {
    const center = [lat, lon];
    const mapDiv = document.getElementById('mapaEdicao');
    if (!mapDiv) return;

    if (!isMapInitialized) {
        // Inicializa o mapa APENAS na primeira vez
        mapaEdicao = L.map('mapaEdicao').setView(center, DEFAULT_ZOOM);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapaEdicao);
        isMapInitialized = true;
    } else {
        // Apenas centraliza em casos subsequentes
        mapaEdicao.setView(center, DEFAULT_ZOOM);
    }
    
    // Remove marcador antigo, se houver
    if (marcadorEdicao) {
        mapaEdicao.removeLayer(marcadorEdicao);
    }

    // Adiciona novo marcador DRAGGABLE (Arrastável)
    marcadorEdicao = L.marker(center, { 
        draggable: true, 
        icon: criarIconePadrao()
    }).addTo(mapaEdicao);
    
    marcadorEdicao.bindPopup(`<b>${pontoData.nome || 'Novo Ponto'}</b><br>Arraste para reposicionar.`).openPopup();

    // Evento para atualizar as coordenadas e o endereço ao arrastar (dragend)
    marcadorEdicao.on('dragend', async (e) => {
        const newLatLng = e.target.getLatLng();
        const newLat = newLatLng.lat.toFixed(6);
        const newLon = newLatLng.lng.toFixed(6);

        // 1. Atualiza campos de Lat/Lon no formulário
        editLatitude.value = newLat;
        editLongitude.value = newLon;

        showMessage(editSectionMessageBox, `Coordenadas: ${newLat}, ${newLon}. Buscando endereço...`, 'info');

        // 2. Tenta reverter a coordenada para preencher os campos de endereço
        const endereco = await reverterCoordenadas(newLatLng.lat, newLatLng.lng);
        
        // 3. Preenche os campos do formulário de endereço (mesmo que vazios)
        editRua.value = endereco.rua || '';
        editBairro.value = endereco.bairro || '';
        editCidade.value = endereco.cidade || '';
        editEstado.value = endereco.estado || '';
        editCep.value = endereco.cep || '';
        editNumero.value = ''; // O número deve ser preenchido manualmente
        
        showMessage(editSectionMessageBox, `Coordenadas atualizadas! Endereço aproximado preenchido pelo mapa. Por favor, preencha o Número e confira o CEP.`, 'success');
    });

    // Invalida o tamanho (necessário para garantir a renderização correta após a div ser exibida)
    setTimeout(() => {
        mapaEdicao.invalidateSize();
    }, 100); 
}


// =========================================================
// LÓGICA DE EDIÇÃO NA SEÇÃO (ÚNICA)
// =========================================================

/**
 * Abre a seção de edição com os dados do ponto para ADIÇÃO ou EDIÇÃO.
 * @param {Object|null} pointData Dados do ponto para edição, ou null para adicionar.
 * @param {string|null} id ID do ponto, se for edição.
 * @param {string} mode 'edit' ou 'new'.
 */
async function openEditSection(pointData = null, id = null, mode = 'edit') {
    editForm.reset();
    editSectionMessageBox.style.display = 'none';
    displayUsuarioId.textContent = 'Carregando...'; // Mensagem de carregamento

    let lat = DEFAULT_LAT;
    let lon = DEFAULT_LON;
    let pointName = 'Novo Ponto';

    if (mode === 'new') {
        // Modo Adicionar Novo Ponto
        editSectionTitle.textContent = 'Adicionar Novo Ecoponto Oficial';
        editId.value = '';
        editAtivo.value = 'true';
        
        // Dados de rastreamento para Novo Ponto
        const newUid = currentUser ? currentUser.uid : 'admin_manual';
        editUsuarioId.value = newUid;
        displayUsuarioId.textContent = await getUserName(newUid); // Busca o nome
        displayData.textContent = new Date().toLocaleString('pt-BR');
        
        // Coordenadas iniciais (padrão)
        editLatitude.value = lat;
        editLongitude.value = lon;
        showMessage(editSectionMessageBox, 'Clique no mapa e arraste o marcador para definir a localização do novo ponto.', 'info');
        
    } else {
        // Modo Edição (Sugestão ou Ponto Ativo)
        editSectionTitle.textContent = `Editar Ponto de Coleta: ${pointData.nome || id}`;
        editId.value = id;
        
        editNome.value = pointData.nome || '';
        editCep.value = pointData.cep || '';
        editRua.value = pointData.rua || '';
        editNumero.value = pointData.numero || '';
        editBairro.value = pointData.bairro || '';
        editCidade.value = pointData.cidade || '';
        editEstado.value = pointData.estado || '';
        
        // Latitude e Longitude (READONLY)
        lat = pointData.latitude || DEFAULT_LAT;
        lon = pointData.longitude || DEFAULT_LON;
        pointName = pointData.nome || 'Ponto de Coleta';

        editLatitude.value = lat;
        editLongitude.value = lon;
        
        editObservacoes.value = pointData.observacoes || '';
        
        // Email de Contato (READONLY)
        editEmail.value = pointData.email || ''; 
        
        editAtivo.value = pointData.ativo ? 'true' : 'false';

        // Preenche o campo select (Tipo do Ponto)
        const tipoPontoValue = pointData.tipoPonto || '';
        editTipo.value = tipoPontoValue; 
        
        // Se o valor do banco não estiver nas opções hardcoded, adiciona-o temporariamente.
        if (tipoPontoValue && !Array.from(editTipo.options).some(opt => opt.value === tipoPontoValue)) {
            const newOption = new Option(tipoPontoValue, tipoPontoValue, true, true);
            newOption.setAttribute('data-temp', 'true'); // Marca a opção como temporária
            editTipo.add(newOption);
        }

        // Usuário Contribuinte (Nome)
        editUsuarioId.value = pointData.usuarioId || ''; 
        const userName = await getUserName(pointData.usuarioId);
        displayUsuarioId.textContent = userName;
        
        displayData.textContent = pointData.data ? new Date(pointData.data).toLocaleString('pt-BR') : 'N/A';
    }

    editSection.style.display = 'block';
    editSection.scrollIntoView({ behavior: 'smooth' });
    
    // -----------------------------------------------------------------
    // NOVO: Inicializa o mapa com as coordenadas
    // -----------------------------------------------------------------
    inicializarMapaEdicao(lat, lon, { nome: pointName });
    editSection.style.display = 'block';
    editSection.scrollIntoView({ behavior: 'smooth' });
    
    // =================================================================
    // CORREÇÃO ESSENCIAL PARA O LEAFLET!
    // Força o mapa a recalcular seu tamanho e renderizar corretamente.
    // Isso deve ser feito APÓS a div do mapa se tornar visível ('block').
    // =================================================================
    if (mapaEdicao) {
        // Usa um pequeno timeout para garantir que o navegador completou o layout
        setTimeout(() => {
            mapaEdicao.invalidateSize();
        }, 100); 
    }
}

/**
 * Fecha a seção de edição.
 */
function closeEditSection() {
    editSection.style.display = 'none';
    editSectionMessageBox.style.display = 'none';
    
    // Remove marcador e opções temporárias
    if (marcadorEdicao) {
        mapaEdicao.removeLayer(marcadorEdicao);
        marcadorEdicao = null;
    }
    
    const options = Array.from(editTipo.options);
    const tempOption = options.find(opt => opt.getAttribute('data-temp') === 'true');
    if (tempOption) {
        editTipo.remove(tempOption.index);
    }
}

/**
 * Manipula o envio do formulário da seção de edição (Requisição UPDATE/PUSH no Firebase).
 */
editForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    editSectionMessageBox.style.display = 'none';

    const id = editId.value;

    // Coleta dados completos
    const nome = editNome.value.trim();
    const tipoPonto = editTipo.value;
    const ativo = editAtivo.value === 'true';
    const latitude = parseFloat(editLatitude.value);
    const longitude = parseFloat(editLongitude.value);
    
    // Pega o UID do campo HIDDEN
    const usuarioId = editUsuarioId.value; 

    if (!nome || !tipoPonto || isNaN(latitude) || isNaN(longitude)) {
        showMessage(editSectionMessageBox, 'Por favor, preencha Nome, Tipo, Latitude e Longitude (obrigatórios).', 'error');
        return;
    }
    
    // Validação extra para garantir que o usuário não zerou as coordenadas
    if (latitude === 0 && longitude === 0) {
        showMessage(editSectionMessageBox, 'As coordenadas não podem ser (0, 0). Por favor, use o mapa para selecionar a localização correta.', 'error');
        return;
    }

    const pointData = {
        nome,
        tipoPonto,
        cep: editCep.value.trim() || null,
        rua: editRua.value.trim() || null,
        numero: editNumero.value.trim() || null,
        bairro: editBairro.value.trim() || null,
        cidade: editCidade.value.trim() || null,
        estado: editEstado.value.trim() || null,
        latitude,
        longitude,
        observacoes: editObservacoes.value.trim() || null,
        
        // O email é mantido no banco, mas não é modificado aqui (campo readonly)
        email: editEmail.value.trim() || null, 
        
        ativo,
        
        // Mantém dados de criação ou os cria
        data: id ? displayData.textContent : new Date().toISOString(),
        usuarioId: id ? usuarioId : (currentUser ? currentUser.uid : 'admin_manual')
    };
    
    showMessage(editSectionMessageBox, 'Enviando alterações...', 'info');

    try {
        if (id) {
            // Edição de ponto existente
            await update(ref(database, `pontos/${id}`), pointData);
            showMessage(editSectionMessageBox, `Ponto ID ${id} atualizado com sucesso! Recarregando lista...`, 'success');
        } else {
            // Adição de novo ponto
            await push(ref(database, 'pontos'), pointData);
            showMessage(editSectionMessageBox, 'Novo ponto adicionado com sucesso! Recarregando lista...', 'success');
        }
        
        loadPoints(); // Recarrega os dados
        closeEditSection(); // Fecha a seção
    } catch (error) {
        console.error("Erro ao salvar ponto:", error);
        showMessage(editSectionMessageBox, `Erro ao atualizar ponto: ${error.message}`, 'error');
    }
});

// Evento de Cancelar Edição
btnCancelEdit.addEventListener('click', closeEditSection);

// Evento de Adicionar Novo Ponto
btnAddNewPoint.addEventListener('click', () => openEditSection(null, null, 'new'));


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
        
        if (snapshot.exists()) {
            const allPoints = snapshot.val();
            let hasSuggestions = false;
            let hasActivePoints = false;

            Object.keys(allPoints).forEach(id => {
                const point = { id, ...allPoints[id] };
                if (point.ativo === false || point.ativo === undefined) {
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
    row.insertCell().textContent = suggestion.email || suggestion.usuarioId; // Mostra email ou UID
    
    const actionsCell = row.insertCell();
    actionsCell.className = 'actions';

    // Botão Aprovar (apenas atualiza o status para ativo: true)
    const approveBtn = document.createElement('button');
    approveBtn.textContent = 'Aprovar';
    approveBtn.className = 'btn-approve';
    approveBtn.addEventListener('click', () => approveSuggestion(suggestion.id, suggestion));
    actionsCell.appendChild(approveBtn);

    // Botão Editar (Abre a SEÇÃO de edição)
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'btn-edit';
    editBtn.addEventListener('click', () => openEditSection(suggestion, suggestion.id, 'edit')); 
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

    // Botão Editar (Abre a SEÇÃO de edição)
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'btn-edit';
    editBtn.addEventListener('click', () => openEditSection(point, point.id, 'edit')); 
    actionsCell.appendChild(editBtn);
    
    // Botão Desativar
    const deactivateBtn = document.createElement('button');
    deactivateBtn.textContent = 'Desativar';
    deactivateBtn.className = 'btn-deactivate';
    deactivateBtn.addEventListener('click', () => deactivatePoint(point.id, point));
    actionsCell.appendChild(deactivateBtn);

    // Botão Deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Deletar';
    deleteBtn.className = 'btn-delete';
    deleteBtn.addEventListener('click', () => deletePoint(point.id, 'ecoponto ativo'));
    actionsCell.appendChild(deleteBtn);
}

// =========================================================
// FUNÇÕES DE AÇÃO DO FIREBASE
// =========================================================

/**
 * Aprova uma sugestão, setando 'ativo' para true.
 */
async function approveSuggestion(id, suggestion) {
    if (!confirm(`Tem certeza que deseja APROVAR a sugestão "${suggestion.nome}" e torná-la um ponto ativo?`)) {
        return;
    }
    try {
        await update(ref(database, `pontos/${id}`), { ativo: true });
        showMessage(suggestionsMessageBox, `Sugestão "${suggestion.nome}" aprovada e ativada!`, 'success');
        loadPoints();
    } catch (error) {
        console.error("Erro ao aprovar sugestão:", error);
        showMessage(suggestionsMessageBox, `Erro ao aprovar sugestão: ${error.message}`, 'error');
    }
}

/**
 * Desativa um ponto ativo, setando 'ativo' para false.
 */
async function deactivatePoint(id, point) {
    if (!confirm(`Tem certeza que deseja DESATIVAR o ecoponto "${point.nome}"? Ele será movido para Sugestões/Inativos.`)) {
        return;
    }
    try {
        await update(ref(database, `pontos/${id}`), { ativo: false });
        showMessage(activePointsMessageBox, `Ecoponto "${point.nome}" desativado.`, 'info');
        loadPoints();
    } catch (error) {
        console.error("Erro ao desativar ponto:", error);
        showMessage(activePointsMessageBox, `Erro ao desativar ponto: ${error.message}`, 'error');
    }
}

/**
 * Deleta um ponto permanentemente.
 */
async function deletePoint(id, type) {
    if (!confirm(`Tem certeza que deseja DELETAR permanentemente este ${type} (ID: ${id})? Esta ação é irreversível.`)) {
        return;
    }
    try {
        await remove(ref(database, `pontos/${id}`));
        showMessage(type === 'sugestão' ? suggestionsMessageBox : activePointsMessageBox, `Ponto (ID: ${id}) deletado com sucesso.`, 'success');
        loadPoints();
    } catch (error) {
        console.error("Erro ao deletar ponto:", error);
        showMessage(type === 'sugestão' ? suggestionsMessageBox : activePointsMessageBox, `Erro ao deletar ponto: ${error.message}`, 'error');
    }
}


// =========================================================
// INICIALIZAÇÃO E AUTENTICAÇÃO
// =========================================================

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        // Verifica o nível de acesso (se houver essa lógica em seu banco de dados)
        // Por agora, presumimos que qualquer usuário autenticado pode ver o dashboard.
        authStatusMessage.textContent = `Logado como: ${user.email}. Carregando dados...`;
        authStatusMessage.className = 'message-box success';
        authStatusMessage.style.display = 'block';

        loadPoints(); // Carrega os dados após a autenticação
        
    } else {
        currentUser = null;
        authStatusMessage.textContent = 'Não autenticado. Redirecionando para login...';
        authStatusMessage.className = 'message-box error';
        authStatusMessage.style.display = 'block';
        
        // Redirecionamento forçado se não for admin
        // window.location.href = 'login.html'; // Descomente se precisar de redirecionamento
    }
});