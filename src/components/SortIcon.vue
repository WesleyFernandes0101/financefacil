<template>
  <span class="ml-1">
    <svg 
      v-if="direction === 'asc'"
      xmlns="http://www.w3.org/2000/svg" 
      class="h-4 w-4 inline" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path fill-rule="evenodd" d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" clip-rule="evenodd" />
    </svg>
    <svg 
      v-else-if="direction === 'desc'"
      xmlns="http://www.w3.org/2000/svg" 
      class="h-4 w-4 inline" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clip-rule="evenodd" />
    </svg>
    <svg 
      v-else
      xmlns="http://www.w3.org/2000/svg" 
      class="h-4 w-4 inline opacity-30" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path fill-rule="evenodd" d="M11.47 4.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 01-1.06-1.06l3.75-3.75zm-3.75 9.75a.75.75 0 011.06 0L12 17.69l3.22-3.22a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 010-1.06z" clip-rule="evenodd" />
    </svg>
  </span>
</template>

<script setup>
defineProps({
  direction: {
    type: String,
    validator: value => ['asc', 'desc', null].includes(value),
    default: null
  }
})
</script>