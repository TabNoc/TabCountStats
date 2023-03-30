import { onMessage, sendMessage } from 'webext-bridge';
import type { Tabs } from 'webextension-polyfill';
import { Migrator } from '~/logic/storage/Migrator';
import TabCountStorage from '~/logic/storage/TabCountStorage';
import TabCountHandler from '~/old/ts/background/TabCountHandler';

const tabCountHandler = new TabCountHandler(new TabCountStorage());

async function startAddonBackgroundAsync() {
	await new Migrator().checkAndApplyMigrations();
}
function startAddonBackgroundSync() {
	tabCountHandler.registerListeners();
}

function main() {
	codeFromVueAddonDemo();

	startAddonBackgroundAsync()
		.then(startAddonBackgroundSync);
}

function codeFromVueAddonDemo() {
	// only on dev mode
	if (import.meta.hot) {
		// @ts-expect-error for background HMR
		import('/@vite/client');
		// load latest content script
		import('./contentScriptHMR');
	}

	browser.runtime.onInstalled.addListener((): void => {
		// eslint-disable-next-line no-console
		console.log('Extension installed');
	});

	let previousTabId = 0;

	// communication example: send previous tab title from background page
	// see shim.d.ts for type declaration
	browser.tabs.onActivated.addListener(async({ tabId }) => {
		if (!previousTabId) {
			previousTabId = tabId;
			return;
		}

		let tab: Tabs.Tab;

		try {
			tab = await browser.tabs.get(previousTabId);
			previousTabId = tabId;
		}
		catch {
			return;
		}

		// eslint-disable-next-line no-console
		console.log('previous tab', tab);
		sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId });
	});

	onMessage('get-current-tab', async() => {
		try {
			const tab = await browser.tabs.get(previousTabId);
			return {
				title: tab?.title,
			};
		}
		catch {
			return {
				title: undefined,
			};
		}
	});
}
main();

// Informations about browser.storage.*
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local
