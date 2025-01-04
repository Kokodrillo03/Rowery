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
        <div class="col-auto">
          <select v-model="selectedBikeType" class="form-control">
            <option v-for="(type, index) in bikeTypes" :key="index" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div id="map"></div>
  </div>
</template>


<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import * as L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css'
import {LatLngExpression} from "leaflet";


export default defineComponent({
  name: 'MapView',
  setup() {
    const mapRef = ref<L.Map | null>(null);
    const fromDestination = ref<string>('');
    const toDestination = ref<string>('');
    const selectedBikeType = ref<string>('road'); // Default bike type
    const bikeTypes = ref<string[]>(['road', 'mountain', 'trekking']); // Available bike types

    let map: L.Map;
    let routeLayers: L.LayerGroup;

    const initializeMap = () => {
      map = L.map('map').setView([51.1079, 17.0385], 10);
      mapRef.value = map;
      const tileLayer: L.TileLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      );
      tileLayer.addTo(map);
    };

    const searchRoute = async () => {
      try {
        const fromResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: fromDestination.value,
              format: 'json',
            },
          }
        );

        if (!fromResponse.data.length) {
          alert('From location not found');
          return;
        }
        const fromLatLng = {
          lat: parseFloat(fromResponse.data[0].lat),
          lng: parseFloat(fromResponse.data[0].lon),
        };

        const toResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: toDestination.value,
              format: 'json',
            },
          }
        );

        if (!toResponse.data.length) {
          alert('To location not found');
          return;
        }
        const toLatLng = {
          lat: parseFloat(toResponse.data[0].lat),
          lng: parseFloat(toResponse.data[0].lon),
        };
        const wayPoints = [
          `${fromLatLng.lat},${fromLatLng.lng}`,
          `${toLatLng.lat},${toLatLng.lng}`,
        ]
        const config = {
          params: {
            from: `${fromLatLng.lat},${fromLatLng.lng}`,
            to: `${toLatLng.lat},${toLatLng.lng}`,
            bikeType: selectedBikeType.value,
          },
        };

        console.log(config)

        const routeResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/routing`,
          config
        );

        const routeData = routeResponse.data;
        console.log(routeData);
        if (routeData) {
          const routeCoordinates = routeData.points.coordinates.map(
            (coord: number[]) => [coord[1], coord[0]]
          )
          if (routeLayers) {
            routeLayers.clearLayers();
          }
          const polyline = L.polyline(routeCoordinates, { color: 'blue' });
          const startCords = routeCoordinates[0] as LatLngExpression;
          const endCords = routeCoordinates[routeCoordinates.length - 1] as LatLngExpression;
          const startMarker = L.marker(startCords);
          const endMarker = L.marker(endCords);
          L.Icon.Default.imagePath='src/assets/'
          routeLayers = L.layerGroup([polyline, startMarker, endMarker]).addTo(map);
          map.fitBounds(polyline.getBounds());
        } else {
          alert('Route not found');
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        alert('An error occurred while searching for the route');
      }
    };

    onMounted(() => {
      initializeMap();
    });

    return {
      fromDestination,
      toDestination,
      searchRoute,
      selectedBikeType,
      bikeTypes,
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
