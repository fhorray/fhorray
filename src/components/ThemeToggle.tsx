import { cn } from "../lib/utils"

export const ThemeToggle = () => {
  return (
    <div className="relative inline-block">
      <button
        id="theme-toggle"
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
          "h-9 w-9 px-0",
          "bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
        )}
        aria-label="Toggle theme"
      >
        <svg
          id="sun-icon"
          className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M22 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
        <svg
          id="moon-icon"
          className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
        <span className="sr-only">Toggle theme</span>
      </button>

      <script dangerouslySetInnerHTML={{
        __html: `
        (function() {
          const initToggle = () => {
            const btn = document.getElementById('theme-toggle');
            if (btn && !btn.dataset.initialized) {
              btn.dataset.initialized = 'true';
              btn.addEventListener('click', (e) => {
                e.preventDefault();
                const isDark = document.documentElement.classList.toggle('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
              });
            }
          };
          initToggle();
          document.addEventListener('DOMContentLoaded', initToggle);
          // Also check every few ms just in case (Hono might be streaming)
          setTimeout(initToggle, 100);
          setTimeout(initToggle, 500);
        })();
      `}} />

    </div>
  )
}
