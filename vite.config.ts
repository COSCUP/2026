import { resolve } from 'node:path'
import I18n from '@intlify/unplugin-vue-i18n/vite'
import Vue from '@vitejs/plugin-vue'
import UnoCss from 'unocss/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'

export default defineConfig(() => ({
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [
    VueRouter(),
    Vue(),
    UnoCss(),
    Icons({
      autoInstall: true,
      customCollections: {
        cp: FileSystemIconLoader('./src/assets/icons'),
      },
    }),
    I18n({
      include: resolve(__dirname, './src/locales/**'),
    }),
  ],
  build: {
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  ssgOptions: {
    dirStyle: 'nested' as const,
    formatting: 'minify' as const,
    includedRoutes(paths) {
      // Generate routes for each language
      const languages = ['en', 'zh-TW']

      return paths.flatMap((path) => {
        // For dynamic routes with :lang parameter, generate one version per language
        if (path.includes(':lang')) {
          return languages.map((lang) => path.replace(/:lang/g, lang))
        }
        // For static routes, return as-is
        return path
      })
    },
  },
}))
