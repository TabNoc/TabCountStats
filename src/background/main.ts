import { onMessage, sendMessage } from 'webext-bridge/background';
import type { Tabs } from 'webextension-polyfill';
import { Migrator } from '~/logic/storage/Migrator';
import TabCountStorage from '~/logic/storage/TabCountStorage';
import { TabSessionRepositoryV1 } from '~/logic/storage/TabSessionRepositoryV1';
import TabCountHandler from '~/old/ts/background/TabCountHandler';

let tabCountHandler: TabCountHandler;

async function preStartAddonBackground() {
	await new Migrator().checkAndApplyMigrations();
	tabCountHandler = new TabCountHandler(new TabCountStorage(), new TabSessionRepositoryV1());
}

async function startAddonBackgroundAsync() {
	return Promise.resolve();
}
function startAddonBackgroundSync() {
	tabCountHandler.registerListeners();
}

function main() {
	codeFromVueAddonDemo();

	preStartAddonBackground()
		.then(startAddonBackgroundAsync)
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
		console.log('Extension installed');
	});

	let previousTabId = 0;

	// communication example: send previous tab title from background page
	// see shim.d.ts for type declaration
	browser.tabs.onActivated.addListener(async ({ tabId }) => {
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

		console.log('previous tab', tab);
		sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId });
	});

	onMessage('get-current-tab', async () => {
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
