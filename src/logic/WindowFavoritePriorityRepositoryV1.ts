export class WindowFavoritePriorityRepositoryV1 {
	private sessionStorageNameForWindowFavoritePriority = 'windowFavoritePriority';

	public async get(
		windowId: number,
	): Promise<number | undefined> {
		const favoritePriority = await browser.sessions.getWindowValue(
			windowId,
			this.sessionStorageNameForWindowFavoritePriority,
		);

		return favoritePriority === undefined
			? undefined
			: Number.parseInt(<string>favoritePriority);
	}

	public async set(
		windowId: number,
		favoritePriority: number,
	) {
		await browser.sessions.setWindowValue(
			windowId,
			this.sessionStorageNameForWindowFavoritePriority,
			favoritePriority.toString(),
		);
	}

	public async remove(windowId: number) {
		await browser.sessions.removeWindowValue(
			windowId,
			this.sessionStorageNameForWindowFavoritePriority,
		);
	}
}
