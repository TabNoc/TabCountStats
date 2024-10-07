import type { Tabs } from 'webextension-polyfill';
import type { TabSessionRepositoryV1 } from './storage/TabSessionRepositoryV1';

export function getCaptureTabUrl(tab: Tabs.Tab): Promise<string> {
	if (!tab.id)
		return Promise.resolve('');

	browser.tabs.warmup(tab.id);
	const blub = browser.tabs.captureTab(tab.id, { format: 'png' });
	// return sendMessage('get-capture-tab', tab.id);

	return blub;
}

const formatDate = (date: number): string => {
	return new Date(date).toLocaleString();
};

export async function getFirstSeenDateString(tabSessionRepository: TabSessionRepositoryV1, tab: Tabs.Tab): Promise<string> {
	const date = await 	tabSessionRepository.getOldestLastAccessed(tab);

	return date !== tab.lastAccessed ? formatDate(date) : '';
}

export function getLastUsedDateString(tab: Tabs.Tab): string {
	return formatDate(tab.lastAccessed ?? 0);
}
