import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, ViteClient } from 'vite-ssr-components/hono'
import { siteConfig } from './config'

export const renderer = jsxRenderer(({ children, title }: { children?: any; title?: string }) => {



  return (
    <html>
      <head>
        <title>{title ? `${title} | ${siteConfig.name}` : siteConfig.name}</title>
        <ViteClient />
        <Link href="/src/style.css" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script dangerouslySetInnerHTML={{ __html: `
          const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          if (theme === 'dark') document.documentElement.classList.add('dark');
        `}} />



      </head>
      <body className="bg-white dark:bg-neutral-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

        {children}
      </body>

    </html>
  )
})

