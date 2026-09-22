<script setup>
import { withBase } from 'vitepress'

const tiles = [
  {
    id: "00",
    title: "00. Introduction & Révolution des Données",
    desc: "Passer du « je pense » au « je mesure ». Individualisation de la charge, prévention des blessures et réduction de l'imprévisibilité.",
    link: "/modules/00-introduction",
    image: "/images/tile-00-intro.jpg",
    tag: "Fondements"
  },
  {
    id: "01",
    title: "01. Récolte de Données : Les Capteurs",
    desc: "Panorama complet : GNSS/GPS, LPS, IMU, cellules photoélectriques, plateformes de force, encodeurs VBT, wattmètres, lactatémie.",
    link: "/modules/01-capteurs",
    image: "/images/tile-01-capteurs.jpg",
    tag: "Capteurs"
  },
  {
    id: "02",
    title: "02. Importation & Logiciels Dédiés",
    desc: "Formats bruts (.fit, .csv, .gpx, .tcx) et complémentarité Excel vs plateformes spécialisées (Nolio, TrainingPeaks, WKO5, Kinovea).",
    link: "/modules/02-importation-logiciels",
    image: "/images/tile-02-logiciels.jpg",
    tag: "Logiciels"
  },
  {
    id: "03",
    title: "03. Structurer & Analyser avec Excel",
    desc: "De la donnée brute à l'information. Règles de structuration tabulaire, formules, références absolues et Tableaux Croisés Dynamiques.",
    link: "/modules/03-excel-structuration",
    image: "/images/tile-03-excel.jpg",
    tag: "Excel"
  },
  {
    id: "04",
    title: "04. Créer ses Propres Outils de Suivi",
    desc: "Concevoir des fiches de terrain opérationnelles : Indice de Hooper, Session-RPE de Foster, ratio charge aiguë/chronique, journal de bord.",
    link: "/modules/04-propres-outils-collecte",
    image: "/images/tile-04-outils.jpg",
    tag: "Outils Pro"
  },
  {
    id: "05",
    title: "05. Données & Recherche Scientifique",
    desc: "Veille scientifique assistée par IA (PubMed, Consensus, Perplexity) et synthèse rigoureuse avec NotebookLM sans hallucination.",
    link: "/modules/05-veille-recherche-scientifique",
    image: "/images/tile-05-science.jpg",
    tag: "Science"
  },
  {
    id: "06",
    title: "06. Agents & Applications IA dans le Sport",
    desc: "Différence entre modèle génératif et agent autonome. Création de copilotes sur mesure avec Google Antigravity pour le staff.",
    link: "/modules/06-agents-ia-sport",
    image: "/images/tile-06-agents.jpg",
    tag: "IA & Agents"
  },
  {
    id: "07",
    title: "07. Mission Professionnelle Finale",
    desc: "Mission intégrative du terrain à la décision : collecte, nettoyage, analyse TCD, visualisation et préconisations d'entraînement.",
    link: "/modules/07-mission-finale",
    image: "/images/tile-07-mission.jpg",
    tag: "Évaluation"
  }
]
</script>

<template>
  <div class="tiles-container">
    <div class="compact-grid">
      <a 
        v-for="tile in tiles" 
        :key="tile.id" 
        :href="withBase(tile.link)" 
        class="compact-tile"
      >
        <div class="tile-image-wrapper">
          <img :src="withBase(tile.image)" :alt="tile.title" class="tile-image" loading="lazy" />
          <span class="tile-tag-badge">{{ tile.tag }}</span>
        </div>
        <div class="tile-body">
          <h3 class="compact-title">{{ tile.title }}</h3>
          <p class="compact-desc">{{ tile.desc }}</p>
          <div class="compact-footer">
            <span class="open-link">Ouvrir le module →</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.tiles-container {
  max-width: 1160px;
  margin: 1.5rem auto 3rem auto;
  padding: 0;
}

.compact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.compact-tile {
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  text-decoration: none !important;
  color: inherit !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.compact-tile:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
}

.tile-image-wrapper {
  position: relative;
  width: 100%;
  height: 155px;
  overflow: hidden;
  background: var(--vp-c-bg-alt);
}

.tile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.compact-tile:hover .tile-image {
  transform: scale(1.05);
}

.tile-tag-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.82);
  color: #ffffff;
  backdrop-filter: blur(4px);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tile-body {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.compact-title {
  font-size: 1.1rem;
  font-weight: 800 !important;
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
  line-height: 1.35;
}

.compact-tile:hover .compact-title {
  color: var(--vp-c-brand-1);
}

.compact-desc {
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0 0 1rem 0;
  flex-grow: 1;
}

.compact-footer {
  margin-top: auto;
  padding-top: 0.8rem;
  border-top: 1px dashed var(--vp-c-divider);
}

.open-link {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  display: inline-flex;
  align-items: center;
}
</style>
