<script setup lang="ts">

import { Line } from 'vue-chartjs';
import 'chart.js/auto';
import { de } from 'date-fns/locale';
import TabCountStorageRepositoryV2 from '~/logic/storage/TabCountStorageRepositoryV2';
import LineChartBuilder from '~/logic/LineChartBuilder';
import 'chartjs-adapter-date-fns';

const tabCountStorageRepository = new TabCountStorageRepositoryV2();
</script>

<template>
  <div>
    Test: {{ new LineChartBuilder().addDataset('Historical TabCount',
                                               tabCountStorageRepository.getAllValues().value).addLabels(tabCountStorageRepository.getAllKeys().value).getChartData()
    }}
  </div>

  <Line
    :chart-data="new LineChartBuilder().addDataset('Historical TabCount', tabCountStorageRepository.getAllValues().value).addLabels(tabCountStorageRepository.getAllKeys().value).getChartData()"
    :width="400" :height="400"
    :chart-options="{ scales: { x: { type: 'time', adapters: { date: { locale: de } }, time: { tooltipFormat: 'd LLL. yyyy, kk:mm' } } } }"
  />
</template>
