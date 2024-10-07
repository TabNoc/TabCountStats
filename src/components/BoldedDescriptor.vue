<script setup lang="ts">
const props = defineProps<{
	text: string
	content: (string | undefined) | Promise<string | undefined>
}>();

const content: Ref<string | undefined> = ref('');
watchEffect(() => {
	if (typeof (props.content) === 'object')
		props.content.then(result => content.value = result);
	else
		content.value = props.content;
});
</script>

<template>
  <div class="h-6">
    <div v-if="(content?.length ?? 0) > 0">
      <b>{{ text }}</b> {{ content }}
    </div>
  </div>
</template>
