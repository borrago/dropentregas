import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiLogin, apiRegister, apiMe } from '../services/api.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('drop_token'))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value && !!token.value)

  const setUser = (userData) => {
    user.value = userData
  }

  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('drop_token', newToken)
    } else {
      localStorage.removeItem('drop_token')
    }
  }

  const clearError = () => {
    error.value = null
  }

  const login = async (credentials) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiLogin(credentials)
      if (response.success) {
        setToken(response.token)
        setUser(response.user)
        return response.user
      } else {
        throw new Error(response.message || 'Falha no login')
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiRegister(userData)
      if (response.success) {
        setToken(response.token)
        setUser(response.user)
        return response.user
      } else {
        throw new Error(response.message || 'Falha no cadastro')
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('drop_current_user')
  }

  const checkAuth = async () => {
    if (token.value && !user.value) {
      loading.value = true
      try {
        const response = await apiMe()
        if (response.success) {
          setUser(response.user)
        } else {
          logout()
        }
      } catch (err) {
        logout()
      } finally {
        loading.value = false
      }
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    setUser,
    setToken,
    clearError,
    login,
    register,
    logout,
    checkAuth
  }
})


