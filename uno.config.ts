import type { Theme } from '@unocss/preset-wind4'
import extractorMdc from '@unocss/extractor-mdc'
import { presetWind4 } from '@unocss/preset-wind4'
import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig, presetTypography } from 'unocss'
import presetThemes from 'unocss-preset-theme'

export default defineConfig({
  shortcuts: {
    'icon': '-align-0.125em',
    'z-content': 'z-10', // isolated 容器內的內容層（表格表頭、列表標題）
    'z-sticky': 'z-20', // 頁面固定元素（導覽列、日期選擇器、篩選列）
    'z-dropdown': 'z-30', // 下拉與彈出選單
    'z-modal': 'z-40', // 全螢幕遮罩與對話框
    'z-toast': 'z-50', // 最上層（手機選單、通知）
  },
  extractors: [
    extractorMdc(),
  ],
  content: {
    filesystem: ['../content/**/*.md'],
  },
  transformers: [
    transformerDirectives(),
  ],
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    presetThemes<Theme>({
      theme: {
        light: {
          colors: {
            'cp-primary': '#0C3C23',
            'cp-primary-content': '#FFF',

            'cp-secondary': '#2AC173',
            'cp-secondary-content': '#FFF',
            'cp-secondary-hover': '#239D5F',

            'cp-accent': '#1E2892',
            'cp-accent-content': '#FFF',
            'cp-accent-hover': '#161F6E',

            'cp-error': '#E84393',
            'cp-error-content': '#FFF',

            'cp-warn-50': '#FFF4E6',
            'cp-warn-100': '#FFE3C2',
            'cp-warn-300': '#FFB866',
            'cp-warn-500': '#F97316',
            'cp-warn-600': '#EA580C',
            'cp-warn-700': '#C2410C',

            'cp-success': '#2AC173',
            'cp-success-content': '#FFF',

            'cp-info': '#4A9BE8',
            'cp-info-content': '#FFF',
          },
        },
      },
    }),
    presetTypography(),
  ],
})
