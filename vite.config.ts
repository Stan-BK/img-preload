import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'ImgPreload',
      fileName: 'index',
      formats: ['es', 'cjs']
    }
  },
  server: {
    open: '/example/index.html'
  }
})
