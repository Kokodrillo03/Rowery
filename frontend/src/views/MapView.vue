<template>
  <div class="map-container">
    <div class="controls">
      <div class="form-group">
        <!-- Start and End Destinations -->
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

        <!-- Add Waypoint Button -->
        <div class="mt-2 mb-2 text-center">
          <button class="btn btn-secondary" @click="addWaypoint">Dodaj Przystanek</button>
        </div>

        <!-- Search Route and Bike Type Selection -->
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

        <!-- Share Route Button -->
        <div v-if="isRouteDisplayed" class="text-center mt-2 mb-2">
          <button class="btn btn-info" @click="openShareDialog">Udostępnij trasę</button>
        </div>

        <!-- Share Route Dialog -->
        <div v-if="showShareDialog" class="modal">
          <div class="modal-content">
            <h3>Udostępnij trasę</h3>
            <form @submit.prevent="shareRoute">
              <div class="mb-3">
                <input
                  type="text"
                  v-model="routeTitle"
                  placeholder="Title"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <textarea
                  v-model="routeDescription"
                  placeholder="Description"
                  class="form-control"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <input
                  type="file"
                  @change="onImageChange"
                  accept="image/*"
                  class="form-control"
                />
              </div>
              <div v-if="imagePreview" class="mb-3">
                <img :src="imagePreview" alt="Image Preview" class="img-fluid" />
              </div>
              <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-secondary me-2" @click="closeShareDialog">Anuluj</button>
                <button type="submit" class="btn btn-primary">Udostępnij</button>
              </div>
            </form>
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
import { useAuth0 } from '@auth0/auth0-vue'


export default defineComponent({
  name: 'MapView',
  setup() {
    const mapRef = ref<L.Map | null>(null);
    const fromDestination = ref<string>('');
    const toDestination = ref<string>('');
    const waypoints = ref<string[]>([]);
    const selectedBikeType = ref<string>('Szosowy');
    const bikeTypes = ref<string[]>(['Szosowy', 'Gorski', 'Trekkingowy']);
    const bikeImages = ref<{ [key: string]: string }>({
      Szosowy: roadBikeImage,
      Gorski: mountainBikeImage,
      Trekkingowy: trekkingBikeImage,
    });
    let map: L.Map;
    let routeLayers: L.LayerGroup;
    let routeCoordinates: [number, number][] = [];
    let allLatLon: { lat: number; lng: number }[] = [];

    const {  isAuthenticated, user, getAccessTokenSilently } = useAuth0();

    const isRouteDisplayed = ref<boolean>(false);
    const showShareDialog = ref<boolean>(false);
    const routeTitle = ref<string>('');
    const routeDescription = ref<string>('');
    const coverImage = ref<File | null>(null);
    const imagePreview = ref<string | null>(null);

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
        if(!fromDestination.value || !toDestination.value) {
          alert('Podaj miejsce początkowe i końcowe');
          return;
        }
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

        allLatLon = [
          fromLatLng,
          ...waypointLatLngs.filter((latLng) => !!latLng),
          toLatLng,
        ];

        if (allLatLon.length < 2) {
          alert('Trasa nie znaleziono');
          return;
        }

        const wayPoints = allLatLon.filter(latLng => !!latLng).map(
          (latLng) => `${latLng.lat},${latLng.lng}`,
        );

        const config = {
          params: {
            waypoints: wayPoints.join(';'),
            bikeType: selectedBikeType.value,
          },
        };

        const routeResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/routing`,
          config,
        );

        const routeData = routeResponse.data;

        if (routeData) {
          routeCoordinates = routeData.points.coordinates.map(
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
          isRouteDisplayed.value = true; // This flag is set when a route is displayed
        } else {
          alert('Trasa nie znaleziono');
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        alert('Wystąpił błąd podczas wyszukiwania trasy');
      }
    };

    const addWaypoint = () => {
      if (waypoints.value.length >= 5) {
        alert('Maksymalna liczba przystanków to 5');
        return;
      }
      waypoints.value.push('');
    };

    const removeWaypoint = (index: number) => {
      waypoints.value.splice(index, 1);
    };

    const openShareDialog = () => {
      if(!isAuthenticated.value) {
        alert('Zaloguj się, aby udostępnić trasę');
        return;
      }
      showShareDialog.value = true;
    };

    const closeShareDialog = () => {
      showShareDialog.value = false;
      clearDialog();
    };

    const onImageChange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0] || null;
      if (file) {
        coverImage.value = file;
        imagePreview.value = URL.createObjectURL(file);
      }
    };

    const shareRoute = async () => {
      try {
        if (!coverImage.value) {
          alert('Please select an image to upload.');
          return;
        }

        const tripDto = {
          title: routeTitle.value,
          description: routeDescription.value,
          userId: user.value?.sub,
          username: user.value?.name,
          userImage: user.value?.picture,
          wayPoints: allLatLon.map(latLon => [latLon.lat, latLon.lng]),
          route: routeCoordinates
        };

        const token = await getAccessTokenSilently();

        const { data } = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/trip`,
          tripDto,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const uploadUrl = data.uploadUrl;
        await axios.put(uploadUrl, coverImage.value, {
          headers: {
            'Content-Type': coverImage.value.type,
          },
        });

        alert('Trasa została pomyślnie udostępniona.');
      } catch (error) {
        console.error('Error sharing route:', error);
        alert('Wystąpił błąd podczas udostępniania trasy');
      } finally {
        // Close the dialog irrespective of success or failure
        closeShareDialog();
      }
    };

    const clearDialog = () => {
      routeTitle.value = '';
      routeDescription.value = '';
      coverImage.value = null;
      imagePreview.value = null;
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
      isRouteDisplayed,
      showShareDialog,
      routeTitle,
      routeDescription,
      openShareDialog,
      closeShareDialog,
      onImageChange,
      shareRoute,
      imagePreview,
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
  right: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 15px;
  border-radius: 8px;
  z-index: 1000;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

button.active {
  border: 2px solid #0056b3;
}

.form-group > .row {
  margin-bottom: 10px;
}
</style>
