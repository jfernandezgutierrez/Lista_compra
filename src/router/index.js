// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import Login from '../Inicio.vue';
import Home from '../Home.vue'
import { auth } from '../firebase';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
// Continuación de src/router/index.js





