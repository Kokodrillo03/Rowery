<template>
  <div class="container py-4">
    <h2 class="mb-4">Trasy społeczności</h2>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Ładowanie...</span>
      </div>
    </div>
    <div v-else class="row g-4">
      <div v-for="(trip, index) in trips" :key="index" class="col-12 col-md-6 col-lg-4">
        <TripTile
          :_id="trip._id"
          :image="trip.image"
          :title="trip.title"
          :description="trip.description"
          :username="trip.username"
          :userImage="trip.userImage"
        />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import TripTile from '@/components/TripTile.vue';
import type { Route } from '@/types'
import { useAuth0 } from '@auth0/auth0-vue'
import axios from 'axios';

export default defineComponent({
  name: 'RoutesListView',
  components: { TripTile },
  setup() {
    const trips = ref<Route[]>([]);
    const loading = ref(true);

    const  { getAccessTokenSilently } = useAuth0();

    const fetchRoutes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/trip`);
        trips.value = await response.data;
      } catch (error) {
        console.error(error);
        trips.value = [
          {
            _id: '1',
            image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
            title: 'Mountain Adventure',
            description: 'A thrilling route through the mountains.',
            username: 'John Doe',
            userImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=40',
          },
          {
            _id: '2',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
            title: 'Seaside Stroll',
            description: 'A relaxing walk along the coastline.',
            username: 'Jane Smith',
            userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=40',
          },
          {
            _id: '4',
            image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
            title: 'Forest Trail',
            description: 'Discover the beauty of the forest.',
            username: 'Alice Green',
            userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=40',
          },
          {
            _id: '5',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
            title: 'Seaside Stroll',
            description: 'A relaxing walk along the coastline.',
            username: 'Jane Smith',
            userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=40',
          },
          {
            _id: '6',
            image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
            title: 'Forest Trail',
            description: 'Discover the beauty of the forest.',
            username: 'Alice Green',
            userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=40',
          },
        ];
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchRoutes();
    });


    return {
      trips,
      loading,
    };
  },
});
</script>


