import { GetDaysBetween } from '../../stuff/General';

export class BadgeProvider {
	public StorageVersion = 0;
	public StartDate!: Date;
	public StartCount!: number;

	constructor(storageData: any) {
		storageData = storageData || {};
		this.loadStorage(storageData);
	}

	// #region public Methods
	public applyBadgeColor(currentTabCount: number) {
		browser.browserAction.setBadgeBackgroundColor({
			color: this.getBadgeColor(currentTabCount),
		});
	}
	// #endregion public Methods

	private getBadgeColor(currentTabCount: number) {
		this.checkStorage(currentTabCount);

		const expectedTabCount = this.getExpectedTabCount();

		if (currentTabCount <= expectedTabCount)
			return 'green';
		else
			return 'red';
	}

	private getExpectedTabCount(): number {
		const TabsPerDay = 5;

		this.CheckAndThrowStorage();

		const amount = GetDaysBetween(this.StartDate, new Date());

		return this.StartCount - TabsPerDay * amount;
	}

	// #region Private Methods Storage
	private getCurrentStorageVersion() {
		return 1;
	}

	private checkStorage(currentTabCount: number) {
		if (this.StorageVersion === 0) {
			this.initStorage(currentTabCount);
		}
		else if (this.StorageVersion === this.getCurrentStorageVersion()) {

		}
		else {
			throw new Error('BadgeProvider: Current Storageversion not Supported');
		}
	}

	private CheckAndThrowStorage() {
		if (this.StorageVersion !== this.getCurrentStorageVersion())
			throw new Error('BadgeProvider: Storage not ready!');
	}

	private initStorage(currentTabCount: number) {
		this.StorageVersion = 1;
		this.StartCount = currentTabCount;
		this.StartDate = new Date();
	}

	private loadStorage(storageData: any) {
		this.StorageVersion = storageData.StorageVersion || 0;
		this.StartCount = storageData.StartCount;
		this.StartDate = storageData.StartDate;
	}
	// #endregion Private Methods Storage
}
