import { QuizQuestion, DayPlan, SoundPreset, ScanResultData } from './types';

// 7 Preguntas Diagnósticas del Escaneo Inicial (ScanWizard)
export const INITIAL_SCAN_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '¿Cuánto tiempo tardas habitualmente en conciliar el sueño desde que apagas la luz?',
    subtitle: 'Evalúa la latencia del sueño y la acumulación de adenosina.',
    category: 'alerta_simpatica',
    options: [
      { text: 'Menos de 15 minutos (Duermo de inmediato)', points: 0, archetypeWeight: 'circadiano' },
      { text: 'Entre 20 y 40 minutos con pensamientos dispersos', points: 1, archetypeWeight: 'cognitivo' },
      { text: 'Entre 45 y 90 minutos dando vueltas y mirando la hora', points: 2, archetypeWeight: 'simpatico' },
      { text: 'Más de 90 minutos en estado de hiperalerta y taquicardia leve', points: 3, archetypeWeight: 'simpatico' },
    ],
  },
  {
    id: 2,
    question: '¿Qué ocurre con tu mente cuando intentas quedarte dormida?',
    subtitle: 'Mide la reactividad de la corteza prefrontal y la rumiación nocturna.',
    category: 'alerta_simpatica',
    options: [
      { text: 'Se calma suavemente y me dejo llevar al descanso', points: 0, archetypeWeight: 'circadiano' },
      { text: 'Repaso mentalmente lo que hice hoy pero logro desconectar', points: 1, archetypeWeight: 'cognitivo' },
      { text: 'Se activan conversaciones pasadas o pendientes del día siguiente', points: 2, archetypeWeight: 'cognitivo' },
      { text: 'Mente en bucle incontrolable, autoexigencia o miedo a no dormir', points: 3, archetypeWeight: 'simpatico' },
    ],
  },
  {
    id: 3,
    question: '¿A qué hora y con qué frecuencia experimentas despertares nocturnos?',
    subtitle: 'Indica estabilidad glucémica y secreción pulsátil de cortisol.',
    category: 'nutricion_bioquimica',
    options: [
      { text: 'Raramente me despierto; duermo de corrido 7-8 horas', points: 0, archetypeWeight: 'circadiano' },
      { text: 'Me despierto 1 vez al baño y vuelvo a dormir en 5 minutos', points: 1, archetypeWeight: 'ambiental' },
      { text: 'Me despierto entre 2:00 AM y 4:00 AM con mente activa o sed', points: 2, archetypeWeight: 'nutricion_bioquimica' as any },
      { text: 'Múltiples microdespertares y sensación de sueño muy liviano/vigilante', points: 3, archetypeWeight: 'simpatico' },
    ],
  },
  {
    id: 4,
    question: '¿Cuál es tu hábito de exposición a pantallas y luces artificiales antes de acostarte?',
    subtitle: 'Mide la supresión de melatonina y disrupción del núcleo supraquiasmático.',
    category: 'ciclo_circadiano',
    options: [
      { text: 'Apago pantallas 1-2 horas antes y uso luz tenue y cálida', points: 0, archetypeWeight: 'circadiano' },
      { text: 'Uso filtro de luz nocturna o modo oscuro hasta 30 min antes', points: 1, archetypeWeight: 'circadiano' },
      { text: 'Miro el móvil o series en la cama hasta el momento de cerrar los ojos', points: 2, archetypeWeight: 'circadiano' },
      { text: 'Respondo mensajes de trabajo en cama con luz blanca intensa', points: 3, archetypeWeight: 'circadiano' },
    ],
  },
  {
    id: 5,
    question: '¿Cómo sientes tu cuerpo físicamente al meterte entre las sábanas?',
    subtitle: 'Evalúa la tensión somática neuromuscular y el tono vagal.',
    category: 'alerta_simpatica',
    options: [
      { text: 'Relajado, pesado y listo para descansar', points: 0, archetypeWeight: 'ambiental' },
      { text: 'Algo de tensión en cuello o espalda pero cede al respirar', points: 1, archetypeWeight: 'simpatico' },
      { text: 'Mandíbula apretada (bruxismo), hombros rígidos o piernas inquietas', points: 2, archetypeWeight: 'simpatico' },
      { text: 'Opresión en el pecho, respiración superficial o temperatura corporal elevada', points: 3, archetypeWeight: 'simpatico' },
    ],
  },
  {
    id: 6,
    question: '¿Cómo describirías las condiciones de tu habitación y entorno de descanso?',
    subtitle: 'Mide la higiene del entorno, temperatura y contaminación electromagnética.',
    category: 'higiene_entorno',
    options: [
      { text: 'Oscuridad total, silencio, temperatura fresca (~18°C) y sin móvil cerca', points: 0, archetypeWeight: 'ambiental' },
      { text: 'Buena temperatura pero entra algo de luz de la calle o ruidos menores', points: 1, archetypeWeight: 'ambiental' },
      { text: 'Habitación calurosa (>22°C), televisor o móvil cargando en la mesita de noche', points: 2, archetypeWeight: 'ambiental' },
      { text: 'Ambiente desordenado, router WiFi en el dormitorio y múltiples luces LED', points: 3, archetypeWeight: 'ambiental' },
    ],
  },
  {
    id: 7,
    question: '¿Cómo te sientes al despertar por la mañana en tu primer tercio del día?',
    subtitle: 'Evalúa el valor recuperador del sueño delta y la inercia del sueño.',
    category: 'nutricion_bioquimica',
    options: [
      { text: 'Renovada, con claridad mental y energía natural sin necesidad de café', points: 0, archetypeWeight: 'circadiano' },
      { text: 'Un poco pesada los primeros 15 minutos, luego me activo bien', points: 1, archetypeWeight: 'circadiano' },
      { text: 'Agotada, como si no hubiera dormido, dependiente de cafeína', points: 2, archetypeWeight: 'nutricion_bioquimica' as any },
      { text: 'Dolor de cabeza, niebla mental intensa y fatiga crónica todo el día', points: 3, archetypeWeight: 'simpatico' },
    ],
  },
];

// Cálculo de Resultados y Arquetipos
export function calculateScanResult(answers: { [questionId: number]: number }): ScanResultData {
  let totalScore = 0;
  let circadianPoints = 0;
  let sympatheticPoints = 0;
  let environmentPoints = 0;
  let biochemicalPoints = 0;

  INITIAL_SCAN_QUESTIONS.forEach((q) => {
    const selectedIdx = answers[q.id] ?? 0;
    const opt = q.options[selectedIdx] || q.options[0];
    totalScore += opt.points;

    if (q.category === 'ciclo_circadiano') circadianPoints += opt.points;
    if (q.category === 'alerta_simpatica') sympatheticPoints += opt.points;
    if (q.category === 'higiene_entorno') environmentPoints += opt.points;
    if (q.category === 'nutricion_bioquimica') biochemicalPoints += opt.points;
  });

  const maxScore = INITIAL_SCAN_QUESTIONS.length * 3; // 21 pts
  const percentage = Math.round((totalScore / maxScore) * 100);

  // Insomnia severity level
  let insomniaLevel: 'Leve' | 'Moderado' | 'Severo' | 'Crítico' = 'Leve';
  let sleepDebtHours = 1.0;
  if (totalScore >= 16) {
    insomniaLevel = 'Crítico';
    sleepDebtHours = 3.5;
  } else if (totalScore >= 11) {
    insomniaLevel = 'Severo';
    sleepDebtHours = 2.5;
  } else if (totalScore >= 6) {
    insomniaLevel = 'Moderado';
    sleepDebtHours = 1.8;
  } else {
    insomniaLevel = 'Leve';
    sleepDebtHours = 0.8;
  }

  // Dominant Archetype Determination
  let dominantArchetype = 'simpatico';
  let archetypeTitle = 'Mente Hiperexcitada por Cortisol';
  let archetypeDescription = 'Tu sistema nervioso simpático permanece en modo alerta incluso al acostarte. La producción de cortisol vespertino bloquea la transición natural a ondas Delta.';
  let recommendedFrequency = 'Frecuencias Delta (1.5 Hz) + Coherencia Vagal';
  let keyVulnerability = 'Hiperactividad de la corteza prefrontal y resistencia al freno parasimpático.';
  let actionPlanSummary = 'Despresurización neuromuscular, anclaje somático 4-7-8 y vaciado mental.';

  const scores = [
    { type: 'simpatico', pts: sympatheticPoints, title: 'Mente Hiperexcitada por Cortisol', desc: 'Sobrecarga adrenérgica y dificultad para soltar el control cognitivo antes de dormir.', freq: 'Delta 1.5 Hz + Freno Vagal' },
    { type: 'circadiano', pts: circadianPoints, title: 'Desfase Circadiano por Luz Azul', desc: 'Tu reloj maestro supraquiasmático está desincronizado por luz artificial y falta de luz solar matinal.', freq: 'Theta 4.5 Hz + Sincronización Lumínica' },
    { type: 'ambiental', pts: environmentPoints, title: 'Santuario Vulnerable a EMF y Temperatura', desc: 'El microambiente de tu dormitorio (calor, microondas WiFi o luz residual) fragmenta tus fases profundas de sueño.', freq: 'Ruido Rosa Terapéutico + Santuario Oscuro' },
    { type: 'biochemical', pts: biochemicalPoints, title: 'Inestabilidad Bioquímica & Despertares 3AM', desc: 'Caídas glucémicas y déficit de cofactores minerales (magnesio/potasio) generan micro-picos de adrenalina de madrugada.', freq: 'Frecuencia Solfeggio 528Hz + Soporte de Magnesio' },
  ];

  scores.sort((a, b) => b.pts - a.pts);
  const highest = scores[0];

  dominantArchetype = highest.type;
  archetypeTitle = highest.title;
  archetypeDescription = highest.desc;
  recommendedFrequency = highest.freq;

  return {
    totalScore,
    maxScore,
    percentage,
    circadianScore: Math.round((circadianPoints / 6) * 100),
    sympatheticScore: Math.round((sympatheticPoints / 9) * 100),
    environmentScore: Math.round((environmentPoints / 3) * 100),
    biochemicalScore: Math.round((biochemicalPoints / 6) * 100),
    dominantArchetype,
    archetypeTitle,
    archetypeDescription,
    insomniaLevel,
    sleepDebtHours,
    recommendedFrequency,
    keyVulnerability,
    actionPlanSummary,
  };
}

// Biblioteca de Sonidos Terapéuticos (Web Audio API)
export const SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'preset_delta_15',
    name: 'Delta Profundo 1.5 Hz',
    subtitle: 'Regeneración Celular & Fases NREM 3',
    description: 'Sincroniza los hemisferios cerebrales en la banda delta profunda (1.5 Hz), induciendo la liberación de la hormona del crecimiento y el aclaramiento del sistema glinfático.',
    type: 'delta',
    carrierFreq: 216,
    beatFreq: 1.5,
    icon: 'Moon',
    recommendedDuration: '30-45 min',
  },
  {
    id: 'preset_theta_45',
    name: 'Theta Serena 4.5 Hz',
    subtitle: 'Meditación Crepuscular & Calma Vagal',
    description: 'Frecuencia hipnagógica que desacelera la actividad de la corteza prefrontal, disolviendo pensamientos rumiantes y preparando el cuerpo para una entrega pacífica.',
    type: 'theta',
    carrierFreq: 210,
    beatFreq: 4.5,
    icon: 'Sparkles',
    recommendedDuration: '20-30 min',
  },
  {
    id: 'preset_pink_noise',
    name: 'Ruido Rosa Terapéutico',
    subtitle: 'Enmascaramiento 1/f & Estabilización',
    description: 'Perfil de densidad espectral 1/f que imita los sonidos de la naturaleza, comprobado científicamente para aumentar la duración del sueño profundo y proteger de ruidos ambientales.',
    type: 'pink',
    carrierFreq: 0,
    beatFreq: 0,
    icon: 'Waves',
    recommendedDuration: 'Toda la noche',
  },
  {
    id: 'preset_rain_waves',
    name: 'Lluvia Serena & Océano Biorrítmico',
    subtitle: 'Descarga Somática & Relajación Visceral',
    description: 'Sonido suave de gotas y oleaje con modulación de baja frecuencia que activa el reflejo barorreceptor para reducir la frecuencia cardíaca y la presión arterial.',
    type: 'rain',
    carrierFreq: 0,
    beatFreq: 0,
    icon: 'CloudRain',
    recommendedDuration: '45 min',
  },
  {
    id: 'preset_solfeggio_528',
    name: 'Frecuencia Solfeggio 528 Hz',
    subtitle: 'Reparación & Paz Mental',
    description: 'Tono acústico armónico utilizado en musicoterapia para equilibrar los niveles de cortisol y promover una sensación de seguridad y protección integral.',
    type: 'solfeggio',
    carrierFreq: 528,
    beatFreq: 0,
    icon: 'HeartHandshake',
    recommendedDuration: '30 min',
  },
];

// Protocolo Guiado de 7 Días (Hoja de Ruta)
export const SEVEN_DAYS_ROADMAP: DayPlan[] = [
  {
    dayNumber: 1,
    title: 'Diagnóstico de Alerta & Adenosina Acumulada',
    subtitle: 'Desactivar la hipervigilancia y crear la presión de sueño adecuada.',
    theme: 'Presión Homeostática',
    tagline: 'Tu descanso comienza desde el instante en que abres los ojos.',
    iconName: 'BrainCircuit',
    objective: 'Reconocer el nivel de activación simpática basal y comprender la curva de adenosina para no forzar el sueño antes de tiempo.',
    somaticTechnique: {
      name: 'Protocolo de Vaciado Mental de 7 Minutos',
      instructions: [
        'Toma una libreta física y un bolígrafo 60 minutos antes de acostarte (nunca en el móvil).',
        'Escribe sin filtro todo lo que te preocupa, pendientes del día siguiente y pensamientos en bucle.',
        'Al lado de cada pendiente escribe: "Esto pertenece a mañana a las 9:00 AM; mi cuerpo está a salvo ahora".',
        'Cierra la libreta físicamente y colócala fuera del dormitorio.',
      ],
      recommendedTime: '7 minutos al atardecer',
    },
    cognitiveReframe: {
      myth: 'Si no me duermo en 10 minutos, mi día de mañana será un desastre.',
      truth: 'Permanecer en reposo relajada en la oscuridad aporta el 70% de los beneficios celulares del sueño. No tienes que obligarte a dormir, solo permitirte descansar.',
      affirmation: 'Suelto la necesidad de controlar mi sueño. Mi cuerpo sabe cómo sanar cuando le doy espacio.',
    },
    soundTherapyPreset: {
      id: 'preset_theta_45',
      name: 'Theta Serena 4.5 Hz',
      frequencyHz: 4.5,
      description: 'Ideal para la transición de vigilia a somnolencia ligera.',
    },
    hypnagogicAnchor: 'Inhalo serenidad, exhalo el peso del día.',
    tasks: [
      { id: 'd1_t1', title: 'Completar el Vaciado Mental en papel', description: 'Escribe 3 pendientes y ciérralos simbólicamente.', durationMinutes: 7, completed: false },
      { id: 'd1_t2', title: 'Cena temprana sin estimulantes', description: 'Termina de comer al menos 2.5 horas antes de acostarte.', durationMinutes: 30, completed: false },
      { id: 'd1_t3', title: 'Escuchar 20 minutos de Frecuencia Theta 4.5 Hz', description: 'Con auriculares a volumen suave en penumbra.', durationMinutes: 20, completed: false },
    ],
    dailyQuestions: [
      { id: 101, question: '¿Pudiste realizar el vaciado mental en papel?', options: [{ text: 'Sí, sentí un alivio mental inmediato', points: 3 }, { text: 'Lo hice brevemente', points: 2 }, { text: 'No alcancé a hacerlo hoy', points: 0 }] },
      { id: 102, question: '¿Cómo sentiste la latencia para dormirte hoy?', options: [{ text: 'Me dormí más rápido de lo habitual', points: 3 }, { text: 'Similar a siempre', points: 2 }, { text: 'Me costó bastante', points: 1 }] },
      { id: 103, question: '¿Cómo amaneció tu nivel de energía?', options: [{ text: 'Clara y lista', points: 3 }, { text: 'Normal', points: 2 }, { text: 'Con pesadez', points: 1 }] },
    ],
  },
  {
    dayNumber: 2,
    title: 'Sincronización Lumínica & Melatonina Natural',
    subtitle: 'El reloj maestro: Luz solar matutina vs. luz azul nocturna.',
    theme: 'Ritmo Circadiano',
    tagline: 'La oscuridad es la cuna donde nace tu melatonina.',
    iconName: 'Shield',
    objective: 'Anclar el ritmo circadiano mediante 15 minutos de luz solar antes de las 10:00 AM y bloqueo estricto de luz azul nocturna.',
    somaticTechnique: {
      name: 'El Santuario de Luz Tenue (Regla de las Luces Bajas)',
      instructions: [
        'A partir de las 8:00 PM, apaga todas las luces de techo de tu hogar.',
        'Enciende únicamente lámparas de pie o velas a nivel del suelo con bombillas cálidas (<2200K).',
        'Activa el filtro de luz roja en tu móvil o usa gafas de bloqueo de luz azul si debes usar pantallas.',
        'Permite que tus pupilas se dilaten naturalmente indicándole a tu glándula pineal que la noche ha llegado.',
      ],
      recommendedTime: 'Desde las 20:00 en adelante',
    },
    cognitiveReframe: {
      myth: 'Mirar el móvil antes de dormir me distrae y me da sueño.',
      truth: 'La luz azul a 450nm envía fotones que suprimen la melatonina en un 80% y elevan el cortisol, engañando a tu cerebro como si fuera mediodía.',
      affirmation: 'Honro los ciclos naturales de la tierra. La noche me abraza y me protege.',
    },
    soundTherapyPreset: {
      id: 'preset_pink_noise',
      name: 'Ruido Rosa Terapéutico',
      frequencyHz: 0,
      description: 'Estabiliza el ritmo neural contra la contaminación acústica.',
    },
    hypnagogicAnchor: 'La oscuridad es mi refugio; la luz de mi mente se aquieta.',
    tasks: [
      { id: 'd2_t1', title: '15 minutos de sol matinal sin gafas de sol', description: 'Recibe luz natural en los ojos para programar el pulso de melatonina 14h después.', durationMinutes: 15, completed: false },
      { id: 'd2_t2', title: 'Toque de queda de pantallas a las 21:30', description: 'Guarda el teléfono fuera de la cama.', durationMinutes: 5, completed: false },
      { id: 'd2_t3', title: 'Luz tenue y cálida en el hogar', description: 'Usa lámparas bajas o velas en la última hora.', durationMinutes: 60, completed: false },
    ],
    dailyQuestions: [
      { id: 201, question: '¿Tomaste tus 15 minutos de luz solar directa?', options: [{ text: 'Sí, sentí un despertar más nítido', points: 3 }, { text: 'Solo unos minutos', points: 2 }, { text: 'No pude salir', points: 0 }] },
      { id: 202, question: '¿Apagaste pantallas antes de acostarte?', options: [{ text: 'Sí, al menos 45 min antes', points: 3 }, { text: 'Hasta 15 min antes', points: 2 }, { text: 'Me dormí con el móvil', points: 0 }] },
      { id: 203, question: '¿Cómo sentiste la pesadez de párpados al acostarte?', options: [{ text: 'Muy natural y profunda', points: 3 }, { text: 'Moderada', points: 2 }, { text: 'Ojos secos y alerta', points: 1 }] },
    ],
  },
  {
    dayNumber: 3,
    title: 'Nutrición, Magnesio & Glucemia Nocturna',
    subtitle: 'Evitar los picos de cortisol que provocan despertares a las 3:00 AM.',
    theme: 'Bioquímica del Descanso',
    tagline: 'Nutre a tu cuerpo con calma para que tu mente duerma en paz.',
    iconName: 'UtensilsCrossed',
    objective: 'Estabilizar el nivel de glucosa en sangre durante la noche e incorporar los cofactores minerales (GABA, Magnesio Bisglicinato y Triptófano).',
    somaticTechnique: {
      name: 'El Cóctel Somático de la Tarde-Noche',
      instructions: [
        'Evita cafeína y teína después de las 14:00 (la vida media de la cafeína es de 6 a 8 horas).',
        'Cena con alimentos ricos en triptófano (semillas de calabaza, huevos, pavo, avena) y carbohidratos complejos de absorción lenta.',
        'Prepara una infusión de manzanilla con lavanda, pasiflora o glicinato de magnesio 45 min antes de dormir.',
        'Evita alcohol: aunque seda inicialmente, fragmenta el sueño REM y causa taquicardia nocturna.',
      ],
      recommendedTime: 'Cena y post-cena (19:30 - 21:00)',
    },
    cognitiveReframe: {
      myth: 'Una copa de vino me ayuda a relajarme y dormir mejor.',
      truth: 'El alcohol bloquea la fase REM y eleva la temperatura corporal central, provocando despertares a mitad de noche con deshidratación y micro-pánicos.',
      affirmation: 'Nutro mis células con pureza y serenidad. Mi cuerpo digiere la calma.',
    },
    soundTherapyPreset: {
      id: 'preset_solfeggio_528',
      name: 'Frecuencia Solfeggio 528 Hz',
      frequencyHz: 528,
      description: 'Armonización bioquímica y reducción de marcadores inflamatorios.',
    },
    hypnagogicAnchor: 'Mi cuerpo se relaja, mis células se regeneran en silencio.',
    tasks: [
      { id: 'd3_t1', title: 'Cero cafeína después de las 14:00', description: 'Permite que los receptores de adenosina no se bloqueen.', durationMinutes: 1, completed: false },
      { id: 'd3_t2', title: 'Cena balanceada con magnesio', description: 'Proteína ligera + vegetales verdes + infusión relajante.', durationMinutes: 30, completed: false },
      { id: 'd3_t3', title: 'Infusión tibia de pasiflora o manzanilla', description: 'Bébela a sorbos lentos con respiración consciente.', durationMinutes: 15, completed: false },
    ],
    dailyQuestions: [
      { id: 301, question: '¿Lograste cortar la cafeína a tiempo?', options: [{ text: 'Sí, nada de cafeína en la tarde', points: 3 }, { text: 'Tomé té verde suave', points: 2 }, { text: 'Tomé café tarde', points: 0 }] },
      { id: 302, question: '¿Tuviste despertares con hambre o sed?', options: [{ text: 'Dormí continuo sin hambre', points: 3 }, { text: 'Me desperté 1 vez', points: 2 }, { text: 'Me desperté con agitación', points: 1 }] },
      { id: 303, question: '¿Cómo estuvo tu digestión nocturna?', options: [{ text: 'Liviana y cómoda', points: 3 }, { text: 'Normal', points: 2 }, { text: 'Pesada o con acidez', points: 0 }] },
    ],
  },
  {
    dayNumber: 4,
    title: 'Santuario del Sueño & Desconexión EMF',
    subtitle: 'Temperatura fresca (18°C), oscuridad absoluta y campos electromagnéticos.',
    theme: 'Arquitectura del Dormitorio',
    tagline: 'Tu habitación es un templo sagrado exclusivo para el amor y el descanso.',
    iconName: 'Activity',
    objective: 'Acondicionar el microclima térmico y acústico del dormitorio para favorecer la termorregulación y la profundidad del sueño.',
    somaticTechnique: {
      name: 'Auditoría Somática del Santuario',
      instructions: [
        'Ventila la habitación durante 15 minutos antes de acostarte y mantén la temperatura entre 17°C y 19°C.',
        'Elimina cualquier luz LED visible (cinta aislante negra sobre cargadores y pantallas de electrodomésticos).',
        'Pon tu teléfono móvil en Modo Avión y cárgalo a más de 2 metros de tu cabeza (o fuera de la habitación).',
        'Toma una ducha tibia de 10 minutos antes de acostarte: la vasodilatación posterior enfría el núcleo corporal facilitando el sueño profundo.',
      ],
      recommendedTime: '45 minutos antes de acostarte',
    },
    cognitiveReframe: {
      myth: 'Necesito una habitación muy cálida para sentirme cómoda.',
      truth: 'El cuerpo humano necesita descender su temperatura central en 1°C para iniciar el sueño profundo. Un dormitorio caluroso fragmenta las fases Delta.',
      affirmation: 'En este espacio solo habita la paz. Nada del exterior puede perturbarme.',
    },
    soundTherapyPreset: {
      id: 'preset_rain_waves',
      name: 'Lluvia Serena & Océano Biorrítmico',
      frequencyHz: 0,
      description: 'Enmascara sonidos externos creando una burbuja de aislamiento acústico.',
    },
    hypnagogicAnchor: 'Mi santuario me protege; estoy a salvo y en paz.',
    tasks: [
      { id: 'd4_t1', title: 'Dormitorio a temperatura fresca (17-19°C)', description: 'Ventila y ajusta ropa de cama transpirable.', durationMinutes: 15, completed: false },
      { id: 'd4_t2', title: 'Móvil en Modo Avión lejos de la mesita', description: 'Desconecta radiaciones EMF y notificaciones nocturnas.', durationMinutes: 2, completed: false },
      { id: 'd4_t3', title: 'Ducha tibia vasodilatadora', description: '10 minutos de agua templada para enfriar el núcleo corporal.', durationMinutes: 10, completed: false },
    ],
    dailyQuestions: [
      { id: 401, question: '¿Cómo sentiste la temperatura de tu dormitorio?', options: [{ text: 'Fresca y perfecta', points: 3 }, { text: 'Aceptable', points: 2 }, { text: 'Muy calurosa o sofocante', points: 0 }] },
      { id: 402, question: '¿Pusiste el móvil en Modo Avión lejos de ti?', options: [{ text: 'Sí, cero notificaciones cerca', points: 3 }, { text: 'En silencio pero en la mesita', points: 2 }, { text: 'Sonó o miré la pantalla', points: 0 }] },
      { id: 403, question: '¿Sentiste mayor sensación de recogimiento?', options: [{ text: 'Completamente protegida', points: 3 }, { text: 'Bastante bien', points: 2 }, { text: 'Igual que antes', points: 1 }] },
    ],
  },
  {
    dayNumber: 5,
    title: 'Regulación Vagal & Relajación Somática Progresiva',
    subtitle: 'Técnica militar de relajación + respiración diafragmática 4-7-8.',
    theme: 'Freno Parasimpático',
    tagline: 'Cuando tu cuerpo se rinde, tu mente no tiene más remedio que seguirlo.',
    iconName: 'Wind',
    objective: 'Estimular directamente el nervio vago para inducir la desactivación refleja del tono simpático en menos de 10 minutos.',
    somaticTechnique: {
      name: 'Escaneo Somático Militar de 6 Zonas',
      instructions: [
        'Acuéstate boca arriba, suelta los brazos a los lados con las palmas hacia arriba.',
        'Zona 1: Relaja la frente, el entrecejo, los ojos y suelta la lengua dentro del paladar.',
        'Zona 2: Deja caer los hombros como si se derritieran en el colchón; suelta brazos y dedos.',
        'Zona 3: Exhala profundamente y siente cómo tu pecho y abdomen se hunden con calma.',
        'Zona 4: Relaja los muslos, las pantorrillas y los dedos de los pies.',
        'Zona 5: Aplica 4 ciclos de respiración 4-7-8 (Inhala en 4s, retén en 7s, exhala en 8s con sonido "shhh").',
      ],
      recommendedTime: 'En cama justo antes de dormir (10 minutos)',
    },
    cognitiveReframe: {
      myth: 'Tengo que obligar a mi mente a dejar de pensar para poder dormir.',
      truth: 'No puedes controlar los pensamientos con más pensamientos. El camino al sueño es somático: cuando relajas la musculatura facial y la lengua, el cerebro detiene el monólogo interno.',
      affirmation: 'Suelto toda tensión de mi cuerpo. Me entrego al sostén de este colchón.',
    },
    soundTherapyPreset: {
      id: 'preset_delta_15',
      name: 'Delta Profundo 1.5 Hz',
      frequencyHz: 1.5,
      description: 'Potencia la sincronización de las ondas cerebrales en delta profundo.',
    },
    hypnagogicAnchor: 'Todo está bien en este instante; me rindo al descanso.',
    tasks: [
      { id: 'd5_t1', title: 'Practicar 4 ciclos de respiración 4-7-8', description: 'Activa el freno vagal y ralentiza el pulso cardíaco.', durationMinutes: 5, completed: false },
      { id: 'd5_t2', title: 'Escaneo Somático Militar de 6 zonas', description: 'Recorre tu cuerpo soltando frente, lengua, hombros y piernas.', durationMinutes: 8, completed: false },
      { id: 'd5_t3', title: 'Soltar la mandíbula y lengua', description: 'Separa los dientes superiores de los inferiores.', durationMinutes: 2, completed: false },
    ],
    dailyQuestions: [
      { id: 501, question: '¿Pudiste sentir la relajación muscular en mandíbula y hombros?', options: [{ text: 'Sí, sentí que mi cuerpo pesaba mucho más', points: 3 }, { text: 'En parte, pero algo de tensión persistió', points: 2 }, { text: 'Me costó notar cambios', points: 1 }] },
      { id: 502, question: '¿Cómo respondiste a la respiración 4-7-8?', options: [{ text: 'Me dio un bostezo inmediato y sueño', points: 3 }, { text: 'Me tranquilizó el ritmo cardíaco', points: 2 }, { text: 'Me costó aguantar 7 segundos', points: 1 }] },
      { id: 503, question: '¿Tu mente se sintió más silenciosa?', options: [{ text: 'Mucho más quieta y en calma', points: 3 }, { text: 'Con algunos pensamientos aislados', points: 2 }, { text: 'Acelerada', points: 0 }] },
    ],
  },
  {
    dayNumber: 6,
    title: 'Terapia Acústica & Sueño Delta Profundo',
    subtitle: 'Frecuencias binaurales puras para el aclaramiento glinfático cerebral.',
    theme: 'Consolidación Neural',
    tagline: 'Tus ondas cerebrales fluyen como ríos tranquilos hacia la profundidad.',
    iconName: 'Eye',
    objective: 'Maximizar el porcentaje de sueño NREM3 (sueño delta), donde el líquido cefalorraquídeo limpia los residuos metabólicos y beta-amiloides del cerebro.',
    somaticTechnique: {
      name: 'Inmersión Acústica Binaural Guiada',
      instructions: [
        'Coloca auriculares estéreo cómodos a un volumen suave (no más del 30-40%).',
        'Inicia la pista Delta Profundo 1.5 Hz o Ruido Rosa en la app D.U.E.R.M.E.™.',
        'Programa el temporizador de apagado a 30 o 45 minutos para que se silencie solo.',
        'Permite que el arrastre binaural guíe tu electroencefalograma hacia ondas delta sin forzar ningún pensamiento.',
      ],
      recommendedTime: '30-45 minutos al acostarte',
    },
    cognitiveReframe: {
      myth: 'Si me despierto a mitad de la noche, ya arruiné mi descanso.',
      truth: 'Los despertares entre ciclos de 90 minutos son evolutivamente normales. Si te despiertas, no mires la hora ni enciendas luces; simplemente mantén la respiración lenta.',
      affirmation: 'Confío en la inteligencia de mi cerebro. Cada noche es una oportunidad de renovación.',
    },
    soundTherapyPreset: {
      id: 'preset_delta_15',
      name: 'Delta Profundo 1.5 Hz',
      frequencyHz: 1.5,
      description: 'El estándar de oro en neuroacústica para sueño NREM 3.',
    },
    hypnagogicAnchor: 'Ondas de paz bañan mi mente; descanso en lo más profundo.',
    tasks: [
      { id: 'd6_t1', title: 'Configurar la Terapia Sonora en D.U.E.R.M.E.™', description: 'Activa Delta 1.5 Hz con temporizador de 45 minutos.', durationMinutes: 5, completed: false },
      { id: 'd6_t2', title: 'Regla de Oro: Prohibido mirar el reloj de noche', description: 'Voltea el despertador para no calcular cuántas horas te quedan.', durationMinutes: 1, completed: false },
      { id: 'd6_t3', title: 'Respiración de coherencia mientras escuchas', description: '5 segundos inhala, 5 segundos exhala con el audio.', durationMinutes: 10, completed: false },
    ],
    dailyQuestions: [
      { id: 601, question: '¿Cómo sentiste la sesión de audio binaural?', options: [{ text: 'Me transportó al sueño casi sin darme cuenta', points: 3 }, { text: 'Me relajó notablemente', points: 2 }, { text: 'Me costó acostumbrarme al sonido', points: 1 }] },
      { id: 602, question: '¿Evitaste mirar el reloj durante la noche?', options: [{ text: 'Sí, no miré la hora en ningún momento', points: 3 }, { text: 'Lo miré solo una vez de reojo', points: 2 }, { text: 'Miré la hora con angustia', points: 0 }] },
      { id: 603, question: '¿Sentiste mayor claridad mental al despertar?', options: [{ text: 'Muy despejada y descansada', points: 3 }, { text: 'Bastante bien', points: 2 }, { text: 'Aún con algo de cansancio', points: 1 }] },
    ],
  },
  {
    dayNumber: 7,
    title: 'Integración del Ritual Nocturno & Entrega del Informe',
    subtitle: 'Consolidación de tu protocolo permanente y descarga del Informe Integral en PDF.',
    theme: 'Maestría del Descanso',
    tagline: 'Has reconectado con el poder natural de tu mente para descansar.',
    iconName: 'Crown',
    objective: 'Consolidar los 7 pilares en un ritual automático y personalizado para el resto de tu vida, desbloqueando el Ecosistema Premium y tu Informe PDF.',
    somaticTechnique: {
      name: 'El Ritual Sagrado de los 3 Bloques D.U.E.R.M.E.™',
      instructions: [
        'Bloque 1 (60 min antes): Vaciado mental en papel + infusión tibia con magnesio.',
        'Bloque 2 (30 min antes): Santuario oscuro, temperatura fresca (18°C) y ducha templada.',
        'Bloque 3 (En cama): Respiración 4-7-8 + Frecuencia Delta + Anclaje hipnagógico.',
        'Descarga tu Informe Integral de 7 Días en PDF para tener tu guía siempre a mano.',
      ],
      recommendedTime: 'Ritual diario permanente',
    },
    cognitiveReframe: {
      myth: 'Tengo que ser perfecta con todos los hábitos o volveré a tener insomnio.',
      truth: 'La neuroplasticidad ya se ha activado. Tu cuerpo ahora recuerda cómo descansar. Si tienes una mala noche ocasional, tu protocolo es tu ancla segura de retorno.',
      affirmation: 'Merezco descansar profundamente cada noche. Mi sueño es mi mayor fuente de vitalidad y amor propio.',
    },
    soundTherapyPreset: {
      id: 'preset_solfeggio_528',
      name: 'Frecuencia Solfeggio 528 Hz',
      frequencyHz: 528,
      description: 'Sello de gratitud, coherencia y transformación permanente.',
    },
    hypnagogicAnchor: 'Soy dueña de mi descanso; mi mente y mi cuerpo viven en armonía.',
    tasks: [
      { id: 'd7_t1', title: 'Ejecutar el Ritual de los 3 Bloques', description: 'Aplica el protocolo completo de desconexión somática.', durationMinutes: 45, completed: false },
      { id: 'd7_t2', title: 'Descargar el Informe Integral D.U.E.R.M.E.™ en PDF', description: 'Guarda tu diagnóstico, gráficos y recomendaciones de Clara Luz.', durationMinutes: 5, completed: false },
      { id: 'd7_t3', title: 'Celebrar tu compromiso con tu salud mental', description: 'Reconoce el amor y respeto con el que has cuidado de ti.', durationMinutes: 5, completed: false },
    ],
    dailyQuestions: [
      { id: 701, question: '¿Cómo evalúas tu transformación en estos 7 días?', options: [{ text: 'Extraordinaria, siento que recuperé el control de mi descanso', points: 3 }, { text: 'Muy positiva, tengo herramientas claras', points: 2 }, { text: 'En proceso, necesito seguir practicando', points: 1 }] },
      { id: 702, question: '¿Cuál de las herramientas te resultó más transformadora?', options: [{ text: 'La respiración 4-7-8 y relajación somática', points: 3 }, { text: 'Las frecuencias binaurales Delta y Theta', points: 3 }, { text: 'La higiene lumínica y santuario fresco', points: 3 }] },
      { id: 703, question: '¿Te sientes lista para mantener este ritual en el tiempo?', options: [{ text: 'Totalmente comprometida con mi bienestar', points: 3 }, { text: 'Sí, poco a poco', points: 2 }, { text: 'Con dudas pero motivada', points: 1 }] },
    ],
  },
];
