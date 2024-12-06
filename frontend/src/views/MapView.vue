<template>
  <div class="map-container">
    <div class="controls">
      <div class="row g-2 align-items-center">
        <div class="col">
          <input
            type="text"
            v-model="fromDestination"
            placeholder="From"
            class="form-control"
          />
        </div>
        <div class="col">
          <input
            type="text"
            v-model="toDestination"
            placeholder="To"
            class="form-control"
          />
        </div>
        <div class="col-auto">
          <button class="btn btn-primary" @click="searchRoute">Get Route</button>
        </div>
      </div>
    </div>
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import L, { Map, TileLayer, Marker, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default defineComponent({
  name: 'MapView',
  setup() {
    const mapContainer = ref<HTMLDivElement | null>(null);
    const map = ref<Map | null>(null);
    const fromDestination = ref<string>('');
    const toDestination = ref<string>('');
    const fromMarker = ref<Marker | null>(null);
    const toMarker = ref<Marker | null>(null);

    const initializeMap = () => {
      if (mapContainer.value) {
        map.value = L.map(mapContainer.value).setView([51.505, -0.09], 13);
        const tileLayer: TileLayer = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        );
        tileLayer.addTo(map.value);
      }
    };

    const searchDestination = async (destination: string, isFrom: boolean) => {
      console.log(destination);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          destination
        )}&format=json`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const coords = [parseFloat(lat), parseFloat(lon)];

        if (isFrom) {
          if (fromMarker.value) {
            fromMarker.value.setLatLng(coords);
          } else {
            fromMarker.value = L.marker(coords)
              .addTo(map.value!)
              .bindPopup(destination);
          }
        } else {
          if (toMarker.value) {
            toMarker.value.setLatLng(coords);
          } else {
            toMarker.value = L.marker(coords)
              .addTo(map.value!)
              .bindPopup(destination);
          }
        }
      } else {
        alert('Location not found');
      }
    };

    const updateMarkers = () => {
      if (fromDestination.value) {
        searchDestination(fromDestination.value, true);
      } else {
        if (fromMarker.value) {
          map.value?.removeLayer(fromMarker.value);
          fromMarker.value = null;
        }
      }
      if (toDestination.value) {
        searchDestination(toDestination.value, false);
      } else {
        if (toMarker.value) {
          map.value?.removeLayer(toMarker.value);
          toMarker.value = null;
        }
      }

      if (fromMarker.value && toMarker.value) {
        const bounds = new LatLngBounds(fromMarker.value.getLatLng(), toMarker.value.getLatLng());
        map.value?.fitBounds(bounds, { padding: [50, 50] });
      }
    };

    const searchRoute = () => {
      updateMarkers();
    };

    onMounted(() => {
      initializeMap();
    });

    return {
      mapContainer,
      fromDestination,
      toDestination,
      searchRoute,
      updateMarkers,
    };
  },
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

#map {
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  padding: 15px;
  border-radius: 8px;
  z-index: 1000;
}
</style>
