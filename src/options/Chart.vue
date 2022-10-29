<script setup lang="ts">

import { Line } from 'vue-chartjs';
import 'chart.js/auto';
import LineChartHelper from '../logic/LineChartHelper';
import TabCountStorageRepositoryV2 from '~/logic/TabCountStorageRepositoryV2';

const tabCountStorageRepository = new TabCountStorageRepositoryV2();
const chartHelper = new LineChartHelper();
chartHelper.addDataset('Historical TabCount', tabCountStorageRepository.getAllValues());
chartHelper.addLabels(tabCountStorageRepository.getAllKeys());

</script>

<template>
  <p>
    {{ Object.values(tabCountStorageRepository.getAllValues()).reverse().at(0) }}
  </p>
  <Line :chart-data="chartHelper.getChartData()" :width="400" :height="400" />
</template>
