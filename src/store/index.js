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
    ]
  }),
  getters: {
    totalReceitas() {
      return this.lancamentos
        .filter(l => l.tipo === 'receita')
        .reduce((sum, l) => sum + l.valor, 0)
    },
    totalDespesas() {
      return this.lancamentos
        .filter(l => l.tipo === 'despesa')
        .reduce((sum, l) => sum + l.valor, 0)
    },
    saldo() {
      return this.totalReceitas - this.totalDespesas
    },
    // Dados para gráficos
    chartData() {
      return {
        bar: {
          labels: ['Receitas', 'Despesas'],
          datasets: [{
            label: 'Valores (R$)',
            data: [this.totalReceitas, this.totalDespesas],
            backgroundColor: ['#4CAF50', '#F44336']
          }]
        },
        pie: {
          labels: this.categoriesData.map(c => c.name),
          datasets: [{
            data: this.categoriesData.map(c => c.total),
            backgroundColor: this.categoriesData.map(c => c.color)
          }]
        },
        line: this.prepareLineChartData()
      }
    },
    // Dados agrupados por categoria
    categoriesData() {
      return this.categories.map(category => {
        const lancamentos = this.lancamentos.filter(l => l.categoriaId === category.id)
        const total = lancamentos.reduce((sum, l) => sum + l.valor, 0)
        
        return {
          ...category,
          total: Math.abs(total),
          count: lancamentos.length
        }
      }).filter(c => c.total > 0)
    },
    // Últimos lançamentos (para tabela/dashboard)
    ultimosLancamentos() {
      return [...this.lancamentos]
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 5)
    }
  },
  actions: {
    login(user) {
      this.user = user
      if (!this.lancamentos.length) {
        this.carregarDadosIniciais()
      }
    },
    logout() {
      this.user = null
      this.lancamentos = [] // Opcional: limpar dados ao sair
      // Adicione aqui qualquer outra limpeza necessária
    },
    adicionarLancamento(lancamento) {
      const novoLancamento = {
        ...lancamento,
        id: this.generateId(),
        categoriaId: lancamento.categoriaId || 6, // Default para "Outros"
        data: lancamento.data || new Date()
      }
      this.lancamentos.unshift(novoLancamento) // Adiciona no início do array
    },
    carregarDadosIniciais() {
      const exemplos = [
        { id: 1, descricao: 'Salário', valor: 5000, tipo: 'receita', categoriaId: 4, data: new Date('2023-01-05') },
        { id: 2, descricao: 'Aluguel', valor: 1500, tipo: 'despesa', categoriaId: 3, data: new Date('2023-01-10') },
        { id: 3, descricao: 'Supermercado', valor: 800, tipo: 'despesa', categoriaId: 1, data: new Date('2023-01-15') },
        { id: 4, descricao: 'Transporte', valor: 300, tipo: 'despesa', categoriaId: 2, data: new Date('2023-01-20') },
        { id: 5, descricao: 'Dividendos', valor: 200, tipo: 'receita', categoriaId: 5, data: new Date('2023-01-25') }
      ]
      this.lancamentos = exemplos
    },
    // Métodos auxiliares
    generateId() {
      return this.lancamentos.length > 0 
        ? Math.max(...this.lancamentos.map(l => l.id)) + 1 
        : 1
    },
    prepareLineChartData() {
      // Agrupa por mês (implementação básica - pode ser melhorada)
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
      
      const receitasPorMes = Array(12).fill(0)
      const despesasPorMes = Array(12).fill(0)
      
      this.lancamentos.forEach(l => {
        const mes = new Date(l.data).getMonth()
        if (l.tipo === 'receita') receitasPorMes[mes] += l.valor
        else despesasPorMes[mes] += l.valor
      })
      
      return {
        labels: meses,
        datasets: [
          {
            label: 'Receitas',
            data: receitasPorMes,
            borderColor: '#4CAF50',
            tension: 0.1
          },
          {
            label: 'Despesas',
            data: despesasPorMes,
            borderColor: '#F44336',
            tension: 0.1
          }
        ]
      }
    }
  },
  persist: true // Opcional: Habilita persistência no localStorage
})

// // Para acessar os dados dos gráficos:
// const store = useFinanceStore()

// // Gráfico de barras
// const barData = store.chartData.bar

// // Gráfico de pizza
// const pieData = store.chartData.pie

// // Gráfico de linhas
// const lineData = store.chartData.line

// // Últimos lançamentos
// const ultimos = store.ultimosLancamentos