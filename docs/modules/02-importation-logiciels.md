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

<div class="course-image-block">
  <img src="/images/illustration-dashboard-power.jpg" alt="Logiciels d'analyse et dashboards de performance" class="course-img" loading="lazy" />
  <span class="img-caption">Figure 4 : Écosystème logiciel de la performance : de la plateforme cloud spécialisée au dashboard décisionnel.</span>
</div>



### 6.1. Strava

<div class="app-header-badge">
  <img src="/images/logos/strava.png" alt="Logo Strava" class="app-logo-badge" />
  <div class="app-title-info">
    <span class="app-category-tag">Plateforme Cloud & Communauté</span>
    <p class="app-summary-text">Centralisation multi-appareils, visualisation de parcours GPS, comparaison par segments et partage communautaire.</p>
  </div>
</div>

**Fonction principale**

Plateforme de centralisation et de partage des activités sportives.

Elle permet de récupérer des activités provenant de nombreux appareils et de visualiser notamment distance, vitesse/allure, altitude, fréquence cardiaque et, selon l'activité et les données disponibles, puissance ou cadence.

Les segments permettent également de comparer les performances réalisées sur une portion donnée d'un parcours.

**Avantages**
- très grande communauté 
- interface relativement accessible 
- nombreuses possibilités de comparaison 
- centralisation des activités 
- possibilité d'exporter les données 
- intéressant pour suivre l'évolution des performances.

**Inconvénients**
- certaines fonctions avancées nécessitent un abonnement 
- analyse moins personnalisable qu'Excel 
- dimension sociale importante 
- les indicateurs dépendent des données réellement enregistrées par le dispositif.

<div class="example-card">
  <strong>À retenir :</strong> <em>Strava = centraliser, visualiser, comparer et partager.</em>
</div>

<div class="video-tutorial-box">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Tutoriel vidéo en français :</strong> <em>Comment bien utiliser Strava (Fonctionnalités gratuites et analyse d'effort)</em>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/m5YUDSSRNN0" 
      title="Tutoriel Strava en français" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">💡 Découverte des fonctionnalités clés de Strava, de l'enregistrement à l'analyse des segments et des données d'effort.</p>
</div>


### 6.2. Garmin Connect

<div class="app-header-badge">
  <img src="/images/logos/garmin.png" alt="Logo Garmin Connect" class="app-logo-badge" />
  <div class="app-title-info">
    <span class="app-category-tag">Écosystème Constructeur & Santé</span>
    <p class="app-summary-text">Collecte directe de données constructeur, suivi longitudinal, charge d'entraînement aiguë et métriques physiologiques (VFC, sommeil, stress).</p>
  </div>
</div>

**Fonction principale**

Plateforme associée aux appareils Garmin.

Elle permet de centraliser et analyser les données provenant des montres et compteurs Garmin, mais également de suivre différentes données liées à la santé et au bien-être. Garmin présente Connect comme un environnement de suivi et d'analyse des activités, de la santé et de l'entraînement.

**Avantages**
- intégration directe avec les appareils Garmin 
- synchronisation automatique 
- grande quantité de données 
- suivi longitudinal 
- intégration de données d'activité et de santé.

**Inconvénients**
- fortement lié à l'écosystème Garmin 
- analyse moins libre qu'Excel 
- certaines fonctionnalités dépendent du matériel utilisé 
- risque de multiplier les indicateurs sans nécessairement améliorer l'interprétation.

<div class="example-card">
  <strong>À retenir :</strong> <em>Garmin Connect = écosystème de collecte et de suivi.</em>
</div>

<div class="video-tutorial-box">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Tutoriel vidéo en français :</strong> <em>Garmin Connect : Comprendre le statut d'entraînement, la charge et la récupération</em>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/ld2Dn9_dR9I" 
      title="Garmin Connect Statut d'entrainement" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">💡 Décryptage des algorithmes Garmin : charge aiguë, statut productif/non productif et suivi longitudinal.</p>
</div>


### 6.3. Nolio

<div class="app-header-badge">
  <img src="/images/logos/nolio.png" alt="Logo Nolio" class="app-logo-badge" />
  <div class="app-title-info">
    <span class="app-category-tag">Planification & Coaching</span>
    <p class="app-summary-text">Plateforme française dédiée à la relation entraîneur-athlète, planification de séances structurées et suivi de charge multi-modèles (Foster, Coggan, TRIMP).</p>
  </div>
</div>

**Fonction principale**

Nolio est davantage orienté vers la planification, le suivi et l'analyse de l'entraînement, notamment dans la relation entraîneur-athlète.

La plateforme peut synchroniser les données provenant notamment de Garmin, Polar, Coros, Suunto, Wahoo, Zwift et Strava. Elle permet également de construire des séances structurées et de suivre différentes métriques de charge.

Nolio propose notamment plusieurs modèles de charge, dont Foster, Coggan et TRIMP.

**Avantages**
- particulièrement adapté au coaching 
- planification des séances 
- centralisation des données 
- suivi de plusieurs sportifs 
- possibilité de créer des métriques personnalisées 
- lien entre entraînement prévu et entraînement réalisé.

**Inconvénients**
- davantage orienté vers la gestion de l'entraînement que vers l'analyse brute 
- dépendance à la plateforme 
- certaines fonctionnalités sont liées à des formules payantes.

<div class="example-card">
  <strong>À retenir :</strong> <em>Nolio = planifier → suivre → analyser → ajuster l'entraînement.</em>
</div>

<div class="video-tutorial-box">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Tutoriel vidéo en français :</strong> <em>Nolio — Comment planifier son entraînement, suivre la charge et progresser ?</em>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/muBrWgHtE2o" 
      title="Tutoriel Nolio en français" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">💡 Guide de prise en main pour le préparateur physique : création d'un plan, envoi des séances vers la montre et monitoring de charge.</p>
</div>


### 6.4. TrainingPeaks

<div class="app-header-badge">
  <img src="/images/logos/trainingpeaks.png" alt="Logo TrainingPeaks" class="app-logo-badge" />
  <div class="app-title-info">
    <span class="app-category-tag">Standard International de Coaching</span>
    <p class="app-summary-text">Gestion de charge basée sur le Performance Management Chart (TSS, CTL, ATL, TSB), programmation d'objectifs et suivi longitudinal d'athlètes.</p>
  </div>
</div>

**Fonction principale**

Plateforme de planification et d'analyse de l'entraînement.

Elle permet notamment de construire des plans, suivre les séances réalisées et analyser l'évolution de la charge et des performances.

**Avantages**
- très orienté entraînement 
- adapté au suivi longitudinal 
- intéressant pour les entraîneurs 
- nombreuses intégrations avec des appareils et plateformes.

**Inconvénients**
- interface plus complexe pour un débutant 
- certaines fonctions avancées sont payantes 
- moins adapté à une analyse totalement personnalisée qu'Excel.

<div class="example-card">
  <strong>À retenir :</strong> <em>TrainingPeaks = planification + suivi + analyse de l'entraînement.</em>
</div>

<div class="video-tutorial-box">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Tutoriel vidéo en français :</strong> <em>Comment utiliser TrainingPeaks pour planifier et quantifier son entraînement ?</em>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/hItWOIeUP6Y" 
      title="Tutoriel TrainingPeaks en français" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">💡 Paramétrage des zones, calcul de charge d'entraînement (TSS) et structuration d'un plan d'endurance.</p>
</div>


### 6.5. Intervals.icu

<div class="app-header-badge">
  <img src="/images/logos/intervals.png" alt="Logo Intervals.icu" class="app-logo-badge" />
  <div class="app-title-info">
    <span class="app-category-tag">Analyse Scientifique & Open Data</span>
    <p class="app-summary-text">Plateforme haute fidélité pour le suivi des courbes de puissance-temps, zones cardiaques, charge PMC et export tabulaire direct vers Excel/CSV.</p>
  </div>
</div>

**Fonction principale**

Plateforme particulièrement intéressante pour l'analyse approfondie des données d'entraînement.

Elle permet notamment de suivre les performances, la charge, les zones et les courbes de puissance. Elle peut récupérer des historiques provenant notamment de Strava et Garmin.

Elle permet également d'exporter certaines analyses en CSV pour poursuivre le traitement dans Excel.

**Avantages**
- nombreuses possibilités d'analyse 
- excellente visualisation de l'évolution dans le temps 
- analyse de la puissance et des intervalles 
- possibilité de personnaliser les zones 
- export vers Excel/CSV 
- très riche pour le suivi multisport.

**Inconvénients**
- interface relativement dense 
- nécessite des connaissances pour interpréter correctement certains indicateurs 
- principalement intéressant lorsque l'on dispose de données suffisamment riches.

<div class="example-card">
  <strong>À retenir :</strong> <em>Intervals.icu = analyse approfondie des données d'entraînement.</em>
</div>

<div class="video-tutorial-box">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Tutoriel vidéo en français :</strong> <em>Intervals.icu : La science de l'entraînement et l'analyse des données de puissance</em>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/jib23Y6ErtU" 
      title="Tutoriel Intervals.icu en français" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">💡 Configuration des métriques avancées, analyse des fractionnés et suivi de la puissance critique.</p>
</div>


### 6.6. WKO5

<div class="app-header-badge">
  <img src="/images/logos/wko5.png" alt="Logo WKO5" class="app-logo-badge" />
  <div class="app-title-info">
    <span class="app-category-tag">Logiciel Expert Desktop</span>
    <p class="app-summary-text">Analyse experte en puissance et physiologie de l'effort, modélisation de la courbe puissance-durée individualisée (mFTP, FRC, TTE).</p>
  </div>
</div>

**Fonction principale**

Outil d'analyse avancée, particulièrement connu dans le domaine du cyclisme et de la puissance.

Il permet d'aller beaucoup plus loin que les plateformes généralistes dans l'analyse des données de puissance et de la relation puissance-durée.

**Avantages**
- analyse très approfondie 
- nombreux modèles et graphiques 
- particulièrement intéressant pour les spécialistes de la puissance 
- grande personnalisation.

**Inconvénients**
- apprentissage plus important 
- outil moins accessible aux débutants 
- intérêt plus limité si l'on ne dispose pas de données de puissance de qualité.

<div class="example-card">
  <strong>À retenir :</strong> <em>WKO5 = analyse experte de la performance, notamment à partir de la puissance.</em>
</div>

<div class="video-tutorial-box">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Tutoriel vidéo en français :</strong> <em>Premiers pas avec WKO5 : Modélisation avancée et profils de puissance</em>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/4_ixu9OaHGM" 
      title="Tutoriel WKO5 en français" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">💡 Exploration des modèles mathématiques individualisés de Coggan et Allen sur desktop.</p>
</div>


### 6.7. Kinovea

<div class="app-header-badge">
  <img src="/images/logos/kinovea.png" alt="Logo Kinovea" class="app-logo-badge" />
  <div class="app-title-info">
    <span class="app-category-tag">Biomécanique & Vidéo Open Source</span>
    <p class="app-summary-text">Transformation de l'image vidéo en données métriques : mesure d'angles articulaires, tracking de trajectoires, vitesses angulaires et chronométrage.</p>
  </div>
</div>

**Fonction principale**

Kinovea change complètement de logique : on ne part plus nécessairement d'un capteur, mais d'une vidéo.

Le logiciel permet de ralentir, comparer, annoter et mesurer des mouvements. Il permet notamment de mesurer des distances, angles, positions et trajectoires après calibration.

**Avantages**
- gratuit et open-source 
- très intéressant pour l'analyse technique et gestuelle 
- permet de transformer une vidéo en données mesurables 
- nombreuses possibilités d'annotation 
- particulièrement intéressant en biomécanique.

**Inconvénients**
- nécessite une vidéo correctement réalisée (axe perpendiculaire, éclairage) 
- nécessite une calibration étalonnée pour certaines mesures 
- analyse plus manuelle 
- ne remplace pas nécessairement un système optoélectronique 3D de laboratoire.

<div class="example-card">
  <strong>À retenir :</strong> <em>Kinovea = vidéo → mesure → analyse du mouvement.</em>
</div>

<div class="video-tutorial-box">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Tutoriel vidéo en français :</strong> <em>Tutoriel Kinovea FR : Suivi de trajectoire, chronométrage et mesure d'angles</em>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/w_6L9s2IwOE" 
      title="Tutoriel Kinovea en français" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">💡 Démonstration pratique : calibration d'échelle spatiale, repérage de points anatomiques et extraction de vitesse.</p>
</div>


### 6.8. MyJumpLab

<div class="app-header-badge">
  <img src="/images/logos/myjumplab.png" alt="Logo My Jump Lab" class="app-logo-badge" />
  <div class="app-title-info">
    <span class="app-category-tag">Biométrie Mobile & Évaluation Neuromusculaire</span>
    <p class="app-summary-text">Mesure de la détente verticale sur smartphone (CMJ, Squat Jump, Drop Jump, RSI) validée scientifiquement contre plateformes de force.</p>
  </div>
</div>

**Fonction principale**

Application spécialisée dans l'évaluation des performances de saut, notamment à partir de l'enregistrement vidéo haute fréquence.

Elle illustre un principe fondamental pour le préparateur physique : **le smartphone peut devenir un instrument de mesure fiable et nomade**.

**Avantages**
- matériel immédiatement accessible (smartphone iOS / Android) 
- utilisation de la vidéo haute fréquence (120 à 240 fps) 
- mesures rapides et directes sur le terrain 
- suivi longitudinal d'un groupe d'athlètes 
- validé par de multiples publications scientifiques internationales.

**Inconvénients**
- domaine d'utilisation spécialisé sur les tests de saut et d'explosivité 
- dépendance à la netteté et au cadrage de l'enregistrement vidéo 
- les résultats dépendent de la rigueur du protocole d'atterrissage 
- ne fournit pas une analyse de la charge globale d'entraînement.

<div class="example-card">
  <strong>À retenir :</strong> <em>MyJumpLab = vidéo haute fréquence → données quantitatives de saut.</em>
</div>

<div class="video-tutorial-box">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Tutoriel vidéo en français :</strong> <em>My Jump Lab Pro : Protocole de mesure de la détente verticale et analyse CMJ</em>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/U494h2ALFWw" 
      title="Tutoriel My Jump Lab en français" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">💡 Mise en œuvre du test de saut : sélection du décollage et de la réception pour calculer le temps de vol et la hauteur.</p>
</div>


### 6.9. MySprint

<div class="app-header-badge">
  <img src="/images/logos/mysprint.png" alt="Logo My Sprint" class="app-logo-badge" />
  <div class="app-title-info">
    <span class="app-category-tag">Profilage Sprint & Vitesse Horizontale</span>
    <p class="app-summary-text">Évaluation biomécanique de l'accélération et calcul du profil Force-Vitesse-Puissance (F0, V0, Pmax, RFmax) validé scientifiquement.</p>
  </div>
</div>

**Fonction principale**

Application spécialisée dans l'analyse de la performance en sprint à partir d'un protocole vidéo étalonné au sol (balises tous les 5 mètres).

Elle permet de modéliser la dynamique d'accélération horizontale et d'identifier le déficit de force ou de vitesse d'un athlète.

**Avantages**
- transforme une caméra smartphone en chronométrage radar virtuel 
- obtention immédiate des variables mécaniques clés (F0, V0, Pmax, ratio de force RF) 
- individualisation précise des séances d'entraînement de la vitesse 
- adapté au terrain et aux sports collectifs comme à l'athlétisme.

**Inconvénients**
- utilisation strictement dédiée au sprint en ligne droite 
- dépendance au respect minutieux du protocole (positionnement des plots et de la caméra) 
- ne remplace pas une analyse globale de la charge hebdomadaire.

<div class="example-card">
  <strong>À retenir :</strong> <em>MySprint = mesure du sprint → profilage mécanique force-vitesse.</em>
</div>

<div class="video-tutorial-box">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Tutoriel vidéo en français :</strong> <em>Comment utiliser MySprint et analyser le profil force-vitesse (par le Pr J-B. Morin)</em>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/JPnkA2ip9Lw" 
      title="Tutoriel MySprint en français par Jean-Benoît Morin" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">💡 Présentation méthodologique par l'un des concepteurs du profilage force-vitesse en accélération linéaire.</p>
</div>


### 6.10. MyFitnessPal

<div class="app-header-badge">
  <img src="/images/logos/myfitnesspal.png" alt="Logo MyFitnessPal" class="app-logo-badge" />
  <div class="app-title-info">
    <span class="app-category-tag">Nutrition & Balance Énergétique</span>
    <p class="app-summary-text">Journal alimentaire, suivi des apports caloriques journaliers et quantification des macronutriments (protéines, glucides, lipides).</p>
  </div>
</div>

**Fonction principale**

Suivi de la nutrition et de l'alimentation au quotidien.

L'intérêt est de montrer que les données utiles à la préparation physique ne proviennent pas uniquement des capteurs d'effort direct.

On peut par exemple mettre en relation :

$$\text{Alimentation / Hydratation} \longleftrightarrow \text{Entraînement} \longleftrightarrow \text{Poids / Masse grasse} \longleftrightarrow \text{Performance}$$

MyFitnessPal permet l'export des données pour les comptes utilisateurs, facilitant le croisement des bilans énergétiques avec les dépenses enregistrées par les montres connectées.

**Avantages**
- gigantesque base de données alimentaires mondiales 
- suivi longitudinal précis 
- possibilité de croiser nutrition et charges d'entraînement 
- complémentaire des données issues des capteurs de puissance et cardiofréquencemètres.

**Inconvénients**
- saisie alimentaire déclarative sujette aux oublis ou sous-évaluations 
- qualité des données dépendante de la précision de l'encodage par l'athlète 
- certaines fonctions d'export complet nécessitent des formules d'abonnement.

<div class="example-card">
  <strong>À retenir :</strong> <em>MyFitnessPal = données nutritionnelles → suivi énergétique et récupération.</em>
</div>

<div class="video-tutorial-box">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Tutoriel vidéo en français :</strong> <em>Comment utiliser MyFitnessPal : Calcul des calories et gestion des macronutriments</em>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/9nsIxjd6i4g" 
      title="Tutoriel MyFitnessPal en français" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">💡 Prise en main pour l'encodage des repas, l'analyse des ratios de macronutriments et le suivi de la balance énergétique.</p>
</div>


## 7. Comparaison synthétique des outils

Pour choisir l'outil adapté aux besoins du préparateur physique et de ses athlètes, ce tableau récapitule les caractéristiques distinctives de chaque environnement :

| Outil | Fonction principale | Liberté d'analyse | Automatisation | Public principal |
| :--- | :--- | :---: | :---: | :--- |
| **Excel** | Analyse et modélisation brute des données | ★★★★★ | ★★☆☆☆ | Analyste / préparateur / étudiant |
| **Strava** | Centralisation, comparaison & partage | ★★☆☆☆ | ★★★★☆ | Sportif / grand public |
| **Garmin Connect** | Collecte directe & suivi de santé | ★★☆☆☆ | ★★★★★ | Utilisateur matériel Garmin |
| **Nolio** | Planification, coaching & charge | ★★★☆☆ | ★★★★★ | Coach / préparateur / athlète |
| **TrainingPeaks** | Planification & modélisation de charge | ★★★☆☆ | ★★★★☆ | Entraîneur / athlète d'endurance |
| **Intervals.icu** | Analyse avancée & passerelle CSV | ★★★★☆ | ★★★★★ | Sportif averti / coach / data |
| **WKO5** | Analyse experte de la puissance | ★★★★★ | ★★★☆☆ | Analyste de la performance cycliste |
| **Kinovea** | Analyse vidéo et cinématique | ★★★★☆ | ★★☆☆☆ | Préparateur / biomécanicien |
| **MyJumpLab** | Mesure de détente verticale sur mobile | ★★☆☆☆ | ★★★★☆ | Préparateur physique terrain |
| **MySprint** | Profilage force-vitesse en accélération | ★★☆☆☆ | ★★★★☆ | Préparateur physique / vitesse |
| **MyFitnessPal** | Suivi nutritionnel & macronutriments | ★★☆☆☆ | ★★★☆☆ | Athlète / préparateur / diététicien |

> [!NOTE] Représentation pédagogique
> Les étoiles constituent ici une représentation pédagogique des caractéristiques générales de chaque logiciel dans le cadre de la formation, et non une évaluation de la qualité intrinsèque des outils.

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
