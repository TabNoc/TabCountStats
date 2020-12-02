import { WindowsHandler } from "./WindowsHandler";

let windowsHandler = new WindowsHandler();

function onLoad() {
	windowsHandler.populateWindowContainer();
	windowsHandler.populateWindowCount("tabs-windowCount");
	windowsHandler.populateCurrentWindowTabCount("tabs-currentWindowTabCount");

	windowsHandler.registerWindowSearchEvent("tab-searchWindowInput");
}

document.addEventListener("DOMContentLoaded", onLoad);

function getCurrentWindowTabs() {
	return browser.tabs.query({ currentWindow: true });
}

document.addEventListener("click", (e: MouseEvent) => {
	if (e == null || e.target == null || e.target as HTMLElement == null || (<HTMLElement>e.target).id == null) {
		throw new Error("e.target.id not defined!");
	}
	let target = e.target as HTMLElement;

	function callOnActiveTab(callback: any) {
		getCurrentWindowTabs().then((tabs) => {
			for (var tab of tabs) {
				if (tab.active) {
					callback(tab, tabs);
				}
			}
		});
	}

	if (target.id === "tabs-reload") {
		callOnActiveTab((tab: browser.tabs.Tab) => {
			browser.tabs.reload(tab.id);
		});
	}

	else if (target.id === "tabs-cleardata") {
		browser.storage.sync.clear();
		console.log("ClearedData!");
		browser.storage.sync.get().then((data) => { console.log(data); });
	}
	else if (target.id === "tabs-readdata") {
		browser.storage.local.get().then((data) => { console.log(data); });
	}

	else if (target.id === "tabs-alertinfo") {
		browser.tabs.create({ url: 'tabs.html' });
		callOnActiveTab((tab: any) => {
			let props = "";
			for (let item in tab) {
				props += `${item} = ${tab[item]} \n`;
			}
			alert(props);
		});
	}

	else if (target.id === "tabs-activate-random-activewindow") {
		browser.tabs.query({ currentWindow: true }).then((tabs) => {
			OpenRandomTabFromQuery(tabs);
		});
	}

	else if (target.id === "tabs-activate-random-anywhere") {
		browser.tabs.query({}).then((tabs) => {
			OpenRandomTabFromQuery(tabs);
		});
	}
	else if (windowsHandler.processClickEvent(target)) {
		// handled inside WindowsHandler
	}

	e.preventDefault();
});

function OpenRandomTabFromQuery(tabs: browser.tabs.Tab[]) {
	const choosenTab = tabs[Math.floor(Math.random() * tabs.length)];
	windowsHandler.switchToTab(choosenTab);
}

//onRemoved listener. fired when tab is removed
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
	console.log(`The tab with id: ${tabId}, is closing`);

	if (removeInfo.isWindowClosing) {
		console.log(`Its window is also closing.`);
	} else {
		console.log(`Its window is not closing`);
	}
});

//onMoved listener. fired when tab is moved into the same window
browser.tabs.onMoved.addListener((tabId, moveInfo) => {
	var startIndex = moveInfo.fromIndex;
	var endIndex = moveInfo.toIndex;
	console.log(`Tab with id: ${tabId} moved from index: ${startIndex} to index: ${endIndex}`);
});