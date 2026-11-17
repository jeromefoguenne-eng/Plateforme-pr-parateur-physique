# Politique de Sécurité — Plateforme Préparateur Physique (HECh)

## 1. Engagements et Principes de Cybersécurité

La plateforme pédagogique du cours *« Outils informatiques au service du préparateur physique »* (HECh) intègre des contrôles rigoureux de sécurité applicative (AppSec) et de durcissement opérationnel (DevSecOps) :

1. **Architecture Zero-Trust & Moindre Privilège** :
   - Les workflows GitHub Actions s'exécutent avec des permissions restreintes (`permissions: {}` globales, `contents: read` pour le build, `pages: write` uniquement pour le déploiement).
   - Les communications avec le backend Google Apps Script sont strictement limitées au protocole HTTPS et aux domaines vérifiés `script.google.com`.

2. **Défense en Profondeur contre le XSS (Cross-Site Scripting)** :
   - Aucun contenu HTML brut ou non vérifié n'est injecté dans le DOM.
   - Le moteur de prévisualisation des devoirs (`docx`) utilise un parseur DOM avec liste blanche stricte d'éléments sûrs (`p`, `table`, `strong`, `h1`-`h6`...) et suppression systématique de tous les gestionnaires d'événements (`on*`), scripts (`<script>`, `<iframe>`, `<object>`) et schémas d'URL malveillants (`javascript:`, `data:`).

3. **Protection contre l'Upload de Fichiers Dangereux** :
   - Filtrage strict par extension : seuls les formats bureautiques (`.xlsx`, `.xls`, `.docx`, `.doc`, `.pdf`, `.pptx`, `.csv`, `.txt`) sont autorisés.
   - Tout binaire exécutable ou script (`.exe`, `.bat`, `.cmd`, `.sh`, `.vbs`, `.js`, `.py`, `.html`, etc.) est immédiatement rejeté côté client et côté backend.
   - Limite de taille stricte (15 Mo max sur le client, 25 Mo sur le backend Drive) pour prévenir toute tentative de déni de service.
   - Sanitisation intégrale des noms de fichiers contre les attaques de traversée de répertoires (*path traversal*).

4. **Authentification & Protection contre la Divulgation de Secrets** :
   - L'accès d'administration enseignant est vérifié par hachage cryptographique **SHA-256** avec comparaison à temps constant pour éliminer les attaques par canal auxiliaire (*timing attacks*).
   - Aucun mot de passe trivial en clair n'est présent dans le bundle de production.
   - Système de verrouillage progressif (*rate-limiting lockout*) en cas de tentatives infructueuses répétées.

## 2. Signalement d'une Vulnérabilité

Si vous identifiez une faille de sécurité ou un comportement inattendu :
- **Ne créez pas d'issue publique** sur GitHub.
- Contactez directement le responsable pédagogique et technique : Jérôme Foguenne.
- Nous accuserons réception de votre signalement sous 48 heures ouvrées et déploierons un correctif en priorité haute.
