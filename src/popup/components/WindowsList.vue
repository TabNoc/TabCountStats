<script setup lang="ts">
import type { Ref } from 'vue';
import WindowEntry from './WindowEntry.vue';
import type { WindowWrapper } from '~/logic/WindowsHelper';
import { getWindows } from '~/logic/WindowsHelper';
import { WindowFavoritePriorityRepositoryV1 } from '~/logic/storage/WindowFavoritePriorityRepositoryV1';

const props = defineProps<{
	searchString: string
}>();
const emit = defineEmits<{
	(e: 'switchToWindow', id?: number): void
}>();
const windows: Ref<null | WindowWrapper[]> = ref(null);
const windowFavoriteRepository: WindowFavoritePriorityRepositoryV1 = new WindowFavoritePriorityRepositoryV1();
const filteredWindows = computed((): WindowWrapper[] => {
	return windows.value
		?.filter(_ =>
			props.searchString == null
            || _.title.toLowerCase().includes(props.searchString.toLocaleLowerCase()))
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
		.set(windowId, newPriority)
		.then(update);
}

function removePriority(windowId: number) {
	windowFavoriteRepository
		.remove(windowId)
		.then(update);
}

function switchToWindow(windowId?: number) {
	emit('switchToWindow', windowId);
}
</script>

<template>
  <div id="tabs-windowContainer" />
  <WindowEntry
    v-for="aWindow in filteredWindows"
    :key="aWindow.window.id"
    :title="aWindow.title ?? ''"
    :priority="aWindow.priority"
    :window-id="aWindow.window.id ?? 0"
    :is-current-window="aWindow.isCurrentWindow"
    :search-string="searchString"
    @set-priority="setPriority"
    @remove-priority="removePriority"
    @switch-to-window="switchToWindow"
  />
</template>
