<script setup lang="ts">
import { type Tabs, type Windows } from 'webextension-polyfill';
import { TabSessionRepositoryV1 } from '~/logic/storage/TabSessionRepositoryV1';
import { getCaptureTabUrl } from '~/logic/TabsHelper';
import TabInfo from '~/components/TabInfo.vue';

const props = defineProps<{
	tabs: Tabs.Tab[]
	windowsList: Map<number, Windows.Window>
}>();
const emit = defineEmits<{
	(e: 'move', tab: Tabs.Tab, windowId: number): void
	(e: 'close', tab: Tabs.Tab): void
	(e: 'switch', tab: Tabs.Tab): void
}>();
const tabSessionRepository = new TabSessionRepositoryV1();
const index = ref(0);
const captureUrl = ref('');

watch([props, props.tabs, index], async () => {
	await updateIndex(false);
}, { immediate: true });

async function updateIndex(increment: boolean) {
	if (props.tabs.length > 0) {
		const currentTab = props.tabs[index.value];
		const date = await tabSessionRepository.getSkipUntil(currentTab);

		if ((date && date > new Date()) || increment)
			index.value = (index.value + 1) % props.tabs.length;

		captureUrl.value = '';
		captureUrl.value = await getCaptureTabUrl(props.tabs[index.value]);
	}
}

async function skipTab(tab: Tabs.Tab, until: Date): Promise<void> {
	tabSessionRepository.setSkipUntil(tab, until);
	await updateIndex(true);
}

async function onMove(tab: Tabs.Tab, windowId: number) {
	emit('move', tab, windowId);
	await updateIndex(true);
}

async function onSwitch(tab: Tabs.Tab) {
	emit('switch', tab);
	await updateIndex(true);
}
</script>

<template>
  {{ props.tabs.length }}
  <div>
    <TabInfo
      :tab="props.tabs[index]"
      :capture-url="captureUrl"
      :windows-list="props.windowsList"
      @skip="skipTab"
      @move="onMove"
      @close="async (tab) => { emit('close', tab); await updateIndex(true); }"
      @switch="onSwitch"
    />
  </div>
</template>
