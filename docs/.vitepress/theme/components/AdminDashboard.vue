<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { userStore, OFFICIAL_EVALUATION_ITEMS, formatDeadlineDisplay, getAlarmLevelInfo, parseDeadline } from '../stores/userStore'
import { DEFAULT_CLOUD_URL } from '../stores/cloudSync'

const enteredPin = ref('')
const showAdminPin = ref(false)
const isAuthenticated = ref(false)
const lockoutSeconds = ref(0)
const loginErrorMessage = ref('')
let lockoutTimer = null
let inactivityTimer = null
let liveSyncInterval = null
const INACTIVITY_LIMIT_MS = 30 * 60 * 1000 // Verrouillage auto après 30 min
const adminTab = ref('students') // 'students' | 'deadlines' | 'quizzes' | 'submissions' | 'files' | 'export'

// Synchronisation Cloud
const isCloudSyncing = ref(false)
const cloudSyncFeedback = ref('')
const webhookInput = ref(userStore.cloudUrl || DEFAULT_CLOUD_URL)
const webhookStatus = ref('')

// Synchronisation directe vers le dossier local Google Drive
const isSyncingLocalDir = ref(false)
const localDirSyncStatus = ref('')

// Échéances composées (Date + Heure)
const deadlineDates = ref({})
const deadlineTimes = ref({})

// Tri du tableau des étudiants
const studentSortKey = ref('name') // 'name' | 'status' | 'email' | 'registeredAt' | 'progress' | 'grade'
const studentSortOrder = ref('asc') // 'asc' | 'desc'

function toggleStudentSort(key) {
  if (studentSortKey.value === key) {
    studentSortOrder.value = studentSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    studentSortKey.value = key
    studentSortOrder.value = 'asc'
  }
}

// DOSSIER COMPLET ÉTUDIANT (MODAL PLEIN ÉCRAN)
const selectedDossierEmail = ref('')
const activeDocPreview = ref(null) // { fileId, fileName, type: 'pdf'|'docx'|'other', dataUrl, htmlContent, loading, error }
const dossierFilter = ref('all') // 'all' | 'quiz' | 'exercises' | 'submitted_only'
const expandedTexts = ref({})
const saveGridStatus = ref('')

const currentDossier = computed(() => {
  if (!selectedDossierEmail.value) return null
  return userStore.getStudentFullDossier(selectedDossierEmail.value)
})

const filteredDossierItems = computed(() => {
  if (!currentDossier.value || !currentDossier.value.items) return []
  const all = currentDossier.value.items
  if (dossierFilter.value === 'quiz') {
    return all.filter(i => i.category === 'quiz')
  }
  if (dossierFilter.value === 'exercises') {
    return all.filter(i => i.category === 'exercice' || i.category === 'final')
  }
  if (dossierFilter.value === 'submitted_only') {
    return all.filter(i => i.completed || i.file || i.submission || (i.quizAttempts && i.quizAttempts.length > 0))
  }
  return all
})

function openStudentDossier(u) {
  if (!u || !u.email) return
  selectedDossierEmail.value = u.email
  activeDocPreview.value = null
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
}

function closeStudentDossier() {
  selectedDossierEmail.value = ''
  activeDocPreview.value = null
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
}

function handleDossierKeyDown(e) {
  if (e.key === 'Escape' && selectedDossierEmail.value) {
    closeStudentDossier()
  }
}

function nextDossierStudent() {
  const list = users.value
  if (!list || list.length === 0) return
  const currentClean = (selectedDossierEmail.value || '').toLowerCase()
  const idx = list.findIndex(u => u && u.email && u.email.toLowerCase() === currentClean)
  if (idx >= 0 && idx < list.length - 1) {
    selectedDossierEmail.value = list[idx + 1].email
  } else {
    selectedDossierEmail.value = list[0].email
  }
  activeDocPreview.value = null
}

function prevDossierStudent() {
  const list = users.value
  if (!list || list.length === 0) return
  const currentClean = (selectedDossierEmail.value || '').toLowerCase()
  const idx = list.findIndex(u => u && u.email && u.email.toLowerCase() === currentClean)
  if (idx > 0) {
    selectedDossierEmail.value = list[idx - 1].email
  } else {
    selectedDossierEmail.value = list[list.length - 1].email
  }
  activeDocPreview.value = null
}

async function toggleDocumentPreview(file) {
  if (!file) return
  if (activeDocPreview.value && activeDocPreview.value.fileId === file.id) {
    activeDocPreview.value = null
    return
  }

  const fileName = file.formattedFileName || file.originalFileName || 'document'
  const ext = fileName.split('.').pop().toLowerCase()
  const isPdf = ext === 'pdf' || (file.fileType && file.fileType.includes('pdf'))
  const isDocx = ext === 'docx' || ext === 'doc' || (file.fileType && file.fileType.includes('word'))

  activeDocPreview.value = {
    fileId: file.id,
    fileName,
    type: isPdf ? 'pdf' : (isDocx ? 'docx' : 'other'),
    dataUrl: file.dataUrl || '',
    htmlContent: '',
    loading: isDocx,
    error: ''
  }

  if (isDocx && file.dataUrl) {
    try {
      const base64Data = file.dataUrl.includes(',') ? file.dataUrl.split(',')[1] : file.dataUrl
      const binaryStr = atob(base64Data)
      const len = binaryStr.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i)
      }
      const mammothModule = await import('mammoth/mammoth.browser.js')
      const mammoth = mammothModule.default || mammothModule
      const res = await mammoth.convertToHtml({ arrayBuffer: bytes.buffer })
      activeDocPreview.value.htmlContent = res.value || '<p><em>Document Word sans contenu textuel identifiable.</em></p>'
      activeDocPreview.value.loading = false
    } catch (e) {
      activeDocPreview.value.error = "Aperçu HTML direct indisponible. Veuillez télécharger le document Word pour l'ouvrir."
      activeDocPreview.value.loading = false
    }
  }
}

function adoptAiFeedbackInDossier(item) {
  if (item.aiScore !== null && item.aiScore !== undefined) {
    item.teacherScore = item.aiScore
  }
  if (item.file?.aiCorrection?.summary) {
    item.teacherFeedback = item.file.aiCorrection.summary
  } else if (item.aiSummary) {
    item.teacherFeedback = item.aiSummary
  }
}

function saveDossierItemGrade(item) {
  if (!selectedDossierEmail.value || !item) return
  userStore.saveExerciseFeedback(
    selectedDossierEmail.value,
    item.id,
    item.teacherFeedback || '',
    Number(item.teacherScore || 0),
    item.title
  )
  saveGridStatus.value = `✓ Note enregistrée pour ${item.shortTitle || item.title} (${item.teacherScore}/${item.maxPoints} pts)`
  setTimeout(() => { saveGridStatus.value = '' }, 3500)
}

function toggleTextExpand(id) {
  expandedTexts.value[id] = !expandedTexts.value[id]
}

// Lifecycle
onMounted(() => {
  userStore.syncFromStorage()
  initDeadlineInputs()
  userStore.syncWithCloud().then(() => {
    initDeadlineInputs()
  }).catch(() => {})

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleDossierKeyDown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleDossierKeyDown)
  }
  if (inactivityTimer) clearTimeout(inactivityTimer)
  if (lockoutTimer) clearInterval(lockoutTimer)
})

function initDeadlineInputs() {
  OFFICIAL_EVALUATION_ITEMS.forEach(it => {
    const d = userStore.getExerciseDeadline(it.id)
    if (d.isDefined && d.deadline) {
      const parsed = parseDeadline(d.deadline)
      if (parsed) {
        const y = parsed.getFullYear()
        const m = String(parsed.getMonth() + 1).padStart(2, '0')
        const day = String(parsed.getDate()).padStart(2, '0')
        const h = String(parsed.getHours()).padStart(2, '0')
        const min = String(parsed.getMinutes()).padStart(2, '0')
        deadlineDates.value[it.id] = `${y}-${m}-${day}`
        deadlineTimes.value[it.id] = `${h}:${min}`
      }
    } else {
      deadlineDates.value[it.id] = ''
      deadlineTimes.value[it.id] = '23:59'
    }
  })
}

const users = computed(() => {
  const base = userStore.users.filter(u => u.role === 'student' && u.status !== 'archived')
  return [...base].sort((a, b) => {
    let cmp = 0
    switch (studentSortKey.value) {
      case 'name':
        cmp = `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`, 'fr', { sensitivity: 'base' })
        break
      case 'status':
        cmp = (a.status || 'active').localeCompare(b.status || 'active')
        break
      case 'email':
        cmp = a.email.localeCompare(b.email)
        break
      case 'registeredAt':
        cmp = new Date(a.registeredAt || 0).getTime() - new Date(b.registeredAt || 0).getTime()
        break
      case 'progress': {
        const pA = getStudentProgress(a.email).pct
        const pB = getStudentProgress(b.email).pct
        cmp = pA - pB
        break
      }
      case 'grade': {
        const gA = userStore.getStudentEvaluation(a.email).totalOutOf20 || 0
        const gB = userStore.getStudentEvaluation(b.email).totalOutOf20 || 0
        cmp = gA - gB
        break
      }
      default:
        cmp = 0
    }
    return studentSortOrder.value === 'asc' ? cmp : -cmp
  })
})

const submittedFiles = computed(() => userStore.submittedFiles)
const quizAttempts = computed(() => userStore.quizAttempts)

const cloudSyncTimeText = computed(() => {
  const last = userStore.cloudSyncState.lastSyncTime
  if (!last) return 'Aucune synchronisation effectuée'
  const diffSec = Math.round((Date.now() - last) / 1000)
  if (diffSec < 60) return 'Synchronisé à l\'instant'
  if (diffSec < 3600) return `Synchronisé il y a ${Math.round(diffSec / 60)} min`
  return `Synchronisé le ${new Date(last).toLocaleDateString()} à ${new Date(last).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
})

async function triggerCloudSync() {
  isCloudSyncing.value = true
  cloudSyncFeedback.value = 'Synchronisation en cours...'
  const res = await userStore.syncWithCloud()
  isCloudSyncing.value = false
  if (res.success) {
    cloudSyncFeedback.value = '✓ Données synchronisées avec succès !'
    initDeadlineInputs()
    setTimeout(() => { cloudSyncFeedback.value = '' }, 3500)
  } else {
    cloudSyncFeedback.value = `⚠️ ${res.message}`
  }
}

function handleSaveWebhook() {
  userStore.setCloudUrl(webhookInput.value)
  webhookStatus.value = '✓ URL du Webhook Google enregistrée avec succès !'
  triggerCloudSync()
  setTimeout(() => { webhookStatus.value = '' }, 3500)
}

function checkPin() {
  loginErrorMessage.value = ''
  if (userStore.verifyAdminPin(enteredPin.value)) {
    isAuthenticated.value = true
    triggerCloudSync()
  } else {
    loginErrorMessage.value = 'Code enseignant incorrect. Mot de passe maître disponible : hech2026'
  }
}

function handleLogout() {
  isAuthenticated.value = false
  enteredPin.value = ''
  closeStudentDossier()
}

function getStudentProgress(email) {
  const completed = OFFICIAL_EVALUATION_ITEMS.filter(it => userStore.isCompleted(it.id, email)).length
  const total = OFFICIAL_EVALUATION_ITEMS.length
  return {
    completed,
    total,
    pct: total > 0 ? Math.round((completed / total) * 100) : 0
  }
}

function handleDeleteStudent(user) {
  if (!user || !user.email) return
  const confirmMsg = `Êtes-vous sûr de vouloir supprimer définitivement l'étudiant :\n\n${user.firstName} ${user.lastName} (${user.email})\n\nCette action supprimera tous ses travaux, quiz et devoirs sur cet appareil et dans le Cloud.`
  if (confirm(confirmMsg)) {
    const res = userStore.deleteStudent(user.email)
    if (res.success) {
      if (selectedDossierEmail.value.toLowerCase() === user.email.toLowerCase()) {
        closeStudentDossier()
      }
      alert(res.message)
    }
  }
}

async function handleSyncLocalDirectory() {
  if (typeof window === 'undefined' || !('showDirectoryPicker' in window)) {
    alert("Votre navigateur ne supporte pas l'accès direct aux dossiers locaux (File System Access API). Utilisez Google Chrome ou Microsoft Edge.")
    return
  }

  try {
    isSyncingLocalDir.value = true
    localDirSyncStatus.value = "Sélectionnez votre dossier Google Drive local..."
    const dirHandle = await (window).showDirectoryPicker({ mode: 'readwrite' })
    localDirSyncStatus.value = "Sauvegarde en cours dans les sous-dossiers par étudiant..."
    const result = await userStore.syncFilesToDirectory(dirHandle)
    localDirSyncStatus.value = `✓ Sauvegarde terminée : ${result.count} fichier(s) enregistrés ! (${result.errorCount} erreurs)`
    setTimeout(() => { localDirSyncStatus.value = '' }, 5000)
  } catch (err) {
    if (err.name !== 'AbortError') {
      localDirSyncStatus.value = `⚠️ Erreur : ${err.message || 'Impossible d\'écrire dans le dossier sélectionné.'}`
    } else {
      localDirSyncStatus.value = ''
    }
  } finally {
    isSyncingLocalDir.value = false
  }
}

function handleDateOrTimeChange(itemId) {
  const dVal = deadlineDates.value[itemId]
  const tVal = deadlineTimes.value[itemId] || '23:59'
  if (dVal && dVal.trim()) {
    const combined = `${dVal.trim()}T${tVal.trim()}`
    userStore.setExerciseDeadline(itemId, combined)
  } else {
    userStore.setExerciseDeadline(itemId, '')
  }
}

function saveAllDeadlines() {
  OFFICIAL_EVALUATION_ITEMS.forEach(it => {
    handleDateOrTimeChange(it.id)
  })
  alert('Toutes les échéances ont été enregistrées et synchronisées avec succès !')
}

function handleResetDeadlines() {
  if (confirm("Voulez-vous vraiment effacer toutes les dates d'échéances fixées ?")) {
    userStore.clearAllDeadlines()
    initDeadlineInputs()
    alert('Toutes les échéances ont été effacées.')
  }
}

function exportCsv() {
  let csv = "Nom de l'étudiant;Email institutionnel;Quiz (/70);Exercices (/140);Total Général (/210);Note sur 20;Pourcentage;Statut\n"
  users.value.forEach(u => {
    const ev = userStore.getStudentEvaluation(u.email)
    const status = ev.isPassing ? 'Admis' : 'En cours'
    csv += `"${u.lastName} ${u.firstName}";"${u.email}";"${ev.quizTotal}";"${ev.exercisesTotal}";"${ev.totalScore}";"${ev.totalOutOf20}";"${ev.percentage}%";"${status}"\n`
  })

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', `Releve_Notes_Prepa_Physique_${new Date().toISOString().substring(0,10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div style="max-width: 1100px; margin: 0 auto; padding: 1.5rem 0;">
    <!-- ÉCRAN DE DÉVERROUILLAGE ADMIN -->
    <div v-if="!isAuthenticated" style="max-width: 480px; margin: 3rem auto; padding: 2.5rem; background: var(--vp-c-bg-soft); border-radius: 16px; border: 1px solid var(--vp-c-divider); text-align: center; box-shadow: var(--tile-shadow);">
      <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔒</div>
      <h2 style="margin-top: 0; color: var(--vp-c-brand-1);">Espace Enseignant (Administration)</h2>
      <p style="color: var(--vp-c-text-2); margin-bottom: 1.5rem; font-size: 0.95rem;">
        Saisissez le mot de passe enseignant pour accéder au suivi des préparateurs physiques et aux évaluations.
      </p>

      <div style="display: flex; gap: 8px; margin-bottom: 1rem;">
        <input 
          v-model="enteredPin" 
          :type="showAdminPin ? 'text' : 'password'" 
          placeholder="Mot de passe d'accès (ex: hech2026)" 
          style="flex: 1; padding: 10px 14px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 1rem;"
          @keyup.enter="checkPin"
        />
        <button 
          type="button" 
          @click="showAdminPin = !showAdminPin" 
          style="padding: 10px 14px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 8px; cursor: pointer;"
        >
          {{ showAdminPin ? '👁️' : '🙈' }}
        </button>
      </div>

      <button 
        @click="checkPin" 
        style="width: 100%; padding: 12px; background: var(--vp-c-brand-1); color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;"
      >
        Déverrouiller l'Espace Admin →
      </button>

      <p v-if="loginErrorMessage" style="color: #dc2626; font-size: 0.9rem; margin-top: 1rem; font-weight: 600;">
        {{ loginErrorMessage }}
      </p>
    </div>

    <!-- TABLEAU DE BORD ADMIN PRINCIPAL -->
    <div v-else>
      <!-- HEADER ADMIN -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--vp-c-divider); flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="margin: 0; color: var(--vp-c-brand-1); display: flex; align-items: center; gap: 8px;">
            ⚙️ Tableau de Bord Enseignant
            <span style="font-size: 0.8rem; background: #ecfdf5; color: #047857; padding: 2px 8px; border-radius: 12px; font-weight: 600;">
              En ligne
            </span>
          </h2>
          <small style="color: var(--vp-c-text-2);">
            {{ cloudSyncTimeText }} • {{ users.length }} étudiant(s) inscrits
          </small>
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button 
            @click="triggerCloudSync" 
            :disabled="isCloudSyncing" 
            style="padding: 8px 14px; background: #0284c7; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;"
          >
            <span>🔄</span> {{ isCloudSyncing ? 'Sync...' : 'Synchroniser Cloud' }}
          </button>
          <button 
            @click="handleSyncLocalDirectory" 
            :disabled="isSyncingLocalDir" 
            style="padding: 8px 14px; background: #059669; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;"
            title="Sauvegarde automatique dans des dossiers nominatifs sur votre Google Drive local"
          >
            <span>📁</span> {{ isSyncingLocalDir ? 'Sauvegarde...' : 'Dossier Drive Local' }}
          </button>
          <button 
            @click="handleLogout" 
            style="padding: 8px 14px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 8px; cursor: pointer; font-weight: 600;"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <!-- MESSAGES FLASH SYNCHRONISATION -->
      <div v-if="cloudSyncFeedback" style="padding: 10px 14px; margin-bottom: 1rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0;">
        {{ cloudSyncFeedback }}
      </div>
      <div v-if="localDirSyncStatus" style="padding: 10px 14px; margin-bottom: 1rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe;">
        {{ localDirSyncStatus }}
      </div>

      <!-- ONGLETS DE NAVIGATION ADMIN -->
      <div style="display: flex; gap: 6px; margin-bottom: 1.5rem; border-bottom: 2px solid var(--vp-c-divider); padding-bottom: 4px; overflow-x: auto;">
        <button 
          v-for="t in [
            { id: 'students', label: '👥 Étudiants & Dossiers', count: users.length },
            { id: 'deadlines', label: '📅 Échéances & Délais', count: OFFICIAL_EVALUATION_ITEMS.length },
            { id: 'files', label: '📁 Travaux Déposés', count: submittedFiles.length },
            { id: 'quizzes', label: '🧠 Tentatives Quiz', count: quizAttempts.length },
            { id: 'export', label: '📊 Export & Webhook', count: null }
          ]" 
          :key="t.id"
          @click="adminTab = t.id"
          :style="{
            padding: '8px 14px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: adminTab === t.id ? '700' : '500',
            background: adminTab === t.id ? 'var(--vp-c-brand-1)' : 'transparent',
            color: adminTab === t.id ? '#fff' : 'var(--vp-c-text-1)'
          }"
        >
          {{ t.label }} <span v-if="t.count !== null" style="font-size: 0.8rem; opacity: 0.85;">({{ t.count }})</span>
        </button>
      </div>

      <!-- ONGLET 1 : ÉTUDIANTS & DOSSIERS -->
      <div v-if="adminTab === 'students'">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="margin: 0;">Liste des préparateurs physiques ({{ users.length }})</h3>
          <button @click="exportCsv" style="padding: 6px 12px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600;">
            📥 Exporter le relevé (CSV)
          </button>
        </div>

        <div style="overflow-x: auto; background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider);">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
              <tr style="background: var(--vp-c-bg); border-bottom: 2px solid var(--vp-c-divider); text-align: left;">
                <th @click="toggleStudentSort('name')" style="padding: 10px; cursor: pointer; user-select: none;">
                  Étudiant {{ studentSortKey === 'name' ? (studentSortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                </th>
                <th @click="toggleStudentSort('email')" style="padding: 10px; cursor: pointer; user-select: none; max-width: 180px;">
                  Email {{ studentSortKey === 'email' ? (studentSortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                </th>
                <th @click="toggleStudentSort('progress')" style="padding: 10px; cursor: pointer; user-select: none; text-align: center;">
                  Progression {{ studentSortKey === 'progress' ? (studentSortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                </th>
                <th @click="toggleStudentSort('grade')" style="padding: 10px; cursor: pointer; user-select: none; text-align: center;">
                  Note /20 {{ studentSortKey === 'grade' ? (studentSortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                </th>
                <th style="padding: 10px; text-align: center;">Retard / Alerte</th>
                <th style="padding: 10px; text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in users" :key="u.email" style="border-bottom: 1px solid var(--vp-c-divider);">
                <td style="padding: 10px; font-weight: 600;">
                  <a href="javascript:void(0)" @click="openStudentDossier(u)" style="color: var(--vp-c-brand-1); text-decoration: none;">
                    {{ u.lastName }} {{ u.firstName }}
                  </a>
                </td>
                <td style="padding: 10px; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="u.email">
                  <small style="color: var(--vp-c-text-2);">{{ u.email }}</small>
                </td>
                <td style="padding: 10px; text-align: center;">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <div style="width: 60px; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                      <div :style="{ width: getStudentProgress(u.email).pct + '%', height: '100%', background: '#10b981' }"></div>
                    </div>
                    <small style="font-weight: 700;">{{ getStudentProgress(u.email).pct }}%</small>
                  </div>
                </td>
                <td style="padding: 10px; text-align: center; font-weight: 700;">
                  {{ userStore.getStudentEvaluation(u.email).totalOutOf20 }} / 20
                </td>
                <td style="padding: 10px; text-align: center;">
                  <span 
                    v-if="userStore.getStudentLateStatus(u.email).isLate" 
                    :style="{ 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700', 
                      color: '#fff', 
                      backgroundColor: userStore.getStudentLateStatus(u.email).highestAlarmInfo.color 
                    }"
                  >
                    {{ userStore.getStudentLateStatus(u.email).highestAlarmInfo.icon }} Retard
                  </span>
                  <span v-else style="color: #10b981; font-size: 0.8rem; font-weight: 600;">✓ À jour</span>
                </td>
                <td style="padding: 10px; text-align: right; white-space: nowrap;">
                  <button 
                    @click="openStudentDossier(u)" 
                    style="padding: 4px 8px; background: #0284c7; color: #fff; border: none; border-radius: 4px; font-size: 0.8rem; font-weight: 600; cursor: pointer; margin-right: 6px;"
                    title="Consulter le dossier complet et corriger"
                  >
                    Dossier
                  </button>
                  <button 
                    @click="handleDeleteStudent(u)" 
                    style="padding: 4px 6px; background: #ef4444; color: #fff; border: none; border-radius: 4px; font-size: 0.8rem; cursor: pointer;"
                    title="Supprimer définitivement cet étudiant"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="6" style="padding: 2.5rem; text-align: center; color: var(--vp-c-text-2);">
                  Aucun préparateur physique inscrit pour le moment. La classe sera automatiquement complétée au fur et à mesure des inscriptions des étudiants.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ONGLET 2 : GESTION DES ÉCHÉANCES -->
      <div v-if="adminTab === 'deadlines'">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="margin: 0;">Calendrier des Échéances Officielles</h3>
            <small style="color: var(--vp-c-text-2);">
              Fixez les dates et heures limites. Les alertes de retard s'ajustent automatiquement pour tous les étudiants.
            </small>
          </div>
          <div style="display: flex; gap: 8px;">
            <button @click="saveAllDeadlines" style="padding: 8px 14px; background: var(--vp-c-brand-1); color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
              ✓ Enregistrer toutes les échéances
            </button>
            <button @click="handleResetDeadlines" style="padding: 8px 12px; background: #ef4444; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
              Effacer tout
            </button>
          </div>
        </div>

        <div style="display: grid; gap: 10px;">
          <div 
            v-for="it in OFFICIAL_EVALUATION_ITEMS" 
            :key="it.id"
            style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider); flex-wrap: wrap; gap: 10px;"
          >
            <div>
              <div style="font-weight: 700;">{{ it.title }}</div>
              <small style="color: var(--vp-c-text-2);">Pondération : {{ it.maxPoints }} pts • {{ it.category }}</small>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <input 
                type="date" 
                v-model="deadlineDates[it.id]" 
                @change="handleDateOrTimeChange(it.id)"
                style="padding: 6px 10px; border: 1px solid var(--vp-c-divider); border-radius: 6px; font-size: 0.85rem;"
              />
              <input 
                type="time" 
                v-model="deadlineTimes[it.id]" 
                @change="handleDateOrTimeChange(it.id)"
                style="padding: 6px 10px; border: 1px solid var(--vp-c-divider); border-radius: 6px; font-size: 0.85rem;"
              />
              <span v-if="userStore.getExerciseDeadline(it.id).isDefined" style="padding: 3px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; background: #e0f2fe; color: #0369a1;">
                {{ userStore.getExerciseDeadline(it.id).display }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ONGLET 3 : TRAVAUX DÉPOSÉS -->
      <div v-if="adminTab === 'files'">
        <h3 style="margin-top: 0;">Fichiers remis par les préparateurs physiques ({{ submittedFiles.length }})</h3>
        <div v-if="submittedFiles.length === 0" style="padding: 2rem; text-align: center; color: var(--vp-c-text-2);">
          Aucun document n'a encore été déposé.
        </div>
        <div v-else style="display: grid; gap: 10px;">
          <div 
            v-for="f in submittedFiles" 
            :key="f.id"
            style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider); flex-wrap: wrap; gap: 10px;"
          >
            <div>
              <div style="font-weight: 700; color: var(--vp-c-brand-1);">{{ f.formattedFileName }}</div>
              <small style="color: var(--vp-c-text-2);">
                Par <strong>{{ f.userName }}</strong> ({{ f.userEmail }}) • {{ f.exerciseTitle }} • Déposé le {{ f.submittedAt }}
              </small>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <span v-if="f.teacherGrade" style="background: #ecfdf5; color: #047857; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 700;">
                Noté : {{ f.teacherGrade.score }}/20
              </span>
              <span v-else-if="f.aiCorrection" style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">
                IA : {{ f.aiCorrection.suggestedScore }}/20
              </span>
              <a v-if="f.dataUrl" :href="f.dataUrl" :download="f.formattedFileName" style="padding: 4px 8px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 4px; font-size: 0.8rem; text-decoration: none; color: inherit;">
                📥 Télécharger
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- ONGLET 4 : TENTATIVES DE QUIZ -->
      <div v-if="adminTab === 'quizzes'">
        <h3 style="margin-top: 0;">Résultats des Quiz en ligne ({{ quizAttempts.length }})</h3>
        <div v-if="quizAttempts.length === 0" style="padding: 2rem; text-align: center; color: var(--vp-c-text-2);">
          Aucune tentative de quiz enregistrée.
        </div>
        <div v-else style="display: grid; gap: 8px;">
          <div 
            v-for="q in quizAttempts" 
            :key="q.id"
            style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--vp-c-bg-soft); border-radius: 6px; border: 1px solid var(--vp-c-divider);"
          >
            <div>
              <strong>{{ q.userName || q.userEmail }}</strong> — {{ q.moduleTitle }}
              <br/>
              <small style="color: var(--vp-c-text-2);">Passé le {{ q.submittedAt }}</small>
            </div>
            <div style="font-weight: 700; font-size: 1.1rem; color: #10b981;">
              {{ q.score }} / {{ q.totalPoints }} ({{ q.percentage }}%)
            </div>
          </div>
        </div>
      </div>

      <!-- ONGLET 5 : EXPORT & CONFIGURATION DU WEBHOOK -->
      <div v-if="adminTab === 'export'">
        <div style="display: grid; gap: 1.5rem;">
          <div style="padding: 1.5rem; background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider);">
            <h3 style="margin-top: 0;">Configuration Cloud Google Apps Script (Multi-Appareils)</h3>
            <p style="font-size: 0.9rem; color: var(--vp-c-text-2);">
              Permet la synchronisation automatique des comptes, travaux et échéances entre votre ordinateur fixe, vos ordinateurs portables et les smartphones des étudiants.
            </p>
            <div style="display: flex; gap: 8px; margin-bottom: 1rem;">
              <input 
                v-model="webhookInput" 
                type="text" 
                placeholder="https://script.google.com/macros/s/.../exec"
                style="flex: 1; padding: 10px 14px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 0.9rem;"
              />
              <button @click="handleSaveWebhook" style="padding: 10px 16px; background: var(--vp-c-brand-1); color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
                Enregistrer l'URL
              </button>
            </div>
            <p v-if="webhookStatus" style="color: #059669; font-weight: 600; font-size: 0.9rem;">{{ webhookStatus }}</p>
          </div>

          <div style="padding: 1.5rem; background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider);">
            <h3 style="margin-top: 0;">Export des données académiques</h3>
            <p style="font-size: 0.9rem; color: var(--vp-c-text-2);">
              Téléchargez le relevé de notes au format tableur (compatible Excel et Google Sheets).
            </p>
            <button @click="exportCsv" style="padding: 10px 18px; background: #0284c7; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
              📊 Télécharger le Relevé de Notes (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL PLEIN ÉCRAN : DOSSIER COMPLET DE L'ÉTUDIANT & NOTATION EN DIRECT -->
    <!-- ========================================================================= -->
    <div 
      v-if="selectedDossierEmail && currentDossier" 
      style="position: fixed; inset: 0; z-index: 9999; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(6px); display: flex; flex-direction: column; overflow: hidden;"
    >
      <!-- HEADER DU DOSSIER MODAL -->
      <div style="background: var(--vp-c-bg); border-bottom: 2px solid var(--vp-c-divider); padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h2 style="margin: 0; color: var(--vp-c-brand-1);">
              👤 {{ currentDossier.user?.lastName }} {{ currentDossier.user?.firstName }}
            </h2>
            <span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 700;">
              Dossier Préparateur Physique
            </span>
          </div>
          <small style="color: var(--vp-c-text-2);">
            {{ currentDossier.email }} • Progression : <strong>{{ userStore.getStudentEvaluation(currentDossier.email).percentage }}%</strong>
          </small>
        </div>

        <!-- NAVIGATION ENTRE ÉTUDIANTS -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <button @click="prevDossierStudent" style="padding: 6px 12px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 6px; cursor: pointer; font-weight: 600;">
            ◀ Précédent
          </button>
          <select v-model="selectedDossierEmail" style="padding: 6px 10px; border: 1px solid var(--vp-c-divider); border-radius: 6px; font-size: 0.9rem;">
            <option v-for="u in users" :key="u.email" :value="u.email">
              {{ u.lastName }} {{ u.firstName }}
            </option>
          </select>
          <button @click="nextDossierStudent" style="padding: 6px 12px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 6px; cursor: pointer; font-weight: 600;">
            Suivant ▶
          </button>
          <button @click="closeStudentDossier" style="margin-left: 12px; padding: 6px 12px; background: #ef4444; color: #fff; border: none; border-radius: 6px; font-weight: 700; cursor: pointer;">
            ✕ Fermer (Échap)
          </button>
        </div>
      </div>

      <!-- KPI BANNER -->
      <div style="background: var(--vp-c-bg-soft); border-bottom: 1px solid var(--vp-c-divider); padding: 0.75rem 1.5rem; display: flex; gap: 1.5rem; flex-wrap: wrap;">
        <div>
          <small style="color: var(--vp-c-text-2); display: block;">NOTE FINALE SUR 20</small>
          <span style="font-size: 1.3rem; font-weight: 800; color: var(--vp-c-brand-1);">
            {{ currentDossier.evaluation.totalOutOf20 }} / 20
          </span>
          <small style="opacity: 0.75;"> ({{ currentDossier.evaluation.totalScore }} / {{ currentDossier.evaluation.totalMax }} pts)</small>
        </div>
        <div>
          <small style="color: var(--vp-c-text-2); display: block;">STATUT ACADÉMIQUE</small>
          <span :style="{ fontWeight: '700', color: currentDossier.evaluation.isPassing ? '#10b981' : '#ea580c' }">
            {{ currentDossier.evaluation.isPassing ? '✓ Admis' : '⏳ En cours' }}
          </span>
        </div>
        <div>
          <small style="color: var(--vp-c-text-2); display: block;">TRAVAUX REMIS</small>
          <span style="font-weight: 700;">
            {{ currentDossier.items.filter(i => i.completed).length }} / {{ currentDossier.items.length }}
          </span>
        </div>
        <div v-if="saveGridStatus" style="margin-left: auto; align-self: center; color: #047857; font-weight: 700; background: #ecfdf5; padding: 4px 10px; border-radius: 6px;">
          {{ saveGridStatus }}
        </div>
      </div>

      <!-- FILTRES DANS LE DOSSIER -->
      <div style="background: var(--vp-c-bg); border-bottom: 1px solid var(--vp-c-divider); padding: 0.5rem 1.5rem; display: flex; gap: 8px;">
        <button 
          v-for="f in [
            { id: 'all', label: 'Tous les éléments (14)' },
            { id: 'quiz', label: 'Quiz en ligne (7)' },
            { id: 'exercises', label: 'Exercices & Mission (7)' },
            { id: 'submitted_only', label: 'Remis uniquement' }
          ]" 
          :key="f.id"
          @click="dossierFilter = f.id"
          :style="{
            padding: '4px 10px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontWeight: dossierFilter === f.id ? '700' : '500',
            background: dossierFilter === f.id ? 'var(--vp-c-brand-1)' : 'var(--vp-c-bg-soft)',
            color: dossierFilter === f.id ? '#fff' : 'inherit'
          }"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- CORPS DÉFILANT DU DOSSIER -->
      <div style="flex: 1; overflow-y: auto; padding: 1.5rem; background: var(--vp-c-bg-soft);">
        <div style="max-width: 900px; margin: 0 auto; display: grid; gap: 1.25rem;">
          <div 
            v-for="item in filteredDossierItems" 
            :key="item.id"
            style="background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05);"
          >
            <!-- ENTÊTE DE L'ITEM -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 0.75rem;">
              <div>
                <span :style="{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  marginBottom: '4px',
                  background: item.category === 'quiz' ? '#fef3c7' : (item.category === 'final' ? '#fee2e2' : '#e0e7ff'),
                  color: item.category === 'quiz' ? '#92400e' : (item.category === 'final' ? '#991b1b' : '#3730a3')
                }">
                  {{ item.category === 'quiz' ? 'Quiz Diagnostic' : (item.category === 'final' ? 'Mission Finale' : 'Exercice Pratique') }}
                </span>
                <h4 style="margin: 0; font-size: 1.05rem;">{{ item.title }}</h4>
              </div>

              <div style="text-align: right;">
                <span style="font-weight: 700; font-size: 1.1rem; color: var(--vp-c-brand-1);">
                  {{ item.score }} / {{ item.maxPoints }} pts
                </span>
                <div>
                  <span v-if="item.completed" style="color: #10b981; font-size: 0.8rem; font-weight: 700;">✓ Rendu</span>
                  <span v-else style="color: #ea580c; font-size: 0.8rem; font-weight: 600;">⏳ En attente</span>
                </div>
              </div>
            </div>

            <!-- CONTENU SPÉCIFIQUE QUIZ -->
            <div v-if="item.category === 'quiz'">
              <div v-if="!item.quizAttempts || item.quizAttempts.length === 0" style="color: var(--vp-c-text-2); font-style: italic;">
                Aucune tentative réalisée par l'étudiant pour ce quiz.
              </div>
              <div v-else>
                <div v-for="att in item.quizAttempts" :key="att.id" style="padding: 8px 12px; background: var(--vp-c-bg-soft); border-radius: 6px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <strong>Tentative du {{ att.submittedAt }}</strong>
                  </div>
                  <div style="font-weight: 700; color: #10b981;">
                    {{ att.score }} / {{ att.totalPoints }} pts ({{ att.percentage }}%)
                  </div>
                </div>
              </div>
            </div>

            <!-- CONTENU SPÉCIFIQUE EXERCICE OU MISSION -->
            <div v-else>
              <!-- 1. Réponse textuelle en ligne -->
              <div v-if="item.submission && item.submission.answer" style="margin-bottom: 1rem; padding: 10px; background: var(--vp-c-bg-soft); border-radius: 8px; border-left: 4px solid var(--vp-c-brand-1);">
                <div style="font-weight: 700; font-size: 0.85rem; margin-bottom: 4px;">📝 Note rédigée par l'étudiant :</div>
                <p style="margin: 0; font-size: 0.9rem; white-space: pre-wrap;">{{ item.submission.answer }}</p>
              </div>

              <!-- 2. Document déposé -->
              <div v-if="item.file" style="margin-bottom: 1rem; padding: 10px 14px; background: var(--vp-c-bg-soft); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem;">📎 {{ item.file.formattedFileName }}</div>
                  <small style="color: var(--vp-c-text-2);">
                    {{ Math.round(item.file.fileSize / 1024) }} Ko • Remis le {{ item.file.submittedAt }}
                  </small>
                </div>
                <div style="display: flex; gap: 8px;">
                  <button 
                    @click="toggleDocumentPreview(item.file)" 
                    style="padding: 6px 12px; background: #0284c7; color: #fff; border: none; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;"
                  >
                    {{ activeDocPreview && activeDocPreview.fileId === item.file.id ? '✕ Masquer' : '👁️ Aperçu' }}
                  </button>
                  <a 
                    v-if="item.file.dataUrl" 
                    :href="item.file.dataUrl" 
                    :download="item.file.formattedFileName" 
                    style="padding: 6px 12px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 6px; font-size: 0.85rem; font-weight: 600; text-decoration: none; color: inherit;"
                  >
                    📥 Télécharger
                  </a>
                </div>
              </div>

              <!-- 3. Aperçu direct du document Word / PDF -->
              <div v-if="activeDocPreview && activeDocPreview.fileId === item.file?.id" style="margin-bottom: 1rem; padding: 1rem; background: var(--vp-c-bg); border: 2px solid var(--vp-c-brand-1); border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                  <strong>Aperçu : {{ activeDocPreview.fileName }}</strong>
                  <button @click="activeDocPreview = null" style="background: none; border: none; cursor: pointer; font-weight: 700;">✕</button>
                </div>
                <!-- PDF -->
                <iframe 
                  v-if="activeDocPreview.type === 'pdf'" 
                  :src="activeDocPreview.dataUrl" 
                  style="width: 100%; height: 420px; border: 1px solid var(--vp-c-divider); border-radius: 4px;"
                ></iframe>
                <!-- Word HTML -->
                <div 
                  v-else-if="activeDocPreview.type === 'docx'" 
                  style="max-height: 420px; overflow-y: auto; padding: 1rem; background: #fff; color: #111; border-radius: 4px; border: 1px solid #e2e8f0;"
                  v-html="activeDocPreview.htmlContent"
                ></div>
                <div v-else style="padding: 1rem; text-align: center; color: var(--vp-c-text-2);">
                  Aperçu non supporté pour ce type de fichier. Utilisez le bouton Télécharger.
                </div>
              </div>

              <!-- 4. Correction de l'IA (Grille critériée) -->
              <div v-if="item.file?.aiCorrection" style="margin-bottom: 1rem; padding: 1rem; background: #f8fafc; border-radius: 8px; border: 1px solid #cbd5e1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <strong style="color: #0369a1; display: flex; align-items: center; gap: 6px;">
                    🤖 Évaluation IA Automatique
                    <span style="font-size: 0.8rem; background: #e0f2fe; padding: 2px 6px; border-radius: 4px;">
                      {{ item.file.aiCorrection.suggestedScore }}/20
                    </span>
                  </strong>
                  <button 
                    @click="adoptAiFeedbackInDossier(item)" 
                    style="padding: 4px 10px; background: #0284c7; color: #fff; border: none; border-radius: 4px; font-size: 0.8rem; font-weight: 600; cursor: pointer;"
                    title="Copie la note et l'analyse de l'IA dans l'évaluation enseignant ci-dessous"
                  >
                    Adopter l'évaluation de l'IA ↓
                  </button>
                </div>

                <p style="font-size: 0.9rem; color: #334155; margin: 0 0 0.5rem 0;">
                  {{ item.file.aiCorrection.summary }}
                </p>

                <!-- Tableau des 6 critères -->
                <div style="overflow-x: auto; margin-top: 0.5rem;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; background: #fff;">
                    <thead>
                      <tr style="background: #f1f5f9; border-bottom: 1px solid #e2e8f0; text-align: left;">
                        <th style="padding: 6px 8px; border: 1px solid #e2e8f0;">Critère</th>
                        <th style="padding: 6px 8px; border: 1px solid #e2e8f0; text-align: center;">Poids</th>
                        <th style="padding: 6px 8px; border: 1px solid #e2e8f0; text-align: center;">Niveau</th>
                        <th style="padding: 6px 8px; border: 1px solid #e2e8f0; text-align: center;">Points</th>
                        <th style="padding: 6px 8px; border: 1px solid #e2e8f0;">Commentaire</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="c in item.file.aiCorrection.criteriaTable" :key="c.name">
                        <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-weight: 600;">{{ c.name }}</td>
                        <td style="padding: 6px 8px; border: 1px solid #e2e8f0; text-align: center;">{{ c.weightPct }}%</td>
                        <td style="padding: 6px 8px; border: 1px solid #e2e8f0; text-align: center;">{{ c.level }}/4</td>
                        <td style="padding: 6px 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: 700; color: #0284c7;">{{ c.score }}/{{ c.maxScore }}</td>
                        <td style="padding: 6px 8px; border: 1px solid #e2e8f0; color: #475569;">{{ c.comment }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- 5. Bloc de notation et feedback enseignant officiel -->
              <div style="padding: 12px; background: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider);">
                <div style="font-weight: 700; margin-bottom: 8px; font-size: 0.95rem;">
                  ✍️ Évaluation Enseignant Officielle
                </div>
                <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 8px; flex-wrap: wrap;">
                  <label style="font-weight: 600; font-size: 0.9rem;">Note définitive :</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    min="0" 
                    :max="item.maxPoints" 
                    v-model="item.teacherScore" 
                    style="width: 80px; padding: 6px 10px; border: 1px solid var(--vp-c-divider); border-radius: 6px; font-weight: 700; font-size: 1rem;"
                  />
                  <span>/ {{ item.maxPoints }} points</span>
                  <button 
                    @click="saveDossierItemGrade(item)" 
                    style="margin-left: auto; padding: 6px 14px; background: #059669; color: #fff; border: none; border-radius: 6px; font-weight: 700; cursor: pointer;"
                  >
                    Enregistrer la note
                  </button>
                </div>
                <textarea 
                  v-model="item.teacherFeedback" 
                  rows="2" 
                  placeholder="Commentaire pédagogique à destination du préparateur physique..." 
                  style="width: 100%; padding: 8px 12px; border: 1px solid var(--vp-c-divider); border-radius: 6px; font-size: 0.9rem; resize: vertical;"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
