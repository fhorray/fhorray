export const CVModal = (props: {
  title: string,
  ptOption: string,
  enOption: string
}) => {
  return (
    <div
      id="cv-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300"
    >
      <div className="bg-white dark:bg-neutral-900 w-full max-w-xs border border-gray-200 dark:border-neutral-800 overflow-hidden transform scale-95 transition-all duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{props.title}</h2>
            <button
              id="close-cv-modal"
              className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          </div>

          <div className="grid gap-3">
            <a
              href="/assets/cvs/CV_PT.pdf"
              download="Francy_Santos_CV_PT.pdf"
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-gray-100 dark:border-neutral-700 transition-all group"
            >
              <span className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">{props.ptOption}</span>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            </a>

            <a
              href="/assets/cvs/CV_ENG.pdf"
              download="Francy_Santos_CV_EN.pdf"
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-gray-100 dark:border-neutral-700 transition-all group"
            >
              <span className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">{props.enOption}</span>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            </a>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
        (function() {
          const initCVModal = () => {
            const trigger = document.getElementById('cv-trigger');
            const modal = document.getElementById('cv-modal');
            const close = document.getElementById('close-cv-modal');
            const content = modal?.querySelector('div');

            if (trigger && modal && !trigger.dataset.initialized) {
              trigger.dataset.initialized = 'true';
              trigger.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.remove('opacity-0', 'pointer-events-none');
                content?.classList.remove('scale-95');
              });

              const closeModal = () => {
                modal.classList.add('opacity-0', 'pointer-events-none');
                content?.classList.add('scale-95');
              };

              close?.addEventListener('click', closeModal);
              modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
              });
            }
          };
          initCVModal();
          document.addEventListener('DOMContentLoaded', initCVModal);
          setInterval(initCVModal, 1000);
        })();
      `}} />
    </div>
  )
}
