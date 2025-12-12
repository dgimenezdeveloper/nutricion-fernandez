import React from 'react';
import { SERVICES } from '../constants';
import { Activity, Apple, HeartPulse, ShieldCheck, Microscope } from 'lucide-react';

const IconMap: Record<string, React.ReactNode> = {
  'Bacteria': <Microscope size={32} />,
  'Apple': <Apple size={32} />,
  'HeartPulse': <HeartPulse size={32} />,
  'Activity': <Activity size={32} />,
};

const Services: React.FC = () => {
  return (
    <section id="servicios" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-light skew-x-12 opacity-50 -z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-orange font-bold tracking-widest text-sm">ESPECIALIDADES</span>
          <h2 className="text-4xl font-serif font-bold text-brand-gray mt-2 mb-4">¿En qué puedo ayudarte?</h2>
          <p className="text-gray-600">
            Un enfoque científico y humano para tratar patologías digestivas complejas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service) => (
            <div 
              key={service.id} 
              className="group bg-white p-8 rounded-2xl border border-purple-50 hover:border-brand-purple/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-light text-brand-purple flex items-center justify-center mb-6 group-hover:bg-brand-purple group-hover:text-white transition-colors duration-300">
                {IconMap[service.iconName] || <Activity />}
              </div>
              <h3 className="text-xl font-bold text-brand-gray mb-3">{service.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Additional Info Box */}
        <div className="mt-20 bg-brand-purple rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            
            <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">¿Tienes dudas sobre SIBO?</h3>
                <p className="text-purple-100 max-w-lg">
                    Los síntomas pueden ser confusos. Utiliza mi asistente virtual inteligente para obtener orientación preliminar basada en mis protocolos.
                </p>
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <ShieldCheck size={24} className="text-brand-orange" />
                    <span className="font-semibold">Tecnología + Salud</span>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Services;