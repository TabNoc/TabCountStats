<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
router.isReady().then(() => {
	if (route.query.href !== undefined)
		router.push({ path: route.query.href as string });
});

</script>

<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200 flex flex-col justify-between">
    <router-view />
  </main>
</template>
