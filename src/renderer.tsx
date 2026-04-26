import { jsxRenderer } from 'hono/jsx-renderer'
import { siteConfig } from './config'
import css from './style.css?inline'

export const renderer = jsxRenderer(({ children, title }: { children?: any; title?: string }) => {

  return (
    <html>
      <head>
        <title>{title ? `${title} | ${siteConfig.name}` : siteConfig.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {import.meta.env.PROD ? (
          <style dangerouslySetInnerHTML={{ __html: css }} />
        ) : (
          <link rel="stylesheet" href="/src/style.css" />
        )}



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

