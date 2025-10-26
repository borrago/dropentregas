import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiPrice, apiCreateOrder } from '../services/api.js'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const coupon = ref('')
  const origin = ref('')
  const destination = ref('')
  const pricing = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.qty, 0))
  const subtotal = computed(() => items.value.reduce((sum, item) => sum + (item.basePrice * item.qty), 0))

  const addItem = (vehicle) => {
    const existingItem = items.value.find(item => item.vehicleId === vehicle.id)
    if (existingItem) {
      existingItem.qty++
    } else {
      items.value.push({
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        basePrice: vehicle.basePrice,
        qty: 1
      })
    }
    calculatePrice()
  }

  const removeItem = (vehicleId) => {
    items.value = items.value.filter(item => item.vehicleId !== vehicleId)
    calculatePrice()
  }

  const updateQuantity = (vehicleId, newQty) => {
    const item = items.value.find(item => item.vehicleId === vehicleId)
    if (item) {
      item.qty = Math.max(1, newQty)
    }
    calculatePrice()
  }

  const clearCart = () => {
    items.value = []
    coupon.value = ''
    origin.value = ''
    destination.value = ''
    pricing.value = null
  }

  const calculatePrice = async () => {
    if (items.value.length === 0) {
      pricing.value = null
      return
    }
    loading.value = true
    error.value = null
    try {
      const payload = {
        items: items.value.map(item => ({ vehicleId: item.vehicleId, qty: item.qty })),
        couponCode: coupon.value
      }
      const response = await apiPrice(payload)
      if (response.success) {
        pricing.value = response.data
      } else {
        throw new Error(response.message || 'Erro ao calcular preço')
      }
    } catch (err) {
      error.value = err.message
      pricing.value = null
    } finally {
      loading.value = false
    }
  }

  const setCoupon = (newCouponCode) => {
    coupon.value = newCouponCode
    calculatePrice()
  }

  const setOrigin = (value) => {
    origin.value = value
  }

  const setDestination = (value) => {
    destination.value = value
  }

  const createOrder = async (orderData) => {
    try {
      loading.value = true
      error.value = null

      const response = await apiCreateOrder(orderData)

      if (response.success) {
        clearCart()
        return response
      }
    } catch (err) {
      error.value = err.message || 'Erro ao criar pedido'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    coupon,
    origin,
    destination,
    pricing,
    loading,
    error,
    totalItems,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    calculatePrice,
    setCoupon,
    setOrigin,
    setDestination,
    createOrder
  }
})


