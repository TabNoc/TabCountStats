import type { Tabs } from 'webextension-polyfill';

export function getCaptureTabUrl(tab: Tabs.Tab): Promise<string> {
	if (!tab.id)
		return Promise.resolve('');

	browser.tabs.warmup(tab.id);
	const blub = browser.tabs.captureTab(tab.id, { format: 'png' });
	// return sendMessage('get-capture-tab', tab.id);

	return blub;
}
