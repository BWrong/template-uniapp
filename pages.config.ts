import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages';

export default defineUniPages({
  pages: [],
  globalStyle: {
    navigationBarTitleText: 'template-uniapp',
    navigationBarBackgroundColor: '@navBgColor',
    navigationBarTextStyle: '@navTxtStyle',
    backgroundColor: '@bgColor',
    backgroundTextStyle: '@bgTxtStyle',
    backgroundColorTop: '@bgColorTop',
    backgroundColorBottom: '@bgColorBottom',
    'app-plus': {
      titleNView: false // 移除 H5、APP 顶部导航
    }
  }
});
