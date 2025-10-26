import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000"

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('drop_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('drop_token')
      localStorage.removeItem('drop_current_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const apiRegister = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro no cadastro')
  }
}

export const apiLogin = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro no login')
  }
}

export const apiMe = async () => {
  try {
    const response = await api.get('/api/auth/me')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar dados do usuário')
  }
}

// Vehicles API
export const apiVehicles = async () => {
  try {
    const response = await api.get('/api/vehicles')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao listar veículos')
  }
}

export const apiVehicle = async (id) => {
  try {
    const response = await api.get(`/api/vehicles/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar veículo')
  }
}

// Orders API
export const apiPrice = async (data) => {
  try {
    const response = await api.post('/api/orders/price', data)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao calcular preço')
  }
}

export const apiCreateOrder = async (orderData) => {
  try {
    const response = await api.post('/api/orders', orderData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao criar pedido')
  }
}

export const apiMyOrders = async () => {
  try {
    const response = await api.get('/api/orders/me')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar pedidos')
  }
}

// Coupons API
export const apiCoupons = async () => {
  try {
    const response = await api.get('/api/coupons')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao listar cupons')
  }
}

export default api


