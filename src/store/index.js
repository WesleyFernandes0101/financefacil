import { defineStore } from 'pinia'

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    user: null,
    lancamentos: [],
    categories: [
      { id: 1, name: 'Alimentação', tipo: 'despesa', color: '#FF6384' },
      { id: 2, name: 'Transporte', tipo: 'despesa', color: '#36A2EB' },
      { id: 3, name: 'Moradia', tipo: 'despesa', color: '#FFCE56' },
      { id: 4, name: 'Salário', tipo: 'receita', color: '#4BC0C0' },
      { id: 5, name: 'Investimentos', tipo: 'receita', color: '#9966FF' },
      { id: 6, name: 'Outros', tipo: 'ambos', color: '#FF9F40' }
    ],
    isLoading: false,
    error: null,
    ultimoTipoLancamento: 'despesa',
    dataCarregada: false // ⚠️ novo controle
  }),

  getters: {
    totalReceitas(state) {
      return state.lancamentos
        .filter(l => l.tipo === 'receita')
        .reduce((sum, l) => sum + (l.valor || 0), 0)
    },

    totalDespesas(state) {
      return state.lancamentos
        .filter(l => l.tipo === 'despesa')
        .reduce((sum, l) => sum + (l.valor || 0), 0)
    },

    saldo() {
      return this.totalReceitas - this.totalDespesas
    },

    categoriesData(state) {
      return state.categories.map(category => {
        const lancamentos = state.lancamentos.filter(l => l.categoriaId === category.id)
        const total = lancamentos.reduce((sum, l) => sum + (l.valor || 0), 0)

        return {
          ...category,
          total: Math.abs(total),
          count: lancamentos.length
        }
      }).filter(c => c.total > 0)
    },

    ultimosLancamentos(state) {
      return [...state.lancamentos]
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 5)
    }
  },

  actions: {
    async login(user) {
      const isNovoUsuario = !this.user || this.user?.id !== user?.id
      
      if (isNovoUsuario) {
        // Modificação importante: Reset mais completo
        this.$patch({
          lancamentos: [],
          dataCarregada: false,
          ultimoTipoLancamento: 'despesa'
        })
        this.user = user
        
        // Carrega dados mockados APENAS para demonstração
        if (import.meta.env.MODE === 'development') {
          await this.loadInitialData()
        }
      } else {
        this.user = user
      }
    },

    logout() {
      // Adiciona limpeza de persistência
      this.$reset()
      localStorage.removeItem('finance') // Remove especificamente este store
    },

    setUltimoTipoLancamento(tipo) {
      this.ultimoTipoLancamento = tipo
    },

    removerLancamento(id) {
      this.lancamentos = this.lancamentos.filter(l => l.id !== id)
    },

    adicionarLancamento(lancamento) {
      const novoLancamento = {
        ...lancamento,
        id: this.generateId(),
        categoriaId: lancamento.categoriaId || 6,
        data: lancamento.data || new Date().toISOString(),
        valor: parseFloat(lancamento.valor) || 0
      }
      this.lancamentos.unshift(novoLancamento)
    },

    generateId() {
      return this.lancamentos.length > 0
        ? Math.max(...this.lancamentos.map(l => l.id)) + 1
        : 1
    },

    async loadInitialData() {
      if (this.dataCarregada || !this.user) return

      this.isLoading = true
      try {
        // Modificação: Verifica se é um novo usuário antes de carregar mocks
        if (this.lancamentos.length === 0) {
          await this.fetchReceitas()
          await this.fetchDespesas()
        }
        this.dataCarregada = true
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    async fetchReceitas() {
      const receitasMock = [
        // { id: 101, descricao: 'Salário', valor: 5000, tipo: 'receita', categoriaId: 4, data: new Date().toISOString() },
        // { id: 102, descricao: 'Freelance', valor: 1200, tipo: 'receita', categoriaId: 4, data: new Date().toISOString() }
      ]
      this.lancamentos.push(...receitasMock)
    },

    async fetchDespesas() {
      const despesasMock = [
        // { id: 201, descricao: 'Aluguel', valor: 1500, tipo: 'despesa', categoriaId: 3, data: new Date().toISOString() },
        // { id: 202, descricao: 'Supermercado', valor: 450, tipo: 'despesa', categoriaId: 1, data: new Date().toISOString() }
      ]
      this.lancamentos.push(...despesasMock)
    }
  },

  persist: {
    key: 'finance-store',
    paths: [
      'user',
      'ultimoTipoLancamento',
      'categories' // Apenas itens que devem persistir entre logins
    ],
    afterRestore: (ctx) => {
      // Garante que lançamentos sejam resetados ao restaurar
      if (ctx.store.user === null) {
        ctx.store.lancamentos = []
        ctx.store.dataCarregada = false
      }
    }
  }
})
