<script setup lang="ts">
import type { Ref } from 'vue';
import type { Tabs, Windows } from 'webextension-polyfill';

const displayTabs: Ref<Tabs.Tab[]> = ref([]);

function switchToWindow(windowId?: number) {
	if (windowId !== undefined) {
		browser.windows.update(windowId, {
			focused: true,
		});
	}
}

function switchToTab(choosenTab: Tabs.Tab): void {
	if (choosenTab.windowId !== undefined) {
		browser.tabs.update(choosenTab.id, {
			active: true,
		});
		switchToWindow(choosenTab.windowId);
	}
}

const onlyCurrentWindow = ref(false);

watch(onlyCurrentWindow, (newValue) => {
	displayTabs.value = [];
	browser.tabs.query({ currentWindow: newValue ? true : undefined }).then((tabs) => {
		shuffleArray(tabs);
		displayTabs.value = tabs.slice(0, Math.min(tabs.length, 25));
		console.log(displayTabs.value);
	});
}, { immediate: true });

function shuffleArray(array: Array<any>) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

const windowsList: Ref<Map<number, Windows.Window>> = ref(new Map());
browser.windows.getAll().then((windows) => {
	windowsList.value = new Map(windows.map(w => [w.id!, w]));
});
</script>

<template>
  <h1>Additional - Tabs</h1>

  <label for="onlyCurrentWindow" class="mb-4">
    <input id="onlyCurrentWindow" v-model="onlyCurrentWindow" type="checkbox">
    <span> Only current window</span>
  </label>

  <div v-for="tab in displayTabs" :key="tab.id">
    <div class=" m-1 flex flex-col rounded-3xl border-gray-500 border-2 border-dotted">
      <div class="m-1">
        <a href="#" class="p-1 currentWindowEntryWrapper inline-block" :title="tab.url" @click.prevent="switchToTab(tab)"><img :src="tab.favIconUrl" class="inline-block w-4 mb-1 mx-1">{{ tab.title }}</a>
      </div>

      <div class="grid grid-rows-1 grid-cols-3 justify-center m-auto w-1/2 items-center">
        <div>last used: {{ new Date(tab.lastAccessed??0).toLocaleString() }}</div>
        |
        <div>{{ windowsList.get(tab.windowId!)?.title }}</div>
      </div>
    </div>
  </div>
</template>

<style>
.currentWindowEntryWrapper {
	background-color: #e7e7e7;
	border-radius: 25px;
	border: 1px solid #999999;
}
</style>
