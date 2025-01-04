import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const requireAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  if (isAuthenticated.value) {
    next();
  } else {
    loginWithRedirect({ appState: { targetUrl: to.fullPath } });
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue'),
    },
    {
      path: '/trips',
      name: 'trips',
      component: () => import('../views/TripsView.vue'),
    },
    {
      path: '/trips/:tripId',
      name: 'single-trip',
      props: route => ({ tripId: route.params.tripId }),
      component: () => import('../views/SingleTripView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      beforeEnter: requireAuth,
    },
  ],
});

export default router;
