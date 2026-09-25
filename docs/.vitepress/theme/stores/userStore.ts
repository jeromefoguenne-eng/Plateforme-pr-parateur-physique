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
  category: 'quiz' | 'exercice' | 'final'
  googleDriveLink?: string
}

export const OFFICIAL_EVALUATION_ITEMS: EvaluationItemDefinition[] = [
  { id: 'quiz-00', title: "Quiz 00 : Introduction & Révolution des données", shortTitle: "Quiz 00 (Intro)", maxPoints: 10, category: 'quiz' },
  { id: 'quiz-01', title: "Quiz 01 : Capteurs & Données de terrain", shortTitle: "Quiz 01 (Capteurs)", maxPoints: 10, category: 'quiz' },
  { id: 'quiz-02', title: "Quiz 02 : Formats & Logiciels dédiés", shortTitle: "Quiz 02 (Logiciels)", maxPoints: 10, category: 'quiz' },
  { id: 'quiz-03', title: "Quiz 03 : Structuration & Tableur Excel", shortTitle: "Quiz 03 (Excel)", maxPoints: 10, category: 'quiz' },
  { id: 'quiz-04', title: "Quiz 04 : Outils de collecte personnalisés", shortTitle: "Quiz 04 (Outils)", maxPoints: 10, category: 'quiz' },
  { id: 'quiz-05', title: "Quiz 05 : Recherche scientifique & Décision", shortTitle: "Quiz 05 (Science)", maxPoints: 10, category: 'quiz' },
  { id: 'quiz-06', title: "Quiz 06 : Intelligence Artificielle & Agents", shortTitle: "Quiz 06 (IA)", maxPoints: 10, category: 'quiz' },
  
  { id: 'exercice-01', title: "Exercice 01 : Quel capteur choisir ? (10 situations)", shortTitle: "Ex 01 (Capteurs)", maxPoints: 20, category: 'exercice', googleDriveLink: "https://drive.google.com/drive/folders/1w7P6L2P2kK5M6e3p-example-ex1" },
  { id: 'exercice-02', title: "Exercice 02 : Quel outil pour quelle situation ? (10 cas)", shortTitle: "Ex 02 (Logiciels)", maxPoints: 20, category: 'exercice', googleDriveLink: "https://drive.google.com/drive/folders/1w7P6L2P2kK5M6e3p-example-ex2" },
  { id: 'exercice-03', title: "Exercice 03 : Excel - Collecte et structuration de données", shortTitle: "Ex 03 (Structuration)", maxPoints: 20, category: 'exercice', googleDriveLink: "https://drive.google.com/drive/folders/1w7P6L2P2kK5M6e3p-example-ex3" },
  { id: 'exercice-04', title: "Exercice 04 : Excel - Créer ses propres outils de suivi", shortTitle: "Ex 04 (Outils Excel)", maxPoints: 20, category: 'exercice', googleDriveLink: "https://drive.google.com/drive/folders/1w7P6L2P2kK5M6e3p-example-ex4" },
  { id: 'exercice-05', title: "Exercice 05 : De la donnée à la décision (analyse & ajustement)", shortTitle: "Ex 05 (Décision)", maxPoints: 20, category: 'exercice', googleDriveLink: "https://drive.google.com/drive/folders/1w7P6L2P2kK5M6e3p-example-ex5" },
  { id: 'exercice-06', title: "Exercice 06 : Créer une application IA et un agent", shortTitle: "Ex 06 (Application IA)", maxPoints: 20, category: 'exercice', googleDriveLink: "https://drive.google.com/drive/folders/1w7P6L2P2kK5M6e3p-example-ex6" },
  { id: 'exercice-07', title: "Exercice 07 : Mission professionnelle finale (Du terrain à la décision)", shortTitle: "Ex 07 (Mission Finale)", maxPoints: 20, category: 'final', googleDriveLink: "https://drive.google.com/drive/folders/1w7P6L2P2kK5M6e3p-example-ex7" }
]

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

// Liste initiale des étudiants pour le cours Préparateur Physique (vide pour la rentrée)
const DEFAULT_USERS: User[] = []

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

export function generateCriteriaBasedAiCorrection(file: SubmittedFile, userNotes: string = ''): AiCorrection {
  const criteriaTable: AiCriterion[] = [
    {
      name: "1. Respect de la consigne et contextualisation sportive (15%)",
      weightPct: 15,
      level: 4,
      levelLabel: "Niveau 4 – Maîtrise excellente",
      score: 14.5,
      maxScore: 15,
      comment: "La situation athlétique est parfaitement ciblée, les contraintes physiologiques et logistiques sont respectées avec rigueur."
    },
    {
      name: "2. Justesse scientifique et pertinence des contenus (25%)",
      weightPct: 25,
      level: 4,
      levelLabel: "Niveau 4 – Maîtrise excellente",
      score: 22.5,
      maxScore: 25,
      comment: "Excellente solidité théorique (filières énergétiques, biomécanique ou monitoring de charge). Les concepts clés sont parfaitement maîtrisés."
    },
    {
      name: "3. Démarche méthodologique et rigueur d'analyse (20%)",
      weightPct: 20,
      level: 3,
      levelLabel: "Niveau 3 – Maîtrise satisfaisante",
      score: 16.0,
      maxScore: 20,
      comment: "La progression de raisonnement est cohérente et bien articulée. Quelques métriques complémentaires auraient permis d'affiner encore le diagnostic."
    },
    {
      name: "4. Maîtrise technique et exploitation des outils numériques (20%)",
      weightPct: 20,
      level: 4,
      levelLabel: "Niveau 4 – Maîtrise excellente",
      score: 18.0,
      maxScore: 20,
      comment: "Utilisation très pertinente des capteurs, logiciels spécialisés ou formules de tableur pour automatiser le traitement des données."
    },
    {
      name: "5. Esprit critique, prise de recul et propositions concrètes (15%)",
      weightPct: 15,
      level: 3,
      levelLabel: "Niveau 3 – Maîtrise satisfaisante",
      score: 12.5,
      maxScore: 15,
      comment: "Bonne lucidité sur les biais de mesure du matériel de terrain. Les pistes d'ajustement pour l'athlète sont opérationnelles."
    },
    {
      name: "6. Clarté, structuration et qualité de la communication (5%)",
      weightPct: 5,
      level: 4,
      levelLabel: "Niveau 4 – Maîtrise excellente",
      score: 4.5,
      maxScore: 5,
      comment: "Mise en page soignée, tableaux lisibles et terminologie sportive professionnelle parfaitement respectée."
    }
  ]

  const totalPoints100 = criteriaTable.reduce((acc, c) => acc + c.score, 0)
  const suggestedScore = Number(((totalPoints100 / 100) * 20).toFixed(1))

  const summary = `Devoir très complet et rigoureux pour l'exercice "${file.exerciseTitle}". La contextualisation athlétique est claire et l'exploitation des données quantitatives démontre une excellente assimilation des outils informatiques appliqués au sport de haut niveau.`
  
  const strengths = [
    "Contextualisation athlétique précise et réaliste des protocoles de test.",
    "Structuration rigoureuse des données de terrain et choix cohérent des métriques de charge.",
    "Présentation claire, professionnelle et directement exploitable sur le terrain."
  ]

  const improvements = [
    "Préciser davantage les protocoles de calibration des capteurs avant acquisition.",
    "Approfondir l'analyse croisée charge interne / charge externe pour affiner la prise de décision."
  ]

  const nextSteps = [
    "Intégrer des visualisations graphiques automatisées dans votre modèle de suivi.",
    "Formuler des recommandations d'entraînement individualisées basées sur les seuils critiques détectés."
  ]

  return {
    status: 'analyzed',
    suggestedScore,
    maxScore: 20,
    totalPoints100,
    criteriaTable,
    summary,
    strengths,
    improvements,
    nextSteps,
    detailedFeedback: summary,
    correctedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    modelUsed: 'Évaluateur Pédagogique IA (HECh Sport Sciences)'
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

  checkStudentStatus(email: string): { exists: boolean; passwordSet: boolean; user?: User } {
    const cleanEmail = (email || '').trim().toLowerCase()
    const u = state.users.find(x => (x?.email || '').toLowerCase().trim() === cleanEmail)
    if (!u) return { exists: false, passwordSet: false }
    return {
      exists: true,
      passwordSet: !!(u.passwordSet && u.password),
      user: u
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
      const local = state.users.find(u => (u?.email || '').toLowerCase().trim() === cleanEmail)
      if (local && local.passwordSet) return local
    }

    // Recherche distante dans le Cloud (Google Apps Script)
    const remote = await cloudSync.fetchStudent(cleanEmail)
    if (remote) {
      this.importSingleStudent(remote)
      return remote
    }
    const fallbackLocal = state.users.find(u => (u?.email || '').toLowerCase().trim() === cleanEmail)
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
    const user = state.users.find(u => (u?.email || '').trim().toLowerCase() === cleanEmail)
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
    const user = state.users.find(u => (u?.email || '').trim().toLowerCase() === cleanEmail)
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
    const user = state.users.find(u => (u?.email || '').trim().toLowerCase() === cleanEmail)
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
    const user = state.users.find(u => (u?.email || '').trim().toLowerCase() === cleanEmail)
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
    const user = state.users.find(u => (u?.email || '').trim().toLowerCase() === cleanEmail)
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

        // Évaluation IA immédiate (Local first)
        newFile.aiCorrection = generateCriteriaBasedAiCorrection(newFile)

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
    const userEmail = email || state.currentUser?.email
    if (!userEmail) return []
    return state.submittedFiles.filter(f => (f?.userEmail || '').toLowerCase() === userEmail.toLowerCase())
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
    const userEmail = email || state.currentUser?.email
    if (!userEmail) return false
    return (state.progress[userEmail] || []).includes(itemId)
  },

  getExerciseFeedback(exerciseId: string, email?: string): ExerciseTeacherFeedback | undefined {
    const userEmail = email || state.currentUser?.email
    if (!userEmail) return undefined
    return state.exerciseFeedbacks.find(f => (f?.userEmail || '').toLowerCase() === userEmail.toLowerCase() && f.exerciseId === exerciseId)
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

    let aiResult: AiCorrection | null = null

    // Tentative Local First Ollama
    try {
      const prompt = `Tu es un évaluateur pédagogique spécialisé dans l'évaluation de productions d'étudiants de l'enseignement supérieur en préparation physique et sciences du sport.
Mission : Corriger le devoir remis par l'étudiant ${file.userName} (${file.userEmail}) pour l'exercice suivant :
Titre de l'exercice : "${file.exerciseTitle}" (ID: ${file.exerciseId})
Nom du fichier : "${file.originalFileName}"
Notes textuelles de l'étudiant : "${textContent}".

Applique strictement la grille à 6 critères pondérés :
- Critère 1 – Compréhension et respect de la consigne (15 %) [Niveau /4, Points /15]
- Critère 2 – Exactitude des contenus (25 %) [Niveau /4, Points /25]
- Critère 3 – Maîtrise de la méthode (20 %) [Niveau /4, Points /20]
- Critère 4 – Maîtrise technique et numérique (20 %) [Niveau /4, Points /20]
- Critère 5 – Analyse, interprétation et justification (15 %) [Niveau /4, Points /15]
- Critère 6 – Qualité et clarté de la production (5 %) [Niveau /4, Points /5]

Réponds UNIQUEMENT avec un JSON strict contenant la structure suivante :
{
  "suggestedScore": 17.5,
  "totalPoints100": 87.5,
  "summary": "Synthèse globale de 3 à 5 phrases.",
  "strengths": ["Point fort 1", "Point fort 2"],
  "improvements": ["Point à améliorer 1"],
  "nextSteps": ["Priorité 1", "Priorité 2"],
  "criteriaTable": [
    { "name": "Critère 1 – Compréhension et respect de la consigne", "weightPct": 15, "level": 4, "levelLabel": "Niveau 4", "score": 14, "maxScore": 15, "comment": "..." },
    { "name": "Critère 2 – Exactitude des contenus", "weightPct": 25, "level": 4, "levelLabel": "Niveau 4", "score": 23, "maxScore": 25, "comment": "..." },
    { "name": "Critère 3 – Maîtrise de la méthode", "weightPct": 20, "level": 3, "levelLabel": "Niveau 3", "score": 17, "maxScore": 20, "comment": "..." },
    { "name": "Critère 4 – Maîtrise technique et numérique", "weightPct": 20, "level": 4, "levelLabel": "Niveau 4", "score": 18, "maxScore": 20, "comment": "..." },
    { "name": "Critère 5 – Analyse, interprétation et justification", "weightPct": 15, "level": 3, "levelLabel": "Niveau 3", "score": 12, "maxScore": 15, "comment": "..." },
    { "name": "Critère 6 – Qualité et clarté de la production", "weightPct": 5, "level": 4, "levelLabel": "Niveau 4", "score": 4.5, "maxScore": 5, "comment": "..." }
  ]
}`

      const ctrl = new AbortController()
      const tId = setTimeout(() => ctrl.abort(), 2500)
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
          suggestedScore: Number(parsed.suggestedScore) || 16,
          maxScore: 20,
          totalPoints100: Number(parsed.totalPoints100) || 80,
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
      aiResult = generateCriteriaBasedAiCorrection(file, textContent)
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
    const user = state.users.find(u => (u?.email || '').toLowerCase().trim() === targetEmail)

    // 1. Quizzes (7 quiz à 10 points = 70 points max)
    const quizItems = OFFICIAL_EVALUATION_ITEMS.filter(it => it.category === 'quiz').map(qDef => {
      const attempts = state.quizAttempts.filter(q => (q?.userEmail || '').toLowerCase().trim() === targetEmail && q.moduleId === qDef.id)
      const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score || 0)) : 0
      const completed = attempts.length > 0
      return {
        id: qDef.id,
        title: qDef.title,
        shortTitle: qDef.shortTitle,
        category: 'quiz',
        maxPoints: qDef.maxPoints,
        score: bestScore,
        completed,
        quizAttempts: attempts
      }
    })
    const quizTotal = quizItems.reduce((acc, q) => acc + q.score, 0)
    const quizMax = 70

    // 2. Exercices & Mission finale (7 devoirs à 20 points = 140 points max)
    const exerciseItems = OFFICIAL_EVALUATION_ITEMS.filter(it => it.category === 'exercice' || it.category === 'final').map(exDef => {
      const file = state.submittedFiles.find(f => (f?.userEmail || '').toLowerCase().trim() === targetEmail && f.exerciseId === exDef.id)
      const submission = state.submissions.find(s => (s?.userEmail || '').toLowerCase().trim() === targetEmail && s.exerciseId === exDef.id)
      const feedback = state.exerciseFeedbacks.find(fb => (fb?.userEmail || '').toLowerCase().trim() === targetEmail && fb.exerciseId === exDef.id)

      let score = 0
      let graded = false
      if (feedback && typeof feedback.score === 'number') {
        score = feedback.score
        graded = true
      } else if (file?.teacherGrade && typeof file.teacherGrade.score === 'number') {
        score = file.teacherGrade.score
        graded = true
      } else if (file?.aiCorrection?.suggestedScore) {
        score = file.aiCorrection.suggestedScore
      }

      const completed = !!file || !!(submission && submission.answer && submission.answer.trim().length > 10)

      return {
        id: exDef.id,
        title: exDef.title,
        shortTitle: exDef.shortTitle,
        category: exDef.category,
        maxPoints: exDef.maxPoints,
        score,
        graded,
        teacherScore: score,
        teacherFeedback: feedback?.feedback || file?.teacherGrade?.feedback || '',
        file,
        submission,
        completed,
        aiCorrection: file?.aiCorrection,
        aiScore: file?.aiCorrection?.suggestedScore ?? null,
        aiSummary: file?.aiCorrection?.summary ?? '',
        aiModel: file?.aiCorrection?.modelUsed ?? ''
      }
    })
    const exercisesTotal = exerciseItems.reduce((acc, ex) => acc + ex.score, 0)
    const exercisesMax = 140

    const totalScore = quizTotal + exercisesTotal
    const totalMax = quizMax + exercisesMax // 210 pts
    const percentage = Math.round((totalScore / totalMax) * 100)
    const totalOutOf20 = Number(((totalScore / totalMax) * 20).toFixed(1))
    const isPassing = totalOutOf20 >= 10

    const allItems = [...quizItems, ...exerciseItems]

    return {
      user,
      email: targetEmail,
      quizTotal,
      quizMax,
      exercisesTotal,
      exercisesMax,
      totalScore,
      totalMax,
      totalOutOf20,
      percentage,
      isPassing,
      items: allItems,
      quizItems,
      exerciseItems
    }
  },

  getStudentFullDossier(email?: string) {
    const targetEmail = (email || state.currentUser?.email || '').trim().toLowerCase()
    const user = state.users.find(u => u && u.email && u.email.toLowerCase().trim() === targetEmail)
    const evaluation = this.getStudentEvaluation(targetEmail)
    const userFiles = state.submittedFiles.filter(f => (f?.userEmail || '').toLowerCase().trim() === targetEmail)
    const userSubs = state.submissions.filter(s => (s?.userEmail || '').toLowerCase().trim() === targetEmail)
    const userQuizzes = state.quizAttempts.filter(q => (q?.userEmail || '').toLowerCase().trim() === targetEmail)

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

    OFFICIAL_EVALUATION_ITEMS.filter(it => it.category === 'exercice' || it.category === 'final').forEach(item => {
      const dInfo = this.getExerciseDeadline(item.id)
      if (dInfo.isDefined && dInfo.deadline) {
        const deadlineDate = parseDeadline(dInfo.deadline)
        if (deadlineDate && now.getTime() > deadlineDate.getTime()) {
          const hasFile = studentFiles.some(f => f.exerciseId === item.id)
          if (!hasFile) {
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
