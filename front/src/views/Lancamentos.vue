<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    
    <div class="container mx-auto p-6 max-w-md">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Adicionar Lançamento</h2>
        
        <div class="space-y-4">
          <!-- Campo Descrição -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input
              v-model="descricao"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Salário, Aluguel, Supermercado"
            />
          </div>
          
          <!-- Campo Valor -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
            <input
              v-model.number="valor"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0,00"
            />
          </div>
          
          <!-- Campo Tipo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              v-model="tipo"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
          </div>
          
          <!-- Campo Categoria -->
          <div v-if="tipo === 'despesa' || tipo === 'receita'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              v-model="categoriaId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option 
                v-for="category in filteredCategories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <!-- Botão de ação -->
          <button
            @click="adicionar"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            :disabled="!isFormValid"
          >
            Adicionar Lançamento
          </button>
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

// Dados do formulário
const descricao = ref('')
const valor = ref(0)
const tipo = ref('receita')
const categoriaId = ref(1) // Valor padrão

// Filtra categorias baseadas no tipo selecionado
const filteredCategories = computed(() => {
  return store.categories.filter(c => 
    c.tipo === tipo.value || c.tipo === 'ambos'
  )
})

// Validação do formulário
const isFormValid = computed(() => {
  return descricao.value.trim() !== '' && valor.value > 0
})

const adicionar = () => {
  if (!isFormValid.value) return
  
  store.adicionarLancamento({ 
    descricao: descricao.value,
    valor: parseFloat(valor.value),
    tipo: tipo.value,
    categoriaId: parseInt(categoriaId.value)
  })
  
  // Reset do formulário
  descricao.value = ''
  valor.value = 0
  tipo.value = 'receita'
  categoriaId.value = 1
}
</script>

<style scoped>
/* Estilos podem ser adicionados aqui se necessário */
</style>