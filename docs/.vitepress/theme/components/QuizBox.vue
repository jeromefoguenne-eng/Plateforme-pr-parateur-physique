<script setup>
import { ref, computed, onMounted } from 'vue'
import { userStore } from '../stores/userStore'

const props = defineProps({
  moduleId: {
    type: String,
    required: true
  },
  moduleTitle: {
    type: String,
    default: ''
  }
})

// Banque de questions par module
const QUESTIONS_DB = {
  '00-introduction': [
    {
      id: 'q1',
      type: 'qcm',
      title: "1. Évolution de la posture professionnelle — Du ressenti subjectif aux données observables",
      text: "Dans la préparation physique moderne, que signifie concrètement l'évolution décrite dans le cours : passer de « Je pense qu'il est prêt » à « Au regard de l'ensemble des données disponibles, la probabilité qu'il tolère cette charge semble acceptable » ?",
      options: [
        "L'ordinateur et les algorithmes remplacent désormais le préparateur physique sur le terrain pour dicter automatiquement toutes les séances sans intervention humaine.",
        "Les données ne suppriment pas l'imprévisibilité inhérente au sport, mais elles réduisent l'incertitude en fournissant des indicateurs objectifs et longitudinaux pour éclairer la décision professionnelle du préparateur et du staff.",
        "Le préparateur physique a l'obligation légale d'annuler immédiatement un entraînement dès qu'un capteur GPS enregistre une variation de 1% de la distance de sprint.",
        "Tous les sportifs d'une même équipe doivent désormais exécuter strictement le même contenu d'entraînement pour uniformiser les données informatiques."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "Comme le souligne le cours et le témoignage de Fred Taquin, le sport reste imprévisible. La datafication ne remplace pas l'expertise humaine ; elle fournit des repères observables et longitudinaux qui réduisent l'incertitude et permettent de dépasser le simple ressenti subjectif pour objectiver les décisions."
    },
    {
      id: 'q2',
      type: 'qcm',
      title: "2. Charge Externe vs Charge Interne & Nécessité d'Individualisation",
      text: "Deux footballeurs d'une même équipe réalisent la même séance collective (distance identique de 8 km, même durée). Pourtant, le lendemain, l'un est parfaitement frais tandis que l'autre présente une fatigue excessive et des marqueurs dégradés. Comment les outils numériques permettent-ils au préparateur physique d'expliquer et de gérer ce phénomène ?",
      options: [
        "Il s'agit forcément d'un bug des capteurs GPS, car deux athlètes soumis au même entraînement collectif subissent rigoureusement la même contrainte physiologique.",
        "La charge externe (travail mécanique mesuré par GPS : distance, accélérations, sprints) était identique sur le papier, mais la charge interne (réponse physiologique et perceptive : FC, variabilité cardiaque, score RPE de Foster) varie selon le niveau aérobie, l'historique de blessure et la fatigue individuelle.",
        "Le préparateur doit exiger que le joueur le plus fatigué double sa charge d'entraînement lors de la séance suivante afin de rattraper son retard statistique.",
        "Seules les données de perception subjective (RPE) sont valables ; les données GPS de charge externe doivent être ignorées dans les sports collectifs."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "La distinction entre charge externe (contrainte physique imposée) et charge interne (réponse psychophysiologique propre à chaque organisme) est au cœur de la démarche data. Elle justifie scientifiquement que « tout le monde ne doit pas nécessairement faire la même chose simplement parce que tout le monde appartient à la même équipe »."
    },
    {
      id: 'q3',
      type: 'qcm',
      title: "3. Prévention des blessures et limites scientifiques des algorithmes",
      text: "Que démontrent les revues systématiques récentes concernant la prédiction des blessures à partir des données GPS et des modèles algorithmiques ?",
      options: [
        "Les algorithmes d'intelligence artificielle peuvent aujourd'hui prédire avec une certitude absolue de 100% le jour et l'heure exacts d'une lésion musculaire.",
        "Aucun indicateur GPS unique ne constitue un prédicteur universel et infaillible de blessure ; les données constituent des signaux d'alerte contextuels (variations aiguës inhabituelles, baisse de vitesse maximale, fatigue déclarée) pour interroger la situation et réguler la charge.",
        "Les données GPS n'ont aucune utilité en prévention, car les blessures sont purement aléatoires et impossibles à mitiger.",
        "Dès qu'un joueur atteint 1 000 mètres à haute intensité dans un match, il est médicalement certain de se blesser s'il rejoue dans les 10 jours."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "Une compétence essentielle du préparateur physique moderne est de savoir interpréter les données sans leur faire dire ce qu'elles ne disent pas. La relation charge-blessure est multifactorielle et complexe : la donnée signale une probabilité accrue ou une anomalie de charge, mais ne constitue jamais un oracle déterministe."
    },
    {
      id: 'q4',
      type: 'open',
      title: "4. Question ouverte de réflexion : Individualisation et croisement des données de terrain",
      text: "« Tout le monde ne doit pas nécessairement faire la même chose simplement parce que tout le monde appartient à la même équipe. » En tant que préparateur physique, expliquez comment vous croisez concrètement les données de charge externe (GPS : distances, sprints, accélérations/décélérations), les données de charge interne (cardiofréquencemètre, score RPE de Foster) et les données contextuelles/qualitatives (sommeil, dialogue direct avec le joueur) pour identifier un athlète en difficulté et adapter scientifiquement sa séance sans désorganiser le collectif.",
      placeholder: "Rédigez votre réflexion argumentée (environ 4 à 8 phrases). Structurez votre réponse en montrant la distinction charge externe / charge interne, le suivi longitudinal et l'ajustement concret proposé...",
      points: 2,
      expectedCriteria: [
        "Distinction charge externe / charge interne : comprendre qu'un même volume mécanique (GPS) peut induire un stress cardiaque ou une perception de fatigue (RPE) disproportionnée chez un athlète émoussé.",
        "Vision longitudinale et individualisée : comparer l'athlète à ses propres standards habituels (baseline) plutôt qu'à une moyenne de groupe abstraite.",
        "Intégration du contexte global : prise en compte du sommeil, du bien-être (wellness / Hooper) et de la communication verbale pour contextualiser les chiffres.",
        "Action d'ajustement concrète : adapter le contenu (ex: moduler le nombre de répétitions à haute intensité, remplacer les jeux réduits à fortes décélérations par du travail technique ou de la récupération active)."
      ],
      sampleAnswer: "Pour individualiser l'entraînement, je ne me limite jamais à une seule métrique. Si le GPS indique qu'un joueur a réalisé son volume habituel de 8 km mais que sa fréquence cardiaque moyenne présente une dérive anormale (+10 bpm à intensité égale) et que son RPE bondit à 8/10 au lieu de 5/10, cela signale une charge interne excessive. Je croise immédiatement ce signal avec son questionnaire de sommeil et un échange verbal direct pour comprendre son ressenti. Si ce faisceau d'indices converge vers une fatigue aiguë, je n'annule pas la séance mais j'adapte son contenu : je le soustrais aux jeux réduits à forte densité de décélérations/accélérations excentriques pour privilégier un travail technique à allure contrôlée ou une séance de décharge aérobie. Ainsi, les données m'ont permis d'anticiper un surmenage tout en maintenant le joueur actif au sein du groupe.",
      explanation: "L'individualisation repose sur le croisement longitudinal de la charge externe et interne, enrichi par le contexte qualitatif et le dialogue direct."
    },
    {
      id: 'q5',
      type: 'open',
      title: "5. Question ouverte de réflexion : Prise de décision collaborative et posture face à l'imprévisibilité (Fred Taquin & Staff)",
      text: "Dans son témoignage vidéo issu de l'émission « La 90ème », l'entraîneur Fred Taquin évoque la collaboration au sein du staff et la réalité de l'usage des données. Imaginez la situation suivante : Votre analyse des datas révèle qu'un titulaire indiscutable montre une accumulation de charge critique et des accélérations en baisse depuis 3 séances, suggérant un risque accru de lésion musculaire. Cependant, le joueur affirme vouloir jouer à tout prix et l'entraîneur principal souhaite l'aligner pour un match décisif de championnat. Quelle est votre démarche de préparateur physique pour éclairer la décision du staff sans adopter une posture dogmatique (« l'algorithme a dit non »), en appliquant la boucle décisionnelle : Mesurer → Comprendre → Anticiper → Décider ensemble → Observer les effets ?",
      placeholder: "Développez votre raisonnement professionnel (environ 4 à 8 phrases). Précisez votre rôle d'intermédiaire entre la donnée et la décision, les compromis opérationnels envisageables (temps de jeu, monitoring live, protocole d'échauffement) et la communication avec l'entraîneur et le joueur...",
      points: 2,
      expectedCriteria: [
        "Posture d'intermédiaire et de conseil : ne pas s'enfermer dans un refus autoritaire dogmatique, mais présenter un diagnostic probabiliste clair et objectivé des risques au coach et au staff médical.",
        "Objectivation par des faits mesurés : montrer la tendance longitudinale (ex: baisse de 15% des accélérations maximales, ratio de charge aiguë/chronique au-dessus de la zone de sécurité).",
        "Co-construction d'un compromis opérationnel : proposer des solutions concrètes (ex: titularisation avec temps de jeu plafonné à 60 minutes, suivi GPS en direct depuis le banc avec seuils d'alerte, protocole d'échauffement neuro-musculaire renforcé).",
        "Boucle d'apprentissage et suivi post-match : évaluer les effets post-rencontre dès le coup de sifflet final (débriefing objectif, RPE lendemain) pour adapter immédiatement la semaine suivante et affiner le profil de tolérance de l'athlète."
      ],
      sampleAnswer: "Face à cette situation, ma posture n'est pas de m'opposer frontalement au coach avec un dogme algorithmique, mais de jouer mon rôle d'intermédiaire éclairé entre la mesure et la décision sportive. J'organise un point rapide avec l'entraîneur principal et le médecin du club en présentant les faits objectifs : l'historique montre une chute de 15% des accélérations maximales et un ratio de charge aiguë/chronique très élevé, ce qui augmente statistiquement la probabilité de blessure. J'intègre le désir légitime du joueur et l'enjeu sportif du match pour proposer un compromis maîtrisé : autoriser le joueur à débuter le match mais avec un suivi GPS en temps réel sur le banc, une consigne de remplacement dès la 60e minute ou dès qu'un seuil critique de fatigue mécanique est atteint, et un échauffement personnalisé axé sur l'activation isométrique des ischios. Après la rencontre, nous analysons ensemble la réponse physiologique pour adapter la régénération. Cette boucle décisionnelle partagée respecte la primauté du coach tout en sécurisant la santé de l'athlète grâce aux datas.",
      explanation: "Le préparateur physique n'est ni un exécutant passif ni un décideur autoritaire : il est l'expert qui éclaire la décision collégiale du staff en objectivant les probabilités sans ignorer le contexte humain et sportif."
    }
  ],

  '01-capteurs': [
    {
      id: 'q1',
      title: "1. Systèmes de positionnement en salle (Indoor)",
      text: "Pourquoi le GPS classique est-il inefficace pour analyser les déplacements lors d'un match de basket-ball ou de handball en salle ?",
      options: [
        "Parce que les signaux des satellites GNSS ne traversent pas les toits et structures des gymnases.",
        "Parce que les joueurs de basket courent trop vite pour les satellites.",
        "Parce que les règles de la fédération interdisent formellement le port de maillots en salle.",
        "Parce que les piles des GPS se déchargent instantanément en intérieur."
      ],
      correctIndex: 0,
      points: 2,
      explanation: "En intérieur, l'absence de vue directe sur les satellites bloque le signal GNSS. On utilise alors des systèmes LPS (Local Positioning System avec balises UWB)."
    },
    {
      id: 'q2',
      title: "2. Mesure de la force explosive (CMJ)",
      text: "Quel outil de terrain est considéré comme l'étalon de référence pour mesurer avec précision la force, la puissance et la hauteur d'un saut vertical (Countermovement Jump) ?",
      options: [
        "Un cardiofréquencemètre optique au poignet.",
        "Une plateforme de force (ou un système optoélectronique / tapis de contact de qualité).",
        "Une balance impédancemètre grand public.",
        "Un radar Doppler routier."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "La plateforme de force permet d'enregistrer la force verticale au cours du temps et de calculer la vitesse, la puissance mécanique et les asymétries droite/gauche."
    },
    {
      id: 'q3',
      title: "3. Entraînement basé sur la vitesse (VBT)",
      text: "En musculation, quel capteur est couramment utilisé pour contrôler la vitesse de déplacement de la barre afin d'ajuster la charge en temps réel ?",
      options: [
        "Un transducteur linéaire de position (encodeur) ou un accéléromètre dédié au VBT.",
        "Une sonde de lactatémie sanguine.",
        "Un saturomètre au doigt.",
        "Un GPS haute fréquence."
      ],
      correctIndex: 0,
      points: 2,
      explanation: "Les encodeurs linéaires (ex: GymAware, Speed4Lifts) ou capteurs inertiels mesurent la vitesse d'exécution pour calibrer l'effort et stopper la série en cas de perte de vitesse."
    },
    {
      id: 'q4',
      title: "4. Variabilité de la Fréquence Cardiaque (VRC / HRV)",
      text: "Que reflète principalement une mesure de la Variabilité de la Fréquence Cardiaque au repos ?",
      options: [
        "Le nombre exact de calories brûlées au cours de la journée.",
        "L'activité du système nerveux autonome (équilibre sympathique / parasympathique) et l'état de fatigue ou de récupération.",
        "La vitesse maximale aérobie du sportif.",
        "Le pourcentage de masse grasse corporelle."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "Une VRC élevée au repos témoigne généralement d'une bonne dominance parasympathique et d'une récupération favorable, tandis qu'une baisse chronique signale un état de fatigue ou de stress."
    },
    {
      id: 'q5',
      title: "5. Capteurs de puissance en cyclisme (Wattmètres)",
      text: "Quel est l'avantage déterminant d'un capteur de puissance (watts) par rapport au cardiofréquencemètre lors de répétitions de sprints courts en vélo ?",
      options: [
        "La puissance mesure instantanément le travail mécanique sans le temps de latence propre à la réponse cardiaque.",
        "Le wattmètre coûte beaucoup moins cher qu'une ceinture cardio.",
        "La puissance ne dépend pas du vent ni de la pente, elle traduit l'effort produit à chaque coup de pédale.",
        "Les réponses A et C sont toutes les deux exactes."
      ],
      correctIndex: 3,
      points: 2,
      explanation: "La fréquence cardiaque présente une inertie physiologique (latence), tandis que le wattmètre mesure instantanément la force x vitesse appliquée sur les pédales."
    }
  ],

  '02-importation-logiciels': [
    {
      id: 'q1',
      title: "1. Format de fichier standard pour le transfert de données sportives",
      text: "Quel format binaire propriétaire, développé par Dynastream/Garmin, est aujourd'hui universellement adopté pour enregistrer les données horodatées des séances sportives (GPS, watts, FC, cadence) ?",
      options: [
        "Le format .DOCX",
        "Le format .FIT (Flexible and Interoperable Data Transfer)",
        "Le format .MP3",
        "Le format .EXE"
      ],
      correctIndex: 1,
      points: 2,
      explanation: "Le format .FIT est un format compact et binaire optimisé pour stocker les séries temporelles capteurs lors d'activités sportives."
    },
    {
      id: 'q2',
      title: "2. Rôle d'un fichier CSV",
      text: "Pourquoi le format CSV (Comma-Separated Values) est-il indispensable pour le préparateur physique ?",
      options: [
        "Parce qu'il ne peut être ouvert qu'avec un smartphone.",
        "Parce qu'il s'agit d'un format texte universel permettant d'importer facilement des données tabulaires brutes dans n'importe quel tableur (Excel, R, Python).",
        "Parce qu'il protège les données contre tout risque de lecture.",
        "Parce qu'il permet de colorer automatiquement les cellules en bleu."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "Le fichier CSV est le standard d'échange universel entre les logiciels de tracking et les outils d'analyse de données."
    },
    {
      id: 'q3',
      title: "3. Complémentarité Excel vs Plateformes dédiées (Nolio, TrainingPeaks)",
      text: "Quelle est la principale force d'un logiciel comme Nolio ou TrainingPeaks par rapport à une feuille Excel brute ?",
      options: [
        "L'automatisation de la synchronisation cloud avec les montres des athlètes et la comparaison programmée/réalisée de l'entraînement.",
        "L'impossibilité pour l'athlète de consulter ses données.",
        "Le fait qu'ils ne nécessitent aucune connexion internet.",
        "La possibilité de modifier le code source du logiciel."
      ],
      correctIndex: 0,
      points: 2,
      explanation: "Les plateformes de coaching centralisent la collecte à distance et automatisent le suivi longitudinal, alors qu'Excel offre une totale liberté d'analyse personnalisée."
    },
    {
      id: 'q4',
      title: "4. Logiciel Kinovea",
      text: "Dans quel domaine le logiciel libre et gratuit Kinovea est-il particulièrement reconnu ?",
      options: [
        "L'enregistrement de la musique pour les cours de step.",
        "L'analyse vidéo biomécanique du mouvement (ralenti, mesure d'angles, trajectoires, chronométrage).",
        "Le calcul automatique des fiches de paie des joueurs.",
        "La gestion du calendrier des matchs de championnat."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "Kinovea permet de transformer un enregistrement vidéo en données mesurables (angles articulaires, vitesse de barre, cinématique)."
    },
    {
      id: 'q5',
      title: "5. WKO5 et Intervals.icu",
      text: "Pour quel type d'analyse ces deux outils sont-ils réputés chez les entraîneurs experts ?",
      options: [
        "L'impression d'affiches de vestiaire.",
        "La modélisation avancée de la courbe puissance-durée (Power Duration Curve) et l'estimation de la puissance critique.",
        "La réservation des terrains d'entraînement.",
        "La surveillance du compte bancaire des sportifs."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "WKO5 et Intervals.icu sont des références pour l'analyse mathématique approfondie des profils de puissance et de l'endurance."
    }
  ],

  '03-excel-structuration': [
    {
      id: 'q1',
      title: "1. Règle fondamentale d'un tableau de données propre",
      text: "Dans un tableau Excel destiné à l'analyse sportive, quelle structure doit être impérativement respectée ?",
      options: [
        "Fusionner un maximum de cellules pour rendre le tableau plus esthétique.",
        "Chaque colonne représente une seule variable bien définie, chaque ligne représente une seule observation (ou séance), sans cellules fusionnées.",
        "Écrire le texte et les chiffres ensemble dans la même cellule (ex: « 12 km »).",
        "Laisser une ligne vide tous les deux jours."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "Une structure propre (Tidy Data) sépare les variables en colonnes et les observations en lignes pour permettre le tri, les formules et les TCD."
    },
    {
      id: 'q2',
      title: "2. Référence absolue ($) dans Excel",
      text: "À quoi sert le symbole dollar dans une formule telle que <code>=$C$2*D5</code> lors de l'étirement vers le bas ?",
      options: [
        "À convertir le résultat en dollars américains.",
        "À figer la cellule C2 pour que sa référence ne se décale pas lors de la recopie de la formule.",
        "À signaler une erreur de calcul.",
        "À masquer la cellule aux yeux des athlètes."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "Le symbole $ bloque la colonne et/ou la ligne lors de l'étirement ou de la recopie de formules."
    },
    {
      id: 'q3',
      title: "3. Tableau Croisé Dynamique (TCD)",
      text: "Quel est le principal bénéfice d'un Tableau Croisé Dynamique pour un préparateur physique ?",
      options: [
        "Il permet d'agréger, filtrer et synthétiser en quelques clics des milliers de lignes d'entraînement (ex: total des distances par joueur et par semaine).",
        "Il remplace définitivement l'entraînement sur le terrain.",
        "Il transforme automatiquement une vidéo en dessin animé.",
        "Il efface les mauvaises performances des joueurs."
      ],
      correctIndex: 0,
      points: 2,
      explanation: "Le TCD est l'outil d'analyse par excellence dans Excel pour agréger de grands volumes de données et produire des tableaux de bord."
    },
    {
      id: 'q4',
      title: "4. Mise en forme conditionnelle",
      text: "Comment la mise en forme conditionnelle aide-t-elle le préparateur physique dans son suivi quotidien ?",
      options: [
        "En colorant aléatoirement les cases pour faire joli.",
        "En mettant automatiquement en évidence visuelle (code couleur vert/orange/rouge) les valeurs anormales, les pics de charge ou les signaux de fatigue.",
        "En réduisant la taille du fichier sur le disque dur.",
        "En corrigeant les fautes d'orthographe dans les noms des joueurs."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "Elle attire immédiatement l'attention du staff sur les athlètes à risque (ex: RPE > 8 ou charge d'entraînement anormale)."
    },
    {
      id: 'q5',
      title: "5. Les tableaux structurés (Insérer > Tableau)",
      text: "Quel est l'avantage d'activer la fonction « Tableau » d'Excel plutôt qu'une simple plage de cellules ?",
      options: [
        "Les formules et formats se propagent automatiquement aux nouvelles lignes ajoutées et les TCD s'actualisent plus facilement.",
        "Le tableur s'ouvre plus lentement.",
        "L'ordinateur consomme plus d'électricité.",
        "Le tableau devient non modifiable."
      ],
      correctIndex: 0,
      points: 2,
      explanation: "Les tableaux structurés simplifient la gestion des listes de données dynamiques et rendent les formules plus lisibles grâce aux références structurées."
    }
  ],

  '04-propres-outils-collecte': [
    {
      id: 'q1',
      title: "1. Questionnaire de Hooper",
      text: "Quelles sont les 4 dimensions subjectives évaluées quotidiennement par le questionnaire de Hooper chez le sportif ?",
      options: [
        "Sommeil, Stress, Fatigue et Courbatures musculaires.",
        "Taille, Poids, Vitesse et VMA.",
        "Pression artérielle, Glycémie, Cholestérol et Température.",
        "Vitesse de sprint, Hauteur de saut, Force maximale et Souplesse."
      ],
      correctIndex: 0,
      points: 2,
      explanation: "Le score de Hooper (évalué de 1 à 7 sur ces 4 items) permet de quantifier la qualité de récupération et l'état psychophysiologique du matin."
    },
    {
      id: 'q2',
      title: "2. Calcul de la charge de séance (Session-RPE de Foster)",
      text: "Comment se calcule la charge d'entraînement d'une séance selon la méthode validée par Carl Foster ?",
      options: [
        "Charge (unités arbitraires) = Durée de la séance (en minutes) × Perception de l'effort (RPE de 1 à 10).",
        "Charge = Distance en km divisée par la vitesse moyenne.",
        "Charge = Poids du sportif multiplié par son âge.",
        "Charge = Fréquence cardiaque maximale moins la fréquence au repos."
      ],
      correctIndex: 0,
      points: 2,
      explanation: "Le sRPE (Durée x RPE) est l'un des outils de quantification de la charge interne les plus robustes et faciles à déployer."
    },
    {
      id: 'q3',
      title: "3. Ratio de charge aiguë / chronique (ACWR)",
      text: "Dans le concept d'ACWR (Acute:Chronic Workload Ratio), à quoi compare-t-on la charge de la semaine en cours (charge aiguë, ~7 jours) ?",
      options: [
        "Au record olympique de la discipline.",
        "À la moyenne des charges des 4 dernières semaines (charge chronique, ~28 jours).",
        "Au nombre de calories ingérées la veille.",
        "À la moyenne des charges de l'équipe adverse."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "L'ACWR compare la fatigue récente (derniers jours) au niveau de préparation et de tolérance développé sur les semaines précédentes."
    },
    {
      id: 'q4',
      title: "4. Suivi nutritionnel de terrain",
      text: "Quelle est la principale limite d'une application comme MyFitnessPal pour le suivi nutritionnel d'un athlète ?",
      options: [
        "L'application ne fonctionne que pour les végétariens.",
        "Les données reposent sur la saisie déclarative de l'athlète, ce qui induit fréquemment des sous-estimations ou des omissions.",
        "L'application pèse automatiquement les assiettes à distance sans intervention humaine.",
        "Les aliments sportifs ne figurent jamais dans la base de données."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "La saisie déclarative est sujette aux biais de sous-estimation et à la lassitude de l'athlète dans la durée."
    },
    {
      id: 'q5',
      title: "5. Boucle vertueuse de la collecte à l'analyse",
      text: "Pourquoi est-il inutile de collecter une multitude de données si elles ne sont pas analysées ni restituées aux sportifs ?",
      options: [
        "Parce que collecter sans agir crée de la lassitude, fait perdre du temps et n'apporte aucune plus-value à l'entraînement.",
        "Parce que la mémoire de l'ordinateur s'efface toutes les 48 heures.",
        "Parce que la loi interdit d'enregistrer plus de 3 séances.",
        "Parce que les sportifs préfèrent toujours courir sans savoir pourquoi."
      ],
      correctIndex: 0,
      points: 2,
      explanation: "La pertinence d'un suivi numérique réside dans la boucle de feedback : mesurer pour comprendre, et comprendre pour réguler l'entraînement."
    }
  ],

  '05-veille-recherche-scientifique': [
    {
      id: 'q1',
      title: "1. Outil NotebookLM dans la veille scientifique",
      text: "Quel est l'atout majeur de Google NotebookLM pour un préparateur physique souhaitant exploiter des articles de recherche (PDFs) ?",
      options: [
        "Il invente des références imaginaires pour impressionner le président du club.",
        "Il analyse et synthétise fidèlement les documents scientifiques téléversés en citant directement les passages sources, sans inventer d'informations extérieures.",
        "Il remplace les athlètes lors des compétitions officielles.",
        "Il traduit uniquement les textes en latin ancien."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "NotebookLM est ancré (grounded) sur vos propres sources documentaires, ce qui élimine les hallucinations et permet un accès rapide aux preuves scientifiques."
    },
    {
      id: 'q2',
      title: "2. Esprit critique face aux études scientifiques",
      text: "Un article vante une nouvelle méthode d'entraînement miraculeuse avec une augmentation de 40% de force en 2 semaines. Que doit vérifier le préparateur physique en priorité ?",
      options: [
        "La taille de l'échantillon, le niveau initial des participants, la présence d'un groupe contrôle et la réputation de la revue à comité de lecture.",
        "Le nombre de likes sur la page Instagram de l'auteur.",
        "La couleur de la police de caractères utilisée dans le PDF.",
        "Si l'article est imprimé sur du papier recyclé."
      ],
      correctIndex: 0,
      points: 2,
      explanation: "L'analyse critique méthodologique (échantillon, protocole, groupe témoin) est indispensable avant toute transposition sur ses propres athlètes."
    },
    {
      id: 'q3',
      title: "3. Recherche de littérature par IA (Consensus, Perplexity, PubMed)",
      text: "Comment utiliser l'IA de façon rigoureuse pour une question de préparation physique (ex: « Effet du froid après un match ») ?",
      options: [
        "Faire confiance au premier résultat sans ouvrir les articles originaux.",
        "Interroger des moteurs spécialisés appuyés sur des bases biomédicales (PubMed/Semantic Scholar) et remonter aux articles complets pour vérifier la méthodologie.",
        "Poser la question à un chatbot de divertissement sans connexion internet.",
        "Attendre que l'IA envoie un courrier postal à l'université."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "L'IA est un puissant accélérateur de recherche documentaire, mais la validation des sources primaires reste la responsabilité du préparateur physique."
    }
  ],

  '06-agents-ia-sport': [
    {
      id: 'q1',
      title: "1. Différence entre IA générative simple et Agent IA autonome",
      text: "Qu'est-ce qui caractérise un « Agent IA » par rapport à une simple interface de chat (ChatGPT basique) ?",
      options: [
        "Un agent IA possède une boucle d'action : il peut analyser une consigne, utiliser des outils (lire des fichiers, appeler des calculatrices, interroger des bases de données) et accomplir une suite de tâches de façon autonome.",
        "Un agent IA est obligatoirement un robot mécanique en métal qui marche dans le gymnase.",
        "Un agent IA ne répond qu'en anglais et coûte plusieurs millions d'euros.",
        "Un agent IA est uniquement disponible sur les consoles de jeux vidéo."
      ],
      correctIndex: 0,
      points: 2,
      explanation: "L'agent combine modèle de langage, mémoire, raisonnement et utilisation d'outils informatiques pour résoudre des tâches complexes en autonomie."
    },
    {
      id: 'q2',
      title: "2. Google Antigravity dans la préparation physique",
      text: "Pourquoi un préparateur physique a-t-il intérêt à concevoir des agents ou des micro-applications sur mesure avec Antigravity ?",
      options: [
        "Pour automatiser les tâches répétitives (nettoyage d'exports de montres, génération de bilans hebdomadaires personnalisés, alertes de surcharge) adaptées à sa propre méthodologie.",
        "Pour ne plus jamais avoir à parler à ses sportifs.",
        "Parce que c'est une obligation imposée par le ministère des finances.",
        "Pour remplacer complètement les séances de terrain par du code informatique."
      ],
      correctIndex: 0,
      points: 2,
      explanation: "La personnalisation permet d'adapter l'outil aux besoins spécifiques du club ou de la discipline plutôt que de subir les contraintes d'un logiciel générique."
    },
    {
      id: 'q3',
      title: "3. Éthique et protection des données sportives (RGPD)",
      text: "Lorsqu'un préparateur physique manipule des données physiologiques, médicales et GPS de ses athlètes, quelle précaution doit-il observer ?",
      options: [
        "Partager toutes les données sur les réseaux sociaux pour faire de la publicité.",
        "Garantir la confidentialité, l'anonymisation ou pseudonymisation, le stockage sécurisé et le consentement éclairé des sportifs conformément au RGPD.",
        "Vendre les données à des entreprises commerciales sans en informer les sportifs.",
        "Laisser les fichiers ouverts sur les ordinateurs partagés de la salle de musculation."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "Les données de santé et biométriques sont des données hautement sensibles soumises à une stricte protection juridique et éthique."
    }
  ]
}

const currentQuestions = computed(() => {
  return QUESTIONS_DB[props.moduleId] || []
})

const selectedAnswers = ref({})
const openAnswers = ref({})
const isSubmitted = ref(false)
const quizScore = ref(0)
const totalPoints = ref(0)
const percentage = ref(0)

onMounted(() => {
  userStore.syncFromStorage()
  totalPoints.value = currentQuestions.value.reduce((acc, q) => acc + q.points, 0)
  
  // Recharger d'éventuelles réponses précédentes de l'étudiant
  const user = userStore.currentUser
  if (user && userStore.quizAttempts) {
    const existing = [...userStore.quizAttempts].reverse().find(a => a.moduleId === props.moduleId && a.userEmail === user.email)
    if (existing && existing.answers) {
      existing.answers.forEach(ans => {
        if (ans.type === 'open') {
          openAnswers.value[ans.questionId] = String(ans.userAnswer || '')
        } else {
          selectedAnswers.value[ans.questionId] = Number(ans.userAnswer)
        }
      })
    }
  }
})

function submitQuiz() {
  let score = 0
  const answers = []

  currentQuestions.value.forEach(q => {
    if (q.type === 'open') {
      const studentText = (openAnswers.value[q.id] || '').trim()
      const words = studentText ? studentText.split(/\s+/).filter(Boolean).length : 0
      // Barème formatif : 2 pts si réflexion substantielle (>= 18 mots), 1 pt si amorce (>= 6 mots), 0 sinon
      const isSubstantive = words >= 18
      const earned = isSubstantive ? q.points : (words >= 6 ? 1 : 0)
      score += earned

      answers.push({
        questionId: q.id,
        questionText: q.text,
        type: 'open',
        userAnswer: studentText,
        isCorrect: isSubstantive,
        points: earned,
        maxPoints: q.points,
        explanation: q.explanation,
        openFeedback: `Réflexion analysée (${words} mots). Alignement avec les critères méthodologiques du cours.`
      })
    } else {
      const userAns = selectedAnswers.value[q.id]
      const isCorrect = userAns === q.correctIndex
      const earned = isCorrect ? q.points : 0
      score += earned

      answers.push({
        questionId: q.id,
        questionText: q.text,
        type: 'qcm',
        userAnswer: userAns,
        correctAnswer: q.correctIndex,
        isCorrect,
        points: earned,
        maxPoints: q.points,
        explanation: q.explanation
      })
    }
  })

  quizScore.value = score
  percentage.value = totalPoints.value > 0 ? Math.round((score / totalPoints.value) * 100) : 0
  isSubmitted.value = true

  // Enregistrement dans le store
  const user = userStore.currentUser
  userStore.saveQuizAttempt({
    userId: user ? user.id : 'guest',
    userName: user ? `${user.firstName} ${user.lastName}` : 'Étudiant invité',
    userEmail: user ? user.email : 'invite@hech.be',
    moduleId: props.moduleId,
    moduleTitle: props.moduleTitle,
    score,
    totalPoints: totalPoints.value,
    percentage: percentage.value,
    answers,
    evaluationType: 'formative'
  })
}

function resetQuiz() {
  selectedAnswers.value = {}
  openAnswers.value = {}
  isSubmitted.value = false
  quizScore.value = 0
}
</script>

<template>
  <div style="margin: 3rem 0; padding: 1.8rem; border-radius: 16px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); box-shadow: var(--tile-shadow);">
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-bottom: 1.2rem; border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 0.8rem;">
      <div>
        <span style="font-size: 0.82rem; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px;">
          🎯 Auto-évaluation formative
        </span>
        <h3 style="margin: 0.3rem 0 0 0; font-size: 1.25rem;">
          Quiz & Réflexion professionnelle : {{ moduleTitle || moduleId }}
        </h3>
      </div>
      <span style="font-size: 0.88rem; color: var(--vp-c-text-2);">
        {{ currentQuestions.length }} questions • {{ totalPoints }} points
      </span>
    </div>

    <div v-if="currentQuestions.length === 0" style="padding: 1rem; color: var(--vp-c-text-2);">
      Aucune question configurée pour ce module.
    </div>

    <div v-else>
      <div v-for="(q, index) in currentQuestions" :key="q.id" style="margin-bottom: 1.8rem; padding: 1.3rem; background: var(--vp-c-bg); border-radius: 10px; border: 1px solid var(--vp-c-divider);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem;">
          <h4 style="margin: 0; font-size: 1.05rem;">
            {{ q.title }}
          </h4>
          <span 
            :style="{
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: '12px',
              background: q.type === 'open' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(2, 132, 199, 0.12)',
              color: q.type === 'open' ? '#9333ea' : '#0284c7'
            }"
          >
            {{ q.type === 'open' ? '✍️ Question ouverte de réflexion' : '🔘 QCM' }} • {{ q.points }} pts
          </span>
        </div>

        <p style="margin: 0 0 0.9rem 0; font-size: 0.95rem; line-height: 1.55;">
          {{ q.text }}
        </p>

        <!-- Cas QCM standard -->
        <div v-if="q.type !== 'open'" style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label 
            v-for="(opt, optIdx) in q.options" 
            :key="optIdx"
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: isSubmitted ? 'default' : 'pointer',
              background: isSubmitted 
                ? (optIdx === q.correctIndex ? 'rgba(16, 185, 129, 0.15)' : (selectedAnswers[q.id] === optIdx ? 'rgba(239, 68, 68, 0.15)' : 'transparent'))
                : (selectedAnswers[q.id] === optIdx ? 'rgba(2, 132, 199, 0.1)' : 'transparent'),
              border: isSubmitted && optIdx === q.correctIndex ? '1px solid #10b981' : '1px solid transparent'
            }"
          >
            <input 
              type="radio" 
              :name="q.id" 
              :value="optIdx" 
              v-model="selectedAnswers[q.id]" 
              :disabled="isSubmitted"
            />
            <span style="font-size: 0.92rem;">{{ opt }}</span>
          </label>

          <div v-if="isSubmitted" style="margin-top: 0.8rem; padding: 0.7rem 1rem; background: var(--vp-c-bg-soft); border-radius: 6px; font-size: 0.88rem; line-height: 1.5;">
            <strong :style="{ color: selectedAnswers[q.id] === q.correctIndex ? '#10b981' : '#ef4444' }">
              {{ selectedAnswers[q.id] === q.correctIndex ? '✓ Réponse exacte' : '✗ Réponse inexacte' }}
            </strong> : {{ q.explanation }}
          </div>
        </div>

        <!-- Cas Question Ouverte de Réflexion -->
        <div v-else style="display: flex; flex-direction: column; gap: 0.6rem;">
          <textarea 
            v-model="openAnswers[q.id]"
            :disabled="isSubmitted"
            rows="5"
            :placeholder="q.placeholder || 'Rédigez votre analyse et votre réflexion ici...'"
            style="width: 100%; padding: 10px 12px; font-family: inherit; font-size: 0.92rem; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); resize: vertical; line-height: 1.5;"
          ></textarea>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; color: var(--vp-c-text-2);">
            <span>
              💡 <em>Exprimez votre raisonnement critique de futur préparateur physique.</em>
            </span>
            <span style="font-weight: 600;">
              {{ (openAnswers[q.id] || '').trim().split(/\s+/).filter(Boolean).length }} mots
            </span>
          </div>

          <!-- Affichage du feedback de la question ouverte après validation -->
          <div v-if="isSubmitted" style="margin-top: 0.8rem; padding: 1.1rem; background: var(--vp-c-bg-soft); border-radius: 8px; border-left: 4px solid #a855f7; font-size: 0.9rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
              <strong style="color: #9333ea; font-size: 0.95rem;">
                🎯 Grille de repères & Éléments clés attendus :
              </strong>
              <span :style="{ fontWeight: 700, color: (openAnswers[q.id] || '').trim().split(/\s+/).filter(Boolean).length >= 18 ? '#10b981' : '#f59e0b' }">
                {{ (openAnswers[q.id] || '').trim().split(/\s+/).filter(Boolean).length >= 18 ? '✓ Réflexion argumentée (+2 pts)' : ((openAnswers[q.id] || '').trim().split(/\s+/).filter(Boolean).length >= 6 ? '⚠️ Réflexion amorcée (+1 pt)' : '✗ Réponse vide (0 pt)') }}
              </span>
            </div>

            <p style="margin: 0.3rem 0 0.6rem 0; font-size: 0.88rem; color: var(--vp-c-text-2);">
              Vérifiez que votre réflexion personnelle a bien pris en compte les 4 critères professionnels suivants :
            </p>

            <ul style="margin: 0.4rem 0 0.8rem 1.2rem; padding: 0; line-height: 1.5; color: var(--vp-c-text-1);">
              <li v-for="(criterion, cIdx) in q.expectedCriteria" :key="cIdx" style="margin-bottom: 0.4rem;">
                {{ criterion }}
              </li>
            </ul>

            <div v-if="q.sampleAnswer" style="margin-top: 0.9rem; padding: 0.9rem; background: rgba(168, 85, 247, 0.08); border-radius: 6px; border: 1px dashed rgba(168, 85, 247, 0.35);">
              <div style="font-weight: 700; color: #7e22ce; margin-bottom: 0.3rem; font-size: 0.88rem;">
                💬 Exemple de réponse réflexive modèle :
              </div>
              <p style="margin: 0; font-size: 0.88rem; font-style: italic; line-height: 1.5; color: var(--vp-c-text-1);">
                « {{ q.sampleAnswer }} »
              </p>
            </div>

            <p style="margin: 0.8rem 0 0 0; font-size: 0.84rem; color: var(--vp-c-text-2);">
              ℹ️ <strong>Rappel :</strong> Vos réponses textuelles sont enregistrées dans votre dossier étudiant et accessibles par l'enseignant lors de l'évaluation finale.
            </p>
          </div>
        </div>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-top: 1.8rem;">
        <button 
          v-if="!isSubmitted" 
          @click="submitQuiz" 
          style="padding: 11px 24px; background: #0284c7; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: background 0.2s;"
        >
          Valider mes réponses
        </button>

        <div v-else style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
          <span style="font-size: 1.15rem; font-weight: 700;">
            Score formatif : <span :style="{ color: percentage >= 70 ? '#10b981' : '#f59e0b' }">{{ quizScore }} / {{ totalPoints }} ({{ percentage }}%)</span>
          </span>
          <button @click="resetQuiz" style="padding: 8px 16px; background: var(--vp-c-default-soft); border: 1px solid var(--vp-c-divider); border-radius: 6px; cursor: pointer; font-weight: 600;">
            🔄 Recommencer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
