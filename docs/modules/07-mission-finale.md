---
title: "07. Mission Professionnelle Finale : Du Terrain à la Décision"
description: "Épreuve intégrative mobilisant l'ensemble des compétences du cours : structuration de base de données sportive, automatisation Excel, TCD, tableau de bord coach et outil mobile de collecte."
---

# 07. Mission Professionnelle Finale : Du Terrain à la Décision

<div class="course-content justified-text">

Cet exercice final propose une situation professionnelle intégrative mobilisant les principales compétences travaillées dans le cours : **collecte et importation de données, structuration dans un tableur, automatisation, analyse, visualisation, partage, comparaison d’outils et création d’un outil mobile de suivi**. Ces compétences correspondent directement aux acquis d’apprentissage de l’activité *« Exploitation des outils informatiques spécifiques (1/2) »* du profil de formation de la Haute École Charlemagne.

---

## 🎯 Situation professionnelle

Vous êtes préparateur physique dans un club de sport collectif. L’entraîneur principal vous demande de mettre en place un **système numérique complet** permettant de suivre l’évolution des sportifs au cours d’une période de 6 semaines.

Vous disposez de plusieurs sources de données brutes :
- Résultats de tests physiques initiaux et intermédiaires ;
- Charge et durée des séances d’entraînement ;
- Données de fréquence cardiaque et d'intensité ;
- Présence / absence aux entraînements ;
- Perception de l’effort (Session-RPE de Foster) ;
- Qualité du sommeil, niveau de stress et fatigue ressentie (score de Hooper) ;
- Informations relatives aux matchs et compétitions.

Les données sont actuellement dispersées dans différents fichiers bruts (`donnees_exercice_final_outils_informatiques.xlsx`) et leur exploitation manuelle est fastidieuse et propice aux erreurs.

**Votre mission :** concevoir un environnement numérique simple, automatisé, fiable et directement exploitable permettant au staff technique et médical de suivre les sportifs et d'objectiver leurs décisions au quotidien.

---

## 📋 Cahier des charges du travail à réaliser

### 1. Collecter et structurer les données
À partir des données fournies :
- Importez les données dans votre environnement de travail Excel ;
- Identifiez et nettoyez les éventuelles erreurs, doublons, données aberrantes ou valeurs manquantes ;
- Organisez les données dans un tableau structuré (1 colonne = 1 variable, 1 ligne = 1 observation) ;
- Définissez clairement les variables, formats de cellules et unités de mesure utilisées.

> **Objectif :** passer d'une masse de données brutes hétérogènes à une véritable base de données tabulaire propre et exploitable.

### 2. Automatiser le traitement et les calculs
Construisez un tableau de suivi permettant notamment de calculer automatiquement :
- Les moyennes, totaux et évolutions hebdomadaires ;
- La charge de séance et la charge cumulée ;
- Des indicateurs individuels par athlète ;
- Des seuils d'alerte automatiques (mise en forme conditionnelle) signalant un pic de fatigue inhabituel ou un déséquilibre de charge ;
- Les comparaisons inter-sportifs et l'évolution par rapport à la moyenne du groupe.

### 3. Analyser et visualiser avec rigueur
À partir de votre base de données :
- Créez des graphiques clairs et percutants (évolution temporelle de la charge, profils individuels) ;
- Réalisez au moins un **Tableau Croisé Dynamique (TCD)** synthétisant les données par semaine ou par poste de jeu ;
- Identifiez les tendances, régularités ou anomalies physiologiques ;
- Formulez **au moins trois constats étayés** à partir des données chiffrées ;
- Proposez des pistes d'intervention concrètes fondées sur vos résultats.

> [!IMPORTANT]
> Un graphique n'est pas une analyse en soi. Vous devez expliquer avec rigueur ce que les chiffres permettent réellement d'affirmer, sans extrapoler au-delà de la mesure.

### 4. Construire un tableau de bord (Dashboard) pour l'entraîneur
Transformez vos résultats en un tableau de bord synthétique destiné à l'entraîneur principal. Il doit lui permettre de répondre en un coup d'œil à des questions opérationnelles :
- *Comment évolue la charge d'entraînement globale de l'équipe ?*
- *Quels athlètes nécessitent une adaptation individuelle immédiate ?*
- *Quelle est l'évolution de la condition physique mesurée lors des tests ?*
- *Existe-t-il des corrélations visibles entre fatigue déclarée, charge subie et baisse de performance ?*
- *Quels paramètres le staff doit-il surveiller lors des prochaines séances ?*

### 5. Concevoir un outil de collecte de terrain
Créez un formulaire numérique simple (Google Forms, Microsoft Forms ou formulaire tableur) permettant aux sportifs de renseigner facilement leurs données du matin ou d'après-séance (score de Hooper, RPE). Les réponses doivent pouvoir alimenter votre système de suivi.

### 6. Créer un prototype mobile
À partir de votre feuille de calcul, construisez ou prototypez une interface utilisable sur smartphone (via Glide, AppSheet ou un affichage optimisé) permettant au sportif de consulter son profil et au préparateur physique d'accéder aux données clés au bord du terrain.

---

## 📦 Fichiers et données de travail

Vous pouvez télécharger les jeux de données bruts directement dans l'onglet **Ressources** ou via l'encadré ci-dessous :
- `donnees_exercice_final_outils_informatiques.xlsx`
- `Rapport de testing vierge.xlsx`

</div>

## 🏋️‍♂️ Dépôt de la mission finale

<ClientOnly>
  <ExerciseBox 
    exerciseId="exercice-07" 
    exerciseTitle="Exercice 07 — Mission professionnelle finale : du terrain à la décision" 
    googleDriveLink="https://drive.google.com/drive/folders/1w7P6L2P2kK5M6e3p-example-ex7" 
    description="Déposez ici votre classeur Excel complet (.xlsx), votre rapport d'analyse (.docx ou .pdf) et le lien vers votre outil de collecte / prototype mobile." 
  />
</ClientOnly>
