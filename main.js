// main.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';

// Importe o objeto de configuração do seu novo arquivo
import { firebaseConfig } from './firebase_config.js'; // Caminho relativo ao seu main.js

// Inicialize o Firebase com a configuração importada
const app = initializeApp(firebaseConfig);

// Obtenha instâncias dos serviços
const auth = getAuth(app);
const database = getDatabase(app);

// Agora você pode usar 'auth' e 'database' em todo o seu main.js
// ... sua lógica de autenticação, leitura/escrita no DB, etc. ...

// Exemplo:
 const emailInput = document.getElementById('email');
 const passwordInput = document.getElementById('password');
 const signInButton = document.getElementById('sign-in-button');

 signInButton.addEventListener('click', async () => {
     const email = emailInput.value;
     const password = passwordInput.value;
     try {
         await signInWithEmailAndPassword(auth, email, password);
         console.log("Usuário logado!");
     } catch (error) {
         console.error("Erro de login:", error.message);
     }
 });
