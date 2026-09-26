<script setup>
import { ref, computed, onMounted } from 'vue'
import { userStore, OFFICIAL_EVALUATION_ITEMS, ALL_QUIZ_MODULES, formatDeadlineDisplay, getAlarmLevelInfo, parseDeadline } from '../stores/userStore'

const currentUser = computed(() => userStore.currentUser)

// États d'authentification
const loginEmail = ref('')
const loginPassword = ref('')
const regFirst = ref('')
const regLast = ref('')
const regEmail = ref('')
const regPassword = ref('')
const loginMsg = ref('')
const isAuthenticating = ref(false)
const authFeedbackMessage = ref('')

// Vues d'authentification : 'login' | 'first-login' | 'forgot-password' | 'reset-code'
const authViewMode = ref('login')
const authPendingUser = ref(null)
const initialPassword = ref('')
const confirmInitialPassword = ref('')
const initialPassFeedback = ref('')

const forgotEmail = ref('')
const recoveryCode = ref('')
const newRecoveredPassword = ref('')
const confirmRecoveredPassword = ref('')
const recoverySimulatedCode = ref('')
const recoveryFeedback = ref('')

// Modal de changement de mot de passe en cours de session
const showChangePassModal = ref(false)
const oldPasswordCurrent = ref('')
const newPasswordCurrent = ref('')
const confirmPasswordCurrent = ref('')
const changePassFeedback = ref({ type: '', message: '' })

// Onglet actif du dashboard membre
const activeTab = ref('exercises') // 'exercises' | 'quizzes' | 'evaluation' | 'files'

// Dépôt de fichiers individualisé par exercice
const exerciseUploadFiles = ref({})
const exerciseUploadFeedbacks = ref({})
const exerciseUploading = ref({})

// Modal d'aperçu de l'évaluation IA
const selectedAiModalFile = ref(null)

onMounted(() => {
  userStore.syncFromStorage()
  userStore.syncWithCloud().catch(() => {})
})

const exercisesList = computed(() => {
  return OFFICIAL_EVALUATION_ITEMS.filter(item => item.category === 'exercice' || item.category === 'final')
})

const quizList = computed(() => {
  return ALL_QUIZ_MODULES
})

const studentFiles = computed(() => {
  return userStore.getUserFiles()
})

const studentEvaluation = computed(() => {
  if (!currentUser.value) return null
  return userStore.getStudentEvaluation(currentUser.value.email)
})

const studentQuizAttempts = computed(() => {
  if (!currentUser.value) return []
  return userStore.quizAttempts.filter(q => (q?.userEmail || '').toLowerCase().trim() === currentUser.value.email.toLowerCase().trim())
})

// ==========================================
// AUTHENTIFICATION & SÉCURITÉ MULTI-APPAREILS
// ==========================================

async function handleLogin() {
  loginMsg.value = ''
  const clean = loginEmail.value.trim().toLowerCase()
  if (!clean) {
    loginMsg.value = 'Veuillez saisir votre adresse email.'
    return
  }

  isAuthenticating.value = true
  authFeedbackMessage.value = 'Vérification du compte...'

  // Vérifier d'abord le statut du compte localement
  let status = userStore.checkStudentStatus(clean)
  if (!status.exists || !status.passwordSet) {
    authFeedbackMessage.value = 'Recherche en ligne de votre profil (synchronisation multi-appareils)...'
    const fetched = await userStore.findOrFetchStudent(clean, true)
    if (fetched) {
      status = userStore.checkStudentStatus(clean)
    }
  }

  isAuthenticating.value = false
  authFeedbackMessage.value = ''

  if (!status.exists) {
    loginMsg.value = "Aucun compte trouvé avec cette adresse email. Vérifiez votre saisie ou inscrivez-vous ci-dessous."
    return
  }

  // Première connexion sans mot de passe encore défini
  if (!status.passwordSet) {
    authPendingUser.value = status.user
    authViewMode.value = 'first-login'
    return
  }

  if (!loginPassword.value) {
    loginMsg.value = 'Veuillez saisir votre mot de passe personnel.'
    return
  }

  let res = userStore.loginStudentWithPassword(clean, loginPassword.value)
  if (!res.success) {
    // Si échec local, interroger le Cloud pour s'assurer que le mot de passe n'a pas été changé sur un autre appareil
    isAuthenticating.value = true
    authFeedbackMessage.value = 'Vérification distante auprès du serveur...'
    const refreshed = await userStore.findOrFetchStudent(clean, true)
    isAuthenticating.value = false
    authFeedbackMessage.value = ''
    if (refreshed) {
      res = userStore.loginStudentWithPassword(clean, loginPassword.value)
    }
  }

  if (!res.success) {
    if (res.requireInitialPassword) {
      authPendingUser.value = res.user
      authViewMode.value = 'first-login'
    } else {
      loginMsg.value = res.message || 'Mot de passe incorrect.'
    }
  } else {
    loginMsg.value = ''
    loginPassword.value = ''
    userStore.syncWithCloud().catch(() => {})
  }
}

async function handleRegister() {
  loginMsg.value = ''
  if (!regFirst.value.trim() || !regLast.value.trim() || !regEmail.value.trim()) {
    loginMsg.value = 'Tous les champs sont obligatoires.'
    return
  }
  const res = userStore.register(regFirst.value, regLast.value, regEmail.value)
  if (!res.success) {
    loginMsg.value = res.message || "Erreur lors de l'inscription."
    return
  }
  if (regPassword.value.trim()) {
    userStore.setInitialPassword(regEmail.value, regPassword.value, regPassword.value)
  }
}

function handleSetInitialPassword() {
  if (!authPendingUser.value) return
  initialPassFeedback.value = ''

  const res = userStore.setInitialPassword(
    authPendingUser.value.email,
    initialPassword.value,
    confirmInitialPassword.value
  )

  if (res.success) {
    alert("Votre mot de passe a été configuré avec succès ! Bienvenue sur votre espace.")
    authViewMode.value = 'login'
    authPendingUser.value = null
    initialPassword.value = ''
    confirmInitialPassword.value = ''
  } else {
    initialPassFeedback.value = res.message
  }
}

function handleStartForgotPassword() {
  forgotEmail.value = loginEmail.value || ''
  recoveryFeedback.value = ''
  recoverySimulatedCode.value = ''
  authViewMode.value = 'forgot-password'
}

function handleRequestRecoveryCode() {
  if (!forgotEmail.value) {
    recoveryFeedback.value = "Veuillez renseigner votre adresse email."
    return
  }
  const res = userStore.requestPasswordRecovery(forgotEmail.value)
  if (res.success) {
    recoverySimulatedCode.value = res.code
    recoveryFeedback.value = res.message
    authViewMode.value = 'reset-code'
  } else {
    recoveryFeedback.value = res.message
  }
}

function handleResetPasswordWithCode() {
  if (!forgotEmail.value || !recoveryCode.value || !newRecoveredPassword.value) {
    alert("Veuillez renseigner le code et le nouveau mot de passe.")
    return
  }
  const res = userStore.resetPasswordWithCode(
    forgotEmail.value,
    recoveryCode.value,
    newRecoveredPassword.value,
    confirmRecoveredPassword.value
  )
  if (res.success) {
    alert("Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter.")
    authViewMode.value = 'login'
    recoveryCode.value = ''
    newRecoveredPassword.value = ''
    confirmRecoveredPassword.value = ''
    recoverySimulatedCode.value = ''
  } else {
    alert(res.message)
  }
}

function handleChangePasswordInSession() {
  changePassFeedback.value = { type: '', message: '' }
  if (!currentUser.value) return

  const res = userStore.changeStudentPassword(
    currentUser.value.email,
    oldPasswordCurrent.value,
    newPasswordCurrent.value,
    confirmPasswordCurrent.value
  )

  if (res.success) {
    changePassFeedback.value = { type: 'success', message: res.message }
    setTimeout(() => {
      showChangePassModal.value = false
      oldPasswordCurrent.value = ''
      newPasswordCurrent.value = ''
      confirmPasswordCurrent.value = ''
      changePassFeedback.value = { type: '', message: '' }
    }, 2000)
  } else {
    changePassFeedback.value = { type: 'error', message: res.message }
  }
}

function handleLogout() {
  userStore.logout()
}

// ==========================================
// DÉPÔT DE FICHIERS ET GESTION DES DEVOIRS
// ==========================================

function getFileForExercise(exId) {
  return studentFiles.value.find(f => f.exerciseId === exId)
}

function getFeedbackForExercise(exId) {
  return userStore.getExerciseFeedback(exId)
}

function getExerciseDeadlineInfo(exId) {
  return userStore.getExerciseDeadline(exId)
}

function getExerciseLateAlert(exId) {
  if (getFileForExercise(exId)) return null
  const d = userStore.getExerciseDeadline(exId)
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
}

function onExerciseFileChange(event, exId) {
  if (!exerciseUploadFeedbacks.value) exerciseUploadFeedbacks.value = {}
  exerciseUploadFeedbacks.value[exId] = { type: '', message: '' }
  const file = event.target.files?.[0]
  if (file) {
    if (!exerciseUploadFiles.value) exerciseUploadFiles.value = {}
    exerciseUploadFiles.value[exId] = file
  }
}

async function handleExerciseFileUpload(exId, exTitle) {
  const file = exerciseUploadFiles.value?.[exId]
  if (!file) {
    if (!exerciseUploadFeedbacks.value) exerciseUploadFeedbacks.value = {}
    exerciseUploadFeedbacks.value[exId] = { type: 'error', message: 'Veuillez sélectionner un fichier (Excel, Word, PDF).' }
    return
  }

  if (!exerciseUploading.value) exerciseUploading.value = {}
  exerciseUploading.value[exId] = true
  exerciseUploadFeedbacks.value[exId] = { type: '', message: '' }

  try {
    const res = await userStore.uploadStudentFile(exId, exTitle, file)
    if (res.success) {
      exerciseUploadFeedbacks.value[exId] = { type: 'success', message: res.message }
      exerciseUploadFiles.value[exId] = null
      const inputEl = document.getElementById('file-input-' + exId)
      if (inputEl) inputEl.value = ''
    } else {
      exerciseUploadFeedbacks.value[exId] = { type: 'error', message: res.message }
    }
  } catch (err) {
    exerciseUploadFeedbacks.value[exId] = { type: 'error', message: 'Erreur lors du dépôt du fichier.' }
  } finally {
    exerciseUploading.value[exId] = false
  }
}

function openAiModal(file) {
  selectedAiModalFile.value = file
}

function closeAiModal() {
  selectedAiModalFile.value = null
}
</script>

<template>
  <div style="max-width: 960px; margin: 0 auto; padding: 1.5rem 0;">
    <!-- ========================================================================= -->
    <!-- ÉCRAN DE CONNEXION / INSCRIPTION SI NON CONNECTÉ                          -->
    <!-- ========================================================================= -->
    <div v-if="!currentUser" style="padding: 2.5rem; background: var(--vp-c-bg-soft); border-radius: 16px; border: 1px solid var(--vp-c-divider); box-shadow: var(--tile-shadow);">
      <h2 style="margin-top: 0; text-align: center; color: var(--vp-c-brand-1);">
        🏃 Espace Préparateur Physique
      </h2>
      <p style="text-align: center; color: var(--vp-c-text-2); margin-bottom: 2rem;">
        Identifiez-vous pour retrouver vos travaux, suivre vos échéances et consulter vos évaluations formatives (synchronisé sur tous vos appareils).
      </p>

      <!-- VUE 1 : CONNEXION STANDARD -->
      <div v-if="authViewMode === 'login'" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
        <!-- Formulaire de Connexion -->
        <div style="background: var(--vp-c-bg); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--vp-c-divider);">
          <h3 style="margin-top: 0;">Déjà inscrit ? Connexion</h3>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Email HECh ou personnel</label>
            <input 
              v-model="loginEmail" 
              type="email" 
              placeholder="ex: prepa@student.hech.be" 
              style="width: 100%; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 0.95rem;"
              @keyup.enter="handleLogin"
            />
          </div>
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <label style="font-size: 0.85rem; font-weight: 600;">Mot de passe</label>
              <a href="javascript:void(0)" @click="handleStartForgotPassword" style="font-size: 0.8rem; color: var(--vp-c-brand-1);">
                Mot de passe oublié ?
              </a>
            </div>
            <input 
              v-model="loginPassword" 
              type="password" 
              placeholder="Votre mot de passe" 
              style="width: 100%; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 0.95rem;"
              @keyup.enter="handleLogin"
            />
          </div>
          <button 
            @click="handleLogin" 
            :disabled="isAuthenticating"
            style="width: 100%; padding: 10px; background: var(--vp-c-brand-1); color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;"
          >
            {{ isAuthenticating ? 'Vérification...' : 'Se connecter →' }}
          </button>
          <div v-if="authFeedbackMessage" style="font-size: 0.85rem; color: #0284c7; margin-top: 8px; text-align: center;">
            ⏳ {{ authFeedbackMessage }}
          </div>
        </div>

        <!-- Formulaire d'Inscription -->
        <div style="background: var(--vp-c-bg); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--vp-c-divider);">
          <h3 style="margin-top: 0;">Nouveau préparateur physique ?</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Prénom</label>
              <input v-model="regFirst" type="text" placeholder="Marc" style="width: 100%; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 0.95rem;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Nom</label>
              <input v-model="regLast" type="text" placeholder="Dupont" style="width: 100%; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 0.95rem;" />
            </div>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Email</label>
            <input v-model="regEmail" type="email" placeholder="m.dupont@student.hech.be" style="width: 100%; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 0.95rem;" />
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Mot de passe personnel</label>
            <input v-model="regPassword" type="password" placeholder="Minimum 4 caractères" style="width: 100%; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 0.95rem;" />
          </div>
          <button 
            @click="handleRegister" 
            style="width: 100%; padding: 10px; background: #059669; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;"
          >
            Créer mon profil étudiant
          </button>
        </div>
      </div>

      <!-- VUE 2 : PREMIÈRE CONNEXION (DÉFINITION DU MOT DE PASSE) -->
      <div v-else-if="authViewMode === 'first-login'" style="max-width: 450px; margin: 0 auto; background: var(--vp-c-bg); padding: 2rem; border-radius: 12px; border: 1px solid var(--vp-c-divider);">
        <h3 style="margin-top: 0; color: var(--vp-c-brand-1);">🔐 Première connexion détectée</h3>
        <p style="font-size: 0.9rem; color: var(--vp-c-text-2);">
          Bonjour <strong>{{ authPendingUser?.firstName }} {{ authPendingUser?.lastName }}</strong>. Veuillez choisir votre mot de passe personnel pour protéger vos devoirs et y accéder sur tous vos appareils.
        </p>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Nouveau mot de passe</label>
          <input v-model="initialPassword" type="password" placeholder="Au moins 4 caractères" style="width: 100%; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 0.95rem;" />
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Confirmer le mot de passe</label>
          <input v-model="confirmInitialPassword" type="password" placeholder="Confirmez à l'identique" style="width: 100%; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 0.95rem;" />
        </div>
        <div v-if="initialPassFeedback" style="color: #dc2626; font-size: 0.85rem; margin-bottom: 1rem; font-weight: 600;">
          {{ initialPassFeedback }}
        </div>
        <div style="display: flex; gap: 8px;">
          <button @click="handleSetInitialPassword" style="flex: 1; padding: 10px; background: var(--vp-c-brand-1); color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
            Valider mon mot de passe →
          </button>
          <button @click="authViewMode = 'login'" style="padding: 10px 14px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 8px; cursor: pointer;">
            Annuler
          </button>
        </div>
      </div>

      <!-- VUE 3 : MOT DE PASSE OUBLIÉ -->
      <div v-else-if="authViewMode === 'forgot-password'" style="max-width: 450px; margin: 0 auto; background: var(--vp-c-bg); padding: 2rem; border-radius: 12px; border: 1px solid var(--vp-c-divider);">
        <h3 style="margin-top: 0;">🔑 Réinitialiser mon mot de passe</h3>
        <p style="font-size: 0.9rem; color: var(--vp-c-text-2);">
          Entrez votre adresse email. Un code de réinitialisation vous sera immédiatement généré.
        </p>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Email</label>
          <input v-model="forgotEmail" type="email" placeholder="prepa@student.hech.be" style="width: 100%; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 0.95rem;" />
        </div>
        <p v-if="recoveryFeedback" style="color: #dc2626; font-size: 0.85rem; font-weight: 600;">{{ recoveryFeedback }}</p>
        <div style="display: flex; gap: 8px;">
          <button @click="handleRequestRecoveryCode" style="flex: 1; padding: 10px; background: var(--vp-c-brand-1); color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
            Obtenir mon code →
          </button>
          <button @click="authViewMode = 'login'" style="padding: 10px 14px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 8px; cursor: pointer;">
            Retour
          </button>
        </div>
      </div>

      <!-- VUE 4 : SAISIE DU CODE ET NOUVEAU MOT DE PASSE -->
      <div v-else-if="authViewMode === 'reset-code'" style="max-width: 450px; margin: 0 auto; background: var(--vp-c-bg); padding: 2rem; border-radius: 12px; border: 1px solid var(--vp-c-divider);">
        <h3 style="margin-top: 0; color: #059669;">Code de vérification généré</h3>
        <div style="padding: 12px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; margin-bottom: 1rem; text-align: center;">
          <small style="color: #047857; display: block;">Votre code de sécurité à 6 chiffres :</small>
          <strong style="font-size: 1.5rem; letter-spacing: 4px; color: #065f46;">{{ recoverySimulatedCode }}</strong>
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Saisissez le code</label>
          <input v-model="recoveryCode" type="text" placeholder="6 chiffres (ou hech2026)" style="width: 100%; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 0.95rem;" />
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Nouveau mot de passe</label>
          <input v-model="newRecoveredPassword" type="password" placeholder="Au moins 4 caractères" style="width: 100%; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 0.95rem;" />
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Confirmez le nouveau mot de passe</label>
          <input v-model="confirmRecoveredPassword" type="password" placeholder="Retapez le mot de passe" style="width: 100%; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 0.95rem;" />
        </div>
        <div style="display: flex; gap: 8px;">
          <button @click="handleResetPasswordWithCode" style="flex: 1; padding: 10px; background: #059669; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
            Enregistrer et se connecter →
          </button>
          <button @click="authViewMode = 'login'" style="padding: 10px 14px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 8px; cursor: pointer;">
            Annuler
          </button>
        </div>
      </div>

      <p v-if="loginMsg" style="text-align: center; color: #dc2626; font-size: 0.9rem; margin-top: 1rem; font-weight: 600;">
        {{ loginMsg }}
      </p>
    </div>

    <!-- ========================================================================= -->
    <!-- ESPACE MEMBRE CONNECTÉ                                                    -->
    <!-- ========================================================================= -->
    <div v-else>
      <!-- HEADER ÉTUDIANT -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--vp-c-divider); flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="margin: 0; color: var(--vp-c-brand-1); display: flex; align-items: center; gap: 8px;">
            🏃 {{ currentUser.firstName }} {{ currentUser.lastName }}
            <span style="font-size: 0.8rem; background: #ecfdf5; color: #047857; padding: 2px 8px; border-radius: 12px; font-weight: 600;">
              Connecté(e)
            </span>
          </h2>
          <small style="color: var(--vp-c-text-2);">
            {{ currentUser.email }} • Master Préparateur Physique
          </small>
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button 
            @click="showChangePassModal = true" 
            style="padding: 6px 12px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;"
          >
            🔑 Mot de passe
          </button>
          <button 
            @click="handleLogout" 
            style="padding: 6px 12px; background: #ef4444; color: #fff; border: none; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <!-- KPI BANNER ÉTUDIANT -->
      <div v-if="studentEvaluation" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div style="padding: 1rem; background: var(--vp-c-bg-soft); border-radius: 10px; border: 1px solid var(--vp-c-divider); text-align: center;">
          <small style="color: var(--vp-c-text-2); display: block; font-weight: 600;">PROGRESSION GLOBALE</small>
          <span style="font-size: 1.5rem; font-weight: 800; color: #10b981;">
            {{ studentEvaluation.percentage }}%
          </span>
        </div>
        <div style="padding: 1rem; background: var(--vp-c-bg-soft); border-radius: 10px; border: 1px solid var(--vp-c-divider); text-align: center;">
          <small style="color: var(--vp-c-text-2); display: block; font-weight: 600;">NOTE COURANTE SUR 20</small>
          <span style="font-size: 1.5rem; font-weight: 800; color: var(--vp-c-brand-1);">
            {{ studentEvaluation.totalOutOf20 }} / 20
          </span>
        </div>
        <div style="padding: 1rem; background: var(--vp-c-bg-soft); border-radius: 10px; border: 1px solid var(--vp-c-divider); text-align: center;">
          <small style="color: var(--vp-c-text-2); display: block; font-weight: 600;">POINTS ACQUIS</small>
          <span style="font-size: 1.5rem; font-weight: 800;">
            {{ studentEvaluation.totalScore }} / {{ studentEvaluation.totalMax }} pts
          </span>
        </div>
        <div style="padding: 1rem; background: var(--vp-c-bg-soft); border-radius: 10px; border: 1px solid var(--vp-c-divider); text-align: center;">
          <small style="color: var(--vp-c-text-2); display: block; font-weight: 600;">STATUT ACADÉMIQUE</small>
          <span :style="{ fontSize: '1.2rem', fontWeight: '800', color: studentEvaluation.isPassing ? '#10b981' : '#ea580c' }">
            {{ studentEvaluation.isPassing ? '✓ Admis' : '⏳ En cours' }}
          </span>
        </div>
      </div>

      <!-- ONGLETS MEMBRE -->
      <div style="display: flex; gap: 8px; margin-bottom: 1.5rem; border-bottom: 2px solid var(--vp-c-divider); padding-bottom: 4px; overflow-x: auto;">
        <button 
          v-for="t in [
            { id: 'exercises', label: '📋 Exercices & Devoirs (7)' },
            { id: 'quizzes', label: '🧠 Quiz en ligne (7)' },
            { id: 'evaluation', label: '🏆 Relevé Officiel & Notes (/20)' },
            { id: 'files', label: '📁 Mes documents déposés' }
          ]" 
          :key="t.id"
          @click="activeTab = t.id"
          :style="{
            padding: '8px 14px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: activeTab === t.id ? '700' : '500',
            background: activeTab === t.id ? 'var(--vp-c-brand-1)' : 'transparent',
            color: activeTab === t.id ? '#fff' : 'inherit',
            whiteSpace: 'nowrap'
          }"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- ONGLET 1 : EXERCICES & DÉPÔTS -->
      <div v-if="activeTab === 'exercises'">
        <div style="display: grid; gap: 1.5rem;">
          <div 
            v-for="ex in exercisesList" 
            :key="ex.id"
            style="background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider); padding: 1.25rem;"
          >
            <!-- BANDEAU ÉCHÉANCE & RETARD -->
            <div 
              v-if="getExerciseDeadlineInfo(ex.id).isDefined"
              :style="{
                padding: '6px 12px',
                borderRadius: '6px',
                marginBottom: '10px',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: getExerciseLateAlert(ex.id) ? getExerciseLateAlert(ex.id).alarmInfo.bgColor : '#e0f2fe',
                color: getExerciseLateAlert(ex.id) ? getExerciseLateAlert(ex.id).alarmInfo.color : '#0369a1',
                border: '1px solid ' + (getExerciseLateAlert(ex.id) ? getExerciseLateAlert(ex.id).alarmInfo.borderColor : '#bae6fd')
              }"
            >
              <span>📅 Échéance limite : {{ getExerciseDeadlineInfo(ex.id).display }}</span>
              <span v-if="getExerciseLateAlert(ex.id)">
                {{ getExerciseLateAlert(ex.id).alarmInfo.icon }} {{ getExerciseLateAlert(ex.id).alarmInfo.badgeText }}
              </span>
            </div>

            <!-- TITRE ET PONDÉRATION -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
              <div>
                <span :style="{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  marginBottom: '4px',
                  background: ex.category === 'final' ? '#fee2e2' : '#e0e7ff',
                  color: ex.category === 'final' ? '#991b1b' : '#3730a3'
                }">
                  {{ ex.category === 'final' ? 'Mission Finale' : 'Exercice Pratique' }}
                </span>
                <h3 style="margin: 0; font-size: 1.15rem;">{{ ex.title }}</h3>
              </div>
              <span style="font-weight: 700; color: var(--vp-c-brand-1); font-size: 1rem;">
                / {{ ex.maxPoints }} pts
              </span>
            </div>

            <!-- STATUT ACTUEL & FEEDBACK ENSEIGNANT -->
            <div v-if="getFeedbackForExercise(ex.id)" style="margin-bottom: 1rem; padding: 10px 14px; background: #ecfdf5; border-radius: 8px; border: 1px solid #a7f3d0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <strong style="color: #065f46;">✍️ Évaluation de l'enseignant</strong>
                <span style="font-weight: 800; color: #047857; font-size: 1rem;">
                  Note : {{ getFeedbackForExercise(ex.id).score }}/20
                </span>
              </div>
              <p v-if="getFeedbackForExercise(ex.id).feedback" style="margin: 0; font-size: 0.9rem; color: #064e3b;">
                {{ getFeedbackForExercise(ex.id).feedback }}
              </p>
            </div>

            <!-- FICHIER DÉJÀ DÉPOSÉ -->
            <div v-if="getFileForExercise(ex.id)" style="margin-bottom: 1rem; padding: 10px 14px; background: var(--vp-c-bg); border-radius: 8px; border: 1px solid var(--vp-c-divider); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div>
                <div style="font-weight: 700; color: var(--vp-c-brand-1);">
                  ✓ Fichier remis : {{ getFileForExercise(ex.id).formattedFileName }}
                </div>
                <small style="color: var(--vp-c-text-2);">
                  Déposé le {{ getFileForExercise(ex.id).submittedAt }} • {{ Math.round(getFileForExercise(ex.id).fileSize / 1024) }} Ko
                </small>
              </div>
              <div style="display: flex; gap: 8px;">
                <button 
                  v-if="getFileForExercise(ex.id).aiCorrection"
                  @click="openAiModal(getFileForExercise(ex.id))" 
                  style="padding: 4px 10px; background: #0284c7; color: #fff; border: none; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;"
                >
                  🤖 Diagnostic IA ({{ getFileForExercise(ex.id).aiCorrection.suggestedScore }}/20)
                </button>
                <a 
                  v-if="getFileForExercise(ex.id).dataUrl" 
                  :href="getFileForExercise(ex.id).dataUrl" 
                  :download="getFileForExercise(ex.id).formattedFileName" 
                  style="padding: 4px 10px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 6px; font-size: 0.85rem; font-weight: 600; text-decoration: none; color: inherit;"
                >
                  📥 Télécharger
                </a>
              </div>
            </div>

            <!-- FORMULAIRE DE DÉPÔT / NOUVEAU DÉPÔT -->
            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              <input 
                :id="'file-input-' + ex.id"
                type="file" 
                accept=".xlsx,.docx,.pdf,.pptx,.csv" 
                @change="onExerciseFileChange($event, ex.id)"
                style="font-size: 0.85rem;"
              />
              <button 
                @click="handleExerciseFileUpload(ex.id, ex.title)"
                :disabled="exerciseUploading[ex.id]"
                style="padding: 6px 14px; background: var(--vp-c-brand-1); color: #fff; border: none; border-radius: 6px; font-size: 0.85rem; font-weight: 700; cursor: pointer;"
              >
                {{ exerciseUploading[ex.id] ? 'Dépôt en cours...' : (getFileForExercise(ex.id) ? 'Remplacer le fichier' : 'Déposer mon travail') }}
              </button>
            </div>

            <div v-if="exerciseUploadFeedbacks[ex.id]?.message" :style="{ marginTop: '8px', fontSize: '0.85rem', fontWeight: '600', color: exerciseUploadFeedbacks[ex.id].type === 'success' ? '#059669' : '#dc2626' }">
              {{ exerciseUploadFeedbacks[ex.id].message }}
            </div>
          </div>
        </div>
      </div>

      <!-- ONGLET 2 : QUIZ EN LIGNE -->
      <div v-if="activeTab === 'quizzes'">
        <div style="display: grid; gap: 10px;">
          <div 
            v-for="q in quizList" 
            :key="q.id"
            style="padding: 1rem; background: var(--vp-c-bg-soft); border-radius: 10px; border: 1px solid var(--vp-c-divider); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;"
          >
            <div>
              <div style="font-weight: 700;">{{ q.title }}</div>
              <small style="color: var(--vp-c-text-2);">Pondération officielle : {{ q.maxPoints }} points</small>
            </div>

            <div style="display: flex; align-items: center; gap: 12px;">
              <div v-if="studentQuizAttempts.some(att => att.moduleId === q.id)">
                <span style="font-weight: 800; color: #10b981; font-size: 1.1rem;">
                  {{ Math.max(...studentQuizAttempts.filter(att => att.moduleId === q.id).map(a => a.score)) }} / {{ q.maxPoints }} pts
                </span>
                <small style="display: block; color: #059669; font-weight: 600;">✓ Validé</small>
              </div>
              <span v-else style="color: #ea580c; font-size: 0.85rem; font-weight: 600;">
                ⏳ Pas encore passé
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ONGLET 3 : RELEVÉ OFFICIEL & PONDÉRATION SUR 100 POINTS / 20 -->
      <div v-if="activeTab === 'evaluation'">
        <div style="background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider); padding: 1.5rem; margin-bottom: 1.5rem;">
          <h3 style="margin-top: 0; color: var(--vp-c-brand-1);">🏆 Synthèse Officielle des Évaluations (Barème sur 100 Points / 20)</h3>
          <p style="font-size: 0.95rem; color: var(--vp-c-text-2); margin-bottom: 1rem;">
            L'évaluation du cours s'articule autour de 8 composantes pondérées représentant 100 points, automatiquement ramenées à une note finale sur 20.
          </p>

          <div style="padding: 12px 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; margin-bottom: 1.25rem; font-size: 0.9rem; color: #1e40af;">
            <strong>🤖 Note indicative de l'IA vs 👨‍🏫 Note officielle de l'enseignant :</strong>
            <p style="margin: 4px 0 0 0;">
              L'IA génère des retours formatifs et une cote indicative dès le dépôt de vos travaux afin de vous guider. <strong>Seul votre enseignant cote officiellement et valide la note définitive de vos devoirs</strong> lors de la délibération.
            </p>
          </div>

          <!-- TABLEAU COMPARATIF POUR L'ÉTUDIANT -->
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
              <thead>
                <tr style="background: var(--vp-c-bg); border-bottom: 2px solid var(--vp-c-divider); text-align: left;">
                  <th style="padding: 10px 12px; border: 1px solid var(--vp-c-divider);">Composante d'Évaluation</th>
                  <th style="padding: 10px 12px; border: 1px solid var(--vp-c-divider); text-align: center;">Pondération</th>
                  <th style="padding: 10px 12px; border: 1px solid var(--vp-c-divider); text-align: center;">Statut</th>
                  <th style="padding: 10px 12px; border: 1px solid var(--vp-c-divider); text-align: center;">🤖 Suggestion IA</th>
                  <th style="padding: 10px 12px; border: 1px solid var(--vp-c-divider); text-align: center;">👨‍🏫 Note Officielle</th>
                  <th style="padding: 10px 12px; border: 1px solid var(--vp-c-divider);">Commentaire</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="it in (studentEvaluation?.items || [])" :key="it.id" :style="{ background: it.category === 'final' ? '#fdf4ff' : 'var(--vp-c-bg)' }">
                  <td style="padding: 10px 12px; border: 1px solid var(--vp-c-divider);">
                    <strong>{{ it.title }}</strong>
                  </td>
                  <td style="padding: 10px 12px; border: 1px solid var(--vp-c-divider); text-align: center; font-weight: 700;">
                    {{ it.maxPoints }} pts ({{ it.weightPct }}%)
                  </td>
                  <td style="padding: 10px 12px; border: 1px solid var(--vp-c-divider); text-align: center;">
                    <span :style="{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      background: it.completed ? '#ecfdf5' : (it.isOverdue ? '#fee2e2' : '#f1f5f9'),
                      color: it.completed ? '#047857' : (it.isOverdue ? '#991b1b' : '#64748b')
                    }">
                      {{ it.completed ? '✓ Rendu' : (it.isOverdue ? '⚠️ En retard' : '⏳ En attente') }}
                    </span>
                  </td>
                  <td style="padding: 10px 12px; border: 1px solid var(--vp-c-divider); text-align: center; color: #0284c7; font-weight: 700;">
                    {{ it.completed ? it.aiScore + ' / ' + it.maxPoints : '—' }}
                  </td>
                  <td style="padding: 10px 12px; border: 1px solid var(--vp-c-divider); text-align: center;">
                    <strong style="font-size: 1.05rem; color: var(--vp-c-brand-1);">
                      {{ it.teacherScore }} / {{ it.maxPoints }}
                    </strong>
                  </td>
                  <td style="padding: 10px 12px; border: 1px solid var(--vp-c-divider); font-size: 0.85rem; color: var(--vp-c-text-2);">
                    {{ it.feedback || it.aiSummary || 'En attente' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- CARTOUCHE DE RÉCAPITULATIF ÉTUDIANT -->
          <div style="margin-top: 1.5rem; padding: 1.25rem; background: var(--vp-c-bg); border-radius: 10px; border: 2px solid var(--vp-c-brand-1); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--vp-c-text-2); display: block;">BILAN ACADÉMIQUE OFFICIEL</span>
              <strong style="font-size: 1.8rem; color: var(--vp-c-brand-1);">
                {{ studentEvaluation?.totalOutOf20 }} / 20
              </strong>
              <span style="font-size: 0.95rem; color: var(--vp-c-text-2); margin-left: 8px;">
                ({{ studentEvaluation?.totalScore }} / 100 points • {{ studentEvaluation?.percentage }}%)
              </span>
            </div>
            <div>
              <span style="display: inline-block; padding: 6px 14px; border-radius: 12px; font-weight: 800; font-size: 0.9rem; text-transform: uppercase; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0;">
                {{ studentEvaluation?.mention }}
              </span>
            </div>
          </div>

          <div v-if="studentEvaluation?.feedback" style="margin-top: 1rem; padding: 12px 16px; background: var(--vp-c-bg); border-radius: 8px; border: 1px solid var(--vp-c-divider);">
            <strong style="font-size: 0.9rem; color: var(--vp-c-brand-1);">💬 Synthèse & Observation générale de l'enseignant :</strong>
            <p style="margin: 6px 0 0 0; font-size: 0.95rem;">{{ studentEvaluation.feedback }}</p>
          </div>
        </div>
      </div>

      <!-- ONGLET 4 : MES DOCUMENTS DÉPOSÉS -->
      <div v-if="activeTab === 'files'">
        <div v-if="studentFiles.length === 0" style="padding: 2rem; text-align: center; color: var(--vp-c-text-2);">
          Vous n'avez pas encore déposé de documents.
        </div>
        <div v-else style="display: grid; gap: 8px;">
          <div 
            v-for="f in studentFiles" 
            :key="f.id"
            style="padding: 10px 14px; background: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider); display: flex; justify-content: space-between; align-items: center;"
          >
            <div>
              <strong>{{ f.formattedFileName }}</strong>
              <br/>
              <small style="color: var(--vp-c-text-2);">{{ f.exerciseTitle }} • Remis le {{ f.submittedAt }}</small>
            </div>
            <a 
              v-if="f.dataUrl" 
              :href="f.dataUrl" 
              :download="f.formattedFileName" 
              style="padding: 6px 12px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 6px; font-size: 0.85rem; font-weight: 600; text-decoration: none; color: inherit;"
            >
              📥 Télécharger
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL DE CHANGEMENT DE MOT DE PASSE EN SESSION                            -->
    <!-- ========================================================================= -->
    <div v-if="showChangePassModal" style="position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div style="background: var(--vp-c-bg); max-width: 440px; width: 100%; border-radius: 12px; padding: 1.5rem; border: 1px solid var(--vp-c-divider); box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
        <h3 style="margin-top: 0;">🔑 Modifier mon mot de passe</h3>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Ancien mot de passe</label>
          <input v-model="oldPasswordCurrent" type="password" style="width: 100%; padding: 8px 12px; border: 1px solid var(--vp-c-divider); border-radius: 6px;" />
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Nouveau mot de passe</label>
          <input v-model="newPasswordCurrent" type="password" placeholder="Au moins 4 caractères" style="width: 100%; padding: 8px 12px; border: 1px solid var(--vp-c-divider); border-radius: 6px;" />
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Confirmer le mot de passe</label>
          <input v-model="confirmPasswordCurrent" type="password" style="width: 100%; padding: 8px 12px; border: 1px solid var(--vp-c-divider); border-radius: 6px;" />
        </div>
        <p v-if="changePassFeedback.message" :style="{ color: changePassFeedback.type === 'success' ? '#059669' : '#dc2626', fontSize: '0.85rem', fontWeight: '600' }">
          {{ changePassFeedback.message }}
        </p>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button @click="showChangePassModal = false" style="padding: 8px 14px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 6px; cursor: pointer;">
            Annuler
          </button>
          <button @click="handleChangePasswordInSession" style="padding: 8px 14px; background: var(--vp-c-brand-1); color: #fff; border: none; border-radius: 6px; font-weight: 700; cursor: pointer;">
            Enregistrer
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL DÉTAILS ÉVALUATION IA (GRILLE CRITÉRIÉE SPORT SCIENCES)             -->
    <!-- ========================================================================= -->
    <div v-if="selectedAiModalFile && selectedAiModalFile.aiCorrection" style="position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div style="background: var(--vp-c-bg); max-width: 720px; width: 100%; max-height: 85vh; overflow-y: auto; border-radius: 12px; padding: 1.5rem; border: 1px solid var(--vp-c-divider); box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 0.5rem;">
          <h3 style="margin: 0; color: #0284c7; display: flex; align-items: center; gap: 8px;">
            🤖 Diagnostic Pédagogique IA
            <span style="font-size: 0.85rem; background: #e0f2fe; padding: 2px 8px; border-radius: 12px;">
              {{ selectedAiModalFile.aiCorrection.suggestedScore }}/20
            </span>
          </h3>
          <button @click="closeAiModal" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;">✕</button>
        </div>

        <p style="font-size: 0.95rem; line-height: 1.5; color: var(--vp-c-text-1);">
          {{ selectedAiModalFile.aiCorrection.summary }}
        </p>

        <!-- Tableau des 6 critères -->
        <div style="overflow-x: auto; margin-bottom: 1rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
            <thead>
              <tr style="background: var(--vp-c-bg-soft); border-bottom: 2px solid var(--vp-c-divider); text-align: left;">
                <th style="padding: 8px;">Critère officiel</th>
                <th style="padding: 8px; text-align: center;">Poids</th>
                <th style="padding: 8px; text-align: center;">Points</th>
                <th style="padding: 8px;">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in selectedAiModalFile.aiCorrection.criteriaTable" :key="c.name" style="border-bottom: 1px solid var(--vp-c-divider);">
                <td style="padding: 8px; font-weight: 600;">{{ c.name }}</td>
                <td style="padding: 8px; text-align: center;">{{ c.weightPct }}%</td>
                <td style="padding: 8px; text-align: center; font-weight: 700; color: #0284c7;">{{ c.score }}/{{ c.maxScore }}</td>
                <td style="padding: 8px; color: var(--vp-c-text-2);">{{ c.comment }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Points forts et axes d'amélioration -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px;">
            <strong style="color: #166534; display: block; margin-bottom: 6px;">💪 Points forts</strong>
            <ul style="margin: 0; padding-left: 18px; font-size: 0.85rem; color: #14532d;">
              <li v-for="s in selectedAiModalFile.aiCorrection.strengths" :key="s">{{ s }}</li>
            </ul>
          </div>
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 10px;">
            <strong style="color: #92400e; display: block; margin-bottom: 6px;">🎯 Pistes de progression</strong>
            <ul style="margin: 0; padding-left: 18px; font-size: 0.85rem; color: #78350f;">
              <li v-for="imp in selectedAiModalFile.aiCorrection.improvements" :key="imp">{{ imp }}</li>
            </ul>
          </div>
        </div>

        <button @click="closeAiModal" style="width: 100%; padding: 10px; background: var(--vp-c-brand-1); color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>
