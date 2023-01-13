<script setup lang="ts">
import { computed } from 'vue';
import Seperator from './Seperator.vue';

const props = defineProps<{
	modelValue: string
}>();
const emit = defineEmits<{
	(e: 'update:modelValue', modelValue: string): void
	(e: 'selectFirstWindow'): void
}>();

const writableComputedValue = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit('update:modelValue', value);
	},
});

function onInputEnterPressed() {
	emit('selectFirstWindow');
}

const currentWindowTabCount = ref('');
const windowCount = ref('');
browser.tabs.query({ currentWindow: true }).then((tabs) => {
	currentWindowTabCount.value = tabs.length.toString();
});
browser.windows.getAll().then((windows) => {
	windowCount.value = windows.length.toString();
});
</script>

<template>
  <div class="flex justify-between">
    <div class="header-text">
      <div>Tabs-tabs-tabs</div>
    </div>
    <div class="header-text">
      <input
        id="tab-searchWindowInput" v-model="writableComputedValue" type="text" placeholder="search for window title"
        autofocus
        @keydown.enter="onInputEnterPressed"
      >
    </div>
  </div>
  <seperator />
  <div class="flex justify-around mt-1">
    <div>
      <div>
        Aktuelle Tabs im Fenster:
      </div>
      <div class="text-center my-1">
        {{ currentWindowTabCount }}
      </div>
    </div>
    <div>
      <div>
        Aktuelle Fenster:
      </div>
      <div class="text-center my-1">
        {{ windowCount }}
      </div>
    </div>
  </div>
  <Seperator />
</template>
