<script setup lang="ts">
import Star from './Star.vue';
import HighlightedText from '~/components/HighlightedText.vue';

const props = defineProps<{
	title: string
	windowId: number
	isCurrentWindow: boolean
	searchString: string
	priority?: number
}>();

const emit = defineEmits<{
	(e: 'switchToWindow', id?: number): void
	(e: 'setPriority', windowId: number, newPriority: number): void
	(e: 'removePriority', windowId: number): void
}>();

const adjustedTitle = computed(() => {
	const orgTitle: string = props.title;

	if (orgTitle
		.substring(orgTitle.lastIndexOf(' - '))
		.toLowerCase()
		.includes('firefox')
	)
		return orgTitle.slice(0, orgTitle.lastIndexOf(' - '));
	else if (orgTitle
		.substring(orgTitle.lastIndexOf(' — '))
		.toLowerCase()
		.includes('firefox')
	)
		return orgTitle.slice(0, orgTitle.lastIndexOf(' — '));
	else if (orgTitle
		.substring(orgTitle.lastIndexOf(' — '))
		.toLowerCase()
		.includes('firefox')
	)
		return orgTitle.slice(0, orgTitle.lastIndexOf(' — '));

	else
		return orgTitle;
});

function setPriority(windowId: number, newPriority: number) {
	emit('setPriority', windowId, newPriority);
}

function removePriority(windowId: number) {
	emit('removePriority', windowId);
}
</script>

<template>
  <div
    class="windowEntryWrapper"
    :class="{ currentWindowEntryWrapper: props.isCurrentWindow }"
  >
    <Star
      :window-id="props.windowId"
      :priority="props.priority"
      @remove-priority="removePriority"
      @set-priority="setPriority"
    />
    <a
      id="tabs-changeWindow"
      class="windowLink"
      :tabs-windowId="props.windowId"
      href="#"
      @click="emit('switchToWindow', props.windowId)"
    >
      <HighlightedText
        :base-text="adjustedTitle"
        :search-string="searchString"
      />
    </a>
  </div>
</template>
