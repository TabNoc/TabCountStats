import { TabDataBrowserStorage } from '../storage/TabDataBrowserStorage';
import { AbstractBrowserStorageHandler } from './AbstractBrowserStorageHandler';

export class TabDataBrowserStorageHandler extends AbstractBrowserStorageHandler {
	constructor() {
		super('tabData', true);
	}

	/**
   * processTabCount
   */
	public ProcessTabCount(tabCount: number) {
		this.Process((data) => {
			const storageData = new TabDataBrowserStorage(data);

			storageData.storage.addTabCount(tabCount);

			storageData.BadgeProvider.applyBadgeColor(tabCount);

			return storageData;
		});
	}
}
