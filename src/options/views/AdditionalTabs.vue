<script setup lang="ts">
import type { Ref } from 'vue';
import type { Tabs } from 'webextension-polyfill';
import Paginator from 'primevue/paginator';
import TabEntry from './TabEntry.vue';
import { TabSearchService } from '~/logic/options/TabSearchService';
import SearchStorage from '~/logic/storage/SearchRepositoryV1';
const displayTabs: Ref<Tabs.Tab[]> = ref([]);
const onlyCurrentWindow = ref(false);
const randomizeResult = ref(true);
const hideEmpty = ref(true);
const tabFilter = ref('');
const tabSorting = ref('');
const tabCount = ref(0);
const firstPaginatorIndex = ref(0);
const showUsageHelp = ref(false);

const searchStorage = new SearchStorage();
const pageTabCount = searchStorage.getPageTabCount();

// todo: move variables to object
// todo: add favorite function to save, load and apply saved variableObject
const filterText = computed(() => {
	return ` (${pageTabCount.value}/${tabCount.value})`;
});

const tabSearchService = new TabSearchService(displayTabs, onlyCurrentWindow, tabFilter, tabCount, randomizeResult, tabSorting, hideEmpty);
watch([onlyCurrentWindow, tabFilter, randomizeResult, tabSorting, hideEmpty], () => {
	tabSearchService.updateFilteredTabs();
}, { immediate: true });

// using https://flowbite.com/docs/components/forms/
</script>

<template>
  <h1>Additional - Tabs</h1>

  <div class="m-auto grid grid-cols-3">
    <div />
    <div class="w-124">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="relative mb-6">
          <label for="tabFilter" class="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Tab filter{{
            filterText }}</label>
          <input
            id="tabFilter" v-model="tabFilter" type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="best to start with title:"
            list="searchLines"
          >
          <datalist id="searchLines">
            <option v-for="searchLine in searchStorage.getSearchLines()" :key="searchLine" :value="searchLine" />
          </datalist>
          <span class="absolute right-3 top-12 -translate-y-1/2 text-gray-600 cursor-pointer" title="show usage" @click="showUsageHelp = !showUsageHelp">
            <img class="h-6 w-6" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABj0lEQVR4nN2VTUoDQRCFPxITF5obRHcimNzBeAGJIrlCMIjGS0gQPYUmCwkIgi7dujaKP1FP4A8YXZhNRhreQDNOT09c5kFBeK+6qqe6qgKTjjxQAzrAA/AtM7/b0ozPv7AOvACBx56BtXECZ4B9K8A1sA0sATOyErAD9Cy/ls56EQb/AeqeQ0bblG+YxFuWMPiyxc8BXWAgOwUWLb1iJam6guetmtcjwd9jav8hLURD/BOQi0tQs2pul6Ur/hwoyi7EnVh+WeBG/EZcgo5E86A2BuKLka8y3GfEtyn+OC7Bo0TTLT7My/c1wpfEmzn5g/CmBU/waZXL+B5EtIL4wX8TTAFn8ruMmeLEBGlKdCifK8dFykklaks0E+rCm3wWHPqu9KOkNu2lHfkITJveJrVpXosr0PjHIZDFYUta3zVoaCuGq6IyRoIVYAiMgFU8aFlJGvp0F7K6+VBn9kiBjJUk0Pg3NUSzsrIeNKz5SMHHeruqFpfvD6efpiwu5NQRZrfcA1+yO7Wi0ZwPOhn4BT6dkYKwNK6qAAAAAElFTkSuQmCC">
          </span>
          <span v-if="tabFilter !== '' && searchStorage.includesSearchLine(tabFilter) === false" class="absolute right-9 top-12 -translate-y-1/2 text-gray-600 cursor-pointer" title="save search line" @click="searchStorage.saveSearchLine(tabFilter)">
            <img class="h-6 w-6" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAjElEQVR4nO2VvQ2AIBBG3ySyjgOYuI6lK/kzDW6gdhYYE0wMhXIC0YKXXAff444EICOkBCbACKvxFegX4UYiORdLqIDN7mtTCEQSV2Ae6krtc8AQAb8USPmvQAEjsAIDUMQWjM7s+9iCxRHMsQVD6g6UDT066VLcgS/fC3TAc21sHRm3H06IRNuMDN7sXt6jtyL4+kMAAAAASUVORK5CYII=">
          </span>
          <div
            v-if="showUsageHelp"
            class="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white px-4 py-2 rounded-lg shadow-lg text-left"
            style="top: calc(100% + 10px); right: 20px;"
          >
            This search box uses <a href="https://github.com/gajus/liqe#query-syntax" class="text-blue-600">liqe (usage)</a> as a search engine and their query syntax.
            <br>
            To improve search capabilities there are some additional data mapped into every entry to search for.
            <br>
            <b>If you just want to search for the title only, prefix the search term with 'title:'</b>
            <br>
            <br>
            <br>
            Following Datapoints are mounted and can be searched for.
            <ul>
              <li class="ml-2">
                tab: <a href="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/Tab" class="text-blue-600">Tab</a>
              </li>
              <li class="ml-2">
                title: tab.title
              </li>
              <li class="ml-2">
                window: <a href="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/Window" class="text-blue-600">Window</a>
              </li>
              <li class="ml-2">
                windowName: window.title
              </li>
              <li class="ml-2">
                url: tab.url
              </li>
              <li class="ml-2">
                date: tab.lastAccessed?.toString()
              </li>
              <li class="ml-2">
                year: tab.lastAccessed ? getYear(tab.lastAccessed) : 0
              </li>
            </ul>
          </div>
        </div>
        <div class="flex items-start mb-1">
          <div class="flex items-center h-5">
            <input
              id="onlyCurrentWindow" v-model="onlyCurrentWindow" type="checkbox"
              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
            >
          </div>
          <label for="onlyCurrentWindow" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Only
            tabs from current window</label>
        </div>
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="randomizeResult" v-model="randomizeResult" type="checkbox"
              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
            >
          </div>
          <label for="randomizeResult" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Randomize
            result order</label>
        </div>
        <div class="flex items-center h-5 mt-1">
          <input
            id="hideEmpty" v-model="hideEmpty" type="checkbox"
            class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
          >
          <label for="hideEmpty" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Hide empty Tabs</label>
        </div>
      </form>
    </div>
    <div v-show="!randomizeResult" class="pl-5">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <label for="tabSorting" class="block mb-2 text-sm text-gray-900 dark:text-white">sort by</label>
        <select id="tabSorting" v-model="tabSorting" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option selected>
            none
          </option>
          <option>lastUsedDate asc</option>
          <option>lastUsedDate desc</option>
          <!-- <option>firstSeenDate asc</option>
          <option>firstSeenDate desc</option> -->
        </select>
      </form>
    </div>
  </div>

  <div v-for="tab in displayTabs.slice(firstPaginatorIndex, Math.min(displayTabs.length, firstPaginatorIndex + pageTabCount))" :key="tab.id">
    <Suspense>
      <TabEntry :tab="tab" :windows-list="tabSearchService.windowsList.value" />
    </Suspense>
  </div>
  <Paginator v-model:first="firstPaginatorIndex" v-model:rows="pageTabCount" :total-records="displayTabs.length" :rows-per-page-options="[11, 22, 33]" />
</template>

<style>
.currentWindowEntryWrapper {
	background-color: #e7e7e7;
	border-radius: 25px;
	border: 1px solid #999999;
}
</style>
