<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100">
    <div class="card p-4" style="width: 24rem;">
      <h3 class="text-center mb-4">Register</h3>
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
          <label for="email" class="form-label">Email address</label>
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="email"
            required
            :class="{ 'is-invalid': emailError }"
          />
          <div v-if="emailError" class="invalid-feedback">
            {{ emailError }}
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
    const email = ref("");
    const password = ref("");
    const isSubmitting = ref(false);
    const usernameError = ref("");
    const emailError = ref("");
    const passwordError = ref("");

    const validateForm = (): boolean => {
      let isValid = true;

      usernameError.value = "";
      emailError.value = "";
      passwordError.value = "";

      if (!email.value) {
        emailError.value = "Email is required.";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        emailError.value = "Please enter a valid email address.";
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
        // Simulate an async API call for login
        await new Promise((resolve) => setTimeout(resolve, 2000));

        alert("Login successful!"); // Replace this with actual login logic
      } catch (error) {
        console.error("Login error", error);
        alert("Failed to login. Please try again.");
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      username,
      email,
      password,
      isSubmitting,
      usernameError,
      emailError,
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
