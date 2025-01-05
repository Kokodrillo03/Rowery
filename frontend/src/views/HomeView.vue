<template>
  <div class="container mt-4">
    <!-- Hero Section -->
    <div class="text-center my-5">
      <h1 class="mt-3 display-4">Odkryj Dolny Śląsk jak nigdy dotąd</h1>
      <p class="lead">Łatwo planuj i dziel się trasami po przepięknym regionie Dolnego Śląska w Polsce</p>
    </div>

    <!-- Features Section -->
    <div class="my-5">
      <h2 class="text-center mb-4">Dlaczego warto wybrać naszą aplikację?</h2>
      <div class="row">
        <div class="col-md-3 mb-4" v-for="feature in features" :key="feature.title">
          <div class="feature-card p-3 h-100 d-flex flex-column justify-content-center align-items-center text-center">
            <h5>{{ feature.title }}</h5>
            <p class="text-muted">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="my-5">
      <h2 class="text-center mb-4">Jak to działa</h2>
      <div class="row">
        <div class="col-md-3 mb-4" v-for="(step, index) in steps" :key="index">
          <div class="step-card p-3 h-100 d-flex flex-column justify-content-center align-items-center text-center">
            <h5>{{ step.number }}. {{ step.title }}</h5>
            <p class="text-muted">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Community Section -->
    <div class="my-5">
      <h2 class="text-center mb-4">Dołącz do naszej społeczności</h2>
      <p class="text-center">Zostań członkiem naszej rosnącej społeczności podróżników i odkrywców.</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
  setup() {
    return {
      features: [
        { title: 'Przyjazna nawigacja', description: 'Łatwo planuj swoje trasy dzięki intuicyjnemu interfejsowi.' },
        { title: 'Współdzielenie w czasie rzeczywistym', description: 'Dziel się swoimi planami podróży z przyjaciółmi i rodziną w każdej chwili.' },
        { title: 'Odkrywaj lokalne perełki', description: 'Znajdź ukryte miejsca i popularne atrakcje Dolnego Śląska.' },
        { title: 'Społeczność podróżników', description: 'Dołącz do społeczności podróżników dzielących się doświadczeniami i poradami.' }
      ],
      steps: [
        { number: 1, title: 'Rozpocznij planowanie', description: 'Otwórz aplikację w swojej przeglądarce i zacznij planować podróż.' },
        { number: 2, title: 'Zaplanuj swoją podróż', description: 'Użyj naszej interaktywnej mapy, aby wyznaczyć swoje cele.' },
        { number: 3, title: 'Dziel się swoimi trasami', description: 'Jednym dotknięciem podziel się swoimi planami podróży z innymi.' },
        { number: 4, title: 'Odkrywaj i nawiązuj kontakty', description: 'Rozpocznij swoją podróż i poznawaj innych w drodze.' }
      ]
    };
  }
});
</script>

<style scoped>
h1, h2, h5, p {
  color: #000;
}

.lead {
  font-size: 1.25rem;
}

.text-muted {
  font-size: 0.9rem;
}

.feature-card, .step-card {
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
