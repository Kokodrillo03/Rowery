<template>
  <div>
    <h1>Trip Details</h1>
    <p>Trip ID: {{ tripId }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SingleTripView',
  props: {
    tripId: {
      type: Number,
      required: true,
    },
  },
});
</script>
