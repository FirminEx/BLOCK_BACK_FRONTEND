import './assets/main.css';

import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(ElementPlus).use(router).mount('#app');

for (const [key, component] of Object.entries(ElementPlusIconsVue)) app.component(key, component);
