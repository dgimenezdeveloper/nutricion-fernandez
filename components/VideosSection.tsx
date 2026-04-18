import React from 'react';
import VideoEmbed from './VideoEmbed';

const videos = [
  {
    title: 'Vivo sobre Tiroiditis de Hashimoto',
    url: 'https://www.instagram.com/p/Cr6v_WTOgne/?utm_source=ig_web_copy_link',
    description: 'Junto con @marcuzzi.carla',
  },
  {
    title: 'Vivo sobre Enfermedades Autoinmunes',
    url: 'https://www.instagram.com/tv/CiTclfBLP0M/?igshid=ZWIzMWE5ZmU3Zg==',
    description: 'Junto a @sofiasusenna',
  },
  {
    title: 'Vivo sobre abordaje funcional en Enfermedades Autoinmunes',
    url: 'https://youtu.be/WxX15UPwEgA',
    description: 'YouTube',
  },
  {
    title: 'Charla sobre Nutrición Emocional',
    url: 'https://www.instagram.com/tv/CUWC1nEtLFM/?igshid=ZWIzMWE5ZmU3Zg==',
    description: 'Junto a @biodescodificacionsur',
  },
  {
    title: 'Vivo "Conectando con el proceso"',
    url: 'https://www.instagram.com/tv/CRZ-iaFH3i5/?igshid=ZWIzMWE5ZmU3Zg==',
    description: 'Junto a @karynakharikay',
  },
  {
    title: '¿Cómo tratar el Estrés con estrategias no convencionales?',
    url: 'https://www.instagram.com/p/CasoX3qlNK0/?utm_source=ig_web_copy_link',
    description: 'Vivo de Ig @nutrirenred',
  },
  {
    title: 'Vivo sobre el Magnesio',
    url: 'https://www.instagram.com/p/CgNgOZLM8Zz/?utm_source=ig_web_copy_link',
    description: 'Vivo de Ig @nutrirenred',
  },
  {
    title: 'Masterclass "Suplementación con Magnesio"',
    url: 'https://www.instagram.com/p/CiTkMfrsvDg/?igshid=ZWIzMWE5ZmU3Zg==',
    description: 'Para profesionales | Nutrir en Red',
  },
  {
    title: '6 síntomas asociados a la deficiencia de Magnesio',
    url: 'https://www.instagram.com/reel/Cft6KgGulH6/?utm_source=ig_web_copy_link',
    description: 'Vivo de Ig @nutrirenred',
  },
  {
    title: '3 tips para mejorar la calidad del sueño',
    url: 'https://www.instagram.com/reel/CaQwKDeumGL/?utm_source=ig_web_copy_link',
    description: 'Vivo de Ig @nutrirenred',
  },
  {
    title: 'Importancia de optimizar los valores de Vitamina D',
    url: 'https://www.instagram.com/reel/CqORmmtONnz/?utm_source=ig_web_copy_link',
    description: 'Vivo de Ig @nutrirenred',
  },
];


const VideosSection: React.FC = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-6">
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-gray mb-6 sm:mb-8 text-center">Videos y Charlas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {videos.map((video, idx) => (
          <div key={idx} className="bg-brand-light rounded-2xl shadow-lg p-4 sm:p-6 hover:bg-brand-orange/10 transition-colors border border-gray-100 flex flex-col items-center">
            <VideoEmbed url={video.url} title={video.title} description={video.description} />
            <h3 className="font-bold text-lg text-brand-purple mb-2 text-center">{video.title}</h3>
            <p className="text-gray-600 text-sm mb-2 text-center">{video.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default VideosSection;
