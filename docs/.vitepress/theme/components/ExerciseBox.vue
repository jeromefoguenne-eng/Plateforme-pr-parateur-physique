<script setup>
import { ref, computed, onMounted } from 'vue'
import { userStore, formatDeadlineDisplay, getAlarmLevelInfo, parseDeadline } from '../stores/userStore'

const props = defineProps({
  exerciseId: {
    type: String,
    required: true
  },
  exerciseTitle: {
    type: String,
    required: true
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

const answerText = ref('')
const inlineFirst = ref('')
const inlineLast = ref('')
const inlineEmail = ref('')
const saveStatus = ref('')
const selectedFile = ref(null)
const uploadStatus = ref('')
const isUploading = ref(false)

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
  if (daysLate < 7) return null // Alerte uniquement à partir d'1 semaine de retard (Orange, Bordeaux, Rouge)
  const alarmInfo = getAlarmLevelInfo(daysLate)
  return {
    daysLate,
    alarmInfo
  }
})

const isDone = computed(() => {
  return userStore.isCompleted(props.exerciseId)
})

onMounted(() => {
  userStore.syncFromStorage()
  if (currentUser.value) {
    answerText.value = userStore.getUserSubmission(props.exerciseId)
  }
})

function handleSaveText() {
  if (!currentUser.value) {
    if (!inlineFirst.value || !inlineLast.value || !inlineEmail.value) {
      alert('Veuillez renseigner votre prénom, nom et email institutionnel.')
      return
    }
    userStore.register(inlineFirst.value, inlineLast.value, inlineEmail.value)
  }
  const res = userStore.saveSubmission(props.exerciseId, props.exerciseTitle, answerText.value)
  if (res.success) {
    saveStatus.value = '✓ Réponse enregistrée avec succès !'
    setTimeout(() => { saveStatus.value = '' }, 4000)
  }
}

function onFileChange(e) {
  selectedFile.value = e.target.files?.[0] || null
  uploadStatus.value = ''
}

async function handleFileUpload() {
  if (!currentUser.value) {
    if (!inlineFirst.value || !inlineLast.value || !inlineEmail.value) {
      alert('Veuillez d\'abord renseigner votre prénom, nom et email.')
      return
    }
    userStore.register(inlineFirst.value, inlineLast.value, inlineEmail.value)
  }
  if (!selectedFile.value) {
    alert('Veuillez choisir un fichier à téléverser (.xlsx, .docx ou .pdf).')
    return
  }
  isUploading.value = true
  const res = await userStore.uploadStudentFile(props.exerciseId, props.exerciseTitle, selectedFile.value)
  isUploading.value = false
  if (res.success) {
    uploadStatus.value = `✓ Fichier déposé avec succès : ${res.file?.formattedFileName}`
    selectedFile.value = null
  } else {
    alert(res.message)
  }
}
</script>

<template>
  <div class="exercise-box-wrapper">
    <div class="exercise-box-header">
      <div>
        <span class="exercise-badge">🏋️‍♂️ Travail Pratique</span>
        <h3 style="margin: 0.5rem 0 0 0; font-size: 1.35rem; color: var(--vp-c-brand-1);">
          {{ exerciseTitle }}
        </h3>
      </div>
      <div v-if="googleDriveLink">
        <a :href="googleDriveLink" target="_blank" rel="noopener noreferrer" class="exercise-drive-btn">
          📂 Ouvrir le dossier Google Drive
        </a>
      </div>
    </div>

    <p v-if="description" style="margin: 0 0 1rem 0; color: var(--vp-c-text-2);">
      {{ description }}
    </p>

    <!-- BANDEAU ÉCHÉANCE & STATUT TOUJOURS VISIBLE -->
    <div class="box-deadline-strip" :class="{ 'is-overdue': !!lateAlert, 'no-deadline': !deadlineInfo.isDefined }">
      <div class="bds-left">
        <span class="bds-icon">📅</span>
        <span class="bds-label">Date limite de remise :</span>
        <strong v-if="deadlineInfo.isDefined" class="bds-date">{{ deadlineInfo.display }}</strong>
        <span v-else class="bds-date-empty">⚪ Non fixée par l'enseignant (dépôt libre)</span>
      </div>
      <div class="bds-right">
        <span v-if="attachedFile" class="bds-badge-ok">✓ Document remis</span>
        <span v-else-if="lateAlert" class="bds-badge-late" :style="{ backgroundColor: lateAlert.alarmInfo.color }">
          {{ lateAlert.alarmInfo.icon }} {{ lateAlert.alarmInfo.label }} (+{{ lateAlert.daysLate }}j)
        </span>
        <span v-else-if="deadlineInfo.isDefined" class="bds-badge-pending">⏳ À rendre</span>
      </div>
    </div>

    <!-- Identification si non connecté -->
    <div v-if="!currentUser" style="background: var(--vp-c-bg); padding: 1.2rem; border-radius: 10px; margin-bottom: 1.5rem; border: 1px dashed var(--vp-c-brand-1);">
      <h4 style="margin: 0 0 0.8rem 0; font-size: 1rem;">👤 Identification rapide pour ce dépôt</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.8rem;">
        <input v-model="inlineFirst" placeholder="Prénom" style="padding: 8px 12px; border-radius: 6px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: inherit;" />
        <input v-model="inlineLast" placeholder="Nom" style="padding: 8px 12px; border-radius: 6px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: inherit;" />
        <input v-model="inlineEmail" placeholder="Email institutionnel" type="email" style="padding: 8px 12px; border-radius: 6px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: inherit;" />
      </div>
    </div>

    <!-- Zone de téléversement de fichier -->
    <div style="background: var(--vp-c-bg); padding: 1.2rem; border-radius: 10px; margin-bottom: 1.2rem;">
      <h4 style="margin: 0 0 0.6rem 0; font-size: 1.05rem;">📎 Déposer votre fichier (.xlsx, .docx, .pdf)</h4>
      <p style="font-size: 0.88rem; color: var(--vp-c-text-2); margin-bottom: 0.8rem;">
        Le fichier sera automatiquement renommé selon la nomenclature officielle (ex: <code>NOM_Prenom_{{ exerciseId }}.ext</code>), sauvegardé et pré-évalué par l'IA.
      </p>

      <div style="display: flex; gap: 0.8rem; align-items: center; flex-wrap: wrap;">
        <input type="file" @change="onFileChange" accept=".xlsx,.xls,.docx,.doc,.pdf,.csv" style="font-size: 0.9rem;" />
        <button @click="handleFileUpload" :disabled="!selectedFile || isUploading" style="padding: 8px 18px; background: var(--vp-c-brand-1); color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
          {{ isUploading ? 'Téléversement...' : '📤 Déposer le fichier' }}
        </button>
      </div>

      <p v-if="uploadStatus" style="color: #10b981; font-weight: 600; font-size: 0.9rem; margin-top: 0.6rem;">
        {{ uploadStatus }}
      </p>

      <!-- Fichier déjà déposé -->
      <div v-if="attachedFile" style="margin-top: 1rem; padding: 0.8rem 1rem; background: var(--vp-c-bg-soft); border-radius: 8px; border-left: 4px solid var(--vp-c-brand-1);">
        <p style="margin: 0; font-size: 0.92rem;">
          📄 <strong>Fichier actuellement enregistré :</strong> {{ attachedFile.formattedFileName }}
          <span style="color: var(--vp-c-text-2); font-size: 0.8rem;">({{ (attachedFile.fileSize / 1024).toFixed(1) }} Ko, remis le {{ attachedFile.submittedAt }})</span>
          <span v-if="attachedFile.driveSynced" style="margin-left: 8px; color: #10b981; font-weight: 600;">☁️ Google Drive</span>
        </p>
      </div>
    </div>

    <!-- Zone de réponse textuelle complémentaire -->
    <div style="background: var(--vp-c-bg); padding: 1.2rem; border-radius: 10px;">
      <h4 style="margin: 0 0 0.6rem 0; font-size: 1.05rem;">✍️ Réponses rédigées ou notes de terrain</h4>
      <textarea v-model="answerText" rows="4" placeholder="Saisissez ici vos réponses, justifications ou compléments d'analyse..." style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: inherit; font-family: inherit; resize: vertical; box-sizing: border-box;"></textarea>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.8rem;">
        <button @click="handleSaveText" style="padding: 8px 16px; background: var(--vp-c-brand-1); color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
          💾 Enregistrer la réponse
        </button>
        <span v-if="saveStatus" style="color: #10b981; font-weight: 600; font-size: 0.9rem;">
          {{ saveStatus }}
        </span>
      </div>
    </div>

    <!-- Feedback Enseignant si noté -->
    <div v-if="teacherFeedback && teacherFeedback.status === 'graded'" style="margin-top: 1.2rem; padding: 1rem 1.2rem; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px;">
      <h4 style="margin: 0 0 0.4rem 0; color: #047857; font-size: 1.05rem;">
        👨‍🏫 Évaluation de l'enseignant : <strong>{{ teacherFeedback.score }}/{{ teacherFeedback.maxScore }}</strong>
      </h4>
      <p style="margin: 0; color: #065f46; font-size: 0.92rem;">
        {{ teacherFeedback.feedback || "Devoir validé." }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.box-deadline-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  padding: 0.65rem 0.9rem;
  margin-bottom: 1.2rem;
  border-radius: 8px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  font-size: 0.86rem;
  color: #166534;
}

.box-deadline-strip.is-overdue {
  background: #fff7ed;
  border-color: #fdba74;
  color: #9a3412;
}

.box-deadline-strip.no-deadline {
  background: var(--vp-c-bg);
  border: 1px dashed var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.bds-left {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.bds-icon {
  font-size: 1rem;
}

.bds-label {
  font-weight: 500;
  opacity: 0.9;
}

.bds-date {
  font-weight: 700;
  color: #0f172a;
}

html.dark .bds-date {
  color: #f8fafc;
}

.bds-date-empty {
  font-style: italic;
  color: var(--vp-c-text-2);
}

.bds-right {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.bds-badge-ok {
  font-size: 0.76rem;
  font-weight: 700;
  color: #15803d;
  background: #dcfce7;
  padding: 2px 8px;
  border-radius: 9999px;
}

.bds-badge-late {
  font-size: 0.76rem;
  font-weight: 700;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 9999px;
}

.bds-badge-pending {
  font-size: 0.76rem;
  font-weight: 600;
  color: #b45309;
  background: #fef3c7;
  padding: 2px 8px;
  border-radius: 9999px;
}
</style>
