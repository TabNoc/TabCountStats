const sessionStorageNames = {
    windowFavoritePriority: 'windowFavoritePriority',
};

export class WindowFavoritePriorityRepository {
    public async getWindowFavoritePriority(windowId: number) {
        const favoritePriority = await browser.sessions.getWindowValue(windowId, sessionStorageNames.windowFavoritePriority);

        return Number.parseInt(<string>favoritePriority);
    }

    public async saveWindowFavoritePriority(currentWindowId: number, favoritePriority: number) {
        await browser.sessions.setWindowValue(currentWindowId, sessionStorageNames.windowFavoritePriority, favoritePriority.toString());
    }

    public async removeWindowFavoritePriority(currentWindowId: number) {
        await browser.sessions.removeWindowValue(currentWindowId, sessionStorageNames.windowFavoritePriority);
    }
}