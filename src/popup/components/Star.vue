<script setup lang="ts">

const props = defineProps<{
	priority?: number
	windowId: number
}>();

const emit = defineEmits<{
	(e: 'setPriority', windowId: number, newPriority: number): void
	(e: 'removePriority', windowId: number): void
}>();

function setNewPriority() {
	if (props.priority !== undefined) {
		emit('removePriority', props.windowId);
	}
	else {
		let newPriority = 1;
		try {
			newPriority = parseInt(
				// eslint-disable-next-line no-alert
				prompt(
					'Wich priority has this window? (higher number -> higher position)',
					'1',
				)!,
			);
			if (Number.isNaN(newPriority))
				return; // do not add if no valid input
		}
		catch (error) {
			console.warn(error);
		}
		emit('setPriority', props.windowId, newPriority);
	}
}
</script>
<template>
  <div class="starWrap">
    <span
      class="star"
      :class="{ 'active tooltip': props.priority !== undefined }"
      @click="setNewPriority()"
    >
      <span
        v-if="props.priority !== undefined"
        class="tooltiptext tooltip-bottom"
      >
        {{ props.priority }}</span>
    </span>
  </div>
</template>
