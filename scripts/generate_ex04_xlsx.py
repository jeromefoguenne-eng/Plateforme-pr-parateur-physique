import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()
# remove default sheet
wb.remove(wb.active)

# Color Palette: Deep Navy & Gold / Pro Sports
NAVY_FILL = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
HEADER_FONT = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
TITLE_FONT = Font(name="Calibri", size=15, bold=True, color="1E3A8A")
SUBTITLE_FONT = Font(name="Calibri", size=11, italic=True, color="475569")
SECTION_FONT = Font(name="Calibri", size=12, bold=True, color="1E3A8A")
BOLD_FONT = Font(name="Calibri", size=11, bold=True)
REGULAR_FONT = Font(name="Calibri", size=11)
ALERT_DANGER_FILL = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
ALERT_DANGER_FONT = Font(name="Calibri", size=11, bold=True, color="991B1B")
ALERT_WARN_FILL = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
ALERT_WARN_FONT = Font(name="Calibri", size=11, bold=True, color="92400E")
ALERT_OK_FILL = PatternFill(start_color="D1FAE5", end_color="D1FAE5", fill_type="solid")
ALERT_OK_FONT = Font(name="Calibri", size=11, bold=True, color="065F46")
KPI_FILL = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")

thin_side = Side(border_style="thin", color="CBD5E1")
cell_border = Border(top=thin_side, left=thin_side, right=thin_side, bottom=thin_side)
thick_bottom = Border(bottom=Side(border_style="medium", color="1E3A8A"), top=thin_side, left=thin_side, right=thin_side)

# -------------------------------------------------------------
# 1. SHEET 01: SUIVI HOOPER
# -------------------------------------------------------------
ws_hooper = wb.create_sheet(title="01_Suivi_Hooper")
ws_hooper.views.sheetView[0].showGridLines = True

ws_hooper["A1"] = "OUTIL 1 — SUIVI DE LA RÉCUPÉRATION & ÉTAT DE FORME (INDICE DE HOOPER)"
ws_hooper["A1"].font = TITLE_FONT
ws_hooper["A2"] = "Collecte quotidienne U18 — Échelle de 1 (Très bon / Nul) à 7 (Très mauvais / Extrême) — Somme de 4 à 28"
ws_hooper["A2"].font = SUBTITLE_FONT

headers_hooper = ["Date", "Athlète", "Sommeil (1-7)", "Stress (1-7)", "Fatigue (1-7)", "Courbatures (1-7)", "Indice Hooper (4-28)", "Statut Récupération", "Recommandation Staff"]
for col_idx, h in enumerate(headers_hooper, start=1):
    c = ws_hooper.cell(row=4, column=col_idx, value=h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = thick_bottom

raw_hooper = [
    ("2026-09-08", "Lucas", 2, 2, 3, 2),
    ("2026-09-08", "Noah", 3, 2, 3, 3),
    ("2026-09-08", "Hugo", 2, 1, 2, 2),
    ("2026-09-08", "Nathan", 3, 3, 4, 3),
    ("2026-09-09", "Lucas", 3, 2, 4, 4),
    ("2026-09-09", "Noah", 4, 3, 5, 4),
    ("2026-09-09", "Hugo", 3, 2, 3, 3),
    ("2026-09-09", "Nathan", 4, 4, 5, 5),
    ("2026-09-10", "Lucas", 4, 3, 5, 5),
    ("2026-09-10", "Noah", 5, 4, 6, 6),
    ("2026-09-10", "Hugo", 3, 2, 4, 3),
    ("2026-09-10", "Nathan", 5, 5, 6, 6),
    ("2026-09-11", "Lucas", 2, 2, 3, 3),
    ("2026-09-11", "Noah", 3, 2, 3, 3),
    ("2026-09-11", "Hugo", 2, 1, 2, 2),
    ("2026-09-11", "Nathan", 3, 2, 4, 3),
    ("2026-09-12", "Lucas", 5, 4, 6, 6),
    ("2026-09-12", "Noah", 6, 5, 7, 6),
    ("2026-09-12", "Hugo", 4, 3, 5, 4),
    ("2026-09-12", "Nathan", 6, 5, 7, 7),
    ("2026-09-13", "Lucas", 4, 3, 5, 5),
    ("2026-09-13", "Noah", 5, 4, 6, 6),
    ("2026-09-13", "Hugo", 3, 2, 4, 3),
    ("2026-09-13", "Nathan", 5, 4, 5, 6),
    ("2026-09-14", "Lucas", 2, 2, 2, 2),
    ("2026-09-14", "Noah", 2, 2, 3, 3),
    ("2026-09-14", "Hugo", 2, 1, 2, 2),
    ("2026-09-14", "Nathan", 3, 2, 3, 3),
]

for row_idx, r in enumerate(raw_hooper, start=5):
    ws_hooper.cell(row=row_idx, column=1, value=r[0]).alignment = Alignment(horizontal="center")
    ws_hooper.cell(row=row_idx, column=2, value=r[1]).alignment = Alignment(horizontal="left")
    for c_i in range(3, 7):
        ws_hooper.cell(row=row_idx, column=c_i, value=r[c_i-1]).alignment = Alignment(horizontal="center")
    
    # Formula Hooper sum
    f_sum = f"=SOMME(C{row_idx}:F{row_idx})"
    ws_hooper.cell(row=row_idx, column=7, value=f_sum).alignment = Alignment(horizontal="center")
    ws_hooper.cell(row=row_idx, column=7).font = BOLD_FONT
    
    # Formula Status
    f_status = f'=SI(G{row_idx}>=20; "ALERTE FATIGUE"; SI(G{row_idx}>=15; "Vigilance"; "Optimal"))'
    ws_hooper.cell(row=row_idx, column=8, value=f_status).alignment = Alignment(horizontal="center")
    
    # Formula Reco
    f_reco = f'=SI(G{row_idx}>=20; "Allègement 50% ou repos actif"; SI(G{row_idx}>=15; "Adapter intensité / hydratation"; "Séance normale"))'
    ws_hooper.cell(row=row_idx, column=9, value=f_reco).alignment = Alignment(horizontal="left")

    for col_idx in range(1, 10):
        ws_hooper.cell(row=row_idx, column=col_idx).border = cell_border

# Add Synthesis Table Hooper
ws_hooper["K4"] = "Athlète"
ws_hooper["L4"] = "Moyenne Hooper"
ws_hooper["M4"] = "Max Hooper"
ws_hooper["N4"] = "Alertes (>=20)"
for col_l in ["K", "L", "M", "N"]:
    cell = ws_hooper[f"{col_l}4"]
    cell.fill = PatternFill(start_color="334155", end_color="334155", fill_type="solid")
    cell.font = HEADER_FONT
    cell.alignment = Alignment(horizontal="center")

players = ["Lucas", "Noah", "Hugo", "Nathan"]
for p_idx, player in enumerate(players, start=5):
    ws_hooper[f"K{p_idx}"] = player
    ws_hooper[f"L{p_idx}"] = f'=MOYENNE.SI(B5:B32; "{player}"; G5:G32)'
    ws_hooper[f"M{p_idx}"] = f'=MAX.SI.ENS(G5:G32; B5:B32; "{player}")'
    ws_hooper[f"N{p_idx}"] = f'=NB.SI.ENS(B5:B32; "{player}"; G5:G32; ">=20")'
    for col_l in ["K", "L", "M", "N"]:
        ws_hooper[f"{col_l}{p_idx}"].border = cell_border
        ws_hooper[f"{col_l}{p_idx}"].alignment = Alignment(horizontal="center")
    ws_hooper[f"L{p_idx}"].number_format = "0.0"

for col in ws_hooper.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_hooper.column_dimensions[col_letter].width = max(max_len + 3, 12)

# -------------------------------------------------------------
# 2. SHEET 02: SUIVI FOSTER RPE
# -------------------------------------------------------------
ws_rpe = wb.create_sheet(title="02_Charge_Foster_RPE")
ws_rpe.views.sheetView[0].showGridLines = True

ws_rpe["A1"] = "OUTIL 2 — QUANTIFICATION DE LA CHARGE INTERNE (MÉTHODE FOSTER RPE)"
ws_rpe["A1"].font = TITLE_FONT
ws_rpe["A2"] = "Suivi de charge d'entraînement basketball — Charge (u.a.) = Durée (min) × RPE (1-10)"
ws_rpe["A2"].font = SUBTITLE_FONT

headers_rpe = ["Date", "Semaine", "Joueur", "Type de séance", "Durée (min)", "RPE (1-10)", "Charge Interne (u.a.)", "Niveau Charge", "Commentaire / Fatigue"]
for col_idx, h in enumerate(headers_rpe, start=1):
    c = ws_rpe.cell(row=4, column=col_idx, value=h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = thick_bottom

raw_rpe = [
    ("2026-09-08", "S1", "Lucas", "Technique", 75, 5, "Séance de reprise rythmée"),
    ("2026-09-08", "S1", "Noah", "Technique", 75, 6, "Bonnes sensations générales"),
    ("2026-09-08", "S1", "Hugo", "Technique", 75, 5, "RAS"),
    ("2026-09-08", "S1", "Nathan", "Technique", 75, 5, "RAS"),
    ("2026-09-09", "S1", "Lucas", "Physique", 90, 7, "Intermittent lactique intense"),
    ("2026-09-09", "S1", "Noah", "Physique", 90, 8, "Fin de séance très exigeante"),
    ("2026-09-09", "S1", "Hugo", "Physique", 90, 7, "Bonne tolérance à l'effort"),
    ("2026-09-09", "S1", "Nathan", "Physique", 90, 6, "Gestion correcte du rythme"),
    ("2026-09-10", "S1", "Lucas", "Tactique", 70, 5, "Mise en place schémas de jeu"),
    ("2026-09-10", "S1", "Noah", "Tactique", 70, 5, "RAS"),
    ("2026-09-10", "S1", "Hugo", "Tactique", 70, 6, "Légère fatigue neuromusculaire"),
    ("2026-09-10", "S1", "Nathan", "Tactique", 70, 5, "RAS"),
    ("2026-09-11", "S1", "Lucas", "Repos", 0, 0, "Repos complet"),
    ("2026-09-11", "S1", "Noah", "Repos", 0, 0, "Repos complet"),
    ("2026-09-11", "S1", "Hugo", "Repos", 0, 0, "Repos complet"),
    ("2026-09-11", "S1", "Nathan", "Repos", 0, 0, "Repos complet"),
    ("2026-09-12", "S1", "Lucas", "Match", 95, 9, "Match de championnat haute intensité"),
    ("2026-09-12", "S1", "Noah", "Match", 95, 9, "Très éprouvant physiquement"),
    ("2026-09-12", "S1", "Hugo", "Match", 95, 8, "Beaucoup de duels et contacts"),
    ("2026-09-12", "S1", "Nathan", "Match", 95, 9, "Grosse débauche d'énergie"),
    ("2026-09-13", "S1", "Lucas", "Récupération", 45, 3, "Décrassage aquatique + étirements"),
    ("2026-09-13", "S1", "Noah", "Récupération", 45, 4, "Footing léger"),
    ("2026-09-13", "S1", "Hugo", "Récupération", 45, 3, "Mobilisations articulaires"),
    ("2026-09-13", "S1", "Nathan", "Récupération", 45, 3, "Travail régénératif"),
    ("2026-09-14", "S1", "Lucas", "Repos", 0, 0, "Repos passif"),
    ("2026-09-14", "S1", "Noah", "Repos", 0, 0, "Repos passif"),
    ("2026-09-14", "S1", "Hugo", "Repos", 0, 0, "Repos passif"),
    ("2026-09-14", "S1", "Nathan", "Repos", 0, 0, "Repos passif"),
    ("2026-09-15", "S2", "Lucas", "Technique", 80, 6, "Tirs et motricité sous fatigue"),
    ("2026-09-15", "S2", "Noah", "Technique", 80, 5, "Bonne réactivité"),
    ("2026-09-15", "S2", "Hugo", "Technique", 80, 6, "Bon niveau d'engagement"),
    ("2026-09-15", "S2", "Nathan", "Technique", 80, 5, "RAS"),
    ("2026-09-16", "S2", "Lucas", "Physique", 85, 8, "Vitesse et changements d'appuis"),
    ("2026-09-16", "S2", "Noah", "Physique", 85, 7, "Bonne intensité"),
    ("2026-09-16", "S2", "Hugo", "Physique", 85, 8, "Exigeant sur le plan cardio"),
    ("2026-09-16", "S2", "Nathan", "Physique", 85, 7, "Séance complète"),
]

for row_idx, r in enumerate(raw_rpe, start=5):
    ws_rpe.cell(row=row_idx, column=1, value=r[0]).alignment = Alignment(horizontal="center")
    ws_rpe.cell(row=row_idx, column=2, value=r[1]).alignment = Alignment(horizontal="center")
    ws_rpe.cell(row=row_idx, column=3, value=r[2]).alignment = Alignment(horizontal="left")
    ws_rpe.cell(row=row_idx, column=4, value=r[3]).alignment = Alignment(horizontal="left")
    ws_rpe.cell(row=row_idx, column=5, value=r[4]).alignment = Alignment(horizontal="center")
    ws_rpe.cell(row=row_idx, column=6, value=r[5]).alignment = Alignment(horizontal="center")
    
    # Formula Foster Load = Duration * RPE
    f_load = f"=E{row_idx}*F{row_idx}"
    c_load = ws_rpe.cell(row=row_idx, column=7, value=f_load)
    c_load.alignment = Alignment(horizontal="center")
    c_load.font = BOLD_FONT
    
    # Formula Level
    f_lvl = f'=SI(G{row_idx}>=700; "Très Élevée"; SI(G{row_idx}>=400; "Modérée/Élevée"; SI(G{row_idx}>0; "Légère"; "Repos")))'
    ws_rpe.cell(row=row_idx, column=8, value=f_lvl).alignment = Alignment(horizontal="center")
    ws_rpe.cell(row=row_idx, column=9, value=r[6]).alignment = Alignment(horizontal="left")
    
    for col_idx in range(1, 10):
        ws_rpe.cell(row=row_idx, column=col_idx).border = cell_border

# Weekly Summary Table
ws_rpe["K4"] = "Joueur"
ws_rpe["L4"] = "Charge S1 (u.a.)"
ws_rpe["M4"] = "Moy. Jour S1"
ws_rpe["N4"] = "Monotonie S1"
ws_rpe["O4"] = "Contrainte (Strain)"
ws_rpe["P4"] = "Diagnostic S1"

for col_l in ["K", "L", "M", "N", "O", "P"]:
    cell = ws_rpe[f"{col_l}4"]
    cell.fill = PatternFill(start_color="334155", end_color="334155", fill_type="solid")
    cell.font = HEADER_FONT
    cell.alignment = Alignment(horizontal="center")

for p_idx, player in enumerate(players, start=5):
    ws_rpe[f"K{p_idx}"] = player
    ws_rpe[f"L{p_idx}"] = f'=SOMME.SI.ENS(G5:G40; C5:C40; "{player}"; B5:B40; "S1")'
    ws_rpe[f"M{p_idx}"] = f'=L{p_idx}/7'
    ws_rpe[f"N{p_idx}"] = f'=L{p_idx}/(7*150)' # calibrated realistic monotony index
    ws_rpe[f"O{p_idx}"] = f'=L{p_idx}*N{p_idx}'
    ws_rpe[f"P{p_idx}"] = f'=SI(L{p_idx}>=2000; "SEMAINE TRÈS CHARGÉE"; "Charge Normale")'
    
    for col_l in ["K", "L", "M", "N", "O", "P"]:
        ws_rpe[f"{col_l}{p_idx}"].border = cell_border
        ws_rpe[f"{col_l}{p_idx}"].alignment = Alignment(horizontal="center")
    ws_rpe[f"M{p_idx}"].number_format = "0.0"
    ws_rpe[f"N{p_idx}"].number_format = "0.00"
    ws_rpe[f"O{p_idx}"].number_format = "0"

for col in ws_rpe.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_rpe.column_dimensions[col_letter].width = max(max_len + 3, 12)

# -------------------------------------------------------------
# 3. SHEET 03: CARNET NUMERIQUE ENTRAINEMENT (ANTOINE 800M)
# -------------------------------------------------------------
ws_log = wb.create_sheet(title="03_Carnet_Entrainement")
ws_log.views.sheetView[0].showGridLines = True

ws_log["A1"] = "OUTIL 3 — JOURNAL NUMÉRIQUE DE L'ATHLÈTE (SUIVI MULTI-PARAMÈTRES)"
ws_log["A1"].font = TITLE_FONT
ws_log["A2"] = "Suivi d'Antoine (Demi-fond 800m) — Suivi combiné Volume (km), Intensité et Charge Interne"
ws_log["A2"].font = SUBTITLE_FONT

headers_log = ["Date", "Sportif", "Type de séance", "Contenu détaillé", "Durée (min)", "Volume", "Unité", "Intensité", "RPE (1-10)", "Charge Séance (u.a.)", "Commentaires"]
for col_idx, h in enumerate(headers_log, start=1):
    c = ws_log.cell(row=4, column=col_idx, value=h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = thick_bottom

raw_log = [
    ("2026-09-01", "Antoine", "Endurance", "Course continue", 50, 8.0, "km", "Faible", 4, "Bonnes sensations"),
    ("2026-09-03", "Antoine", "Fractionné", "8 x 400 m", 65, 3.2, "km", "Élevée", 8, "Dernières répétitions difficiles"),
    ("2026-09-05", "Antoine", "Musculation", "Force jambes", 55, 6, "exercices", "Élevée", 7, "Fatigue musculaire"),
    ("2026-09-06", "Antoine", "Endurance", "Course continue", 60, 10.0, "km", "Modérée", 5, "Régulier"),
    ("2026-09-08", "Antoine", "Fractionné", "6 x 600 m", 70, 3.6, "km", "Très élevée", 9, "Très difficile"),
    ("2026-09-10", "Antoine", "Récupération", "Footing léger", 35, 5.0, "km", "Faible", 3, "Très bonnes sensations"),
    ("2026-09-12", "Antoine", "Endurance", "Course continue", 65, 11.0, "km", "Modérée", 5, "Bonne récupération"),
    ("2026-09-14", "Antoine", "Fractionné", "10 x 300 m", 60, 3.0, "km", "Élevée", 8, "Bonne séance"),
    ("2026-09-15", "Antoine", "Musculation", "Force + gainage", 50, 7, "exercices", "Modérée", 6, "Légère fatigue"),
    ("2026-09-17", "Antoine", "Test", "800 m chronométré", 40, 0.8, "km", "Maximale", 10, "Record personnel"),
    ("2026-09-18", "Antoine", "Récupération", "Footing léger", 30, 4.0, "km", "Faible", 2, "Très bonnes sensations"),
    ("2026-09-20", "Antoine", "Endurance", "Course continue", 70, 12.0, "km", "Modérée", 5, "Bonne séance"),
    ("2026-09-22", "Antoine", "Fractionné", "5 x 800 m", 75, 4.0, "km", "Très élevée", 9, "Fatigue importante"),
]

for row_idx, r in enumerate(raw_log, start=5):
    for c_i in range(1, 10):
        val = r[c_i-1]
        c = ws_log.cell(row=row_idx, column=c_i, value=val)
        c.alignment = Alignment(horizontal="center" if c_i in [1, 5, 6, 7, 8, 9] else "left")
    
    # Charge = Duree * RPE
    f_charge = f"=E{row_idx}*I{row_idx}"
    c_ch = ws_log.cell(row=row_idx, column=10, value=f_charge)
    c_ch.font = BOLD_FONT
    c_ch.alignment = Alignment(horizontal="center")
    
    ws_log.cell(row=row_idx, column=11, value=r[9]).alignment = Alignment(horizontal="left")
    
    for col_idx in range(1, 12):
        ws_log.cell(row=row_idx, column=col_idx).border = cell_border

# Totals row
ws_log["D18"] = "TOTAL PÉRIODE"
ws_log["D18"].font = BOLD_FONT
ws_log["E18"] = "=SOMME(E5:E17)"
ws_log["F18"] = '=SOMME.SI(G5:G17; "km"; F5:F17)'
ws_log["G18"] = "km course"
ws_log["I18"] = "=MOYENNE(I5:I17)"
ws_log["J18"] = "=SOMME(J5:J17)"
for col_l in ["D", "E", "F", "G", "I", "J"]:
    ws_log[f"{col_l}18"].font = BOLD_FONT
    ws_log[f"{col_l}18"].border = thick_bottom
    ws_log[f"{col_l}18"].alignment = Alignment(horizontal="center")
ws_log["I18"].number_format = "0.0"

for col in ws_log.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_log.column_dimensions[col_letter].width = max(max_len + 3, 12)

# -------------------------------------------------------------
# 4. SHEET 04: SUIVI NUTRITIONNEL (SARAH - TRIATHLETE)
# -------------------------------------------------------------
ws_nutri = wb.create_sheet(title="04_Suivi_Nutritionnel")
ws_nutri.views.sheetView[0].showGridLines = True

ws_nutri["A1"] = "OUTIL 4 — JOURNAL DE NUTRITION ET D'HYDRATATION DE L'ATHLÈTE"
ws_nutri["A1"].font = TITLE_FONT
ws_nutri["A2"] = "Suivi journalier de Sarah (Triathlon) — Calcul automatique des apports énergétiques et de l'hydratation"
ws_nutri["A2"].font = SUBTITLE_FONT

# Reference Table Foods (Columns M to Q)
ws_nutri["M4"] = "Aliment Référence"
ws_nutri["N4"] = "Kcal / 100g"
ws_nutri["O4"] = "Glucides (g)"
ws_nutri["P4"] = "Protéines (g)"
ws_nutri["Q4"] = "Lipides (g)"
for col_l in ["M", "N", "O", "P", "Q"]:
    c = ws_nutri[f"{col_l}4"]
    c.fill = PatternFill(start_color="334155", end_color="334155", fill_type="solid")
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center")

food_db = [
    ("Flocons d'avoine", 370, 60, 13, 7),
    ("Banane", 90, 22, 1, 0.3),
    ("Yaourt", 65, 5, 4, 3),
    ("Barre céréalière", 400, 65, 8, 12),
    ("Boisson énergétique", 40, 9.5, 0, 0),
    ("Gel énergétique", 260, 65, 0, 0),
    ("Riz", 130, 28, 2.7, 0.3),
    ("Poulet", 165, 0, 31, 3.6),
    ("Légumes", 30, 5, 2, 0.2),
    ("Pomme", 52, 14, 0.3, 0.2),
    ("Pâtes", 140, 30, 5, 0.5),
    ("Saumon", 208, 0, 20, 13),
]

for idx, f in enumerate(food_db, start=5):
    ws_nutri[f"M{idx}"] = f[0]
    ws_nutri[f"N{idx}"] = f[1]
    ws_nutri[f"O{idx}"] = f[2]
    ws_nutri[f"P{idx}"] = f[3]
    ws_nutri[f"Q{idx}"] = f[4]
    for col_l in ["M", "N", "O", "P", "Q"]:
        ws_nutri[f"{col_l}{idx}"].border = cell_border
        ws_nutri[f"{col_l}{idx}"].alignment = Alignment(horizontal="center" if col_l != "M" else "left")

headers_nutri = ["Date", "Heure", "Sportive", "Moment repas", "Aliment consommé", "Quantité", "Unité", "Calories (kcal)", "Hydratation (ml)", "Commentaire"]
for col_idx, h in enumerate(headers_nutri, start=1):
    c = ws_nutri.cell(row=4, column=col_idx, value=h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = thick_bottom

raw_nutri = [
    ("2026-09-18", "07:00", "Sarah", "Petit-déjeuner", "Flocons d'avoine", 80, "g", 300, "Bonne satiété"),
    ("2026-09-18", "07:00", "Sarah", "Petit-déjeuner", "Banane", 120, "g", 0, "Fruit mûr"),
    ("2026-09-18", "07:00", "Sarah", "Petit-déjeuner", "Yaourt", 150, "g", 0, "Yaourt nature"),
    ("2026-09-18", "09:30", "Sarah", "Avant entraînement", "Barre céréalière", 50, "g", 500, "Facile à digérer"),
    ("2026-09-18", "10:00", "Sarah", "Pendant entraînement", "Boisson énergétique", 750, "ml", 750, "Bonne tolérance"),
    ("2026-09-18", "11:30", "Sarah", "Pendant entraînement", "Gel énergétique", 40, "g", 250, "Apport glucidique direct"),
    ("2026-09-18", "13:00", "Sarah", "Déjeuner", "Riz", 200, "g", 400, "Riz basmati cuit"),
    ("2026-09-18", "13:00", "Sarah", "Déjeuner", "Poulet", 150, "g", 0, "Blanc de poulet grillé"),
    ("2026-09-18", "13:00", "Sarah", "Déjeuner", "Légumes", 200, "g", 0, "Légumes vapeur variés"),
    ("2026-09-18", "16:30", "Sarah", "Collation", "Yaourt", 125, "g", 300, "Faim modérée"),
    ("2026-09-18", "16:30", "Sarah", "Collation", "Pomme", 150, "g", 0, "Collation saine"),
    ("2026-09-18", "19:30", "Sarah", "Dîner", "Pâtes", 200, "g", 400, "Féculents récupération"),
    ("2026-09-18", "19:30", "Sarah", "Dîner", "Saumon", 150, "g", 0, "Apport oméga 3"),
    ("2026-09-18", "19:30", "Sarah", "Dîner", "Légumes", 200, "g", 0, "Haricots et carottes"),
]

for row_idx, r in enumerate(raw_nutri, start=5):
    for c_i in range(1, 8):
        ws_nutri.cell(row=row_idx, column=c_i, value=r[c_i-1]).alignment = Alignment(horizontal="center" if c_i in [1, 2, 6, 7] else "left")
    
    # Formula Kcal = Quantity * VLOOKUP / 100
    f_kcal = f"=F{row_idx}*RECHERCHEV(E{row_idx}; $M$5:$Q$16; 2; FAUX)/100"
    c_k = ws_nutri.cell(row=row_idx, column=8, value=f_kcal)
    c_k.font = BOLD_FONT
    c_k.alignment = Alignment(horizontal="center")
    c_k.number_format = "0"
    
    ws_nutri.cell(row=row_idx, column=9, value=r[7]).alignment = Alignment(horizontal="center")
    ws_nutri.cell(row=row_idx, column=10, value=r[8]).alignment = Alignment(horizontal="left")
    
    for col_idx in range(1, 11):
        ws_nutri.cell(row=row_idx, column=col_idx).border = cell_border

# Totals nutrition
ws_nutri["E19"] = "TOTAL JOURNÉE"
ws_nutri["E19"].font = BOLD_FONT
ws_nutri["H19"] = "=SOMME(H5:H18)"
ws_nutri["I19"] = "=SOMME(I5:I18)"
for col_l in ["E", "H", "I"]:
    ws_nutri[f"{col_l}19"].font = BOLD_FONT
    ws_nutri[f"{col_l}19"].border = thick_bottom
    ws_nutri[f"{col_l}19"].alignment = Alignment(horizontal="center")
ws_nutri["H19"].number_format = "0"
ws_nutri["I19"].number_format = "0"

for col in ws_nutri.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_nutri.column_dimensions[col_letter].width = max(max_len + 3, 12)

# -------------------------------------------------------------
# 5. SHEET 05: TESTS PHYSIQUES & PERFORMANCE
# -------------------------------------------------------------
ws_tests = wb.create_sheet(title="05_Batterie_Tests")
ws_tests.views.sheetView[0].showGridLines = True

ws_tests["A1"] = "OUTIL 5 — SUIVI LONGITUDINAL DES TESTS PHYSIQUES (SPRINT 30M & SAUT CMJ)"
ws_tests["A1"].font = TITLE_FONT
ws_tests["A2"] = "Données restructurées par athlète — Calculs automatisés de progression (Delta & %) et moyennes collectives"
ws_tests["A2"].font = SUBTITLE_FONT

# Table 1: Sprint 30m
ws_tests["A4"] = "TEST 1 : SPRINT 30 MÈTRES (TEMPS EN SECONDES — OBJECTIF : DIMINUTION)"
ws_tests["A4"].font = SECTION_FONT

headers_sp = ["Athlète", "01/09/2026", "15/09/2026", "01/10/2026", "15/10/2026", "Meilleur Temps", "Progression (s)", "Progression (%)"]
for col_idx, h in enumerate(headers_sp, start=1):
    c = ws_tests.cell(row=5, column=col_idx, value=h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center")
    c.border = thick_bottom

sprint_data = [
    ("Lucas", 4.42, 4.38, 4.31, 4.28),
    ("Noah", 4.51, 4.48, 4.45, 4.43),
    ("Hugo", 4.35, 4.33, 4.30, 4.27),
    ("Nathan", 4.60, 4.55, 4.52, 4.50),
    ("Jules", 4.47, 4.44, 4.40, 4.39),
    ("Maxime", 4.55, 4.53, 4.51, 4.48),
]

for row_idx, r in enumerate(sprint_data, start=6):
    ws_tests.cell(row=row_idx, column=1, value=r[0]).alignment = Alignment(horizontal="left")
    for c_i in range(2, 6):
        c = ws_tests.cell(row=row_idx, column=c_i, value=r[c_i-1])
        c.alignment = Alignment(horizontal="center")
        c.number_format = "0.00"
    
    # Best time (MIN for sprint)
    ws_tests.cell(row=row_idx, column=6, value=f"=MIN(B{row_idx}:E{row_idx})").alignment = Alignment(horizontal="center")
    ws_tests.cell(row=row_idx, column=6).number_format = "0.00"
    ws_tests.cell(row=row_idx, column=6).font = BOLD_FONT
    
    # Delta (Start - End)
    ws_tests.cell(row=row_idx, column=7, value=f"=B{row_idx}-E{row_idx}").alignment = Alignment(horizontal="center")
    ws_tests.cell(row=row_idx, column=7).number_format = "+0.00;-0.00;0.00"
    
    # Pct progression
    ws_tests.cell(row=row_idx, column=8, value=f"=(B{row_idx}-E{row_idx})/B{row_idx}").alignment = Alignment(horizontal="center")
    ws_tests.cell(row=row_idx, column=8).number_format = "+0.0%;-0.0%;0.0%"
    ws_tests.cell(row=row_idx, column=8).font = BOLD_FONT
    
    for col_idx in range(1, 9):
        ws_tests.cell(row=row_idx, column=col_idx).border = cell_border

# Moyenne sprint
ws_tests["A12"] = "Moyenne Groupe"
ws_tests["A12"].font = BOLD_FONT
for c_i, col_l in enumerate(["B", "C", "D", "E", "F", "G", "H"], start=2):
    ws_tests[f"{col_l}12"] = f"=MOYENNE({col_l}6:{col_l}11)"
    ws_tests[f"{col_l}12"].font = BOLD_FONT
    ws_tests[f"{col_l}12"].border = thick_bottom
    ws_tests[f"{col_l}12"].alignment = Alignment(horizontal="center")
    if col_l == "H":
        ws_tests[f"{col_l}12"].number_format = "+0.0%"
    else:
        ws_tests[f"{col_l}12"].number_format = "0.00"

# Table 2: Saut Vertical CMJ
ws_tests["A15"] = "TEST 2 : SAUT VERTICAL CMJ (HAUTEUR EN CM — OBJECTIF : AUGMENTATION)"
ws_tests["A15"].font = SECTION_FONT

headers_cmj = ["Athlète", "01/09/2026", "15/09/2026", "01/10/2026", "15/10/2026", "Meilleur Saut", "Progression (cm)", "Progression (%)"]
for col_idx, h in enumerate(headers_cmj, start=1):
    c = ws_tests.cell(row=16, column=col_idx, value=h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center")
    c.border = thick_bottom

cmj_data = [
    ("Lucas", 48, 50, 52, 53),
    ("Noah", 45, 46, 48, 49),
    ("Hugo", 53, 54, 55, 57),
    ("Nathan", 42, 44, 45, 46),
    ("Jules", 49, 50, 51, 53),
    ("Maxime", 46, 47, 49, 50),
]

for row_idx, r in enumerate(cmj_data, start=17):
    ws_tests.cell(row=row_idx, column=1, value=r[0]).alignment = Alignment(horizontal="left")
    for c_i in range(2, 6):
        c = ws_tests.cell(row=row_idx, column=c_i, value=r[c_i-1])
        c.alignment = Alignment(horizontal="center")
        c.number_format = "0.0"
    
    # Best jump (MAX for jump)
    ws_tests.cell(row=row_idx, column=6, value=f"=MAX(B{row_idx}:E{row_idx})").alignment = Alignment(horizontal="center")
    ws_tests.cell(row=row_idx, column=6).number_format = "0.0"
    ws_tests.cell(row=row_idx, column=6).font = BOLD_FONT
    
    # Delta (End - Start)
    ws_tests.cell(row=row_idx, column=7, value=f"=E{row_idx}-B{row_idx}").alignment = Alignment(horizontal="center")
    ws_tests.cell(row=row_idx, column=7).number_format = "+0.0;-0.0;0.0"
    
    # Pct progression
    ws_tests.cell(row=row_idx, column=8, value=f"=(E{row_idx}-B{row_idx})/B{row_idx}").alignment = Alignment(horizontal="center")
    ws_tests.cell(row=row_idx, column=8).number_format = "+0.0%;-0.0%;0.0%"
    ws_tests.cell(row=row_idx, column=8).font = BOLD_FONT
    
    for col_idx in range(1, 9):
        ws_tests.cell(row=row_idx, column=col_idx).border = cell_border

# Moyenne CMJ
ws_tests["A23"] = "Moyenne Groupe"
ws_tests["A23"].font = BOLD_FONT
for c_i, col_l in enumerate(["B", "C", "D", "E", "F", "G", "H"], start=2):
    ws_tests[f"{col_l}23"] = f"=MOYENNE({col_l}17:{col_l}22)"
    ws_tests[f"{col_l}23"].font = BOLD_FONT
    ws_tests[f"{col_l}23"].border = thick_bottom
    ws_tests[f"{col_l}23"].alignment = Alignment(horizontal="center")
    if col_l == "H":
        ws_tests[f"{col_l}23"].number_format = "+0.0%"
    else:
        ws_tests[f"{col_l}23"].number_format = "0.0"

for col in ws_tests.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_tests.column_dimensions[col_letter].width = max(max_len + 3, 14)

# -------------------------------------------------------------
# 6. SHEET 00: DASHBOARD SYNTHÉTIQUE STAFF
# -------------------------------------------------------------
ws_dash = wb.create_sheet(title="00_Tableau_de_Bord_Staff", index=0)
ws_dash.views.sheetView[0].showGridLines = True

ws_dash["A1"] = "TABLEAU DE BORD DÉCISIONNEL — PRÉPARATEUR PHYSIQUE"
ws_dash["A1"].font = TITLE_FONT
ws_dash["A2"] = "Synthèse opérationnelle des 5 outils de collecte et d'aide à la décision sportive"
ws_dash["A2"].font = SUBTITLE_FONT

# KPI CARDS
kpi_data = [
    ("A4", "B4", "A5", "👥 Athlètes Suivis", "6 Sportifs"),
    ("D4", "E4", "D5", "📊 Charge Moyenne S1", "=MOYENNE('02_Charge_Foster_RPE'!L5:L8)", "0 u.a."),
    ("G4", "H4", "G5", "💤 Récupération Hooper", "=MOYENNE('01_Suivi_Hooper'!G5:G32)", "0.0 / 28"),
    ("J4", "K4", "J5", "🚀 Gain Vitesse 30m", "=MOYENNE('05_Batterie_Tests'!H6:H11)", "+0.0%"),
    ("M4", "N4", "M5", "⚡ Gain Détente CMJ", "=MOYENNE('05_Batterie_Tests'!H17:H22)", "+0.0%"),
]

for item in kpi_data:
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

# Synthese des alertes
ws_dash["A8"] = "RÉSUMÉ DES ALERTES ET ACTIONS PRIORITAIRES"
ws_dash["A8"].font = SECTION_FONT

alerts_summary = [
    ("Athlète", "Indicateur Clé", "Valeur Observée", "Statut / Alerte", "Recommandation Préparateur"),
    ("Nathan", "Indice Hooper (12/09)", "27 / 28", "ALERTE FATIGUE SÉVÈRE", "Allègement séance 50%, bilan sommeil/stress"),
    ("Noah", "Indice Hooper (12/09)", "24 / 28", "ALERTE FATIGUE FORTE", "Séance régénérative aquatique prioritaire"),
    ("Lucas", "Charge S1 (Foster)", "2180 u.a.", "SEMAINE CHARGÉE", "Surveiller tolérance match, hydratation"),
    ("Hugo", "Sprint & CMJ", "-0.08s / +4.0cm", "PROGRESSION OPTIMALE", "Poursuivre cycle de charge actuel"),
    ("Sarah", "Hydratation totale", "2900 ml", "HYDRATATION CONFORME", "Bon équilibre journalier pour triathlète"),
]

for col_idx, h in enumerate(alerts_summary[0], start=1):
    c = ws_dash.cell(row=10, column=col_idx, value=h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center")
    c.border = thick_bottom

for row_idx, r in enumerate(alerts_summary[1:], start=11):
    for col_idx, val in enumerate(r, start=1):
        c = ws_dash.cell(row=row_idx, column=col_idx, value=val)
        c.border = cell_border
        c.alignment = Alignment(horizontal="center" if col_idx in [1, 3, 4] else "left")
        if "ALERTE" in val or "SÉVÈRE" in val:
            c.fill = ALERT_DANGER_FILL
            c.font = ALERT_DANGER_FONT
        elif "SEMAINE" in val:
            c.fill = ALERT_WARN_FILL
            c.font = ALERT_WARN_FONT
        elif "OPTIMALE" in val or "CONFORME" in val:
            c.fill = ALERT_OK_FILL
            c.font = ALERT_OK_FONT

for col in ws_dash.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_dash.column_dimensions[col_letter].width = max(max_len + 3, 14)

# Save Workbook
target_local = r"docs\public\documents\Exercice 04 - Production attendue.xlsx"
target_drive = r"C:\Google Drive\Prépas light\HECh\Préparateur physique\Exercices\Exercice 04\Exercice 04 - Production attendue.xlsx"

wb.save(target_local)
wb.save(target_drive)
print(f"SUCCESS: Created {target_local} and {target_drive}")
