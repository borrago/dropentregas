<template>
  <div class="vehicles-page">
    <div class="page-header">
      <h1 class="page-title">Escolha seu veículo</h1>
      <p class="page-subtitle">Selecione o tipo de veículo para sua entrega</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Carregando veículos...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadVehicles" class="btn-retry">Tentar novamente</button>
    </div>

    <div v-else class="vehicles-grid">
      <div v-for="vehicle in vehicles" :key="vehicle.id" class="vehicle-card">
        <div class="vehicle-icon">🚗</div>
        <h3 class="vehicle-name">{{ vehicle.name }}</h3>
        <div class="vehicle-price">R$ {{ vehicle.basePrice.toFixed(2) }}</div>
        <p class="vehicle-description">{{ getVehicleDescription(vehicle.name) }}</p>
        <button @click="addToCart(vehicle)" class="btn-add-cart">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>

    <div v-if="vehicles.length > 0" class="cart-summary">
      <div class="summary-content">
        <div class="summary-info">
          <h3>{{ cartStore.totalItems }} itens no carrinho</h3>
          <p>Total: R$ {{ cartStore.subtotal.toFixed(2) }}</p>
        </div>
        <router-link to="/cart" class="btn-view-cart">
          Ver Carrinho
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart.js'
import { apiVehicles } from '../services/api.js'

const cartStore = useCartStore()

const vehicles = ref([])
const loading = ref(false)
const error = ref(null)

const getVehicleDescription = (vehicleName) => {
  const descriptions = {
    'Moto': 'Ideal para entregas rápidas na cidade',
    'Carro': 'Perfeito para entregas médias e seguras',
    'Van': 'Ótimo para cargas maiores',
    'Caminhão': 'Ideal para cargas pesadas e volumosas',
    'Ônibus': 'Para transportes especiais e grandes volumes'
  }
  return descriptions[vehicleName] || 'Veículo para entregas'
}

const loadVehicles = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await apiVehicles()
    if (response.success) {
      vehicles.value = response.data
    }
  } catch (err) {
    error.value = err.message || 'Erro ao carregar veículos'
  } finally {
    loading.value = false
  }
}

const addToCart = (vehicle) => {
  cartStore.addItem(vehicle)
  // Show a brief success message (you could add a toast notification here)
}

onMounted(() => {
  loadVehicles()
})
</script>

<style scoped>
.vehicles-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
}

.loading, .error {
  text-align: center;
  padding: 4rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error p {
  color: #dc2626;
  margin-bottom: 1rem;
}

.btn-retry {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.btn-retry:hover {
  background-color: #2563eb;
}

.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.vehicle-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.vehicle-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.vehicle-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.vehicle-price {
  font-size: 2rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 1rem;
}

.vehicle-description {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.btn-add-cart {
  width: 100%;
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-add-cart:hover {
  background-color: #2563eb;
}

.cart-summary {
  position: sticky;
  bottom: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.summary-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-info h3 {
  margin: 0 0 0.25rem 0;
  color: #1f2937;
  font-size: 1.125rem;
}

.summary-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.btn-view-cart {
  background-color: #3b82f6;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-view-cart:hover {
  background-color: #2563eb;
}

@media (max-width: 768px) {
  .vehicles-page {
    padding: 1rem;
  }
  
  .vehicles-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .summary-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .btn-view-cart {
    width: 100%;
  }
}
</style>


