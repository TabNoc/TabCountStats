<script setup lang="ts">
import type { Tabs, Windows } from 'webextension-polyfill';
import { TabSessionRepositoryV1 } from '~/logic/storage/TabSessionRepositoryV1';
import { getCaptureTabUrl } from '~/logic/TabsHelper';
import TabInfo from '~/components/TabInfo.vue';

const props = defineProps<{
	tabs: Tabs.Tab[]
	windowsList: Map<number, Windows.Window>
}>();
const tabSessionRepository = new TabSessionRepositoryV1();
const index = ref(0);
const captureUrl = ref('');

watch([props, props.tabs, index], async () => {
	if (props.tabs.length > 0) {
		const currentTab = props.tabs[index.value];
		const date = await tabSessionRepository.getSkipUntil(currentTab);
		if (date && date > new Date())
			index.value = (index.value + 1) % props.tabs.length;

		captureUrl.value = '';
		captureUrl.value = await getCaptureTabUrl(props.tabs[index.value]);
	}
}, { immediate: true });

const handleSkip = (duration: string) => {
	console.log(`Skip tab for ${duration}`);
	// Implement skip logic here
};

const handleMove = () => {
	console.log('Move tab to another window');
	// Implement move logic here
};

const handleClose = () => {
	console.log('Close tab');
	// Implement close logic here
};

const handleSwitch = () => {
	console.log('Switch to tab');
	// Implement switch logic here
};
</script>

<template>
  <div>
    <TabInfo
      :tab="props.tabs[index]"
      :capture-url="captureUrl"
      :on-skip="handleSkip"
      :on-move="handleMove"
      :on-close="handleClose"
      :on-switch="handleSwitch"
      :windows-list="props.windowsList"
    />
  </div>
</template>
