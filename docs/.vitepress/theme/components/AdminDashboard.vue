<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { withBase } from 'vitepress'
import { INITIAL_REAL_FILES } from '../stores/prepaStudentSubmissionsData'
import { userStore, OFFICIAL_EVALUATION_ITEMS, formatDeadlineDisplay, getAlarmLevelInfo, parseDeadline } from '../stores/userStore'
import { DEFAULT_CLOUD_URL, cloudSync } from '../stores/cloudSync'

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

// Import direct et multi-fichiers
const fileInputRef = ref(null)
const studentSpecificFileInputRef = ref(null)
const uploadTargetStudentEmail = ref('')
const uploadTargetExerciseId = ref('')
const isImportingFiles = ref(false)
const importFeedback = ref('')
const isDraggingFiles = ref(false)

// Test de connexion Cloud
const isTestingConnection = ref(false)
const testConnectionResult = ref(null)

function triggerFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

async function onFilesSelected(event) {
  const target = event.target
  if (!target || !target.files || target.files.length === 0) return
  const files = Array.from(target.files)
  await processFilesImport(files)
  target.value = ''
}

async function processFilesImport(files, forcedStudentEmail = null, forcedExerciseId = null) {
  if (!files || files.length === 0) return
  isImportingFiles.value = true
  importFeedback.value = `Importation et auto-évaluation de ${files.length} fichier(s)...`
  try {
    const res = await userStore.importStudentFiles(files, forcedStudentEmail, forcedExerciseId)
    if (res.success) {
      importFeedback.value = `✓ ${res.count} devoir(s) importé(s), rattaché(s) aux étudiants et évalué(s) par l'IA !`
      setTimeout(() => { importFeedback.value = '' }, 6000)
    } else {
      importFeedback.value = "⚠️ Aucun fichier n'a pu être importé."
    }
  } catch (e) {
    importFeedback.value = `⚠️ Erreur : ${e.message}`
  } finally {
    isImportingFiles.value = false
  }
}

async function handleScanDirectory() {
  if (typeof window === 'undefined' || !('showDirectoryPicker' in window)) {
    alert("Votre navigateur ne supporte pas la sélection de dossiers (File System Access API). Utilisez Google Chrome ou Microsoft Edge.")
    return
  }
  try {
    isImportingFiles.value = true
    importFeedback.value = "Sélectionnez le dossier contenant les devoirs étudiants..."
    const dirHandle = await (window).showDirectoryPicker({ mode: 'read' })
    importFeedback.value = "Scan récursif et analyse des devoirs en cours..."
    const res = await userStore.scanDirectoryAndImportFiles(dirHandle)
    if (res.success) {
      importFeedback.value = `✓ ${res.count} devoir(s) trouvé(s) et importé(s) avec succès !`
      setTimeout(() => { importFeedback.value = '' }, 6000)
    } else {
      importFeedback.value = `⚠️ ${res.details && res.details[0] ? res.details[0] : "Aucun devoir trouvé."}`
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      importFeedback.value = `⚠️ Erreur : ${err.message}`
    } else {
      importFeedback.value = ''
    }
  } finally {
    isImportingFiles.value = false
  }
}

function handleDragOver(e) {
  e.preventDefault()
  isDraggingFiles.value = true
}

function handleDragLeave(e) {
  e.preventDefault()
  isDraggingFiles.value = false
}

function handleDropFiles(e) {
  e.preventDefault()
  isDraggingFiles.value = false
  if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const files = Array.from(e.dataTransfer.files)
    processFilesImport(files)
  }
}

async function handleTestCloudConnection() {
  isTestingConnection.value = true
  testConnectionResult.value = null
  try {
    const res = await cloudSync.testConnection()
    testConnectionResult.value = res
  } catch (e) {
    testConnectionResult.value = { success: false, message: e.message }
  } finally {
    isTestingConnection.value = false
  }
}

function triggerUploadForStudent(studentEmail, exerciseId) {
  uploadTargetStudentEmail.value = studentEmail
  uploadTargetExerciseId.value = exerciseId
  if (studentSpecificFileInputRef.value) {
    studentSpecificFileInputRef.value.click()
  }
}

async function onStudentSpecificFileSelected(event) {
  const target = event.target
  if (!target || !target.files || target.files.length === 0) return
  const files = Array.from(target.files)
  await processFilesImport(files, uploadTargetStudentEmail.value, uploadTargetExerciseId.value)
  target.value = ''
}

function handleRestoreCertifiedWorks() {
  const res = userStore.restoreCertifiedStudentWorks()
  importFeedback.value = res.message
  setTimeout(() => { importFeedback.value = '' }, 6000)
}

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

function getStudentProgress(email) {
  const completed = OFFICIAL_EVALUATION_ITEMS.filter(it => userStore.isCompleted(it.id, email)).length
  const total = OFFICIAL_EVALUATION_ITEMS.length
  return {
    completed,
    total,
    pct: total > 0 ? Math.round((completed / total) * 100) : 0
  }
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


// DOSSIER COMPLET ÉTUDIANT (MODAL PLEIN ÉCRAN)
const selectedDossierEmail = ref('')
const activeDocPreview = ref(null) // { fileId, fileName, type: 'pdf'|'docx'|'other', dataUrl, htmlContent, loading, error }
const dossierFilter = ref('all') // 'all' | 'quiz' | 'exercises' | 'submitted_only'
const expandedTexts = ref({})
const saveGridStatus = ref('')

// GRILLE D'ÉVALUATION ET NOTATION OFFICIELLE (100 PTS / 20)
const selectedGridStudentEmail = ref('')
const activeGridItems = ref([])
const activeGridGeneralFeedback = ref('')

const classStats = computed(() => userStore.getClassEvaluationStats())

const activeGridStudent = computed(() => {
  return users.value.find(u => (u?.email || '').toLowerCase().trim() === (selectedGridStudentEmail.value || '').toLowerCase().trim())
})

const activeStudentLateInfo = computed(() => {
  if (!selectedGridStudentEmail.value) return { isLate: false, lateCount: 0, daysOverdueMax: 0, lateItems: [] }
  const late = userStore.getStudentLateStatus(selectedGridStudentEmail.value)
  return {
    isLate: late.isLate,
    lateCount: late.lateCount,
    daysOverdueMax: late.daysOverdueMax,
    highestAlarmLabel: late.highestAlarmInfo.label,
    highestAlarmIcon: late.highestAlarmInfo.icon,
    highestAlarmColor: late.highestAlarmInfo.color,
    highestAlarmBgColor: late.highestAlarmInfo.bgColor,
    lateItems: late.overdueList
  }
})

function loadStudentGrid(email) {
  if (!email) return
  selectedGridStudentEmail.value = email.trim().toLowerCase()
  const ev = userStore.getStudentEvaluation(email)
  activeGridItems.value = (ev.items || []).map(it => ({
    id: it.id,
    title: it.title,
    shortTitle: it.shortTitle,
    maxPoints: it.maxPoints,
    weightPct: it.weightPct,
    category: it.category,
    aiScore: it.aiScore,
    aiSummary: it.aiSummary,
    teacherScore: it.teacherScore,
    feedback: it.feedback || '',
    completed: it.completed,
    file: it.file,
    isOverdue: it.isOverdue,
    deadlineLabel: it.deadlineLabel
  }))
  activeGridGeneralFeedback.value = ev.feedback || ''
}

function onSelectGridStudent() {
  loadStudentGrid(selectedGridStudentEmail.value)
}

function adoptAiScoreForItem(item) {
  item.teacherScore = item.aiScore
}

function adoptAllAiScoresForActiveStudent() {
  activeGridItems.value.forEach(item => {
    item.teacherScore = item.aiScore
  })
}

const activeGridTotalScore = computed(() => {
  return Math.round(activeGridItems.value.reduce((acc, it) => acc + (Number(it.teacherScore) || 0), 0) * 10) / 10
})

const activeGridTotalOutOf20 = computed(() => {
  return Math.round((activeGridTotalScore.value / 5) * 10) / 10
})

const activeGridMention = computed(() => {
  const n = activeGridTotalOutOf20.value
  if (n >= 18) return { label: 'La plus grande distinction', class: 'm-g-dist' }
  if (n >= 16) return { label: 'Grande distinction', class: 'm-dist' }
  if (n >= 14) return { label: 'Distinction', class: 'm-dist' }
  if (n >= 10) return { label: 'Satisfaction (Réussite)', class: 'm-pass' }
  return { label: 'Ajourné', class: 'm-fail' }
})

function saveActiveStudentGrid() {
  if (!selectedGridStudentEmail.value) return
  userStore.saveFullStudentEvaluation(
    selectedGridStudentEmail.value,
    activeGridItems.value.map(it => ({ id: it.id, teacherScore: it.teacherScore, feedback: it.feedback })),
    activeGridGeneralFeedback.value
  )
  const currentTotal = activeGridTotalScore.value
  const current20 = activeGridTotalOutOf20.value
  saveGridStatus.value = `✅ Grille enregistrée avec succès pour ${selectedGridStudentEmail.value} ! (Total : ${currentTotal}/100 • Note : ${current20}/20)`
  setTimeout(() => {
    saveGridStatus.value = ''
  }, 4500)
}

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

function formatSize(bytes) {
  if (!bytes) return '0 Ko'
  if (bytes < 1024) return bytes + ' o'
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' Ko'
  return (bytes / (1024 * 1024)).toFixed(1) + ' Mo'
}

function closeDocPreview() {
  if (activeDocPreview.value?.blobUrl && activeDocPreview.value.blobUrl.startsWith('blob:')) {
    try { URL.revokeObjectURL(activeDocPreview.value.blobUrl) } catch (e) {}
  }
  activeDocPreview.value = null
}

function getAdminDocumentPublicUrl(file) {
  if (!file) return ''
  if (file.fileUrl) {
    return file.fileUrl.startsWith('http') ? file.fileUrl : withBase(file.fileUrl.startsWith('/') ? file.fileUrl : '/' + file.fileUrl)
  }
  const fileName = file.formattedFileName || file.originalFileName || ''
  if (fileName) {
    return withBase(`/documents/${encodeURIComponent(fileName)}`)
  }
  return ''
}

function downloadFile(file) {
  if (!file) return
  userStore.downloadSubmittedFile(file)
}

function selectStudentForGrid(email) {
  if (!email) return
  selectedGridStudentEmail.value = email
  loadStudentGrid(email)
  if (typeof document !== 'undefined') {
    const el = document.querySelector('.grid-eval-card-container')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
}

function openStudentDossier(u, autoOpenFileId = null) {
  if (!u || !u.email) return
  selectedDossierEmail.value = u.email
  closeDocPreview()
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
  // Auto-ouvrir automatiquement l'aperçu du travail pour visualiser directement dès le clic
  setTimeout(() => {
    const dossier = userStore.getStudentFullDossier(u.email)
    if (dossier && dossier.items && dossier.items.length > 0) {
      if (autoOpenFileId) {
        const item = dossier.items.find(i => i.file && i.file.id === autoOpenFileId)
        if (item && item.file) {
          toggleDocumentPreview(item.file)
          return
        }
      }
      const firstWithFile = dossier.items.find(i => i.file)
      if (firstWithFile && firstWithFile.file) {
        toggleDocumentPreview(firstWithFile.file)
      }
    }
  }, 100)
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
  closeDocPreview()
  setTimeout(() => {
    const dossier = userStore.getStudentFullDossier(selectedDossierEmail.value)
    const firstWithFile = dossier?.items?.find(i => i.file)
    if (firstWithFile?.file) toggleDocumentPreview(firstWithFile.file)
  }, 100)
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
  closeDocPreview()
  setTimeout(() => {
    const dossier = userStore.getStudentFullDossier(selectedDossierEmail.value)
    const firstWithFile = dossier?.items?.find(i => i.file)
    if (firstWithFile?.file) toggleDocumentPreview(firstWithFile.file)
  }, 100)
}

async function toggleDocumentPreview(file) {
  if (!file) return
  if (activeDocPreview.value && activeDocPreview.value.fileId === file.id) {
    closeDocPreview()
    return
  }
  closeDocPreview()

  // 1. Récupération des données du fichier (cache ou référentiel certifié)
  let fileDataUrl = file.dataUrl || ''
  let fileExtractedText = file.extractedText || ''
  let fileUrl = getAdminDocumentPublicUrl(file)

  const realMatch = INITIAL_REAL_FILES.find((rf) => 
    rf.id === file.id || 
    ((rf.userEmail || '').toLowerCase() === (file.userEmail || '').toLowerCase() && rf.exerciseId === file.exerciseId)
  )
  if (realMatch) {
    if (!fileDataUrl && realMatch.dataUrl) fileDataUrl = realMatch.dataUrl
    if (!fileExtractedText && realMatch.extractedText) fileExtractedText = realMatch.extractedText
    if (!fileUrl && realMatch.fileUrl) fileUrl = withBase(realMatch.fileUrl.startsWith('/') ? realMatch.fileUrl : '/' + realMatch.fileUrl)
    if (!file.fileSize && realMatch.fileSize) file.fileSize = realMatch.fileSize
  }

  const fileName = file.formattedFileName || file.originalFileName || 'document'
  const ext = fileName.split('.').pop().toLowerCase()
  const isPdf = ext === 'pdf' || (file.fileType && file.fileType.includes('pdf'))
  const isDocx = ext === 'docx' || ext === 'doc' || (file.fileType && file.fileType.includes('word'))
  const isXlsx = ext === 'xlsx' || ext === 'xls' || (file.fileType && file.fileType.includes('sheet'))

  let blobUrl = ''
  if (isPdf && fileDataUrl) {
    try {
      const base64Data = fileDataUrl.includes(',') ? fileDataUrl.split(',')[1] : fileDataUrl
      const binaryStr = atob(base64Data)
      const len = binaryStr.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: 'application/pdf' })
      blobUrl = URL.createObjectURL(blob)
    } catch (e) {
      console.warn('Erreur Blob PDF:', e)
    }
  }

  activeDocPreview.value = {
    fileId: file.id,
    fileName,
    type: isPdf ? 'pdf' : (isDocx ? 'docx' : (isXlsx ? 'xlsx' : 'other')),
    fileUrl,
    dataUrl: fileDataUrl,
    blobUrl,
    extractedText: fileExtractedText,
    viewMode: isPdf ? 'pdf' : (isDocx && (fileDataUrl || fileUrl) ? 'docx' : 'text'),
    htmlContent: '',
    loading: isDocx && (fileDataUrl || fileUrl),
    error: ''
  }

  if (isDocx) {
    try {
      let arrayBuffer = null
      if (fileUrl) {
        try {
          const resp = await fetch(fileUrl)
          if (resp.ok) {
            arrayBuffer = await resp.arrayBuffer()
          }
        } catch (fetchErr) {
          console.warn('Fetch Word direct échoué, essai fallback:', fetchErr)
        }
      }

      if (!arrayBuffer && fileDataUrl) {
        const base64Data = fileDataUrl.includes(',') ? fileDataUrl.split(',')[1] : fileDataUrl
        const binaryStr = atob(base64Data)
        const len = binaryStr.length
        const bytes = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i)
        }
        arrayBuffer = bytes.buffer
      }

      if (arrayBuffer) {
        const mammothModule = await import('mammoth/mammoth.browser.js')
        const mammoth = mammothModule.default || mammothModule
        const res = await mammoth.convertToHtml({ arrayBuffer })
        activeDocPreview.value.htmlContent = res.value || ''
        activeDocPreview.value.loading = false
      } else {
        if (fileExtractedText) {
          activeDocPreview.value.viewMode = 'text'
          activeDocPreview.value.loading = false
        } else {
          activeDocPreview.value.error = "Document accessible au téléchargement direct."
          activeDocPreview.value.loading = false
        }
      }
    } catch (e) {
      console.warn('Erreur conversion Word:', e)
      if (fileExtractedText) {
        activeDocPreview.value.viewMode = 'text'
      } else {
        activeDocPreview.value.error = "Impossible de convertir ce document Word en aperçu web. Veuillez le télécharger pour le lire dans Microsoft Word."
      }
      activeDocPreview.value.loading = false
    }
  } else {
    if (!blobUrl && !fileUrl && fileExtractedText) {
      activeDocPreview.value.viewMode = 'text'
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

  const active = users.value.filter(u => u && u.status !== 'archived')
  if (active.length > 0 && !selectedGridStudentEmail.value) {
    loadStudentGrid(active[0].email)
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleDossierKeyDown)
  }
})

watch(() => users.value, (newUsers) => {
  const active = (newUsers || []).filter(u => u && u.status !== 'archived')
  if (active.length > 0 && (!selectedGridStudentEmail.value || !active.some(u => u.email === selectedGridStudentEmail.value))) {
    loadStudentGrid(active[0].email)
  }
}, { immediate: true })

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


function handleAdminResetStudentPassword(email) {
  if (confirm(`Voulez-vous réinitialiser le mot de passe de l'étudiant ${email} ?\nUn mot de passe temporaire 'hech2026' sera défini et l'étudiant pourra reconfigurer son mot de passe.`)) {
    const res = userStore.adminResetStudentPassword(email, 'hech2026')
    alert(res.message)
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

function exportAllResultsToExcel() {
  const activeStudents = users.value.filter(u => u && u.email && u.status !== 'archived')
  if (activeStudents.length === 0) {
    alert("Aucun étudiant à exporter pour l'instant.")
    return
  }

  // En-têtes CSV avec point-virgule (compatible avec toutes les versions d'Excel en français)
  let csv = `"Nom";"Prénom";"Email";"Statut Retard";"Quiz (Moyenne 7 quiz /10)";"Ex 01 - Capteurs (/10)";"Ex 02.a - Power Query (/5)";"Ex 02.b - Logiciels & Cas (/5)";"Ex 03 - Excel Tidy Data (/10)";"Ex 04 - Outils de suivi (/10)";"Ex 05 - Recherche & Décision (/10)";"Ex 06 - IA & Agents (/10)";"Ex 07 - Mission Finale (/30)";"Total Points (/100)";"Note Finale Officielle (/20)";"Pourcentage";"Statut Académique";"Mention";"Commentaire Général Enseignant"\n`

  activeStudents.forEach(u => {
    const ev = userStore.getStudentEvaluation(u.email)
    const late = ev.lateInfo && ev.lateInfo.isLate ? `RETARD (${ev.lateInfo.lateCount} doc)` : 'À jour'
    const items = ev.items || []

    const q = items.find(i => i.id === 'quiz')?.teacherScore ?? 0
    const ex1 = items.find(i => i.id === 'exercice-01')?.teacherScore ?? 0
    const ex2a = items.find(i => i.id === 'exercice-02a')?.teacherScore ?? 0
    const ex2b = items.find(i => i.id === 'exercice-02')?.teacherScore ?? 0
    const ex3 = items.find(i => i.id === 'exercice-03')?.teacherScore ?? 0
    const ex4 = items.find(i => i.id === 'exercice-04')?.teacherScore ?? 0
    const ex5 = items.find(i => i.id === 'exercice-05')?.teacherScore ?? 0
    const ex6 = items.find(i => i.id === 'exercice-06')?.teacherScore ?? 0
    const ex7 = items.find(i => i.id === 'exercice-07')?.teacherScore ?? 0

    const status = ev.isPassing ? 'Admis' : 'Ajourné'
    const cleanFb = (ev.feedback || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')

    csv += `"${u.lastName || ''}";"${u.firstName || ''}";"${u.email}";"${late}";"${q}";"${ex1}";"${ex2a}";"${ex2b}";"${ex3}";"${ex4}";"${ex5}";"${ex6}";"${ex7}";"${ev.totalScore}";"${ev.totalOutOf20}";"${ev.percentage}%";"${status}";"${ev.mention}";"${cleanFb}"\n`
  })

  // Encodage UTF-8 BOM pour ouverture directe parfaite dans Microsoft Excel
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', `HECh_Prepa_Physique_Notes_Officielles_sur_20_${new Date().toISOString().substring(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function exportCsv() {
  exportAllResultsToExcel()
}

function handleResetAllStudents() {
  if (confirm("Voulez-vous réinitialiser entièrement la liste des préparateurs physiques à 0 étudiant pour la rentrée de lundi ?\n\n(Cette action n'impacte en rien la plateforme Didactique M1).")) {
    userStore.resetAllStudents()
    closeStudentDossier()
    alert("La liste des étudiants a été réinitialisée à 0 avec succès.")
  }
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

      <!-- BANNIÈRE D'ÉTAT DE SYNCHRONISATION MULTI-APPAREILS -->
      <div v-if="!userStore.cloudUrl" style="padding: 12px 16px; margin-bottom: 1.2rem; border-radius: 10px; background: #fffbeb; border: 1px solid #fde68a; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.4rem;">⚠️</span>
          <div>
            <div style="font-weight: 700; color: #92400e; font-size: 0.92rem;">Mode Local Actif (Hors-Ligne) — Travaux sur les navigateurs respectifs</div>
            <div style="color: #b45309; font-size: 0.82rem; margin-top: 2px;">
              Les étudiants déposent actuellement leurs travaux dans leur stockage local. Pour les recevoir automatiquement à distance, connectez le Webhook Google Apps Script ou importez directement les fichiers via le bouton ci-contre.
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button @click="triggerFileInput" style="padding: 6px 12px; background: #d97706; color: #fff; border: none; border-radius: 6px; font-size: 0.82rem; font-weight: 700; cursor: pointer;">
            📥 Importer devoirs
          </button>
          <button @click="adminTab = 'export'" style="padding: 6px 12px; background: #fff; border: 1px solid #d97706; color: #d97706; border-radius: 6px; font-size: 0.82rem; font-weight: 700; cursor: pointer;">
            ⚙️ Configurer Cloud
          </button>
        </div>
      </div>
      <div v-else style="padding: 10px 14px; margin-bottom: 1.2rem; border-radius: 10px; background: #f0fdf4; border: 1px solid #bbf7d0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #10b981;"></span>
          <span style="font-weight: 700; color: #166534; font-size: 0.88rem;">Synchronisation Cloud Connectée</span>
          <span style="color: #15803d; font-size: 0.82rem;">— Vos modifications et devoirs sont sauvegardés dans Google Drive & Sheets</span>
        </div>
        <div style="display: flex; gap: 6px;">
          <button @click="triggerCloudSync" :disabled="isCloudSyncing" style="padding: 4px 10px; background: #16a34a; color: #fff; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer;">
            🔄 Actualiser
          </button>
          <button @click="handleTestCloudConnection" :disabled="isTestingConnection" style="padding: 4px 10px; background: #fff; border: 1px solid #16a34a; color: #16a34a; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer;">
            🧪 Tester
          </button>
        </div>
      </div>

      <!-- INPUTS DE FICHIERS CACHÉS POUR IMPORTATION -->
      <input 
        type="file" 
        ref="fileInputRef" 
        multiple 
        accept=".xlsx,.xls,.docx,.doc,.pdf,.csv,.txt" 
        @change="onFilesSelected" 
        style="display: none;" 
      />
      <input 
        type="file" 
        ref="studentSpecificFileInputRef" 
        accept=".xlsx,.xls,.docx,.doc,.pdf,.csv,.txt" 
        @change="onStudentSpecificFileSelected" 
        style="display: none;" 
      />

      <!-- MESSAGES FLASH SYNCHRONISATION -->
      <div v-if="importFeedback" style="padding: 12px 16px; margin-bottom: 1rem; border-radius: 8px; font-size: 0.92rem; font-weight: 700; background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; display: flex; align-items: center; gap: 8px;">
        <span>ℹ️</span> {{ importFeedback }}
      </div>
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
            { id: 'evaluation', label: '🏆 Notes & Évaluation', count: users.length },
            { id: 'deadlines', label: '📅 Échéances & Délais', count: OFFICIAL_EVALUATION_ITEMS.length },
            { id: 'files', label: '📁 Travaux Déposés', count: submittedFiles.length },
            { id: 'quizzes', label: '🧠 Tentatives Quiz', count: quizAttempts.length },
            { id: 'export', label: '⚙️ Cloud & Synchronisation', count: null }
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
          <div style="display: flex; gap: 8px;">
            <button @click="handleResetAllStudents" style="padding: 6px 12px; background: #fee2e2; color: #991b1b; border: 1px solid #fecdd3; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600;" title="Efface les données résiduelles pour repartir à 0 étudiant">
              🧹 Vider la liste (0 étudiant)
            </button>
            <button @click="exportCsv" style="padding: 6px 12px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600;">
              📥 Exporter le relevé (CSV)
            </button>
          </div>
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
                    @click="handleAdminResetStudentPassword(u.email)" 
                    style="padding: 4px 8px; background: #8b5cf6; color: #fff; border: none; border-radius: 4px; font-size: 0.8rem; font-weight: 600; cursor: pointer; margin-right: 6px;"
                    title="Réinitialiser le mot de passe de cet étudiant (mot de passe temporaire hech2026)"
                  >
                    🔑 MDP
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

      <!-- ONGLET 2 : NOTES & ÉVALUATION OFFICIELLE (100 PTS / 20) -->
      <div v-if="adminTab === 'evaluation'" class="tab-panel">
        <!-- BARRE D'OUTILS PRINCIPALE & EXPORT EXCEL -->
        <div class="eval-admin-toolbar">
          <div>
            <h3 style="margin: 0; font-size: 1.3rem;">🏆 Grille d'Évaluation & Relevé Officiel des Notes (100 Pts / 20)</h3>
            <p class="eval-toolbar-sub">
              9 composantes pondérées (7 quiz + 8 devoirs pratiques) • Évaluation formative indicative de l'IA dès le dépôt • <strong>Seule la note de l'enseignant est prise en compte</strong> • Note finale sur /20
            </p>
          </div>
          <button @click="exportAllResultsToExcel" class="btn-export-excel-highlight" title="Télécharger le fichier Excel officiel avec les notes sur 20 de toute la classe">
            📊 Exporter tous les résultats (Excel)
          </button>
        </div>

        <!-- KPI STATISTIQUES DE LA CLASSE -->
        <div class="eval-kpi-grid">
          <div class="eval-kpi-card highlight-moy">
            <span class="ekpi-icon">📈</span>
            <div>
              <div class="ekpi-val"><strong>{{ classStats.averageOutOf20 }}</strong> / 20</div>
              <div class="ekpi-label">Moyenne générale de la classe ({{ classStats.averageScore100 }} / 100 pts)</div>
            </div>
          </div>
          <div class="eval-kpi-card highlight-pass">
            <span class="ekpi-icon">🎓</span>
            <div>
              <div class="ekpi-val"><strong>{{ classStats.passingRate }}%</strong> de réussite</div>
              <div class="ekpi-label">{{ classStats.passingCount }} admis sur {{ classStats.totalStudents }} étudiants</div>
            </div>
          </div>
          <div class="eval-kpi-card highlight-high">
            <span class="ekpi-icon">🌟</span>
            <div>
              <div class="ekpi-val"><strong>{{ classStats.highestNote }}</strong> / 20</div>
              <div class="ekpi-label">Note la plus haute</div>
            </div>
          </div>
          <div class="eval-kpi-card highlight-low">
            <span class="ekpi-icon">📉</span>
            <div>
              <div class="ekpi-val"><strong>{{ classStats.lowestNote }}</strong> / 20</div>
              <div class="ekpi-label">Note la plus basse</div>
            </div>
          </div>
          <div class="eval-kpi-card highlight-alarm" :class="{ 'has-alerts': classStats.lateStudentsCount > 0 }">
            <span class="ekpi-icon">🔔</span>
            <div>
              <div class="ekpi-val"><strong :class="{ 'text-danger': classStats.lateStudentsCount > 0 }">{{ classStats.lateStudentsCount }}</strong> en retard</div>
              <div class="ekpi-label">Échéance(s) dépassée(s) (détecté par IA)</div>
            </div>
          </div>
        </div>

        <!-- FICHE D'ÉVALUATION DÉTAILLÉE PAR ÉTUDIANT -->
        <div v-if="users.filter(x => x.status !== 'archived').length > 0" class="grid-eval-card-container">
          <div class="gec-header-row">
            <div class="gec-selector-group">
              <label>👤 Sélectionner l'étudiant à évaluer :</label>
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <select v-model="selectedGridStudentEmail" @change="onSelectGridStudent" class="student-eval-select">
                  <option 
                    v-for="u in users.filter(x => x.status !== 'archived')" 
                    :key="u.email" 
                    :value="u.email"
                  >
                    {{ userStore.getStudentLateStatus(u.email).isLate ? '🔔 [RETARD] ' : '' }}{{ u.lastName }} {{ u.firstName }} ({{ u.email }}) — Note : {{ userStore.getStudentEvaluation(u.email).totalOutOf20 }}/20
                  </option>
                </select>
                <button 
                  v-if="activeGridStudent" 
                  type="button" 
                  @click="openStudentDossier(activeGridStudent)" 
                  class="btn-open-dossier-header"
                  title="Ouvrir le dossier complet avec les aperçus Word/PDF/Excel de cet étudiant"
                >
                  📁 Dossier & Aperçus des devoirs
                </button>
              </div>
            </div>
            <div class="gec-actions-group">
              <button @click="adoptAllAiScoresForActiveStudent" class="btn-bulk-adopt-ai" type="button" title="Reprendre en 1 clic toutes les suggestions de l'IA pour cet étudiant">
                ⚡ Reprendre toutes les cotes IA
              </button>
              <button @click="saveActiveStudentGrid" class="btn-save-grid-main" type="button">
                💾 Enregistrer la grille
              </button>
            </div>
          </div>

          <!-- SIGNAL ALARME IA SI DOCUMENTS EN RETARD -->
          <div 
            v-if="activeStudentLateInfo.isLate" 
            class="alarm-student-banner"
            :style="{ 
              background: activeStudentLateInfo.highestAlarmBgColor, 
              borderColor: activeStudentLateInfo.highestAlarmColor 
            }"
          >
            <div class="asb-icon-wrap">
              <span class="alarm-bell-large" :style="{ color: activeStudentLateInfo.highestAlarmColor }">🔔</span>
            </div>
            <div class="asb-content">
              <div class="asb-title" :style="{ color: activeStudentLateInfo.highestAlarmColor }">
                {{ activeStudentLateInfo.highestAlarmIcon }} {{ activeStudentLateInfo.highestAlarmLabel.toUpperCase() }} : Devoirs non remis en temps et en heure
              </div>
              <div class="asb-desc" :style="{ color: activeStudentLateInfo.highestAlarmColor }">
                L'IA a analysé les échéances du cours et détecté que cet étudiant a <strong>{{ activeStudentLateInfo.lateCount }} document(s) non rendu(s) à temps</strong> (retard maximal : <strong>{{ activeStudentLateInfo.daysOverdueMax }} jours</strong>) :
              </div>
              <div class="asb-badges-list">
                <span 
                  v-for="it in activeStudentLateInfo.lateItems" 
                  :key="it.exerciseId" 
                  class="asb-item-badge"
                  :style="{ 
                    background: it.alarmColor ? it.alarmColor + '15' : '#fee2e2', 
                    color: it.alarmColor || '#991b1b', 
                    borderColor: it.alarmColor || '#f87171' 
                  }"
                >
                  {{ it.alarmIcon }} <strong>{{ it.shortTitle }}</strong> — Retard : {{ it.daysOverdue }} j (Échéance : {{ it.deadline }})
                </span>
              </div>
            </div>
          </div>

          <div v-if="saveGridStatus" class="grid-save-feedback-banner">
            {{ saveGridStatus }}
          </div>

          <!-- TABLEAU COMPARATIF DES 8 COMPOSANTES -->
          <div class="table-responsive">
            <table class="data-table detailed-8-table">
              <thead>
                <tr>
                  <th style="width: 34%;">Composante d'Évaluation (Pondération %)</th>
                  <th style="width: 12%; text-align: center;">Barème Max</th>
                  <th style="width: 18%; text-align: center;">🤖 Cote indicative IA</th>
                  <th style="width: 16%; text-align: center;">👨‍🏫 Cote Enseignant</th>
                  <th style="width: 20%;">💬 Commentaire formatif</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="item in activeGridItems" :key="item.id">
                  <tr 
                    :class="['grid-item-row', { 'row-overdue': item.isOverdue, 'row-final-step': item.category === 'final' }]"
                  >
                    <td>
                      <div class="item-title-group">
                        <span class="item-status-icon">{{ item.completed ? '✅' : (item.isOverdue ? '🔔' : '⏳') }}</span>
                        <div>
                          <strong :class="{ 'is-late': item.isOverdue, 'highlight-final': item.category === 'final' }">
                            {{ item.title }}
                          </strong>
                          <div v-if="item.file" class="item-file-link">
                            📎 Document remis : <code>{{ item.file.formattedFileName }}</code>
                            <div class="grid-file-actions">
                              <button 
                                type="button" 
                                @click="toggleDocumentPreview(item.file)"
                                class="btn-preview-mini"
                                :class="{ active: activeDocPreview?.fileId === item.file.id }"
                                title="Afficher l'aperçu interactif du devoir"
                              >
                                {{ activeDocPreview?.fileId === item.file.id ? '✕ Masquer la lecture' : '📖 Lire / Aperçu' }}
                              </button>
                              <button 
                                type="button" 
                                @click="downloadFile(item.file)"
                                class="btn-download-mini"
                                title="Télécharger le fichier original"
                              >
                                📥 Télécharger
                              </button>
                              <a 
                                v-if="item.file.driveUrl" 
                                :href="item.file.driveUrl" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                class="btn-drive-mini"
                                title="Ouvrir sur Google Drive"
                              >
                                ☁️ Drive
                              </a>
                            </div>
                          </div>
                          <div v-else-if="item.id === 'quiz'" class="item-file-link quiz-sub" :class="{ overdue: item.isOverdue }">
                            {{ item.completed ? '💡 Évaluation automatique via les quiz du cours' : (item.isOverdue ? '🚨 ALARME : Quiz non passé (Échéance dépassée)' : '⏳ En attente de réalisation des quiz') }}
                          </div>
                          <div v-else-if="item.isOverdue" class="item-file-link overdue">
                            🚨 ALARME RETARD : Document non déposé (Échéance dépassée le {{ item.deadlineLabel }})
                          </div>
                          <div v-else class="item-file-link missing">
                            ⚠️ En attente de dépôt étudiant (Échéance : {{ item.deadlineLabel || 'Non définie' }})
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style="text-align: center;">
                      <span class="max-badge">/ {{ item.maxPoints }} pts ({{ item.weightPct }}%)</span>
                    </td>
                    <!-- COLONNE COTE IA -->
                    <td style="text-align: center;">
                      <div v-if="!item.completed" class="ai-score-cell-wrap">
                        <span class="ai-pill zero-pill" style="background:#fee2e2;color:#991b1b;border-color:#fecaca;" title="Non rendu : note automatique de 0">
                          <strong>0</strong> / {{ item.maxPoints }}
                        </span>
                        <button 
                          @click="adoptAiScoreForItem(item)" 
                          type="button" 
                          class="btn-adopt-mini"
                          title="Appliquer 0 pt pour non-rendu"
                          style="background: #fee2e2; color: #991b1b; border-color: #fca5a5;"
                        >
                          ⚡ Reprendre (0)
                        </button>
                      </div>
                      <div v-else-if="item.aiScore !== null && item.aiScore !== undefined" class="ai-score-cell-wrap">
                        <span class="ai-pill"><strong>{{ item.aiScore }}</strong> / {{ item.maxPoints }}</span>
                        <button 
                          @click="adoptAiScoreForItem(item)" 
                          type="button" 
                          class="btn-adopt-mini"
                          title="Copier la suggestion de l'IA"
                        >
                          ⚡ Reprendre
                        </button>
                      </div>
                      <div v-else class="ai-none-cell">
                        <span class="ai-pending-text">{{ item.isOverdue ? '⚠️ Non rendu' : '⏳ En attente' }}</span>
                      </div>
                    </td>
                    <!-- COLONNE COTE ENSEIGNANT (ÉDITABLE) -->
                    <td style="text-align: center;">
                      <div class="teacher-input-cell-wrap">
                        <input 
                          v-model.number="item.teacherScore" 
                          type="number" 
                          :min="0" 
                          :max="item.maxPoints" 
                          step="0.5" 
                          class="teacher-score-input"
                        />
                        <span class="pts-denom">/ {{ item.maxPoints }}</span>
                      </div>
                    </td>
                    <!-- COMMENTAIRE FORMATIF -->
                    <td>
                      <input 
                        v-model="item.feedback" 
                        type="text" 
                        placeholder="Commentaire personnalisé..." 
                        class="teacher-comment-input"
                      />
                    </td>
                  </tr>

                  <!-- APERÇU INTÉGRÉ DIRECT DANS LA GRILLE DE CORRECTION -->
                  <tr v-if="item.file && activeDocPreview?.fileId === item.file.id" class="grid-preview-row">
                    <td colspan="5" class="grid-preview-cell">
                      <div class="inline-doc-viewer-container">
                        <div class="idv-header">
                          <span class="idv-title">
                            Lecteur Intégré : <strong>{{ activeDocPreview.fileName }}</strong>
                            <span class="idv-tag">{{ activeDocPreview.type.toUpperCase() }}</span>
                          </span>

                          <div class="idv-header-actions">
                            <button 
                              v-if="activeDocPreview.extractedText" 
                              class="idv-mode-btn"
                              :class="{ active: activeDocPreview.viewMode === 'text' }"
                              @click="activeDocPreview.viewMode = activeDocPreview.viewMode === 'text' ? (activeDocPreview.type === 'pdf' ? 'pdf' : (activeDocPreview.type === 'docx' ? 'docx' : 'text')) : 'text'"
                              :title="activeDocPreview.viewMode === 'text' ? 'Afficher la mise en page originale' : 'Afficher le texte brut intégral'"
                            >
                              {{ activeDocPreview.viewMode === 'text' ? '📄 Page Originale' : '📝 Texte Intégral' }}
                            </button>
                            <a 
                              v-if="activeDocPreview.fileUrl" 
                              :href="activeDocPreview.fileUrl" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              class="idv-mode-btn"
                              title="Ouvrir dans un nouvel onglet"
                            >
                              ↗️ Plein écran
                            </a>
                            <button @click="downloadFile(item.file)" class="idv-btn-dl" title="Télécharger le fichier original">
                              📥 Télécharger
                            </button>
                            <button class="idv-close" @click="closeDocPreview()" title="Fermer l'aperçu">✕</button>
                          </div>
                        </div>

                        <!-- Chargement Word Mammoth -->
                        <div v-if="activeDocPreview.loading" class="idv-loading">
                          <span class="idv-spinner">⏳</span> Traitement et mise en page du document en cours...
                        </div>

                        <!-- Message d'erreur -->
                        <div v-else-if="activeDocPreview.error && !activeDocPreview.extractedText" class="idv-error">
                          ⚠️ {{ activeDocPreview.error }}
                        </div>

                        <!-- Mode Texte Brut Intégral -->
                        <div v-else-if="activeDocPreview.viewMode === 'text' && activeDocPreview.extractedText" class="idv-docx-box">
                          <div class="docx-paper-sheet extracted-text-view">
                            <div class="extracted-text-header">
                              <h4 style="margin: 0; color: #1e293b;">📄 Transcription intégrale du travail déposé</h4>
                              <span class="extracted-hint">Texte complet extrait du devoir remis par l'étudiant.</span>
                            </div>
                            <pre class="extracted-raw-text">{{ activeDocPreview.extractedText }}</pre>
                          </div>
                        </div>

                        <!-- Aperçu PDF natif via iframe -->
                        <div v-else-if="activeDocPreview.type === 'pdf'" class="idv-pdf-box">
                          <iframe 
                            :src="activeDocPreview.fileUrl || activeDocPreview.blobUrl || activeDocPreview.dataUrl" 
                            class="dossier-pdf-frame" 
                            title="Lecteur PDF intégré"
                          ></iframe>
                        </div>

                        <!-- Aperçu Word converti en HTML via Mammoth -->
                        <div v-else-if="activeDocPreview.type === 'docx'" class="idv-docx-box">
                          <div v-if="activeDocPreview.htmlContent" class="docx-paper-sheet" v-html="activeDocPreview.htmlContent"></div>
                          <div v-else-if="activeDocPreview.extractedText" class="docx-paper-sheet extracted-text-view">
                            <pre class="extracted-raw-text">{{ activeDocPreview.extractedText }}</pre>
                          </div>
                        </div>

                        <!-- Autre format (Excel / etc.) -->
                        <div v-else class="idv-fallback">
                          <div v-if="activeDocPreview.extractedText" class="docx-paper-sheet extracted-text-view">
                            <div class="extracted-text-header">
                              <h4 style="margin: 0; color: #1e293b;">📊 Données & Synthèse extraites (Tableur Excel)</h4>
                              <span class="extracted-hint">Structure du classeur remis par l'étudiant.</span>
                            </div>
                            <pre class="extracted-raw-text">{{ activeDocPreview.extractedText }}</pre>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <!-- CARTOUCHE DE RÉCAPITULATIF & NOTE SUR 20 -->
          <div class="grid-recap-footer">
            <div class="grf-scores-box">
              <div class="grf-score-item total-100">
                <span class="grf-label">TOTAL GÉNÉRAL</span>
                <span class="grf-val">{{ activeGridTotalScore }} / 100 pts</span>
              </div>
              <div class="grf-score-item final-20">
                <span class="grf-label">NOTE FINALE OFFICIELLE</span>
                <span class="grf-val-huge">{{ activeGridTotalOutOf20 }} / 20</span>
                <span :class="['grf-mention-badge', activeGridMention.class]">{{ activeGridMention.label }}</span>
              </div>
            </div>

            <div class="grf-feedback-box">
              <label>💬 Observation générale & synthèse pour le bulletin :</label>
              <textarea 
                v-model="activeGridGeneralFeedback" 
                rows="3" 
                placeholder="Rédigez ici votre synthèse d'évaluation globale visible par l'étudiant..."
                class="grf-textarea"
              ></textarea>
              <div class="grf-btn-row">
                <button @click="saveActiveStudentGrid" class="btn-save-grid-main" type="button">
                  💾 Enregistrer la grille d'évaluation
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- VUE D'ENSEMBLE DE LA CLASSE (MOYENNES & TOTAUX) IDENTIQUE À DIDACTIQUE M1 -->
        <div v-if="users.filter(x => x.status !== 'archived').length > 0" class="class-summary-card">
          <div class="css-header">
            <h4>📊 Tableau Récapitulatif de la Classe (Notes Officielles sur 20)</h4>
            <span class="css-count">{{ users.filter(u => u.status !== 'archived').length }} étudiants inscrits</span>
          </div>

          <div class="table-responsive">
            <table class="data-table class-overview-table">
              <thead>
                <tr>
                  <th>Étudiant (Cliquer pour voir les travaux)</th>
                  <th style="text-align: center;">Quiz (/10)</th>
                  <th style="text-align: center;">Devoirs (/90)</th>
                  <th style="text-align: center;">Total (/100)</th>
                  <th style="text-align: center; background: #e0f2fe;">Note Finale (/20)</th>
                  <th style="text-align: center;">Statut</th>
                  <th style="text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="u in users.filter(u => u.status !== 'archived')" 
                  :key="u.id" 
                  :class="{ 'row-late-alert': userStore.getStudentLateStatus(u.email).isLate }"
                >
                  <td>
                    <div class="student-name-container">
                      <span 
                        v-if="userStore.getStudentLateStatus(u.email).isLate" 
                        class="alarm-bell" 
                        :title="userStore.getStudentLateStatus(u.email).tooltip"
                      >🔔</span>
                      <a 
                        href="javascript:void(0)" 
                        class="student-name-link" 
                        @click="openStudentDossier(u)"
                        title="Cliquer pour ouvrir le dossier complet et l'aperçu immédiat des travaux de cet étudiant"
                      >
                        <strong>{{ u.lastName }}</strong> {{ u.firstName }}
                      </a>
                    </div>
                    <div class="student-sub-mail">{{ u.email }}</div>
                  </td>
                  <td style="text-align: center;">{{ userStore.getStudentEvaluation(u.email).quizzesAverageOutOf10 }} / 10</td>
                  <td style="text-align: center;">{{ Math.round((userStore.getStudentEvaluation(u.email).totalScore - (userStore.getStudentEvaluation(u.email).quizzesAverageOutOf10 || 0)) * 10) / 10 }} / 90</td>
                  <td style="text-align: center;" class="total-100-cell"><strong>{{ userStore.getStudentEvaluation(u.email).totalScore }}</strong> / 100</td>
                  <td style="text-align: center;" class="grade-20-cell-highlight">
                    <strong>{{ userStore.getStudentEvaluation(u.email).totalOutOf20 }}</strong> / 20
                  </td>
                  <td style="text-align: center;">
                    <span :class="['status-badge', userStore.getStudentEvaluation(u.email).isPassing ? 'active' : 'archived']">
                      {{ userStore.getStudentEvaluation(u.email).isPassing ? 'Admis' : 'Ajourné' }}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; gap: 0.35rem; justify-content: flex-end;">
                      <button @click="openStudentDossier(u)" class="btn-row-action dossier-btn" title="Consulter le dossier complet et l'aperçu des travaux Word/PDF/Excel">
                        📁 Dossier & Aperçus
                      </button>
                      <button @click="selectStudentForGrid(u.email)" class="btn-row-action edit-grade" title="Évaluer et corriger cet étudiant dans la grille">
                        ✏️ Évaluer
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else style="padding: 3rem; text-align: center; color: var(--vp-c-text-2); background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">👥</div>
          <h3>Aucun étudiant inscrit pour le moment</h3>
          <p>Les étudiants inscrits apparaîtront automatiquement ici pour que vous puissiez consulter leurs cotes IA et saisir leurs notes officielles.</p>
        </div>
      </div>

      <!-- ONGLET 3 : GESTION DES ÉCHÉANCES -->
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
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="margin: 0;">Fichiers remis par les préparateurs physiques ({{ submittedFiles.length }})</h3>
            <small style="color: var(--vp-c-text-2);">Tous les fichiers déposés sur la plateforme ou importés manuellement</small>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button 
              @click="triggerFileInput" 
              :disabled="isImportingFiles"
              style="padding: 7px 14px; background: #0284c7; color: #fff; border: none; border-radius: 7px; font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;"
            >
              <span>📥</span> {{ isImportingFiles ? 'Importation...' : 'Importer des devoirs' }}
            </button>
            <button 
              @click="handleScanDirectory" 
              :disabled="isImportingFiles"
              style="padding: 7px 14px; background: #059669; color: #fff; border: none; border-radius: 7px; font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;"
              title="Scanner automatiquement un dossier entier de devoirs (ex: dossier Google Drive local)"
            >
              <span>📁</span> Scanner un dossier local
            </button>
            <button 
              @click="handleRestoreCertifiedWorks" 
              style="padding: 7px 14px; background: #8b5cf6; color: #fff; border: none; border-radius: 7px; font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;"
              title="Restaurer immédiatement l'ensemble des devoirs, fichiers et quiz certifiés des 5 étudiants"
            >
              <span>⚡</span> Restaurer travaux certifiés
            </button>
            <a 
              href="https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH" 
              target="_blank" 
              rel="noopener noreferrer"
              style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; background: #e0f2fe; color: #0369a1; border-radius: 7px; font-size: 0.85rem; font-weight: 600; text-decoration: none; border: 1px solid #bae6fd;"
            >
              📂 Google Drive Cloud ↗
            </a>
          </div>
        </div>

        <!-- ZONE DE GLISSER-DÉPOSER INTELLIGENTE -->
        <div 
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDropFiles"
          :style="{
            padding: '1.2rem',
            marginBottom: '1.5rem',
            border: isDraggingFiles ? '2px dashed #0284c7' : '2px dashed var(--vp-c-divider)',
            background: isDraggingFiles ? '#f0f9ff' : 'var(--vp-c-bg-soft)',
            borderRadius: '12px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }"
          @click="triggerFileInput"
        >
          <div style="font-size: 1.8rem; margin-bottom: 4px;">📂 📥</div>
          <div style="font-weight: 700; color: var(--vp-c-brand-1); font-size: 0.95rem;">
            Glissez-déposez vos devoirs d'étudiants ici (.xlsx, .docx, .pdf) ou cliquez pour sélectionner
          </div>
          <div style="color: var(--vp-c-text-2); font-size: 0.82rem; margin-top: 4px;">
            Reconnaissance automatique de l'étudiant (Legentil, Lemaire, Daltin, Manno, Capitaine) et de l'exercice (Ex 01 à 07, 02.a, 02.b).
            <br/>Extraction automatique du texte et auto-évaluation critériée immédiate !
          </div>
        </div>
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
            <div style="display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap;">
              <input 
                v-model="webhookInput" 
                type="text" 
                placeholder="https://script.google.com/macros/s/.../exec"
                style="flex: 1; min-width: 260px; padding: 10px 14px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 0.9rem;"
              />
              <button @click="handleSaveWebhook" style="padding: 10px 16px; background: var(--vp-c-brand-1); color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
                Enregistrer l'URL
              </button>
              <button @click="handleTestCloudConnection" :disabled="isTestingConnection" style="padding: 10px 16px; background: #0284c7; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <span>🧪</span> {{ isTestingConnection ? 'Test...' : 'Tester la connexion' }}
              </button>
            </div>
            <p v-if="webhookStatus" style="color: #059669; font-weight: 600; font-size: 0.9rem;">{{ webhookStatus }}</p>

            <div v-if="testConnectionResult" :style="{
              padding: '12px 16px',
              borderRadius: '8px',
              marginTop: '10px',
              fontSize: '0.88rem',
              fontWeight: 600,
              background: testConnectionResult.success ? '#f0fdf4' : '#fef2f2',
              color: testConnectionResult.success ? '#166534' : '#991b1b',
              border: testConnectionResult.success ? '1px solid #bbf7d0' : '1px solid #fecaca'
            }">
              {{ testConnectionResult.success ? '✓' : '⚠️' }} {{ testConnectionResult.message }}
            </div>

            <!-- GUIDE RAPIDE DE DÉPLOIEMENT GOOGLE APPS SCRIPT -->
            <div style="margin-top: 1.5rem; padding: 1rem; background: var(--vp-c-bg); border-radius: 8px; border: 1px solid var(--vp-c-divider); font-size: 0.85rem; line-height: 1.5;">
              <strong style="color: var(--vp-c-brand-1); display: block; margin-bottom: 6px;">📋 Comment déployer votre Webhook Google Apps Script en 3 minutes :</strong>
              <ol style="margin: 0; padding-left: 1.2rem; color: var(--vp-c-text-2);">
                <li>Ouvrez Google Sheets ou créez une nouvelle feuille de calcul intitulée <em>« HECh - Base Préparateur Physique 2026 »</em>.</li>
                <li>Allez dans le menu <strong>Extensions &gt; Apps Script</strong>.</li>
                <li>Collez l'intégralité du code présent dans le fichier local <code>scripts/google-apps-script-backend.js</code>.</li>
                <li>Cliquez sur <strong>Déployer &gt; Nouveau déploiement</strong>.</li>
                <li>Sélectionnez le type <strong>Application Web</strong> :
                  <ul style="margin: 4px 0;">
                    <li>Exécuter en tant que : <strong>Moi (votre compte Google)</strong></li>
                    <li>Qui a accès : <strong>Tout le monde (Anyone)</strong> <em>(indispensable pour permettre aux étudiants de synchroniser leurs devoirs sans compte Google)</em></li>
                  </ul>
                </li>
                <li>Copiez l'URL de l'application web fournie (se terminant par <code>/exec</code>) et collez-la dans le champ ci-dessus.</li>
              </ol>
            </div>
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
          <button @click="handleAdminResetStudentPassword(currentDossier.email)" style="padding: 6px 12px; background: #8b5cf6; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;" title="Réinitialiser le mot de passe à hech2026">
            🔑 Réinitialiser MDP
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
            { id: 'all', label: 'Tous les éléments (15)' },
            { id: 'quiz', label: 'Quiz en ligne (7)' },
            { id: 'exercises', label: 'Exercices & Mission (8)' },
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
              <div v-if="!item.file" style="margin-bottom: 1rem; padding: 10px 14px; background: var(--vp-c-bg); border: 1px dashed var(--vp-c-divider); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <small style="color: var(--vp-c-text-2);">Aucun document déposé par l'étudiant pour cet exercice.</small>
                <button 
                  @click="triggerUploadForStudent(currentDossier.email, item.id)"
                  style="padding: 5px 12px; background: #0284c7; color: #fff; border: none; border-radius: 6px; font-size: 0.82rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px;"
                >
                  <span>📥</span> Déposer / Importer le devoir
                </button>
              </div>
              <div v-if="item.file" class="dsw-file-block">
                <div class="dfb-file-card">
                  <div class="dfb-left">
                    <span class="dfb-icon">
                      {{ (item.file.fileType && item.file.fileType.includes('pdf')) || (item.file.formattedFileName || '').endsWith('.pdf') ? '📄' : ((item.file.formattedFileName || '').endsWith('.xlsx') ? '📊' : '📝') }}
                    </span>
                    <div class="dfb-info">
                      <span class="dfb-name">{{ item.file.formattedFileName || item.file.originalFileName }}</span>
                      <span class="dfb-size">{{ formatSize(item.file.fileSize) }} • Remis le {{ item.file.submittedAt }}</span>
                    </div>
                  </div>
                  <div class="dfb-actions">
                    <button 
                      type="button"
                      @click="toggleDocumentPreview(item.file)" 
                      :class="['btn-preview-doc', activeDocPreview?.fileId === item.file.id ? 'active' : '']"
                      title="Afficher le document directement dans la page pour lecture"
                    >
                      {{ activeDocPreview?.fileId === item.file.id ? '✕ Fermer la lecture' : '📖 Lire le document (Word / PDF / Excel)' }}
                    </button>
                    <button 
                      type="button"
                      @click="downloadFile(item.file)" 
                      class="btn-download-doc" 
                      title="Télécharger le fichier original"
                    >
                      📥 Télécharger
                    </button>
                    <a 
                      v-if="item.file.driveUrl" 
                      :href="item.file.driveUrl" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      class="btn-download-doc btn-drive-link" 
                      title="Ouvrir directement dans Google Drive"
                    >
                      ☁️ Drive
                    </a>
                  </div>
                </div>

                <!-- VISUALISEUR INTÉGRÉ WORD / PDF / TEXTE (LECTURE CONFORTABLE DIRECTE) -->
                <div v-if="activeDocPreview?.fileId === item.file.id" class="inline-doc-viewer-container">
                  <div class="idv-header">
                    <span class="idv-title">
                      Lecteur Intégré : <strong>{{ activeDocPreview.fileName }}</strong>
                      <span class="idv-tag">{{ activeDocPreview.type.toUpperCase() }}</span>
                    </span>

                    <!-- Switcher vue originale vs texte brut extrait -->
                    <div class="idv-header-actions">
                      <button 
                        v-if="activeDocPreview.extractedText" 
                        class="idv-mode-btn"
                        :class="{ active: activeDocPreview.viewMode === 'text' }"
                        @click="activeDocPreview.viewMode = activeDocPreview.viewMode === 'text' ? (activeDocPreview.type === 'pdf' ? 'pdf' : (activeDocPreview.type === 'docx' ? 'docx' : 'text')) : 'text'"
                        :title="activeDocPreview.viewMode === 'text' ? 'Afficher la mise en page originale' : 'Afficher le texte brut intégral'"
                      >
                        {{ activeDocPreview.viewMode === 'text' ? '📄 Page Originale' : '📝 Texte Intégral' }}
                      </button>
                      <a 
                        v-if="activeDocPreview.fileUrl" 
                        :href="activeDocPreview.fileUrl" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="idv-mode-btn"
                        title="Ouvrir dans un nouvel onglet"
                      >
                        ↗️ Plein écran
                      </a>
                      <button @click="downloadFile(item.file)" class="idv-btn-dl" title="Télécharger le fichier original">
                        📥 Télécharger
                      </button>
                      <button class="idv-close" @click="closeDocPreview()" title="Fermer l'aperçu">✕</button>
                    </div>
                  </div>

                  <!-- Chargement Word Mammoth -->
                  <div v-if="activeDocPreview.loading" class="idv-loading">
                    <span class="idv-spinner">⏳</span> Traitement et mise en page du document en cours...
                  </div>

                  <!-- Message d'erreur -->
                  <div v-else-if="activeDocPreview.error && !activeDocPreview.extractedText" class="idv-error">
                    ⚠️ {{ activeDocPreview.error }}
                    <div style="margin-top: 0.5rem;">
                      <button @click="downloadFile(item.file)" class="btn-download-doc">
                        📥 Télécharger le fichier
                      </button>
                    </div>
                  </div>

                  <!-- Mode Texte Brut Intégral (100% lisibilité immédiate) -->
                  <div v-else-if="activeDocPreview.viewMode === 'text' && activeDocPreview.extractedText" class="idv-docx-box">
                    <div class="docx-paper-sheet extracted-text-view">
                      <div class="extracted-text-header">
                        <h4 style="margin: 0; color: #1e293b;">📄 Transcription intégrale du devoir remis</h4>
                        <span class="extracted-hint">Texte complet extrait du fichier remis par l'étudiant.</span>
                      </div>
                      <pre class="extracted-raw-text">{{ activeDocPreview.extractedText }}</pre>
                    </div>
                  </div>

                  <!-- Aperçu PDF natif via iframe avec fileUrl ou Blob URL -->
                  <div v-else-if="activeDocPreview.type === 'pdf'" class="idv-pdf-box">
                    <iframe 
                      :src="activeDocPreview.fileUrl || activeDocPreview.blobUrl || activeDocPreview.dataUrl" 
                      class="dossier-pdf-frame" 
                      title="Lecteur PDF intégré"
                    ></iframe>
                  </div>

                  <!-- Aperçu Word converti en HTML via Mammoth -->
                  <div v-else-if="activeDocPreview.type === 'docx'" class="idv-docx-box">
                    <div v-if="activeDocPreview.htmlContent" class="docx-paper-sheet" v-html="activeDocPreview.htmlContent"></div>
                    <div v-else-if="activeDocPreview.extractedText" class="docx-paper-sheet extracted-text-view">
                      <pre class="extracted-raw-text">{{ activeDocPreview.extractedText }}</pre>
                    </div>
                  </div>

                  <!-- Autre format (Excel / etc.) -->
                  <div v-else class="idv-fallback">
                    <div v-if="activeDocPreview.extractedText" class="docx-paper-sheet extracted-text-view">
                      <div class="extracted-text-header">
                        <h4 style="margin: 0; color: #1e293b;">📊 Données & Synthèse extraites (Tableur Excel)</h4>
                        <span class="extracted-hint">Structure du classeur remis par l'étudiant.</span>
                      </div>
                      <pre class="extracted-raw-text">{{ activeDocPreview.extractedText }}</pre>
                    </div>
                    <div v-else style="padding: 1.5rem; text-align: center; color: var(--vp-c-text-2);">
                      Ce format ne peut être affiché directement en aperçu web. Veuillez le télécharger pour le consulter dans votre logiciel.
                    </div>
                  </div>
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

<style scoped>
.eval-admin-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.eval-toolbar-sub {
  margin: 6px 0 0 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.btn-export-excel-highlight {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
  transition: all 0.2s ease;
}

.btn-export-excel-highlight:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
}

.eval-kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.eval-kpi-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg);
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: var(--tile-shadow);
}

.eval-kpi-card.highlight-moy {
  border-left: 4px solid var(--vp-c-brand-1);
}

.eval-kpi-card.highlight-pass {
  border-left: 4px solid #10b981;
}

.eval-kpi-card.highlight-high {
  border-left: 4px solid #f59e0b;
}

.eval-kpi-card.highlight-low {
  border-left: 4px solid #64748b;
}

.eval-kpi-card.highlight-alarm {
  border-left: 4px solid #ef4444;
}

.ekpi-icon {
  font-size: 1.75rem;
}

.ekpi-val {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.ekpi-val strong {
  font-size: 1.5rem;
}

.ekpi-label {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  margin-top: 2px;
}

.grid-eval-card-container {
  background: var(--vp-c-bg);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  padding: 1.5rem;
  box-shadow: var(--tile-shadow);
}

.gec-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.gec-selector-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 280px;
}

.gec-selector-group label {
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
}

.student-eval-select {
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.gec-actions-group {
  display: flex;
  gap: 8px;
}

.btn-bulk-adopt-ai {
  padding: 9px 14px;
  background: #eff6ff;
  color: #0284c7;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-bulk-adopt-ai:hover {
  background: #dbeafe;
}

.btn-save-grid-main {
  padding: 9px 18px;
  background: var(--vp-c-brand-1);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save-grid-main:hover {
  opacity: 0.92;
}

.alarm-student-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid;
  margin-bottom: 1.25rem;
}

.alarm-bell-large {
  font-size: 1.5rem;
}

.asb-title {
  font-weight: 800;
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.asb-desc {
  font-size: 0.88rem;
  margin-bottom: 8px;
}

.asb-badges-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.asb-item-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid;
  font-size: 0.8rem;
}

.grid-save-feedback-banner {
  padding: 10px 14px;
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
  animation: fadeIn 0.3s ease;
}

.detailed-8-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.detailed-8-table th {
  padding: 12px 14px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.detailed-8-table td {
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  vertical-align: middle;
}

.grid-item-row.row-overdue {
  background: #fff1f2;
}

.grid-item-row.row-final-step {
  background: #fdf4ff;
}

.item-title-group {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.item-status-icon {
  font-size: 1.2rem;
  line-height: 1.2;
}

.highlight-final {
  color: #86198f;
}

.item-file-link {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-top: 4px;
}

.item-file-link code {
  color: var(--vp-c-brand-1);
  background: rgba(2, 132, 199, 0.08);
  padding: 1px 4px;
  border-radius: 4px;
}

.item-file-link.overdue {
  color: #dc2626;
  font-weight: 600;
}

.item-file-link.missing {
  color: #ea580c;
}

.max-badge {
  display: inline-block;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 3px 8px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
}

.ai-score-cell-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.ai-pill {
  display: inline-block;
  padding: 3px 10px;
  background: #e0f2fe;
  color: #0369a1;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  font-size: 0.88rem;
}

.btn-adopt-mini {
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 4px;
  border: 1px solid #bfdbfe;
  background: #f0fdf4;
  color: #166534;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-adopt-mini:hover {
  background: #dcfce7;
}

.teacher-input-cell-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.teacher-score-input {
  width: 72px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 2px solid var(--vp-c-brand-1);
  text-align: center;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

.pts-denom {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.teacher-comment-input {
  width: 100%;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  font-size: 0.85rem;
  background: var(--vp-c-bg);
}

.grid-recap-footer {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .grid-recap-footer {
    grid-template-columns: 1fr;
  }
}

.grf-scores-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}

.grf-score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.grf-score-item.final-20 {
  background: linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(2, 132, 199, 0.15) 100%);
  border: 2px solid var(--vp-c-brand-1);
  padding: 12px;
}

.grf-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
}

.grf-val {
  font-size: 1.1rem;
  font-weight: 800;
}

.grf-val-huge {
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--vp-c-brand-1);
}

.grf-mention-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
}

.grf-mention-badge.m-g-dist {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

.grf-mention-badge.m-dist {
  background: #e0f2fe;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.grf-mention-badge.m-pass {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.grf-mention-badge.m-fail {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.grf-feedback-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.grf-feedback-box label {
  font-weight: 700;
  font-size: 0.9rem;
}

.grf-textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
  resize: vertical;
  background: var(--vp-c-bg);
}

.grf-btn-row {
  display: flex;
  justify-content: flex-end;
}

/* ========================================================================= */
/* LECTEUR INTÉGRÉ WORD / PDF / EXCEL & TABLES DE CORRECTION (STYLE DIDACTIQUE M1) */
/* ========================================================================= */
.inline-doc-viewer-container {
  margin-top: 0.8rem;
  background: #ffffff;
  border: 2px solid #0284c7;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.idv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
  background: #0f172a;
  color: #ffffff;
  font-size: 0.88rem;
  flex-wrap: wrap;
  gap: 8px;
}

.idv-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.idv-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.idv-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.idv-mode-btn {
  background: #0284c7;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease;
}
.idv-mode-btn:hover {
  background: #0369a1;
}
.idv-mode-btn.active {
  background: #f59e0b;
  color: #000;
  border-color: #d97706;
}

.idv-btn-dl {
  background: #10b981;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.idv-btn-dl:hover {
  background: #059669;
}

.idv-close {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 4px;
}
.idv-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.idv-loading {
  padding: 3rem 2rem;
  text-align: center;
  font-weight: 700;
  color: #0369a1;
  font-size: 1rem;
  background: #f8fafc;
}

.idv-error {
  padding: 1.5rem;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.9rem;
}

.dossier-pdf-frame {
  width: 100%;
  height: 75vh;
  min-height: 550px;
  border: none;
  display: block;
}

.docx-paper-sheet {
  background: #ffffff;
  padding: 2.2rem 3rem;
  max-height: 70vh;
  min-height: 400px;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.7;
  color: #1e293b;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.03);
}

.docx-paper-sheet.extracted-text-view {
  background: #f8fafc;
  padding: 1.5rem 2rem;
}

.extracted-text-header {
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.extracted-hint {
  font-size: 0.82rem;
  color: #64748b;
  font-style: italic;
}

.extracted-raw-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 0.88rem;
  line-height: 1.6;
  color: #0f172a;
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  max-height: 60vh;
  overflow-y: auto;
}

.dsw-file-block {
  margin-bottom: 1rem;
}

.dfb-file-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
  gap: 8px;
}

.dfb-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dfb-icon {
  font-size: 1.5rem;
}

.dfb-info {
  display: flex;
  flex-direction: column;
}

.dfb-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.dfb-size {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.dfb-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-preview-doc {
  padding: 6px 12px;
  background: #0284c7;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-preview-doc:hover {
  background: #0369a1;
}
.btn-preview-doc.active {
  background: #f59e0b;
  color: #000;
}

.btn-download-doc {
  padding: 6px 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
.btn-download-doc:hover {
  background: var(--vp-c-bg-soft);
}

.btn-drive-link {
  background: #0284c7;
  color: #fff;
  border-color: #0284c7;
}
.btn-drive-link:hover {
  background: #0369a1;
}

.btn-open-dossier-header {
  padding: 6px 12px;
  background: #0284c7;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-open-dossier-header:hover {
  background: #0369a1;
}

.grid-file-actions {
  margin-top: 6px;
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}

.btn-preview-mini {
  padding: 4px 8px;
  background: #0284c7;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-preview-mini.active {
  background: #f59e0b;
  color: #000;
}

.btn-download-mini {
  padding: 4px 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  color: inherit;
}

.btn-drive-mini {
  padding: 4px 8px;
  background: #e0f2fe;
  color: #0369a1;
  border: 1px solid #bae6fd;
  border-radius: 4px;
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
}

.grid-preview-cell {
  padding: 0 10px 14px 10px !important;
  background: var(--vp-c-bg-soft) !important;
}

.class-summary-card {
  margin-top: 2rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.css-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.css-header h4 {
  margin: 0;
  font-size: 1.1rem;
}

.css-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-weight: 600;
}

.class-overview-table {
  width: 100%;
  border-collapse: collapse;
}

.class-overview-table th {
  padding: 10px 12px;
  background: var(--vp-c-bg-soft);
  border-bottom: 2px solid var(--vp-c-divider);
  font-size: 0.88rem;
}

.class-overview-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
}

.student-name-container {
  display: flex;
  align-items: center;
  gap: 6px;
}

.student-name-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
}
.student-name-link:hover {
  text-decoration: underline;
}

.student-sub-mail {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin-top: 2px;
}

.total-100-cell {
  font-weight: 700;
}

.grade-20-cell-highlight {
  background: #e0f2fe;
  color: #0369a1;
  font-size: 1.05rem;
}

.btn-row-action.dossier-btn {
  padding: 4px 10px;
  background: #0284c7;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-row-action.dossier-btn:hover {
  background: #0369a1;
}

.btn-row-action.edit-grade {
  padding: 4px 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  color: inherit;
}
.btn-row-action.edit-grade:hover {
  background: var(--vp-c-bg-soft);
}
</style>

