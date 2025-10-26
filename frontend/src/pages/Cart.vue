<template>
  <div class="cart-page">
    <div class="page-header">
      <h1 class="page-title">Carrinho de Compras</h1>
      <p v-if="cartStore.items.length === 0" class="page-subtitle">Seu carrinho está vazio</p>
    </div>

    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <div class="empty-icon">🛒</div>
      <h2>Nenhum item no carrinho</h2>
      <p>Adicione alguns veículos para continuar</p>
      <router-link to="/vehicles" class="btn-primary">Ver Veículos</router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <h2>Itens do Carrinho</h2>
        <div class="items-list">
          <div v-for="item in cartStore.items" :key="item.vehicleId" class="cart-item">
            <div class="item-info">
              <div class="item-icon">🚗</div>
              <div class="item-details">
                <h3>{{ item.vehicleName }}</h3>
                <p>R$ {{ item.basePrice.toFixed(2) }} cada</p>
              </div>
            </div>
            
            <div class="item-controls">
              <button @click="updateQuantity(item.vehicleId, item.qty - 1)" 
                      :disabled="item.qty <= 1" 
                      class="btn-quantity">-</button>
              <span class="quantity">{{ item.qty }}</span>
              <button @click="updateQuantity(item.vehicleId, item.qty + 1)" 
                      class="btn-quantity">+</button>
              <button @click="removeItem(item.vehicleId)" 
                      class="btn-remove">🗑️</button>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-summary">
        <h2>Resumo do Pedido</h2>
        
        <div class="coupon-section">
          <h3>Cupom de Desconto</h3>
          <div class="coupon-input">
            <input v-model="couponCode" 
                   placeholder="Digite o código do cupom" 
                   class="form-input" />
            <button @click="applyCoupon" 
                    :disabled="!couponCode.trim()" 
                    class="btn-apply">Aplicar</button>
          </div>
          <div v-if="cartStore.pricing?.coupon" class="applied-coupon">
            <span>Cupom: {{ cartStore.pricing.coupon.code }}</span>
            <button @click="removeCoupon" class="btn-remove-coupon">×</button>
          </div>
        </div>

        <div class="delivery-info">
          <h3>Informações de Entrega</h3>
          <input v-model="origin" 
                 placeholder="Endereço de origem" 
                 class="form-input" />
          <input v-model="destination" 
                 placeholder="Endereço de destino" 
                 class="form-input" />
        </div>

        <div class="pricing-summary">
          <div class="price-line">
            <span>Subtotal:</span>
            <span>R$ {{ (cartStore.pricing?.subtotal || cartStore.subtotal).toFixed(2) }}</span>
          </div>
          <div v-if="cartStore.pricing?.discount > 0" class="price-line discount">
            <span>Desconto:</span>
            <span>-R$ {{ cartStore.pricing.discount.toFixed(2) }}</span>
          </div>
          <div class="price-line total">
            <span>Total:</span>
            <span>R$ {{ (cartStore.pricing?.total || cartStore.subtotal).toFixed(2) }}</span>
          </div>
        </div>

        <button @click="checkout" 
                :disabled="!canCheckout" 
                class="btn-checkout">
          Finalizar Pedido
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart.js'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const couponCode = ref('')
const origin = ref('')
const destination = ref('')

const canCheckout = computed(() => {
  return cartStore.items.length > 0 && 
         origin.value.trim() && 
         destination.value.trim() && 
         authStore.isAuthenticated
})

const updateQuantity = (vehicleId, qty) => {
  cartStore.updateQuantity(vehicleId, qty)
  if (cartStore.items.length > 0) {
    cartStore.calculatePrice()
  }
}

const removeItem = (vehicleId) => {
  cartStore.removeItem(vehicleId)
  if (cartStore.items.length > 0) {
    cartStore.calculatePrice()
  }
}

const applyCoupon = () => {
  cartStore.setCoupon(couponCode.value.trim())
  couponCode.value = ''
}

const removeCoupon = () => {
  cartStore.setCoupon('')
}

const checkout = async () => {
  if (!canCheckout.value) return

  try {
    await cartStore.createOrder({
      items: cartStore.items,
      couponCode: cartStore.coupon,
      origin: origin.value.trim(),
      destination: destination.value.trim()
    })

    cartStore.clearCart()
    router.push('/orders')
  } catch (error) {
    // Error is handled by the store
  }
}

// Watch for changes in cart items to recalculate pricing
watch(() => cartStore.items, () => {
  if (cartStore.items.length > 0) {
    cartStore.calculatePrice()
  }
}, { deep: true })

onMounted(() => {
  // Initialize form with store values
  origin.value = cartStore.origin
  destination.value = cartStore.destination
  couponCode.value = cartStore.coupon

  // Calculate initial pricing
  if (cartStore.items.length > 0) {
    cartStore.calculatePrice()
  }
})
</script>

<style scoped>
.cart-page {
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

.empty-cart {
  text-align: center;
  padding: 4rem 0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-cart h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.empty-cart p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  display: inline-block;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.cart-items {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.cart-items h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-icon {
  font-size: 2rem;
}

.item-details h3 {
  margin: 0 0 0.25rem 0;
  color: #1f2937;
}

.item-details p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-quantity {
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-quantity:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.btn-quantity:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  min-width: 2rem;
  text-align: center;
  font-weight: 600;
}

.btn-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
}

.btn-remove:hover {
  background-color: #fef2f2;
  border-radius: 0.25rem;
}

.cart-summary {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.cart-summary h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.coupon-section, .delivery-info {
  margin-bottom: 1.5rem;
}

.coupon-section h3, .delivery-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.coupon-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.form-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.btn-apply {
  background-color: #6b7280;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-apply:hover:not(:disabled) {
  background-color: #4b5563;
}

.btn-apply:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.applied-coupon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0fdf4;
  color: #166534;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.btn-remove-coupon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: #166534;
}

.pricing-summary {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
  margin-bottom: 1.5rem;
}

.price-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.price-line.discount {
  color: #059669;
}

.price-line.total {
  font-weight: 600;
  font-size: 1.125rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
}

.btn-checkout {
  width: 100%;
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-checkout:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-checkout:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .cart-summary {
    position: static;
  }
  
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .item-controls {
    align-self: flex-end;
  }
}
</style>


