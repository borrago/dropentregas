<template>
  <div class="dashboard">
    <!-- Welcome Section -->
    <div class="welcome-section">
      <h1 class="welcome-title">
        Bem-vindo, {{ authStore.user?.name }}! 👋
      </h1>
      <p class="welcome-subtitle">
        Gerencie suas entregas e acompanhe seus pedidos
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🚚</div>
        <div class="stat-content">
          <h3 class="stat-number">{{ orders.length }}</h3>
          <p class="stat-label">Pedidos Realizados</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🛒</div>
        <div class="stat-content">
          <h3 class="stat-number">{{ cartStore.totalItems }}</h3>
          <p class="stat-label">Itens no Carrinho</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🚗</div>
        <div class="stat-content">
          <h3 class="stat-number">{{ vehicles.length }}</h3>
          <p class="stat-label">Veículos Disponíveis</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3 class="stat-number">R$ {{ totalSpent.toFixed(2) }}</h3>
          <p class="stat-label">Total Gasto</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h2 class="section-title">Ações Rápidas</h2>
      <div class="actions-grid">
        <router-link to="/vehicles" class="action-card">
          <div class="action-icon">🚗</div>
          <h3>Ver Veículos</h3>
          <p>Escolha o tipo de veículo para sua entrega</p>
        </router-link>
        
        <router-link to="/cart" class="action-card">
          <div class="action-icon">🛒</div>
          <h3>Meu Carrinho</h3>
          <p>Visualize e gerencie seus itens</p>
        </router-link>
        
        <router-link to="/orders" class="action-card">
          <div class="action-icon">📋</div>
          <h3>Meus Pedidos</h3>
          <p>Acompanhe o histórico de pedidos</p>
        </router-link>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="recent-orders">
      <div class="section-header">
        <h2 class="section-title">Pedidos Recentes</h2>
        <router-link to="/orders" class="view-all-link">Ver Todos</router-link>
      </div>
      
      <div v-if="loadingOrders" class="loading">
        <div class="spinner"></div>
        <p>Carregando pedidos...</p>
      </div>
      
      <div v-else-if="ordersError" class="error">
        <p>{{ ordersError }}</p>
        <button @click="loadOrders" class="btn-retry">Tentar novamente</button>
      </div>
      
      <div v-else-if="recentOrders.length > 0" class="orders-list">
        <div v-for="order in recentOrders" :key="order.id" class="order-item">
          <div class="order-info">
            <h4>Pedido #{{ order.id }}</h4>
            <p>{{ order.origin }} → {{ order.destination }}</p>
            <span class="order-date">{{ formatDate(order.createdAt) }}</span>
          </div>
          <div class="order-total">
            R$ {{ order.total.toFixed(2) }}
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>Nenhum pedido encontrado</h3>
        <p>Faça seu primeiro pedido!</p>
        <router-link to="/vehicles" class="btn-primary">Fazer Pedido</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useCartStore } from '../stores/cart.js'
import { apiVehicles, apiMyOrders } from '../services/api.js'

const authStore = useAuthStore()
const cartStore = useCartStore()

const vehicles = ref([])
const orders = ref([])
const loadingOrders = ref(false)
const ordersError = ref(null)

const recentOrders = computed(() => orders.value.slice(0, 3)) // Show up to 3 recent orders

const totalSpent = computed(() => {
  return orders.value.reduce((total, order) => total + order.total, 0)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadVehicles = async () => {
  try {
    const response = await apiVehicles()
    if (response.success) {
      vehicles.value = response.data
    }
  } catch (error) {
    console.error('Error loading vehicles:', error)
  }
}

const loadOrders = async () => {
  if (!authStore.isAuthenticated) {
    orders.value = []
    return
  }
  
  loadingOrders.value = true
  ordersError.value = null
  
  try {
    const response = await apiMyOrders()
    if (response.success) {
      orders.value = response.data
    } else {
      throw new Error(response.message || 'Erro ao carregar pedidos')
    }
  } catch (err) {
    ordersError.value = err.message
  } finally {
    loadingOrders.value = false
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    window.location.href = '/login'
  } else {
    loadVehicles()
    loadOrders()
  }
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.welcome-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.stat-label {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.quick-actions {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.action-card p {
  color: #6b7280;
  margin: 0;
}

.recent-orders {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-all-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.view-all-link:hover {
  text-decoration: underline;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 3rem 0;
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
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-retry:hover {
  background-color: #2563eb;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.order-info h4 {
  margin: 0 0 0.25rem 0;
  color: #1f2937;
}

.order-info p {
  margin: 0 0 0.25rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.order-date {
  color: #9ca3af;
  font-size: 0.75rem;
}

.order-total {
  font-weight: 600;
  color: #1f2937;
  font-size: 1.125rem;
}

.empty-state {
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  display: inline-block;
}

.btn-primary:hover {
  background-color: #2563eb;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .order-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>


