import { WriteError, WriteLog } from "../../stuff/General";
import { Disposer } from "../../stuff/Disposer";

export abstract class AbstractBrowserStorageHandler extends Disposer {
    constructor(private storageNodeName: string, private verboseLogging: boolean = true) {
        super();
    }

    public async Process() {
        this.CheckOrThrowDisposed();
        const loadedData = await this.LoadDataAsync();
        const changedData = this.ProcessData(loadedData);

        if (changedData[this.storageNodeName] == null) {
            if (JSON.stringify(loadedData) != JSON.stringify(changedData) || loadedData == changedData || true) {
                this.SaveData(changedData);
            } else {
                if (this.verboseLogging)
                    WriteLog("Nothing changed, saving skipped!");
            }
        }
        else {
            throw "BrowserStorageHandler.ProcessData returned wrong datastructure";
        }
        this.dispose();
    }

    private LoadDataAsync(): Promise<browser.storage.StorageValue> {
        this.CheckOrThrowDisposed();
        return new Promise(resolve => {
            browser.storage.local
                .get(this.storageNodeName)
                .then((data) => {
                    if (this.verboseLogging)
                        WriteLog(`Loaded Data: ${this.storageNodeName}`, data[this.storageNodeName]);
                    resolve(data[this.storageNodeName]);
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
        browser.storage.local.set({ [this.storageNodeName]: data });
    }

    protected abstract ProcessData(data: browser.storage.StorageValue): any;
}