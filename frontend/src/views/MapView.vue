<template>
  <div class="map-container">
    <div class="controls">
      <div class="form-group">
        <div class="row g-2 align-items-center">
          <div class="col">
            <input
              type="text"
              v-model="fromDestination"
              placeholder="Start"
              class="form-control"
            />
          </div>
          <div class="col">
            <input
              type="text"
              v-model="toDestination"
              placeholder="Koniec"
              class="form-control"
            />
          </div>
        </div>
        <div class="row g-2 align-items-center" v-for="(waypoint, index) in waypoints" :key="index">
          <div class="col">
            <input
              type="text"
              v-model="waypoints[index]"
              :placeholder="'Przystanek ' + (index + 1)"
              class="form-control"
            />
          </div>
          <div class="col-auto">
            <button class="btn btn-danger" @click="removeWaypoint(index)">Usuń</button>
          </div>
        </div>
        <div class="mt-2 mb-2 text-center">
          <button class="btn btn-secondary" @click="addWaypoint">Dodaj Przystanek</button>
        </div>
        <div class="row g-2 align-items-center">
          <div class="col-auto">
            <button class="btn btn-primary" @click="searchRoute">Wyszukaj Trasę</button>
          </div>
          <div class="col">
            <div class="d-flex justify-content-around">
              <div v-for="(type, index) in bikeTypes" :key="index" class="text-center">
                <button
                  @click="selectedBikeType = type"
                  :class="{'btn': true, active: selectedBikeType === type}"
                >
                  <img :src="bikeImages[type]" :alt="type" height="40" />
                  <br />
                  {{ type }}
                </button>
              </div>
            </div>
          </div>
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
import 'leaflet/dist/leaflet.css';
import roadBikeImage from '@/assets/roadBike.png';
import mountainBikeImage from '@/assets/mountainBike.png';
import trekkingBikeImage from '@/assets/normalBike.png';


export default defineComponent({
  name: 'MapView',
  setup() {
    const mapRef = ref<L.Map | null>(null);
    const fromDestination = ref<string>('');
    const toDestination = ref<string>('');
    const waypoints = ref<string[]>([]);
    const selectedBikeType = ref<string>('road'); // Default bike type
    const bikeTypes = ref<string[]>(['Szosowy', 'Gorski', 'Trekkingowy']); // Available bike types
    const bikeImages = ref<{ [key: string]: string }>({
      Szosowy: roadBikeImage, // Update these paths to actual image paths
      Gorski: mountainBikeImage,
      Trekkingowy: trekkingBikeImage,
    });
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
        },
      );
      tileLayer.addTo(map);
    };

    const searchRoute = async () => {
      try {
        const fromResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: fromDestination.value,
            format: 'json',
          },
        });

        // Handle "from" location
        if (!fromResponse.data.length) {
          alert('Miejsce początkowe nie znalezione');
          return;
        }
        const fromLatLng = {
          lat: parseFloat(fromResponse.data[0].lat),
          lng: parseFloat(fromResponse.data[0].lon),
        };

        // Handle "to" location
        const toResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: toDestination.value,
            format: 'json',
          },
        });

        if (!toResponse.data.length) {
          alert('Miejsce docelowe nie znalezione');
          return;
        }
        const toLatLng = {
          lat: parseFloat(toResponse.data[0].lat),
          lng: parseFloat(toResponse.data[0].lon),
        };

        // Handle waypoints
        const waypointLatLngs = await Promise.all(
          waypoints.value.map(async (waypoint) => {
            const waypointResponse = await axios.get(
              `https://nominatim.openstreetmap.org/search`,
              {
                params: {
                  q: waypoint,
                  format: 'json',
                },
              },
            );
            if (waypointResponse.data.length) {
              return {
                lat: parseFloat(waypointResponse.data[0].lat),
                lng: parseFloat(waypointResponse.data[0].lon),
              };
            }
            alert(`${waypoint} nie znalezione`);
            return null;
          }),
        );

        // Compile all coordinates
        const allLatLon = [
          fromLatLng,
          ...waypointLatLngs.filter(Boolean),
          toLatLng,
        ];

        if (allLatLon.length < 2) {
          alert('Trasa nie znaleziono');
          return;
        }

        // Formulate request to the routing backend
        const wayPoints = allLatLon.filter(latLng => !!latLng).map(
          (latLng) => `${latLng.lat},${latLng.lng}`,
        );

        const config = {
          params: {
            waypoints: wayPoints,
            bikeType: selectedBikeType.value,
          },
        };

        const routeResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/routing`,
          config,
        );

        // Process and display route data
        const routeData = routeResponse.data;

        if (routeData) {
          const routeCoordinates = routeData.points.coordinates.map(
            (coord: number[]) => [coord[1], coord[0]],
          );
          if (routeLayers) {
            routeLayers.clearLayers();
          }
          const polyline = L.polyline(routeCoordinates, { color: 'blue' });
          const wayPointMarkers = allLatLon
            .filter((coord) => !!coord)
            .map((coord) => L.marker([coord.lat, coord.lng]));
          routeLayers = L.layerGroup([polyline, ...wayPointMarkers]).addTo(map);
          map.fitBounds(polyline.getBounds());
        } else {
          alert('Trasa nie znaleziono');
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        alert('Wystąpił błąd podczas wyszukiwania trasy');
      }
    };

    // Add and remove waypoint handlers
    const addWaypoint = () => {
      waypoints.value.push('');
    };

    const removeWaypoint = (index: number) => {
      waypoints.value.splice(index, 1);
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
      bikeImages,
      waypoints,
      addWaypoint,
      removeWaypoint,
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
  right: 10px; /* Move the controls to the right side */
  background-color: rgba(255, 255, 255, 0.7);
  padding: 15px;
  border-radius: 8px;
  z-index: 1000;
}

button.active {
  border: 2px solid #0056b3;
}

.form-group > .row {
  margin-bottom: 10px; /* Adjust this value for more or less spacing */
}
</style>

