import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Lancamentos from '../views/Lancamentos.vue'
import ReceitasDespesas from '../views/ReceitasDespesas.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { requerAuth: true }
  },
  { path: '/lancamentos', component: Lancamentos },
  { path: '/receitasdespesas', component: ReceitasDespesas },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Proteção de rotas
router.beforeEach((to, from, next) => {
  const usuarioLogado = localStorage.getItem('usuarioLogado')
  
  if (to.meta.requerAuth && !usuarioLogado) {
    next('/login')
  } else {
    next()
  }
})

export default router