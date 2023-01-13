import { storage } from 'webextension-polyfill';
import type {
	MaybeRef,
	RemovableRef,
	StorageAsyncOptions,
	StorageLikeAsync,
} from '@vueuse/core/index';
import {
	useStorageAsync,
} from '@vueuse/core/index';

const browserStorageLocal: StorageLikeAsync = {
	removeItem(key: string) {
		return storage.local.remove(key);
	},

	async setItem(key: string, value: string) {
		console.log('setItem', key, value);
		return (await storage.local.set({ [key]: value }));
	},

	async getItem(key: string) {
		return (await storage.local.get(key))[key];
	},
};

export const useBrowserStorageLocal = <T>(
	key: string,
	initialValue: MaybeRef<T>,
	options?: StorageAsyncOptions<T>,
): RemovableRef<T> => useStorageAsync(key, initialValue, browserStorageLocal, options);