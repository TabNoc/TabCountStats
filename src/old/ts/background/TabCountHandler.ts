import type TabCountStorage from '~/logic/storage/TabCountStorage';
import type { TabSessionRepositoryV1 } from '~/logic/storage/TabSessionRepositoryV1';

export default class TabCountHandler {
	constructor(private storage: TabCountStorage, private tabSessionRepository: TabSessionRepositoryV1) {

	}

	public registerListeners() {
		browser.tabs.onRemoved.addListener((tabId) => {
			this.updateCount(tabId, true);
		});
		browser.tabs.onCreated.addListener((tab) => {
			this.updateCount(tab.id!, false);
			this.tabSessionRepository.updateOldestLastAccessed(tab);
		});

		this.updateCount(null, false);
	}

	public updateCount(tabId: number | null, isOnRemoved: boolean) {
		browser.tabs.query({}).then((tabs) => {
			let length = tabs.length;

			// onRemoved fires too early and the count is one too many.
			// see https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
			if (isOnRemoved && tabId && tabs.map(t => t.id).includes(tabId))
				length--;

			browser.browserAction.setBadgeText({ text: length.toString() });

			this.storage.setTabCount(length, null);
		});
	}
}
