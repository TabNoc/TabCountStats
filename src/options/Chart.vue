<script setup lang="ts">

import { Line } from 'vue-chartjs';
import 'chart.js/auto';
import LineChartHelper from '../logic/LineChartHelper';
import { storageTest } from '~/logic/storage';

const chartHelper = new LineChartHelper();
chartHelper.addDataset('Historical TabCount', Object.values(storageTest.value.storage.tabCount));
chartHelper.addLabels(Object.keys(storageTest.value.storage.tabCount));

</script>

<template>
  <Line :chart-data="chartHelper.getChartData()" :width="400" :height="400" />
</template>
