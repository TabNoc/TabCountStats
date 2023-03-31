<script setup lang="ts">
import type { Tabs, Windows } from 'webextension-polyfill';
import { adjustTitle, switchToTab } from '~/logic/WindowsHelper';

const props = defineProps<{
	tab: Tabs.Tab
	windowsList: Map<number, Windows.Window>
}>();

function formatDate(date: number): string {
	return new Date(date).toLocaleString();
}

const dateString = props.tab.lastAccessed !== await browser.sessions.getTabValue(props.tab.id!, 'oldestLastAccessed')
	? `first seen: ${formatDate(await browser.sessions.getTabValue(props.tab.id!, 'oldestLastAccessed'))}`
	: '';

</script>
<template>
  <div class=" m-1 flex flex-col rounded-3xl border-gray-500 border-2 border-dotted">
    <div class="m-1">
      <a
        href="#" class="p-1 currentWindowEntryWrapper inline-block" :title="tab.url"
        @click.prevent="switchToTab(tab)"
      ><img :src="tab.favIconUrl" class="inline-block w-4 mb-1 mx-1">{{
        adjustTitle(tab.title) }}</a>
    </div>

    <div class="grid grid-rows-1 grid-cols-3 justify-center m-auto w-1/2 items-center">
      <div>
        <div>last used: {{ formatDate(tab.lastAccessed ?? 0) }}</div>
        <div>{{ dateString }}</div>
      </div>
      |
      <div>{{ adjustTitle(windowsList.get(tab.windowId!)?.title) }}</div>
    </div>
  </div>
</template>
