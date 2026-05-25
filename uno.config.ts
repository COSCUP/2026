import type { Theme } from '@unocss/preset-wind4'
import extractorMdc from '@unocss/extractor-mdc'
import { presetWind4 } from '@unocss/preset-wind4'
import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig, presetTypography } from 'unocss'
import presetThemes from 'unocss-preset-theme'

export default defineConfig({
  shortcuts: {
    icon: '-align-0.125em',
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
            'primary-50': '#E5E3FF',
            'primary-100': '#CCC7FF',
            'primary-200': '#B2ABFE',
            'primary-300': '#998FFE',
            'primary-400': '#7F73FE',
            'primary-500': '#665CCB',
            'primary-600': '#4C4598',
            'primary-700': '#332E66',
            'primary-800': '#191733',
            'cp-green': '#3C9838',
          },
        },
      },
    }),
    presetTypography(),
  ],
})
