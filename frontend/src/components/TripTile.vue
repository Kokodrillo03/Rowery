<template>
  <div class="tile" @click="redirectToTrip">
    <div class="tile-image">
      <img :src="image" alt="Tile Image" class="img-fluid" />
    </div>
    <div class="tile-content">
      <h5 class="tile-title">{{ title }}</h5>
      <p class="tile-description">{{ description }}</p>
    </div>
    <div class="tile-footer" v-if="hasUserInformation">
      <img :src="userImage" alt="User Image" class="user-avatar" />
      <span class="username">{{ username }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'TripTile',
  props: {
    id: { type: Number, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    username: { type: String, required: false },
    userImage: { type: String, required: false },
  },
  setup(props) {
    const router = useRouter();

    const redirectToTrip = () => {
      router.push(`/trips/${props.id}`);
    };

    const hasUserInformation = props.username && props.userImage;

    return {
      redirectToTrip,
      hasUserInformation
    };
  },
});
</script>

<style scoped>
.tile {
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.tile:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.tile-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.tile-content {
  padding: 15px;
  flex-grow: 1;
}

.tile-title {
  font-size: 1.25rem;
  margin-bottom: 10px;
}

.tile-description {
  font-size: 0.9rem;
  color: #666;
}

.tile-footer {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-top: 1px solid #ddd;
}

.tile-footer .user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
}

.tile-footer .username {
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
}
</style>
