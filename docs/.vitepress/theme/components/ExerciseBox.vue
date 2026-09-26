<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { 
  userStore, 
  formatDeadlineDisplay, 
  getAlarmLevelInfo, 
  parseDeadline,
  EXERCISE_DOCS_DATA 
} from '../stores/userStore'

const props = defineProps({
  exerciseId: {
    type: String,
    required: true
  },
  exerciseTitle: {
    type: String,
    required: false,
    default: ''
  },
  googleDriveLink: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})

const docInfo = computed(() => {
  return EXERCISE_DOCS_DATA[props.exerciseId] || null
})

const effectiveTitle = computed(() => {
  return props.exerciseTitle || docInfo.value?.title || 'Exercice pratique'
})

const effectiveDescription = computed(() => {
  return props.description || docInfo.value?.description || ''
})

const currentUser = computed(() => userStore.currentUser)

const attachedFile = computed(() => {
  const files = userStore.getUserFiles()
  return files.find(f => f.exerciseId === props.exerciseId)
})

const teacherFeedback = computed(() => {
  return userStore.getExerciseFeedback(props.exerciseId)
})

const deadlineInfo = computed(() => {
  const d = userStore.getExerciseDeadline(props.exerciseId)
  if (!d || !d.isDefined || !d.deadline) {
    return {
      isDefined: false,
      deadline: '',
      display: 'Non fixée',
      label: ''
    }
  }
  return {
    isDefined: true,
    deadline: d.deadline,
    display: formatDeadlineDisplay(d.deadline),
    label: d.label || ''
  }
})

const lateAlert = computed(() => {
  if (attachedFile.value) return null
  const d = userStore.getExerciseDeadline(props.exerciseId)
  if (!d || !d.isDefined || !d.deadline) return null

  const deadlineDate = parseDeadline(d.deadline)
  if (!deadlineDate) return null
  const now = new Date()
  if (now <= deadlineDate) return null

  const daysLate = Math.max(1, Math.floor((now.getTime() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24)))
  if (daysLate < 7) return null
  const alarmInfo = getAlarmLevelInfo(daysLate)
  return {
    daysLate,
    alarmInfo
  }
})

// URLs pour les actions Google Docs
const googleDocsViewUrl = computed(() => {
  if (docInfo.value?.docId) {
    return `https://docs.google.com/document/d/${docInfo.value.docId}/preview`
  }
  return props.googleDriveLink || '#'
})

const googleDocsCopyUrl = computed(() => {
  if (docInfo.value?.docId) {
    return `https://docs.google.com/document/d/${docInfo.value.docId}/copy`
  }
  return props.googleDriveLink || '#'
})

const googleDocsPdfUrl = computed(() => {
  if (docInfo.value?.docId) {
    return `https://docs.google.com/document/d/${docInfo.value.docId}/export?format=pdf`
  }
  return ''
})

const localWordUrl = computed(() => {
  if (docInfo.value?.fileBase) {
    return withBase(`/documents/${docInfo.value.fileBase}`)
  }
  return ''
})

function getCompanionUrl(fileBase) {
  return withBase(`/documents/${fileBase}`)
}
</script>

<template>
  <div class="exercise-box-wrapper">
    <!-- EN-TÊTE PRINCIPAL -->
    <div class="exercise-box-header">
      <div class="header-badges">
        <span class="exercise-badge">🏋️‍♂️ Travail Pratique Associé</span>
        <span v-if="docInfo" class="weighting-badge">
          ⭐ Pondération : {{ docInfo.weightPct }}% ({{ docInfo.points }} pts)
        </span>
      </div>
      <h3 class="exercise-title">
        {{ effectiveTitle }}
      </h3>
    </div>

    <!-- DESCRIPTION / CONSIGNES -->
    <div v-if="effectiveDescription" class="exercise-description">
      <p>{{ effectiveDescription }}</p>
    </div>

    <!-- BANDEAU ÉCHÉANCE & ÉTAT DE REMISE -->
    <div class="box-deadline-strip" :class="{ 'is-overdue': !!lateAlert, 'no-deadline': !deadlineInfo.isDefined }">
      <div class="bds-left">
        <span class="bds-icon">📅</span>
        <span class="bds-label">Date limite de remise :</span>
        <strong v-if="deadlineInfo.isDefined" class="bds-date">{{ deadlineInfo.display }}</strong>
        <span v-else class="bds-date-empty">⚪ Non fixée par l'enseignant (dépôt libre)</span>
      </div>
      <div class="bds-right">
        <span v-if="attachedFile" class="bds-badge-ok">✓ Document remis ({{ attachedFile.formattedFileName }})</span>
        <span v-else-if="lateAlert" class="bds-badge-late" :style="{ backgroundColor: lateAlert.alarmInfo.color }">
          {{ lateAlert.alarmInfo.icon }} {{ lateAlert.alarmInfo.label }} (+{{ lateAlert.daysLate }}j)
        </span>
        <span v-else-if="deadlineInfo.isDefined" class="bds-badge-pending">⏳ À déposer dans l'Espace Membre</span>
        <span v-else class="bds-badge-open">📋 Dépôt libre ouvert</span>
      </div>
    </div>

    <!-- DOCUMENT OFFICIEL GOOGLE DOCS (BOUTONS D'ACTION) -->
    <div class="docs-action-card">
      <div class="dac-header">
        <span class="dac-icon">📋</span>
        <div>
          <strong class="dac-title">Document de travail officiel (Google Docs)</strong>
          <span class="dac-subtitle">Sujet intégral, grilles d'analyse et barème critérié</span>
        </div>
      </div>

      <p class="dac-instructions">
        Le document de travail officiel est mis à disposition en <strong>lecture seule</strong>. Vous pouvez le consulter directement dans votre navigateur, en créer une copie dans votre propre Google Drive pour y travailler en ligne, ou le télécharger au format Word (.docx) ou PDF :
      </p>

      <!-- GRILLE DES BOUTONS D'ACTION -->
      <div class="dac-buttons-grid">
        <a 
          :href="googleDocsViewUrl" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn-doc btn-view"
        >
          <span class="btn-icon">👁️</span>
          <span>Consulter le sujet (Google Docs) ↗</span>
        </a>

        <a 
          :href="googleDocsCopyUrl" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn-doc btn-copy"
        >
          <span class="btn-icon">📋</span>
          <span>Créer une copie dans mon Drive</span>
        </a>

        <a 
          v-if="localWordUrl"
          :href="localWordUrl" 
          download 
          class="btn-doc btn-docx"
        >
          <span class="btn-icon">💾</span>
          <span>Télécharger Word (.docx)</span>
        </a>

        <a 
          v-if="googleDocsPdfUrl"
          :href="googleDocsPdfUrl" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn-doc btn-pdf"
        >
          <span class="btn-icon">📄</span>
          <span>Télécharger PDF</span>
        </a>
      </div>

      <!-- FICHIERS COMPAGNONS SI PRÉSENTS (EXCEL, DONNÉES, TUTORIEL) -->
      <div v-if="docInfo?.companionFiles && docInfo.companionFiles.length > 0" class="dac-companions-block">
        <span class="dac-companions-title">📁 Ressources & Données d'accompagnement :</span>
        <div class="dac-companions-list">
          <a 
            v-for="(cf, idx) in docInfo.companionFiles" 
            :key="idx"
            :href="getCompanionUrl(cf.fileBase)"
            :download="cf.downloadName || cf.fileBase"
            class="btn-doc btn-companion"
          >
            <span class="btn-icon">{{ cf.icon }}</span>
            <span>{{ cf.name }}</span>
          </a>
        </div>
      </div>
    </div>

    <!-- ZONE D'ORIENTATION VERS L'ESPACE MEMBRE (PAS DE DÉPÔT DANS L'ENCADRÉ) -->
    <div class="deposit-callout-card">
      <div class="dcc-content">
        <div class="dcc-icon-wrapper">
          <span class="dcc-big-icon">📤</span>
        </div>
        <div class="dcc-text-wrapper">
          <h4 class="dcc-title">Dépôt du travail réalisé dans votre Espace Membre</h4>
          <p class="dcc-text">
            Une fois vos réponses rédigées, vous devez <strong>impérativement déposer votre fichier (.xlsx, .docx ou .pdf)</strong> sur votre <strong>Espace Membre Étudiant</strong> (onglet <em>« 📤 Déposer un devoir »</em>).
          </p>
          <p class="dcc-subtext">
            ℹ️ Votre document sera automatiquement libellé selon la nomenclature officielle (<code>NOM_Prenom_{{ exerciseId }}...</code>), dupliqué dans le dossier Drive sécurisé de l'enseignant et pré-évalué formativement par l'IA.
          </p>
        </div>
      </div>

      <div class="dcc-action">
        <a :href="withBase('/espace-membre')" class="btn-go-espace-membre">
          <span>🚀 Accéder à mon Espace Membre pour déposer ce travail →</span>
        </a>
      </div>
    </div>

    <!-- FEEDBACK ENSEIGNANT SI NOTÉ -->
    <div v-if="teacherFeedback && teacherFeedback.status === 'graded'" class="teacher-evaluation-box">
      <div class="teb-header">
        <span class="teb-icon">👨‍🏫</span>
        <h4 class="teb-title">
          Évaluation officielle de l'enseignant : 
          <span class="teb-score">{{ teacherFeedback.score }}/{{ teacherFeedback.maxScore }}</span>
        </h4>
      </div>
      <p class="teb-feedback">
        {{ teacherFeedback.feedback || "Travail évalué et validé par l'enseignant." }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.exercise-box-wrapper {
  margin: 3rem 0 2.5rem 0;
  padding: 1.8rem;
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 10px 30px rgba(2, 132, 199, 0.08);
}

.exercise-box-header {
  margin-bottom: 1.2rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 1rem;
}

.header-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.6rem;
}

.exercise-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--vp-c-brand-1);
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.weighting-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 700;
}

html.dark .weighting-badge {
  background: rgba(245, 158, 11, 0.15);
  color: #fde68a;
  border-color: rgba(245, 158, 11, 0.3);
}

.exercise-title {
  margin: 0;
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}

.exercise-description {
  margin-bottom: 1.3rem;
  font-size: 0.98rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.exercise-description p {
  margin: 0;
  text-align: justify;
}

/* BANDEAU ÉCHÉANCE */
.box-deadline-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  border-left: 5px solid var(--vp-c-brand-1);
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

html.dark .box-deadline-strip {
  background: rgba(2, 132, 199, 0.12);
  border-color: rgba(2, 132, 199, 0.3);
}

.box-deadline-strip.no-deadline {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
  border-left-color: #94a3b8;
}

.box-deadline-strip.is-overdue {
  background: #fef2f2;
  border-color: #fecaca;
  border-left-color: #ef4444;
}

html.dark .box-deadline-strip.is-overdue {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.3);
}

.bds-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bds-icon {
  font-size: 1.1rem;
}

.bds-label {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.bds-date {
  color: var(--vp-c-brand-1);
  font-weight: 800;
}

.bds-date-empty {
  color: var(--vp-c-text-2);
  font-style: italic;
}

.bds-badge-ok {
  background: #10b981;
  color: #fff;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
}

.bds-badge-late {
  color: #fff;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
}

.bds-badge-pending {
  background: #f59e0b;
  color: #fff;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
}

.bds-badge-open {
  background: #0284c7;
  color: #fff;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
}

/* CARTE DOCUMENTS OFFICIELS */
.docs-action-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.4rem;
  margin-bottom: 1.5rem;
}

.dac-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 0.8rem;
}

.dac-icon {
  font-size: 1.6rem;
}

.dac-title {
  display: block;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.dac-subtitle {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.dac-instructions {
  margin: 0 0 1.2rem 0;
  font-size: 0.92rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
  text-align: justify;
}

.dac-buttons-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-doc {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none !important;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.btn-doc:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-view {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--vp-c-divider);
}

.btn-view:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}

.btn-copy {
  background: #059669;
  color: #ffffff !important;
  border: 1px solid #047857;
}

.btn-copy:hover {
  background: #047857;
}

.btn-docx {
  background: #2563eb;
  color: #ffffff !important;
  border: 1px solid #1d4ed8;
}

.btn-docx:hover {
  background: #1d4ed8;
}

.btn-pdf {
  background: #dc2626;
  color: #ffffff !important;
  border: 1px solid #b91c1c;
}

.btn-pdf:hover {
  background: #b91c1c;
}

.btn-companion {
  background: #4f46e5;
  color: #ffffff !important;
  border: 1px solid #4338ca;
}

.btn-companion:hover {
  background: #4338ca;
}

.dac-companions-block {
  margin-top: 1.2rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--vp-c-divider);
}

.dac-companions-title {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--vp-c-text-2);
  margin-bottom: 0.6rem;
}

.dac-companions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* CARTE DE DÉPÔT DANS L'ESPACE MEMBRE */
.deposit-callout-card {
  background: rgba(2, 132, 199, 0.05);
  border: 1.5px dashed var(--vp-c-brand-1);
  border-radius: 12px;
  padding: 1.4rem;
}

html.dark .deposit-callout-card {
  background: rgba(2, 132, 199, 0.08);
}

.dcc-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 1.2rem;
}

.dcc-icon-wrapper {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 10px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dcc-big-icon {
  font-size: 1.5rem;
}

.dcc-title {
  margin: 0 0 0.4rem 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--vp-c-brand-1);
}

.dcc-text {
  margin: 0 0 0.5rem 0;
  font-size: 0.92rem;
  color: var(--vp-c-text-1);
  line-height: 1.55;
  text-align: justify;
}

.dcc-subtext {
  margin: 0;
  font-size: 0.84rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.dcc-action {
  text-align: center;
}

.btn-go-espace-membre {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 520px;
  padding: 12px 24px;
  background: var(--vp-c-brand-1);
  color: #ffffff !important;
  font-weight: 800;
  font-size: 0.95rem;
  border-radius: 10px;
  text-decoration: none !important;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25);
}

.btn-go-espace-membre:hover {
  background: var(--vp-c-brand-2, #0270a8);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(2, 132, 199, 0.35);
}

/* FEEDBACK ENSEIGNANT */
.teacher-evaluation-box {
  margin-top: 1.5rem;
  padding: 1.2rem 1.4rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-left: 5px solid #10b981;
  border-radius: 10px;
}

html.dark .teacher-evaluation-box {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.teb-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.5rem;
}

.teb-icon {
  font-size: 1.4rem;
}

.teb-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: #047857;
}

.teb-score {
  font-size: 1.2rem;
  font-weight: 900;
  color: #065f46;
}

.teb-feedback {
  margin: 0;
  font-size: 0.92rem;
  color: #065f46;
  line-height: 1.55;
  text-align: justify;
}

@media (max-width: 640px) {
  .exercise-box-wrapper {
    padding: 1.2rem;
  }
  .btn-doc {
    width: 100%;
    justify-content: center;
  }
  .dcc-content {
    flex-direction: column;
  }
}
</style>
