<script setup lang="ts">
import type { Ref } from 'vue';
import WindowEntry from './WindowEntry.vue';
import type { WindowWrapper } from '~/logic/WindowsHelper';
import { getWindows } from '~/logic/WindowsHelper';
import { WindowFavoritePriorityRepository } from '~/old/ts/background/storage/WindowFavoriteRepository';

const props = defineProps<{
	searchString: string
}>();
const windows: Ref<null | WindowWrapper[]> = ref(null);
const windowFavoriteRepository: WindowFavoritePriorityRepository = new WindowFavoritePriorityRepository();
const sortedWindows = computed((): WindowWrapper[] => {
	return windows.value
		?.filter(_ =>
			props.searchString == null
            || _.window.title?.toLowerCase().includes(props.searchString.toLocaleLowerCase()))
		.sort((a, b) => a.isCurrentWindow ? -1 : 1)
        ?? [];
});

onMounted(async() => {
	await update();
});

async function update() {
	windows.value = await getWindows(windowFavoriteRepository);
}

function setPriority(windowId: number, newPriority: number) {
	windowFavoriteRepository
		.saveWindowFavoritePriority(windowId, newPriority)
		.then(update);
}

function removePriority(windowId: number) {
	windowFavoriteRepository
		.removeWindowFavoritePriority(windowId)
		.then(update);
}
</script>

<template>
  <div id="tabs-windowContainer" />
  <WindowEntry
    v-for="aWindow in sortedWindows"
    :key="aWindow.window.id"
    :title="aWindow.window.title ?? ''"
    :priority="aWindow.priority"
    :window-id="aWindow.window.id ?? 0"
    :is-current-window="aWindow.isCurrentWindow"
    :search-string="searchString"
    @set-priority="setPriority"
    @remove-priority="removePriority"
  />
</template>
