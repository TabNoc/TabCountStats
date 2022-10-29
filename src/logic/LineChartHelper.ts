import type { TChartData } from 'vue-chartjs/dist/types';
import type { ChartDataset, ScatterDataPoint } from 'chart.js';

export default class LineChartHelper {
	private result: TChartData<'line', (number | ScatterDataPoint | null)[], unknown>;
	constructor() {
		this.result = {
			datasets: [],
		};
	}

	public addDataset(label: string, data: Array<number>) {
		const dataset = {
			label,
			data,
		};
		this.addDatasetDirect(dataset);
	}

	public addDatasetDirect(data: ChartDataset<'line', (number | ScatterDataPoint | null)[]>) {
		this.result.datasets.push(data);
	}

	public addLabels(labels: Array<string>) {
		this.result.labels = labels;
	}

	public getChartData(): TChartData<'line', (number | ScatterDataPoint | null)[], unknown> {
		return this.result;
	}
}
