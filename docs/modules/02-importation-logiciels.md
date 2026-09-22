---
title: "02. Importation et Numérisation des Données"
description: "Formats bruts (.fit, .csv, .gpx, .tcx) et panorama comparatif des logiciels spécialisés vs tableur Excel."
---

# 02. Importation et Numérisation des Données

<div class="course-content justified-text">


## Importer et exploiter les données issues des capteurs


Les outils numériques permettent aujourd’hui de recueillir une quantité importante de données sur le sportif : fréquence cardiaque, puissance, vitesse, accélération, cadence, distance, temps de contact, hauteur de saut, charge d’entraînement, données nutritionnelles, etc.


L’enjeu n’est toutefois pas simplement de collecter des données, mais de savoir les transférer, les organiser, les traiter et les interpréter.


On peut représenter la chaîne de traitement ainsi :


CAPTEUR → ENREGISTREMENT → IMPORTATION → TRAITEMENT → VISUALISATION → ANALYSE → INTERPRÉTATION


Le profil d’enseignement de la spécialisation prévoit d’ailleurs explicitement l’« exploitation des outils informatiques spécifiques » dans la formation.


## Pourquoi importer les données ?


Un capteur produit généralement une grande quantité de données brutes. Par exemple, un capteur de fréquence cardiaque peut enregistrer une valeur chaque seconde :


Ces données sont intéressantes, mais leur simple présence ne constitue pas encore une analyse.


L'importation permet de transférer les données depuis l'environnement de mesure vers un environnement dans lequel elles pourront être :

- stockées 
- nettoyées 
- triées 
- filtrées 
- calculées 
- comparées 
- représentées graphiquement 
- croisées avec d'autres données 

interprétées.


Exemple


Un sportif réalise un test de course.


Capteur GPS + cardiofréquencemètre


↓


fichier de données


↓


Excel


↓


calcul de la vitesse moyenne, FC moyenne, FC maximale…


↓


graphique vitesse / fréquence cardiaque


↓


interprétation


Comment la fréquence cardiaque évolue-t-elle lorsque la vitesse augmente ?


L'importation constitue donc une étape intermédiaire entre la mesure et l'analyse.


## 2. Les données peuvent être transférées sous différents formats


Les applications et les capteurs utilisent différents formats de fichiers.


CSV


Format particulièrement intéressant pour les tableurs :


Temps;FC;Puissance;Vitesse


0;82;0;0


1;84;120;15


2;87;145;17


3;91;165;18


Il permet de représenter les données sous forme de tableau.


FIT


Format très utilisé dans les dispositifs sportifs connectés. Il peut notamment contenir des données provenant de capteurs, des données GPS et des informations relatives à l'activité. Strava permet par exemple d'exporter le fichier original d'une activité, généralement au format FIT.


GPX


Principalement utilisé pour les données GPS et les parcours.


TCX


Format utilisé pour des données d'entraînement et pouvant contenir différentes variables selon l'activité.


## 3. Première méthode : importer les données dans Excel


Pourquoi utiliser Excel ?


Excel présente un intérêt particulier parce qu'il permet de reprendre le contrôle des données.


Une application sportive fournit généralement des indicateurs déjà calculés. Excel permet, au contraire, de partir des données disponibles et de construire soi-même son analyse.


Excel permet notamment de :

- trier et filtrer les données 
- effectuer des calculs 
- créer des indicateurs personnalisés 
- supprimer ou corriger certaines valeurs 
- regrouper des données 
- comparer plusieurs séances 
- créer des graphiques 
- réaliser des tableaux croisés dynamiques 

construire des tableaux de bord.


Excel dispose également de Power Query, qui permet d'importer des données externes, de les transformer et de les actualiser. Il accepte notamment les fichiers CSV, Excel, XML, JSON et plusieurs autres sources.


## Comment importer les données ?


Pour un fichier CSV, par exemple :


Données → Obtenir les données → À partir d'un fichier → À partir d'un fichier texte/CSV


Excel permet ensuite :

- de sélectionner le fichier 
- de vérifier l'aperçu 
- de vérifier le séparateur 
- de vérifier les types de données 
- de charger les données 

ou de les transformer avec Power Query avant de les charger.


Exemple


On dispose de 20 fichiers correspondant à 20 séances d'entraînement.


Avec Power Query, on peut placer les fichiers dans un même dossier et demander à Excel de les combiner automatiquement dans une seule table, à condition qu'ils présentent une structure compatible.


On obtient alors :


L'étudiant peut ensuite créer ses propres analyses.


## 4. Pourquoi ne pas utiliser uniquement Excel ?


Excel présente cependant plusieurs limites.


**Avantages**


**+ Grande liberté d'analyse
L'utilisateur choisit les variables et les calculs.**


**+ Personnalisation
On peut créer ses propres indicateurs.**


**+ Transparence
Les calculs peuvent être examinés et vérifiés.**


**+ Polyvalence
Excel permet de travailler avec des données provenant de nombreux outils.**


**+ Interopérabilité
Les fichiers CSV peuvent facilement être réutilisés dans d'autres logiciels.**


**Inconvénients**

- Travail plus important
Il faut construire une partie de l'analyse soi-même.
- Risque d'erreur
Une mauvaise formule ou une mauvaise transformation peut produire des résultats erronés.
- Peu d'automatisation au départ
Il faut mettre en place les calculs et les graphiques.
- Interprétation à la charge de l'utilisateur
Excel ne sait pas automatiquement quelle signification donner aux données.
- Gestion des données longitudinales plus complexe
Suivre plusieurs mois ou plusieurs sportifs demande une bonne organisation.

C'est précisément là que les applications spécialisées deviennent intéressantes.


## 5. Pourquoi utiliser des applications dédiées ?


Une application spécialisée propose généralement une chaîne beaucoup plus automatisée :


CAPTEUR → SYNCHRONISATION AUTOMATIQUE → BASE DE DONNÉES → CALCULS → GRAPHIQUES → INDICATEURS


L'utilisateur n'a donc pas nécessairement besoin d'exporter manuellement chaque fichier.


L'application peut :

- récupérer automatiquement les données 
- les organiser 
- calculer des indicateurs 
- détecter des intervalles 
- comparer les séances 
- suivre l'évolution dans le temps 
- produire des graphiques 

parfois proposer des interprétations ou des alertes.


L'inconvénient principal est que l'utilisateur perd une partie du contrôle sur la manière dont les données sont traitées.


Il faut donc distinguer :


Excel : « Je veux analyser mes données. »


et


Application spécialisée : « Je veux utiliser un environnement qui analyse déjà une partie de mes données. »


## 6. Les principales applications dédiées


6.1. Strava


Fonction principale


Plateforme de centralisation et de partage des activités sportives.


Elle permet de récupérer des activités provenant de nombreux appareils et de visualiser notamment distance, vitesse/allure, altitude, fréquence cardiaque et, selon l'activité et les données disponibles, puissance ou cadence.


Les segments permettent également de comparer les performances réalisées sur une portion donnée d'un parcours.


**Avantages**

- très grande communauté 
- interface relativement accessible 
- nombreuses possibilités de comparaison 
- centralisation des activités 
- possibilité d'exporter les données 

intéressant pour suivre l'évolution des performances.


**Inconvénients**

- certaines fonctions avancées nécessitent un abonnement 
- analyse moins personnalisable qu'Excel 
- dimension sociale importante 

les indicateurs dépendent des données réellement enregistrées par le dispositif.


À retenir :


Strava = centraliser, visualiser, comparer et partager.


## 6.2. Garmin Connect


Fonction principale


Plateforme associée aux appareils Garmin.


Elle permet de centraliser et analyser les données provenant des montres et compteurs Garmin, mais également de suivre différentes données liées à la santé et au bien-être. Garmin présente Connect comme un environnement de suivi et d'analyse des activités, de la santé et de l'entraînement.


**Avantages**

- intégration directe avec les appareils Garmin 
- synchronisation automatique 
- grande quantité de données 
- suivi longitudinal 

intégration de données d'activité et de santé.


**Inconvénients**

- fortement lié à l'écosystème Garmin 
- analyse moins libre qu'Excel 
- certaines fonctionnalités dépendent du matériel utilisé 

risque de multiplier les indicateurs sans nécessairement améliorer l'interprétation.


À retenir :


Garmin Connect = écosystème de collecte et de suivi.


## 6.3. Nolio


Fonction principale


Nolio est davantage orienté vers la planification, le suivi et l'analyse de l'entraînement, notamment dans la relation entraîneur-athlète.


La plateforme peut synchroniser les données provenant notamment de Garmin, Polar, Coros, Suunto, Wahoo, Zwift et Strava. Elle permet également de construire des séances structurées et de suivre différentes métriques de charge.


Nolio propose notamment plusieurs modèles de charge, dont Foster, Coggan et TRIMP.


**Avantages**

- particulièrement adapté au coaching 
- planification des séances 
- centralisation des données 
- suivi de plusieurs sportifs 
- possibilité de créer des métriques personnalisées 

lien entre entraînement prévu et entraînement réalisé.


**Inconvénients**

- davantage orienté vers la gestion de l'entraînement que vers l'analyse brute 
- dépendance à la plateforme 

certaines fonctionnalités sont liées à des formules payantes.


À retenir :


Nolio = planifier → suivre → analyser → ajuster l'entraînement.


## 6.4. TrainingPeaks


Fonction principale


Plateforme de planification et d'analyse de l'entraînement.


Elle permet notamment de construire des plans, suivre les séances réalisées et analyser l'évolution de la charge et des performances.


**Avantages**

- très orienté entraînement 
- adapté au suivi longitudinal 
- intéressant pour les entraîneurs 

nombreuses intégrations avec des appareils et plateformes.


**Inconvénients**

- interface plus complexe pour un débutant 
- certaines fonctions avancées sont payantes 

moins adapté à une analyse totalement personnalisée qu'Excel.


À retenir :


TrainingPeaks = planification + suivi + analyse de l'entraînement.


## 6.5. Intervals.icu


Fonction principale


Plateforme particulièrement intéressante pour l'analyse approfondie des données d'entraînement.


Elle permet notamment de suivre les performances, la charge, les zones et les courbes de puissance. Elle peut récupérer des historiques provenant notamment de Strava et Garmin.


Elle permet également d'exporter certaines analyses en CSV pour poursuivre le traitement dans Excel.


**Avantages**

- nombreuses possibilités d'analyse 
- excellente visualisation de l'évolution dans le temps 
- analyse de la puissance 
- analyse des intervalles 
- possibilité de personnaliser les zones 
- export vers Excel/CSV 

intéressant pour le suivi multisport.


**Inconvénients**

- interface relativement dense 
- nécessite des connaissances pour interpréter correctement certains indicateurs 

principalement intéressant lorsque l'on dispose de données suffisamment riches.


À retenir :


Intervals.icu = analyse approfondie des données d'entraînement.


## 6.6. WKO5


Fonction principale


Outil d'analyse avancée, particulièrement connu dans le domaine du cyclisme et de la puissance.


Il permet d'aller beaucoup plus loin que les plateformes généralistes dans l'analyse des données de puissance et de la relation puissance-durée.


**Avantages**

- analyse très approfondie 
- nombreux modèles et graphiques 
- particulièrement intéressant pour les spécialistes de la puissance 

grande personnalisation.


**Inconvénients**

- apprentissage plus important 
- outil moins accessible aux débutants 

intérêt plus limité si l'on ne dispose pas de données de puissance de qualité.


À retenir :


WKO5 = analyse experte de la performance, notamment à partir de la puissance.


## 6.7. Kinovea


Fonction principale


Kinovea change complètement de logique : on ne part plus nécessairement d'un capteur, mais d'une vidéo.


Le logiciel permet de ralentir, comparer, annoter et mesurer des mouvements. Il permet notamment de mesurer des distances, angles, positions et trajectoires après calibration.


**Avantages**

- gratuit 
- très intéressant pour l'analyse technique 
- permet de transformer une vidéo en données mesurables 
- nombreuses possibilités d'annotation 

particulièrement intéressant en biomécanique.


**Inconvénients**

- nécessite une vidéo correctement réalisée 
- nécessite une calibration pour certaines mesures 
- analyse plus manuelle 

ne remplace pas nécessairement un système de mesure spécialisé.


À retenir :


Kinovea = vidéo → mesure → analyse du mouvement.


## 6.8. MyJumpLab


Fonction principale


Application spécialisée dans l'évaluation des performances de saut, notamment à partir de l'enregistrement vidéo.


Elle illustre un principe important :


le smartphone peut devenir un instrument de mesure.


**Avantages**

- matériel relativement accessible 
- utilisation de la vidéo 
- mesures rapides 
- intéressant pour suivre l'évolution d'un sportif 

très pertinent pour illustrer la transformation d'une vidéo en données quantitatives.


**Inconvénients**

- domaine d'utilisation spécialisé 
- dépendance à la qualité de l'enregistrement 
- les résultats dépendent du protocole de mesure 

ne fournit pas une analyse globale de la performance.


À retenir :


MyJumpLab = vidéo → données de saut.


## 6.9. MySprint


Fonction principale


Application spécialisée dans l'analyse de la performance en sprint à partir d'un protocole de mesure adapté.


**Avantages**

- permet de transformer une mesure de sprint en données exploitables 
- rapide 
- intéressant pour suivre l'évolution d'un athlète 

adapté à la préparation physique.


**Inconvénients**

- utilisation spécialisée 
- dépendance au protocole 

ne remplace pas une analyse globale de l'entraînement.


À retenir :


MySprint = mesure du sprint → indicateurs de performance.


## 6.10. MyFitnessPal


Fonction principale


Suivi de la nutrition et de l'alimentation.


L'intérêt est de montrer que les données utiles à la préparation physique ne proviennent pas uniquement des capteurs sportifs.


On peut par exemple mettre en relation :


alimentation ↔ entraînement ↔ poids ↔ performance


MyFitnessPal permet actuellement l'export des données pour les utilisateurs Premium/Premium+, tandis que les comptes gratuits disposent d'autres possibilités de consultation et de partage.


**Avantages**

- nombreuses données alimentaires 
- suivi longitudinal 
- possibilité de croiser nutrition et entraînement 

complémentaire des données issues des capteurs.


**Inconvénients**

- saisie alimentaire en partie déclarative 
- qualité des données dépendante de l'encodage 

export complet soumis à des restrictions de compte.


À retenir :


MyFitnessPal = données nutritionnelles → suivi énergétique.


7. Comparaison synthétique


Les étoiles constituent ici une représentation pédagogique des caractéristiques générales, et non une évaluation de la qualité des logiciels.


</div>

## 🎯 Auto-évaluation formative

<ClientOnly>
  <QuizBox moduleId="02-importation-logiciels" moduleTitle="Formats & Logiciels Dédiés" />
</ClientOnly>

## 🏋️‍♂️ Travail pratique associé

<ClientOnly>
  <ExerciseBox 
    exerciseId="exercice-02" 
    exerciseTitle="Exercice 02 — Quel outil pour quelle situation ?" 
    googleDriveLink="https://drive.google.com/drive/folders/1w7P6L2P2kK5M6e3p-example-ex2" 
    description="Pour chacun des 10 cas décisionnels proposés, identifiez les données requises, sélectionnez l'application la plus adaptée (Nolio, WKO5, Kinovea, TrainingPeaks...), proposez une alternative et justifiez les limites de votre choix." 
  />
</ClientOnly>
