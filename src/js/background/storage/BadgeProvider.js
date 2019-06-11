"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BadgeProvider {
    constructor(storageData) {
        storageData = storageData || {};
    }
    setBadgeColor() {
        browser.browserAction.setBadgeBackgroundColor({ 'color': this.getBadgeColor() });
    }
    getBadgeColor() {
        if (true) {
            return "green";
        }
    }
}
exports.BadgeProvider = BadgeProvider;
