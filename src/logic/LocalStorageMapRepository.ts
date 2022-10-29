import { useLocalStorage } from '@vueuse/core/index';

export abstract class LocalStorageMapRepository {
	private storage;
	constructor(key: string) {
		this.storage = useLocalStorage(key, new Map<string, number>(), { listenToStorageChanges: true });
	}

	public getAllValues(): Array<number> {
		return Array.from(this.storage.value.values());
	}

	public getAllKeys(): Array<string> {
		return Array.from(this.storage.value.keys());
	}

	public get(key: string) {
		return this.storage.value.get(key);
	}

	public set(key: string, value: number) {
		return this.storage.value.set(key, value);
	}

	public includes(key: string): boolean {
		return this.storage.value.has(key);
	}
}
