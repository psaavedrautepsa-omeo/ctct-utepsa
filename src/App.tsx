import { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  BookOpen, 
  Users, 
  Newspaper, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowRight,
  BarChart3,
  TrendingUp,
  FileText,
  Award,
  Calendar,
  ExternalLink,
  Star,
  GraduationCap,
  Building2,
  Search,
  Download,
  Sparkles,
  Rocket,
  Target,
  Lightbulb,
  Heart,
  Leaf,
  Monitor,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isScrolled, setIsScrolled] = useState(false);

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
    { id: 'papers', label: 'Papers', icon: <FileText className="w-4 h-4" /> },
    { id: 'publicaciones', label: 'Publicaciones', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'noticias', label: 'Noticias', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'sumate', label: 'Súmate', icon: <Building2 className="w-4 h-4" /> },
    { id: 'club-elite', label: 'Club Élite', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  // Estado para modales
  const [paperSeleccionado, setPaperSeleccionado] = useState<Paper | null>(null);
  const [investigadorSeleccionado, setInvestigadorSeleccionado] = useState<Investigador | null>(null);
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState<typeof noticias[0] | null>(null);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState<typeof publicaciones[0] | null>(null);

  // Estados para mostrar/ocultar formularios
  const [mostrarFormularioEmpresa, setMostrarFormularioEmpresa] = useState(false);
  const [mostrarFormularioEstudiante, setMostrarFormularioEstudiante] = useState(false);

  // Estados para filtros de papers
  const [filtroAñoPaper, setFiltroAñoPaper] = useState('');
  const [filtroCategoriaPaper, setFiltroCategoriaPaper] = useState('');
  const [filtroAutorPaper, setFiltroAutorPaper] = useState('');
  const [filtroPalabrasClavePaper, setFiltroPalabrasClavePaper] = useState('');
  const [mostrarFiltrosPapers, setMostrarFiltrosPapers] = useState(false);
  const [mostrarTodasPublicaciones, setMostrarTodasPublicaciones] = useState(false);

  // Estados para filtros de publicaciones
  const [filtroLinea, setFiltroLinea] = useState('');
  const [filtroAño, setFiltroAño] = useState('');
  const [filtroAutorPublicacion, setFiltroAutorPublicacion] = useState('');

  // Interfaz para papers
  interface Paper {
    id: string;
    titulo: string;
    autores: string;
    año: string;
    categoria: string;
    resumen: string;
    enlacePDF: string;
    palabrasClave: string;
    destacado: boolean;
  }

  // Datos de papers (6 destacados del 2025 + otros ocultos)
  const papers: Paper[] = [
    {
      id: "paper-desercion",
      titulo: "Deserción universitaria en Bolivia: análisis de factores socioeconómicos, personales y académicos",
      autores: "Irene Sánchez San José, Liliana Poquechoque Cortez, Sammy Ramiro Torres Arroyo",
      año: "2026",
      categoria: "Educación de Calidad",
      resumen: "Este estudio analiza los factores que inciden en la deserción universitaria en Bolivia, abordando dimensiones socioeconómicas, personales y académicas. A partir de un enfoque cuantitativo y transversal, se identifican las principales causas que llevan a los estudiantes a abandonar sus estudios superiores. Los resultados permiten proponer estrategias de retención estudiantil y políticas institucionales orientadas a reducir la tasa de deserción en la educación universitaria boliviana.",
      enlacePDF: "https://revistas.cardenalcisneros.es/pulso/es/article/view/8818/9747",
      palabrasClave: "deserción universitaria, Bolivia, factores socioeconómicos, retención estudiantil, educación superior",
      destacado: true
    },
    {
      id: "paper-posicionamiento-marca",
      titulo: "Posicionamiento & Marca: una mirada a las Instituciones de Educación Superior [IES] en Santa Cruz de la Sierra bajo los estándares Qs Stars™",
      autores: "Pedro Cesar Saavedra Romero, Rubén Oscar Alvarez Hinojosa",
      año: "2025",
      categoria: "Innovación y Desarrollo",
      resumen: "Este estudio analiza el posicionamiento y la marca de las Instituciones de Educación Superior (IES) en Santa Cruz de la Sierra, evaluando su desempeño bajo los estándares internacionales QS Stars™. Se examina cómo estas instituciones construyen y comunican su identidad de marca en el mercado educativo local e internacional.",
      enlacePDF: "https://investiga.utepsa.edu/index.php/revista/article/view/35/54",
      palabrasClave: "posicionamiento, marca, instituciones de educación superior, QS Stars, Santa Cruz de la Sierra",
      destacado: true
    },
    {
      id: "paper-1",
      titulo: "Quality of Employment: Intergenerational Labor Precariousness from the Perspective of the IMCE in Santa Cruz De La Sierra 2023–2025",
      autores: "Pedro Cesar Saavedra Romero, Alberto Limpias Calvimontes, Edwin Mamani Ávila & Hugo Villegas Barrios",
      año: "2025",
      categoria: "Desarrollo Humano",
      resumen: "This study evaluates the Quality of Employment (QoE) and analyzes intergenerational labor precariousness in Santa Cruz de la Sierra, Bolivia, during the 2023-2025 period. The conceptual framework is based on the Theory of Segmented Labor Markets (SLMT), focusing on the unequal insertion of different generational cohorts. A quantitative approach was adopted, using the Multidimensional Quality of Employment Index (IMCE), which is grounded in the Alkire-Foster (AF) double-threshold model. The IMCE assesses deprivation across three main dimensions: Labor Income, Labor Stability, and Employment Conditions. The poverty line for poor quality employment was set at K = 50%. The results are based on a representative sample of 415 employed workers (ages 18-65). Findings confirm that the overall QoE remains considerably low (IMCE2025 = 0.45) and below the historical Bolivian national average (0.47). The Headcount Ratio of Poor-Quality Employment (H) reached 68%. The intergenerational analysis confirms labor market segmentation: Generation Z exhibits the highest vulnerability (IMCEZ = 0.37), validating its predominant insertion into the secondary sector. Youth precariousness is highlighted by high contractual instability (27% without a formal contract) and lack of social protection (68% without access to benefits). Gender disparity is acute: Generation Z females show the lowest IMCE (0.36) and an incidence rate of 92% (H), implying that almost all young employed women face poor quality employment. The structural challenge facing the labor market is fundamentally the quality of employment, not merely access. Urgent public policy interventions are required to address these disparities.",
      enlacePDF: "https://journalspress.uk/index.php/LJRHSS/article/view/1672/4478",
      palabrasClave: "quality of employment, intergenerational, labor precariousness, IMCE, Santa Cruz, Bolivia",
      destacado: true
    },
    {
      id: "paper-2",
      titulo: "Marca y posicionamiento en la industria apícola en Santa Cruz - una mirada a partir del modelo brand equity de Aaker y Keller",
      autores: "Pedro Cesar Saavedra-Romero, Diana Milka Saldaña Russo, Daniel Fernando Añez Casso, Lider Arteaga Casal",
      año: "2023",
      categoria: "Innovación y Desarrollo",
      resumen: "Esta investigación analiza la marca y el posicionamiento en la industria apícola de Santa Cruz desde la perspectiva del modelo Brand Equity de Aaker y Keller. El estudio examina cómo las empresas apícolas de la región construyen y gestionan el valor de sus marcas, identificando los principales atributos que influyen en la percepción del consumidor. Se analizan las dimensiones del Brand Equity: reconocimiento de marca, asociaciones de marca, percepción de calidad y lealtad. Los resultados revelan que las marcas de miel artesanal de Santa Cruz tienen un potencial significativo de crecimiento mediante estrategias de diferenciación y comunicación efectiva. El estudio proporciona recomendaciones prácticas para las empresas apícolas que buscan fortalecer su posicionamiento en el mercado local y nacional.",
      enlacePDF: "https://investiga.utepsa.edu/index.php/revista/article/view/18/48",
      palabrasClave: "marca, posicionamiento, apicultura, brand equity, Aaker, Keller, Santa Cruz",
      destacado: true
    },
    {
      id: "paper-3",
      titulo: "Las competencias digitales y las problemáticas actuales frente a las clases virtuales en los estudiantes universitarios en tiempos de COVID19",
      autores: "Pedro Cesar Saavedra-Romero",
      año: "2020",
      categoria: "Educación de Calidad",
      resumen: "Esta investigación examina las competencias digitales de los estudiantes universitarios y las problemáticas que enfrentan durante la transición a clases virtuales en el contexto de la pandemia COVID-19. El estudio identifica las principales barreras tecnológicas, pedagógicas y socioeconómicas que afectan el proceso de aprendizaje en línea. Se analizan variables como el acceso a dispositivos tecnológicos, conectividad a internet, habilidades digitales previas, y adaptación a nuevas metodologías de enseñanza virtual. Los hallazgos revelan disparidades significativas entre estudiantes de diferentes estratos socioeconómicos y proponen estrategias para mejorar la equidad educativa en entornos virtuales. El estudio ha sido citado por 2 investigaciones posteriores, destacando su relevancia en el campo de la educación digital.",
      enlacePDF: "https://d1wqtxts1xzle7.cloudfront.net/65674413/202002_N5_Las_competencias_digitales_y_las_problematicas_actuales_en_los_estudiantes_universitarios_en_tiempos_de_COVID19-libre.pdf?1613165838=&response-content-disposition=inline%3B+filename%3DLAS_COMPETENCIAS_DIGITALES_Y_LAS_PROBLEM.pdf&Expires=1772408577&Signature=CK6Ao9jhazomy7YA2Pdc6uMptj7HbYDxN2qZeUVLnDb8w4KiFwfF1OEpxJnLhrXCc3Qsljv6iRLi~c8sYfJEGd5--Or-BjU6G9TCIHYws4YB3sUPQgpTSf6bPLmpofKnSbq3BM3h12XckHGbYL~YJuwYGeokFvmfkXK~yvAx1b9IVlj07zSiZiO0vFJib~WMYV5de4sGUiKpFfCgSQnKFLSxtgPvy41yW9uFfxonbjW2E9TtHkW~fo1alB5mxFnFPyWU4x-Zgyvw8JWFU3fBIZ9I-K71xweF7OaS1ZxXs4Dn0MvP4PE9SUyWBBCZM5BuHf7eFekgSZcOV6sCcDylsA__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA",
      palabrasClave: "competencias digitales, clases virtuales, COVID-19, educación universitaria, problemáticas educativas",
      destacado: true
    },
    {
      id: "paper-4",
      titulo: "La generación de la confianza del consumidor desde la perspectiva del concepto de Brand Equity en las cinco principales categorías de productos de consumo de la canasta familiar",
      autores: "Carmen Rosa Céspedes, Melany Amandra Bustos Carpio, Pedro Cesar Saavedra-Romero",
      año: "2021",
      categoria: "Innovación y Desarrollo",
      resumen: "La marca es un factor determinante en la agregación de valor en los productos como en los servicios. Una buena gestión de la marca se establece a través de la generación de confianza del consumidor, elemento fundamental del concepto de Brand Equity. Esta investigación analiza cómo se genera la confianza del consumidor desde la perspectiva del Brand Equity en las cinco principales categorías de productos de consumo de la canasta familiar en Santa Cruz de la Sierra. El estudio examina las dimensiones del Brand Equity - reconocimiento de marca, asociaciones de marca, percepción de calidad y lealtad - y su impacto en la confianza del consumidor. Los resultados revelan que las marcas con mayor Brand Equity generan significativamente mayor confianza en los consumidores, lo que se traduce en preferencia de compra y disposición a pagar precios premium. El estudio proporciona insights valiosos para las empresas que buscan fortalecer sus marcas en el mercado cruceño.",
      enlacePDF: "https://d1wqtxts1xzle7.cloudfront.net/82676542/202101_N6_La_generacion_de_la_confianza_del_consumidor_desde_la_perspectiva_del_concepto_de_Brand_Equity-libre.pdf?1648242913=&response-content-disposition=inline%3B+filename%3DLA_GENERACION_DE_LA_CONFIANZA_DEL_CONSUM.pdf&Expires=1772408772&Signature=NnhNc5vOnAOKq7T5dVYx8oZO3XcRDjtuem7sIClUVLbT38rBka8JMkEyoJ4aT1zRMpNYXLGsd5Uxb26nWjTlQRuHuyjVofy6LnoGmaO99qBYfjgqgeiOCMLZJX~JDwQsmGfZgEoyPIVJYpqj4q1zknGHP~3VF055VVo-wMvs9681FhlEonTcbKIt9v1ivEOK2TBT3d6-LxrKL9PtykSS4o74ge4ybnTXEtKgPmvB-GUYGt54VmTmTatdAPmyjnlJeir5yweXLQCAhljBComBB2J99bXdp5LS88uoX86UjJXzycPkOEnTsJJbfm~~8Keepf7cyy3ZroIrb~QLsp0L~Q__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA",
      palabrasClave: "confianza del consumidor, Brand Equity, canasta familiar, marca, valor de marca",
      destacado: true
    },
    {
      id: "paper-15",
      titulo: "Segmentación, posicionamiento y brand equity en el mercado de yogurt cruceño",
      autores: "Pedro Cesar Saavedra Romero, Raul Jerson Bonilla-Sanchez",
      año: "2026",
      categoria: "Innovación y Desarrollo",
      resumen: "El objetivo de la investigación fue analizar el comportamiento del consumidor de yogurt en Santa Cruz de la Sierra mediante tres técnicas multivariadas: segmentación por conglomerados K-medias, mapa perceptual con el Análisis de Correspondencias Múltiples (ACM) —técnica de reducción dimensional que visualiza asociaciones entre variables categóricas en espacios bidimensionales— y comparación del brand equity —valor diferencial percibido de una marca por sus consumidores— entre Pil Andina y Delizia. La pregunta de investigación fue: ¿cuál es la estructura de segmentación interna del mercado de yogurt cruceño y qué asimetrías existen en el brand equity entre sus marcas líderes? Se empleó un enfoque cuantitativo - descriptivo y transversal; la muestra estuvo conformada por 407 decisores de compra, seleccionados mediante muestreo aleatorio sistemático; el instrumento incluyó 25 ítems en escala Likert y el análisis se realizó con ANOVA, pruebas U de Mann-Whitney y descomposición SVD en Python. Los resultados evidenciaron tres segmentos significativos (p < 0.001): desvinculados (17.7%), moderados orientados a calidad (45.0%) y exigentes (37.3%); el ACM explicó el 66.6% de la inercia. No se observaron diferencias significativas en brand equity (p = 0.311), aunque Delizia mostró valores superiores. En conclusión, el mercado presenta segmentación estructurada y asimetrías cualitativas con implicaciones estratégicas.",
      enlacePDF: "https://doi.org/10.70448/revista3i.v5i1.198",
      palabrasClave: "segmentación, posicionamiento, brand equity, yogurt, Santa Cruz, K-medias, ACM, Pil Andina, Delizia",
      destacado: true
    },
    {
      id: "paper-16",
      titulo: "Estructura empírica de la calidad del empleo percibida en trabajadores urbanos",
      autores: "Edwin Mamani Avila, Hugo Villegas Barrios, Alberto Limpias Calvimontes",
      año: "2026",
      categoria: "Desarrollo Humano",
      resumen: "El objetivo de esta investigación fue identificar la estructura empírica de la autopercepción de calidad del empleo en trabajadores urbanos de Santa Cruz de la Sierra, Bolivia, mediante el Análisis de Componentes Principales (ACP) con rotación Varimax, a partir de datos de doble oleada (2023–2025, N=1.121). Se administró una escala Likert de 14 ítems a una muestra estratificada de tres cohortes generacionales (Gen X=333, Gen Y=498, Gen Z=290) en 12 distritos municipales urbanos; el ACP se realizó tras verificar la factorizabilidad (KMO=0,906; Bartlett χ²=5.203,34, gl=91, p<0,001; α=0,873). Los resultados revelan tres componentes que explican el 56,1% de la varianza: CP1 Clima Organizacional y Desarrollo Profesional (19,8%), CP2 Seguridad Formal e Ingresos (21,4%) y CP3 Autonomía Laboral y Participación (14,9%); la Generación Z presentó las puntuaciones más bajas en Seguridad Formal (Q8: M=2,59), coherentes con el Índice Multidimensional de Calidad del Empleo objetivo (IMCE_Z=0,37). Se concluye que los trabajadores perciben la calidad del empleo en torno a dimensiones relacionales, de protección formal y de autonomía, lo que valida la segmentación intergeneracional y aporta base empírica para el diseño de políticas de Trabajo Decente orientadas al mercado laboral urbano boliviano.",
      enlacePDF: "https://doi.org/10.70448/revista3i.v5i1.200",
      palabrasClave: "calidad del empleo, ACP, Varimax, trabajadores urbanos, intergeneracional, Santa Cruz, Bolivia, Trabajo Decente",
      destacado: true
    },
    {
      id: "paper-17",
      titulo: "Brecha de habilidades técnicas en Santa Cruz: Microcredenciales para la empleabilidad",
      autores: "Liliana Poquechoque Cortez, Boniyil Vaca, Cristina Lía",
      año: "2026",
      categoria: "Educación de Calidad",
      resumen: "El presente estudio analizó las habilidades técnicas demandadas en el mercado laboral de Santa Cruz de la Sierra, Bolivia, a partir de perfiles de cargo recopilados de consultoras de recursos humanos y LinkedIn durante el período enero–agosto de 2024. La investigación adoptó un enfoque documental y empleó análisis de contenido sistemático para identificar y categorizar competencias en ocho áreas funcionales. Los resultados evidenciaron que Marketing y Ventas concentraron el 38% de la demanda total, posicionándose como las áreas de mayor dinamismo laboral. Asimismo, se construyó un índice promedio de digitalización del 67%, destacándose Marketing como el sector con mayor exigencia digital (86%). En términos de transversalidad, el análisis de datos emergió como la única competencia técnica de alta presencia, identificada en cinco de las ocho áreas evaluadas. Las habilidades técnicas prioritarias se estructuraron en tres ejes principales: digitalización y manejo de herramientas tecnológicas, análisis de datos y gestión estratégica, y competencias interpersonales orientadas a resultados. Adicionalmente, se identificó una brecha significativa entre la formación universitaria tradicional y las exigencias actuales del mercado, especialmente en transformación digital y analítica de datos. En respuesta, se propuso el desarrollo de credenciales profesionales y microcredenciales sectoriales, alineadas con estándares internacionales, para fortalecer la empleabilidad y la movilidad profesional.",
      enlacePDF: "https://doi.org/10.70448/revista3i.v5i1.204",
      palabrasClave: "habilidades técnicas, microcredenciales, empleabilidad, digitalización, mercado laboral, Santa Cruz, brecha de competencias",
      destacado: true
    },
    {
      id: "paper-19",
      titulo: "Escasez y ansiedad: Impacto multidimensional y perfiles ciudadanos frente a la crisis de combustible en Santa Cruz de la Sierra",
      autores: "Pedro Cesar Saavedra Romero, Liliana Poquechoque Cortez, Graciela Malue Alejo",
      año: "2025",
      categoria: "Desarrollo Humano",
      resumen: "La presente investigación analiza el impacto multidimensional de la escasez de combustible en Santa Cruz de la Sierra, Bolivia, durante el año 2025. A partir de un diseño cuantitativo, transversal y descriptivo, se encuestó a 534 usuarios de vehículos particulares, públicos y comerciales, evaluando efectos económicos, sociales, emocionales, de movilidad y percepción gubernamental. Los resultados revelan una afectación generalizada: el 71 % reportó pérdidas económicas, el 81 % pasó más de tres horas en filas, y el 67 % manifestó niveles elevados de estrés. Mediante análisis de conglomerados (clusters), se identificaron tres perfiles de respuesta ciudadana: (1) impactados moderados con estrategias pasivas, (2) minimizadores del problema con baja afectación y (3) altamente afectados y reactivos, con conductas de almacenamiento, consumo informal y mayor escepticismo político. Las pruebas multivariadas (MANOVA) confirmaron diferencias significativas entre los grupos (p < .001). Se evidencian patrones defensivos y reactivos de consumo, lo que profundiza el ciclo de escasez. La percepción de ineficiencia estatal es generalizada (78 %) y el pesimismo futuro es alto (84 %). Se concluye que la crisis no solo afecta la movilidad y el consumo, sino que debilita el tejido social, emocional y político de la población. Se proponen políticas diferenciadas por perfil de afectación, diversificación energética, campañas de adaptación cultural y reservas estratégicas para evitar futuras crisis de desabastecimiento.",
      enlacePDF: "http://perspectivas.ucb.edu.bo/index.php/a/article/view/291/307",
      palabrasClave: "escasez de combustible, ansiedad, crisis energética, perfiles ciudadanos, Santa Cruz, Bolivia, MANOVA, clusters",
      destacado: true
    },
    {
      id: "paper-18",
      titulo: "Limitaciones y necesidades del emprendimiento femenino en la ciudad de Santa Cruz de la Sierra: un enfoque de género desde el rol de las universitarias egresadas y/o tituladas en pandemia",
      autores: "Liliana Poquechoque Cortez, Pedro Cesar Saavedra Romero, María Laura Zabala Rodas, María Del Carmen Miranda",
      año: "2025",
      categoria: "Emprendimiento",
      resumen: "El presente estudio identifica las barreras que enfrentan mujeres universitarias en Santa Cruz, Bolivia, en cuanto al emprendimiento. Se señala que el emprendimiento femenino en América Latina es impulsado por la necesidad económica y la falta de oportunidades laborales, pero las mujeres enfrentan barreras como la falta de acceso a financiamiento y redes de apoyo. También se analiza la falta de estudios sobre las limitaciones de género en el emprendimiento femenino en la región. En Santa Cruz de la Sierra, las mujeres universitarias emprendedoras se ven motivadas principalmente por la superación personal y la situación económica. La educación formal y el apoyo familiar son factores clave para el éxito empresarial. Sin embargo, a nivel nacional, la falta de acceso a préstamos y la responsabilidad familiar son barreras importantes para el emprendimiento femenino. Se destaca la necesidad de incorporar una perspectiva de género en la formación en emprendimiento para reducir la brecha entre mujeres y hombres. La financiación personal, el apoyo de una red familiar siguen siendo medios clave para financiar el emprendimiento femenino en Bolivia. En general, se necesitan políticas más enfocadas en atender las necesidades específicas y desafíos de las emprendedoras para promover su participación en la economía.",
      enlacePDF: "https://perspectivas.ucb.edu.bo/index.php/a/article/view/42/47",
      palabrasClave: "emprendimiento femenino, género, mujeres universitarias, barreras, financiamiento, Santa Cruz, Bolivia, pandemia",
      destacado: true
    },
    {
      id: "paper-5",
      titulo: "Identificación, importancia y valoración de habilidades blandas en estudiantes universitarios",
      autores: "Cristina Lía, Boniyil Vaca, Liliana Poquechoque",
      año: "2024",
      categoria: "Educación de Calidad",
      resumen: "Este trabajo identifica las habilidades blandas más valoradas por empleadores y evalúa su desarrollo en estudiantes universitarios de UTEPSA.",
      enlacePDF: "https://doi.org/10.36888/udual.universidades.2023.95.673",
      palabrasClave: "habilidades blandas, educación, universitarios, empleabilidad",
      destacado: false
    },
    {
      id: "paper-6",
      titulo: "Marca y posicionamiento en la industria apícola en Santa Cruz - Modelo Brand Equity",
      autores: "Pedro Cesar Saavedra Romero, Diana M. Saldaña, Daniel F. Añez, Lider Arteaga",
      año: "2024",
      categoria: "Innovación y Desarrollo",
      resumen: "Aplicación del modelo Brand Equity para analizar el posicionamiento de marcas en la industria apícola cruceña.",
      enlacePDF: "https://investiga.utepsa.edu/index.php/revista/article/view/18/48",
      palabrasClave: "marca, posicionamiento, apicultura, brand equity",
      destacado: false
    },
    {
      id: "paper-7",
      titulo: "El perfil del docente en universidades con enfoque tecnológico: caso UTEPSA",
      autores: "Rubén D. Dabdoub, Mónica Arauco, Pedro Cesar Saavedra Romero",
      año: "2023",
      categoria: "Educación de Calidad",
      resumen: "Caracterización del perfil docente requerido en universidades tecnológicas, con análisis del caso UTEPSA.",
      enlacePDF: "https://doi.org/10.36888/udual.universidades.2023.95.673",
      palabrasClave: "docente, universidad, tecnología, perfil profesional",
      destacado: false
    },
    {
      id: "paper-8",
      titulo: "Comportamiento del consumidor de hortalizas post-pandemia en Santa Cruz de la Sierra",
      autores: "Shirley Suárez, María C. Mamani, Pedro Cesar Saavedra Romero",
      año: "2022",
      categoria: "Innovación y Desarrollo",
      resumen: "Análisis de los cambios en el comportamiento de compra de hortalizas tras la pandemia COVID-19.",
      enlacePDF: "https://drive.google.com/file/d/1jEvvA6TBtVUTVDFD-sE2odDrRBYS6dY7/view",
      palabrasClave: "consumidor, hortalizas, pandemia, comportamiento",
      destacado: false
    },
    {
      id: "paper-9",
      titulo: "Nativos vs. Inmigrantes digitales - Análisis comparativo del comportamiento de compra",
      autores: "Jonathan Flores, Pedro Cesar Saavedra Romero",
      año: "2021",
      categoria: "Innovación y Desarrollo",
      resumen: "Comparación del comportamiento de compra entre nativos digitales e inmigrantes digitales en Santa Cruz.",
      enlacePDF: "https://drive.google.com/file/d/1nrQdVt0D6f8iuocdiFz54SBd51bv4iRH/view",
      palabrasClave: "digital, consumidor, compra, comportamiento, generaciones",
      destacado: false
    },
    {
      id: "paper-10",
      titulo: "Between the Virtual Cart and the New Digital Consumer Journey: A Comparative Analysis of E-commerce in Brazil and Bolivia",
      autores: "Pedro Cesar Saavedra Romero, MSc. Liliana Poquechoque",
      año: "2024",
      categoria: "Innovación y Desarrollo",
      resumen: "This research presents a comparative analysis of e-commerce adoption and digital consumer behavior between Brazil and Bolivia. The study examines how consumers in both countries navigate the digital purchasing journey, from initial product discovery through the virtual cart to final purchase decision. Key findings reveal significant differences in digital payment adoption, logistics infrastructure impact on purchase completion, and the role of social commerce in each market. The research provides strategic recommendations for businesses seeking to expand their e-commerce operations in South American markets.",
      enlacePDF: "#",
      palabrasClave: "e-commerce, digital consumer journey, Brazil, Bolivia, comparative analysis, virtual cart",
      destacado: false
    },
    {
      id: "paper-11",
      titulo: "Segmentación de Audiencias y Consumo Digital: Patrones de Comportamiento en Generaciones Bolivianas",
      autores: "MSc. Ramiro Muñoz, MSc. Mónica Flores",
      año: "2024",
      categoria: "Innovación y Desarrollo",
      resumen: "Esta investigación analiza los patrones de consumo digital a través de la segmentación por generaciones en el contexto boliviano. El estudio identifica diferencias significativas en el comportamiento de compra online entre Generación Z, Millennials, Generación X y Baby Boomers. Se examinan variables como preferencias de plataformas, frecuencia de compra, categorías de productos más adquiridos, y factores de decisión de compra. Los resultados ofrecen insights valiosos para estrategias de marketing digital segmentadas y personalización de experiencias de usuario.",
      enlacePDF: "#",
      palabrasClave: "segmentación, audiencias, consumo digital, generaciones, marketing digital, Bolivia",
      destacado: false
    },
    {
      id: "paper-12",
      titulo: "Calidad de Empleo: Un Estudio Intergeneracional sobre Condiciones Laborales en Santa Cruz de la Sierra",
      autores: "MSc. Siomara Guzmán, MSc. Cristina Lia, MSc. Boniyil Vaca",
      año: "2024",
      categoria: "Desarrollo Humano",
      resumen: "Este estudio examina la calidad del empleo desde una perspectiva intergeneracional en Santa Cruz de la Sierra. La investigación analiza variables como estabilidad laboral, ingresos, beneficios, condiciones de trabajo, y satisfacción laboral comparando diferentes cohortes generacionales. Los hallazgos revelan disparidades significativas en la percepción y experiencia de calidad de empleo entre generaciones, con implicaciones importantes para políticas de recursos humanos y desarrollo organizacional. El estudio propone un modelo de evaluación de calidad de empleo adaptado al contexto boliviano.",
      enlacePDF: "#",
      palabrasClave: "calidad de empleo, condiciones laborales, intergeneracional, recursos humanos, Santa Cruz",
      destacado: false
    },
    {
      id: "paper-13",
      titulo: "Comportamiento del Consumidor Farmacéutico de Retail: Factores de Decisión de Compra en Santa Cruz",
      autores: "MSc. Juan Carlos Peña, MSc. Edwin Mamani",
      año: "2024",
      categoria: "Innovación y Desarrollo",
      resumen: "Esta investigación analiza el comportamiento del consumidor en el sector farmacéutico de retail en Santa Cruz de la Sierra. El estudio identifica los principales factores que influyen en la decisión de compra de medicamentos y productos de cuidado personal en farmacias retail. Se examinan variables como precio, marca, recomendación del farmacéutico, ubicación de la farmacia, y programas de fidelización. Los resultados proporcionan insights estratégicos para la optimización del mix de marketing en el sector farmacéutico retail.",
      enlacePDF: "#",
      palabrasClave: "consumidor farmacéutico, retail, decisión de compra, farmacias, marketing farmacéutico",
      destacado: false
    },
    {
      id: "paper-14",
      titulo: "Ciudadanos y Economía Circular: Percepciones y Prácticas Sostenibles en Bolivia",
      autores: "MSc. Pedro Cesar Saavedra Romero, MSc. Hugo Villegas",
      año: "2024",
      categoria: "Medio Ambiente",
      resumen: "Esta investigación explora las percepciones, actitudes y prácticas de los ciudadanos bolivianos respecto a la economía circular. El estudio evalúa el nivel de conocimiento sobre conceptos de economía circular, la disposición a adoptar comportamientos de consumo sostenible, y las barreras percibidas para la transición hacia modelos circulares. Se analizan prácticas específicas como reutilización, reciclaje, compra de productos second-hand, y preferencia por productos con embalaje sostenible. Los hallazgos ofrecen recomendaciones para políticas públicas y estrategias empresariales de sostenibilidad.",
      enlacePDF: "#",
      palabrasClave: "economía circular, sostenibilidad, ciudadanos, percepciones, prácticas sostenibles, Bolivia",
      destacado: false
    }
  ];

  // Papers filtrados
  const papersFiltrados = papers.filter(paper => {
    const matchAño = !filtroAñoPaper || paper.año === filtroAñoPaper;
    const matchCategoria = !filtroCategoriaPaper || paper.categoria === filtroCategoriaPaper;
    const matchAutor = !filtroAutorPaper || paper.autores.toLowerCase().includes(filtroAutorPaper.toLowerCase());
    const matchPalabrasClave = !filtroPalabrasClavePaper || 
      paper.palabrasClave.toLowerCase().includes(filtroPalabrasClavePaper.toLowerCase()) ||
      paper.titulo.toLowerCase().includes(filtroPalabrasClavePaper.toLowerCase());
    return matchAño && matchCategoria && matchAutor && matchPalabrasClave;
  }).sort((a, b) => b.año.localeCompare(a.año));

  // Papers destacados (6 principales)
  const papersDestacados = papers.filter(p => p.destacado).sort((a, b) => b.año.localeCompare(a.año));

  // Papers a mostrar (destacados o filtrados)
  const papersAMostrar = (filtroAñoPaper || filtroCategoriaPaper || filtroAutorPaper || filtroPalabrasClavePaper) 
    ? papersFiltrados 
    : papersDestacados;

  // Opciones para filtros de papers
  const añosPapers = [...new Set(papers.map(p => p.año))].sort((a, b) => b.localeCompare(a));
  const categoriasPapers = [...new Set(papers.map(p => p.categoria))];

  // Líneas de investigación
  const lineasInvestigacion = [
    { id: 'desarrollo-humano', nombre: 'Desarrollo Humano', icono: <Heart className="w-5 h-5" />, color: 'bg-rose-500' },
    { id: 'medio-ambiente', nombre: 'Medio Ambiente', icono: <Leaf className="w-5 h-5" />, color: 'bg-emerald-500' },
    { id: 'educacion-calidad', nombre: 'Educación de Calidad', icono: <GraduationCap className="w-5 h-5" />, color: 'bg-blue-500' },
    { id: 'emprendimiento', nombre: 'Emprendimiento', icono: <Rocket className="w-5 h-5" />, color: 'bg-orange-500' },
    { id: 'innovacion-desarrollo', nombre: 'Innovación y Desarrollo', icono: <Monitor className="w-5 h-5" />, color: 'bg-purple-500' },
  ];

  // Datos de publicaciones organizadas por líneas de investigación
  const publicaciones = [
    // 2026
    { titulo: "Segmentación, posicionamiento y brand equity en el mercado de yogurt cruceño", autores: "Pedro Cesar Saavedra Romero, Raul Jerson Bonilla-Sanchez", año: "2026", linea: "innovacion-desarrollo", enlace: "https://doi.org/10.70448/revista3i.v5i1.198", imagen: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Estructura empírica de la calidad del empleo percibida en trabajadores urbanos", autores: "Edwin Mamani Avila, Hugo Villegas Barrios, Alberto Limpias Calvimontes", año: "2026", linea: "desarrollo-humano", enlace: "https://doi.org/10.70448/revista3i.v5i1.200", imagen: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Brecha de habilidades técnicas en Santa Cruz: Microcredenciales para la empleabilidad", autores: "Liliana Poquechoque Cortez, Boniyil Vaca, Cristina Lía", año: "2026", linea: "educacion-calidad", enlace: "https://doi.org/10.70448/revista3i.v5i1.204", imagen: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Deserción universitaria en Bolivia: análisis de factores socioeconómicos, personales y académicos", autores: "Irene Sánchez San José, Liliana Poquechoque Cortez, Sammy Ramiro Torres Arroyo", año: "2026", linea: "educacion-calidad", enlace: "https://revistas.cardenalcisneros.es/pulso/es/article/view/8818/9747", imagen: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80" },
    // 2025
    { titulo: "Posicionamiento & Marca: una mirada a las Instituciones de Educación Superior [IES] en Santa Cruz de la Sierra bajo los estándares Qs Stars™", autores: "Pedro Cesar Saavedra Romero, Rubén Oscar Alvarez Hinojosa", año: "2025", linea: "innovacion-desarrollo", enlace: "https://investiga.utepsa.edu/index.php/revista/article/view/35/54", imagen: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Comportamiento del Consumidor Farmacéutico de Retail", autores: "Monica Gabriela Flores Vargas, Pedro Cesar Saavedra Romero", año: "2025", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1PHuTN03icwvzrmXxdqia3ekNwTPRSU4e/view?usp=share_link", imagen: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Filas, Pérdidas y Frustraciones: La cara visible de la crisis de combustible en Santa Cruz", autores: "Liliana Poquechoque Cortez, Pedro Cesar Saavedra Romero", año: "2025", linea: "desarrollo-humano", enlace: "https://drive.google.com/file/d/1nkoIl5TitxKgAFEktYcQLdOJECX5BIt9/view?usp=share_link", imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Transformación del Consumo en Bolivia - China", autores: "Liliana Poquechoque Cortez, Justiniano Saucedo Jorge Heynar, Romero Gutiérrez Hillary Alison, Pedro Cesar Saavedra Romero", año: "2025", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1vp2BnLIhorNrugjEGaX6bokKKxpaeOvU/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Ecosistema Emprendedor en UTEPSA: Caracterización, Innovación y Sostenibilidad en Emprendimientos Universitarios", autores: "Mónica Flores Vargas, Liliana Poquechoque Cortez, Pedro Cesar Saavedra Romero, Kenshin B. Ortiz Nishihira, Katherine Tenorio Campos, Jorge Justiniano Saucedo", año: "2025", linea: "emprendimiento", enlace: "https://drive.google.com/file/d/1DVh9U31osHnt8Cl9vzKPUsiQVX3-nbyc/view?usp=share_link", imagen: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Limitaciones y necesidades del emprendimiento femenino en la ciudad de Santa Cruz de la Sierra", autores: "Liliana Poquechoque, Pedro Cesar Saavedra Romero, María L. Zabala, María C. Miranda", año: "2025", linea: "emprendimiento", enlace: "https://perspectivas.ucb.edu.bo/index.php/a/article/view/42/47", imagen: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80", resumen: "El presente estudio identifica las barreras que enfrentan mujeres universitarias en Santa Cruz, Bolivia, en cuanto al emprendimiento. Se señala que el emprendimiento femenino en América Latina es impulsado por la necesidad económica y la falta de oportunidades laborales, pero las mujeres enfrentan barreras como la falta de acceso a financiamiento y redes de apoyo." },
    { titulo: "Quality of Employment: Intergenerational Labor Precariousness from the Perspective of the IMCE in Santa Cruz De La Sierra 2023–2025", autores: "Pedro Cesar Saavedra Romero, Alberto Limpias Calvimontes, Edwin Mamani Ávila, Hugo Villegas Barrios", año: "2025", linea: "desarrollo-humano", enlace: "https://journalspress.uk/index.php/LJRHSS/article/view/1672/4478", imagen: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Escasez y ansiedad: Impacto multidimensional y perfiles ciudadanos frente a la crisis de combustible en Santa Cruz de la Sierra", autores: "Pedro Cesar Saavedra Romero, Liliana Poquechoque Cortez, Graciela Malue Alejo", año: "2025", linea: "desarrollo-humano", enlace: "http://perspectivas.ucb.edu.bo/index.php/a/article/view/291/307", imagen: "https://images.unsplash.com/photo-1611270418597-a6c77f4b7271?auto=format&fit=crop&w=400&q=80" },
    // 2024
    { titulo: "Identificación, importancia y valoración de habilidades blandas en estudiantes universitarios", autores: "Cristina Lía, Boniyil Vaca, Liliana Poquechoque", año: "2024", linea: "educacion-calidad", enlace: "https://investiga.utepsa.edu/index.php/revista/article/view/15/47", imagen: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Calidad de empleo en Santa Cruz de la Sierra", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2024", linea: "desarrollo-humano", enlace: "https://drive.google.com/file/d/1_1iCjXn2pDs1pD9sOFN-wxUKj-Dt5r5y/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80" },
    { titulo: "UTEPSA BRAVIOO - Defensorías universitarias", autores: "Pedro Cesar Saavedra Romero, MSc. Juan Carlos Peña", año: "2024", linea: "educacion-calidad", enlace: null, imagen: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Cursos, talleres y microcredenciales", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2024", linea: "educacion-calidad", enlace: null, imagen: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Competencias y conocimientos en el rubro ganadero", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2024", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1ib4LRkhM9v_3jhcj1Y1uXEV_7rMo7RE2/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Audiencias y segmentos Grupo El Deber", autores: "Mónica Gabriela Flores Vargas, Pedro Cesar Saavedra Romero", año: "2024", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1kArw78DuEJ_bN9--l6UpY4BNvh_VinZg/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Percepción de habilidades técnicas más valoradas en el mercado laboral", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2024", linea: "educacion-calidad", enlace: "https://drive.google.com/file/d/1QCFNP6JAtBTkilCSnTElNU95pNnRORaK/view?usp=share_link", imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Análisis de perfiles de cargo para identificación de habilidades", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2024", linea: "educacion-calidad", enlace: "https://drive.google.com/file/d/1RTrk3t2G-LCiA4ARwvyn5kUJ-E0d2HUn/view?usp=share_link", imagen: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Las mascotas en Santa Cruz de la Sierra", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2024", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/14bcFrek9s9YnzZFrJ6Z7OU0fCFCrQIdV/view?usp=share_link", imagen: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Competencias, problemáticas y actitudes en estudiantes", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2024", linea: "educacion-calidad", enlace: "https://drive.google.com/file/d/12vU0HxKlKbf1lE4jnYXJNGtDkFh94G6n/view?usp=share_link", imagen: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Comportamiento consumidor retail farmacéutico", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2024", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1TkYgCU70FviaQAZHwPVvLNTDB2XP5I4D/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Between the Virtual Cart and the New Digital Consumer Journey: A Comparative Analysis of E-commerce in Brazil and Bolivia", autores: "Pedro Cesar Saavedra Romero, Liliana Poquechoque", año: "2024", linea: "innovacion-desarrollo", enlace: null, imagen: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Segmentación de Audiencias y Consumo Digital: Patrones de Comportamiento en Generaciones Bolivianas", autores: "Mónica Gabriela Flores Vargas, Pedro Cesar Saavedra Romero", año: "2024", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1kArw78DuEJ_bN9--l6UpY4BNvh_VinZg/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Medición del consumo de agua en los hogares cruceños", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2024", linea: "medio-ambiente", enlace: "https://drive.google.com/file/d/1RoeXBgrqdnDGSgBkX6_ufZvb7igpykcq/view?usp=share_link", imagen: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=400&q=80" },
    // 2023
    { titulo: "El perfil del docente en universidades con enfoque tecnológico: caso UTEPSA", autores: "Rubén D. Dabdoub, Mónica Arauco, Pedro Cesar Saavedra Romero", año: "2023", linea: "educacion-calidad", enlace: "https://www.udualerreu.org/index.php/universidades/article/view/673/632", imagen: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Mujeres respecto al acceso laboral, emprendimiento y situación de cuidado", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2023", linea: "desarrollo-humano", enlace: "https://drive.google.com/file/d/16A1gqTU2tCHmc8cACzCaqyGTPThKZ9GA/view?usp=share_link", imagen: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Marca y posicionamiento en la industria apícola en Santa Cruz", autores: "Pedro Cesar Saavedra Romero, Diana M. Saldaña, Daniel F. Añez, Lider Arteaga", año: "2023", linea: "innovacion-desarrollo", enlace: "https://investiga.utepsa.edu/index.php/revista/article/view/18/48", imagen: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Economía del cuidado intergeneracional", autores: "Alex Armando Condori Galarza, Liliana Poquechoque", año: "2023", linea: "desarrollo-humano", enlace: "https://drive.google.com/file/d/1U6IRjlhBid6SAjuJH4HXx5u5mcVywmsz/view?usp=share_link", imagen: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Concentración de cloro en el agua potable", autores: "Siomara Daniela Guzmán Cabrera, Camila Cecilia Quiroga, Amir José Velásquez, Genesis Milenka Navarro, Pedro Cesar Saavedra Romero", año: "2023", linea: "medio-ambiente", enlace: "https://drive.google.com/file/d/1GJ9_5_Qtj4mTF-bPO79BdRHyUGSRf5PU/view?usp=share_link", imagen: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Formulación y proceso de producción de gomitas de miel", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2023", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1eccKykvKAqRi7fDbwfYwxJQ9rAKawjW5/view?usp=share_link", imagen: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Posicionamiento y marca en instituciones de educación superior", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2023", linea: "educacion-calidad", enlace: null, imagen: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=400&q=80" },
    // 2022
    { titulo: "Comportamiento del consumidor de hortalizas post-pandemia en Santa Cruz de la Sierra", autores: "Shirley Suárez, María C. Mamani, Pedro Cesar Saavedra Romero", año: "2022", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1jEvvA6TBtVUTVDFD-sE2odDrRBYS6dY7/view", imagen: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Características de los bachilleres respecto a formación académica universitaria", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2022", linea: "educacion-calidad", enlace: null, imagen: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=400&q=80" },
    { titulo: "El perfil de los emprendedores universitarios", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2022", linea: "emprendimiento", enlace: "https://drive.google.com/file/d/1iHA-xmg1Q13f-YDVa8v6Mrs7eYQKHuEC/view?usp=share_link", imagen: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Perfil postpandemia del turista interno", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2022", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1iHA-xmg1Q13f-YDVa8v6Mrs7eYQKHuEC/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Habilidades directivas y gerenciales", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2022", linea: "emprendimiento", enlace: "https://drive.google.com/file/d/19lQu_Z51SQn3PAgwkUcCH2jPjzgPKd7_/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Consumidor de miel de abeja", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2022", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1utDYhD1T7kjNursgl8WMWzvmr750rcJh/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=400&q=80" },
    { titulo: "La situación actual de los recicladores de residuos", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2022", linea: "medio-ambiente", enlace: "https://drive.google.com/file/d/1d17phDYgqixIPJkTiNqNWt7Dla2tL8sg/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Comportamiento del consumidor en el mercado automotriz", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2022", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1M0fkWeo75jRODFo31upBIIfXsso1r3sl/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80" },
    // 2021
    { titulo: "Nativos vs. Inmigrantes digitales - Análisis comparativo del comportamiento de compra", autores: "Jonathan Flores, Pedro Cesar Saavedra Romero", año: "2021", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1nrQdVt0D6f8iuocdiFz54SBd51bv4iRH/view", imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Perspectivas en educación a nivel posgrado", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2021", linea: "educacion-calidad", enlace: null, imagen: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Compras de alimentos y bebidas de consumo en el hogar", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2021", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1-jyhFWcUEB6peO9LNwSt3a7lqR_B_sm2/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Notoriedad y posicionamiento de universidades", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2021", linea: "educacion-calidad", enlace: null, imagen: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Análisis de la inteligencia emocional de la generación centennials", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2021", linea: "desarrollo-humano", enlace: "https://drive.google.com/file/d/183q2C06NXUKhyf1O8UuIsA__Q9vYGXTv/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Mujeres en cargos gerenciales", autores: "MSc. Ramiro Muñoz Arévalo", año: "2021", linea: "desarrollo-humano", enlace: "https://drive.google.com/file/d/1mdhNM0KRGaGKA-_HvG3BDzno4EUkNRy9/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
    { titulo: "El panorama actual en desarrollo de competencias digitales docentes", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2021", linea: "educacion-calidad", enlace: "https://drive.google.com/file/d/1MWrhC0fp9i7vT7cISzWOjHlra1AqTOcy/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Ciudadanos y economía circular", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2021", linea: "medio-ambiente", enlace: "https://drive.google.com/file/d/11GikdmZ43Jwt_7BnU6Mxl4No5fWg9_pM/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Percepción de estudiantes y docentes respecto a encuentros sincrónicos y asincrónicos", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2021", linea: "educacion-calidad", enlace: "https://drive.google.com/file/d/1pAb31ef9EQ_7z_q3EjtBXywXfu03JfF4/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
    // 2020
    { titulo: "Comportamiento del consumidor de alimentos en salud en tiempos de COVID-19", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2020", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1eDzvpDhKauAC6S0vmkH3SrU_CFpNN01B/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Conductas del cruceño respecto al reciclaje y medio ambiente", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2020", linea: "medio-ambiente", enlace: "https://docs.google.com/presentation/d/1g6WzjkzHB0uSRvqi1taMXH5Mtebx3Yok/edit?usp=share_link&ouid=108672140652093826350&rtpof=true&sd=true", imagen: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80" },
    { titulo: "La generación de la confianza del consumidor desde la perspectiva del Brand Equity", autores: "Carmen Rosa Céspedes, Melany Bustos, Pedro Cesar Saavedra Romero", año: "2020", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1D2z-4AvpcXI3Vxk5MJQtm1Azze9chZAl/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Cambios y transformaciones en los centros comerciales posterior a la pandemia", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2020", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1JQDArDXy2pkxYTUEp4yvbJViQVs-YQw-/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Competencias digitales y problemáticas en clases virtuales en tiempos de COVID-19", autores: "Pedro Cesar Saavedra Romero", año: "2020", linea: "educacion-calidad", enlace: "https://docs.google.com/document/d/1khp01EU5NO_PcKrLC0NEF4oAkpHrCubv/edit?usp=share_link&ouid=108672140652093826350&rtpof=true&sd=true", imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Tendencias en formación académica universitaria", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2020", linea: "educacion-calidad", enlace: null, imagen: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Cambios en el ámbito laboral durante y posterior a la pandemia", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2020", linea: "desarrollo-humano", enlace: "https://drive.google.com/file/d/1pwpy4pWhasQTN1XHD17s_AuHeEP1gDNt/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80" },
    { titulo: "El nivel de digitalización en las MIPYMES", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2020", linea: "emprendimiento", enlace: "https://drive.google.com/file/d/1Lk2U7XriwNAiUz6gcz6-ycM8Hs4wvzkY/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Cuidados en salud y respeto a la prescripción médica", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2020", linea: "desarrollo-humano", enlace: "https://drive.google.com/file/d/1wreb7TL8O5Mm80feSK5gdZPFsFid7fAS/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400&q=80" },
    { titulo: "El comportamiento del consumidor en compra de repuestos", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2020", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1ubnnLyDesSkwGcdoqKyNMnciRi5IpTx1/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80" },
    { titulo: "La confianza y el valor de marca en productos de la canasta familiar", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2020", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1Dn9wRGzW1C8LzOn_GYMG5sJ8qJ1thO4G/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80" },
    // 2019
    { titulo: "Preferencias en los destinos turísticos en Semana Santa", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2019", linea: "innovacion-desarrollo", enlace: "https://docs.google.com/presentation/d/1_vJOJ_RqXOcqYv-lqdWVurqGfFduskbK/edit?usp=share_link&ouid=108672140652093826350&rtpof=true&sd=true", imagen: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Gastos en salud", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2019", linea: "desarrollo-humano", enlace: "https://drive.google.com/file/d/15hGcvrCO7fuLYEUHHv1l__oh5c1VTSL9/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Hábitos de lectura en los estudiantes universitarios", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2019", linea: "educacion-calidad", enlace: "https://docs.google.com/presentation/d/1AshhrJjpcCGvRqt5C2Fmy325etG7-eZ0/edit?usp=share_link&ouid=108672140652093826350&rtpof=true&sd=true", imagen: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Estudio sobre el impacto del doble aguinaldo en trabajadores", autores: "Ramiro Antonio Muñoz Arévalo", año: "2019", linea: "desarrollo-humano", enlace: "https://drive.google.com/file/d/1YKajgAo2YAtGyBx0y1iopOZAhNyNlo1Z/view?usp=share_link", imagen: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80" },
    { titulo: "El perfil del docente ideal", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2019", linea: "educacion-calidad", enlace: "https://drive.google.com/file/d/1DoBsJUPZGKI-GXqxT3x_RkgM9IYklKCk/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Ciudadanía y ciudad", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2019", linea: "desarrollo-humano", enlace: "https://drive.google.com/file/d/11Rnvgzh-pGgNIJ090BMtyHlv9YWRtXPy/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=400&q=80" },
    { titulo: "La televisión digital en Santa Cruz de la Sierra", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2019", linea: "innovacion-desarrollo", enlace: "https://docs.google.com/presentation/d/1RqmHfIdzgFxY-mcvwPUouR2UFdHkuVKh/edit?usp=share_link&ouid=108672140652093826350&rtpof=true&sd=true", imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
    { titulo: "El mercado de consumo de las mascotas", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2019", linea: "innovacion-desarrollo", enlace: "https://docs.google.com/presentation/d/1KgopLHx8a0fTRcX10pYT49wvejyKbqcf/edit?usp=share_link&ouid=108672140652093826350&rtpof=true&sd=true", imagen: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Las capacidades y habilidades digitales en universitarios", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2019", linea: "educacion-calidad", enlace: "https://docs.google.com/document/d/1QnoxbqBF5us5W5MHZnvxnP5USxf3kshc/edit?usp=share_link&ouid=108672140652093826350&rtpof=true&sd=true", imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
    // 2018
    { titulo: "Niños y su percepción del valor del dinero", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2018", linea: "desarrollo-humano", enlace: "https://docs.google.com/document/d/1QnoxbqBF5us5W5MHZnvxnP5USxf3kshc/edit?usp=sharing&ouid=108672140652093826350&rtpof=true&sd=true", imagen: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Mujer y emprendimiento", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2018", linea: "emprendimiento", enlace: "https://drive.google.com/file/d/1OqT9zAjEv97BGEEhVTU7Py6zb2lv60rq/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
    // 2017
    { titulo: "Semana Santa, la festividad religiosa", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2017", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1M3zF2ivxIkDduZBGP5j1bijoKcQHXcqk/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Los cruceños y sus prácticas relacionadas con el carnaval", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2017", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1-NSY-lUV6U6A4kvnLRkc0dzpk0kuYX-J/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Emprendedores en UTEPSA", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2017", linea: "emprendimiento", enlace: "https://drive.google.com/file/d/1to3MfnRR4Oj8QTWAZWJqberlVMJBUGHa/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80" },
    // 2016
    { titulo: "Evaluación en relación al consumo y gasto en navidad", autores: "Observatorio de Mercados Económicos y Opinión - UTEPSA", año: "2016", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1Ol8XuXzVLjRG8ao1oF_cKKAt6a0MdBIs/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Calidad de servicios en los locales de comida rápida", autores: "Ramiro Antonio Muñoz Arévalo", año: "2016", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/1xW7anCGp0QCv5Ss39_O1zfzqljQPYN8T/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80" },
    { titulo: "Hábitos en conducción", autores: "Ramiro Antonio Muñoz Arévalo", año: "2016", linea: "desarrollo-humano", enlace: "https://drive.google.com/file/d/1Dgvgw5EtgK6v_EvSHNae7KertEEyEkJN/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80" },
    // 2015
    { titulo: "Actitudes sobre el amor y enamoramiento", autores: "Ramiro Antonio Muñoz Arévalo", año: "2015", linea: "desarrollo-humano", enlace: "https://drive.google.com/file/d/1K4h5U2qlgi6GjT5-N2kqwrc_t1dgPLsk/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&q=80" },
    // 2014
    { titulo: "Los cruceños y el carnaval", autores: "Ramiro Antonio Muñoz Arévalo", año: "2014", linea: "innovacion-desarrollo", enlace: "https://drive.google.com/file/d/15tG47-MIkL3AttSElcLnSfvEomnF8QwY/view?usp=sharing", imagen: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=400&q=80" },
  ];

  // Filtrar publicaciones
  const publicacionesFiltradas = publicaciones.filter(pub => {
    const matchLinea = !filtroLinea || pub.linea === filtroLinea;
    const matchAño = !filtroAño || pub.año === filtroAño;
    const matchAutor = !filtroAutorPublicacion || pub.autores.toLowerCase().includes(filtroAutorPublicacion.toLowerCase());
    return matchLinea && matchAño && matchAutor;
  });

  // Opciones para filtros
  const añosDisponibles = [...new Set(publicaciones.map(p => p.año))].sort((a, b) => b.localeCompare(a));

  // Datos de noticias
  interface Noticia {
    titulo: string;
    fecha: string;
    resumen: string;
    contenidoCompleto: string;
    imagen: string;
    imagenExtra?: string;
    enlace?: string;
  }

  const noticias: Noticia[] = [
    {
      titulo: "El Observatorio de Mercados presente en la FexpoJets 2026",
      fecha: "Julio 2026",
      resumen: "Durante las XVIII Jornadas Empresariales, Tecnológicas y Sociales JETS2026, estudiantes de Merchandising presentaron investigaciones realizadas durante la gestión, liderados por la Lic. Liliana Poquechoque Cortez.",
      contenidoCompleto: "Durante el desarrollo de las XVIII Jornadas Empresariales, Tecnológicas y Sociales JETS2026, los estudiantes de la asignatura Merchandising estuvieron presentando las investigaciones realizadas durante la gestión, liderados por la Lic. Liliana Poquechoque Cortez.",
      imagen: "/pub-fexpojets.jpeg"
    },
    {
      titulo: "Calidad del Empleo en Santa Cruz: Evidencia empírica, perspectiva intergeneracional y desafíos de inserción laboral",
      fecha: "Mayo 2026",
      resumen: "No solo de estadísticas vive el empleo y lo comprobamos. Con una gran participación se desarrolló el conversatorio organizado por el Observatorio de Mercados Económicos y Opinión (OMEO), en coordinación con los estudiantes del Club Elite.",
      contenidoCompleto: "No solo de estadísticas vive el empleo y lo comprobamos. Con una gran participación se desarrolló el conversatorio \"Calidad del Empleo en Santa Cruz: Evidencia empírica, perspectiva intergeneracional y desafíos de inserción laboral\".\n\nOrganizado por el Observatorio de Mercados Económicos y Opinión (OMEO), en coordinación de los estudiantes del Club Elite, junto a referentes del mundo empresarial, institucional y académico, nuestra universidad reafirmó su compromiso de generar espacios reales de análisis y reflexión.\n\nGracias a: René Salomón, Pedro Miranda, Aleida López, Gonzalo Delgadillo y a nuestros investigadores Edwin Mamani, Liliana Poquechoque y Pedro Cesar Saavedra. El diálogo es el primer paso para transformar el empleo.",
      imagen: "/noticias-conversatorio-empleo-1.jpg"
    },
    {
      titulo: "El Pollo Manda en Santa Cruz: Comportamiento del Consumidor de Comida Rápida",
      fecha: "Abril 2026",
      resumen: "Felicitamos al Lic. Raúl Bonilla y a sus estudiantes por la publicación del artículo \"Comportamiento del Consumidor de Comida Rápida\", un aporte que refleja investigación, análisis y compromiso con el conocimiento.",
      contenidoCompleto: "Felicitamos al Lic. Raúl Bonilla y a sus estudiantes por este importante logro académico: la publicación del artículo \"Comportamiento del Consumidor de Comida Rápida\", un aporte que refleja investigación, análisis y compromiso con el conocimiento. De igual manera, extendemos nuestras felicitaciones al equipo del OMEO, liderado por la Lic. Liliana Poquechoque y a los jóvenes que forman parte del club ELITE, por su dedicación y constante aporte al crecimiento académico de nuestra carrera.",
      imagen: "/noticias-pollo-manda.jpg",
      enlace: "https://www.calameo.com/read/00688956401d381025db3"
    },
    {
      titulo: "Generación Z, con la mayor precariedad laboral",
      fecha: "Marzo 2026",
      resumen: "Desde el Observatorio de Mercados Económicos y Opinión UTEPSA presentamos el estudio: \"Generación Z, con la mayor precariedad laboral\", un estudio que denota una realidad estructural actual.",
      contenidoCompleto: "Desde el Observatorio de Mercados Económicos y Opinión Utepsa presentamos el estudio: \"Generación Z, con la mayor precariedad laboral\", un estudio que denota una realidad estructural actual. Gracias a nuestros estudiantes y docentes involucrados en el estudio como lo son: Lic. Edwin Mamani, Lic. Alberto Limpias y Lic. Hugo Villegas y Pedro Cesar Saavedra Romero, liderados por la Lic. Liliana Poquechoque Cortez. Agradecidos por la cobertura a la Revista Economy.",
      imagen: "/noticias-bg.jpg",
      enlace: "https://www.calameo.com/read/006889564cb07b1b44b80"
    },
    {
      titulo: "Día Internacional de la Mujer: El Observatorio presenta tres investigaciones sobre empoderamiento femenino",
      fecha: "Marzo 2026",
      resumen: "El 5 de marzo, el equipo del Observatorio realizó un evento conmemorativo donde se presentaron tres investigaciones sobre empoderamiento económico de mujeres.",
      contenidoCompleto: "El 5 de marzo, el equipo del Observatorio de Mercados Económicos y Opinión de UTEPSA realizó un evento conmemorativo por el Día Internacional de la Mujer, donde se presentaron tres importantes investigaciones enfocadas en el empoderamiento económico de las mujeres. Las investigaciones abordaron temas como las limitaciones del emprendimiento femenino en Santa Cruz, las condiciones laborales intergeneracionales desde la perspectiva de género, y el impacto de las políticas de inclusión en el mercado laboral cruceño. El evento contó con la participación de destacadas investigadoras del Observatorio y reunió a estudiantes, docentes y profesionales del sector empresarial.",
      imagen: "/noticias-dia-mujer-nueva.png"
    }
  ];

  // Interfaz para investigadores
  interface Investigador {
    id: string;
    nombre: string;
    cargo: string;
    area: string;
    imagen: string;
    publicaciones: string[];
    apellidoBusqueda?: string;
  }

  // Datos del equipo con fotos actualizadas
  const equipo: Investigador[] = [
    {
      id: "liliana-poquechoque",
      nombre: "MSc. Liliana Poquechoque Cortez",
      cargo: "Responsable del Observatorio",
      area: "Dirección",
      imagen: "/liliana-poquechoque.png",
      apellidoBusqueda: "Poquechoque",
      publicaciones: []
    },
    {
      id: "ramiro-munoz",
      nombre: "MSc. Ramiro Antonio Muñoz Arévalo",
      cargo: "Docente Investigador",
      area: "Investigación",
      imagen: "/ramiro-munoz.jpg",
      apellidoBusqueda: "Muñoz",
      publicaciones: []
    },
    {
      id: "monica-flores",
      nombre: "MSc. Mónica Gabriela Flores Vargas",
      cargo: "Docente Investigadora",
      area: "Investigación",
      imagen: "/Monica-Flores.png",
      apellidoBusqueda: "Flores",
      publicaciones: []
    },
    {
      id: "pedro-saavedra",
      nombre: "MSc. Pedro Cesar Saavedra Romero",
      cargo: "Docente Investigador",
      area: "Investigación",
      imagen: "/pedro-saavedra.jpg",
      apellidoBusqueda: "Saavedra",
      publicaciones: []
    },
    {
      id: "siomara-guzman",
      nombre: "MSc. Siomara Daniela Guzmán Cabrera",
      cargo: "Docente Investigadora",
      area: "Investigación",
      imagen: "/siomara-guzman.jpeg",
      apellidoBusqueda: "Guzmán",
      publicaciones: []
    },
    {
      id: "cristina-lia",
      nombre: "MSc. Cristina Lía",
      cargo: "Docente Investigadora",
      area: "Investigación",
      imagen: "/cristina-lia.jpg",
      apellidoBusqueda: "Cristina Lía",
      publicaciones: []
    },
    {
      id: "boniyil-vaca",
      nombre: "MSc. Boniyil Vaca Justiniano",
      cargo: "Docente Investigador",
      area: "Investigación",
      imagen: "/boniyil-vaca.jpg",
      apellidoBusqueda: "Vaca",
      publicaciones: []
    },
    {
      id: "hugo-villegas",
      nombre: "MSc. Hugo Villegas Barrios",
      cargo: "Docente Investigador",
      area: "Investigación",
      imagen: "/Hugo - Villegas.png",
      apellidoBusqueda: "Villegas",
      publicaciones: []
    },
    {
      id: "edwin-manani",
      nombre: "MSc. Edwin Mamani Ávila",
      cargo: "Docente Investigador",
      area: "Investigación",
      imagen: "/edwin-mamani.jpg",
      apellidoBusqueda: "Mamani",
      publicaciones: []
    },
    {
      id: "juan-pena",
      nombre: "MSc. Juan Carlos Peña",
      cargo: "Docente Investigador",
      area: "Investigación",
      imagen: "/juan-carlos-pena.jpg",
      apellidoBusqueda: "Peña",
      publicaciones: []
    },
    {
      id: "alberto-limpias",
      nombre: "MSc. Alberto Limpias Calvimontes",
      cargo: "Docente Investigador",
      area: "Investigación",
      imagen: "/Alberto-Limpias.jpg",
      apellidoBusqueda: "Limpias",
      publicaciones: []
    },
    {
      id: "raul-bonilla",
      nombre: "MSc. Raul Jerson Bonilla Sanchez",
      cargo: "Docente Investigador",
      area: "Investigación",
      imagen: "/Raul - Bonilla.png",
      apellidoBusqueda: "Bonilla",
      publicaciones: []
    },
    {
      id: "roger-quiller",
      nombre: "Lic. Roger Victor Quiller Irahola",
      cargo: "Docente Investigador",
      area: "Investigación",
      imagen: "/Roger-quiller.jpg",
      apellidoBusqueda: "Quiller",
      publicaciones: []
    },
    {
      id: "ruben-alvarez",
      nombre: "Lic. Rubén Oscar Alvarez Hinojosa",
      cargo: "Docente Investigador",
      area: "Investigación",
      imagen: "/Ruben-Alvarez.png",
      apellidoBusqueda: "Alvarez",
      publicaciones: []
    },
  ];

  const getPublicacionesDeInvestigador = (miembro: Investigador) => {
    const term = (miembro.apellidoBusqueda || miembro.nombre.replace(/^MSc\.\s*/i, '').split(' ').pop() || '').toLowerCase();
    return publicaciones.filter(pub => pub.autores.toLowerCase().includes(term));
  };

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
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo-utepsa.png" 
                  alt="UTEPSA Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className={`font-bold text-lg leading-tight transition-colors ${isScrolled ? 'text-utepsa-gray-dark' : 'text-white'}`}>
                  OBSERVATORIO
                </h1>
                <p className={`text-xs transition-colors ${isScrolled ? 'text-utepsa-gray-light' : 'text-white/80'}`}>
                  de Mercados Económicos y Opinión
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
            src="/hero-observatorio.jpg" 
            alt="Observatorio de Mercados" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-utepsa-red/90 via-utepsa-red/70 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <ScrollReveal animation="fadeIn" delay={0}>
              <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <BarChart3 className="w-3 h-3 mr-1" />
                UTEPSA - Investigación
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Observatorio de
                <span className="block">Mercados Económicos y Opinión</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl">
                Generando conocimiento estratégico a través de la investigación de mercados 
                y el análisis de opiniones para el desarrollo de Santa Cruz y Bolivia.
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={300}>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => scrollToSection('papers')}
                  className="bg-white text-utepsa-red hover:bg-white/90 px-8 py-6 text-base font-semibold"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Ver Papers
                </Button>
                <Button 
                  onClick={() => scrollToSection('club-elite')}
                  variant="outline" 
                  className="border-2 border-white bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 hover:border-white px-8 py-6 text-base font-semibold shadow-lg"
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Club Élite
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
                <p className="text-utepsa-gray-light text-lg mb-6 leading-relaxed">
                  El Observatorio de Mercados Económicos y Opinión de UTEPSA es un centro de investigación 
                  dedicado al análisis del comportamiento del consumidor, las tendencias de mercado 
                  y las opiniones ciudadanas en Santa Cruz de la Sierra y Bolivia.
                </p>
                <p className="text-utepsa-gray-light mb-8 leading-relaxed">
                  Nuestro objetivo es generar conocimiento científico de alta calidad que contribuya 
                  al desarrollo empresarial, académico y social de la región, mediante estudios 
                  rigurosos y análisis de datos actualizados.
                </p>
                
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <StatCounter target={12} label="Investigadores" delay={100} />
                  <StatCounter target={70} label="Publicaciones" delay={200} />
                  <StatCounter target={12} label="Años de experiencia" delay={300} />
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="slideInRight" delay={200}>
              <div className="relative">
                <img 
                  src="/quienes-somos.jpg" 
                  alt="Equipo del Observatorio" 
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-utepsa-red text-white p-6 rounded-xl shadow-xl">
                  <Award className="w-8 h-8 mb-2" />
                  <p className="font-semibold">Excelencia en</p>
                  <p className="text-sm opacity-90">Investigación</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Equipo */}
          <div className="mt-20">
            <ScrollReveal animation="fadeInUp" delay={0}>
              <h3 className="text-2xl font-bold text-utepsa-gray-dark mb-8 text-center">
                Nuestro Equipo de Investigadores
              </h3>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <p className="text-center text-utepsa-gray-light mb-8">
                Haz clic en un investigador para ver sus publicaciones
              </p>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {equipo.map((miembro, index) => (
                <ScrollReveal key={index} animation="fadeInUp" delay={150 + index * 100}>
                  <Card 
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                    onClick={() => setInvestigadorSeleccionado(miembro)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-20 h-20 bg-utepsa-red/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-utepsa-red group-hover:scale-110 transition-all duration-300 overflow-hidden">
                        {miembro.imagen ? (
                          <img 
                            src={miembro.imagen} 
                            alt={miembro.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-utepsa-red font-bold text-xl group-hover:text-white transition-colors">
                            {miembro.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-utepsa-gray-dark text-sm mb-1 group-hover:text-utepsa-red transition-colors">
                        {miembro.nombre}
                      </h4>
                      <p className="text-xs text-utepsa-gray-light">{miembro.cargo}</p>
                      {(() => {
                        const pubsDelMiembro = getPublicacionesDeInvestigador(miembro);
                        return pubsDelMiembro.length > 0 && (
                          <Badge
                            className="mt-2 bg-utepsa-red/10 text-utepsa-red text-xs cursor-pointer hover:bg-utepsa-red hover:text-white transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              const term = miembro.apellidoBusqueda || miembro.nombre.replace(/^MSc\.\s*/i, '').split(' ').pop() || '';
                              setFiltroAutorPublicacion(term);
                              setMostrarTodasPublicaciones(true);
                              setTimeout(() => document.querySelector('#publicaciones')?.scrollIntoView({ behavior: 'smooth' }), 50);
                            }}
                          >
                            {pubsDelMiembro.length} publicación{pubsDelMiembro.length !== 1 ? 'es' : ''}
                          </Badge>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Papers Section */}
      <section id="papers" className="py-20 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ScrollReveal animation="fadeIn" delay={0}>
              <Badge className="mb-4 bg-utepsa-red/10 text-utepsa-red border-utepsa-red/20">
                <FileText className="w-3 h-3 mr-1" />
                Investigación Académica
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <h2 className="text-3xl sm:text-4xl font-bold text-utepsa-gray-dark mb-4">
                Papers del Observatorio
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p className="text-utepsa-gray-light max-w-2xl mx-auto">
                Descubre nuestras investigaciones científicas más recientes. 
                Haz clic en cualquier paper para ver el resumen y acceder al documento completo.
              </p>
            </ScrollReveal>
          </div>

          {/* Sistema de Búsqueda Avanzada para Papers */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-utepsa-gray-dark flex items-center">
                <Search className="w-5 h-5 mr-2 text-utepsa-red" />
                Búsqueda Avanzada de Papers
              </h3>
              <Button 
                variant="outline" 
                onClick={() => setMostrarFiltrosPapers(!mostrarFiltrosPapers)}
                className="text-utepsa-red border-utepsa-red/30 hover:bg-utepsa-red/10"
              >
                {mostrarFiltrosPapers ? 'Ocultar filtros' : 'Mostrar filtros'}
              </Button>
            </div>

            {mostrarFiltrosPapers && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                {/* Filtro Año */}
                <div>
                  <label className="block text-sm font-medium text-utepsa-gray-dark mb-1">
                    Año
                  </label>
                  <select 
                    value={filtroAñoPaper}
                    onChange={(e) => setFiltroAñoPaper(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                  >
                    <option value="">Todos los años</option>
                    {añosPapers.map(año => (
                      <option key={año} value={año}>{año}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro Categoría */}
                <div>
                  <label className="block text-sm font-medium text-utepsa-gray-dark mb-1">
                    Categoría
                  </label>
                  <select 
                    value={filtroCategoriaPaper}
                    onChange={(e) => setFiltroCategoriaPaper(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                  >
                    <option value="">Todas las categorías</option>
                    {categoriasPapers.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro Autor */}
                <div>
                  <label className="block text-sm font-medium text-utepsa-gray-dark mb-1">
                    Autor
                  </label>
                  <Input 
                    value={filtroAutorPaper}
                    onChange={(e) => setFiltroAutorPaper(e.target.value)}
                    placeholder="Buscar por autor..."
                    className="bg-white"
                  />
                </div>

                {/* Filtro Palabras Clave */}
                <div>
                  <label className="block text-sm font-medium text-utepsa-gray-dark mb-1">
                    Palabras clave
                  </label>
                  <Input 
                    value={filtroPalabrasClavePaper}
                    onChange={(e) => setFiltroPalabrasClavePaper(e.target.value)}
                    placeholder="Buscar por tema..."
                    className="bg-white"
                  />
                </div>
              </div>
            )}

            {/* Botones de acción */}
            {mostrarFiltrosPapers && (
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
                <Button 
                  onClick={() => {
                    setFiltroAñoPaper('');
                    setFiltroCategoriaPaper('');
                    setFiltroAutorPaper('');
                    setFiltroPalabrasClavePaper('');
                  }}
                  variant="outline"
                  className="text-utepsa-gray-light"
                >
                  Limpiar filtros
                </Button>
                <Badge className="bg-utepsa-red/10 text-utepsa-red border-utepsa-red/20 self-center">
                  {papersAMostrar.length} resultado{papersAMostrar.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            )}
          </div>

          {/* Grid de Papers */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papersAMostrar.map((paper, index) => (
              <Card 
                key={index} 
                className="hover:shadow-card-hover transition-all duration-300 group cursor-pointer hover:-translate-y-1"
                onClick={() => setPaperSeleccionado(paper)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-end mb-2">
                    <span className="text-sm text-utepsa-gray-light flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {paper.año}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-utepsa-red transition-colors">
                    {paper.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-utepsa-gray-light mb-4 line-clamp-2">
                    <span className="font-medium">Autores:</span> {paper.autores}
                  </p>
                  <div className="flex items-center text-utepsa-red font-medium text-sm">
                    <span>Ver resumen y descargar</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {papersAMostrar.length === 0 && (
            <div className="text-center py-12">
              <p className="text-utepsa-gray-light">No se encontraron papers con los filtros seleccionados.</p>
              <Button 
                onClick={() => {
                  setFiltroAñoPaper('');
                  setFiltroCategoriaPaper('');
                  setFiltroAutorPaper('');
                  setFiltroPalabrasClavePaper('');
                }}
                variant="outline"
                className="mt-4 text-utepsa-red border-utepsa-red/30"
              >
                Limpiar filtros
              </Button>
            </div>
          )}

          {/* Mensaje sobre papers ocultos */}
          {!filtroAñoPaper && !filtroCategoriaPaper && !filtroAutorPaper && !filtroPalabrasClavePaper && (
            <div className="text-center mt-8 p-6 bg-utepsa-red/5 rounded-xl">
              <p className="text-utepsa-gray-dark text-sm">
                <span className="font-semibold">¿Buscas más papers?</span> Usa la búsqueda avanzada para descubrir nuestra colección completa de investigaciones.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Publicaciones Section - Organizado por Líneas de Investigación */}
      <section id="publicaciones" className="py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ScrollReveal animation="fadeIn" delay={0}>
              <Badge className="mb-4 bg-utepsa-red/10 text-utepsa-red border-utepsa-red/20">
                <BookOpen className="w-3 h-3 mr-1" />
                Líneas de Investigación
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <h2 className="text-3xl sm:text-4xl font-bold text-utepsa-gray-dark mb-4">
                Publicaciones por Área
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p className="text-utepsa-gray-light max-w-2xl mx-auto">
                Nuestras investigaciones se organizan en 5 líneas estratégicas de desarrollo.
              </p>
            </ScrollReveal>
          </div>

          {/* Líneas de Investigación */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {lineasInvestigacion.map((linea) => (
              <button
                key={linea.id}
                onClick={() => setFiltroLinea(filtroLinea === linea.id ? '' : linea.id)}
                className={`p-4 rounded-xl text-center transition-all ${
                  filtroLinea === linea.id 
                    ? `${linea.color} text-white shadow-lg scale-105` 
                    : 'bg-gray-100 hover:bg-gray-200 text-utepsa-gray-dark'
                }`}
              >
                <div className={`mx-auto mb-2 ${filtroLinea === linea.id ? 'text-white' : 'text-utepsa-gray-light'}`}>
                  {linea.icono}
                </div>
                <p className="text-xs font-medium">{linea.nombre}</p>
              </button>
            ))}
          </div>

          {/* Filtro por año */}
          <div className="flex justify-center mb-8">
            <select 
              value={filtroAño}
              onChange={(e) => setFiltroAño(e.target.value)}
              className="h-10 px-4 rounded-full border border-gray-200 bg-white text-sm"
            >
              <option value="">Todos los años</option>
              {añosDisponibles.map(año => (
                <option key={año} value={año}>{año}</option>
              ))}
            </select>
          </div>

          {/* Chip de filtro por autor activo */}
          {filtroAutorPublicacion && (
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-utepsa-red/10 text-utepsa-red rounded-full text-sm font-medium">
                Investigador: {filtroAutorPublicacion}
                <button
                  onClick={() => setFiltroAutorPublicacion('')}
                  className="ml-1 hover:text-utepsa-red/60 font-bold text-base leading-none"
                >×</button>
              </span>
            </div>
          )}

          {/* Grid de Publicaciones */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(mostrarTodasPublicaciones ? publicacionesFiltradas : publicacionesFiltradas.slice(0, 9)).map((pub, index) => {
              const lineaInfo = lineasInvestigacion.find(l => l.id === pub.linea);
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-card-hover transition-all duration-300 group overflow-hidden cursor-pointer"
                  onClick={() => setPublicacionSeleccionada(pub)}
                >
                  {/* Imagen de la publicación */}
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={pub.imagen || '/publicaciones-bg.jpg'} 
                      alt={pub.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      {lineaInfo && (
                        <Badge className={`${lineaInfo.color} text-white`}>
                          {lineaInfo.nombre}
                        </Badge>
                      )}
                      <span className="text-sm text-utepsa-gray-light flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {pub.año}
                      </span>
                    </div>
                    <CardTitle className="text-base leading-tight group-hover:text-utepsa-red transition-colors">
                      {pub.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-utepsa-gray-light mb-4">
                      <span className="font-medium">{pub.autores}</span>
                    </p>
                    {pub.enlace ? (
                      <span 
                        className="inline-flex items-center text-utepsa-red hover:text-utepsa-red/80 font-medium text-sm"
                      >
                        Ver publicación <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                        Próximamente
                      </span>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {publicacionesFiltradas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-utepsa-gray-light">No se encontraron publicaciones con los filtros seleccionados.</p>
              <Button 
                onClick={() => {
                  setFiltroLinea('');
                  setFiltroAño('');
                  setFiltroAutorPublicacion('');
                }}
                variant="outline"
                className="mt-4 text-utepsa-red border-utepsa-red/30"
              >
                Limpiar filtros
              </Button>
            </div>
          )}

          {publicacionesFiltradas.length > 9 && (
            <div className="text-center mt-10">
              <button
                onClick={() => setMostrarTodasPublicaciones(!mostrarTodasPublicaciones)}
                className="inline-flex items-center px-6 py-3 bg-utepsa-red hover:bg-utepsa-red/90 text-white rounded-lg font-medium transition-colors"
              >
                {mostrarTodasPublicaciones ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Ver menos publicaciones
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver todas las publicaciones ({publicacionesFiltradas.length})
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Noticias Section */}
      <section id="noticias" className="py-20 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ScrollReveal animation="fadeIn" delay={0}>
              <Badge className="mb-4 bg-utepsa-red/10 text-utepsa-red border-utepsa-red/20">
                <Newspaper className="w-3 h-3 mr-1" />
                Actualidad
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <h2 className="text-3xl sm:text-4xl font-bold text-utepsa-gray-dark mb-4">
                Noticias y Eventos
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p className="text-utepsa-gray-light max-w-2xl mx-auto">
                Mantente informado sobre las últimas novedades del Observatorio.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {noticias.map((noticia, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
                {noticia.imagenExtra ? (
                  <div className="grid grid-cols-2 h-48">
                    <div className="overflow-hidden">
                      <img 
                        src={noticia.imagen} 
                        alt={noticia.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <img 
                        src={noticia.imagenExtra} 
                        alt={`${noticia.titulo} - imagen 2`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-56 overflow-hidden">
                    <img
                      src={noticia.imagen}
                      alt={noticia.titulo}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-utepsa-gray-light mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    {noticia.fecha}
                  </div>
                  <h3 className="font-bold text-utepsa-gray-dark mb-3 group-hover:text-utepsa-red transition-colors">
                    {noticia.titulo}
                  </h3>
                  <p className="text-sm text-utepsa-gray-light mb-4">
                    {noticia.resumen}
                  </p>
                  <Button 
                    variant="ghost" 
                    className="text-utepsa-red hover:bg-utepsa-red/10 p-0 h-auto"
                    onClick={() => setNoticiaSeleccionada(noticia)}
                  >
                    Leer más <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Súmate Section - Solo para Empresas */}
      <section id="sumate" className="py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ScrollReveal animation="fadeIn" delay={0}>
              <Badge className="mb-4 bg-utepsa-red/10 text-utepsa-red border-utepsa-red/20">
                <Building2 className="w-3 h-3 mr-1" />
                Vinculación Empresarial
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <h2 className="text-3xl sm:text-4xl font-bold text-utepsa-gray-dark mb-4">
                Súmate al Observatorio
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p className="text-utepsa-gray-light max-w-3xl mx-auto text-lg italic">
                "Impulsa el crecimiento de tu empresa con estudios estratégicos respaldados por UTEPSA. Conversemos hoy"
              </p>
            </ScrollReveal>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Beneficios para Empresas */}
            <ScrollReveal animation="slideInLeft" delay={0}>
              <div className="bg-utepsa-gray-dark p-8 rounded-2xl text-white">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Beneficios para tu Empresa</h3>
                    <p className="text-sm text-white/70">Potencia tu negocio con investigación aplicada</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {[
                    'Acceso a estudios y análisis sectoriales especializados',
                    'Investigación aplicada a las necesidades de tu empresa',
                    'Participación en proyectos académicos de alto impacto',
                    'Vinculación directa con talento universitario',
                    'Posibilidad de generar proyectos colaborativos',
                    'Contacto con estudiantes para prácticas y pasantías',
                    'Networking con otras empresas del sector',
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
                    "La colaboración con el Observatorio nos permitió entender mejor nuestro mercado objetivo."
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Botón para mostrar formulario */}
            <ScrollReveal animation="slideInRight" delay={200}>
              <div className="flex flex-col justify-center items-center">
              {!mostrarFormularioEmpresa ? (
                <div className="text-center">
                  <div className="w-24 h-24 bg-utepsa-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building2 className="w-12 h-12 text-utepsa-red" />
                  </div>
                  <h3 className="text-2xl font-bold text-utepsa-gray-dark mb-4">
                    ¿Listo para impulsar tu empresa?
                  </h3>
                  <p className="text-utepsa-gray-light mb-8 max-w-md">
                    Completa el formulario y nos pondremos en contacto contigo para conversar sobre cómo podemos colaborar.
                  </p>
                  <Button 
                    onClick={() => setMostrarFormularioEmpresa(true)}
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
                      onClick={() => setMostrarFormularioEmpresa(false)}
                      className="text-utepsa-gray-light hover:text-utepsa-red"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-utepsa-gray-dark mb-1">
                        Nombre de la empresa *
                      </label>
                      <Input placeholder="Nombre de tu empresa" className="bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-utepsa-gray-dark mb-1">
                        Sector *
                      </label>
                      <Input placeholder="Ej: Tecnología, Retail, Manufactura" className="bg-white" />
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
                        <Input placeholder="Ej: Gerente de RRHH" className="bg-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-utepsa-gray-dark mb-1">
                        Correo electrónico *
                      </label>
                      <Input type="email" placeholder="correo@empresa.com" className="bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-utepsa-gray-dark mb-1">
                        Tipo de vinculación *
                      </label>
                      <div className="space-y-2">
                        {[
                          { id: 'pasantias', label: 'Pasantías' },
                          { id: 'investigacion', label: 'Investigación conjunta' },
                          { id: 'estudio', label: 'Solicitud de estudio' },
                          { id: 'eventos', label: 'Charlas / eventos' }
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
                        placeholder="Cuéntanos más sobre tu interés en vincularte con el Observatorio..." 
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

      {/* Club Élite Section - Para Estudiantes (Estilo colorido y juvenil) */}
      <section id="club-elite" className="py-20 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Header con imagen de fondo */}
          <ScrollReveal animation="fadeIn" delay={0}>
            <div className="relative rounded-3xl overflow-hidden mb-12">
              <img 
                src="/club-elite-jovenes.jpg" 
                alt="Jóvenes investigando" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src="/logo-elite.png" 
                      alt="Club Élite Logo" 
                      className="w-16 h-16 rounded-full bg-white p-2"
                    />
                    <div>
                      <Badge className="bg-yellow-400 text-black border-yellow-400 mb-2">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Programa Estudiantil Exclusivo
                      </Badge>
                      <h2 className="text-4xl sm:text-5xl font-bold text-white">
                        Club Élite
                      </h2>
                    </div>
                  </div>
                  <p className="text-white/90 max-w-2xl text-lg">
                    Un programa exclusivo para estudiantes destacados que desean desarrollar 
                    su potencial en investigación de mercados y análisis de datos.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Beneficios del Club Élite - Estilo colorido */}
            <ScrollReveal animation="slideInLeft" delay={100}>
              <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center transform rotate-3">
                    <Rocket className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">¿Por qué unirte?</h3>
                    <p className="text-pink-500 font-medium">Para Estudiantes Ambiciosos</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: <Target className="w-4 h-4" />, text: 'Investigaciones aplicadas reales' },
                    { icon: <BarChart3 className="w-4 h-4" />, text: 'Análisis de datos con empresas' },
                    { icon: <Award className="w-4 h-4" />, text: 'Certificación académica' },
                    { icon: <Lightbulb className="w-4 h-4" />, text: 'Habilidades de investigación' },
                    { icon: <FileText className="w-4 h-4" />, text: 'Publicaciones y coautorías' },
                    { icon: <Users className="w-4 h-4" />, text: 'Networking empresarial' },
                    { icon: <Star className="w-4 h-4" />, text: 'Fortalecimiento del CV' },
                    { icon: <Rocket className="w-4 h-4" />, text: 'Pasantías vinculadas' },
                  ].map((beneficio, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl">
                      <span className="text-pink-500">{beneficio.icon}</span>
                      <span className="text-gray-700 text-sm font-medium">{beneficio.text}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl border-l-4 border-orange-400">
                  <p className="text-gray-700 font-semibold text-center italic">
                    "El Club Élite me permitió graduarme con experiencia profesional real y conexiones valiosas."
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Botón para mostrar formulario - Estilo juvenil */}
            <ScrollReveal animation="slideInRight" delay={200}>
              <div className="flex flex-col justify-center items-center">
              {!mostrarFormularioEstudiante ? (
                <div className="text-center bg-white/10 backdrop-blur-sm p-10 rounded-3xl">
                  <div className="w-28 h-28 bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <GraduationCap className="w-14 h-14 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    ¿Quieres ser parte del Club Élite?
                  </h3>
                  <p className="text-white/80 mb-8 max-w-md text-lg">
                    Postula ahora y comienza tu camino hacia la excelencia en investigación.
                  </p>
                  <Button 
                    onClick={() => setMostrarFormularioEstudiante(true)}
                    className="bg-white text-pink-600 hover:bg-yellow-300 hover:text-pink-700 px-10 py-7 text-xl font-bold rounded-full shadow-xl transition-all hover:scale-105"
                  >
                    <Sparkles className="w-6 h-6 mr-2" />
                    ¡Postular Ahora!
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-3xl shadow-2xl w-full animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Postula al Club Élite
                      </h3>
                    </div>
                    <button 
                      onClick={() => setMostrarFormularioEstudiante(false)}
                      className="text-gray-400 hover:text-pink-500 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <form className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre completo *
                        </label>
                        <Input placeholder="Tu nombre" className="bg-gray-50 border-pink-200 focus:border-pink-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Carrera *
                        </label>
                        <Input placeholder="Ej: Marketing" className="bg-gray-50 border-pink-200 focus:border-pink-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Semestre *
                      </label>
                      <select className="w-full h-10 px-3 rounded-md border border-pink-200 bg-gray-50 text-sm focus:border-pink-500">
                        <option value="">Selecciona tu semestre</option>
                        <option value="1">1° Semestre</option>
                        <option value="2">2° Semestre</option>
                        <option value="3">3° Semestre</option>
                        <option value="4">4° Semestre</option>
                        <option value="5">5° Semestre</option>
                        <option value="6">6° Semestre</option>
                        <option value="7">7° Semestre</option>
                        <option value="8">8° Semestre</option>
                        <option value="9">9° Semestre o más</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Áreas de interés *
                      </label>
                      <Input placeholder="Ej: Análisis de datos, investigación de mercados" className="bg-gray-50 border-pink-200 focus:border-pink-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ¿Has trabajado con datos antes? *
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" name="experiencia" className="text-pink-500 focus:ring-pink-500" />
                          <span className="text-sm text-gray-700">Sí</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" name="experiencia" className="text-pink-500 focus:ring-pink-500" />
                          <span className="text-sm text-gray-700">No</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Motivación (breve) *
                      </label>
                      <Textarea 
                        placeholder="Cuéntanos por qué quieres unirte al Club Élite..." 
                        rows={3}
                        className="bg-gray-50 resize-none border-pink-200 focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CV adjunto
                      </label>
                      <div className="border-2 border-dashed border-pink-200 rounded-xl p-4 text-center hover:border-pink-500 hover:bg-pink-50 transition-all cursor-pointer">
                        <FileText className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Arrastra tu CV aquí o haz clic para seleccionar</p>
                        <p className="text-xs text-gray-400 mt-1">PDF, DOC o DOCX (máx. 5MB)</p>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white py-5 rounded-xl font-bold">
                      <Rocket className="w-5 h-5 mr-2" />
                      Enviar Postulación
                    </Button>
                  </form>
                </div>
              )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Modal del Paper */}
      {paperSeleccionado && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setPaperSeleccionado(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="relative bg-gradient-to-r from-utepsa-red to-utepsa-red/80 p-6">
              <button
                onClick={() => setPaperSeleccionado(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-3">
                  {paperSeleccionado.categoria} • {paperSeleccionado.año}
                </Badge>
                <h3 className="text-xl font-bold text-white">{paperSeleccionado.titulo}</h3>
                <p className="text-white/80 text-sm mt-2">{paperSeleccionado.autores}</p>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-utepsa-gray-dark mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-utepsa-red" />
                  Resumen
                </h4>
                <p className="text-utepsa-gray-light leading-relaxed">
                  {paperSeleccionado.resumen}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-utepsa-gray-dark mb-2">
                  Palabras clave
                </h4>
                <div className="flex flex-wrap gap-2">
                  {paperSeleccionado.palabrasClave.split(',').map((palabra, idx) => (
                    <Badge key={idx} variant="outline" className="text-utepsa-red border-utepsa-red/30">
                      {palabra.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <a
                  href={paperSeleccionado.enlacePDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-6 py-4 bg-utepsa-red hover:bg-utepsa-red/90 text-white rounded-lg font-medium transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Descargar Paper (PDF)
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal del Investigador */}
      {investigadorSeleccionado && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setInvestigadorSeleccionado(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="relative bg-gradient-to-r from-utepsa-red to-utepsa-red/80 p-6">
              <button
                onClick={() => setInvestigadorSeleccionado(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                  {investigadorSeleccionado.imagen ? (
                    <img 
                      src={investigadorSeleccionado.imagen} 
                      alt={investigadorSeleccionado.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-utepsa-red font-bold text-2xl">
                      {investigadorSeleccionado.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  )}
                </div>
                <div className="text-white">
                  <h3 className="text-xl font-bold">{investigadorSeleccionado.nombre}</h3>
                  <p className="text-white/80">{investigadorSeleccionado.cargo}</p>
                  <Badge className="mt-2 bg-white/20 text-white border-white/30">
                    {investigadorSeleccionado.area}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              {(() => {
                const pubsModal = getPublicacionesDeInvestigador(investigadorSeleccionado);
                return pubsModal.length > 0 ? (
                  <div>
                    <h4 className="text-lg font-semibold text-utepsa-gray-dark mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-utepsa-red" />
                      Publicaciones ({pubsModal.length})
                    </h4>
                    <div className="space-y-3">
                      {pubsModal.map((pub, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-gray-50 rounded-lg hover:bg-utepsa-red/5 transition-colors border-l-4 border-utepsa-red"
                        >
                          {pub.enlace && pub.enlace !== '#' ? (
                            <a href={pub.enlace} target="_blank" rel="noopener noreferrer" className="text-utepsa-gray-dark text-sm hover:text-utepsa-red transition-colors">
                              {pub.titulo} <span className="text-utepsa-gray-light">({pub.año})</span>
                            </a>
                          ) : (
                            <p className="text-utepsa-gray-dark text-sm">
                              {pub.titulo} <span className="text-utepsa-gray-light">({pub.año})</span>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-utepsa-gray-light mx-auto mb-3" />
                    <p className="text-utepsa-gray-light">Este investigador aún no tiene publicaciones registradas.</p>
                  </div>
                );
              })()}

              <div className="mt-6 pt-4 border-t">
                <Button 
                  onClick={() => setInvestigadorSeleccionado(null)}
                  className="w-full bg-utepsa-red hover:bg-utepsa-red/90"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Noticia */}
      {noticiaSeleccionada && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setNoticiaSeleccionada(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="relative bg-gradient-to-r from-utepsa-red to-utepsa-red/80 p-6">
              <button
                onClick={() => setNoticiaSeleccionada(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-3">
                  <Calendar className="w-3 h-3 mr-1" />
                  {noticiaSeleccionada.fecha}
                </Badge>
                <h3 className="text-xl font-bold text-white">{noticiaSeleccionada.titulo}</h3>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              {/* Imágenes */}
              {noticiaSeleccionada.imagenExtra ? (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-xl overflow-hidden">
                    <img 
                      src={noticiaSeleccionada.imagen} 
                      alt={noticiaSeleccionada.titulo}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden">
                    <img 
                      src={noticiaSeleccionada.imagenExtra} 
                      alt={`${noticiaSeleccionada.titulo} - imagen 2`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden mb-6">
                  <img
                    src={noticiaSeleccionada.imagen}
                    alt={noticiaSeleccionada.titulo}
                    className="w-full max-h-80 object-contain bg-gray-50"
                  />
                </div>
              )}

              {/* Descripción completa */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-utepsa-gray-dark mb-3">Descripción</h4>
                <p className="text-utepsa-gray-light leading-relaxed">
                  {noticiaSeleccionada.contenidoCompleto || noticiaSeleccionada.resumen}
                </p>
                {noticiaSeleccionada.enlace && (
                  <a
                    href={noticiaSeleccionada.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-4 px-4 py-2 bg-utepsa-red/10 text-utepsa-red rounded-lg text-sm font-medium hover:bg-utepsa-red hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Revista Economy
                  </a>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 mb-4">
                <p className="text-xs text-gray-400 mb-2">Compartir</p>
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(noticiaSeleccionada.titulo + ' - ' + 'https://omeo-utepsa.vercel.app')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://omeo-utepsa.vercel.app')}&quote=${encodeURIComponent(noticiaSeleccionada.titulo)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(noticiaSeleccionada.titulo)}&url=${encodeURIComponent('https://omeo-utepsa.vercel.app')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.847L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    X
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={() => setNoticiaSeleccionada(null)}
                  className="w-full bg-utepsa-red hover:bg-utepsa-red/90"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Publicación */}
      {publicacionSeleccionada && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setPublicacionSeleccionada(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="relative bg-gradient-to-r from-utepsa-red to-utepsa-red/80 p-6">
              <button
                onClick={() => setPublicacionSeleccionada(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-3">
                  <Calendar className="w-3 h-3 mr-1" />
                  {publicacionSeleccionada.año}
                </Badge>
                <h3 className="text-xl font-bold text-white">{publicacionSeleccionada.titulo}</h3>
                <p className="text-white/80 text-sm mt-2">{publicacionSeleccionada.autores}</p>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              {/* Imagen */}
              <div className="rounded-xl overflow-hidden mb-6">
                <img 
                  src={publicacionSeleccionada.imagen || '/publicaciones-bg.jpg'} 
                  alt={publicacionSeleccionada.titulo}
                  className="w-full h-56 object-cover"
                />
              </div>

              {/* Resumen completo */}
              {publicacionSeleccionada.resumen && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-utepsa-gray-dark mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-utepsa-red" />
                    Resumen
                  </h4>
                  <p className="text-utepsa-gray-light leading-relaxed whitespace-pre-line">
                    {publicacionSeleccionada.resumen}
                  </p>
                </div>
              )}

              {/* Enlace */}
              {publicacionSeleccionada.enlace && (
                <div className="pt-4 border-t">
                  <a
                    href={publicacionSeleccionada.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-6 py-4 bg-utepsa-red hover:bg-utepsa-red/90 text-white rounded-lg font-medium transition-colors"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Ver publicación completa
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              )}

              <div className="mt-4">
                <Button 
                  onClick={() => setPublicacionSeleccionada(null)}
                  variant="outline"
                  className="w-full"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante de WhatsApp */}
      <a
        href="https://wa.link/ncki4q"
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
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src="/logo-utepsa.png" 
                    alt="UTEPSA Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold">OBSERVATORIO</h3>
                  <p className="text-xs text-white/60">de Mercados Económicos y Opinión</p>
                </div>
              </div>
              <p className="text-sm text-white/70">
                Generando conocimiento estratégico para el desarrollo de Santa Cruz y Bolivia.
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
                  omeo@utepsa.edu.bo
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-utepsa-red" />
                  +591 (3) 3639000
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="text-white hover:text-utepsa-red hover:bg-white/10">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-utepsa-red hover:bg-white/10">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-utepsa-red hover:bg-white/10">
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-utepsa-red hover:bg-white/10">
                  <Instagram className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          
          <Separator className="bg-white/10 my-8" />
          
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-white/60">
            <p>© 2025 Observatorio de Mercados Económicos y Opinión - UTEPSA. Todos los derechos reservados.</p>
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
