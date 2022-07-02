<script setup lang="ts">
import type { Tabs, Windows } from 'webextension-polyfill';
import { WindowsHandler } from './WindowsHandler';
import WindowsList from './components/WindowsList.vue';
import { storageDemo } from '~/logic/storage';

function openOptionsPage() {
	browser.runtime.openOptionsPage();
}

const windowsHandler = new WindowsHandler();

function onLoad() {
	windowsHandler.populateWindowContainer();
	windowsHandler.populateWindowCount('tabs-windowCount');
	windowsHandler.populateCurrentWindowTabCount('tabs-currentWindowTabCount');

	windowsHandler.registerWindowSearchEvent('tab-searchWindowInput');
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
	windowsHandler.switchToTab(choosenTab);
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
        <input id="tab-searchWindowInput" type="text" placeholder="search for window title" autofocus>
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

    <WindowsList search-string="M" />

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
/*https://www.flaticon.com/de/kostenloses-icon/star_1828961*/
html,
body {
	width: 100%;
}

.star .starWrap {
	margin: 0;
	padding: 0;
}

.starWrap {
	border-radius: 50%;
	display: inline-block;
	height: 1.5em;
	width: 1.5em;
	box-sizing: unset;
	text-align: center;
}

.starWrap:hover {
	background-color: #e5e5e5;
}

.star::before {
	/*★*/
	/*https://estelle.github.io/CSS-JS-Entity-Calculator/*/
	content: '\2605';
}

.star {
	color: #ccd6dd;
	cursor: pointer;
	text-align: center;
}

.star:hover,
.star.active {
	color: #ffac33;
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

/* https://www.w3schools.com/howto/howto_css_tooltip.asp */
/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
	visibility: visible;
	opacity: 1;
}

/* Tooltip arrow */
.tooltip-bottom::after {
	content: "";
	position: absolute;
	bottom: 100%;
	left: 50%;
	margin-left: -5px;
	border-width: 5px;
	border-style: solid;
	border-color: transparent transparent #555 transparent;
}

.tooltip .tooltiptext {
	visibility: hidden;
	position: absolute;
	width: 20px;
	background-color: #555;
	color: #fff;
	text-align: center;
	padding: 5px 0;
	border-radius: 6px;
	z-index: 1;
	opacity: 0;
	transition: opacity 0.3s;
}

.tooltip-bottom {
	top: 135%;
	left: 50%;
	margin-left: -10px;
}

.tooltip {
	position: relative;
	display: inline-block;
	color: #006080;
}
</style>
