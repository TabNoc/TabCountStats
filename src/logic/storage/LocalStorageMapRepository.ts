import type { ComputedRef } from 'vue';
import { useBrowserStorageLocal } from '~/composables/useBrowserStorageLocal';

export abstract class LocalStorageMapRepository {
	private storage;
	constructor(key: string) {
		this.storage = useBrowserStorageLocal(key, new Map<string, number>(), { listenToStorageChanges: true });
	}

	public getAllValues(): ComputedRef<Array<number>> {
		return computed(() => Array.from(new Map([...this.storage.value].sort()).values()));
	}

	public getAllKeys(): ComputedRef<Array<string>> {
		return computed(() => Array.from(new Map([...this.storage.value].sort()).keys()));
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
