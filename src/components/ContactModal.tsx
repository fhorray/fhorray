import { cn } from "../lib/utils"

interface ContactModalProps {
  title: string
  nameLabel: string
  namePlaceholder: string
  messageLabel: string
  messagePlaceholder: string

  sendButton: string
  successMessage: string
  errorMessage: string
}

export const ContactModal = (props: ContactModalProps) => {
  return (
    <>
      <div
        id="contact-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300"
      >
        <div className="bg-white dark:bg-neutral-900 w-full max-w-md border border-gray-200 dark:border-neutral-800 overflow-hidden transform scale-95 transition-all duration-300">

          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{props.title}</h2>
              <button
                id="close-modal"
                className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>

            <form id="contact-form" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">{props.nameLabel}</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  placeholder={props.namePlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">{props.messageLabel}</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none"
                  placeholder={props.messagePlaceholder}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{props.sendButton}</span>
                <svg id="submit-spinner" className="hidden animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              </button>
            </form>
            <div id="form-success" className="hidden mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium text-center">
              {props.successMessage}
            </div>
            <div id="form-error" className="hidden mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
              {props.errorMessage}
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
        (function() {
          const modal = document.getElementById('contact-modal');
          const closeBtn = document.getElementById('close-modal');
          const form = document.getElementById('contact-form');
          const successMsg = document.getElementById('form-success');
          const errorMsg = document.getElementById('form-error');
          const spinner = document.getElementById('submit-spinner');

          window.openContactModal = () => {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.querySelector('div').classList.remove('scale-95');
            document.body.style.overflow = 'hidden';
          };

          const close = () => {
            modal.classList.add('opacity-0', 'pointer-events-none');
            modal.querySelector('div').classList.add('scale-95');
            document.body.style.overflow = '';
          };

          closeBtn.addEventListener('click', close);
          modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            successMsg.classList.add('hidden');
            errorMsg.classList.add('hidden');
            spinner.classList.remove('hidden');
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
              const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });

              if (res.ok) {
                successMsg.classList.remove('hidden');
                form.reset();
                setTimeout(close, 2000);
              } else {
                errorMsg.classList.remove('hidden');
              }
            } catch (err) {
              errorMsg.classList.remove('hidden');
            } finally {
              spinner.classList.add('hidden');
            }
          });
          
          // Attach to all contact triggers
          document.addEventListener('click', (e) => {
            if (e.target.closest('#contact-trigger')) {
              e.preventDefault();
              window.openContactModal();
            }
          });
        })();
      `}} />
    </>
  )
}
