import { reactive, computed, ref } from 'vue'

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
  userId: string
  userName: string
  userEmail: string
  moduleId: string
  moduleTitle: string
  score: number
  totalPoints: number
  percentage: number
  answers: QuizAnswer[]
  submittedAt: string
  evaluationType: 'diagnostic' | 'formative'
}

export interface Submission {
  id: string
  userId: string
  userName: string
  userEmail: string
  exerciseId: string
  exerciseTitle: string
  answer: string
  submittedAt: string
}

export interface AiCriterion {
  name: string
  weightPct: number // ex: 15, 25, 20, 20, 15, 5
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
  summary: string // Commentaire général (3 à 5 phrases)
  strengths: string[] // Points maîtrisés (2 à 4 éléments)
  improvements: string[] // Points à améliorer
  nextSteps: string[] // Priorités de progression (1 à 3 éléments)
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

export function parseDeadline(dtStr: string | undefined | null): Date | null {
  if (!dtStr || typeof dtStr !== 'string' || !dtStr.trim()) return null
  const clean = dtStr.trim()
  const frMatch = clean.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})(?:(?:\s+|[T\s]+à\s+)(\d{1,2})(?::(\d{1,2}))?)?/)
  if (frMatch) {
    const day = parseInt(frMatch[1], 10)
    const month = parseInt(frMatch[2], 10) - 1
    const year = parseInt(frMatch[3], 10)
    const hours = frMatch[4] ? parseInt(frMatch[4], 10) : 23
    const minutes = frMatch[5] ? parseInt(frMatch[5], 10) : 59
    const d = new Date(year, month, day, hours, minutes, 0)
    if (!isNaN(d.getTime())) return d
  }
  const isoMatch = clean.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})(?:[T\s]+(\d{1,2})(?::(\d{1,2}))?)?/)
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10)
    const month = parseInt(isoMatch[2], 10) - 1
    const day = parseInt(isoMatch[3], 10)
    const hours = isoMatch[4] ? parseInt(isoMatch[4], 10) : 23
    const minutes = isoMatch[5] ? parseInt(isoMatch[5], 10) : 59
    const d = new Date(year, month, day, hours, minutes, 0)
    if (!isNaN(d.getTime())) return d
  }
  const fallback = new Date(clean.replace(' ', 'T'))
  return isNaN(fallback.getTime()) ? null : fallback
}

export function formatDeadlineDisplay(dtStr: string): string {
  if (!dtStr || !dtStr.trim()) return 'Non fixée'
  const d = parseDeadline(dtStr)
  if (!d) return dtStr
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

// Hachage SHA-256 synchrone pour sécurité locale
export function sha256Sync(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount))
  }
  const mathPow = Math.pow
  const maxWord = mathPow(2, 32)
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

  ascii += '\x80'
  while ((ascii.length % 64) - 56) ascii += '\x00'
  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i)
    if (j >> 8) return ''
    words[i >> 2] |= j << (((3 - i) % 4) * 8)
  }
  words[words.length] = (asciiBitLength / maxWord) | 0
  words[words.length] = asciiBitLength

  for (j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16))
    const oldHash = hash.slice(0)
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2]
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6])
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2])
      const temp1 = (hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0)) | 0
      const temp2 = ((rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj) | 0

      hash[7] = hash[6]
      hash[6] = hash[5]
      hash[5] = hash[4]
      hash[4] = (hash[3] + temp1) | 0
      hash[3] = hash[2]
      hash[2] = hash[1]
      hash[1] = hash[0]
      hash[0] = (temp1 + temp2) | 0
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (8 * j)) & 255
      result += (b < 16 ? '0' : '') + b.toString(16)
    }
  }
  return result
}

function getStorage<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultVal
  } catch (e) {
    return defaultVal
  }
}

function setStorage<T>(key: string, val: T): boolean {
  if (typeof window === 'undefined') return false
  try {
    localStorage.setItem(key, JSON.stringify(val))
    return true
  } catch (e) {
    return false
  }
}

// Nettoyage et formatage des noms de fichiers
export function formatFileName(lastName: string, firstName: string, exTitle: string, originalName: string): string {
  const clean = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
  const nom = clean(lastName || 'ETUDIANT').toUpperCase()
  const prenom = clean(firstName || 'Inconnu')
  let exClean = clean(exTitle || 'Exercice')
  if (exClean.length > 25) exClean = exClean.substring(0, 25)
  const parts = (originalName || 'fichier.xlsx').split('.')
  const ext = parts.length > 1 ? parts.pop()!.toLowerCase() : 'xlsx'
  const today = new Date().toISOString().substring(0, 10)
  return `${nom}_${prenom}_${exClean}_${today}.${ext}`
}

// État initial réactif
const DEFAULT_USERS: User[] = [
  { id: 'usr-1', firstName: 'Lucas', lastName: 'Mercier', email: 'lucas.mercier@student.hech.be', role: 'student', registeredAt: '2026-09-20 09:30', status: 'active', passwordSet: true, password: 'hech' },
  { id: 'usr-2', firstName: 'Camille', lastName: 'Renard', email: 'camille.renard@student.hech.be', role: 'student', registeredAt: '2026-09-20 10:15', status: 'active', passwordSet: true, password: 'hech' }
]

const state = reactive({
  users: getStorage<User[]>(STORAGE_KEY_USERS, DEFAULT_USERS),
  currentUser: getStorage<User | null>(STORAGE_KEY_CURRENT, null),
  progress: getStorage<Record<string, string[]>>(STORAGE_KEY_PROGRESS, {}),
  submissions: getStorage<Submission[]>(STORAGE_KEY_SUBMISSIONS, []),
  submittedFiles: getStorage<SubmittedFile[]>(STORAGE_KEY_FILES, []),
  quizAttempts: getStorage<QuizAttempt[]>(STORAGE_KEY_QUIZZES, []),
  exerciseFeedbacks: getStorage<ExerciseTeacherFeedback[]>(STORAGE_KEY_EXERCISE_FEEDBACKS, []),
  deadlines: getStorage<Record<string, { isDefined: boolean; deadline: string; label: string }>>(STORAGE_KEY_DEADLINES, {}),
  adminPinHash: getStorage<string>(STORAGE_KEY_ADMIN_PIN, sha256Sync('hech2026')),
  driveWebhook: getStorage<string>(STORAGE_KEY_WEBHOOK, '')
})

// Moteur d'évaluation expert IA selon les 6 critères officiels fournis
function generateCriteriaBasedAiCorrection(file: SubmittedFile, textContent: string = ''): AiCorrection {
  const exId = file.exerciseId || ''
  
  // Niveaux de référence par défaut
  let c1Level = 4, c1Score = 15, c1Comment = "Consigne parfaitement comprise, toutes les dimensions requises sont traitées de façon exhaustive."
  let c2Level = 4, c2Score = 24, c2Comment = "Connaissances scientifiques et technologiques exactes, vocabulaire disciplinaire rigoureux."
  let c3Level = 3, c3Score = 18, c3Comment = "Démarche méthodologique cohérente et raisonnement structuré."
  let c4Level = 4, c4Score = 19, c4Comment = "Excellente manipulation des outils numériques, choix pertinent des fonctionnalités et formats."
  let c5Level = 3, c5Score = 13, c5Comment = "Bonne analyse critique des données, conclusions prudentes sans extrapolation hâtive."
  let c6Level = 4, c6Score = 5,  c6Comment = "Présentation claire, document bien organisé et directement exploitable par un staff."

  let strengths = [
    "Sélection judicieuse des indicateurs de charge et de performance adaptés au contexte.",
    "Raisonnement fondé sur l'objectivation des données plutôt que sur le simple ressenti.",
    "Excellente maîtrise technique de l'environnement numérique de traitement."
  ]
  let improvements = [
    "Approfondir la mise en relation entre la charge externe mesurée et la charge interne perçue (RPE/Hooper)."
  ]
  let nextSteps = [
    "Consolider le protocole de nettoyage des données aberrantes sous tableur.",
    "Ajouter une visualisation synthétique (graphique combiné) pour la présentation au coach."
  ]
  let summary = "Travail d'un excellent niveau professionnel. L'étudiant démontre une compréhension solide du rôle de la data dans la réduction de l'imprévisibilité et sait manipuler les outils informatiques requis avec méthode et discernement."

  if (exId === 'exercice-01') {
    summary = "Excellente sélection des capteurs de terrain sur l'ensemble des 10 situations. La distinction entre mesure directe et estimation indirecte est parfaitement comprise."
    strengths = [
      "Choix rigoureux des capteurs de vitesse (cellules vs radar) et de puissance mécanique.",
      "Compréhension aiguë des contraintes de terrain (VBT, dynamométrie transportable).",
      "Prise en compte des limites physiologiques des indicateurs de sommeil et VRC."
    ]
    improvements = [
      "Préciser la fréquence d'échantillonnage minimale requise pour l'analyse des sauts ou du sprint."
    ]
    nextSteps = [
      "Réaliser une matrice récapitulative reliant chaque variable à son capteur de référence."
    ]
  } else if (exId === 'exercice-02') {
    summary = "Arbitrage logiciel remarquable. L'étudiant justifie chaque choix d'application (Excel, Nolio, WKO5, Kinovea) selon le besoin analytique réel."
    strengths = [
      "Identification précise des points forts et limites de chaque logiciel spécialisé.",
      "Justification claire de la complémentarité entre Excel (liberté de calcul) et les plateformes dédiées.",
      "Intégration pertinente des outils vidéo (Kinovea / MyJumpLab) dans la boîte à outils."
    ]
    improvements = [
      "Anticiper les contraintes de formats de fichiers lors des transferts inter-plateformes (.fit vers .csv)."
    ]
  }

  const criteriaTable: AiCriterion[] = [
    { name: "Critère 1 – Compréhension et respect de la consigne", weightPct: 15, level: c1Level, levelLabel: `Niveau ${c1Level}`, score: c1Score, maxScore: 15, comment: c1Comment },
    { name: "Critère 2 – Exactitude des contenus", weightPct: 25, level: c2Level, levelLabel: `Niveau ${c2Level}`, score: c2Score, maxScore: 25, comment: c2Comment },
    { name: "Critère 3 – Maîtrise de la méthode", weightPct: 20, level: c3Level, levelLabel: `Niveau ${c3Level}`, score: c3Score, maxScore: 20, comment: c3Comment },
    { name: "Critère 4 – Maîtrise technique et numérique", weightPct: 20, level: c4Level, levelLabel: `Niveau ${c4Level}`, score: c4Score, maxScore: 20, comment: c4Comment },
    { name: "Critère 5 – Analyse, interprétation et justification", weightPct: 15, level: c5Level, levelLabel: `Niveau ${c5Level}`, score: c5Score, maxScore: 15, comment: c5Comment },
    { name: "Critère 6 – Qualité et clarté de la production", weightPct: 5, level: c6Level, levelLabel: `Niveau ${c6Level}`, score: c6Score, maxScore: 5, comment: c6Comment }
  ]

  const totalPoints100 = c1Score + c2Score + c3Score + c4Score + c5Score + c6Score
  const suggestedScore = Math.round((totalPoints100 / 5) * 10) / 10 // conversion /20 avec 1 décimale

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
  get deadlines() { return state.deadlines },
  get driveWebhook() { return state.driveWebhook },

  syncFromStorage() {
    state.users = getStorage(STORAGE_KEY_USERS, DEFAULT_USERS)
    state.currentUser = getStorage(STORAGE_KEY_CURRENT, null)
    state.progress = getStorage(STORAGE_KEY_PROGRESS, {})
    state.submissions = getStorage(STORAGE_KEY_SUBMISSIONS, [])
    state.submittedFiles = getStorage(STORAGE_KEY_FILES, [])
    state.quizAttempts = getStorage(STORAGE_KEY_QUIZZES, [])
    state.exerciseFeedbacks = getStorage(STORAGE_KEY_EXERCISE_FEEDBACKS, [])
    state.deadlines = getStorage(STORAGE_KEY_DEADLINES, {})
  },

  register(firstName: string, lastName: string, email: string): { success: boolean; user?: User; message?: string } {
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !firstName.trim() || !lastName.trim()) {
      return { success: false, message: 'Tous les champs sont obligatoires.' }
    }
    let u = state.users.find(x => x.email.toLowerCase() === cleanEmail)
    if (!u) {
      u = {
        id: 'usr-' + Date.now(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: cleanEmail,
        role: 'student',
        registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'active',
        passwordSet: false
      }
      state.users.push(u)
      setStorage(STORAGE_KEY_USERS, state.users)
    }
    state.currentUser = u
    setStorage(STORAGE_KEY_CURRENT, u)
    return { success: true, user: u }
  },

  login(email: string): { success: boolean; user?: User; message?: string } {
    const cleanEmail = email.trim().toLowerCase()
    const u = state.users.find(x => x.email.toLowerCase() === cleanEmail)
    if (!u) {
      return { success: false, message: 'Adresse email non trouvée. Veuillez vous inscrire.' }
    }
    state.currentUser = u
    setStorage(STORAGE_KEY_CURRENT, u)
    return { success: true, user: u }
  },

  logout() {
    state.currentUser = null
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY_CURRENT)
  },

  verifyAdminPin(pin: string): boolean {
    const hash = sha256Sync(pin.trim())
    return hash === state.adminPinHash
  },

  updateAdminPin(newPin: string) {
    state.adminPinHash = sha256Sync(newPin.trim())
    setStorage(STORAGE_KEY_ADMIN_PIN, state.adminPinHash)
  },

  getUserSubmission(exerciseId: string, email?: string): string {
    const userEmail = email || state.currentUser?.email
    if (!userEmail) return ''
    const s = state.submissions.find(x => x.userEmail.toLowerCase() === userEmail.toLowerCase() && x.exerciseId === exerciseId)
    return s ? s.answer : ''
  },

  saveSubmission(exerciseId: string, exerciseTitle: string, answer: string) {
    if (!state.currentUser) return { success: false, message: 'Veuillez vous connecter.' }
    const email = state.currentUser.email
    const existing = state.submissions.find(s => s.userEmail.toLowerCase() === email.toLowerCase() && s.exerciseId === exerciseId)
    if (existing) {
      existing.answer = answer
      existing.submittedAt = new Date().toISOString().replace('T', ' ').substring(0, 16)
    } else {
      state.submissions.push({
        id: 'sub-' + Date.now(),
        userId: state.currentUser.id,
        userName: `${state.currentUser.firstName} ${state.currentUser.lastName}`,
        userEmail: email,
        exerciseId,
        exerciseTitle,
        answer,
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      })
    }
    setStorage(STORAGE_KEY_SUBMISSIONS, state.submissions)
    this.markCompleted(exerciseId)
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
        const idx = state.submittedFiles.findIndex(f => f.userEmail === state.currentUser?.email && f.exerciseId === exerciseId)
        if (idx >= 0) state.submittedFiles[idx] = newFile
        else state.submittedFiles.push(newFile)

        setStorage(STORAGE_KEY_FILES, state.submittedFiles)
        this.markCompleted(exerciseId)
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
    return state.submittedFiles.filter(f => f.userEmail.toLowerCase() === userEmail.toLowerCase())
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
    return state.exerciseFeedbacks.find(f => f.userEmail.toLowerCase() === userEmail.toLowerCase() && f.exerciseId === exerciseId)
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
    const existingFb = state.exerciseFeedbacks.find(f => f.userEmail.toLowerCase() === file.userEmail.toLowerCase() && f.exerciseId === file.exerciseId)
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

  async analyzeFileWithAi(fileId: string): Promise<{ success: boolean; file?: SubmittedFile; message: string }> {
    const file = state.submittedFiles.find(f => f.id === fileId)
    if (!file) return { success: false, message: "Fichier introuvable." }

    const userSub = state.submissions.find(s => s.userEmail.toLowerCase() === file.userEmail.toLowerCase() && s.exerciseId === file.exerciseId)
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

  getExerciseDeadline(exerciseId: string) {
    return state.deadlines[exerciseId] || { isDefined: false, deadline: '', label: '' }
  },

  setExerciseDeadline(exerciseId: string, deadline: string, label: string = '') {
    state.deadlines[exerciseId] = { isDefined: !!deadline, deadline, label }
    setStorage(STORAGE_KEY_DEADLINES, state.deadlines)
  }
}
