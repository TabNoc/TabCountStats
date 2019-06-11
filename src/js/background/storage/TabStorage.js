"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BadgeProvider_1 = require("./BadgeProvider");
class TabStorage {
    constructor(storageData) {
        storageData = storageData || {};
        this.tabCount = storageData.tabCount || {};
        this.ids = storageData.ids || new Array();
        this.badgeProvider = new BadgeProvider_1.BadgeProvider(storageData.badgeProvider);
    }
}
exports.TabStorage = TabStorage;
