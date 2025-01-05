<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <div class="profile-header mb-4">
          <img :src="user?.picture" alt="Profile Picture" class="rounded-circle profile-picture" @click="triggerFileInput" />
          <input type="file" ref="fileInput" @change="uploadProfilePicture" accept="image/*" style="display: none;" />
          <h2 class="mt-3">{{ user?.name }}</h2>
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
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import axios from 'axios';
import { Route } from '@/types';
import TripTile from '@/components/TripTile.vue';

export default defineComponent({
  name: 'ProfileView',
  components: {
    TripTile,
  },
  setup() {
    const trips = ref<Route[]>([]);
    const userMetadata = ref<any>(null);
    const { user, getAccessTokenSilently } = useAuth0();
    const fileInput = ref<HTMLInputElement | null>(null);

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    const fetchUserMetadata = async () => {
      const accessToken = await getAccessTokenSilently();
      const { data } = await axios.get('https://dev-3zf4ofit8rok4lhx.us.auth0.com/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      userMetadata.value = data.user_metadata;
    };

    const fetchUserTrips = async () => {
      const token = await getAccessTokenSilently();
      const userId = user.value?.sub;
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/trip/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        trips.value = await response.json();
      } catch (e) {
        console.error('Error fetching user trips:', e);
        trips.value = [
          /* Some default trips */
        ];
      }
    };

    const uploadProfilePicture = async (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const token = await getAccessTokenSilently();
      const userId = user.value?.sub;

      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/user/imageUpload`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { userId }
        });
        const { uploadUrl, s3Url } = response.data;

        // Step 2: Upload image to S3
        await axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
        });

        await axios.patch(`https://dev-3zf4ofit8rok4lhx.us.auth0.com/api/v2/users/${userId}`, {
          user_metadata: { picture: s3Url }
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        // Step 4: Update local user object
        fetchUserMetadata();

      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    };

    onMounted(() => {
      fetchUserTrips();
      fetchUserMetadata();
    });

    return {
      user,
      trips,
      fileInput,
      triggerFileInput,
      uploadProfilePicture,
    };
  },
});
</script>

<style scoped>
.profile-header {
  text-align: center;
  cursor: pointer;
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
</style>
