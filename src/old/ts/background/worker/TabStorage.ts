export class TabStorage {
	tabCount: Record<string, number>;
	ids: string[];
	constructor(storageData: any | null) {
		storageData = storageData || {};
		this.tabCount = storageData.tabCount || {};
		this.ids = storageData.ids || [];
	}

	addTabCount(tabCount: number) {
		const id: string = this.getDate(new Date());
		if (this.ids.includes(id) === false)
			this.ids.push(id);

		this.tabCount[id] = tabCount;
	}

	// TODO: date.getMonth() is one number to short (e.g. May is 4)
	getDate(date: Date) {
		const addzero = (value: number): string | number => {
			return value < 10 ? `0${value}` : value;
		};
		return `${addzero(date.getDate())}.${addzero(
			date.getMonth(),
		)}.${date.getFullYear()}>${addzero(date.getHours())}`;
	}
}
