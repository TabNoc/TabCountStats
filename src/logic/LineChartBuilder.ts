import type { TChartData } from 'vue-chartjs/dist/types';
import type { ChartDataset, ScatterDataPoint } from 'chart.js';

export default class LineChartBuilder {
	private result: TChartData<'line', (number | ScatterDataPoint | null)[], unknown>;
	constructor() {
		this.result = {
			datasets: [],
		};
	}

	public addDataset(label: string, data: Array<number>): LineChartBuilder {
		const dataset = {
			label,
			data,
		};
		return this.addDatasetDirect(dataset);
	}

	public addDatasetDirect(data: ChartDataset<'line', (number | ScatterDataPoint | null)[]>): LineChartBuilder {
		this.result.datasets.push(data);
		return this;
	}

	public addLabels(labels: Array<string>): LineChartBuilder {
		const regex = /(\d{4})(\d{2})(\d{2})_(\d{2})/;

		this.result.labels = labels.map((timeString) => {
			const [, year, month, day, hours] = regex.exec(timeString) || [];
			return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day), Number.parseInt(hours));
		});
		return this;
	}

	public getChartData(): TChartData<'line', (number | ScatterDataPoint | null)[], unknown> {
		return this.result;
	}
}
