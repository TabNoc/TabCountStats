import { WindowFavDataBrowserStorage } from "../storage/WindowFavDataBrowserStorage";
import { AbstractBrowserStorageHandler } from "./AbstractBrowserStorageHandler";

export class WindowFavDataStorageHandler extends AbstractBrowserStorageHandler {
    constructor() {
        super("windowFav", true);
    }
    public async AddWindow(windowId: number, priority: number): Promise<void> {
        await this.Process((data) => {
            const storageData = new WindowFavDataBrowserStorage(data);
            storageData.Storage.set(windowId, priority);
            return storageData;
        });
    }
    public async RemoveWindow(windowId: number): Promise<void> {
        await this.Process((data) => {
            const storageData = new WindowFavDataBrowserStorage(data);
            storageData.Storage.delete(windowId);
            return storageData;
        });
    }
    public async GetMap(): Promise<Map<number, number>> {
        return new Promise((resolve, reject) => {
            this.Process((data) => {
                const storageData = new WindowFavDataBrowserStorage(data);
                resolve(storageData.Storage);
                return null;
            });
        });
    }
    public async CleanupWindows(windows: browser.windows.Window[]): Promise<void> {
        await this.Process(data => {
            const storageData = new WindowFavDataBrowserStorage(data);

            storageData.Storage.forEach((value: number, key: number, map) => {
                if (windows.some((window) => window.id == key) == false) {
                    map.delete(key);
                }
            });

            return storageData;
        });
    }
}
