<template>
  <div class="bg-white rounded-xl shadow-lg p-6" :class="{'ring-2 ring-blue-500': highlight}">
    <div class="flex items-center">
      <span class="text-2xl mr-3">{{ icon }}</span>
      <div>
        <h3 class="text-gray-500 font-medium">{{ title }}</h3>
        <p class="text-2xl font-bold mt-1" :class="positive ? 'text-green-600' : 'text-red-600'">
          R$ {{ value.toFixed(2).replace('.', ',') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: Number,
  positive: Boolean,
  icon: {
    type: String,
    default: '💰'
  },
  highlight: Boolean
})
</script>