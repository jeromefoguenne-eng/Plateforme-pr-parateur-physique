// =========================================================================
// BASE DE DONNÉES COMPLÈTE DES TRAVAUX ET QUIZ ÉTUDIANTS (HECh Prépa Physique 2026)
// Maxim Legentil, Emma Lemaire, Antoine Daltin, Matteo Manno, Achile Capitaine
// =========================================================================
import type { User, SubmittedFile, Submission, QuizAttempt } from './userStore'

export const INITIAL_REAL_USERS: User[] = [
  {
    id: 'user-prepa-01',
    firstName: 'Maxim',
    lastName: 'Legentil',
    email: 'maxim.legentil@student.hech.be',
    role: 'student',
    registeredAt: '2026-09-15 09:00',
    status: 'active',
    password: 'hech2026',
    passwordSet: true,
    aliases: ['legentil.maxim@student.hech.be', 'maxim.legentil@hech.be', 'm.legentil@student.hech.be']
  },
  {
    id: 'user-prepa-02',
    firstName: 'Emma',
    lastName: 'Lemaire',
    email: 'emma.lemaire@student.hech.be',
    role: 'student',
    registeredAt: '2026-09-15 09:00',
    status: 'active',
    password: 'hech2026',
    passwordSet: true,
    aliases: ['lemaire.emma@student.hech.be', 'emma.lemaire@hech.be', 'e.lemaire@student.hech.be']
  },
  {
    id: 'user-prepa-03',
    firstName: 'Antoine',
    lastName: 'Daltin',
    email: 'antoine.daltin@student.hech.be',
    role: 'student',
    registeredAt: '2026-09-15 09:00',
    status: 'active',
    password: 'hech2026',
    passwordSet: true,
    aliases: ['daltin.antoine@student.hech.be', 'antoine.daltin@hech.be', 'a.daltin@student.hech.be']
  },
  {
    id: 'user-prepa-04',
    firstName: 'Matteo',
    lastName: 'Manno',
    email: 'matteo.manno@student.hech.be',
    role: 'student',
    registeredAt: '2026-09-15 09:00',
    status: 'active',
    password: 'hech2026',
    passwordSet: true,
    aliases: ['manno.matteo@student.hech.be', 'matteo.manno@hech.be', 'm.manno@student.hech.be']
  },
  {
    id: 'user-prepa-05',
    firstName: 'Achile',
    lastName: 'Capitaine',
    email: 'achile.capitaine@student.hech.be',
    role: 'student',
    registeredAt: '2026-09-15 09:00',
    status: 'active',
    password: 'hech2026',
    passwordSet: true,
    aliases: ['achille.capitaine@student.hech.be', 'capitaine.achile@student.hech.be', 'achile.capitaine@hech.be', 'achille.capitaine@hech.be']
  }
]

export const INITIAL_REAL_FILES: SubmittedFile[] = [
  // ==================== 1. MAXIM LEGENTIL (8/8 devoirs) ====================
  {
    id: 'file-legentil-ex01',
    userId: 'user-prepa-01',
    userName: 'Maxim Legentil',
    userEmail: 'maxim.legentil@student.hech.be',
    exerciseId: 'exercice-01',
    exerciseTitle: 'Exercice 01 : Quel capteur choisir ? (10 situations)',
    originalFileName: 'LEGENTIL_Maxim_Exercice_01_Capteurs.docx',
    formattedFileName: 'LEGENTIL_Maxim_exercice-01.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 45210,
    submittedAt: '2026-09-28 14:20',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `RAPPORT CAPTEURS ET INSTRUMENTATION DU PRÉPARATEUR PHYSIQUE
Maxim Legentil
10 situations analysées : GPS 15Hz football Catapult, IMU rugby, cellules photoélectriques sprint Witty, LPT Vitruve VBT, plateformes de force ForceDecks Kistler CMJ, capteurs de puissance Favero Assioma, Polar H10 HRV rMSSD, analyseur de lactate Lactate Scout, Biodex dynamomètre isocinétique, impédancemètre InBody.`
  },
  {
    id: 'file-legentil-ex02a',
    userId: 'user-prepa-01',
    userName: 'Maxim Legentil',
    userEmail: 'maxim.legentil@student.hech.be',
    exerciseId: 'exercice-02a',
    exerciseTitle: 'Exercice 02.a : Extraction Power Query & Nutrition (Natation)',
    originalFileName: 'LEGENTIL_Maxim_Exercice_02a_PowerQuery_Natation.xlsx',
    formattedFileName: 'LEGENTIL_Maxim_exercice-02a.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 38400,
    submittedAt: '2026-10-02 11:30',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `POWER QUERY ET MONITORING NUTRITIONNEL NATATION
Maxim Legentil
Requête Power Query active nettoyant les 12 nageurs sur 7 jours. Colonnes calculées : Glucides_g_kg (cible 7-10 g/kg) et Proteines_g_kg (1.8 g/kg). Détection d'un déficit énergétique chronique les mercredi/jeudi sur les séances biquotidiennes.`
  },
  {
    id: 'file-legentil-ex02b',
    userId: 'user-prepa-01',
    userName: 'Maxim Legentil',
    userEmail: 'maxim.legentil@student.hech.be',
    exerciseId: 'exercice-02',
    exerciseTitle: 'Exercice 02.b : Quel outil pour quelle situation ? (10 cas)',
    originalFileName: 'LEGENTIL_Maxim_Exercice_02b_Logiciels.docx',
    formattedFileName: 'LEGENTIL_Maxim_exercice-02.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 31200,
    submittedAt: '2026-10-06 16:45',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `ANALYSE LOGICIELS DU PRÉPARATEUR PHYSIQUE
Maxim Legentil
10 cas : Athlete Monitoring Kitman Labs, Kinovea vidéo, TeamBuildr musculation, GoldenCheetah WKO5 cyclisme, Excel Power Query, MyJump Lab, Google Forms Hooper, GymAware VBT, Catapult OpenField, Agent IA Python.`
  },
  {
    id: 'file-legentil-ex03',
    userId: 'user-prepa-01',
    userName: 'Maxim Legentil',
    userEmail: 'maxim.legentil@student.hech.be',
    exerciseId: 'exercice-03',
    exerciseTitle: 'Exercice 03 : Excel - Collecte et structuration de données',
    originalFileName: 'LEGENTIL_Maxim_Exercice_03_Structuration_U18.xlsx',
    formattedFileName: 'LEGENTIL_Maxim_exercice-03.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 52100,
    submittedAt: '2026-10-12 18:00',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `TIDY DATA FOOTBALL U18
Maxim Legentil
Structure relationnelle standardisée : Date, ID_Joueur, Poste, Type_Seance, Duree_min, RPE_Borg, Charge_Session_UA, Sommeil, Courbatures, Stress, Fatigue, Hooper_Total. Validation de données et listes déroulantes.`
  },
  {
    id: 'file-legentil-ex04',
    userId: 'user-prepa-01',
    userName: 'Maxim Legentil',
    userEmail: 'maxim.legentil@student.hech.be',
    exerciseId: 'exercice-04',
    exerciseTitle: 'Exercice 04 : Excel - Créer ses propres outils de suivi',
    originalFileName: 'LEGENTIL_Maxim_Exercice_04_Outil_Suivi_Hooper_RPE.xlsx',
    formattedFileName: 'LEGENTIL_Maxim_exercice-04.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 64200,
    submittedAt: '2026-10-18 10:15',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `TABLEAU DE BORD DYNAMIQUE HOOPER ET CHARGE ACWR
Maxim Legentil
Calcul charge aiguë 7j, charge chronique 28j, ratio ACWR dynamique, alertes conditionnelles vert/orange/rouge (> 1.5 danger blessure), graphiques avec segments slicers interactifs.`
  },
  {
    id: 'file-legentil-ex05',
    userId: 'user-prepa-01',
    userName: 'Maxim Legentil',
    userEmail: 'maxim.legentil@student.hech.be',
    exerciseId: 'exercice-05',
    exerciseTitle: 'Exercice 05 : De la donnée à la décision (analyse & ajustement)',
    originalFileName: 'LEGENTIL_Maxim_Exercice_05_Decision_Thomas.docx',
    formattedFileName: 'LEGENTIL_Maxim_exercice-05.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 39800,
    submittedAt: '2026-10-24 15:30',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `ÉTUDE DE CAS : ANALYSE ET AJUSTEMENT THOMAS
Maxim Legentil
Surcharge ACWR 1.62 détectée, baisse CMJ -14%, Hooper 18/20. Plan d'action : décharge vélo mardi, repos mercredi, reprise adaptée jeudi, limitation temps de jeu 30 min samedi.`
  },
  {
    id: 'file-legentil-ex06',
    userId: 'user-prepa-01',
    userName: 'Maxim Legentil',
    userEmail: 'maxim.legentil@student.hech.be',
    exerciseId: 'exercice-06',
    exerciseTitle: 'Exercice 06 : Créer une application IA et un agent',
    originalFileName: 'LEGENTIL_Maxim_Exercice_06_Application_Agent_IA.docx',
    formattedFileName: 'LEGENTIL_Maxim_exercice-06.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 41200,
    submittedAt: '2026-10-29 11:15',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `AGENT IA DE MONITORING DU PRÉPARATEUR PHYSIQUE
Maxim Legentil
Prompt système structuré : analyse JSON Hooper/RPE/GPS, détection Z-score et ACWR, génération automatique de recommandations opérationnelles pour le coach à 8h45.`
  },
  {
    id: 'file-legentil-ex07',
    userId: 'user-prepa-01',
    userName: 'Maxim Legentil',
    userEmail: 'maxim.legentil@student.hech.be',
    exerciseId: 'exercice-07',
    exerciseTitle: 'Exercice 07 : Modèle de lutte contre le surentraînement en football',
    originalFileName: 'LEGENTIL_Maxim_Exercice_07_Mission_Finale_Football.docx',
    formattedFileName: 'LEGENTIL_Maxim_exercice-07.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 85600,
    submittedAt: '2026-11-04 17:30',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `MISSION FINALE : MODÈLE INTÉGRATIF DE PRÉVENTION DU SURENTRAÎNEMENT
Maxim Legentil
Surveillance à 4 piliers (Externe GPS 15Hz, Interne sRPE & HRV Polar H10, Neuromusculaire CMJ Kistler, Psychologique Hooper/RESTQ). Modélisation de la monotonie et de la contrainte. Arbre décisionnel multidisciplinaire.`
  },

  // ==================== 2. EMMA LEMAIRE (8/8 devoirs) ====================
  {
    id: 'file-lemaire-ex01',
    userId: 'user-prepa-02',
    userName: 'Emma Lemaire',
    userEmail: 'emma.lemaire@student.hech.be',
    exerciseId: 'exercice-01',
    exerciseTitle: 'Exercice 01 : Quel capteur choisir ? (10 situations)',
    originalFileName: 'LEMAIRE_Emma_Exercice_01_Capteurs.docx',
    formattedFileName: 'LEMAIRE_Emma_exercice-01.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 42100,
    submittedAt: '2026-09-29 16:10',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `ANALYSE COMPARATIVE DES CAPTEURS
Emma Lemaire
GPS Catapult 10Hz, plateformes de force ForceDecks, LPT Vitruve, Polar H10 HRV, Lactate Scout, cellules Microgate Witty, capteurs de puissance Favero, Biodex isocinétique, Kinovea, InBody.`
  },
  {
    id: 'file-lemaire-ex02a',
    userId: 'user-prepa-02',
    userName: 'Emma Lemaire',
    userEmail: 'emma.lemaire@student.hech.be',
    exerciseId: 'exercice-02a',
    exerciseTitle: 'Exercice 02.a : Extraction Power Query & Nutrition (Natation)',
    originalFileName: 'LEMAIRE_Emma_Exercice_02a_PowerQuery.xlsx',
    formattedFileName: 'LEMAIRE_Emma_exercice-02a.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 37500,
    submittedAt: '2026-10-03 14:00',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `POWER QUERY MONITORING NUTRITION
Emma Lemaire
Transformation automatisée des données de 12 nageurs, nettoyage des anomalies, calcul des ratios Glucides_g_kg et Proteines_g_kg. Plan de recharge glucidique ciblé.`
  },
  {
    id: 'file-lemaire-ex02b',
    userId: 'user-prepa-02',
    userName: 'Emma Lemaire',
    userEmail: 'emma.lemaire@student.hech.be',
    exerciseId: 'exercice-02',
    exerciseTitle: 'Exercice 02.b : Quel outil pour quelle situation ? (10 cas)',
    originalFileName: 'LEMAIRE_Emma_Exercice_02b_Logiciels.docx',
    formattedFileName: 'LEMAIRE_Emma_exercice-02.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 32400,
    submittedAt: '2026-10-07 14:30',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `ANALYSE DES OUTILS LOGICIELS DU PRÉPARATEUR PHYSIQUE
Emma Lemaire
10 cas traités : Smartabase, Dartfish, TeamBuildr, WKO5, Excel Power Query, MyJump Lab, Google Forms, GymAware, Catapult OpenField, Script IA.`
  },
  {
    id: 'file-lemaire-ex03',
    userId: 'user-prepa-02',
    userName: 'Emma Lemaire',
    userEmail: 'emma.lemaire@student.hech.be',
    exerciseId: 'exercice-03',
    exerciseTitle: 'Exercice 03 : Excel - Collecte et structuration de données',
    originalFileName: 'LEMAIRE_Emma_Exercice_03_Structuration_U18.xlsx',
    formattedFileName: 'LEMAIRE_Emma_exercice-03.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 49800,
    submittedAt: '2026-10-13 11:20',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `STRUCTURATION TIDY DATA FOOTBALL U18
Emma Lemaire
Tableau normalisé sans cellules fusionnées. Variables : Date, ID, Poste, RPE, Durée, Charge UA, Hooper. Validation des données par liste déroulante.`
  },
  {
    id: 'file-lemaire-ex04',
    userId: 'user-prepa-02',
    userName: 'Emma Lemaire',
    userEmail: 'emma.lemaire@student.hech.be',
    exerciseId: 'exercice-04',
    exerciseTitle: 'Exercice 04 : Excel - Créer ses propres outils de suivi',
    originalFileName: 'LEMAIRE_Emma_Exercice_04_Suivi_Charge.xlsx',
    formattedFileName: 'LEMAIRE_Emma_exercice-04.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 61500,
    submittedAt: '2026-10-19 16:40',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `DASHBOARD CHARGE AIGUË / CHRONIQUE ET HOOPER
Emma Lemaire
Modèle ACWR dynamique avec mise en forme conditionnelle et alertes précoces de surentraînement.`
  },
  {
    id: 'file-lemaire-ex05',
    userId: 'user-prepa-02',
    userName: 'Emma Lemaire',
    userEmail: 'emma.lemaire@student.hech.be',
    exerciseId: 'exercice-05',
    exerciseTitle: 'Exercice 05 : De la donnée à la décision (analyse & ajustement)',
    originalFileName: 'LEMAIRE_Emma_Exercice_05_Decision_Thomas.docx',
    formattedFileName: 'LEMAIRE_Emma_exercice-05.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 38200,
    submittedAt: '2026-10-25 14:15',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `ÉTUDE DE CAS THOMAS : DÉCISION DU PRÉPARATEUR PHYSIQUE
Emma Lemaire
Analyse multifactorielle : ACWR à 1.58, baisse CMJ, Hooper élevé. Prescription de décharge active et régulation du temps de jeu.`
  },
  {
    id: 'file-lemaire-ex06',
    userId: 'user-prepa-02',
    userName: 'Emma Lemaire',
    userEmail: 'emma.lemaire@student.hech.be',
    exerciseId: 'exercice-06',
    exerciseTitle: 'Exercice 06 : Créer une application IA et un agent',
    originalFileName: 'LEMAIRE_Emma_Exercice_06_Agent_IA.docx',
    formattedFileName: 'LEMAIRE_Emma_exercice-06.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 40500,
    submittedAt: '2026-10-30 17:00',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `AGENT INTELLIGENT DE CONSEIL EN CHARGE D'ENTRAÎNEMENT
Emma Lemaire
Définition du persona IA, filtrage des valeurs aberrantes et synthèse matinale pour le staff.`
  },
  {
    id: 'file-lemaire-ex07',
    userId: 'user-prepa-02',
    userName: 'Emma Lemaire',
    userEmail: 'emma.lemaire@student.hech.be',
    exerciseId: 'exercice-07',
    exerciseTitle: 'Exercice 07 : Modèle de lutte contre le surentraînement en football',
    originalFileName: 'LEMAIRE_Emma_Exercice_07_Mission_Finale.docx',
    formattedFileName: 'LEMAIRE_Emma_exercice-07.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 81400,
    submittedAt: '2026-11-03 18:45',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `MISSION FINALE : PRÉVENTION DU SURENTRAÎNEMENT EN FOOTBALL PROFESSIONNEL
Emma Lemaire
Approche intégrée GPS, HRV, Hooper et CMJ. Algorithme de détection du surmenage non fonctionnel et arbre de décision.`
  },

  // ==================== 3. ANTOINE DALTIN (7/8 devoirs) ====================
  {
    id: 'file-daltin-ex01',
    userId: 'user-prepa-03',
    userName: 'Antoine Daltin',
    userEmail: 'antoine.daltin@student.hech.be',
    exerciseId: 'exercice-01',
    exerciseTitle: 'Exercice 01 : Quel capteur choisir ? (10 situations)',
    originalFileName: 'DALTIN_Antoine_Exercice_01_Capteurs.docx',
    formattedFileName: 'DALTIN_Antoine_exercice-01.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 41800,
    submittedAt: '2026-09-29 11:40',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `SÉLECTION DES CAPTEURS EN PRÉPARATION PHYSIQUE
Antoine Daltin
10 situations : GPS 15Hz, plateformes de force CMJ, VBT GymAware, cellules sprint Witty, Polar H10, analyseur de lactate.`
  },
  {
    id: 'file-daltin-ex02a',
    userId: 'user-prepa-03',
    userName: 'Antoine Daltin',
    userEmail: 'antoine.daltin@student.hech.be',
    exerciseId: 'exercice-02a',
    exerciseTitle: 'Exercice 02.a : Extraction Power Query & Nutrition (Natation)',
    originalFileName: 'DALTIN_Antoine_Exercice_02a_PowerQuery.xlsx',
    formattedFileName: 'DALTIN_Antoine_exercice-02a.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 36200,
    submittedAt: '2026-10-04 16:30',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `TRAITEMENT POWER QUERY NUTRITION NATATION
Antoine Daltin
Nettoyage des données, typage, suppression des valeurs nulles, calcul des ratios glucides et protéines par kg de masse corporelle.`
  },
  {
    id: 'file-daltin-ex02b',
    userId: 'user-prepa-03',
    userName: 'Antoine Daltin',
    userEmail: 'antoine.daltin@student.hech.be',
    exerciseId: 'exercice-02',
    exerciseTitle: 'Exercice 02.b : Quel outil pour quelle situation ? (10 cas)',
    originalFileName: 'DALTIN_Antoine_Exercice_02b_Logiciels.docx',
    formattedFileName: 'DALTIN_Antoine_exercice-02.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 30100,
    submittedAt: '2026-10-08 11:10',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `LOGICIELS ET APPLICATIONS EN PRÉPARATION PHYSIQUE
Antoine Daltin
Revue des 10 solutions logicielles professionnelles.`
  },
  {
    id: 'file-daltin-ex03',
    userId: 'user-prepa-03',
    userName: 'Antoine Daltin',
    userEmail: 'antoine.daltin@student.hech.be',
    exerciseId: 'exercice-03',
    exerciseTitle: 'Exercice 03 : Excel - Collecte et structuration de données',
    originalFileName: 'DALTIN_Antoine_Exercice_03_Structuration.xlsx',
    formattedFileName: 'DALTIN_Antoine_exercice-03.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 48500,
    submittedAt: '2026-10-14 15:20',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `BASE DE DONNÉES TIDY DATA FOOTBALL
Antoine Daltin
Format tabulaire propre, colonnes typées, menu déroulant de validation.`
  },
  {
    id: 'file-daltin-ex04',
    userId: 'user-prepa-03',
    userName: 'Antoine Daltin',
    userEmail: 'antoine.daltin@student.hech.be',
    exerciseId: 'exercice-04',
    exerciseTitle: 'Exercice 04 : Excel - Créer ses propres outils de suivi',
    originalFileName: 'DALTIN_Antoine_Exercice_04_Suivi_Charge.xlsx',
    formattedFileName: 'DALTIN_Antoine_exercice-04.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 58900,
    submittedAt: '2026-10-20 18:00',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `OUTIL DE SUIVI CHARGE ET RATIO ACWR
Antoine Daltin
Calcul des moyennes mobiles 7j et 28j, détection visuelle des pics de charge.`
  },
  {
    id: 'file-daltin-ex05',
    userId: 'user-prepa-03',
    userName: 'Antoine Daltin',
    userEmail: 'antoine.daltin@student.hech.be',
    exerciseId: 'exercice-05',
    exerciseTitle: 'Exercice 05 : De la donnée à la décision (analyse & ajustement)',
    originalFileName: 'DALTIN_Antoine_Exercice_05_Decision.docx',
    formattedFileName: 'DALTIN_Antoine_exercice-05.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 37400,
    submittedAt: '2026-10-26 10:30',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `ANALYSE DU CAS THOMAS
Antoine Daltin
Diagnostic de surmenage aigu, ajustement du microcycle et réduction des impacts.`
  },
  {
    id: 'file-daltin-ex06',
    userId: 'user-prepa-03',
    userName: 'Antoine Daltin',
    userEmail: 'antoine.daltin@student.hech.be',
    exerciseId: 'exercice-06',
    exerciseTitle: 'Exercice 06 : Créer une application IA et un agent',
    originalFileName: 'DALTIN_Antoine_Exercice_06_Agent_IA.docx',
    formattedFileName: 'DALTIN_Antoine_exercice-06.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 39100,
    submittedAt: '2026-10-31 16:15',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `CAHIER DES CHARGES D'UN AGENT IA EN CHARGE PHYSIQUE
Antoine Daltin
Prompting expert et automatisation du rapport de fatigue.`
  },

  // ==================== 4. MATTEO MANNO (6/8 devoirs) ====================
  {
    id: 'file-manno-ex01',
    userId: 'user-prepa-04',
    userName: 'Matteo Manno',
    userEmail: 'matteo.manno@student.hech.be',
    exerciseId: 'exercice-01',
    exerciseTitle: 'Exercice 01 : Quel capteur choisir ? (10 situations)',
    originalFileName: 'MANNO_Matteo_Exercice_01_Capteurs.docx',
    formattedFileName: 'MANNO_Matteo_exercice-01.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 39500,
    submittedAt: '2026-09-30 18:20',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `CHOIX DE CAPTEURS EN PRÉPARATION PHYSIQUE
Matteo Manno
Étude comparative de 10 technologies : GPS haute fréquence, radar Doppler, dynamomètres, plateformes de force et capteurs de puissance.`
  },
  {
    id: 'file-manno-ex02a',
    userId: 'user-prepa-04',
    userName: 'Matteo Manno',
    userEmail: 'matteo.manno@student.hech.be',
    exerciseId: 'exercice-02a',
    exerciseTitle: 'Exercice 02.a : Extraction Power Query & Nutrition (Natation)',
    originalFileName: 'MANNO_Matteo_Exercice_02a_PowerQuery.xlsx',
    formattedFileName: 'MANNO_Matteo_exercice-02a.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 35800,
    submittedAt: '2026-10-05 10:45',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `REQUÊTE POWER QUERY ET ANALYSE NUTRITIONNELLE
Matteo Manno
Automatisation de l'import des macronutriments et calcul des besoins énergétiques par nageur.`
  },
  {
    id: 'file-manno-ex02b',
    userId: 'user-prepa-04',
    userName: 'Matteo Manno',
    userEmail: 'matteo.manno@student.hech.be',
    exerciseId: 'exercice-02',
    exerciseTitle: 'Exercice 02.b : Quel outil pour quelle situation ? (10 cas)',
    originalFileName: 'MANNO_Matteo_Exercice_02b_Logiciels.docx',
    formattedFileName: 'MANNO_Matteo_exercice-02.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 29500,
    submittedAt: '2026-10-09 14:15',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `ÉCOSYSTÈME LOGICIEL DU PRÉPARATEUR PHYSIQUE
Matteo Manno
Solutions logicielles adaptées aux 10 cas de figure.`
  },
  {
    id: 'file-manno-ex03',
    userId: 'user-prepa-04',
    userName: 'Matteo Manno',
    userEmail: 'matteo.manno@student.hech.be',
    exerciseId: 'exercice-03',
    exerciseTitle: 'Exercice 03 : Excel - Collecte et structuration de données',
    originalFileName: 'MANNO_Matteo_Exercice_03_Structuration.xlsx',
    formattedFileName: 'MANNO_Matteo_exercice-03.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 47200,
    submittedAt: '2026-10-15 11:30',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `STRUCTURATION DES DONNÉES EN CENTRE DE FORMATION
Matteo Manno
Table Tidy Data avec colonnes individuelles et calcul automatique de la charge de séance.`
  },
  {
    id: 'file-manno-ex04',
    userId: 'user-prepa-04',
    userName: 'Matteo Manno',
    userEmail: 'matteo.manno@student.hech.be',
    exerciseId: 'exercice-04',
    exerciseTitle: 'Exercice 04 : Excel - Créer ses propres outils de suivi',
    originalFileName: 'MANNO_Matteo_Exercice_04_Suivi_Charge.xlsx',
    formattedFileName: 'MANNO_Matteo_exercice-04.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 56300,
    submittedAt: '2026-10-21 17:10',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `TABLEAU DE BORD DE CHARGE EXCEL
Matteo Manno
Suivi du ratio ACWR et alertes de vigilance.`
  },
  {
    id: 'file-manno-ex05',
    userId: 'user-prepa-04',
    userName: 'Matteo Manno',
    userEmail: 'matteo.manno@student.hech.be',
    exerciseId: 'exercice-05',
    exerciseTitle: 'Exercice 05 : De la donnée à la décision (analyse & ajustement)',
    originalFileName: 'MANNO_Matteo_Exercice_05_Decision.docx',
    formattedFileName: 'MANNO_Matteo_exercice-05.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 36100,
    submittedAt: '2026-10-27 15:45',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `ANALYSE DE CAS : RÉGULATION DE CHARGE DE THOMAS
Matteo Manno
Identification de la fatigue et recommandations d'allègement d'entraînement.`
  },

  // ==================== 5. ACHILE CAPITAINE (8/8 devoirs) ====================
  {
    id: 'file-capitaine-ex01',
    userId: 'user-prepa-05',
    userName: 'Achile Capitaine',
    userEmail: 'achile.capitaine@student.hech.be',
    exerciseId: 'exercice-01',
    exerciseTitle: 'Exercice 01 : Quel capteur choisir ? (10 situations)',
    originalFileName: 'CAPITAINE_Achile_Exercice_01_Capteurs.docx',
    formattedFileName: 'CAPITAINE_Achile_exercice-01.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 43200,
    submittedAt: '2026-09-28 17:15',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `SÉLECTION ET PROTOCOLE DES CAPTEURS EN SPORTS COLLECTIFS ET INDIVIDUELS
Achile Capitaine
Présentation exhaustive des 10 capteurs : GNSS Catapult 10Hz, centrale inertielle IMU, cellules photoélectriques sprint, dynamomètre isocinétique, encodeur linéaire GymAware, plateforme ForceDecks, cardiofréquencemètre Polar.`
  },
  {
    id: 'file-capitaine-ex02a',
    userId: 'user-prepa-05',
    userName: 'Achile Capitaine',
    userEmail: 'achile.capitaine@student.hech.be',
    exerciseId: 'exercice-02a',
    exerciseTitle: 'Exercice 02.a : Extraction Power Query & Nutrition (Natation)',
    originalFileName: 'CAPITAINE_Achile_Exercice_02a_PowerQuery.xlsx',
    formattedFileName: 'CAPITAINE_Achile_exercice-02a.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 38100,
    submittedAt: '2026-10-03 11:20',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `OPTIMISATION NUTRITIONNELLE PAR POWER QUERY
Achile Capitaine
Nettoyage automatisé de la base alimentaire, détection des carences en glycogène et propositions stratégiques pour le microcycle de compétition.`
  },
  {
    id: 'file-capitaine-ex02b',
    userId: 'user-prepa-02',
    userName: 'Achile Capitaine',
    userEmail: 'achile.capitaine@student.hech.be',
    exerciseId: 'exercice-02',
    exerciseTitle: 'Exercice 02.b : Quel outil pour quelle situation ? (10 cas)',
    originalFileName: 'CAPITAINE_Achile_Exercice_02b_Logiciels.docx',
    formattedFileName: 'CAPITAINE_Achile_exercice-02.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 31800,
    submittedAt: '2026-10-07 16:00',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `ÉCOSYSTÈME LOGICIEL ET DIGITAL EN PRÉPARATION PHYSIQUE
Achile Capitaine
Cartographie des 10 solutions logicielles et intégration dans le flux de données.`
  },
  {
    id: 'file-capitaine-ex03',
    userId: 'user-prepa-05',
    userName: 'Achile Capitaine',
    userEmail: 'achile.capitaine@student.hech.be',
    exerciseId: 'exercice-03',
    exerciseTitle: 'Exercice 03 : Excel - Collecte et structuration de données',
    originalFileName: 'CAPITAINE_Achile_Exercice_03_Structuration.xlsx',
    formattedFileName: 'CAPITAINE_Achile_exercice-03.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 50800,
    submittedAt: '2026-10-13 17:30',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `NORMALISATION DE LA BASE DE DONNÉES DE CHARGE FOOTBALL U18
Achile Capitaine
Table Tidy Data, vérification des types de données, formules sans erreur.`
  },
  {
    id: 'file-capitaine-ex04',
    userId: 'user-prepa-05',
    userName: 'Achile Capitaine',
    userEmail: 'achile.capitaine@student.hech.be',
    exerciseId: 'exercice-04',
    exerciseTitle: 'Exercice 04 : Excel - Créer ses propres outils de suivi',
    originalFileName: 'CAPITAINE_Achile_Exercice_04_Suivi_Charge.xlsx',
    formattedFileName: 'CAPITAINE_Achile_exercice-04.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 62400,
    submittedAt: '2026-10-19 18:20',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `TABLEAU DE BORD INTÉGRÉ HOOPER ET ACWR
Achile Capitaine
Formules SOMME.SI.ENS, calcul glissant des charges 7j et 28j, alertes visuelles automatisées.`
  },
  {
    id: 'file-capitaine-ex05',
    userId: 'user-prepa-05',
    userName: 'Achile Capitaine',
    userEmail: 'achile.capitaine@student.hech.be',
    exerciseId: 'exercice-05',
    exerciseTitle: 'Exercice 05 : De la donnée à la décision (analyse & ajustement)',
    originalFileName: 'CAPITAINE_Achile_Exercice_05_Decision.docx',
    formattedFileName: 'CAPITAINE_Achile_exercice-05.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 38900,
    submittedAt: '2026-10-25 16:40',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `GESTION DE LA FATIGUE DE THOMAS
Achile Capitaine
Analyse croisée des charges GPS et des scores de bien-être, protocole d'ajustement personnalisé.`
  },
  {
    id: 'file-capitaine-ex06',
    userId: 'user-prepa-05',
    userName: 'Achile Capitaine',
    userEmail: 'achile.capitaine@student.hech.be',
    exerciseId: 'exercice-06',
    exerciseTitle: 'Exercice 06 : Créer une application IA et un agent',
    originalFileName: 'CAPITAINE_Achile_Exercice_06_Agent_IA.docx',
    formattedFileName: 'CAPITAINE_Achile_exercice-06.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 40900,
    submittedAt: '2026-10-30 18:30',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `DÉVELOPPEMENT D'UN ASSISTANT IA POUR LE MONITORING DU SPORTIF
Achile Capitaine
Prompting système, règles d'arbitrage et format de restitution pour les entraîneurs.`
  },
  {
    id: 'file-capitaine-ex07',
    userId: 'user-prepa-05',
    userName: 'Achile Capitaine',
    userEmail: 'achile.capitaine@student.hech.be',
    exerciseId: 'exercice-07',
    exerciseTitle: 'Exercice 07 : Modèle de lutte contre le surentraînement en football',
    originalFileName: 'CAPITAINE_Achile_Exercice_07_Mission_Finale.docx',
    formattedFileName: 'CAPITAINE_Achile_exercice-07.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 79500,
    submittedAt: '2026-11-04 15:40',
    driveSynced: true,
    driveUrl: 'https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH',
    extractedText: `MODÈLE DE PRÉVENTION DU SURENTRAÎNEMENT ET GESTION DE LA CHARGE EN FOOTBALL
Achile Capitaine
Approche intégrée : Charge externe (GPS), charge interne (sRPE), état de fatigue (Hooper) et tests neuromusculaires (CMJ). Arbre décisionnel de décharge.`
  }
]

export const INITIAL_REAL_SUBMISSIONS: Submission[] = [
  // Maxim Legentil
  { id: 'sub-legentil-ex01', userEmail: 'maxim.legentil@student.hech.be', userName: 'Maxim Legentil', exerciseId: 'exercice-01', exerciseTitle: 'Exercice 01 : Quel capteur choisir ?', submittedAt: '2026-09-28 14:20', answer: 'Synthèse des 10 situations déposée sous forme de document Word complet avec justifications biomécaniques et physiologiques pour chaque capteur (GPS, IMU, VBT, Plateformes de force, HRV, Lactate, etc.).' },
  { id: 'sub-legentil-ex02a', userEmail: 'maxim.legentil@student.hech.be', userName: 'Maxim Legentil', exerciseId: 'exercice-02a', exerciseTitle: 'Exercice 02.a : Extraction Power Query & Nutrition (Natation)', submittedAt: '2026-10-02 11:30', answer: 'Modèle Power Query opérationnel avec nettoyage des données de la semaine, calcul de Glucides_g_kg et Proteines_g_kg, et identification des déficits énergétiques du mercredi/jeudi.' },
  { id: 'sub-legentil-ex02b', userEmail: 'maxim.legentil@student.hech.be', userName: 'Maxim Legentil', exerciseId: 'exercice-02', exerciseTitle: 'Exercice 02.b : Quel outil pour quelle situation ?', submittedAt: '2026-10-06 16:45', answer: 'Revue détaillée des logiciels professionnels pour les 10 situations (Kitman Labs, WKO5, Kinovea, etc.).' },
  { id: 'sub-legentil-ex03', userEmail: 'maxim.legentil@student.hech.be', userName: 'Maxim Legentil', exerciseId: 'exercice-03', exerciseTitle: 'Exercice 03 : Excel - Collecte et structuration', submittedAt: '2026-10-12 18:00', answer: 'Classeur Excel Tidy Data normalisé avec validation des données et calcul automatique de la charge de séance.' },
  { id: 'sub-legentil-ex04', userEmail: 'maxim.legentil@student.hech.be', userName: 'Maxim Legentil', exerciseId: 'exercice-04', exerciseTitle: 'Exercice 04 : Excel - Créer ses propres outils', submittedAt: '2026-10-18 10:15', answer: 'Dashboard de charge aiguë / chronique, ratio ACWR et alertes de risque de blessure.' },
  { id: 'sub-legentil-ex05', userEmail: 'maxim.legentil@student.hech.be', userName: 'Maxim Legentil', exerciseId: 'exercice-05', exerciseTitle: 'Exercice 05 : De la donnée à la décision', submittedAt: '2026-10-24 15:30', answer: 'Étude de cas Thomas : analyse de la fatigue neuromusculaire et plan de régulation du microcycle.' },
  { id: 'sub-legentil-ex06', userEmail: 'maxim.legentil@student.hech.be', userName: 'Maxim Legentil', exerciseId: 'exercice-06', exerciseTitle: 'Exercice 06 : Créer une application IA et un agent', submittedAt: '2026-10-29 11:15', answer: 'Architecture d\'agent IA spécialisé dans l\'analyse matinale des questionnaires Hooper et des charges GPS.' },
  { id: 'sub-legentil-ex07', userEmail: 'maxim.legentil@student.hech.be', userName: 'Maxim Legentil', exerciseId: 'exercice-07', exerciseTitle: 'Exercice 07 : Modèle de lutte contre le surentraînement', submittedAt: '2026-11-04 17:30', answer: 'Modèle multidimensionnel de prévention du surentraînement en football professionnel.' },

  // Emma Lemaire
  { id: 'sub-lemaire-ex01', userEmail: 'emma.lemaire@student.hech.be', userName: 'Emma Lemaire', exerciseId: 'exercice-01', exerciseTitle: 'Exercice 01 : Quel capteur choisir ?', submittedAt: '2026-09-29 16:10', answer: 'Document d\'analyse déposé : sélection et argumentation des 10 technologies de mesure selon la spécificité des disciplines sportives.' },
  { id: 'sub-lemaire-ex02a', userEmail: 'emma.lemaire@student.hech.be', userName: 'Emma Lemaire', exerciseId: 'exercice-02a', exerciseTitle: 'Exercice 02.a : Extraction Power Query & Nutrition (Natation)', submittedAt: '2026-10-03 14:00', answer: 'Fichier Power Query complété avec ratios nutritionnels personnalisés par athlète.' },
  { id: 'sub-lemaire-ex07', userEmail: 'emma.lemaire@student.hech.be', userName: 'Emma Lemaire', exerciseId: 'exercice-07', exerciseTitle: 'Exercice 07 : Modèle de lutte contre le surentraînement', submittedAt: '2026-11-03 18:45', answer: 'Stratégie intégrée de gestion de la charge et prévention des blessures en football.' },

  // Antoine Daltin
  { id: 'sub-daltin-ex01', userEmail: 'antoine.daltin@student.hech.be', userName: 'Antoine Daltin', exerciseId: 'exercice-01', exerciseTitle: 'Exercice 01 : Quel capteur choisir ?', submittedAt: '2026-09-29 11:40', answer: 'Travail complet déposé avec critères de fiabilité et protocoles de mesure.' },
  { id: 'sub-daltin-ex02a', userEmail: 'antoine.daltin@student.hech.be', userName: 'Antoine Daltin', exerciseId: 'exercice-02a', exerciseTitle: 'Exercice 02.a : Extraction Power Query & Nutrition (Natation)', submittedAt: '2026-10-04 16:30', answer: 'Traitement Power Query des macronutriments en natation.' },

  // Matteo Manno
  { id: 'sub-manno-ex01', userEmail: 'matteo.manno@student.hech.be', userName: 'Matteo Manno', exerciseId: 'exercice-01', exerciseTitle: 'Exercice 01 : Quel capteur choisir ?', submittedAt: '2026-09-30 18:20', answer: 'Devoir déposé sur le choix des capteurs en fonction des contraintes de terrain.' },
  { id: 'sub-manno-ex02a', userEmail: 'matteo.manno@student.hech.be', userName: 'Matteo Manno', exerciseId: 'exercice-02a', exerciseTitle: 'Exercice 02.a : Extraction Power Query & Nutrition (Natation)', submittedAt: '2026-10-05 10:45', answer: 'Modèle Power Query pour le suivi nutritionnel des nageurs.' },

  // Achile Capitaine
  { id: 'sub-capitaine-ex01', userEmail: 'achile.capitaine@student.hech.be', userName: 'Achile Capitaine', exerciseId: 'exercice-01', exerciseTitle: 'Exercice 01 : Quel capteur choisir ?', submittedAt: '2026-09-28 17:15', answer: 'Analyse des 10 cas pratiques avec tableau comparatif des fréquences d\'échantillonnage et validité métrologique.' },
  { id: 'sub-capitaine-ex02a', userEmail: 'achile.capitaine@student.hech.be', userName: 'Achile Capitaine', exerciseId: 'exercice-02a', exerciseTitle: 'Exercice 02.a : Extraction Power Query & Nutrition (Natation)', submittedAt: '2026-10-03 11:20', answer: 'Requête Power Query optimisée et recommandations de charge glycogénique.' },
  { id: 'sub-capitaine-ex07', userEmail: 'achile.capitaine@student.hech.be', userName: 'Achile Capitaine', exerciseId: 'exercice-07', exerciseTitle: 'Exercice 07 : Modèle de lutte contre le surentraînement', submittedAt: '2026-11-04 15:40', answer: 'Modèle complet de régulation de charge et indicateurs de fatigue en football.' }
]

export const INITIAL_REAL_QUIZZES: QuizAttempt[] = [
  // Maxim Legentil (Moyenne 9.6/10)
  { id: 'quiz-legentil-01', userEmail: 'maxim.legentil@student.hech.be', userName: 'Maxim Legentil', moduleId: 'module-01', moduleTitle: 'Module 01 : Capteurs et Outils Numériques', score: 10, totalPoints: 10, percentage: 100, submittedAt: '2026-09-27 11:20' },
  { id: 'quiz-legentil-02', userEmail: 'maxim.legentil@student.hech.be', userName: 'Maxim Legentil', moduleId: 'module-02', moduleTitle: 'Module 02 : Écosystème des Logiciels & Power Query', score: 9.5, totalPoints: 10, percentage: 95, submittedAt: '2026-10-01 16:40' },
  { id: 'quiz-legentil-03', userEmail: 'maxim.legentil@student.hech.be', userName: 'Maxim Legentil', moduleId: 'module-03', moduleTitle: 'Module 03 : Collecte et Structuration de Données (Tidy Data)', score: 10, totalPoints: 10, percentage: 100, submittedAt: '2026-10-10 18:15' },
  { id: 'quiz-legentil-04', userEmail: 'maxim.legentil@student.hech.be', userName: 'Maxim Legentil', moduleId: 'module-04', moduleTitle: 'Module 04 : Tableaux de Bord & Outils de Suivi', score: 9, totalPoints: 10, percentage: 90, submittedAt: '2026-10-17 14:10' },
  { id: 'quiz-legentil-05', userEmail: 'maxim.legentil@student.hech.be', userName: 'Maxim Legentil', moduleId: 'module-05', moduleTitle: 'Module 05 : De la Donnée à la Décision', score: 10, totalPoints: 10, percentage: 100, submittedAt: '2026-10-23 19:30' },
  { id: 'quiz-legentil-06', userEmail: 'maxim.legentil@student.hech.be', userName: 'Maxim Legentil', moduleId: 'module-06', moduleTitle: 'Module 06 : Intelligence Artificielle & Agents', score: 9.5, totalPoints: 10, percentage: 95, submittedAt: '2026-10-28 17:00' },
  { id: 'quiz-legentil-07', userEmail: 'maxim.legentil@student.hech.be', userName: 'Maxim Legentil', moduleId: 'module-07', moduleTitle: 'Module 07 : Prévention du Surentraînement', score: 9, totalPoints: 10, percentage: 90, submittedAt: '2026-11-03 11:45' },

  // Emma Lemaire (Moyenne 9.3/10)
  { id: 'quiz-lemaire-01', userEmail: 'emma.lemaire@student.hech.be', userName: 'Emma Lemaire', moduleId: 'module-01', moduleTitle: 'Module 01 : Capteurs et Outils Numériques', score: 10, totalPoints: 10, percentage: 100, submittedAt: '2026-09-28 15:10' },
  { id: 'quiz-lemaire-02', userEmail: 'emma.lemaire@student.hech.be', userName: 'Emma Lemaire', moduleId: 'module-02', moduleTitle: 'Module 02 : Écosystème des Logiciels & Power Query', score: 9, totalPoints: 10, percentage: 90, submittedAt: '2026-10-02 18:20' },
  { id: 'quiz-lemaire-03', userEmail: 'emma.lemaire@student.hech.be', userName: 'Emma Lemaire', moduleId: 'module-03', moduleTitle: 'Module 03 : Collecte et Structuration de Données (Tidy Data)', score: 9.5, totalPoints: 10, percentage: 95, submittedAt: '2026-10-11 11:30' },
  { id: 'quiz-lemaire-04', userEmail: 'emma.lemaire@student.hech.be', userName: 'Emma Lemaire', moduleId: 'module-04', moduleTitle: 'Module 04 : Tableaux de Bord & Outils de Suivi', score: 9, totalPoints: 10, percentage: 90, submittedAt: '2026-10-18 16:50' },
  { id: 'quiz-lemaire-05', userEmail: 'emma.lemaire@student.hech.be', userName: 'Emma Lemaire', moduleId: 'module-05', moduleTitle: 'Module 05 : De la Donnée à la Décision', score: 9, totalPoints: 10, percentage: 90, submittedAt: '2026-10-24 10:15' },
  { id: 'quiz-lemaire-06', userEmail: 'emma.lemaire@student.hech.be', userName: 'Emma Lemaire', moduleId: 'module-06', moduleTitle: 'Module 06 : Intelligence Artificielle & Agents', score: 9.5, totalPoints: 10, percentage: 95, submittedAt: '2026-10-29 14:00' },
  { id: 'quiz-lemaire-07', userEmail: 'emma.lemaire@student.hech.be', userName: 'Emma Lemaire', moduleId: 'module-07', moduleTitle: 'Module 07 : Prévention du Surentraînement', score: 9, totalPoints: 10, percentage: 90, submittedAt: '2026-11-03 16:20' },

  // Antoine Daltin (Moyenne 8.8/10)
  { id: 'quiz-daltin-01', userEmail: 'antoine.daltin@student.hech.be', userName: 'Antoine Daltin', moduleId: 'module-01', moduleTitle: 'Module 01 : Capteurs et Outils Numériques', score: 9, totalPoints: 10, percentage: 90, submittedAt: '2026-09-28 10:30' },
  { id: 'quiz-daltin-02', userEmail: 'antoine.daltin@student.hech.be', userName: 'Antoine Daltin', moduleId: 'module-02', moduleTitle: 'Module 02 : Écosystème des Logiciels & Power Query', score: 8.5, totalPoints: 10, percentage: 85, submittedAt: '2026-10-03 11:15' },
  { id: 'quiz-daltin-03', userEmail: 'antoine.daltin@student.hech.be', userName: 'Antoine Daltin', moduleId: 'module-03', moduleTitle: 'Module 03 : Collecte et Structuration de Données (Tidy Data)', score: 9, totalPoints: 10, percentage: 90, submittedAt: '2026-10-12 17:00' },
  { id: 'quiz-daltin-04', userEmail: 'antoine.daltin@student.hech.be', userName: 'Antoine Daltin', moduleId: 'module-04', moduleTitle: 'Module 04 : Tableaux de Bord & Outils de Suivi', score: 8.5, totalPoints: 10, percentage: 85, submittedAt: '2026-10-19 14:30' },
  { id: 'quiz-daltin-05', userEmail: 'antoine.daltin@student.hech.be', userName: 'Antoine Daltin', moduleId: 'module-05', moduleTitle: 'Module 05 : De la Donnée à la Décision', score: 9, totalPoints: 10, percentage: 90, submittedAt: '2026-10-25 11:00' },

  // Matteo Manno (Moyenne 8.5/10)
  { id: 'quiz-manno-01', userEmail: 'matteo.manno@student.hech.be', userName: 'Matteo Manno', moduleId: 'module-01', moduleTitle: 'Module 01 : Capteurs et Outils Numériques', score: 8.5, totalPoints: 10, percentage: 85, submittedAt: '2026-09-29 14:20' },
  { id: 'quiz-manno-02', userEmail: 'matteo.manno@student.hech.be', userName: 'Matteo Manno', moduleId: 'module-02', moduleTitle: 'Module 02 : Écosystème des Logiciels & Power Query', score: 8, totalPoints: 10, percentage: 80, submittedAt: '2026-10-04 15:40' },
  { id: 'quiz-manno-03', userEmail: 'matteo.manno@student.hech.be', userName: 'Matteo Manno', moduleId: 'module-03', moduleTitle: 'Module 03 : Collecte et Structuration de Données (Tidy Data)', score: 9, totalPoints: 10, percentage: 90, submittedAt: '2026-10-13 16:15' },
  { id: 'quiz-manno-04', userEmail: 'matteo.manno@student.hech.be', userName: 'Matteo Manno', moduleId: 'module-04', moduleTitle: 'Module 04 : Tableaux de Bord & Outils de Suivi', score: 8.5, totalPoints: 10, percentage: 85, submittedAt: '2026-10-20 11:20' },

  // Achile Capitaine (Moyenne 9.2/10)
  { id: 'quiz-capitaine-01', userEmail: 'achile.capitaine@student.hech.be', userName: 'Achile Capitaine', moduleId: 'module-01', moduleTitle: 'Module 01 : Capteurs et Outils Numériques', score: 9.5, totalPoints: 10, percentage: 95, submittedAt: '2026-09-27 16:45' },
  { id: 'quiz-capitaine-02', userEmail: 'achile.capitaine@student.hech.be', userName: 'Achile Capitaine', moduleId: 'module-02', moduleTitle: 'Module 02 : Écosystème des Logiciels & Power Query', score: 9, totalPoints: 10, percentage: 90, submittedAt: '2026-10-02 10:30' },
  { id: 'quiz-capitaine-03', userEmail: 'achile.capitaine@student.hech.be', userName: 'Achile Capitaine', moduleId: 'module-03', moduleTitle: 'Module 03 : Collecte et Structuration de Données (Tidy Data)', score: 9, totalPoints: 10, percentage: 90, submittedAt: '2026-10-11 15:15' },
  { id: 'quiz-capitaine-04', userEmail: 'achile.capitaine@student.hech.be', userName: 'Achile Capitaine', moduleId: 'module-04', moduleTitle: 'Module 04 : Tableaux de Bord & Outils de Suivi', score: 9.5, totalPoints: 10, percentage: 95, submittedAt: '2026-10-18 17:40' },
  { id: 'quiz-capitaine-05', userEmail: 'achile.capitaine@student.hech.be', userName: 'Achile Capitaine', moduleId: 'module-05', moduleTitle: 'Module 05 : De la Donnée à la Décision', score: 9, totalPoints: 10, percentage: 90, submittedAt: '2026-10-24 16:10' },
  { id: 'quiz-capitaine-06', userEmail: 'achile.capitaine@student.hech.be', userName: 'Achile Capitaine', moduleId: 'module-06', moduleTitle: 'Module 06 : Intelligence Artificielle & Agents', score: 9, totalPoints: 10, percentage: 90, submittedAt: '2026-10-29 11:30' },
  { id: 'quiz-capitaine-07', userEmail: 'achile.capitaine@student.hech.be', userName: 'Achile Capitaine', moduleId: 'module-07', moduleTitle: 'Module 07 : Prévention du Surentraînement', score: 9.5, totalPoints: 10, percentage: 95, submittedAt: '2026-11-04 11:20' }
]
