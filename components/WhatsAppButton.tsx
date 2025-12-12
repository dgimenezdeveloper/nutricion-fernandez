import React from 'react';

const WhatsAppButton: React.FC = () => (
  <a
    href="https://wa.link/gp4u42"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-8 right-8 z-50 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-full shadow-lg flex items-center gap-2 text-lg font-bold transition-colors"
    aria-label="Solicitar turno por WhatsApp"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12.004 2.003a9.94 9.94 0 0 0-8.47 15.36l-1.1 4.02a1 1 0 0 0 1.22 1.22l4.02-1.1a9.94 9.94 0 1 0 4.33-19.5Zm0 2a7.94 7.94 0 0 1 6.7 12.36 1 1 0 0 0-.18.9l.8 2.93-2.93-.8a1 1 0 0 0-.9.18A7.94 7.94 0 1 1 12.004 4Zm-2.5 4.5a1 1 0 0 0-.99 1.13c.13 1.13.6 2.2 1.36 3.13.77.93 1.8 1.7 2.93 2.13a1 1 0 0 0 1.13-.99v-1.5a1 1 0 0 0-1-1h-.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-.5a1 1 0 0 0-1 1v1.5a1 1 0 0 0 1.13.99c1.13-.43 2.16-1.2 2.93-2.13.76-.93 1.23-2 1.36-3.13a1 1 0 0 0-.99-1.13h-7Z"/></svg>
    Solicitar turno por WhatsApp
  </a>
);

export default WhatsAppButton;
