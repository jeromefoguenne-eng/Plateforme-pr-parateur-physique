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


## 2.6. Les plateformes de force


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


À retenir pour les étudiants


On peut regrouper les outils en 5 grandes familles :


Tableau récapitulatif des principaux capteurs et outils numériques du préparateur physique


Légende de la fiabilité :
★★★★★ = très élevée · ★★★★☆ = élevée · ★★★☆☆ = moyenne à élevée · ★★☆☆☆ = limitée · ★☆☆☆☆ = faible pour une mesure individuelle précise.
La fiabilité dépend toutefois du modèle, du protocole, du placement du capteur et de la variable étudiée.

- Les applications de récolte de données :

Strava


Intervals


Myfitnesspal


My jumplab


Mysprint


Nolio


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
