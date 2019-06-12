import { TabDataBrowserStorageHandler } from "./TabDataBrowserStorageHandler";

function updateCount(tabId: number, isOnRemoved: boolean) {
    browser.tabs.query({})
        .then((tabs) => {
            let length = tabs.length;

            // onRemoved fires too early and the count is one too many.
            // see https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
            if (isOnRemoved && tabId && tabs.map((t) => { return t.id; }).includes(tabId)) {
                length--;
            }

            browser.browserAction.setBadgeText({ text: length.toString() });

            new TabDataBrowserStorageHandler(tabs).Process();
        });
}

// Informations about browser.storage.*
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local



browser.tabs.onRemoved.addListener((tabId) => {
    updateCount(tabId, true);
});
browser.tabs.onCreated.addListener((tab) => {
    updateCount(tab.id!, false);
});

updateCount(1, false);