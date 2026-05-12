import { TechIcon, TechName } from './TechIcon';
import type { UnifiedProject } from '../lib/github';

interface ProjectCardProps {
  project: UnifiedProject;
  lang: 'pt' | 'en';
}

export const ProjectCard = ({ project, lang }: ProjectCardProps) => {
  const isLocal = project.source === 'local';
  const href = `/projects/${project.slug}?lang=${lang}`;
  const target = undefined;

  return (
    <a
      href={href}
      target={target}
      className="group flex flex-col bg-white dark:bg-neutral-900 overflow-hidden transition-all duration-300 border border-gray-100 dark:border-neutral-800 hover:border-purple-500/50"
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
            <span className="text-gray-400 dark:text-neutral-600 font-bold text-2xl uppercase tracking-widest opacity-20">
              {project.title}
            </span>
          </div>
        )}
        
        {/* Source Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 border border-white/20 text-[10px] text-white font-bold uppercase tracking-widest flex items-center gap-1.5">
          {isLocal ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Case Study
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Open Source
            </>
          )}
        </div>

        {/* GitHub Stats */}
        {!isLocal && project.stars !== undefined && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 border border-white/20 text-[10px] text-white font-bold uppercase tracking-widest flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            {project.stars}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {project.title}
          </h3>
          {!isLocal && (
            <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/></svg>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-neutral-400 text-sm line-clamp-2 leading-relaxed mb-6">
          {project.description}
        </p>

        {project.tags && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.map((tag: string) => {
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
                  className="px-2.5 py-1 bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider border border-gray-100 dark:border-neutral-700 group-hover:border-purple-100 dark:group-hover:border-purple-900 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30 transition-colors flex items-center gap-1.5"
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
        )}
      </div>
    </a>
  );
};
