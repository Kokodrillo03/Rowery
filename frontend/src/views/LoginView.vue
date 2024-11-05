<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100">
    <div class="card p-4" style="width: 24rem;">
      <h3 class="text-center mb-4">Login</h3>
      <form @submit.prevent="handleLogin" novalidate>
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            id="username"
            class="form-control"
            v-model="username"
            required
            :class="{ 'is-invalid': usernameError }"
          />
          <div v-if="usernameError" class="invalid-feedback">
            {{ usernameError }}
          </div>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            class="form-control"
            v-model="password"
            required
            minlength="6"
            :class="{ 'is-invalid': passwordError }"
          />
          <div v-if="passwordError" class="invalid-feedback">
            {{ passwordError }}
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "LoginView",
  setup() {
    const username = ref("");
    const password = ref("");
    const isSubmitting = ref(false);
    const usernameError = ref("");
    const passwordError = ref("");

    const validateForm = (): boolean => {
      let isValid = true;

      usernameError.value = "";
      passwordError.value = "";

      if (!username.value) {
        usernameError.value = "username is required.";
        isValid = false;
      }

      if (!password.value) {
        passwordError.value = "Password is required.";
        isValid = false;
      } else if (password.value.length < 6) {
        passwordError.value = "Password must be at least 6 characters long.";
        isValid = false;
      }

      return isValid;
    };

    const handleLogin = async () => {
      if (!validateForm()) return;

      isSubmitting.value = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        alert("Login successful!");
      } catch (error) {
        console.error("Login error", error);
        alert("Failed to login. Please try again.");
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      username,
      password,
      isSubmitting,
      usernameError,
      passwordError,
      handleLogin,
    };
  },
});
</script>

<style scoped>
.card {
  border-radius: 8px;
}
</style>
