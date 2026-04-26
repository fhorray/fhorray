import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    cloudflare(),
    tailwindcss(),
    mdx({
      jsxImportSource: 'hono/jsx'
    })
  ],
  build: {
    manifest: true
  }
})






