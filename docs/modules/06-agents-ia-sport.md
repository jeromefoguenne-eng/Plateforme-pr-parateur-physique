---
title: "06. Créer des Agents et Applications IA pour les Sportifs"
description: "Comprendre la différence entre modèle génératif et agent autonome. Création d'assistants et d'outils sur mesure avec Google Antigravity."
---

# 06. Créer des Agents et Applications IA pour les Sportifs

<div class="course-content justified-text">


Les outils d’intelligence artificielle permettent aujourd’hui d’aller au-delà de la simple utilisation d’applications sportives existantes. Il est possible de concevoir ses propres applications et agents IA, adaptés aux besoins d’un sportif, d’un entraîneur ou d’un préparateur physique.


Cette possibilité s’inscrit directement dans les objectifs de l’activité Exploitation des outils informatiques spécifiques, qui prévoit notamment la collecte et le traitement des données sportives, leur automatisation et la construction d’applications accessibles sur smartphone à partir de données structurées.


## 8.1. Applications IA et agents IA : de quoi parle-t-on ?

<div class="course-image-block">
  <img src="/images/illustration-ai-coach.jpg" alt="Intelligence artificielle et agent autonome en préparation physique" class="course-img" loading="lazy" />
  <span class="img-caption">Figure 8 : L'agent IA comme copilote opérationnel du préparateur physique pour la synthèse de charges et l'aide à la décision.</span>
</div>



Une application IA


Une application IA est un programme qui intègre un ou plusieurs modèles d'intelligence artificielle afin de réaliser une tâche particulière.


Dans le domaine sportif, elle peut par exemple :

- analyser les données d'entraînement 
- produire des graphiques et des tableaux de bord 
- générer automatiquement un bilan 
- répondre aux questions du sportif 
- proposer un programme d'entraînement 
- comparer les performances 

personnaliser les informations affichées.


L'application possède généralement une interface avec laquelle l'utilisateur interagit.


Exemple : une application dans laquelle le sportif importe ses séances et obtient automatiquement un bilan hebdomadaire de son entraînement.


Un agent IA


Un agent IA est un système capable d'aller plus loin qu'une simple réponse à une question. Il peut être conçu pour raisonner sur une tâche, utiliser des outils, manipuler des données ou des fichiers et enchaîner plusieurs opérations pour atteindre un objectif.


Les agents gérés par Google peuvent notamment exécuter du code, manipuler des fichiers et effectuer des recherches dans un environnement sécurisé.


On peut donc simplifier la distinction :


Attention : la frontière entre les deux notions n'est pas toujours nette. Une application peut intégrer un ou plusieurs agents IA.


## 8.2. Pourquoi créer ses propres outils IA ?


L'intérêt principal n'est pas simplement de « mettre de l'IA » dans une application. Il s'agit surtout de pouvoir construire un outil adapté à une problématique sportive précise.


1. Personnaliser l'outil


Une application existante impose généralement ses fonctionnalités.


Une application créée par l'utilisateur peut être conçue en fonction :

- de la discipline 
- du niveau du sportif 
- des objectifs 
- des données disponibles 
- des méthodes de travail du préparateur 

du contexte professionnel.


Exemple : un préparateur physique travaillant avec une équipe de football peut créer un tableau de bord spécifiquement adapté aux indicateurs qu'il utilise.


2. Exploiter ses propres données


L'application peut travailler directement à partir de données collectées par le sportif ou le staff :


GPS + fréquence cardiaque + puissance + RPE + sommeil + historique des séances


L'intérêt est alors de transformer une accumulation de données en informations interprétables.


Cette logique correspond précisément au processus décrit dans le profil de formation : collecter, stocker, traiter et partager les données afin de permettre des analyses ciblées et de soutenir les décisions liées à la performance et à la prévention des blessures.


3. Automatiser les tâches répétitives


L'IA et les automatisations peuvent prendre en charge certaines tâches chronophages :

- calculer des indicateurs 
- classer les séances 
- comparer des périodes 
- générer des graphiques 
- rédiger un compte rendu 
- détecter certaines évolutions 

préparer une synthèse hebdomadaire.


Le professionnel peut ainsi consacrer davantage de temps à l'interprétation et à l'accompagnement du sportif.


4. Rendre les données accessibles


Une base de données ou un tableur peut être difficile à exploiter pour un sportif.


Une application peut transformer ces données en une interface simple :


Aujourd'hui
Charge : modérée
Fatigue : 4/10
Sommeil : 7 h 45


Cette semaine
4 séances – 5 h 20
Charge : +8 % par rapport à la semaine précédente


Analyse IA
« La charge augmente progressivement. La fatigue déclarée reste stable. »


L'objectif est donc de transformer la donnée brute → en information compréhensible → puis éventuellement en aide à la décision.


5. Créer des outils évolutifs


Un avantage important des outils comme Google AI Studio et Antigravity est qu'il est possible de commencer par une application relativement simple puis de la faire évoluer progressivement.


Google AI Studio permet actuellement de créer des applications web full-stack ou des applications Android natives à partir d'instructions en langage naturel, puis de modifier progressivement l'application avec Gemini.


Antigravity, quant à lui, est conçu comme une plateforme de développement « agentique » permettant notamment de gérer plusieurs agents et d'orchestrer leurs activités.


## 8.3. Exemples d'applications et d'agents pour les sportifs


Les exemples suivants peuvent être réalisés sous forme de prototypes fonctionnels avec Google AI Studio ou Antigravity.


Application 1 — Tableau de bord de suivi du sportif


Objectif


Centraliser les données d'entraînement d'un sportif et produire une visualisation simple de son évolution.


Données

- date 
- type de séance 
- durée 
- distance 
- fréquence cardiaque 
- puissance 
- RPE 
- fatigue 

sommeil.


Fonctionnalités


L'application peut :

- importer les données 
- afficher les séances 
- calculer des indicateurs 
- générer des graphiques 
- comparer différentes périodes 

produire une synthèse.


Plus-value de l'IA :


« Analyse les données des quatre dernières semaines et identifie les principales évolutions. »


Application 2 — Coach de suivi


L'application devient une interface de dialogue entre le sportif et un agent IA.


Le sportif peut demander :


« Comment s'est passée ma semaine ? »


« Quelle séance ai-je réalisée mardi dernier ? »


« Compare mes trois dernières semaines. »


« Pourquoi ma charge est-elle plus importante cette semaine ? »


L'agent utilise les données disponibles pour générer une réponse contextualisée.


Intérêt


Le sportif n'a plus nécessairement besoin de savoir lire un tableau complexe : il peut interroger ses propres données en langage naturel.


Agent 3 — Assistant de planification


L'agent reçoit :

- les objectifs du sportif 
- son calendrier 
- les compétitions prévues 
- ses disponibilités 
- son historique d'entraînement 

ses données récentes.


Il peut alors construire une proposition de planification.


Exemple


Objectif : compétition dans 4 semaines
Disponibilité : 4 séances/semaine
Historique : 3 semaines d'augmentation progressive de la charge


L'agent peut générer une proposition de répartition des séances.


Le préparateur physique conserve cependant la responsabilité de valider, modifier ou rejeter la proposition.


Agent 4 — Assistant d'analyse de performance


L'agent reçoit les résultats de plusieurs séances ou compétitions.


Il peut :

- comparer les performances 
- calculer des évolutions 
- rechercher des tendances 
- mettre en évidence certaines variations 

générer automatiquement un rapport.


Exemple


Pour un coureur :


10 km — 44'32
10 km — 43'51
10 km — 43'20
10 km — 42'58


L'agent peut produire une représentation graphique et une synthèse de l'évolution.


Agent 5 — Assistant de récupération


L'agent croise différentes données :

- sommeil 
- fatigue 
- RPE 
- fréquence cardiaque 
- HRV 

charge récente.


Il peut produire une synthèse de récupération.


Exemple


Sommeil : 6 h 15
Fatigue : 7/10
RPE de la dernière séance : 8/10
Charge récente : en augmentation


L'agent peut alors attirer l'attention du sportif sur l'évolution de plusieurs indicateurs simultanément.


Il faut cependant distinguer analyse et diagnostic : un tel outil ne doit pas être présenté comme capable de poser un diagnostic médical.


Agent 6 — Assistant personnel du préparateur physique


On peut aller encore plus loin en créant un agent destiné non plus directement au sportif, mais au professionnel.


Chaque semaine, l'agent pourrait :

- récupérer les données des sportifs 
- vérifier leur intégrité 
- calculer les indicateurs 
- identifier les variations importantes 
- produire une synthèse pour chaque sportif 
- générer un tableau de bord 

préparer les points à discuter lors du prochain entretien.


Le préparateur physique dispose ainsi d'un assistant numérique spécialisé dans l'analyse des données de son groupe.


</div>

## 🎯 Auto-évaluation formative

<ClientOnly>
  <QuizBox moduleId="06-agents-ia-sport" moduleTitle="Intelligence Artificielle & Agents dans le Sport" />
</ClientOnly>

## 🏋️‍♂️ Travail pratique associé

<ClientOnly>
  <ExerciseBox 
    exerciseId="exercice-06" 
    exerciseTitle="Exercice 06 — Créer une application IA et un agent pour le préparateur physique" 
    googleDriveLink="https://drive.google.com/drive/folders/1w7P6L2P2kK5M6e3p-example-ex6" 
    description="À l'aide de Google Antigravity, concevez une application interactive intégrant un agent IA capable d'ingérer un fichier de données sportives et de produire un compte-rendu décisionnel pour l'entraîneur." 
  />
</ClientOnly>
