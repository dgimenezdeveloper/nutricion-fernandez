import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const scrollToServices = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('servicios');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="min-h-screen flex items-center bg-gradient-to-br from-brand-light via-white to-purple-50 pt-20 pb-8">
      <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
        
        {/* Text Content */}
        <div className="order-2 md:order-1 space-y-6 animate-slide-up">
          <div className="inline-block bg-purple-100 text-brand-purple px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
            ESPECIALISTA EN SALUD DIGESTIVA
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-brand-gray leading-tight">
            Recupera tu <span className="text-brand-purple">Bienestar</span> <br/>
            Digestivo
          </h1>
          <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
            Un abordaje integral y actualizado para tratar SIBO, IMO y desequilibrios intestinales. Nutrición funcional diseñada para que vuelvas a sentirte bien.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={onOpenBooking}
              className="bg-brand-purple hover:bg-brand-darkPurple text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-brand-purple/30 flex items-center justify-center gap-2"
            >
              Agendar Consulta <ArrowRight size={20} />
            </button>
            <a 
              href="#servicios"
              onClick={scrollToServices}
              className="border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center"
            >
              Ver Tratamientos
            </a>
          </div>

          <div className="pt-8 flex gap-8">
            <div>
              <p className="font-bold text-2xl text-brand-gray">500+</p>
              <p className="text-sm text-gray-500">Pacientes Felices</p>
            </div>
            <div>
              <p className="font-bold text-2xl text-brand-gray">100%</p>
              <p className="text-sm text-gray-500">Personalizado</p>
            </div>
          </div>
        </div>

        {/* Image/Visual Content */}
        <div className="order-1 md:order-2 relative flex justify-center">
          <div className="relative w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" 
              alt="Mesa con alimentos saludables, frutas y vegetales frescos, consulta nutricional" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            {/* Floating Badge */}
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg max-w-[200px]">
              <p className="text-brand-orange font-bold text-lg">SIBO / IMO</p>
              <p className="text-xs text-gray-600">Recomendaciones actualizadas y tratamiento eficaz.</p>
            </div>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -z-10 top-10 -right-10 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl"></div>
          <div className="absolute -z-10 bottom-10 -left-10 w-64 h-64 bg-brand-purple/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;