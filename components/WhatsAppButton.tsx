import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton: React.FC = () => (
  <a
    href="https://wa.link/gp4u42"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 bg-green-500 hover:bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-lg flex items-center justify-center transition-colors"
    aria-label="Solicitar turno por WhatsApp"
    title="Solicitar turno por WhatsApp"
  >
    <FaWhatsapp size={28} />
  </a>
);

export default WhatsAppButton;
