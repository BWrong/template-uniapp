import type { Preset, SourceCodeTransformer } from 'unocss';
import { defineConfig, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss';
import {
  presetApplet,
  // presetRemRpx,
  transformerApplet
} from 'unocss-applet';

const isApplet = process.env?.UNI_PLATFORM?.startsWith('mp-') ?? false;
const presets: Preset[] = [];
const transformers: SourceCodeTransformer[] = [];

if (isApplet) {
  /**
   * UnoCSS Applet
   * @see https://github.com/unocss-applet/unocss-applet
   */
  presets.push(presetApplet());
  // presets.push(presetRemRpx()) // 如果需要使用 rem 转 rpx 单位，需要启用此插件
  transformers.push(transformerApplet());
} else {
  presets.push(presetUno());
}

export default defineConfig({
  presets: [
    // 由 Iconify 提供支持的纯 CSS 图标解决方案
    presetIcons({
      scale: 1.2,
      warn: true
    }),
    ...presets
  ],
  theme: {
    colors: {
      primary: 'var(--primary-color)',
      success: 'var(--success-color)',
      warning: 'var(--warning-color)',
      error: 'var(--error-color)',
      normal: 'var(--normal-color)'
    }
  },
  transformers: [
    transformerDirectives(), // 启用 @apply 功能
    transformerVariantGroup(), // 启用 () 分组功能
    ...transformers
  ]
});
