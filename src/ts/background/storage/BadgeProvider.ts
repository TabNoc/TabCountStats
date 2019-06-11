export class BadgeProvider {
    constructor(storageData: any) {
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