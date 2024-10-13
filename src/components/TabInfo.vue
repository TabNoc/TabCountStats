<script setup lang="ts">
import { ref } from 'vue';
import type { Tabs, Windows } from 'webextension-polyfill';
import Dropdown from 'primevue/dropdown';
import BoldedDescriptor from './BoldedDescriptor.vue';
import { TabSessionRepositoryV1 } from '~/logic/storage/TabSessionRepositoryV1';
import { adjustTitle } from '~/logic/WindowsHelper';
import { getFirstSeenDateString, getLastUsedDateString } from '~/logic/TabsHelper';

const props = defineProps<{
	tab: Tabs.Tab
	captureUrl: string
	windowsList: Map<number, Windows.Window>
}>();

const emit = defineEmits<{
	(e: 'skip', tab: Tabs.Tab, amountInMs: number): void
	(e: 'move', tab: Tabs.Tab, windowId: number | undefined): void
	(e: 'close', tab: Tabs.Tab): void
	(e: 'switch', tab: Tabs.Tab): void
}>();

const tabSessionRepository = new TabSessionRepositoryV1();
const skipDurations = [
	{ label: 'Just Now', value: 0 * 1000 },
	{ label: '1 day', value: 1 * 24 * 60 * 60 * 1000 },
	{ label: '1 week', value: 7 * 24 * 60 * 60 * 1000 },
	{ label: '1 month', value: 30 * 24 * 60 * 60 * 1000 },
];
const windowsOptionsList = Array.from(props.windowsList.values()).map(window => ({ label: `${window.id!}: ${adjustTitle(window.title)}`, value: window.id }));
const selectedDuration = ref(skipDurations[0].value);
const selectedWindow = ref(props.tab.windowId);

async function onClickImg() {
	if (props.captureUrl && props.captureUrl.length > 0) {
		emit('switch', props.tab);
	}
	else {
		const id = (await browser.tabs.getCurrent()).id;
		browser.tabs.update(props.tab.id, { active: true }).then(() => browser.tabs.update(id, { active: true }));
	}
}
</script>

<template>
  <div class="border p-4 rounded bg-gray-100">
    <div class="flex items-center justify-center mb-2">
      <h2 class="text-xl font-italic mr-2 text-gray-400 ">
        [{{ tab.id }}]
      </h2>
      <img :src="tab.favIconUrl" alt="Tab Icon" class="w-8 h-8 mr-2">
      <h2 class="text-xl font-bold">
        {{ tab.title }}
      </h2>
    </div>
    <p class="text-sm text-gray-600 text-truncate">
      {{ tab.url }}
    </p>
    <img
      :src="captureUrl"
      alt="Tab Screenshot is loading ..."
      class="w-full rounded mb-2 h-[calc(100vh-31rem)] object-contain cursor-pointer"
      @click="onClickImg"
    >
    <BoldedDescriptor text="first seen:" :content="getFirstSeenDateString(tabSessionRepository, tab)" />
    <BoldedDescriptor text="last used:" :content="getLastUsedDateString(tab)" />
    <div class="my-1">
      <b>Window:</b>
      <Dropdown
        filter
        auto-filter-focus
        placeholder="Select a window"
        option-label="label"
        option-value="value"
        :model-value="selectedWindow"
        :options="windowsOptionsList"
        @change="selectedWindow = $event.value"
      />
    </div>
    <div class="my-1">
      <b>Skip for:</b>
      <Dropdown
        filter
        auto-filter-focus
        placeholder="Select a skip amount"
        option-label="label"
        option-value="value"
        :model-value="selectedDuration"
        :options="skipDurations"
        @change="selectedDuration = $event.value"
      />
      <button class="ml-2 bg-blue-500 text-white p-2 rounded" @click="emit('skip', $props.tab, selectedDuration)">
        Skip
      </button>
    </div>
    <button class="bg-yellow-500 text-white p-2 rounded mr-2" @click="emit('move', $props.tab, selectedWindow)">
      Move to another window
    </button>
    <button class="bg-red-500 text-white p-2 rounded mr-2" @click="emit('close', $props.tab)">
      Close Tab
    </button>
    <button class="bg-green-500 text-white p-2 rounded" @click="emit('switch', $props.tab)">
      Switch to Tab
    </button>
  </div>
</template>
