<template>
  <footer class="footer bg-body-tertiary mt-auto py-3">
    <div class="container text-center">
      <p class="mb-0">
        &copy; 2024 Placeholder Company. All rights reserved.
      </p>
      <ul class="list-inline mt-2">
        <li class="list-inline-item">
          <a href="#" class="text-decoration-none">Privacy Policy</a>
        </li>
        <li class="list-inline-item">
          <a href="#" class="text-decoration-none">Terms of Service</a>
        </li>
        <li class="list-inline-item">
          <a href="#" class="text-decoration-none">Contact Us</a>
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
