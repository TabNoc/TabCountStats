<script setup lang="ts">
import type { Tabs, Windows } from 'webextension-polyfill';
import type { Ref } from 'vue';
import WindowsList from './components/WindowsList.vue';
import { storageDemo } from '~/logic/storage/storage';

function openOptionsPage() {
	browser.runtime.openOptionsPage();
}

const searchText: Ref<string> = ref('');

function onLoad() {
	populateWindowCount('tabs-windowCount');
	populateCurrentWindowTabCount('tabs-currentWindowTabCount');
}

function populateCurrentWindowTabCount(targetId: string): void {
	const countDiv = document.getElementById(targetId);
	if (countDiv == null)
		return;

	browser.tabs.query({ currentWindow: true }).then((tabs) => {
		countDiv!.innerText = tabs.length.toString();
	});
}

function populateWindowCount(targetId: string): void {
	const countDiv = document.getElementById(targetId);
	if (countDiv == null)
		return;

	browser.windows.getAll().then((windows) => {
		countDiv!.innerText = windows.length.toString();
	});
}
document.addEventListener('DOMContentLoaded', onLoad);

function getCurrentWindowTabs() {
	return browser.tabs.query({ currentWindow: true });
}

document.addEventListener('click', (e: MouseEvent) => {
	if (
		e == null
		|| e.target == null
		|| (e.target as HTMLElement) == null
		|| (e.target as HTMLElement).id == null
	)
		throw new Error('e.target.id not defined!');

	const target = e.target as HTMLElement;

	function callOnActiveTab(callback: any) {
		getCurrentWindowTabs().then((tabs) => {
			for (const tab of tabs) {
				if (tab.active)
					callback(tab, tabs);
			}
		});
	}

	if (target.id === 'tabs-reload') {
		callOnActiveTab((tab: Tabs.Tab) => {
			browser.tabs.reload(tab.id);
		});
	}
	else if (target.id === 'tabs-cleardata') {
		browser.storage.sync.clear();
		console.log('ClearedData!');
		browser.storage.sync.get().then((data) => {
			console.log(data);
		});
	}
	else if (target.id === 'tabs-readdata') {
		browser.storage.local.get().then((data) => {
			console.log(data);
		});
	}
	else if (target.id === 'tabs-alertinfo') {
		browser.tabs.create({ url: 'tabs.html' });
		callOnActiveTab((tab: any) => {
			let props = '';
			for (const item in tab)
				props += `${item} = ${tab[item]} \n`;

			alert(props);
		});
	}
	else if (target.id === 'tabs-activate-random-activewindow') {
		browser.tabs.query({ currentWindow: true }).then((tabs) => {
			OpenRandomTabFromQuery(tabs);
		});
	}
	else if (target.id === 'tabs-activate-random-anywhere') {
		browser.tabs.query({}).then((tabs) => {
			OpenRandomTabFromQuery(tabs);
		});
	}
	else if (target.id === 'tabs-activate-least-tabs') {
		ActivateWindowWithLeastTabs();
	}

	e.preventDefault();
});

async function ActivateWindowWithLeastTabs(): Promise<void> {
	const windows = await browser.windows.getAll({ populate: true });

	const windowIdFromUnnamedWindows: number | null = GetWindowIdWithLeastTabs(
		windows.filter(window => (window as any).title[0] !== '['),
	);
	const windowIdFromAllWindows: number | null
		= GetWindowIdWithLeastTabs(windows);

	let windowId: number;
	if (windowIdFromUnnamedWindows === null)
		windowId = windowIdFromAllWindows as number;

	else
		windowId = windowIdFromUnnamedWindows;

	const tabs = await browser.tabs.query({ windowId });

	OpenRandomTabFromQuery(tabs);
}

function GetWindowIdWithLeastTabs(
	windows: Windows.Window[],
): number | null {
	const windowElements: [number, number][] = windows
		.map(window => [window.id, window.tabs?.length])
		.filter(tuple => tuple[0] != null && tuple[1] != null) as [
		number,
		number,
	][];

	const minTabCount: number = Math.min(...windowElements.map(tuple => tuple[1]));

	const windowIds: number[] = windowElements
		.filter(element => element[1] === minTabCount)
		.map(element => element[0]);

	return windowIds.length > 0 ? windowIds[0] : null;
}

function OpenRandomTabFromQuery(tabs: Tabs.Tab[]) {
	const choosenTab = tabs[Math.floor(Math.random() * tabs.length)];
	switchToTab(choosenTab);
}
function switchToWindow(windowId?: number) {
	if (windowId !== undefined) {
		browser.windows.update(windowId, {
			focused: true,
		});
	}
}

function switchToTab(choosenTab: Tabs.Tab): void {
	if (choosenTab.windowId !== undefined) {
		browser.tabs.update(choosenTab.id, {
			active: true,
		});
		switchToWindow(choosenTab.windowId);
	}
}
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <Logo />
    <div>Popup</div>
    <p class="mt-2 opacity-50">
      This is the popup page
    </p>
    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <div class="mt-2">
      <span class="opacity-50">Storage:</span> {{ storageDemo }}
    </div>
  </main>

  <div class="panel">
    <div class="header">
      <div class="header-text">
        <div>Tabs-tabs-tabs</div>
      </div>
      <div class="header-text">
        <input
          id="tab-searchWindowInput"
          v-model="searchText"
          type="text"
          placeholder="search for window title"
          autofocus
        >
      </div>
    </div>

    <div class="panel-section-separator" />
    <div class="countDisplay">
      <div class="justifyCenter">
        <div>
          Aktuelle Tabs im Fenster:
        </div>
        <div id="tabs-currentWindowTabCount" class="justifyCenter marginTD" />
      </div>
      <div class="justifyCenter">
        <div>
          Aktuelle Fenster:
        </div>
        <div id="tabs-windowCount" class="justifyCenter marginTD" />
      </div>
    </div>
    <div class="panel-section-separator" />

    <WindowsList
      :search-string="searchText"
      @switch-to-window="switchToWindow"
    />

    <div class="panel-section-separator" />

    <a id="tabs-activate-random-activewindow" href="#">Activate a random Tab in the currentWindow</a><br>

    <a id="tabs-activate-random-anywhere" href="#">Activate a random Tab in any Window</a><br>

    <a id="tabs-activate-least-tabs" href="#">Activate the window with the least amount of Tabs</a><br>

    <div class="panel-section-separator" />
    <!--<a href="#" id="tabs-cleardata">ClearData</a><br>-->
    <div class="panel-section-separator" />
    <a id="tabs-readdata" href="#">ReadData</a><br>

    <div class="panel-section-separator" />

    <a id="tabs-reload" href="#">Reload active tab</a><br>
    <a id="tabs-alertinfo" href="#">Alert active tab info</a><br>
  </div>
</template>
<style>
/*
implicit usage of https://github.com/FirefoxUX/StyleGuide/tree/master/src/styles
*/
html,
body {
	width: 100%;
}

.windowEntryWrapper {
	display: grid;
	align-items: center;
	grid-template-columns: 2em 1fr;
	padding-left: 3px;
}

.currentWindowEntryWrapper {
	background-color: #e7e7e7;
	border-radius: 25px;
	border: 1px solid #999999;
	padding-bottom: 2px;
	margin-top: 2px;
}

a {
	margin: 10px;
	display: inline-block;
}

.windowLink {
	margin: 3px;
	display: inline-block;
	font-size: larger;
}

.switch-tabs {
	padding-left: 10px;
}

.switch-tabs a {
	display: block;
}

.panel {
	margin: 5px;
}

.marginTD {
	margin-top: 5px;
	margin-bottom: 5px;
}

.countDisplay {
	display: flex;
	justify-content: space-around;
	margin-top: 3px;
}

.justifyCenter {
	justify-items: center;
	text-align: center;
}

.header {
	display: flex;
	justify-content: space-between;
}

.header-text {
	padding: 16px;
	align-self: center;
	font-size: 1.385em;
	font-weight: lighter;
}

.windowLink>p {
	margin-top: 0px;
	margin-bottom: 0px;
}

</style>
