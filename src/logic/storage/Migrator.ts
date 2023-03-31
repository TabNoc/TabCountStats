import TabCountStorage from './TabCountStorage';
import { defaultData } from '~/old/ts/background/worker/exampleData';

export class Migrator {
	private CurrentVersion = 1;
	public async checkAndApplyMigrations() {
		if (await this.getBaseStorageVersion(-1) === -1)
			await this.seedData();
		if (await this.getBaseStorageVersion(this.CurrentVersion) === 0)
			await this.migrateStorageV0ToV1();
		if (await this.getBaseStorageVersion(this.CurrentVersion) === 1)
			await this.migrateStorageV1ToV2();
	}

	private async migrateStorageV1ToV2(): Promise<void> {
		console.warn('Migrating local storage from version 1 to 2');

		const storage = new TabCountStorage();
		const data = (await browser.storage.local.get('tabData') as any).tabData;

		if (data === undefined)
			return;

		if (data.Version !== 1)
			throw new Error('Version not supported for Migration');
		const storageData = data.storage as { tabCount: Record<string, number>; ids: Array<string> };

		const regex = /(\d{2}).(\d{2}).(\d{4})>(\d{2})/;
		for (const entry of Object.entries(storageData.tabCount)) {
			const [, day, month, year, hours] = regex.exec(entry[0]) || [];
			const dateObject = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day), Number.parseInt(hours));
			storage.setTabCount(entry[1], dateObject);
		}

		await browser.storage.local.set({ BadgeProvider: data.BadgeProvider });

		for await (const tab of await browser.tabs.query({})) {
			if (await browser.sessions.getTabValue(tab.id!, 'oldestLastAccessed') === undefined)
				await browser.sessions.setTabValue(tab.id!, 'oldestLastAccessed', tab.lastAccessed);
		}

		await browser.storage.local.remove('tabData');
		await browser.storage.local.set({ version: 2 });
	}

	async seedData(): Promise<void> {
		console.warn('Initializing local storage to version 1');
		if ((await browser.storage.sync.get('tabData') as any).tabData !== undefined)
			throw new Error('Data Present!');
		await browser.storage.local.set(defaultData);
		await browser.storage.local.set({ version: 1 });
	}

	private async getBaseStorageVersion(defaultVersion: number): Promise<number> {
		return (await browser.storage.local.get({ version: defaultVersion }) as any).version;
	}

	private async migrateStorageV0ToV1(): Promise<void> {
		console.warn('Migrating local storage from version 0 to 1');

		const data = await browser.storage.sync.get('tabData');
		await browser.storage.local.set({ tabData: data.tabData });

		console.warn('data was moved!');

		const newData = await browser.storage.local.get('tabData');
		console.warn('This data was readed back:', newData);
		if (JSON.stringify(newData) === JSON.stringify(data)) {
			console.warn('Data valid!');
			await browser.storage.sync.remove('tabData');

			console.warn('OK');
			await browser.storage.local.set({ version: 1 });

			console.warn('OK!');
		}
	}
}
