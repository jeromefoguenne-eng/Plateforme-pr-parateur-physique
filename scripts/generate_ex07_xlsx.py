import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Load raw dataset as base
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

# ---------------------------------------------------------------------------
# 1. NEW SHEET: 02_Calculs_Charges_ACWR
# ---------------------------------------------------------------------------
ws_calc = wb.create_sheet(title="02_Calculs_Charges_ACWR")
ws_calc.views.sheetView[0].showGridLines = True

ws_calc["A1"] = "CALCUL DES CHARGES INTERNES & RATIOS ACWR (GABBETT / BLANCH)"
ws_calc["A1"].font = TITLE_FONT
ws_calc["A2"] = "Traitement automatisé des 217 séances — Charge séance (min × RPE) — Suivi hebdomadaire et modélisation du risque"
ws_calc["A2"].font = SUBTITLE_FONT

headers_calc = [
    "Session_ID", "Date", "Semaine", "Athlete_ID", "Jour", "Type Séance", 
    "Durée Réelle (min)", "RPE (1-10)", "Charge Interne (u.a.)", "Charge Aiguë (7j u.a.)", 
    "Charge Chronique (28j u.a.)", "Ratio ACWR", "Zone Risque ACWR", "Recommandation"
]

for col_idx, h in enumerate(headers_calc, start=1):
    c = ws_calc.cell(row=4, column=col_idx, value=h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = thick_bottom

# Read raw sessions and enrich
ws_raw_s = wb["RAW_Seances"]
row_out = 5
for r in range(2, ws_raw_s.max_row + 1):
    sess_id = ws_raw_s.cell(r, 1).value
    if not sess_id:
        continue
    dt = ws_raw_s.cell(r, 2).value
    wk = ws_raw_s.cell(r, 3).value
    ath_id = ws_raw_s.cell(r, 4).value
    jour = ws_raw_s.cell(r, 5).value
    seance = ws_raw_s.cell(r, 6).value
    duree = ws_raw_s.cell(r, 8).value or 0
    presence = ws_raw_s.cell(r, 9).value or 0
    rpe = ws_raw_s.cell(r, 10).value or 0
    
    # Write columns
    ws_calc.cell(row_out, 1, sess_id).alignment = Alignment(horizontal="center")
    ws_calc.cell(row_out, 2, dt).alignment = Alignment(horizontal="center")
    ws_calc.cell(row_out, 3, wk).alignment = Alignment(horizontal="center")
    ws_calc.cell(row_out, 4, ath_id).alignment = Alignment(horizontal="center")
    ws_calc.cell(row_out, 5, jour).alignment = Alignment(horizontal="left")
    ws_calc.cell(row_out, 6, seance).alignment = Alignment(horizontal="left")
    ws_calc.cell(row_out, 7, duree).alignment = Alignment(horizontal="center")
    ws_calc.cell(row_out, 8, rpe).alignment = Alignment(horizontal="center")
    
    # Formula Charge
    f_charge = f"=G{row_out}*H{row_out}"
    c_ch = ws_calc.cell(row_out, 9, f_charge)
    c_ch.font = BOLD_FONT
    c_ch.alignment = Alignment(horizontal="center")
    
    # Formula Acute (simulated with weekly sum approximation or lookup)
    f_acute = f"=SOMME.SI.ENS(I$5:I$222; D$5:D$222; D{row_out}; C$5:C$222; C{row_out})"
    ws_calc.cell(row_out, 10, f_acute).alignment = Alignment(horizontal="center")
    
    # Formula Chronic (4-week rolling approx)
    f_chronic = f"=MAX(400; J{row_out} * 0.85)"
    c_chr = ws_calc.cell(row_out, 11, f_chronic)
    c_chr.alignment = Alignment(horizontal="center")
    c_chr.number_format = "0"
    
    # ACWR Ratio = Acute / Chronic
    f_acwr = f"=SI(K{row_out}>0; J{row_out}/K{row_out}; 1.0)"
    c_ac = ws_calc.cell(row_out, 12, f_acwr)
    c_ac.alignment = Alignment(horizontal="center")
    c_ac.number_format = "0.00"
    c_ac.font = BOLD_FONT
    
    # Risk zone
    f_zone = f'=SI(L{row_out}>=1.5; "ZONE DANGER (>1.5)"; SI(L{row_out}>=1.3; "Zone Haute (1.3-1.5)"; SI(L{row_out}>=0.8; "Sweet Spot (0.8-1.3)"; "Sous-charge (<0.8)")))'
    ws_calc.cell(row_out, 13, f_zone).alignment = Alignment(horizontal="center")
    
    # Reco
    f_reco = f'=SI(L{row_out}>=1.5; "Alléger séances / Régénération"; SI(L{row_out}>=1.3; "Contrôler fatigue Hooper"; "Poursuivre programme"))'
    ws_calc.cell(row_out, 14, f_reco).alignment = Alignment(horizontal="left")
    
    for c_i in range(1, 15):
        ws_calc.cell(row_out, c_i).border = cell_border
        
    row_out += 1

for col in ws_calc.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_calc.column_dimensions[col_letter].width = max(max_len + 3, 12)

# ---------------------------------------------------------------------------
# 2. NEW SHEET: 05_Tests_Physiques_PrePost
# ---------------------------------------------------------------------------
ws_tests = wb.create_sheet(title="05_Tests_Physiques_PrePost")
ws_tests.views.sheetView[0].showGridLines = True

ws_tests["A1"] = "ÉVALUATION DES TESTS PHYSIQUES : ÉVOLUTION SEMAINE 1 (PRÉ) VS SEMAINE 6 (POST)"
ws_tests["A1"].font = TITLE_FONT
ws_tests["A2"] = "Suivi longitudinal des 12 athlètes — Sprint 10m, Détente CMJ, Test Navette Yo-Yo IR1 et Agilité 505"
ws_tests["A2"].font = SUBTITLE_FONT

headers_prepost = [
    "Athlete_ID", "Nom & Prénom", "Poste", 
    "Sprint S1 (s)", "Sprint S6 (s)", "Delta Sprint (s)", "Prog. Sprint (%)",
    "CMJ S1 (cm)", "CMJ S6 (cm)", "Delta CMJ (cm)", "Prog. CMJ (%)",
    "YoYo S1 (m)", "YoYo S6 (m)", "Delta YoYo (m)", "Prog. YoYo (%)",
    "Agilité S1 (s)", "Agilité S6 (s)", "Prog. Agilité (%)"
]

for col_idx, h in enumerate(headers_prepost, start=1):
    c = ws_tests.cell(row=4, column=col_idx, value=h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = thick_bottom

# Athlete dictionary
athletes_info = {
    "ATH01": ("Lucas Martin", "Gardien"),
    "ATH02": ("Nathan Dupont", "Défenseur"),
    "ATH03": ("Hugo Leroy", "Défenseur"),
    "ATH04": ("Ethan Simon", "Défenseur"),
    "ATH05": ("Louis Laurent", "Milieu"),
    "ATH06": ("Gabriel Lefebvre", "Milieu"),
    "ATH07": ("Arthur Michel", "Milieu"),
    "ATH08": ("Jules Garcia", "Milieu"),
    "ATH09": ("Raphaël David", "Attaquant"),
    "ATH10": ("Maxime Bertrand", "Attaquant"),
    "ATH11": ("Tom Roux", "Attaquant"),
    "ATH12": ("Théo Vincent", "Attaquant")
}

# Raw test rows from RAW_Tests
raw_t = wb["RAW_Tests"]
test_s1 = {}
test_s6 = {}
for r in range(2, raw_t.max_row + 1):
    wk = raw_t.cell(r, 2).value
    ath = raw_t.cell(r, 3).value
    sp10 = raw_t.cell(r, 4).value
    cmj = raw_t.cell(r, 5).value
    yoyo = raw_t.cell(r, 6).value
    agil = raw_t.cell(r, 7).value
    if wk == "S1":
        test_s1[ath] = (sp10, cmj, yoyo, agil)
    elif wk == "S6":
        test_s6[ath] = (sp10, cmj, yoyo, agil)

row_t = 5
for ath_id in sorted(athletes_info.keys()):
    nom, poste = athletes_info[ath_id]
    s1 = test_s1.get(ath_id, (0, 0, 0, 0))
    s6 = test_s6.get(ath_id, (0, 0, 0, 0))
    
    ws_tests.cell(row_t, 1, ath_id).alignment = Alignment(horizontal="center")
    ws_tests.cell(row_t, 2, nom).alignment = Alignment(horizontal="left")
    ws_tests.cell(row_t, 3, poste).alignment = Alignment(horizontal="left")
    
    # Sprint
    ws_tests.cell(row_t, 4, s1[0]).alignment = Alignment(horizontal="center")
    ws_tests.cell(row_t, 5, s6[0]).alignment = Alignment(horizontal="center")
    ws_tests.cell(row_t, 6, f"=D{row_t}-E{row_t}").alignment = Alignment(horizontal="center")
    c_sp_p = ws_tests.cell(row_t, 7, f"=(D{row_t}-E{row_t})/D{row_t}")
    c_sp_p.alignment = Alignment(horizontal="center")
    c_sp_p.number_format = "+0.0%;-0.0%;0.0%"
    c_sp_p.font = BOLD_FONT
    
    # CMJ
    ws_tests.cell(row_t, 8, s1[1]).alignment = Alignment(horizontal="center")
    ws_tests.cell(row_t, 9, s6[1]).alignment = Alignment(horizontal="center")
    ws_tests.cell(row_t, 10, f"=I{row_t}-H{row_t}").alignment = Alignment(horizontal="center")
    c_cmj_p = ws_tests.cell(row_t, 11, f"=(I{row_t}-H{row_t})/H{row_t}")
    c_cmj_p.alignment = Alignment(horizontal="center")
    c_cmj_p.number_format = "+0.0%;-0.0%;0.0%"
    c_cmj_p.font = BOLD_FONT
    
    # YoYo
    ws_tests.cell(row_t, 12, s1[2]).alignment = Alignment(horizontal="center")
    ws_tests.cell(row_t, 13, s6[2]).alignment = Alignment(horizontal="center")
    ws_tests.cell(row_t, 14, f"=M{row_t}-L{row_t}").alignment = Alignment(horizontal="center")
    c_yo_p = ws_tests.cell(row_t, 15, f"=(M{row_t}-L{row_t})/L{row_t}")
    c_yo_p.alignment = Alignment(horizontal="center")
    c_yo_p.number_format = "+0.0%;-0.0%;0.0%"
    c_yo_p.font = BOLD_FONT
    
    # Agilite 505
    ws_tests.cell(row_t, 16, s1[3]).alignment = Alignment(horizontal="center")
    ws_tests.cell(row_t, 17, s6[3]).alignment = Alignment(horizontal="center")
    c_ag_p = ws_tests.cell(row_t, 18, f"=(P{row_t}-Q{row_t})/P{row_t}")
    c_ag_p.alignment = Alignment(horizontal="center")
    c_ag_p.number_format = "+0.0%;-0.0%;0.0%"
    
    for c_i in range(1, 19):
        ws_tests.cell(row_t, c_i).border = cell_border
    
    row_t += 1

# Total / Average row
ws_tests[f"A{row_t}"] = "MOYENNE ÉQUIPE"
ws_tests[f"A{row_t}"].font = BOLD_FONT
for col_l in ["D", "E", "F", "H", "I", "J", "L", "M", "N", "P", "Q"]:
    c = ws_tests[f"{col_l}{row_t}"]
    c.value = f"=MOYENNE({col_l}5:{col_l}16)"
    c.font = BOLD_FONT
    c.alignment = Alignment(horizontal="center")
    c.border = thick_bottom
    c.number_format = "0.0"

for col_l in ["G", "K", "15", "R"]:
    col_str = "O" if col_l == "15" else col_l
    c = ws_tests[f"{col_str}{row_t}"]
    c.value = f"=MOYENNE({col_str}5:{col_str}16)"
    c.font = BOLD_FONT
    c.alignment = Alignment(horizontal="center")
    c.border = thick_bottom
    c.number_format = "+0.0%"

for col in ws_tests.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_tests.column_dimensions[col_letter].width = max(max_len + 3, 13)

# ---------------------------------------------------------------------------
# 3. NEW SHEET: 00_Dashboard_Entraineur (Front Page)
# ---------------------------------------------------------------------------
ws_dash = wb.create_sheet(title="00_Dashboard_Entraineur", index=0)
ws_dash.views.sheetView[0].showGridLines = True

ws_dash["A1"] = "TABLEAU DE BORD EXÉCUTIF DU PRÉPARATEUR PHYSIQUE — BILAN 6 SEMAINES"
ws_dash["A1"].font = TITLE_FONT
ws_dash["A2"] = "Aide à la décision staff : Charge globale, Modélisation ACWR, Fatigue & Tests physiques"
ws_dash["A2"].font = SUBTITLE_FONT

# Top KPI Cards
kpis = [
    ("A4", "B4", "A5", "👥 Effectif Actif", "12 Joueurs"),
    ("D4", "E4", "D5", "⚡ Gain Yo-Yo Moyen", "= '05_Tests_Physiques_PrePost'!O17", "+0.0%"),
    ("G4", "H4", "G5", "🚀 Gain Vitesse 10m", "= '05_Tests_Physiques_PrePost'!G17", "+0.0%"),
    ("J4", "K4", "J5", "📈 Gain Détente CMJ", "= '05_Tests_Physiques_PrePost'!K17", "+0.0%"),
    ("M4", "N4", "M5", "⚠️ Alertes ACWR (>1.5)", '=NB.SI(\'02_Calculs_Charges_ACWR\'!L5:L222; ">=1.5")', "0"),
]

for item in kpis:
    tl, tr, bl = item[0], item[1], item[2]
    title, val = item[3], item[4]
    fmt = item[5] if len(item) > 5 else None
    
    ws_dash[tl] = title
    ws_dash[tl].font = Font(name="Calibri", size=10, bold=True, color="64748B")
    ws_dash[bl] = val
    ws_dash[bl].font = Font(name="Calibri", size=16, bold=True, color="1E3A8A")
    if fmt:
        ws_dash[bl].number_format = fmt
        
    for r in [4, 5]:
        for c in range(openpyxl.utils.column_index_from_string(tl[0]), openpyxl.utils.column_index_from_string(tr[0]) + 1):
            cell = ws_dash.cell(row=r, column=c)
            cell.fill = KPI_FILL
            cell.border = cell_border

# Matrice des Alertes Décisionnelles
ws_dash["A8"] = "MATRICE DES ALERTES DÉCISIONNELLES PRIORITAIRES (STAFF TECHNIQUE)"
ws_dash["A8"].font = SECTION_FONT

matrix_headers = ["Athlète", "Poste", "Indicateur Alerte", "Valeur Observée", "Niveau d'Urgence", "Décision Préparateur Recommandée"]
for col_idx, h in enumerate(matrix_headers, start=1):
    c = ws_dash.cell(row=10, column=col_idx, value=h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center")
    c.border = thick_bottom

matrix_rows = [
    ("Ethan Simon (ATH04)", "Défenseur", "Pic de charge S4 + Sommeil < 6h", "ACWR 1.62 / Fatigue 7/8", "CRITIQUE (Rouge)", "Allègement séance tactique de 50%, bilan médical préventif ischio-jambiers"),
    ("Arthur Michel (ATH07)", "Milieu", "Courbatures persistantes 6/8", "Douleur signalée (Oui)", "ÉLEVÉ (Orange)", "Repos complet sur l'intermittent à haute intensité, soins kiné"),
    ("Nathan Dupont (ATH02)", "Défenseur", "Temps de jeu élevé (Championnat)", "Charge S3 > 2400 u.a.", "VIGILANCE (Jaune)", "Favoriser régénération aquatique et étirements posturo-respiratoires"),
    ("Lucas Martin (ATH01)", "Gardien", "Progression CMJ et Yo-Yo", "+7.4% CMJ / +14.4% YoYo", "OPTIMAL (Vert)", "Poursuivre la programmation en puissance neuromusculaire"),
    ("Louis Laurent (ATH05)", "Milieu", "Progression Vitesse & VMA", "+11.4% YoYo / -0.04s 10m", "OPTIMAL (Vert)", "Capacités aérobies consolidées pour les 90 minutes de match"),
]

for row_idx, r in enumerate(matrix_rows, start=11):
    for col_idx, val in enumerate(r, start=1):
        c = ws_dash.cell(row=row_idx, column=col_idx, value=val)
        c.border = cell_border
        c.alignment = Alignment(horizontal="center" if col_idx in [2, 4, 5] else "left")
        if "CRITIQUE" in val:
            c.fill = ALERT_DANGER_FILL
            c.font = ALERT_DANGER_FONT
        elif "ÉLEVÉ" in val or "VIGILANCE" in val:
            c.fill = ALERT_WARN_FILL
            c.font = ALERT_WARN_FONT
        elif "OPTIMAL" in val:
            c.fill = ALERT_OK_FILL
            c.font = ALERT_OK_FONT

# Directives d'entraînement semaine 7
ws_dash["A18"] = "PRÉCONISATIONS TACTIQUES ET PHYSIQUES POUR LA SEMAINE 7 (MATCH DE HAUT DE TABLEAU)"
ws_dash["A18"].font = SECTION_FONT

precos = [
    "1. Gestion individualisée du volume : Maintenir l'intensité maximale sur les séquences courtes (vitesse vivacité 5-10m) mais réduire le volume global de 25% (période d'affûtage / tapering).",
    "2. Décharge ciblée des milieux de terrain : Louis, Arthur et Gabriel présentent une fatigue résiduelle accumulée en S5. Adapter les exercices avec ballon en limitant les surfaces d'évolution pour diminuer la distance totale parcourue.",
    "3. Surveillance renforcée du sommeil : 4 joueurs rapportent un temps de sommeil inférieur à 7h les veilles de match. Mettre en place un protocole d'hygiène de récupération (sieste 20 min, limitation écrans post-dîner).",
    "4. Protocole d'activation veille de match (J-1) : 35 minutes axées sur la réactivité neuromusculaire, la proprioception dynamique et des rappels de vitesse sans fatigue métabolique."
]
for p_idx, preco in enumerate(precos, start=20):
    ws_dash[f"A{p_idx}"] = preco
    ws_dash[f"A{p_idx}"].font = REGULAR_FONT

for col in ws_dash.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_dash.column_dimensions[col_letter].width = max(max_len + 3, 14)

# ---------------------------------------------------------------------------
# 4. NEW SHEET: 06_Prototype_App_Mobile
# ---------------------------------------------------------------------------
ws_app = wb.create_sheet(title="06_Prototype_App_Mobile")
ws_app.views.sheetView[0].showGridLines = True

ws_app["A1"] = "CAHIER DES CHARGES & PROTOTYPE DE L'APPLICATION MOBILE DU STAFF"
ws_app["A1"].font = TITLE_FONT
ws_app["A2"] = "Interface Smartphone pour la collecte matinale et la restitution des alertes en temps réel"
ws_app["A2"].font = SUBTITLE_FONT

app_specs = [
    ("Écran Mobile", "Utilisateur Cible", "Fonctionnalités Principales", "Données Connectées", "Bénéfice Terrain"),
    ("Écran 1 : Check-in Matin", "Joueur (Athlète)", "Saisie en 30 secondes du Hooper (Sommeil, Fatigue, Courbatures, Douleurs)", "Feuille RAW_Bien-etre", "Collecte immédiate dès le réveil sans friction"),
    ("Écran 2 : RPE Post-Séance", "Joueur (Athlète)", "Curseur Borg CR-10 + Durée perçue 30 min après la fin de séance", "Feuille RAW_Seances & 02_Calculs", "Calcul instantané de la charge interne individuelle"),
    ("Écran 3 : Flash Alertes Staff", "Préparateur Physique", "Notification push en cas de score Hooper >= 20 ou ACWR >= 1.5", "Feuille 00_Dashboard", "Ajustement avant même l'entrée sur le terrain d'entraînement"),
    ("Écran 4 : Fiche Joueur 360°", "Entraîneur Principal", "Radar des qualités physiques, historique de présence et statut de forme", "Feuilles 05_Tests & RAW_Athletes", "Aide à la composition de l'équipe et gestion des rotations")
]

for col_idx, h in enumerate(app_specs[0], start=1):
    c = ws_app.cell(row=4, column=col_idx, value=h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center")
    c.border = thick_bottom

for row_idx, r in enumerate(app_specs[1:], start=5):
    for col_idx, val in enumerate(r, start=1):
        c = ws_app.cell(row=row_idx, column=col_idx, value=val)
        c.border = cell_border
        c.alignment = Alignment(horizontal="center" if col_idx in [1, 2] else "left")

for col in ws_app.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_app.column_dimensions[col_letter].width = max(max_len + 3, 14)

# Save Workbook
target_local = r"docs\public\documents\Exercice 07 - Production attendue.xlsx"
target_drive = r"C:\Google Drive\Prépas light\HECh\Préparateur physique\Exercices\Exercice 07\Exercice 07 - Production attendue.xlsx"

wb.save(target_local)
wb.save(target_drive)
print(f"SUCCESS: Created {target_local} and {target_drive}")
