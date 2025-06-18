<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

// Registra os componentes necessários
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    validator: (value) => {
      return value?.labels && value?.datasets
    }
  },
  options: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    })
  }
})

const chartRef = ref(null)
const chartInstance = ref(null)
const updateTimeout = ref(null)

// Função para destruir o gráfico existente
const destroyChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }
  if (updateTimeout.value) {
    clearTimeout(updateTimeout.value)
    updateTimeout.value = null
  }
}

// Função para criar novo gráfico
const createChart = () => {
  if (!chartRef.value || !props.chartData) return
  
  const ctx = chartRef.value.getContext('2d')
  chartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: JSON.parse(JSON.stringify(props.chartData)), // Deep clone para evitar reatividade
    options: JSON.parse(JSON.stringify(props.options)) // Deep clone para evitar reatividade
  })
}

// Atualiza o gráfico de forma segura
const safeUpdate = () => {
  destroyChart()
  updateTimeout.value = setTimeout(() => {
    createChart()
  }, 10)
}

// Inicialização
onMounted(() => {
  safeUpdate()
})

// Watcher otimizado
watch(() => props.chartData, (newData, oldData) => {
  if (JSON.stringify(newData) !== JSON.stringify(oldData)) {
    safeUpdate()
  }
}, { deep: true })

watch(() => props.options, (newOpts, oldOpts) => {
  if (JSON.stringify(newOpts) !== JSON.stringify(oldOpts)) {
    safeUpdate()
  }
}, { deep: true })

// Limpeza
onBeforeUnmount(() => {
  destroyChart()
})
</script>

<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
    <div v-if="!props.chartData?.labels?.length" class="no-data-message">
      Nenhum dado disponível para exibir
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 250px;
}

.no-data-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #64748B;
  font-size: 0.875rem;
  text-align: center;
}
</style>