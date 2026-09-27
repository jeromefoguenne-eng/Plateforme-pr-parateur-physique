---
title: "07. Mission Finale : Modèle de Lutte contre le Surentraînement en Football"
description: "Épreuve intégrative majeure (30% / 30 pts) : concevoir son propre modèle algorithmique pour anticiper le surentraînement et optimiser la disponibilité des joueurs à partir de données réelles GPS, cardio, RPE et Hooper."
---

# 07. Mission Finale : Modèle de Lutte contre le Surentraînement en Football

<div class="course-content justified-text">

Cet exercice final propose une situation professionnelle d'expertise mobilisant l'ensemble des compétences de l'unité d'enseignement : **conception de son propre modèle de suivi, automatisation avancée sous Excel, analyse de télémétrie GPS de football, croisement de la charge externe et interne, et cockpit décisionnel pour le staff technique**.

---

## 🎯 Situation professionnelle : Head of Performance

<div class="course-image-block">
  <img src="/images/illustration-testing-mission.jpg" alt="Évaluation et testing physique en situation professionnelle" class="course-img" loading="lazy" />
  <span class="img-caption">Figure 9 : Cockpit de monitoring et modélisation du risque de surentraînement en football professionnel.</span>
</div>

Vous êtes **Head of Performance** (Responsable de la préparation physique) d'un club de football professionnel. Durant un cycle dense de 6 semaines en cours de saison régulière, l'entraîneur principal et la direction sportive vous confient une mission déterminante :

> *« Nous devons enchaîner les matchs sans perdre nos cadres sur blessure, mais sans non plus sous-entraîner l'équipe. Je veux un système objectif capable d'identifier les joueurs en surmenage avant qu'ils ne se blessent ou ne sombrent physiquement le week-end. Créez notre propre modèle d'alerte et de décision. »*

Vous disposez d'un jeu de données complet (`donnees_exercice_final_outils_informatiques.xlsx`) issu des capteurs GPS Catapult/Apex, des ceintures cardiofréquencemètres et des questionnaires quotidiens des 20 joueurs de l'effectif :
- **Télémétrie GPS (Matchs et Entraînements)** : Distance totale (km), courses à basse intensité, courses modérées, High-Speed Running (HSR 19.8-25.2 km/h en mètres), distance et nombre de sprints (>25.2 km/h), accélérations (>3 m/s²), décélérations (<-3 m/s²), vitesse de pointe et PlayerLoad.
- **Charge Interne & Cardio** : FC moyenne, FC max, temps passé en zone rouge (>85% FCmax) et Session-RPE de Foster (1-10).
- **Récupération Matinale (Indice de Hooper)** : Heures de sommeil, qualité du sommeil, stress, fatigue, courbatures et signalement de douleurs localisées sur 42 jours consécutifs.
- **Marqueurs Neuromusculaires & Tests** : Suivi longitudinal en Semaines 1, 3 et 6 (Sprint 10m/30m, Détente CMJ, Navette Yo-Yo IR1 et dérive de fréquence cardiaque sous-maximale à 12 km/h).

---

## 📋 Cahier des charges du travail à réaliser

### 1. Contrôler et structurer la base de données multisource
- Importez le fichier officiel de données fictives dans Excel.
- Auditez la cohérence des variables (vitesse max, durées effectives, détection d'anomalies de saisie).
- Structurez les tables de façon à permettre des calculs croisés instantanés entre charge externe (GPS) et charge interne (RPE/Cardio).

### 2. Concevoir votre propre modèle algorithmique anti-surentraînement
Vous ne devez pas vous contenter d'appliquer une formule unique. Vous devez **concevoir votre propre indice multifactoriel de vulnérabilité (Score sur 100)** en intégrant :
- **Les Ratios ACWR (Aigu:Chronique)** : Sur la distance totale et les métriques critiques (HSR, sprints, décélérations).
- **La Monotonie et le Strain de Foster** : Détection des semaines à charge excessive et sans variation régénérative.
- **Le Découplage Charge Externe / Charge Interne** : Identifier les athlètes dont le RPE et la FC augmentent anormalement alors que leur production mécanique (distance, sprints) régresse (signe pathognomonique de fatigue non fonctionnelle).
- **L'Indice de Hooper & le Sommeil** : Intégration des signaux faibles de fatigue centrale et des dettes de sommeil.
- **La Perte de Réactivité Neuromusculaire** : Prise en compte de la baisse de performance au saut CMJ.

### 3. Construire le Cockpit Décisionnel du Staff
Créez un tableau de bord exécutif destiné au briefing matinal avec l'entraîneur :
- **Cartes KPI globales** : Effectif opérationnel, nombre de joueurs sous alerte rouge, qualité moyenne du sommeil.
- **Classification par feu tricolore** :
  - 🟢 **Optimal (Vert)** : Adaptation positive, prêt pour haute intensité.
  - 🟡 **Vigilance (Jaune)** : Charge élevée sous contrôle, surveillance sommeil.
  - 🟠 **Surmenage Fonctionnel (Orange)** : Fatigue aiguë marquée, allègement partiel conseillé.
  - 🔴 **Surentraînement / Risque Lésionnel (Rouge)** : Décharge immédiate, soins médicaux, retrait des sprints.
- **Analyse des cas cliniques prioritaires** : Diagnostiquez précisément les athlètes en dérive (ex: Koulibaly, Claes, Dubois).

### 4. Rédiger le Plan d'Action Opérationnel pour la Semaine 7
Formulez **4 préconisations argumentées** pour le staff technique en vue du match décisif du week-end :
- Stratégie d'affûtage (*tapering*) collectif ;
- Individualisation des formats d'entraînement (modulation des jeux réduits SSG vs grands espaces) ;
- Recommandations tactiques de rotation d'effectif basées sur vos chiffres.

### 5. Prototyper l'Application Mobile de Terrain
Détaillez les fonctionnalités clés d'une application smartphone dédiée :
- **Côté Joueur** : Check-in Hooper du réveil en 30 secondes et RPE d'après-séance ;
- **Côté Staff** : Alertes push instantanées au bord du terrain avant le début de l'entraînement.

---

## 📦 Fichiers et données de travail

Tous les documents d'accompagnement sont disponibles directement dans l'encadré ci-dessous :
- ⚽ **Données fictives de football (.xlsx)** : Base multisource complète (Effectif, GPS 36 séances, Hooper 42 jours, Tests).
- 📘 **Tutoriel pas-à-pas (.docx)** : Guide méthodologique détaillé pour concevoir votre modèle sous Excel.
- 📊 **Modèle attendu - Cockpit staff (.xlsx)** : Exemple de classeur finalisé avec algorithme de vulnérabilité et tableau de bord.

</div>

## 🏋️‍♂️ Dépôt de la mission finale

<ClientOnly>
  <ExerciseBox 
    exerciseId="exercice-07" 
    exerciseTitle="Exercice 07 — Mission finale : Modèle de lutte contre le surentraînement en football" 
    googleDriveLink="https://docs.google.com/document/d/16JPuDWgZtbV9iDg3gokRc8RzGM1iq5J-/preview" 
    description="Déposez ici votre classeur Excel complet (.xlsx), votre rapport d'expertise méthodologique (.docx ou .pdf) et la maquette de votre prototype mobile." 
  />
</ClientOnly>
