<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <div class="profile-header mb-4">
          <img
            :src="userPicture"
            alt="Profile Picture"
            class="rounded-circle profile-picture"
            @click="triggerFileInput"
          />
          <input type="file" ref="fileInput" @change="uploadProfilePicture" accept="image/*" style="display: none;" />
          <h2 class="mt-3">{{ user?.name }}</h2>
        </div>
      </div>
    </div>

    <div class="row">
      <h3 class="mb-4">Twoje Trasy</h3>
      <div class="col-md-4 mb-4" v-for="trip in trips" :key="trip._id">
        <TripTile
          :_id="trip._id"
          :image="trip.image"
          :title="trip.title"
          :description="trip.description"
          :username="trip.username"
          :userImage="trip.userImage"
          :showRemoveOption="true"
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
import defProfilePicture from '@/assets/profile_pic.jpg';

export default defineComponent({
  name: 'ProfileView',
  components: {
    TripTile,
  },
  setup() {
    const trips = ref<Route[]>([]);
    const userPicture = ref<string>('');
    const { user, getAccessTokenSilently } = useAuth0();
    const fileInput = ref<HTMLInputElement | null>(null);

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    const getUserPicture = async () => {
      const userId = user.value?.sub;
      const timestamp = new Date().getTime(); // Current timestamp
      try {
        await axios.get(`https://s3.us-east-1.amazonaws.com/rowerowydolnyslask.pl-assets/users/${userId}/image`)
        userPicture.value = `https://s3.us-east-1.amazonaws.com/rowerowydolnyslask.pl-assets/users/${userId}/image?t=${timestamp}`;
      }
      catch (e) {
        userPicture.value = defProfilePicture;
      }
    };

    const fetchUserTrips = async () => {
      const token = await getAccessTokenSilently();
      const userId = user.value?.sub;
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/trip/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        trips.value = await response.data;
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
          params: {
            userId,
            imgContentType: file.type,
          }
        });
        const { uploadUrl } = response.data;

        // Step 2: Upload image to S3
        await axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
        });

        await getUserPicture();

      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    };

    onMounted(() => {
      getUserPicture();
      fetchUserTrips();
    });

    return {
      user,
      trips,
      fileInput,
      userPicture,
      triggerFileInput,
      uploadProfilePicture,
      defProfilePicture
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
