export class WindowFavDataBrowserStorage {
    private static readonly CurrentVersion: number = 1;
    
    constructor(data: browser.storage.StorageValue) {
        let anyData = (<any>data) || {};
        this.Version = anyData.Version || WindowFavDataBrowserStorage.CurrentVersion;
        this.Storage = anyData.Storage || new Map<number, number>();
    }
    public Version: number;
    public Storage: Map<number, number>;
}
