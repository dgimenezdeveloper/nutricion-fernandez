import React from 'react';

const LocationBlock: React.FC = () => (
  <section className="py-12 bg-brand-light">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-2xl font-bold text-brand-gray mb-2">Consultorio Presencial</h2>
      <p className="mb-4 text-gray-600">Adrogué, Provincia de Buenos Aires</p>
      <a
        href="https://maps.app.goo.gl/xpGE1wkkmKMyqk6j9"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-brand-orange text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-500 transition-colors"
      >
        Ver ubicación en Google Maps
      </a>
    </div>
  </section>
);

export default LocationBlock;
