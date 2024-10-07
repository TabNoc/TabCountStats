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
	(e: 'move', tab: Tabs.Tab, windowId: number | undefined): void
	(e: 'close', tab: Tabs.Tab): void
	(e: 'switch', tab: Tabs.Tab): void
}>();
const tabSessionRepository = new TabSessionRepositoryV1();
const index = ref(0);
const allSkipped = ref(false);
const captureUrl = ref('');

watch([props, props.tabs], async () => {
	allSkipped.value = false;
	index.value = 0;
	await updateIndex(false);
}, { immediate: true });

async function shouldSkipTab(tab: Tabs.Tab): Promise<boolean> {
	const date = await tabSessionRepository.getSkipUntil(tab);

	if ((date && date > new Date()))
		return true;
	return false;
}

async function getNewIndex(currentIndex: number): Promise<number | null> {
	for (let index = currentIndex; index < props.tabs.length; index++) {
		if (await shouldSkipTab(props.tabs[index]) === false)
			return index;
	}

	for (let index = 0; index < currentIndex; index++) {
		if (await shouldSkipTab(props.tabs[index]) === false)
			return index;
	}

	return null;
}

async function updateIndex(increment: boolean) {
	if (props.tabs.length > 0) {
		const currentTab = props.tabs[index.value];
		if (increment || await shouldSkipTab(currentTab)) {
			const newindex = await getNewIndex(index.value + 1);
			if (newindex === null) {
				allSkipped.value = true;
				return;
			}
			else {
				index.value = newindex;
			}
		}

		captureUrl.value = '';
		captureUrl.value = await getCaptureTabUrl(props.tabs[index.value]);
	}
}

async function onSkipTab(tab: Tabs.Tab, amountInMs: number): Promise<void> {
	tabSessionRepository.setSkipUntil(tab, new Date(new Date().valueOf() + amountInMs));
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
  <div v-if="allSkipped === false">
    <TabInfo
      :tab="props.tabs[index]"
      :capture-url="captureUrl"
      :windows-list="props.windowsList"
      @skip="onSkipTab"
      @move="onMove"
      @close="async (tab) => { emit('close', tab); await updateIndex(true); }"
      @switch="onSwitch"
    />
  </div>
  <div v-else>
    <h1>All done, Congratulations</h1>
  </div>
</template>
