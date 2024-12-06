<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="d-flex flex-column" style="height: 100vh">
    <header>
      <Navigation />
    </header>

    <main class="flex-grow-1">
      <RouterView id="view" />
    </main>

    <footer>
      <Footer />
    </footer>
  </div>
</template>

<style scoped>
footer {
  border-top: 1px solid #ddd;
}
</style>
