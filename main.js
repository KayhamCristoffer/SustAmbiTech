// main.js

// --- Importações de Módulos Firebase ---
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword, sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getDatabase, ref, set, get, update } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';

// --- Importação da Configuração do Firebase ---
import { firebaseConfig } from './firebase-config.js';

// --- Inicialização do Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// --- Variáveis para armazenar o estado original do perfil para comparação ---
let originalFirstName = '';
let originalLastName = '';
let originalEmail = '';

// --- Lógica Geral do Aplicativo (executada quando o DOM estiver pronto) ---
document.addEventListener('DOMContentLoaded', () => {

  // --- Elementos que podem estar em qualquer página e precisam ser atualizados ---
  const heroTitle = document.getElementById('heroTitle');
  const heroRegisterBtn = document.getElementById('heroRegisterBtn');
  const heroEditProfileBtn = document.getElementById('heroEditProfileBtn');

  // --- 1. Lógica de Carregamento e Setup do Menu ---
  fetch('menu.html')
    .then(response => response.text())
    .then(data => {
      const menuContainer = document.getElementById('menu-container');
      if (menuContainer) {
        menuContainer.innerHTML = data;

        const menuBtn = document.getElementById("menuBtn");
        const body = document.body;

        let overlay = document.getElementById("overlay");
        if (!overlay) {
          overlay = document.createElement("div");
          overlay.id = "overlay";
          overlay.className = "overlay";
          document.body.appendChild(overlay);
        }

        if (menuBtn) {
          menuBtn.addEventListener("click", () => {
            body.classList.toggle("menu-open");
          });
        }

        if (overlay) {
          overlay.addEventListener("click", () => {
            body.classList.remove("menu-open");
          });
        }

        const loginMenuItem = document.getElementById('loginMenuItem');
        const registerMenuItem = document.getElementById('registerMenuItem');
        const userNameMenuItem = document.getElementById('userNameMenuItem');
        const userNameDisplay = userNameMenuItem ? userNameMenuItem.querySelector('.user-name') : null;
        const editMenuItem = document.getElementById('editMenuItem');
        const logoutMenuItem = document.getElementById('logoutMenuItem');
        const logoutButtonLink = logoutMenuItem ? logoutMenuItem.querySelector('a.logout') : null;
        // Adicionado: Item de menu para serviços
        const servicesMenuItem = document.getElementById('servicesMenuItem');

        onAuthStateChanged(auth, async (user) => {
          // Array de páginas que requerem autenticação
          const restrictedPages = ['edit-profile.html', 'servicos.html','formulario.html','fontes.html'];
          const currentPage = window.location.pathname.split('/').pop();
          const isRestrictedPage = restrictedPages.includes(currentPage);
          
          if (user) {
            // Usuário está logado
            if (loginMenuItem) loginMenuItem.style.display = 'none';
            if (registerMenuItem) registerMenuItem.style.display = 'none';
            
            if (userNameMenuItem) userNameMenuItem.style.display = 'list-item';
            if (editMenuItem) editMenuItem.style.display = 'list-item';
            if (logoutMenuItem) logoutMenuItem.style.display = 'list-item';
            if (servicesMenuItem) servicesMenuItem.style.display = 'list-item'; // Garante que o item de serviços seja visível

            if (heroRegisterBtn) heroRegisterBtn.style.display = 'none';
            if (heroEditProfileBtn) heroEditProfileBtn.style.display = 'block';

            console.log("Usuário logado:", user.email, "UID:", user.uid);

            try {
              const userRef = ref(database, 'users/' + user.uid);
              const snapshot = await get(userRef);

              if (snapshot.exists()) {
                const userData = snapshot.val();
                const nome = userData.nome || 'Usuário';
                const sobrenome = userData.sobrenome || '';
                
                originalFirstName = userData.nome || '';
                originalLastName = userData.sobrenome || '';
                originalEmail = userData.email || user.email;

                if (heroTitle) {
                  heroTitle.textContent = `Bem-vindo ao Futuro Verde ${nome}`;
                }

                if (userNameDisplay) {
                  userNameDisplay.textContent = `${nome} ${sobrenome}`;
                }

                const editProfileForm = document.getElementById('edit-profile-form');
                if (editProfileForm) {
                    document.getElementById('firstName').value = originalFirstName;
                    document.getElementById('lastName').value = originalLastName;
                    document.getElementById('email').value = originalEmail;
                }

              } else {
                console.warn("Dados de perfil do usuário não encontrados no Realtime Database.");
                originalEmail = user.email;

                if (heroTitle) heroTitle.textContent = `Bem-vindo ao Futuro Verde - ${user.email}`;
                if (userNameDisplay) userNameDisplay.textContent = user.email;
                
                const editProfileForm = document.getElementById('edit-profile-form');
                if (editProfileForm) {
                    document.getElementById('email').value = user.email || '';
                }
              }
            } catch (dbError) {
              console.error("Erro ao buscar dados do usuário no Realtime Database:", dbError);
              originalEmail = user.email;

              if (heroTitle) heroTitle.textContent = `Bem-vindo ao Futuro Verde - ${user.email}`;
              if (userNameDisplay) userNameDisplay.textContent = user.email;
              const editProfileForm = document.getElementById('edit-profile-form');
                if (editProfileForm) {
                    document.getElementById('email').value = user.email || '';
                }
            }

          } else {
            // Usuário não está logado
            if (loginMenuItem) loginMenuItem.style.display = 'list-item';
            if (registerMenuItem) registerMenuItem.style.display = 'list-item';
            
            if (userNameMenuItem) userNameMenuItem.style.display = 'none';
            if (editMenuItem) editMenuItem.style.display = 'none';
            if (logoutMenuItem) logoutMenuItem.style.display = 'none';
            if (servicesMenuItem) servicesMenuItem.style.display = 'none'; // Esconde o item de menu de serviços

            if (heroRegisterBtn) heroRegisterBtn.style.display = 'block';
            if (heroEditProfileBtn) heroEditProfileBtn.style.display = 'none';
            
            console.log("Nenhum usuário logado.");

            if (heroTitle) {
              heroTitle.textContent = `Bem-vindo ao Futuro Verde`;
            }
            
            // Verifica se a página atual é restrita e redireciona se necessário
            if (isRestrictedPage) {
              window.location.href = 'login.html';
            }
          }
          body.classList.remove("menu-open");
        });

        if (logoutButtonLink) {
          logoutButtonLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
              await signOut(auth);
              console.log("Usuário desconectado com sucesso!");
              // Redireciona para a página inicial após o logout
              window.location.href = 'index.html';
            } catch (error) {
              console.error("Erro ao desconectar:", error);
            }
          });
        }
      } else {
        console.warn("Elemento 'menu-container' não encontrado no DOM. Verifique seu HTML.");
      }
    })
    .catch(error => console.error('Erro ao carregar o menu:', error));


  // --- 2. Lógica de Cadastro do Formulário (do register.html) ---
  const registerForm = document.getElementById('register-form');
  const feedbackMessage = document.getElementById('mensagem-feedback');

  if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();
      const termsAccepted = document.getElementById('termsAccepted').checked;
      const newsletter = document.getElementById('newsletter').checked;

      if (!termsAccepted) {
        displayMessage('Por favor, aceite os Termos de Uso e Política de Privacidade.', 'red');
        return;
      }

      if (password === '' || confirmPassword === '') {
        displayMessage('Por favor, preencha ambos os campos de senha.', 'red');
        return;
      }

      if (password !== confirmPassword) {
        displayMessage('As senhas não coincidem. Tente novamente.', 'red');
        return;
      }

      if (password.length < 6) {
        displayMessage('A senha deve ter no mínimo 6 caracteres.', 'red');
        return;
      }

      displayMessage('Criando sua conta...', 'blue');

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const uid = user.uid;

        await set(ref(database, 'users/' + uid), {
          nome: firstName,
          sobrenome: lastName,
          email: email,
          criado: new Date().toISOString(),
          newsletterOptIn: newsletter
        });

        displayMessage('Conta criada com sucesso! Redirecionando para o login...', 'green');

        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);

      } catch (error) {
        const errorCode = error.code;
        let errorMessage = 'Ocorreu um erro ao criar a conta. Por favor, tente novamente.';

        switch (errorCode) {
          case 'auth/email-already-in-use':
            errorMessage = 'Este e-mail já está cadastrado. Tente outro ou faça login.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'O formato do e-mail é inválido.';
            break;
          case 'auth/weak-password':
            errorMessage = 'A senha é muito fraca. Escolha uma senha mais forte.';
            break;
          default:
            console.error("Erro inesperado ao criar conta:", error);
            break;
        }
        displayMessage(errorMessage, 'red');
      }
    });
  }

  function displayMessage(message, color) {
    if (feedbackMessage) {
      feedbackMessage.textContent = message;
      feedbackMessage.style.color = color;
    }
  }


  // --- 3. Lógica do Formulário de Login (do login.html) ---
  const loginForm = document.getElementById('login-form');
  const loginFeedbackMessage = document.getElementById('loginFeedbackMessage');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      const termsAccepted = document.getElementById('loginTermsCheckbox').checked;

      if (!termsAccepted) {
        displayLoginMessage('Por favor, aceite os termos de serviço.', 'red');
        return;
      }

      displayLoginMessage('Entrando...', 'blue');

      try {
        await signInWithEmailAndPassword(auth, email, password);

        displayLoginMessage('Login realizado com sucesso! Redirecionando...', 'green');

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);

      } catch (error) {
        const errorCode = error.code;
        let errorMessage = 'Erro ao fazer login. Verifique seu e-mail e senha.';

        switch (errorCode) {
          case 'auth/invalid-email':
            errorMessage = 'E-mail inválido.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Sua conta foi desativada.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Usuário não encontrado. Crie uma conta.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Senha incorreta.';
            break;
          default:
            console.error("Erro inesperado ao fazer login:", error);
            break;
        }
        displayLoginMessage(errorMessage, 'red');
      }
    });
  }

  function displayLoginMessage(message, color) {
    if (loginFeedbackMessage) {
      loginFeedbackMessage.textContent = message;
      loginFeedbackMessage.style.color = color;
    }
  }

  // --- 4. Lógica para o Formulário de Edição de Perfil Unificado (edit-profile.html) ---
  const editProfileForm = document.getElementById('edit-profile-form');
  const profileFeedbackMessage = document.getElementById('profileFeedbackMessage');

  if (editProfileForm) {
      const firstNameInput = document.getElementById('firstName');
      const lastNameInput = document.getElementById('lastName');
      const emailInput = document.getElementById('email');
      const currentPasswordInput = document.getElementById('currentPassword');
      const newPasswordInput = document.getElementById('newPassword');
      const confirmNewPasswordInput = document.getElementById('confirmNewPassword');

      editProfileForm.addEventListener('submit', async (e) => {
          e.preventDefault();

          const currentUser = auth.currentUser;
          if (!currentUser) {
              displayProfileMessage("Você precisa estar logado para editar seu perfil.", "red");
              setTimeout(() => { window.location.href = 'login.html'; }, 1500);
              return;
          }

          const newFirstName = firstNameInput.value.trim();
          const newLastName = lastNameInput.value.trim();
          const newEmail = emailInput.value.trim();
          const currentPassword = currentPasswordInput.value.trim();
          const newPassword = newPasswordInput.value.trim();
          const confirmNewPassword = confirmNewPasswordInput.value.trim();

          let changesMade = false;
          let promises = [];

          displayProfileMessage("Salvando alterações...", "blue");

          // 1. Atualizar Nome e Sobrenome (Realtime Database)
          if (newFirstName !== originalFirstName || newLastName !== originalLastName) {
              promises.push(
                  update(ref(database, 'users/' + currentUser.uid), {
                      nome: newFirstName,
                      sobrenome: newLastName
                  }).then(() => {
                      changesMade = true;
                      console.log("Nome/Sobrenome atualizados no RTDB.");
                  }).catch(error => {
                      console.error("Erro ao atualizar nome/sobrenome:", error);
                      throw new Error("Erro ao atualizar nome/sobrenome.");
                  })
              );
          }

          // 2. Mudar E-mail (Firebase Authentication)
          if (newEmail !== originalEmail) {
              if (currentPassword === '') {
                  displayProfileMessage("Para mudar o e-mail, por favor, informe sua senha atual.", "red");
                  return;
              }
              if (!newEmail.includes('@') || !newEmail.includes('.')) {
                  displayProfileMessage("Formato de e-mail inválido.", "red");
                  return;
              }
              
              promises.push(
                  reauthenticateAndThen(currentUser, currentPassword, async () => {
                      await updateEmail(currentUser, newEmail);
                      await update(ref(database, 'users/' + currentUser.uid), { email: newEmail });
                      originalEmail = newEmail;
                      changesMade = true;
                      console.log("E-mail atualizado no Auth e RTDB.");
                  }).catch(error => {
                      console.error("Erro ao mudar e-mail:", error);
                      if (error.code === 'auth/email-already-in-use') {
                        throw new Error('Este e-mail já está em uso.');
                      } else if (error.code === 'auth/invalid-email') {
                        throw new Error('O formato do novo e-mail é inválido.');
                      } else {
                        throw new Error('Erro ao mudar e-mail. Verifique a senha atual e o novo e-mail.');
                      }
                  })
              );
          }

          // 3. Mudar Senha (Firebase Authentication)
          if (newPassword !== '') {
              if (currentPassword === '') {
                  displayProfileMessage("Para mudar a senha, por favor, informe sua senha atual.", "red");
                  return;
              }
              if (newPassword !== confirmNewPassword) {
                  displayProfileMessage('A nova senha e a confirmação não coincidem.', 'red');
                  return;
              }
              if (newPassword.length < 6) {
                  displayProfileMessage('A nova senha deve ter no mínimo 6 caracteres.', 'red');
                  return;
              }
              if (newPassword === currentPassword) {
                  displayProfileMessage('A nova senha não pode ser igual à senha atual.', 'red');
                  return;
              }

              promises.push(
                  reauthenticateAndThen(currentUser, currentPassword, async () => {
                      await updatePassword(currentUser, newPassword);
                      changesMade = true;
                      console.log("Senha atualizada no Auth.");
                  }).catch(error => {
                      console.error("Erro ao mudar senha:", error);
                      if (error.code === 'auth/weak-password') {
                          throw new Error('A nova senha é muito fraca. Escolha uma senha mais forte.');
                      } else {
                          throw new Error('Erro ao mudar senha. Verifique a senha atual e a nova senha.');
                      }
                  })
              );
          }

          if (promises.length === 0) {
              displayProfileMessage("Nenhuma alteração detectada para salvar.", "orange");
              return;
          }
          
          try {
              await Promise.all(promises);

              displayProfileMessage("Perfil atualizado com sucesso!", "green");
              currentPasswordInput.value = '';
              newPasswordInput.value = '';
              confirmNewPasswordInput.value = '';

              setTimeout(() => { window.location.href = 'index.html'; }, 1500);

          } catch (error) {
              console.error("Erro geral no salvamento do perfil:", error);
              if (error.code === 'auth/wrong-password') {
                  displayProfileMessage('Senha atual incorreta.', 'red');
              } else if (error.code === 'auth/requires-recent-login') {
                  displayProfileMessage('Esta operação é sensível e requer reautenticação recente. Por favor, faça login novamente e tente de novo.', 'red');
              } else {
                  displayProfileMessage(error.message || "Ocorreu um erro ao salvar as alterações.", "red");
              }
          }
      });
  }

  async function reauthenticateAndThen(user, password, action) {
      if (!user.email) {
          throw new Error("Reautenticação por senha não suportada para este tipo de conta.");
      }
      try {
          const credential = EmailAuthProvider.credential(user.email, password);
          await reauthenticateWithCredential(user, credential);
          console.log("Reautenticação bem-sucedida.");
          await action();
      } catch (error) {
          console.error("Falha na reautenticação ou na ação subsequente:", error);
          throw error;
      }
  }

  function displayProfileMessage(message, color) {
      if (profileFeedbackMessage) {
          profileFeedbackMessage.textContent = message;
          profileFeedbackMessage.style.color = color;
      }
  }

  // --- 5. Lógica para a Página de Recuperação de Senha (esqueceu-senha.html) ---
  const forgotPasswordRequestForm = document.getElementById('forgot-password-request-form');
  const requestFeedbackMessage = document.getElementById('requestFeedbackMessage');

  const forgotPasswordResetForm = document.getElementById('forgot-password-reset-form');
  const resetFeedbackMessage = document.getElementById('resetFeedbackMessage');
  let oobCode = null; // Variável para armazenar o oobCode se vier da URL

  if (forgotPasswordRequestForm || forgotPasswordResetForm) { // Verifica se estamos na página de recuperação de senha
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      const actionCode = urlParams.get('oobCode'); // Firebase usa 'oobCode' para o código de ação

      if (mode === 'resetPassword' && actionCode) {
          // Usuário chegou via link de e-mail para redefinir a senha
          oobCode = actionCode; // Armazena o código para uso posterior

          forgotPasswordRequestForm.style.display = 'none'; // Esconde o formulário de solicitação
          forgotPasswordResetForm.style.display = 'block';   // Mostra o formulário de nova senha

          // Opcional: Verificar o código imediatamente para dar um feedback inicial
          // Não é estritamente necessário aqui, pois confirmPasswordReset fará a verificação
          verifyPasswordResetCode(auth, oobCode)
              .then((email) => {
                  console.log('Código de redefinição de senha válido para:', email);
                  // Podemos pré-preencher o email, mas o Firebase não exige
              })
              .catch((error) => {
                  console.error('Erro ao verificar código de redefinição:', error);
                  resetFeedbackMessage.textContent = 'Link de redefinição inválido ou expirado. Por favor, solicite um novo e-mail.';
                  resetFeedbackMessage.style.color = 'red';
                  forgotPasswordResetForm.style.display = 'none'; // Oculta o formulário de senha
                  forgotPasswordRequestForm.style.display = 'block'; // Mostra o formulário de solicitação novamente
              });

          // Adicionar listener ao formulário de nova senha
          forgotPasswordResetForm.addEventListener('submit', async (e) => {
              e.preventDefault();

              const newPassword = document.getElementById('newPassword').value.trim();
              const confirmNewPassword = document.getElementById('confirmNewPassword').value.trim();

              if (newPassword === '' || confirmNewPassword === '') {
                  displayResetMessage('Por favor, preencha os dois campos de senha.', 'red');
                  return;
              }
              if (newPassword !== confirmNewPassword) {
                  displayResetMessage('As senhas não coincidem. Tente novamente.', 'red');
                  return;
              }
              if (newPassword.length < 6) {
                  displayResetMessage('A senha deve ter no mínimo 6 caracteres.', 'red');
                  return;
              }

              displayResetMessage("Salvando nova senha...", "blue");

              try {
                  await confirmPasswordReset(auth, oobCode, newPassword);
                  displayResetMessage('Sua senha foi redefinida com sucesso! Redirecionando para o login...', 'green');
                  
                  // Limpar campos de senha
                  document.getElementById('newPassword').value = '';
                  document.getElementById('confirmNewPassword').value = '';

                  setTimeout(() => {
                      window.location.href = 'login.html'; // Redireciona para a página de login
                  }, 2000);

              } catch (error) {
                  console.error("Erro ao redefinir a senha:", error);
                  let errorMessage = 'Erro ao redefinir a senha. O link pode ser inválido ou já foi usado.';
                  switch (error.code) {
                      case 'auth/invalid-action-code':
                          errorMessage = 'O link de redefinição é inválido ou expirou.';
                          break;
                      case 'auth/user-disabled':
                          errorMessage = 'Sua conta foi desativada.';
                          break;
                      case 'auth/user-not-found':
                          errorMessage = 'Não há usuário com este e-mail.';
                          break;
                      case 'auth/weak-password':
                          errorMessage = 'A nova senha é muito fraca. Escolha uma senha mais forte.';
                          break;
                      default:
                          break;
                  }
                  displayResetMessage(errorMessage, 'red');
              }
          });

      } else if (forgotPasswordRequestForm) {
          // Usuário chegou na página para solicitar o e-mail de redefinição
          forgotPasswordRequestForm.addEventListener('submit', async (e) => {
              e.preventDefault();
              const email = document.getElementById('emailInput').value.trim();

              if (email === '') {
                  displayRequestMessage('Por favor, digite seu e-mail.', 'red');
                  return;
              }

              displayRequestMessage("Enviando e-mail de recuperação...", "blue");

              try {
                  await sendPasswordResetEmail(auth, email);
                  displayRequestMessage(`Um e-mail de redefinição de senha foi enviado para ${email}. Por favor, verifique sua caixa de entrada.`, 'green');
                  document.getElementById('forgot-password-request-form').reset(); // Limpa o campo de e-mail
              } catch (error) {
                  console.error("Erro ao enviar e-mail de recuperação:", error);
                  let errorMessage = 'Erro ao enviar e-mail de recuperação. Por favor, tente novamente.';
                  switch (error.code) {
                      case 'auth/invalid-email':
                          errorMessage = 'E-mail inválido.';
                          break;
                      case 'auth/user-not-found':
                          errorMessage = 'Não há usuário registrado com este e-mail.';
                          break;
                      default:
                          break;
                  }
                  displayRequestMessage(errorMessage, 'red');
              }
          });
      }
  }
    
  // Funções auxiliares para feedback
  function displayRequestMessage(message, color) {
      if (requestFeedbackMessage) {
          requestFeedbackMessage.textContent = message;
          requestFeedbackMessage.style.color = color;
      }
  }

  function displayResetMessage(message, color) {
      if (resetFeedbackMessage) {
          resetFeedbackMessage.textContent = message;
          resetFeedbackMessage.style.color = color;
      }
  }

}); // Fim do DOMContentLoaded