---
title: "01. La Récolte de Données : Les Différents Capteurs"
description: "Panorama complet des technologies de mesure sur le terrain : GNSS, LPS, IMU, cellules photoélectriques, plateformes de force, VBT, wattmètres."
---

# 01. La Récolte de Données : Les Différents Capteurs

<div class="course-content justified-text">


Le préparateur physique dispose aujourd’hui d’un ensemble d’outils permettant de transformer des phénomènes physiologiques, biomécaniques ou comportementaux en données numériques. Ces données peuvent ensuite être stockées, visualisées, comparées et utilisées pour suivre l’évolution d’un sportif. Cette utilisation des technologies correspond directement aux compétences visées dans le profil de la spécialisation : maîtriser les outils d’évaluation et d’analyse de la performance, utiliser des appareillages adaptés et mesurer des paramètres biométriques, biomécaniques et physiologiques.


Point méthodologique essentiel : la précision affichée par un appareil n’est pas nécessairement sa validité. Un capteur peut mesurer au dixième près tout en donnant une valeur systématiquement éloignée de la réalité. Il faut donc distinguer résolution, précision, validité, fidélité et erreur de mesure.


## Les capteurs de fréquence cardiaque


Ce qu'ils mesurent : la fréquence cardiaque (FC) correspond au nombre de battements cardiaques par minute (bpm).


Elle permet notamment de suivre :

- la réponse cardiovasculaire à l'effort 
- l'intensité relative d'une séance 
- les zones d'entraînement 
- la récupération entre les efforts 
- la charge interne 

indirectement, certains indicateurs de récupération via les intervalles R-R et la variabilité de fréquence cardiaque (VFC/HRV).


Trois grandes technologies


La ceinture thoracique est généralement la référence pratique pour l'entraînement sportif. Elle mesure directement le signal électrique cardiaque, alors que les capteurs optiques déduisent la FC à partir des variations de volume sanguin.


Une étude comparant plusieurs dispositifs à un ECG a obtenu une concordance de 0,996 pour une ceinture thoracique, contre 0,92 pour une Apple Watch et 0,81 pour une Garmin testée. Les performances des capteurs optiques variaient également fortement selon le type d'exercice.


Pourquoi le poignet est-il moins fiable ?


Le signal PPG est perturbé par :

- les mouvements du bras 
- les vibrations 
- les contractions musculaires 
- un mauvais contact avec la peau 
- la transpiration 
- la vasoconstriction 

certaines activités avec mouvements brusques.


À retenir :


Pour suivre précisément la FC pendant un entraînement : ceinture thoracique > capteur optique au bras > capteur optique au poignet.


Pour la HRV, la ceinture thoracique est également préférable car elle permet d'obtenir les intervalles R-R, beaucoup plus informatifs qu'une simple fréquence cardiaque moyenne.


## 2.2. Les montres et systèmes GNSS/GPS

<div class="course-image-block">
  <img src="/images/illustration-capteurs-gps.jpg" alt="Tracking GPS et télémétrie sportive" class="course-img" loading="lazy" />
  <span class="img-caption">Figure 2 : Mesure de la charge externe : tracking GNSS haute fréquence (10–20 Hz) et accélérométrie triaxiale.</span>
</div>



Fonctionnement


Un récepteur GNSS reçoit les signaux de plusieurs satellites et estime la position du sportif dans l'espace.


Le déplacement entre deux positions permet de calculer :

- distance parcourue 
- vitesse 
- vitesse maximale 
- accélérations/décélérations 
- temps passé dans différentes zones de vitesse 
- nombre de sprints 
- charge externe 

trajectoire.


Les systèmes modernes utilisent plusieurs constellations : GPS, Galileo, GLONASS, BeiDou, etc. Le terme GNSS est donc plus exact que GPS.


L'importance de la fréquence d'échantillonnage


Un GPS 1 Hz mesure approximativement une position par seconde. Un système 10 Hz en mesure environ dix. Un système 15 Hz environ quinze. Plus la fréquence est élevée, mieux le système peut théoriquement suivre les changements rapides de mouvement. Mais « plus de Hz » ne signifie pas automatiquement « plus précis ».


Une revue consacrée au GPS dans les sports collectifs conclut que les systèmes 10 Hz présentent généralement une meilleure validité et fiabilité que les anciens systèmes 1 et 5 Hz ; l'avantage supplémentaire du 15 Hz n'est pas systématique.


Une étude comparant notamment des systèmes 10 et 15 Hz a trouvé une erreur typique d'environ 1,3 % pour la distance totale avec le 10 Hz, mais une augmentation de l'erreur lorsque la vitesse augmentait, pouvant atteindre près de 20 % selon la variable étudiée.


Limites


Le GPS est particulièrement problématique pour :

- les très courtes distances 
- les changements brusques de direction 
- les accélérations très rapides 
- les mouvements en intérieur 

les environnements avec bâtiments ou obstacles.


Pour un sprint court de 5 ou 10 m, une cellule photoélectrique est donc généralement beaucoup plus pertinente.


## 2.3. Les systèmes LPS — Local Positioning System


Les LPS constituent une alternative au GNSS, notamment en environnement intérieur.


Des antennes ou balises installées autour du terrain permettent de localiser un émetteur porté par le sportif.


Ils permettent notamment de mesurer :

- position 
- distance 
- vitesse 
- accélérations 
- trajectoires 

déplacements collectifs.


Ils peuvent être beaucoup plus adaptés que le GPS pour les salles ou les infrastructures couvertes.


Dans les études de validation, les systèmes LPS peuvent présenter une bonne précision, mais leurs performances dépendent fortement de la technologie et de l'installation. Une étude comparative a notamment obtenu de meilleurs résultats avec un LPS 20 Hz qu'avec des GPS 10 et 18 Hz pour plusieurs variables de déplacement.

<div class="video-tutorial-box" style="margin-top: 1.5rem; margin-bottom: 2rem;">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Vidéo de terrain — Section Paloise (Top 14) :</strong> <em>90 secondes pour comprendre le tracking et les systèmes de positionnement</em>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/wWZlUoZb_GQ" 
      title="90 secondes pour comprendre - Les systèmes de positionnement et GPS dans le sport professionnel" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">
    💡 <strong>Application en sport d'élite :</strong> Présentation par le staff professionnel de la Section Paloise Rugby de l'utilisation des capteurs de positionnement portés par les athlètes pour quantifier les distances, les accélérations et les impacts en temps réel.
    <br />
    <span style="display: inline-block; margin-top: 6px; font-size: 0.82rem; color: var(--vp-c-text-2);">
      📺 <a href="https://www.youtube.com/watch?v=wWZlUoZb_GQ" target="_blank" rel="noopener noreferrer">Visionner sur YouTube ↗</a>
      • ⏱️ Durée : ~1 min 30
    </span>
  </p>
</div>

## 2.4.Les accéléromètres et IMU


Une IMU (Inertial Measurement Unit) associe généralement :

- un accéléromètre 
- un gyroscope 

parfois un magnétomètre.


Accéléromètre


Il mesure les accélérations selon trois axes :


X – Y – Z


Il permet de détecter :

- changements de vitesse 
- impacts 
- sauts 
- mouvements rapides 
- changements de direction 

volume de mouvement.


Dans certains systèmes de suivi des sports collectifs, les accélérations enregistrées sont transformées en indicateurs comme le PlayerLoad ou la « charge mécanique ».


Gyroscope


Il mesure la vitesse de rotation du corps ou du segment.


Il permet notamment d'analyser :

- rotations 
- changements d'orientation 
- mouvements techniques 

mouvements articulaires.


Attention à la « charge » calculée


Un accéléromètre ne mesure pas directement la fatigue ou la charge d'entraînement.


Il mesure une accélération. Le logiciel applique ensuite un algorithme pour produire un indicateur de charge.


Capteur → donnée brute → algorithme → indicateur → interprétation


C'est une distinction fondamentale pour comprendre la numérisation de la performance.


Les revues scientifiques montrent que les capteurs inertiels sont particulièrement prometteurs pour l'analyse du mouvement, mais que leur validité dépend fortement du positionnement du capteur, de sa fixation, du mouvement étudié et de l'algorithme utilisé.

<div class="video-tutorial-box" style="margin-top: 1.5rem; margin-bottom: 2rem;">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Vidéo explicative — Prépa & Performance :</strong> <em>Les accéléromètres en préparation physique (Beast Sensor, Myotest, Flex GymAware...)</em>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/RvKWmdCro5Y?start=70" 
      title="Les accéléromètres en préparation physique - Beast Sensor, Myotest, Flex GymAware" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">
    💡 <strong>Analyse pratique et matérielle :</strong> Présentation détaillée du fonctionnement des accéléromètres triaxiaux et unités inertielles (IMU), des capteurs de référence du marché (Myotest, Beast, Flex) et des précautions indispensables à prendre concernant la fixation et l'interprétation des données de vitesse et de puissance.
    <br />
    <span style="display: inline-block; margin-top: 6px; font-size: 0.82rem; color: var(--vp-c-text-2);">
      📺 <a href="https://www.youtube.com/watch?v=RvKWmdCro5Y&t=70s" target="_blank" rel="noopener noreferrer">Visionner sur YouTube (début à 1 min 10s) ↗</a>
      • 🎙️ Chaîne : <em>Prépa & Performance</em>
    </span>
  </p>
</div>

## 2.5. Les cellules photoélectriques


Les cellules photoélectriques créent une barrière infrarouge.


Lorsque le sportif traverse la barrière, le faisceau est interrompu et le système enregistre le temps.


Elles permettent de mesurer

- temps sur 5 m 
- 10 m 
- 20 m 
- 30 m 
- vitesse moyenne 
- temps de passage 
- temps de réaction selon le dispositif 

parfois hauteur de saut.


Précision


Les systèmes peuvent avoir une résolution temporelle extrêmement fine, mais la précision réelle dépend du dispositif et du protocole.


Une revue systématique rapporte par exemple des erreurs typiques de l'ordre de 0,01 à 0,06 s dans certaines configurations de mesure de sprint. Elle montre également que les systèmes à double faisceau sont généralement plus fiables que les systèmes à faisceau unique pour éviter les déclenchements intempestifs provoqués par les bras ou les jambes.


Point important


Une cellule photoélectrique peut être excellente pour mesurer un sprint mais moins adaptée pour mesurer un saut vertical.


La littérature montre que les cellules présentent une bonne concordance avec les plateformes de force dans certaines conditions, mais ne doivent pas être considérées comme interchangeables avec une plateforme de force pour toutes les mesures de saut.

<div class="video-tutorial-box" style="margin-top: 1.5rem; margin-bottom: 2rem;">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Démonstration terrain :</strong> <em>Fonctionnement et chronométrage par cellules photoélectriques infrarouges</em>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/12uuli0UvS0" 
      title="Démonstration du système de chronométrage par cellules photoélectriques" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">
    💡 <strong>Chronométrage électronique de précision :</strong> Démonstration pratique du franchissement de faisceau infrarouge par cellule photoélectrique et de la transmission instantanée du temps de passage au boîtier récepteur pour les tests de vitesse et d'accélération.
    <br />
    <span style="display: inline-block; margin-top: 6px; font-size: 0.82rem; color: var(--vp-c-text-2);">
      📺 <a href="https://www.youtube.com/watch?v=12uuli0UvS0" target="_blank" rel="noopener noreferrer">Visionner sur YouTube ↗</a>
    </span>
  </p>
</div>

## 2.6. Les plateformes de force

<div class="course-image-block">
  <img src="/images/illustration-force-plate.jpg" alt="Plateforme de force et profil Force-Vitesse" class="course-img" loading="lazy" />
  <span class="img-caption">Figure 3 : Évaluation neuromusculaire sur plateforme de force biaxiale (CMJ, RSI-modifié et asymétries).</span>
</div>



La plateforme de force mesure les forces exercées sur le sol.


Elle utilise des cellules de charge qui transforment une force mécanique en signal électrique, ensuite numérisé.


Elle permet notamment de mesurer


Lors d'un Countermovement Jump (CMJ) :

- force maximale 
- force moyenne 
- impulsion 
- vitesse 
- puissance 
- temps jusqu'au décollage 
- hauteur de saut 
- phase excentrique 
- phase concentrique 
- taux de développement de la force 

asymétries droite/gauche.


Elle permet donc d'obtenir beaucoup plus d'informations qu'une simple hauteur de saut.


Précision


Les plateformes professionnelles fonctionnent généralement avec des fréquences d'échantillonnage très élevées, souvent de l'ordre de 1000 Hz ou davantage.


Une étude comparant différentes fréquences d'échantillonnage montre que, pour certaines variables du CMJ, passer de 500 à 200 Hz ne modifie que faiblement les résultats, alors que l'erreur augmente fortement à 100 Hz et surtout 50 ou 25 Hz.


Une autre étude comparant une plateforme portable à une plateforme de laboratoire a trouvé une erreur relative moyenne d'environ 1,7 %, avec des limites plus importantes pour certaines variables comme la hauteur de saut ou le temps jusqu'au décollage.


C'est donc l'un des outils les plus complets pour analyser les qualités neuromusculaires.

<div class="video-tutorial-box" style="margin-top: 1.5rem; margin-bottom: 2rem;">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Vidéo explicative — Matériel & Test :</strong> <em>WIITest — Plateforme multimodale de test de force</em>
  </div>
  <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; padding: 0.75rem; background: rgba(0, 0, 0, 0.03); border-radius: 8px; border: 1px solid var(--vp-c-divider);">
    <a href="https://www.youtube.com/watch?v=u9CiOA5Rbso" target="_blank" rel="noopener noreferrer" style="flex-shrink: 0; position: relative; display: block; border-radius: 6px; overflow: hidden; max-width: 180px;">
      <img src="/images/videos/video-plateforme-force.jpg" alt="Vignette WIITest plateforme de force" style="width: 100%; height: auto; display: block; border-radius: 6px; object-fit: cover;" />
      <span style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.35); color: #fff; font-size: 1.5rem; transition: background 0.2s;">▶</span>
    </a>
    <div style="font-size: 0.9rem; line-height: 1.45;">
      <strong>Plateforme de force portable WIITest</strong><br />
      <span style="color: var(--vp-c-text-2); font-size: 0.85rem;">Démonstration en conditions réelles de l'évaluation neuromusculaire, de la cinétique des sauts (CMJ, SJ) et de l'analyse des asymétries d'appui.</span><br />
      <a href="https://www.youtube.com/watch?v=u9CiOA5Rbso" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 4px; font-size: 0.82rem; font-weight: 600;">Ouvrir sur YouTube ↗</a>
    </div>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/u9CiOA5Rbso" 
      title="WIITest : plateforme multimodale de test de force" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">
    💡 <strong>Application terrain :</strong> Illustration concrète de l'utilisation d'une plateforme de force portable pour quantifier la production de force dynamique, la vitesse de développement de la force (RFD) et le suivi de l'état de fraîcheur neuromusculaire.
    <br />
    <span style="display: inline-block; margin-top: 6px; font-size: 0.82rem; color: var(--vp-c-text-2);">
      📺 <a href="https://www.youtube.com/watch?v=u9CiOA5Rbso" target="_blank" rel="noopener noreferrer">Visionner sur YouTube ↗</a>
      • 🔬 Thématique : <em>Évaluation de la force & sauts verticaux</em>
    </span>
  </p>
</div>

## 2.7. Les dynamomètres


Il existe plusieurs formes de dynamométrie.


Dynamomètre portatif


Le préparateur place un capteur entre le sportif et un point fixe ou exerce une résistance.


Il permet notamment de mesurer :

- force maximale isométrique 
- force des quadriceps 
- ischio-jambiers 
- abducteurs/adducteurs 
- muscles de l'épaule 

asymétries.


Les dynamomètres portatifs présentent généralement une bonne fiabilité lorsqu'un protocole standardisé et une fixation adaptée sont utilisés. Une méta-analyse récente conclut à une bonne à excellente validité pour plusieurs mesures des membres inférieurs, mais souligne l'influence de l'examinateur et du protocole.


Dynamomètre isocinétique


C'est un matériel beaucoup plus sophistiqué.


Il contrôle la vitesse du mouvement et mesure :

- couple de force 
- force 
- travail 
- puissance 
- ratios agoniste/antagoniste 

asymétries.


Il constitue une référence pour certaines évaluations de force, mais son coût et son encombrement limitent son utilisation quotidienne.

<div class="video-tutorial-box" style="margin-top: 1.5rem; margin-bottom: 2rem;">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Vidéo explicative — Matériel & Pratique :</strong> <em>Dynamomètre musculaire connecté K-Force (Kinvent)</em>
  </div>
  <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; padding: 0.75rem; background: rgba(0, 0, 0, 0.03); border-radius: 8px; border: 1px solid var(--vp-c-divider);">
    <a href="https://www.youtube.com/watch?v=jHEp0Ys9J2o" target="_blank" rel="noopener noreferrer" style="flex-shrink: 0; position: relative; display: block; border-radius: 6px; overflow: hidden; max-width: 180px;">
      <img src="/images/videos/video-dynamometre.jpg" alt="Vignette dynamomètre K-Force" style="width: 100%; height: auto; display: block; border-radius: 6px; object-fit: cover;" />
      <span style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.35); color: #fff; font-size: 1.5rem; transition: background 0.2s;">▶</span>
    </a>
    <div style="font-size: 0.9rem; line-height: 1.45;">
      <strong>Dynamométrie portative connectée</strong><br />
      <span style="color: var(--vp-c-text-2); font-size: 0.85rem;">Utilisation d'un dynamomètre électronique portatif pour évaluer la force isométrique maximale, les déficits bilatéraux et le monitoring de réathlétisation.</span><br />
      <a href="https://www.youtube.com/watch?v=jHEp0Ys9J2o" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 4px; font-size: 0.82rem; font-weight: 600;">Ouvrir sur YouTube ↗</a>
    </div>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/jHEp0Ys9J2o" 
      title="Dynamomètre musculaire K-Force" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">
    💡 <strong>Application terrain :</strong> Présentation du dynamomètre portatif connecté en pratique sportive et kinésithérapie, illustrant la fixation du capteur, le retour biofeedback en direct et l'analyse objective de la force maximale.
    <br />
    <span style="display: inline-block; margin-top: 6px; font-size: 0.82rem; color: var(--vp-c-text-2);">
      📺 <a href="https://www.youtube.com/watch?v=jHEp0Ys9J2o" target="_blank" rel="noopener noreferrer">Visionner sur YouTube ↗</a>
      • 🔬 Thématique : <em>Dynamométrie musculaire & asymétries</em>
    </span>
  </p>
</div>

## 2.9. Les radars de vitesse


Le radar fonctionne grâce à l'effet Doppler.


Il envoie une onde électromagnétique vers le sportif ; le déplacement de celui-ci modifie la fréquence de l'onde réfléchie.


Il peut mesurer :

- vitesse instantanée 
- vitesse maximale 
- profil d'accélération 

parfois décélération selon le système.


Il est particulièrement intéressant pour :

- sprint 
- sports de terrain 
- lancer 

sports de balle.


Il constitue notamment une technologie de référence utilisée dans certaines validations des systèmes GPS/LPS.

<div class="video-tutorial-box" style="margin-top: 1.5rem; margin-bottom: 2rem;">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Vidéo explicative — Matériel & Pratique :</strong> <em>Radar de vitesse Doppler multi-sport</em>
  </div>
  <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; padding: 0.75rem; background: rgba(0, 0, 0, 0.03); border-radius: 8px; border: 1px solid var(--vp-c-divider);">
    <a href="https://www.youtube.com/watch?v=HVZUaZzGpzs" target="_blank" rel="noopener noreferrer" style="flex-shrink: 0; position: relative; display: block; border-radius: 6px; overflow: hidden; max-width: 180px;">
      <img src="/images/videos/video-radar-vitesse.jpg" alt="Vignette radar de vitesse multi-sport" style="width: 100%; height: auto; display: block; border-radius: 6px; object-fit: cover;" />
      <span style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.35); color: #fff; font-size: 1.5rem; transition: background 0.2s;">▶</span>
    </a>
    <div style="font-size: 0.9rem; line-height: 1.45;">
      <strong>Multi Sport Speed Radar Detector</strong><br />
      <span style="color: var(--vp-c-text-2); font-size: 0.85rem;">Mesure instantanée de la vitesse de déplacement et de lancer sans contact par effet Doppler, adaptée aux sprints et aux gestes sportifs explosifs.</span><br />
      <a href="https://www.youtube.com/watch?v=HVZUaZzGpzs" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 4px; font-size: 0.82rem; font-weight: 600;">Ouvrir sur YouTube ↗</a>
    </div>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/HVZUaZzGpzs" 
      title="Multi Sport Speed Radar Detector - Measure speed" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">
    💡 <strong>Application terrain :</strong> Mise en œuvre d'un radar de vitesse Doppler sur le terrain pour mesurer la vitesse maximale de course, l'accélération et le retour immédiat à l'athlète lors des séances de vitesse.
    <br />
    <span style="display: inline-block; margin-top: 6px; font-size: 0.82rem; color: var(--vp-c-text-2);">
      📺 <a href="https://www.youtube.com/watch?v=HVZUaZzGpzs" target="_blank" rel="noopener noreferrer">Visionner sur YouTube ↗</a>
      • 🔬 Thématique : <em>Cinématique de sprint & vitesse de balle</em>
    </span>
  </p>
</div>


## 2.10. Les wattmètres


Principalement utilisés en cyclisme, les capteurs de puissance mesurent le couple appliqué sur un élément de la transmission et combinent cette information avec la vitesse de rotation.


Fondamentalement :


Puissance = couple × vitesse angulaire


Ils permettent de mesurer :

- puissance instantanée 
- puissance moyenne 
- puissance normalisée 
- puissance maximale 
- travail 
- cadence 
- charge d'entraînement 

puissance relative en W/kg.


Précision


Il faut être prudent avec l'idée selon laquelle « un wattmètre est précis à ±X % ».


La littérature montre que la validité dépend notamment :

- du type de wattmètre 
- du niveau de puissance 
- de la cadence 
- du couple 
- de la température 
- des vibrations 
- de la position 

du protocole de calibration.


Une revue de 74 études souligne justement que l'exactitude, la répétabilité, la reproductibilité, la sensibilité et la robustesse sont des propriétés différentes à examiner.

<div class="video-tutorial-box" style="margin-top: 1.5rem; margin-bottom: 2rem;">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Vidéo explicative — Matériel & Pratique :</strong> <em>GCN en Français — Faut-il un capteur de puissance d'un ou deux côtés ?</em>
  </div>
  <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; padding: 0.75rem; background: rgba(0, 0, 0, 0.03); border-radius: 8px; border: 1px solid var(--vp-c-divider);">
    <a href="https://www.youtube.com/watch?v=Fy1t_djHC-g&t=48s" target="_blank" rel="noopener noreferrer" style="flex-shrink: 0; position: relative; display: block; border-radius: 6px; overflow: hidden; max-width: 180px;">
      <img src="/images/videos/video-wattmetre.jpg" alt="Vignette GCN capteurs de puissance et wattmètres" style="width: 100%; height: auto; display: block; border-radius: 6px; object-fit: cover;" />
      <span style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.35); color: #fff; font-size: 1.5rem; transition: background 0.2s;">▶</span>
    </a>
    <div style="font-size: 0.9rem; line-height: 1.45;">
      <strong>Capteurs de puissance unilatéraux vs bilatéraux</strong><br />
      <span style="color: var(--vp-c-text-2); font-size: 0.85rem;">Explication claire des différences techniques entre mesure unilatérale (manivelle gauche x 2) et bilatérale (pédales/étoile), impact des asymétries de pédalage et fiabilité des watts.</span><br />
      <a href="https://www.youtube.com/watch?v=Fy1t_djHC-g&t=48s" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 4px; font-size: 0.82rem; font-weight: 600;">Ouvrir sur YouTube (dès 48s) ↗</a>
    </div>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/Fy1t_djHC-g?start=48" 
      title="Faut-il un capteur de puissance d'un ou deux côtés ? - GCN en Français" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">
    💡 <strong>Application terrain :</strong> Guide comparatif très pragmatique pour comprendre comment le choix d'un wattmètre (mesure gauche seule contre mesure indépendante gauche/droite) modifie la précision des indicateurs de charge (puissance normalisée, TSS) selon les profils d'asymétrie du cycliste.
    <br />
    <span style="display: inline-block; margin-top: 6px; font-size: 0.82rem; color: var(--vp-c-text-2);">
      📺 <a href="https://www.youtube.com/watch?v=Fy1t_djHC-g&t=48s" target="_blank" rel="noopener noreferrer">Visionner sur YouTube (début à 48s) ↗</a>
      • 🎙️ Chaîne : <em>GCN en Français</em>
    </span>
  </p>
</div>

## 2.11. Les analyseurs de lactate


Le préparateur peut utiliser un petit analyseur portable.


Fonctionnement

- prélèvement d'une petite goutte de sang 
- dépôt sur une bandelette 
- réaction électrochimique 

conversion en concentration numérique.


La valeur est généralement exprimée en mmol/L.


Cela permet d'étudier :

- réponse métabolique à l'exercice 
- cinétique du lactate 
- seuils 
- récupération 

réponse à différentes intensités.


Une revue systématique récente rapporte pour plusieurs analyseurs portables des corrélations de 0,95 à 0,99, des ICC > 0,90 et des CV < 5 %, tout en soulignant l'existence de biais systématiques à certaines concentrations élevées.

<div class="video-tutorial-box" style="margin-top: 1.5rem; margin-bottom: 2rem;">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Vidéo explicative — Physiologie & Mesure :</strong> <em>PEP'S-SPORT — Comment expliquer le lactate et la lactatémie ?</em>
  </div>
  <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; padding: 0.75rem; background: rgba(0, 0, 0, 0.03); border-radius: 8px; border: 1px solid var(--vp-c-divider);">
    <a href="https://www.youtube.com/watch?v=xuLDDLBpECQ" target="_blank" rel="noopener noreferrer" style="flex-shrink: 0; position: relative; display: block; border-radius: 6px; overflow: hidden; max-width: 180px;">
      <img src="/images/videos/video-lactate.jpg" alt="Vignette PEP'S-SPORT explication lactate et lactatémie" style="width: 100%; height: auto; display: block; border-radius: 6px; object-fit: cover;" />
      <span style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.35); color: #fff; font-size: 1.5rem; transition: background 0.2s;">▶</span>
    </a>
    <div style="font-size: 0.9rem; line-height: 1.45;">
      <strong>Lactate et lactatémie à l'effort</strong><br />
      <span style="color: var(--vp-c-text-2); font-size: 0.85rem;">Comprendre la production et la clairance du lactate, la démystification du rôle de « déchet métabolique », l'intérêt du prélèvement capillaire et la détermination des seuils ventilatoires et lactiques.</span><br />
      <a href="https://www.youtube.com/watch?v=xuLDDLBpECQ" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 4px; font-size: 0.82rem; font-weight: 600;">Ouvrir sur YouTube ↗</a>
    </div>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/xuLDDLBpECQ" 
      title="COMMENT EXPLIQUER LE LACTATE ET LA LACTATEMIE - PEP'S-SPORT" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">
    💡 <strong>Application terrain :</strong> Guide physiologique et méthodologique pour interpréter les concentrations sanguines de lactate (mmol/L) obtenues avec un analyseur portable (Lactate Pro, Lactate Scout), définir les intensités d'entraînement cibles et optimiser la cinétique de récupération.
    <br />
    <span style="display: inline-block; margin-top: 6px; font-size: 0.82rem; color: var(--vp-c-text-2);">
      📺 <a href="https://www.youtube.com/watch?v=xuLDDLBpECQ" target="_blank" rel="noopener noreferrer">Visionner sur YouTube ↗</a>
      • 🎙️ Chaîne : <em>PEP'S-SPORT</em>
    </span>
  </p>
</div>

## 2.12. Les balances et systèmes d'analyse corporelle


Balance classique


Elle permet simplement de mesurer :


masse corporelle → kg


Sa précision instrumentale peut être très élevée, mais l'information physiologique reste limitée : le poids ne distingue pas muscle, graisse, eau, glycogène, etc.


Impédancemètre — BIA


La bio-impédancemétrie fait circuler un courant électrique de très faible intensité dans le corps et mesure son opposition au passage du courant.


Elle permet d'estimer :

- masse grasse 
- masse maigre 
- eau corporelle 

parfois masse musculaire segmentaire.


Mais il s'agit d'une estimation indirecte.


Les résultats sont influencés par :

- hydratation 
- alimentation 
- exercice récent 
- température 
- position 
- appareil 

équation utilisée.


Chez les sportifs, une méta-analyse montre que la BIA peut être fortement corrélée à la DXA tout en présentant des limites d'accord trop importantes pour considérer les deux méthodes comme interchangeables.


Une forte corrélation ne signifie donc pas nécessairement une bonne précision individuelle.

<div class="video-tutorial-box" style="margin-top: 1.5rem; margin-bottom: 2rem;">
  <div class="video-tutorial-header">
    <span class="video-icon">🎬</span>
    <strong>Vidéo explicative — Précision & Validation :</strong> <em>Martin Turgeon Services Cyclistes — Les balances intelligentes sont-elles précises ? (Garmin Index vs DEXA Scan)</em>
  </div>
  <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; padding: 0.75rem; background: rgba(0, 0, 0, 0.03); border-radius: 8px; border: 1px solid var(--vp-c-divider);">
    <a href="https://www.youtube.com/watch?v=ufCcXdU_8jw" target="_blank" rel="noopener noreferrer" style="flex-shrink: 0; position: relative; display: block; border-radius: 6px; overflow: hidden; max-width: 180px;">
      <img src="/images/videos/video-balance-impedancemetre.jpg" alt="Vignette comparaison balance intelligente Garmin Index vs DEXA Scan" style="width: 100%; height: auto; display: block; border-radius: 6px; object-fit: cover;" />
      <span style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.35); color: #fff; font-size: 1.5rem; transition: background 0.2s;">▶</span>
    </a>
    <div style="font-size: 0.9rem; line-height: 1.45;">
      <strong>Bio-impédancemétrie vs DEXA Scan de laboratoire</strong><br />
      <span style="color: var(--vp-c-text-2); font-size: 0.85rem;">Test comparatif de terrain d'une balance connectée à impédance (Garmin Index) face au standard de référence DEXA (absorptiométrie bi-photonique). Analyse des écarts réels sur la masse grasse et l'eau corporelle.</span><br />
      <a href="https://www.youtube.com/watch?v=ufCcXdU_8jw" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 4px; font-size: 0.82rem; font-weight: 600;">Ouvrir sur YouTube ↗</a>
    </div>
  </div>
  <div class="video-responsive-wrapper">
    <iframe 
      src="https://www.youtube-nocookie.com/embed/ufCcXdU_8jw" 
      title="Les balances intelligentes sont-elles précises? (Garmin Index vs DEXA Scan)" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="video-caption">
    💡 <strong>Application terrain :</strong> Confrontation concrète démontrant pourquoi une balance à bio-impédance grand public (BIA) doit être interprétée avec recul : si le suivi de tendance relative reste utile, l'estimation absolue de la masse grasse et musculaire est sujette à d'importants biais comparée au scanner DEXA de référence.
    <br />
    <span style="display: inline-block; margin-top: 6px; font-size: 0.82rem; color: var(--vp-c-text-2);">
      📺 <a href="https://www.youtube.com/watch?v=ufCcXdU_8jw" target="_blank" rel="noopener noreferrer">Visionner sur YouTube ↗</a>
      • 🎙️ Chaîne : <em>Martin Turgeon Services Cyclistes</em>
    </span>
  </p>
</div>

## 2.13. Les smartphones et la vidéo


Un smartphone constitue également un instrument de mesure numérique.


Avec une caméra suffisamment rapide, on peut analyser :

- technique de course 
- angle articulaire 
- amplitude 
- temps de contact 
- temps de vol 
- hauteur de saut 
- vitesse 
- posture 
- trajectoire de la barre 

technique d'exécution.


Des applications peuvent transformer une vidéo en données quantitatives.


Mais il faut distinguer :


vidéo → extraction d'un événement → calcul → donnée


de la mesure directe réalisée par une plateforme de force ou une cellule photoélectrique.


Une étude récente sur les systèmes de mesure du CMJ montre par exemple que les différences entre plateforme de force, smartphone et capteur inertiel peuvent dépendre autant de la méthode de calcul que de la détection de l'événement lui-même.


## 2.14. Les outils de récupération et de sommeil


Les montres et bracelets connectés peuvent également fournir :

- durée du sommeil 
- fréquence cardiaque nocturne 
- HRV 
- fréquence respiratoire 
- température cutanée selon les modèles 
- estimation des phases de sommeil 

activité quotidienne.


Il faut cependant être particulièrement prudent avec les variables dérivées.


Par exemple :


Le capteur mesure un signal physiologique → un algorithme identifie des événements → un modèle statistique estime un stade de sommeil → l'application affiche « sommeil profond ».


Le préparateur physique ne doit donc pas confondre mesure directe et estimation algorithmique.

---

## 📊 Tableau récapitulatif des principaux capteurs et outils numériques

> [!NOTE] Légende de la fiabilité des données
> **★★★★★** = Très élevée · **★★★★☆** = Élevée · **★★★☆☆** = Moyenne à élevée · **★★☆☆☆** = Limitée · **★☆☆☆☆** = Faible pour une mesure individuelle précise.  
> *Remarque : La fiabilité dépend toutefois du modèle, du protocole, du placement du capteur et de la variable étudiée.*

| Capteur / outil | Données mesurées | Quand l'utiliser principalement ? | Sports principaux | Fiabilité des données |
| :--- | :--- | :--- | :--- | :--- |
| **Ceinture cardio thoracique (électrique)** | FC, intervalles R-R, HRV | Suivi de l'intensité, récupération, charge interne | Tous sports d'endurance et sports collectifs | ★★★★★ Très élevée |
| **Capteur cardio optique au bras (PPG)** | FC | Entraînement et suivi quotidien lorsque la ceinture est gênante | Course, cyclisme, fitness, sports collectifs | ★★★★☆ Élevée |
| **Montre cardio optique au poignet (PPG)** | FC, parfois HRV | Suivi quotidien, entraînement général | Tous sports | ★★★☆☆ Moyenne à élevée ; plus sensible aux mouvements |
| **GPS / GNSS 10–15 Hz** | Distance, vitesse, vitesse max., accélérations, décélérations, déplacements | Quantifier la charge externe et les déplacements | Football, rugby, hockey, sports collectifs, course, cyclisme | ★★★★☆ Élevée pour les déplacements ; moins fiable sur les très courtes distances et changements brusques |
| **LPS (Local Positioning System)** | Position, distance, vitesse, accélérations, trajectoires | Suivi précis en intérieur ou sur terrain équipé | Football, rugby, basket, hockey, sports collectifs | ★★★★☆ à ★★★★★ Très élevée |
| **Accéléromètre / IMU** | Accélérations 3D, impacts, mouvements | Quantifier les mouvements, impacts et charges mécaniques | Sports collectifs, sports de contact, athlétisme | ★★★☆☆ à ★★★★☆ selon le placement et l'algorithme |
| **Gyroscope** | Vitesses et rotations angulaires | Analyse des rotations et mouvements corporels | Sports collectifs, gymnastique, sports de combat, rééducation | ★★★★☆ Élevée pour les mouvements rotatoires |
| **Cellules photoélectriques** | Temps de passage, temps de sprint, vitesse moyenne | Tests de sprint et de vitesse | Athlétisme, football, rugby, sports collectifs | ★★★★★ Très élevée |
| **Plateforme de force** | Force, impulsion, puissance, RFD, temps de contact, hauteur de saut, asymétries | Évaluation neuromusculaire et tests de saut | Tous sports, particulièrement sports de puissance | ★★★★★ Très élevée |
| **Dynamomètre manuel** | Force isométrique | Tests de force et comparaison droite/gauche | Tous sports, réathlétisation | ★★★★☆ Élevée si protocole standardisé |
| **Dynamomètre isocinétique** | Force, couple, puissance, travail, ratios musculaires | Évaluation approfondie de la force musculaire | Réathlétisation, sports de haut niveau | ★★★★★ Très élevée |
| **LPT / capteur de vitesse de barre** | Vitesse, déplacement, puissance de la barre | Contrôle de l'intensité et de la fatigue en musculation (VBT) | Musculation, haltérophilie, sports de force | ★★★★☆ Élevée |
| **Radar Doppler** | Vitesse instantanée et vitesse maximale | Sprint, course, déplacement d'un objet | Athlétisme, football, rugby, tennis, sports de balle | ★★★★☆ à ★★★★★ Très élevée |
| **Wattmètre** | Puissance, travail, cadence | Mesure et contrôle de l'intensité externe | Cyclisme principalement, parfois aviron | ★★★★☆ Élevée à très élevée |
| **Analyseur de lactate** | Lactatémie (mmol/L) | Tests d'effort, détermination des seuils, suivi métabolique | Cyclisme, course, triathlon, sports d'endurance | ★★★★☆ Élevée |
| **BIA / impédancemètre** | Masse grasse, masse maigre, eau corporelle (estimations) | Suivi de composition corporelle | Tous sports | ★★☆☆☆ à ★★★☆☆ ; estimation indirecte |
| **Caméra / smartphone** | Angles, trajectoires, temps de vol/contact, technique | Analyse technique et biomécanique | Tous sports | ★★★☆☆ à ★★★★☆ selon application et protocole |
| **Montre/bracelet de sommeil** | Durée du sommeil, FC, HRV, sommeil estimé | Suivi de récupération et sommeil | Tous sports | ★★★☆☆ ; certaines données sont des estimations algorithmiques |
| **Balance numérique** | Masse corporelle | Suivi du poids et évolution de la masse | Tous sports | ★★★★★ pour la masse corporelle, mais information physiologique limitée |

</div>

## 🎯 Auto-évaluation formative

<ClientOnly>
  <QuizBox moduleId="01-capteurs" moduleTitle="Capteurs & Données de Terrain" />
</ClientOnly>

## 🏋️‍♂️ Travail pratique associé

<ClientOnly>
  <ExerciseBox 
    exerciseId="exercice-01" 
    exerciseTitle="Exercice 01 — Quel capteur choisir ?" 
    googleDriveLink="https://drive.google.com/drive/folders/1w7P6L2P2kK5M6e3p-example-ex1" 
    description="À partir de 10 situations professionnelles concrètes, sélectionnez le capteur de mesure le plus pertinent pour recueillir une donnée utile à la préparation physique et justifiez rigoureusement votre choix." 
  />
</ClientOnly>
