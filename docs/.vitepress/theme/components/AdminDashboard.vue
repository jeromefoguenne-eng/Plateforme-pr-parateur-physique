<script setup>
import { ref, computed, onMounted } from 'vue'
import { userStore, OFFICIAL_EVALUATION_ITEMS, formatDeadlineDisplay, getAlarmLevelInfo, parseDeadline } from '../stores/userStore'
import { DEFAULT_CLOUD_URL } from '../stores/cloudSync'

const enteredPin = ref('')
const isAuthenticated = ref(false)
const loginError = ref('')
const adminTab = ref('students') // 'students' | 'grading' | 'deadlines' | 'settings' | 'export'

const users = computed(() => userStore.users.filter(u => u.role === 'student'))
const submittedFiles = computed(() => userStore.submittedFiles)
const quizAttempts = computed(() => userStore.quizAttempts)

const selectedGradingFile = ref(null)
const gradeInput = ref(16)
const feedbackInput = ref('')
const isAiAnalyzing = ref(false)

// Synchronisation Cloud
const isCloudSyncing = ref(false)
const cloudSyncFeedback = ref('')
const webhookInput = ref(userStore.cloudUrl || DEFAULT_CLOUD_URL)
const webhookStatus = ref('')

// Échéances éditables composées (Date + Heure)
const deadlineDates = ref({})
const deadlineTimes = ref({})

onMounted(() => {
  userStore.syncFromStorage()
  initDeadlineInputs()
  userStore.syncWithCloud().then(() => {
    initDeadlineInputs()
  }).catch(() => {})
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
  if (userStore.verifyAdminPin(enteredPin.value)) {
    isAuthenticated.value = true
    loginError.value = ''
    triggerCloudSync()
  } else {
    loginError.value = 'Code PIN incorrect. Veuillez réessayer.'
  }
}

function handleLogout() {
  isAuthenticated.value = false
  enteredPin.value = ''
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

function openGradingModal(file) {
  selectedGradingFile.value = file
  gradeInput.value = file.teacherGrade ? file.teacherGrade.score : (file.aiCorrection ? file.aiCorrection.suggestedScore : 16)
  feedbackInput.value = file.teacherGrade ? file.teacherGrade.feedback : (file.aiCorrection ? file.aiCorrection.summary : '')
}

function closeGradingModal() {
  selectedGradingFile.value = null
}

async function triggerAiAnalysis(file) {
  isAiAnalyzing.value = true
  const res = await userStore.analyzeFileWithAi(file.id)
  isAiAnalyzing.value = false
  if (res.success && res.file) {
    selectedGradingFile.value = res.file
    gradeInput.value = res.file.aiCorrection?.suggestedScore || 16
    feedbackInput.value = res.file.aiCorrection?.summary || ''
  } else {
    alert(res.message)
  }
}

function adoptAiGrade() {
  if (selectedGradingFile.value?.aiCorrection) {
    gradeInput.value = selectedGradingFile.value.aiCorrection.suggestedScore
    feedbackInput.value = selectedGradingFile.value.aiCorrection.summary
  }
}

function saveGrade() {
  if (!selectedGradingFile.value) return
  userStore.saveTeacherGrade(selectedGradingFile.value.id, Number(gradeInput.value), feedbackInput.value)
  alert(`Note et feedback enregistrés pour ${selectedGradingFile.value.userName} !`)
  closeGradingModal()
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
  alert('Toutes les échéances ont été enregistrées et synchronisées !')
}

function handleResetDeadlines() {
  if (confirm("Voulez-vous vraiment effacer toutes les dates d'échéances fixées ?")) {
    userStore.clearAllDeadlines()
    initDeadlineInputs()
    alert('Toutes les échéances ont été effacées.')
  }
}

function exportCsv() {
  let csv = "Nom;Prenom;Email;Exercice;Fichier;Date_Depot;Note_IA_20;Note_Enseignant_20;Statut;Feedback\n"
  submittedFiles.value.forEach(f => {
    const aiNote = f.aiCorrection ? f.aiCorrection.suggestedScore : ''
    const teachNote = f.teacherGrade ? f.teacherGrade.score : ''
    const status = f.teacherGrade ? 'Noté' : 'À corriger'
    const fb = (f.teacherGrade?.feedback || f.aiCorrection?.summary || '').replace(/"/g, '""')
    csv += `"${f.userName}";"${f.userEmail}";"${f.exerciseTitle}";"${f.formattedFileName}";"${f.submittedAt}";"${aiNote}";"${teachNote}";"${status}";"${fb}"\n`
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
  <div style="max-width: 1050px; margin: 0 auto; padding: 1.5rem 0;">
    <!-- Écran de déverrouillage PIN -->
    <div v-if="!isAuthenticated" style="max-width: 460px; margin: 3rem auto; padding: 2.5rem; background: var(--vp-c-bg-soft); border-radius: 16px; border: 1px solid var(--vp-c-divider); text-align: center; box-shadow: var(--tile-shadow);">
      <span style="font-size: 3rem;">🔐</span>
      <h2 style="margin: 0.8rem 0 0.4rem 0;">Espace Enseignant (Admin)</h2>
      <p style="color: var(--vp-c-text-2); font-size: 0.92rem; margin-bottom: 1.5rem;">
        Veuillez saisir votre code PIN enseignant pour accéder à la gestion de la classe.
      </p>

      <input 
        v-model="enteredPin" 
        type="password" 
        placeholder="Code PIN (par défaut : hech2026)" 
        @keyup.enter="checkPin"
        style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: inherit; font-size: 1.1rem; text-align: center; box-sizing: border-box; margin-bottom: 1rem;" 
      />

      <button @click="checkPin" style="width: 100%; padding: 12px; background: #0284c7; color: #fff; border: none; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer;">
        Déverrouiller l'espace
      </button>

      <p v-if="loginError" style="color: #ef4444; font-weight: 600; margin-top: 1rem;">
        {{ loginError }}
      </p>
    </div>

    <!-- Tableau de bord enseignant -->
    <div v-else>
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--vp-c-divider);">
        <div>
          <span style="font-size: 0.82rem; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px;">
            👨‍🏫 Administration & Évaluation
          </span>
          <h2 style="margin: 0.2rem 0 0 0;">Tableau de Bord Promotion HECh</h2>
        </div>
        <button @click="handleLogout" style="padding: 6px 14px; background: var(--vp-c-default-soft); border: 1px solid var(--vp-c-divider); border-radius: 6px; cursor: pointer;">
          🔒 Verrouiller
        </button>
      </div>

      <!-- BANDEAU SYNCHRONISATION CLOUD & MULTI-APPAREILS -->
      <div class="cloud-sync-bar">
        <div class="cloud-sync-left">
          <span class="cloud-pulse-icon">☁️</span>
          <div>
            <div class="cloud-title">Synchronisation Multi-Appareils (Google Drive & Sheets)</div>
            <div class="cloud-subtitle">{{ cloudSyncTimeText }}</div>
          </div>
        </div>
        <div class="cloud-sync-right">
          <span v-if="cloudSyncFeedback" class="cloud-feedback-tag">{{ cloudSyncFeedback }}</span>
          <button @click="triggerCloudSync" :disabled="isCloudSyncing" class="btn-sync-action">
            {{ isCloudSyncing ? '⏳ Synchronisation...' : '🔄 Synchroniser maintenant' }}
          </button>
        </div>
      </div>

      <!-- Onglets de navigation -->
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <button 
          @click="adminTab = 'students'" 
          :style="{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--vp-c-divider)', background: adminTab === 'students' ? '#0284c7' : 'var(--vp-c-bg-soft)', color: adminTab === 'students' ? '#fff' : 'inherit', fontWeight: '600', cursor: 'pointer' }"
        >
          👥 Cohorte & Avancement ({{ users.length }})
        </button>
        <button 
          @click="adminTab = 'grading'" 
          :style="{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--vp-c-divider)', background: adminTab === 'grading' ? '#0284c7' : 'var(--vp-c-bg-soft)', color: adminTab === 'grading' ? '#fff' : 'inherit', fontWeight: '600', cursor: 'pointer' }"
        >
          📥 Travaux Déposés & IA ({{ submittedFiles.length }})
        </button>
        <button 
          @click="adminTab = 'deadlines'" 
          :style="{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--vp-c-divider)', background: adminTab === 'deadlines' ? '#0284c7' : 'var(--vp-c-bg-soft)', color: adminTab === 'deadlines' ? '#fff' : 'inherit', fontWeight: '600', cursor: 'pointer' }"
        >
          📅 Gestion des Échéances
        </button>
        <button 
          @click="adminTab = 'settings'" 
          :style="{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--vp-c-divider)', background: adminTab === 'settings' ? '#0284c7' : 'var(--vp-c-bg-soft)', color: adminTab === 'settings' ? '#fff' : 'inherit', fontWeight: '600', cursor: 'pointer' }"
        >
          ⚙️ Paramètres & Cloud
        </button>
        <button 
          @click="adminTab = 'export'" 
          :style="{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--vp-c-divider)', background: adminTab === 'export' ? '#0284c7' : 'var(--vp-c-bg-soft)', color: adminTab === 'export' ? '#fff' : 'inherit', fontWeight: '600', cursor: 'pointer' }"
        >
          📊 Exportation CSV
        </button>
      </div>

      <!-- Onglet 1 : Étudiants & Avancement -->
      <div v-if="adminTab === 'students'" style="background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider); padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="margin: 0; font-size: 1.2rem;">Liste des étudiants inscrits (Synchronisés Cloud)</h3>
          <span style="font-size: 0.85rem; color: var(--vp-c-text-2);">Total : {{ users.length }} étudiant(s)</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <thead>
            <tr style="border-bottom: 2px solid var(--vp-c-divider); text-align: left;">
              <th style="padding: 10px 8px;">Nom & Prénom</th>
              <th style="padding: 10px 8px;">Email HECh</th>
              <th style="padding: 10px 8px; text-align: center;">Travaux remis</th>
              <th style="padding: 10px 8px; text-align: center;">Progression</th>
              <th style="padding: 10px 8px; text-align: center;">Statut Délais</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.id" style="border-bottom: 1px solid var(--vp-c-divider);">
              <td style="padding: 10px 8px; font-weight: 600;">{{ u.lastName }} {{ u.firstName }}</td>
              <td style="padding: 10px 8px; color: var(--vp-c-text-2);">{{ u.email }}</td>
              <td style="padding: 10px 8px; text-align: center;">
                {{ getStudentProgress(u.email).completed }} / {{ getStudentProgress(u.email).total }}
              </td>
              <td style="padding: 10px 8px; text-align: center;">
                <span :style="{ padding: '3px 8px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '700', background: getStudentProgress(u.email).pct >= 80 ? '#ecfdf5' : '#fefce8', color: getStudentProgress(u.email).pct >= 80 ? '#047857' : '#b45309' }">
                  {{ getStudentProgress(u.email).pct }} %
                </span>
              </td>
              <td style="padding: 10px 8px; text-align: center;">
                <span v-if="userStore.getStudentLateStatus(u.email).isLate" :style="{ padding: '3px 8px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '700', color: '#fff', backgroundColor: userStore.getStudentLateStatus(u.email).highestAlarmInfo.color }">
                  {{ userStore.getStudentLateStatus(u.email).highestAlarmInfo.icon }} {{ userStore.getStudentLateStatus(u.email).highestAlarmInfo.label }}
                </span>
                <span v-else style="padding: 3px 8px; border-radius: 12px; font-size: 0.78rem; font-weight: 600; background: #ecfdf5; color: #047857;">
                  ✓ Dans les délais
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Onglet 2 : Travaux Déposés & Correction IA -->
      <div v-if="adminTab === 'grading'">
        <div v-if="submittedFiles.length === 0" style="padding: 2rem; text-align: center; background: var(--vp-c-bg-soft); border-radius: 12px;">
          Aucun document n'a encore été déposé par les étudiants.
        </div>

        <div v-else style="display: flex; flex-direction: column; gap: 1rem;">
          <div 
            v-for="f in submittedFiles" 
            :key="f.id" 
            style="padding: 1.2rem 1.5rem; background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider);"
          >
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.8rem;">
              <div>
                <span style="font-size: 0.82rem; font-weight: 700; color: #0284c7;">{{ f.exerciseTitle }}</span>
                <h4 style="margin: 0.2rem 0; font-size: 1.15rem;">{{ f.userName }} ({{ f.userEmail }})</h4>
                <p style="margin: 0; font-size: 0.88rem; color: var(--vp-c-text-2);">
                  📄 {{ f.formattedFileName }} • Déposé le {{ f.submittedAt }}
                  <span v-if="f.driveSynced" style="margin-left: 8px; color: #10b981; font-weight: 600;">☁️ Sauvegardé Drive</span>
                </p>
              </div>

              <div style="display: flex; align-items: center; gap: 0.8rem;">
                <!-- Note Enseignant -->
                <span v-if="f.teacherGrade" style="padding: 4px 10px; border-radius: 6px; background: #ecfdf5; color: #047857; font-weight: 700; font-size: 0.95rem;">
                  Note : {{ f.teacherGrade.score }} / 20
                </span>
                <span v-else-if="f.aiCorrection" style="padding: 4px 10px; border-radius: 6px; background: rgba(2, 132, 199, 0.1); color: #0284c7; font-weight: 700; font-size: 0.95rem;">
                  IA : {{ f.aiCorrection.suggestedScore }} / 20
                </span>

                <button @click="openGradingModal(f)" style="padding: 8px 16px; background: #0284c7; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                  🔍 Évaluer / Corriger
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglet 3 : Gestion des Échéances -->
      <div v-if="adminTab === 'deadlines'" style="background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider); padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.2rem;">
          <div>
            <h3 style="margin: 0; font-size: 1.2rem;">Calendrier des Remises & Alarmes</h3>
            <p style="margin: 0.2rem 0 0 0; font-size: 0.86rem; color: var(--vp-c-text-2);">
              Fixez les dates et heures limites pour chaque travail. Les alarmes (Orange, Bordeaux, Rouge) s'activent à partir d'1 semaine de retard.
            </p>
          </div>
          <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
            <button @click="saveAllDeadlines" style="padding: 8px 16px; background: #0284c7; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
              💾 Enregistrer toutes les échéances
            </button>
            <button @click="handleResetDeadlines" style="padding: 8px 16px; background: var(--vp-c-default-soft); border: 1px solid var(--vp-c-divider); border-radius: 8px; font-weight: 600; cursor: pointer;">
              🗑️ Effacer toutes les échéances
            </button>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <thead>
            <tr style="border-bottom: 2px solid var(--vp-c-divider); text-align: left;">
              <th style="padding: 10px 8px;">Travail concerné</th>
              <th style="padding: 10px 8px;">Date & Heure limite</th>
              <th style="padding: 10px 8px; text-align: center;">Statut Actuel</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="it in OFFICIAL_EVALUATION_ITEMS.filter(x => x.category === 'exercice' || x.category === 'final')" :key="it.id" style="border-bottom: 1px solid var(--vp-c-divider);">
              <td style="padding: 10px 8px;">
                <strong>{{ it.title }}</strong>
                <div style="font-size: 0.8rem; color: var(--vp-c-text-2);">{{ it.shortTitle }}</div>
              </td>
              <td style="padding: 10px 8px;">
                <div class="deadline-picker-composite">
                  <input 
                    type="date" 
                    v-model="deadlineDates[it.id]" 
                    class="input-date-clean" 
                    @change="handleDateOrTimeChange(it.id)"
                    title="Date limite"
                  />
                  <input 
                    type="time" 
                    v-model="deadlineTimes[it.id]" 
                    class="input-time-clean" 
                    @change="handleDateOrTimeChange(it.id)"
                    title="Heure limite"
                  />
                </div>
              </td>
              <td style="padding: 10px 8px; text-align: center;">
                <span v-if="userStore.getExerciseDeadline(it.id).isDefined" style="padding: 3px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; background: #e0f2fe; color: #0369a1;">
                  📅 {{ userStore.getExerciseDeadline(it.id).display }}
                </span>
                <span v-else style="padding: 3px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 500; background: var(--vp-c-bg); border: 1px dashed var(--vp-c-divider); color: var(--vp-c-text-2);">
                  ⚪ Non fixée (dépôt libre)
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Onglet 4 : Paramètres & Cloud -->
      <div v-if="adminTab === 'settings'" style="background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider); padding: 1.5rem;">
        <h3 style="margin-top: 0; font-size: 1.2rem;">⚙️ Passerelle Google Cloud (Drive & Sheets)</h3>
        <p style="color: var(--vp-c-text-2); font-size: 0.9rem; line-height: 1.5;">
          Connectez la plateforme à votre compte Google pour synchroniser instantanément les comptes étudiants, les devoirs, les notes et les fichiers sur tous vos appareils.
        </p>

        <div style="margin: 1.5rem 0; padding: 1.2rem; background: var(--vp-c-bg); border-radius: 10px; border: 1px solid var(--vp-c-divider);">
          <label style="display: block; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.92rem;">
            URL du Webhook Google Apps Script (Application Web) :
          </label>
          <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
            <input 
              v-model="webhookInput" 
              type="text" 
              placeholder="https://script.google.com/macros/s/.../exec" 
              style="flex: 1; min-width: 300px; padding: 10px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: inherit; font-size: 0.88rem;"
            />
            <button @click="handleSaveWebhook" style="padding: 10px 18px; background: #0284c7; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
              Enregistrer & Tester
            </button>
          </div>
          <div v-if="webhookStatus" style="margin-top: 0.8rem; font-size: 0.86rem; font-weight: 600; color: #16a34a;">
            {{ webhookStatus }}
          </div>
        </div>

        <div style="padding: 1.2rem; background: rgba(2, 132, 199, 0.05); border-radius: 10px; border-left: 4px solid #0284c7;">
          <h4 style="margin: 0 0 0.5rem 0; color: #0284c7; font-size: 1rem;">📋 Procédure d'installation rapide (1 minute)</h4>
          <ol style="margin: 0; padding-left: 1.3rem; font-size: 0.88rem; color: var(--vp-c-text-2); line-height: 1.6;">
            <li>Ouvrez <a href="https://script.google.com" target="_blank" rel="noopener">Google Apps Script</a> et cliquez sur « Nouveau projet ».</li>
            <li>Copiez l'intégralité du script situé dans le dossier du projet : <code>scripts/google-apps-script-backend.js</code>.</li>
            <li>Cliquez sur « Déployer » > « Nouveau déploiement » > Type : « Application Web ».</li>
            <li>Réglez l'accès sur : <strong>« Tout le monde » (Anyone)</strong> et exécution par <strong>« Moi »</strong>.</li>
            <li>Collez l'URL générée ci-dessus !</li>
          </ol>
        </div>
      </div>

      <!-- Onglet 5 : Exportation CSV -->
      <div v-if="adminTab === 'export'" style="background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider); padding: 1.5rem; text-align: center;">
        <h3 style="margin-top: 0; font-size: 1.2rem;">Exportation complète des données</h3>
        <p style="color: var(--vp-c-text-2); font-size: 0.92rem; max-width: 600px; margin: 0 auto 1.5rem auto;">
          Téléchargez un relevé complet au format CSV contenant la liste des devoirs déposés, les notes IA, les notes de l'enseignant et les appréciations qualitatives.
        </p>
        <button @click="exportCsv" style="padding: 12px 24px; background: #10b981; color: #fff; border: none; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer;">
          📥 Télécharger le Relevé CSV
        </button>
      </div>

      <!-- Modal de notation & correction IA -->
      <div v-if="selectedGradingFile" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 1rem;">
        <div style="background: var(--vp-c-bg); max-width: 750px; width: 100%; max-height: 90vh; overflow-y: auto; border-radius: 16px; padding: 2rem; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 1px solid var(--vp-c-divider);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 0.8rem;">
            <div>
              <span style="font-size: 0.82rem; font-weight: 700; color: #0284c7; text-transform: uppercase;">
                Notation & Correction
              </span>
              <h3 style="margin: 0.2rem 0 0 0; font-size: 1.3rem;">
                {{ selectedGradingFile.userName }} — {{ selectedGradingFile.exerciseTitle }}
              </h3>
            </div>
            <button @click="closeGradingModal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--vp-c-text-2);">✕</button>
          </div>

          <!-- Section Évaluation IA -->
          <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--vp-c-bg-soft); border-radius: 10px; border: 1px solid var(--vp-c-divider);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <h4 style="margin: 0; font-size: 1rem;">🤖 Analyse Pédagogique par IA</h4>
              <button 
                @click="triggerAiAnalysis(selectedGradingFile)" 
                :disabled="isAiAnalyzing"
                style="padding: 6px 12px; background: #0284c7; color: #fff; border: none; border-radius: 6px; font-size: 0.82rem; font-weight: 600; cursor: pointer;"
              >
                {{ isAiAnalyzing ? 'Analyse en cours...' : 'Relancer l\'analyse IA' }}
              </button>
            </div>

            <div v-if="selectedGradingFile.aiCorrection">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
                <span style="font-weight: 700; color: #0284c7; font-size: 1.2rem;">
                  Note suggérée : {{ selectedGradingFile.aiCorrection.suggestedScore }} / 20
                </span>
                <button @click="adoptAiGrade" style="padding: 4px 10px; background: rgba(2, 132, 199, 0.1); color: #0284c7; border: 1px solid #0284c7; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer;">
                  ✓ Adopter cette note
                </button>
              </div>
              <p style="margin: 0; font-size: 0.88rem; color: var(--vp-c-text-2); line-height: 1.4;">
                {{ selectedGradingFile.aiCorrection.summary }}
              </p>
            </div>
            <div v-else style="font-size: 0.85rem; color: var(--vp-c-text-2);">
              Aucune analyse IA n'a encore été générée pour ce devoir.
            </div>
          </div>

          <!-- Section Note Enseignant -->
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label style="display: block; font-weight: 700; margin-bottom: 0.4rem;">Note finale attribuée (/20) :</label>
              <input v-model="gradeInput" type="number" min="0" max="20" step="0.5" style="width: 120px; padding: 8px; border-radius: 6px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: inherit; font-size: 1.1rem; font-weight: 700;" />
            </div>

            <div>
              <label style="display: block; font-weight: 700; margin-bottom: 0.4rem;">Commentaire formatif pour l'étudiant :</label>
              <textarea v-model="feedbackInput" rows="4" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: inherit; box-sizing: border-box; font-family: inherit; font-size: 0.9rem;" placeholder="Points forts, points d'attention et pistes d'amélioration..."></textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.8rem; margin-top: 1rem;">
              <button @click="closeGradingModal" style="padding: 10px 18px; background: var(--vp-c-default-soft); border: 1px solid var(--vp-c-divider); border-radius: 8px; cursor: pointer;">
                Annuler
              </button>
              <button @click="saveGrade" style="padding: 10px 20px; background: #10b981; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
                💾 Enregistrer la note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* CLOUD SYNC BAR */
.cloud-sync-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid rgba(2, 132, 199, 0.3);
  border-radius: 12px;
  padding: 0.9rem 1.3rem;
  margin-bottom: 1.8rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.cloud-sync-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cloud-pulse-icon {
  font-size: 1.6rem;
}

.cloud-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.cloud-subtitle {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
}

.cloud-sync-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cloud-feedback-tag {
  font-size: 0.82rem;
  font-weight: 600;
  color: #16a34a;
}

.btn-sync-action {
  background: #0284c7;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sync-action:hover {
  background: #0369a1;
}

.btn-sync-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.deadline-picker-composite {
  display: flex;
  gap: 6px;
  align-items: center;
}

.input-date-clean {
  padding: 6px 8px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: inherit;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-sizing: border-box;
  min-width: 135px;
}
.input-date-clean:focus {
  border-color: #0284c7;
  outline: none;
}

.input-time-clean {
  width: 80px;
  padding: 6px 6px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: inherit;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-sizing: border-box;
}
.input-time-clean:focus {
  border-color: #0284c7;
  outline: none;
}
</style>
