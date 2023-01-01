<script setup lang="ts">

import { Line } from 'vue-chartjs';
import 'chart.js/auto';
import LineChartHelper from '../../logic/LineChartHelper';
import TabCountStorageRepositoryV2 from '~/logic/storage/TabCountStorageRepositoryV2';
import { useBrowserStorageLocal } from '~/composables/useBrowserStorageLocal';

const blub = useBrowserStorageLocal('TabCountStorageV2', new Map<string, number>(), { listenToStorageChanges: true });

const tabCountStorageRepository = new TabCountStorageRepositoryV2();

const chartHelper = new LineChartHelper();
chartHelper.addDataset('Historical TabCount', tabCountStorageRepository.getAllValues().value);
chartHelper.addLabels(tabCountStorageRepository.getAllKeys());
console.log(tabCountStorageRepository.getAllValues());
</script>

<template>
  <p>
    {{ blub }}
    <br>
    {{ tabCountStorageRepository.getAllValues() }}
  </p>
  <br>
  <p>
    last from blub:
    {{ Array.from(blub.values()).reverse().at(0) }}
  </p>
  <br>
  <p>
    last from tabCountStorageRepository:
    {{ Object.values(tabCountStorageRepository.getAllValues().value).reverse().at(0) }}
  </p>
  <Line :chart-data="chartHelper.getChartData()" :width="400" :height="400" />
</template>
