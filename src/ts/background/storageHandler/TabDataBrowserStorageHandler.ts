import { AbstractBrowserStorageHandler } from "./AbstractBrowserStorageHandler";
import { TabDataBrowserStorage } from "../storage/TabDataBrowserStorage";

export class TabDataBrowserStorageHandler extends AbstractBrowserStorageHandler {
    constructor(private tabs: browser.tabs.Tab[]) {
        super("tabData", true);
    }
    protected ProcessData(data: browser.storage.StorageValue): TabDataBrowserStorage {
        const storageData = new TabDataBrowserStorage(data);

        storageData.storage.addTabCount(this.tabs.length);

        storageData.BadgeProvider.setBadgeColor(this.tabs.length);

        return storageData;
    }
}
