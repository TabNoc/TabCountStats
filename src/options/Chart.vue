<script setup lang="ts">

import { Line } from 'vue-chartjs';
import 'chart.js/auto';
import type { RemovableRef } from '@vueuse/core';
import type { TabDataBrowserStorage } from '../old/ts/background/storage/TabDataBrowserStorage';
import { storageTest } from '~/logic/storage';
const storageTest2: RemovableRef<TabDataBrowserStorage> = storageTest;
function sss() {
	console.log(storageTest);
}
const blub = {
	labels: ['January', 'February', 'March'],
	datasets: [
		{
			label: 'Data One',
			backgroundColor: '#f87979',
			data: [40, 20, 12],
		},
	],
};
sss();
</script>

<template>
  <Line :chart-data="storageTest2." :width="400" :height="400" />
  hi?!?!
  <div>
    {{ storageTest }}
  </div>
</template>
