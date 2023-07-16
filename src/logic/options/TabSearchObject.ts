import type { Tabs, Windows } from 'webextension-polyfill';

export interface TabSearchObject {
	tab: Tabs.Tab
	title: string | undefined
	window: Windows.Window | undefined
	windowName: string | undefined
	url: string | undefined
	date: string | undefined
	year: number | undefined
}
