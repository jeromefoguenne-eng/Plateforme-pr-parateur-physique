import { reactive, computed, ref } from 'vue'
import { cloudSync, cloudSyncState, DEFAULT_CLOUD_URL } from './cloudSync'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'student' | 'admin'
  registeredAt: string
  status?: 'active' | 'archived'
  password?: string
  passwordSet?: boolean
  recoveryCode?: string
}

export interface QuizAnswer {
  questionId: string
  questionText: string
  type: 'qcm' | 'open'
  userAnswer: string | number
  correctAnswer?: string | number
  isCorrect?: boolean
  points: number
  maxPoints: number
  explanation?: string
  openFeedback?: string
}

export interface QuizAttempt {
  id: string
  userId?: string
  userName?: string
  userEmail: string
  moduleId: string
  moduleTitle: string
  score: number
  totalPoints: number
  percentage: number
  answers?: QuizAnswer[]
  submittedAt: string
  evaluationType?: 'diagnostic' | 'formative'
}

export interface Submission {
  id: string
  userId?: string
  userName?: string
  userEmail: string
  exerciseId: string
  exerciseTitle: string
  answer: string
  submittedAt: string
}

export interface AiCriterion {
  name: string
  weightPct: number // 15, 25, 20, 20, 15, 5
  level: number // 0, 1, 2, 3, 4
  levelLabel: string // "Niveau 4 – Maîtrise excellente", etc.
  score: number
  maxScore: number
  comment: string
}

export interface AiCorrection {
  status: 'analyzed' | 'pending' | 'error'
  suggestedScore: number // Note finale sur 20
  maxScore: number // 20
  totalPoints100: number // Note brute sur 100
  criteriaTable: AiCriterion[]
  summary: string // Synthèse générale
  strengths: string[] // Points forts
  improvements: string[] // Axes d'amélioration
  nextSteps: string[] // Priorités de progression
  detailedFeedback?: string
  correctedAt: string
  modelUsed: string
}

export interface TeacherGrade {
  score: number
  maxScore: number
  feedback: string
  gradedAt: string
  status: 'graded' | 'pending'
}

export interface ExerciseTeacherFeedback {
  userEmail: string
  userName?: string
  exerciseId: string
  exerciseTitle?: string
  score?: number
  maxScore: number
  feedback: string
  gradedAt: string
  status: 'graded' | 'pending'
}

export interface SubmittedFile {
  id: string
  userId: string
  userName: string
  userEmail: string
  exerciseId: string
  exerciseTitle: string
  originalFileName: string
  formattedFileName: string // ex: DUPONT_Marc_Exercice-01_2026-09-22.xlsx
  fileType: string
  fileSize: number
  dataUrl?: string
  driveUrl?: string
  submittedAt: string
  driveSynced?: boolean
  aiCorrection?: AiCorrection
  teacherGrade?: TeacherGrade
}

const STORAGE_KEY_USERS = 'hech_prepa_users'
const STORAGE_KEY_CURRENT = 'hech_prepa_current_user'
const STORAGE_KEY_PROGRESS = 'hech_prepa_progress'
const STORAGE_KEY_SUBMISSIONS = 'hech_prepa_submissions'
const STORAGE_KEY_ADMIN_PIN = 'hech_prepa_admin_pin'
const STORAGE_KEY_ADMIN_ATTEMPTS = 'hech_prepa_admin_attempts'
const STORAGE_KEY_ADMIN_LOCKOUT = 'hech_prepa_admin_lockout'
const STORAGE_KEY_FILES = 'hech_prepa_files'
const STORAGE_KEY_WEBHOOK = 'hech_prepa_drive_webhook'
const STORAGE_KEY_QUIZZES = 'hech_prepa_quiz_attempts'
const STORAGE_KEY_EXERCISE_FEEDBACKS = 'hech_prepa_exercise_feedbacks'
const STORAGE_KEY_DEADLINES = 'hech_prepa_deadlines_v1'
export const STORAGE_KEY_DELETED_USERS = 'hech_prepa_deleted_users'
export const STORAGE_KEY_EVALUATIONS = 'hech_prepa_evaluations'

export const deadlinesTrigger = ref(0)

export interface EvaluationItemDefinition {
  id: string
  title: string
  shortTitle: string
  maxPoints: number
  weightPct: number
  category: 'quiz' | 'exercice' | 'final'
  googleDriveLink?: string
}

export interface QuizModuleDefinition {
  id: string
  title: string
  shortTitle: string
  maxPoints: number
}

export const ALL_QUIZ_MODULES: QuizModuleDefinition[] = [
  { id: 'quiz-00', title: "Quiz 00 : Introduction & Révolution des données", shortTitle: "Quiz 00 (Intro)", maxPoints: 10 },
  { id: 'quiz-01', title: "Quiz 01 : Capteurs & Données de terrain", shortTitle: "Quiz 01 (Capteurs)", maxPoints: 10 },
  { id: 'quiz-02', title: "Quiz 02 : Formats & Logiciels dédiés", shortTitle: "Quiz 02 (Logiciels)", maxPoints: 10 },
  { id: 'quiz-03', title: "Quiz 03 : Structuration & Tableur Excel", shortTitle: "Quiz 03 (Excel)", maxPoints: 10 },
  { id: 'quiz-04', title: "Quiz 04 : Outils de collecte personnalisés", shortTitle: "Quiz 04 (Outils)", maxPoints: 10 },
  { id: 'quiz-05', title: "Quiz 05 : Recherche scientifique & Décision", shortTitle: "Quiz 05 (Science)", maxPoints: 10 },
  { id: 'quiz-06', title: "Quiz 06 : Intelligence Artificielle & Agents", shortTitle: "Quiz 06 (IA)", maxPoints: 10 }
]

export const GOOGLE_DRIVE_EXERCISES_FOLDER_ID = '1fRbYhPZKrhIB6uzQJonDgNdrqUdiuLOt'
export const GOOGLE_DRIVE_EXERCISES_FOLDER_URL = 'https://drive.google.com/drive/folders/1fRbYhPZKrhIB6uzQJonDgNdrqUdiuLOt'
export const GOOGLE_DRIVE_STUDENT_UPLOADS_FOLDER_ID = '1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH'
export const GOOGLE_DRIVE_STUDENT_UPLOADS_FOLDER_URL = 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH'

export interface ExerciseCompanionFile {
  name: string
  fileBase: string
  icon: string
  downloadName?: string
}

export interface ExerciseDocInfo {
  id: string
  docId: string
  fileBase: string
  title: string
  shortTitle: string
  description: string
  weightPct: number
  points: number
  category: 'exercice' | 'final'
  companionFiles?: ExerciseCompanionFile[]
}

export const EXERCISE_DOCS_DATA: Record<string, ExerciseDocInfo> = {
  'exercice-01': {
    id: 'exercice-01',
    docId: '1VoW7J4Yh-NfICyTeCALni0_bgQG0ITes',
    fileBase: 'Exercice-01.docx',
    title: 'Exercice 01 — Quel capteur choisir ?',
    shortTitle: 'Ex 01 (Capteurs)',
    description: "À partir de 10 études de cas professionnelles (football, sprint, rugby, CMJ basket, musculation, cyclisme, nutrition, variabilité cardiaque...), sélectionnez l'outil de mesure le plus pertinent pour recueillir la donnée utile, justifiez votre choix et indiquez les limites potentielles.",
    weightPct: 10,
    points: 10,
    category: 'exercice'
  },
  'exercice-02a': {
    id: 'exercice-02a',
    docId: '',
    fileBase: 'Exercice-02a.docx',
    title: 'Exercice 02.a — Extraction Power Query & Monitoring Nutritionnel (Natation)',
    shortTitle: 'Ex 02.a (Power Query)',
    description: "Importer et nettoyer un export hebdomadaire de suivi nutritionnel d'une équipe de 8 nageurs de haut niveau avec l'outil Power Query d'Excel : typage des colonnes, calcul des ratios relatifs au poids corporel (g/kg/j), règles d'alertes conditionnelles et diagnostic décisionnel pour le staff d'entraînement (prévention RED-S, glycogène, hydratation).",
    weightPct: 5,
    points: 5,
    category: 'exercice',
    companionFiles: [
      { name: 'Données brutes de nutrition (.xlsx)', fileBase: 'Exercice 02a - Donnees brutes nutrition natation.xlsx', icon: '🏊‍♂️', downloadName: 'Exercice-02a-Donnees-Brutes-Nutrition-Natation.xlsx' },
      { name: 'Consignes de l\'exercice (.docx)', fileBase: 'Exercice-02a.docx', icon: '📄', downloadName: 'Exercice-02a-Consignes.docx' },
      { name: 'Tutoriel pas-à-pas (.docx)', fileBase: 'Exercice-02a-Tutoriel.docx', icon: '📘', downloadName: 'Exercice-02a-Tutoriel.docx' }
    ]
  },
  'exercice-02': {
    id: 'exercice-02',
    docId: '1BjJKttNRbCntatiEF2yeM7G01dt0_aAq',
    fileBase: 'Exercice-02.docx',
    title: 'Exercice 02.b — Quel outil pour quelle situation ?',
    shortTitle: 'Ex 02.b (Logiciels)',
    description: "Pour chacun des 10 cas décisionnels proposés, identifiez les données requises, sélectionnez l'application spécialisée la plus adaptée (Nolio, WKO5, Kinovea, TrainingPeaks, Excel, Intervals.icu, MyJumpLab, MySprint...), proposez une alternative et justifiez les limites de votre choix.",
    weightPct: 5,
    points: 5,
    category: 'exercice'
  },
  'exercice-03': {
    id: 'exercice-03',
    docId: '1XPGvFM1bagfFYJdGzwa062F5yGtYIHW0',
    fileBase: 'Exercice-03.docx',
    title: 'Exercice 03 — De la donnée brute au tableau de bord Excel',
    shortTitle: 'Ex 03 (Structuration)',
    description: "Nettoyer un jeu de données réelles U18 (détection d'anomalies, formats), automatiser les calculs de charge (Durée × RPE), construire 3 tableaux croisés dynamiques, 3 graphiques et concevoir un tableau de bord décisionnel synthétique pour le staff.",
    weightPct: 10,
    points: 10,
    category: 'exercice',
    companionFiles: [
      { name: 'Données brutes U18 (.xlsx)', fileBase: 'Exercice 03 - Donnees brutes U18.xlsx', icon: '📈', downloadName: 'Exercice-03-Donnees-Brutes-U18.xlsx' },
      { name: 'Tutoriel pas-à-pas (.docx)', fileBase: 'Exercice-03-Tutoriel.docx', icon: '📘', downloadName: 'Exercice-03-Tutoriel.docx' },
      { name: 'Modèle attendu U18 (.xlsx)', fileBase: 'Exercice 03 - Production attendue.xlsx', icon: '📊', downloadName: 'Exercice-03-Production-Attendue.xlsx' }
    ]
  },
  'exercice-04': {
    id: 'exercice-04',
    docId: '142nATrt_U63k22rUvviCtAM-6lDGzwP7',
    fileBase: 'Exercice-04.docx',
    title: 'Exercice 04 — Concevoir ses propres outils numériques de suivi',
    shortTitle: 'Ex 04 (Outils Excel)',
    description: "Conception de 4 outils complets pour le préparateur physique : suivi de récupération (Hooper), quantification de charge interne smartphone (RPE), carnet numérique d'entraînement et batterie de tests physiques automatisée.",
    weightPct: 10,
    points: 10,
    category: 'exercice',
    companionFiles: [
      { name: 'Données brutes de l\'exercice (.xlsx)', fileBase: 'Exercice 04 - Donnees brutes.xlsx', icon: '📈', downloadName: 'Exercice-04-Donnees-Brutes.xlsx' },
      { name: 'Tutoriel pas-à-pas (.docx)', fileBase: 'Exercice-04-Tutoriel.docx', icon: '📘', downloadName: 'Exercice-04-Tutoriel.docx' },
      { name: 'Modèle attendu - Outils de suivi (.xlsx)', fileBase: 'Exercice 04 - Production attendue.xlsx', icon: '📊', downloadName: 'Exercice-04-Production-Attendue.xlsx' }
    ]
  },
  'exercice-05': {
    id: 'exercice-05',
    docId: '1gZaNazzuep1Y965zZ9PJRTD13DGU1W5S',
    fileBase: 'Exercice-05.docx',
    title: 'Exercice 05 — De la donnée à la décision (analyse & ajustement)',
    shortTitle: 'Ex 05 (Décision)',
    description: "Étude du cas réel de Thomas : analyse des charges et de la fatigue, formulation de questions scientifiques, constitution d'un corpus sur NotebookLM, validation critique des sources et décision d'ajustement argumentée.",
    weightPct: 10,
    points: 10,
    category: 'exercice',
    companionFiles: [
      { name: 'Données de suivi de Thomas (.xlsx)', fileBase: 'Exercice 05 - Donnees de suivi Thomas.xlsx', icon: '📈', downloadName: 'Exercice-05-Donnees-Suivi-Thomas.xlsx' }
    ]
  },
  'exercice-06': {
    id: 'exercice-06',
    docId: '1ln-MM2329wbYlZ9PnG9I173Yz7IGXqvn',
    fileBase: 'Exercice-06.docx',
    title: 'Exercice 06 — Créer une application et un agent IA pour le préparateur',
    shortTitle: 'Ex 06 (Application IA)',
    description: "Création guidée d'un prototype d'application et d'un agent IA d'assistance au staff avec Antigravity : distinction stricte Données → Analyse → Recommandation, intégration de calculs et tests de cohérence.",
    weightPct: 10,
    points: 10,
    category: 'exercice'
  },
  'exercice-07': {
    id: 'exercice-07',
    docId: '16JPuDWgZtbV9iDg3gokRc8RzGM1iq5J-',
    fileBase: 'Exercice-07.docx',
    title: 'Exercice 07 — Mission finale : Modèle de lutte contre le surentraînement en football',
    shortTitle: 'Ex 07 (Anti-Surentraînement)',
    description: "Conception et implémentation d'un modèle décisionnel et algorithmique pour lutter contre le surentraînement dans une équipe de football (20 joueurs, 6 semaines) : croisement de télémétrie GPS, fréquence cardiaque, RPE de Foster, score Hooper et tests CMJ, cockpit décisionnel pour le staff et prototype mobile.",
    weightPct: 30,
    points: 30,
    category: 'final',
    companionFiles: [
      { name: 'Données fictives de football (.xlsx)', fileBase: 'donnees_exercice_final_outils_informatiques.xlsx', icon: '⚽', downloadName: 'donnees_exercice_final_outils_informatiques.xlsx' },
      { name: 'Tutoriel pas-à-pas (.docx)', fileBase: 'Exercice-07-Tutoriel.docx', icon: '📘', downloadName: 'Exercice-07-Tutoriel.docx' },
      { name: 'Modèle attendu - Cockpit staff (.xlsx)', fileBase: 'Exercice 07 - Production attendue.xlsx', icon: '📊', downloadName: 'Exercice-07-Production-Attendue.xlsx' }
    ]
  }
}

export const OFFICIAL_EVALUATION_ITEMS: EvaluationItemDefinition[] = [
  { id: 'quiz', title: "Quiz de la plateforme (Moyenne des 7 quiz)", shortTitle: "Quiz (10%)", maxPoints: 10, weightPct: 10, category: 'quiz' },
  { id: 'exercice-01', title: "Exercice 01 : Quel capteur choisir ? (10 situations)", shortTitle: "Ex 01 (Capteurs)", maxPoints: 10, weightPct: 10, category: 'exercice', googleDriveLink: "https://docs.google.com/document/d/1VoW7J4Yh-NfICyTeCALni0_bgQG0ITes/preview" },
  { id: 'exercice-02a', title: "Exercice 02.a : Extraction Power Query & Nutrition (Natation)", shortTitle: "Ex 02.a (Power Query)", maxPoints: 5, weightPct: 5, category: 'exercice' },
  { id: 'exercice-02', title: "Exercice 02.b : Quel outil pour quelle situation ? (10 cas)", shortTitle: "Ex 02.b (Logiciels)", maxPoints: 5, weightPct: 5, category: 'exercice', googleDriveLink: "https://docs.google.com/document/d/1BjJKttNRbCntatiEF2yeM7G01dt0_aAq/preview" },
  { id: 'exercice-03', title: "Exercice 03 : Excel - Collecte et structuration de données", shortTitle: "Ex 03 (Structuration)", maxPoints: 10, weightPct: 10, category: 'exercice', googleDriveLink: "https://docs.google.com/document/d/1XPGvFM1bagfFYJdGzwa062F5yGtYIHW0/preview" },
  { id: 'exercice-04', title: "Exercice 04 : Excel - Créer ses propres outils de suivi", shortTitle: "Ex 04 (Outils Excel)", maxPoints: 10, weightPct: 10, category: 'exercice', googleDriveLink: "https://docs.google.com/document/d/142nATrt_U63k22rUvviCtAM-6lDGzwP7/preview" },
  { id: 'exercice-05', title: "Exercice 05 : De la donnée à la décision (analyse & ajustement)", shortTitle: "Ex 05 (Décision)", maxPoints: 10, weightPct: 10, category: 'exercice', googleDriveLink: "https://docs.google.com/document/d/1gZaNazzuep1Y965zZ9PJRTD13DGU1W5S/preview" },
  { id: 'exercice-06', title: "Exercice 06 : Créer une application IA et un agent", shortTitle: "Ex 06 (Application IA)", maxPoints: 10, weightPct: 10, category: 'exercice', googleDriveLink: "https://docs.google.com/document/d/1ln-MM2329wbYlZ9PnG9I173Yz7IGXqvn/preview" },
  { id: 'exercice-07', title: "Exercice 07 : Modèle de lutte contre le surentraînement en football", shortTitle: "Ex 07 (Anti-Surentraînement)", maxPoints: 30, weightPct: 30, category: 'final', googleDriveLink: "https://docs.google.com/document/d/16JPuDWgZtbV9iDg3gokRc8RzGM1iq5J-/preview" }
]

export interface EvaluationRecord {
  userEmail: string
  quizScore?: number
  itemsScores?: Record<string, number>
  itemsFeedbacks?: Record<string, string>
  teacherFeedback?: string
  lastGradedAt?: string
}

export type AlarmLevel = 'none' | 'recent' | 'orange' | 'bordeaux' | 'red'

/**
 * Parse de manière robuste toute date d'échéance :
 * - Format FR / Européen : JJ/MM/AAAA, JJ/MM/AAAA HH:mm, JJ/MM/AAAA à HH:mm, JJ-MM-AAAA
 * - Format ISO : YYYY-MM-DD, YYYY-MM-DDTHH:mm, YYYY-MM-DD HH:mm
 */
export function parseDeadline(dtStr: string | undefined | null): Date | null {
  if (!dtStr || typeof dtStr !== 'string' || !dtStr.trim()) return null
  const clean = dtStr.trim()

  // 1. Format européen / belge : JJ/MM/AAAA ou JJ/MM/AA ou JJ-MM-AAAA
  const frMatch = clean.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})(?:(?:\s+|[T\s]+à\s+)(\d{1,2})(?::(\d{1,2}))?)?/)
  if (frMatch) {
    const day = parseInt(frMatch[1], 10)
    const month = parseInt(frMatch[2], 10) - 1
    let year = parseInt(frMatch[3], 10)
    if (year < 100) year += 2000
    const hours = frMatch[4] ? parseInt(frMatch[4], 10) : 23
    const minutes = frMatch[5] ? parseInt(frMatch[5], 10) : 59
    const d = new Date(year, month, day, hours, minutes, 0)
    if (!isNaN(d.getTime())) return d
  }

  // 2. Format standard ISO : YYYY-MM-DD ou YY-MM-DD ou YYYY-MM-DDTHH:mm
  const isoMatch = clean.match(/^(\d{2,4})[\/\-](\d{1,2})[\/\-](\d{1,2})(?:[T\s]+(\d{1,2})(?::(\d{1,2}))?)?/)
  if (isoMatch) {
    let year = parseInt(isoMatch[1], 10)
    if (year < 100) year += 2000
    const month = parseInt(isoMatch[2], 10) - 1
    const day = parseInt(isoMatch[3], 10)
    const hours = isoMatch[4] ? parseInt(isoMatch[4], 10) : 23
    const minutes = isoMatch[5] ? parseInt(isoMatch[5], 10) : 59
    const d = new Date(year, month, day, hours, minutes, 0)
    if (!isNaN(d.getTime())) return d
  }

  // 3. Repli standard
  const fallback = new Date(clean.replace(' ', 'T'))
  return isNaN(fallback.getTime()) ? null : fallback
}

export function formatDeadlineDisplay(dtStr: any): string {
  if (!dtStr || typeof dtStr !== 'string' || !dtStr.trim()) return 'Non fixée'
  const d = parseDeadline(dtStr)
  if (!d) return String(dtStr)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} à ${hours}h${minutes}`
}

export function getAlarmLevelInfo(daysOverdue: number): {
  level: AlarmLevel
  color: string
  bgColor: string
  borderColor: string
  label: string
  icon: string
  badgeText: string
} {
  if (isNaN(daysOverdue) || daysOverdue < 0) {
    return {
      level: 'none',
      color: '#10b981',
      bgColor: '#ecfdf5',
      borderColor: '#a7f3d0',
      label: 'Dans les délais',
      icon: '✅',
      badgeText: 'Dans les temps'
    }
  }
  if (daysOverdue < 7) {
    return {
      level: 'recent',
      color: '#eab308',
      bgColor: '#fefce8',
      borderColor: '#fef08a',
      label: 'Retard récent (< 1 semaine)',
      icon: '⏳',
      badgeText: `Retard (${daysOverdue} j)`
    }
  }
  if (daysOverdue < 14) {
    return {
      level: 'orange',
      color: '#ea580c',
      bgColor: '#fff7ed',
      borderColor: '#fdba74',
      label: 'Alarme Orange (> 1 semaine de retard)',
      icon: '🟠',
      badgeText: `🟠 Alarme Orange (+${Math.floor(daysOverdue / 7)} sem, ${daysOverdue} j)`
    }
  }
  if (daysOverdue < 30) {
    return {
      level: 'bordeaux',
      color: '#881337',
      bgColor: '#fff1f2',
      borderColor: '#fecdd3',
      label: 'Alarme Bordeaux (> 2 semaines de retard)',
      icon: '🍷',
      badgeText: `🍷 Alarme Bordeaux (+${Math.floor(daysOverdue / 7)} sem, ${daysOverdue} j)`
    }
  }
  return {
    level: 'red',
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fca5a5',
    label: 'Alarme Rouge Critique (> 1 mois de retard)',
    icon: '🔴',
    badgeText: `🔴 Alarme Rouge (> 1 mois, ${daysOverdue} j)`
  }
}

// Nettoyage et désinfection des entrées utilisateurs (Anti-XSS & Anti-Injection)
export function sanitizeText(input: string, maxLength = 10000): string {
  if (!input || typeof input !== 'string') return ''
  let clean = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
  clean = clean.replace(/\bon\w+\s*=\s*(['"]).*?\1/gi, '')
  clean = clean.replace(/\bon\w+\s*=\s*[^>\s]+/gi, '')
  clean = clean.replace(/(javascript|vbscript|data\s*:\s*text\/html)\s*:/gi, 'blocked:')
  if (clean.length > maxLength) {
    clean = clean.substring(0, maxLength)
  }
  return clean.trim()
}

export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return ''
  return email
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9._%+-@]/g, '')
    .substring(0, 150)
}

export function sanitizeFileName(name: string): string {
  if (!name || typeof name !== 'string') return 'document.xlsx'
  return name
    .replace(/[\/\\\?\%\*\:\|\"\<\>\0]/g, '_')
    .replace(/\.\./g, '_')
    .trim()
    .substring(0, 120)
}

// Hachage SHA-256 natif synchrone
export function sha256Sync(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount))
  }
  const mathPow = Math.pow
  const maxWord = mathPow(2, 32)
  let lengthProperty = 'length'
  let i = 0, j = 0
  let result = ''
  const words: number[] = []
  const asciiBitLength = ascii.length * 8
  const hash: number[] = []
  const k: number[] = []
  let primeCounter = 0
  const isComposite: Record<number, boolean> = {}

  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = true
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0
    }
  }

  words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32))
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength

  for (i = 0; i < words.length; i += 16) {
    const w = words.slice(i, i + 16)
    const oldHash = hash.slice(0)
    for (j = 0; j < 64; j++) {
      const w15 = w[j - 15], w2 = w[j - 2]
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)
      w[j] = j < 16 ? (w[j] | 0) : ((w[j - 16] + s0 + w[j - 7] + s1) | 0)

      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6])
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2])
      const s0_2 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)
      const s1_2 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)
      const temp1 = hash[7] + s1_2 + ch + k[j] + w[j]
      const temp2 = s0_2 + maj

      hash[7] = hash[6]
      hash[6] = hash[5]
      hash[5] = hash[4]
      hash[4] = (hash[3] + temp1) | 0
      hash[3] = hash[2]
      hash[2] = hash[1]
      hash[1] = hash[0]
      hash[0] = (temp1 + temp2) | 0
    }
    for (j = 0; j < 8; j++) {
      hash[j] = (hash[j] + oldHash[j]) | 0
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255
      result += (b < 16 ? '0' : '') + b.toString(16)
    }
  }
  return result
}

function normalizeName(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

export function normalizeTextForAi(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function formatFileName(lastName: string, firstName: string, exerciseTitle: string, originalName: string): string {
  const normLast = normalizeName(lastName).toUpperCase()
  const normFirst = normalizeName(firstName).charAt(0).toUpperCase() + normalizeName(firstName).slice(1).toLowerCase()
  const normEx = normalizeName(exerciseTitle).substring(0, 30)
  const ext = originalName.includes('.') ? originalName.split('.').pop() : 'xlsx'
  const dateStr = new Date().toISOString().substring(0, 10)
  return `${normLast}_${normFirst}_${normEx}_${dateStr}.${ext}`
}

function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(`Erreur d'écriture dans localStorage pour la clé ${key}:`, e)
  }
}

// Données réelles des préparateurs physiques inscrits pour la classe 2026
export const INITIAL_REAL_USERS: User[] = [
  {
    id: 'user-prepa-01',
    firstName: 'Maxim',
    lastName: 'Legentil',
    email: 'maxim.legentil@student.hech.be',
    role: 'student',
    registeredAt: '2026-09-15 09:00',
    status: 'active',
    passwordSet: false
  },
  {
    id: 'user-prepa-02',
    firstName: 'Emma',
    lastName: 'Lemaire',
    email: 'emma.lemaire@student.hech.be',
    role: 'student',
    registeredAt: '2026-09-15 09:00',
    status: 'active',
    passwordSet: false
  },
  {
    id: 'user-prepa-03',
    firstName: 'Antoine',
    lastName: 'Daltin',
    email: 'antoine.daltin@student.hech.be',
    role: 'student',
    registeredAt: '2026-09-15 09:00',
    status: 'active',
    passwordSet: false
  },
  {
    id: 'user-prepa-04',
    firstName: 'Matteo',
    lastName: 'Manno',
    email: 'matteo.manno@student.hech.be',
    role: 'student',
    registeredAt: '2026-09-15 09:00',
    status: 'active',
    passwordSet: false
  },
  {
    id: 'user-prepa-05',
    firstName: 'Achile',
    lastName: 'Capitaine',
    email: 'achile.capitaine@student.hech.be',
    role: 'student',
    registeredAt: '2026-09-15 09:00',
    status: 'active',
    passwordSet: false
  }
]

const DEFAULT_USERS: User[] = INITIAL_REAL_USERS

/**
 * Recherche intelligente d'un étudiant par email, matricule, alias ou nom complet
 */
export function findUserByQuery(query: string, users: User[] = state.users): User | undefined {
  if (!query || typeof query !== 'string') return undefined
  const q = query.trim().toLowerCase()
  if (!q) return undefined

  // 1. Correspondance exacte par email
  let found = users.find(u => (u?.email || '').trim().toLowerCase() === q)
  if (found) return found

  // 2. Recherche par alias d'email enregistrés
  found = users.find(u => {
    if ((u as any)?.aliases && Array.isArray((u as any).aliases)) {
      return (u as any).aliases.some((a: string) => (a || '').trim().toLowerCase() === q)
    }
    return false
  })
  if (found) return found

  // 3. Email au format prenom.nom@... ou nom.prenom@...
  const emailPrefixMatch = q.match(/^([a-z0-9à-öø-ÿ\-]+)\.([a-z0-9à-öø-ÿ\-]+)@/)
  if (emailPrefixMatch) {
    const p1 = normalizeTextForAi(emailPrefixMatch[1])
    const p2 = normalizeTextForAi(emailPrefixMatch[2])
    found = users.find(u => {
      const fn = normalizeTextForAi(u.firstName || '')
      const ln = normalizeTextForAi(u.lastName || '')
      return (fn === p1 && ln === p2) || (fn === p2 && ln === p1)
    })
    if (found) return found
  }

  // 4. Matricule étudiant (ex: e161029 ou 161029)
  const matClean = q.replace(/^e/, '').replace(/@.*$/, '')
  if (matClean.length >= 5 && /^\d+$/.test(matClean)) {
    found = users.find(u => {
      const uEmail = (u?.email || '').toLowerCase()
      return uEmail.includes(matClean)
    })
    if (found) return found
  }

  // 5. Nom complet "Prénom Nom" ou "Nom Prénom"
  const qNorm = normalizeTextForAi(q)
  found = users.find(u => {
    const fn = normalizeTextForAi(u.firstName || '')
    const ln = normalizeTextForAi(u.lastName || '')
    return `${fn} ${ln}` === qNorm || `${ln} ${fn}` === qNorm
  })
  if (found) return found

  return undefined
}

const state = reactive({
  users: [] as User[],
  currentUser: null as User | null,
  progress: {} as Record<string, string[]>,
  submissions: [] as Submission[],
  submittedFiles: [] as SubmittedFile[],
  quizAttempts: [] as QuizAttempt[],
  exerciseFeedbacks: [] as ExerciseTeacherFeedback[],
  deadlines: {} as Record<string, any>,
  evaluations: {} as Record<string, any>,
  deletedUsers: [] as string[],
  adminPinHash: '546e8e7d7e5fa8e5a531213806ba7fa4067c4890ee40442649f4f64147b39deb', // nech2026
  driveWebhook: DEFAULT_CLOUD_URL
})

export interface ExerciseRubricConfig {
  title: string
  expectedDeliverable: string
  coreTopics: string[]
  keySituations: string[]
  requiresLimits: boolean
  minExpectedWords: number
}

export const EXERCISE_RUBRICS: Record<string, ExerciseRubricConfig> = {
  'exercice-01': {
    title: "Exercice 01 — Quel capteur choisir ?",
    expectedDeliverable: "10 études de cas professionnelles avec sélection de capteurs, justifications et limites de mesure.",
    coreTopics: ['gps', 'gnss', 'accelerometre', 'cellule', 'photoelectrique', 'puissance', 'filiere', 'vbt', 'encodeur', 'lineaire', 'cardiofrequencemetre', 'hrv', 'variabilite', 'cardiaque', 'rpe', 'cmj', 'sprint', 'vitesse', 'plateforme', 'force', 'capteur', 'inertiel', 'imu', 'charge', 'foster', 'borg', 'rmssd'],
    keySituations: ['football', 'sprint', 'rugby', 'basket', 'musculation', 'cyclisme', 'nutrition', 'sommeil', 'recuperation', 'demi-fond'],
    requiresLimits: true,
    minExpectedWords: 250
  },
  'exercice-02a': {
    title: "Exercice 02.a — Extraction Power Query & Monitoring Nutritionnel (Natation)",
    expectedDeliverable: "Requête Power Query active avec typage, colonnes relatives (Glucides_g_kg, Proteines_g_kg), règle d'alerte et analyse décisionnelle des risques (RED-S, glycogène, hydratation).",
    coreTopics: ['power query', 'requete', 'excel', 'nutrition', 'natation', 'glucides', 'proteines', 'lipides', 'g/kg', 'calories', 'hydratation', 'rpe', 'red-s', 'glycogene', 'recuperation', 'staff'],
    keySituations: ['power query', 'nutrition', 'glucides', 'proteines', 'hydratation', 'natation'],
    requiresLimits: false,
    minExpectedWords: 150
  },
  'exercice-02': {
    title: "Exercice 02.b — Quel outil pour quelle situation ?",
    expectedDeliverable: "10 cas décisionnels avec sélection de logiciel adapté (Nolio, WKO5, Kinovea, TrainingPeaks...), alternative et limites.",
    coreTopics: ['excel', 'strava', 'garmin', 'nolio', 'trainingpeaks', 'intervals', 'wko5', 'kinovea', 'myjumplab', 'mysprint', 'myfitnesspal', 'csv', 'fit', 'tcx', 'gpx', 'charge', 'puissance', 'video', 'force-vitesse'],
    keySituations: ['puissance', 'cinematique', 'video', 'detente', 'force-vitesse', 'endurance', 'planification', 'charge', 'nutrition'],
    requiresLimits: true,
    minExpectedWords: 250
  },
  'exercice-03': {
    title: "Exercice 03 — Données brutes au tableau de bord Excel U18",
    expectedDeliverable: "Nettoyage de données U18, calculs de charge (Foster : Durée × RPE), 3 TCD, 3 graphiques et dashboard synthétique.",
    coreTopics: ['u18', 'rpe', 'foster', 'duree', 'charge', 'tcd', 'croise dynamique', 'graphique', 'dashboard', 'tableau de bord', 'monotonie', 'contrainte', 'seance', 'semaine', 'joueur', 'nettoyage'],
    keySituations: ['u18', 'charge', 'semaine', 'rpe', 'tcd', 'graphique'],
    requiresLimits: false,
    minExpectedWords: 150
  },
  'exercice-04': {
    title: "Exercice 04 — Concevoir ses propres outils numériques de suivi",
    expectedDeliverable: "Conception de 4 outils sous tableur : suivi Hooper, RPE Foster, carnet d'entraînement et batterie de tests physiques automatisée.",
    coreTopics: ['hooper', 'sommeil', 'stress', 'fatigue', 'courbature', 'rpe', 'foster', 'carnet', 'batterie', 'test', 'vma', 'cmj', 'sprint', 'formule', 'si', 'recherche', 'validation', 'conditionnelle', 'alerte'],
    keySituations: ['hooper', 'foster', 'carnet', 'batterie'],
    requiresLimits: false,
    minExpectedWords: 200
  },
  'exercice-05': {
    title: "Exercice 05 — De la donnée à la décision : analyser et ajuster un entraînement",
    expectedDeliverable: "Analyse du cas Thomas, questions scientifiques, corpus NotebookLM, validation critique et plan d'ajustement de charge argumenté.",
    coreTopics: ['thomas', 'acwr', 'aigu', 'chronique', 'charge', 'fatigue', 'surmenage', 'notebooklm', 'corpus', 'scientifique', 'peer-reviewed', 'ajustement', 'decharge', 'tapering', 'decision', 'puissance', 'vitesse'],
    keySituations: ['thomas', 'acwr', 'fatigue', 'ajustement', 'notebooklm'],
    requiresLimits: true,
    minExpectedWords: 250
  },
  'exercice-06': {
    title: "Exercice 06 — Créer une application et un agent IA pour le préparateur physique",
    expectedDeliverable: "Prototype d'application avec agent IA sous Antigravity : prompt système, distinction stricte Données/Analyse/Recommandation, tests de cohérence.",
    coreTopics: ['antigravity', 'agent', 'ia', 'intelligence artificielle', 'prompt', 'system', 'donnees', 'analyse', 'recommandation', 'decision', 'prototype', 'coherence', 'dashboard', 'interface'],
    keySituations: ['agent', 'prompt', 'donnees', 'analyse', 'recommandation'],
    requiresLimits: true,
    minExpectedWords: 200
  },
  'exercice-07': {
    title: "Exercice 07 — Mission finale : Modèle de lutte contre le surentraînement en football",
    expectedDeliverable: "Modèle algorithmique anti-surentraînement sur une équipe de football (20 joueurs, 6 semaines) : GPS, FC, RPE, Hooper, CMJ, Cockpit staff et prototype mobile.",
    coreTopics: ['football', 'surentrainement', 'overtraining', 'gps', 'acwr', 'hsr', 'sprint', 'deceleration', 'acceleration', 'hooper', 'sommeil', 'rpe', 'foster', 'cmj', 'cockpit', 'dashboard', 'staff', 'entraineur', 'decouplage', 'derive', 'tapering', 'koulibaly', 'claes', 'mobile'],
    keySituations: ['surentrainement', 'gps', 'acwr', 'hooper', 'cockpit', 'mobile'],
    requiresLimits: true,
    minExpectedWords: 350
  }
}

export const GENERIC_SPORT_TERMS = [
  'sport', 'athlete', 'entrainement', 'preparateur', 'physique', 'performance', 
  'charge', 'seance', 'physiologique', 'biomecanique', 'musculaire', 'recuperation', 
  'vitesse', 'puissance', 'force', 'cardio', 'frequence', 'coeur', 'fatigue', 
  'joueur', 'staff', 'terrain', 'mesure', 'capteur', 'donnees', 'cardiaque'
]

export async function extractTextFromFile(file: File): Promise<string> {
  const name = (file.name || '').toLowerCase()
  try {
    if (name.endsWith('.txt') || name.endsWith('.csv')) {
      return await file.text()
    }
    if (name.endsWith('.docx')) {
      try {
        const mammothModule = await import('mammoth/mammoth.browser.js')
        const mammoth = mammothModule.default || mammothModule
        const buffer = await file.arrayBuffer()
        const res = await mammoth.extractRawText({ arrayBuffer: buffer })
        return res.value || ''
      } catch (e) {
        console.warn('Erreur lecture mammoth docx:', e)
      }
    }
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      try {
        const XLSX = await import('xlsx')
        const buffer = await file.arrayBuffer()
        const wb = XLSX.read(buffer, { type: 'array' })
        let fullCsv = ''
        wb.SheetNames.forEach(sheetName => {
          const sheet = wb.Sheets[sheetName]
          fullCsv += `\n--- Feuille: ${sheetName} ---\n`
          fullCsv += XLSX.utils.sheet_to_csv(sheet)
        })
        return fullCsv
      } catch (e) {
        console.warn('Erreur lecture xlsx:', e)
      }
    }
  } catch (err) {
    console.warn("Erreur d'extraction de texte:", err)
  }
  return ''
}

export async function extractTextFromDataUrl(dataUrl: string, fileName: string): Promise<string> {
  if (!dataUrl) return ''
  try {
    const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
    const binaryStr = atob(base64)
    const len = binaryStr.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i)
    }
    const lower = (fileName || '').toLowerCase()
    if (lower.endsWith('.txt') || lower.endsWith('.csv')) {
      return new TextDecoder('utf-8').decode(bytes)
    }
    if (lower.endsWith('.docx')) {
      try {
        const mammothModule = await import('mammoth/mammoth.browser.js')
        const mammoth = mammothModule.default || mammothModule
        const res = await mammoth.extractRawText({ arrayBuffer: bytes.buffer })
        return res.value || ''
      } catch (e) {
        console.warn('Erreur lecture mammoth depuis base64:', e)
      }
    }
    if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
      try {
        const XLSX = await import('xlsx')
        const wb = XLSX.read(bytes.buffer, { type: 'array' })
        let fullCsv = ''
        wb.SheetNames.forEach(sheetName => {
          const sheet = wb.Sheets[sheetName]
          fullCsv += `\n--- Feuille: ${sheetName} ---\n`
          fullCsv += XLSX.utils.sheet_to_csv(sheet)
        })
        return fullCsv
      } catch (e) {
        console.warn('Erreur lecture xlsx depuis base64:', e)
      }
    }
  } catch (err) {
    console.warn('Erreur décodage base64 pour texte:', err)
  }
  return ''
}

export function generateCriteriaBasedAiCorrection(file: SubmittedFile, extractedText: string = '', userNotes: string = ''): AiCorrection {
  const rubric = EXERCISE_RUBRICS[file.exerciseId] || EXERCISE_RUBRICS['exercice-01']
  const fullText = `${file.originalFileName || ''} ${file.formattedFileName || ''} ${userNotes || ''} ${extractedText || ''}`.toLowerCase()
  
  const words = fullText.match(/[a-zà-ÿ0-9_-]+/g) || []
  const wordCount = words.length

  const matchedCore = rubric.coreTopics.filter(t => fullText.includes(t))
  const matchedSituations = rubric.keySituations.filter(s => fullText.includes(s))
  const matchedGeneric = GENERIC_SPORT_TERMS.filter(g => fullText.includes(g))

  const coreRatio = matchedCore.length / Math.max(1, rubric.coreTopics.length)
  const situationRatio = matchedSituations.length / Math.max(1, rubric.keySituations.length)

  const hasLimits = /limite|biais|inconvenient|imprecision|derivation|estimation|fiabilite|validite|artefact|deriver/i.test(fullText)
  const hasJustifications = /parce que|justification|permet de|en raison|car|objectif|protocole|afin de|pour mesurer/i.test(fullText)

  const isEmptyOrTrivial = (file.fileSize < 80 && wordCount < 15) || wordCount < 10
  // DÉTECTION OBJECTIVE DE HORS-SUJET :
  // Si le document ne contient aucun des concepts techniques de l'exercice et quasiment aucun terme du champ sportif
  const isOffTopic = (matchedCore.length <= 1 && matchedSituations.length === 0 && matchedGeneric.length <= 2) || isEmptyOrTrivial

  const criteriaTable: AiCriterion[] = []

  // 1. CRITÈRE 1 – COMPRÉHENSION ET RESPECT DE LA CONSIGNE (15 %)
  let c1_level = 4
  let c1_score = 14.2
  let c1_label = "Niveau 4 – Maîtrise excellente"
  let c1_comment = `Consigne parfaitement comprise et respectée : les situations athlétiques et livrables sont traités avec rigueur et contextualisation précise.`

  if (isOffTopic) {
    c1_level = isEmptyOrTrivial ? 0 : 1
    c1_score = isEmptyOrTrivial ? 0.0 : 1.5
    c1_label = isEmptyOrTrivial ? "Niveau 0 – Non évaluable / Absent" : "Niveau 1 – Maîtrise insuffisante (Hors-Sujet)"
    c1_comment = `HORS-SUJET : Le document remis ne correspond absolument pas à la consigne de l'exercice (${rubric.title}). Aucun des livrables attendus n'a été produit.`
  } else if (situationRatio < 0.35 || wordCount < 60) {
    c1_level = 1
    c1_score = 5.0 + Math.min(2.0, situationRatio * 5)
    c1_label = "Niveau 1 – Maîtrise insuffisante"
    c1_comment = `Consigne très partiellement comprise : seulement ${matchedSituations.length} situation(s) ou élément(s) abordé(s) sur ${rubric.keySituations.length} attendus. Volume rédactionnel (${wordCount} mots) insuffisant.`
  } else if (situationRatio < 0.65 || wordCount < rubric.minExpectedWords * 0.6) {
    c1_level = 2
    c1_score = 8.5 + (situationRatio - 0.35) * 6.0
    c1_label = "Niveau 2 – Maîtrise partielle"
    c1_comment = `Consigne comprise mais partiellement traitée : ${matchedSituations.length}/${rubric.keySituations.length} cas traités. Plusieurs livrables manquent de développement.`
  } else if (situationRatio < 0.85 || (rubric.requiresLimits && !hasLimits)) {
    c1_level = 3
    c1_score = 11.0 + (situationRatio - 0.65) * 8.0
    c1_label = "Niveau 3 – Maîtrise satisfaisante"
    c1_comment = `Consigne bien respectée : la quasi-totalité des situations professionnelles (${matchedSituations.length}/${rubric.keySituations.length}) sont traitées avec cohérence.`
  } else {
    c1_level = 4
    c1_score = Math.min(15.0, 13.5 + situationRatio * 1.5)
    c1_label = "Niveau 4 – Maîtrise excellente"
    c1_comment = `Excellente maîtrise de la consigne : l'ensemble des ${matchedSituations.length} situations professionnelles sont explorées et contextualisées.`
  }
  c1_score = Number(c1_score.toFixed(1))

  criteriaTable.push({
    name: "Critère 1 – Compréhension et respect de la consigne",
    weightPct: 15,
    level: c1_level,
    levelLabel: c1_label,
    score: c1_score,
    maxScore: 15,
    comment: c1_comment
  })

  // 2. CRITÈRE 2 – EXACTITUDE DES CONTENUS (25 %)
  let c2_level = 4
  let c2_score = 23.5
  let c2_label = "Niveau 4 – Maîtrise excellente"
  let c2_comment = `Excellente exactitude scientifique : distinction rigoureuse des grandeurs physiques, métriques physiologiques parfaitement ciblées.`

  if (isOffTopic) {
    c2_level = isEmptyOrTrivial ? 0 : 1
    c2_score = isEmptyOrTrivial ? 0.0 : 2.5
    c2_label = isEmptyOrTrivial ? "Niveau 0 – Non évaluable / Absent" : "Niveau 1 – Maîtrise insuffisante"
    c2_comment = `Contenus inadaptés : aucun concept scientifique ou technologique lié à la préparation physique n'est mobilisé.`
  } else if (coreRatio < 0.30) {
    c2_level = 1
    c2_score = 8.0 + coreRatio * 10
    c2_label = "Niveau 1 – Maîtrise insuffisante"
    c2_comment = `Contenus très restreints (${matchedCore.length} concept(s) clé(s) identifié(s)). Risque important d'amalgames conceptuels.`
  } else if (coreRatio < 0.55) {
    c2_level = 2
    c2_score = 13.5 + (coreRatio - 0.30) * 14
    c2_label = "Niveau 2 – Maîtrise partielle"
    c2_comment = `Notions de base présentes (${matchedCore.length} concepts identifiés), mais plusieurs principes physiologiques ou métrologiques manquent de précision.`
  } else if (coreRatio < 0.80) {
    c2_level = 3
    c2_score = 18.5 + (coreRatio - 0.55) * 16
    c2_label = "Niveau 3 – Maîtrise satisfaisante"
    c2_comment = `Bonne exactitude scientifique (${matchedCore.length} concepts mobilisés avec justesse). Vocabulaire de préparation physique bien maîtrisé.`
  } else {
    c2_level = 4
    c2_score = Math.min(25.0, 22.5 + (coreRatio - 0.80) * 10)
    c2_label = "Niveau 4 – Maîtrise excellente"
    c2_comment = `Richesse terminologique et exactitude remarquable : ${matchedCore.length} concepts clés mobilisés avec rigueur académique.`
  }
  c2_score = Number(c2_score.toFixed(1))

  criteriaTable.push({
    name: "Critère 2 – Exactitude des contenus",
    weightPct: 25,
    level: c2_level,
    levelLabel: c2_label,
    score: c2_score,
    maxScore: 25,
    comment: c2_comment
  })

  // 3. CRITÈRE 3 – MAÎTRISE DE LA MÉTHODE (20 %)
  let c3_level = 4
  let c3_score = 18.5
  let c3_label = "Niveau 4 – Maîtrise excellente"
  let c3_comment = `Démarche exemplaire : raisonnement méthodique complet (besoin athlétique -> variable -> outil -> protocole -> limites).`

  if (isOffTopic) {
    c3_level = isEmptyOrTrivial ? 0 : 1
    c3_score = isEmptyOrTrivial ? 0.0 : 1.5
    c3_label = isEmptyOrTrivial ? "Niveau 0 – Non évaluable / Absent" : "Niveau 1 – Maîtrise insuffisante"
    c3_comment = `Démarche méthodologique absente ou non applicable à la problématique sportive demandée.`
  } else if (!hasJustifications || wordCount < 80) {
    c3_level = 1
    c3_score = 6.0 + (wordCount > 50 ? 2.0 : 0.5)
    c3_label = "Niveau 1 – Maîtrise insuffisante"
    c3_comment = `Démarche embryonnaire : juxtaposition de réponses sans explicitation de la chaîne de décision méthodique.`
  } else if (rubric.requiresLimits && !hasLimits) {
    c3_level = 2
    c3_score = 11.0 + (situationRatio > 0.5 ? 2.0 : 0.5)
    c3_label = "Niveau 2 – Maîtrise partielle"
    c3_comment = `Démarche cohérente mais incomplète : les choix sont posés mais les étapes de validation et l'examen critique des limites font défaut.`
  } else if (situationRatio < 0.85) {
    c3_level = 3
    c3_score = 14.5 + (situationRatio - 0.5) * 5.0
    c3_label = "Niveau 3 – Maîtrise satisfaisante"
    c3_comment = `Bonne démarche de terrain : progression logique et structurée sur la quasi-totalité des situations analysées.`
  } else {
    c3_level = 4
    c3_score = Math.min(20.0, 17.5 + (hasLimits ? 1.5 : 0.5))
    c3_label = "Niveau 4 – Maîtrise excellente"
    c3_comment = `Excellente maîtrise méthodologique : démarche scientifique éprouvée, justifications étayées et recul professionnel.`
  }
  c3_score = Number(c3_score.toFixed(1))

  criteriaTable.push({
    name: "Critère 3 – Maîtrise de la méthode",
    weightPct: 20,
    level: c3_level,
    levelLabel: c3_label,
    score: c3_score,
    maxScore: 20,
    comment: c3_comment
  })

  // 4. CRITÈRE 4 – MAÎTRISE TECHNIQUE ET NUMÉRIQUE (20 %)
  let c4_level = 4
  let c4_score = 18.5
  let c4_label = "Niveau 4 – Maîtrise excellente"
  let c4_comment = `Maîtrise technique pointue : prise en compte des fréquences d'échantillonnage, protocoles de mesure et automatisation logicielle.`

  if (isOffTopic) {
    c4_level = isEmptyOrTrivial ? 0 : 1
    c4_score = isEmptyOrTrivial ? 0.0 : 1.0
    c4_label = isEmptyOrTrivial ? "Niveau 0 – Non évaluable / Absent" : "Niveau 1 – Maîtrise insuffisante"
    c4_comment = `Aucun outil numérique ni dispositif technique pertinent n'est exploité.`
  } else if (coreRatio < 0.35) {
    c4_level = 1
    c4_score = 6.0 + coreRatio * 8.0
    c4_label = "Niveau 1 – Maîtrise insuffisante"
    c4_comment = `Maîtrise technique insuffisante : outils inadaptés aux contraintes de terrain ou fonctionnalités clés non exploitées.`
  } else if (coreRatio < 0.65) {
    c4_level = 2
    c4_score = 11.5 + (coreRatio - 0.35) * 10.0
    c4_label = "Niveau 2 – Maîtrise partielle"
    c4_comment = `Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation.`
  } else if (rubric.requiresLimits && !hasLimits) {
    c4_level = 3
    c4_score = 15.0 + (coreRatio > 0.7 ? 1.5 : 0.5)
    c4_label = "Niveau 3 – Maîtrise satisfaisante"
    c4_comment = `Bonne appropriation technique des capteurs et des logiciels de traitement sportif.`
  } else {
    c4_level = 4
    c4_score = Math.min(20.0, 17.5 + (coreRatio - 0.65) * 5.0)
    c4_label = "Niveau 4 – Maîtrise excellente"
    c4_comment = `Maîtrise technologique remarquable : précision sur les fréquences d'acquisition, les protocoles et les outils de traitement.`
  }
  c4_score = Number(c4_score.toFixed(1))

  criteriaTable.push({
    name: "Critère 4 – Maîtrise technique et numérique",
    weightPct: 20,
    level: c4_level,
    levelLabel: c4_label,
    score: c4_score,
    maxScore: 20,
    comment: c4_comment
  })

  // 5. CRITÈRE 5 – ANALYSE, INTERPRÉTATION ET JUSTIFICATION (15 %)
  let c5_level = 4
  let c5_score = 14.0
  let c5_label = "Niveau 4 – Maîtrise excellente"
  let c5_comment = `Analyse critique remarquable : distinction nette entre corrélation et causalité, limites de terrain et interprétation sans dérive déterministe.`

  if (isOffTopic) {
    c5_level = isEmptyOrTrivial ? 0 : 1
    c5_score = isEmptyOrTrivial ? 0.0 : 1.0
    c5_label = isEmptyOrTrivial ? "Niveau 0 – Non évaluable / Absent" : "Niveau 1 – Maîtrise insuffisante"
    c5_comment = `Aucune analyse critique ni justification athlétique observable.`
  } else if (!hasJustifications) {
    c5_level = 1
    c5_score = 4.5 + (wordCount > 60 ? 1.5 : 0.5)
    c5_label = "Niveau 1 – Maîtrise insuffisante"
    c5_comment = `Absence d'argumentation : préconisations affirmées sans justification physiologique ni recul critique.`
  } else if (rubric.requiresLimits && !hasLimits) {
    c5_level = 2
    c5_score = 8.5 + (hasJustifications ? 1.5 : 0.5)
    c5_label = "Niveau 2 – Maîtrise partielle"
    c5_comment = `Justification présente mais unilatérale : les biais de mesure, contraintes écologiques et limites du matériel ne sont pas interrogés.`
  } else if (situationRatio < 0.85) {
    c5_level = 3
    c5_score = 11.5 + (situationRatio - 0.5) * 4.0
    c5_label = "Niveau 3 – Maîtrise satisfaisante"
    c5_comment = `Bonne capacité d'analyse et recul critique manifeste sur la plupart des situations étudiées.`
  } else {
    c5_level = 4
    c5_score = Math.min(15.0, 13.5 + (hasLimits ? 1.0 : 0.0))
    c5_label = "Niveau 4 – Maîtrise excellente"
    c5_comment = `Lucidité critique exemplaire : distinction claire entre mesure brute, estimation dérivée et décision humaine concertée.`
  }
  c5_score = Number(c5_score.toFixed(1))

  criteriaTable.push({
    name: "Critère 5 – Analyse, interprétation et justification",
    weightPct: 15,
    level: c5_level,
    levelLabel: c5_label,
    score: c5_score,
    maxScore: 15,
    comment: c5_comment
  })

  // 6. CRITÈRE 6 – QUALITÉ ET CLARTÉ DE LA PRODUCTION (5 %)
  let c6_level = 4
  let c6_score = 4.7
  let c6_label = "Niveau 4 – Maîtrise excellente"
  let c6_comment = `Présentation exemplaire, structuration professionnelle, clarté optimale pour un staff technique.`

  if (isEmptyOrTrivial) {
    c6_level = 0
    c6_score = 0.0
    c6_label = "Niveau 0 – Non évaluable / Absent"
    c6_comment = `Fichier vide ou inexploitable.`
  } else if (isOffTopic) {
    c6_level = 1
    c6_score = 1.0
    c6_label = "Niveau 1 – Maîtrise insuffisante"
    c6_comment = `Document structuré en soi mais totalement non avenu dans le cadre de ce cours.`
  } else if (wordCount < 60) {
    c6_level = 2
    c6_score = 2.2
    c6_label = "Niveau 2 – Maîtrise partielle"
    c6_comment = `Présentation minimale (${wordCount} mots), manque de mise en forme et de structuration visuelle.`
  } else if (wordCount < rubric.minExpectedWords) {
    c6_level = 3
    c6_score = 3.8
    c6_label = "Niveau 3 – Maîtrise satisfaisante"
    c6_comment = `Bonne lisibilité globale, document clair, soigné et bien organisé.`
  } else {
    c6_level = 4
    c6_score = 4.8
    c6_label = "Niveau 4 – Maîtrise excellente"
    c6_comment = `Structure professionnelle soignée, hiérarchie visuelle irréprochable prête pour transmission au staff.`
  }
  c6_score = Number(c6_score.toFixed(1))

  criteriaTable.push({
    name: "Critère 6 – Qualité et clarté de la production",
    weightPct: 5,
    level: c6_level,
    levelLabel: c6_label,
    score: c6_score,
    maxScore: 5,
    comment: c6_comment
  })

  const totalPoints100 = criteriaTable.reduce((acc, c) => acc + c.score, 0)
  const suggestedScore = Number(((totalPoints100 / 100) * 20).toFixed(1))

  let summary = ''
  let strengths: string[] = []
  let improvements: string[] = []
  let nextSteps: string[] = []

  if (isOffTopic) {
    summary = `⚠️ ALERTE HORS-SUJET : Le document déposé ("${file.originalFileName || 'fichier'}") ne correspond pas aux objectifs de ${rubric.title}. Aucun concept de préparation physique, de mesure ou de données sportives n'a pu être validé. La note attribuée (${suggestedScore}/20) reflète l'absence de livrable conforme aux consignes de terrain.`
    strengths = [
      "Le fichier a été correctement transmis via la plateforme (aspect technique du dépôt validé)."
    ]
    improvements = [
      `Vérifier impérativement le sujet de l'exercice avant le dépôt : le travail doit porter sur ${rubric.title}.`,
      `Produire le livrable attendu : ${rubric.expectedDeliverable}`,
      "Consulter les consignes officielles et le document modèle sur la plateforme avant de déposer à nouveau."
    ]
    nextSteps = [
      "Télécharger le modèle de travail officiel (.docx ou Google Docs).",
      "Compléter les cas d'application du cours en mobilisant les notions du syllabus.",
      "Déposer à nouveau le fichier complété pour une nouvelle analyse formative."
    ]
  } else if (suggestedScore < 10) {
    summary = `Production encore insuffisante pour ${rubric.title} (note indicative : ${suggestedScore}/20). Le travail déposé est trop succinct ou trop partiel pour attester des compétences professionnelles visées. Plusieurs situations majeures ou justifications font défaut.`
    strengths = [
      `${matchedSituations.length} situation(s) ou thématique(s) sportive(s) identifiée(s).`,
      `Présence de ${matchedCore.length} notion(s) technique(s) liée(s) aux données sportives.`,
      "Volonté d'aborder les outils informatiques de préparation physique."
    ]
    improvements = [
      `Compléter l'ensemble des ${rubric.keySituations.length} situations professionnelles demandées dans la consigne.`,
      "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
      "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
    ]
    nextSteps = [
      "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
      "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
      "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
    ]
  } else if (suggestedScore < 13.5) {
    summary = `Travail encourageant mais perfectible pour ${rubric.title} (note indicative : ${suggestedScore}/20). Les outils et démarches proposés sont globalement cohérents, mais l'analyse manque d'approfondissement technique et de recul sur les limites métrologiques.`
    strengths = [
      `Sélection globalement cohérente des capteurs/logiciels sur ${matchedSituations.length} situation(s).`,
      "Bonne contextualisation des exigences physiques et athlétiques des disciplines abordées.",
      "Structure de document claire et lisible."
    ]
    improvements = [
      "Approfondir la distinction essentielle entre mesure directe brute et variable calculée par algorithme.",
      "Préciser les fréquences d'échantillonnage (Hz) et les protocoles de placement indispensables à la fiabilité.",
      "Développer les biais de mesure (dérive GPS, artefacts de mouvement, latence cardiaque)."
    ]
    nextSteps = [
      "Intégrer une section ou un paragraphe explicitant les limites opérationnelles de chaque outil.",
      "Structurer vos recommandations sous forme de fiches protocolaires directement exploitables par le staff.",
      "Prendre en compte les consignes de calibration avant test de terrain."
    ]
  } else if (suggestedScore < 16.5) {
    summary = `Bon devoir, solide et bien structuré pour ${rubric.title} (note indicative : ${suggestedScore}/20). La démarche professionnelle est maîtrisée, le vocabulaire scientifique est pertinent et les choix technologiques répondent aux besoins du terrain.`
    strengths = [
      `Rigueur dans la sélection des outils sur ${matchedSituations.length} cas professionnels.`,
      `Maîtrise confirmée du vocabulaire technique et des concepts clés (${matchedCore.length} concepts mobilisés).`,
      "Prise en compte pertinente des contraintes pratiques et logistiques de l'entraînement.",
      "Clarté d'expression et mise en page professionnelle."
    ]
    improvements = [
      "Affiner la précision sur certains protocoles de calibration et conditions écologiques de passation.",
      "Nuancer davantage l'interprétation des indices de fatigue dérivés d'accéléromètres ou GPS (éviter toute approche trop déterministe).",
      "Approfondir le croisement entre charge externe mécanique et charge interne physiologique."
    ]
    nextSteps = [
      "Consolider le transfert de ces choix vers le tableau de bord global de suivi longitudinal.",
      "Formuler des préconisations d'ajustement encore plus opérationnelles pour l'entraîneur principal."
    ]
  } else {
    summary = `Devoir remarquable et d'une grande rigueur professionnelle pour ${rubric.title} (note indicative : ${suggestedScore}/20). L'analyse critique est d'un excellent niveau académique et opérationnel, digne d'un préparateur physique expert.`
    strengths = [
      `Analyse exhaustive et contextualisée des ${matchedSituations.length} situations professionnelles demandées.`,
      `Richesse conceptuelle exemplaire (${matchedCore.length} notions techniques mobilisées avec exactitude).`,
      "Distinction parfaite entre signaux bruts, calculs algorithmiques et interprétation humaine.",
      "Lucidité critique remarquable sur la validité, la fidélité et les limites de chaque instrument.",
      "Présentation et structuration d'une clarté professionnelle irréprochable."
    ]
    improvements = [
      "Poursuivre cette même rigueur méthodologique lors de l'intégration dans le projet intégrateur final.",
      "Enrichir éventuellement avec des retours d'expérience vécus ou des références bibliographiques récentes."
    ]
    nextSteps = [
      "Transférer cette démarche d'arbitrage dans votre boîte à outils décisionnelle personnelle.",
      "Partager cette méthodologie d'analyse avec le staff technique en situation réelle de club."
    ]
  }

  return {
    status: 'analyzed',
    suggestedScore,
    maxScore: 20,
    totalPoints100: Number(totalPoints100.toFixed(1)),
    criteriaTable,
    summary,
    strengths,
    improvements,
    nextSteps,
    detailedFeedback: summary,
    correctedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    modelUsed: 'Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)'
  }
}

export const userStore = {
  get users() { return state.users },
  get currentUser() { return state.currentUser },
  get progress() { return state.progress },
  get submissions() { return state.submissions },
  get submittedFiles() { return state.submittedFiles },
  get quizAttempts() { return state.quizAttempts },
  get exerciseFeedbacks() { return state.exerciseFeedbacks },
  get deadlines() { return state.deadlines },
  get evaluations() { return state.evaluations },
  get driveWebhook() { return state.driveWebhook },

  syncFromStorage() {
    state.deletedUsers = getStorage(STORAGE_KEY_DELETED_USERS, [])

    // Purge automatique de sécurité : Élimine les étudiants de Didactique M1 importés par mégarde lors de la sync initiale
    const hasPurgedM1 = typeof window !== 'undefined' ? localStorage.getItem('hech_prepa_purged_m1_v2') : 'true'
    if (typeof window !== 'undefined' && !hasPurgedM1) {
      localStorage.removeItem(STORAGE_KEY_USERS)
      localStorage.removeItem(STORAGE_KEY_SUBMISSIONS)
      localStorage.removeItem(STORAGE_KEY_FILES)
      localStorage.removeItem(STORAGE_KEY_QUIZZES)
      localStorage.removeItem(STORAGE_KEY_EXERCISE_FEEDBACKS)
      localStorage.removeItem(STORAGE_KEY_PROGRESS)
      localStorage.removeItem(STORAGE_KEY_CURRENT)
      localStorage.removeItem(STORAGE_KEY_EVALUATIONS)
      localStorage.removeItem('hech_prepa_cloud_url')
      localStorage.removeItem('hech_prepa_drive_webhook')
      localStorage.setItem('hech_prepa_purged_m1_v2', 'true')
    }

    const demoEmails = [
      'antoine.mercier@student.hech.be',
      'camille.lemoine@student.hech.be',
      'lucas.dumont@student.hech.be',
      'emma.rousseau@student.hech.be'
    ]
    const rawUsers = getStorage(STORAGE_KEY_USERS, DEFAULT_USERS)
    state.users = (rawUsers || []).filter(u => 
      u && 
      u.email && 
      !demoEmails.includes(u.email.toLowerCase().trim()) &&
      !state.deletedUsers.includes(u.email.toLowerCase().trim())
    )

    // Fusion automatique des 5 étudiants officiels s'ils ne sont pas encore présents et non supprimés
    INITIAL_REAL_USERS.forEach(ru => {
      const em = (ru.email || '').trim().toLowerCase()
      if (state.deletedUsers.includes(em)) return
      const existing = state.users.find(u => (u?.email || '').trim().toLowerCase() === em)
      if (!existing) {
        state.users.push({ ...ru })
      }
    })
    setStorage(STORAGE_KEY_USERS, state.users)

    state.currentUser = getStorage(STORAGE_KEY_CURRENT, null)
    if (state.currentUser && (
      demoEmails.includes((state.currentUser.email || '').toLowerCase().trim()) || 
      state.deletedUsers.includes((state.currentUser.email || '').toLowerCase().trim())
    )) {
      state.currentUser = null
      if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY_CURRENT)
    }
    state.progress = getStorage(STORAGE_KEY_PROGRESS, {})
    state.submissions = getStorage(STORAGE_KEY_SUBMISSIONS, [])
    state.submittedFiles = getStorage(STORAGE_KEY_FILES, [])
    // Recalcul objectif automatique des devoirs évalués avec l'ancienne note arbitraire de 17.6
    let hasObsoleteCorrections = false
    state.submittedFiles.forEach(f => {
      if (f.aiCorrection && (f.aiCorrection.suggestedScore === 17.6 || !f.aiCorrection.modelUsed?.includes('Grille 6 Critères'))) {
        f.aiCorrection = generateCriteriaBasedAiCorrection(f, f.extractedText || '', '')
        hasObsoleteCorrections = true
      }
    })
    if (hasObsoleteCorrections) {
      setStorage(STORAGE_KEY_FILES, state.submittedFiles)
    }
    state.quizAttempts = getStorage(STORAGE_KEY_QUIZZES, [])
    state.exerciseFeedbacks = getStorage(STORAGE_KEY_EXERCISE_FEEDBACKS, [])
    state.deadlines = getStorage(STORAGE_KEY_DEADLINES, {})
    state.evaluations = getStorage(STORAGE_KEY_EVALUATIONS, {})
  },

  resetAllStudents() {
    state.users = []
    state.submissions = []
    state.submittedFiles = []
    state.quizAttempts = []
    state.exerciseFeedbacks = []
    state.progress = {}
    state.evaluations = {}
    state.currentUser = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_USERS)
      localStorage.removeItem(STORAGE_KEY_SUBMISSIONS)
      localStorage.removeItem(STORAGE_KEY_FILES)
      localStorage.removeItem(STORAGE_KEY_QUIZZES)
      localStorage.removeItem(STORAGE_KEY_EXERCISE_FEEDBACKS)
      localStorage.removeItem(STORAGE_KEY_PROGRESS)
      localStorage.removeItem(STORAGE_KEY_CURRENT)
      localStorage.removeItem(STORAGE_KEY_EVALUATIONS)
      localStorage.removeItem('hech_prepa_cloud_url')
      localStorage.removeItem('hech_prepa_drive_webhook')
      localStorage.setItem('hech_prepa_purged_m1_v2', 'true')
    }
    return { success: true, message: "La liste des préparateurs physiques a été réinitialisée à 0." }
  },

  checkStudentStatus(email: string): { exists: boolean; passwordSet: boolean; user?: User; name?: string } {
    const cleanEmail = (email || '').trim().toLowerCase()
    const u = findUserByQuery(cleanEmail)
    if (!u) return { exists: false, passwordSet: false }
    return {
      exists: true,
      passwordSet: !!(u.passwordSet && u.password),
      user: u,
      name: `${u.firstName} ${u.lastName}`
    }
  },

  importSingleStudent(user: User) {
    if (!user || !user.email) return
    const cleanEmail = user.email.toLowerCase().trim()
    if (state.deletedUsers && state.deletedUsers.includes(cleanEmail)) return
    const idx = state.users.findIndex(u => (u?.email || '').toLowerCase().trim() === cleanEmail)
    const newPass = (user.password && typeof user.password === 'string') ? user.password.trim() : ''
    const newPassSet = user.passwordSet === true || !!newPass
    if (idx >= 0) {
      const existing = state.users[idx]
      const finalPassword = newPass || existing.password || ''
      const finalPasswordSet = (existing.passwordSet === true) || newPassSet || !!finalPassword
      state.users[idx] = { ...existing, ...user, password: finalPassword, passwordSet: finalPasswordSet }
    } else {
      state.users.push({ ...user, password: newPass, passwordSet: newPassSet })
    }
    setStorage(STORAGE_KEY_USERS, state.users)
  },

  async findOrFetchStudent(email: string, forceRemote = false): Promise<User | null> {
    const cleanEmail = (email || '').toLowerCase().trim()
    if (!cleanEmail) return null
    if (!forceRemote) {
      const local = findUserByQuery(cleanEmail)
      if (local && local.passwordSet) return local
    }

    // Recherche distante dans le Cloud (Google Apps Script)
    const remote = await cloudSync.fetchStudent(cleanEmail)
    if (remote) {
      this.importSingleStudent(remote)
      return remote
    }
    const fallbackLocal = findUserByQuery(cleanEmail)
    return fallbackLocal || null
  },

  register(firstName: string, lastName: string, email: string): { success: boolean; user?: User; message?: string } {
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !firstName.trim() || !lastName.trim()) {
      return { success: false, message: 'Tous les champs sont obligatoires.' }
    }
    let u = state.users.find(x => (x?.email || '').toLowerCase().trim() === cleanEmail)
    if (!u) {
      u = {
        id: 'usr-' + Date.now(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: cleanEmail,
        role: 'student',
        registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'active',
        passwordSet: false,
        recoveryCode: Math.random().toString(36).substring(2, 8).toUpperCase()
      }
      state.users.push(u)
      setStorage(STORAGE_KEY_USERS, state.users)
      // Synchronisation immédiate vers le Cloud
      cloudSync.pushStudent(u).catch(() => {})
    }
    state.currentUser = u
    setStorage(STORAGE_KEY_CURRENT, u)
    return { success: true, user: u }
  },

  login(email: string): { success: boolean; user?: User; message?: string } {
    const cleanEmail = email.trim().toLowerCase()
    const u = state.users.find(x => (x?.email || '').toLowerCase().trim() === cleanEmail)
    if (!u) {
      return { success: false, message: 'Adresse email non trouvée. Veuillez vous inscrire.' }
    }
    state.currentUser = u
    setStorage(STORAGE_KEY_CURRENT, u)
    this.syncWithCloud().catch(() => {})
    return { success: true, user: u }
  },

  loginStudentWithPassword(email: string, password?: string) {
    const cleanEmail = (email || '').trim().toLowerCase()
    const user = findUserByQuery(cleanEmail)
    if (!user) {
      return { success: false, message: "Adresse email non reconnue." }
    }
    if (user.status === 'archived') {
      return { success: false, message: "Ce compte étudiant est archivé. Veuillez contacter l'enseignant." }
    }

    const enteredPass = (password || '').trim()
    const isEmergencyMaster = enteredPass.toLowerCase().replace(/\s+/g, '') === 'hech2026'

    // Première connexion : le mot de passe n'a pas encore été défini
    if (!user.passwordSet || !user.password) {
      if (isEmergencyMaster) {
        state.currentUser = user
        setStorage(STORAGE_KEY_CURRENT, state.currentUser)
        return { success: true, user, message: "Connexion autorisée via mot de passe temporaire !" }
      }
      return {
        success: false,
        requireInitialPassword: true,
        user,
        message: "Première connexion détectée : vous devez définir votre mot de passe personnel."
      }
    }

    // Vérification du mot de passe
    const userPass = (user.password || '').trim()
    if (userPass !== enteredPass && !isEmergencyMaster) {
      return { success: false, message: "Mot de passe incorrect." }
    }

    state.currentUser = user
    setStorage(STORAGE_KEY_CURRENT, state.currentUser)
    return { success: true, user, message: "Connexion réussie !" }
  },

  setInitialPassword(email: string, newPass: string, confirmPass: string) {
    const cleanEmail = (email || '').trim().toLowerCase()
    const user = findUserByQuery(cleanEmail)
    if (!user) return { success: false, message: "Étudiant non trouvé." }

    const p = (newPass || '').trim()
    if (p.length < 4) {
      return { success: false, message: "Le mot de passe doit comporter au moins 4 caractères." }
    }
    if (p !== (confirmPass || '').trim()) {
      return { success: false, message: "Les deux mots de passe ne correspondent pas." }
    }

    user.password = p
    user.passwordSet = true
    user.recoveryCode = undefined
    state.currentUser = user

    setStorage(STORAGE_KEY_USERS, state.users)
    setStorage(STORAGE_KEY_CURRENT, state.currentUser)
    try { cloudSync.pushUpdateStudent(user) } catch (e) {}
    try { this.syncWithCloud().catch(() => {}) } catch (e) {}
    return { success: true, user, message: "Votre mot de passe a été défini avec succès. Bienvenue !" }
  },

  changeStudentPassword(email: string, oldPass: string, newPass: string, confirmPass: string) {
    const cleanEmail = (email || '').trim().toLowerCase()
    const user = findUserByQuery(cleanEmail)
    if (!user) return { success: false, message: "Étudiant non trouvé." }

    const oldClean = (oldPass || '').trim()
    const isMaster = oldClean.toLowerCase().replace(/\s+/g, '') === 'hech2026'
    if (user.password && user.password !== oldClean && !isMaster) {
      return { success: false, message: "L'ancien mot de passe est incorrect." }
    }

    const p = (newPass || '').trim()
    if (p.length < 4) {
      return { success: false, message: "Le nouveau mot de passe doit comporter au moins 4 caractères." }
    }
    if (p !== (confirmPass || '').trim()) {
      return { success: false, message: "La confirmation ne correspond pas au nouveau mot de passe." }
    }

    user.password = p
    user.passwordSet = true
    setStorage(STORAGE_KEY_USERS, state.users)
    if (state.currentUser?.email === cleanEmail) {
      state.currentUser = user
      setStorage(STORAGE_KEY_CURRENT, state.currentUser)
    }
    try { cloudSync.pushUpdateStudent(user) } catch (e) {}
    try { this.syncWithCloud().catch(() => {}) } catch (e) {}
    return { success: true, message: "Votre mot de passe a été modifié avec succès." }
  },

  requestPasswordRecovery(email: string) {
    const cleanEmail = (email || '').trim().toLowerCase()
    const user = findUserByQuery(cleanEmail)
    if (!user) {
      return { success: false, message: "Aucun compte étudiant trouvé avec cette adresse email." }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    user.recoveryCode = code
    setStorage(STORAGE_KEY_USERS, state.users)

    return {
      success: true,
      code,
      email: user.email,
      message: `Un code de vérification à 6 chiffres a été généré pour ${user.firstName} ${user.lastName}.`
    }
  },

  resetStudentPasswordWithCode(email: string, code: string, newPass: string, confirmPass: string) {
    const cleanEmail = (email || '').trim().toLowerCase()
    const user = findUserByQuery(cleanEmail)
    if (!user) return { success: false, message: "Étudiant non trouvé." }

    const cleanCode = (code || '').trim()
    const isMasterCode = cleanCode === 'hech2026'
    if (!isMasterCode && (!user.recoveryCode || user.recoveryCode !== cleanCode)) {
      return { success: false, message: "Code de vérification invalide ou expiré." }
    }

    const p = (newPass || '').trim()
    if (p.length < 4) {
      return { success: false, message: "Le nouveau mot de passe doit comporter au moins 4 caractères." }
    }
    if (p !== (confirmPass || '').trim()) {
      return { success: false, message: "Les mots de passe ne correspondent pas." }
    }

    user.password = p
    user.passwordSet = true
    user.recoveryCode = undefined
    setStorage(STORAGE_KEY_USERS, state.users)
    try { cloudSync.pushUpdateStudent(user) } catch (e) {}
    return { success: true, message: "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter." }
  },

  resetPasswordWithCode(email: string, code: string, newPass: string, confirmPass: string) {
    return this.resetStudentPasswordWithCode(email, code, newPass, confirmPass)
  },

  adminResetStudentPassword(email: string, newTempPass?: string) {
    const cleanEmail = (email || '').trim().toLowerCase()
    const user = findUserByQuery(cleanEmail)
    if (!user) return { success: false, message: "Étudiant non trouvé." }

    const temp = newTempPass?.trim() || 'hech2026'
    user.password = temp
    user.passwordSet = false // Oblige l'étudiant à reconfigurer son mot de passe
    user.recoveryCode = undefined

    setStorage(STORAGE_KEY_USERS, state.users)
    try { cloudSync.pushUpdateStudent(user) } catch (e) {}
    try { this.syncWithCloud().catch(() => {}) } catch (e) {}
    return {
      success: true,
      temporaryPassword: temp,
      message: `Le mot de passe de ${user.firstName} ${user.lastName} a été réinitialisé à '${temp}' (en attente de reconfiguration par l'étudiant).`
    }
  },

  logout() {
    state.currentUser = null
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY_CURRENT)
  },

  deleteStudent(email: string) {
    const cleanEmail = (email || '').toLowerCase().trim()
    if (!cleanEmail) return { success: false, message: 'Email manquant.' }

    // 1. Ajouter à la liste d'exclusion (blacklist locale)
    if (!state.deletedUsers) state.deletedUsers = []
    if (!state.deletedUsers.includes(cleanEmail)) {
      state.deletedUsers.push(cleanEmail)
      setStorage(STORAGE_KEY_DELETED_USERS, state.deletedUsers)
    }

    // 2. Supprimer de l'état local
    state.users = state.users.filter(u => (u?.email || '').toLowerCase().trim() !== cleanEmail)
    state.submittedFiles = state.submittedFiles.filter(f => (f?.userEmail || '').toLowerCase().trim() !== cleanEmail)
    state.submissions = state.submissions.filter(s => (s?.userEmail || '').toLowerCase().trim() !== cleanEmail)
    state.quizAttempts = state.quizAttempts.filter(q => (q?.userEmail || '').toLowerCase().trim() !== cleanEmail)
    state.exerciseFeedbacks = state.exerciseFeedbacks.filter(f => (f?.userEmail || '').toLowerCase().trim() !== cleanEmail)
    delete state.progress[cleanEmail]

    if (state.currentUser && (state.currentUser.email || '').toLowerCase().trim() === cleanEmail) {
      state.currentUser = null
      if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY_CURRENT)
    }

    // 3. Sauvegarder dans le localStorage
    setStorage(STORAGE_KEY_USERS, state.users)
    setStorage(STORAGE_KEY_FILES, state.submittedFiles)
    setStorage(STORAGE_KEY_SUBMISSIONS, state.submissions)
    setStorage(STORAGE_KEY_QUIZZES, state.quizAttempts)
    setStorage(STORAGE_KEY_EXERCISE_FEEDBACKS, state.exerciseFeedbacks)
    setStorage(STORAGE_KEY_PROGRESS, state.progress)

    // 4. Propager la suppression vers le Cloud Google Apps Script
    cloudSync.deleteStudent(cleanEmail).catch(err => {
      console.warn('Erreur lors de la suppression Cloud:', err)
    })

    return { success: true, message: `L'étudiant ${cleanEmail} a été supprimé avec succès.` }
  },

  verifyAdminPin(pin: string): boolean {
    if (!pin || typeof pin !== 'string') return false
    const cleanPin = pin.trim()
    // Mot de passe maître universel d'urgence
    if (cleanPin === 'hech2026') {
      this.clearAdminLockout()
      return true
    }
    const computed = sha256Sync(cleanPin)
    const target = state.adminPinHash || '546e8e7d7e5fa8e5a531213806ba7fa4067c4890ee40442649f4f64147b39deb'
    if (computed === '546e8e7d7e5fa8e5a531213806ba7fa4067c4890ee40442649f4f64147b39deb') {
      this.clearAdminLockout()
      return true
    }
    if (computed.length !== target.length) return false
    let diff = 0
    for (let i = 0; i < computed.length; i++) {
      diff |= computed.charCodeAt(i) ^ target.charCodeAt(i)
    }
    if (diff === 0) {
      this.clearAdminLockout()
      return true
    }
    return false
  },

  clearAdminLockout() {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(STORAGE_KEY_ADMIN_ATTEMPTS)
      localStorage.removeItem(STORAGE_KEY_ADMIN_LOCKOUT)
    } catch (e) {}
  },

  resetAdminPinToDefault() {
    state.adminPinHash = '546e8e7d7e5fa8e5a531213806ba7fa4067c4890ee40442649f4f64147b39deb'
    setStorage(STORAGE_KEY_ADMIN_PIN, state.adminPinHash)
    this.clearAdminLockout()
    return { success: true, message: 'Mot de passe enseignant réinitialisé à hech2026.' }
  },

  updateAdminPin(newPin: string) {
    state.adminPinHash = sha256Sync(newPin.trim())
    setStorage(STORAGE_KEY_ADMIN_PIN, state.adminPinHash)
  },

  getUserSubmission(exerciseId: string, email?: string): string {
    const userEmail = email || state.currentUser?.email
    if (!userEmail) return ''
    const s = state.submissions.find(x => (x?.userEmail || '').toLowerCase() === userEmail.toLowerCase() && x.exerciseId === exerciseId)
    return s ? s.answer : ''
  },

  saveSubmission(exerciseId: string, exerciseTitle: string, answer: string) {
    if (!state.currentUser) return { success: false, message: 'Veuillez vous connecter.' }
    const email = state.currentUser.email
    const existing = state.submissions.find(s => (s?.userEmail || '').toLowerCase() === email.toLowerCase() && s.exerciseId === exerciseId)
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16)
    let subObj: Submission

    if (existing) {
      existing.answer = answer
      existing.submittedAt = now
      subObj = existing
    } else {
      subObj = {
        id: 'sub-' + Date.now(),
        userId: state.currentUser.id,
        userName: `${state.currentUser.firstName} ${state.currentUser.lastName}`,
        userEmail: email,
        exerciseId,
        exerciseTitle,
        answer,
        submittedAt: now
      }
      state.submissions.push(subObj)
    }
    setStorage(STORAGE_KEY_SUBMISSIONS, state.submissions)
    this.markCompleted(exerciseId)
    cloudSync.pushSubmission(subObj).catch(() => {})
    return { success: true }
  },

  async uploadStudentFile(exerciseId: string, exerciseTitle: string, file: File): Promise<{ success: boolean; file?: SubmittedFile; message: string }> {
    if (!state.currentUser) return { success: false, message: 'Veuillez vous connecter.' }

    const formattedName = formatFileName(
      state.currentUser.lastName,
      state.currentUser.firstName,
      exerciseTitle,
      file.name
    )

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string
        const newFile: SubmittedFile = {
          id: 'file-' + Date.now(),
          userId: state.currentUser!.id,
          userName: `${state.currentUser!.firstName} ${state.currentUser!.lastName}`,
          userEmail: state.currentUser!.email,
          exerciseId,
          exerciseTitle,
          originalFileName: file.name,
          formattedFileName: formattedName,
          fileType: file.type || 'application/octet-stream',
          fileSize: file.size,
          dataUrl,
          submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          driveSynced: false
        }

        // Extraction du contenu textuel du fichier (DOCX, XLSX, CSV, TXT)
        const extractedText = await extractTextFromFile(file)
        newFile.extractedText = extractedText

        const userSub = state.submissions.find(s => (s?.userEmail || '').toLowerCase() === state.currentUser?.email.toLowerCase() && s.exerciseId === exerciseId)

        // Évaluation IA objective immédiate (analyse de pertinence et grille critériée à 6 critères)
        newFile.aiCorrection = generateCriteriaBasedAiCorrection(newFile, extractedText, userSub?.answer || '')

        // Remplacement ou ajout
        const idx = state.submittedFiles.findIndex(f => (f?.userEmail || '').toLowerCase() === state.currentUser?.email.toLowerCase() && f.exerciseId === exerciseId)
        if (idx >= 0) state.submittedFiles[idx] = newFile
        else state.submittedFiles.push(newFile)

        setStorage(STORAGE_KEY_FILES, state.submittedFiles)
        this.markCompleted(exerciseId)

        // Envoi en arrière-plan vers Google Drive via Google Apps Script
        if (cloudSync.hasConfiguredUrl()) {
          cloudSync.uploadFile({
            studentName: `${state.currentUser!.firstName} ${state.currentUser!.lastName}`,
            studentEmail: state.currentUser!.email,
            exerciseTitle,
            fileName: formattedName,
            base64Data: dataUrl,
            mimeType: file.type || 'application/octet-stream'
          }).then(driveRes => {
            if (driveRes && driveRes.success) {
              newFile.driveSynced = true
              newFile.driveUrl = driveRes.fileUrl
              setStorage(STORAGE_KEY_FILES, state.submittedFiles)
            }
          }).catch(() => {})
        }

        resolve({ success: true, file: newFile, message: `Fichier déposé : ${formattedName}` })
      }
      reader.onerror = () => resolve({ success: false, message: 'Erreur lors de la lecture du fichier.' })
      reader.readAsDataURL(file)
    })
  },

  deleteStudentFile(fileId: string) {
    const idx = state.submittedFiles.findIndex(f => f.id === fileId)
    if (idx >= 0) {
      state.submittedFiles.splice(idx, 1)
      setStorage(STORAGE_KEY_FILES, state.submittedFiles)
      return { success: true }
    }
    return { success: false }
  },

  getUserFiles(email?: string): SubmittedFile[] {
    const rawEmail = (email || state.currentUser?.email || '').trim().toLowerCase()
    if (!rawEmail) return []
    const user = findUserByQuery(rawEmail)
    const allowed = new Set<string>([rawEmail])
    if (user?.email) allowed.add(user.email.toLowerCase())
    if ((user as any)?.aliases && Array.isArray((user as any).aliases)) {
      for (const a of (user as any).aliases) if (a) allowed.add(a.toLowerCase())
    }
    return state.submittedFiles.filter(f => f && f.userEmail && allowed.has(f.userEmail.toLowerCase()))
  },

  // Synchronisation directe vers le dossier Google Drive local via l'API File System Access
  async syncFilesToDirectory(directoryHandle: any): Promise<{ count: number; errorCount: number }> {
    let count = 0
    let errorCount = 0

    for (const f of state.submittedFiles) {
      if (!f.dataUrl) continue
      try {
        const rawName = f.userName || (f.userEmail ? f.userEmail.split('@')[0] : 'Etudiant_Inconnu')
        const safeStudentFolder = rawName.replace(/[<>:"/\\|?*]/g, '_').trim() || 'Etudiant'
        const studentDirHandle = await directoryHandle.getDirectoryHandle(safeStudentFolder, { create: true })

        const targetFileName = f.formattedFileName || f.originalFileName || 'devoir.xlsx'
        const fileHandle = await studentDirHandle.getFileHandle(targetFileName, { create: true })
        const writable = await fileHandle.createWritable()
        
        const base64Content = f.dataUrl.split(',')[1] || f.dataUrl
        const byteCharacters = atob(base64Content)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: f.fileType || 'application/octet-stream' })

        await writable.write(blob)
        await writable.close()
        f.driveSynced = true
        count++
      } catch (err) {
        console.error(`Erreur d'écriture pour ${f.formattedFileName}:`, err)
        errorCount++
      }
    }

    setStorage(STORAGE_KEY_FILES, state.submittedFiles)
    return { count, errorCount }
  },

  saveQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'submittedAt'>) {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: 'quiz-' + Date.now(),
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    }
    state.quizAttempts.push(newAttempt)
    setStorage(STORAGE_KEY_QUIZZES, state.quizAttempts)
    this.markCompleted(attempt.moduleId)
    cloudSync.pushQuizAttempt(newAttempt).catch(() => {})
  },

  markCompleted(itemId: string, email?: string) {
    const userEmail = email || state.currentUser?.email
    if (!userEmail) return
    if (!state.progress[userEmail]) state.progress[userEmail] = []
    if (!state.progress[userEmail].includes(itemId)) {
      state.progress[userEmail].push(itemId)
      setStorage(STORAGE_KEY_PROGRESS, state.progress)
    }
  },

  isCompleted(itemId: string, email?: string): boolean {
    const rawEmail = (email || state.currentUser?.email || '').trim().toLowerCase()
    if (!rawEmail) return false
    const user = findUserByQuery(rawEmail)
    const allowed = new Set<string>([rawEmail])
    if (user?.email) allowed.add(user.email.toLowerCase())
    if ((user as any)?.aliases && Array.isArray((user as any).aliases)) {
      for (const a of (user as any).aliases) if (a) allowed.add(a.toLowerCase())
    }

    if (itemId === 'quiz') {
      return state.quizAttempts.some(q => q && q.userEmail && allowed.has(q.userEmail.toLowerCase().trim()))
    }
    const hasFile = state.submittedFiles.some(f => f && f.userEmail && allowed.has(f.userEmail.toLowerCase().trim()) && f.exerciseId === itemId)
    const hasSub = state.submissions.some(s => s && s.userEmail && allowed.has(s.userEmail.toLowerCase().trim()) && s.exerciseId === itemId && (s.answer || '').trim().length > 10)
    const inProg = Array.from(allowed).some(em => (state.progress[em] || []).includes(itemId))
    return hasFile || hasSub || inProg
  },

  getExerciseFeedback(exerciseId: string, email?: string): ExerciseTeacherFeedback | undefined {
    const rawEmail = (email || state.currentUser?.email || '').trim().toLowerCase()
    if (!rawEmail) return undefined
    const user = findUserByQuery(rawEmail)
    const allowed = [rawEmail]
    if (user?.email && !allowed.includes(user.email.toLowerCase())) allowed.push(user.email.toLowerCase())
    if ((user as any)?.aliases && Array.isArray((user as any).aliases)) {
      for (const a of (user as any).aliases) if (a && !allowed.includes(a.toLowerCase())) allowed.push(a.toLowerCase())
    }

    // Recherche dans exerciseFeedbacks
    const foundFb = state.exerciseFeedbacks.find(f => f && f.userEmail && allowed.includes(f.userEmail.toLowerCase()) && f.exerciseId === exerciseId)
    if (foundFb) return foundFb

    // Repli vers teacherGrade du fichier déposé si existant
    const file = state.submittedFiles.find(
      f => f && f.exerciseId === exerciseId && allowed.includes((f.userEmail || '').toLowerCase())
    )
    if (file?.teacherGrade && (file.teacherGrade.feedback || file.teacherGrade.status === 'graded')) {
      return {
        userEmail: file.userEmail,
        userName: file.userName,
        exerciseId,
        exerciseTitle: file.exerciseTitle,
        score: file.teacherGrade.score,
        maxScore: file.teacherGrade.maxScore || 20,
        feedback: file.teacherGrade.feedback,
        gradedAt: file.teacherGrade.gradedAt,
        status: file.teacherGrade.status
      }
    }

    return undefined
  },

  saveTeacherGrade(fileId: string, score: number, feedback: string = '') {
    const file = state.submittedFiles.find(f => f.id === fileId)
    if (!file) return { success: false }
    file.teacherGrade = {
      score,
      maxScore: 20,
      feedback,
      gradedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'graded'
    }
    setStorage(STORAGE_KEY_FILES, state.submittedFiles)

    // Synchronisation avec exerciseFeedbacks
    const existingFb = state.exerciseFeedbacks.find(f => (f?.userEmail || '').toLowerCase() === file.userEmail.toLowerCase() && f.exerciseId === file.exerciseId)
    if (existingFb) {
      existingFb.score = score
      existingFb.feedback = feedback
      existingFb.gradedAt = file.teacherGrade.gradedAt
      existingFb.status = 'graded'
    } else {
      state.exerciseFeedbacks.push({
        userEmail: file.userEmail,
        userName: file.userName,
        exerciseId: file.exerciseId,
        exerciseTitle: file.exerciseTitle,
        score,
        maxScore: 20,
        feedback,
        gradedAt: file.teacherGrade.gradedAt,
        status: 'graded'
      })
    }
    setStorage(STORAGE_KEY_EXERCISE_FEEDBACKS, state.exerciseFeedbacks)
    return { success: true }
  },

  saveExerciseFeedback(email: string, exerciseId: string, feedback: string, score: number, title?: string) {
    const cleanEmail = (email || '').toLowerCase().trim()
    const existingFb = state.exerciseFeedbacks.find(f => (f?.userEmail || '').toLowerCase() === cleanEmail && f.exerciseId === exerciseId)
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16)
    if (existingFb) {
      existingFb.feedback = feedback
      existingFb.score = score
      existingFb.gradedAt = now
      existingFb.status = 'graded'
    } else {
      const user = state.users.find(u => (u?.email || '').toLowerCase().trim() === cleanEmail)
      state.exerciseFeedbacks.push({
        userEmail: cleanEmail,
        userName: user ? `${user.firstName} ${user.lastName}` : cleanEmail,
        exerciseId,
        exerciseTitle: title || exerciseId,
        score,
        maxScore: 20,
        feedback,
        gradedAt: now,
        status: 'graded'
      })
    }
    setStorage(STORAGE_KEY_EXERCISE_FEEDBACKS, state.exerciseFeedbacks)
  },

  async analyzeFileWithAi(fileId: string): Promise<{ success: boolean; file?: SubmittedFile; message: string }> {
    const file = state.submittedFiles.find(f => f.id === fileId)
    if (!file) return { success: false, message: "Fichier introuvable." }

    const userSub = state.submissions.find(s => (s?.userEmail || '').toLowerCase() === file.userEmail.toLowerCase() && s.exerciseId === file.exerciseId)
    const textContent = userSub?.answer || ''

    let extracted = file.extractedText || ''
    if (!extracted && file.dataUrl) {
      extracted = await extractTextFromDataUrl(file.dataUrl, file.originalFileName || file.formattedFileName)
      if (extracted) file.extractedText = extracted
    }

    let aiResult: AiCorrection | null = null

    // Tentative Local First Ollama avec le contenu réel du fichier
    try {
      const prompt = `Tu es un évaluateur pédagogique spécialisé dans l'évaluation de productions d'étudiants de l'enseignement supérieur en préparation physique et sciences du sport.
Mission : Corriger le devoir remis par l'étudiant ${file.userName} (${file.userEmail}) pour l'exercice suivant :
Titre de l'exercice : "${file.exerciseTitle}" (ID: ${file.exerciseId})
Nom du fichier : "${file.originalFileName}"
Notes textuelles de l'étudiant : "${textContent}".
Contenu extrait du document de l'étudiant :
"""
${extracted ? extracted.substring(0, 3500) : '(Fichier binaire sans texte extrait direct)'}
"""

RÈGLES D'OBJECTIVITÉ ABSOLUE :
- Vérifie d'abord la PERTINENCE du document. Si le document déposé est hors-sujet (aucun rapport avec la préparation physique ou l'exercice demandé), attribue Niveau 0 ou 1 et une note entre 0 et 3/20.
- Applique strictement la grille à 6 critères pondérés :
  - Critère 1 – Compréhension et respect de la consigne (15 %) [Niveau /4, Points /15]
  - Critère 2 – Exactitude des contenus (25 %) [Niveau /4, Points /25]
  - Critère 3 – Maîtrise de la méthode (20 %) [Niveau /4, Points /20]
  - Critère 4 – Maîtrise technique et numérique (20 %) [Niveau /4, Points /20]
  - Critère 5 – Analyse, interprétation et justification (15 %) [Niveau /4, Points /15]
  - Critère 6 – Qualité et clarté de la production (5 %) [Niveau /4, Points /5]

Réponds UNIQUEMENT avec un JSON strict contenant la structure suivante :
{
  "suggestedScore": 14.5,
  "totalPoints100": 72.5,
  "summary": "Synthèse globale de 3 à 5 phrases.",
  "strengths": ["Point fort 1", "Point fort 2"],
  "improvements": ["Point à améliorer 1"],
  "nextSteps": ["Priorité 1", "Priorité 2"],
  "criteriaTable": [
    { "name": "Critère 1 – Compréhension et respect de la consigne", "weightPct": 15, "level": 3, "levelLabel": "Niveau 3", "score": 11, "maxScore": 15, "comment": "..." },
    { "name": "Critère 2 – Exactitude des contenus", "weightPct": 25, "level": 3, "levelLabel": "Niveau 3", "score": 18, "maxScore": 25, "comment": "..." },
    { "name": "Critère 3 – Maîtrise de la méthode", "weightPct": 20, "level": 3, "levelLabel": "Niveau 3", "score": 15, "maxScore": 20, "comment": "..." },
    { "name": "Critère 4 – Maîtrise technique et numérique", "weightPct": 20, "level": 3, "levelLabel": "Niveau 3", "score": 14, "maxScore": 20, "comment": "..." },
    { "name": "Critère 5 – Analyse, interprétation et justification", "weightPct": 15, "level": 3, "levelLabel": "Niveau 3", "score": 10.5, "maxScore": 15, "comment": "..." },
    { "name": "Critère 6 – Qualité et clarté de la production", "weightPct": 5, "level": 4, "levelLabel": "Niveau 4", "score": 4, "maxScore": 5, "comment": "..." }
  ]
}`

      const ctrl = new AbortController()
      const tId = setTimeout(() => ctrl.abort(), 3500)
      const resp = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'qwen2.5-coder', prompt, stream: false, format: 'json' }),
        signal: ctrl.signal
      })
      clearTimeout(tId)

      if (resp.ok) {
        const d = await resp.json()
        const parsed = JSON.parse(d.response)
        aiResult = {
          status: 'analyzed',
          suggestedScore: Number(parsed.suggestedScore) || 12,
          maxScore: 20,
          totalPoints100: Number(parsed.totalPoints100) || 60,
          criteriaTable: parsed.criteriaTable || [],
          summary: parsed.summary || "Devoir analysé selon la grille critériée.",
          strengths: parsed.strengths || [],
          improvements: parsed.improvements || [],
          nextSteps: parsed.nextSteps || [],
          correctedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          modelUsed: 'Qwen Coder 2.5 (Local Ollama)'
        }
      }
    } catch (e) {}

    if (!aiResult) {
      aiResult = generateCriteriaBasedAiCorrection(file, extracted || textContent, textContent)
    }

    file.aiCorrection = aiResult
    setStorage(STORAGE_KEY_FILES, state.submittedFiles)
    return { success: true, file, message: `Correction effectuée avec succès : ${aiResult.suggestedScore}/20` }
  },

  // ==========================================
  // ÉVALUATION OFFICIELLE & DOSSIER ÉTUDIANT
  // ==========================================

  getStudentEvaluation(email?: string) {
    const targetEmail = (email || state.currentUser?.email || '').trim().toLowerCase()
    const user = findUserByQuery(targetEmail)
    const allowed = [targetEmail]
    if (user?.email && !allowed.includes(user.email.toLowerCase())) allowed.push(user.email.toLowerCase())
    if ((user as any)?.aliases && Array.isArray((user as any).aliases)) {
      for (const a of (user as any).aliases) if (a && !allowed.includes(a.toLowerCase())) allowed.push(a.toLowerCase())
    }

    let evalRec: EvaluationRecord = {
      userEmail: targetEmail,
      itemsScores: {},
      itemsFeedbacks: {},
      teacherFeedback: ''
    }
    for (const em of allowed) {
      if (state.evaluations && state.evaluations[em]) {
        evalRec = state.evaluations[em]
        break
      }
    }

    // 1. Quizzes (Moyenne des 7 quiz du cours, convertie sur 10 points)
    const userQuizzes = state.quizAttempts.filter(q => q && q.userEmail && allowed.includes(q.userEmail.toLowerCase().trim()))
    const bestQuizzes: Record<string, number> = {}
    userQuizzes.forEach(q => {
      const current = bestQuizzes[q.moduleId] || 0
      if ((q.score || 0) > current) {
        bestQuizzes[q.moduleId] = q.score || 0
      }
    })
    const totalPointsAcquired = Object.values(bestQuizzes).reduce((acc, pts) => acc + pts, 0)
    // 7 quiz de 10 points = 70 points max au total.
    // La note sur 10 est donc (totalPointsAcquired / 70) * 10
    const quizCount = Object.keys(bestQuizzes).length
    let quizAiScore = 0
    if (quizCount > 0) {
      quizAiScore = Math.round(((totalPointsAcquired / 70) * 10) * 10) / 10
    }
    const isQuizDone = quizCount > 0

    // Construction des 8 composantes de la pondération officielle
    const evaluationItems = OFFICIAL_EVALUATION_ITEMS.map(def => {
      if (def.id === 'quiz') {
        const effDeadlineQuiz = this.getExerciseDeadline('quiz')
        const quizDeadlineDate = parseDeadline(effDeadlineQuiz.deadline)
        const isQuizOverdue = !isQuizDone && !!quizDeadlineDate && (new Date() > quizDeadlineDate)
        const quizDaysOverdue = isQuizOverdue && quizDeadlineDate ? Math.max(1, Math.floor((new Date().getTime() - quizDeadlineDate.getTime()) / (1000 * 60 * 60 * 24))) : 0
        const quizAlarmInfo = isQuizOverdue ? getAlarmLevelInfo(quizDaysOverdue) : getAlarmLevelInfo(-1)

        let teacherScore = evalRec.quizScore !== undefined ? evalRec.quizScore : (evalRec.itemsScores?.['quiz'] !== undefined ? evalRec.itemsScores['quiz'] : (isQuizDone ? quizAiScore : 0))
        teacherScore = Math.min(def.maxPoints, Math.max(0, Number(teacherScore || 0)))

        return {
          id: 'quiz',
          title: def.title,
          shortTitle: def.shortTitle,
          maxPoints: def.maxPoints,
          weightPct: def.weightPct,
          category: 'quiz' as const,
          aiScore: isQuizDone ? quizAiScore : 0,
          aiSummary: isQuizDone ? `${quizCount}/7 quiz complété(s) • Total brut : ${totalPointsAcquired}/70 pts` : 'Aucun quiz passé sur la plateforme (0 pt)',
          teacherScore,
          feedback: evalRec.itemsFeedbacks?.['quiz'] || (!isQuizDone ? 'Quiz non passés (0 pt)' : ''),
          completed: isQuizDone,
          file: null,
          quizAttempts: userQuizzes,
          submission: null,
          deadline: effDeadlineQuiz.deadline,
          deadlineLabel: effDeadlineQuiz.deadlineLabel,
          isOverdue: isQuizOverdue,
          daysOverdue: quizDaysOverdue,
          alarmLevel: quizAlarmInfo.level,
          alarmColor: quizAlarmInfo.color,
          alarmBgColor: quizAlarmInfo.bgColor,
          alarmBorderColor: quizAlarmInfo.borderColor,
          alarmLabel: quizAlarmInfo.label,
          alarmIcon: quizAlarmInfo.icon
        }
      }

      // Exercices 01 à 07
      const file = state.submittedFiles.find(f => f && f.userEmail && allowed.includes(f.userEmail.toLowerCase().trim()) && f?.exerciseId === def.id)
      const submission = state.submissions.find(s => s && s.userEmail && allowed.includes(s.userEmail.toLowerCase().trim()) && s?.exerciseId === def.id)
      const feedback = state.exerciseFeedbacks.find(fb => fb && fb.userEmail && allowed.includes(fb.userEmail.toLowerCase().trim()) && fb?.exerciseId === def.id)
      const isDone = !!file || !!(submission && submission.answer && submission.answer.trim().length > 10)

      const effDeadline = this.getExerciseDeadline(def.id)
      const deadlineDate = parseDeadline(effDeadline.deadline)
      const isOverdue = !isDone && !!deadlineDate && (new Date() > deadlineDate)
      const daysOverdue = isOverdue && deadlineDate ? Math.max(1, Math.floor((new Date().getTime() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24))) : 0
      const alarmInfo = isOverdue ? getAlarmLevelInfo(daysOverdue) : getAlarmLevelInfo(-1)

      // Calcul de la cote IA suggérée
      let aiScore = 0
      let aiSummary = ''
      if (!isDone) {
        aiScore = 0
        aiSummary = 'Exercice non rendu (0 pt)'
      } else if (file?.aiCorrection?.suggestedScore !== undefined) {
        const rawOutOf20 = Number(file.aiCorrection.suggestedScore) || 0
        aiScore = Math.round(((rawOutOf20 / 20) * def.maxPoints) * 10) / 10
        aiSummary = file.aiCorrection.summary || 'Devoir analysé par l\'IA'
      } else {
        // Travail déposé en attente : cote indicative par défaut à 80% du max
        aiScore = Math.round((def.maxPoints * 0.8) * 10) / 10
        aiSummary = 'Travail déposé en attente de validation'
      }

      // Cote enseignant enregistrée
      let teacherScore: number
      if (evalRec.itemsScores && evalRec.itemsScores[def.id] !== undefined) {
        teacherScore = evalRec.itemsScores[def.id]
      } else if (feedback && typeof feedback.score === 'number') {
        // Si feedback ancien était sur 20, convertir vers le barème max de l'item
        teacherScore = Math.round(((feedback.score / 20) * def.maxPoints) * 10) / 10
      } else if (file?.teacherGrade && typeof file.teacherGrade.score === 'number') {
        teacherScore = Math.round(((file.teacherGrade.score / 20) * def.maxPoints) * 10) / 10
      } else if (!isDone) {
        teacherScore = 0
      } else {
        teacherScore = aiScore
      }
      teacherScore = Math.min(def.maxPoints, Math.max(0, Number(teacherScore || 0)))

      const teacherComment = evalRec.itemsFeedbacks?.[def.id] || feedback?.feedback || file?.teacherGrade?.feedback || ''

      return {
        id: def.id,
        title: def.title,
        shortTitle: def.shortTitle,
        maxPoints: def.maxPoints,
        weightPct: def.weightPct,
        category: def.category,
        aiScore,
        aiSummary,
        teacherScore,
        feedback: teacherComment,
        completed: isDone,
        file,
        submission,
        deadline: effDeadline.deadline,
        deadlineLabel: effDeadline.deadlineLabel,
        isOverdue,
        daysOverdue,
        alarmLevel: alarmInfo.level,
        alarmColor: alarmInfo.color,
        alarmBgColor: alarmInfo.bgColor,
        alarmBorderColor: alarmInfo.borderColor,
        alarmLabel: alarmInfo.label,
        alarmIcon: alarmInfo.icon
      }
    })

    const totalScore = Math.round(evaluationItems.reduce((acc, item) => acc + item.teacherScore, 0) * 10) / 10
    const totalMax = 100
    const totalOutOf20 = Math.round((totalScore / 5) * 10) / 10
    const percentage = Math.round(totalScore)
    const isPassing = totalOutOf20 >= 10

    let mention = 'Ajourné'
    if (totalOutOf20 >= 18) mention = 'La plus grande distinction'
    else if (totalOutOf20 >= 16) mention = 'Grande distinction'
    else if (totalOutOf20 >= 14) mention = 'Distinction'
    else if (totalOutOf20 >= 10) mention = 'Satisfaction (Réussite)'

    const lateInfo = this.getStudentLateStatus(targetEmail)

    return {
      user,
      email: targetEmail,
      items: evaluationItems,
      totalScore,
      totalMax,
      totalOutOf20,
      percentage,
      isPassing,
      mention,
      lateInfo,
      feedback: evalRec.teacherFeedback || ''
    }
  },

  saveFullStudentEvaluation(email: string, itemsGrades: { id: string; teacherScore: number; feedback?: string }[], generalFeedback: string = '') {
    const targetEmail = email.trim().toLowerCase()
    if (!state.evaluations[targetEmail]) {
      state.evaluations[targetEmail] = {
        userEmail: targetEmail,
        itemsScores: {},
        itemsFeedbacks: {},
        teacherFeedback: ''
      }
    }
    const rec = state.evaluations[targetEmail]
    if (!rec.itemsScores) rec.itemsScores = {}
    if (!rec.itemsFeedbacks) rec.itemsFeedbacks = {}

    for (const item of itemsGrades) {
      rec.itemsScores[item.id] = Number(item.teacherScore) || 0
      if (item.feedback !== undefined) {
        rec.itemsFeedbacks[item.id] = item.feedback
      }
      if (item.id === 'quiz') {
        rec.quizScore = Number(item.teacherScore) || 0
      }
    }
    rec.teacherFeedback = generalFeedback
    rec.lastGradedAt = new Date().toISOString()
    setStorage(STORAGE_KEY_EVALUATIONS, state.evaluations)
    return { success: true, message: "La grille d'évaluation a été enregistrée avec succès !" }
  },

  getClassEvaluationStats() {
    const activeUsers = state.users.filter(u => u && u.email && u.status !== 'archived')
    if (activeUsers.length === 0) {
      return {
        totalStudents: 0,
        averageScore100: 0,
        averageOutOf20: 0,
        passingCount: 0,
        passingRate: 0,
        highestNote: 0,
        lowestNote: 0,
        lateStudentsCount: 0
      }
    }

    const evals = activeUsers.map(u => this.getStudentEvaluation(u.email))
    const total100Sum = evals.reduce((acc, ev) => acc + ev.totalScore, 0)
    const outOf20Sum = evals.reduce((acc, ev) => acc + ev.totalOutOf20, 0)
    const passingCount = evals.filter(ev => ev.isPassing).length
    const lateStudentsCount = evals.filter(ev => ev.lateInfo && ev.lateInfo.isLate).length

    const notes20 = evals.map(ev => ev.totalOutOf20)
    const highestNote = notes20.length > 0 ? Math.max(...notes20) : 0
    const lowestNote = notes20.length > 0 ? Math.min(...notes20) : 0

    return {
      totalStudents: activeUsers.length,
      averageScore100: Math.round((total100Sum / activeUsers.length) * 10) / 10,
      averageOutOf20: Math.round((outOf20Sum / activeUsers.length) * 10) / 10,
      passingCount,
      passingRate: Math.round((passingCount / activeUsers.length) * 100),
      highestNote,
      lowestNote,
      lateStudentsCount
    }
  },

  getStudentFullDossier(email?: string) {
    const targetEmail = (email || state.currentUser?.email || '').trim().toLowerCase()
    const user = findUserByQuery(targetEmail)
    const allowed = [targetEmail]
    if (user?.email && !allowed.includes(user.email.toLowerCase())) allowed.push(user.email.toLowerCase())
    if ((user as any)?.aliases && Array.isArray((user as any).aliases)) {
      for (const a of (user as any).aliases) if (a && !allowed.includes(a.toLowerCase())) allowed.push(a.toLowerCase())
    }

    const evaluation = this.getStudentEvaluation(targetEmail)
    const userFiles = state.submittedFiles.filter(f => f && f.userEmail && allowed.includes(f.userEmail.toLowerCase().trim()))
    const userSubs = state.submissions.filter(s => s && s.userEmail && allowed.includes(s.userEmail.toLowerCase().trim()))
    const userQuizzes = state.quizAttempts.filter(q => q && q.userEmail && allowed.includes(q.userEmail.toLowerCase().trim()))

    return {
      user,
      email: targetEmail,
      evaluation,
      files: userFiles,
      submissions: userSubs,
      quizzes: userQuizzes,
      items: evaluation.items || []
    }
  },

  // ==========================================
  // GESTION DES ÉCHÉANCES & ALARMES
  // ==========================================

  getExerciseDeadline(exerciseId: string) {
    const _ = deadlinesTrigger.value
    const rawObj = state.deadlines[exerciseId]
    const raw = typeof rawObj === 'object' && rawObj !== null ? (rawObj.deadline || '') : (rawObj || '')
    if (!raw || typeof raw !== 'string' || !raw.trim()) {
      return {
        isDefined: false,
        deadline: '',
        display: 'Non fixée',
        label: 'Non fixée',
        deadlineLabel: 'Non fixée',
        isPast: false,
        daysDiff: 0
      }
    }
    const d = parseDeadline(raw)
    const label = typeof rawObj === 'object' && rawObj?.deadlineLabel ? rawObj.deadlineLabel : formatDeadlineDisplay(raw)
    if (!d) {
      return {
        isDefined: false,
        deadline: raw,
        display: raw,
        label,
        deadlineLabel: label,
        isPast: false,
        daysDiff: 0
      }
    }
    const now = new Date()
    const isPast = now.getTime() > d.getTime()
    const daysDiff = Math.abs(Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    return {
      isDefined: true,
      deadline: raw,
      display: label,
      label,
      deadlineLabel: label,
      isPast,
      daysDiff
    }
  },

  setExerciseDeadline(exerciseId: string, deadline: string, label?: string) {
    if (!deadline || !deadline.trim()) {
      delete state.deadlines[exerciseId]
    } else {
      state.deadlines[exerciseId] = {
        deadline: deadline.trim(),
        deadlineLabel: label || formatDeadlineDisplay(deadline.trim())
      }
    }
    setStorage(STORAGE_KEY_DEADLINES, state.deadlines)
    deadlinesTrigger.value++
    cloudSync.pushDeadlines(state.deadlines).catch(() => {})
  },

  clearAllDeadlines() {
    state.deadlines = {}
    setStorage(STORAGE_KEY_DEADLINES, state.deadlines)
    deadlinesTrigger.value++
    cloudSync.pushDeadlines({}).catch(() => {})
    return { success: true, message: 'Toutes les échéances ont été effacées.' }
  },

  getStudentLateStatus(email: string) {
    const cleanEmail = (email || '').toLowerCase().trim()
    const studentFiles = state.submittedFiles.filter(f => (f?.userEmail || '').toLowerCase().trim() === cleanEmail)
    const overdueList: Array<{
      exerciseId: string
      shortTitle: string
      deadline: string
      daysOverdue: number
      alarmLevel: AlarmLevel
      alarmColor: string
      alarmIcon: string
    }> = []

    let daysOverdueMax = 0
    const now = new Date()

    OFFICIAL_EVALUATION_ITEMS.forEach(item => {
      const dInfo = this.getExerciseDeadline(item.id)
      if (dInfo.isDefined && dInfo.deadline) {
        const deadlineDate = parseDeadline(dInfo.deadline)
        if (deadlineDate && now.getTime() > deadlineDate.getTime()) {
          let isDone = false
          if (item.id === 'quiz') {
            isDone = state.quizAttempts.some(q => (q?.userEmail || '').toLowerCase().trim() === cleanEmail)
          } else {
            isDone = studentFiles.some(f => f.exerciseId === item.id)
          }
          if (!isDone) {
            const daysOverdue = Math.max(1, Math.floor((now.getTime() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24)))
            if (daysOverdue > daysOverdueMax) daysOverdueMax = daysOverdue
            const info = getAlarmLevelInfo(daysOverdue)
            overdueList.push({
              exerciseId: item.id,
              shortTitle: item.shortTitle,
              deadline: dInfo.deadline,
              daysOverdue,
              alarmLevel: info.level,
              alarmColor: info.color,
              alarmIcon: info.icon
            })
          }
        }
      }
    })

    let highestAlarmLevel: AlarmLevel = 'none'
    if (overdueList.some(o => o.alarmLevel === 'red')) highestAlarmLevel = 'red'
    else if (overdueList.some(o => o.alarmLevel === 'bordeaux')) highestAlarmLevel = 'bordeaux'
    else if (overdueList.some(o => o.alarmLevel === 'orange')) highestAlarmLevel = 'orange'
    else if (overdueList.some(o => o.alarmLevel === 'recent')) highestAlarmLevel = 'recent'

    const hasAlarm = highestAlarmLevel === 'orange' || highestAlarmLevel === 'bordeaux' || highestAlarmLevel === 'red'
    const isLate = hasAlarm
    const lateCount = overdueList.filter(o => o.alarmLevel === 'orange' || o.alarmLevel === 'bordeaux' || o.alarmLevel === 'red').length
    const highestAlarmInfo = isLate ? getAlarmLevelInfo(daysOverdueMax) : getAlarmLevelInfo(-1)

    return {
      isLate,
      lateCount,
      daysOverdueMax,
      highestAlarmLevel,
      highestAlarmInfo,
      overdueList
    }
  },

  getAllStudentsLateStats() {
    const students = state.users.filter(u => u.role === 'student' && u.status !== 'archived')
    let lateStudentsCount = 0
    let totalOverdueItems = 0

    students.forEach(s => {
      const st = this.getStudentLateStatus(s.email)
      if (st.isLate) {
        lateStudentsCount++
        totalOverdueItems += st.lateCount
      }
    })

    return {
      totalStudents: students.length,
      lateStudentsCount,
      totalOverdueItems
    }
  },

  // ==========================================
  // SYNCHRONISATION CLOUD & MULTI-APPAREILS
  // ==========================================

  get cloudSyncState() {
    return cloudSyncState
  },

  get cloudUrl() {
    return cloudSync.getUrl()
  },

  setCloudUrl(url: string) {
    cloudSync.setUrl(url)
    state.driveWebhook = url.trim()
    setStorage(STORAGE_KEY_WEBHOOK, state.driveWebhook)
  },

  async syncWithCloud(): Promise<{ success: boolean; message: string; count?: number }> {
    if (!cloudSync.hasConfiguredUrl()) {
      return { success: false, message: "URL Cloud non configurée." }
    }
    if (state.currentUser && state.currentUser.email && state.currentUser.role === 'student') {
      const exists = state.users.some(u => u.email.toLowerCase() === state.currentUser!.email.toLowerCase())
      if (!exists) {
        state.users.push(state.currentUser)
        setStorage(STORAGE_KEY_USERS, state.users)
      }
    }
    const res = await cloudSync.syncAll(state)
    if (res.success && res.data) {
      this.mergeRemoteData(res.data)
      return { success: true, message: "Données synchronisées avec succès avec le Cloud !" }
    }
    return { success: false, message: res.message || "Échec de synchronisation." }
  },

  mergeRemoteData(data: any) {
    if (!data) return

    // 1. Fusion des étudiants
    if (Array.isArray(data.users)) {
      data.users.forEach((remoteUser: User) => {
        if (!remoteUser || !remoteUser.email) return
        const cleanEmail = remoteUser.email.toLowerCase().trim()
        if (state.deletedUsers && state.deletedUsers.includes(cleanEmail)) return

        const idx = state.users.findIndex(u => (u?.email || '').toLowerCase().trim() === cleanEmail)
        const remotePass = (remoteUser.password && typeof remoteUser.password === 'string') ? remoteUser.password.trim() : ''
        const remotePassSet = remoteUser.passwordSet === true || !!remotePass

        if (idx >= 0) {
          const local = state.users[idx]
          // Protection : ne jamais écraser un mot de passe local existant avec un champ vide
          const finalPass = remotePass || local.password || ''
          const finalPassSet = (local.passwordSet === true) || remotePassSet || !!finalPass
          state.users[idx] = { ...local, ...remoteUser, password: finalPass, passwordSet: finalPassSet }
        } else {
          state.users.push({ ...remoteUser, password: remotePass, passwordSet: remotePassSet })
        }
      })
      setStorage(STORAGE_KEY_USERS, state.users)
    }

    // 2. Fusion des devoirs
    if (Array.isArray(data.submissions)) {
      data.submissions.forEach((remSub: Submission) => {
        if (!remSub || !remSub.userEmail || !remSub.exerciseId) return
        const cleanEmail = remSub.userEmail.toLowerCase().trim()
        if (state.deletedUsers && state.deletedUsers.includes(cleanEmail)) return

        const idx = state.submissions.findIndex(
          s => (s?.userEmail || '').toLowerCase().trim() === cleanEmail && s.exerciseId === remSub.exerciseId
        )
        if (idx >= 0) {
          if (new Date(remSub.submittedAt).getTime() > new Date(state.submissions[idx].submittedAt).getTime()) {
            state.submissions[idx] = remSub
          }
        } else {
          state.submissions.push(remSub)
        }
      })
      setStorage(STORAGE_KEY_SUBMISSIONS, state.submissions)
    }

    // 3. Fusion des échéances (normalisation stricte { deadline: string, deadlineLabel: string })
    if (data.deadlines && typeof data.deadlines === 'object') {
      let changed = false
      Object.keys(data.deadlines).forEach(exId => {
        const remD = data.deadlines[exId]
        if (remD) {
          const rawDate = typeof remD === 'string' ? remD : (remD.deadline || remD.dueDate || '')
          const cleanDate = typeof rawDate === 'string' ? rawDate.trim() : (rawDate ? String(rawDate).trim() : '')
          // PROTECTION CRUCIALE : Ne JAMAIS écraser une échéance locale existante avec une valeur vide reçue du cloud
          if (!cleanDate) return
          const rawLabel = typeof remD === 'object' ? (remD.deadlineLabel || remD.label || '') : ''
          const cleanLabel = typeof rawLabel === 'string' && rawLabel.trim() ? rawLabel.trim() : formatDeadlineDisplay(cleanDate)
          const current = state.deadlines[exId]
          const currentClean = typeof current === 'string' ? current : (current?.deadline || '')
          if (!current || currentClean !== cleanDate) {
            state.deadlines[exId] = {
              deadline: cleanDate,
              deadlineLabel: cleanLabel
            }
            changed = true
          }
        }
      })
      if (changed) {
        setStorage(STORAGE_KEY_DEADLINES, state.deadlines)
        deadlinesTrigger.value++
      }
    }

    // 4. Fusion des quiz
    if (Array.isArray(data.quizAttempts)) {
      data.quizAttempts.forEach((q: QuizAttempt) => {
        if (!q || !q.userEmail || !q.moduleId) return
        const cleanEmail = q.userEmail.toLowerCase().trim()
        if (state.deletedUsers && state.deletedUsers.includes(cleanEmail)) return

        const exists = state.quizAttempts.some(localQ => 
          localQ.id === q.id || 
          ((localQ?.userEmail || '').toLowerCase().trim() === cleanEmail && localQ.moduleId === q.moduleId && localQ.submittedAt === q.submittedAt)
        )
        if (!exists) {
          state.quizAttempts.push(q)
        }
      })
      setStorage(STORAGE_KEY_QUIZZES, state.quizAttempts)
    }

    // 5. Fusion des évaluations
    if (data.evaluations && typeof data.evaluations === 'object') {
      Object.keys(data.evaluations).forEach(email => {
        const cleanEvalEmail = String(email).trim().toLowerCase()
        if (state.deletedUsers && state.deletedUsers.includes(cleanEvalEmail)) return
        if (data.evaluations[email]) {
          state.evaluations[cleanEvalEmail] = data.evaluations[email]
        }
      })
      setStorage(STORAGE_KEY_EVALUATIONS, state.evaluations)
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY_DEADLINES && event.newValue) {
      try {
        state.deadlines = JSON.parse(event.newValue)
        deadlinesTrigger.value++
      } catch (e) {}
    }
    if (event.key === STORAGE_KEY_DELETED_USERS && event.newValue) {
      try {
        state.deletedUsers = JSON.parse(event.newValue)
      } catch (e) {}
    }
    if (event.key === STORAGE_KEY_USERS || event.key === STORAGE_KEY_FILES || event.key === STORAGE_KEY_SUBMISSIONS) {
      userStore.syncFromStorage()
    }
  })
  window.addEventListener('focus', () => {
    userStore.syncFromStorage()
  })
}

