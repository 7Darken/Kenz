import { type Localized } from "@/i18n/localize";

/* ═══════════════════════════════════════════
   ITINERARIES — the day-by-day trips behind my YouTube videos.
   One entry = one public page at /itineraire/[slug].
   ═══════════════════════════════════════════ */

export type ActivityKind = "sight" | "food" | "nature" | "night" | "transport" | "shopping";

export type DayIcon =
  | "arrival"
  | "palace"
  | "wall"
  | "temple"
  | "plane"
  | "train"
  | "city"
  | "river"
  | "mountain"
  | "garden"
  | "skyline"
  | "water"
  | "departure";

export type TravelMode = "plane" | "train";

export type EssentialIcon = "visa" | "payment" | "internet" | "transport" | "season" | "language";

/** Local price in CNY (¥). `min: 0` without `max` means free. */
export interface PriceRange {
  min: number;
  max?: number;
}

export interface ItineraryCity {
  id: string;
  name: Localized;
  hanzi: string;
  color: string;
  tagline: Localized;
  /** Schematic position on the route map (SVG viewBox 100 × 80) and label side. */
  map: { x: number; y: number; label: "top" | "bottom" | "left" | "right" };
}

export interface ItineraryActivity {
  /** Local time, 24h "HH:MM". */
  time: string;
  kind: ActivityKind;
  title: Localized;
  description: Localized;
  durationMin: number;
  price?: PriceRange;
  tip?: Localized;
  /** Search query for the map link. */
  place?: string;
}

export interface ItineraryDay {
  city: string;
  /** Set on days spent moving from one city to the next. */
  travel?: { from: string; mode: TravelMode; duration: Localized };
  icon: DayIcon;
  title: Localized;
  /** Short label shown in the calendar cell. */
  highlight: Localized;
  summary: Localized;
  stay?: Localized;
  /** On-site spend in EUR: activities, food and local transport (no hotel, no flights). */
  budgetEur: { min: number; max: number };
  activities: ItineraryActivity[];
  /** Where this day starts in the YouTube video, in seconds. */
  videoTimestamp?: number;
}

export interface Itinerary {
  slug: string;
  countryCode: string;
  hanzi: string;
  title: Localized;
  description: Localized;
  season: Localized;
  thumbnail: string;
  /** Destination UTC offset in hours: activity times are local, the calendar export needs absolute times. */
  utcOffsetHours: number;
  /** YouTube video id. Without it, the page links to the channel instead. */
  youtubeVideoId?: string;
  cities: ItineraryCity[];
  days: ItineraryDay[];
  essentials: { icon: EssentialIcon; title: Localized; text: Localized }[];
  checklist: { id: string; label: Localized }[];
}

/* ═══════════════════════════════════════════
   CHINA — 14 days
   ═══════════════════════════════════════════ */

const china: Itinerary = {
  slug: "chine",
  countryCode: "cn",
  hanzi: "中国",
  title: { fr: "14 jours en Chine", en: "14 days in China" },
  description: {
    fr: "L'itinéraire exact de ma vidéo : 4 villes, chaque activité avec horaires, prix et astuces. Choisis ta date de départ et ajoute tout à ton agenda.",
    en: "The exact route from my video: 4 cities, every activity with times, prices and tips. Pick your start date and add it all to your calendar.",
  },
  season: { fr: "Automne", en: "Autumn" },
  thumbnail: "/images/destinations/Chine.webp",
  // China runs on a single timezone, UTC+8, with no daylight saving.
  utcOffsetHours: 8,
  cities: [
    {
      id: "beijing",
      name: { fr: "Pékin", en: "Beijing" },
      hanzi: "北京",
      color: "#ff5a4e",
      tagline: { fr: "La capitale impériale", en: "The imperial capital" },
      map: { x: 66, y: 16, label: "right" },
    },
    {
      id: "chongqing",
      name: { fr: "Chongqing", en: "Chongqing" },
      hanzi: "重庆",
      color: "#ffa53d",
      tagline: { fr: "La mégalopole cyberpunk", en: "The cyberpunk megacity" },
      map: { x: 15, y: 54, label: "top" },
    },
    {
      id: "wulong",
      name: { fr: "Wulong", en: "Wulong" },
      hanzi: "武隆",
      color: "#2fd6a3",
      tagline: { fr: "Karst & ponts naturels", en: "Karst & natural bridges" },
      map: { x: 30, y: 68, label: "bottom" },
    },
    {
      id: "shanghai",
      name: { fr: "Shanghai", en: "Shanghai" },
      hanzi: "上海",
      color: "#6f8cff",
      tagline: { fr: "La skyline du futur", en: "The skyline of the future" },
      map: { x: 86, y: 50, label: "bottom" },
    },
  ],
  days: [
    /* ── Day 1 ── */
    {
      city: "beijing",
      icon: "arrival",
      title: { fr: "Arrivée à Pékin", en: "Landing in Beijing" },
      highlight: { fr: "Hutongs", en: "Hutongs" },
      summary: {
        fr: "On pose les valises au cœur de la vieille ville et on se met direct dans le bain : ruelles, lanternes et premier canard laqué.",
        en: "Drop the bags in the old town and dive straight in: alleys, lanterns and a first Peking duck.",
      },
      stay: { fr: "Dongcheng, près des hutongs", en: "Dongcheng, near the hutongs" },
      budgetEur: { min: 35, max: 60 },
      activities: [
        {
          time: "10:00",
          kind: "transport",
          title: { fr: "Arrivée & transfert", en: "Arrival & transfer" },
          description: {
            fr: "Depuis l'aéroport (PEK ou PKX), Airport Express ou DiDi jusqu'à l'hôtel. Compte environ 1 h.",
            en: "From the airport (PEK or PKX), take the Airport Express or a DiDi to the hotel. Allow about 1 h.",
          },
          durationMin: 75,
          price: { min: 25, max: 120 },
          tip: {
            fr: "Configure Alipay et ton eSIM avant d'atterrir : ici, tout se paie par QR code.",
            en: "Set up Alipay and your eSIM before landing — everything here is paid by QR code.",
          },
          place: "Beijing Capital International Airport",
        },
        {
          time: "15:00",
          kind: "sight",
          title: { fr: "Hutongs de Nanluoguxiang", en: "Nanluoguxiang hutongs" },
          description: {
            fr: "Balade dans les ruelles traditionnelles, entre maisons à cour carrée (siheyuan) et petites échoppes.",
            en: "Wander the traditional alleys, between courtyard houses (siheyuan) and tiny shops.",
          },
          durationMin: 120,
          price: { min: 0 },
          tip: {
            fr: "Sors de la rue principale : les ruelles parallèles sont bien plus authentiques.",
            en: "Step off the main street — the side alleys are far more authentic.",
          },
          place: "Nanluoguxiang Beijing",
        },
        {
          time: "17:30",
          kind: "sight",
          title: { fr: "Tours du Tambour et de la Cloche", en: "Drum & Bell Towers" },
          description: {
            fr: "Deux tours du XIIIe siècle. Au coucher du soleil, la vue sur les toits des hutongs est superbe.",
            en: "Two 13th-century towers. At sunset, the view over the hutong rooftops is superb.",
          },
          durationMin: 60,
          price: { min: 30 },
          place: "Beijing Drum Tower",
        },
        {
          time: "19:30",
          kind: "food",
          title: { fr: "Canard laqué chez Siji Minfu", en: "Peking duck at Siji Minfu" },
          description: {
            fr: "Le classique pékinois : peau croustillante, crêpes fines et sauce hoisin.",
            en: "The Beijing classic: crispy skin, thin pancakes and hoisin sauce.",
          },
          durationMin: 90,
          price: { min: 150, max: 250 },
          tip: {
            fr: "Arrive avant 18 h : la file d'attente peut dépasser une heure.",
            en: "Arrive before 6 pm — the queue can last over an hour.",
          },
          place: "Siji Minfu Peking Duck Beijing",
        },
      ],
    },
    /* ── Day 2 ── */
    {
      city: "beijing",
      icon: "palace",
      title: { fr: "Cité Interdite & Tian'anmen", en: "Forbidden City & Tiananmen" },
      highlight: { fr: "Cité Interdite", en: "Forbidden City" },
      summary: {
        fr: "La journée impériale : la plus grande place du monde, des palais à perte de vue et la meilleure vue de Pékin au coucher du soleil.",
        en: "Imperial day: the world's largest square, palaces as far as the eye can see and Beijing's best sunset view.",
      },
      stay: { fr: "Dongcheng, près des hutongs", en: "Dongcheng, near the hutongs" },
      budgetEur: { min: 30, max: 55 },
      activities: [
        {
          time: "08:00",
          kind: "sight",
          title: { fr: "Place Tian'anmen", en: "Tiananmen Square" },
          description: {
            fr: "Contrôle de sécurité et passeport obligatoires. Arrive tôt, la file grossit vite.",
            en: "Security check and passport required. Arrive early, the line grows fast.",
          },
          durationMin: 45,
          price: { min: 0 },
          tip: {
            fr: "Réserve ton créneau en ligne la veille (gratuit), sinon tu risques de rester à l'entrée.",
            en: "Book your free time slot online the day before or you may be turned away.",
          },
          place: "Tiananmen Square",
        },
        {
          time: "09:00",
          kind: "sight",
          title: { fr: "Cité Interdite", en: "Forbidden City" },
          description: {
            fr: "Trois à quatre heures pour traverser les palais, de la porte du Midi au jardin impérial.",
            en: "Three to four hours to cross the palaces, from the Meridian Gate to the Imperial Garden.",
          },
          durationMin: 210,
          price: { min: 60 },
          tip: {
            fr: "Les billets ouvrent 7 jours avant et partent en quelques minutes : réserve dès l'ouverture.",
            en: "Tickets open 7 days ahead and sell out in minutes — book the moment they drop.",
          },
          place: "Forbidden City Beijing",
        },
        {
          time: "13:30",
          kind: "food",
          title: { fr: "Déjeuner jiaozi", en: "Jiaozi lunch" },
          description: {
            fr: "Raviolis pékinois dans une cantine du quartier, rapide et pas cher.",
            en: "Beijing dumplings in a local canteen — fast and cheap.",
          },
          durationMin: 60,
          price: { min: 30, max: 60 },
        },
        {
          time: "16:30",
          kind: "sight",
          title: { fr: "Parc Jingshan", en: "Jingshan Park" },
          description: {
            fr: "Petite montée jusqu'au pavillon pour une vue plongeante sur les toits dorés de la Cité Interdite.",
            en: "A short climb to the pavilion for a sweeping view over the Forbidden City's golden roofs.",
          },
          durationMin: 90,
          price: { min: 2 },
          tip: {
            fr: "Le spot photo n°1 de Pékin : vise l'heure dorée.",
            en: "Beijing's #1 photo spot — aim for golden hour.",
          },
          place: "Jingshan Park Beijing",
        },
        {
          time: "19:30",
          kind: "night",
          title: { fr: "Wangfujing", en: "Wangfujing" },
          description: {
            fr: "Avenue commerçante illuminée et snacks de rue pour finir la journée.",
            en: "Bright shopping avenue and street snacks to end the day.",
          },
          durationMin: 90,
          price: { min: 50, max: 100 },
          place: "Wangfujing Beijing",
        },
      ],
    },
    /* ── Day 3 ── */
    {
      city: "beijing",
      icon: "wall",
      title: { fr: "La Grande Muraille à Mutianyu", en: "The Great Wall at Mutianyu" },
      highlight: { fr: "Grande Muraille", en: "Great Wall" },
      summary: {
        fr: "La section la mieux restaurée et la moins bondée : montée en téléphérique, descente en luge.",
        en: "The best-restored, least crowded section: cable car up, toboggan down.",
      },
      stay: { fr: "Dongcheng, près des hutongs", en: "Dongcheng, near the hutongs" },
      budgetEur: { min: 45, max: 80 },
      activities: [
        {
          time: "07:30",
          kind: "transport",
          title: { fr: "Route vers Mutianyu", en: "Drive to Mutianyu" },
          description: {
            fr: "Environ 1 h 30 en DiDi ou avec un chauffeur privé depuis le centre.",
            en: "About 1 h 30 by DiDi or private driver from downtown.",
          },
          durationMin: 90,
          price: { min: 250, max: 400 },
          tip: {
            fr: "Pars avant 8 h : tu auras la muraille presque pour toi seul.",
            en: "Leave before 8 am and you'll have the wall almost to yourself.",
          },
        },
        {
          time: "09:30",
          kind: "nature",
          title: { fr: "Randonnée sur la Muraille", en: "Hiking the Wall" },
          description: {
            fr: "Des tours de guet 6 à 20 : escaliers raides et panoramas sur les crêtes à perte de vue.",
            en: "From watchtower 6 to 20: steep steps and ridge-line views as far as you can see.",
          },
          durationMin: 180,
          price: { min: 45 },
          place: "Mutianyu Great Wall",
        },
        {
          time: "12:30",
          kind: "sight",
          title: { fr: "Descente en luge", en: "Toboggan ride down" },
          description: {
            fr: "Le toboggan de Mutianyu serpente jusqu'en bas de la montagne : le moment le plus fun du voyage.",
            en: "The Mutianyu toboggan winds all the way down the mountain — the most fun moment of the trip.",
          },
          durationMin: 20,
          price: { min: 100 },
          tip: {
            fr: "Prends le combo téléphérique à la montée + luge à la descente.",
            en: "Get the combo: cable car up, toboggan down.",
          },
        },
        {
          time: "14:00",
          kind: "food",
          title: { fr: "Déjeuner au village", en: "Lunch in the village" },
          description: {
            fr: "Truite grillée et plats fermiers au pied de la muraille.",
            en: "Grilled trout and farm dishes at the foot of the wall.",
          },
          durationMin: 60,
          price: { min: 60, max: 100 },
        },
        {
          time: "19:30",
          kind: "night",
          title: { fr: "Soirée à Sanlitun", en: "Evening in Sanlitun" },
          description: {
            fr: "Le quartier branché : rooftops, bars et architecture contemporaine.",
            en: "The trendy district: rooftops, bars and contemporary architecture.",
          },
          durationMin: 120,
          price: { min: 80, max: 150 },
          place: "Sanlitun Taikoo Li",
        },
      ],
    },
    /* ── Day 4 ── */
    {
      city: "beijing",
      icon: "temple",
      title: { fr: "Temple du Ciel & Palais d'Été", en: "Temple of Heaven & Summer Palace" },
      highlight: { fr: "Temple du Ciel", en: "Temple of Heaven" },
      summary: {
        fr: "Le Pékin des locaux le matin, puis les jardins impériaux au bord du lac Kunming.",
        en: "Locals' Beijing in the morning, then imperial gardens on Kunming Lake.",
      },
      stay: { fr: "Dongcheng, près des hutongs", en: "Dongcheng, near the hutongs" },
      budgetEur: { min: 35, max: 60 },
      activities: [
        {
          time: "07:30",
          kind: "sight",
          title: { fr: "Temple du Ciel", en: "Temple of Heaven" },
          description: {
            fr: "Le parc s'anime dès l'aube : tai-chi, danse, chants et parties de cartes. Puis la salle des Prières aux toits bleus.",
            en: "The park comes alive at dawn: tai chi, dancing, singing and card games. Then the blue-roofed Hall of Prayer.",
          },
          durationMin: 120,
          price: { min: 34 },
          tip: {
            fr: "Prends le billet combiné, sinon tu ne pourras pas entrer dans les bâtiments principaux.",
            en: "Buy the combined ticket — otherwise you can't enter the main buildings.",
          },
          place: "Temple of Heaven Beijing",
        },
        {
          time: "12:00",
          kind: "food",
          title: { fr: "Zhajiangmian", en: "Zhajiangmian" },
          description: {
            fr: "Nouilles à la sauce soja fermentée, le plat réconfort des Pékinois.",
            en: "Noodles with fermented soybean sauce, Beijing's comfort food.",
          },
          durationMin: 45,
          price: { min: 25, max: 45 },
        },
        {
          time: "14:00",
          kind: "sight",
          title: { fr: "Palais d'Été", en: "Summer Palace" },
          description: {
            fr: "La Longue Galerie, le Bateau de marbre et la colline de la Longévité au bord du lac.",
            en: "The Long Corridor, the Marble Boat and Longevity Hill by the lake.",
          },
          durationMin: 180,
          price: { min: 30, max: 60 },
          tip: {
            fr: "Traverse le lac en bateau-dragon pour économiser tes jambes.",
            en: "Cross the lake by dragon boat to save your legs.",
          },
          place: "Summer Palace Beijing",
        },
        {
          time: "19:30",
          kind: "night",
          title: { fr: "Lac Houhai", en: "Houhai Lake" },
          description: {
            fr: "Balade au bord de l'eau, bars live et lanternes qui se reflètent sur le lac.",
            en: "Lakeside stroll, live-music bars and lanterns reflected on the water.",
          },
          durationMin: 90,
          price: { min: 0 },
          place: "Houhai Beijing",
        },
      ],
    },
    /* ── Day 5 ── */
    {
      city: "chongqing",
      travel: { from: "beijing", mode: "plane", duration: { fr: "≈ 3 h", en: "≈ 3 h" } },
      icon: "plane",
      title: { fr: "Envol pour Chongqing", en: "Flying to Chongqing" },
      highlight: { fr: "Hongyadong", en: "Hongyadong" },
      summary: {
        fr: "Changement total d'ambiance : une ville verticale de 30 millions d'habitants, bâtie sur des collines au confluent de deux fleuves.",
        en: "Total change of vibe: a vertical city of 30 million people, built on hills where two rivers meet.",
      },
      stay: { fr: "Yuzhong, près de Jiefangbei", en: "Yuzhong, near Jiefangbei" },
      budgetEur: { min: 30, max: 55 },
      activities: [
        {
          time: "09:00",
          kind: "transport",
          title: { fr: "Vol Pékin → Chongqing", en: "Flight Beijing → Chongqing" },
          description: {
            fr: "Environ 3 h de vol. Le train existe (≈ 12 h), mais l'avion fait gagner une journée.",
            en: "About 3 h in the air. A train exists (≈ 12 h) but flying saves a whole day.",
          },
          durationMin: 180,
          price: { min: 600, max: 1200 },
          tip: {
            fr: "Compare sur Trip.com : sur cette distance, l'avion est souvent moins cher que le TGV.",
            en: "Compare on Trip.com — over this distance, flying is often cheaper than high-speed rail.",
          },
          place: "Chongqing Jiangbei International Airport",
        },
        {
          time: "15:00",
          kind: "sight",
          title: { fr: "Jiefangbei & Yuzhong", en: "Jiefangbei & Yuzhong" },
          description: {
            fr: "Le centre vertical : passerelles, escalators géants et rues empilées sur plusieurs niveaux.",
            en: "The vertical downtown: footbridges, giant escalators and streets stacked on several levels.",
          },
          durationMin: 120,
          price: { min: 0 },
          place: "Jiefangbei Chongqing",
        },
        {
          time: "19:00",
          kind: "night",
          title: { fr: "Hongyadong illuminé", en: "Hongyadong lit up" },
          description: {
            fr: "Ambiance « Voyage de Chihiro » : 11 étages de maisons sur pilotis qui s'illuminent à la nuit tombée.",
            en: "Pure 'Spirited Away' vibes: 11 floors of stilt houses lighting up at nightfall.",
          },
          durationMin: 90,
          price: { min: 0 },
          tip: {
            fr: "La meilleure vue est depuis le pont Qiansimen, juste en face.",
            en: "The best view is from Qiansimen Bridge, right opposite.",
          },
          place: "Hongyadong Chongqing",
        },
        {
          time: "21:00",
          kind: "food",
          title: { fr: "Premier hot pot", en: "First hot pot" },
          description: {
            fr: "Le plat emblématique : bouillon pimenté au poivre du Sichuan. Ose la marmite « yuan yang » moitié douce.",
            en: "The iconic dish: chilli broth with Sichuan pepper. Try the half-mild 'yuan yang' pot.",
          },
          durationMin: 90,
          price: { min: 80, max: 150 },
          tip: {
            fr: "Demande « wei la » (peu épicé) : le niveau normal est déjà très fort.",
            en: "Ask for 'wei la' (mildly spicy) — the standard level is already very hot.",
          },
        },
      ],
    },
    /* ── Day 6 ── */
    {
      city: "chongqing",
      icon: "city",
      title: { fr: "La ville cyberpunk", en: "The cyberpunk city" },
      highlight: { fr: "Liziba", en: "Liziba" },
      summary: {
        fr: "Un monorail qui traverse un immeuble, un téléphérique au-dessus du Yangtsé et une skyline futuriste.",
        en: "A monorail running through a building, a cable car over the Yangtze and a futuristic skyline.",
      },
      stay: { fr: "Yuzhong, près de Jiefangbei", en: "Yuzhong, near Jiefangbei" },
      budgetEur: { min: 25, max: 50 },
      activities: [
        {
          time: "09:30",
          kind: "sight",
          title: { fr: "Station Liziba", en: "Liziba Station" },
          description: {
            fr: "La ligne 2 du monorail passe à travers un immeuble d'habitation. La plateforme d'observation est juste en dessous.",
            en: "Monorail line 2 runs straight through a residential building. The viewing platform is right below.",
          },
          durationMin: 60,
          price: { min: 2 },
          place: "Liziba Station Chongqing",
        },
        {
          time: "11:30",
          kind: "sight",
          title: { fr: "Téléphérique du Yangtsé", en: "Yangtze River Cableway" },
          description: {
            fr: "Traversée du fleuve dans une cabine rétro, suspendue au-dessus des tours.",
            en: "Cross the river in a retro cabin, hanging high above the towers.",
          },
          durationMin: 45,
          price: { min: 20, max: 30 },
          tip: {
            fr: "Évite le week-end, l'attente peut dépasser 1 h 30. Vas-y tôt en semaine.",
            en: "Avoid weekends — the wait can top 1 h 30. Go early on a weekday.",
          },
          place: "Yangtze River Cableway Chongqing",
        },
        {
          time: "13:00",
          kind: "food",
          title: { fr: "Xiaomian", en: "Xiaomian" },
          description: {
            fr: "Les petites nouilles épicées de Chongqing, servies dans des bouis-bouis de quartier.",
            en: "Chongqing's spicy 'small noodles', served in hole-in-the-wall joints.",
          },
          durationMin: 40,
          price: { min: 10, max: 20 },
        },
        {
          time: "15:00",
          kind: "sight",
          title: { fr: "Raffles City & Chaotianmen", en: "Raffles City & Chaotianmen" },
          description: {
            fr: "Le pont de verre suspendu à l'horizontale entre quatre tours, au confluent des deux fleuves.",
            en: "The horizontal glass skybridge spanning four towers, where the two rivers meet.",
          },
          durationMin: 120,
          tip: {
            fr: "L'accès au pont « The Crystal » est payant ; la vue depuis la place de Chaotianmen est gratuite.",
            en: "Access to 'The Crystal' bridge is paid; the view from Chaotianmen square is free.",
          },
          place: "Raffles City Chongqing",
        },
        {
          time: "20:00",
          kind: "night",
          title: { fr: "Belvédère de Nanshan", en: "Nanshan viewpoint" },
          description: {
            fr: "Panorama sur la skyline illuminée depuis le belvédère Yikeshu.",
            en: "Panoramic view of the lit-up skyline from the Yikeshu viewpoint.",
          },
          durationMin: 90,
          price: { min: 30 },
          place: "Yikeshu Viewing Platform Chongqing",
        },
      ],
    },
    /* ── Day 7 ── */
    {
      city: "chongqing",
      icon: "river",
      title: { fr: "Vieille ville & croisière", en: "Old town & river cruise" },
      highlight: { fr: "Croisière", en: "River cruise" },
      summary: {
        fr: "Le Chongqing d'avant le matin, puis le spectacle des deux fleuves la nuit, depuis l'eau.",
        en: "Old Chongqing in the morning, then the two rivers' light show at night, from the water.",
      },
      stay: { fr: "Yuzhong, près de Jiefangbei", en: "Yuzhong, near Jiefangbei" },
      budgetEur: { min: 40, max: 75 },
      activities: [
        {
          time: "10:00",
          kind: "sight",
          title: { fr: "Ciqikou", en: "Ciqikou" },
          description: {
            fr: "Ancien bourg de la porcelaine : ruelles pavées, maisons de thé et snacks.",
            en: "The old porcelain town: cobbled lanes, teahouses and snacks.",
          },
          durationMin: 150,
          price: { min: 0 },
          tip: {
            fr: "Goûte le mahua, le beignet torsadé croustillant du coin.",
            en: "Try mahua, the local crispy twisted dough.",
          },
          place: "Ciqikou Ancient Town",
        },
        {
          time: "13:30",
          kind: "food",
          title: { fr: "Poulet aux piments", en: "Chilli chicken" },
          description: {
            fr: "Le « la zi ji », des morceaux de poulet frits cachés sous une montagne de piments.",
            en: "'La zi ji': crispy chicken bites hidden under a mountain of chillies.",
          },
          durationMin: 60,
          price: { min: 50, max: 90 },
        },
        {
          time: "16:00",
          kind: "sight",
          title: { fr: "Parc Eling", en: "Eling Park" },
          description: {
            fr: "Un petit parc perché pour voir la ville en 3D, ses tours collées aux falaises et ses ponts superposés.",
            en: "A hilltop park to see the city in 3D, its towers clinging to cliffs and its stacked bridges.",
          },
          durationMin: 120,
          price: { min: 0 },
          place: "Eling Park Chongqing",
        },
        {
          time: "20:00",
          kind: "night",
          title: { fr: "Croisière des deux fleuves", en: "Two-rivers night cruise" },
          description: {
            fr: "Une heure sur le Yangtsé et la Jialing : skyline, ponts et Hongyadong illuminés depuis l'eau.",
            en: "One hour on the Yangtze and Jialing: skyline, bridges and Hongyadong lit up from the water.",
          },
          durationMin: 60,
          price: { min: 120, max: 200 },
          tip: {
            fr: "Choisis le pont supérieur extérieur et un départ vers 20 h, quand tout est allumé.",
            en: "Pick the open top deck and an ~8 pm departure, when everything is lit.",
          },
          place: "Chaotianmen Dock Chongqing",
        },
      ],
    },
    /* ── Day 8 ── */
    {
      city: "wulong",
      travel: { from: "chongqing", mode: "train", duration: { fr: "≈ 1 h 30", en: "≈ 1 h 30" } },
      icon: "train",
      title: { fr: "Cap sur Wulong", en: "Off to Wulong" },
      highlight: { fr: "3 ponts naturels", en: "3 Natural Bridges" },
      summary: {
        fr: "Direction la campagne et le décor de Transformers 4 : falaises de karst, gouffres et ponts de pierre géants.",
        en: "Into the countryside and the Transformers 4 set: karst cliffs, sinkholes and giant stone bridges.",
      },
      stay: { fr: "Xiannüshan ou centre de Wulong", en: "Xiannüshan or Wulong town" },
      budgetEur: { min: 40, max: 70 },
      activities: [
        {
          time: "08:00",
          kind: "transport",
          title: { fr: "Train Chongqing → Wulong", en: "Train Chongqing → Wulong" },
          description: {
            fr: "Train rapide depuis Chongqing, puis navette ou DiDi jusqu'au parc.",
            en: "Fast train from Chongqing, then a shuttle or DiDi to the park.",
          },
          durationMin: 90,
          price: { min: 40, max: 80 },
          tip: {
            fr: "Voyage léger : un sac pour 2 jours suffit, la plupart des hôtels gardent les valises.",
            en: "Travel light — a 2-day bag is enough, most hotels will store your luggage.",
          },
        },
        {
          time: "11:00",
          kind: "nature",
          title: { fr: "Les Trois Ponts Naturels", en: "Three Natural Bridges" },
          description: {
            fr: "Descente en ascenseur dans le gouffre de Tiankeng, puis sentier sous trois arches de roche gigantesques.",
            en: "Take the lift down into the Tiankeng sinkhole, then a trail beneath three gigantic rock arches.",
          },
          durationMin: 210,
          price: { min: 135, max: 170 },
          tip: {
            fr: "Chaussures de marche indispensables : c'est humide et glissant.",
            en: "Hiking shoes are a must — it's damp and slippery.",
          },
          place: "Three Natural Bridges Wulong",
        },
        {
          time: "15:00",
          kind: "nature",
          title: { fr: "Gorge de Longshuixia", en: "Longshuixia Gorge" },
          description: {
            fr: "Passerelles et cascades au fond d'une faille étroite.",
            en: "Walkways and waterfalls at the bottom of a narrow fissure.",
          },
          durationMin: 120,
          price: { min: 100 },
          place: "Longshuixia Gorge Wulong",
        },
        {
          time: "19:30",
          kind: "food",
          title: { fr: "Dîner fermier", en: "Farmhouse dinner" },
          description: {
            fr: "Poulet à la mode tujia, légumes de montagne et tofu fumé local.",
            en: "Tujia-style chicken, mountain greens and local smoked tofu.",
          },
          durationMin: 60,
          price: { min: 50, max: 90 },
        },
      ],
    },
    /* ── Day 9 ── */
    {
      city: "wulong",
      icon: "mountain",
      title: { fr: "Montagne des Fées & grotte", en: "Fairy Mountain & cave" },
      highlight: { fr: "Xiannüshan", en: "Fairy Mountain" },
      summary: {
        fr: "Prairies d'altitude et l'une des plus belles grottes de Chine : la journée la plus nature du voyage.",
        en: "High-altitude meadows and one of China's most beautiful caves: the trip's greenest day.",
      },
      stay: { fr: "Xiannüshan ou centre de Wulong", en: "Xiannüshan or Wulong town" },
      budgetEur: { min: 40, max: 70 },
      activities: [
        {
          time: "09:00",
          kind: "nature",
          title: { fr: "Montagne des Fées", en: "Fairy Mountain" },
          description: {
            fr: "Prairies à 2 000 m d'altitude, forêts de pins et petit train panoramique.",
            en: "Meadows at 2,000 m, pine forests and a little panoramic train.",
          },
          durationMin: 210,
          price: { min: 60, max: 85 },
          tip: {
            fr: "Prends une veste : il fait 8 à 10 °C de moins qu'à Chongqing.",
            en: "Bring a jacket — it's 8–10 °C cooler than in Chongqing.",
          },
          place: "Fairy Mountain Wulong",
        },
        {
          time: "14:30",
          kind: "nature",
          title: { fr: "Grotte de Furong", en: "Furong Cave" },
          description: {
            fr: "Galeries de stalactites et de cristaux, inscrites à l'UNESCO avec le karst de Wulong.",
            en: "Galleries of stalactites and crystals, UNESCO-listed with the Wulong karst.",
          },
          durationMin: 120,
          price: { min: 120 },
          place: "Furong Cave Wulong",
        },
        {
          time: "19:00",
          kind: "food",
          title: { fr: "Brochettes au barbecue", en: "Barbecue skewers" },
          description: {
            fr: "Brochettes épicées et bière locale pour fêter la fin de la partie nature.",
            en: "Spicy skewers and a local beer to celebrate the end of the nature leg.",
          },
          durationMin: 90,
          price: { min: 40, max: 80 },
        },
      ],
    },
    /* ── Day 10 ── */
    {
      city: "shanghai",
      travel: { from: "wulong", mode: "plane", duration: { fr: "≈ 5 h porte à porte", en: "≈ 5 h door to door" } },
      icon: "plane",
      title: { fr: "Direction Shanghai", en: "Heading to Shanghai" },
      highlight: { fr: "Le Bund", en: "The Bund" },
      summary: {
        fr: "Retour à Chongqing pour s'envoler vers Shanghai. Première soirée face à la skyline la plus célèbre de Chine.",
        en: "Back to Chongqing to fly to Shanghai. First evening facing China's most famous skyline.",
      },
      stay: { fr: "Huangpu, près de People's Square", en: "Huangpu, near People's Square" },
      budgetEur: { min: 30, max: 60 },
      activities: [
        {
          time: "08:30",
          kind: "transport",
          title: { fr: "Train Wulong → Chongqing", en: "Train Wulong → Chongqing" },
          description: {
            fr: "Retour vers Chongqing, puis direction l'aéroport de Jiangbei.",
            en: "Back to Chongqing, then on to Jiangbei airport.",
          },
          durationMin: 120,
          price: { min: 40, max: 80 },
        },
        {
          time: "13:00",
          kind: "transport",
          title: { fr: "Vol Chongqing → Shanghai", en: "Flight Chongqing → Shanghai" },
          description: {
            fr: "Environ 2 h 30 de vol vers Hongqiao (le plus proche du centre) ou Pudong.",
            en: "About 2 h 30 in the air to Hongqiao (closest to downtown) or Pudong.",
          },
          durationMin: 150,
          price: { min: 500, max: 1000 },
          tip: {
            fr: "Vise Hongqiao : le métro t'amène au centre en 30 min.",
            en: "Aim for Hongqiao — the metro gets you downtown in 30 minutes.",
          },
          place: "Shanghai Hongqiao Airport",
        },
        {
          time: "19:30",
          kind: "night",
          title: { fr: "Le Bund de nuit", en: "The Bund at night" },
          description: {
            fr: "Promenade le long du Huangpu : façades Art déco d'un côté, tours futuristes de Pudong de l'autre.",
            en: "Walk along the Huangpu: Art Deco facades on one side, Pudong's futuristic towers on the other.",
          },
          durationMin: 90,
          price: { min: 0 },
          tip: {
            fr: "Les lumières s'éteignent vers 22 h, ne traîne pas.",
            en: "The lights switch off around 10 pm — don't be late.",
          },
          place: "The Bund Shanghai",
        },
        {
          time: "21:30",
          kind: "food",
          title: { fr: "Xiaolongbao", en: "Xiaolongbao" },
          description: {
            fr: "Les raviolis vapeur fourrés au bouillon, la fierté de Shanghai.",
            en: "Soup-filled steamed dumplings — Shanghai's pride.",
          },
          durationMin: 60,
          price: { min: 40, max: 80 },
          tip: {
            fr: "Croque un petit trou, aspire le bouillon, puis mange. Sinon, gare à la brûlure.",
            en: "Nibble a small hole, sip the broth, then eat — or you'll burn your tongue.",
          },
          place: "Jia Jia Tang Bao Shanghai",
        },
      ],
    },
    /* ── Day 11 ── */
    {
      city: "shanghai",
      icon: "garden",
      title: { fr: "Vieux Shanghai & Concession", en: "Old Shanghai & French Concession" },
      highlight: { fr: "Jardin Yu", en: "Yu Garden" },
      summary: {
        fr: "Le Shanghai d'avant les gratte-ciels : jardin Ming, ruelles shikumen et avenues bordées de platanes.",
        en: "Shanghai before the skyscrapers: a Ming garden, shikumen lanes and plane-tree avenues.",
      },
      stay: { fr: "Huangpu, près de People's Square", en: "Huangpu, near People's Square" },
      budgetEur: { min: 35, max: 65 },
      activities: [
        {
          time: "09:00",
          kind: "sight",
          title: { fr: "Jardin Yu", en: "Yu Garden" },
          description: {
            fr: "Jardin classique de la dynastie Ming : rocailles, étangs et pavillons, à côté du temple du Dieu de la ville.",
            en: "A classic Ming-dynasty garden of rockeries, ponds and pavilions, next to the City God Temple.",
          },
          durationMin: 120,
          price: { min: 40 },
          tip: {
            fr: "Arrive à l'ouverture : dès 11 h, c'est noir de monde.",
            en: "Arrive at opening time — it's packed from 11 am.",
          },
          place: "Yu Garden Shanghai",
        },
        {
          time: "12:00",
          kind: "shopping",
          title: { fr: "Nanjing Road", en: "Nanjing Road" },
          description: {
            fr: "La grande avenue piétonne du shopping, à remonter jusqu'à People's Square.",
            en: "The big pedestrian shopping avenue, all the way to People's Square.",
          },
          durationMin: 90,
          price: { min: 0 },
          place: "Nanjing Road Pedestrian Street",
        },
        {
          time: "14:30",
          kind: "sight",
          title: { fr: "Ancienne Concession française", en: "Former French Concession" },
          description: {
            fr: "Wukang Road, Anfu Road : cafés, boutiques et villas sous les platanes.",
            en: "Wukang Road, Anfu Road: cafés, boutiques and villas under the plane trees.",
          },
          durationMin: 180,
          price: { min: 0 },
          tip: {
            fr: "Loue un vélo partagé via Alipay, c'est le meilleur moyen d'explorer le quartier.",
            en: "Grab a shared bike via Alipay — the best way to explore the area.",
          },
          place: "Wukang Mansion Shanghai",
        },
        {
          time: "19:30",
          kind: "food",
          title: { fr: "Dîner à Xintiandi", en: "Dinner in Xintiandi" },
          description: {
            fr: "Ruelles shikumen rénovées, restaurants et terrasses.",
            en: "Restored shikumen lanes, restaurants and terraces.",
          },
          durationMin: 120,
          price: { min: 100, max: 200 },
          place: "Xintiandi Shanghai",
        },
      ],
    },
    /* ── Day 12 ── */
    {
      city: "shanghai",
      icon: "skyline",
      title: { fr: "Pudong & Shanghai Tower", en: "Pudong & Shanghai Tower" },
      highlight: { fr: "Shanghai Tower", en: "Shanghai Tower" },
      summary: {
        fr: "Journée verticale : l'une des plus hautes tours du monde et toute la ville à tes pieds.",
        en: "Vertical day: one of the world's tallest towers and the whole city at your feet.",
      },
      stay: { fr: "Huangpu, près de People's Square", en: "Huangpu, near People's Square" },
      budgetEur: { min: 45, max: 80 },
      activities: [
        {
          time: "10:00",
          kind: "sight",
          title: { fr: "Lujiazui", en: "Lujiazui" },
          description: {
            fr: "Le quartier financier : passerelle circulaire au pied de l'Oriental Pearl, de la Jin Mao et du « décapsuleur ».",
            en: "The financial district: a circular skywalk beneath the Oriental Pearl, Jin Mao and the 'bottle opener'.",
          },
          durationMin: 90,
          price: { min: 0 },
          place: "Lujiazui Shanghai",
        },
        {
          time: "11:30",
          kind: "sight",
          title: { fr: "Shanghai Tower, 118e étage", en: "Shanghai Tower, floor 118" },
          description: {
            fr: "L'un des ascenseurs les plus rapides du monde t'emmène à l'observatoire, à 546 m.",
            en: "One of the world's fastest lifts takes you up to the 546 m observatory.",
          },
          durationMin: 90,
          price: { min: 180 },
          tip: {
            fr: "Vérifie la météo : par temps de brouillard, tu ne verras rien.",
            en: "Check the weather — on a foggy day you'll see nothing.",
          },
          place: "Shanghai Tower",
        },
        {
          time: "14:00",
          kind: "food",
          title: { fr: "Shengjianbao", en: "Shengjianbao" },
          description: {
            fr: "Brioches grillées à la poêle, croustillantes dessous et juteuses dedans.",
            en: "Pan-fried buns, crispy underneath and juicy inside.",
          },
          durationMin: 45,
          price: { min: 20, max: 40 },
          place: "Yang's Dumpling Shanghai",
        },
        {
          time: "17:00",
          kind: "transport",
          title: { fr: "Ferry du Huangpu", en: "Huangpu ferry" },
          description: {
            fr: "La traversée du fleuve pour 2 ¥, avec la skyline au coucher du soleil.",
            en: "The ¥2 river crossing, with the skyline at sunset.",
          },
          durationMin: 30,
          price: { min: 2 },
          tip: {
            fr: "La même vue qu'une croisière, pour cent fois moins cher.",
            en: "The same view as a cruise, for a hundredth of the price.",
          },
          place: "Dongchang Road Ferry Terminal Shanghai",
        },
        {
          time: "20:00",
          kind: "night",
          title: { fr: "Rooftop sur le Bund", en: "Rooftop on the Bund" },
          description: {
            fr: "Un cocktail face à Pudong illuminé : l'image finale du voyage.",
            en: "A cocktail facing illuminated Pudong — the trip's closing shot.",
          },
          durationMin: 120,
          price: { min: 120, max: 200 },
          place: "Bar Rouge Shanghai",
        },
      ],
    },
    /* ── Day 13 ── */
    {
      city: "shanghai",
      icon: "water",
      title: { fr: "Village d'eau de Zhujiajiao", en: "Zhujiajiao water town" },
      highlight: { fr: "Zhujiajiao", en: "Zhujiajiao" },
      summary: {
        fr: "Escapade dans la « Venise de Shanghai » : canaux, ponts de pierre et barques, à 1 h du centre.",
        en: "A trip to the 'Venice of Shanghai': canals, stone bridges and boats, 1 h from downtown.",
      },
      stay: { fr: "Huangpu, près de People's Square", en: "Huangpu, near People's Square" },
      budgetEur: { min: 35, max: 65 },
      activities: [
        {
          time: "09:00",
          kind: "transport",
          title: { fr: "Métro ligne 17", en: "Metro line 17" },
          description: {
            fr: "Direct jusqu'à Zhujiajiao, environ 1 h depuis le centre.",
            en: "Straight to Zhujiajiao, about 1 h from downtown.",
          },
          durationMin: 60,
          price: { min: 7 },
        },
        {
          time: "10:00",
          kind: "sight",
          title: { fr: "Canaux de Zhujiajiao", en: "Zhujiajiao canals" },
          description: {
            fr: "Ponts de pierre de l'époque Ming, ruelles étroites et maisons au bord de l'eau.",
            en: "Ming-era stone bridges, narrow lanes and waterside houses.",
          },
          durationMin: 150,
          price: { min: 0 },
          tip: {
            fr: "Le pont Fangsheng est le plus beau spot photo : arrive avant les groupes.",
            en: "Fangsheng Bridge is the best photo spot — beat the tour groups.",
          },
          place: "Zhujiajiao Ancient Town",
        },
        {
          time: "12:30",
          kind: "sight",
          title: { fr: "Balade en barque", en: "Boat ride" },
          description: {
            fr: "Tour des canaux en barque à la godille.",
            en: "A tour of the canals on a sculled boat.",
          },
          durationMin: 30,
          price: { min: 60, max: 120 },
        },
        {
          time: "17:00",
          kind: "shopping",
          title: { fr: "Tianzifang", en: "Tianzifang" },
          description: {
            fr: "Un labyrinthe de ruelles shikumen : galeries, souvenirs et petits bars.",
            en: "A maze of shikumen lanes: galleries, souvenirs and small bars.",
          },
          durationMin: 120,
          price: { min: 0 },
          place: "Tianzifang Shanghai",
        },
        {
          time: "20:00",
          kind: "food",
          title: { fr: "Dîner d'adieu", en: "Farewell dinner" },
          description: {
            fr: "Cuisine shanghaïenne : porc braisé hong shao rou et crabe poilu en saison.",
            en: "Shanghainese food: hong shao rou braised pork and hairy crab in season.",
          },
          durationMin: 90,
          price: { min: 120, max: 250 },
          tip: {
            fr: "En automne, c'est la saison du crabe poilu : à goûter absolument.",
            en: "Autumn is hairy-crab season — a must-try.",
          },
        },
      ],
    },
    /* ── Day 14 ── */
    {
      city: "shanghai",
      icon: "departure",
      title: { fr: "Départ en Maglev", en: "Leaving by Maglev" },
      highlight: { fr: "Maglev", en: "Maglev" },
      summary: {
        fr: "Dernier petit-déjeuner, derniers souvenirs et sortie en beauté à bord du train à lévitation magnétique.",
        en: "Last breakfast, last souvenirs and a stylish exit aboard the magnetic levitation train.",
      },
      budgetEur: { min: 20, max: 40 },
      activities: [
        {
          time: "08:30",
          kind: "food",
          title: { fr: "Petit-déjeuner local", en: "Local breakfast" },
          description: {
            fr: "Youtiao (beignet), lait de soja et jianbing : le combo du matin.",
            en: "Youtiao (fried dough), soy milk and jianbing — the morning combo.",
          },
          durationMin: 45,
          price: { min: 10, max: 25 },
        },
        {
          time: "10:00",
          kind: "shopping",
          title: { fr: "Derniers souvenirs", en: "Last souvenirs" },
          description: {
            fr: "Thé, soie ou gâteaux de lune pour ramener un bout de Chine.",
            en: "Tea, silk or mooncakes to bring a piece of China home.",
          },
          durationMin: 120,
        },
        {
          time: "13:00",
          kind: "transport",
          title: { fr: "Maglev vers Pudong", en: "Maglev to Pudong" },
          description: {
            fr: "Le train à lévitation magnétique relie Longyang Road à l'aéroport de Pudong en 8 minutes.",
            en: "The magnetic levitation train links Longyang Road to Pudong Airport in 8 minutes.",
          },
          durationMin: 30,
          price: { min: 50 },
          tip: {
            fr: "Avec ta carte d'embarquement du jour, le billet passe à 40 ¥.",
            en: "Show a same-day boarding pass and the ticket drops to ¥40.",
          },
          place: "Longyang Road Maglev Station",
        },
        {
          time: "15:00",
          kind: "transport",
          title: { fr: "Vol retour", en: "Flight home" },
          description: {
            fr: "Enregistrement 3 h avant pour un vol international. 再见, la Chine !",
            en: "Check in 3 h before an international flight. 再见, China!",
          },
          durationMin: 180,
          place: "Shanghai Pudong International Airport",
        },
      ],
    },
  ],
  essentials: [
    {
      icon: "visa",
      title: { fr: "Visa", en: "Visa" },
      text: {
        fr: "Exemption de visa jusqu'à 30 jours pour les Français, passeport valide 6 mois. Vérifie les règles à jour avant de partir.",
        en: "French and many EU passports enter visa-free for up to 30 days. Check the current rules for your nationality.",
      },
    },
    {
      icon: "payment",
      title: { fr: "Paiement", en: "Payments" },
      text: {
        fr: "Alipay ou WeChat Pay reliés à ta carte bancaire : tout se paie par QR code. Garde un peu de cash en secours.",
        en: "Alipay or WeChat Pay linked to your bank card — everything is paid by QR code. Keep some cash as backup.",
      },
    },
    {
      icon: "internet",
      title: { fr: "Internet", en: "Internet" },
      text: {
        fr: "Google, Instagram et WhatsApp sont bloqués. Une eSIM internationale passe outre le blocage, sans VPN.",
        en: "Google, Instagram and WhatsApp are blocked. An international eSIM gets around it, no VPN needed.",
      },
    },
    {
      icon: "transport",
      title: { fr: "Se déplacer", en: "Getting around" },
      text: {
        fr: "Apple Plans ou Amap pour t'orienter, DiDi pour les taxis, Trip.com pour les trains et les vols.",
        en: "Apple Maps or Amap for directions, DiDi for taxis, Trip.com for trains and flights.",
      },
    },
    {
      icon: "season",
      title: { fr: "Quand partir", en: "When to go" },
      text: {
        fr: "L'automne : 15 à 25 °C et ciel dégagé. Évite la Golden Week (1er au 7 octobre), tout est bondé.",
        en: "Autumn: 15–25 °C and clear skies. Avoid Golden Week (October 1–7) — everything is packed.",
      },
    },
    {
      icon: "language",
      title: { fr: "La langue", en: "Language" },
      text: {
        fr: "Peu de gens parlent anglais. Télécharge le chinois hors ligne dans ton traducteur et utilise le mode caméra.",
        en: "Few people speak English. Download Chinese for offline use in your translator and use camera mode.",
      },
    },
  ],
  checklist: [
    { id: "passport", label: { fr: "Passeport valide 6 mois après le retour", en: "Passport valid 6 months after return" } },
    { id: "alipay", label: { fr: "Alipay installé, carte bancaire liée", en: "Alipay installed, bank card linked" } },
    { id: "esim", label: { fr: "eSIM internationale activée", en: "International eSIM activated" } },
    { id: "forbidden-city", label: { fr: "Billets Cité Interdite (J-7)", en: "Forbidden City tickets (D-7)" } },
    { id: "flights", label: { fr: "Vols Pékin → Chongqing → Shanghai", en: "Flights Beijing → Chongqing → Shanghai" } },
    { id: "apps", label: { fr: "Applis DiDi, Trip.com et Amap", en: "DiDi, Trip.com and Amap apps" } },
    { id: "adapter", label: { fr: "Adaptateur universel (prises A et I)", en: "Universal adapter (A and I plugs)" } },
    { id: "shoes", label: { fr: "Chaussures de marche pour Wulong", en: "Hiking shoes for Wulong" } },
  ],
};

export const itineraries: Itinerary[] = [china];

export function getItinerary(slug: string): Itinerary | undefined {
  return itineraries.find((itinerary) => itinerary.slug === slug);
}

/* ═══════════════════════════════════════════
   SELECTORS
   ═══════════════════════════════════════════ */

export interface CityStop {
  city: ItineraryCity;
  /** 1-based, inclusive. */
  firstDay: number;
  lastDay: number;
}

/** Consecutive days grouped by city, in travel order. */
export function getCityStops(itinerary: Itinerary): CityStop[] {
  const stops: CityStop[] = [];
  itinerary.days.forEach((day, index) => {
    const last = stops.at(-1);
    if (last && last.city.id === day.city) {
      last.lastDay = index + 1;
      return;
    }
    stops.push({ city: getCity(itinerary, day.city), firstDay: index + 1, lastDay: index + 1 });
  });
  return stops;
}

export function getCity(itinerary: Itinerary, id: string): ItineraryCity {
  const city = itinerary.cities.find((c) => c.id === id);
  if (!city) throw new Error(`Unknown city "${id}" in itinerary "${itinerary.slug}"`);
  return city;
}

export function getTripStats(itinerary: Itinerary) {
  return {
    days: itinerary.days.length,
    cities: itinerary.cities.length,
    activities: itinerary.days.reduce((sum, day) => sum + day.activities.length, 0),
    budgetMin: itinerary.days.reduce((sum, day) => sum + day.budgetEur.min, 0),
    budgetMax: itinerary.days.reduce((sum, day) => sum + day.budgetEur.max, 0),
  };
}
