<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    
    <div class="container mx-auto p-6">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Cabeçalho -->
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">Receitas & Despesas</h2>
            <p class="text-gray-600">Histórico completo com filtros avançados</p>
          </div>
          <button 
            @click="mostrarFiltrosAvancados = !mostrarFiltrosAvancados"
            class="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
            </svg>
            {{ mostrarFiltrosAvancados ? 'Ocultar Filtros' : 'Filtros Avançados' }}
          </button>
        </div>
        
        <!-- Filtros Básicos -->
        <div class="px-6 py-4 bg-gray-50 flex flex-wrap gap-4">
          <div class="w-full md:w-auto">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select 
              v-model="filtroTipo"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>
          </div>
          
          <div class="w-full md:w-auto">
            <label class="block text-sm font-medium text-gray-700 mb-1">Busca</label>
            <input
              v-model="filtroTexto"
              type="text"
              placeholder="Descrição ou valor..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          
          <div class="w-full md:w-auto">
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select 
              v-model="filtroCategoria"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todas">Todas</option>
              <option v-for="cat in categoriasDisponiveis" :value="cat.id" :key="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- Filtros Avançados (expandível) -->
        <div v-if="mostrarFiltrosAvancados" class="px-6 py-4 bg-blue-50 border-t border-blue-100 flex flex-wrap gap-4">
          <div class="w-full md:w-auto">
            <label class="block text-sm font-medium text-gray-700 mb-1">Período</label>
            <div class="flex gap-2">
              <input
                v-model="filtroDataInicio"
                type="date"
                class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
              <span class="self-center text-gray-500">até</span>
              <input
                v-model="filtroDataFim"
                type="date"
                class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
          </div>
          
          <div class="w-full md:w-auto">
            <label class="block text-sm font-medium text-gray-700 mb-1">Valor Mínimo</label>
            <input
              v-model="filtroValorMin"
              type="number"
              step="0.01"
              min="0"
              placeholder="R$ 0,00"
              class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          
          <div class="w-full md:w-auto">
            <label class="block text-sm font-medium text-gray-700 mb-1">Valor Máximo</label>
            <input
              v-model="filtroValorMax"
              type="number"
              step="0.01"
              min="0"
              placeholder="R$ 9.999,99"
              class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          
          <div class="w-full md:w-auto flex items-end">
            <button 
              @click="resetarFiltros"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
        
        <!-- Tabela de lançamentos -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="ordenarPor('data')">
                  Data
                  <SortIcon :direction="ordenacao.campo === 'data' ? ordenacao.direcao : null" />
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="ordenarPor('tipo')">
                  Tipo
                  <SortIcon :direction="ordenacao.campo === 'tipo' ? ordenacao.direcao : null" />
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="ordenarPor('descricao')">
                  Descrição
                  <SortIcon :direction="ordenacao.campo === 'descricao' ? ordenacao.direcao : null" />
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="ordenarPor('categoria')">
                  Categoria
                  <SortIcon :direction="ordenacao.campo === 'categoria' ? ordenacao.direcao : null" />
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="ordenarPor('valor')">
                  Valor
                  <SortIcon :direction="ordenacao.campo === 'valor' ? ordenacao.direcao : null" />
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
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
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="editarLancamento(lancamento)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Editar
                  </button>
                  <button 
                    @click="confirmarExclusao(lancamento)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
              <tr v-if="lancamentosFiltrados.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                  Nenhum lançamento encontrado com os filtros atuais
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Rodapé/resumo -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="text-sm text-gray-500">
            Mostrando {{ lancamentosFiltrados.length }} de {{ store.lancamentos.length }} lançamentos
          </div>
          <div class="flex flex-wrap gap-6">
            <div class="text-sm">
              <span class="font-medium text-green-600">Receitas: R$ {{ totalReceitasFiltradas.toFixed(2) }}</span>
            </div>
            <div class="text-sm">
              <span class="font-medium text-red-600">Despesas: R$ {{ totalDespesasFiltradas.toFixed(2) }}</span>
            </div>
            <div class="text-sm">
              <span class="font-medium" :class="saldoFiltrado >= 0 ? 'text-green-600' : 'text-red-600'">
                Saldo: R$ {{ Math.abs(saldoFiltrado).toFixed(2) }} 
                {{ saldoFiltrado >= 0 ? '(Positivo)' : '(Negativo)' }}
              </span>
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
import { useRouter } from 'vue-router'
import SortIcon from '../components/SortIcon.vue'

const router = useRouter()
const store = useFinanceStore()

// Filtros
const filtroTipo = ref('todos')
const filtroTexto = ref('')
const filtroCategoria = ref('todas')
const filtroDataInicio = ref('')
const filtroDataFim = ref('')
const filtroValorMin = ref('')
const filtroValorMax = ref('')
const mostrarFiltrosAvancados = ref(false)

// Ordenação
const ordenacao = ref({
  campo: 'data',
  direcao: 'desc'
})

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

// Categorias disponíveis para filtro
const categoriasDisponiveis = computed(() => {
  return store.categories.filter(c => 
    filtroTipo.value === 'todos' || 
    c.tipo === filtroTipo.value || 
    c.tipo === 'ambos'
  )
})

// Ordenar por campo
const ordenarPor = (campo) => {
  if (ordenacao.value.campo === campo) {
    ordenacao.value.direcao = ordenacao.value.direcao === 'asc' ? 'desc' : 'asc'
  } else {
    ordenacao.value.campo = campo
    ordenacao.value.direcao = 'asc'
  }
}

// Resetar filtros
const resetarFiltros = () => {
  filtroTipo.value = 'todos'
  filtroTexto.value = ''
  filtroCategoria.value = 'todas'
  filtroDataInicio.value = ''
  filtroDataFim.value = ''
  filtroValorMin.value = ''
  filtroValorMax.value = ''
}

// Lançamentos filtrados e ordenados
const lancamentosFiltrados = computed(() => {
  let lancamentos = [...store.lancamentos]
  
  // Aplicar filtros
  lancamentos = lancamentos.filter(l => {
    const matchesTipo = filtroTipo.value === 'todos' || l.tipo === filtroTipo.value
    const matchesTexto = l.descricao.toLowerCase().includes(filtroTexto.value.toLowerCase()) || 
                         l.valor.toString().includes(filtroTexto.value)
    const matchesCategoria = filtroCategoria.value === 'todas' || l.categoriaId == filtroCategoria.value
    
    const lancamentoDate = new Date(l.data)
    const matchesDataInicio = !filtroDataInicio.value || lancamentoDate >= new Date(filtroDataInicio.value)
    const matchesDataFim = !filtroDataFim.value || lancamentoDate <= new Date(filtroDataFim.value + 'T23:59:59')
    
    const matchesValorMin = !filtroValorMin.value || l.valor >= parseFloat(filtroValorMin.value)
    const matchesValorMax = !filtroValorMax.value || l.valor <= parseFloat(filtroValorMax.value)
    
    return matchesTipo && matchesTexto && matchesCategoria && 
           matchesDataInicio && matchesDataFim &&
           matchesValorMin && matchesValorMax
  })
  
  // Aplicar ordenação
  return lancamentos.sort((a, b) => {
    let campoA, campoB
    
    switch (ordenacao.value.campo) {
      case 'data':
        campoA = new Date(a.data)
        campoB = new Date(b.data)
        break
      case 'valor':
        campoA = a.valor
        campoB = b.valor
        break
      case 'tipo':
        campoA = a.tipo
        campoB = b.tipo
        break
      case 'descricao':
        campoA = a.descricao.toLowerCase()
        campoB = b.descricao.toLowerCase()
        break
      case 'categoria':
        campoA = getCategoryName(a.categoriaId).toLowerCase()
        campoB = getCategoryName(b.categoriaId).toLowerCase()
        break
      default:
        return 0
    }
    
    if (campoA < campoB) return ordenacao.value.direcao === 'asc' ? -1 : 1
    if (campoA > campoB) return ordenacao.value.direcao === 'asc' ? 1 : -1
    return 0
  })
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

const saldoFiltrado = computed(() => {
  return totalReceitasFiltradas.value - totalDespesasFiltradas.value
})

// Ações
const editarLancamento = (lancamento) => {
  router.push(`/lancamentos/editar/${lancamento.id}`)
}

const confirmarExclusao = (lancamento) => {
  if (confirm(`Tem certeza que deseja excluir o lançamento "${lancamento.descricao}"?`)) {
    store.removerLancamento(lancamento.id)
  }
}
</script>

<style scoped>
/* Estilos para a tabela responsiva */
@media (max-width: 640px) {
  table {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* Estilo para linhas da tabela ao passar o mouse */
tbody tr:hover {
  background-color: #f9fafb;
}

/* Estilo para cabeçalhos ordenáveis */
th:hover {
  background-color: #f3f4f6;
}
</style>