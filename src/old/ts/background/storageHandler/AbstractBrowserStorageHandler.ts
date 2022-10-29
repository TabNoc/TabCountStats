import { WriteError, WriteLog } from '../../stuff/General';

export abstract class AbstractBrowserStorageHandler {
	constructor(
		private storageNodeName: string,
		private verboseLogging: boolean = true,
	) { }

	protected async Process(
		processor: (data: any) => any | null,
	): Promise<void> {
		const loadedData = await this.LoadDataAsync();
		const changedData = processor(loadedData);
		if (changedData == null)
			return;

		if (changedData[this.storageNodeName] == null) {
			if (
				JSON.stringify(loadedData) != JSON.stringify(changedData)
				|| loadedData == changedData
				|| true
			)
				this.SaveData(changedData);
			else
			if (this.verboseLogging)
				WriteLog('Nothing changed, saving skipped!');
		}
		else {
			throw new Error('BrowserStorageHandler.ProcessData returned wrong datastructure');
		}
	}

	private LoadDataAsync(): Promise<any> {
		return new Promise((resolve) => {
			browser.storage.local.get(this.storageNodeName).then((data) => {
				if (this.verboseLogging) {
					WriteLog(
						`Loaded Data: ${this.storageNodeName}`,
						data[this.storageNodeName],
					);
				}
				resolve(JSON.parse(data[this.storageNodeName] || ''));
			}, this.OnLoadFail);
		});
	}

	private OnLoadFail(reason: any): void {
		WriteError('Load Failed', reason);
		throw new Error(reason);
	}

	private SaveData(data: any) {
		if (this.verboseLogging)
			WriteLog(`Save Data: ${this.storageNodeName}`, data);
		browser.storage.local.set({ [this.storageNodeName]: JSON.stringify(data) });
	}
}
