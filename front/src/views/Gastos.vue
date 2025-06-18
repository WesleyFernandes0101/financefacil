<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    
    <div class="container mx-auto p-6">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Cabeçalho -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-800">Todos os Lançamentos</h2>
          <p class="text-gray-600">Histórico completo de receitas e despesas</p>
        </div>
        
        <!-- Filtros -->
        <div class="px-6 py-4 bg-gray-50 flex flex-wrap gap-4">
          <select 
            v-model="filtroTipo"
            class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="todos">Todos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>
          
          <input
            v-model="filtroTexto"
            type="text"
            placeholder="Buscar descrição..."
            class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
        </div>
        
        <!-- Tabela de lançamentos -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(lancamento, index) in lancamentosFiltrados" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(lancamento.data) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="lancamento.tipo === 'receita' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ lancamento.tipo === 'receita' ? 'Receita' : 'Despesa' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ lancamento.descricao }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getCategoryName(lancamento.categoriaId) }}
                </td>
                <td 
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                  :class="lancamento.tipo === 'receita' ? 'text-green-600' : 'text-red-600'"
                >
                  R$ {{ lancamento.valor.toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Rodapé/resumo -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Mostrando {{ lancamentosFiltrados.length }} de {{ store.lancamentos.length }} lançamentos
          </div>
          <div class="flex gap-6">
            <div class="text-sm">
              <span class="font-medium text-green-600">Receitas: R$ {{ totalReceitasFiltradas.toFixed(2) }}</span>
            </div>
            <div class="text-sm">
              <span class="font-medium text-red-600">Despesas: R$ {{ totalDespesasFiltradas.toFixed(2) }}</span>
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
import { computed, ref } from 'vue'

const store = useFinanceStore()
const filtroTipo = ref('todos')
const filtroTexto = ref('')

// Formata data para exibição
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('pt-BR', options)
}

// Obtém nome da categoria
const getCategoryName = (id) => {
  const category = store.categories.find(c => c.id === id)
  return category ? category.name : 'Outros'
}

// Lançamentos filtrados
const lancamentosFiltrados = computed(() => {
  return store.lancamentos
    .filter(l => {
      const matchesTipo = filtroTipo.value === 'todos' || l.tipo === filtroTipo.value
      const matchesTexto = l.descricao.toLowerCase().includes(filtroTexto.value.toLowerCase())
      return matchesTipo && matchesTexto
    })
    .sort((a, b) => new Date(b.data) - new Date(a.data))
})

// Totais filtrados
const totalReceitasFiltradas = computed(() => {
  return lancamentosFiltrados.value
    .filter(l => l.tipo === 'receita')
    .reduce((sum, l) => sum + l.valor, 0)
})

const totalDespesasFiltradas = computed(() => {
  return lancamentosFiltrados.value
    .filter(l => l.tipo === 'despesa')
    .reduce((sum, l) => sum + l.valor, 0)
})
</script>

<style scoped>
/* Estilos adicionais podem ser colocados aqui se necessário */
</style>