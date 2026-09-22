import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Outils Informatiques & Préparation Physique",
  titleTemplate: ":title | HECh Préparation Physique",
  description: "Plateforme et notes de cours d'exploitation des outils informatiques spécifiques pour les préparateurs physiques (HECh)",
  base: "/Plateforme-pr-parateur-physique/",
  lang: "fr-FR",
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  head: [
    ['meta', { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' }],
    ['meta', { 'http-equiv': 'X-Frame-Options', content: 'SAMEORIGIN' }],
    ['meta', { 'http-equiv': 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }],
    ['meta', { name: 'theme-color', content: '#0284c7' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/images/favicon.svg' }]
  ],

  themeConfig: {
    siteTitle: "Outils Info Prépa Physique",

    nav: [
      { text: "Accueil", link: "/" },
      { text: "👤 Espace Membre", link: "/espace-membre" },
      { text: "📚 Modules", link: "/modules/00-introduction" },
      { text: "🧭 Guide & Évaluation", link: "/guide/" },
      { text: "📁 Ressources", link: "/ressources/documents" },
      { text: "🔒 Admin", link: "/admin" }
    ],

    sidebar: {
      '/modules/': [
        {
          text: "Navigation",
          items: [
            { text: "🏠 Accueil du Cours", link: "/" },
            { text: "👤 Mon Espace Membre", link: "/espace-membre" }
          ]
        },
        {
          text: "Modules du Cours",
          collapsed: false,
          items: [
            { text: "00. Introduction : Révolution des données", link: "/modules/00-introduction" },
            { text: "01. Récolte de données & Capteurs", link: "/modules/01-capteurs" },
            { text: "02. Importation & Logiciels dédiés", link: "/modules/02-importation-logiciels" },
            { text: "03. Structurer & Analyser avec Excel", link: "/modules/03-excel-structuration" },
            { text: "04. Créer ses propres outils de suivi", link: "/modules/04-propres-outils-collecte" },
            { text: "05. Données & Recherche scientifique", link: "/modules/05-veille-recherche-scientifique" },
            { text: "06. Agents & Applications IA dans le sport", link: "/modules/06-agents-ia-sport" },
            { text: "07. Mission professionnelle finale", link: "/modules/07-mission-finale" }
          ]
        },
        {
          text: "Ressources & Documents",
          collapsed: true,
          items: [
            { text: "📁 Fichiers modèles & Données", link: "/ressources/documents" },
            { text: "📚 Bibliographie scientifique", link: "/ressources/bibliographie" }
          ]
        }
      ],

      '/guide/': [
        {
          text: "Navigation",
          items: [
            { text: "🏠 Accueil du Cours", link: "/" },
            { text: "👤 Mon Espace Membre", link: "/espace-membre" }
          ]
        },
        {
          text: "Guide & Modalités",
          items: [
            { text: "📌 Présentation de l'UE & Objectifs", link: "/guide/" },
            { text: "🤖 Grille & Critères de correction IA", link: "/guide/criteres-correction-ia" }
          ]
        }
      ],

      '/ressources/': [
        {
          text: "Navigation",
          items: [
            { text: "🏠 Accueil du Cours", link: "/" },
            { text: "👤 Mon Espace Membre", link: "/espace-membre" }
          ]
        },
        {
          text: "Boîte à Outils",
          items: [
            { text: "📁 Fichiers modèles & Jeux de données", link: "/ressources/documents" },
            { text: "📚 Bibliographie scientifique complète", link: "/ressources/bibliographie" }
          ]
        }
      ]
    },

    footer: {
      message: "Haute École Charlemagne (HECh) — Spécialisation en Préparation Physique",
      copyright: "Licence CC BY-NC-SA 4.0 — Jérôme Foguenne"
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Rechercher dans le cours...',
                buttonAriaLabel: 'Rechercher'
              },
              modal: {
                noResultsText: 'Aucun résultat trouvé pour',
                resetButtonTitle: 'Effacer la recherche',
                footer: {
                  selectText: 'choisir',
                  navigateText: 'naviguer',
                  closeText: 'fermer'
                }
              }
            }
          }
        }
      }
    },

    outline: {
      level: [2, 3],
      label: "Sur cette page"
    },

    docFooter: {
      prev: "Section précédente",
      next: "Section suivante"
    }
  }
})
