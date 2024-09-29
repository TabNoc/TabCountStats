import { LocalStorageMapRepository } from './LocalStorageMapRepository';
import { useBrowserStorageLocal } from '~/composables/useBrowserStorageLocal';

export class SearchStorageRepositoryV1 extends LocalStorageMapRepository<string> {
	constructor() {
		super('SearchLineStorageV1');
	}
}

export default class SearchStorage {
	private storage: SearchStorageRepositoryV1 = new SearchStorageRepositoryV1();
	private pageTabCountStorage = useBrowserStorageLocal('pageTabCount', 11, { listenToStorageChanges: true });

	public getSearchLines(): string[] | undefined {
		const result = this.storage.get('searchLines');
		if (result === undefined)
			return undefined;
		return JSON.parse(result);
	}

	public saveSearchLine(tabFilter: string): void {
		const list = this.getSearchLines() ?? [];
		list.push(tabFilter);
		this.storage.set('searchLines', JSON.stringify(list));
	}

	public includesSearchLine(tabFilter: string): boolean {
		return this.getSearchLines()?.includes(tabFilter) ?? false;
	}

	public getPageTabCount(): Ref<number> {
		return this.pageTabCountStorage;
	}
}
