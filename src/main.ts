import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';
import Modal from 'ant-design-vue/es/modal';
import plugins from '@/plugins';
import '@unocss/reset/tailwind-compat.css';
import 'virtual:uno.css';
import '@/assets/styles/common.scss';
import App from './App.vue';

// 在开发时导入全部antd样式，让vite预构建
(() => import.meta.env.DEV && import('ant-design-vue/dist/antd.css'))();
export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia());
  app.use(plugins); // 注册插件
  app.use(Modal); // 解决打包后modal失效问题，需要手动引入
  return {
    app,
    Pinia
  };
}
