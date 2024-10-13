import type { Tabs } from 'webextension-polyfill';
import type { TabSessionRepositoryV1 } from './storage/TabSessionRepositoryV1';

export function getCaptureTabUrl(tab: Tabs.Tab): Promise<string> {
	if (!tab.id)
		return Promise.resolve('');

	let counter = 0;

	async function handler(str: string): Promise<string> {
		counter++;
		const canvas = document.createElement('canvas');
		const img = new Image();
		img.src = str;
		canvas.getContext('2d')?.drawImage(img, 0, 0);
		const nonWhitePx = canvas
			.getContext('2d')
			?.getImageData(0, 0, canvas.width, canvas.height)
			.data
			.filter(b => b !== 255)
			.length;
		if (nonWhitePx === 0 && counter <= 5)
			return browser.tabs.captureTab(tab.id, { format: 'png' }).then(handler);
		else
			return str;
	}

	const blub = browser.tabs.captureTab(tab.id, { format: 'png' }).then(handler);
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
