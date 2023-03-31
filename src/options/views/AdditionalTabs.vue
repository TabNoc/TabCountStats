<script setup lang="ts">
import type { Ref } from 'vue';
import type { Tabs, Windows } from 'webextension-polyfill';
import TabEntry from './TabEntry.vue';

const displayTabs: Ref<Tabs.Tab[]> = ref([]);
const onlyCurrentWindow = ref(false);
const tabFilter = ref('');
const tabCount = ref(0);

watch([onlyCurrentWindow, tabFilter], ([newOnlyCurrentWindow, newTabFilter]) => {
	newTabFilter = newTabFilter.toLowerCase();
	displayTabs.value = [];
	browser.tabs.query({ currentWindow: newOnlyCurrentWindow ? true : undefined })
		.then((tabs) => {
			return tabs.filter(tab => tab.title?.toLowerCase().includes(newTabFilter));
		})
		.then((tabs) => {
			tabCount.value = tabs.length;
			shuffleArray(tabs);
			return tabs.slice(0, Math.min(tabs.length, 25));
		})
		.then((tabs) => {
			displayTabs.value = tabs;
		});
}, { immediate: true });

function shuffleArray(array: Array<any>) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

const filterText = computed(() => {
	return ` (${displayTabs.value.length}/${tabCount.value})`;
});

const windowsList: Ref<Map<number, Windows.Window>> = ref(new Map());
browser.windows.getAll().then((windows) => {
	windowsList.value = new Map(windows.map(w => [w.id!, w]));
});
// using https://flowbite.com/docs/components/forms/
</script>

<template>
  <h1>Additional - Tabs</h1>

  <div class="m-auto">
    <div class="w-124">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-6">
          <label for="tabFilter" class="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Tab filter{{ filterText }}</label>
          <input id="tabFilter" v-model="tabFilter" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="search for tab title">
        </div>
        <div class="flex items-start mb-6">
          <div class="flex items-center h-5">
            <input id="onlyCurrentWindow" v-model="onlyCurrentWindow" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800">
          </div>
          <label for="onlyCurrentWindow" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Only tabs from current window</label>
        </div>
      </form>
    </div>
  </div>

  <div v-for="tab in displayTabs" :key="tab.id">
    <Suspense>
      <TabEntry :tab="tab" :windows-list="windowsList" />
    </Suspense>
  </div>
</template>

<style>
.currentWindowEntryWrapper {
	background-color: #e7e7e7;
	border-radius: 25px;
	border: 1px solid #999999;
}
</style>
