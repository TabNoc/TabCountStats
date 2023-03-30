import TabCountStorageRepositoryV2 from './TabCountStorageRepositoryV2';

export default class TabCountStorage {
	private storage: TabCountStorageRepositoryV2 = new TabCountStorageRepositoryV2();

	public setTabCount(tabCount: number, date: Date | null): void {
		const key: string = this.getDate(date || new Date());

		this.storage.set(key, tabCount);
	}

	public getTabCount(date: Date | null): number|undefined {
		const key: string = this.getDate(date || new Date());

		return this.storage.get(key);
	}

	private getDate(date: Date): string {
		return `${date.getFullYear()}${this.addZero(date.getMonth() + 1)}${this.addZero(date.getDate())}_${this.addZero(date.getHours())}`;
	}

	private addZero(value: number): string {
		return `${value < 10 ? '0' : ''}${value}`;
	}
}
