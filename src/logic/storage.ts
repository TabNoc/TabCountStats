import { useStorageLocal } from '~/composables/useStorageLocal';
import { TabDataBrowserStorage } from '~/old/ts/background/storage/TabDataBrowserStorage';

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo', { listenToStorageChanges: true });
export const storageTest = useStorageLocal<TabDataBrowserStorage>('tabData', new TabDataBrowserStorage(null), { listenToStorageChanges: true });
