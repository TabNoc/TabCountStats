import { AbstractBrowserStorageHandler } from "./AbstractBrowserStorageHandler";
import { TabDataBrowserStorage } from "../storage/TabDataBrowserStorage";

export class TabDataBrowserStorageHandler extends AbstractBrowserStorageHandler {
    constructor(private tabCount: number) {
        super("tabData", true);
    }
    protected ProcessData(data: browser.storage.StorageValue): TabDataBrowserStorage {
        const storageData = new TabDataBrowserStorage(data);

        storageData.storage.addTabCount(this.tabCount);

        storageData.BadgeProvider.applyBadgeColor(this.tabCount);

        return storageData;
    }
}
