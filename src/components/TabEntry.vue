<script setup lang="ts">
import type { DropdownChangeEvent } from 'primevue/dropdown';
import Dropdown from 'primevue/dropdown';
import type { Tabs, Windows } from 'webextension-polyfill';
import { TabSessionRepositoryV1 } from '~/logic/storage/TabSessionRepositoryV1';
import { adjustTitle } from '~/logic/WindowsHelper';

const props = defineProps<{
	tab: Tabs.Tab
	windowsList: Map<number, Windows.Window>
}>();

const emit = defineEmits<{
	(e: 'move', tab: Tabs.Tab, windowId: number): void
	(e: 'switch', tab: Tabs.Tab): void
}>();
const tabSessionRepository = new TabSessionRepositoryV1();
const dateString = props.tab.lastAccessed !== await tabSessionRepository.getOldestLastAccessed(props.tab)
	? `first seen: ${formatDate(await tabSessionRepository.getOldestLastAccessed(props.tab))}`
	: '';
const expandWindow = ref(false);

function formatDate(date: number): string {
	return new Date(date).toLocaleString();
}

function moveToWindow(event: DropdownChangeEvent): void {
	// eslint-disable-next-line vue/no-mutating-props
	props.tab.windowId = event.value;
	emit('move', props.tab, event.value);
}
</script>

<template>
  <div class=" m-1 flex flex-col rounded-3xl border-gray-500 border-2 border-dotted">
    <div class="m-1">
      <a
        href="#" class="p-1 currentWindowEntryWrapper inline-block" :title="tab.url"
        @click.prevent="emit('switch', tab)"
      ><img :src="tab.favIconUrl" class="inline-block w-4 mb-1 mx-1">{{
        adjustTitle(tab.title) }}</a>
    </div>

    <div class="grid grid-rows-1 grid-cols-3 justify-center m-auto w-1/2 items-center">
      <div>
        <div>last used: {{ formatDate(tab.lastAccessed ?? 0) }}</div>
        <div>{{ dateString }}</div>
      </div>
      |
      <div @click="expandWindow = true">
        <div v-if="expandWindow">
          <Dropdown
            filter
            auto-filter-focus
            placeholder="Select a window"
            option-label="label"
            option-value="value"
            :model-value="tab.windowId"
            :options="Array.from(windowsList.values()).map((window) => ({ label: adjustTitle(window.title), value: window.id }))"
            @change="moveToWindow"
          />
        </div>
        <div v-else class="cursor-pointer">
          {{ adjustTitle(windowsList.get(tab.windowId!)?.title) }}
        </div>
      </div>
    </div>
  </div>
</template>
