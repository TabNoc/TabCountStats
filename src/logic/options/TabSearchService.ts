import type { Ref } from 'vue';
import type { Tabs, Windows } from 'webextension-polyfill';
import { filter, parse } from 'liqe';
import { addSeconds, getYear } from 'date-fns';
import type { TabSearchObject } from './TabSearchObject';

export class TabSearchService {
	tabCache: TabSearchObject[] | null = null;
	tabCacheDate = new Date();

	displayTabs: Ref<Tabs.Tab[]>;
	onlyCurrentWindow: Ref<boolean>;
	tabFilter: Ref<string>;
	tabSorting: Ref<string>;
	tabCount: Ref<number>;
	randomizeResult: Ref<boolean>;
	hideEmpty: Ref<boolean>;
	windowsList: Ref<Map<number, Windows.Window>>;
	constructor(displayTabs: Ref<Tabs.Tab[]>,
		onlyCurrentWindow: Ref<boolean>,
		tabFilter: Ref<string>,
		tabCount: Ref<number>,
		randomizeResult: Ref<boolean>,
		windowsList: Ref<Map<number, Windows.Window>>,
		tabSorting: Ref<string>,
		hideEmpty: Ref<boolean>) {
		this.displayTabs = displayTabs;
		this.onlyCurrentWindow = onlyCurrentWindow;
		this.tabFilter = tabFilter;
		this.tabCount = tabCount;
		this.randomizeResult = randomizeResult;
		this.windowsList = windowsList;
		this.tabSorting = tabSorting;
		this.hideEmpty = hideEmpty;
	}

	public async updateFilteredTabs() {
		let searchResult = await this.getData();

		if (this.tabFilter.value.length !== 0)
			searchResult = [...filter(parse(this.tabFilter.value), searchResult)];
		if (this.hideEmpty.value === true)
			searchResult = searchResult.filter(tso => tso.url !== 'about:newtab' && tso.url !== 'about:home' && tso.url !== 'about:blank');

		if (this.randomizeResult.value === true)
			this.shuffleArray(searchResult);
		else
			this.sortArray(searchResult);

		this.tabCount.value = searchResult.length;
		this.displayTabs.value = searchResult.slice(0, Math.min(searchResult.length, 25)).map(tso => tso.tab);
	}

	private sortArray(searchResult: TabSearchObject[]) {
		if (this.tabSorting.value === 'last accessed date asc')
			searchResult.sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
		else if (this.tabSorting.value === 'last accessed date desc')
			searchResult.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
	}

	private async getTabs(): Promise<TabSearchObject[]> {
		return (await browser.tabs.query({ currentWindow: this.onlyCurrentWindow.value ? true : undefined })).map(tab => this.mapTabToTso(tab));
	}

	private async getData(): Promise<TabSearchObject[]> {
		if (this.onlyCurrentWindow.value !== true) {
			if (this.tabCache == null || addSeconds(this.tabCacheDate, 15) < new Date()) {
				this.tabCache = await this.getTabs();
				this.tabCacheDate = new Date();
			}
			return this.tabCache;
		}
		else {
			return this.getTabs();
		}
	}

	private mapTabToTso(tab: Tabs.Tab): TabSearchObject {
		try {
			return {
				tab,
				title: tab.title,
				window: this.windowsList.value.get(tab.windowId!),
				windowName: this.windowsList.value.get(tab.windowId!)!.title,
				url: tab.url,
				date: tab.lastAccessed?.toString(),
				year: tab.lastAccessed ? getYear(tab.lastAccessed) : 0,
			};
		}
		catch (error) {
			console.error(error);
			throw error;
		}
	}

	private shuffleArray(array: Array<any>) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
}
