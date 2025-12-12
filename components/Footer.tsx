import React from 'react';
import { Instagram, Mail, MapPin } from 'lucide-react';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-gray text-white py-12">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-serif font-bold text-xl mb-4 text-brand-orange">Lic. Sabrina Fernandez</h4>
          <p className="text-gray-400 text-sm">
            Nutrición Funcional e Integral.<br/>
            Especialista en Salud Digestiva.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Contacto</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Instagram size={16} aria-label="Instagram" /> 
              <a 
                href={INSTAGRAM_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-brand-orange transition-colors" 
                aria-label="Instagram de Lic. Sabrina B. Fernandez"
              >
                Sígueme en Instagram ({INSTAGRAM_HANDLE})
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> 
              <span>consultas@sabrinafernandez.com</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> 
              <span>Consultorio Virtual & Presencial (CABA)</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Horarios</h4>
          <p className="text-gray-400 text-sm mb-2">Lunes a Viernes: 9:00 - 19:00</p>
          <p className="text-xs text-gray-500 mt-4">
            © {new Date().getFullYear()} Todos los derechos reservados. <br/>
            Diseño Demo para Cliente.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;