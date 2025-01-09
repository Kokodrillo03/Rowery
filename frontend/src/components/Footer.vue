<template>
  <footer class="footer bg-body-tertiary mt-auto py-3">
    <div class="container text-center">
      <p class="mb-0">
        &copy; 2025 Krzysztof Dziurman. Wszystkie prawa zastrzeżone.
      </p>
      <ul class="list-inline mt-2">
        <li class="list-inline-item">
          <a href="#" class="text-decoration-none">Polityka Prywatności</a>
        </li>
        <li class="list-inline-item">
          <a href="#" class="text-decoration-none">Regulamin</a>
        </li>
        <li class="list-inline-item">
          <a href="#" class="text-decoration-none">Kontakt</a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Footer',
});
</script>

<style scoped>
.footer {
  border-top: 1px solid #ddd;
}
</style>
