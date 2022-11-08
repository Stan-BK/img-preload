import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ mode }) => {
  return {
    base: loadEnv(mode, __dirname).VITE_APP_PATHNAME
  }
})
