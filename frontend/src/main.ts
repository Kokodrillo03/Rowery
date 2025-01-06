import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(
  createAuth0({
    domain: "dev-3zf4ofit8rok4lhx.us.auth0.com",
    clientId: "7coPsjBBu5bz0IFeP6kgIV2ub22lDUI1",
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: 'https://api.rowerowydolnyslask',
      scope: 'openid profile email read:current_user update:users',
    }
  })
);

app.mount('#app')

import 'bootstrap/dist/js/bootstrap.js'
import {createAuth0} from "@auth0/auth0-vue";
