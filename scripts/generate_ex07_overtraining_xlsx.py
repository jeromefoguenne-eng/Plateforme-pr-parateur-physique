import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Load the newly created football dataset as our foundation
wb = openpyxl.load_workbook(r"docs\public\documents\donnees_exercice_final_outils_informatiques.xlsx")

# Palette Styles
NAVY_FILL = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
DARK_SLATE_FILL = PatternFill(start_color="334155", end_color="334155", fill_type="solid")
HEADER_FONT = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
TITLE_FONT = Font(name="Calibri", size=15, bold=True, color="1E3A8A")
SUBTITLE_FONT = Font(name="Calibri", size=11, italic=True, color="475569")
SECTION_FONT = Font(name="Calibri", size=12, bold=True, color="1E3A8A")
BOLD_FONT = Font(name="Calibri", size=11, bold=True)
REGULAR_FONT = Font(name="Calibri", size=11)
KPI_FILL = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")

ALERT_DANGER_FILL = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
ALERT_DANGER_FONT = Font(name="Calibri", size=11, bold=True, color="991B1B")
ALERT_WARN_FILL = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
ALERT_WARN_FONT = Font(name="Calibri", size=11, bold=True, color="92400E")
ALERT_OK_FILL = PatternFill(start_color="D1FAE5", end_color="D1FAE5", fill_type="solid")
ALERT_OK_FONT = Font(name="Calibri", size=11, bold=True, color="065F46")

thin_side = Side(border_style="thin", color="CBD5E1")
cell_border = Border(top=thin_side, left=thin_side, right=thin_side, bottom=thin_side)
thick_bottom = Border(bottom=Side(border_style="medium", color="1E3A8A"), top=thin_side, left=thin_side, right=thin_side)

# ------------------------------------------------------------------------------
# 1. NEW SHEET: 01_Modelisation_Algorithme (Algorithme Anti-Surentraînement)
# ------------------------------------------------------------------------------
ws_algo = wb.create_sheet(title="01_Modelisation_Algorithme")
ws_algo.views.sheetView[0].showGridLines = True

ws_algo["A1"] = "MODÉLISATION & ALGORITHME MULTIFACTORIEL ANTI-SURENTRAÎNEMENT"
ws_algo["A1"].font = TITLE_FONT
ws_algo["A2"] = "Score Composite de Vulnérabilité (0 à 100) : Charge Externe (ACWR GPS), Charge Interne, Récupération Hooper et Marqueurs Neuromusculaires"
ws_algo["A2"].font = SUBTITLE_FONT

algo_headers = [
    "Athlete_ID", "Nom & Prénom", "Poste", 
    "ACWR GPS (Distance)", "ACWR Sprints (>25.2)", "Monotonie Foster", 
    "Indice Hooper Moyen (4-28)", "Découplage RPE/Charge", "Baisse CMJ (%)", 
    "Score Vulnérabilité (/100)", "Niveau de Risque", "Diagnostic Médical & Physique", "Action Recommandée"
]

for ci, h in enumerate(algo_headers, start=1):
    c = ws_algo.cell(4, ci, h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = thick_bottom

# Algorithmic weights:
# Score = (ACWR_dist * 20) + (ACWR_sprint * 15) + (Monotony * 10) + (Hooper_ratio * 25) + (Decoupling * 15) + (CMJ_loss * 15)
players_algo = [
    ("ATH01", "Alexandre Gillet", "Gardien", 0.95, 0.80, 1.25, 11.2, "Normal", "+2.2%", 24, "FAIBLE (Vert)", "Adaptation excellente", "Poursuivre programme"),
    ("ATH02", "Sami Benali", "Gardien", 0.90, 0.75, 1.15, 10.8, "Normal", "+3.1%", 21, "FAIBLE (Vert)", "Adaptation excellente", "Poursuivre programme"),
    ("ATH03", "Thomas Desmet", "Défenseur Central", 1.12, 1.05, 1.55, 13.4, "Normal", "+1.5%", 38, "MODÉRÉ (Vert)", "Charge équilibrée", "Séance normale"),
    ("ATH04", "Ibrahima Koulibaly", "Défenseur Central", 1.68, 1.82, 2.35, 24.5, "Divergence Sévère (+40%)", "-9.5%", 89, "CRITIQUE (Rouge)", "SURENTRAÎNEMENT NON FONCTIONNEL (NFOR)", "Arrêt complet 5j, soins ischio, bilan sanguin"),
    ("ATH05", "Maxime Vandamme", "Défenseur Central", 1.05, 0.98, 1.40, 12.0, "Normal", "+4.2%", 32, "FAIBLE (Vert)", "Excellente fraîcheur", "Disponible pour titularisation"),
    ("ATH06", "Nathan Dubois", "Latéral Droit", 1.42, 1.55, 1.95, 19.8, "Modéré (+15%)", "-2.8%", 68, "ÉLEVÉ (Orange)", "SURMENAGE FONCTIONNEL AIGU (FOR)", "Allègement 50% sur sprints et décélérations"),
    ("ATH07", "Lucas Mercier", "Latéral Gauche", 1.18, 1.15, 1.62, 14.2, "Normal", "+3.5%", 42, "MODÉRÉ (Vert)", "Charge optimale (Sweet Spot)", "Maintien de la programmation"),
    ("ATH08", "Julien Moreau", "Latéral Polyvalent", 0.88, 0.85, 1.30, 11.5, "Normal", "+2.8%", 27, "FAIBLE (Vert)", "Frais physiquement", "Option de rotation active"),
    ("ATH09", "Amadou Diallo", "Milieu Défensif", 1.22, 1.10, 1.70, 15.0, "Normal", "+1.2%", 46, "MODÉRÉ (Vert)", "Stabilité cardio-vasculaire", "Surveiller hydratation"),
    ("ATH10", "Arthur Willems", "Milieu Défensif", 0.98, 0.90, 1.35, 12.2, "Normal", "+3.0%", 31, "FAIBLE (Vert)", "Fraîcheur optimale", "Poursuivre programme"),
    ("ATH11", "Romain Claes", "Milieu Relayeur", 1.75, 1.65, 2.45, 23.8, "Divergence Sévère (+35%)", "-8.8%", 92, "CRITIQUE (Rouge)", "SURENTRAÎNEMENT & ÉPUISEMENT AUTONOME", "Décharge totale 7j, bilan kiné tendinopathie"),
    ("ATH12", "Hugo Renard", "Milieu Relayeur", 1.25, 1.20, 1.72, 14.8, "Normal", "+4.0%", 44, "MODÉRÉ (Vert)", "Bonne tolérance d'effort", "Programme nominal"),
    ("ATH13", "Moussa Sow", "Milieu Offensif", 1.15, 1.22, 1.60, 13.5, "Normal", "+3.8%", 39, "MODÉRÉ (Vert)", "Capacités réactives intactes", "Programme nominal"),
    ("ATH14", "Antoine Dumont", "Milieu Offensif", 0.92, 0.88, 1.25, 11.8, "Normal", "+2.5%", 28, "FAIBLE (Vert)", "Prêt physiquement", "Rotation"),
    ("ATH15", "Sekou Bakayoko", "Ailier Droit", 1.32, 1.38, 1.80, 16.5, "Léger (+10%)", "+0.5%", 54, "VIGILANCE (Jaune)", "Surveillance charge de sprint", "Limiter les répétitions à >25 km/h à J-2"),
    ("ATH16", "Florian Lambert", "Ailier Gauche", 1.20, 1.18, 1.65, 14.0, "Normal", "+3.2%", 41, "MODÉRÉ (Vert)", "Bon profil vitesse", "Programme nominal"),
    ("ATH17", "Enzo Navarro", "Ailier Polyvalent", 0.85, 0.80, 1.20, 11.0, "Normal", "+5.1%", 22, "FAIBLE (Vert)", "Plein potentiel neuromusculaire", "Temps de jeu conseillé"),
    ("ATH18", "Christian Tshilombo", "Avant-Centre", 1.24, 1.28, 1.68, 15.2, "Normal", "+1.8%", 45, "MODÉRÉ (Vert)", "Puissance préservée", "Gestion des duels"),
    ("ATH19", "Loris Peeters", "Avant-Centre", 0.90, 0.85, 1.28, 11.5, "Normal", "+3.4%", 26, "FAIBLE (Vert)", "Fraîcheur optimale", "Option de jeu"),
    ("ATH20", "Noah Simon", "Attaquant Soutien", 0.94, 0.92, 1.32, 12.0, "Normal", "+4.0%", 29, "FAIBLE (Vert)", "Excellente réactivité", "Option de jeu")
]

for ri, row in enumerate(players_algo, start=5):
    for ci, val in enumerate(row, start=1):
        cell = ws_algo.cell(ri, ci, val)
        cell.border = cell_border
        cell.alignment = Alignment(horizontal="center" if ci in [1, 4, 5, 6, 7, 8, 9, 10, 11] else "left")
        
        # Color formatting
        if "CRITIQUE" in str(val):
            cell.fill = ALERT_DANGER_FILL
            cell.font = ALERT_DANGER_FONT
        elif "ÉLEVÉ" in str(val) or "VIGILANCE" in str(val):
            cell.fill = ALERT_WARN_FILL
            cell.font = ALERT_WARN_FONT
        elif "MODÉRÉ" in str(val) or "FAIBLE" in str(val):
            cell.fill = ALERT_OK_FILL
            cell.font = ALERT_OK_FONT

for col in ws_algo.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_algo.column_dimensions[col_letter].width = max(max_len + 3, 14)

# ------------------------------------------------------------------------------
# 2. NEW SHEET: 00_Cockpit_Anti_Surentrainement (Dashboard Staff Interactif)
# ------------------------------------------------------------------------------
ws_cockpit = wb.create_sheet(title="00_Cockpit_Anti_Surentrainement", index=0)
ws_cockpit.views.sheetView[0].showGridLines = True

ws_cockpit["A1"] = "COCKPIT DU STAFF : DÉTECTION & PRÉVENTION DU SURENTRAÎNEMENT"
ws_cockpit["A1"].font = TITLE_FONT
ws_cockpit["A2"] = "Surveillance en temps réel des 20 joueurs — Croisement Charge Externe (GPS), Charge Interne (Cardio/RPE) et Récupération"
ws_cockpit["A2"].font = SUBTITLE_FONT

# Top KPI Cards
cockpit_kpis = [
    ("A4", "B4", "A5", "👥 Effectif Monitoré", "20 Joueurs"),
    ("D4", "E4", "D5", "🔴 Alertes Critiques OTS", "2 Joueurs (10%)", ALERT_DANGER_FILL, ALERT_DANGER_FONT),
    ("G4", "H4", "G5", "🟠 Surmenage Élevé", "1 Joueur (5%)", ALERT_WARN_FILL, ALERT_WARN_FONT),
    ("J4", "K4", "J5", "🟢 Disponibilité Optimale", "17 Joueurs (85%)", ALERT_OK_FILL, ALERT_OK_FONT),
    ("M4", "N4", "M5", "💤 Qualité Sommeil Équipe", "7.4 h / nuit"),
]

for item in cockpit_kpis:
    tl, tr, bl = item[0], item[1], item[2]
    title, val = item[3], item[4]
    
    ws_cockpit[tl] = title
    ws_cockpit[tl].font = Font(name="Calibri", size=10, bold=True, color="64748B")
    ws_cockpit[bl] = val
    ws_cockpit[bl].font = Font(name="Calibri", size=15, bold=True, color="1E3A8A")
    
    fill = item[5] if len(item) > 5 else KPI_FILL
    font = item[6] if len(item) > 6 else Font(name="Calibri", size=15, bold=True, color="1E3A8A")
    ws_cockpit[bl].fill = fill
    ws_cockpit[bl].font = font
    
    for r in [4, 5]:
        for c in range(openpyxl.utils.column_index_from_string(tl[0]), openpyxl.utils.column_index_from_string(tr[0]) + 1):
            cell = ws_cockpit.cell(row=r, column=c)
            cell.border = cell_border

# Matrice des Cas Critiques prioritaires
ws_cockpit["A8"] = "CAS CLINIQUES & SPORTIFS PRIORITAIRES (INTERVENTION IMMÉDIATE DU STAFF)"
ws_cockpit["A8"].font = SECTION_FONT

crit_headers = ["Athlète", "Poste", "Signaux Convergents de Surentraînement", "Marqueur Physiologique Clé", "Décision Préparateur & Médecin"]
for ci, h in enumerate(crit_headers, start=1):
    c = ws_cockpit.cell(10, ci, h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center")
    c.border = thick_bottom

crit_rows = [
    ("Ibrahima Koulibaly (ATH04)", "Défenseur Central", "ACWR 1.68 + Monotonie 2.35 + Hooper 24.5/28 + Dérive FC sous-max (+11 bpm)", "Chute CMJ de -9.5% + Douleur ischio-jambier", "MISE AU REPOS IMMÉDIATE (5 jours), cryothérapie, échographie musculaire, substitution par Vandamme"),
    ("Romain Claes (ATH11)", "Milieu Relayeur", "ACWR 1.75 + Monotonie 2.45 + Hooper 23.8/28 + Dette de sommeil chronique (< 6h)", "Chute Yo-Yo IR1 de -240 m + Tendinopathie rotulienne", "DÉCHARGE TOTALE (7 jours), travail déchargé en piscine, substitution par Renard"),
    ("Nathan Dubois (ATH06)", "Latéral Droit", "Volume décélérations excessif (MD-3) + Fatigue Hooper 19.8", "Tension au mollet droit + Perte vivacité", "ADAPTATION SÉANCE (Allègement 50% sur courses rapides, pas de frappes ni de sprints)")
]

for ri, r in enumerate(crit_rows, start=11):
    for ci, val in enumerate(r, start=1):
        c = ws_cockpit.cell(ri, ci, val)
        c.border = cell_border
        c.alignment = Alignment(horizontal="center" if ci in [1, 2] else "left")
        if ci == 1:
            c.font = BOLD_FONT
        if "REPOS" in val or "DÉCHARGE" in val:
            c.fill = ALERT_DANGER_FILL
            c.font = ALERT_DANGER_FONT
        elif "ADAPTATION" in val:
            c.fill = ALERT_WARN_FILL
            c.font = ALERT_WARN_FONT

# Directives d'entraînement Semaine 7
ws_cockpit["A16"] = "PLAN D'ACTION OPÉRATIONNEL DU STAFF TECHNIQUE POUR LA SEMAINE 7"
ws_cockpit["A16"].font = SECTION_FONT

recos_staff = [
    "1. Tapering et affûtage collectif : Réduction globale du volume d'entraînement de 30% tout en conservant une intensité explosive courte (accélérations 5-10m) pour favoriser la surcompensation neuromusculaire avant le match du week-end.",
    "2. Découplage individualisé des formats de jeu : Remplacer les grands jeux en terrain complet pour les joueurs à risque par des ateliers techniques à surfaces réduites (SSG 4v4 avec appuis extérieurs) afin de limiter la distance totale à haute vitesse (HSR).",
    "3. Protocole de suivi quotidien de la variabilité cardiaque et du sommeil : Mise en place d'un check-in smartphone obligatoire à 08h00. Tout score Hooper >= 18 entraîne une consultation médicale préalable avant l'entrée aux vestiaires.",
    "4. Gestion des rotations tactiques : Titularisation recommandée de Vandamme en défense centrale et de Renard au milieu pour préserver l'intégrité physique de Koulibaly et Claes."
]
for p_idx, preco in enumerate(recos_staff, start=18):
    ws_cockpit[f"A{p_idx}"] = preco
    ws_cockpit[f"A{p_idx}"].font = REGULAR_FONT

for col in ws_cockpit.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_cockpit.column_dimensions[col_letter].width = max(max_len + 3, 14)

# Save Workbook
f_prod_local = r"docs\public\documents\Exercice 07 - Production attendue.xlsx"
f_prod_drive = r"C:\Google Drive\Prépas light\HECh\Préparateur physique\Exercices\Exercice 07\Exercice 07 - Production attendue.xlsx"

wb.save(f_prod_local)
wb.save(f_prod_drive)
print(f"SUCCESS: Created updated {f_prod_local} and {f_prod_drive}!")
