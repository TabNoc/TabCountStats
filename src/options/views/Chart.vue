<script setup lang="ts">
import { Line } from 'vue-chartjs';
import { de } from 'date-fns/locale';
import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js'; // import 'chart.js/auto'
import TabCountStorageRepositoryV2 from '~/logic/storage/TabCountStorageRepositoryV2';
import LineChartBuilder from '~/logic/LineChartBuilder';
import 'chartjs-adapter-date-fns';

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const tabCountStorageRepository = new TabCountStorageRepositoryV2();
const lineChartBuilder = computed(() => new LineChartBuilder().addDataset('Historical TabCount', tabCountStorageRepository.getAllValues().value).addLabels(tabCountStorageRepository.getAllKeys().value));
</script>

<template>
  <div>
    Test: {{ lineChartBuilder.getChartData() }}
  </div>

  <Line
    :data="lineChartBuilder.getChartData()" :width="400" :height="400"
    :chart-options="{ scales: { x: { type: 'time', adapters: { date: { locale: de } }, time: { tooltipFormat: 'd LLL. yyyy, kk:mm' } } } }"
  />
</template>
