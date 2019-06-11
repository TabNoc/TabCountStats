/// <reference types="global" />
declare function firstUnpinnedTab(tabs: browser.tabs.Tab[]): number | undefined;
/**
 * listTabs to switch to
 */
declare function listTabs(): void;
declare function getCurrentWindowTabs(): Promise<browser.tabs.Tab[]>;
declare function OpenRandomTabFromQuery(tabs: browser.tabs.Tab[]): void;
