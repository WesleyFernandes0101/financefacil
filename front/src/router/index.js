import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Lancamentos from '../views/Lancamentos.vue'
import Gastos from '../views/Gastos.vue'
import Relatorios from '../views/Relatorios.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/lancamentos', component: Lancamentos },
  { path: '/gastos', component: Gastos },
  { path: '/relatorios', component: Relatorios }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})