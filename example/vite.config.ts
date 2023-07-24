import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import legacy from '@vitejs/plugin-legacy'
import packageJson from './package.json'

export default defineConfig(({ mode }) => {
  return {
    envPrefix: 'WR_',
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
    build: {
      outDir: 'build',
    },
    plugins: [
      legacy({
        targets: packageJson.browserslist,
      }),
      ,
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
    ],
    define: attachEnvVariables(mode),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      port: 3000,
    },
  }
})

const attachEnvVariables = (mode: any) => {
  const env = loadEnv(mode, process.cwd(), '')

  const variables = [
    'WR_HOST',
    'WR_ACCESS_TOKEN',
    'WR_COMPANY_ID',
    'WR_CATALOG_ID',
    'WR_ADDON_CATALOG_ID',
    'WR_MODE',
    'WR_AUTH_TYPE',
    'WR_LOCALE',
    'WR_DATE_FORMAT',
  ]

  const processEnvVariables = variables.reduce((result, key) => {
    return {
      ...result,
      [`process.env.${key}`]: JSON.stringify(env[key]),
    }
  }, {})

  return processEnvVariables
}
