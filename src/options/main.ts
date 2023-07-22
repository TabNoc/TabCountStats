import { createApp } from 'vue';
import App from './Options.vue';
import router from './routes';
import { setupApp } from '~/logic/common-setup';
import '../styles';

const app = createApp(App);
setupApp(app);
app.use(router).mount('#app');
