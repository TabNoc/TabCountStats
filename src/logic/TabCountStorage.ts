import TabCountStorageRepositoryV2 from './TabCountStorageRepositoryV2';

export default class TabCountStorage {
	private storage: TabCountStorageRepositoryV2 = new TabCountStorageRepositoryV2();

	public setTabCount(tabCount: number, date: Date | null) {
		const key: string = this.getDate(date || new Date());

		this.storage.set(key, tabCount);
	}

	private getDate(date: Date) {
		return `${this.addZero(date.getDate())}.${this.addZero(
			date.getMonth() + 1,
		)}.${date.getFullYear()}>${this.addZero(date.getHours())}`;
	}

	private addZero(value: number): string {
		return `${value < 10 ? '0' : ''}${value}`;
	}
}
