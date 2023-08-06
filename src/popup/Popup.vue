<script setup lang="ts">
import type { Tabs, Windows } from 'webextension-polyfill';
import WindowsList from './components/WindowsList.vue';
import Seperator from './components/Seperator.vue';
import { switchToTab, switchToWindow } from '~/logic/WindowsHelper';

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

function openLinkInNewTab(a: MouseEvent) {
	browser.tabs.create({ url: browser.runtime.getURL((a.target as any).href), active: true });
}
</script>

<template>
  <div id="header">
    <a class="external" href="/dist/options/index.html?href=AdditionalWindows" @click="openLinkInNewTab">Windows</a>
    <a class="external" href="/dist/options/index.html?href=AdditionalTabs" @click="openLinkInNewTab">Tabs</a>
  </div>
  <div class="panel">
    <WindowsList @switch-to-window="switchToWindow" />

    <Seperator />

    <a id="tabs-activate-random-activewindow" href="#">Activate a random Tab in the currentWindow</a><br>

    <a id="tabs-activate-random-anywhere" href="#">Activate a random Tab in any Window</a><br>

    <a id="tabs-activate-least-tabs" href="#">Activate the window with the least amount of Tabs</a><br>

    <Seperator />
    <!-- <a href="#" id="tabs-cleardata">ClearData</a><br> -->
    <Seperator />
    <a id="tabs-readdata" href="#">ReadData</a><br>

    <Seperator />

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

/* https://en.wikipedia.org/wiki/Help:External_link_icons */
.external {
	background-image: url(/assets/externallink.svg);
	background-position: center right;
	background-repeat: no-repeat;
	background-size: 0.857em;
	padding-right: 1em;
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
