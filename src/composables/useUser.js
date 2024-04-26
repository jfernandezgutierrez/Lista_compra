// src/composables/useUser.js
import { ref, onMounted } from 'vue';
import { auth } from '@/firebase'; // Asegúrate de que esta ruta sea correcta
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

const user = ref(null);

// Observa los cambios en el estado de autenticación
onAuthStateChanged(auth, (usr) => {
  if (usr) {
    // Usuario ha iniciado sesión o se ha registrado
    user.value = {
      id: usr.uid,
      name: usr.displayName,
      email: usr.email,
      // ...puedes agregar más atributos si lo necesitas
    };
  } else {
    // Usuario ha cerrado sesión
    user.value = null;
  }
});

export function useUser() {
  const signInWithGoogle = async () => {
    const provider = new auth.GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const registerWithEmail = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithEmail = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await auth.signOut();
  };

  return {
    user,
    signInWithGoogle,
    registerWithEmail,
    signInWithEmail,
    signOut,
  };
}
