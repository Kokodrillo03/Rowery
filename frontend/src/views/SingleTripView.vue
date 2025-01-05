<template>
  <div>
    <div v-if="trip">
      <h1>{{ trip?.title }}</h1>
      <div class="trip-details">
        <img :src="trip?.image" alt="Trip Cover" class="trip-cover" />

        <div class="profile-header">
          <img :src="trip?.userImage" alt="User Picture" class="profile-picture-sm" />
          <span class="profile-username">{{ trip?.username }}</span>
        </div>

        <p class="text-muted">{{ trip?.description }}</p>
      </div>

    </div>

    <div id="map" class="leaflet-map"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';
import L, { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css';
import { Route } from '@/types'

export default defineComponent({
  name: 'SingleTripView',
  props: {
    tripId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const trip = ref<Route>();

    const fetchTripDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/trips/${props.tripId}`);
        trip.value = response.data;
      } catch (error) {
        trip.value = {
          id: 0,
          title: 'Trip not found',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
          username: 'Krzysztofek',
          userImage: 'https://via.placeholder.com/100',
          image: 'https://via.placeholder.com/400',
          wayPoints: [[51.1366687,17.1539966],[51.1291876,17.14726]],
          route: [
            [
              17.153997,
              51.136669
            ],
            [
              17.153696,
              51.136692
            ],
            [
              17.153736,
              51.136473
            ],
            [
              17.153748,
              51.136297
            ],
            [
              17.153662,
              51.135728
            ],
            [
              17.153594,
              51.135378
            ],
            [
              17.153565,
              51.135314
            ],
            [
              17.153516,
              51.13525
            ],
            [
              17.153284,
              51.135006
            ],
            [
              17.153109,
              51.134851
            ],
            [
              17.152521,
              51.13439
            ],
            [
              17.152465,
              51.134317
            ],
            [
              17.152366,
              51.13414
            ],
            [
              17.152167,
              51.133664
            ],
            [
              17.152025,
              51.13323
            ],
            [
              17.151733,
              51.132645
            ],
            [
              17.151457,
              51.132125
            ],
            [
              17.151011,
              51.131388
            ],
            [
              17.150946,
              51.131244
            ],
            [
              17.151043,
              51.130964
            ],
            [
              17.151058,
              51.130832
            ],
            [
              17.150968,
              51.130478
            ],
            [
              17.150802,
              51.130043
            ],
            [
              17.150755,
              51.129965
            ],
            [
              17.150226,
              51.130124
            ],
            [
              17.148293,
              51.130653
            ],
            [
              17.147875,
              51.130048
            ],
            [
              17.14726,
              51.129188
            ]
          ],
        };
        console.error('Error fetching trip details:', error);
      }
    };

    const initializeMap = async () => {
      await fetchTripDetails()
      const map = L.map('map', {
        dragging: false,
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false
      }).setView([51.1079, 17.0385], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      if (trip.value?.route) {
        const latLngs = trip.value.route.map(cords => [cords[1], cords[0]]) as LatLngExpression[]
        console.log(latLngs)
        const polyline = L.polyline(latLngs, { color: 'blue' }).addTo(map);
        const wayPoints = trip.value.wayPoints as LatLngExpression[]
        wayPoints.forEach((waypoint) => {
          L.marker(waypoint).addTo(map);
        });
        map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      }
    };

    onMounted(() => {
      initializeMap();
    });

    return {
      trip,
    };
  },
});
</script>


<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.profile-picture-sm {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border: 2px solid #007bff;
  border-radius: 50%;
  margin-right: 10px;
}

.profile-username {
  font-size: 1.2rem;
}

.trip-details {
  margin: 20px 0;
}

.trip-cover {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

.leaflet-map {
  height: 400px;
  width: 100%;
  margin-top: 20px;
}
</style>
