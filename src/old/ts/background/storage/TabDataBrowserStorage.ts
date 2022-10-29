import { TabStorage } from '../worker/TabStorage';
import { BadgeProvider } from '../worker/BadgeProvider';
export class TabDataBrowserStorage {
	private static readonly CurrentVersion: number = 1;

	constructor(data: any) {
		const anyData = data || {};
		this.Version = anyData.Version || TabDataBrowserStorage.CurrentVersion;
		this.storage = new TabStorage(anyData.storage || {});
		this.BadgeProvider = new BadgeProvider(anyData.BadgeProvider);
	}

	public Version: number;
	public storage: TabStorage; // TODO: Rename to TabHistory
	public BadgeProvider: BadgeProvider;
}
