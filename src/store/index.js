import { defineStore } from 'pinia'
import { ref } from 'vue' // Importando ref para possíveis reatividades

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
    ultimoTipoLancamento: 'despesa' // Valor padrão
  }),
  
  getters: {
    totalReceitas() {
      return this.lancamentos
        .filter(l => l.tipo === 'receita')
        .reduce((sum, l) => sum + (l.valor || 0), 0)
    },
    
    totalDespesas() {
      return this.lancamentos
        .filter(l => l.tipo === 'despesa')
        .reduce((sum, l) => sum + (l.valor || 0), 0)
    },
    
    saldo() {
      return this.totalReceitas - this.totalDespesas
    },
    
    categoriesData() {
      return this.categories.map(category => {
        const lancamentos = this.lancamentos.filter(l => l.categoriaId === category.id)
        const total = lancamentos.reduce((sum, l) => sum + (l.valor || 0), 0)
        
        return {
          ...category,
          total: Math.abs(total),
          count: lancamentos.length
        }
      }).filter(c => c.total > 0)
    },
    
    ultimosLancamentos() {
      return [...this.lancamentos]
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 5)
    }
  },
  
  actions: {
    async login(user) {
      try {
        this.user = user
        this.isLoading = true
        if (!this.lancamentos.length) {
          await this.loadInitialData()
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    removerLancamento(id) {
    this.lancamentos = this.lancamentos.filter(l => l.id !== id)
  },

    async adicionarLancamento(lancamento) {
    try {
      // Simula uma requisição assíncrona
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      this.lancamentos.unshift({
        ...lancamento,
        id: this.generateId(),
        data: lancamento.data || new Date().toISOString()
      })
    } catch (error) {
      throw error
    }
  },
    
    setUltimoTipoLancamento(tipo) {
      this.ultimoTipoLancamento = tipo
    },

    logout() {
      this.user = null
      // this.lancamentos = [] // Comentei para manter os dados (opcional)
    },
    
    async loadInitialData() {
      try {
        this.isLoading = true
        await this.fetchReceitas()
        await this.fetchDespesas()
        await this.fetchCategories()
      } catch (error) {
        this.error = error.message
        console.error('Erro ao carregar dados:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async fetchReceitas() {
      try {
        // Simulando uma chamada API - substitua pela sua implementação real
        // Exemplo com fetch:
        // const response = await fetch('/api/receitas')
        // const data = await response.json()
        // this.lancamentos = [...this.lancamentos, ...data]
        
        // Implementação temporária com dados mockados:
        const receitasMock = [
          { id: 101, descricao: 'Salário', valor: 5000, tipo: 'receita', categoriaId: 4, data: new Date() },
          { id: 102, descricao: 'Freelance', valor: 1200, tipo: 'receita', categoriaId: 4, data: new Date() }
        ]
        this.lancamentos = [...this.lancamentos, ...receitasMock]
      } catch (error) {
        console.error('Erro ao buscar receitas:', error)
        throw error
      }
    },
    
    async fetchDespesas() {
      try {
        // Implementação similar à fetchReceitas
        const despesasMock = [
          { id: 201, descricao: 'Aluguel', valor: 1500, tipo: 'despesa', categoriaId: 3, data: new Date() },
          { id: 202, descricao: 'Supermercado', valor: 450, tipo: 'despesa', categoriaId: 1, data: new Date() }
        ]
        this.lancamentos = [...this.lancamentos, ...despesasMock]
      } catch (error) {
        console.error('Erro ao buscar despesas:', error)
        throw error
      }
    },
    
    async fetchCategories() {
      // Se suas categorias forem dinâmicas, implemente a busca aqui
      // Por enquanto estamos usando as categorias fixas do state
      return this.categories
    },
    
    adicionarLancamento(lancamento) {
      const novoLancamento = {
        ...lancamento,
        id: this.generateId(),
        categoriaId: lancamento.categoriaId || 6,
        data: lancamento.data || new Date(),
        valor: parseFloat(lancamento.valor) || 0
      }
      this.lancamentos.unshift(novoLancamento)
    },
    
    generateId() {
      return this.lancamentos.length > 0 
        ? Math.max(...this.lancamentos.map(l => l.id)) + 1 
        : 1
    }
  },
  
  persist: true
})