import { LocalStorageMapRepository } from './LocalStorageMapRepository';

export default class TabCountStorageRepositoryV2 extends LocalStorageMapRepository {
	constructor() {
		super('TabCountStorageV2');
	}
}
