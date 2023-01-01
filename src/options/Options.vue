<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200 flex flex-col justify-between">
    <router-view />
  </main>
</template>
