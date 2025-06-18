<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-50">
    <div class="bg-white p-8 rounded-lg shadow-md w-80">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>

      <input v-model="email" class="input" placeholder="Email" type="email" />
      <input v-model="senha" type="password" class="input" placeholder="Senha" />

      <div v-if="mensagemErro" class="text-red-600 text-sm mb-4 text-center">
        {{ mensagemErro }}
      </div>

      <div class="flex justify-center">
        <button class="btn" @click="entrar">Entrar</button>
      </div>

      <router-link to="/register" class="block mt-4 text-center text-blue-500 hover:underline">
        Criar nova conta
      </router-link>

      <!-- Apenas para desenvolvimento
      <div v-if="ambienteDesenvolvimento" class="mt-8 p-4 bg-gray-100 rounded-lg text-center text-sm">
        <p class="font-semibold mb-1">Login de teste:</p>
        <p>Email: <code class="font-mono">teste@example.com</code></p>
        <p>Senha: <code class="font-mono">123456</code></p>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useFinanceStore } from '../store'
import { ref } from 'vue'

const router = useRouter()
const store = useFinanceStore()

const email = ref('')
const senha = ref('')
const mensagemErro = ref('')
const ambienteDesenvolvimento = import.meta.env.MODE === 'development'

const entrar = () => {
  mensagemErro.value = ''

  const emailTrim = email.value.trim()
  const senhaTrim = senha.value.trim()

  // Usuário de teste
  if (
    ambienteDesenvolvimento &&
    emailTrim === 'teste@example.com' &&
    senhaTrim === '123456'
  ) {
    store.login({ email: emailTrim })
    router.push('/dashboard')
    return
  }

  // Usuários reais do localStorage
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
  const usuario = usuarios.find(
    (u) => u.email === emailTrim && u.senha === senhaTrim
  )

  if (usuario) {
    store.login({ email: usuario.email })
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario))
    router.push('/dashboard')
  } else {
    mensagemErro.value = 'Email ou senha incorretos.'
  }
}
</script>

<style scoped>
.input {
  @apply w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500;
}
.btn {
  @apply w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition;
}
</style>
