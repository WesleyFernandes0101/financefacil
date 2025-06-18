<template>
  <nav class="bg-gray-800 text-white p-4 flex justify-between">
    <div class="space-x-4">
      <RouterLink to="/dashboard">Dashboard</RouterLink>
      <RouterLink to="/receitasdespesas">Receitas & Despesas</RouterLink>
    </div>
    <button @click="logout" class="px-3 py-0 bg-red-500 hover:bg-red-600 text-white rounded transition-colors">Sair</button>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useFinanceStore } from '../store'
const router = useRouter()
const store = useFinanceStore()

const logout = () => {
  store.logout()
  router.push('/login')
}
</script>