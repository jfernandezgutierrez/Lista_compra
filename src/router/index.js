// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import Inicio from '../Inicio.vue';
import Home from '../Home.vue'
import { auth } from '../firebase';

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    name: 'Inicio',
    component: Inicio
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
// Continuación de src/router/index.js





