# Plateforme Outils Informatiques pour Préparateurs Physiques (HECh)

Plateforme pédagogique et syllabus augmenté conçus pour le cours d'**Exploitation d'outils informatiques spécifiques** dispensé dans la **Spécialisation en Préparation Physique et Entraînement Sportif** à la Haute École Charlemagne (HECh, Fédération Wallonie-Bruxelles).

- 🌐 **Site en ligne** : [https://jeromefoguenne-eng.github.io/Plateforme-pr-parateur-physique/](https://jeromefoguenne-eng.github.io/Plateforme-pr-parateur-physique/)
- 👨‍🏫 **Enseignant** : Jérôme Foguenne
- 🎓 **Année académique** : 2026-2027

---

## 🎯 Organisation du Cours & Parcours Asynchrone

La plateforme est structurée en 8 modules thématiques et pratiques :

1. **00. Introduction** : La révolution des données dans le sport (passer du « je pense » au « je mesure », charge externe vs interne, réduction de l'imprévisibilité).
2. **01. Capteurs de terrain** : GNSS/GPS, LPS (balises UWB), accéléromètres & IMU, cellules photoélectriques, plateformes de force, encodeurs VBT, wattmètres, analyseurs de lactate. *(Exercice 01 : Quel capteur choisir ?)*
3. **02. Importation & Logiciels** : Formats bruts (`.fit`, `.csv`, `.gpx`, `.tcx`), limites d'Excel et panorama des plateformes spécialisées (Nolio, TrainingPeaks, WKO5, Intervals.icu, Kinovea, MyJumpLab). *(Exercice 02 : Quel outil pour quelle situation ?)*
4. **03. Structuration sous Excel** : Modélisation des bases de données sportives (Tidy Data), formules de calcul, références absolues (`$`), fonctions logiques et Tableaux Croisés Dynamiques (TCD). *(Exercice 03 : Collecte et structuration)*
5. **04. Outils de collecte personnalisés** : Fiches de terrain automatisées : score de Hooper, Session-RPE de Foster, ratio charge aiguë/chronique (ACWR), journal de bord. *(Exercice 04 : Créer ses propres outils)*
6. **05. Recherche scientifique & Décision** : Veille IA (PubMed, Consensus, Perplexity) et synthèse rigoureuse avec NotebookLM sans hallucination. *(Exercice 05 : De la donnée à la décision)*
7. **06. Agents & Applications IA** : Différence entre modèle génératif et agent autonome, conception de copilotes d'entraînement avec Google Antigravity. *(Exercice 06 : Application IA et agent pour préparateur physique)*
8. **07. Mission professionnelle intégrative** : Traitement complet d'un jeu de données de 6 semaines, conception de dashboard coach et prototypage mobile. *(Exercice 07 : Du terrain à la décision)*

---

## 💻 Développement Local & Mises à Jour

Cette plateforme est propulsée par [VitePress](https://vitepress.dev/). Chaque modification poussée sur la branche `main` déclenche un déploiement automatique sur GitHub Pages via GitHub Actions.

### Commandes utiles :

```bash
# Installation des dépendances
npm install

# Lancer le serveur de développement local
npm run docs:dev

# Compiler pour la production
npm run docs:build

# Prévisualiser la version de production en local
npm run docs:preview
```

---

## 📄 Licence & Droits

Contenus pédagogiques sous licence **Creative Commons Attribution - Pas d’Utilisation Commerciale - Partage dans les Mêmes Conditions 4.0 International (CC BY-NC-SA 4.0)**.
