import { Hono } from 'hono'

import { getCookie, setCookie } from 'hono/cookie'
import { loadTranslations } from '@nanostores/i18n'
import { i18n, locale } from './stores/i18n'
import HomeContent from './content/index.mdx'
import { siteConfig } from './config'
import { renderer } from './renderer'
import { ContactModal } from './components/ContactModal'

const app = new Hono<{ Bindings: CloudflareBindings }>()


import type { HtmlEscapedString } from 'hono/utils/html'

interface ProjectMeta {
  pt: {
    title: string
    description: string
  }
  en: {
    title: string
    description: string
  }
  cover?: string
  video?: string
  tags?: string[]
}

const projects = import.meta.glob<{ default: (props: Record<string, unknown>) => HtmlEscapedString | Promise<HtmlEscapedString> }>('./content/projects/*/index.*.mdx')
const projectMeta = import.meta.glob<{ default: ProjectMeta }>('./content/projects/*/meta.json', { eager: true })

import { TechIcon, TechName } from './components/TechIcon'
import { ThemeToggle } from './components/ThemeToggle'


app.use(renderer)

const messages = i18n('home', {
  name: siteConfig.name,
  bio: siteConfig.bio,
  projects: 'Projetos:',
  back: '← Voltar para home',
  linksTitle: 'Aqui estão os links principais:',
  sourceCode: 'O código fonte deste site está em',
  contact: 'Contato',
  modalTitle: 'Contato',
  modalName: 'Nome',
  modalNamePlaceholder: 'Seu nome',
  modalMessage: 'Mensagem',
  modalMessagePlaceholder: 'Como posso ajudar?',

  modalSend: 'Enviar E-mail',
  modalSuccess: 'Mensagem enviada com sucesso!',
  modalError: 'Erro ao enviar. Tente novamente.'
})



app.post('/api/send-email', async (c) => {
  const { name, message } = await c.req.json()

  try {
    await c.env.SEND_EMAIL.send({
      from: "Portfolio <portfolio@francy.dev>",
      to: "oi@francy.dev",
      subject: `Novo Contato de ${name}`,
      text: `Você recebeu uma nova mensagem através do seu portfólio.\n\n----------------------------------\nNome: ${name}\n----------------------------------\n\nMensagem:\n${message}\n\n----------------------------------`,
    })
    return c.json({ success: true })
  } catch (err: any) {
    console.error('Email error:', err)
    return c.json({ success: false, error: err.message }, 500)
  }
})



app.get('/', async (c) => {
  const queryLang = c.req.query('lang')
  const lang = (queryLang || getCookie(c, 'locale') || 'pt') as 'pt' | 'en'

  if (queryLang) {
    setCookie(c, 'locale', lang, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return c.redirect('/')
  }

  locale.set(lang)
  const t = await loadTranslations(messages)

  const projectList = Object.entries(projectMeta).map(([path, meta]) => {
    const slug = path.split('/')[3]
    return {
      slug,
      ...meta.default,
      title: meta.default[lang]?.title || meta.default.pt.title,
      description: meta.default[lang]?.description || meta.default.pt.description,
      cover: meta.default.cover,
      video: meta.default.video
    }
  })

  return c.render(
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{t.name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <a href="?lang=pt" className={`px-3 py-1 rounded-md text-sm font-semibold transition-all ${lang === 'pt' ? 'bg-white dark:bg-gray-700 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'}`}>PT</a>
            <a href="?lang=en" className={`px-3 py-1 rounded-md text-sm font-semibold transition-all ${lang === 'en' ? 'bg-white dark:bg-gray-700 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'}`}>EN</a>
          </div>
          <button
            id="contact-trigger"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all transform active:scale-95 shadow-sm cursor-pointer"
          >
            {t.contact}
          </button>
          <ThemeToggle />
        </div>

      </div>


      <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
        <HomeContent {...t} links={siteConfig.links} />

      </div>



      <div className="mb-16">
        <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6">Tech Stack</h2>

        <div className="flex flex-wrap gap-8 items-center">
          <TechIcon name="typescript" size={24} />
          <TechIcon name="nodejs" size={24} />
          <TechIcon name="bun" size={24} />
          <TechIcon name="react" size={24} />
          <TechIcon name="nextjs" size={24} />
          <TechIcon name="hono" size={24} />
          <TechIcon name="cloudflare" size={24} />
          <TechIcon name="cloudflare-workers" size={24} />
          <TechIcon name="docker" size={24} />
          <TechIcon name="golang" size={24} />
          <TechIcon name="rust" size={24} />
        </div>
      </div>


      <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 border-b-2 border-gray-100 dark:border-slate-800 pb-4">{t.projects}</h2>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projectList.map(project => (
          <a
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group block bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-neutral-800 hover:-translate-y-0.5"
          >
            <div className="aspect-video bg-gray-50 dark:bg-neutral-800 relative overflow-hidden">
              {project.cover ? (
                <img
                  src={project.cover}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-800 dark:to-neutral-900">
                  <span className="text-gray-400 dark:text-neutral-600 font-bold text-2xl uppercase tracking-widest opacity-20">{project.title}</span>
                </div>
              )}
              {project.video && (
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20 text-[10px] text-white font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Video
                </div>
              )}
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-neutral-400 text-sm line-clamp-2 leading-relaxed mb-6">
                {project.description}
              </p>
              {project.tags && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => {
                    const techList = ['cloudflare', 'hono', 'typescript', 'nodejs', 'bun', 'react', 'nextjs', 'golang', 'rust', 'cloudflare-workers', 'docker']
                    const isTech = techList.includes(tag.toLowerCase())
                    return (
                      <span key={tag} className="px-2.5 py-1 bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider rounded border border-gray-100 dark:border-neutral-700 group-hover:border-blue-100 dark:group-hover:border-blue-900 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors flex items-center gap-1.5">
                        {isTech && <TechIcon name={tag.toLowerCase() as any} size={12} className="grayscale-0 opacity-100" />}
                        {tag}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          </a>
        ))}

      </div>
      <ContactModal
        title={t.modalTitle}
        nameLabel={t.modalName}
        namePlaceholder={t.modalNamePlaceholder}
        messageLabel={t.modalMessage}
        messagePlaceholder={t.modalMessagePlaceholder}
        sendButton={t.modalSend}
        successMessage={t.modalSuccess}
        errorMessage={t.modalError}
      />
    </div>,
    { title: siteConfig.name }
  )
})



app.get('/projects/:slug', async (c) => {
  const queryLang = c.req.query('lang')
  const lang = (queryLang || getCookie(c, 'locale') || 'pt') as 'pt' | 'en'

  if (queryLang) {
    setCookie(c, 'locale', lang, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return c.redirect(c.req.path)
  }

  locale.set(lang)
  const t = await loadTranslations(messages)

  const slug = c.req.param('slug')
  const path = `./content/projects/${slug}/index.${lang}.mdx`
  const fallbackPath = `./content/projects/${slug}/index.pt.mdx`
  const metaPath = `./content/projects/${slug}/meta.json`

  const targetPath = projects[path] ? path : fallbackPath
  const meta = projectMeta[metaPath]?.default

  if (projects[targetPath]) {
    const mod = await projects[targetPath]()
    const Content = mod.default

    return c.render(
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12 flex justify-between items-center">
          <a href={`/?lang=${lang}`} className="text-gray-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2 font-medium">
            <span>{t.back}</span>
          </a>
          <div className="flex items-center gap-4">
            <button
              id="contact-trigger"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all transform active:scale-95 shadow-sm"
            >
              {t.contact}
            </button>
            <ThemeToggle />
          </div>
        </div>


        {meta && (
          <div className="mb-12">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6">{meta[lang]?.title || meta.pt.title}</h1>

            <div className="aspect-video w-full bg-gray-100 dark:bg-neutral-900 rounded-xl overflow-hidden mb-8 shadow-lg">
              {meta.video ? (
                <video
                  src={meta.video}
                  controls
                  className="w-full h-full"
                />
              ) : meta.cover ? (
                <img src={meta.cover} className="w-full h-full object-cover" />
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {meta.tags?.map((tag: string) => {
                const techList = ['cloudflare', 'hono', 'typescript', 'nodejs', 'bun', 'react', 'nextjs', 'golang', 'rust', 'cloudflare-workers', 'docker']
                const isTech = techList.includes(tag.toLowerCase())
                return (
                  <span key={tag} className="px-3 py-1.5 bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-neutral-400 text-xs font-bold uppercase tracking-widest rounded-md border border-gray-200 dark:border-neutral-800 flex items-center gap-2 shadow-sm">
                    {isTech && <TechIcon name={tag.toLowerCase() as TechName} size={14} className="grayscale-0 opacity-100" />}
                    {tag}
                  </span>
                )
              })}
            </div>

          </div>
        )}

        <article className="prose prose-slate dark:prose-invert prose-lg prose-img:rounded-xl max-w-none">
          <Content />
        </article>
        <ContactModal
          title={t.modalTitle}
          nameLabel={t.modalName}
          namePlaceholder={t.modalNamePlaceholder}
          messageLabel={t.modalMessage}
          messagePlaceholder={t.modalMessagePlaceholder}
          sendButton={t.modalSend}
          successMessage={t.modalSuccess}
          errorMessage={t.modalError}
        />
      </div>,
      { title: slug }
    )

  }


  return c.notFound()
})

export default app
