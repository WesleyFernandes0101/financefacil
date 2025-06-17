<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    
    <div class="container mx-auto p-6">
      <!-- Cabeçalho -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Olá, {{ store.user?.email || 'Usuário' }}</h1>
        <p class="text-gray-600">Bem-vindo ao seu painel financeiro</p>
      </div>

      <!-- Cards de resumo -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-gray-500 font-medium">Saldo Total</h3>
          <p class="text-2xl font-bold" :class="store.saldo >= 0 ? 'text-green-600' : 'text-red-600'">
            R$ {{ store.saldo.toFixed(2) }}
          </p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-gray-500 font-medium">Receitas</h3>
          <p class="text-2xl font-bold text-green-600">
            R$ {{ store.totalReceitas.toFixed(2) }}
          </p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 class="text-gray-500 font-medium">Despesas</h3>
          <p class="text-2xl font-bold text-red-600">
            R$ {{ store.totalDespesas.toFixed(2) }}
          </p>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Gráfico de Receitas vs Despesas -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-4">Receitas vs Despesas</h3>
          <div class="h-64">
            <Bar 
              :data="chartData" 
              :options="chartOptions"
            />
          </div>
        </div>

        <!-- Gráfico de distribuição de categorias -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-4">Distribuição por Categoria</h3>
          <div class="h-64">
            <Pie 
              v-if="categoriesData"
              :data="categoriesData" 
              :options="chartOptions"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { useFinanceStore } from '../store'
import { Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { computed } from 'vue'

// Registra os componentes do Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const store = useFinanceStore()

// Dados para o gráfico de barras
const chartData = computed(() => ({
  labels: ['Receitas', 'Despesas'],
  datasets: [{
    label: 'Valores (R$)',
    data: [store.totalReceitas, store.totalDespesas],
    backgroundColor: ['#10B981', '#EF4444'],
    borderColor: ['#059669', '#DC2626'],
    borderWidth: 1
  }]
}))

// Dados para o gráfico de pizza (exemplo - adapte conforme sua store)
const categoriesData = computed(() => {
  if (!store.categories || store.categories.length === 0) return null
  
  return {
    labels: store.categories.map(c => c.name),
    datasets: [{
      data: store.categories.map(c => c.total),
      backgroundColor: [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#EC4899', '#14B8A6', '#F97316', '#64748B', '#06B6D4'
      ],
      borderWidth: 1
    }]
  }
})

// Opções comuns para os gráficos
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `R$ ${context.raw.toFixed(2)}`
        }
      }
    }
  }
}
</script>

<style scoped>
/* Estilos adicionais podem ser adicionados aqui se necessário */
</style>