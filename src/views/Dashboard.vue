<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />

    <div class="container mx-auto p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Olá, {{ firstName }}</h1>
        <p class="text-gray-600">Bem-vindo ao seu painel financeiro</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-gray-500 font-medium">Saldo Total</h3>
          <p class="text-2xl font-bold" :class="store.saldo >= 0 ? 'text-green-600' : 'text-red-600'">
            R$ {{ store.saldo.toFixed(2) }}
          </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 relative">
          <h3 class="text-gray-500 font-medium">Receitas</h3>
          <p class="text-2xl font-bold text-green-600">
            R$ {{ store.totalReceitas.toFixed(2) }}
          </p>
          <button 
            @click="navigateToLancamentos('receita')"
            class="absolute top-2 right-2 bg-green-100 text-green-600 hover:bg-green-200 px-3 py-1 rounded-md text-sm font-medium transition"
          >
            + 
          </button>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500 relative">
          <h3 class="text-gray-500 font-medium">Despesas</h3>
          <p class="text-2xl font-bold text-red-600">
            R$ {{ store.totalDespesas.toFixed(2) }}
          </p>
          <button 
            @click="navigateToLancamentos('despesa')"
            class="absolute top-2 right-2 bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium transition"
          >
            - 
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-4">Receitas vs Despesas</h3>
          <div class="h-64">
            <BarChart 
              v-if="barChartData"
              :chart-data="barChartData"
              :options="chartOptions"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-500">
              {{ isLoading ? 'Carregando dados...' : 'Nenhum dado disponível' }}
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-1">Distribuição por Categoria</h3>
          <div class="h-64">
            <PieChart 
              v-if="pieChartData"
              :chart-data="pieChartData"
              :options="chartOptions"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-500">
              {{ isLoading ? 'Carregando...' : 'Nenhum dado disponível' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '../store'
import NavBar from '../components/NavBar.vue'
import BarChart from '../components/charts/BarChart.vue'
import PieChart from '../components/charts/PieChart.vue'

const store = useFinanceStore()
const router = useRouter()
const isLoading = ref(true)
const barChartData = ref(null)
const pieChartData = ref(null)

const firstName = computed(() => {
  const emailName = store.user?.email?.split('@')[0]
  if (!emailName) return 'Usuário'
  return emailName.charAt(0).toUpperCase() + emailName.slice(1)
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    tooltip: {
      callbacks: {
        label: (context) => `R$ ${(context.raw || 0).toFixed(2)}`
      }
    }
  }
}

const navigateToLancamentos = (tipo) => {
  store.setUltimoTipoLancamento(tipo)
  router.push('/lancamentos')
}

const prepareBarChartData = () => ({
  labels: ['Receitas', 'Despesas'],
  datasets: [{
    label: 'Valores (R$)',
    data: [store.totalReceitas ?? 0, store.totalDespesas ?? 0],
    backgroundColor: ['#10B981', '#EF4444'],
    borderColor: ['#059669', '#DC2626'],
    borderWidth: 1
  }]
})

const preparePieChartData = () => {
  const validCategories = store.categoriesData
  if (!validCategories || validCategories.length === 0) return null

  return {
    labels: validCategories.map(c => c.name),
    datasets: [{
      data: validCategories.map(c => c.total),
      backgroundColor: validCategories.map(c => c.color || '#64748B'),
      borderWidth: 1
    }]
  }
}

const loadData = async () => {
  try {
    isLoading.value = true
    if (!store.dataCarregada) {
      await store.loadInitialData()
    }
    barChartData.value = prepareBarChartData()
    pieChartData.value = preparePieChartData()
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    barChartData.value = null
    pieChartData.value = null
  } finally {
    isLoading.value = false
  }
}

// Atualiza os gráficos quando os dados de lançamentos mudam (reactividade)
watch(
  () => [store.lancamentos.length, store.totalReceitas, store.totalDespesas, store.categoriesData],
  () => {
    barChartData.value = prepareBarChartData()
    pieChartData.value = preparePieChartData()
  },
  { deep: true }
)

onMounted(async () => {
  if (!store.user) {
    router.push('/login')
    return
  }
  await loadData()
})
</script>
