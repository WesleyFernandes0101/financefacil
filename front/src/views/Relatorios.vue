<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <NavBar />
    
    <div class="container mx-auto px-4 py-8">
      <!-- Cabeçalho -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">Relatórios Financeiros</h1>
        <p class="text-gray-600 mt-2">Análise visual do seu desempenho financeiro</p>
      </div>

      <!-- Cards de métricas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard 
          title="Saldo Total" 
          :value="store.saldo" 
          :positive="store.saldo >= 0"
          icon="💰"
        />
        <MetricCard 
          title="Receitas" 
          :value="store.totalReceitas" 
          positive 
          icon="↑"
        />
        <MetricCard 
          title="Despesas" 
          :value="store.totalDespesas" 
          :positive="false"
          icon="↓"
        />
      </div>

      <!-- Gráfico principal -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Receitas vs Despesas</h2>
          <select class="bg-gray-100 border-0 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
            <option>Últimos 30 dias</option>
            <option>Últimos 3 meses</option>
            <option>Últimos 12 meses</option>
          </select>
        </div>
        <div class="h-96">
          <Bar 
            :data="chartData" 
            :options="chartOptions"
          />
        </div>
      </div>

      <!-- Gráficos secundários -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Distribuição por Categoria</h3>
          <div class="h-64">
            <Pie 
              :data="categoriesData" 
              :options="pieOptions"
            />
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Evolução Mensal</h3>
          <div class="h-64">
            <Line 
              :data="trendData" 
              :options="lineOptions"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import MetricCard from '../components/MetricCard.vue'
import { useFinanceStore } from '../store'
import { Bar, Pie, Line } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js'
import { computed } from 'vue'

ChartJS.register(
  Title, Tooltip, Legend, 
  BarElement, CategoryScale, LinearScale,
  ArcElement, PointElement, LineElement
)

const store = useFinanceStore()

// Dados para gráfico de barras
const chartData = computed(() => ({
  labels: ['Receitas', 'Despesas'],
  datasets: [{
    label: 'Valores (R$)',
    data: [store.totalReceitas, store.totalDespesas],
    backgroundColor: ['#10B981', '#EF4444'],
    borderColor: ['#059669', '#DC2626'],
    borderWidth: 1,
    borderRadius: 8,
    barPercentage: 0.6
  }]
}))

// Dados para gráfico de pizza (exemplo)
const categoriesData = computed(() => ({
  labels: ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Outros'],
  datasets: [{
    data: [800, 300, 1500, 200, 400],
    backgroundColor: [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
    ],
    borderWidth: 1
  }]
}))

// Dados para gráfico de linhas (exemplo)
const trendData = computed(() => ({
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [{
    label: 'Receitas',
    data: [3200, 2900, 3500, 3800, 4000, 4200],
    borderColor: '#10B981',
    tension: 0.3,
    fill: false
  }, {
    label: 'Despesas',
    data: [2800, 3000, 3100, 2900, 3200, 3000],
    borderColor: '#EF4444',
    tension: 0.3,
    fill: false
  }]
}))

// Opções para gráficos
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    tooltip: {
      callbacks: {
        label: (context) => `R$ ${context.raw.toFixed(2).replace('.', ',')}`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `R$ ${value.toFixed(0)}`
      }
    }
  }
}

const pieOptions = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    tooltip: {
      callbacks: {
        label: (context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const value = context.raw
          const percentage = Math.round((value / total) * 100)
          return `${context.label}: R$ ${value.toFixed(2).replace('.', ',')} (${percentage}%)`
        }
      }
    }
  }
}

const lineOptions = {
  ...chartOptions,
  interaction: {
    intersect: false,
    mode: 'index'
  }
}
</script>