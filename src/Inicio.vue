<template>
    <v-container>
      <v-btn @click="signInWithGoogle">Iniciar sesión con Google</v-btn>
    </v-container>
  </template>
  
  <script>
  import { auth, provider } from './firebase';
  import { signInWithPopup } from 'firebase/auth';
  import { useRoute, useRouter } from 'vue-router';
  export default {
    name: 'Inicio',
    
    setup() {
    const router = useRouter();

    const signInWithGoogle = async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        // Esto te da un token de Google Access. Puedes usarlo para acceder a la API de Google.
        // const credential = result.credential; // posiblemente no necesites esto para la redirección
        console.log(result);

        // La información del usuario logueado
        const user = result.user;
        console.log(user);

        // Redirige al usuario a la vista MenuView después del inicio de sesión exitoso
        router.push({ name: 'Home' }); // Asegúrate de que 'Menu' corresponda al name de la ruta en tu router
      } catch (error) {
        console.error(error);
      }
    };

    return { signInWithGoogle };
  },
  };
  </script>
  