<template>
<nav class="navbar navbar-expand-lg bg-body-tertiary">
<div class="container-fluid">
  <RouterLink class="navbar-brand" to="/">Home</RouterLink>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <li class="nav-item">
        <button
          v-if="!isAuthenticated"
          type="button"
          class="nav-link btn"
          @click="login"
        >
          Zaloguj
        </button>
        <button
          v-else
          type="button"
          class="nav-link btn"
          @click="logoutUser"
        >
          Wyloguj
        </button>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" to="/map">Mapa</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" to="/trips">Trasy</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" to="/profile">Twój Profil</RouterLink>
      </li>
    </ul>
    <form class="d-flex" role="search">
      <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success" type="submit">Search</button>
    </form>
  </div>
  <div class="ms-3">
    <button class="btn btn-primary" @click="callApi">Call API</button>
    <span v-if="apiResponse" class="ms-2">{{ apiResponse }}</span>
  </div>
</div>
</nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';
import {ref} from "vue";

const apiResponse = ref<string | null>(null);


// Initialize Auth0
const { loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently } = useAuth0();

const login = () => {
  loginWithRedirect();
};

const logoutUser = () => {
  logout();
};

const callApi = async () => {
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch('http://localhost:3000', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.text(); // Use .text() instead of .json()
    apiResponse.value = data;
  } catch (error) {
    console.error('Error calling API:', error);
    apiResponse.value = 'API call failed';
  }
}

</script>
