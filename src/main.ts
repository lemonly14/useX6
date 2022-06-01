import { createApp } from 'vue';

import App from './App.vue';

import router from './router/index';

import NProgress from 'nprogress';

import piniaPluginPersist from 'pinia-plugin-persist';

import { createPinia } from 'pinia';

import '@iconify/iconify';

import '@purge-icons/generated';

import '@/styles/tailwind.css';

import '@/styles/normalize.scss';

import '@/styles/project.scss';

import 'ant-design-vue/dist/antd.css';

router.beforeEach(() => {
  NProgress.start();
});

router.afterEach(() => {
  NProgress.done();
});

const app = createApp(App);

app.use(router);

// 按需引入antd
const plugins = import.meta.globEager('./plugins/*.ts');
for (const key in plugins) plugins[key].default(app);

app.use(createPinia().use(piniaPluginPersist));

app.mount('#app');
