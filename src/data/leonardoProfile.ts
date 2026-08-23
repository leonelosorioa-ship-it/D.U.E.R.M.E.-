export interface MentorProfile {
  name: string;
  title: string;
  role: string;
  institution: string;
  parentBrand: string;
  brandMotto: string;
  techPartner: string;
  bio: string;
  philosophy: string;
  credentials: string[];
  pillars: {
    title: string;
    description: string;
    icon: string;
  }[];
  letterToStudent: string;
  contactEmail: string;
  badge: string;
}

export const LEONARDO_PROFILE: MentorProfile = {
  name: 'Leonardo',
  title: 'Director de Innovación y Bienestar Humano (CWO)',
  role: 'Mentor Principal y Arquitecto Somático',
  institution: 'Tu Poder Mental™ Mujer',
  parentBrand: 'Tu Poder Mental™ Mujer',
  brandMotto: 'Fortalece tu mente · Reconecta contigo · Transforma tu vida',
  techPartner: 'Leps Software Solutions™ (División de IA y Salud Digital de Leps Digital)',
  bio: 'Especialista en neurobiología del descanso, regulación del sistema nervioso autónomo y diseño de protocolos de optimización circadiana para la mujer contemporánea. Con más de 12 años liderando programas de transformación cognitiva y salud integral, Leonardo combina el rigor científico de la cronobiología moderna con una pedagogía cercana, serena y profundamente humana.',
  philosophy: 'El descanso profundo no es un premio que se gana tras el agotamiento; es el cimiento biológico no negociable desde el cual se construye la claridad mental, el equilibrio hormonal y la paz interior.',
  credentials: [
    'Director de Innovación y Bienestar Humano (CWO) en Tu Poder Mental™',
    'Investigador en Modulación Vagal, Ritmos Circadianos y Arquitectura del Sueño',
    'Creador del Método D.U.E.R.M.E.™ Somático de 7 Fases para Mujeres de Alto Rendimiento',
    'Consultor en Salud Digital y Neuroacústica Aplicada en Leps Software Solutions™',
  ],
  pillars: [
    {
      title: 'Neurobiología Circadiana',
      description: 'Sincronización milimétrica del núcleo supraquiasmático mediante luz solar matutina y oscuridad biológica nocturna.',
      icon: 'SunMoon',
    },
    {
      title: 'Regulación del Nervio Vago',
      description: 'Activación inmediata del freno parasimpático a través de patrones respiratorios 4-7-8 y relajación somática progresiva.',
      icon: 'HeartPulse',
    },
    {
      title: 'Higiene del Santuario & Bioquímica',
      description: 'Optimización térmica a 18°C, desconexión de radiaciones electromagnéticas (EMF) y estabilización glucémica con cofactores minerales.',
      icon: 'ShieldCheck',
    },
    {
      title: 'Neuroacústica Binaural Guiada',
      description: 'Arrastre electroencefalográfico hacia ondas Delta lentas (0.5-4 Hz) para favorecer el aclaramiento glinfático cerebral.',
      icon: 'Headphones',
    },
  ],
  letterToStudent: `Querida amiga,

Sé lo agotador que resulta acostarse con el cuerpo cansado pero con una mente que se niega a apagarse. La rumiación nocturna, la autoexigencia y la hiperalerta no son fallos de tu voluntad; son respuestas biológicas de un sistema nervioso que ha olvidado cómo sentirse seguro.

El programa D.U.E.R.M.E.™ Mujer fue diseñado precisamente para eso: no para obligarte a dormir con esfuerzo, sino para crear las condiciones fisiológicas y emocionales donde el descanso ocurra de manera espontánea, fluida y reparadora.

Durante estas 7 noches, caminaré a tu lado paso a paso. Recuerda que no tienes nada que demostrar ni nada que resolver en la oscuridad. Tu único compromiso hoy es permitirte soltar el control y dejar que tu biología haga lo que mejor sabe hacer: sanarte en el sueño.

Con toda mi dedicación y respeto,
Leonardo.`,
  contactEmail: 'bienestar@tupodermental.com',
  badge: 'Director de Innovación y Bienestar Humano',
};
