import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  clearScreen: false, // 防止 vite 覆盖 tarui 错误
  server: {
    strictPort: true,
  },
  envPrefix: ['VITE_', 'TAURI_PLATFORM', 'TAURI_ARCH', 'TAURI_FAMILY', 'TAURI_PLATFORM_VERSION', 'TAURI_PLATFORM_TYPE', 'TAURI_DEBUG'],
  build: {
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13', // Tauri 在 Windows 上使用 Chromium, 在 macOS 和 Linux 上使用 WebKit
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false, // 不压缩 debug build
    sourcemap: !!process.env.TAURI_DEBUG, // 为 debug build 生成sourcemap

  }
})
