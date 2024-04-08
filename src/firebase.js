// Importaciones correctas de Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Corregido

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAc19NgPR14UB0cW9EdsFkAMruwyi0zxh4",
  authDomain: "listacompra-951dd.firebaseapp.com",
  projectId: "listacompra-951dd",
  storageBucket: "listacompra-951dd.appspot.com",
  messagingSenderId: "913799817335",
  appId: "1:913799817335:web:faccbe3a860c983610be72"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtiene instancias de Auth y Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Instancia del proveedor de Google para la autenticación
const provider = new GoogleAuthProvider();

// Exporta las instancias necesarias
export { auth, db, provider };
