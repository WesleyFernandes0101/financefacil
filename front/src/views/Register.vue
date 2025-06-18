<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-3xl mb-4">Cadastro</h1>
    <input v-model="email" class="input" placeholder="Email" />
    <input v-model="senha" type="password" class="input" placeholder="Senha" />
    <button class="btn" @click="registrar">Cadastrar</button>
    <router-link to="/login" class="mt-4 text-blue-500">Já tem conta? Entrar</router-link>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

let email = '', senha = ''
const registrar = () => {
  // Simulação de cadastro
  router.push('/login')
}
</script>

<style scoped>
.input { @apply border p-2 mb-2 w-64 }
.btn { @apply bg-green-500 text-white px-4 py-2 rounded }
</style>
