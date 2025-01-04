<template>
  <div class="container mt-4">
    <!-- Hero Section -->
    <div class="text-center my-5">
      <h1 class="mt-3 display-4">Odkryj Dolny Śląsk jak nigdy dotąd</h1>
      <p class="lead text-muted">Łatwo planuj i dziel się trasami po przepięknym regionie Dolnego Śląska w Polsce</p>
      <a href="#" class="btn btn-primary btn-lg mt-4 me-3">Pobierz z App Store</a>
      <a href="#" class="btn btn-outline-secondary btn-lg mt-4">Pobierz z Google Play</a>
    </div>

    <!-- Features Section -->
    <div class="my-5">
      <h2 class="text-center text-primary mb-4">Dlaczego warto wybrać naszą aplikację?</h2>
      <div class="row">
        <div class="col-md-3 text-center mb-4" v-for="feature in features" :key="feature.title">
          <img :src="feature.icon" alt="Ikona funkcji" class="mb-3" />
          <h5 class="text-info">{{ feature.title }}</h5>
          <p class="text-muted">{{ feature.description }}</p>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="my-5">
      <h2 class="text-center text-primary mb-4">Jak to działa</h2>
      <div class="row">
        <div class="col-md-3 text-center mb-4" v-for="(step, index) in steps" :key="index">
          <h5 class="text-info">{{ step.number }}. {{ step.title }}</h5>
          <p class="text-muted">{{ step.description }}</p>
        </div>
      </div>
    </div>

    <!-- Testimonials Section -->
    <div class="my-5">
      <h2 class="text-center text-primary mb-4">Opinie użytkowników</h2>
      <div class="carousel slide" id="carouselExampleIndicators" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item" :class="{ active: index === 0 }" v-for="(testimonial, index) in testimonials" :key="index">
            <blockquote class="blockquote text-center">
              <p class="mb-0">{{ testimonial.quote }}</p>
              <footer class="blockquote-footer">{{ testimonial.author }}</footer>
            </blockquote>
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Poprzedni</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Następny</span>
        </button>
      </div>
    </div>

    <!-- Community Section -->
    <div class="my-5">
      <h2 class="text-center text-primary mb-4">Dołącz do naszej społeczności</h2>
      <p class="text-center text-muted">Zostań członkiem naszej rosnącej społeczności podróżników i odkrywców.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      features: [
        { icon: 'feature-1.png', title: 'Przyjazna nawigacja', description: 'Łatwo planuj swoje trasy dzięki intuicyjnemu interfejsowi.' },
        { icon: 'feature-2.png', title: 'Współdzielenie w czasie rzeczywistym', description: 'Dziel się swoimi planami podróży z przyjaciółmi i rodziną w każdej chwili.' },
        { icon: 'feature-3.png', title: 'Odkrywaj lokalne perełki', description: 'Znajdź ukryte miejsca i popularne atrakcje Dolnego Śląska.' },
        { icon: 'feature-4.png', title: 'Społeczność podróżników', description: 'Dołącz do społeczności podróżników dzielących się doświadczeniami i poradami.' }
      ],
      steps: [
        { number: 1, title: 'Pobierz aplikację', description: 'Rozpocznij, pobierając naszą aplikację z ulubionego sklepu.' },
        { number: 2, title: 'Zaplanuj swoją podróż', description: 'Użyj naszej interaktywnej mapy, aby wyznaczyć swoje cele.' },
        { number: 3, title: 'Dziel się swoimi trasami', description: 'Jednym dotknięciem podziel się swoimi planami podróży z innymi.' },
        { number: 4, title: 'Odkrywaj i nawiązuj kontakty', description: 'Rozpocznij swoją podróż i poznawaj innych w drodze.' }
      ],
      testimonials: [
        { quote: "Potężna zmiana dla odkrywania Dolnego Śląska z przyjaciółmi!", author: "Anna S." },
        { quote: "Łatwa w użyciu i niesamowicie pomocna przy planowaniu podróży.", author: "Tomasz K." }
      ]
    };
  }
}
</script>

<style scoped>
h1, h2 {
  font-size: 2.5rem;
  color: #007bff;
}

.lead {
  font-size: 1.25rem;
}

h5 {
  font-size: 1.25rem;
}

.text-muted {
  font-size: 0.9rem;
}

.carousel-inner {
  text-align: center;
}

blockquote {
  font-size: 1.1rem;
  color: #666;
}

blockquote-footer {
  color: #999;
}
</style>
