<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <div class="profile-header mb-4">
          <img :src="user?.picture" alt="Profile Picture" class="rounded-circle profile-picture" />
          <h2 class="mt-3">{{ user?.name }}</h2>
          <p class="text-muted">{{ user?.profile }}</p>
        </div>
      </div>
    </div>

    <div class="row">
      <h3 class="mb-4">Your Trips</h3>
      <div class="col-md-4 mb-4" v-for="trip in trips" :key="trip.id">
        <TripTile
          :id="trip.id"
          :image="trip.image"
          :title="trip.title"
          :description="trip.description"
          :username="trip.username"
          :userImage="trip.userImage"
        />      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import TripTile from '@/components/TripTile.vue';
import { useAuth0 } from '@auth0/auth0-vue';
import type { Route } from '@/types'
import axios from 'axios';

export default defineComponent({
  name: 'ProfileView',
  components: {
    TripTile,
  },
  setup() {
    const trips = ref<Route[]>([]);
    const userMetadata = ref<any>(null);

    const { user, getAccessTokenSilently } = useAuth0();

    console.log(user);

    const fetchUserMetadata = async () => {
      const accessToken = await getAccessTokenSilently();
      const {data} = await axios.get('https://dev-3zf4ofit8rok4lhx.us.auth0.com/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(data);
      userMetadata.value = data.user_metadata;
    }

    const fetchUserTrips = async () => {
      const token = await getAccessTokenSilently();
      const userId = user.value?.sub
      try {
        const response = await fetch(`http://localhost:3000/trip/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        trips.value = await response.json();
      } catch (e) {
        console.error('Error fetching user trips:', e);
        trips.value = [
          {
            id: 1,
            image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
            title: 'Mountain Adventure',
            description: 'A thrilling route through the mountains.',
          },
          {
            id: 2,
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
            title: 'Seaside Stroll',
            description: 'A relaxing walk along the coastline.',
          },
          {
            id: 3,
            image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
            title: 'Forest Trail',
            description: 'Discover the beauty of the forest.',
            userImage: '://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=40',
          },
          {
            id: 4,
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
            title: 'Seaside Stroll',
            description: 'A relaxing walk along the coastline.',
          },
          {
            id: 5,
            image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
            title: 'Forest Trail',
            description: 'Discover the beauty of the forest.',
          },
        ];
      }
    };

    onMounted(() => {
      fetchUserTrips();
      fetchUserMetadata();
    });

    return {
      user,
      trips,
    };
  },
});
</script>

<style scoped>
.profile-header {
  text-align: center;
}

.profile-picture {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 3px solid #007bff;
}

h2 {
  font-size: 1.8rem;
}

h3 {
  font-size: 1.5rem;
  color: #007bff;
}

.text-muted {
  font-size: 1rem;
}
</style>
