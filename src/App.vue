<template>
  <v-app>
    <v-main>
      <!-- El componente de la ruta actual se renderiza aquí -->
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
// Aquí ya no necesitas importar HelloWorld ya que el routing se encarga de ello.
</script>
