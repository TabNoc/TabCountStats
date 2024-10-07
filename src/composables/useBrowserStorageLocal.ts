import { storage } from 'webextension-polyfill';
import type {
	MaybeRef,
	RemovableRef,
	StorageLikeAsync,
	UseStorageAsyncOptions,
} from '@vueuse/core/index';
import {
	useStorageAsync,
} from '@vueuse/core/index';
import { blue, yellow } from 'kolorist';

const browserStorageLocal: StorageLikeAsync = {
	removeItem(key: string): Promise<void> {
		return storage.local.remove(key);
	},

	async setItem(key: string, value: string): Promise<void> {
		console.debug('setItem', yellow(key), blue(value));
		return (await storage.local.set({ [key]: value }));
	},

	async getItem(key: string): Promise<string | null> {
		return (await storage.local.get(key))[key];
	},
};

export const useBrowserStorageLocal = <T>(
	key: string,
	initialValue: MaybeRef<T>,
	options?: UseStorageAsyncOptions<T>,
): RemovableRef<T> => useStorageAsync(key, initialValue, browserStorageLocal, options);
