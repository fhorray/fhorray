import { Hono } from 'hono';

import { getCookie, setCookie } from 'hono/cookie';
import { loadTranslations } from '@nanostores/i18n';
import { i18n, locale } from './stores/i18n';
import HomeContent from './content/index.mdx';
import { siteConfig } from './config';
import { renderer } from './renderer';
import { ContactModal } from './components/ContactModal';

const app = new Hono<{ Bindings: CloudflareBindings }>();

import type { HtmlEscapedString } from 'hono/utils/html';

interface ProjectMeta {
  pt: {
    title: string;
    description: string;
  };
  en: {
    title: string;
    description: string;
  };
  cover?: string;
  video?: string;
  tags?: string[];
}

const projects = import.meta.glob<{
  default: (
    props: Record<string, unknown>,
  ) => HtmlEscapedString | Promise<HtmlEscapedString>;
}>('./content/projects/*/index.*.mdx');
const projectMeta = import.meta.glob<{ default: ProjectMeta }>(
  './content/projects/*/meta.json',
  { eager: true },
);

import { TechIcon, TechName } from './components/TechIcon';
import { CVModal } from './components/CVModal';
import { ThemeToggle } from './components/ThemeToggle';
import { Header } from './components/Header';
import { getAllProjects } from './lib/projects';
import { ProjectCard } from './components/ProjectCard';

app.use(renderer);

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
  experiences: 'Experiências',
  cv: 'Currículo',
  cvModalTitle: 'Baixe meu CV:',
  cvPT: 'Português',
  cvEN: 'English',
  modalSend: 'Enviar E-mail',
  modalSuccess: 'Mensagem enviada com sucesso!',
  modalError: 'Erro ao enviar. Tente novamente.',
});

app.post('/api/send-email', async (c) => {
  const { name, message } = await c.req.json();

  try {
    await c.env.SEND_EMAIL.send({
      from: 'Portfolio <portfolio@francy.dev>',
      to: 'oi@francy.dev',
      subject: `Novo Contato de ${name}`,
      text: `Você recebeu uma nova mensagem através do seu portfólio.\n\n----------------------------------\nNome: ${name}\n----------------------------------\n\nMensagem:\n${message}\n\n----------------------------------`,
    });
    return c.json({ success: true });
  } catch (err: any) {
    console.error('Email error:', err);
    return c.json({ success: false, error: err.message }, 500);
  }
});

app.get('/', async (c) => {
  const queryLang = c.req.query('lang');
  const lang = (queryLang || getCookie(c, 'locale') || 'pt') as 'pt' | 'en';

  if (queryLang) {
    setCookie(c, 'locale', lang, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return c.redirect('/');
  }

  locale.set(lang);
  const t = await loadTranslations(messages);

  const projectList = await getAllProjects(c.env, lang);

  return c.render(
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Header name={t.name} lang={lang} t={t} currentPath={c.req.path} />

      <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
        <HomeContent {...t} links={siteConfig.links} />
      </div>

      <div className="mb-16">
        <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6">
          Tech Stack
        </h2>

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

      {/* Projects */}
      {projectList.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 border-b-2 border-gray-100 dark:border-slate-800 pb-4">
            {t.projects}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projectList.map((project) => (
              <ProjectCard key={project.slug} project={project} lang={lang} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
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
      <CVModal title={t.cvModalTitle} ptOption={t.cvPT} enOption={t.cvEN} />

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-100 dark:border-neutral-800 pt-8 pb-12 text-center text-xs text-gray-400 dark:text-neutral-500">
        <p>&copy; {new Date().getFullYear()} Francy Santos.</p>
      </footer>
    </div>,

    { title: t.name },
  );
});

import experiences from './content/experiences.json';

app.get('/experiences', async (c) => {
  const queryLang = c.req.query('lang');
  const lang = (queryLang || getCookie(c, 'locale') || 'pt') as 'pt' | 'en';
  const t = (await import(`../public/translations/${lang}.json`)).default.home;

  return c.render(
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Header name={t.name} lang={lang} t={t} currentPath={c.req.path} />

      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-12 tracking-tight">
        {t.experiences}
      </h1>

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-100 dark:before:via-neutral-800 before:to-transparent">
        {experiences.map((exp, idx) => (
          <div
            key={exp.company}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10 overflow-hidden">
              <img
                src={exp.logo}
                alt={exp.company}
                className="w-12 h-12 object-contain"
              />
            </div>

            {/* Content Card */}
            <div className="w-[calc(100%-4.5rem)] md:w-[calc(50%-3rem)] bg-white dark:bg-neutral-900/50 p-6 border border-gray-100 dark:border-neutral-800 transition-all hover:border-purple-500/50">
              <div className="flex flex-col mb-4">
                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                  {exp.company}
                </h3>
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
                  {exp.location} • {exp.type}
                </span>
              </div>

              <div className="space-y-6 relative border-l-2 border-gray-50 dark:border-neutral-800/50 ml-2 pl-6">
                {exp.roles.map((role: any, rIdx: number) => (
                  <div key={rIdx} className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 bg-gray-200 dark:bg-neutral-700" />
                    <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                      {role[lang].title}
                    </h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">
                      <span>{role[lang].period}</span>
                      <span className="hidden sm:inline text-gray-300 dark:text-neutral-700">
                        •
                      </span>
                      <span className="text-purple-600 dark:text-purple-400">
                        {role[lang].duration}
                      </span>
                    </div>
                    {role[lang].description && (
                      <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">
                        {role[lang].description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {exp.skills && (
                <div className="mt-6 pt-6 border-t border-gray-50 dark:border-neutral-800/50 flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-gray-50 dark:bg-neutral-800/50 text-gray-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-widest border border-gray-100 dark:border-neutral-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
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
      <CVModal title={t.cvModalTitle} ptOption={t.cvPT} enOption={t.cvEN} />
    </div>,

    { title: t.experiences },
  );
});

app.get('/projects/:slug', async (c) => {
  const queryLang = c.req.query('lang');
  const lang = (queryLang || getCookie(c, 'locale') || 'pt') as 'pt' | 'en';

  if (queryLang) {
    setCookie(c, 'locale', lang, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return c.redirect(c.req.path);
  }

  locale.set(lang);
  const t = await loadTranslations(messages);

  const slug = c.req.param('slug');
  const path = `./content/projects/${slug}/index.${lang}.mdx`;
  const fallbackPath = `./content/projects/${slug}/index.pt.mdx`;
  const metaPath = `./content/projects/${slug}/meta.json`;

  const targetPath = projects[path] ? path : fallbackPath;
  const meta = projectMeta[metaPath]?.default;

  if (projects[targetPath]) {
    const mod = await projects[targetPath]();
    const Content = mod.default;

    return c.render(
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Header name={t.name} lang={lang} t={t} currentPath={c.req.path} />

        {meta && (
          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
              {meta[lang]?.title || meta.pt.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-10 pb-10 border-b border-gray-100 dark:border-neutral-900">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-[0.2em]">
                  Role
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  Fullstack Developer
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-[0.2em]">
                  Tech Stack
                </span>
                <div className="flex flex-wrap gap-2">
                  {meta.tags?.map((tag: string) => {
                    const techList = [
                      'cloudflare',
                      'hono',
                      'typescript',
                      'nodejs',
                      'bun',
                      'react',
                      'nextjs',
                      'golang',
                      'rust',
                      'cloudflare-workers',
                      'docker',
                    ];
                    const isTech = techList.includes(tag.toLowerCase());
                    return (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider border border-gray-100 dark:border-neutral-800 flex items-center gap-1.5"
                      >
                        {isTech && (
                          <TechIcon
                            name={tag.toLowerCase() as TechName}
                            size={12}
                            className="grayscale-0 opacity-100"
                          />
                        )}
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="aspect-video w-full bg-gray-100 dark:bg-neutral-900 overflow-hidden mb-12">
              {meta.video ? (
                <video src={meta.video} controls className="w-full h-full" />
              ) : meta.cover ? (
                <img src={meta.cover} className="w-full h-full object-cover" />
              ) : null}
            </div>
          </div>
        )}

        <article className="prose prose-slate dark:prose-invert prose-lg prose-img:rounded-none max-w-none">
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
        <CVModal title={t.cvModalTitle} ptOption={t.cvPT} enOption={t.cvEN} />
      </div>,

      { title: meta[lang]?.title || meta.pt.title },
    );
  }

  // Fallback: Try to render GitHub README if it's not a local project
  const username = 'fhorray';
  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${slug}/contents/README.md`, {
      headers: {
        'User-Agent': 'fhorray-portfolio',
        'Accept': 'application/vnd.github.v3.html',
        ...(c.env.GITHUB_TOKEN ? { 'Authorization': `token ${c.env.GITHUB_TOKEN}` } : {})
      }
    });

    if (response.ok) {
      const html = await response.text();
      return c.render(
        <div className="max-w-5xl mx-auto px-4 py-12">
          <Header name={t.name} lang={lang} t={t} currentPath={c.req.path} />

          <article className="prose prose-slate dark:prose-invert prose-lg max-w-none mt-12" dangerouslySetInnerHTML={{ __html: html }} />

          {/* Client-side syntax highlighting for GitHub README */}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
          <script dangerouslySetInnerHTML={{
            __html: `
            setTimeout(() => {
              document.querySelectorAll('[class*="highlight-source-"]').forEach(el => {
                const lang = Array.from(el.classList).find(c => c.startsWith('highlight-source-')).replace('highlight-source-', '');
                const pre = el.querySelector('pre');
                if (pre) {
                  let code = pre.querySelector('code');
                  if (!code) {
                    code = document.createElement('code');
                    code.innerHTML = pre.innerHTML;
                    pre.innerHTML = '';
                    pre.appendChild(code);
                  }
                  code.classList.add('language-' + lang);
                  hljs.highlightElement(code);
                }
              });
              hljs.highlightAll();
            }, 100);
          ` }} />

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
          <CVModal title={t.cvModalTitle} ptOption={t.cvPT} enOption={t.cvEN} />
        </div>,
        { title: slug }
      );
    }
  } catch (error) {
    console.error('Error fetching README from GitHub:', error);
  }

  return c.notFound();
});

export default app;
