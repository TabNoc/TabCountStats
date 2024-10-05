<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Tabs, Windows } from 'webextension-polyfill';
import Dropdown from 'primevue/dropdown';
import { TabSessionRepositoryV1 } from '~/logic/storage/TabSessionRepositoryV1';
import { adjustTitle } from '~/logic/WindowsHelper';

const props = defineProps<{
	tab: Tabs.Tab
	captureUrl: string
	windowsList: Map<number, Windows.Window>
}>();

const emit = defineEmits<{
	(e: 'skip', tab: Tabs.Tab, until: Date): void
	(e: 'move', tab: Tabs.Tab, windowId: number): void
	(e: 'close', tab: Tabs.Tab): void
	(e: 'switch', tab: Tabs.Tab): void
}>();

const tabSessionRepository = new TabSessionRepositoryV1();
const skipDurations = [
	{ text: '1 day', value: new Date(0, 0, 1 + 1, 0, 0, 0, 0) },
	{ text: '1 week', value: new Date(0, 0, 1 + 7, 0, 0, 0, 0) },
	{ text: '1 month', value: new Date(0, 1, 1, 0, 0, 0, 0) },
];
const selectedDuration = ref(skipDurations[0]);
const selectedWindow = ref(props.tab.windowId!);
const firstSeenDate = ref('');

const formatDate = (date: number): string => {
	return new Date(date).toLocaleString();
};

watch([props.tab], async () => {
	const date = await tabSessionRepository.getOldestLastAccessed(props.tab);
	firstSeenDate.value = date !== props.tab.lastAccessed ? formatDate(date) : '';
}, { immediate: true });
</script>

<template>
  <div class="border p-4 rounded bg-gray-100">
    <div class="flex items-center justify-center mb-2">
      <img :src="tab.favIconUrl" alt="Tab Icon" class="w-8 h-8 mr-2">
      <h2 class="text-xl font-bold">
        {{ tab.title }}
      </h2>
    </div>
    <p class="text-sm text-gray-600">
      {{ tab.url }}
    </p>
    <img :src="captureUrl" alt="Tab Screenshot" class="w-full h-auto rounded mb-2 max-h-[calc(100vh-545px)] object-contain">
    <div class="my-2">
      <div>
        <b>Window:</b>
        <Dropdown
          filter
          auto-filter-focus
          placeholder="Select a window"
          option-label="label"
          option-value="value"
          :model-value="selectedWindow"
          :options="Array.from(windowsList.values()).map((window) => ({ label: `${window.id!}: ${adjustTitle(window.title)}`, value: window.id }))"
        />
      </div>
      <div><b>last used:</b> {{ formatDate(tab.lastAccessed ?? 0) }}</div>
      <div v-if="firstSeenDate.length > 0">
        <b>first seen:</b> {{ firstSeenDate }}
      </div>
    </div>
    <div class="my-2">
      <label for="skip-duration" class="mr-2"><b>Skip for:</b></label>
      <select id="skip-duration" v-model="selectedDuration" class="border p-1 rounded">
        <option v-for="duration in skipDurations" :key="duration.text" :value="duration.value">
          {{ duration.text }}
        </option>
      </select>
      <button class="ml-2 bg-blue-500 text-white p-2 rounded" @click="emit('skip', $props.tab, selectedDuration.value)">
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
