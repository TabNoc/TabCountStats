<script setup lang="ts">
import type { Ref } from 'vue';
import WindowEntry from './WindowEntry.vue';
import SearchHeader from './SearchHeader.vue';
import type { WindowWrapper } from '~/logic/WindowsHelper';
import { getWindows } from '~/logic/WindowsHelper';
import { WindowFavoritePriorityRepositoryV1 } from '~/logic/storage/WindowFavoritePriorityRepositoryV1';

const emit = defineEmits<{
	(e: 'switchToWindow', id?: number): void
}>();

const searchString = ref('');
const windows: Ref<null | WindowWrapper[]> = ref(null);
const windowFavoriteRepository: WindowFavoritePriorityRepositoryV1 = new WindowFavoritePriorityRepositoryV1();
const filteredWindows = computed((): WindowWrapper[] => {
	return windows
		.value
		?.filter(_ =>
			searchString.value == null || _.title.toLowerCase().includes(searchString.value.toLocaleLowerCase()))
		.sort((a, _b) => a.isCurrentWindow ? -1 : 1) ?? [];
});

onMounted(async () => {
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

function selectFirstWindow() {
	const id = filteredWindows.value.at(0)?.window.id;
	if (id != null)
		switchToWindow(id);
}
</script>

<template>
  <SearchHeader v-model="searchString" @select-first-window="selectFirstWindow" />

  <div id="tabs-windowContainer" />
  <WindowEntry
    v-for="window in filteredWindows"
    :key="window.window.id"
    :title="window.title ?? ''"
    :priority="window.priority"
    :window-id="window.window.id ?? 0"
    :is-current-window="window.isCurrentWindow"
    :search-string="searchString"
    @set-priority="setPriority"
    @remove-priority="removePriority"
    @switch-to-window="switchToWindow"
  />
</template>
