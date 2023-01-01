import { createApp } from 'vue';
import App from './Options.vue';
import '../styles';
import router from './routes';

const app = createApp(App);
app.use(router).mount('#app');
