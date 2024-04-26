<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12" outlined>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Iniciar sesión</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field label="Correo electrónico" v-model="login.email" outlined dense></v-text-field>
            <v-text-field label="Contraseña" v-model="login.password" type="password" outlined dense></v-text-field>
            <v-btn color="primary" @click="loginWithEmail">Iniciar sesión</v-btn>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="green" @click="signInWithGoogle">Iniciar sesión con Google</v-btn>
          </v-card-actions>
          <v-divider></v-divider>
          <v-card-text>
            <v-text-field label="Correo electrónico" v-model="register.email" outlined dense></v-text-field>
            <v-text-field label="Contraseña" v-model="register.password" type="password" outlined dense></v-text-field>
            <v-btn color="secondary" @click="registerWithEmail">Registrarse</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { auth } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'Inicio',
  data() {
    return {
      login: {
        email: '',
        password: ''
      },
      register: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          this.$router.push({ name: 'Home' });
        })
        .catch((error) => {
          console.error('Error signing in with Google:', error);
        });
    },
    loginWithEmail() {
      signInWithEmailAndPassword(auth, this.login.email, this.login.password)
        .then(() => {
          this.$router.push({ name: 'Home' });
        })
        .catch((error) => {
          console.error('Error logging in:', error);
        });
    },
    registerWithEmail() {
      createUserWithEmailAndPassword(auth, this.register.email, this.register.password)
        .then(() => {
          this.$router.push({ name: 'Home' });
        })
        .catch((error) => {
          console.error('Error registering:', error);
        });
    }
  },
  created() {
    // Aquí puedes agregar código para ejecutarse justo después de crear el componente, por ejemplo, verificar el estado del usuario
  }
};
</script>
