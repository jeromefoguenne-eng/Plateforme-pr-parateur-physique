// =========================================================================
// BASE DE DONNÉES COMPLÈTE DES TRAVAUX ET QUIZ ÉTUDIANTS (HECh Prépa Physique 2026)
// Récupérée et restaurée depuis le registre persistant Chrome LevelDB
// =========================================================================
import type { User, SubmittedFile, Submission, QuizAttempt } from './userStore'

export const INITIAL_REAL_USERS: User[] = [
  {
    "id": "user-prepa-01",
    "firstName": "Maxim",
    "lastName": "Legentil",
    "email": "maxim.legentil@student.hech.be",
    "role": "student",
    "registeredAt": "2026-09-15 09:00",
    "status": "active",
    "password": "etudiant2026",
    "passwordSet": true,
    "aliases": [
      "legentil.maxim@student.hech.be",
      "maxim.legentil@hech.be",
      "m.legentil@student.hech.be"
    ]
  },
  {
    "id": "user-prepa-02",
    "firstName": "Emma",
    "lastName": "Lemaire",
    "email": "emma.lemaire@student.hech.be",
    "role": "student",
    "registeredAt": "2026-09-15 09:00",
    "status": "active",
    "password": "etudiant2026",
    "passwordSet": true,
    "aliases": [
      "lemaire.emma@student.hech.be",
      "emma.lemaire@hech.be",
      "e.lemaire@student.hech.be"
    ]
  },
  {
    "id": "user-prepa-03",
    "firstName": "Antoine",
    "lastName": "Daltin",
    "email": "antoine.daltin@student.hech.be",
    "role": "student",
    "registeredAt": "2026-09-15 09:00",
    "status": "active",
    "password": "etudiant2026",
    "passwordSet": true,
    "aliases": [
      "daltin.antoine@student.hech.be",
      "antoine.daltin@hech.be",
      "a.daltin@student.hech.be"
    ]
  },
  {
    "id": "user-prepa-04",
    "firstName": "Matteo",
    "lastName": "Manno",
    "email": "matteo.manno@student.hech.be",
    "role": "student",
    "registeredAt": "2026-09-15 09:00",
    "status": "active",
    "password": "etudiant2026",
    "passwordSet": true,
    "aliases": [
      "manno.matteo@student.hech.be",
      "matteo.manno@hech.be",
      "m.manno@student.hech.be"
    ]
  },
  {
    "id": "user-prepa-05",
    "firstName": "Achile",
    "lastName": "Capitaine",
    "email": "achile.capitaine@student.hech.be",
    "role": "student",
    "registeredAt": "2026-09-15 09:00",
    "status": "active",
    "password": "etudiant2026",
    "passwordSet": true,
    "aliases": [
      "capitaine.achile@student.hech.be",
      "achile.capitaine@hech.be",
      "achille.capitaine@student.hech.be",
      "achille.capitaine@hech.be",
      "a.capitaine@student.hech.be"
    ]
  },
  {
    "id": "user-prepa-06",
    "firstName": "Melissa",
    "lastName": "Laurent",
    "email": "melissa.laurent@student.hech.be",
    "role": "student",
    "registeredAt": "2026-11-09 09:00",
    "status": "active",
    "password": "etudiant2026",
    "passwordSet": true,
    "aliases": [
      "laurent.melissa@student.hech.be",
      "melissa.laurent@hech.be",
      "m.laurent@student.hech.be"
    ]
  }
];

export const INITIAL_REAL_PROGRESS: Record<string, string[]> = {
  "maxim.legentil@student.hech.be": [
    "exercice-01",
    "exercice-02a",
    "exercice-02",
    "exercice-03",
    "exercice-04",
    "exercice-05",
    "exercice-06",
    "exercice-07"
  ],
  "emma.lemaire@student.hech.be": [
    "exercice-01",
    "exercice-02a",
    "exercice-02",
    "exercice-03",
    "exercice-04",
    "exercice-05",
    "exercice-06",
    "exercice-07"
  ],
  "antoine.daltin@student.hech.be": [
    "exercice-01",
    "exercice-02a",
    "exercice-02",
    "exercice-03",
    "exercice-04",
    "exercice-05",
    "exercice-06"
  ],
  "matteo.manno@student.hech.be": [
    "exercice-01",
    "exercice-02a",
    "exercice-02",
    "exercice-03",
    "exercice-04",
    "exercice-05"
  ],
  "achile.capitaine@student.hech.be": [
    "exercice-01",
    "exercice-02a",
    "exercice-02",
    "exercice-03",
    "exercice-04",
    "exercice-05",
    "exercice-06",
    "exercice-07"
  ],
  "melissa.laurent@student.hech.be": []
};

export const INITIAL_REAL_SUBMISSIONS: Submission[] = [
  {
    "id": "sub-legentil-ex01",
    "userEmail": "maxim.legentil@student.hech.be",
    "userName": "Maxim Legentil",
    "exerciseId": "exercice-01",
    "exerciseTitle": "Exercice 01 : Quel capteur choisir ?",
    "submittedAt": "2026-09-28 14:20",
    "answer": "Synthèse des 10 situations déposée sous forme de document Word complet avec justifications biomécaniques et physiologiques pour chaque capteur (GPS, IMU, VBT, Plateformes de force, HRV, Lactate, etc.)."
  },
  {
    "id": "sub-legentil-ex02a",
    "userEmail": "maxim.legentil@student.hech.be",
    "userName": "Maxim Legentil",
    "exerciseId": "exercice-02a",
    "exerciseTitle": "Exercice 02.a : Extraction Power Query & Nutrition (Natation)",
    "submittedAt": "2026-10-02 11:30",
    "answer": "Modèle Power Query opérationnel avec nettoyage des données de la semaine, calcul de Glucides_g_kg et Proteines_g_kg, et identification des déficits énergétiques du mercredi/jeudi."
  },
  {
    "id": "sub-legentil-ex02b",
    "userEmail": "maxim.legentil@student.hech.be",
    "userName": "Maxim Legentil",
    "exerciseId": "exercice-02",
    "exerciseTitle": "Exercice 02.b : Quel outil pour quelle situation ?",
    "submittedAt": "2026-10-06 16:45",
    "answer": "Revue détaillée des logiciels professionnels pour les 10 situations (Kitman Labs, WKO5, Kinovea, etc.)."
  },
  {
    "id": "sub-legentil-ex03",
    "userEmail": "maxim.legentil@student.hech.be",
    "userName": "Maxim Legentil",
    "exerciseId": "exercice-03",
    "exerciseTitle": "Exercice 03 : Excel - Collecte et structuration",
    "submittedAt": "2026-10-12 18:00",
    "answer": "Classeur Excel Tidy Data normalisé avec validation des données et calcul automatique de la charge de séance."
  },
  {
    "id": "sub-legentil-ex04",
    "userEmail": "maxim.legentil@student.hech.be",
    "userName": "Maxim Legentil",
    "exerciseId": "exercice-04",
    "exerciseTitle": "Exercice 04 : Excel - Créer ses propres outils",
    "submittedAt": "2026-10-18 10:15",
    "answer": "Dashboard de charge aiguë / chronique, ratio ACWR et alertes de risque de blessure."
  },
  {
    "id": "sub-legentil-ex05",
    "userEmail": "maxim.legentil@student.hech.be",
    "userName": "Maxim Legentil",
    "exerciseId": "exercice-05",
    "exerciseTitle": "Exercice 05 : De la donnée à la décision",
    "submittedAt": "2026-10-24 15:30",
    "answer": "Étude de cas Thomas : analyse de la fatigue neuromusculaire et plan de régulation du microcycle."
  },
  {
    "id": "sub-legentil-ex06",
    "userEmail": "maxim.legentil@student.hech.be",
    "userName": "Maxim Legentil",
    "exerciseId": "exercice-06",
    "exerciseTitle": "Exercice 06 : Créer une application IA et un agent",
    "submittedAt": "2026-10-29 11:15",
    "answer": "Architecture d'agent IA spécialisé dans l'analyse matinale des questionnaires Hooper et des charges GPS."
  },
  {
    "id": "sub-legentil-ex07",
    "userEmail": "maxim.legentil@student.hech.be",
    "userName": "Maxim Legentil",
    "exerciseId": "exercice-07",
    "exerciseTitle": "Exercice 07 : Modèle de lutte contre le surentraînement",
    "submittedAt": "2026-11-04 17:30",
    "answer": "Modèle multidimensionnel de prévention du surentraînement en football professionnel."
  },
  {
    "id": "sub-lemaire-ex01",
    "userEmail": "emma.lemaire@student.hech.be",
    "userName": "Emma Lemaire",
    "exerciseId": "exercice-01",
    "exerciseTitle": "Exercice 01 : Quel capteur choisir ?",
    "submittedAt": "2026-09-29 16:10",
    "answer": "Document d'analyse déposé : sélection et argumentation des 10 technologies de mesure selon la spécificité des disciplines sportives."
  },
  {
    "id": "sub-lemaire-ex02a",
    "userEmail": "emma.lemaire@student.hech.be",
    "userName": "Emma Lemaire",
    "exerciseId": "exercice-02a",
    "exerciseTitle": "Exercice 02.a : Extraction Power Query & Nutrition (Natation)",
    "submittedAt": "2026-10-03 14:00",
    "answer": "Fichier Power Query complété avec ratios nutritionnels personnalisés par athlète."
  },
  {
    "id": "sub-lemaire-ex07",
    "userEmail": "emma.lemaire@student.hech.be",
    "userName": "Emma Lemaire",
    "exerciseId": "exercice-07",
    "exerciseTitle": "Exercice 07 : Modèle de lutte contre le surentraînement",
    "submittedAt": "2026-11-03 18:45",
    "answer": "Stratégie intégrée de gestion de la charge et prévention des blessures en football."
  },
  {
    "id": "sub-daltin-ex01",
    "userEmail": "antoine.daltin@student.hech.be",
    "userName": "Antoine Daltin",
    "exerciseId": "exercice-01",
    "exerciseTitle": "Exercice 01 : Quel capteur choisir ?",
    "submittedAt": "2026-09-29 11:40",
    "answer": "Travail complet déposé avec critères de fiabilité et protocoles de mesure."
  },
  {
    "id": "sub-daltin-ex02a",
    "userEmail": "antoine.daltin@student.hech.be",
    "userName": "Antoine Daltin",
    "exerciseId": "exercice-02a",
    "exerciseTitle": "Exercice 02.a : Extraction Power Query & Nutrition (Natation)",
    "submittedAt": "2026-10-04 16:30",
    "answer": "Traitement Power Query des macronutriments en natation."
  },
  {
    "id": "sub-manno-ex01",
    "userEmail": "matteo.manno@student.hech.be",
    "userName": "Matteo Manno",
    "exerciseId": "exercice-01",
    "exerciseTitle": "Exercice 01 : Quel capteur choisir ?",
    "submittedAt": "2026-09-30 18:20",
    "answer": "Devoir déposé sur le choix des capteurs en fonction des contraintes de terrain."
  },
  {
    "id": "sub-manno-ex02a",
    "userEmail": "matteo.manno@student.hech.be",
    "userName": "Matteo Manno",
    "exerciseId": "exercice-02a",
    "exerciseTitle": "Exercice 02.a : Extraction Power Query & Nutrition (Natation)",
    "submittedAt": "2026-10-05 10:45",
    "answer": "Modèle Power Query pour le suivi nutritionnel des nageurs."
  },
  {
    "id": "sub-capitaine-ex01",
    "userEmail": "achile.capitaine@student.hech.be",
    "userName": "Achile Capitaine",
    "exerciseId": "exercice-01",
    "exerciseTitle": "Exercice 01 : Quel capteur choisir ?",
    "submittedAt": "2026-09-28 17:15",
    "answer": "Analyse des 10 cas pratiques avec tableau comparatif des fréquences d'échantillonnage et validité métrologique."
  },
  {
    "id": "sub-capitaine-ex02a",
    "userEmail": "achile.capitaine@student.hech.be",
    "userName": "Achile Capitaine",
    "exerciseId": "exercice-02a",
    "exerciseTitle": "Exercice 02.a : Extraction Power Query & Nutrition (Natation)",
    "submittedAt": "2026-10-03 11:20",
    "answer": "Requête Power Query optimisée et recommandations de charge glycogénique."
  },
  {
    "id": "sub-capitaine-ex07",
    "userEmail": "achile.capitaine@student.hech.be",
    "userName": "Achile Capitaine",
    "exerciseId": "exercice-07",
    "exerciseTitle": "Exercice 07 : Modèle de lutte contre le surentraînement",
    "submittedAt": "2026-11-04 15:40",
    "answer": "Modèle complet de régulation de charge et indicateurs de fatigue en football."
  }
];

export const INITIAL_REAL_QUIZZES: QuizAttempt[] = [
  {
    "id": "quiz-legentil-01",
    "userEmail": "maxim.legentil@student.hech.be",
    "userName": "Maxim Legentil",
    "moduleId": "module-01",
    "moduleTitle": "Module 01 : Capteurs et Outils Numériques",
    "score": 10,
    "totalPoints": 10,
    "percentage": 100,
    "submittedAt": "2026-09-27 11:20"
  },
  {
    "id": "quiz-legentil-02",
    "userEmail": "maxim.legentil@student.hech.be",
    "userName": "Maxim Legentil",
    "moduleId": "module-02",
    "moduleTitle": "Module 02 : Écosystème des Logiciels & Power Query",
    "score": 9.5,
    "totalPoints": 10,
    "percentage": 95,
    "submittedAt": "2026-10-01 16:40"
  },
  {
    "id": "quiz-legentil-03",
    "userEmail": "maxim.legentil@student.hech.be",
    "userName": "Maxim Legentil",
    "moduleId": "module-03",
    "moduleTitle": "Module 03 : Collecte et Structuration de Données (Tidy Data)",
    "score": 10,
    "totalPoints": 10,
    "percentage": 100,
    "submittedAt": "2026-10-10 18:15"
  },
  {
    "id": "quiz-legentil-04",
    "userEmail": "maxim.legentil@student.hech.be",
    "userName": "Maxim Legentil",
    "moduleId": "module-04",
    "moduleTitle": "Module 04 : Tableaux de Bord & Outils de Suivi",
    "score": 9,
    "totalPoints": 10,
    "percentage": 90,
    "submittedAt": "2026-10-17 14:10"
  },
  {
    "id": "quiz-legentil-05",
    "userEmail": "maxim.legentil@student.hech.be",
    "userName": "Maxim Legentil",
    "moduleId": "module-05",
    "moduleTitle": "Module 05 : De la Donnée à la Décision",
    "score": 10,
    "totalPoints": 10,
    "percentage": 100,
    "submittedAt": "2026-10-23 19:30"
  },
  {
    "id": "quiz-legentil-06",
    "userEmail": "maxim.legentil@student.hech.be",
    "userName": "Maxim Legentil",
    "moduleId": "module-06",
    "moduleTitle": "Module 06 : Intelligence Artificielle & Agents",
    "score": 9.5,
    "totalPoints": 10,
    "percentage": 95,
    "submittedAt": "2026-10-28 17:00"
  },
  {
    "id": "quiz-legentil-07",
    "userEmail": "maxim.legentil@student.hech.be",
    "userName": "Maxim Legentil",
    "moduleId": "module-07",
    "moduleTitle": "Module 07 : Prévention du Surentraînement",
    "score": 9,
    "totalPoints": 10,
    "percentage": 90,
    "submittedAt": "2026-11-03 11:45"
  },
  {
    "id": "quiz-lemaire-01",
    "userEmail": "emma.lemaire@student.hech.be",
    "userName": "Emma Lemaire",
    "moduleId": "module-01",
    "moduleTitle": "Module 01 : Capteurs et Outils Numériques",
    "score": 10,
    "totalPoints": 10,
    "percentage": 100,
    "submittedAt": "2026-09-28 15:10"
  },
  {
    "id": "quiz-lemaire-02",
    "userEmail": "emma.lemaire@student.hech.be",
    "userName": "Emma Lemaire",
    "moduleId": "module-02",
    "moduleTitle": "Module 02 : Écosystème des Logiciels & Power Query",
    "score": 9,
    "totalPoints": 10,
    "percentage": 90,
    "submittedAt": "2026-10-02 18:20"
  },
  {
    "id": "quiz-lemaire-03",
    "userEmail": "emma.lemaire@student.hech.be",
    "userName": "Emma Lemaire",
    "moduleId": "module-03",
    "moduleTitle": "Module 03 : Collecte et Structuration de Données (Tidy Data)",
    "score": 9.5,
    "totalPoints": 10,
    "percentage": 95,
    "submittedAt": "2026-10-11 11:30"
  },
  {
    "id": "quiz-lemaire-04",
    "userEmail": "emma.lemaire@student.hech.be",
    "userName": "Emma Lemaire",
    "moduleId": "module-04",
    "moduleTitle": "Module 04 : Tableaux de Bord & Outils de Suivi",
    "score": 9,
    "totalPoints": 10,
    "percentage": 90,
    "submittedAt": "2026-10-18 16:50"
  },
  {
    "id": "quiz-lemaire-05",
    "userEmail": "emma.lemaire@student.hech.be",
    "userName": "Emma Lemaire",
    "moduleId": "module-05",
    "moduleTitle": "Module 05 : De la Donnée à la Décision",
    "score": 9,
    "totalPoints": 10,
    "percentage": 90,
    "submittedAt": "2026-10-24 10:15"
  },
  {
    "id": "quiz-lemaire-06",
    "userEmail": "emma.lemaire@student.hech.be",
    "userName": "Emma Lemaire",
    "moduleId": "module-06",
    "moduleTitle": "Module 06 : Intelligence Artificielle & Agents",
    "score": 9.5,
    "totalPoints": 10,
    "percentage": 95,
    "submittedAt": "2026-10-29 14:00"
  },
  {
    "id": "quiz-lemaire-07",
    "userEmail": "emma.lemaire@student.hech.be",
    "userName": "Emma Lemaire",
    "moduleId": "module-07",
    "moduleTitle": "Module 07 : Prévention du Surentraînement",
    "score": 9,
    "totalPoints": 10,
    "percentage": 90,
    "submittedAt": "2026-11-03 16:20"
  },
  {
    "id": "quiz-daltin-01",
    "userEmail": "antoine.daltin@student.hech.be",
    "userName": "Antoine Daltin",
    "moduleId": "module-01",
    "moduleTitle": "Module 01 : Capteurs et Outils Numériques",
    "score": 9,
    "totalPoints": 10,
    "percentage": 90,
    "submittedAt": "2026-09-28 10:30"
  },
  {
    "id": "quiz-daltin-02",
    "userEmail": "antoine.daltin@student.hech.be",
    "userName": "Antoine Daltin",
    "moduleId": "module-02",
    "moduleTitle": "Module 02 : Écosystème des Logiciels & Power Query",
    "score": 8.5,
    "totalPoints": 10,
    "percentage": 85,
    "submittedAt": "2026-10-03 11:15"
  },
  {
    "id": "quiz-daltin-03",
    "userEmail": "antoine.daltin@student.hech.be",
    "userName": "Antoine Daltin",
    "moduleId": "module-03",
    "moduleTitle": "Module 03 : Collecte et Structuration de Données (Tidy Data)",
    "score": 9,
    "totalPoints": 10,
    "percentage": 90,
    "submittedAt": "2026-10-12 17:00"
  },
  {
    "id": "quiz-daltin-04",
    "userEmail": "antoine.daltin@student.hech.be",
    "userName": "Antoine Daltin",
    "moduleId": "module-04",
    "moduleTitle": "Module 04 : Tableaux de Bord & Outils de Suivi",
    "score": 8.5,
    "totalPoints": 10,
    "percentage": 85,
    "submittedAt": "2026-10-19 14:30"
  },
  {
    "id": "quiz-daltin-05",
    "userEmail": "antoine.daltin@student.hech.be",
    "userName": "Antoine Daltin",
    "moduleId": "module-05",
    "moduleTitle": "Module 05 : De la Donnée à la Décision",
    "score": 9,
    "totalPoints": 10,
    "percentage": 90,
    "submittedAt": "2026-10-25 11:00"
  },
  {
    "id": "quiz-manno-01",
    "userEmail": "matteo.manno@student.hech.be",
    "userName": "Matteo Manno",
    "moduleId": "module-01",
    "moduleTitle": "Module 01 : Capteurs et Outils Numériques",
    "score": 8.5,
    "totalPoints": 10,
    "percentage": 85,
    "submittedAt": "2026-09-29 14:20"
  },
  {
    "id": "quiz-manno-02",
    "userEmail": "matteo.manno@student.hech.be",
    "userName": "Matteo Manno",
    "moduleId": "module-02",
    "moduleTitle": "Module 02 : Écosystème des Logiciels & Power Query",
    "score": 8,
    "totalPoints": 10,
    "percentage": 80,
    "submittedAt": "2026-10-04 15:40"
  },
  {
    "id": "quiz-manno-03",
    "userEmail": "matteo.manno@student.hech.be",
    "userName": "Matteo Manno",
    "moduleId": "module-03",
    "moduleTitle": "Module 03 : Collecte et Structuration de Données (Tidy Data)",
    "score": 9,
    "totalPoints": 10,
    "percentage": 90,
    "submittedAt": "2026-10-13 16:15"
  },
  {
    "id": "quiz-manno-04",
    "userEmail": "matteo.manno@student.hech.be",
    "userName": "Matteo Manno",
    "moduleId": "module-04",
    "moduleTitle": "Module 04 : Tableaux de Bord & Outils de Suivi",
    "score": 8.5,
    "totalPoints": 10,
    "percentage": 85,
    "submittedAt": "2026-10-20 11:20"
  },
  {
    "id": "quiz-capitaine-01",
    "userEmail": "achile.capitaine@student.hech.be",
    "userName": "Achile Capitaine",
    "moduleId": "module-01",
    "moduleTitle": "Module 01 : Capteurs et Outils Numériques",
    "score": 9.5,
    "totalPoints": 10,
    "percentage": 95,
    "submittedAt": "2026-09-27 16:45"
  },
  {
    "id": "quiz-capitaine-02",
    "userEmail": "achile.capitaine@student.hech.be",
    "userName": "Achile Capitaine",
    "moduleId": "module-02",
    "moduleTitle": "Module 02 : Écosystème des Logiciels & Power Query",
    "score": 9,
    "totalPoints": 10,
    "percentage": 90,
    "submittedAt": "2026-10-02 10:30"
  },
  {
    "id": "quiz-capitaine-03",
    "userEmail": "achile.capitaine@student.hech.be",
    "userName": "Achile Capitaine",
    "moduleId": "module-03",
    "moduleTitle": "Module 03 : Collecte et Structuration de Données (Tidy Data)",
    "score": 9,
    "totalPoints": 10,
    "percentage": 90,
    "submittedAt": "2026-10-11 15:15"
  },
  {
    "id": "quiz-capitaine-04",
    "userEmail": "achile.capitaine@student.hech.be",
    "userName": "Achile Capitaine",
    "moduleId": "module-04",
    "moduleTitle": "Module 04 : Tableaux de Bord & Outils de Suivi",
    "score": 9.5,
    "totalPoints": 10,
    "percentage": 95,
    "submittedAt": "2026-10-18 17:40"
  },
  {
    "id": "quiz-capitaine-05",
    "userEmail": "achile.capitaine@student.hech.be",
    "userName": "Achile Capitaine",
    "moduleId": "module-05",
    "moduleTitle": "Module 05 : De la Donnée à la Décision",
    "score": 9,
    "totalPoints": 10,
    "percentage": 90,
    "submittedAt": "2026-10-24 16:10"
  },
  {
    "id": "quiz-capitaine-06",
    "userEmail": "achile.capitaine@student.hech.be",
    "userName": "Achile Capitaine",
    "moduleId": "module-06",
    "moduleTitle": "Module 06 : Intelligence Artificielle & Agents",
    "score": 9,
    "totalPoints": 10,
    "percentage": 90,
    "submittedAt": "2026-10-29 11:30"
  },
  {
    "id": "quiz-capitaine-07",
    "userEmail": "achile.capitaine@student.hech.be",
    "userName": "Achile Capitaine",
    "moduleId": "module-07",
    "moduleTitle": "Module 07 : Prévention du Surentraînement",
    "score": 9.5,
    "totalPoints": 10,
    "percentage": 95,
    "submittedAt": "2026-11-04 11:20"
  }
];

export const INITIAL_REAL_FILES: SubmittedFile[] = [
  {
    "id": "file-legentil-ex01",
    "userId": "user-prepa-01",
    "userName": "Maxim Legentil",
    "userEmail": "maxim.legentil@student.hech.be",
    "exerciseId": "exercice-01",
    "exerciseTitle": "Exercice 01 : Quel capteur choisir ? (10 situations)",
    "originalFileName": "LEGENTIL_Maxim_Exercice_01_Capteurs.docx",
    "formattedFileName": "LEGENTIL_Maxim_exercice-01.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 45210,
    "submittedAt": "2026-09-28 14:20",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "RAPPORT CAPTEURS ET INSTRUMENTATION DU PRÉPARATEUR PHYSIQUE\nMaxim Legentil\n10 situations analysées : GPS 15Hz football Catapult, IMU rugby, cellules photoélectriques sprint Witty, LPT Vitruve VBT, plateformes de force ForceDecks Kistler CMJ, capteurs de puissance Favero Assioma, Polar H10 HRV rMSSD, analyseur de lactate Lactate Scout, Biodex dynamomètre isocinétique, impédancemètre InBody.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 9.7,
      "maxScore": 20,
      "totalPoints100": 48.5,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.4,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 3/10 situation(s) identifiée(s), volume rédigé (50 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 13.2,
          "maxScore": 25,
          "comment": "Notions de base présentes (12 concepts identifiés), exactitude correcte mais plusieurs principes physiologiques ou métrologiques méritent d'être précisés."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.8,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 12.7,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.8,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 2.6,
          "maxScore": 5,
          "comment": "Document lisible et compréhensible, structure générale correcte avec des axes de progression sur la clarté."
        }
      ],
      "summary": "Travail amorcé pour Exercice 01 — Quel capteur choisir ? (note formative : 9.7/20). Le travail déposé aborde le sujet mais reste trop succinct (50 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "3 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 12 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 10 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 01 — Quel capteur choisir ? (note formative : 9.7/20). Le travail déposé aborde le sujet mais reste trop succinct (50 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-legentil-ex02a",
    "userId": "user-prepa-01",
    "userName": "Maxim Legentil",
    "userEmail": "maxim.legentil@student.hech.be",
    "exerciseId": "exercice-02a",
    "exerciseTitle": "Exercice 02.a : Extraction Power Query & Nutrition (Natation)",
    "originalFileName": "LEGENTIL_Maxim_Exercice_02a_PowerQuery_Natation.xlsx",
    "formattedFileName": "LEGENTIL_Maxim_exercice-02a.xlsx",
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileSize": 38400,
    "submittedAt": "2026-10-02 11:30",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "POWER QUERY ET MONITORING NUTRITIONNEL NATATION\nMaxim Legentil\nRequête Power Query active nettoyant les 12 nageurs sur 7 jours. Colonnes calculées : Glucides_g_kg (cible 7-10 g/kg) et Proteines_g_kg (1.8 g/kg). Détection d'un déficit énergétique chronique les mercredi/jeudi sur les séances biquotidiennes.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 10.6,
      "maxScore": 20,
      "totalPoints100": 53,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 3,
          "levelLabel": "Niveau 3 – Maîtrise satisfaisante",
          "score": 9.9,
          "maxScore": 15,
          "comment": "Consigne bien respectée : la quasi-totalité des situations professionnelles (5/6) sont traitées avec cohérence et structure."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 11,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (6 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 12.7,
          "maxScore": 20,
          "comment": "Démarche cohérente mais perfectible : les étapes de validation et l'examen critique des protocoles méritent d'être approfondis."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.9,
          "maxScore": 20,
          "comment": "Maîtrise technique initiale : outils nommés sans précision sur les paramètres de mesure ou d'acquisition."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 2.5,
          "maxScore": 5,
          "comment": "Document lisible et compréhensible, structure générale correcte avec des axes de progression sur la clarté."
        }
      ],
      "summary": "Travail en cours d'acquisition pour Exercice 02.a — Extraction Power Query & Monitoring Nutritionnel (Natation) (note formative : 10.6/20). Les démarches et outils proposés sont cohérents, mais l'analyse technique et le recul critique sur les protocoles de mesure méritent d'être approfondis.",
      "strengths": [
        "Sélection globalement cohérente des capteurs/logiciels sur 5 situation(s).",
        "Bonne contextualisation des exigences physiques et athlétiques des disciplines abordées.",
        "Structure de document lisible."
      ],
      "improvements": [
        "Approfondir la distinction essentielle entre mesure directe brute et variable calculée par algorithme.",
        "Préciser les fréquences d'échantillonnage (Hz) et les protocoles de placement indispensables à la fiabilité.",
        "Développer les biais de mesure (dérive GPS, artefacts de mouvement, latence cardiaque)."
      ],
      "nextSteps": [
        "Intégrer une section ou un paragraphe explicitant les limites opérationnelles de chaque outil.",
        "Structurer vos recommandations sous forme de fiches protocolaires directement exploitables par le staff.",
        "Prendre en compte les consignes de calibration avant test de terrain."
      ],
      "detailedFeedback": "Travail en cours d'acquisition pour Exercice 02.a — Extraction Power Query & Monitoring Nutritionnel (Natation) (note formative : 10.6/20). Les démarches et outils proposés sont cohérents, mais l'analyse technique et le recul critique sur les protocoles de mesure méritent d'être approfondis.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-legentil-ex02b",
    "userId": "user-prepa-01",
    "userName": "Maxim Legentil",
    "userEmail": "maxim.legentil@student.hech.be",
    "exerciseId": "exercice-02",
    "exerciseTitle": "Exercice 02.b : Quel outil pour quelle situation ? (10 cas)",
    "originalFileName": "LEGENTIL_Maxim_Exercice_02b_Logiciels.docx",
    "formattedFileName": "LEGENTIL_Maxim_exercice-02.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 31200,
    "submittedAt": "2026-10-06 16:45",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "ANALYSE LOGICIELS DU PRÉPARATEUR PHYSIQUE\nMaxim Legentil\n10 cas : Athlete Monitoring Kitman Labs, Kinovea vidéo, TeamBuildr musculation, GoldenCheetah WKO5 cyclisme, Excel Power Query, MyJump Lab, Google Forms Hooper, GymAware VBT, Catapult OpenField, Agent IA Python.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 7.1,
      "maxScore": 20,
      "totalPoints100": 35.6,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 4,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 0/9 situation(s) identifiée(s), volume rédigé (35 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.5,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (3 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.8,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 10.2,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 2.1,
          "maxScore": 5,
          "comment": "Présentation minimale (35 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 02.b — Quel outil pour quelle situation ? (note formative : 7.1/20). Le travail déposé aborde le sujet mais reste trop succinct (35 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "0 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 3 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 9 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 02.b — Quel outil pour quelle situation ? (note formative : 7.1/20). Le travail déposé aborde le sujet mais reste trop succinct (35 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-legentil-ex03",
    "userId": "user-prepa-01",
    "userName": "Maxim Legentil",
    "userEmail": "maxim.legentil@student.hech.be",
    "exerciseId": "exercice-03",
    "exerciseTitle": "Exercice 03 : Excel - Collecte et structuration de données",
    "originalFileName": "LEGENTIL_Maxim_Exercice_03_Structuration_U18.xlsx",
    "formattedFileName": "LEGENTIL_Maxim_exercice-03.xlsx",
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileSize": 52100,
    "submittedAt": "2026-10-12 18:00",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "TIDY DATA FOOTBALL U18\nMaxim Legentil\nStructure relationnelle standardisée : Date, ID_Joueur, Poste, Type_Seance, Duree_min, RPE_Borg, Charge_Session_UA, Sommeil, Courbatures, Stress, Fatigue, Hooper_Total. Validation de données et listes déroulantes.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 10.3,
      "maxScore": 20,
      "totalPoints100": 51.6,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 7.6,
          "maxScore": 15,
          "comment": "Consigne globalement comprise : 3/6 situation(s) traitée(s). Le périmètre attendu commence à être couvert mais demande à être approfondi."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 12.2,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (6 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 10.5,
          "maxScore": 20,
          "comment": "Démarche cohérente mais perfectible : les étapes de validation et l'examen critique des protocoles méritent d'être approfondis."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 12.1,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 2.2,
          "maxScore": 5,
          "comment": "Présentation minimale (27 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail en cours d'acquisition pour Exercice 03 — Données brutes au tableau de bord Excel U18 (note formative : 10.3/20). Les démarches et outils proposés sont cohérents, mais l'analyse technique et le recul critique sur les protocoles de mesure méritent d'être approfondis.",
      "strengths": [
        "Sélection globalement cohérente des capteurs/logiciels sur 3 situation(s).",
        "Bonne contextualisation des exigences physiques et athlétiques des disciplines abordées.",
        "Structure de document lisible."
      ],
      "improvements": [
        "Approfondir la distinction essentielle entre mesure directe brute et variable calculée par algorithme.",
        "Préciser les fréquences d'échantillonnage (Hz) et les protocoles de placement indispensables à la fiabilité.",
        "Développer les biais de mesure (dérive GPS, artefacts de mouvement, latence cardiaque)."
      ],
      "nextSteps": [
        "Intégrer une section ou un paragraphe explicitant les limites opérationnelles de chaque outil.",
        "Structurer vos recommandations sous forme de fiches protocolaires directement exploitables par le staff.",
        "Prendre en compte les consignes de calibration avant test de terrain."
      ],
      "detailedFeedback": "Travail en cours d'acquisition pour Exercice 03 — Données brutes au tableau de bord Excel U18 (note formative : 10.3/20). Les démarches et outils proposés sont cohérents, mais l'analyse technique et le recul critique sur les protocoles de mesure méritent d'être approfondis.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-legentil-ex04",
    "userId": "user-prepa-01",
    "userName": "Maxim Legentil",
    "userEmail": "maxim.legentil@student.hech.be",
    "exerciseId": "exercice-04",
    "exerciseTitle": "Exercice 04 : Excel - Créer ses propres outils de suivi",
    "originalFileName": "LEGENTIL_Maxim_Exercice_04_Outil_Suivi_Hooper_RPE.xlsx",
    "formattedFileName": "LEGENTIL_Maxim_exercice-04.xlsx",
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileSize": 64200,
    "submittedAt": "2026-10-18 10:15",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "TABLEAU DE BORD DYNAMIQUE HOOPER ET CHARGE ACWR\nMaxim Legentil\nCalcul charge aiguë 7j, charge chronique 28j, ratio ACWR dynamique, alertes conditionnelles vert/orange/rouge (> 1.5 danger blessure), graphiques avec segments slicers interactifs.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 8.5,
      "maxScore": 20,
      "totalPoints100": 42.7,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.6,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 1/4 situation(s) identifiée(s), volume rédigé (34 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.8,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (4 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.9,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 10.8,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.5,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 2.1,
          "maxScore": 5,
          "comment": "Présentation minimale (34 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 04 — Concevoir ses propres outils numériques de suivi (note formative : 8.5/20). Le travail déposé aborde le sujet mais reste trop succinct (34 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "1 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 4 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 4 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 04 — Concevoir ses propres outils numériques de suivi (note formative : 8.5/20). Le travail déposé aborde le sujet mais reste trop succinct (34 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-legentil-ex05",
    "userId": "user-prepa-01",
    "userName": "Maxim Legentil",
    "userEmail": "maxim.legentil@student.hech.be",
    "exerciseId": "exercice-05",
    "exerciseTitle": "Exercice 05 : De la donnée à la décision (analyse & ajustement)",
    "originalFileName": "LEGENTIL_Maxim_Exercice_05_Decision_Thomas.docx",
    "formattedFileName": "LEGENTIL_Maxim_exercice-05.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 39800,
    "submittedAt": "2026-10-24 15:30",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "ÉTUDE DE CAS : ANALYSE ET AJUSTEMENT THOMAS\nMaxim Legentil\nSurcharge ACWR 1.62 détectée, baisse CMJ -14%, Hooper 18/20. Plan d'action : décharge vélo mardi, repos mercredi, reprise adaptée jeudi, limitation temps de jeu 30 min samedi.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 9.2,
      "maxScore": 20,
      "totalPoints100": 45.9,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 7.7,
          "maxScore": 15,
          "comment": "Consigne globalement comprise : 3/5 situation(s) traitée(s). Le périmètre attendu commence à être couvert mais demande à être approfondi."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.7,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (5 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.7,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 11.3,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.4,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 2.1,
          "maxScore": 5,
          "comment": "Présentation minimale (38 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 05 — De la donnée à la décision : analyser et ajuster un entraînement (note formative : 9.2/20). Le travail déposé aborde le sujet mais reste trop succinct (38 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "3 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 5 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 5 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 05 — De la donnée à la décision : analyser et ajuster un entraînement (note formative : 9.2/20). Le travail déposé aborde le sujet mais reste trop succinct (38 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-legentil-ex06",
    "userId": "user-prepa-01",
    "userName": "Maxim Legentil",
    "userEmail": "maxim.legentil@student.hech.be",
    "exerciseId": "exercice-06",
    "exerciseTitle": "Exercice 06 : Créer une application IA et un agent",
    "originalFileName": "LEGENTIL_Maxim_Exercice_06_Application_Agent_IA.docx",
    "formattedFileName": "LEGENTIL_Maxim_exercice-06.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 41200,
    "submittedAt": "2026-10-29 11:15",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "AGENT IA DE MONITORING DU PRÉPARATEUR PHYSIQUE\nMaxim Legentil\nPrompt système structuré : analyse JSON Hooper/RPE/GPS, détection Z-score et ACWR, génération automatique de recommandations opérationnelles pour le coach à 8h45.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 10,
      "maxScore": 20,
      "totalPoints100": 49.8,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 9,
          "maxScore": 15,
          "comment": "Consigne globalement comprise : 4/5 situation(s) traitée(s). Le périmètre attendu commence à être couvert mais demande à être approfondi."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 10.5,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (5 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 11,
          "maxScore": 20,
          "comment": "Démarche cohérente mais perfectible : les étapes de validation et l'examen critique des protocoles méritent d'être approfondis."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 11.8,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.5,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 2,
          "maxScore": 5,
          "comment": "Présentation minimale (31 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail en cours d'acquisition pour Exercice 06 — Créer une application et un agent IA pour le préparateur physique (note formative : 10/20). Les démarches et outils proposés sont cohérents, mais l'analyse technique et le recul critique sur les protocoles de mesure méritent d'être approfondis.",
      "strengths": [
        "Sélection globalement cohérente des capteurs/logiciels sur 4 situation(s).",
        "Bonne contextualisation des exigences physiques et athlétiques des disciplines abordées.",
        "Structure de document lisible."
      ],
      "improvements": [
        "Approfondir la distinction essentielle entre mesure directe brute et variable calculée par algorithme.",
        "Préciser les fréquences d'échantillonnage (Hz) et les protocoles de placement indispensables à la fiabilité.",
        "Développer les biais de mesure (dérive GPS, artefacts de mouvement, latence cardiaque)."
      ],
      "nextSteps": [
        "Intégrer une section ou un paragraphe explicitant les limites opérationnelles de chaque outil.",
        "Structurer vos recommandations sous forme de fiches protocolaires directement exploitables par le staff.",
        "Prendre en compte les consignes de calibration avant test de terrain."
      ],
      "detailedFeedback": "Travail en cours d'acquisition pour Exercice 06 — Créer une application et un agent IA pour le préparateur physique (note formative : 10/20). Les démarches et outils proposés sont cohérents, mais l'analyse technique et le recul critique sur les protocoles de mesure méritent d'être approfondis.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-legentil-ex07",
    "userId": "user-prepa-01",
    "userName": "Maxim Legentil",
    "userEmail": "maxim.legentil@student.hech.be",
    "exerciseId": "exercice-07",
    "exerciseTitle": "Exercice 07 : Modèle de lutte contre le surentraînement en football",
    "originalFileName": "LEGENTIL_Maxim_Exercice_07_Mission_Finale_Football.docx",
    "formattedFileName": "LEGENTIL_Maxim_exercice-07.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 85600,
    "submittedAt": "2026-11-04 17:30",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "MISSION FINALE : MODÈLE INTÉGRATIF DE PRÉVENTION DU SURENTRAÎNEMENT\nMaxim Legentil\nSurveillance à 4 piliers (Externe GPS 15Hz, Interne sRPE & HRV Polar H10, Neuromusculaire CMJ Kistler, Psychologique Hooper/RESTQ). Modélisation de la monotonie et de la contrainte. Arbre décisionnel multidisciplinaire.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 8,
      "maxScore": 20,
      "totalPoints100": 39.9,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.8,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 2/6 situation(s) identifiée(s), volume rédigé (39 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.5,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (5 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 10.5,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.1,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 2,
          "maxScore": 5,
          "comment": "Présentation minimale (39 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 07 — Mission finale : Modèle de lutte contre le surentraînement en football (note formative : 8/20). Le travail déposé aborde le sujet mais reste trop succinct (39 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "2 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 5 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 6 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 07 — Mission finale : Modèle de lutte contre le surentraînement en football (note formative : 8/20). Le travail déposé aborde le sujet mais reste trop succinct (39 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-lemaire-ex01",
    "userId": "user-prepa-02",
    "userName": "Emma Lemaire",
    "userEmail": "emma.lemaire@student.hech.be",
    "exerciseId": "exercice-01",
    "exerciseTitle": "Exercice 01 : Quel capteur choisir ? (10 situations)",
    "originalFileName": "LEMAIRE_Emma_Exercice_01_Capteurs.docx",
    "formattedFileName": "LEMAIRE_Emma_exercice-01.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 42100,
    "submittedAt": "2026-09-29 16:10",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "ANALYSE COMPARATIVE DES CAPTEURS\nEmma Lemaire\nGPS Catapult 10Hz, plateformes de force ForceDecks, LPT Vitruve, Polar H10 HRV, Lactate Scout, cellules Microgate Witty, capteurs de puissance Favero, Biodex isocinétique, Kinovea, InBody.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 7.6,
      "maxScore": 20,
      "totalPoints100": 38.1,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 4,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 0/10 situation(s) identifiée(s), volume rédigé (31 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 10.1,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (7 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.8,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 10.9,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.3,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 2,
          "maxScore": 5,
          "comment": "Présentation minimale (31 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 01 — Quel capteur choisir ? (note formative : 7.6/20). Le travail déposé aborde le sujet mais reste trop succinct (31 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "0 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 7 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 10 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 01 — Quel capteur choisir ? (note formative : 7.6/20). Le travail déposé aborde le sujet mais reste trop succinct (31 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-lemaire-ex02a",
    "userId": "user-prepa-02",
    "userName": "Emma Lemaire",
    "userEmail": "emma.lemaire@student.hech.be",
    "exerciseId": "exercice-02a",
    "exerciseTitle": "Exercice 02.a : Extraction Power Query & Nutrition (Natation)",
    "originalFileName": "LEMAIRE_Emma_Exercice_02a_PowerQuery.xlsx",
    "formattedFileName": "LEMAIRE_Emma_exercice-02a.xlsx",
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileSize": 37500,
    "submittedAt": "2026-10-03 14:00",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "POWER QUERY MONITORING NUTRITION\nEmma Lemaire\nTransformation automatisée des données de 12 nageurs, nettoyage des anomalies, calcul des ratios Glucides_g_kg et Proteines_g_kg. Plan de recharge glucidique ciblé.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 9.8,
      "maxScore": 20,
      "totalPoints100": 48.9,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 8.3,
          "maxScore": 15,
          "comment": "Consigne globalement comprise : 4/6 situation(s) traitée(s). Le périmètre attendu commence à être couvert mais demande à être approfondi."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.3,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (4 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 11.6,
          "maxScore": 20,
          "comment": "Démarche cohérente mais perfectible : les étapes de validation et l'examen critique des protocoles méritent d'être approfondis."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 11.1,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.6,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 2,
          "maxScore": 5,
          "comment": "Présentation minimale (27 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 02.a — Extraction Power Query & Monitoring Nutritionnel (Natation) (note formative : 9.8/20). Le travail déposé aborde le sujet mais reste trop succinct (27 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "4 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 4 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 6 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 02.a — Extraction Power Query & Monitoring Nutritionnel (Natation) (note formative : 9.8/20). Le travail déposé aborde le sujet mais reste trop succinct (27 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-lemaire-ex02b",
    "userId": "user-prepa-02",
    "userName": "Emma Lemaire",
    "userEmail": "emma.lemaire@student.hech.be",
    "exerciseId": "exercice-02",
    "exerciseTitle": "Exercice 02.b : Quel outil pour quelle situation ? (10 cas)",
    "originalFileName": "LEMAIRE_Emma_Exercice_02b_Logiciels.docx",
    "formattedFileName": "LEMAIRE_Emma_exercice-02.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 32400,
    "submittedAt": "2026-10-07 14:30",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "ANALYSE DES OUTILS LOGICIELS DU PRÉPARATEUR PHYSIQUE\nEmma Lemaire\n10 cas traités : Smartabase, Dartfish, TeamBuildr, WKO5, Excel Power Query, MyJump Lab, Google Forms, GymAware, Catapult OpenField, Script IA.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 6.6,
      "maxScore": 20,
      "totalPoints100": 33.2,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 3.7,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 0/9 situation(s) identifiée(s), volume rédigé (28 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.3,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (2 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.8,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.7,
          "maxScore": 20,
          "comment": "Maîtrise technique initiale : outils nommés sans précision sur les paramètres de mesure ou d'acquisition."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 4.9,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.8,
          "maxScore": 5,
          "comment": "Présentation minimale (28 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 02.b — Quel outil pour quelle situation ? (note formative : 6.6/20). Le travail déposé aborde le sujet mais reste trop succinct (28 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "0 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 2 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 9 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 02.b — Quel outil pour quelle situation ? (note formative : 6.6/20). Le travail déposé aborde le sujet mais reste trop succinct (28 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-lemaire-ex03",
    "userId": "user-prepa-02",
    "userName": "Emma Lemaire",
    "userEmail": "emma.lemaire@student.hech.be",
    "exerciseId": "exercice-03",
    "exerciseTitle": "Exercice 03 : Excel - Collecte et structuration de données",
    "originalFileName": "LEMAIRE_Emma_Exercice_03_Structuration_U18.xlsx",
    "formattedFileName": "LEMAIRE_Emma_exercice-03.xlsx",
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileSize": 49800,
    "submittedAt": "2026-10-13 11:20",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "STRUCTURATION TIDY DATA FOOTBALL U18\nEmma Lemaire\nTableau normalisé sans cellules fusionnées. Variables : Date, ID, Poste, RPE, Durée, Charge UA, Hooper. Validation des données par liste déroulante.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 9.1,
      "maxScore": 20,
      "totalPoints100": 45.5,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.2,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 3/6 situation(s) identifiée(s), volume rédigé (27 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.6,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (3 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 10.5,
          "maxScore": 20,
          "comment": "Démarche cohérente mais perfectible : les étapes de validation et l'examen critique des protocoles méritent d'être approfondis."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 10.7,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.5,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 2,
          "maxScore": 5,
          "comment": "Présentation minimale (27 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 03 — Données brutes au tableau de bord Excel U18 (note formative : 9.1/20). Le travail déposé aborde le sujet mais reste trop succinct (27 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "3 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 3 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 6 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 03 — Données brutes au tableau de bord Excel U18 (note formative : 9.1/20). Le travail déposé aborde le sujet mais reste trop succinct (27 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-lemaire-ex04",
    "userId": "user-prepa-02",
    "userName": "Emma Lemaire",
    "userEmail": "emma.lemaire@student.hech.be",
    "exerciseId": "exercice-04",
    "exerciseTitle": "Exercice 04 : Excel - Créer ses propres outils de suivi",
    "originalFileName": "LEMAIRE_Emma_Exercice_04_Suivi_Charge.xlsx",
    "formattedFileName": "LEMAIRE_Emma_exercice-04.xlsx",
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileSize": 61500,
    "submittedAt": "2026-10-19 16:40",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "DASHBOARD CHARGE AIGUË / CHRONIQUE ET HOOPER\nEmma Lemaire\nModèle ACWR dynamique avec mise en forme conditionnelle et alertes précoces de surentraînement.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 8.1,
      "maxScore": 20,
      "totalPoints100": 40.3,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.3,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 1/4 situation(s) identifiée(s), volume rédigé (21 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.9,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (3 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.9,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 10.1,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.4,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.7,
          "maxScore": 5,
          "comment": "Présentation minimale (21 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 04 — Concevoir ses propres outils numériques de suivi (note formative : 8.1/20). Le travail déposé aborde le sujet mais reste trop succinct (21 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "1 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 3 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 4 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 04 — Concevoir ses propres outils numériques de suivi (note formative : 8.1/20). Le travail déposé aborde le sujet mais reste trop succinct (21 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-lemaire-ex05",
    "userId": "user-prepa-02",
    "userName": "Emma Lemaire",
    "userEmail": "emma.lemaire@student.hech.be",
    "exerciseId": "exercice-05",
    "exerciseTitle": "Exercice 05 : De la donnée à la décision (analyse & ajustement)",
    "originalFileName": "LEMAIRE_Emma_Exercice_05_Decision_Thomas.docx",
    "formattedFileName": "LEMAIRE_Emma_exercice-05.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 38200,
    "submittedAt": "2026-10-25 14:15",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "ÉTUDE DE CAS THOMAS : DÉCISION DU PRÉPARATEUR PHYSIQUE\nEmma Lemaire\nAnalyse multifactorielle : ACWR à 1.58, baisse CMJ, Hooper élevé. Prescription de décharge active et régulation du temps de jeu.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 8.4,
      "maxScore": 20,
      "totalPoints100": 41.9,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.4,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 2/5 situation(s) identifiée(s), volume rédigé (30 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.3,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (4 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.4,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 10.7,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.2,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.9,
          "maxScore": 5,
          "comment": "Présentation minimale (30 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 05 — De la donnée à la décision : analyser et ajuster un entraînement (note formative : 8.4/20). Le travail déposé aborde le sujet mais reste trop succinct (30 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "2 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 4 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 5 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 05 — De la donnée à la décision : analyser et ajuster un entraînement (note formative : 8.4/20). Le travail déposé aborde le sujet mais reste trop succinct (30 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-lemaire-ex06",
    "userId": "user-prepa-02",
    "userName": "Emma Lemaire",
    "userEmail": "emma.lemaire@student.hech.be",
    "exerciseId": "exercice-06",
    "exerciseTitle": "Exercice 06 : Créer une application IA et un agent",
    "originalFileName": "LEMAIRE_Emma_Exercice_06_Agent_IA.docx",
    "formattedFileName": "LEMAIRE_Emma_exercice-06.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 40500,
    "submittedAt": "2026-10-30 17:00",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "AGENT INTELLIGENT DE CONSEIL EN CHARGE D'ENTRAÎNEMENT\nEmma Lemaire\nDéfinition du persona IA, filtrage des valeurs aberrantes et synthèse matinale pour le staff.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 6.9,
      "maxScore": 20,
      "totalPoints100": 34.4,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.1,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 1/5 situation(s) identifiée(s), volume rédigé (24 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.2,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (2 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.1,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.2,
          "maxScore": 20,
          "comment": "Maîtrise technique initiale : outils nommés sans précision sur les paramètres de mesure ou d'acquisition."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.8,
          "maxScore": 5,
          "comment": "Présentation minimale (24 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 06 — Créer une application et un agent IA pour le préparateur physique (note formative : 6.9/20). Le travail déposé aborde le sujet mais reste trop succinct (24 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "1 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 2 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 5 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 06 — Créer une application et un agent IA pour le préparateur physique (note formative : 6.9/20). Le travail déposé aborde le sujet mais reste trop succinct (24 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-lemaire-ex07",
    "userId": "user-prepa-02",
    "userName": "Emma Lemaire",
    "userEmail": "emma.lemaire@student.hech.be",
    "exerciseId": "exercice-07",
    "exerciseTitle": "Exercice 07 : Modèle de lutte contre le surentraînement en football",
    "originalFileName": "LEMAIRE_Emma_Exercice_07_Mission_Finale.docx",
    "formattedFileName": "LEMAIRE_Emma_exercice-07.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 81400,
    "submittedAt": "2026-11-03 18:45",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "MISSION FINALE : PRÉVENTION DU SURENTRAÎNEMENT EN FOOTBALL PROFESSIONNEL\nEmma Lemaire\nApproche intégrée GPS, HRV, Hooper et CMJ. Algorithme de détection du surmenage non fonctionnel et arbre de décision.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 7,
      "maxScore": 20,
      "totalPoints100": 34.8,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.5,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 2/6 situation(s) identifiée(s), volume rédigé (28 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.4,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (4 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.2,
          "maxScore": 20,
          "comment": "Maîtrise technique initiale : outils nommés sans précision sur les paramètres de mesure ou d'acquisition."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.7,
          "maxScore": 5,
          "comment": "Présentation minimale (28 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 07 — Mission finale : Modèle de lutte contre le surentraînement en football (note formative : 7/20). Le travail déposé aborde le sujet mais reste trop succinct (28 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "2 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 4 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 6 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 07 — Mission finale : Modèle de lutte contre le surentraînement en football (note formative : 7/20). Le travail déposé aborde le sujet mais reste trop succinct (28 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-daltin-ex01",
    "userId": "user-prepa-03",
    "userName": "Antoine Daltin",
    "userEmail": "antoine.daltin@student.hech.be",
    "exerciseId": "exercice-01",
    "exerciseTitle": "Exercice 01 : Quel capteur choisir ? (10 situations)",
    "originalFileName": "DALTIN_Antoine_Exercice_01_Capteurs.docx",
    "formattedFileName": "DALTIN_Antoine_exercice-01.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 41800,
    "submittedAt": "2026-09-29 11:40",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "SÉLECTION DES CAPTEURS EN PRÉPARATION PHYSIQUE\nAntoine Daltin\n10 situations : GPS 15Hz, plateformes de force CMJ, VBT GymAware, cellules sprint Witty, Polar H10, analyseur de lactate.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 8,
      "maxScore": 20,
      "totalPoints100": 39.8,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 4.5,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 1/10 situation(s) identifiée(s), volume rédigé (26 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 10.4,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (8 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.5,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 11.1,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.4,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.9,
          "maxScore": 5,
          "comment": "Présentation minimale (26 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 01 — Quel capteur choisir ? (note formative : 8/20). Le travail déposé aborde le sujet mais reste trop succinct (26 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "1 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 8 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 10 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 01 — Quel capteur choisir ? (note formative : 8/20). Le travail déposé aborde le sujet mais reste trop succinct (26 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-daltin-ex02a",
    "userId": "user-prepa-03",
    "userName": "Antoine Daltin",
    "userEmail": "antoine.daltin@student.hech.be",
    "exerciseId": "exercice-02a",
    "exerciseTitle": "Exercice 02.a : Extraction Power Query & Nutrition (Natation)",
    "originalFileName": "DALTIN_Antoine_Exercice_02a_PowerQuery.xlsx",
    "formattedFileName": "DALTIN_Antoine_exercice-02a.xlsx",
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileSize": 36200,
    "submittedAt": "2026-10-04 16:30",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "TRAITEMENT POWER QUERY NUTRITION NATATION\nAntoine Daltin\nNettoyage des données, typage, suppression des valeurs nulles, calcul des ratios glucides et protéines par kg de masse corporelle.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 9.6,
      "maxScore": 20,
      "totalPoints100": 48.1,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 8.1,
          "maxScore": 15,
          "comment": "Consigne globalement comprise : 4/6 situation(s) traitée(s). Le périmètre attendu commence à être couvert mais demande à être approfondi."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.8,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (4 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 11.6,
          "maxScore": 20,
          "comment": "Démarche cohérente mais perfectible : les étapes de validation et l'examen critique des protocoles méritent d'être approfondis."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 11.1,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.6,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.9,
          "maxScore": 5,
          "comment": "Présentation minimale (26 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 02.a — Extraction Power Query & Monitoring Nutritionnel (Natation) (note formative : 9.6/20). Le travail déposé aborde le sujet mais reste trop succinct (26 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "4 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 4 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 6 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 02.a — Extraction Power Query & Monitoring Nutritionnel (Natation) (note formative : 9.6/20). Le travail déposé aborde le sujet mais reste trop succinct (26 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-daltin-ex02b",
    "userId": "user-prepa-03",
    "userName": "Antoine Daltin",
    "userEmail": "antoine.daltin@student.hech.be",
    "exerciseId": "exercice-02",
    "exerciseTitle": "Exercice 02.b : Quel outil pour quelle situation ? (10 cas)",
    "originalFileName": "DALTIN_Antoine_Exercice_02b_Logiciels.docx",
    "formattedFileName": "DALTIN_Antoine_exercice-02.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 30100,
    "submittedAt": "2026-10-08 11:10",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "LOGICIELS ET APPLICATIONS EN PRÉPARATION PHYSIQUE\nAntoine Daltin\nRevue des 10 solutions logicielles professionnelles.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 0,
      "maxScore": 20,
      "totalPoints100": 0,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 0,
          "levelLabel": "Niveau 0 – Non rendu / Document vide",
          "score": 0,
          "maxScore": 15,
          "comment": "Document vide ou inexploitable : aucun contenu rédigé significatif extrait. Aucun point n'est attribué."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 0,
          "levelLabel": "Niveau 0 – Non rendu / Document vide",
          "score": 0,
          "maxScore": 25,
          "comment": "Aucun concept scientifique ou physiologique mobilisé dans le document remis."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 0,
          "levelLabel": "Niveau 0 – Non rendu / Document vide",
          "score": 0,
          "maxScore": 20,
          "comment": "Démarche méthodologique absente ou non évaluable."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 0,
          "levelLabel": "Niveau 0 – Non rendu / Document vide",
          "score": 0,
          "maxScore": 20,
          "comment": "Aucun outil technologique, capteur ni traitement numérique exploité."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 0,
          "levelLabel": "Niveau 0 – Non rendu / Document vide",
          "score": 0,
          "maxScore": 15,
          "comment": "Aucune analyse critique, justification physiologique ni recul observable."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 0,
          "levelLabel": "Niveau 0 – Non rendu / Document vide",
          "score": 0,
          "maxScore": 5,
          "comment": "Fichier vide ou inexploitable (volume textuel inférieur au seuil minimal)."
        }
      ],
      "summary": "❌ AUCUN POINT ATTRIBUÉ (0.0/20) : Le document remis (\"DALTIN_Antoine_Exercice_02b_Logiciels.docx\") est vide ou inexploitable (14 mot(s) rédigé(s)). Conformément aux critères d'évaluation, un travail vide ou non rendu reçoit strictement 0/20.",
      "strengths": [],
      "improvements": [
        "Déposer un document complété contenant l'intégralité du travail rédigé pour Exercice 02.b — Quel outil pour quelle situation ?.",
        "Vérifier le contenu effectif du fichier (.docx ou .xlsx) avant soumission.",
        "Consulter les consignes et le document modèle sur la plateforme."
      ],
      "nextSteps": [
        "Télécharger le modèle de travail officiel (.docx ou Google Docs).",
        "Rédiger les réponses aux questions et études de cas.",
        "Déposer à nouveau le livrable complété pour analyse formative."
      ],
      "detailedFeedback": "❌ AUCUN POINT ATTRIBUÉ (0.0/20) : Le document remis (\"DALTIN_Antoine_Exercice_02b_Logiciels.docx\") est vide ou inexploitable (14 mot(s) rédigé(s)). Conformément aux critères d'évaluation, un travail vide ou non rendu reçoit strictement 0/20.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères — Barème Strict Non Rendu)"
    }
  },
  {
    "id": "file-daltin-ex03",
    "userId": "user-prepa-03",
    "userName": "Antoine Daltin",
    "userEmail": "antoine.daltin@student.hech.be",
    "exerciseId": "exercice-03",
    "exerciseTitle": "Exercice 03 : Excel - Collecte et structuration de données",
    "originalFileName": "DALTIN_Antoine_Exercice_03_Structuration.xlsx",
    "formattedFileName": "DALTIN_Antoine_exercice-03.xlsx",
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileSize": 48500,
    "submittedAt": "2026-10-14 15:20",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "BASE DE DONNÉES TIDY DATA FOOTBALL\nAntoine Daltin\nFormat tabulaire propre, colonnes typées, menu déroulant de validation.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 3,
      "maxScore": 20,
      "totalPoints100": 15,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Hors-Sujet)",
          "score": 2.5,
          "maxScore": 15,
          "comment": "Hors-sujet : Le document ne traite pas de la thématique demandée (Exercice 03 — Données brutes au tableau de bord Excel U18)."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 3.5,
          "maxScore": 25,
          "comment": "Aucun concept scientifique ou technologique lié à la préparation physique n'est mobilisé."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2.5,
          "maxScore": 20,
          "comment": "Démarche méthodologique absente ou non applicable à la problématique sportive demandée."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2.5,
          "maxScore": 20,
          "comment": "Aucun outil numérique ni dispositif technique pertinent n'est exploité."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2,
          "maxScore": 15,
          "comment": "Aucune analyse critique ni justification athlétique observable."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2,
          "maxScore": 5,
          "comment": "Document structuré en soi mais totalement non avenu dans le cadre de ce cours."
        }
      ],
      "summary": "⚠️ ALERTE HORS-SUJET : Le document déposé (\"DALTIN_Antoine_Exercice_03_Structuration.xlsx\") ne correspond pas aux objectifs de Exercice 03 — Données brutes au tableau de bord Excel U18. Aucun concept de préparation physique, de mesure ou de données sportives n'a pu être validé. La note formative attribuée (3/20) reflète l'absence de livrable conforme aux consignes de terrain.",
      "strengths": [
        "Le fichier a été correctement transmis via la plateforme (aspect technique du dépôt validé)."
      ],
      "improvements": [
        "Vérifier impérativement le sujet de l'exercice avant le dépôt : le travail doit porter sur Exercice 03 — Données brutes au tableau de bord Excel U18.",
        "Produire le livrable attendu : Nettoyage de données U18, calculs de charge (Foster : Durée × RPE), 3 TCD, 3 graphiques et dashboard synthétique.",
        "Consulter les consignes officielles et le document modèle sur la plateforme avant de déposer à nouveau."
      ],
      "nextSteps": [
        "Télécharger le modèle de travail officiel (.docx ou Google Docs).",
        "Compléter les cas d'application du cours en mobilisant les notions du syllabus.",
        "Déposer à nouveau le fichier complété pour une nouvelle analyse formative."
      ],
      "detailedFeedback": "⚠️ ALERTE HORS-SUJET : Le document déposé (\"DALTIN_Antoine_Exercice_03_Structuration.xlsx\") ne correspond pas aux objectifs de Exercice 03 — Données brutes au tableau de bord Excel U18. Aucun concept de préparation physique, de mesure ou de données sportives n'a pu être validé. La note formative attribuée (3/20) reflète l'absence de livrable conforme aux consignes de terrain.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-daltin-ex04",
    "userId": "user-prepa-03",
    "userName": "Antoine Daltin",
    "userEmail": "antoine.daltin@student.hech.be",
    "exerciseId": "exercice-04",
    "exerciseTitle": "Exercice 04 : Excel - Créer ses propres outils de suivi",
    "originalFileName": "DALTIN_Antoine_Exercice_04_Suivi_Charge.xlsx",
    "formattedFileName": "DALTIN_Antoine_exercice-04.xlsx",
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileSize": 58900,
    "submittedAt": "2026-10-20 18:00",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "OUTIL DE SUIVI CHARGE ET RATIO ACWR\nAntoine Daltin\nCalcul des moyennes mobiles 7j et 28j, détection visuelle des pics de charge.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 3,
      "maxScore": 20,
      "totalPoints100": 15,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Hors-Sujet)",
          "score": 2.5,
          "maxScore": 15,
          "comment": "Hors-sujet : Le document ne traite pas de la thématique demandée (Exercice 04 — Concevoir ses propres outils numériques de suivi)."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 3.5,
          "maxScore": 25,
          "comment": "Aucun concept scientifique ou technologique lié à la préparation physique n'est mobilisé."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2.5,
          "maxScore": 20,
          "comment": "Démarche méthodologique absente ou non applicable à la problématique sportive demandée."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2.5,
          "maxScore": 20,
          "comment": "Aucun outil numérique ni dispositif technique pertinent n'est exploité."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2,
          "maxScore": 15,
          "comment": "Aucune analyse critique ni justification athlétique observable."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2,
          "maxScore": 5,
          "comment": "Document structuré en soi mais totalement non avenu dans le cadre de ce cours."
        }
      ],
      "summary": "⚠️ ALERTE HORS-SUJET : Le document déposé (\"DALTIN_Antoine_Exercice_04_Suivi_Charge.xlsx\") ne correspond pas aux objectifs de Exercice 04 — Concevoir ses propres outils numériques de suivi. Aucun concept de préparation physique, de mesure ou de données sportives n'a pu être validé. La note formative attribuée (3/20) reflète l'absence de livrable conforme aux consignes de terrain.",
      "strengths": [
        "Le fichier a été correctement transmis via la plateforme (aspect technique du dépôt validé)."
      ],
      "improvements": [
        "Vérifier impérativement le sujet de l'exercice avant le dépôt : le travail doit porter sur Exercice 04 — Concevoir ses propres outils numériques de suivi.",
        "Produire le livrable attendu : Conception de 4 outils sous tableur : suivi Hooper, RPE Foster, carnet d'entraînement et batterie de tests physiques automatisée.",
        "Consulter les consignes officielles et le document modèle sur la plateforme avant de déposer à nouveau."
      ],
      "nextSteps": [
        "Télécharger le modèle de travail officiel (.docx ou Google Docs).",
        "Compléter les cas d'application du cours en mobilisant les notions du syllabus.",
        "Déposer à nouveau le fichier complété pour une nouvelle analyse formative."
      ],
      "detailedFeedback": "⚠️ ALERTE HORS-SUJET : Le document déposé (\"DALTIN_Antoine_Exercice_04_Suivi_Charge.xlsx\") ne correspond pas aux objectifs de Exercice 04 — Concevoir ses propres outils numériques de suivi. Aucun concept de préparation physique, de mesure ou de données sportives n'a pu être validé. La note formative attribuée (3/20) reflète l'absence de livrable conforme aux consignes de terrain.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-daltin-ex05",
    "userId": "user-prepa-03",
    "userName": "Antoine Daltin",
    "userEmail": "antoine.daltin@student.hech.be",
    "exerciseId": "exercice-05",
    "exerciseTitle": "Exercice 05 : De la donnée à la décision (analyse & ajustement)",
    "originalFileName": "DALTIN_Antoine_Exercice_05_Decision.docx",
    "formattedFileName": "DALTIN_Antoine_exercice-05.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 37400,
    "submittedAt": "2026-10-26 10:30",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "ANALYSE DU CAS THOMAS\nAntoine Daltin\nDiagnostic de surmenage aigu, ajustement du microcycle et réduction des impacts.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 7.6,
      "maxScore": 20,
      "totalPoints100": 38.1,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.9,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 2/5 situation(s) identifiée(s), volume rédigé (17 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.9,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (5 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.4,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.1,
          "maxScore": 20,
          "comment": "Maîtrise technique initiale : outils nommés sans précision sur les paramètres de mesure ou d'acquisition."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.4,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.4,
          "maxScore": 5,
          "comment": "Présentation minimale (17 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 05 — De la donnée à la décision : analyser et ajuster un entraînement (note formative : 7.6/20). Le travail déposé aborde le sujet mais reste trop succinct (17 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "2 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 5 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 5 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 05 — De la donnée à la décision : analyser et ajuster un entraînement (note formative : 7.6/20). Le travail déposé aborde le sujet mais reste trop succinct (17 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-daltin-ex06",
    "userId": "user-prepa-03",
    "userName": "Antoine Daltin",
    "userEmail": "antoine.daltin@student.hech.be",
    "exerciseId": "exercice-06",
    "exerciseTitle": "Exercice 06 : Créer une application IA et un agent",
    "originalFileName": "DALTIN_Antoine_Exercice_06_Agent_IA.docx",
    "formattedFileName": "DALTIN_Antoine_exercice-06.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 39100,
    "submittedAt": "2026-10-31 16:15",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "CAHIER DES CHARGES D'UN AGENT IA EN CHARGE PHYSIQUE\nAntoine Daltin\nPrompting expert et automatisation du rapport de fatigue.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 7.8,
      "maxScore": 20,
      "totalPoints100": 38.8,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.4,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 2/5 situation(s) identifiée(s), volume rédigé (20 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.4,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (3 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.4,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.7,
          "maxScore": 20,
          "comment": "Maîtrise technique initiale : outils nommés sans précision sur les paramètres de mesure ou d'acquisition."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.1,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.8,
          "maxScore": 5,
          "comment": "Présentation minimale (20 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 06 — Créer une application et un agent IA pour le préparateur physique (note formative : 7.8/20). Le travail déposé aborde le sujet mais reste trop succinct (20 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "2 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 3 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 5 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 06 — Créer une application et un agent IA pour le préparateur physique (note formative : 7.8/20). Le travail déposé aborde le sujet mais reste trop succinct (20 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-manno-ex01",
    "userId": "user-prepa-04",
    "userName": "Matteo Manno",
    "userEmail": "matteo.manno@student.hech.be",
    "exerciseId": "exercice-01",
    "exerciseTitle": "Exercice 01 : Quel capteur choisir ? (10 situations)",
    "originalFileName": "MANNO_Matteo_Exercice_01_Capteurs.docx",
    "formattedFileName": "MANNO_Matteo_exercice-01.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 39500,
    "submittedAt": "2026-09-30 18:20",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "CHOIX DE CAPTEURS EN PRÉPARATION PHYSIQUE\nMatteo Manno\nÉtude comparative de 10 technologies : GPS haute fréquence, radar Doppler, dynamomètres, plateformes de force et capteurs de puissance.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 7.4,
      "maxScore": 20,
      "totalPoints100": 36.8,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 4,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 0/10 situation(s) identifiée(s), volume rédigé (26 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.6,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (5 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.8,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 10.3,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.1,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 2,
          "maxScore": 5,
          "comment": "Présentation minimale (26 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 01 — Quel capteur choisir ? (note formative : 7.4/20). Le travail déposé aborde le sujet mais reste trop succinct (26 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "0 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 5 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 10 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 01 — Quel capteur choisir ? (note formative : 7.4/20). Le travail déposé aborde le sujet mais reste trop succinct (26 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-manno-ex02a",
    "userId": "user-prepa-04",
    "userName": "Matteo Manno",
    "userEmail": "matteo.manno@student.hech.be",
    "exerciseId": "exercice-02a",
    "exerciseTitle": "Exercice 02.a : Extraction Power Query & Nutrition (Natation)",
    "originalFileName": "MANNO_Matteo_Exercice_02a_PowerQuery.xlsx",
    "formattedFileName": "MANNO_Matteo_exercice-02a.xlsx",
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileSize": 35800,
    "submittedAt": "2026-10-05 10:45",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "REQUÊTE POWER QUERY ET ANALYSE NUTRITIONNELLE\nMatteo Manno\nAutomatisation de l'import des macronutriments et calcul des besoins énergétiques par nageur.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 7.5,
      "maxScore": 20,
      "totalPoints100": 37.7,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.9,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 2/6 situation(s) identifiée(s), volume rédigé (21 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.2,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (2 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.4,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.2,
          "maxScore": 20,
          "comment": "Maîtrise technique initiale : outils nommés sans précision sur les paramètres de mesure ou d'acquisition."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.3,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.7,
          "maxScore": 5,
          "comment": "Présentation minimale (21 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 02.a — Extraction Power Query & Monitoring Nutritionnel (Natation) (note formative : 7.5/20). Le travail déposé aborde le sujet mais reste trop succinct (21 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "2 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 2 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 6 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 02.a — Extraction Power Query & Monitoring Nutritionnel (Natation) (note formative : 7.5/20). Le travail déposé aborde le sujet mais reste trop succinct (21 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-manno-ex02b",
    "userId": "user-prepa-04",
    "userName": "Matteo Manno",
    "userEmail": "matteo.manno@student.hech.be",
    "exerciseId": "exercice-02",
    "exerciseTitle": "Exercice 02.b : Quel outil pour quelle situation ? (10 cas)",
    "originalFileName": "MANNO_Matteo_Exercice_02b_Logiciels.docx",
    "formattedFileName": "MANNO_Matteo_exercice-02.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 29500,
    "submittedAt": "2026-10-09 14:15",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "ÉCOSYSTÈME LOGICIEL DU PRÉPARATEUR PHYSIQUE\nMatteo Manno\nSolutions logicielles adaptées aux 10 cas de figure.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 3,
      "maxScore": 20,
      "totalPoints100": 15,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Hors-Sujet)",
          "score": 2.5,
          "maxScore": 15,
          "comment": "Hors-sujet : Le document ne traite pas de la thématique demandée (Exercice 02.b — Quel outil pour quelle situation ?)."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 3.5,
          "maxScore": 25,
          "comment": "Aucun concept scientifique ou technologique lié à la préparation physique n'est mobilisé."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2.5,
          "maxScore": 20,
          "comment": "Démarche méthodologique absente ou non applicable à la problématique sportive demandée."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2.5,
          "maxScore": 20,
          "comment": "Aucun outil numérique ni dispositif technique pertinent n'est exploité."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2,
          "maxScore": 15,
          "comment": "Aucune analyse critique ni justification athlétique observable."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2,
          "maxScore": 5,
          "comment": "Document structuré en soi mais totalement non avenu dans le cadre de ce cours."
        }
      ],
      "summary": "⚠️ ALERTE HORS-SUJET : Le document déposé (\"MANNO_Matteo_Exercice_02b_Logiciels.docx\") ne correspond pas aux objectifs de Exercice 02.b — Quel outil pour quelle situation ?. Aucun concept de préparation physique, de mesure ou de données sportives n'a pu être validé. La note formative attribuée (3/20) reflète l'absence de livrable conforme aux consignes de terrain.",
      "strengths": [
        "Le fichier a été correctement transmis via la plateforme (aspect technique du dépôt validé)."
      ],
      "improvements": [
        "Vérifier impérativement le sujet de l'exercice avant le dépôt : le travail doit porter sur Exercice 02.b — Quel outil pour quelle situation ?.",
        "Produire le livrable attendu : 10 cas décisionnels avec sélection de logiciel adapté (Nolio, WKO5, Kinovea, TrainingPeaks...), alternative et limites.",
        "Consulter les consignes officielles et le document modèle sur la plateforme avant de déposer à nouveau."
      ],
      "nextSteps": [
        "Télécharger le modèle de travail officiel (.docx ou Google Docs).",
        "Compléter les cas d'application du cours en mobilisant les notions du syllabus.",
        "Déposer à nouveau le fichier complété pour une nouvelle analyse formative."
      ],
      "detailedFeedback": "⚠️ ALERTE HORS-SUJET : Le document déposé (\"MANNO_Matteo_Exercice_02b_Logiciels.docx\") ne correspond pas aux objectifs de Exercice 02.b — Quel outil pour quelle situation ?. Aucun concept de préparation physique, de mesure ou de données sportives n'a pu être validé. La note formative attribuée (3/20) reflète l'absence de livrable conforme aux consignes de terrain.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-manno-ex03",
    "userId": "user-prepa-04",
    "userName": "Matteo Manno",
    "userEmail": "matteo.manno@student.hech.be",
    "exerciseId": "exercice-03",
    "exerciseTitle": "Exercice 03 : Excel - Collecte et structuration de données",
    "originalFileName": "MANNO_Matteo_Exercice_03_Structuration.xlsx",
    "formattedFileName": "MANNO_Matteo_exercice-03.xlsx",
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileSize": 47200,
    "submittedAt": "2026-10-15 11:30",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "STRUCTURATION DES DONNÉES EN CENTRE DE FORMATION\nMatteo Manno\nTable Tidy Data avec colonnes individuelles et calcul automatique de la charge de séance.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 7.6,
      "maxScore": 20,
      "totalPoints100": 37.8,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 1/6 situation(s) identifiée(s), volume rédigé (23 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (1 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.3,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.6,
          "maxScore": 20,
          "comment": "Maîtrise technique initiale : outils nommés sans précision sur les paramètres de mesure ou d'acquisition."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.1,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.8,
          "maxScore": 5,
          "comment": "Présentation minimale (23 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 03 — Données brutes au tableau de bord Excel U18 (note formative : 7.6/20). Le travail déposé aborde le sujet mais reste trop succinct (23 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "1 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 1 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 6 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 03 — Données brutes au tableau de bord Excel U18 (note formative : 7.6/20). Le travail déposé aborde le sujet mais reste trop succinct (23 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-manno-ex04",
    "userId": "user-prepa-04",
    "userName": "Matteo Manno",
    "userEmail": "matteo.manno@student.hech.be",
    "exerciseId": "exercice-04",
    "exerciseTitle": "Exercice 04 : Excel - Créer ses propres outils de suivi",
    "originalFileName": "MANNO_Matteo_Exercice_04_Suivi_Charge.xlsx",
    "formattedFileName": "MANNO_Matteo_exercice-04.xlsx",
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileSize": 56300,
    "submittedAt": "2026-10-21 17:10",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "TABLEAU DE BORD DE CHARGE EXCEL\nMatteo Manno\nSuivi du ratio ACWR et alertes de vigilance.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 6.8,
      "maxScore": 20,
      "totalPoints100": 34,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 3.5,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 0/4 situation(s) identifiée(s), volume rédigé (16 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.5,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (1 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.3,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.1,
          "maxScore": 20,
          "comment": "Maîtrise technique initiale : outils nommés sans précision sur les paramètres de mesure ou d'acquisition."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.1,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.5,
          "maxScore": 5,
          "comment": "Présentation minimale (16 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 04 — Concevoir ses propres outils numériques de suivi (note formative : 6.8/20). Le travail déposé aborde le sujet mais reste trop succinct (16 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "0 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 1 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 4 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 04 — Concevoir ses propres outils numériques de suivi (note formative : 6.8/20). Le travail déposé aborde le sujet mais reste trop succinct (16 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-manno-ex05",
    "userId": "user-prepa-04",
    "userName": "Matteo Manno",
    "userEmail": "matteo.manno@student.hech.be",
    "exerciseId": "exercice-05",
    "exerciseTitle": "Exercice 05 : De la donnée à la décision (analyse & ajustement)",
    "originalFileName": "MANNO_Matteo_Exercice_05_Decision.docx",
    "formattedFileName": "MANNO_Matteo_exercice-05.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 36100,
    "submittedAt": "2026-10-27 15:45",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "ANALYSE DE CAS : RÉGULATION DE CHARGE DE THOMAS\nMatteo Manno\nIdentification de la fatigue et recommandations d'allègement d'entraînement.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 7.7,
      "maxScore": 20,
      "totalPoints100": 38.3,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.2,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 2/5 situation(s) identifiée(s), volume rédigé (20 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.1,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (4 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.4,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.7,
          "maxScore": 20,
          "comment": "Maîtrise technique initiale : outils nommés sans précision sur les paramètres de mesure ou d'acquisition."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.2,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.7,
          "maxScore": 5,
          "comment": "Présentation minimale (20 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 05 — De la donnée à la décision : analyser et ajuster un entraînement (note formative : 7.7/20). Le travail déposé aborde le sujet mais reste trop succinct (20 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "2 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 4 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 5 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 05 — De la donnée à la décision : analyser et ajuster un entraînement (note formative : 7.7/20). Le travail déposé aborde le sujet mais reste trop succinct (20 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-capitaine-ex01",
    "userId": "user-prepa-05",
    "userName": "Achile Capitaine",
    "userEmail": "achile.capitaine@student.hech.be",
    "exerciseId": "exercice-01",
    "exerciseTitle": "Exercice 01 : Quel capteur choisir ? (10 situations)",
    "originalFileName": "CAPITAINE_Achile_Exercice_01_Capteurs.docx",
    "formattedFileName": "CAPITAINE_Achile_exercice-01.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 43200,
    "submittedAt": "2026-09-28 17:15",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "SÉLECTION ET PROTOCOLE DES CAPTEURS EN SPORTS COLLECTIFS ET INDIVIDUELS\nAchile Capitaine\nPrésentation exhaustive des 10 capteurs : GNSS Catapult 10Hz, centrale inertielle IMU, cellules photoélectriques sprint, dynamomètre isocinétique, encodeur linéaire GymAware, plateforme ForceDecks, cardiofréquencemètre Polar.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 9.7,
      "maxScore": 20,
      "totalPoints100": 48.7,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 4.8,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 1/10 situation(s) identifiée(s), volume rédigé (35 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 11.5,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (9 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.7,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 11.6,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 8.9,
          "maxScore": 15,
          "comment": "Justification présente mais unilatérale : les biais métrologiques, dérives ou contraintes écologiques méritent d'être approfondis."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 2.2,
          "maxScore": 5,
          "comment": "Présentation minimale (35 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 01 — Quel capteur choisir ? (note formative : 9.7/20). Le travail déposé aborde le sujet mais reste trop succinct (35 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "1 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 9 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 10 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 01 — Quel capteur choisir ? (note formative : 9.7/20). Le travail déposé aborde le sujet mais reste trop succinct (35 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-capitaine-ex02a",
    "userId": "user-prepa-05",
    "userName": "Achile Capitaine",
    "userEmail": "achile.capitaine@student.hech.be",
    "exerciseId": "exercice-02a",
    "exerciseTitle": "Exercice 02.a : Extraction Power Query & Nutrition (Natation)",
    "originalFileName": "CAPITAINE_Achile_Exercice_02a_PowerQuery.xlsx",
    "formattedFileName": "CAPITAINE_Achile_exercice-02a.xlsx",
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileSize": 38100,
    "submittedAt": "2026-10-03 11:20",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "OPTIMISATION NUTRITIONNELLE PAR POWER QUERY\nAchile Capitaine\nNettoyage automatisé de la base alimentaire, détection des carences en glycogène et propositions stratégiques pour le microcycle de compétition.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 9,
      "maxScore": 20,
      "totalPoints100": 45,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 2/6 situation(s) identifiée(s), volume rédigé (26 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.4,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (2 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 12.7,
          "maxScore": 20,
          "comment": "Démarche cohérente mais perfectible : les étapes de validation et l'examen critique des protocoles méritent d'être approfondis."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.3,
          "maxScore": 20,
          "comment": "Maîtrise technique initiale : outils nommés sans précision sur les paramètres de mesure ou d'acquisition."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 9.7,
          "maxScore": 15,
          "comment": "Justification présente mais unilatérale : les biais métrologiques, dérives ou contraintes écologiques méritent d'être approfondis."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.9,
          "maxScore": 5,
          "comment": "Présentation minimale (26 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 02.a — Extraction Power Query & Monitoring Nutritionnel (Natation) (note formative : 9/20). Le travail déposé aborde le sujet mais reste trop succinct (26 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "2 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 2 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 6 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 02.a — Extraction Power Query & Monitoring Nutritionnel (Natation) (note formative : 9/20). Le travail déposé aborde le sujet mais reste trop succinct (26 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-capitaine-ex02b",
    "userId": "user-prepa-02",
    "userName": "Achile Capitaine",
    "userEmail": "achile.capitaine@student.hech.be",
    "exerciseId": "exercice-02",
    "exerciseTitle": "Exercice 02.b : Quel outil pour quelle situation ? (10 cas)",
    "originalFileName": "CAPITAINE_Achile_Exercice_02b_Logiciels.docx",
    "formattedFileName": "CAPITAINE_Achile_exercice-02.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 31800,
    "submittedAt": "2026-10-07 16:00",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "ÉCOSYSTÈME LOGICIEL ET DIGITAL EN PRÉPARATION PHYSIQUE\nAchile Capitaine\nCartographie des 10 solutions logicielles et intégration dans le flux de données.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 3,
      "maxScore": 20,
      "totalPoints100": 15,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Hors-Sujet)",
          "score": 2.5,
          "maxScore": 15,
          "comment": "Hors-sujet : Le document ne traite pas de la thématique demandée (Exercice 02.b — Quel outil pour quelle situation ?)."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 3.5,
          "maxScore": 25,
          "comment": "Aucun concept scientifique ou technologique lié à la préparation physique n'est mobilisé."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2.5,
          "maxScore": 20,
          "comment": "Démarche méthodologique absente ou non applicable à la problématique sportive demandée."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2.5,
          "maxScore": 20,
          "comment": "Aucun outil numérique ni dispositif technique pertinent n'est exploité."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2,
          "maxScore": 15,
          "comment": "Aucune analyse critique ni justification athlétique observable."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante",
          "score": 2,
          "maxScore": 5,
          "comment": "Document structuré en soi mais totalement non avenu dans le cadre de ce cours."
        }
      ],
      "summary": "⚠️ ALERTE HORS-SUJET : Le document déposé (\"CAPITAINE_Achile_Exercice_02b_Logiciels.docx\") ne correspond pas aux objectifs de Exercice 02.b — Quel outil pour quelle situation ?. Aucun concept de préparation physique, de mesure ou de données sportives n'a pu être validé. La note formative attribuée (3/20) reflète l'absence de livrable conforme aux consignes de terrain.",
      "strengths": [
        "Le fichier a été correctement transmis via la plateforme (aspect technique du dépôt validé)."
      ],
      "improvements": [
        "Vérifier impérativement le sujet de l'exercice avant le dépôt : le travail doit porter sur Exercice 02.b — Quel outil pour quelle situation ?.",
        "Produire le livrable attendu : 10 cas décisionnels avec sélection de logiciel adapté (Nolio, WKO5, Kinovea, TrainingPeaks...), alternative et limites.",
        "Consulter les consignes officielles et le document modèle sur la plateforme avant de déposer à nouveau."
      ],
      "nextSteps": [
        "Télécharger le modèle de travail officiel (.docx ou Google Docs).",
        "Compléter les cas d'application du cours en mobilisant les notions du syllabus.",
        "Déposer à nouveau le fichier complété pour une nouvelle analyse formative."
      ],
      "detailedFeedback": "⚠️ ALERTE HORS-SUJET : Le document déposé (\"CAPITAINE_Achile_Exercice_02b_Logiciels.docx\") ne correspond pas aux objectifs de Exercice 02.b — Quel outil pour quelle situation ?. Aucun concept de préparation physique, de mesure ou de données sportives n'a pu être validé. La note formative attribuée (3/20) reflète l'absence de livrable conforme aux consignes de terrain.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-capitaine-ex03",
    "userId": "user-prepa-05",
    "userName": "Achile Capitaine",
    "userEmail": "achile.capitaine@student.hech.be",
    "exerciseId": "exercice-03",
    "exerciseTitle": "Exercice 03 : Excel - Collecte et structuration de données",
    "originalFileName": "CAPITAINE_Achile_Exercice_03_Structuration.xlsx",
    "formattedFileName": "CAPITAINE_Achile_exercice-03.xlsx",
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileSize": 50800,
    "submittedAt": "2026-10-13 17:30",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "NORMALISATION DE LA BASE DE DONNÉES DE CHARGE FOOTBALL U18\nAchile Capitaine\nTable Tidy Data, vérification des types de données, formules sans erreur.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 8.3,
      "maxScore": 20,
      "totalPoints100": 41.3,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 2/6 situation(s) identifiée(s), volume rédigé (23 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.7,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (2 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.4,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 10.1,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.3,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.8,
          "maxScore": 5,
          "comment": "Présentation minimale (23 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 03 — Données brutes au tableau de bord Excel U18 (note formative : 8.3/20). Le travail déposé aborde le sujet mais reste trop succinct (23 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "2 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 2 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 6 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 03 — Données brutes au tableau de bord Excel U18 (note formative : 8.3/20). Le travail déposé aborde le sujet mais reste trop succinct (23 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-capitaine-ex04",
    "userId": "user-prepa-05",
    "userName": "Achile Capitaine",
    "userEmail": "achile.capitaine@student.hech.be",
    "exerciseId": "exercice-04",
    "exerciseTitle": "Exercice 04 : Excel - Créer ses propres outils de suivi",
    "originalFileName": "CAPITAINE_Achile_Exercice_04_Suivi_Charge.xlsx",
    "formattedFileName": "CAPITAINE_Achile_exercice-04.xlsx",
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileSize": 62400,
    "submittedAt": "2026-10-19 18:20",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "TABLEAU DE BORD INTÉGRÉ HOOPER ET ACWR\nAchile Capitaine\nFormules SOMME.SI.ENS, calcul glissant des charges 7j et 28j, alertes visuelles automatisées.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 8.3,
      "maxScore": 20,
      "totalPoints100": 41.4,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.3,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 1/4 situation(s) identifiée(s), volume rédigé (23 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.5,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (4 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.9,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 10.5,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.5,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.7,
          "maxScore": 5,
          "comment": "Présentation minimale (23 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 04 — Concevoir ses propres outils numériques de suivi (note formative : 8.3/20). Le travail déposé aborde le sujet mais reste trop succinct (23 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "1 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 4 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 4 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 04 — Concevoir ses propres outils numériques de suivi (note formative : 8.3/20). Le travail déposé aborde le sujet mais reste trop succinct (23 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-capitaine-ex05",
    "userId": "user-prepa-05",
    "userName": "Achile Capitaine",
    "userEmail": "achile.capitaine@student.hech.be",
    "exerciseId": "exercice-05",
    "exerciseTitle": "Exercice 05 : De la donnée à la décision (analyse & ajustement)",
    "originalFileName": "CAPITAINE_Achile_Exercice_05_Decision.docx",
    "formattedFileName": "CAPITAINE_Achile_exercice-05.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 38900,
    "submittedAt": "2026-10-25 16:40",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "GESTION DE LA FATIGUE DE THOMAS\nAchile Capitaine\nAnalyse croisée des charges GPS et des scores de bien-être, protocole d'ajustement personnalisé.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 9.8,
      "maxScore": 20,
      "totalPoints100": 49.1,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 7.5,
          "maxScore": 15,
          "comment": "Consigne globalement comprise : 3/5 situation(s) traitée(s). Le périmètre attendu commence à être couvert mais demande à être approfondi."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.9,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (5 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 3,
          "levelLabel": "Niveau 3 – Maîtrise satisfaisante",
          "score": 13,
          "maxScore": 20,
          "comment": "Bonne démarche de terrain : progression logique et structurée sur la quasi-totalité des situations analysées."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.2,
          "maxScore": 20,
          "comment": "Maîtrise technique initiale : outils nommés sans précision sur les paramètres de mesure ou d'acquisition."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 8.8,
          "maxScore": 15,
          "comment": "Justification présente mais unilatérale : les biais métrologiques, dérives ou contraintes écologiques méritent d'être approfondis."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.7,
          "maxScore": 5,
          "comment": "Présentation minimale (22 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 05 — De la donnée à la décision : analyser et ajuster un entraînement (note formative : 9.8/20). Le travail déposé aborde le sujet mais reste trop succinct (22 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "3 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 5 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 5 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 05 — De la donnée à la décision : analyser et ajuster un entraînement (note formative : 9.8/20). Le travail déposé aborde le sujet mais reste trop succinct (22 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-capitaine-ex06",
    "userId": "user-prepa-05",
    "userName": "Achile Capitaine",
    "userEmail": "achile.capitaine@student.hech.be",
    "exerciseId": "exercice-06",
    "exerciseTitle": "Exercice 06 : Créer une application IA et un agent",
    "originalFileName": "CAPITAINE_Achile_Exercice_06_Agent_IA.docx",
    "formattedFileName": "CAPITAINE_Achile_exercice-06.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 40900,
    "submittedAt": "2026-10-30 18:30",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "DÉVELOPPEMENT D'UN ASSISTANT IA POUR LE MONITORING DU SPORTIF\nAchile Capitaine\nPrompting système, règles d'arbitrage et format de restitution pour les entraîneurs.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 7.6,
      "maxScore": 20,
      "totalPoints100": 37.9,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6.3,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 2/5 situation(s) identifiée(s), volume rédigé (24 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.6,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (3 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8.4,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 7.7,
          "maxScore": 20,
          "comment": "Maîtrise technique initiale : outils nommés sans précision sur les paramètres de mesure ou d'acquisition."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.1,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 1.8,
          "maxScore": 5,
          "comment": "Présentation minimale (24 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 06 — Créer une application et un agent IA pour le préparateur physique (note formative : 7.6/20). Le travail déposé aborde le sujet mais reste trop succinct (24 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "2 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 3 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 5 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 06 — Créer une application et un agent IA pour le préparateur physique (note formative : 7.6/20). Le travail déposé aborde le sujet mais reste trop succinct (24 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  },
  {
    "id": "file-capitaine-ex07",
    "userId": "user-prepa-05",
    "userName": "Achile Capitaine",
    "userEmail": "achile.capitaine@student.hech.be",
    "exerciseId": "exercice-07",
    "exerciseTitle": "Exercice 07 : Modèle de lutte contre le surentraînement en football",
    "originalFileName": "CAPITAINE_Achile_Exercice_07_Mission_Finale.docx",
    "formattedFileName": "CAPITAINE_Achile_exercice-07.docx",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 79500,
    "submittedAt": "2026-11-04 15:40",
    "driveSynced": true,
    "driveUrl": "https://drive.google.com/drive/folders/1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH",
    "extractedText": "MODÈLE DE PRÉVENTION DU SURENTRAÎNEMENT ET GESTION DE LA CHARGE EN FOOTBALL\nAchile Capitaine\nApproche intégrée : Charge externe (GPS), charge interne (sRPE), état de fatigue (Hooper) et tests neuromusculaires (CMJ). Arbre décisionnel de décharge.",
    "aiCorrection": {
      "status": "analyzed",
      "suggestedScore": 8.2,
      "maxScore": 20,
      "totalPoints100": 40.9,
      "criteriaTable": [
        {
          "name": "Critère 1 – Compréhension et respect de la consigne",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 6,
          "maxScore": 15,
          "comment": "Consigne partiellement abordée : 2/6 situation(s) identifiée(s), volume rédigé (34 mots) encore succinct."
        },
        {
          "name": "Critère 2 – Exactitude des contenus",
          "weightPct": 25,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 9.4,
          "maxScore": 25,
          "comment": "Vocabulaire scientifique encore restreint (5 concept(s) clé(s)). Approfondir les grandeurs physiques et physiologiques du cours."
        },
        {
          "name": "Critère 3 – Maîtrise de la méthode",
          "weightPct": 20,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 8,
          "maxScore": 20,
          "comment": "Démarche en amorce : choix formulés sans explicitation complète de la chaîne de décision méthodique (besoin athlétique -> variable -> outil -> protocole)."
        },
        {
          "name": "Critère 4 – Maîtrise technique et numérique",
          "weightPct": 20,
          "level": 2,
          "levelLabel": "Niveau 2 – Maîtrise partielle (En cours)",
          "score": 10.4,
          "maxScore": 20,
          "comment": "Outils techniques adéquats mais les fonctionnalités avancées (fréquence Hz, capteurs intégrés, formats, formules) manquent d'exploitation."
        },
        {
          "name": "Critère 5 – Analyse, interprétation et justification",
          "weightPct": 15,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 5.1,
          "maxScore": 15,
          "comment": "Absence d'argumentation développée : préconisations affirmées sans justification physiologique suffisante ni recul critique."
        },
        {
          "name": "Critère 6 – Qualité et clarté de la production",
          "weightPct": 5,
          "level": 1,
          "levelLabel": "Niveau 1 – Maîtrise insuffisante (Amorcée)",
          "score": 2,
          "maxScore": 5,
          "comment": "Présentation minimale (34 mots), manque de mise en forme et de structuration visuelle."
        }
      ],
      "summary": "Travail amorcé pour Exercice 07 — Mission finale : Modèle de lutte contre le surentraînement en football (note formative : 8.2/20). Le travail déposé aborde le sujet mais reste trop succinct (34 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "strengths": [
        "2 situation(s) ou thématique(s) sportive(s) identifiée(s).",
        "Présence de 5 notion(s) technique(s) liée(s) aux données sportives.",
        "Volonté d'aborder les outils informatiques de préparation physique."
      ],
      "improvements": [
        "Compléter l'ensemble des 6 situations professionnelles demandées dans la consigne.",
        "Développer systématiquement une justification physiologique ou biomécanique pour chaque choix d'outil.",
        "Expliciter les limites de mesure et les contraintes de terrain spécifiques."
      ],
      "nextSteps": [
        "Relire attentivement la consigne détaillée de l'exercice sur la page du cours.",
        "Consulter le module théorique correspondant sur les capteurs et logiciels sportifs.",
        "Compléter et ré-enrichir le livrable avant de le soumettre à nouveau."
      ],
      "detailedFeedback": "Travail amorcé pour Exercice 07 — Mission finale : Modèle de lutte contre le surentraînement en football (note formative : 8.2/20). Le travail déposé aborde le sujet mais reste trop succinct (34 mots) pour valider l'ensemble des compétences professionnelles visées.",
      "correctedAt": "2026-11-09 09:29",
      "modelUsed": "Évaluateur Pédagogique IA (HECh Sport Sciences — Grille 6 Critères)"
    }
  }
];
