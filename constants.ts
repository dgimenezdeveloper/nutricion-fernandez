// Redes sociales
export const INSTAGRAM_HANDLE = "@lic.sabrina.b.fernandez";
import { Service, Review } from './types';

export const SERVICES: Service[] = [
  {
    id: 1,
    title: "Tratamiento SIBO / IMO",
    description: "Protocolos especializados para el Sobrecrecimiento Bacteriano en Intestino Delgado y Metanógenos.",
    iconName: "Bacteria"
  },
  {
    id: 2,
    title: "Dieta Low FODMAPs",
    description: "Guía paso a paso para la implementación y reintroducción de alimentos fermentables.",
    iconName: "Apple"
  },
  {
    id: 3,
    title: "Nutrición Funcional",
    description: "Abordaje integral que busca la raíz de los síntomas y no solo taparlos.",
    iconName: "HeartPulse"
  },
  {
    id: 4,
    title: "Salud Intestinal",
    description: "Recupera tu microbiota y fortalece tu sistema inmune a través de la alimentación.",
    iconName: "Activity"
  }
];

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: "María G.",
    text: "Gracias a la Lic. Sabrina pude entender finalmente mis síntomas. El tratamiento para SIBO me cambió la vida.",
    rating: 5
  },
  {
    id: 2,
    name: "Esteban R.",
    text: "Muy profesional y empática. Se nota que se actualiza constantemente. Recomendada 100%.",
    rating: 5
  },
  {
    id: 3,
    name: "Lucía M.",
    text: "La dieta FODMAP fue un desafío, pero con su acompañamiento fue mucho más fácil.",
    rating: 5
  }
];

export const INSTAGRAM_URL = "https://www.instagram.com/lic.sabrina.b.fernandez/";