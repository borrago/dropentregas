<template>
  <div class="orders-page">
    <div class="page-header">
      <h1 class="page-title">Meus Pedidos</h1>
      <p class="page-subtitle">Acompanhe seus pedidos de entrega</p>
    </div>

    <div v-if="!authStore.isAuthenticated" class="auth-required">
      <div class="auth-card">
        <div class="auth-icon">🔒</div>
        <h2>Login necessário</h2>
        <p>Faça login para visualizar seus pedidos</p>
        <div class="auth-buttons">
          <router-link to="/login" class="btn-login">Fazer Login</router-link>
          <router-link to="/register" class="btn-register">Cadastrar</router-link>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Carregando pedidos...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadOrders" class="btn-retry">Tentar novamente</button>
    </div>

    <div v-else-if="orders.length === 0" class="empty-orders">
      <div class="empty-icon">📦</div>
      <h2>Nenhum pedido encontrado</h2>
      <p>Você ainda não fez nenhum pedido</p>
      <router-link to="/vehicles" class="btn-primary">Fazer Primeiro Pedido</router-link>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-info">
            <h3>Pedido #{{ order.id }}</h3>
            <p class="order-date">{{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="order-total">R$ {{ order.total.toFixed(2) }}</div>
        </div>

        <div class="order-content">
          <div class="delivery-info">
            <h4>Informações de Entrega</h4>
            <div class="delivery-details">
              <div class="delivery-item">
                <span class="label">Origem:</span>
                <span>{{ order.origin }}</span>
              </div>
              <div class="delivery-item">
                <span class="label">Destino:</span>
                <span>{{ order.destination }}</span>
              </div>
            </div>
          </div>

          <div class="order-items">
            <h4>Itens do Pedido</h4>
            <div class="items-list">
              <div v-for="item in order.items" :key="item.id" class="order-item">
                <div class="item-icon">🚗</div>
                <div class="item-details">
                  <span class="item-name">{{ item.vehicle?.name || 'Veículo' }}</span>
                  <span class="item-quantity">Quantidade: {{ item.qty }}</span>
                </div>
                <div class="item-price">R$ {{ item.lineTotal.toFixed(2) }}</div>
              </div>
            </div>
          </div>

          <div class="order-summary">
            <div class="summary-line">
              <span>Subtotal:</span>
              <span>R$ {{ order.subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="order.discount > 0" class="summary-line discount">
              <span>Desconto:</span>
              <span>-R$ {{ order.discount.toFixed(2) }}</span>
            </div>
            <div class="summary-line total">
              <span>Total:</span>
              <span>R$ {{ order.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { apiMyOrders } from '../services/api.js'

const authStore = useAuthStore()

const orders = ref([])
const loading = ref(false)
const error = ref(null)

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

const loadOrders = async () => {
  if (!authStore.isAuthenticated) return

  try {
    loading.value = true
    error.value = null

    const response = await apiMyOrders()
    if (response.success) {
      orders.value = response.data
    }
  } catch (err) {
    error.value = err.message || 'Erro ao carregar pedidos'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    loadOrders()
  }
})
</script>

<style scoped>
.orders-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
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

.auth-required, .loading, .error, .empty-orders {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.auth-card, .empty-orders {
  text-align: center;
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

.auth-icon, .empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.auth-card h2, .empty-orders h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.auth-card p, .empty-orders p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-login, .btn-register, .btn-primary {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
}

.btn-login {
  background-color: #3b82f6;
  color: white;
}

.btn-login:hover {
  background-color: #2563eb;
}

.btn-register {
  background-color: #6b7280;
  color: white;
}

.btn-register:hover {
  background-color: #4b5563;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
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

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.order-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.order-header {
  background: #f8fafc;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.order-info h3 {
  margin: 0 0 0.25rem 0;
  color: #1f2937;
  font-size: 1.25rem;
}

.order-date {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.order-total {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.order-content {
  padding: 1.5rem;
}

.delivery-info, .order-items {
  margin-bottom: 1.5rem;
}

.delivery-info h4, .order-items h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.delivery-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.delivery-item {
  display: flex;
  gap: 0.5rem;
}

.label {
  font-weight: 500;
  color: #6b7280;
  min-width: 60px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.item-icon {
  font-size: 1.5rem;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  font-weight: 500;
  color: #1f2937;
}

.item-quantity {
  font-size: 0.875rem;
  color: #6b7280;
}

.item-price {
  font-weight: 600;
  color: #1f2937;
}

.order-summary {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.summary-line.discount {
  color: #059669;
}

.summary-line.total {
  font-weight: 600;
  font-size: 1.125rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .orders-page {
    padding: 1rem;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .order-total {
    font-size: 1.25rem;
  }
  
  .delivery-details {
    gap: 0.75rem;
  }
  
  .delivery-item {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .label {
    min-width: auto;
  }
  
  .order-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .item-price {
    align-self: flex-end;
  }
}
</style>


