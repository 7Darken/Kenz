import { type Localized } from "@/i18n/localize";

/* ═══════════════════════════════════════════
   ITINERARIES — the day-by-day trips behind my YouTube videos.
   One entry = one public page at /itineraire/[slug].
   ═══════════════════════════════════════════ */

export type ActivityKind = "sight" | "food" | "nature" | "night" | "transport" | "shopping" | "wellness";

export type DayIcon =
  | "arrival"
  | "palace"
  | "wall"
  | "temple"
  | "rest"
  | "spa"
  | "lights"
  | "bike"
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
      map: { x: 27, y: 52, label: "left" },
    },
    {
      id: "wulong",
      name: { fr: "Wulong", en: "Wulong" },
      hanzi: "武隆",
      color: "#2fd6a3",
      tagline: { fr: "Karst & ponts naturels", en: "Karst & natural bridges" },
      map: { x: 36, y: 68, label: "bottom" },
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
    /* ════ PÉKIN — J1 → J5 ════ */
    /* ── Day 1 ── */
    {
      city: "beijing",
      icon: "arrival",
      title: { fr: "Arrivée & Cité interdite", en: "Arrival & Forbidden City" },
      highlight: { fr: "Cité interdite", en: "Forbidden City" },
      summary: {
        fr: "On atterrit, on pose les valises et on file direct au cœur impérial de Pékin dès le premier jour.",
        en: "Land, drop the bags and head straight to the imperial heart of Beijing on day one.",
      },
      stay: { fr: "Dongcheng, près de la Cité interdite", en: "Dongcheng, near the Forbidden City" },
      budgetEur: { min: 35, max: 60 },
      activities: [
        {
          time: "09:00",
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
          time: "13:00",
          kind: "sight",
          title: { fr: "Place Tian'anmen", en: "Tiananmen Square" },
          description: {
            fr: "Contrôle de sécurité et passeport obligatoires pour traverser la plus grande place du monde.",
            en: "Security check and passport required to cross the world's largest square.",
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
          time: "14:00",
          kind: "sight",
          title: { fr: "Cité interdite", en: "Forbidden City" },
          description: {
            fr: "Le palais des empereurs Ming et Qing, de la porte du Midi au jardin impérial. En sortant au nord, le parc Jingshan juste en face offre la plus belle vue sur les toits dorés.",
            en: "The palace of the Ming and Qing emperors, from the Meridian Gate to the Imperial Garden. Out the north gate, Jingshan Park right opposite has the best view over the golden roofs.",
          },
          durationMin: 210,
          price: { min: 40, max: 60 },
          tip: {
            fr: "Fermée le lundi. Les billets (nominatifs, avec passeport) ouvrent 7 jours avant et partent vite : réserve dès l'ouverture.",
            en: "Closed on Mondays. Tickets (named, passport needed) open 7 days ahead and go fast — book the moment they drop.",
          },
          place: "Forbidden City Beijing",
        },
        {
          time: "19:30",
          kind: "food",
          title: { fr: "Canard laqué", en: "Peking duck" },
          description: {
            fr: "Le classique pékinois pour fêter l'arrivée : peau croustillante, crêpes fines et sauce hoisin.",
            en: "The Beijing classic to celebrate landing: crispy skin, thin pancakes and hoisin sauce.",
          },
          durationMin: 90,
          price: { min: 150, max: 250 },
        },
      ],
    },
    /* ── Day 2 ── */
    {
      city: "beijing",
      icon: "wall",
      title: { fr: "La Grande Muraille en tenue d'empereur", en: "The Great Wall dressed as an emperor" },
      highlight: { fr: "Grande Muraille", en: "Great Wall" },
      summary: {
        fr: "Mutianyu, la plus belle section et la moins bondée, version impériale : costume d'empereur sur le dos, montée en téléphérique et descente en luge.",
        en: "Mutianyu, the most beautiful and least crowded section, imperial edition: emperor costume on, cable car up and toboggan down.",
      },
      stay: { fr: "Dongcheng, près de la Cité interdite", en: "Dongcheng, near the Forbidden City" },
      budgetEur: { min: 50, max: 90 },
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
          kind: "sight",
          title: { fr: "Tenue d'empereur", en: "Emperor outfit" },
          description: {
            fr: "On enfile une tenue impériale brodée de dragons, coiffe comprise, pour les photos sur les remparts. Le moment le plus mémorable du voyage.",
            en: "Slip into a dragon-embroidered imperial robe, headdress included, for photos on the ramparts. The trip's most memorable moment.",
          },
          durationMin: 60,
          tip: {
            fr: "Mets-toi d'accord sur le prix avant d'enfiler le costume.",
            en: "Agree on the price before putting the costume on.",
          },
        },
        {
          time: "10:30",
          kind: "nature",
          title: { fr: "Randonnée sur la Muraille", en: "Hiking the Wall" },
          description: {
            fr: "De tour de guet en tour de guet : escaliers raides et crêtes qui serpentent à perte de vue.",
            en: "From watchtower to watchtower: steep steps and ridges winding as far as the eye can see.",
          },
          durationMin: 180,
          price: { min: 45 },
          tip: {
            fr: "Prends le combo : téléphérique pour monter, luge pour descendre.",
            en: "Get the combo: cable car up, toboggan down.",
          },
          place: "Mutianyu Great Wall",
        },
        {
          time: "13:30",
          kind: "sight",
          title: { fr: "Descente en luge", en: "Toboggan ride down" },
          description: {
            fr: "Le toboggan de Mutianyu serpente jusqu'en bas de la montagne. Fun garanti, même en tenue d'empereur.",
            en: "The Mutianyu toboggan winds all the way down the mountain. Guaranteed fun, even dressed as an emperor.",
          },
          durationMin: 20,
          price: { min: 100 },
        },
        {
          time: "14:30",
          kind: "food",
          title: { fr: "Déjeuner au village", en: "Lunch in the village" },
          description: {
            fr: "Truite grillée et plats fermiers au pied de la muraille, avant de rentrer à Pékin.",
            en: "Grilled trout and farm dishes at the foot of the wall, before heading back to Beijing.",
          },
          durationMin: 60,
          price: { min: 60, max: 100 },
        },
      ],
    },
    /* ── Day 3 ── */
    {
      city: "beijing",
      icon: "temple",
      title: { fr: "Temple du Ciel & Palais d'Été", en: "Temple of Heaven & Summer Palace" },
      highlight: { fr: "Palais d'Été", en: "Summer Palace" },
      summary: {
        fr: "Le matin, le Pékin des locaux dans les jardins du Temple du Ciel. L'après-midi, le Palais d'Été jusqu'à ce que le soleil plonge derrière le lac Kunming.",
        en: "Locals' Beijing in the Temple of Heaven gardens in the morning. In the afternoon, the Summer Palace until the sun sinks behind Kunming Lake.",
      },
      stay: { fr: "Dongcheng, près de la Cité interdite", en: "Dongcheng, near the Forbidden City" },
      budgetEur: { min: 35, max: 60 },
      activities: [
        {
          time: "08:00",
          kind: "sight",
          title: { fr: "Temple du Ciel", en: "Temple of Heaven" },
          description: {
            fr: "Le parc s'anime dès le matin : tai-chi, danse, chants et parties de cartes. Puis la salle des Prières et ses toits bleus.",
            en: "The park comes alive in the morning: tai chi, dancing, singing and card games. Then the blue-roofed Hall of Prayer.",
          },
          durationMin: 150,
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
            fr: "Le jardin impérial au bord du lac Kunming : la Longue Galerie, le Bateau de marbre et la colline de la Longévité.",
            en: "The imperial garden on Kunming Lake: the Long Corridor, the Marble Boat and Longevity Hill.",
          },
          durationMin: 210,
          price: { min: 30, max: 60 },
          tip: {
            fr: "Traverse le lac en bateau-dragon pour économiser tes jambes avant le coucher du soleil.",
            en: "Cross the lake by dragon boat to save your legs for sunset.",
          },
          place: "Summer Palace Beijing",
        },
        {
          time: "17:30",
          kind: "nature",
          title: { fr: "Coucher de soleil sur le lac", en: "Sunset over the lake" },
          description: {
            fr: "Le moment de la journée : le soleil descend derrière les collines de l'Ouest et embrase le pont aux Dix-Sept Arches.",
            en: "The moment of the day: the sun drops behind the Western Hills and sets the Seventeen-Arch Bridge ablaze.",
          },
          durationMin: 60,
          price: { min: 0 },
          tip: {
            fr: "Installe-toi sur la rive est, face au pont, au moins 30 min avant le coucher.",
            en: "Settle on the east bank, facing the bridge, at least 30 minutes before sunset.",
          },
          place: "Seventeen-Arch Bridge Summer Palace",
        },
      ],
    },
    /* ── Day 4 ── */
    {
      city: "beijing",
      icon: "rest",
      title: { fr: "Journée tranquille", en: "Slow day" },
      highlight: { fr: "Pause", en: "Slow day" },
      summary: {
        fr: "Après trois jours intenses, on recharge les batteries : pas de réveil, pas de programme. Quelques idées si l'envie de sortir revient.",
        en: "After three intense days, recharge: no alarm, no plan. A few ideas if you feel like going out.",
      },
      stay: { fr: "Dongcheng, près de la Cité interdite", en: "Dongcheng, near the Forbidden City" },
      budgetEur: { min: 20, max: 45 },
      activities: [
        {
          time: "11:00",
          kind: "food",
          title: { fr: "Grasse mat' & brunch", en: "Lie-in & brunch" },
          description: {
            fr: "Pas de réveil aujourd'hui. Brunch dans un café du quartier pour démarrer doucement.",
            en: "No alarm today. Brunch in a neighbourhood café for a slow start.",
          },
          durationMin: 90,
          price: { min: 50, max: 100 },
        },
        {
          time: "14:30",
          kind: "sight",
          title: { fr: "Balade dans les hutongs", en: "Stroll through the hutongs" },
          description: {
            fr: "Les ruelles traditionnelles autour de Nanluoguxiang, entre maisons à cour carrée et petites échoppes.",
            en: "The traditional alleys around Nanluoguxiang, between courtyard houses and tiny shops.",
          },
          durationMin: 150,
          price: { min: 0 },
          tip: {
            fr: "Sors de la rue principale : les ruelles parallèles sont bien plus authentiques.",
            en: "Step off the main street — the side alleys are far more authentic.",
          },
          place: "Nanluoguxiang Beijing",
        },
        {
          time: "18:30",
          kind: "night",
          title: { fr: "Lac Houhai au crépuscule", en: "Houhai Lake at dusk" },
          description: {
            fr: "Balade au bord de l'eau quand les lanternes s'allument.",
            en: "A lakeside walk as the lanterns light up.",
          },
          durationMin: 90,
          price: { min: 0 },
          place: "Houhai Beijing",
        },
      ],
    },
    /* ── Day 5 ── */
    {
      city: "beijing",
      icon: "spa",
      title: { fr: "V Life : 24 h en pyjama", en: "V Life: 24 hours in pyjamas" },
      highlight: { fr: "24 h en pyjama", en: "24 h in pyjamas" },
      summary: {
        fr: "L'expérience la plus folle de Pékin : un complexe de bains ouvert 24 h/24 où l'on vit en pyjama. Bains, saunas, repas, massages, coins détente… et on y dort.",
        en: "Beijing's wildest experience: a 24-hour bathhouse complex where you live in pyjamas. Baths, saunas, food, massages, chill-out zones… and you sleep there.",
      },
      stay: { fr: "Sur place, à V Life", en: "On site, at V Life" },
      budgetEur: { min: 40, max: 90 },
      activities: [
        {
          time: "12:00",
          kind: "wellness",
          title: { fr: "Arrivée à V Life", en: "Checking in at V Life" },
          description: {
            fr: "Comme dans les grands bains chinois : on laisse ses affaires au casier, on enfile le pyjama fourni, et on ne ressort que le lendemain.",
            en: "Like in the big Chinese bathhouses: leave your things in a locker, put on the pyjamas provided, and don't come out until the next day.",
          },
          durationMin: 30,
          place: "V Life Beijing",
        },
        {
          time: "12:30",
          kind: "wellness",
          title: { fr: "Bains & saunas", en: "Baths & saunas" },
          description: {
            fr: "Bassins chauds, bains froids, saunas et hammams : on enchaîne à son rythme.",
            en: "Hot pools, cold plunges, saunas and steam rooms: go at your own pace.",
          },
          durationMin: 180,
        },
        {
          time: "18:00",
          kind: "food",
          title: { fr: "Dîner en pyjama", en: "Dinner in pyjamas" },
          description: {
            fr: "On mange sur place, sans quitter son pyjama. L'ambiance est aussi improbable que géniale.",
            en: "Eat on site without leaving your pyjamas. The vibe is as unlikely as it is brilliant.",
          },
          durationMin: 90,
        },
        {
          time: "20:30",
          kind: "wellness",
          title: { fr: "Massage", en: "Massage" },
          description: {
            fr: "Massage des pieds ou du dos pour finir la journée en douceur.",
            en: "A foot or back massage to end the day gently.",
          },
          durationMin: 90,
          tip: {
            fr: "Les soins se paient souvent en plus : demande le prix avant.",
            en: "Treatments are often extra — ask for the price first.",
          },
        },
        {
          time: "23:00",
          kind: "night",
          title: { fr: "Nuit sur place", en: "Sleeping over" },
          description: {
            fr: "Salles de repos et coins détente : on dort sur place pour boucler les 24 h.",
            en: "Rest rooms and lounges: sleep on site to complete the full 24 hours.",
          },
          durationMin: 600,
        },
      ],
    },
    /* ════ CHONGQING — J6 → J9 ════ */
    /* ── Day 6 ── */
    {
      city: "chongqing",
      travel: { from: "beijing", mode: "plane", duration: { fr: "≈ 3 h de vol", en: "≈ 3 h flight" } },
      icon: "plane",
      title: { fr: "Envol pour Chongqing", en: "Flying to Chongqing" },
      highlight: { fr: "Vol", en: "Flight" },
      summary: {
        fr: "Changement total d'ambiance : une ville verticale de 30 millions d'habitants, bâtie sur des collines au confluent de deux fleuves.",
        en: "Total change of vibe: a vertical city of 30 million people, built on hills where two rivers meet.",
      },
      stay: { fr: "Yuzhong, le centre-ville", en: "Yuzhong, downtown" },
      budgetEur: { min: 30, max: 55 },
      activities: [
        {
          time: "11:00",
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
          time: "16:00",
          kind: "transport",
          title: { fr: "Installation à Yuzhong", en: "Settling in Yuzhong" },
          description: {
            fr: "Métro ou DiDi jusqu'à Yuzhong, la péninsule centrale : c'est là qu'il faut loger.",
            en: "Metro or DiDi to Yuzhong, the central peninsula — that's where to stay.",
          },
          durationMin: 60,
          price: { min: 10, max: 80 },
          tip: {
            fr: "Ici, un même immeuble peut avoir une entrée au 1er et une autre au 22e étage. Fie-toi aux photos de l'entrée de l'hôtel.",
            en: "Here, one building can have an entrance on floor 1 and another on floor 22. Trust the photos of the hotel entrance.",
          },
        },
        {
          time: "20:00",
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
    /* ── Day 7 ── */
    {
      city: "chongqing",
      icon: "city",
      title: { fr: "Liziba, le métro qui traverse un immeuble", en: "Liziba, the train through a building" },
      highlight: { fr: "Liziba", en: "Liziba" },
      summary: {
        fr: "Le spot le plus fou de Chongqing : la ligne 2 du monorail passe en plein milieu d'un immeuble d'habitation.",
        en: "Chongqing's craziest spot: monorail line 2 runs straight through the middle of an apartment block.",
      },
      stay: { fr: "Yuzhong, le centre-ville", en: "Yuzhong, downtown" },
      budgetEur: { min: 20, max: 45 },
      activities: [
        {
          time: "10:00",
          kind: "sight",
          title: { fr: "Station Liziba", en: "Liziba Station" },
          description: {
            fr: "La plateforme d'observation, juste sous l'immeuble, permet de voir le train entrer et ressortir du bâtiment.",
            en: "The viewing platform right below the building lets you watch the train go in and come out the other side.",
          },
          durationMin: 90,
          price: { min: 2 },
          tip: {
            fr: "Reste au moins 20 minutes : plusieurs trains passent, de quoi tenter plusieurs prises.",
            en: "Stay at least 20 minutes — several trains go by, enough for a few takes.",
          },
          place: "Liziba Station Chongqing",
        },
        {
          time: "12:30",
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
          time: "14:00",
          kind: "sight",
          title: { fr: "La ville verticale", en: "The vertical city" },
          description: {
            fr: "Escaliers, passerelles et rues empilées de Yuzhong : ici, le GPS se perd et c'est tout le charme.",
            en: "The stairways, footbridges and stacked streets of Yuzhong: GPS gets lost here, and that's the charm.",
          },
          durationMin: 180,
          price: { min: 0 },
          place: "Jiefangbei Chongqing",
        },
      ],
    },
    /* ── Day 8 ── */
    {
      city: "chongqing",
      icon: "lights",
      title: { fr: "Hongyadong de nuit", en: "Hongyadong by night" },
      highlight: { fr: "Hongyadong", en: "Hongyadong" },
      summary: {
        fr: "Journée cool, puis le grand spectacle du soir : 11 étages de maisons sur pilotis qui s'illuminent au-dessus de la Jialing.",
        en: "An easy day, then the big evening show: 11 floors of stilt houses lighting up above the Jialing River.",
      },
      stay: { fr: "Yuzhong, le centre-ville", en: "Yuzhong, downtown" },
      budgetEur: { min: 25, max: 50 },
      activities: [
        {
          time: "11:00",
          kind: "sight",
          title: { fr: "Jiefangbei", en: "Jiefangbei" },
          description: {
            fr: "Le centre vertical de la ville : passerelles, escalators géants et rues sur plusieurs niveaux.",
            en: "The city's vertical heart: footbridges, giant escalators and streets on several levels.",
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
            fr: "Ambiance « Voyage de Chihiro » : la falaise de maisons sur pilotis s'allume à la nuit tombée.",
            en: "Pure 'Spirited Away' vibes: the cliff of stilt houses lights up at nightfall.",
          },
          durationMin: 90,
          price: { min: 0 },
          tip: {
            fr: "Monte jusqu'au dernier étage : il débouche directement sur une rue de la ville haute.",
            en: "Go up to the top floor — it opens straight onto a street in the upper city.",
          },
          place: "Hongyadong Chongqing",
        },
        {
          time: "20:30",
          kind: "sight",
          title: { fr: "Vue depuis le pont Qiansimen", en: "The view from Qiansimen Bridge" },
          description: {
            fr: "La carte postale de Chongqing : Hongyadong en entier, reflété dans la rivière.",
            en: "Chongqing's postcard: the whole of Hongyadong, reflected in the river.",
          },
          durationMin: 30,
          price: { min: 0 },
          place: "Qiansimen Bridge Chongqing",
        },
        {
          time: "21:30",
          kind: "food",
          title: { fr: "Street food", en: "Street food" },
          description: {
            fr: "Brochettes épicées et snacks dans les ruelles autour de Hongyadong.",
            en: "Spicy skewers and snacks in the lanes around Hongyadong.",
          },
          durationMin: 60,
          price: { min: 30, max: 70 },
        },
      ],
    },
    /* ── Day 9 ── */
    {
      city: "chongqing",
      icon: "skyline",
      title: { fr: "Raffles City & Skywalk de nuit", en: "Raffles City & the night Skywalk" },
      highlight: { fr: "Skywalk", en: "Skywalk" },
      summary: {
        fr: "L'architecture la plus futuriste de Chongqing : un pont de verre posé à l'horizontale sur quatre tours, à découvrir une fois la nuit tombée.",
        en: "Chongqing's most futuristic architecture: a glass bridge lying horizontally across four towers, best seen after dark.",
      },
      stay: { fr: "Yuzhong, le centre-ville", en: "Yuzhong, downtown" },
      budgetEur: { min: 40, max: 75 },
      activities: [
        {
          time: "11:00",
          kind: "sight",
          title: { fr: "Chaotianmen", en: "Chaotianmen" },
          description: {
            fr: "La pointe de la péninsule, là où la Jialing et le Yangtsé se rejoignent en deux couleurs d'eau.",
            en: "The tip of the peninsula, where the Jialing and the Yangtze meet in two shades of water.",
          },
          durationMin: 60,
          price: { min: 0 },
          place: "Chaotianmen Square Chongqing",
        },
        {
          time: "13:00",
          kind: "shopping",
          title: { fr: "Raffles City", en: "Raffles City" },
          description: {
            fr: "Le complexe au pied des tours : boutiques, restos et vue sur le confluent.",
            en: "The complex at the foot of the towers: shops, restaurants and views over the confluence.",
          },
          durationMin: 120,
          place: "Raffles City Chongqing",
        },
        {
          time: "19:30",
          kind: "night",
          title: { fr: "Le Skywalk de nuit", en: "The Skywalk at night" },
          description: {
            fr: "Dans la passerelle de verre suspendue tout en haut des tours : plancher vitré et vue à 360° sur les deux fleuves et la skyline illuminée.",
            en: "Inside the glass bridge suspended at the very top of the towers: glass floor and 360° views of both rivers and the lit-up skyline.",
          },
          durationMin: 90,
          tip: {
            fr: "Réserve un créneau juste avant le coucher du soleil pour voir la ville passer du jour à la nuit.",
            en: "Book a slot just before sunset to watch the city switch from day to night.",
          },
          place: "Raffles City Chongqing The Crystal",
        },
      ],
    },
    /* ════ WULONG — J10 ════ */
    /* ── Day 10 ── */
    {
      city: "wulong",
      travel: {
        from: "chongqing",
        mode: "train",
        duration: { fr: "aller-retour dans la journée", en: "day trip, back by night" },
      },
      icon: "mountain",
      title: { fr: "Wulong, aller-retour depuis Chongqing", en: "Wulong day trip from Chongqing" },
      highlight: { fr: "3 ponts naturels", en: "3 Natural Bridges" },
      summary: {
        fr: "La grosse journée nature : train, bus, un ascenseur panoramique qui plonge dans un gouffre géant, les Trois Ponts naturels et un village caché au fond du canyon.",
        en: "The big nature day: train, bus, a panoramic lift dropping into a giant sinkhole, the Three Natural Bridges and a hidden village at the bottom of the canyon.",
      },
      stay: { fr: "Retour à Chongqing", en: "Back in Chongqing" },
      budgetEur: { min: 45, max: 80 },
      activities: [
        {
          time: "07:00",
          kind: "transport",
          title: { fr: "Train Chongqing → Wulong", en: "Train Chongqing → Wulong" },
          description: {
            fr: "Train rapide jusqu'à la gare de Wulong. Prends l'aller et le retour d'avance.",
            en: "Fast train to Wulong station. Book both ways in advance.",
          },
          durationMin: 90,
          price: { min: 40, max: 80 },
          tip: {
            fr: "Pars avec l'un des premiers trains : la journée est longue et il faut garder de la marge pour le retour.",
            en: "Take one of the first trains — it's a long day and you need some margin for the way back.",
          },
        },
        {
          time: "08:45",
          kind: "transport",
          title: { fr: "Bus jusqu'au site", en: "Bus to the park" },
          description: {
            fr: "Depuis la gare, bus jusqu'au centre d'accueil des Trois Ponts naturels.",
            en: "From the station, a bus to the Three Natural Bridges visitor centre.",
          },
          durationMin: 60,
        },
        {
          time: "10:00",
          kind: "sight",
          title: { fr: "L'ascenseur panoramique", en: "The panoramic lift" },
          description: {
            fr: "Un ascenseur descend le long de la falaise jusqu'au fond du gouffre : la mise en bouche est vertigineuse.",
            en: "A lift runs down the cliff face to the bottom of the sinkhole — a dizzying opener.",
          },
          durationMin: 20,
        },
        {
          time: "10:30",
          kind: "nature",
          title: { fr: "Les Trois Ponts naturels", en: "The Three Natural Bridges" },
          description: {
            fr: "Sentier au fond du canyon, sous trois arches de roche géantes. Le décor de Transformers 4.",
            en: "A trail along the canyon floor beneath three giant rock arches. The Transformers 4 set.",
          },
          durationMin: 180,
          price: { min: 135, max: 170 },
          tip: {
            fr: "Chaussures de marche indispensables : c'est humide et glissant.",
            en: "Hiking shoes are a must — it's damp and slippery.",
          },
          place: "Three Natural Bridges Wulong",
        },
        {
          time: "13:30",
          kind: "sight",
          title: { fr: "Le village caché", en: "The hidden village" },
          description: {
            fr: "Au détour du sentier, un ancien relais aux toits de tuiles surgit au fond du canyon, comme sorti d'un film.",
            en: "Round a bend in the trail, an old tiled-roof post house appears at the bottom of the canyon, straight out of a film.",
          },
          durationMin: 60,
          place: "Tianfu Official Post Wulong",
        },
        {
          time: "16:00",
          kind: "transport",
          title: { fr: "Retour à Chongqing", en: "Back to Chongqing" },
          description: {
            fr: "Bus jusqu'à la gare, puis train : arrivée à Chongqing en début de soirée.",
            en: "Bus to the station, then the train: back in Chongqing by early evening.",
          },
          durationMin: 150,
          price: { min: 50, max: 100 },
        },
      ],
    },
    /* ════ SHANGHAI — J11 → J14 ════ */
    /* ── Day 11 ── */
    {
      city: "shanghai",
      travel: { from: "chongqing", mode: "plane", duration: { fr: "≈ 2 h 30 de vol", en: "≈ 2 h 30 flight" } },
      icon: "plane",
      title: { fr: "Envol pour Shanghai", en: "Flying to Shanghai" },
      highlight: { fr: "Vol", en: "Flight" },
      summary: {
        fr: "Dernière étape : on quitte les montagnes pour la mégapole la plus moderne de Chine.",
        en: "Last stop: leaving the mountains for China's most modern megacity.",
      },
      stay: { fr: "Huangpu, près du Bund", en: "Huangpu, near the Bund" },
      budgetEur: { min: 30, max: 55 },
      activities: [
        {
          time: "10:00",
          kind: "transport",
          title: { fr: "Vol Chongqing → Shanghai", en: "Flight Chongqing → Shanghai" },
          description: {
            fr: "Environ 2 h 30 de vol vers Hongqiao (le plus proche du centre) ou Pudong.",
            en: "About 2 h 30 in the air to Hongqiao (closest to downtown) or Pudong.",
          },
          durationMin: 150,
          price: { min: 500, max: 1000 },
          tip: {
            fr: "Vise Hongqiao : le métro t'amène au centre en 30 minutes.",
            en: "Aim for Hongqiao — the metro gets you downtown in 30 minutes.",
          },
          place: "Shanghai Hongqiao Airport",
        },
        {
          time: "14:30",
          kind: "transport",
          title: { fr: "Métro jusqu'au centre", en: "Metro to downtown" },
          description: {
            fr: "Le métro relie l'aéroport au centre sans changement compliqué.",
            en: "The metro links the airport to downtown without complicated changes.",
          },
          durationMin: 60,
          price: { min: 5, max: 10 },
          tip: {
            fr: "Le métro accepte le QR code d'Alipay : active la carte de transport dans l'appli et passe directement aux portiques.",
            en: "The metro takes Alipay's QR code — activate the transit card in the app and walk straight through the gates.",
          },
        },
        {
          time: "19:30",
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
        },
      ],
    },
    /* ── Day 12 ── */
    {
      city: "shanghai",
      icon: "skyline",
      title: { fr: "Le Bund, la Perle de l'Orient & Yuyuan", en: "The Bund, the Oriental Pearl & Yuyuan" },
      highlight: { fr: "Le Bund", en: "The Bund" },
      summary: {
        fr: "La journée carte postale : les façades Art déco du Bund, la tour de la Perle de l'Orient côté Pudong, puis le quartier de Yuyuan illuminé le soir.",
        en: "Postcard day: the Art Deco facades of the Bund, the Oriental Pearl Tower over in Pudong, then the Yuyuan quarter lit up at night.",
      },
      stay: { fr: "Huangpu, près du Bund", en: "Huangpu, near the Bund" },
      budgetEur: { min: 45, max: 85 },
      activities: [
        {
          time: "10:00",
          kind: "sight",
          title: { fr: "Le Bund", en: "The Bund" },
          description: {
            fr: "Promenade le long du Huangpu : façades Art déco d'un côté, tours futuristes de Pudong de l'autre.",
            en: "Walk along the Huangpu: Art Deco facades on one side, Pudong's futuristic towers on the other.",
          },
          durationMin: 90,
          price: { min: 0 },
          place: "The Bund Shanghai",
        },
        {
          time: "12:00",
          kind: "transport",
          title: { fr: "Ferry du Huangpu", en: "Huangpu ferry" },
          description: {
            fr: "La traversée du fleuve vers Pudong pour 2 ¥, avec la skyline en plein cadre.",
            en: "The ¥2 river crossing to Pudong, with the skyline filling the frame.",
          },
          durationMin: 20,
          price: { min: 2 },
          tip: {
            fr: "La même vue qu'une croisière, pour cent fois moins cher.",
            en: "The same view as a cruise, for a hundredth of the price.",
          },
          place: "Dongchang Road Ferry Terminal Shanghai",
        },
        {
          time: "13:00",
          kind: "sight",
          title: { fr: "La Perle de l'Orient", en: "The Oriental Pearl Tower" },
          description: {
            fr: "La tour aux sphères roses, emblème de Shanghai : plancher de verre en altitude et vue plongeante sur le Bund d'en face.",
            en: "The pink-sphered tower, Shanghai's emblem: a high glass floor and a bird's-eye view of the Bund opposite.",
          },
          durationMin: 120,
          price: { min: 160, max: 220 },
          place: "Oriental Pearl Tower",
        },
        {
          time: "15:30",
          kind: "food",
          title: { fr: "Shengjianbao", en: "Shengjianbao" },
          description: {
            fr: "Brioches grillées à la poêle, croustillantes dessous et juteuses dedans.",
            en: "Pan-fried buns, crispy underneath and juicy inside.",
          },
          durationMin: 45,
          price: { min: 20, max: 40 },
        },
        {
          time: "19:00",
          kind: "night",
          title: { fr: "Yuyuan le soir", en: "Yuyuan at night" },
          description: {
            fr: "Le soir, les toits courbés et les lanternes du bazar de Yuyuan s'allument : l'ambiance la plus féerique de Shanghai.",
            en: "At night, the curved roofs and lanterns of the Yuyuan bazaar light up — Shanghai at its most magical.",
          },
          durationMin: 90,
          price: { min: 0 },
          tip: {
            fr: "Le pont en zigzag et la maison de thé au milieu du bassin sont les plus beaux spots photo.",
            en: "The zigzag bridge and the teahouse in the middle of the pond are the best photo spots.",
          },
          place: "Yuyuan Bazaar Shanghai",
        },
      ],
    },
    /* ── Day 13 ── */
    {
      city: "shanghai",
      icon: "bike",
      title: { fr: "Vélo le long du fleuve & Nanjing Road", en: "Riverside bike ride & Nanjing Road" },
      highlight: { fr: "Vélo", en: "Bike ride" },
      summary: {
        fr: "On débloque un vélo avec Alipay et on roule le long des quais du Huangpu, avant de finir dans les néons de Nanjing Road.",
        en: "Unlock a bike with Alipay and ride along the Huangpu riverside, before finishing among the neon lights of Nanjing Road.",
      },
      stay: { fr: "Huangpu, près du Bund", en: "Huangpu, near the Bund" },
      budgetEur: { min: 25, max: 60 },
      activities: [
        {
          time: "10:00",
          kind: "transport",
          title: { fr: "Vélo partagé avec Alipay", en: "Shared bike with Alipay" },
          description: {
            fr: "Scanne le QR code d'un vélo partagé directement dans Alipay : quelques yuans l'heure, pas d'appli en plus.",
            en: "Scan a shared bike's QR code right inside Alipay: a few yuan an hour, no extra app.",
          },
          durationMin: 15,
          price: { min: 2, max: 10 },
          tip: {
            fr: "Gare-le dans les zones de stationnement marquées au sol, sinon une pénalité s'ajoute.",
            en: "Park it in the marked parking zones, otherwise a penalty is added.",
          },
        },
        {
          time: "10:30",
          kind: "nature",
          title: { fr: "Balade à vélo sur les quais", en: "Riding the riverside" },
          description: {
            fr: "Pistes cyclables le long du Huangpu, entre anciens docks reconvertis, parcs et vue sur la skyline.",
            en: "Cycle lanes along the Huangpu, past converted docks, parks and skyline views.",
          },
          durationMin: 180,
          price: { min: 0 },
        },
        {
          time: "17:00",
          kind: "shopping",
          title: { fr: "Nanjing Road", en: "Nanjing Road" },
          description: {
            fr: "La grande avenue piétonne du shopping, à remonter jusqu'à People's Square.",
            en: "The big pedestrian shopping avenue, all the way to People's Square.",
          },
          durationMin: 150,
          price: { min: 0 },
          tip: {
            fr: "Reste jusqu'à la nuit : les enseignes au néon transforment l'avenue.",
            en: "Stay until dark — the neon signs transform the avenue.",
          },
          place: "Nanjing Road Pedestrian Street",
        },
        {
          time: "20:00",
          kind: "food",
          title: { fr: "Dîner d'adieu", en: "Farewell dinner" },
          description: {
            fr: "Cuisine shanghaïenne pour la dernière soirée : porc braisé hong shao rou et crabe poilu en saison.",
            en: "Shanghainese food for the last evening: hong shao rou braised pork and hairy crab in season.",
          },
          durationMin: 90,
          price: { min: 120, max: 250 },
        },
      ],
    },
    /* ── Day 14 ── */
    {
      city: "shanghai",
      icon: "departure",
      title: { fr: "Départ", en: "Departure" },
      highlight: { fr: "Départ", en: "Departure" },
      summary: {
        fr: "Dernier petit-déjeuner chinois, derniers souvenirs, et direction l'aéroport. 再见 !",
        en: "Last Chinese breakfast, last souvenirs, and off to the airport. 再见!",
      },
      budgetEur: { min: 15, max: 35 },
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
          time: "12:30",
          kind: "transport",
          title: { fr: "Direction l'aéroport", en: "Off to the airport" },
          description: {
            fr: "Métro ou DiDi vers Pudong ou Hongqiao. Depuis Pudong, le Maglev relie Longyang Road à l'aéroport en 8 minutes.",
            en: "Metro or DiDi to Pudong or Hongqiao. For Pudong, the Maglev links Longyang Road to the airport in 8 minutes.",
          },
          durationMin: 90,
          tip: {
            fr: "Pour un vol international, compte 3 h d'avance à l'aéroport.",
            en: "For an international flight, allow 3 hours at the airport.",
          },
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
