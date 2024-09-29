import type { ComputedRef } from 'vue';
import { useBrowserStorageLocal } from '~/composables/useBrowserStorageLocal';

// !!!!!!!!!!!!!!! DO NOT USE THIS CLASS FOR NEW CODE !!!!!!!!!!!!!!!
// it looks like this is just a bad usecase, the value will get overwritten
export abstract class LocalStorageMapRepository<T> {
	private storage;
	constructor(key: string) {
		this.storage = useBrowserStorageLocal(key, new Map<string, T>(), { listenToStorageChanges: true });
	}

	public getAllValues(): ComputedRef<Array<T>> {
		return computed(() => Array.from(new Map([...this.storage.value].sort()).values()));
	}

	public getAllKeys(): ComputedRef<Array<string>> {
		return computed(() => Array.from(new Map([...this.storage.value].sort()).keys()));
	}

	public get(key: string): T | undefined {
		return this.storage.value.get(key);
	}

	public set(key: string, value: T): Map<string, T> {
		return this.storage.value.set(key, value);
	}

	public includes(key: string): boolean {
		return this.storage.value.has(key);
	}
}
