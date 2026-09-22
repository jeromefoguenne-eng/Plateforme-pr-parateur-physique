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
      title: "1. Évolution de la posture du préparateur physique",
      text: "Quel changement fondamental résume le passage de la préparation physique traditionnelle à la préparation physique moderne assistée par les données ?",
      options: [
        "Le préparateur physique n'a plus besoin d'aller sur le terrain car l'ordinateur fait tout à sa place.",
        "Passer d'une approche exclusivement basée sur le ressenti (« je pense que l'athlète est fatigué ») à une approche objectivée et mesurée (« les indicateurs montrent une baisse de 15% de la vitesse »).",
        "L'obligation légale de faire signer une décharge informatique à chaque séance d'entraînement.",
        "Le remplacement définitif des séances de musculation par des sessions de simulation vidéo."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "L'arrivée des données permet d'objectiver l'entraînement, de réduire l'imprévisibilité et d'individualiser les charges de travail en s'appuyant sur des mesures observables."
    },
    {
      id: 'q2',
      title: "2. Charge externe vs Charge interne",
      text: "Laquelle de ces propositions illustre précisément une mesure de charge interne ?",
      options: [
        "La distance totale parcourue en mètres par un joueur mesurée par GPS.",
        "Le nombre de sprints réalisés au-dessus de 25 km/h.",
        "La fréquence cardiaque moyenne et la perception de l'effort (score RPE de Foster).",
        "Le tonnage total soulevé lors d'une séance de développé couché."
      ],
      correctIndex: 2,
      points: 2,
      explanation: "La charge externe correspond au travail mécanique imposé (distance, vitesse, tonnage), tandis que la charge interne correspond à la réponse psychophysiologique de l'organisme (FC, RPE, lactatémie)."
    },
    {
      id: 'q3',
      title: "3. Prévention des blessures et données",
      text: "Que démontrent les recherches scientifiques actuelles concernant la prédiction des blessures à l'aide des données GPS ?",
      options: [
        "Un algorithme GPS moderne peut prédire avec 99% de certitude le jour exact d'une blessure musculaire.",
        "Les données GPS ne servent à rien en préparation physique et ne doivent pas être collectées.",
        "Il n'existe aucun indicateur GPS unique prédisant de manière universelle les blessures ; les données sont des signaux d'alerte contextuels qui aident à réguler la charge.",
        "Seuls les joueurs ne portant pas de capteurs se blessent."
      ],
      correctIndex: 2,
      points: 2,
      explanation: "Les revues systématiques soulignent qu'un indicateur isolé ne peut être prédictif absolu. Les données réduisent l'imprévisibilité sans supprimer la complexité biologique."
    },
    {
      id: 'q4',
      title: "4. Individualisation de la charge",
      text: "Deux sportifs réalisent exactement la même séance d'endurance (10 km à 12 km/h). Pourquoi leurs réponses peuvent-elles être totalement différentes ?",
      options: [
        "Parce que l'un des deux a oublié de recharger sa montre.",
        "En raison de leurs caractéristiques individuelles (VMA, niveau de récupération, historique de blessures, profil physiologique).",
        "Parce que la charge externe était différente pour les deux coureurs.",
        "Parce que la météo change à chaque pas."
      ],
      correctIndex: 1,
      points: 2,
      explanation: "Une même charge externe peut représenter une contrainte physiologique modérée pour l'un et épuisante pour l'autre. Les outils numériques permettent de quantifier cette différence."
    },
    {
      id: 'q5',
      title: "5. Rôle du préparateur physique gestionnaire de données",
      text: "Dans le staff moderne, quelle est la position du préparateur physique vis-à-vis des données ?",
      options: [
        "Il est un simple technicien qui branche les câbles USB à la fin de la séance.",
        "Il devient un intermédiaire clé entre la récolte des données, l'analyse scientifique et la décision d'entraînement partagée avec le coach et le staff médical.",
        "Il doit garder toutes les données secrètes pour ne pas inquiéter les entraîneurs.",
        "Il doit systématiquement annuler les séances dès qu'un chiffre varie de 1%."
      ],
      correctIndex: 2,
      points: 2,
      explanation: "Le préparateur physique moderne participe à un système d'information partagé où la donnée éclaire la prise de décision conjointe."
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
const isSubmitted = ref(false)
const quizScore = ref(0)
const totalPoints = ref(0)
const percentage = ref(0)

onMounted(() => {
  userStore.syncFromStorage()
  totalPoints.value = currentQuestions.value.reduce((acc, q) => acc + q.points, 0)
})

function submitQuiz() {
  let score = 0
  const answers = []

  currentQuestions.value.forEach(q => {
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
          Quiz de validation : {{ moduleTitle || moduleId }}
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
      <div v-for="(q, index) in currentQuestions" :key="q.id" style="margin-bottom: 1.6rem; padding: 1.2rem; background: var(--vp-c-bg); border-radius: 10px; border: 1px solid var(--vp-c-divider);">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.05rem;">
          {{ q.title }}
        </h4>
        <p style="margin: 0 0 0.8rem 0; font-size: 0.95rem;">
          {{ q.text }}
        </p>

        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
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
        </div>

        <div v-if="isSubmitted" style="margin-top: 0.8rem; padding: 0.6rem 1rem; background: var(--vp-c-bg-soft); border-radius: 6px; font-size: 0.88rem;">
          <strong :style="{ color: selectedAnswers[q.id] === q.correctIndex ? '#10b981' : '#ef4444' }">
            {{ selectedAnswers[q.id] === q.correctIndex ? '✓ Réponse exacte' : '✗ Réponse inexacte' }}
          </strong> : {{ q.explanation }}
        </div>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem;">
        <button 
          v-if="!isSubmitted" 
          @click="submitQuiz" 
          style="padding: 10px 22px; background: #0284c7; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;"
        >
          Valider mes réponses
        </button>

        <div v-else style="display: flex; align-items: center; gap: 1.5rem;">
          <span style="font-size: 1.15rem; font-weight: 700;">
            Score final : <span :style="{ color: percentage >= 70 ? '#10b981' : '#f59e0b' }">{{ quizScore }} / {{ totalPoints }} ({{ percentage }}%)</span>
          </span>
          <button @click="resetQuiz" style="padding: 8px 16px; background: var(--vp-c-default-soft); border: 1px solid var(--vp-c-divider); border-radius: 6px; cursor: pointer;">
            🔄 Recommencer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
