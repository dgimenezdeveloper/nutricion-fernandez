import React from 'react';

interface VideoEmbedProps {
  url: string;
  title: string;
  description?: string;
}

function getInstagramEmbedUrl(url: string) {
  // Convierte la URL de Instagram a formato embed
  // Ejemplo: https://www.instagram.com/p/Cr6v_WTOgne/ => https://www.instagram.com/p/Cr6v_WTOgne/embed
  const match = url.match(/(https:\/\/www\.instagram\.com\/(p|tv|reel)\/[\w-]+)\/?/);
  return match ? `${match[1]}/embed` : null;
}

function getYouTubeEmbedUrl(url: string) {
  // Convierte la URL de YouTube a formato embed
  // Ejemplo: https://youtu.be/WxX15UPwEgA => https://www.youtube.com/embed/WxX15UPwEgA
  const ytMatch = url.match(/youtu(?:\.be\/|be\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const short = url.match(/youtu\.be\/([\w-]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  return null;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, title, description }) => {
  const isYouTube = url.includes('youtu');
  const isInstagram = url.includes('instagram.com');

  if (isYouTube) {
    const embedUrl = getYouTubeEmbedUrl(url);
    if (embedUrl) {
      return (
        <div className="aspect-video w-full rounded-xl overflow-hidden mb-2">
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      );
    }
  }

  if (isInstagram) {
    const embedUrl = getInstagramEmbedUrl(url);
    if (embedUrl) {
      return (
        <div className="aspect-[4/5] w-full rounded-xl overflow-hidden mb-2">
          <iframe
            src={embedUrl}
            title={title}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      );
    }
  }

  // Fallback: solo link
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block bg-brand-light rounded-2xl shadow-lg p-6 hover:bg-brand-orange/10 transition-colors border border-gray-100 text-center">
      <div className="mb-2 text-brand-purple font-bold">{title}</div>
      {description && <div className="mb-2 text-gray-600 text-sm">{description}</div>}
      <span className="text-brand-orange font-semibold text-xs">Ver en la plataforma &rarr;</span>
    </a>
  );
};

export default VideoEmbed;
