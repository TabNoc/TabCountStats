import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

import AdditionalTabs from './views/AdditionalTabs.vue';
import AdditionalWindows from './views/AdditionalWindows.vue';
import Options from './views/Options.vue';
import Chart from './views/Chart.vue';
const routes: Array<RouteRecordRaw> = [
	{
		path: '/?href=:href',
		name: 'Home',
		component: Options,
		props: { href: true },
	},
	{
		path: '/',
		name: 'Home',
		component: Options,
	},
	{
		path: '/AdditionalTabs',
		name: 'AdditionalTabs',
		component: AdditionalTabs,
	},
	{
		path: '/AdditionalWindows',
		name: 'AdditionalWindows',
		component: AdditionalWindows,
	},
	{
		path: '/chart',
		name: 'Chart',
		component: Chart,
	},
];

const router = createRouter({
	history: createWebHistory('/dist/options/index.html'),
	routes,
});

export default router;
