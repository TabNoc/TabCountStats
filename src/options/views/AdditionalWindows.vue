<script setup lang="ts">
import type { Ref } from 'vue';
import type { Windows } from 'webextension-polyfill';
import { adjustTitle } from '~/logic/WindowsHelper';

const displayWindows: Ref<Windows.Window[]> = ref([]);

function switchToWindow(windowId?: number) {
	if (windowId !== undefined) {
		browser.windows.update(windowId, {
			focused: true,
		});
	}
}

const windowsList: Ref<Map<number, Windows.Window>> = ref(new Map());
const windowMap = new Map<number, number>();

browser.tabs.query({}).then((tabs) => {
	for (const tab of tabs)
		windowMap.set(tab.windowId ?? 0, (windowMap.get(tab.windowId ?? 0) ?? 0) + 1);
}).then(() => {
	browser.windows.getAll().then((windows) => {
		displayWindows.value = windows.sort((a, b) => (windowMap.get(b.id ?? 0) ?? 0) - (windowMap.get(a.id ?? 0) ?? 0));
		windowsList.value = new Map(windows.map(w => [w.id!, w]));
	});
});
</script>

<template>
  <h1>Additional - Windows</h1>

  <div v-for="window in displayWindows" :key="window.id">
    <div class=" m-1 flex flex-col rounded-3xl border-gray-500 border-2 border-dotted">
      <div class="m-1">
        <a href="#" class="p-1 currentWindowEntryWrapper inline-block" :title="window.id?.toString()" @click.prevent="switchToWindow(window.id)">{{ adjustTitle(window.title) }}</a>
      </div>

      <div class="grid grid-rows-1 grid-cols-3 justify-center m-auto w-1/2 items-center">
        <div>Tabs: {{ windowMap.get(window.id ?? 0) }}</div>
        |
        <div>{{ adjustTitle(window.title) }}</div>
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
