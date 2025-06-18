<script setup>
import { ref, onMounted, watch } from 'vue' // Adicionei watch aqui
import { useFinanceStore } from '../store'
import { useRouter, onBeforeRouteLeave } from 'vue-router'

const router = useRouter()
const store = useFinanceStore()

// Estados reativos
const tipoSelecionado = ref('despesa')
const descricao = ref('')
const valor = ref('')
const categoria = ref('')
const data = ref(new Date().toISOString().split('T')[0])
const isLoading = ref(false)
const hasChanges = ref(false)

// Observa mudanças nos campos para detectar alterações
watch([descricao, valor, categoria, data], () => {
  hasChanges.value = true
}, { deep: true })

// Configura tipo automaticamente ao montar o componente
onMounted(() => {
  try {
    tipoSelecionado.value = store.ultimoTipoLancamento || 'despesa'
  } catch (error) {
    console.error('Erro ao carregar tipo de lançamento:', error)
    tipoSelecionado.value = 'despesa'
  }
})

// Confirmação ao sair sem salvar
onBeforeRouteLeave((to, from, next) => {
  try {
    if (hasChanges.value && !confirm('Tem certeza que deseja sair? As alterações não serão salvas.')) {
      return next(false)
    }
    next()
  } catch (error) {
    console.error('Erro no hook de navegação:', error)
    next()
  }
})

// Salva o lançamento com tratamento de erros
const salvarLancamento = async () => {
  if (isLoading.value) return
  
  try {
    isLoading.value = true
    
    // Validação básica
    if (!descricao.value || !valor.value || !categoria.value || !data.value) {
      throw new Error('Preencha todos os campos obrigatórios')
    }

    const lancamento = {
      tipo: tipoSelecionado.value,
      descricao: descricao.value,
      valor: parseFloat(valor.value),
      categoria: categoria.value,
      data: data.value,
      id: Date.now() // ID temporário
    }
    
    await store.adicionarLancamento(lancamento)
    hasChanges.value = false
    router.push('/dashboard')
    
  } catch (error) {
    console.error('Erro ao salvar lançamento:', error)
    alert(error.message || 'Ocorreu um erro ao salvar o lançamento')
  } finally {
    isLoading.value = false
  }
}

// Função para voltar com tratamento de erros
const voltar = () => {
  try {
    if (hasChanges.value && !confirm('Tem certeza que deseja sair? As alterações não serão salvas.')) {
      return
    }
    router.go(-1)
  } catch (error) {
    console.error('Erro ao voltar:', error)
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    
    <div class="container mx-auto p-6 max-w-md">
      <div class="bg-white rounded-lg shadow-md p-6">
        <!-- Cabeçalho com botão de voltar -->
        <div class="flex items-center mb-6">
          <button 
            @click="voltar"
            class="mr-4 p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Voltar"
            :disabled="isLoading"
          >
            <svg 
    xmlns="http://www.w3.org/2000/svg" 
    class="h-5 w-5 mr-2" 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
  </svg>
          </button>
          <h2 class="text-2xl font-bold text-gray-800">
            {{ tipoSelecionado === 'receita' ? 'Nova Receita' : 'Nova Despesa' }}
          </h2>
        </div>
        
        <form @submit.prevent="salvarLancamento" class="space-y-4">
          <!-- Campos do formulário (mantidos iguais) -->
          <!-- Campo Descrição -->
          <div>
            <label class="block text-gray-700 mb-2">Descrição:</label>
            <input 
              v-model="descricao"
              type="text" 
              class="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Salário mensal, Aluguel"
              required
            />
          </div>
          
          <!-- Campo Valor -->
          <div>
            <label class="block text-gray-700 mb-2">Valor (R$):</label>
            <input 
              v-model="valor"
              type="number" 
              step="0.01"
              min="0"
              class="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0,00"
              required
            />
          </div>
          
          <!-- Campo Categoria -->
          <div>
            <label class="block text-gray-700 mb-2">Categoria:</label>
            <select 
              v-model="categoria"
              class="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="" disabled selected>Selecione uma categoria</option>
              <option 
                v-for="cat in store.categories.filter(c => c.tipo === tipoSelecionado || c.tipo === 'ambos')" 
                :value="cat.name"
                :key="cat.id"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>
          
          <!-- Campo Data -->
          <div>
            <label class="block text-gray-700 mb-2">Data:</label>
            <input 
              v-model="data"
              type="date" 
              class="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <!-- Botões de Ação -->
          <div class="flex justify-between pt-4">
            <button
              type="button"
              @click="voltar"
              class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition flex items-center"
              :disabled="isLoading"
            >
              <svg 
    xmlns="http://www.w3.org/2000/svg" 
    class="h-5 w-5 mr-2" 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
  </svg>
              Voltar
            </button>
            
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center justify-center"
              :disabled="isLoading"
            >
              <span v-if="isLoading">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </span>
              <span v-else>
                Salvar Lançamento
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos melhorados para feedback visual */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:disabled:hover {
  background-color: initial;
  border-color: initial;
}

input:disabled, select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

/* Melhoria no foco dos campos */
input:focus, select:focus {
  outline: none;
  ring-width: 2px;
  ring-color: #3b82f6;
  border-color: #3b82f6;
}
</style>