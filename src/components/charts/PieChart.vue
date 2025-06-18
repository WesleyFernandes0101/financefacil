<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, PieController, ArcElement, Tooltip, Legend, Title } from 'chart.js'

// Registra os componentes necessários do Chart.js
Chart.register(PieController, ArcElement, Tooltip, Legend, Title)

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
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.raw || 0
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = Math.round((value / total) * 100)
              return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`
            }
          }
        }
      }
    })
  }
})

const chartRef = ref(null)
const chartInstance = ref(null)

// Função para renderizar o gráfico
const renderChart = () => {
  if (!chartRef.value || !props.chartData?.labels?.length) return
  
  // Destrói o gráfico anterior se existir
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
  
  // Cria novo gráfico
  const ctx = chartRef.value.getContext('2d')
  chartInstance.value = new Chart(ctx, {
    type: 'pie',
    data: props.chartData,
    options: props.options
  })
}

// Renderiza quando o componente é montado
onMounted(renderChart)

// Atualiza quando os dados mudam
watch(() => props.chartData, renderChart, { deep: true })

// Atualiza quando as opções mudam
watch(() => props.options, (newOptions) => {
  if (chartInstance.value) {
    chartInstance.value.options = newOptions
    chartInstance.value.update()
  }
}, { deep: true })
</script>

<template>
  <div class="pie-chart-container">
    <canvas ref="chartRef"></canvas>
    <div v-if="!chartData?.labels?.length" class="no-data-message">
      Nenhum dado disponível para exibir
    </div>
  </div>
</template>

<style scoped>
.pie-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
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