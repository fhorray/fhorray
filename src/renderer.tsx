import { jsxRenderer } from 'hono/jsx-renderer'
import { siteConfig } from './config'
import css from './style.css?inline'

export const renderer = jsxRenderer(({ children, title, description }: { children?: any; title?: string; description?: string }) => {
  const defaultDesc = "Francy Santos - Desenvolvedor Fullstack especialista em Cloudflare Workers, React, Node.js, Golang e Rust.";
  const desc = description || defaultDesc;

  return (
    <html>
      <head>
        <title>{title ? `${title} | Portfólio` : siteConfig.name}</title>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={desc} />
        
        {/* Open Graph */}
        <meta property="og:title" content={title || siteConfig.name} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title || siteConfig.name} />
        <meta name="twitter:description" content={desc} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" />

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

