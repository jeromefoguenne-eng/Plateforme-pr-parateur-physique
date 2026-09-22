<script setup>
import { ref, computed, onMounted } from 'vue'
import { userStore, OFFICIAL_EVALUATION_ITEMS, formatDeadlineDisplay, getAlarmLevelInfo, parseDeadline } from '../stores/userStore'

const enteredPin = ref('')
const isAuthenticated = ref(false)
const loginError = ref('')
const adminTab = ref('students') // 'students' | 'grading' | 'deadlines' | 'export'

const users = computed(() => userStore.users.filter(u => u.role === 'student'))
const submittedFiles = computed(() => userStore.submittedFiles)
const quizAttempts = computed(() => userStore.quizAttempts)

const selectedGradingFile = ref(null)
const gradeInput = ref(16)
const feedbackInput = ref('')
const isAiAnalyzing = ref(false)

// Échéances éditables
const deadlinesForm = ref({})

onMounted(() => {
  userStore.syncFromStorage()
  OFFICIAL_EVALUATION_ITEMS.forEach(it => {
    const d = userStore.getExerciseDeadline(it.id)
    deadlinesForm.value[it.id] = d.deadline || ''
  })
})

function checkPin() {
  if (userStore.verifyAdminPin(enteredPin.value)) {
    isAuthenticated.value = true
    loginError.value = ''
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

function saveAllDeadlines() {
  Object.keys(deadlinesForm.value).forEach(exId => {
    userStore.setExerciseDeadline(exId, deadlinesForm.value[exId])
  })
  alert('Échéances enregistrées avec succès !')
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
  <div style="max-width: 1000px; margin: 0 auto; padding: 1.5rem 0;">
    <!-- Écran de déverrouillage PIN -->
    <div v-if="!isAuthenticated" style="max-width: 450px; margin: 3rem auto; padding: 2.5rem; background: var(--vp-c-bg-soft); border-radius: 16px; border: 1px solid var(--vp-c-divider); text-align: center; box-shadow: var(--tile-shadow);">
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
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--vp-c-divider);">
        <div>
          <span style="font-size: 0.82rem; font-weight: 700; color: #0284c7; text-transform: uppercase;">
            👨‍🏫 Administration & Évaluation
          </span>
          <h2 style="margin: 0.2rem 0 0 0;">Tableau de Bord Promotion</h2>
        </div>
        <button @click="handleLogout" style="padding: 6px 14px; background: var(--vp-c-default-soft); border: 1px solid var(--vp-c-divider); border-radius: 6px; cursor: pointer;">
          🔒 Verrouiller
        </button>
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
          @click="adminTab = 'export'" 
          :style="{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--vp-c-divider)', background: adminTab === 'export' ? '#0284c7' : 'var(--vp-c-bg-soft)', color: adminTab === 'export' ? '#fff' : 'inherit', fontWeight: '600', cursor: 'pointer' }"
        >
          📊 Exportation CSV
        </button>
      </div>

      <!-- Onglet 1 : Étudiants & Avancement -->
      <div v-if="adminTab === 'students'" style="background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider); padding: 1.5rem;">
        <h3 style="margin-top: 0; font-size: 1.2rem;">Liste des étudiants inscrits</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <thead>
            <tr style="border-bottom: 2px solid var(--vp-c-divider); text-align: left;">
              <th style="padding: 10px 8px;">Nom & Prénom</th>
              <th style="padding: 10px 8px;">Email HECh</th>
              <th style="padding: 10px 8px; text-align: center;">Travaux remis</th>
              <th style="padding: 10px 8px; text-align: center;">Progression</th>
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

      <!-- Onglet 3 : Échéances -->
      <div v-if="adminTab === 'deadlines'" style="background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider); padding: 1.5rem;">
        <h3 style="margin-top: 0; font-size: 1.2rem;">Dates limites de remise des travaux</h3>
        <p style="font-size: 0.88rem; color: var(--vp-c-text-2); margin-bottom: 1.5rem;">
          Format accepté : <code>AAAA-MM-JJ HH:mm</code> ou <code>JJ/MM/AAAA à HH:mm</code>. Les alarmes de retard (Orange, Bordeaux, Rouge) s'activent automatiquement.
        </p>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div v-for="it in OFFICIAL_EVALUATION_ITEMS" :key="it.id" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem; padding: 0.8rem 1rem; background: var(--vp-c-bg); border-radius: 8px;">
            <label style="font-weight: 600; font-size: 0.92rem; flex: 1; min-width: 250px;">
              {{ it.title }}
            </label>
            <input 
              v-model="deadlinesForm[it.id]" 
              placeholder="ex: 2026-10-15 23:59" 
              style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: inherit;"
            />
          </div>
        </div>

        <button @click="saveAllDeadlines" style="margin-top: 1.5rem; padding: 10px 20px; background: #10b981; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
          💾 Enregistrer les échéances
        </button>
      </div>

      <!-- Onglet 4 : Exportation CSV -->
      <div v-if="adminTab === 'export'" style="background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider); padding: 1.5rem; text-align: center;">
        <h3 style="margin-top: 0;">Exportation officielle des notes</h3>
        <p style="color: var(--vp-c-text-2); max-width: 500px; margin: 0 auto 1.5rem auto; font-size: 0.9rem;">
          Générez un fichier CSV standard prêt à être importé dans Microsoft Excel ou transmis au secrétariat académique de la HECh.
        </p>
        <button @click="exportCsv" style="padding: 12px 24px; background: #0284c7; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
          📥 Télécharger le relevé CSV complet
        </button>
      </div>

      <!-- Modal de correction Enseignant & IA -->
      <div v-if="selectedGradingFile" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 1rem;">
        <div style="background: var(--vp-c-bg); max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; border-radius: 16px; padding: 2rem; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 1px solid var(--vp-c-divider);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 0.8rem;">
            <div>
              <span style="font-size: 0.82rem; font-weight: 700; color: #0284c7; text-transform: uppercase;">
                Correction & Évaluation
              </span>
              <h3 style="margin: 0.2rem 0 0 0;">{{ selectedGradingFile.exerciseTitle }}</h3>
              <p style="margin: 0; font-size: 0.88rem; color: var(--vp-c-text-2);">Étudiant : {{ selectedGradingFile.userName }}</p>
            </div>
            <button @click="closeGradingModal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--vp-c-text-2);">✕</button>
          </div>

          <!-- Actions d'évaluation IA -->
          <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-bottom: 1.5rem;">
            <button 
              @click="triggerAiAnalysis(selectedGradingFile)" 
              :disabled="isAiAnalyzing"
              style="padding: 8px 16px; background: #0284c7; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;"
            >
              {{ isAiAnalyzing ? 'Analyse IA en cours...' : '🤖 Lancer l\'évaluation critériée IA' }}
            </button>

            <button 
              v-if="selectedGradingFile.aiCorrection" 
              @click="adoptAiGrade" 
              style="padding: 8px 16px; background: rgba(16, 185, 129, 0.15); color: #047857; border: 1px solid #10b981; border-radius: 8px; font-weight: 600; cursor: pointer;"
            >
              ✓ Adopter la note et synthèse IA
            </button>
          </div>

          <!-- Affichage de la grille des 6 critères si analysé -->
          <div v-if="selectedGradingFile.aiCorrection" style="margin-bottom: 1.5rem; padding: 1.2rem; background: var(--vp-c-bg-soft); border-radius: 12px;">
            <h4 style="margin: 0 0 0.8rem 0;">📊 Grille critériée IA (Note suggérée : {{ selectedGradingFile.aiCorrection.suggestedScore }}/20)</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-bottom: 1rem;">
              <thead>
                <tr style="border-bottom: 1px solid var(--vp-c-divider); text-align: left;">
                  <th style="padding: 6px;">Critère</th>
                  <th style="padding: 6px; text-align: center;">Pondération</th>
                  <th style="padding: 6px; text-align: center;">Niveau</th>
                  <th style="padding: 6px; text-align: center;">Points</th>
                  <th style="padding: 6px;">Commentaire</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(crit, cIdx) in selectedGradingFile.aiCorrection.criteriaTable" :key="cIdx" style="border-bottom: 1px solid var(--vp-c-divider);">
                  <td style="padding: 6px; font-weight: 600;">{{ crit.name }}</td>
                  <td style="padding: 6px; text-align: center;">{{ crit.weightPct }} %</td>
                  <td style="padding: 6px; text-align: center;">{{ crit.level }} / 4</td>
                  <td style="padding: 6px; text-align: center; font-weight: 700; color: #0284c7;">{{ crit.score }} / {{ crit.maxScore }}</td>
                  <td style="padding: 6px; color: var(--vp-c-text-2);">{{ crit.comment }}</td>
                </tr>
              </tbody>
            </table>

            <p style="margin: 0; font-size: 0.88rem; color: var(--vp-c-text-2); font-style: italic;">
              Synthèse IA : « {{ selectedGradingFile.aiCorrection.summary }} »
            </p>
          </div>

          <!-- Saisie de la note officielle Enseignant -->
          <div style="padding: 1.2rem; background: var(--vp-c-bg-soft); border-radius: 12px;">
            <h4 style="margin: 0 0 0.8rem 0;">✍️ Note & Feedback officiels de l'enseignant</h4>
            
            <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
              <label style="font-weight: 600; font-size: 0.95rem;">Note finale (/20) :</label>
              <input 
                v-model="gradeInput" 
                type="number" 
                step="0.5" 
                min="0" 
                max="20" 
                style="width: 80px; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: inherit; font-size: 1.1rem; font-weight: 700; text-align: center;" 
              />
            </div>

            <label style="display: block; font-weight: 600; font-size: 0.95rem; margin-bottom: 0.4rem;">
              Commentaire formatif destiné à l'étudiant :
            </label>
            <textarea 
              v-model="feedbackInput" 
              rows="4" 
              style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: inherit; font-family: inherit; resize: vertical; box-sizing: border-box; margin-bottom: 1rem;"
            ></textarea>

            <div style="display: flex; justify-content: flex-end; gap: 0.8rem;">
              <button @click="closeGradingModal" style="padding: 8px 16px; background: var(--vp-c-default-soft); border: 1px solid var(--vp-c-divider); border-radius: 6px; cursor: pointer;">
                Annuler
              </button>
              <button @click="saveGrade" style="padding: 8px 20px; background: #10b981; color: #fff; border: none; border-radius: 6px; font-weight: 700; cursor: pointer;">
                💾 Enregistrer la note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
