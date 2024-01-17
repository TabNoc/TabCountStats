import type { Tabs, Windows } from 'webextension-polyfill';
import type { WindowFavoritePriorityRepositoryV1 } from './storage/WindowFavoritePriorityRepositoryV1';

export async function getWindows(windowFavoriteRepository: WindowFavoritePriorityRepositoryV1): Promise<Array<WindowWrapper>> {
	const windows = await browser.windows.getAll();
	const currentWindowId = (await browser.windows.getCurrent()).id;

	const filteredWindows = windows
		.filter(_ => _.id !== undefined);

	const storageMap = new Map<number, number | undefined>();

	for (const window of filteredWindows) {
		storageMap.set(
			window.id!,
			await windowFavoriteRepository.get(
				window.id!,
			),
		);
	}

	return filteredWindows
		.map(window => ({
			window,
			title: adjustTitle(window.title),
			priority: storageMap.get(window.id!),
			isCurrentWindow: window.id === currentWindowId,
		}))
		.sort((firstWindow, secondWindow) =>
			sortWindows(firstWindow, secondWindow) * -1);
}

export interface WindowWrapper {
	window: Windows.Window
	title: string
	priority: number | undefined
	isCurrentWindow: boolean
}

export function adjustTitle(orgTitle = ''): string {
	const delimiters = [' – ', ' — ', ' - '];

	for (const delimiter of delimiters) {
		if (orgTitle.includes(delimiter)
			&& orgTitle
				.substring(orgTitle.lastIndexOf(delimiter))
				.toLowerCase()
				.includes('firefox'))
			return orgTitle.slice(0, orgTitle.lastIndexOf(delimiter));
	}
	return orgTitle;
}

function sortWindows(
	firstWindow: WindowWrapper,
	secondWindow: WindowWrapper,
): number {
	const firstTitle: string = firstWindow.window.title ?? '';
	const secondTitle: string = secondWindow.window.title ?? '';

	const hasFirstWindow = firstWindow.priority !== undefined;
	const hasSecondWindow = secondWindow.priority !== undefined;
	if (hasFirstWindow && hasSecondWindow) {
		if (firstWindow.priority! > secondWindow.priority!)
			return -1;

		if (firstWindow.priority! < secondWindow.priority!)
			return 1;
	}
	else if (hasFirstWindow && hasSecondWindow === false) {
		return -1;
	}
	else if (hasFirstWindow === false && hasSecondWindow) {
		return 1;
	}

	if (firstTitle.startsWith('[') && secondTitle.startsWith('[') === false)
		return -1;

	if (firstTitle.startsWith('[') === false && secondTitle.startsWith('['))
		return 1;

	if (firstTitle < secondTitle)
		return -1;

	return 1;
}

export function switchToWindow(windowId?: number) {
	if (windowId !== undefined) {
		browser.windows.update(windowId, {
			focused: true,
		});
	}
}

export async function moveTabToWindow(windowId?: number, tabId?: number) {
	if (windowId !== undefined && tabId !== undefined) {
		const additionalHighlightedTabOfSameWindow = (await browser.tabs.query(
			{ highlighted: true, active: false, windowId: (await browser.tabs.get(tabId)).windowId },
		))
			.map(window => window.id!)
			.filter(id => id !== null && id !== undefined);

		await browser.tabs.move([tabId, ...additionalHighlightedTabOfSameWindow], {
			windowId,
			index: -1,
		});
	}
}

export function switchToTab(choosenTab: Tabs.Tab): void {
	if (choosenTab.windowId !== undefined) {
		browser.tabs.update(choosenTab.id, {
			active: true,
		});
		switchToWindow(choosenTab.windowId);
	}
}
