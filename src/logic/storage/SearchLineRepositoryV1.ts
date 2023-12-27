import { LocalStorageMapRepository } from './LocalStorageMapRepository';

export class SearchLineStorageRepositoryV1 extends LocalStorageMapRepository<string> {
	constructor() {
		super('SearchLineStorageV1');
	}
}

export default class SearchLineStorage {
	private storage: SearchLineStorageRepositoryV1 = new SearchLineStorageRepositoryV1();

	public getSearchLines(): string[] | undefined {
		const result = this.storage.get('searchLines');
		if (result === undefined)
			return undefined;
		return JSON.parse(result);
	}

	public save(tabFilter: string) {
		const list = this.getSearchLines() ?? [];
		list.push(tabFilter);
		this.storage.set('searchLines', JSON.stringify(list));
	}

	public includes(tabFilter: string): boolean {
		return this.getSearchLines()?.includes(tabFilter) ?? false;
	}
}
