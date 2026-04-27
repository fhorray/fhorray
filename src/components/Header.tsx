import { ThemeToggle } from './ThemeToggle'
import { cn } from '../lib/utils'

interface HeaderProps {
  name: string
  lang: 'pt' | 'en'
  currentPath?: string
  t: {
    experiences: string
    cv: string
    contact: string
  }
}

export const Header = ({ name, lang, currentPath, t }: HeaderProps) => {
  const isExperiences = currentPath === '/experiences'
  return (
    <header className="flex justify-between items-center mb-12">
      <div className="flex items-center gap-6">
        <a href={`/?lang=${lang}`} className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight hover:opacity-80 transition-opacity whitespace-nowrap">
          {name}
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center ml-4 pl-6 border-l border-gray-100 dark:border-neutral-800 h-8 gap-6">
          <a href={`/experiences?lang=${lang}`} className={cn("text-xs font-bold transition-colors uppercase tracking-[0.2em]", isExperiences ? "text-purple-600 dark:text-purple-400" : "text-gray-400 hover:text-purple-600 dark:hover:text-purple-400")}>{t.experiences}</a>
          <a href="#" id="cv-trigger" className="text-xs font-bold text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors uppercase tracking-[0.2em]">{t.cv}</a>
          <a href="#" id="contact-trigger" className="text-xs font-bold text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors uppercase tracking-[0.2em]">{t.contact}</a>
        </nav>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Desktop Language Switcher */}
        <div className="hidden sm:flex p-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 h-9">
          <a href="?lang=pt" className={cn("px-3 flex items-center text-xs font-black transition-all", lang === 'pt' ? "bg-gray-100 dark:bg-neutral-800 text-black dark:text-white" : "text-gray-400 hover:text-gray-900 dark:hover:text-gray-200")}>PT</a>
          <a href="?lang=en" className={cn("px-3 flex items-center text-xs font-black transition-all", lang === 'en' ? "bg-gray-100 dark:bg-neutral-900 text-black dark:text-white" : "text-gray-400 hover:text-gray-900 dark:hover:text-gray-200")}>EN</a>
        </div>

        <ThemeToggle />

        {/* Mobile Menu Trigger */}
        <button
          id="mobile-menu-trigger"
          className="md:hidden flex items-center justify-center w-9 h-9 border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Toggle mobile menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>

      {/* Mobile Menu Sheet */}
      <div
        id="mobile-menu-sheet"
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300 md:hidden"
      >
        <div className="absolute right-0 top-0 bottom-0 w-3/4 max-w-xs bg-white dark:bg-neutral-950 border-l border-gray-200 dark:border-neutral-900 translate-x-full transition-transform duration-300 ease-in-out shadow-2xl">
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-10">
              <span className="text-lg font-black tracking-tighter text-gray-900 dark:text-white">{name}</span>
              <button
                id="close-mobile-menu"
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              <a href={`/experiences?lang=${lang}`} className={cn("text-sm font-bold transition-colors uppercase tracking-[0.2em]", isExperiences ? "text-purple-600 dark:text-purple-400" : "text-gray-500 hover:text-purple-600 dark:hover:text-purple-400")}>{t.experiences}</a>
              <a href="#" id="cv-trigger-mobile" className="text-sm font-bold text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors uppercase tracking-[0.2em]">{t.cv}</a>
              <a href="#" id="contact-trigger-mobile" className="text-sm font-bold text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors uppercase tracking-[0.2em]">{t.contact}</a>
            </nav>

            <div className="mt-auto pt-10 border-t border-gray-100 dark:border-neutral-900">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Idioma</span>
              <div className="flex gap-2">
                <a href="?lang=pt" className={cn("flex-1 py-3 text-center text-xs font-black transition-all border", lang === 'pt' ? "bg-gray-100 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-black dark:text-white" : "text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-neutral-900")}>Português (PT)</a>
                <a href="?lang=en" className={cn("flex-1 py-3 text-center text-xs font-black transition-all border", lang === 'en' ? "bg-gray-100 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-black dark:text-white" : "text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-neutral-900")}>English (EN)</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
        (function() {
          const initMobileMenu = () => {
            const trigger = document.getElementById('mobile-menu-trigger');
            const sheet = document.getElementById('mobile-menu-sheet');
            const close = document.getElementById('close-mobile-menu');
            const content = sheet?.querySelector('div');
            
            // Re-bind modal triggers for mobile menu
            const cvTriggerMobile = document.getElementById('cv-trigger-mobile');
            const contactTriggerMobile = document.getElementById('contact-trigger-mobile');
            const mainCVTrigger = document.getElementById('cv-trigger');
            const mainContactTrigger = document.getElementById('contact-trigger');

            if (trigger && sheet && !trigger.dataset.initialized) {
              trigger.dataset.initialized = 'true';
              
              const openMenu = () => {
                sheet.classList.remove('opacity-0', 'pointer-events-none');
                content?.classList.remove('translate-x-full');
                document.body.style.overflow = 'hidden';
              };

              const closeMenu = () => {
                sheet.classList.add('opacity-0', 'pointer-events-none');
                content?.classList.add('translate-x-full');
                document.body.style.overflow = '';
              };

              trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openMenu();
              });

              close?.addEventListener('click', closeMenu);
              sheet.addEventListener('click', (e) => {
                if (e.target === sheet) closeMenu();
              });

              // Bridge mobile menu triggers to existing modal logic
              cvTriggerMobile?.addEventListener('click', (e) => {
                e.preventDefault();
                closeMenu();
                setTimeout(() => mainCVTrigger?.click(), 350);
              });

              contactTriggerMobile?.addEventListener('click', (e) => {
                e.preventDefault();
                closeMenu();
                setTimeout(() => mainContactTrigger?.click(), 350);
              });
            }
          };
          initMobileMenu();
          document.addEventListener('DOMContentLoaded', initMobileMenu);
          setInterval(initMobileMenu, 1000);
        })();
      `}} />
    </header>
  )
}
