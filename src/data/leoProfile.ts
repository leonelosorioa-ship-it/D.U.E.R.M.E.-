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

export const LEO_PROFILE: MentorProfile = {
  name: 'Leo',
  title: 'Mentor de Vínculos y Conexión Digital',
  role: 'Mentor de Vínculos y Conexión Digital',
  institution: 'Tu Poder Mental™ Mujer',
  parentBrand: 'Tu Poder Mental™ Mujer',
  brandMotto: 'Acompañamiento estratégico y tecnológico para optimizar tus relaciones y tu proyecto de vida.',
  techPartner: 'Leps Software Solutions™ (División de IA y Salud Digital de Leps Digital)',
  bio: 'Especialista en neurobiología del descanso, regulación del sistema nervioso, optimización de hábitos y conexión humana para la mujer contemporánea. Con más de 12 años liderando iniciativas de transformación cognitiva y bienestar integral, Leo combina la precisión estratégica y tecnológica con una pedagogía cercana, serena y orientada a potenciar tus vínculos, tu descanso y tu proyecto de vida.',
  philosophy: 'El descanso profundo y el equilibrio mental no son un premio tras el agotamiento; son el cimiento indispensable para cultivar relaciones sanas, claridad estratégica y una vida plena y conectada.',
  credentials: [
    'Mentor de Vínculos y Conexión Digital en Tu Poder Mental™',
    'Investigador en Modulación Vagal, Ritmos Circadianos y Arquitectura del Sueño',
    'Creador del Método D.U.E.R.M.E.™ Somático de 7 Fases para Mujeres',
    'Consultor en Estrategia Digital y Neuroacústica Aplicada en Leps Software Solutions™',
  ],
  pillars: [
    {
      title: 'Neurobiología Circadiana & Hábitos',
      description: 'Sincronización milimétrica del núcleo supraquiasmático mediante luz solar matutina y oscuridad biológica nocturna.',
      icon: 'SunMoon',
    },
    {
      title: 'Regulación del Nervio Vago',
      description: 'Activación inmediata del freno parasimpático a través de patrones respiratorios 4-7-8 y relajación somática progresiva.',
      icon: 'HeartPulse',
    },
    {
      title: 'Santuario del Sueño & Desconexión Digital',
      description: 'Optimización térmica a 18°C, higiene electromagnética (EMF) y gestión estratégica de la tecnología antes de dormir.',
      icon: 'ShieldCheck',
    },
    {
      title: 'Neuroacústica Binaural Guiada',
      description: 'Arrastre electroencefalográfico hacia ondas Delta lentas (0.5-4 Hz) para favorecer el aclaramiento glinfático cerebral.',
      icon: 'Headphones',
    },
  ],
  letterToStudent: `Querida amiga,

Sé lo agotador que resulta acostarse con el cuerpo cansado pero con una mente que no deja de pensar en pendientes, proyectos o relaciones. La rumiación nocturna y la sobrecarga digital no son fallos de tu voluntad; son respuestas de un sistema nervioso sobreestimulado que necesita reconectar con la calma y la seguridad.

El programa D.U.E.R.M.E.™ Mujer fue diseñado precisamente para brindarte un acompañamiento estratégico y tecnológico que te permita soltar el control, optimizar tu descanso y potenciar tu bienestar integral.

Durante estas 7 noches, caminaré a tu lado paso a paso. Tu único compromiso hoy es permitirte descansar y dejar que tu cuerpo y tu mente se renueven por completo.

Con todo mi aprecio y compromiso,
Leo.`,
  contactEmail: 'bienestar@tupodermental.com',
  badge: 'Mentor de Vínculos y Conexión Digital',
};
