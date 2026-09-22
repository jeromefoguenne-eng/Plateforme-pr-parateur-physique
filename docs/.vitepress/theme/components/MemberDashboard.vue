<script setup>
import { ref, computed, onMounted } from 'vue'
import { userStore, OFFICIAL_EVALUATION_ITEMS, formatDeadlineDisplay } from '../stores/userStore'

const currentUser = computed(() => userStore.currentUser)
const loginEmail = ref('')
const regFirst = ref('')
const regLast = ref('')
const regEmail = ref('')
const loginMsg = ref('')

const selectedAiModalFile = ref(null)

onMounted(() => {
  userStore.syncFromStorage()
})

function handleLogin() {
  loginMsg.value = ''
  const res = userStore.login(loginEmail.value)
  if (!res.success) {
    loginMsg.value = res.message || 'Erreur de connexion.'
  }
}

function handleRegister() {
  loginMsg.value = ''
  const res = userStore.register(regFirst.value, regLast.value, regEmail.value)
  if (!res.success) {
    loginMsg.value = res.message || 'Erreur d\'inscription.'
  }
}

function handleLogout() {
  userStore.logout()
}

const exercisesList = computed(() => {
  return OFFICIAL_EVALUATION_ITEMS.filter(item => item.category === 'exercice' || item.category === 'final')
})

const studentFiles = computed(() => {
  return userStore.getUserFiles()
})

const completedExercisesCount = computed(() => {
  if (!currentUser.value) return 0
  return exercisesList.value.filter(ex => userStore.isCompleted(ex.id)).length
})

const totalExercisesCount = computed(() => exercisesList.value.length)

const progressPercentage = computed(() => {
  if (totalExercisesCount.value === 0) return 0
  return Math.round((completedExercisesCount.value / totalExercisesCount.value) * 100)
})

const quizAttempts = computed(() => {
  if (!currentUser.value) return []
  return userStore.quizAttempts.filter(q => q.userEmail.toLowerCase() === currentUser.value.email.toLowerCase())
})

function getFileForExercise(exId) {
  return studentFiles.value.find(f => f.exerciseId === exId)
}

function getFeedbackForExercise(exId) {
  return userStore.getExerciseFeedback(exId)
}

function openAiModal(file) {
  selectedAiModalFile.value = file
}

function closeAiModal() {
  selectedAiModalFile.value = null
}
</script>

<template>
  <div style="max-width: 900px; margin: 0 auto; padding: 1.5rem 0;">
    <!-- Écran de connexion si non connecté -->
    <div v-if="!currentUser" style="padding: 2.5rem; background: var(--vp-c-bg-soft); border-radius: 16px; border: 1px solid var(--vp-c-divider); box-shadow: var(--tile-shadow);">
      <h2 style="margin-top: 0; text-align: center; color: var(--vp-c-brand-1);">
        👤 Espace Membre Étudiant
      </h2>
      <p style="text-align: center; color: var(--vp-c-text-2); margin-bottom: 2rem;">
        Identifiez-vous pour accéder à votre suivi personnalisé, retrouver vos travaux déposés et consulter vos évaluations formatives.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
        <!-- Connexion -->
        <div style="padding: 1.5rem; background: var(--vp-c-bg); border-radius: 12px; border: 1px solid var(--vp-c-divider);">
          <h3 style="margin-top: 0; font-size: 1.15rem;">Déjà inscrit ?</h3>
          <p style="font-size: 0.88rem; color: var(--vp-c-text-2);">Entrez votre adresse email institutionnelle :</p>
          <input 
            v-model="loginEmail" 
            type="email" 
            placeholder="lucas.mercier@student.hech.be" 
            style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: inherit; box-sizing: border-box; margin-bottom: 1rem;" 
          />
          <button @click="handleLogin" style="width: 100%; padding: 10px; background: var(--vp-c-brand-1); color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
            Se connecter
          </button>
        </div>

        <!-- Inscription -->
        <div style="padding: 1.5rem; background: var(--vp-c-bg); border-radius: 12px; border: 1px solid var(--vp-c-divider);">
          <h3 style="margin-top: 0; font-size: 1.15rem;">Première visite ?</h3>
          <p style="font-size: 0.88rem; color: var(--vp-c-text-2);">Créez votre profil étudiant en 30 secondes :</p>
          <div style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1rem;">
            <input v-model="regFirst" placeholder="Prénom" style="padding: 10px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: inherit;" />
            <input v-model="regLast" placeholder="Nom" style="padding: 10px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: inherit;" />
            <input v-model="regEmail" type="email" placeholder="Email institutionnel" style="padding: 10px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: inherit;" />
          </div>
          <button @click="handleRegister" style="width: 100%; padding: 10px; background: #10b981; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
            Créer mon compte
          </button>
        </div>
      </div>

      <p v-if="loginMsg" style="text-align: center; color: #ef4444; margin-top: 1.5rem; font-weight: 600;">
        {{ loginMsg }}
      </p>
    </div>

    <!-- Tableau de bord si connecté -->
    <div v-else>
      <!-- En-tête profil -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding: 1.5rem 2rem; background: var(--vp-c-bg-soft); border-radius: 16px; border: 1px solid var(--vp-c-divider); margin-bottom: 2rem;">
        <div>
          <span style="font-size: 0.82rem; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px;">
            🎓 Étudiant(e) inscrit(e)
          </span>
          <h2 style="margin: 0.2rem 0; font-size: 1.6rem;">
            {{ currentUser.firstName }} {{ currentUser.lastName }}
          </h2>
          <p style="margin: 0; color: var(--vp-c-text-2); font-size: 0.92rem;">
            {{ currentUser.email }} • Haute École Charlemagne
          </p>
        </div>
        <button @click="handleLogout" style="padding: 8px 16px; background: var(--vp-c-default-soft); border: 1px solid var(--vp-c-divider); border-radius: 8px; cursor: pointer; font-weight: 600;">
          Déconnexion
        </button>
      </div>

      <!-- Progression globale -->
      <div style="padding: 1.5rem 2rem; background: var(--vp-c-bg-soft); border-radius: 16px; border: 1px solid var(--vp-c-divider); margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
          <h3 style="margin: 0; font-size: 1.15rem;">📈 Progression dans les travaux pratiques</h3>
          <span style="font-weight: 700; font-size: 1.1rem; color: var(--vp-c-brand-1);">
            {{ completedExercisesCount }} / {{ totalExercisesCount }} remis ({{ progressPercentage }}%)
          </span>
        </div>
        <div style="width: 100%; height: 12px; background: var(--vp-c-divider); border-radius: 6px; overflow: hidden;">
          <div :style="{ width: progressPercentage + '%', height: '100%', background: 'linear-gradient(90deg, #0284c7, #10b981)', transition: 'width 0.4s ease' }"></div>
        </div>
      </div>

      <!-- Liste des travaux et évaluations -->
      <h3 style="margin: 2rem 0 1rem 0; font-size: 1.3rem;">📋 Mes Devoirs & Évaluations Critériées</h3>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div 
          v-for="ex in exercisesList" 
          :key="ex.id" 
          style="padding: 1.2rem 1.5rem; background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider);"
        >
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.8rem;">
            <div>
              <span style="font-size: 0.8rem; font-weight: 700; color: #0284c7; text-transform: uppercase;">
                {{ ex.category === 'final' ? '🏆 Mission Finale' : '🏋️‍♂️ Exercice de cours' }}
              </span>
              <h4 style="margin: 0.2rem 0 0.4rem 0; font-size: 1.1rem;">
                {{ ex.title }}
              </h4>
            </div>

            <!-- Badge statut -->
            <div>
              <span v-if="getFileForExercise(ex.id)" style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; background: #ecfdf5; color: #047857;">
                ✓ Document remis
              </span>
              <span v-else style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; background: #fefce8; color: #b45309;">
                ⏳ En attente
              </span>
            </div>
          </div>

          <!-- Détails du fichier déposé -->
          <div v-if="getFileForExercise(ex.id)" style="margin-top: 1rem; padding: 0.8rem 1rem; background: var(--vp-c-bg); border-radius: 8px; font-size: 0.9rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <span>
                📄 <strong>Fichier :</strong> {{ getFileForExercise(ex.id).formattedFileName }}
                <span style="color: var(--vp-c-text-2); font-size: 0.8rem;">({{ (getFileForExercise(ex.id).fileSize / 1024).toFixed(1) }} Ko)</span>
              </span>
              <button 
                v-if="getFileForExercise(ex.id).aiCorrection" 
                @click="openAiModal(getFileForExercise(ex.id))"
                style="padding: 5px 12px; background: rgba(2, 132, 199, 0.1); color: #0284c7; border: 1px solid #0284c7; border-radius: 6px; font-weight: 600; font-size: 0.82rem; cursor: pointer;"
              >
                🤖 Voir l'évaluation critériée IA
              </button>
            </div>

            <!-- Feedback enseignant -->
            <div v-if="getFeedbackForExercise(ex.id) && getFeedbackForExercise(ex.id).status === 'graded'" style="margin-top: 0.8rem; padding-top: 0.8rem; border-top: 1px dashed var(--vp-c-divider);">
              <span style="color: #047857; font-weight: 700;">
                Note Enseignant : {{ getFeedbackForExercise(ex.id).score }} / {{ getFeedbackForExercise(ex.id).maxScore }}
              </span>
              <p style="margin: 0.3rem 0 0 0; color: var(--vp-c-text-2);">
                « {{ getFeedbackForExercise(ex.id).feedback || 'Excellent travail.' }} »
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Évaluation IA -->
      <div v-if="selectedAiModalFile" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 1rem;">
        <div style="background: var(--vp-c-bg); max-width: 850px; width: 100%; max-height: 90vh; overflow-y: auto; border-radius: 16px; padding: 2rem; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 1px solid var(--vp-c-divider);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 0.8rem;">
            <div>
              <span style="font-size: 0.82rem; font-weight: 700; color: #0284c7; text-transform: uppercase;">
                🤖 Évaluation Pédagogique Assistée par IA
              </span>
              <h3 style="margin: 0.2rem 0 0 0; font-size: 1.3rem;">
                {{ selectedAiModalFile.exerciseTitle }}
              </h3>
            </div>
            <button @click="closeAiModal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--vp-c-text-2);">✕</button>
          </div>

          <div v-if="selectedAiModalFile.aiCorrection">
            <!-- Note globale -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; background: rgba(2, 132, 199, 0.08); border-left: 5px solid #0284c7; border-radius: 8px; margin-bottom: 1.5rem;">
              <div>
                <span style="font-size: 0.88rem; color: var(--vp-c-text-2);">Note globale estimée :</span>
                <h2 style="margin: 0; font-size: 2rem; color: #0284c7;">
                  {{ selectedAiModalFile.aiCorrection.suggestedScore }} / 20
                </h2>
              </div>
              <span style="font-size: 0.85rem; color: var(--vp-c-text-2);">
                Total brut : {{ selectedAiModalFile.aiCorrection.totalPoints100 }} / 100 pts
              </span>
            </div>

            <!-- Grille des 6 critères officiels -->
            <h4 style="margin: 1.5rem 0 0.8rem 0; font-size: 1.1rem;">📊 Grille critériée détaillée</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; margin-bottom: 1.5rem;">
              <thead>
                <tr style="border-bottom: 2px solid var(--vp-c-divider); text-align: left;">
                  <th style="padding: 8px;">Critère</th>
                  <th style="padding: 8px; text-align: center;">Pondération</th>
                  <th style="padding: 8px; text-align: center;">Niveau</th>
                  <th style="padding: 8px; text-align: center;">Points</th>
                  <th style="padding: 8px;">Commentaire d'observation</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(crit, cIdx) in selectedAiModalFile.aiCorrection.criteriaTable" 
                  :key="cIdx"
                  style="border-bottom: 1px solid var(--vp-c-divider);"
                >
                  <td style="padding: 10px 8px; font-weight: 600;">{{ crit.name }}</td>
                  <td style="padding: 10px 8px; text-align: center;">{{ crit.weightPct }} %</td>
                  <td style="padding: 10px 8px; text-align: center;">
                    <span style="padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 0.8rem; background: var(--vp-c-bg-soft);">
                      {{ crit.level }} / 4
                    </span>
                  </td>
                  <td style="padding: 10px 8px; text-align: center; font-weight: 700; color: #0284c7;">
                    {{ crit.score }} / {{ crit.maxScore }}
                  </td>
                  <td style="padding: 10px 8px; color: var(--vp-c-text-2);">{{ crit.comment }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Points maîtrisés & À améliorer -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div style="padding: 1rem; background: #ecfdf5; border-radius: 10px; border: 1px solid #a7f3d0;">
                <h5 style="margin: 0 0 0.5rem 0; color: #047857; font-size: 0.95rem;">✅ Points maîtrisés</h5>
                <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.88rem; color: #065f46;">
                  <li v-for="(str, sIdx) in selectedAiModalFile.aiCorrection.strengths" :key="sIdx">{{ str }}</li>
                </ul>
              </div>

              <div style="padding: 1rem; background: #fff7ed; border-radius: 10px; border: 1px solid #fed7aa;">
                <h5 style="margin: 0 0 0.5rem 0; color: #c2410c; font-size: 0.95rem;">⚠️ Points à améliorer</h5>
                <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.88rem; color: #9a3412;">
                  <li v-for="(imp, iIdx) in selectedAiModalFile.aiCorrection.improvements" :key="iIdx">{{ imp }}</li>
                </ul>
              </div>
            </div>

            <!-- Priorités de progression -->
            <div v-if="selectedAiModalFile.aiCorrection.nextSteps && selectedAiModalFile.aiCorrection.nextSteps.length > 0" style="padding: 1rem; background: var(--vp-c-bg-soft); border-radius: 10px; margin-bottom: 1.5rem;">
              <h5 style="margin: 0 0 0.5rem 0; font-size: 0.95rem;">🎯 Priorités de progression</h5>
              <ol style="margin: 0; padding-left: 1.2rem; font-size: 0.88rem;">
                <li v-for="(nxt, nIdx) in selectedAiModalFile.aiCorrection.nextSteps" :key="nIdx">{{ nxt }}</li>
              </ol>
            </div>

            <!-- Commentaire général -->
            <div style="padding: 1rem; background: var(--vp-c-bg-soft); border-radius: 10px;">
              <h5 style="margin: 0 0 0.4rem 0; font-size: 0.95rem;">📝 Synthèse générale</h5>
              <p style="margin: 0; font-size: 0.9rem; color: var(--vp-c-text-2); line-height: 1.5;">
                {{ selectedAiModalFile.aiCorrection.summary }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Historique des quiz passés -->
      <div v-if="quizAttempts.length > 0" style="margin-top: 3rem;">
        <h3 style="margin-bottom: 1rem; font-size: 1.3rem;">🎯 Historique de mes Quiz</h3>
        <div style="display: flex; flex-direction: column; gap: 0.8rem;">
          <div 
            v-for="q in quizAttempts" 
            :key="q.id" 
            style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem 1.2rem; background: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider);"
          >
            <div>
              <strong>{{ q.moduleTitle || q.moduleId }}</strong>
              <div style="font-size: 0.8rem; color: var(--vp-c-text-2);">Validé le {{ q.submittedAt }}</div>
            </div>
            <span style="font-weight: 700; font-size: 1rem; color: #0284c7;">
              {{ q.score }} / {{ q.totalPoints }} ({{ q.percentage }}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
