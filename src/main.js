/**
 * main.js
 *
 * Bootstraps Vuetify, Vue Router, and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Router
import router from './router' // Asume que tu configuración de router está en src/router/index.js

const app = createApp(App)

// Registrar Vue Router y otros plugins
registerPlugins(app)

// Usa Vue Router
app.use(router)

app.mount('#app')
