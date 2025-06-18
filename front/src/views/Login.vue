<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-3xl mb-4">Login</h1>
    <input v-model="email" class="input" placeholder="Email" />
    <input v-model="senha" type="password" class="input" placeholder="Senha" />
    <button class="btn" @click="logar">Entrar</button>
    <p v-if="mensagemErro" class="text-red-500 mt-2">{{ mensagemErro }}</p>
    <router-link to="/register" class="mt-4 text-blue-500">Não tem conta? Cadastre-se</router-link>
    
    <!-- Apenas para desenvolvimento - Mostra credenciais de teste -->
    <div v-if="ambienteDesenvolvimento" class="mt-8 p-4 bg-gray-100 rounded-lg text-center">
      <p class="font-bold mb-2">Credenciais de teste (apenas desenvolvimento):</p>
      <p>Email: <span class="font-mono">teste@example.com</span></p>
      <p>Senha: <span class="font-mono">123456</span></p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useFinanceStore } from '../store'
import { ref } from 'vue'

const router = useRouter()
const store = useFinanceStore()

const email = ref('')
const senha = ref('')
const mensagemErro = ref('')
const ambienteDesenvolvimento = import.meta.env.MODE === 'development'

const logar = () => {
  // Credenciais de teste (apenas para desenvolvimento)
  const credenciaisValidas = (
    email.value === 'teste@example.com' && 
    senha.value === '123456'
  )

  if (credenciaisValidas) {
    store.login({ email: email.value })
    router.push('/dashboard')
  } else {
    mensagemErro.value = 'Credenciais inválidas. Use teste@example.com / 123456'
  }
}
</script>

<style scoped>
.input { @apply border p-2 mb-2 w-64 rounded }
.btn { @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 }
</style>