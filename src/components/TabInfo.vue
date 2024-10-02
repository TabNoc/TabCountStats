<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Tabs, Windows } from 'webextension-polyfill';
import { TabSessionRepositoryV1 } from '~/logic/storage/TabSessionRepositoryV1';
import { adjustTitle } from '~/logic/WindowsHelper';

const props = defineProps<{
	tab: Tabs.Tab
	captureUrl: string
	windowsList: Map<number, Windows.Window>
	onSkip: (tab: Tabs.Tab, duration: string) => void
	onMove: (tab: Tabs.Tab, window: Windows.Window) => void
	onClose: (tab: Tabs.Tab) => void
	onSwitch: (tab: Tabs.Tab) => void
}>();

const tabSessionRepository = new TabSessionRepositoryV1();
const skipDurations = ['1 day', '1 week', '1 month'];
const selectedDuration = ref(skipDurations[0]);
const firstSeenDate = ref('');

const formatDate = (date: number): string => {
	return new Date(date).toLocaleString();
};

watch([props.tab], async () => {
	const date = await tabSessionRepository.getOldestLastAccessed(props.tab);
	firstSeenDate.value = date !== props.tab.lastAccessed ? formatDate(date) : '';
}, { immediate: true });

const windowTitle = computed(() => {
	return adjustTitle(props.windowsList.get(props.tab.windowId!)?.title || '');
});
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
      <div><b>Window:</b> {{ windowTitle }}</div>
      <div><b>last used:</b> {{ formatDate(tab.lastAccessed ?? 0) }}</div>
      <div v-if="firstSeenDate.length > 0">
        <b>first seen:</b> {{ firstSeenDate }}
      </div>
    </div>
    <div class="my-2">
      <label for="skip-duration" class="mr-2"><b>Skip for:</b></label>
      <select id="skip-duration" v-model="selectedDuration" class="border p-1 rounded">
        <option v-for="duration in skipDurations" :key="duration" :value="duration">
          {{ duration }}
        </option>
      </select>
      <button class="ml-2 bg-blue-500 text-white p-2 rounded" @click="props.onSkip($props.tab, selectedDuration)">
        Skip
      </button>
    </div>
    <button class="bg-yellow-500 text-white p-2 rounded mr-2" @click="props.onMove">
      Move to another window
    </button>
    <button class="bg-red-500 text-white p-2 rounded mr-2" @click="props.onClose($props.tab)">
      Close Tab
    </button>
    <button class="bg-green-500 text-white p-2 rounded" @click="props.onSwitch($props.tab)">
      Switch to Tab
    </button>
  </div>
</template>
