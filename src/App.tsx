import { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  BookOpen,
  Users,
  Building2,
  Handshake,
  TrendingUp,
  FileText,
  Award,
  Star,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Cpu,
  Wrench,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Hook para contador animado
function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { ref, count };
}

// Hook personalizado para animaciones de scroll
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Componente wrapper para animaciones de scroll
function ScrollReveal({
  children,
  className = '',
  animation = 'fadeInUp',
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn';
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();

  const animationClasses = {
    fadeInUp: 'animate-fade-in-up',
    fadeIn: 'animate-fade-in',
    slideInLeft: 'animate-slide-in-left',
    slideInRight: 'animate-slide-in-right',
    scaleIn: 'animate-scale-in'
  };

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? animationClasses[animation] : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function StatCounter({ target, label, delay = 0 }: { target: number; label: string; delay?: number }) {
  const { ref, count } = useCountUp(target, 1500 + delay);
  return (
    <ScrollReveal animation="scaleIn" delay={delay}>
      <div ref={ref} className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-3xl font-bold text-utepsa-red mb-1">{count}+</div>
        <div className="text-sm text-utepsa-gray-light">{label}</div>
      </div>
    </ScrollReveal>
  );
}

interface ProyectoTaller {
  id: string;
  año: string;
  titulo: string;
  resumen: string;
  docentes: string;
  link?: string;
}

interface GrupoProyectos {
  id: string;
  programa: string;
  lineas: string[];
  proyectos: ProyectoTaller[];
}

function ProyectoItemCard({ proyecto }: { proyecto: ProyectoTaller }) {
  const [expandido, setExpandido] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0 py-5">
      <div className="flex items-center gap-2 mb-2">
        <Badge className="bg-utepsa-red/10 text-utepsa-red border-utepsa-red/20 text-xs">
          <Calendar className="w-3 h-3 mr-1" />
          {proyecto.año}
        </Badge>
      </div>
      <h4 className="font-semibold text-utepsa-gray-dark mb-1">{proyecto.titulo}</h4>
      <p className={`text-sm text-utepsa-gray-light leading-relaxed ${expandido ? '' : 'line-clamp-2'}`}>
        {proyecto.resumen}
      </p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
        <button
          onClick={() => setExpandido(!expandido)}
          className="text-xs font-medium text-utepsa-red hover:underline"
        >
          {expandido ? 'Ver menos' : 'Ver más'}
        </button>
        <span className="text-xs text-utepsa-gray-light">{proyecto.docentes}</span>
        {proyecto.link && (
          <a
            href={proyecto.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-utepsa-red hover:underline flex items-center"
          >
            Ver informe
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        )}
      </div>
    </div>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mostrarFormularioVinculacion, setMostrarFormularioVinculacion] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'quienes-somos', label: 'Quienes Somos', icon: <Users className="w-4 h-4" /> },
    { id: 'proyectos', label: 'Proyectos', icon: <Wrench className="w-4 h-4" /> },
    { id: 'transferencia', label: 'Transferencia', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'socios', label: 'Socios', icon: <Handshake className="w-4 h-4" /> },
    { id: 'sumate', label: 'Súmate', icon: <Building2 className="w-4 h-4" /> },
  ];

  interface Iniciativa {
    id: string;
    titulo: string;
    descripcion: string;
    imagen: string;
  }

  // Proyectos de transferencia de tecnología, agrupados por programa/alianza
  const proyectosPorPrograma: GrupoProyectos[] = [
    {
      id: 'adapicruz',
      programa: 'ADAPICRUZ',
      lineas: ['Emprendimiento', 'Innovación Tecnología y Desarrollo', 'Educación de Calidad', 'Desarrollo Humano'],
      proyectos: [
        {
          id: 'adapicruz-1',
          año: '2025',
          titulo: 'Innovación y emprendimiento apícola',
          resumen: 'UTEPSA y la Asociación de Apicultores de Santa Cruz (ADAPICRUZ) han fortalecido el sector apícola mediante capacitaciones previas en marketing, comercialización y diversificación de productos como gomitas de miel, y actualmente buscan impulsar la innovación a través de la creación de cosméticos con valor agregado (jabones, cremas y bálsamos) capacitando a mujeres productoras en transformación de materia prima, gestión de microempresas, cálculo de costos y ventas por redes sociales para promover su autonomía económica.',
          docentes: 'Ing. Siomara D. Guzmán C.',
          link: 'https://docs.google.com/document/d/1U_wS20EifvetaVV_eHqXcBD59t03pE0v/edit?usp=sharing&ouid=108661462190112978404&rtpof=true&sd=true'
        },
        {
          id: 'adapicruz-2',
          año: '2025',
          titulo: 'Innovación y emprendimiento apícola',
          resumen: 'En convenio con ADAPICRUZ, este proyecto busca potenciar la formación práctica de los estudiantes de las materias de Química General e Inorgánica, Química Orgánica y Procesos Industriales mediante el desarrollo de productos alimenticios y de belleza innovadores a base de miel, propóleo y jalea real. Iniciado a principios de gestión, el proceso abarcó la formulación por parte de los alumnos del módulo 2 y sus posteriores reajustes con el módulo 3 hasta consolidar la presentación del producto final a la institución. De este modo, la iniciativa fortalece los conocimientos técnicos del estudiantado, genera productos de alto valor agregado y fomenta una colaboración sostenible entre la universidad y la industria apícola.',
          docentes: 'Ing. Mariela Suárez Portales'
        },
        {
          id: 'adapicruz-3',
          año: '2025',
          titulo: 'Innovación y emprendimiento apícola',
          resumen: 'En el marco del convenio interinstitucional entre UTEPSA y ADAPICRUZ, se ejecutó un proyecto colaborativo enfocado en la revalorización de productos apícolas mediante la investigación de mercado, la formulación académica de productos de valor agregado y la posterior transferencia de conocimiento a productores y mujeres apícolas. A través de capacitaciones impartidas los días 21 y 29 de julio, se enseñó la elaboración de diversos cosméticos y alimentos sostenibles (como champú, jabón líquido, crema humectante, bálsamo labial, gomitas naturales, sérum para acné, tónico facial y agua micelar de aloe), fortaleciendo el aprendizaje experiencial de los estudiantes, el vínculo universidad-sector productivo y el emprendimiento local bajo un enfoque de economía circular.',
          docentes: 'Ing. Mariela Suárez Portales'
        },
        {
          id: 'adapicruz-4',
          año: '2025',
          titulo: 'Marketing digital y estrategias de venta online para microempresarios apícolas',
          resumen: 'Como parte del Proyecto de Transferencia de Conocimiento y en coordinación con AGAPICRUZ, se realizó en La Guardia el taller "Marketing Digital y Estrategias de Venta Online para Microempresarios Apícolas", dictado por el Lic. Gustavo Porcel junto a sus estudiantes de Marketing Digital. La capacitación estuvo dirigida a productores de miel y derivados cosméticos, respiratorios y alimenticios, brindándoles herramientas teóricas y prácticas para potenciar sus negocios en plataformas como Facebook, Instagram, TikTok, WhatsApp Business, Wix, Takenos, Template.net, Flipsnack y Bio.site.',
          docentes: 'Lic. Gustavo Porcel'
        }
      ]
    },
    {
      id: 'bth',
      programa: 'BTH - Fortalecimiento BTH',
      lineas: ['Emprendimiento', 'Innovación Tecnología y Desarrollo', 'Educación de Calidad'],
      proyectos: [
        {
          id: 'bth-1',
          año: '2025',
          titulo: 'Taller de utilización de extintores en situaciones de emergencia',
          resumen: 'Con el objetivo de instruir en la respuesta ante emergencias, se llevó a cabo una capacitación sobre el uso y manejo de extintores que combinó una etapa teórica sobre los principios y tipos de fuego con una práctica guiada. Durante la actividad, tanto hombres como mujeres aprendieron a identificar y utilizar correctamente los equipos, participando activamente en la extinción de un fuego controlado con extintores de polvo químico seco de 6 kg y 12 kg.',
          docentes: 'Ing. Maria Fernanda Cuellar Salvatierra',
          link: 'https://docs.google.com/document/d/1sEKV0egvN3MqMSUfDt2XVXqwgRp_pql8/edit?usp=sharing&ouid=108661462190112978404&rtpof=true&sd=true'
        },
        {
          id: 'bth-2',
          año: '2025',
          titulo: 'Capacitación docente en proyectos de grado del BTH: enfoque metodológico y evaluativo',
          resumen: 'Realizada en el módulo Nacional La Guardia con la participación de 30 docentes, la capacitación enfocada en el «Enfoque Metodológico y Evaluativo en Proyectos de Grado del BTH» estuvo dirigida a docentes, tutores, guías y evaluadores de dichos proyectos. El objetivo principal de la jornada fue fortalecer sus competencias y capacidades para brindar un adecuado acompañamiento, orientación y evaluación en las distintas modalidades de los proyectos de grado, garantizando un desarrollo metodológico riguroso y en total conformidad con las disposiciones del Reglamento de Graduación del BTH.',
          docentes: 'Ing. José Yepez Justiniano'
        },
        {
          id: 'bth-3',
          año: '2025',
          titulo: 'Capacitación para estudiantes en proyectos de grado del BTH: enfoque metodológico y aplicativo',
          resumen: 'La capacitación «Enfoque Metodológico y Aplicativo para Estudiantes en Proyectos de Grado del BTH» se llevó a cabo en la sala auditorio E–300 de UTEPSA, contando con la participación de aproximadamente 90 estudiantes de 5to y 6to de secundaria del módulo educativo Nacional La Guardia. El evento se centró en brindar a los estudiantes elaboradores herramientas prácticas, participativas y comprensibles para diseñar, estructurar y justificar adecuadamente sus proyectos según la modalidad elegida, asegurando que su desarrollo se ajuste rigurosamente a los lineamientos establecidos en el Reglamento de Graduación del BTH.',
          docentes: 'Ing. José Yepez Justiniano'
        },
        {
          id: 'bth-4',
          año: '2025',
          titulo: 'Taller de transferencia tecnológica y capacitación técnica multidisciplinaria',
          resumen: 'Como parte del Proyecto de Transferencia de Conocimiento, se impartieron talleres prácticos y teóricos en el módulo BTH del municipio de La Guardia, dirigidos a estudiantes del bachillerato técnico humanístico. La actividad contó con la participación de las carreras de Ingeniería Industrial, Mecánica, Eléctrica y Electrónica, cuyos docentes y alumnos capacitaron en áreas clave de su especialidad: electrónica enseñó domótica y programación básica; mecánica y eléctrica abordaron normativas eléctricas y mantenimiento vehicular preventivo y correctivo; e industrial capacitó en elaboración de lácteos, uso de EPP, trazabilidad y Buenas Prácticas de Manufactura, fortaleciendo así la formación técnica e inocuidad laboral de los participantes.',
          docentes: 'Ing. Jaime Huallpara, Ing. Marco Alvarez, e Ing. Angelica Arias'
        }
      ]
    },
    {
      id: 'pastoral-caritas',
      programa: 'Pastoral Cáritas',
      lineas: ['Emprendimiento', 'Innovación Tecnología y Desarrollo', 'Educación de Calidad'],
      proyectos: [
        {
          id: 'caritas-1',
          año: '2025',
          titulo: 'Elaboración de productos de limpieza',
          resumen: 'En el marco del Proyecto de Transferencia de Conocimiento, se realizó un taller práctico y teórico sobre la elaboración de productos de limpieza del hogar en la parroquia San Roque, impartido por el equipo del Laboratorio de Procesos Industriales para hombres y mujeres interesados. Durante la jornada, los asistentes aprendieron la formulación precisa y el desarrollo adaptado de desinfectante de pisos, lavavajillas y desengrasante, complementando el aprendizaje con capacitación en control de calidad mediante la medición de pH, uso correcto de equipos de medición, manipulación segura de químicos y la aplicación de medidas de bioseguridad como el uso del Equipo de Protección Personal (EPP).',
          docentes: 'Ing. Angelica Maria Arias Madrid',
          link: 'https://docs.google.com/document/d/1cLbJw47mGXMmNyF8QUdRaprp7fzZj9hX/edit?usp=sharing&ouid=108661462190112978404&rtpof=true&sd=true'
        },
        {
          id: 'caritas-2',
          año: '2025',
          titulo: 'Elaboración de productos de cuidado personal y rutina skincare',
          resumen: 'Como parte del Proyecto de Transferencia de Conocimiento y bajo la iniciativa CARITAS, se impartió en la parroquia Sagrada Familia un taller teórico-práctico sobre productos de cuidado personal y rutina skincare, liderado por estudiantes de la materia de Procesos Industriales I. Dirigido a hombres y mujeres interesados, la capacitación abordó la formulación adaptada de cuatro productos (crema hidratante, mascarilla facial, bloqueador solar y bálsamo labial), complementando la enseñanza con control de calidad enfocado en la medición del pH, el manejo correcto de equipos e insumos químicos, y la aplicación estricta de normas de seguridad mediante el uso de Equipo de Protección Personal (EPP).',
          docentes: 'Ing. Siomara Guzmán C.'
        },
        {
          id: 'caritas-3',
          año: '2025',
          titulo: 'Elaboración de productos de limpieza para el hogar',
          resumen: 'En el marco del Proyecto de Transferencia de Conocimiento, el equipo del Laboratorio de Procesos Industriales impartió un taller teórico-práctico en la parroquia San Miguel Arcángel para capacitar a personas interesadas en la elaboración de productos de limpieza. Durante la jornada, los asistentes aprendieron la formulación y preparación de lavavajillas y desengrasante mediante guías adaptables a sus necesidades, recibiendo además instrucción técnica sobre control de calidad con medición de pH, manejo adecuado de equipos e insumos químicos, y la aplicación indispensable de medidas de bioseguridad como el uso de Equipo de Protección Personal (EPP).',
          docentes: 'Ing. Angelica Maria Arias Madrid'
        },
        {
          id: 'caritas-4',
          año: '2025',
          titulo: 'Elaboración de néctares de fruta en versión artesanal e industrial',
          resumen: 'En el marco del Proyecto de Transferencia de Conocimiento y la iniciativa CARITAS, estudiantes de Química Orgánica dictaron en la parroquia Sagrada Familia un taller teórico-práctico sobre la elaboración artesanal e industrial de néctares de fruta (frutilla, manzana y piña). Dirigido a hombres y mujeres interesados, la jornada incluyó la entrega de formulaciones adaptables a distintos volúmenes, capacitación sobre el uso de aditivos alimentarios y un análisis comparativo entre ambos procesos de producción. Asimismo, se enseñaron criterios de control de calidad enfocados en la evaluación sensorial (pruebas organolépticas) y se promovió la seguridad laboral mediante el uso correcto del Equipo de Protección Personal (EPP).',
          docentes: 'Ing. Margoth Salazar'
        },
        {
          id: 'caritas-5',
          año: '2025',
          titulo: 'Taller de "Autoestima"',
          resumen: 'En la pastoral CARITAS y como parte del Proyecto de Transferencia de Conocimiento, se impartieron dos talleres dirigidos al desarrollo personal y productivo de las asistentes: uno sobre Autoestima, dictado por el área de Psicología (Lic. Victor Flores, supervisado por la Lic. Libby Alvarez) para abordar el autocuidado y la asertividad; y otro de Cosmética, guiado por la Ing. Siomara Guzmán, enfocado en la elaboración práctica de bases de cremas adaptadas a distintos tipos de piel, mascarillas y jabones en barra.',
          docentes: 'Ing. Siomara Guzmán C.'
        },
        {
          id: 'caritas-6',
          año: '2025',
          titulo: 'Elaboración de productos alimenticios',
          resumen: 'En el marco del Proyecto de Transferencia de Conocimiento, el equipo del Laboratorio de Procesos Industriales impartió un taller teórico-práctico en la parroquia Santa Lucía para capacitar a hombres y mujeres en la elaboración de derivados lácteos. Durante la jornada, los participantes aprendieron la formulación y preparación de queso gourmet, queso crema, yogurt natural y mantequilla mediante guías adaptables a sus necesidades. Además, recibieron instrucción en control de calidad con medición de pH, uso correcto de equipos y utensilios, e implementación de normas de inocuidad y Equipo de Protección Personal (EPP).',
          docentes: 'Ing. Angelica Maria Arias Madrid'
        },
        {
          id: 'caritas-7',
          año: '2025',
          titulo: 'Taller de capacitación de personas en situación de vulnerabilidad',
          resumen: 'Como parte de la alianza entre la Universidad UTEPSA y la Pastoral Cáritas, se implementa un proyecto de talleres solidarios dirigido a personas en situación de vulnerabilidad para impulsar su autonomía económica e ingresos mediante el emprendimiento. En sus primeras jornadas, los participantes adquirieron herramientas técnicas para la elaboración de alimentos y productos de limpieza (como detergente lavavajillas y limpia pisos), fortaleciendo la creatividad, el trabajo en equipo y el desarrollo comunitario sostenible.',
          docentes: 'Ing. Mariela Suárez Portales'
        },
        {
          id: 'caritas-8',
          año: '2025',
          titulo: 'Capacitación sobre producción de derivados lácteos y buenas prácticas de manufactura',
          resumen: 'La carrera de Ingeniería Industrial y Comercial, junto al Centro de Transferencia de Conocimiento, llevó a cabo capacitaciones en Ciudad Satélite enfocadas en la producción de derivados lácteos y Buenas Prácticas de Manufactura (BPM). En la jornada teórico-práctica, los asistentes aprendieron la elaboración de yogurt griego, queso crema gourmet y mantequilla mediante formulaciones adaptables, además de capacitarse en controles de calidad (medición de pH, densidad y prueba de alcohol), higiene e inocuidad laboral, uso de Equipo de Protección Personal (EPP), manejo correcto de utensilios y organización del espacio de trabajo bajo un sistema de trazabilidad.',
          docentes: 'Ing. Angelica Maria Arias Madrid'
        },
        {
          id: 'caritas-9',
          año: '2025',
          titulo: 'Taller de capacitación de personas en situación de vulnerabilidad',
          resumen: 'Mediante una alianza entre la Universidad UTEPSA y la Pastoral Cáritas, se desarrolla un proyecto de talleres solidarios orientados a la capacitación de personas en situación de vulnerabilidad. La iniciativa busca brindar herramientas prácticas, conocimientos y habilidades técnicas que impulsen la autogestión y el emprendimiento, promoviendo el fortalecimiento de la autonomía económica y la mejora de la calidad de vida de los participantes.',
          docentes: 'Ing. Mariela Suárez Portales'
        }
      ]
    },
    {
      id: 'mujeres-5v',
      programa: 'Mujeres 5V',
      lineas: ['Emprendimiento', 'Innovación Tecnología y Desarrollo', 'Educación de Calidad'],
      proyectos: [
        {
          id: 'mujeres5v-1',
          año: '2025',
          titulo: 'Taller de "Elaboración de Aderezos Nutritivos"',
          resumen: 'En el marco del Proyecto de Transferencia de Conocimiento, el equipo del Laboratorio de Procesos Industriales impartió un taller teórico-práctico sobre aderezos nutritivos en el municipio de Saavedra, dirigido a amas de casa. La capacitación buscó promover alternativas alimentarias saludables utilizando materias primas locales accesibles mediante la formulación precisa de cinco preparaciones: mayonesa saludable, mayonesa de ajo asado con tocino, mayonesa de maní, aderezo de palta y aderezo de zanahoria. Asimismo, se reforzó la calidad e inocuidad alimentaria priorizando aspectos clave de higiene personal, manipulación adecuada de insumos y correctas técnicas de almacenamiento y conservación.',
          docentes: 'Ing. Angelica Maria Arias Madrid',
          link: 'https://docs.google.com/document/d/1q_l6zypozX1nVS_G_u73F_22PTO4Znv7/edit?usp=sharing&ouid=108661462190112978404&rtpof=true&sd=true'
        },
        {
          id: 'mujeres5v-2',
          año: '2025',
          titulo: 'Taller de "Semillas y Legumbres y su impacto en el aprendizaje"',
          resumen: 'En el marco del Proyecto de Transferencia de Conocimiento y bajo el programa Mujeres 5V, el área de Ciencias Básicas dictó el taller «Semillas y Legumbres y su impacto en el aprendizaje» en el municipio de Saavedra, contando con la participación de 19 mujeres. La jornada tuvo como objetivo dar a conocer las propiedades nutricionales y los beneficios cognitivos de estos alimentos en la dieta diaria, además de enseñar la elaboración práctica de crackers de semillas variadas, snack de garbanzos y pudín de chía. Para garantizar la réplica de las recetas y la conservación de los productos, se entregó a cada participante un manual con proporciones detalladas e instrucciones sobre almacenamiento e inocuidad.',
          docentes: 'Ing. Mariela Suárez Portales'
        },
        {
          id: 'mujeres5v-3',
          año: '2025',
          titulo: 'Taller de "Autoestima"',
          resumen: 'En el marco del Proyecto de Transferencia de Conocimiento, se impartió el taller de «Autoestima» en la comunidad de Saavedra, dirigido a mujeres interesadas en su desarrollo personal y emocional. La jornada fue facilitada por estudiantes del semillero de la carrera de Psicología junto al Lic. Victor Flores Escalante, bajo la supervisión de la Lic. Libby Alvarez Hidalgo. Durante la sesión se trabajaron de manera teórico-práctica los conceptos de autoestima, autocuidado y asertividad, brindando a las asistentes herramientas y técnicas aplicadas para su crecimiento personal.',
          docentes: 'Ing. Libby Alvarez'
        },
        {
          id: 'mujeres5v-4',
          año: '2025',
          titulo: 'Taller de "Elaboración de helado artesanal y semiindustrial"',
          resumen: 'En la comunidad de Saavedra y en el marco del Proyecto de Transferencia de Conocimiento (programa Mujeres 5V), se realizaron dos talleres para mujeres enfocados en el emprendimiento y el bienestar personal: Helado Artesanal y Semiindustrial, donde docentes de Ciencias Básicas enseñaron técnicas de elaboración, uso de aditivos, control de calidad organoléptico, inocuidad y uso de EPP, entregando recetas adaptables para producción a distinta escala; y Autoestima, donde el equipo de Psicología (Lic. Victor Flores, supervisado por la Lic. Libby Alvarez y estudiantes del semillero) brindó herramientas prácticas sobre autocuidado, amor propio y asertividad.',
          docentes: 'Ing. Siomara Guzmán C.'
        },
        {
          id: 'mujeres5v-5',
          año: '2025',
          titulo: 'Taller de "Gomitas vitaminadas"',
          resumen: 'En el marco del Proyecto de Transferencia de Conocimiento, se impartió el taller teórico-práctico de «Gomitas Vitaminadas» en la comunidad de Saavedra, dictado por la docente de Ciencias Básicas, Ing. María García, con el apoyo de auxiliares de laboratorio. Dirigido a mujeres de la comunidad, la capacitación enseñó a formular y elaborar tres variedades nutritivas para niños: gomitas de zanahoria y remolacha, de pomelo y papaya, y de jengibre, miel, propóleo y limón. Las participantes recibieron una guía de trabajo con dosificación de aditivos y vitaminas, enfatizando aspectos clave del proceso como la precisión en el pesaje, el control de temperatura y la esterilización de envases.',
          docentes: 'Ing. María García'
        },
        {
          id: 'mujeres5v-6',
          año: '2025',
          titulo: 'Taller de "Manejo de redes sociales"',
          resumen: 'En el marco del Proyecto de Transferencia de Conocimiento, se impartió el taller de «Manejo de Redes Sociales» en la comunidad de Saavedra, dictado por el Lic. Gustavo Porcel (docente y encargado del Laboratorio de Comunicación) junto a sus estudiantes. La capacitación estuvo dirigida a mujeres de la zona interesadas en comercializar y potenciar la venta de los productos elaborados en talleres previos. Durante la jornada teórico-práctica, las participantes aprendieron el uso estratégico de plataformas como Instagram, Facebook y TikTok, así como el diseño de catálogos mediante la herramienta Canva.',
          docentes: 'Lic. Gustavo Porcel'
        },
        {
          id: 'mujeres5v-7',
          año: '2025',
          titulo: 'Taller de "La ruta legal del emprendedor" y modelo de negocio "Business Canvas"',
          resumen: 'En el marco del Proyecto de Transferencia de Conocimiento, se impartió el taller sobre «La Ruta Legal del Emprendedor» y el modelo de negocio «Business Canvas» en la comunidad de Saavedra. La capacitación fue dictada por el Dr. Adolfo Dávila (docente de Derecho) y el Lic. Pablo Tavera (Centro de Emprendimiento), junto al apoyo de estudiantes. Dirigido a mujeres interesadas en estructurar y formalizar sus proyectos, el encuentro abordó de manera teórico-práctica los pasos de la normativa legal para la formalización empresarial, así como el uso del lienzo Canvas para definir la organización del negocio, costos y público objetivo.',
          docentes: 'Lic. Adolfo Dávila'
        }
      ]
    }
  ];

  // Iniciativas de transferencia de conocimiento
  const iniciativasTransferencia: Iniciativa[] = [
    {
      id: 'higiene',
      titulo: 'Taller comunitario de elaboración de productos de higiene',
      descripcion: 'Capacitación práctica a comunidades para la elaboración de productos de limpieza e higiene de uso cotidiano.',
      imagen: '/transferencia-higiene.jpg'
    },
    {
      id: 'extintores',
      titulo: 'Capacitación en manejo de extintores',
      descripcion: 'Formación en prevención y control de incendios en conjunto con Bomberos Voluntarios Fundasol.',
      imagen: '/transferencia-extintores.jpg'
    },
    {
      id: 'calidad',
      titulo: 'Taller de control de calidad de productos',
      descripcion: 'Sesiones de análisis y control de calidad aplicadas junto a organizaciones sociales y comunitarias.',
      imagen: '/transferencia-calidad.jpg'
    },
    {
      id: 'comunitaria',
      titulo: 'Jornada de trabajo comunitario',
      descripcion: 'Actividades de trabajo conjunto con estudiantes y comunidades para el cuidado del entorno y la producción local.',
      imagen: '/transferencia-comunitaria.jpg'
    }
  ];

  interface Socio {
    id: string;
    nombre: string;
    logo: string;
  }

  interface Docente {
    id: string;
    nombre: string;
    cargo: string;
    imagen: string;
  }

  const docentesParticipantes: Docente[] = [
    { id: 'ruben-alvarez', nombre: 'Lic. Rubén Oscar Alvarez Hinojosa', cargo: 'Docente participante', imagen: '/Ruben-Alvarez.png' },
    { id: 'angelica-arias', nombre: 'Ing. Angelica Maria Arias Madrid', cargo: 'Docente participante', imagen: '/angelica-arias.jpeg' },
    { id: 'juan-estivariz', nombre: 'Ing. Juan Mauricio Estivariz del Castillo', cargo: 'Docente participante', imagen: '/juan-estivariz.png' },
    { id: 'edwin-mamani', nombre: 'MSc. Edwin Mamani Ávila', cargo: 'Docente participante', imagen: '/edwin-mamani.jpg' },
    { id: 'max-mamani', nombre: 'Ing. Max Mamani Huanca', cargo: 'Docente participante', imagen: '/max-mamani.png' },
    { id: 'mabel-mendoza', nombre: 'Ing. Mabel Patricia Mendoza Flores', cargo: 'Docente participante', imagen: '/mabel-mendoza.png' },
    { id: 'maria-montero', nombre: 'Ing. María Montero Sopeppi', cargo: 'Docente participante', imagen: '/maria-montero.png' },
    { id: 'liliana-poquechoque', nombre: 'MSc. Liliana Poquechoque Cortez', cargo: 'Docente participante', imagen: '/liliana-poquechoque.png' },
    { id: 'gustavo-porcel', nombre: 'Lic. Gustavo Porcel Vaca', cargo: 'Docente participante', imagen: '/gustavo-porcel.png' },
    { id: 'margoth-salazar', nombre: 'Ing. Margoth Salazar Suarez', cargo: 'Docente participante', imagen: '/margoth-salazar.jpeg' },
    { id: 'mariela-suarez', nombre: 'Ing. Mariela Suarez Portales', cargo: 'Docente participante', imagen: '/mariela-suarez.jpeg' },
    { id: 'jose-yepez', nombre: 'Ing. Jose Rene Yepez Justiniano', cargo: 'Docente participante', imagen: '/jose-yepez.png' },
  ];

  const socios: Socio[] = [
    { id: 'mairana', nombre: 'Gobierno Autónomo Municipal de Mairana', logo: '/socio-mairana.png' },
    { id: 'iniaf', nombre: 'INIAF - Instituto Nacional de Innovación Agropecuaria y Forestal', logo: '/socio-iniaf.png' },
    { id: 'coopappi', nombre: 'COOPAPPI', logo: '/socio-coopappi.png' },
    { id: 'ambiental', nombre: 'Programa Ambiental', logo: '/socio-ambiental.png' },
    { id: 'modulo-vallegrande', nombre: 'Módulo Tecnológico Productivo Julio Lairana Sandoval - Vallegrande', logo: '/socio-modulo-vallegrande.png' },
    { id: 'bomberos', nombre: 'Bomberos Voluntarios Fundasol', logo: '/socio-bomberos.png' },
    { id: 'pastoral-ninez', nombre: 'Pastoral de la Niñez Santa Cruz', logo: '/socio-pastoral-ninez.png' },
    { id: 'save-the-children', nombre: 'Save the Children', logo: '/socio-save-the-children.png' },
    { id: 'gam-vallegrande', nombre: 'Gobierno Autónomo Municipal de Vallegrande', logo: '/socio-gam-vallegrande.png' },
    { id: 'gam-general-saavedra', nombre: 'Gobierno Autónomo Municipal de General Saavedra', logo: '/socio-gam-general-saavedra.png' },
    { id: 'gad-santa-cruz', nombre: 'Gobierno Autónomo Departamental de Santa Cruz', logo: '/socio-gad-santa-cruz.png' },
    { id: 'caritas', nombre: 'Pastoral Social Cáritas Bolivia', logo: '/socio-caritas.png' },
    { id: 'cenvicruz', nombre: 'CENVICRUZ', logo: '/socio-cenvicruz.png' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-white">
                <img
                  src="/logo-ctct.png"
                  alt="Logo CTCT"
                  className="w-11 h-11 object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className={`font-bold text-lg leading-tight transition-colors ${isScrolled ? 'text-utepsa-gray-dark' : 'text-white'}`}>
                  CTCT
                </h1>
                <p className={`text-xs transition-colors ${isScrolled ? 'text-utepsa-gray-light' : 'text-white/80'}`}>
                  Centro de Transferencia de Conocimientos y Tecnología
                </p>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    activeSection === item.id
                      ? 'bg-utepsa-red text-white'
                      : isScrolled
                        ? 'text-utepsa-gray-dark hover:bg-utepsa-red/10 hover:text-utepsa-red'
                        : 'text-white hover:bg-white/20'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-utepsa-gray-dark' : 'text-white'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white shadow-xl border-t">
            <nav className="px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 flex items-center space-x-3 ${
                    activeSection === item.id
                      ? 'bg-utepsa-red text-white'
                      : 'text-utepsa-gray-dark hover:bg-utepsa-red/10 hover:text-utepsa-red'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section - Inicio */}
      <section id="inicio" className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            src="/hero-ctct.jpg"
            alt="Centro de Transferencia de Conocimientos y Tecnología"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-utepsa-red/90 via-utepsa-red/70 to-transparent" />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <ScrollReveal animation="fadeIn" delay={0}>
              <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Cpu className="w-3 h-3 mr-1" />
                UTEPSA - Investigación
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Centro de Transferencia
                <span className="block">de Conocimientos y Tecnología</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl">
                Impulsando proyectos académicos con aplicación en la industria y la sociedad,
                y llevando el conocimiento de la universidad a un impacto real en Santa Cruz y Bolivia.
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={300}>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => scrollToSection('proyectos')}
                  className="bg-white text-utepsa-red hover:bg-white/90 px-8 py-6 text-base font-semibold"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Ver Proyectos
                </Button>
                <Button
                  onClick={() => scrollToSection('transferencia')}
                  variant="outline"
                  className="border-2 border-white bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 hover:border-white px-8 py-6 text-base font-semibold shadow-lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Transferencia de Conocimientos
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/80 rounded-full" />
          </div>
        </div>
      </section>

      {/* Quienes Somos Section */}
      <section id="quienes-somos" className="py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal animation="slideInLeft" delay={0}>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-utepsa-gray-dark mb-6">
                  Quienes Somos
                </h2>

                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wrench className="w-5 h-5 text-utepsa-red" />
                    <h3 className="font-semibold text-utepsa-gray-dark">Transferencia de tecnología</h3>
                  </div>
                  <p className="text-utepsa-gray-light leading-relaxed">
                    Impulsar proyectos académicos con aplicación en la industria y la sociedad,
                    creando espacios de interacción y trabajo conjunto.
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-5 h-5 text-utepsa-red" />
                    <h3 className="font-semibold text-utepsa-gray-dark">Transferencia de conocimiento</h3>
                  </div>
                  <p className="text-utepsa-gray-light leading-relaxed">
                    Lograr que el conocimiento generado en la universidad tenga un impacto real en la sociedad.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <StatCounter target={13} label="Socios estratégicos" delay={100} />
                  <StatCounter target={2} label="Líneas de transferencia" delay={200} />
                  <StatCounter target={24} label="Proyectos y actividades" delay={300} />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slideInRight" delay={200}>
              <div className="relative">
                <img
                  src="/quienes-somos-ctct.jpg"
                  alt="Actividades del CTCT"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-utepsa-red text-white p-6 rounded-xl shadow-xl">
                  <Award className="w-8 h-8 mb-2" />
                  <p className="font-semibold">Excelencia en</p>
                  <p className="text-sm opacity-90">Transferencia</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Contacto responsable */}
          <div className="mt-20 max-w-4xl mx-auto">
            <ScrollReveal animation="fadeInUp" delay={0}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-utepsa-red/10">
                    <img
                      src="/siomara-guzman.jpeg"
                      alt="Ing. Siomara Daniela Guzmán Cabrera"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-utepsa-gray-dark">
                      Ing. Siomara Daniela Guzmán Cabrera
                    </h4>
                    <p className="text-sm text-utepsa-gray-light mb-3">Coordinadora del CTCT</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-utepsa-gray-light">
                      <span className="flex items-center justify-center sm:justify-start">
                        <Phone className="w-4 h-4 mr-2 text-utepsa-red" />
                        70039216
                      </span>
                      <span className="flex items-center justify-center sm:justify-start">
                        <Mail className="w-4 h-4 mr-2 text-utepsa-red" />
                        coord.cienciasbasicas@utepsa.edu
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal animation="fadeInUp" delay={100}>
              <p className="text-center text-sm font-medium text-utepsa-gray-light mt-8 mb-4">
                Docentes participantes
              </p>
            </ScrollReveal>
            <div className="grid sm:grid-cols-3 gap-4">
              {docentesParticipantes.map((docente, index) => (
                <ScrollReveal key={docente.id} animation="fadeInUp" delay={150 + index * 100}>
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 bg-utepsa-red/10">
                        <img
                          src={docente.imagen}
                          alt={docente.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-semibold text-utepsa-gray-dark text-sm mb-1">
                        {docente.nombre}
                      </h4>
                      <p className="text-xs text-utepsa-gray-light">{docente.cargo}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Proyectos Section */}
      <section id="proyectos" className="py-20 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ScrollReveal animation="fadeIn" delay={0}>
              <Badge className="mb-4 bg-utepsa-red/10 text-utepsa-red border-utepsa-red/20">
                <Wrench className="w-3 h-3 mr-1" />
                Investigación Aplicada
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <h2 className="text-3xl sm:text-4xl font-bold text-utepsa-gray-dark mb-4">
                Proyectos de Transferencia de Tecnología
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p className="text-utepsa-gray-light max-w-2xl mx-auto">
                Impulsamos proyectos académicos con aplicación directa en la industria y la sociedad,
                creando espacios de interacción y trabajo conjunto.
              </p>
            </ScrollReveal>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {proyectosPorPrograma.map((grupo, index) => (
              <ScrollReveal key={grupo.id} animation="fadeInUp" delay={100 + index * 100}>
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <h3 className="text-xl font-bold text-utepsa-gray-dark">{grupo.programa}</h3>
                      <span className="text-xs text-utepsa-gray-light">
                        {grupo.proyectos.length} proyecto{grupo.proyectos.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {grupo.lineas.map((linea) => (
                        <Badge key={linea} variant="outline" className="text-xs text-utepsa-gray-light border-gray-200 font-normal">
                          {linea}
                        </Badge>
                      ))}
                    </div>
                    <div>
                      {grupo.proyectos.map((proyecto) => (
                        <ProyectoItemCard key={proyecto.id} proyecto={proyecto} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Transferencia de Conocimientos Section */}
      <section id="transferencia" className="py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ScrollReveal animation="fadeIn" delay={0}>
              <Badge className="mb-4 bg-utepsa-red/10 text-utepsa-red border-utepsa-red/20">
                <BookOpen className="w-3 h-3 mr-1" />
                Impacto Social
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <h2 className="text-3xl sm:text-4xl font-bold text-utepsa-gray-dark mb-4">
                Transferencia de Conocimientos
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p className="text-utepsa-gray-light max-w-2xl mx-auto">
                Lograr que el conocimiento generado en la universidad tenga un impacto real en la sociedad.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {iniciativasTransferencia.map((iniciativa, index) => (
              <ScrollReveal key={iniciativa.id} animation="fadeInUp" delay={100 + index * 100}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={iniciativa.imagen}
                      alt={iniciativa.titulo}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-utepsa-gray-dark text-sm mb-2">
                      {iniciativa.titulo}
                    </h3>
                    <p className="text-xs text-utepsa-gray-light leading-relaxed">
                      {iniciativa.descripcion}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Socios Section */}
      <section id="socios" className="py-20 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ScrollReveal animation="fadeIn" delay={0}>
              <Badge className="mb-4 bg-utepsa-red/10 text-utepsa-red border-utepsa-red/20">
                <Handshake className="w-3 h-3 mr-1" />
                Alianzas
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <h2 className="text-3xl sm:text-4xl font-bold text-utepsa-gray-dark mb-4">
                Nuestros Socios
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p className="text-utepsa-gray-light max-w-2xl mx-auto">
                Trabajamos junto a gobiernos municipales, instituciones y organizaciones que comparten
                nuestro compromiso con el desarrollo de Santa Cruz y Bolivia.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {socios.map((socio, index) => (
              <ScrollReveal key={socio.id} animation="scaleIn" delay={50 + index * 50}>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 h-28 flex items-center justify-center">
                  <img
                    src={socio.logo}
                    alt={socio.nombre}
                    title={socio.nombre}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Súmate Section */}
      <section id="sumate" className="py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ScrollReveal animation="fadeIn" delay={0}>
              <Badge className="mb-4 bg-utepsa-red/10 text-utepsa-red border-utepsa-red/20">
                <Building2 className="w-3 h-3 mr-1" />
                Vinculación Institucional
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <h2 className="text-3xl sm:text-4xl font-bold text-utepsa-gray-dark mb-4">
                Súmate al CTCT
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p className="text-utepsa-gray-light max-w-3xl mx-auto text-lg italic">
                "Impulsa proyectos de transferencia de tecnología y conocimiento respaldados por UTEPSA. Conversemos hoy"
              </p>
            </ScrollReveal>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Beneficios */}
            <ScrollReveal animation="slideInLeft" delay={0}>
              <div className="bg-utepsa-gray-dark p-8 rounded-2xl text-white">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Beneficios de la Alianza</h3>
                    <p className="text-sm text-white/70">Potencia tu institución con investigación aplicada</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {[
                    'Acceso a proyectos de transferencia de tecnología a medida',
                    'Investigación aplicada a las necesidades de tu institución o comunidad',
                    'Participación en proyectos académicos de alto impacto social',
                    'Vinculación directa con talento universitario',
                    'Posibilidad de generar proyectos colaborativos',
                    'Contacto con estudiantes para prácticas y pasantías',
                    'Networking con otras instituciones y organizaciones aliadas',
                    'Respaldado por la trayectoria académica de UTEPSA'
                  ].map((beneficio, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-utepsa-red rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-white/90 text-sm">{beneficio}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white/10 p-4 rounded-xl">
                  <p className="text-white font-semibold text-center italic">
                    "El conocimiento generado en la universidad solo tiene impacto real cuando llega a la sociedad."
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Botón para mostrar formulario */}
            <ScrollReveal animation="slideInRight" delay={200}>
              <div className="flex flex-col justify-center items-center">
              {!mostrarFormularioVinculacion ? (
                <div className="text-center">
                  <div className="w-24 h-24 bg-utepsa-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building2 className="w-12 h-12 text-utepsa-red" />
                  </div>
                  <h3 className="text-2xl font-bold text-utepsa-gray-dark mb-4">
                    ¿Listo para impulsar un proyecto conjunto?
                  </h3>
                  <p className="text-utepsa-gray-light mb-8 max-w-md">
                    Completa el formulario y nos pondremos en contacto contigo para conversar sobre cómo podemos colaborar.
                  </p>
                  <Button
                    onClick={() => setMostrarFormularioVinculacion(true)}
                    className="bg-utepsa-red hover:bg-utepsa-red/90 px-8 py-6 text-lg"
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Solicitar Vinculación
                  </Button>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-2xl w-full animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-utepsa-gray-dark">
                      Formulario de Vinculación
                    </h3>
                    <button
                      onClick={() => setMostrarFormularioVinculacion(false)}
                      className="text-utepsa-gray-light hover:text-utepsa-red"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-utepsa-gray-dark mb-1">
                        Institución / Empresa *
                      </label>
                      <Input placeholder="Nombre de tu institución o empresa" className="bg-white" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-utepsa-gray-dark mb-1">
                          Persona de contacto *
                        </label>
                        <Input placeholder="Nombre completo" className="bg-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-utepsa-gray-dark mb-1">
                          Cargo *
                        </label>
                        <Input placeholder="Ej: Responsable de Proyectos" className="bg-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-utepsa-gray-dark mb-1">
                        Correo electrónico *
                      </label>
                      <Input type="email" placeholder="correo@institucion.org" className="bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-utepsa-gray-dark mb-1">
                        Tipo de vinculación *
                      </label>
                      <div className="space-y-2">
                        {[
                          { id: 'tecnologia', label: 'Transferencia de tecnología' },
                          { id: 'conocimiento', label: 'Transferencia de conocimiento' },
                          { id: 'convenio', label: 'Convenio interinstitucional' },
                          { id: 'pasantias', label: 'Pasantías' }
                        ].map((opcion) => (
                          <label key={opcion.id} className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300 text-utepsa-red focus:ring-utepsa-red" />
                            <span className="text-sm text-utepsa-gray-dark">{opcion.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-utepsa-gray-dark mb-1">
                        Mensaje adicional
                      </label>
                      <Textarea
                        placeholder="Cuéntanos más sobre tu interés en vincularte con el CTCT..."
                        rows={3}
                        className="bg-white resize-none"
                      />
                    </div>
                    <Button className="w-full bg-utepsa-red hover:bg-utepsa-red/90 py-5">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Enviar Solicitud
                    </Button>
                  </form>
                </div>
              )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Botón flotante de WhatsApp */}
      <a
        href="https://wa.me/59170039216"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        title="Contáctanos por WhatsApp"
      >
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Footer */}
      <footer className="bg-utepsa-gray-dark text-white py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white">
                  <img
                    src="/logo-ctct.png"
                    alt="Logo CTCT"
                    className="w-9 h-9 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold">CTCT</h3>
                  <p className="text-xs text-white/60">Centro de Transferencia de Conocimientos y Tecnología</p>
                </div>
              </div>
              <p className="text-sm text-white/70">
                Generando impacto real para el desarrollo de Santa Cruz y Bolivia.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm text-white/70">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="hover:text-utepsa-red transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-utepsa-red" />
                  UTEPSA, Santa Cruz, Bolivia
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-utepsa-red" />
                  coord.cienciasbasicas@utepsa.edu
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-utepsa-red" />
                  70039216
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-white/10 my-8" />

          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-white/60">
            <p>© 2026 Centro de Transferencia de Conocimientos y Tecnología - UTEPSA. Todos los derechos reservados.</p>
            <p className="mt-2 md:mt-0">
              Universidad Tecnológica Privada de Santa Cruz
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
