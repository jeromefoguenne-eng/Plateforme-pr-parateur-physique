---
title: "03. Collecter et Structurer des Données avec Excel"
description: "Maîtriser le tableur comme outil socle : principes de structuration des variables, formules, références absolues ($) et Tableaux Croisés Dynamiques (TCD)."
---

# 03. Collecter et Structurer des Données avec Excel

<div class="course-content justified-text">


La gestion des données constitue une compétence essentielle dans le métier de préparateur physique et d’entraîneur. Les données permettent de suivre l’évolution d’un sportif, de comparer des performances, d’objectiver certaines décisions et d’identifier des tendances. Pour être réellement exploitables, elles doivent cependant être correctement collectées, organisées, nettoyées et structurées.


Le profil d’enseignement de l’activité Exploitation des outils informatiques spécifiques identifie précisément ces compétences : récolter et importer des données numériques, encoder des données brutes dans un tableur sous une forme exploitable et automatiser leur traitement à l’aide de formules, de graphiques et de tableaux croisés.


Excel peut ainsi être considéré comme un outil de gestion et d’analyse des données sportives, et pas uniquement comme un outil permettant de réaliser des tableaux.


## De la donnée brute à l'information


Une donnée est une observation enregistrée sous une forme exploitable : une date, une distance, une fréquence cardiaque, une durée, une charge d'entraînement, un nombre de répétitions, un poids, etc.


Une donnée isolée fournit généralement peu d'informations. C'est son organisation, sa mise en relation avec d'autres données et son traitement qui permettent de produire de l'information utile à la prise de décision.


On peut représenter le processus de la manière suivante :


Données brutes → Structuration → Traitement → Analyse → Information → Décision


Exemple


Un préparateur physique dispose des données suivantes :


Ces données deviennent beaucoup plus intéressantes lorsqu'elles permettent de calculer :

- la vitesse moyenne 
- le rythme moyen 
- le volume d'entraînement hebdomadaire 
- l'évolution de la fréquence cardiaque 
- la comparaison entre plusieurs séances 

la progression d'un sportif dans le temps.


Excel permet précisément d'automatiser une partie de cette transformation.


## 5.2. Collecter les données


La première étape consiste à obtenir les données nécessaires.


Dans le domaine sportif, les données peuvent provenir de nombreuses sources :

- encodage manuel 
- tests physiques 
- feuilles de présence 
- applications de suivi sportif 
- montres et bracelets connectés 
- cardiofréquencemètres 
- GPS 
- plateformes telles que Strava, Garmin Connect ou TrainingPeaks 
- fichiers CSV ou Excel 
- questionnaires 
- applications mobiles 

systèmes de chronométrage ou de mesure.


Le profil d'enseignement insiste notamment sur la capacité à récolter des données numériques et à les importer/exporter.


Avant de collecter une donnée, il faut déterminer :


Pourquoi la collecte est-elle réalisée ?


Quelle information cherche-t-on à obtenir ?


Quelle variable doit être mesurée ?


Dans quelle unité ?


À quelle fréquence la mesure doit-elle être réalisée ?


Comment les données seront-elles stockées et exploitées ?


Une collecte efficace commence donc par une définition précise des variables nécessaires.


## 5.3. Identifier les variables


Une variable est une caractéristique susceptible de prendre différentes valeurs.


Dans le domaine de la préparation physique, on peut par exemple retrouver :


Variables qualitatives


Elles décrivent une catégorie ou une caractéristique.


Sportif


Sexe


Position


Type de séance


Sport pratiqué


Niveau de pratique


Type de blessure


Variables quantitatives


Elles correspondent à des valeurs numériques.


Poids


Taille


Distance


Durée


Vitesse


Fréquence cardiaque


Puissance


Charge


Nombre de répétitions


Temps de récupération


La distinction est importante car le type de donnée détermine la manière dont elle pourra être traitée dans Excel.


## 5.4. Structurer correctement un tableau de données


Un tableur devient réellement puissant lorsque les données sont organisées selon une structure régulière.


Une règle fondamentale consiste à utiliser :


Une ligne = une observation
Une colonne = une variable
Une cellule = une valeur


Exemple de structure correcte


Cette organisation permet ensuite de trier, filtrer, calculer, représenter graphiquement ou analyser les données.


À éviter


Un tableau mal structuré pourrait être organisé comme ceci :


Cette présentation peut être agréable visuellement mais elle est beaucoup moins adaptée à l'analyse automatisée.


Un tableau destiné à être analysé doit privilégier la structure des données plutôt que leur présentation graphique.


3.5. Les règles d'une base de données efficace


Pour construire un tableau exploitable dans Excel, plusieurs règles sont importantes.


1. Utiliser une seule ligne d'en-têtes


Les noms des variables doivent apparaître sur une ligne unique.


2. Ne pas fusionner les cellules


Les cellules fusionnées compliquent le tri, le filtrage et l'analyse.


3. Ne pas laisser de lignes vides au milieu des données


Une ligne vide peut être interprétée comme une séparation entre plusieurs ensembles de données.


4. Utiliser des unités cohérentes


Il faut éviter de mélanger, par exemple :

- kilomètres et mètres 
- minutes et heures 
- kilogrammes et livres 

km/h et m/s.


5. Utiliser des formats cohérents


Une date doit être enregistrée comme une date, une durée comme une durée et une valeur numérique comme un nombre.


6. Éviter les informations multiples dans une même cellule


Par exemple :


Martin – 75 kg – 1,78 m


doit être réparti dans plusieurs variables :


7. Éviter les variations inutiles d'écriture


Endurance, endurance, END, End. et Endurance fondamentale seront interprétés comme des catégories différentes.


Il est donc préférable de définir une nomenclature standardisée.


## 5.6. Transformer une plage de données en tableau Excel


Excel permet de transformer une plage de données en tableau structuré.


Cette fonctionnalité présente plusieurs avantages :

- extension automatique du tableau lorsque de nouvelles données sont ajoutées 
- filtres automatiques 
- formules recopiées automatiquement 
- références structurées 
- mise en forme cohérente 

exploitation facilitée dans les graphiques et tableaux croisés dynamiques.


Il est donc recommandé de transformer une base de données régulièrement utilisée en Tableau Excel, plutôt que de travailler simplement sur une plage de cellules.


## 5.7. Nettoyer et contrôler les données


Une donnée mal saisie peut produire une analyse incorrecte.


Avant de réaliser des calculs, il faut donc procéder à une phase de nettoyage des données.


Il faut notamment rechercher :

- les valeurs manquantes 
- les doublons 
- les erreurs de saisie 
- les unités incohérentes 
- les valeurs aberrantes 
- les catégories écrites différemment 

les dates incorrectes.


Exemple


Supposons que les poids suivants soient enregistrés :


75 – 76 – 74,5 – 750 – 75,2


La valeur 750 est probablement une erreur de saisie. Excel peut effectuer parfaitement un calcul à partir de cette valeur : il ne sait pas nécessairement qu'elle est incorrecte.


C'est pourquoi l'automatisation ne dispense jamais du contrôle humain des données.


## 5.8. Utiliser les formules pour automatiser les calculs


L'un des principaux intérêts d'Excel est de pouvoir effectuer automatiquement des calculs.


Une formule commence généralement par :


=


Opérations élémentaires


=A2+B2


=A2-B2


=A2*B2


=A2/B2


Fonctions courantes


=SOMME(...)


=MOYENNE(...)


=MIN(...)


=MAX(...)


=NB(...)


=NBVAL(...)


Ces fonctions permettent par exemple de calculer :

- le volume total d'entraînement 
- la durée moyenne d'une séance 
- la meilleure performance 
- la moins bonne performance 

le nombre de séances réalisées.


## 5.9. Exploiter les références de cellules


Excel permet de faire référence à une cellule dans une formule.


Par exemple :


=B2/C2


permet de calculer une valeur à partir de deux autres données.


Cette logique permet de construire des indicateurs automatisés.


Exemple : calcul de la vitesse


Si :

- B2 = distance en kilomètres 
- C2 = durée en heures 

alors :


=B2/C2


permet d'obtenir la vitesse moyenne en km/h.


L'intérêt est que lorsque les données de départ sont modifiées, le résultat est automatiquement recalculé.


## 5.10. Les fonctions conditionnelles


Les fonctions conditionnelles permettent de faire dépendre un résultat d'une condition.


La fonction SI permet par exemple d'écrire :


=SI(B2>=18;"Validé";"À retravailler")


On peut ainsi automatiser certains traitements :

- identifier une réussite ou un échec 
- catégoriser une performance 
- signaler une valeur inhabituelle 
- attribuer automatiquement une catégorie 

déclencher un indicateur.


D'autres fonctions permettent de compter ou d'effectuer des calculs selon certains critères, notamment :


NB.SI


NB.SI.ENS


SOMME.SI


SOMME.SI.ENS


MOYENNE.SI


MOYENNE.SI.ENS


Ces fonctions deviennent particulièrement utiles lorsque la base de données contient plusieurs sportifs, plusieurs séances ou plusieurs périodes.


## 5.11. Trier et filtrer les données


Lorsque le nombre de données augmente, il devient difficile de les analyser visuellement.


Les fonctionnalités de tri et de filtrage permettent de sélectionner rapidement l'information pertinente.


Trier


On peut trier les données :

- par date 
- par sportif 
- par performance 
- par durée 
- par fréquence cardiaque 
- du plus petit au plus grand 

du plus grand au plus petit.


Filtrer


Un filtre permet de n'afficher qu'une partie des données.


Par exemple :


Afficher uniquement les séances de Martin réalisées au mois de septembre.


Ou :


Afficher uniquement les séances dont la fréquence cardiaque moyenne est supérieure à 160 bpm.


Le filtre ne supprime pas les données : il permet simplement de limiter temporairement les observations affichées.


## 5.12. Mettre en évidence les données avec la mise en forme conditionnelle


La mise en forme conditionnelle permet de modifier automatiquement l'apparence d'une cellule en fonction de sa valeur.


Elle peut par exemple permettre de :

- mettre en évidence les meilleures performances 
- repérer les valeurs dépassant un seuil 
- visualiser une progression 
- identifier rapidement des valeurs inhabituelles 

utiliser des échelles de couleurs ou des indicateurs.


Cette fonctionnalité permet de passer d'un tableau purement numérique à une lecture visuelle des données.


## 5.13. Représenter les données avec des graphiques


Un graphique permet de transformer un ensemble de valeurs en une représentation visuelle.


Le choix du graphique doit dépendre de la question que l'on cherche à analyser.


Graphique en courbes


Particulièrement adapté à l'évolution d'une variable dans le temps.


Exemple : évolution du poids d'un sportif sur 12 semaines.


Graphique en colonnes


Adapté à la comparaison de plusieurs catégories.


Exemple : volume d'entraînement réalisé chaque semaine.


Graphique en nuage de points


Particulièrement intéressant pour étudier la relation entre deux variables quantitatives.


Exemple : relation entre charge d'entraînement et fréquence cardiaque.


Graphique circulaire


Peut représenter la répartition entre plusieurs catégories, mais son intérêt devient limité lorsque le nombre de catégories augmente.


Le graphique n'est donc pas un élément décoratif : il doit répondre à une question d'analyse.


## 5.14. Les tableaux croisés dynamiques


Lorsque les données deviennent nombreuses, les tableaux croisés dynamiques permettent de les synthétiser rapidement.


Ils permettent notamment de regrouper les données selon différentes variables.


À partir d'une base contenant :

- plusieurs sportifs 
- plusieurs dates 
- plusieurs types de séances 
- plusieurs mesures 

on peut par exemple obtenir automatiquement :

- le volume total d'entraînement par sportif 
- la durée moyenne par type de séance 
- le nombre de séances par semaine 

la performance moyenne par période.


Le tableau croisé dynamique permet donc de passer d'une base de données détaillée à une synthèse exploitable.


</div>

## 🎯 Auto-évaluation formative

<ClientOnly>
  <QuizBox moduleId="03-excel-structuration" moduleTitle="Structuration & Analyse sous Excel" />
</ClientOnly>

## 🏋️‍♂️ Travail pratique associé

<ClientOnly>
  <ExerciseBox 
    exerciseId="exercice-03" 
    exerciseTitle="Exercice 03 — Excel : Collecte et structuration de données" 
    googleDriveLink="https://drive.google.com/drive/folders/1w7P6L2P2kK5M6e3p-example-ex3" 
    description="À partir d'un jeu de données brut de tests de terrain, appliquez les règles de structuration des colonnes/lignes, automatisez les calculs d'indicateurs personnalisés et élaborez un Tableau Croisé Dynamique de synthèse." 
  />
</ClientOnly>
