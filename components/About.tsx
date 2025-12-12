import React from 'react';
import { REVIEWS } from '../constants';
import { Star } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="sobre-mi" className="py-24 bg-brand-light">
      <div className="container mx-auto px-6">
        
        {/* Profile */}
        <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
          <div className="w-full md:w-1/2">
             <h2 className="text-4xl font-serif font-bold text-brand-gray mb-6">Sobre Mí</h2>
             <h3 className="text-xl text-brand-purple font-semibold mb-4">Lic. Sabrina B. Fernandez</h3>
             <div className="space-y-4 text-gray-600 leading-relaxed">
               <p>
                 Soy Licenciada en Nutrición con una profunda pasión por la <strong>Nutrición Funcional</strong>. Mi objetivo es acompañarte a descubrir la raíz de tus síntomas digestivos.
               </p>
               <p>
                 Me especializo en el tratamiento de desórdenes gastrointestinales como <strong>SIBO, IMO y Disbiosis</strong>. Entiendo que cada paciente es un universo, por lo que mis protocolos son 100% personalizados, dejando de lado las dietas restrictivas eternas y enfocándonos en la sanación real.
               </p>
               <ul className="grid grid-cols-2 gap-2 mt-4">
                 {['Certificación SIBO', 'Nutrición Funcional', 'Salud Hormonal', 'Microbiota'].map(item => (
                   <li key={item} className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
                     <span className="text-sm font-medium text-gray-700">{item}</span>
                   </li>
                 ))}
               </ul>
             </div>
          </div>
          <div className="w-full md:w-1/2 grid grid-cols gap-4">
            
            <img src="./public/images/sabrina-fernandez-01.avif" className="rounded-2xl shadow-lg mb-8" alt="Imagen de Sabrina Fernandez" />
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-gray-50">
          <div className="text-center mb-12">
             <h3 className="text-3xl font-serif font-bold text-brand-gray">Lo que dicen mis pacientes</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {REVIEWS.map((review) => (
              <div key={review.id} className="bg-gray-50 p-6 rounded-2xl hover:bg-brand-light transition-colors duration-300">
                <div className="flex gap-1 text-brand-orange mb-4">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 italic mb-4">"{review.text}"</p>
                <p className="font-bold text-brand-gray text-sm">{review.name}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;