import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import mdx from '@mdx-js/rollup'
import rehypeHighlight from 'rehype-highlight'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    cloudflare(),
    tailwindcss(),
    mdx({
      jsxImportSource: 'hono/jsx',
      rehypePlugins: [rehypeHighlight]
    })

  ],
  build: {
    manifest: true
  }
})






