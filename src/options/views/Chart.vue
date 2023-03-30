<script setup lang="ts">

import { Line } from 'vue-chartjs';
import 'chart.js/auto';
import TabCountStorageRepositoryV2 from '~/logic/storage/TabCountStorageRepositoryV2';
import LineChartBuilder from '~/logic/LineChartBuilder';

const tabCountStorageRepository = new TabCountStorageRepositoryV2();
</script>

<template>
  <Line
    :chart-data="new LineChartBuilder().addDataset('Historical TabCount', tabCountStorageRepository.getAllValues().value).addLabels(tabCountStorageRepository.getAllKeys().value).getChartData()"
    :width="400" :height="400"
  />
</template>
