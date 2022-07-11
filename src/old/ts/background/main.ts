import { TabDataBrowserStorageHandler } from './storageHandler/TabDataBrowserStorageHandler';

function updateCount(tabId: number | null, isOnRemoved: boolean) {
	browser.tabs.query({}).then((tabs) => {
		let length = tabs.length;

		// onRemoved fires too early and the count is one too many.
		// see https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
		if (isOnRemoved
			&& tabId
			&& tabs.map(t => t.id)
				.includes(tabId)
		)
			length--;

		browser.browserAction.setBadgeText({ text: length.toString() });

		new TabDataBrowserStorageHandler().ProcessTabCount(length);
	});
}

async function moveStorage() {
	await browser.storage.local.get({ version: 0 }).then(async(data) => {
		if (data.version === 0) {
			console.log('Migrating local storage from version 0 to 1');

			await migrateLocal0To1();
		}
	});

	async function migrateLocal0To1(): Promise<void> {
		return new Promise((resolve) => {
			browser.storage.sync.get('tabData').then((data) => {
				browser.storage.local.set({ tabData: data.tabData });
				console.log('data was moved!');

				browser.storage.local.get('tabData').then((newData) => {
					console.log('This data was readed back:', newData);
					if (JSON.stringify(newData) === JSON.stringify(data)) {
						console.log('Data valid!');
						browser.storage.sync
							.remove('tabData')
							.catch(console.error)
							.then(() => {
								console.log('OK');
								browser.storage.local
									.set({ version: 1 })
									.catch(console.error)
									.then(() => {
										console.log('OK!');
										resolve();
									}, console.warn);
							}, console.warn);
					}
				});
			});
		});
	}
}
moveStorage();

// Informations about browser.storage.*
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local

browser.tabs.onRemoved.addListener((tabId) => {
	updateCount(tabId, true);
});
browser.tabs.onCreated.addListener((tab) => {
	updateCount(tab.id!, false);
});

updateCount(null, false);
