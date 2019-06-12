import { BrowserStorageHandler } from "./BrowserStorageHandler";
import { TabDataBrowserStorage } from "../storage/TabDataBrowserStorage";

export class TabDataBrowserStorageHandler extends BrowserStorageHandler {
    constructor(private tabs: browser.tabs.Tab[]) {
        super("tabData", true);
    }
    protected ProcessData(data: browser.storage.StorageValue): TabDataBrowserStorage {
        const storageData = new TabDataBrowserStorage(data);

        storageData.storage.addTabCount(this.tabs.length);

        storageData.BadgeProvider.setBadgeColor()

        return storageData;
    }
}
