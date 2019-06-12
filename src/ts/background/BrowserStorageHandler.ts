import { WriteError, WriteLog } from "./General";
import { Disposer } from "./Disposer";

export abstract class BrowserStorageHandler extends Disposer 
{
    constructor(private storageNodeName: string, private verboseLogging: boolean = true) {
        super();
    }

    public async Process() {
        this.CheckOrThrowDisposed();
        const loadedData = await this.LoadDataAsync();
        const changedData = this.ProcessData(loadedData);
        
        if (loadedData != changedData) {
            this.SaveData(changedData);
        }
        this.dispose();
    }

    private LoadDataAsync(): Promise<browser.storage.StorageValue> {
        this.CheckOrThrowDisposed();
        return new Promise(resolve => {
            browser.storage.sync
                .get(this.storageNodeName)
                .then((data) => {
                    if (this.verboseLogging)
                        WriteLog(`Loaded Data: ${this.storageNodeName}`, data);
                    resolve(data);
                }, this.OnLoadFail);
        });
    }

    private OnLoadFail(reason: any): void {
        WriteError("Load Failed", reason);
        throw new Error(reason);
    }

    private SaveData(data: browser.storage.StorageValue) {
        this.CheckOrThrowDisposed();
        if (this.verboseLogging)
            WriteLog(`Save Data: ${this.storageNodeName}`, data);
        browser.storage.sync.set({ [this.storageNodeName]: data });
    }

    protected abstract ProcessData(data: browser.storage.StorageValue): browser.storage.StorageValue;
}