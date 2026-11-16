/**
 * Configuration de next-sitemap pour générer automatiquement les fichiers sitemap.xml et robots.txt.
 * Les commentaires détaillent chaque option pour faciliter la maintenance.
 * @type {import('next-sitemap').IConfig}
 */
const config = {
  // URL canonique du site, indispensable pour que les URLs générées soient absolues.
  siteUrl: 'https://kenzenbien.fr',

  // Active la génération automatique du fichier robots.txt à chaque exécution de next-sitemap.
  generateRobotsTxt: true,

  // Limite le nombre d'URL par fichier sitemap afin d'éviter les fichiers trop volumineux.
  sitemapSize: 5000,

  // Valeur par défaut pour la fréquence d'exploration suggérée aux moteurs de recherche.
  changefreq: 'weekly',

  // Priorité par défaut pour les pages qui ne sont pas explicitement listées dans la logique ci-dessous.
  priority: 0.7,

  // Fichiers de métadonnées et API : pas des pages.
  exclude: ['/icon.png', '/apple-icon.png', '/favicon.ico', '/manifest.webmanifest', '/icons/*', '/api/*'],

  // Personnalisation fine de chaque URL du sitemap.
  transform: async (config, path) => {
    // Cartographie des pages principales avec leur priorité SEO souhaitée.
    // Les deux accueils (Pro et Créateur) en tête, puis leurs pages.
    const priorityOverrides = new Map([
      ['/', 1.0],
      ['/createur', 1.0],
      ['/agents', 0.8],
      ['/createur/voyage', 0.8],
      ['/createur/sport', 0.8],
    ]);

    // Les itinéraires jour par jour (/createur/itineraire/<pays>) : des guides, au rang des pages d'univers.
    const isItinerary = path.startsWith('/createur/itineraire/');

    return {
      // Laisser le chemin relatif permet à next-sitemap de préfixer automatiquement avec siteUrl.
      loc: path,
      changefreq: config.changefreq ?? 'weekly',
      priority: priorityOverrides.get(path) ?? (isItinerary ? 0.8 : undefined) ?? config.priority ?? 0.7,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },

  // Paramétrage du robots.txt généré, avec inclusion du lien vers le sitemap.
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: ['https://kenzenbien.fr/sitemap.xml'],
  },
};

module.exports = config;


