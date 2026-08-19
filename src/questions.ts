import { QuizQuestion, DayPlan, SoundPreset, ScanDiagnosis, QuizAnswers } from './types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1_latency',
    category: 'insomnia',
    title: '¿Cuánto tiempo tardas habitualmente en quedarte dormida una vez en la cama?',
    subtitle: 'La latencia del sueño refleja la hiperactivación del sistema nervioso simpático.',
    options: [
      { id: 'q1_opt1', text: 'Menos de 15 minutos (Entro en sueño sin esfuerzo)', score: 0, category: 'latency' },
      { id: 'q1_opt2', text: 'Entre 20 y 45 minutos (Dando vueltas o revisando pendientes)', score: 1, category: 'latency' },
      { id: 'q1_opt3', text: 'Entre 45 y 90 minutos (Rumiación mental activa y ansiedad)', score: 2, category: 'latency' },
      { id: 'q1_opt4', text: 'Más de 90 minutos o paso noches enteras en vela', score: 3, category: 'latency' },
    ],
  },
  {
    id: 'q2_maintenance',
    category: 'insomnia',
    title: '¿Con qué frecuencia te despiertas a medianoche o en la madrugada (2:00 - 4:00 AM)?',
    subtitle: 'Los microdespertares fragmentan las fases de sueño profundo NREM3 y REM.',
    options: [
      { id: 'q2_opt1', text: 'Rara vez o duermo de corrido', score: 0, category: 'maintenance' },
      { id: 'q2_opt2', text: '1 vez por noche y me vuelvo a dormir en pocos minutos', score: 1, category: 'maintenance' },
      { id: 'q2_opt3', text: '2 a 3 veces, con taquicardia leve o mente encendida', score: 2, category: 'maintenance' },
      { id: 'q2_opt4', text: 'Despertares continuos; quedo despierta horas sin poder conciliar', score: 3, category: 'maintenance' },
    ],
  },
  {
    id: 'q3_cognitive_load',
    category: 'cognitive',
    title: 'Cuando apoyas la cabeza en la almohada, ¿qué ocurre en tu mente?',
    subtitle: 'El freno cognitivo es indispensable para la transición de ondas Beta a Alfa/Theta.',
    options: [
      { id: 'q3_opt1', text: 'Siento calma, gratitud y sensación de entrega corporal', score: 0, category: 'cognitive_load' },
      { id: 'q3_opt2', text: 'Repaso mental del día siguiente o pendientes domésticos/laborales', score: 1, category: 'cognitive_load' },
      { id: 'q3_opt3', text: 'Pensamientos en bucle, preocupaciones económicas o familiares', score: 2, category: 'cognitive_load' },
      { id: 'q3_opt4', text: 'Hiperalerta total: el cuerpo quiere dormir pero el cerebro sigue en alarma', score: 3, category: 'cognitive_load' },
    ],
  },
  {
    id: 'q4_somatic',
    category: 'somatic',
    title: '¿Identificas tensiones corporales o contracturas al acostarte?',
    subtitle: 'El tono muscular elevado impide la activación del nervio vago y la relajación visceral.',
    options: [
      { id: 'q4_opt1', text: 'Cuerpo relajado, respiración diafragmática fluida', score: 0, category: 'somatic_tension' },
      { id: 'q4_opt2', text: 'Ligera tensión en cuello, hombros o mandíbula (bruxismo leve)', score: 1, category: 'somatic_tension' },
      { id: 'q4_opt3', text: 'Mandíbula apretada, pecho comprimido o respiración corta', score: 2, category: 'somatic_tension' },
      { id: 'q4_opt4', text: 'Rigidez somática severa, inquietud en piernas o palpitaciones', score: 3, category: 'somatic_tension' },
    ],
  },
  {
    id: 'q5_circadian',
    category: 'circadian',
    title: '¿Cómo es tu exposición a pantallas y luces artificiales en las 2 horas previas a dormir?',
    subtitle: 'La luz azul inhibe la secreción natural de melatonina por la glándula pineal.',
    options: [
      { id: 'q5_opt1', text: 'Apago pantallas 1-2h antes y uso luz tenue cálida', score: 0, category: 'circadian' },
      { id: 'q5_opt2', text: 'Miro el móvil o TV hasta 30 minutos antes con filtro nocturno', score: 1, category: 'circadian' },
      { id: 'q5_opt3', text: 'Uso celular en la cama hasta el momento de cerrar los ojos', score: 2, category: 'circadian' },
      { id: 'q5_opt4', text: 'Trabajo o respondo mensajes en la cama con iluminación intensa', score: 3, category: 'circadian' },
    ],
  },
  {
    id: 'q6_morning_fatigue',
    category: 'insomnia',
    title: 'Al despertar por la mañana, ¿cómo sientes tu nivel de energía y claridad mental?',
    subtitle: 'La sensación de no haber descansado es el principal síntoma del sueño no reparador.',
    options: [
      { id: 'q6_opt1', text: 'Totalmente renovada, descansada y con energía vital', score: 0, category: 'maintenance' },
      { id: 'q6_opt2', text: 'Tardo 15-30 minutos en despejarme pero luego funciono bien', score: 1, category: 'maintenance' },
      { id: 'q6_opt3', text: 'Siento como si no hubiera dormido; pesadez corporal y niebla mental', score: 2, category: 'maintenance' },
      { id: 'q6_opt4', text: 'Agotamiento crónico; dependo de café excesivo y sufro altibajos de ánimo', score: 3, category: 'maintenance' },
    ],
  },
];

export const SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'preset_delta_15',
    name: 'Ondas Delta 1.5 Hz',
    subtitle: 'Sueño Profundo & Regeneración Celular',
    description: 'Frecuencia binaural pura que estimula las ondas cerebrales más lentas, asociadas a la liberación de hormona del crecimiento y descanso reparador NREM.',
    type: 'delta',
    carrierFreq: 216,
    beatFreq: 1.5,
    icon: 'Moon',
    recommendedDuration: '45 - 60 min',
    color: 'from-blue-600 to-indigo-900',
  },
  {
    id: 'preset_theta_45',
    name: 'Ondas Theta 4.5 Hz',
    subtitle: 'Relajación Hipnagógica & Desconexión Mental',
    description: 'Frecuencia puente entre la vigilia y el sueño profundo. Ideal para silenciar la rumiación cognitiva, pensamientos acelerados y estrés diario.',
    type: 'theta',
    carrierFreq: 210,
    beatFreq: 4.5,
    icon: 'Sparkles',
    recommendedDuration: '30 - 45 min',
    color: 'from-cyan-600 to-blue-900',
  },
  {
    id: 'preset_pink_noise',
    name: 'Ruido Rosa Terapéutico',
    subtitle: 'Estabilizador Circadiano & Aislamiento Acústico',
    description: 'Espectro acústico equilibrado en 1/f que ralentiza la actividad cortical y sincroniza los husos de sueño profundo sin sobresaltos.',
    type: 'pink',
    carrierFreq: 0,
    beatFreq: 0,
    icon: 'Waves',
    recommendedDuration: 'Toda la noche',
    color: 'from-rose-500/80 to-purple-900',
  },
  {
    id: 'preset_soft_rain',
    name: 'Lluvia Serena & Océano Nocturno',
    subtitle: 'Anclaje Somático y Enmascaramiento',
    description: 'Sonido continuo sintetizado de lluvia suave sobre follaje, activador natural del sistema parasimpático para soltar la hipervigilancia.',
    type: 'rain',
    carrierFreq: 0,
    beatFreq: 0,
    icon: 'CloudRain',
    recommendedDuration: '30 - 60 min',
    color: 'from-teal-600 to-slate-900',
  },
  {
    id: 'preset_solfeggio_528',
    name: 'Frecuencia 528 Hz Reparadora',
    subtitle: 'Armonización Biológica y Calma Emocional',
    description: 'Tono puro milenario de transformación y calma visceral profunda, ideal para la transición de la cena al santuario del sueño.',
    type: 'solfeggio',
    carrierFreq: 528,
    beatFreq: 2.0,
    icon: 'HeartHandshake',
    recommendedDuration: '20 - 30 min',
    color: 'from-amber-600 to-indigo-950',
  },
];

export const SEVEN_DAYS_ROADMAP: DayPlan[] = [
  {
    dayNumber: 1,
    title: 'Descompresión Mental y Freno Cognitivo',
    subtitle: 'Desactivar la rumiación nocturna y el modo alerta',
    tagline: 'Día 1: Tu mente no necesita resolver el futuro esta noche.',
    theme: 'Cognitivo y Descarga Mental',
    iconName: 'BrainCircuit',
    objective: 'Establecer el protocolo de vaciado mental "Brain Dump" y reducir el cortisol vespertino mediante desaceleración de estímulos.',
    somaticTechnique: {
      name: 'Vaciado Mental Guiado (Técnica del Cuaderno Centinela)',
      instructions: [
        'Coloca un cuaderno y bolígrafo fuera del dormitorio o junto a la lámpara tenue.',
        'Durante 7 minutos escribe TODO lo que tu mente intenta recordar: pendientes, miedos, ideas.',
        'Cierra el cuaderno con la frase de anclaje: "Todo esto queda guardado; mi descanso es prioridad absoluta."',
        'Realiza 5 respiraciones profundas inhalando en 4 segundos y exhalando en 6 segundos con suspiro sonoro.',
      ],
      recommendedTime: '30 a 45 minutos antes de acostarte',
    },
    cognitiveReframe: {
      myth: 'Si no planifico todo en mi cabeza ahora, mañana será un caos.',
      truth: 'Un cerebro agotado toma peores decisiones. Dormir es la mejor inversión de productividad para mañana.',
      affirmation: 'Suelto el control de este día. Mi única tarea ahora es permitir que mi cuerpo se regenere.',
    },
    soundTherapyPreset: {
      id: 'preset_theta_45',
      name: 'Ondas Theta 4.5 Hz',
      frequencyHz: 4.5,
      description: 'Ideal para inducir el estado de calma y desconectar los circuitos de rumiación ejecutiva.',
      type: 'binaural_theta',
    },
    tasks: [
      { id: 'd1_t1', title: 'Ejecutar el Vaciado Mental de 7 minutos', description: 'Escribir pendientes en papel para liberar la memoria de trabajo.', category: 'cognitive', durationMinutes: 7, completed: false },
      { id: 'd1_t2', title: 'Filtro de luz azul y luces cálidas', description: 'Bajar intensidad lumínica en casa a partir de las 20:30h.', category: 'circadian', durationMinutes: 5, completed: false },
      { id: 'd1_t3', title: 'Sesión de Ondas Theta de 20 minutos', description: 'Escuchar la frecuencia con auriculares en postura de reposo.', category: 'sound', durationMinutes: 20, completed: false },
    ],
    hypnagogicAnchor: 'Inhalo serenidad, exhalo el peso del día.',
  },
  {
    dayNumber: 2,
    title: 'Santuario del Sueño y Ritmo Circadiano',
    subtitle: 'Alineación ambiental: temperatura, oscuridad y estímulos',
    tagline: 'Día 2: Tu habitación es un templo de recuperación, no una oficina.',
    theme: 'Higiene del Entorno y Melatonina',
    iconName: 'ShieldMoon',
    objective: 'Transformar el dormitorio en un espacio hiperfavorable para la liberación masiva de melatonina y la caída térmica corporal.',
    somaticTechnique: {
      name: 'Protocolo de Termorregulación y Oscuridad Total',
      instructions: [
        'Ajusta la temperatura de tu habitación entre 18°C y 20°C (el cuerpo necesita enfriarse para entrar en NREM3).',
        'Elimina cualquier LED luminoso visible (cintas adhesivas oscuras o antifaz de seda).',
        'Date un baño templado de 10 minutos 60 minutos antes de dormir: la vasodilatación enfriará tu núcleo corporal.',
        'Deja el teléfono cargando a más de 2 metros de distancia de la cama.',
      ],
      recommendedTime: '1 hora antes de dormir',
    },
    cognitiveReframe: {
      myth: 'Mi cama es donde puedo revisar redes sociales hasta que me dé sueño.',
      truth: 'El condicionamiento estímulo-respuesta debe asociar la cama exclusivamente al descanso y la intimidad.',
      affirmation: 'Este espacio es seguro, oscuro y protector. Aquí nada puede exigirme nada.',
    },
    soundTherapyPreset: {
      id: 'preset_pink_noise',
      name: 'Ruido Rosa Terapéutico',
      frequencyHz: 0,
      description: 'Enmascara ruidos súbitos de la casa y estabiliza las ondas lentas durante toda la noche.',
      type: 'pink_noise',
    },
    tasks: [
      { id: 'd2_t1', title: 'Auditoría de Luz y LEDs en la habitación', description: 'Tapar fuentes de luz artificial y asegurar oscuridad.', category: 'circadian', durationMinutes: 10, completed: false },
      { id: 'd2_t2', title: 'Ajuste de Temperatura (18-20°C)', description: 'Ventilar la habitación o refrescar sábanas.', category: 'circadian', durationMinutes: 5, completed: false },
      { id: 'd2_t3', title: 'Baño templado o lavado de pies tibio', description: 'Activar vasodilatación periférica para acelerar el sueño.', category: 'somatic', durationMinutes: 12, completed: false },
    ],
    hypnagogicAnchor: 'Mi cuerpo se enfría, mi mente se aquieta, el descanso me acoge.',
  },
  {
    dayNumber: 3,
    title: 'Protocolo Respiratorio 4-7-8 y Nervio Vago',
    subtitle: 'Activación inmediata del freno parasimpático',
    tagline: 'Día 3: El pulso cardíaco responde directamente a tu exhalación.',
    theme: 'Fisiología Respiratoria Somática',
    iconName: 'Wind',
    objective: 'Dominar la técnica respiratoria 4-7-8 para desacelerar la frecuencia cardíaca y modular la variabilidad del ritmo (HRV).',
    somaticTechnique: {
      name: 'Respiración de Desconexión 4-7-8',
      instructions: [
        'Coloca la punta de la lengua en el paladar, justo detrás de los dientes superiores.',
        'Inhala silenciosamente por la nariz durante 4 segundos.',
        'Retén el aire en los pulmones con calma durante 7 segundos.',
        'Exhala completamente por la boca haciendo un suave sonido de "whoosh" durante 8 segundos.',
        'Completa exactamente 4 ciclos seguidos sin forzar.',
      ],
      recommendedTime: 'Justo al acostarte en la cama',
    },
    cognitiveReframe: {
      myth: 'Si no me duermo en 10 minutos me voy a desesperar.',
      truth: 'El objetivo inicial no es forzar el sueño, sino disfrutar del descanso muscular. El descanso pasivo ya repara.',
      affirmation: 'Cada exhalación disuelve la tensión acumulada. Mi corazón late en perfecta calma.',
    },
    soundTherapyPreset: {
      id: 'preset_delta_15',
      name: 'Ondas Delta 1.5 Hz',
      frequencyHz: 1.5,
      description: 'Sincroniza el cerebro con el ritmo del sueño más profundo y reparador.',
      type: 'binaural_delta',
    },
    tasks: [
      { id: 'd3_t1', title: 'Práctica vespertina de respiración 4-7-8', description: 'Hacer 4 ciclos a las 18:00h para cortar el estrés del día.', category: 'somatic', durationMinutes: 5, completed: false },
      { id: 'd3_t2', title: '4 ciclos de respiración 4-7-8 en cama', description: 'Realizar la técnica con los ojos cerrados antes de apagar la luz.', category: 'somatic', durationMinutes: 6, completed: false },
      { id: 'd3_t3', title: 'Reproducción Delta 1.5 Hz con temporizador', description: 'Programar 30 minutos de ondas Delta para acompañar el sueño.', category: 'sound', durationMinutes: 30, completed: false },
    ],
    hypnagogicAnchor: 'Inhalo paz, retengo confianza, exhalo todo lo demás.',
  },
  {
    dayNumber: 4,
    title: 'Liberación Somática y Desbloqueo Muscular',
    subtitle: 'Relajación Progresiva de Jacobson adaptada al descanso',
    tagline: 'Día 4: No puedes pedirle a la mente que duerma si el músculo sigue en guardia.',
    theme: 'Desactivación Muscular Profunda',
    iconName: 'Activity',
    objective: 'Reconocer y soltar microtensiones invisibles en rostro, cuello, trapecios, diafragma y pelvis.',
    somaticTechnique: {
      name: 'Escaneo Corporal y Despresurización Somática',
      instructions: [
        'Acuéstate boca arriba con las palmas abiertas hacia el techo.',
        'Tensa conscientemente los pies durante 5 segundos y luego suelta con un suspiro.',
        'Asciende por pantorrillas, muslos, glúteos y abdomen: tensa suavemente y suelta el triple.',
        'Presta especial atención a la mandíbula: separa los dientes, deja caer la lengua y relaja el entrecejo.',
        'Siente cómo el colchón sostiene el 100% de tu peso corporal sin que tú tengas que sostenerte.',
      ],
      recommendedTime: 'En cama, 15 minutos antes de dormir',
    },
    cognitiveReframe: {
      myth: 'Tengo que mantenerme alerta por si pasa algo.',
      truth: 'Tu hogar está seguro. Tu mayor fuerza surge de una noche de entrega corporal completa.',
      affirmation: 'Entrego todo mi peso a la gravedad. La tierra me sostiene; yo descanso.',
    },
    soundTherapyPreset: {
      id: 'preset_soft_rain',
      name: 'Lluvia Serena & Océano',
      frequencyHz: 0,
      description: 'Crea un paisaje sonoro inmersivo que anula la hipervigilancia auditiva.',
      type: 'rain_noise',
    },
    tasks: [
      { id: 'd4_t1', title: 'Estiramientos suaves de cuello y espalda', description: '5 minutos de rotaciones y apertura de pecho en el suelo o cama.', category: 'somatic', durationMinutes: 5, completed: false },
      { id: 'd4_t2', title: 'Relajación Progresiva de Jacobson completa', description: 'Recorrer el cuerpo de pies a cabeza soltando tensiones.', category: 'somatic', durationMinutes: 12, completed: false },
      { id: 'd4_t3', title: 'Anclaje de mandíbula suelta', description: 'Colocar la lengua en el piso de la boca y relajar maseteros.', category: 'somatic', durationMinutes: 3, completed: false },
    ],
    hypnagogicAnchor: 'Músculos pesados, mente liviana, noche serena.',
  },
  {
    dayNumber: 5,
    title: 'Arquitectura de la Cena y Termorregulación',
    subtitle: 'Bioquímica del descanso: triptófano, magnesio y digestión',
    tagline: 'Día 5: Tu estómago es el segundo cerebro de tu reloj circadiano.',
    theme: 'Nutrición del Sueño y Ritmos Digestivos',
    iconName: 'UtensilsCrossed',
    objective: 'Optimizar la última comida del día para evitar picos de insulina, reflujo y despertares a las 3:00 AM por carga hepática.',
    somaticTechnique: {
      name: 'Cena Ligera Circadiana & Infusión de Magnesio',
      instructions: [
        'Cena al menos 2.5 a 3 horas antes de acostarte para completar el vaciado gástrico.',
        'Incluye alimentos ricos en triptófano (semillas de calabaza, plátano, avena, huevos o frutos secos) y carbohidratos complejos de bajo índice glucémico.',
        'Evita alcohol (fragmenta el sueño REM) y cafeína después de las 14:00h.',
        'Toma una infusión tibia de manzanilla, pasiflora o glicinato de magnesio 45 min antes de dormir.',
      ],
      recommendedTime: 'Cena a las 20:00h - Infusión a las 21:30h',
    },
    cognitiveReframe: {
      myth: 'Una copa de vino me ayuda a dormir más rápido.',
      truth: 'El alcohol seda pero destruye la arquitectura del sueño profundo y provoca deshidratación y taquicardias en la madrugada.',
      affirmation: 'Nutro mi cuerpo con suavidad. Mi digestión reposa para que mi cerebro se repare.',
    },
    soundTherapyPreset: {
      id: 'preset_solfeggio_528',
      name: 'Frecuencia 528 Hz Reparadora',
      frequencyHz: 528,
      description: 'Acompaña el momento de la infusión vespertina con armonía vibratoria.',
      type: 'solfeggio_528',
    },
    tasks: [
      { id: 'd5_t1', title: 'Cenar al menos 2.5h antes de dormir', description: 'Cena liviana, tibia y sin ultraprocesados ni fritos.', category: 'circadian', durationMinutes: 30, completed: false },
      { id: 'd5_t2', title: 'Cero cafeína tras las 14:00h y cero alcohol', description: 'Cuidar los receptores de adenosina en el cerebro.', category: 'circadian', durationMinutes: 1, completed: false },
      { id: 'd5_t3', title: 'Ritual de infusión tibia con frecuencia 528Hz', description: 'Disfrutar del calor de la taza sin pantallas encendidas.', category: 'sound', durationMinutes: 15, completed: false },
    ],
    hypnagogicAnchor: 'Mi cuerpo digiere en calma, mis células se renuevan en el silencio.',
  },
  {
    dayNumber: 6,
    title: 'Programación Mental Hipnagógica',
    subtitle: 'El umbral del sueño: autosugestión y visualización serena',
    tagline: 'Día 6: Los últimos 5 minutos antes de dormir programan tu mente subconsciente.',
    theme: 'Neuroplasticidad y Visualización Guiada',
    iconName: 'Eye',
    objective: 'Aprovechar la ventana hipnagógica (ondas Alfa-Theta) para implantar sensaciones de seguridad y recuperación profunda.',
    somaticTechnique: {
      name: 'Visualización del Lago de Cristal y Niebla Cálida',
      instructions: [
        'Con los ojos cerrados, visualiza un lago de aguas cristalinas al anochecer, perfectamente inmóvil.',
        'Observa cómo el cielo se llena de estrellas tenues y el reflejo del agua refleja calma infinita.',
        'Siente una niebla cálida y protectora que cubre tus pies, tus piernas, tu pecho y tu rostro.',
        'Permite que cualquier pensamiento que surja se disuelva como una gota en el agua quieta.',
      ],
      recommendedTime: 'En cama, con los ojos cerrados',
    },
    cognitiveReframe: {
      myth: 'Mi insomnio es parte de mi personalidad; siempre he sido así.',
      truth: 'Tu cerebro tiene neuroplasticidad infinita. El descanso es un reflejo biológico innato que estás reentrenando con éxito.',
      affirmation: 'Mi cuerpo sabe exactamente cómo dormir. Confío en la sabiduría biológica de mi descanso.',
    },
    soundTherapyPreset: {
      id: 'preset_theta_45',
      name: 'Ondas Theta 4.5 Hz',
      frequencyHz: 4.5,
      description: 'Facilita la transición suave hacia el estado hipnagógico profundo.',
      type: 'binaural_theta',
    },
    tasks: [
      { id: 'd6_t1', title: 'Lectura física relajante de 10 minutos', description: 'Leer en papel bajo luz cálida para cansar la vista saludablemente.', category: 'cognitive', durationMinutes: 10, completed: false },
      { id: 'd6_t2', title: 'Práctica de la Visualización del Lago', description: 'Visualizar el agua quieta en sincronía con la respiración lenta.', category: 'somatic', durationMinutes: 8, completed: false },
      { id: 'd6_t3', title: 'Audio Theta en bucle suave', description: 'Dejar el audio con volumen sutil hasta conciliar el sueño.', category: 'sound', durationMinutes: 30, completed: false },
    ],
    hypnagogicAnchor: 'Me fundo en la quietud. Todo está bien en este momento.',
  },
  {
    dayNumber: 7,
    title: 'Anclaje de Sueño Profundo y Rutina Definitiva',
    subtitle: 'Consolidación de tu protocolo maestro de descanso',
    tagline: 'Día 7: Has reconstruido tu relación con la noche. El descanso es tu superpoder.',
    theme: 'Consolidación y Maestría Circadiana',
    iconName: 'Crown',
    objective: 'Sellar tu rutina personalizada de 3 pasos para mantener la higiene de sueño de forma permanente y natural.',
    somaticTechnique: {
      name: 'El Anclaje Somático Maestro (Gesto de la Calma)',
      instructions: [
        'Junta suavemente la yema de tu pulgar con tu dedo índice mientras respiras hondo.',
        'Asocia este microgesto a la sensación de pesadez agradable y calidez en todo tu cuerpo.',
        'Repasa mentalmente tu nueva rutina de 3 pasos: Vaciado Mental -> Santuario Oscuro -> Respiración 4-7-8.',
        'Agradece a tu cuerpo por su capacidad de sanar, reparar tejidos y renovar tu energía vital.',
      ],
      recommendedTime: 'Antes de dormir y al despertar',
    },
    cognitiveReframe: {
      myth: 'Si una noche duermo mal, habré perdido todo mi progreso.',
      truth: 'Una noche difícil es solo una ola transitoria; tienes las herramientas científicas para retomar tu ritmo siempre.',
      affirmation: 'Soy dueña de mi descanso. Mi mente está en paz, mi cuerpo está en reposo.',
    },
    soundTherapyPreset: {
      id: 'preset_delta_15',
      name: 'Ondas Delta 1.5 Hz',
      frequencyHz: 1.5,
      description: 'El anclaje acústico definitivo para consolidar el sueño profundo reparador.',
      type: 'binaural_delta',
    },
    tasks: [
      { id: 'd7_t1', title: 'Configurar tu alarma matutina inteligente', description: 'Fijar hora constante de despertar los 7 días de la semana.', category: 'circadian', durationMinutes: 5, completed: false },
      { id: 'd7_t2', title: 'Ejecutar el Ritual Maestro de 3 Pasos', description: 'Vaciado mental + Respiración 4-7-8 + Ondas binaurales.', category: 'somatic', durationMinutes: 25, completed: false },
      { id: 'd7_t3', title: 'Solicitar Evaluación Somática Final a Clara Luz', description: 'Registrar tu reflexión de los 7 días para recibir tu informe.', category: 'cognitive', durationMinutes: 10, completed: false },
    ],
    hypnagogicAnchor: 'Descanso profundo, despertar radiante. Soy paz, soy salud, soy energía.',
  },
];

export function calculateDiagnosis(answers: QuizAnswers): ScanDiagnosis {
  let totalScore = 0;
  const maxScore = QUIZ_QUESTIONS.length * 3; // 18 max
  let latencyScore = 0;
  let maintenanceScore = 0;
  let cognitiveScore = 0;
  let somaticScore = 0;
  let circadianScore = 0;

  Object.entries(answers).forEach(([qId, ans]) => {
    totalScore += ans.score;
    if (qId.includes('latency')) latencyScore += ans.score;
    if (qId.includes('maintenance')) maintenanceScore += ans.score;
    if (qId.includes('cognitive')) cognitiveScore += ans.score;
    if (qId.includes('somatic')) somaticScore += ans.score;
    if (qId.includes('circadian')) circadianScore += ans.score;
  });

  const percentage = Math.round((totalScore / maxScore) * 100);

  let insomniaLevel: 'Leve' | 'Moderado' | 'Severo' | 'Crítico' = 'Leve';
  let sleepDebtHours = 1.5;
  let primaryChronotypeIssue = 'Desajuste de fase de inicio (Latencia prolongada)';
  let recommendedFrequency: 'Delta 1.5Hz' | 'Theta 4.5Hz' | 'Ruido Rosa / Océano' = 'Theta 4.5Hz';
  let keyVulnerability = 'Hiperactivación cognitiva vespertina';
  let summaryMessage = 'Presentas desajustes leves que responden rápidamente al ordenamiento de estímulos.';
  let personalizedRoadmapFocus = 'Freno cognitivo y protocolo respiratorio nocturno';

  if (totalScore >= 14) {
    insomniaLevel = 'Crítico';
    sleepDebtHours = 4.5;
    primaryChronotypeIssue = 'Insomnio mixto con hipervigilancia somática y fragmentación circadiana severa';
    recommendedFrequency = 'Delta 1.5Hz';
    keyVulnerability = 'Sistema simpático en alerta permanente con inhibición de melatonina y fatiga suprarrenal';
    summaryMessage = 'Tu sistema nervioso se encuentra en estado de alarma sostenida. Es urgente desacelerar el bucle de rumiación y reinstaurar la química del descanso.';
    personalizedRoadmapFocus = 'Desbloqueo vagal, desensibilización de pantallas y frecuencias Delta';
  } else if (totalScore >= 9) {
    insomniaLevel = 'Severo';
    sleepDebtHours = 3.0;
    primaryChronotypeIssue = 'Despertares nocturnos recurrentes y rumiación hipnagógica';
    recommendedFrequency = 'Delta 1.5Hz';
    keyVulnerability = 'Tensión neuromuscular y picos de cortisol en la madrugada (2:00 - 4:00 AM)';
    summaryMessage = 'El sueño no está cumpliendo su función reparadora; te levantas con pesadez y sensación de agotamiento continuo.';
    personalizedRoadmapFocus = 'Relajación progresiva de Jacobson y freno de rumiación con técnica Brain Dump';
  } else if (totalScore >= 5) {
    insomniaLevel = 'Moderado';
    sleepDebtHours = 2.0;
    primaryChronotypeIssue = 'Latencia elevada y exposición excesiva a luz azul antes de dormir';
    recommendedFrequency = 'Theta 4.5Hz';
    keyVulnerability = 'Dificultad para apagar el tren de pensamientos al tocar la almohada';
    summaryMessage = 'Tu cuerpo quiere dormir pero tu cerebro tarda demasiado en cambiar de frecuencia Beta a Theta.';
    personalizedRoadmapFocus = 'Santuario del sueño, protocolo 4-7-8 y anclaje de ondas Theta';
  }

  return {
    totalScore,
    maxScore,
    percentage,
    insomniaLevel,
    sleepDebtHours,
    primaryChronotypeIssue,
    keyVulnerability,
    recommendedFrequency,
    summaryMessage,
    personalizedRoadmapFocus,
  };
}
