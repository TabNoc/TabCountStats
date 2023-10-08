<script setup lang="ts">
import type { Ref } from 'vue';
import type { Tabs } from 'webextension-polyfill';
import TabEntry from './TabEntry.vue';
import { TabSearchService } from '~/logic/options/TabSearchService';

const displayTabs: Ref<Tabs.Tab[]> = ref([]);
const onlyCurrentWindow = ref(false);
const randomizeResult = ref(true);
const hideEmpty = ref(true);
const tabFilter = ref('');
const tabSorting = ref('');
const tabCount = ref(0);
const showUsageHelp = ref(false);

// todo: move variables to object
// todo: add favorite function to save, load and apply saved variableObject
const filterText = computed(() => {
	return ` (${displayTabs.value.length}/${tabCount.value})`;
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
          >
          <span class="absolute right-3 top-12 -translate-y-1/2 text-gray-600 cursor-pointer" title="show usage" @click="showUsageHelp = !showUsageHelp">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v2m0 4h.01m0 4v.01M12 3a9 9 0 110 18 9 9 0 010-18zm0 5a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>
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
          <option>last accessed date asc</option>
          <option>last accessed date desc</option>
        </select>
      </form>
    </div>
  </div>

  <div v-for="tab in displayTabs" :key="tab.id">
    <Suspense>
      <TabEntry :tab="tab" :windows-list="tabSearchService.windowsList.value" />
    </Suspense>
  </div>
</template>

<style>
.currentWindowEntryWrapper {
	background-color: #e7e7e7;
	border-radius: 25px;
	border: 1px solid #999999;
}
</style>
