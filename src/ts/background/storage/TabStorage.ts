import { BadgeProvider } from "./BadgeProvider"

export class TabStorage {
    tabCount: number[];
    ids: string[];
    badgeProvider: BadgeProvider;
    constructor(storageData: any) {
        storageData = storageData || {};
        this.tabCount = storageData.tabCount || {};
        this.ids = storageData.ids || new Array();
        this.badgeProvider = new BadgeProvider(storageData.badgeProvider);
    }
}