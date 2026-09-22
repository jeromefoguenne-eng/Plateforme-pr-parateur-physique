<script setup>
const modules = [
  {
    id: "00",
    title: "00. Introduction & Révolution des données",
    desc: "Passer du « je pense » au « je mesure ». Individualisation de la charge, prévention des blessures et réduction de l'imprévisibilité.",
    link: "/modules/00-introduction",
    icon: "📊",
    tag: "Fondements"
  },
  {
    id: "01",
    title: "01. Récolte de données : les capteurs",
    desc: "Panorama complet : GNSS/GPS, LPS, IMU, cellules photoélectriques, plateformes de force, VBT, dynamomètres, wattmètres, lactatémie.",
    link: "/modules/01-capteurs",
    icon: "🛰️",
    tag: "Capteurs"
  },
  {
    id: "02",
    title: "02. Importation & Logiciels dédiés",
    desc: "Formats bruts (.fit, .csv, .gpx, .tcx). Complémentarité Excel vs plateformes spécialisées (Nolio, TrainingPeaks, Intervals.icu, Kinovea).",
    link: "/modules/02-importation-logiciels",
    icon: "💾",
    tag: "Logiciels"
  },
  {
    id: "03",
    title: "03. Structurer & Analyser avec Excel",
    desc: "De la donnée brute à l'information. Règles de structuration, formules, références absolues, fonctions conditionnelles et Tableaux Croisés Dynamiques.",
    link: "/modules/03-excel-structuration",
    icon: "📈",
    tag: "Excel"
  },
  {
    id: "04",
    title: "04. Créer ses propres outils de suivi",
    desc: "Concevoir des outils de terrain opérationnels : Indice de Hooper, Session-RPE (Foster), charge aiguë/chronique, journal de bord et suivi nutritionnel.",
    link: "/modules/04-propres-outils-collecte",
    icon: "🛠️",
    tag: "Outils Pro"
  },
  {
    id: "05",
    title: "05. Données & Recherche scientifique",
    desc: "Veille scientifique assistée par IA (PubMed, Consensus, Perplexity) et synthèse rigoureuse avec NotebookLM sans hallucination.",
    link: "/modules/05-veille-recherche-scientifique",
    icon: "🔬",
    tag: "Science"
  },
  {
    id: "06",
    title: "06. Agents & Applications IA dans le sport",
    desc: "Différence entre IA générative et agents autonomes. Création de copilotes sur mesure avec Google Antigravity pour la préparation physique.",
    link: "/modules/06-agents-ia-sport",
    icon: "🤖",
    tag: "IA & Agents"
  },
  {
    id: "07",
    title: "07. Mission professionnelle finale",
    desc: "Mission intégrative du terrain à la décision : collecte, nettoyage, analyse TCD, visualisation et préconisations d'entraînement.",
    link: "/modules/07-mission-finale",
    icon: "🏆",
    tag: "Évaluation"
  }
]
</script>

<template>
  <div class="course-grid">
    <a 
      v-for="mod in modules" 
      :key="mod.id" 
      :href="mod.link" 
      class="course-tile"
    >
      <span class="tile-icon">{{ mod.icon }}</span>
      <h3 class="tile-title">{{ mod.title }}</h3>
      <p class="tile-desc">{{ mod.desc }}</p>
      <div class="tile-footer">
        <span class="tile-tag">{{ mod.tag }}</span>
        <span class="tile-action">Accéder →</span>
      </div>
    </a>
  </div>
</template>
