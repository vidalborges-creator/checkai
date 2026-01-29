// 1. Suas configurações do Firebase (conforme sua imagem)
const firebaseConfig = {
  apiKey: "AIzaSyBkVb8zenJDjsPSFRCiEmcsOHYhKdquT7M",
  authDomain: "check-ai-9303f.firebaseapp.com",
  projectId: "check-ai-9303f",
  storageBucket: "check-ai-9303f.firebasestorage.app",
  messagingSenderId: "732538707024",
  appId: "1:732538707024:web:d467b1246c7dcb16030555",
  measurementId: "G-TZ2QDNKD6P"
};

// 2. Importação dos módulos necessários
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 3. Inicialização
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- FUNÇÃO DE LOGIN (Com correção de refresh) ---
window.fazerLogin = async (email, senha) => {
    // Evita que a página recarregue e limpe os dados
    if (event) event.preventDefault();

    try {
        console.log("Tentando realizar login...");
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        // Busca o nível de acesso (tipo) no Firestore usando o UID
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        
        if (userDoc.exists()) {
            const dados = userDoc.data();
            console.log("Acesso concedido:", dados.tipo);
            
            // Salva o tipo de usuário para usar depois
            localStorage.setItem("userType", dados.tipo);
            
            // Redireciona para a página certa: admin.html, colaborador.html ou gestor.html
            window.location.href = `${dados.tipo}.html`;
        } else {
            alert("Erro: Perfil de usuário não configurado no banco de dados.");
        }
    } catch (error) {
        console.error("Erro no login:", error.message);
        alert("Falha no login: Verifique e-mail, senha e se o link do Netlify está autorizado no Firebase.");
    }
};

// --- FUNÇÃO PARA VOCÊ CADASTRAR NOVOS USUÁRIOS (Na tela admin.html) ---
window.cadastrarUsuario = async (nome, empresa, email, senha, tipo) => {
    try {
        // Cria o usuário no Authentication
        const res = await createUserWithEmailAndPassword(auth, email, senha);
        
        // Salva os detalhes no Firestore
        await setDoc(doc(db, "usuarios", res.user.uid), {
            nome: nome,
            empresa: empresa,
            email: email,
            tipo: tipo,
            criadoEm: new Date()
        });
        
        alert("Usuário " + nome + " cadastrado com sucesso como " + tipo + "!");
    } catch (error) {
        alert("Erro ao cadastrar: " + error.message);
    }
};