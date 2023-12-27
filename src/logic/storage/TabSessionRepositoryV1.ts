import type { Tabs } from 'webextension-polyfill';

export class TabSessionRepositoryV1 {
	public async getOldestLastAccessed(tab: Tabs.Tab): Promise<number> {
		// eslint-disable-next-line eqeqeq
		if (tab.id == undefined)
			throw new Error('tab.id is undefined!');

		const result = await browser.sessions.getTabValue(tab.id, 'oldestLastAccessed');
		// this should not be needed anymore, but its still occasionally happening
		// eslint-disable-next-line eqeqeq
		if (result == undefined) {
			await this.setOldestLastAccessed(tab, tab.lastAccessed ?? Date.now());
			const result2 = await browser.sessions.getTabValue(tab.id, 'oldestLastAccessed');
			console.log('getOldestLastAccessed', tab.id, result, result2);
			return result2;
		}

		return result;
	}

	public async setOldestLastAccessed(tab: Tabs.Tab, value: number): Promise<void> {
		// eslint-disable-next-line eqeqeq
		if (tab.id == undefined)
			throw new Error('tab.id is undefined!');
		// eslint-disable-next-line eqeqeq
		if (value == undefined)
			throw new Error('value is undefined!');

		await browser.sessions.setTabValue(tab.id, 'oldestLastAccessed', value);
	}

	public async removeOldestLastAccessed(tab: Tabs.Tab): Promise<void> {
		// eslint-disable-next-line eqeqeq
		if (tab.id == undefined)
			throw new Error('tab.id is undefined!');

		await browser.sessions.removeTabValue(tab.id, 'oldestLastAccessed');
	}

	/**
	 * updateOldestLastAccessed
	 */
	public async updateOldestLastAccessed(tab: Tabs.Tab): Promise<void> {
		// eslint-disable-next-line eqeqeq
		if (await this.getOldestLastAccessed(tab) == undefined)
			await this.setOldestLastAccessed(tab, tab.lastAccessed ?? Date.now());
	}
}
