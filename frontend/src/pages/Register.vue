<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1 class="register-title">DropEntregas</h1>
        <p class="register-subtitle">Crie sua conta para começar</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Nome completo</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            :disabled="authStore.loading"
            placeholder="Seu nome completo"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :disabled="authStore.loading"
            placeholder="seu@email.com"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Senha</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            :disabled="authStore.loading"
            placeholder="Mínimo 6 caracteres"
            minlength="6"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirmar senha</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            :disabled="authStore.loading"
            placeholder="Confirme sua senha"
            class="form-input"
            :class="{ 'error': form.confirmPassword && form.password !== form.confirmPassword }"
          />
          <div v-if="form.confirmPassword && form.password !== form.confirmPassword" class="field-error">
            As senhas não coincidem
          </div>
        </div>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>

        <button
          type="submit"
          :disabled="authStore.loading || !isFormValid"
          class="btn-register"
        >
          {{ authStore.loading ? 'Criando conta...' : 'Cadastrar' }}
        </button>
      </form>

      <div class="register-footer">
        <p>Já tem uma conta? 
          <router-link to="/login" class="link">Faça login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isFormValid = computed(() => {
  return form.name.trim() && 
         form.email.trim() && 
         form.password.length >= 6 && 
         form.password === form.confirmPassword
})

const handleRegister = async () => {
  if (!isFormValid.value) return

  try {
    authStore.clearError()
    await authStore.register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password
    })
    router.push('/dashboard')
  } catch (error) {
    // Error is handled by the store
  }
}

onMounted(() => {
  // Clear any previous errors
  authStore.clearError()
})
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.register-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.register-subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.register-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.form-input.error {
  border-color: #dc2626;
}

.field-error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.btn-register {
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

.btn-register:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-register:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.register-footer {
  text-align: center;
}

.register-footer p {
  color: #6b7280;
  margin: 0;
}

.link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-container {
    padding: 1rem;
  }
  
  .register-card {
    padding: 2rem;
  }
}
</style>


