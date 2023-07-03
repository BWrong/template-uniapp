import { resolve } from 'node:path'
import { defineConfig, loadEnv, type ConfigEnv, type ProxyOptions } from 'vite';
import uni from '@dcloudio/vite-plugin-uni'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Unocss from 'unocss/vite'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import VueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
import autoImport from 'unplugin-auto-import/vite';
import unpluginComponents from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';
import buildInfo from 'vite-plugin-build-info';
import iconfont from 'vite-plugin-iconfont';

// @ts-expect-error failed to resolve types
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv) => {
  const root = process.cwd(); // 项目根目录
  const env = formatEnv(loadEnv(mode, root)) as ImportMetaEnv;
  console.log('【info】 command:', command, ', mode: ', mode);
  console.log(env);
  const IS_PRODUCTION = mode === 'production';
  const IS_MOCK = mode === 'mock';
  // 读取环境配置
  const {
    VITE_BASE_URL,
    VITE_API_HOST,
    VITE_TITLE,
    VITE_API_PREFIX,
    VITE_BUILD_REPORT,
    VITE_BUILD_COMPRESS,
    VITE_PORT,
    VITE_ICONFONT_URL,
    VITE_OUT_DIR,
    VITE_DROP_CONSOLE = false,
    VITE_DROP_DEBUGGER = false,
    VITE_DEV_TOOLS = false
  } = env;

  /***** 接口代理配置，有多个可以自己加 ******/
  const PROXY_CONFIG: Record<string, string | ProxyOptions> = {
    [VITE_API_PREFIX]: {
      target: VITE_API_HOST,
      // secure: false,
      // ws: true,
      changeOrigin: true, // 将Origin的来源更改为目标URL
      rewrite: (path) => path.replace(new RegExp(`^${VITE_API_PREFIX}`), '/api')
    }
  }
  return {
    root, // 项目根目录
    base: VITE_BASE_URL, // 基础路径
    server: {
      // 开发配置
      // https: true,
      // host: '127.0.0.1',
      port: VITE_PORT || 8080,
      open: true,
      // cors: false, // 跨域
      proxy: IS_MOCK ? {} : PROXY_CONFIG
    },
    resolve: {
      alias: {
        '@/': `${resolve(__dirname, 'src')}/`,
        components: createPath('./src/components'),
        types: createPath('./types')
      },
    },
    plugins: [
      iconfont({
        url: VITE_ICONFONT_URL,
        distUrl: './public/iconfont/iconfont.js',
        iconJson: './src/components/IconPicker/data.json',
        inject: false,
        dts: './types/iconfont.d.ts',
        iconifyFile: './.iconify.json'
      }),
      /**
       * vite-plugin-uni-pages
       * @see https://github.com/uni-helper/vite-plugin-uni-pages
       */
      UniPages({
        // subPackages: [
        //   'src/pages-sub',
        // ],
      }),

      /**
       * vite-plugin-uni-layouts
       * @see https://github.com/uni-helper/vite-plugin-uni-layouts
       */
      UniLayouts(),

      /**
       * unocss
       * @see https://github.com/antfu/unocss
       * see unocss.config.ts for config
      */
      Unocss(),

      /**
       * unplugin-auto-import 按需 import
       * @see https://github.com/antfu/unplugin-auto-import
       */
      // 自动导入组件 https://github.com/antfu/unplugin-auto-import
      autoImport({
        imports: ['vue', 'uni-app', 'pinia'],
        dts: 'types/auto-imports.d.ts',
        // resolvers: [AntDesignVueResolver()],
        dirs: ['src/composables', 'src/store'], // 需要自动导入的文件目录
        vueTemplate: true,
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true
        }
      }),
      /**
       * unplugin-vue-components 按需引入组件
       * 注意：需注册至 uni 之前，否则不会生效
       * @see https://github.com/antfu/vite-plugin-components
       */
      unpluginComponents({
        dts: 'types/components.d.ts',
        dirs: ['src/components'],
        extensions: ['vue', 'tsx'],
        directoryAsNamespace: false,
        resolvers: [
          AntDesignVueResolver({
            importStyle: IS_PRODUCTION ? 'css' : false // 开发环境设置false，在main全量引入，让vite预构建
          })
        ]
      }),
      createHtmlPlugin({
        minify: true,
        entry: '/src/main.ts',
        // template: 'index.html',
        inject: {
          data: {
            BASE_URL: VITE_BASE_URL,
            title: VITE_TITLE
          }
        }
      }),
      uni({
        vueOptions: {
          reactivityTransform: true,
          script: {
            propsDestructure: true // 开启props语法糖
            // defineModel: true, // 开启defineModel 语法糖
          }
        }
      }),
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),
      /**
       * Reactivity Transform
       * @see https://vue-macros.sxzz.moe/zh-CN/features/reactivity-transform.html
       */
      ReactivityTransform(),

      // 注入打包和git信息，方便做版本追踪
      buildInfo(),
      /**
       * vite-plugin-vue-devtools 增强 Vue 开发者体验
       * @see https://github.com/webfansplz/vite-plugin-vue-devtools
       */
      VITE_DEV_TOOLS && VueDevTools(),
      // gzip压缩，需要nginx开启对应配置，否则不生效
      VITE_BUILD_COMPRESS &&
      viteCompression({
        threshold: 1025, // 阈值，大于此值才会被压缩
        algorithm: 'gzip' // 压缩算法
      }),
      // 开启打包可视化分析报告,会增加打包时间，不需要可以关闭
      VITE_BUILD_REPORT &&
      visualizer({
        template: 'treemap',
        open: true,
        gzipSize: true,
        brotliSize: true,
        // emitFile: true,
        sourcemap: true
      })
    ],
    build: {
      // 生产配置
      outDir: VITE_OUT_DIR, // 输出目录
      reportCompressedSize: false, //禁用 gzip 压缩大小报告,可以减少构建时间
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          // 根据自己需求调整分包策略
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            antd: ['ant-design-vue', 'dayjs']
          }
        }
      }
    },
    css: {
      devSourcemap: true, // 开启css sourcemap
      // css预处理器配置
      preprocessorOptions: {
        sass: {
          prependData: `@import "@/uni.scss";`
        }
        // less: {
        //   javascriptEnabled: true,
        //   modifyVars: {
        //     hack: `true;@import "${resolve(__dirname, './src/assets/styles/_variable.less')}"`
        //   }
        // }
      }
    },
    esbuild: {
      drop: formatDrop(VITE_DROP_DEBUGGER, VITE_DROP_CONSOLE)
    }
  }
})
/********** 一些辅助函数 *********/
function createPath(url: string, metaUrl = import.meta.url) {
  return fileURLToPath(new URL(url, metaUrl));
}
function formatEnv(data: Record<string, any>) {
  Object.entries(data).map(([key, item]) => {
    if (item === 'true') {
      item = true;
    } else if (item === 'false') {
      item = false;
    } else if (item.match(/^\d+$/g)) {
      item = Number(item);
    }
    data[key] = item;
  });
  return data;
}
function formatDrop(dropDebugger: boolean, dropConsole: boolean) {
  let drop: any = [];
  dropDebugger && drop.push('debugger');
  dropConsole && drop.push('console');
  return drop;
}
