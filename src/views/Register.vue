<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-50">
    <div class="bg-white p-8 rounded-lg shadow-md w-80">
      <h1 class="text-2xl font-bold mb-6 text-center">Cadastro</h1>

      <input v-model="email" class="input" placeholder="Email" type="email" />
      <input v-model="senha" type="password" class="input" placeholder="Senha" />

      <div v-if="mensagemErro" class="text-red-600 text-sm mb-4 text-center">
        {{ mensagemErro }}
      </div>

      <button class="btn" @click="registrar">Cadastrar</button>

      <router-link to="/login" class="block mt-4 text-center text-blue-500 hover:underline">
        Já tem conta? Entrar
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const senha = ref('')
const mensagemErro = ref('')

const registrar = () => {
  mensagemErro.value = ''

  const emailTrim = email.value.trim()
  const senhaTrim = senha.value.trim()

  if (!emailTrim || !senhaTrim) {
    mensagemErro.value = 'Preencha todos os campos!'
    return
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')

  const jaExiste = usuarios.some(u => u.email.toLowerCase() === emailTrim.toLowerCase())

  if (jaExiste) {
    mensagemErro.value = 'Este email já está cadastrado!'
    return
  }

  usuarios.push({
    email: emailTrim,
    senha: senhaTrim,
    id: Date.now()
  })

  localStorage.setItem('usuarios', JSON.stringify(usuarios))
  router.push('/login')
}
</script>

<style scoped>
.input {
  @apply w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500;
}
.btn {
  @apply w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition;
}
</style>
