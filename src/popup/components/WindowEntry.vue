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
	(e: 'moveTabToWindow', windowId?: number): void
}>();

function setPriority(newPriority: number) {
	emit('setPriority', props.windowId, newPriority);
}

function removePriority() {
	emit('removePriority', props.windowId);
}
</script>

<template>
  <div
    class="windowEntryWrapper"
    :class="{ currentWindowEntryWrapper: props.isCurrentWindow }"
  >
    <Star
      :priority="props.priority"
      @remove-priority="removePriority"
      @set-priority="setPriority"
    />
    <a
      id="tabs-changeWindow"
      class="windowLink"
      :tabs-windowId="props.windowId"
      href="#"
      @click.exact="emit('switchToWindow', props.windowId)"
      @click.shift.ctrl="emit('moveTabToWindow', props.windowId)"
    >
      <HighlightedText
        :base-text="props.title"
        :search-string="searchString"
      />
    </a>
  </div>
</template>
