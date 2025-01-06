<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <RouterLink to="/" style="text-decoration: none; cursor: pointer;">
        <img src="../assets/logo.jpeg" alt="logo" width="50" height="50" class="d-block w-100">
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
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
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
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
          <li class="nav-item" v-if="isAuthenticated">
            <img :src="userPicture" alt="user image" class="rounded-circle" width="40" height="40">
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { ref, watch } from 'vue'
import axios from 'axios'
import defProfilePicture from '@/assets/profile_pic.jpg'

const userPicture = ref<string>();

const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

const getUserPicture = async () => {
  if (!isAuthenticated) return;
  console.log(user.value?.sub)
  const userId = user.value?.sub;
  try {
    await axios.get(`https://s3.us-east-1.amazonaws.com/rowerowydolnyslask.pl-assets/users/${userId}/image`)
    userPicture.value = `https://s3.us-east-1.amazonaws.com/rowerowydolnyslask.pl-assets/users/${userId}/image`;
  }
  catch (e) {
    userPicture.value = defProfilePicture;
  }
};


const login = () => {
  loginWithRedirect();
};

const logoutUser = () => {
  logout();
};

watch( user, () => {
  getUserPicture();
});
</script>
