import { TabStorage } from "./TabStorage";
import { BadgeProvider } from "./BadgeProvider";
export class TabDataBrowserStorage {
    private static readonly CurrentVersion: number = 1;
    constructor(data: browser.storage.StorageValue) {
        let anyData = (<any>data) || {};
        this.Version = anyData.Version || TabDataBrowserStorage.CurrentVersion;
        this.storage = new TabStorage(anyData.storage || {});
        this.BadgeProvider = new BadgeProvider(anyData.BadgeProvider);
    }
    public Version: number;
    public storage: TabStorage;
    public BadgeProvider: BadgeProvider;
}
