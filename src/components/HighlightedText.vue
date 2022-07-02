<script setup lang="ts">
const props = defineProps<{
	baseText: string
	searchString: string
}>();

const textResult = computed(() =>
	props.baseText.match(
		new RegExp(`^(.*?)(${props.searchString})(.*)$`, 'i'),
	),
);
</script>

<template>
  <p v-if="textResult">
    <span>
      {{ textResult[1] }}
    </span>
    <span class="highlighted">
      {{ textResult[2] }}
    </span>
    <span>
      {{ textResult[3] }}
    </span>
  </p>
  <p v-else>
    {{ baseText }}
  </p>
</template>

<style scoped>
.highlighted {
	background-color: orange
}</style>
