<template>
  <div id="app">
    <nav v-if="showNavigation" class="navbar">
      <div class="nav-brand">
        <h1>DropEntregas</h1>
      </div>
      <div class="nav-links">
        <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
        <router-link to="/vehicles" class="nav-link">Veículos</router-link>
        <router-link to="/cart" class="nav-link">
          Carrinho
          <span v-if="cartStore.totalItems > 0" class="badge">{{ cartStore.totalItems }}</span>
        </router-link>
        <router-link to="/orders" class="nav-link">Pedidos</router-link>
        <div class="nav-user" v-if="authStore.isAuthenticated">
          <span>Olá, {{ authStore.user?.name }}</span>
          <button @click="logout" class="btn-logout">Sair</button>
        </div>
        <div class="nav-auth" v-else>
          <router-link to="/login" class="btn-login">Entrar</router-link>
          <router-link to="/register" class="btn-register">Cadastrar</router-link>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth.js'
import { useCartStore } from './stores/cart.js'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const showNavigation = computed(() => {
  return router.currentRoute.value.path !== '/login' && router.currentRoute.value.path !== '/register'
})

const logout = () => {
  authStore.logout()
  cartStore.clearCart()
  router.push('/login')
}

onMounted(async () => {
  await authStore.checkAuth()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}

.navbar {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h1 {
  color: #3b82f6;
  font-size: 1.5rem;
  font-weight: 700;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  position: relative;
}

.nav-link:hover {
  background-color: #f3f4f6;
  color: #3b82f6;
}

.nav-link.router-link-active {
  background-color: #3b82f6;
  color: white;
}

.badge {
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  margin-left: 0.5rem;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-login, .btn-register, .btn-logout {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-login {
  color: #374151;
  background-color: transparent;
}

.btn-login:hover {
  background-color: #f3f4f6;
}

.btn-register {
  background-color: #3b82f6;
  color: white;
}

.btn-register:hover {
  background-color: #2563eb;
}

.btn-logout {
  background-color: #ef4444;
  color: white;
}

.btn-logout:hover {
  background-color: #dc2626;
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>


