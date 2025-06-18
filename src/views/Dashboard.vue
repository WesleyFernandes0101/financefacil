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
            R$ {{ store.saldo?.toFixed(2) || '0.00' }}
          </p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 relative">
          <h3 class="text-gray-500 font-medium">Receitas</h3>
          <p class="text-2xl font-bold text-green-600">
            R$ {{ store.totalReceitas?.toFixed(2) || '0.00' }}
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
            R$ {{ store.totalDespesas?.toFixed(2) || '0.00' }}
          </p>
          <button 
            @click="navigateToLancamentos('despesa')"
            class="absolute top-2 right-2 bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium transition"
          >
            - 
          </button>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Gráfico de Receitas vs Despesas -->
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

        <!-- Gráfico de distribuição de categorias -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-4">Distribuição por Categoria</h3>
          <div class="h-64">
            <PieChart 
              v-if="pieChartData"
              :chart-data="pieChartData"
              :options="chartOptions"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-500">
              {{ store.categories?.length === 0 ? 'Nenhuma categoria cadastrada' : (isLoading ? 'Carregando...' : 'Nenhum dado disponível') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { useFinanceStore } from '../store'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import BarChart from '../components/charts/BarChart.vue'
import PieChart from '../components/charts/PieChart.vue'

const store = useFinanceStore()
const router = useRouter() // Obtenha a instância do router
const isLoading = ref(true)
const barChartData = ref(null)
const pieChartData = ref(null)

// Opções comuns
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `R$ ${(context.raw || 0).toFixed(2)}`
        }
      }
    }
  }
})

const navigateToLancamentos = (tipo) => {
  // Armazena o tipo no store (Pinia) ou localStorage
  store.setUltimoTipoLancamento(tipo) // Se estiver usando Pinia
  // Ou: localStorage.setItem('ultimoTipoLancamento', tipo)
  
  // Navega para a página de lançamentos
  router.push('/lancamentos')
}

// Versão corrigida da função prepareBarChartData
const prepareBarChartData = () => ({
  labels: ['Receitas', 'Despesas'],
  datasets: [
    {
      label: 'Valores (R$)', // Corrigido: label deve ser string, não array
      data: [
        store.totalReceitas ?? 0, 
        store.totalDespesas ?? 0
      ],
      backgroundColor: ['#10B981', '#EF4444'],
      borderColor: ['#059669', '#DC2626'],
      borderWidth: 1
    }
  ]
})

// Prepara os dados do gráfico de pizza
const preparePieChartData = () => {
  if (!store.categories || store.categories.length === 0) {
    return null
  }
  
  const validCategories = store.categories.filter(c => (c.total ?? 0) > 0)
  if (validCategories.length === 0) return null
  
  return {
    labels: validCategories.map(c => c.name || 'Sem nome'),
    datasets: [{
      data: validCategories.map(c => c.total),
      backgroundColor: validCategories.map(c => c.color || '#64748B'),
      borderWidth: 1
    }]
  }
}

// Função para lidar com redimensionamento (se necessário)
const handleResize = () => {
  barChartData.value = { ...prepareBarChartData() }
}

// Carrega os dados iniciais
const loadData = async () => {
  try {
    isLoading.value = true
    await store.loadInitialData()
    barChartData.value = prepareBarChartData()
    pieChartData.value = preparePieChartData()
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    // Fornece fallback visual
    barChartData.value = null
    pieChartData.value = null
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  try {
    await store.loadInitialData()
    // Atribui um NOVO objeto para evitar mutações reativas
    barChartData.value = prepareBarChartData()
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    barChartData.value = null
  }
})

// Hook beforeUnmount (agora corretamente importado)
onBeforeUnmount(() => {
  // Se adicionou event listener, remova aqui:
  // window.removeEventListener('resize', handleResize)
})
</script>
