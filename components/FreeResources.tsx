import React from 'react';

const FreeResources: React.FC = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl font-serif font-bold text-brand-gray mb-6">Recursos Gratuitos</h2>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        <a
          href="https://forms.gle/stux7ri4axeS2eEW8"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-brand-orange text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-500 transition-colors"
        >
          Recetas Antiinflamatorias (Descarga gratuita)
        </a>
        <a
          href="https://sabrifernandez2511.wixsite.com/misitio"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-brand-purple text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-purple-700 transition-colors"
        >
          Información sobre el abordaje
        </a>
      </div>
    </div>
  </section>
);

export default FreeResources;
