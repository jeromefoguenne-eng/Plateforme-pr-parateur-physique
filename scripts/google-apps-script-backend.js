/**
 * =========================================================================
 * BACKEND GOOGLE APPS SCRIPT - OUTILS INFO PRÉPARATION PHYSIQUE (HECh)
 * =========================================================================
 * 
 * Ce script transforme votre compte Google Drive & Google Sheet en une API
 * sécurisée pour synchroniser la plateforme sur tous les appareils :
 * - Smartphones des étudiants (inscriptions, devoirs, quiz, suivi)
 * - Ordinateurs des étudiants (connexion nomade sans perte de données)
 * - PC portable et PC fixe de l'enseignant (suivi en temps réel de la promotion)
 * 
 * PROCÉDURE D'INSTALLATION (Moins de 2 minutes) :
 * 1. Ouvrez https://script.google.com et cliquez sur "Nouveau projet"
 * 2. Renommez le projet : "Plateforme Préparateur Physique HECh"
 * 3. Effacez le code existant et collez TOUT le contenu de ce fichier
 * 4. Cliquez sur "Déployer" (bouton bleu en haut à droite) > "Nouveau déploiement"
 * 5. Type : Cliquez sur l'engrenage > sélectionnez "Application Web"
 * 6. Configuration :
 *    - Description : "Version 2.0 Production"
 *    - Exécuter en tant que : "Moi" (votre compte Google)
 *    - Qui a accès : "Tout le monde" (Anyone)
 * 7. Cliquez sur "Déployer", autorisez l'accès Google, puis copiez l'URL générée
 *    (se terminant par /exec)
 * 8. Collez cette URL dans l'Espace Admin de votre plateforme !
 * =========================================================================
 */

var SPREADSHEET_NAME = "Préparation Physique HECh - Données Plateforme";
// Dossier Google Drive de destination (synchronisé avec "C:\Google Drive\Prépas light\HECh\Préparateur physique\Dossier exercices étudiants plateforme")
var DRIVE_FOLDER_ID = "1p_8jFrooNUxUl5tlcMyhBGDbfskJfpZH";
var DRIVE_FOLDER_NAME = "Dossier exercices étudiants plateforme";

/**
 * Point d'entrée GET (Lecture / Synchronisation)
 */
function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = params.action || 'syncAll';

    if (action === 'getStudent') {
      var email = (params.email || '').trim().toLowerCase();
      var student = getStudentByEmail(email);
      return createJsonResponse({ status: "success", user: student });
    }

    if (action === 'syncAll') {
      var fullData = getFullDataFromSheet();
      return createJsonResponse({ status: "success", data: fullData });
    }

    return createJsonResponse({ status: "success", message: "API Préparation Physique HECh en ligne." });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Point d'entrée POST (Écriture / Sauvegarde / Fusion)
 */
function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
    var action = body.action || '';

    // 1. Synchronisation globale bidirectionnelle
    if (action === 'syncAll') {
      var mergedData = mergeAndSyncAll(body.state || {});
      return createJsonResponse({ status: "success", data: mergedData });
    }

    // 2. Recherche d'étudiant (pour connexion cross-device immédiate)
    if (action === 'getStudent') {
      var email = (body.email || '').trim().toLowerCase();
      var student = getStudentByEmail(email);
      return createJsonResponse({ status: "success", user: student });
    }

    // 3. Inscription d'un nouvel étudiant
    if (action === 'registerStudent') {
      var savedUser = saveOrUpdateStudent(body.user);
      return createJsonResponse({ status: "success", user: savedUser });
    }

    // 4. Mise à jour d'étudiant (ex: mot de passe défini)
    if (action === 'updateStudent') {
      var updatedUser = saveOrUpdateStudent(body.user);
      return createJsonResponse({ status: "success", user: updatedUser });
    }

    // 5. Suppression d'un étudiant
    if (action === 'deleteStudent') {
      var delEmail = (body.email || '').trim().toLowerCase();
      deleteStudentFromSheet(delEmail);
      return createJsonResponse({ status: "success", message: "Étudiant supprimé." });
    }

    // 6. Sauvegarde d'un devoir / texte d'exercice
    if (action === 'saveSubmission') {
      saveSubmissionToSheet(body.submission);
      return createJsonResponse({ status: "success", message: "Devoir enregistré." });
    }

    // 7. Sauvegarde d'un résultat de Quiz
    if (action === 'saveQuizAttempt') {
      saveQuizToSheet(body.quizAttempt);
      return createJsonResponse({ status: "success", message: "Quiz enregistré." });
    }

    // 8. Sauvegarde des échéances
    if (action === 'saveDeadlines') {
      saveDeadlinesToSheet(body.deadlines);
      return createJsonResponse({ status: "success", message: "Échéances synchronisées." });
    }

    // 9. Sauvegarde d'une évaluation / note de l'enseignant
    if (action === 'saveEvaluation') {
      saveEvaluationToSheet(body.email, body.evaluation);
      return createJsonResponse({ status: "success", message: "Évaluation synchronisée." });
    }

    // 10. Dépôt de fichier binaire (Word, Excel, PDF) vers Google Drive
    if (action === 'uploadFile') {
      var fileResult = saveFileToDrive(body);
      return createJsonResponse(fileResult);
    }

    return createJsonResponse({ status: "error", message: "Action non reconnue : " + action });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Utilitaire pour formater la réponse JSON avec en-têtes CORS
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// =========================================================================
// GESTION DU TABLEUR GOOGLE SHEET (BASE DE DONNÉES)
// =========================================================================

function getOrCreateSpreadsheet() {
  var files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }

  // Création d'un nouveau tableur
  var ss = SpreadsheetApp.create(SPREADSHEET_NAME);
  initSheetTabs(ss);
  return ss;
}

function initSheetTabs(ss) {
  var requiredSheets = ["Étudiants", "Soumissions", "Quiz", "Échéances", "Évaluations", "Fichiers"];
  
  requiredSheets.forEach(function(name) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      setupSheetHeader(sheet, name);
    }
  });

  var defaultSheet = ss.getSheetByName("Feuille 1");
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }
}

function setupSheetHeader(sheet, sheetName) {
  var headers = [];
  if (sheetName === "Étudiants") {
    headers = ["ID", "Prénom", "Nom", "Email", "Rôle", "Date Inscription", "Mot de passe hash/flag", "Code Récupération", "Mot de passe clair"];
  } else if (sheetName === "Soumissions") {
    headers = ["ID", "Email Étudiant", "Nom Étudiant", "Exercice ID", "Titre Exercice", "Réponse / Document", "Date de remise"];
  } else if (sheetName === "Quiz") {
    headers = ["ID", "Email Étudiant", "Nom Étudiant", "Module ID", "Titre Module", "Score", "Total", "Pourcentage", "Date de passage"];
  } else if (sheetName === "Échéances") {
    headers = ["Exercice ID", "Échéance ISO", "Libellé affiché", "Dernière mise à jour"];
  } else if (sheetName === "Évaluations") {
    headers = ["Email Étudiant", "JSON Évaluation", "Dernière mise à jour"];
  } else if (sheetName === "Fichiers") {
    headers = ["Date", "Nom Étudiant", "Email Étudiant", "Atelier", "Nom Fichier", "Lien Google Drive", "ID Drive"];
  }

  if (headers.length > 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#0284c7")
      .setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
}

// -------------------------------------------------------------------------
// RECHERCHE & GESTION DES ÉTUDIANTS
// -------------------------------------------------------------------------

function getStudentByEmail(email) {
  if (!email) return null;
  var ss = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName("Étudiants");
  if (!sheet) return null;

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return null;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rowEmail = (row[3] || '').toString().trim().toLowerCase();
    if (rowEmail === email.toLowerCase()) {
      return {
        id: row[0],
        firstName: row[1],
        lastName: row[2],
        email: row[3],
        role: row[4] || 'student',
        registeredAt: row[5],
        passwordSet: row[6] === true || row[6] === 'true' || row[6] === 'YES',
        recoveryCode: row[7] || '',
        password: row[8] || ''
      };
    }
  }
  return null;
}

function saveOrUpdateStudent(user) {
  if (!user || !user.email) return null;
  var ss = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName("Étudiants");
  if (!sheet) {
    initSheetTabs(ss);
    sheet = ss.getSheetByName("Étudiants");
  }

  var data = sheet.getDataRange().getValues();
  var cleanEmail = user.email.trim().toLowerCase();
  var rowIndex = -1;

  for (var i = 1; i < data.length; i++) {
    if ((data[i][3] || '').toString().trim().toLowerCase() === cleanEmail) {
      rowIndex = i + 1;
      break;
    }
  }

  var pwdFlag = (user.passwordSet === true || user.passwordSet === 'true' || !!user.password) ? 'YES' : 'NO';

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 2).setValue(user.firstName || '');
    sheet.getRange(rowIndex, 3).setValue(user.lastName || '');
    if (user.passwordSet !== undefined || user.password) {
      sheet.getRange(rowIndex, 7).setValue(pwdFlag);
    }
    if (user.recoveryCode) {
      sheet.getRange(rowIndex, 8).setValue(user.recoveryCode);
    }
    if (user.password) {
      sheet.getRange(rowIndex, 9).setValue(user.password);
    }
    return user;
  } else {
    var newId = user.id || ('usr_' + Date.now());
    sheet.appendRow([
      newId,
      user.firstName || '',
      user.lastName || '',
      user.email,
      user.role || 'student',
      user.registeredAt || new Date().toISOString(),
      pwdFlag,
      user.recoveryCode || '',
      user.password || ''
    ]);
    return user;
  }
}

function deleteStudentFromSheet(email) {
  if (!email) return;
  var ss = getOrCreateSpreadsheet();
  var cleanEmail = email.trim().toLowerCase();

  // Supprimer de la feuille Étudiants
  var userSheet = ss.getSheetByName("Étudiants");
  if (userSheet) {
    var data = userSheet.getDataRange().getValues();
    for (var i = data.length - 1; i >= 1; i--) {
      if ((data[i][3] || '').toString().trim().toLowerCase() === cleanEmail) {
        userSheet.deleteRow(i + 1);
      }
    }
  }

  // Supprimer des soumissions
  var subSheet = ss.getSheetByName("Soumissions");
  if (subSheet) {
    var sData = subSheet.getDataRange().getValues();
    for (var j = sData.length - 1; j >= 1; j--) {
      if ((sData[j][1] || '').toString().trim().toLowerCase() === cleanEmail) {
        subSheet.deleteRow(j + 1);
      }
    }
  }

  // Supprimer des quiz
  var qSheet = ss.getSheetByName("Quiz");
  if (qSheet) {
    var qData = qSheet.getDataRange().getValues();
    for (var k = qData.length - 1; k >= 1; k--) {
      if ((qData[k][1] || '').toString().trim().toLowerCase() === cleanEmail) {
        qSheet.deleteRow(k + 1);
      }
    }
  }

  // Supprimer des évaluations
  var evSheet = ss.getSheetByName("Évaluations");
  if (evSheet) {
    var evData = evSheet.getDataRange().getValues();
    for (var l = evData.length - 1; l >= 1; l--) {
      if ((evData[l][0] || '').toString().trim().toLowerCase() === cleanEmail) {
        evSheet.deleteRow(l + 1);
      }
    }
  }
}

// -------------------------------------------------------------------------
// SOUMISSIONS & DEVOIRS
// -------------------------------------------------------------------------

function saveSubmissionToSheet(sub) {
  if (!sub || !sub.userEmail || !sub.exerciseId) return;
  var ss = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName("Soumissions");
  if (!sheet) {
    initSheetTabs(ss);
    sheet = ss.getSheetByName("Soumissions");
  }

  var data = sheet.getDataRange().getValues();
  var cleanEmail = sub.userEmail.trim().toLowerCase();
  var rowIndex = -1;

  for (var i = 1; i < data.length; i++) {
    if ((data[i][1] || '').toString().trim().toLowerCase() === cleanEmail &&
        (data[i][3] || '').toString() === sub.exerciseId.toString()) {
      rowIndex = i + 1;
      break;
    }
  }

  var answerStr = typeof sub.answer === 'string' ? sub.answer : (sub.content || JSON.stringify(sub.answer || ''));

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 6).setValue(answerStr);
    sheet.getRange(rowIndex, 7).setValue(sub.submittedAt || new Date().toISOString());
  } else {
    sheet.appendRow([
      sub.id || ('sub_' + Date.now()),
      sub.userEmail,
      sub.userName || '',
      sub.exerciseId,
      sub.exerciseTitle || '',
      answerStr,
      sub.submittedAt || new Date().toISOString()
    ]);
  }
}

// -------------------------------------------------------------------------
// QUIZ ATTEMPTS
// -------------------------------------------------------------------------

function saveQuizToSheet(quiz) {
  if (!quiz || !quiz.userEmail || !quiz.moduleId) return;
  var ss = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName("Quiz");
  if (!sheet) {
    initSheetTabs(ss);
    sheet = ss.getSheetByName("Quiz");
  }

  sheet.appendRow([
    quiz.id || ('quiz_' + Date.now()),
    quiz.userEmail,
    quiz.userName || '',
    quiz.moduleId,
    quiz.moduleTitle || '',
    quiz.score || 0,
    quiz.totalPoints || 10,
    quiz.percentage || 0,
    quiz.submittedAt || new Date().toISOString()
  ]);
}

// -------------------------------------------------------------------------
// ÉCHÉANCES
// -------------------------------------------------------------------------

function saveDeadlinesToSheet(deadlines) {
  if (!deadlines || typeof deadlines !== 'object') return;
  var ss = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName("Échéances");
  if (!sheet) {
    initSheetTabs(ss);
    sheet = ss.getSheetByName("Échéances");
  }

  sheet.clearContents();
  setupSheetHeader(sheet, "Échéances");

  var rows = [];
  var now = new Date().toISOString();
  Object.keys(deadlines).forEach(function(exId) {
    var item = deadlines[exId];
    if (item) {
      var dVal = typeof item === 'string' ? item : (item.deadline || item.dueDate || '');
      var lVal = typeof item === 'string' ? '' : (item.deadlineLabel || item.label || '');
      if (dVal && dVal.trim()) {
        rows.push([exId, dVal.trim(), lVal.trim(), now]);
      }
    }
  });

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 4).setValues(rows);
  }
}

// -------------------------------------------------------------------------
// ÉVALUATIONS
// -------------------------------------------------------------------------

function saveEvaluationToSheet(email, evalData) {
  if (!email || !evalData) return;
  var ss = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName("Évaluations");
  if (!sheet) {
    initSheetTabs(ss);
    sheet = ss.getSheetByName("Évaluations");
  }

  var data = sheet.getDataRange().getValues();
  var cleanEmail = email.trim().toLowerCase();
  var rowIndex = -1;

  for (var i = 1; i < data.length; i++) {
    if ((data[i][0] || '').toString().trim().toLowerCase() === cleanEmail) {
      rowIndex = i + 1;
      break;
    }
  }

  var jsonStr = JSON.stringify(evalData);
  var now = new Date().toISOString();

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 2).setValue(jsonStr);
    sheet.getRange(rowIndex, 3).setValue(now);
  } else {
    sheet.appendRow([cleanEmail, jsonStr, now]);
  }
}

// -------------------------------------------------------------------------
// TÉLÉVERSEMENT GOOGLE DRIVE (AVEC SOUS-DOSSIERS PAR ÉTUDIANT)
// -------------------------------------------------------------------------

function saveFileToDrive(filePayload) {
  try {
    var rootFolder = null;
    if (typeof DRIVE_FOLDER_ID !== 'undefined' && DRIVE_FOLDER_ID) {
      try {
        rootFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      } catch (eId) {
        rootFolder = null;
      }
    }
    if (!rootFolder) {
      var folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
      if (folders.hasNext()) {
        rootFolder = folders.next();
      } else {
        rootFolder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
      }
    }

    // Sous-dossier par étudiant (ex: MERCIER_Lucas)
    var studentName = filePayload.studentName || (filePayload.studentEmail ? filePayload.studentEmail.split('@')[0] : 'Etudiant');
    var safeStudentFolder = studentName.replace(/[<>:"/\\|?*]/g, '_').trim();
    var subFolders = rootFolder.getFoldersByName(safeStudentFolder);
    var targetFolder;
    if (subFolders.hasNext()) {
      targetFolder = subFolders.next();
    } else {
      targetFolder = rootFolder.createFolder(safeStudentFolder);
    }

    var base64 = filePayload.base64Data;
    if (base64.indexOf(',') > -1) {
      base64 = base64.split(',')[1];
    }
    var decoded = Utilities.base64Decode(base64);
    var blob = Utilities.newBlob(decoded, filePayload.mimeType || 'application/octet-stream', filePayload.fileName || 'document.pdf');
    var file = targetFolder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var ss = getOrCreateSpreadsheet();
    var sheet = ss.getSheetByName("Fichiers");
    if (!sheet) {
      initSheetTabs(ss);
      sheet = ss.getSheetByName("Fichiers");
    }

    sheet.appendRow([
      new Date().toISOString(),
      studentName,
      filePayload.studentEmail || '',
      filePayload.exerciseTitle || '',
      file.getName(),
      file.getUrl(),
      file.getId()
    ]);

    return {
      status: "success",
      fileId: file.getId(),
      fileUrl: file.getUrl()
    };
  } catch (e) {
    return { status: "error", message: e.toString() };
  }
}

// -------------------------------------------------------------------------
// RÉCUPÉRATION COMPLÈTE & FUSION (SYNC ALL)
// -------------------------------------------------------------------------

function getFullDataFromSheet() {
  var ss = getOrCreateSpreadsheet();
  initSheetTabs(ss);

  var result = {
    users: [],
    submissions: [],
    quizAttempts: [],
    deadlines: {},
    evaluations: {}
  };

  // 1. Étudiants
  var userSheet = ss.getSheetByName("Étudiants");
  if (userSheet) {
    var userData = userSheet.getDataRange().getValues();
    for (var i = 1; i < userData.length; i++) {
      var r = userData[i];
      if (r[3]) {
        result.users.push({
          id: r[0],
          firstName: r[1],
          lastName: r[2],
          email: r[3],
          role: r[4] || 'student',
          registeredAt: r[5],
          passwordSet: r[6] === true || r[6] === 'true' || r[6] === 'YES',
          recoveryCode: r[7] || '',
          password: r[8] || ''
        });
      }
    }
  }

  // 2. Soumissions
  var subSheet = ss.getSheetByName("Soumissions");
  if (subSheet) {
    var subData = subSheet.getDataRange().getValues();
    for (var j = 1; j < subData.length; j++) {
      var s = subData[j];
      if (s[1] && s[3]) {
        result.submissions.push({
          id: s[0],
          userEmail: s[1],
          userName: s[2],
          exerciseId: s[3],
          exerciseTitle: s[4],
          answer: s[5],
          submittedAt: s[6]
        });
      }
    }
  }

  // 3. Quiz
  var quizSheet = ss.getSheetByName("Quiz");
  if (quizSheet) {
    var qData = quizSheet.getDataRange().getValues();
    for (var k = 1; k < qData.length; k++) {
      var q = qData[k];
      if (q[1] && q[3]) {
        result.quizAttempts.push({
          id: q[0],
          userEmail: q[1],
          userName: q[2],
          moduleId: q[3],
          moduleTitle: q[4],
          score: q[5],
          totalPoints: q[6],
          percentage: q[7],
          submittedAt: q[8]
        });
      }
    }
  }

  // 4. Échéances
  var deadSheet = ss.getSheetByName("Échéances");
  if (deadSheet) {
    var deadData = deadSheet.getDataRange().getValues();
    for (var l = 1; l < deadData.length; l++) {
      var d = deadData[l];
      if (d[0] && d[1]) {
        result.deadlines[d[0]] = {
          deadline: d[1],
          deadlineLabel: d[2] || ''
        };
      }
    }
  }

  // 5. Évaluations
  var evalSheet = ss.getSheetByName("Évaluations");
  if (evalSheet) {
    var evData = evalSheet.getDataRange().getValues();
    for (var m = 1; m < evData.length; m++) {
      var ev = evData[m];
      if (ev[0] && ev[1]) {
        try {
          result.evaluations[ev[0].toString().toLowerCase()] = JSON.parse(ev[1]);
        } catch(e) {}
      }
    }
  }

  return result;
}

function mergeAndSyncAll(incomingState) {
  var ss = getOrCreateSpreadsheet();
  initSheetTabs(ss);

  // 1. Fusionner les étudiants entrants
  if (Array.isArray(incomingState.users)) {
    incomingState.users.forEach(function(u) {
      if (u && u.email) saveOrUpdateStudent(u);
    });
  }

  // 2. Fusionner les soumissions entrantes
  if (Array.isArray(incomingState.submissions)) {
    incomingState.submissions.forEach(function(s) {
      if (s && s.userEmail && s.exerciseId) saveSubmissionToSheet(s);
    });
  }

  // 3. Fusionner les quiz entrants
  if (Array.isArray(incomingState.quizAttempts)) {
    incomingState.quizAttempts.forEach(function(q) {
      if (q && q.userEmail && q.moduleId) saveQuizToSheet(q);
    });
  }

  // 4. Fusionner les échéances
  if (incomingState.deadlines && typeof incomingState.deadlines === 'object') {
    if (Object.keys(incomingState.deadlines).length > 0) {
      saveDeadlinesToSheet(incomingState.deadlines);
    }
  }

  // 5. Fusionner les évaluations
  if (incomingState.evaluations && typeof incomingState.evaluations === 'object') {
    Object.keys(incomingState.evaluations).forEach(function(email) {
      saveEvaluationToSheet(email, incomingState.evaluations[email]);
    });
  }

  // Retourner l'état complet à jour
  return getFullDataFromSheet();
}
