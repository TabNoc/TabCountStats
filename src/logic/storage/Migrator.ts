import TabCountStorage from './TabCountStorage';
import { TabSessionRepositoryV1 } from './TabSessionRepositoryV1';
import { defaultData } from '~/old/ts/background/worker/exampleData';

export class Migrator {
	private CurrentVersion = 4;
	public async checkAndApplyMigrations() {
		if (await this.getBaseStorageVersion(-1) === -1)
			await this.seedData();
		if (await this.getBaseStorageVersion(-1) === 0)
			await this.migrateStorageV0ToV1();
		if (await this.getBaseStorageVersion(-1) === 1)
			await this.migrateStorageV1ToV2();
		if (await this.getBaseStorageVersion(-1) === 2 || await this.getBaseStorageVersion(-1) === 3)
			await this.migrateStorageV2ToV4();

		if (await this.getBaseStorageVersion(-1) !== this.CurrentVersion)
			throw new Error(`Migration failed!\r\n CurrentrVersion: ${await this.getBaseStorageVersion(-1)}, expected Version: ${this.CurrentVersion}`);
	}

	private async migrateStorageV1ToV2(): Promise<void> {
		console.warn('Migrating local storage from version 1 to 2');

		const storage = new TabCountStorage();
		const tabSessionRepository = new TabSessionRepositoryV1();

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

		for await (const tab of await browser.tabs.query({}))
			await tabSessionRepository.updateOldestLastAccessed(tab);

		await browser.storage.local.remove('tabData');
		await browser.storage.local.set({ backup1To2: { tabData: data } });
		await browser.storage.local.set({ version: 2 });
	}

	private async migrateStorageV2ToV4(): Promise<void> {
		console.warn('Migrating local storage from version 2 to 4');

		const tabSessionRepository = new TabSessionRepositoryV1();

		for await (const tab of await browser.tabs.query({}))
			await tabSessionRepository.updateOldestLastAccessed(tab);

		await browser.storage.local.set({ version: 4 });
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
