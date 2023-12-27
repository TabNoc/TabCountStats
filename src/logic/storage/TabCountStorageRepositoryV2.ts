import { LocalStorageMapRepository } from './LocalStorageMapRepository';

export default class TabCountStorageRepositoryV2 extends LocalStorageMapRepository<number> {
	constructor() {
		super('TabCountStorageV2');
	}
}
