import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import datetime
import random

# Seed for reproducible realistic figures
random.seed(42)

wb = openpyxl.Workbook()
wb.remove(wb.active)

# Palette
NAVY_FILL = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
DARK_SLATE_FILL = PatternFill(start_color="334155", end_color="334155", fill_type="solid")
HEADER_FONT = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
TITLE_FONT = Font(name="Calibri", size=15, bold=True, color="1E3A8A")
SUBTITLE_FONT = Font(name="Calibri", size=10, italic=True, color="475569")
SECTION_FONT = Font(name="Calibri", size=12, bold=True, color="1E3A8A")
BOLD_FONT = Font(name="Calibri", size=11, bold=True)
REGULAR_FONT = Font(name="Calibri", size=11)

thin_side = Side(border_style="thin", color="CBD5E1")
cell_border = Border(top=thin_side, left=thin_side, right=thin_side, bottom=thin_side)
thick_bottom = Border(bottom=Side(border_style="medium", color="1E3A8A"), top=thin_side, left=thin_side, right=thin_side)

# ------------------------------------------------------------------------------
# 1. SHEET 00 : GUIDE & DICTIONNAIRE DES VARIABLES
# ------------------------------------------------------------------------------
ws_guide = wb.create_sheet(title="00_Guide_et_Variables")
ws_guide.views.sheetView[0].showGridLines = True

ws_guide["A1"] = "MISSION PROFESSIONNELLE FINALE — SUIVI MULTISOURCE & LUTTE CONTRE LE SURENTRAÎNEMENT"
ws_guide["A1"].font = TITLE_FONT
ws_guide["A2"] = "Données GPS, Fréquence Cardiaque, RPE et Bien-Être d'une équipe de Football Professionnel (6 semaines)"
ws_guide["A2"].font = SUBTITLE_FONT

headers_guide = ["Variable", "Catégorie", "Unité", "Description & Seuil Scientifique"]
for ci, h in enumerate(headers_guide, start=1):
    c = ws_guide.cell(4, ci, h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center")
    c.border = thick_bottom

variables_def = [
    ("Date & Semaine", "Temporel", "Date / S1-S6", "Suivi longitudinal sur un mésocycle de 6 semaines en cours de championnat."),
    ("Type_seance", "Contexte", "Texte", "MD (Match Day), MD+1 (Récupération), MD-4 (Force/Capacité), MD-3 (Intensité/Vitesse), MD-2 (Tactique/Vivacité), MD-1 (Activation)."),
    ("Distance_totale_km", "Charge Externe (GPS)", "km", "Distance globale parcourue pendant l'entraînement ou le match."),
    ("Distance_faible_km", "Charge Externe (GPS)", "km", "Course basse intensité (< 14.4 km/h) : régénération et déplacements lents."),
    ("Distance_moderee_km", "Charge Externe (GPS)", "km", "Course modérée (14.4 - 19.8 km/h) : travail aérobie de transition."),
    ("Distance_HSR_m", "Charge Externe (GPS)", "mètres", "High-Speed Running (19.8 - 25.2 km/h) : sollicitation métabolique et musculaire élevée."),
    ("Distance_sprint_m", "Charge Externe (GPS)", "mètres", "Distance à très haute vitesse (> 25.2 km/h) : contrainte excentrique majeure sur les ischio-jambiers."),
    ("Nb_sprints", "Charge Externe (GPS)", "nombre", "Nombre de courses à plus de 25.2 km/h sur au moins 1 seconde."),
    ("Accelerations_nb", "Charge Externe (GPS)", "nombre", "Nombre d'accélérations intenses (> 3 m/s²) : contrainte mécanique et métabolique."),
    ("Decelerations_nb", "Charge Externe (GPS)", "nombre", "Nombre de freinages brutaux (<-3 m/s²) : traumatisme excentrique majeur et micro-lésions musculaires."),
    ("Player_Load", "Charge Externe (Accéléromètre)", "u.a.", "Charge mécanique tri-axiale instantanée (Catapult/Apex) reflétant le travail global."),
    ("FC_moy_bpm & FC_max", "Charge Interne (Cardio)", "bpm", "Fréquence cardiaque moyenne et maximale pendant l'effort."),
    ("Temps_sup_85pct_min", "Charge Interne (Cardio)", "minutes", "Temps passé dans la zone rouge cardiovasculaire (> 85% de FCmax)."),
    ("RPE_Foster", "Charge Interne (Perception)", "1 à 10", "Échelle CR-10 de Borg : perception globale de l'effort par le sportif 30 min après la séance."),
    ("Charge_RPE_ua", "Charge Interne (Foster)", "u.a.", "Produit Durée (min) × RPE (1-10) : quantification universelle de la charge d'entraînement."),
    ("Indice_Hooper", "Récupération (Bien-être)", "4 à 28", "Somme de 4 items matinaux (Sommeil, Stress, Fatigue, Courbatures) notés de 1 à 7. Alerte si >= 20."),
    ("Douleur_signalee", "Médical / Kiné", "Oui / Non", "Signalement de douleur musculo-articulaire nécessitant une prise en charge préventive."),
]

for ri, v in enumerate(variables_def, start=5):
    for ci, val in enumerate(v, start=1):
        cell = ws_guide.cell(ri, ci, val)
        cell.border = cell_border
        cell.alignment = Alignment(horizontal="left" if ci in [1, 4] else "center")

for col in ws_guide.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_guide.column_dimensions[col_letter].width = max(max_len + 3, 14)

# ------------------------------------------------------------------------------
# 2. SHEET 01 : RAW_EFFECTIF (20 JOUEURS DE FOOTBALL)
# ------------------------------------------------------------------------------
ws_eff = wb.create_sheet(title="RAW_Effectif")
ws_eff.views.sheetView[0].showGridLines = True

ws_eff["A1"] = "EFFECTIF OFFICIEL DE L'ÉQUIPE (PROFIL ATHLÉTIQUE ET CARDIO)"
ws_eff["A1"].font = TITLE_FONT
ws_eff["A2"] = "Paramètres individuels de référence : Postes, VMA, FC Max, Poids et Âge"
ws_eff["A2"].font = SUBTITLE_FONT

headers_eff = ["Athlete_ID", "Nom", "Prénom", "Poste", "Âge", "Poids (kg)", "Taille (cm)", "VMA (km/h)", "FC Max (bpm)", "FC Repos (bpm)", "Statut"]
for ci, h in enumerate(headers_eff, start=1):
    c = ws_eff.cell(4, ci, h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center")
    c.border = thick_bottom

players_data = [
    ("ATH01", "Gillet", "Alexandre", "Gardien", 28, 86.5, 191, 15.5, 188, 48, "Titulaire"),
    ("ATH02", "Benali", "Sami", "Gardien", 21, 82.0, 187, 16.0, 196, 52, "Remplaçant"),
    ("ATH03", "Desmet", "Thomas", "Défenseur Central", 25, 84.0, 188, 17.0, 192, 50, "Titulaire"),
    ("ATH04", "Koulibaly", "Ibrahima", "Défenseur Central", 27, 88.5, 193, 16.5, 189, 49, "Titulaire"),
    ("ATH05", "Vandamme", "Maxime", "Défenseur Central", 22, 81.0, 186, 17.5, 195, 51, "Rotation"),
    ("ATH06", "Dubois", "Nathan", "Latéral Droit", 23, 74.5, 178, 18.5, 198, 46, "Titulaire"),
    ("ATH07", "Mercier", "Lucas", "Latéral Gauche", 24, 73.0, 176, 19.0, 201, 45, "Titulaire"),
    ("ATH08", "Moreau", "Julien", "Latéral Polyvalent", 20, 72.0, 177, 18.0, 199, 48, "Rotation"),
    ("ATH09", "Diallo", "Amadou", "Milieu Défensif", 26, 79.0, 182, 18.5, 193, 44, "Titulaire"),
    ("ATH10", "Willems", "Arthur", "Milieu Défensif", 22, 77.5, 180, 18.0, 196, 47, "Rotation"),
    ("ATH11", "Claes", "Romain", "Milieu Relayeur", 25, 75.0, 179, 19.5, 197, 43, "Titulaire"),
    ("ATH12", "Renard", "Hugo", "Milieu Relayeur", 23, 73.5, 177, 19.0, 200, 45, "Titulaire"),
    ("ATH13", "Sow", "Moussa", "Milieu Offensif", 24, 71.0, 174, 18.5, 195, 46, "Titulaire"),
    ("ATH14", "Dumont", "Antoine", "Milieu Offensif", 21, 69.5, 172, 18.0, 198, 49, "Rotation"),
    ("ATH15", "Bakayoko", "Sekou", "Ailier Droit", 22, 72.5, 176, 19.5, 202, 47, "Titulaire"),
    ("ATH16", "Lambert", "Florian", "Ailier Gauche", 25, 70.0, 175, 19.0, 199, 46, "Titulaire"),
    ("ATH17", "Navarro", "Enzo", "Ailier Polyvalent", 19, 68.5, 173, 19.0, 204, 50, "Rotation"),
    ("ATH18", "Tshilombo", "Christian", "Avant-Centre", 26, 85.0, 187, 17.5, 191, 48, "Titulaire"),
    ("ATH19", "Peeters", "Loris", "Avant-Centre", 23, 82.0, 184, 18.0, 195, 49, "Rotation"),
    ("ATH20", "Simon", "Noah", "Attaquant Soutien", 20, 74.0, 179, 18.5, 200, 48, "Rotation")
]

for ri, p in enumerate(players_data, start=5):
    for ci, val in enumerate(p, start=1):
        cell = ws_eff.cell(ri, ci, val)
        cell.border = cell_border
        cell.alignment = Alignment(horizontal="center" if ci in [1, 5, 6, 7, 8, 9, 10, 11] else "left")

for col in ws_eff.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_eff.column_dimensions[col_letter].width = max(max_len + 3, 12)

# ------------------------------------------------------------------------------
# 3. SHEET 02 : RAW_GPS_MATCHS_ENTRAINEMENTS (36 SÉANCES SUR 6 SEMAINES)
# ------------------------------------------------------------------------------
ws_gps = wb.create_sheet(title="RAW_GPS_Seances_Matchs")
ws_gps.views.sheetView[0].showGridLines = True

ws_gps["A1"] = "COLLECTE GPS & CARDIO DES ENTRAÎNEMENTS ET MATCHS (6 SEMAINES)"
ws_gps["A1"].font = TITLE_FONT
ws_gps["A2"] = "Données brutes Catapult / STATSports de terrain : Distances par zones de vitesse, sprints, accélérations et RPE"
ws_gps["A2"].font = SUBTITLE_FONT

headers_gps = [
    "Session_ID", "Date", "Semaine", "Jour", "Type_seance", "Athlete_ID", "Nom_Prenom", "Poste",
    "Duree_min", "Distance_totale_km", "Course_faible_km", "Course_moderee_km", "Distance_HSR_m", 
    "Distance_sprint_m", "Nb_sprints", "Accelerations_nb", "Decelerations_nb", "Vitesse_max_kmh", 
    "Player_Load", "FC_moy_bpm", "FC_max_bpm", "Temps_sup_85pct_min", "RPE_Foster", "Charge_RPE_ua"
]

for ci, h in enumerate(headers_gps, start=1):
    c = ws_gps.cell(4, ci, h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center")
    c.border = thick_bottom

# Generate 6 weeks microcycles:
# Week structure:
# Lundi: MD+1 (Récupération 45 min)
# Mardi: MD-4 (Force & Puissance aérobie 80 min)
# Mercredi: MD-3 (Intensité, Vitesse & Jeux réduits 90 min)
# Jeudi: Repos
# Vendredi: MD-2 (Tactique & Vivacité 70 min)
# Samedi: MD-1 (Activation & Vitesse de réaction 45 min)
# Dimanche: MD (Match de championnat 90 min)

start_date = datetime.date(2026, 2, 2) # Lundi 2 février 2026
session_templates = [
    ("Lundi", "MD+1_Recuperation", 45, 0.45, 0.5, 0.2),
    ("Mardi", "MD-4_Force_Puissance", 80, 0.85, 0.7, 0.8),
    ("Mercredi", "MD-3_Vitesse_Intensite", 90, 1.0, 1.0, 1.0),
    ("Vendredi", "MD-2_Tactique_Vivacite", 70, 0.75, 0.7, 0.6),
    ("Samedi", "MD-1_Activation", 45, 0.5, 0.4, 0.4),
    ("Dimanche", "MD_Match", 95, 1.25, 1.3, 1.3)
]

row_g = 5
sess_count = 1

# Specific overtraining narrative injection:
# ATH04 (Koulibaly) and ATH11 (Claes) will undergo acute overload in S4 & S5 leading to overtraining indicators!
# ATH06 (Dubois) will have high deceleration volume and hamstring stiffness.

for wk_idx in range(1, 7): # Weeks 1 to 6
    wk_str = f"S{wk_idx}"
    for day_name, stype, base_dur, dur_fac, dist_fac, int_fac in session_templates:
        sess_id = f"SES_{sess_count:03d}"
        sess_count += 1
        
        # calculate date offset
        day_offset = {"Lundi": 0, "Mardi": 1, "Mercredi": 2, "Vendredi": 4, "Samedi": 5, "Dimanche": 6}[day_name]
        cur_date = start_date + datetime.timedelta(days=(wk_idx-1)*7 + day_offset)
        
        # Overload week 4 and 5
        week_mult = 1.0
        if wk_idx == 4: week_mult = 1.15
        if wk_idx == 5: week_mult = 1.20
        if wk_idx == 6: week_mult = 0.85 # Tapering / Allègement
        
        for p in players_data:
            ath_id, nom, prenom, poste = p[0], p[1], p[2], p[3]
            vma, fc_max = p[7], p[8]
            full_name = f"{prenom} {nom}"
            
            # Position factor
            pos_dist_factor = 1.0
            pos_hsr_factor = 1.0
            pos_acc_factor = 1.0
            
            if poste == "Gardien":
                pos_dist_factor = 0.45
                pos_hsr_factor = 0.15
                pos_acc_factor = 0.3
            elif poste == "Défenseur Central":
                pos_dist_factor = 0.9
                pos_hsr_factor = 0.75
                pos_acc_factor = 0.8
            elif poste in ["Latéral Droit", "Latéral Gauche", "Latéral Polyvalent"]:
                pos_dist_factor = 1.12
                pos_hsr_factor = 1.35
                pos_acc_factor = 1.2
            elif poste in ["Milieu Défensif", "Milieu Relayeur"]:
                pos_dist_factor = 1.18
                pos_hsr_factor = 1.1
                pos_acc_factor = 1.15
            elif poste in ["Ailier Droit", "Ailier Gauche", "Ailier Polyvalent"]:
                pos_dist_factor = 1.08
                pos_hsr_factor = 1.4
                pos_acc_factor = 1.3
            elif poste in ["Avant-Centre", "Attaquant Soutien"]:
                pos_dist_factor = 0.98
                pos_hsr_factor = 1.2
                pos_acc_factor = 1.25
                
            # Base distance per session
            if stype == "MD_Match":
                match_mins = 90 if p[10] == "Titulaire" else random.choice([25, 45, 60])
                actual_dur = match_mins
                tot_dist = round((actual_dur / 90.0) * (9.5 + (vma - 17.0)*0.4) * pos_dist_factor + random.uniform(-0.3, 0.4), 2)
                hsr_dist = int((actual_dur / 90.0) * (650 * pos_hsr_factor * int_fac) + random.randint(-40, 60))
                sprint_dist = int((actual_dur / 90.0) * (180 * pos_hsr_factor * int_fac) + random.randint(-20, 40))
                nb_sprints = int(sprint_dist / 18) + random.randint(0, 3)
                acc = int(35 * pos_acc_factor * (actual_dur / 90.0)) + random.randint(-3, 5)
                dec = int(38 * pos_acc_factor * (actual_dur / 90.0)) + random.randint(-3, 5)
                vmax = round(28.5 + random.uniform(0, 4.5), 1) if poste != "Gardien" else round(22.0 + random.uniform(0, 2), 1)
                rpe = random.choice([8, 9, 10]) if actual_dur >= 75 else random.choice([6, 7])
                fc_moy = int(fc_max * 0.84 + random.randint(-3, 4))
                fc_p_max = fc_max - random.randint(1, 4)
                t_85 = int(actual_dur * 0.48) + random.randint(-5, 6)
            else:
                actual_dur = int(base_dur * week_mult)
                tot_dist = round((actual_dur / 60.0) * 4.8 * dist_fac * pos_dist_factor + random.uniform(-0.2, 0.3), 2)
                hsr_dist = int((actual_dur / 60.0) * 320 * pos_hsr_factor * int_fac * week_mult) + random.randint(-30, 40)
                sprint_dist = int((actual_dur / 60.0) * 80 * pos_hsr_factor * int_fac * week_mult) + random.randint(-15, 20) if stype in ["MD-3_Vitesse_Intensite", "MD-2_Tactique_Vivacite"] else random.randint(0, 25)
                nb_sprints = max(0, int(sprint_dist / 17) + random.randint(-1, 2))
                acc = int((actual_dur / 60.0) * 22 * pos_acc_factor * int_fac) + random.randint(-2, 3)
                dec = int((actual_dur / 60.0) * 24 * pos_acc_factor * int_fac) + random.randint(-2, 3)
                vmax = round(26.0 + random.uniform(0, 5.0), 1) if sprint_dist > 0 else round(20.0 + random.uniform(0, 3), 1)
                
                # RPE and fatigue dynamics
                if stype == "MD+1_Recuperation":
                    rpe = random.choice([2, 3, 4])
                    fc_moy = int(fc_max * 0.62) + random.randint(-3, 3)
                    t_85 = 0
                elif stype == "MD-4_Force_Puissance":
                    rpe = random.choice([6, 7, 8])
                    fc_moy = int(fc_max * 0.76) + random.randint(-3, 3)
                    t_85 = int(actual_dur * 0.22)
                elif stype == "MD-3_Vitesse_Intensite":
                    rpe = random.choice([7, 8, 9])
                    fc_moy = int(fc_max * 0.81) + random.randint(-2, 4)
                    t_85 = int(actual_dur * 0.35)
                elif stype == "MD-2_Tactique_Vivacite":
                    rpe = random.choice([5, 6, 7])
                    fc_moy = int(fc_max * 0.72) + random.randint(-3, 3)
                    t_85 = int(actual_dur * 0.15)
                else: # MD-1
                    rpe = random.choice([3, 4, 5])
                    fc_moy = int(fc_max * 0.65) + random.randint(-3, 3)
                    t_85 = int(actual_dur * 0.05)
                    
                fc_p_max = int(fc_moy * 1.18) + random.randint(0, 4)
            
            # Distance breakdown
            hsr_km = round(hsr_dist / 1000.0, 2)
            sprint_km = round(sprint_dist / 1000.0, 2)
            faible_km = round(tot_dist * 0.58, 2)
            moderee_km = round(max(0.1, tot_dist - faible_km - hsr_km - sprint_km), 2)
            player_load = round(tot_dist * 82 + acc*2.5 + dec*3.0 + random.uniform(-10, 15), 1)
            
            # Intentional overtraining symptoms for ATH04 & ATH11 in Week 4/5:
            # Their RPE spikes to 9-10 while their distance decreases (discrepancy marker)
            if ath_id in ["ATH04", "ATH11"] and wk_idx in [4, 5]:
                rpe = min(10, rpe + 2)
                hsr_dist = int(hsr_dist * 0.75)
                sprint_dist = int(sprint_dist * 0.60)
                nb_sprints = max(1, nb_sprints - 3)
                fc_moy += 6 # HR drift
            
            # Write to row
            ws_gps.cell(row_g, 1, sess_id).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 2, cur_date).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 3, wk_str).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 4, day_name).alignment = Alignment(horizontal="left")
            ws_gps.cell(row_g, 5, stype).alignment = Alignment(horizontal="left")
            ws_gps.cell(row_g, 6, ath_id).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 7, full_name).alignment = Alignment(horizontal="left")
            ws_gps.cell(row_g, 8, poste).alignment = Alignment(horizontal="left")
            ws_gps.cell(row_g, 9, actual_dur).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 10, tot_dist).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 11, faible_km).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 12, moderee_km).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 13, hsr_dist).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 14, sprint_dist).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 15, nb_sprints).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 16, acc).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 17, dec).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 18, vmax).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 19, player_load).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 20, fc_moy).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 21, fc_p_max).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 22, t_85).alignment = Alignment(horizontal="center")
            ws_gps.cell(row_g, 23, rpe).alignment = Alignment(horizontal="center")
            
            # Formula Charge_RPE = Durée * RPE
            f_ch = f"=I{row_g}*W{row_g}"
            c_ch = ws_gps.cell(row_g, 24, f_ch)
            c_ch.alignment = Alignment(horizontal="center")
            c_ch.font = BOLD_FONT
            
            for ci in range(1, 25):
                ws_gps.cell(row_g, ci).border = cell_border
                
            row_g += 1

for col in ws_gps.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_gps.column_dimensions[col_letter].width = max(max_len + 3, 12)

# ------------------------------------------------------------------------------
# 4. SHEET 03 : RAW_BIENETRE_HOOPER (CHECK-IN MATINAL QUOTIDIEN)
# ------------------------------------------------------------------------------
ws_well = wb.create_sheet(title="RAW_BienEtre_Hooper")
ws_well.views.sheetView[0].showGridLines = True

ws_well["A1"] = "QUESTIONNAIRE MATINAL DE RÉCUPÉRATION (INDICE DE HOOPER)"
ws_well["A1"].font = TITLE_FONT
ws_well["A2"] = "Saisie quotidienne au réveil : Sommeil, Stress, Fatigue, Courbatures et Détection de Douleurs"
ws_well["A2"].font = SUBTITLE_FONT

headers_well = [
    "Date", "Semaine", "Jour", "Athlete_ID", "Nom_Prenom", "Poste",
    "Sommeil_h", "Qualite_Sommeil (1-7)", "Stress (1-7)", "Fatigue (1-7)", 
    "Courbatures (1-7)", "Score_Hooper (4-28)", "Statut_Recuperation", "Douleur_Alerte", "Zone_Douleur"
]

for ci, h in enumerate(headers_well, start=1):
    c = ws_well.cell(4, ci, h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center")
    c.border = thick_bottom

row_w = 5
for day_idx in range(42): # 42 consecutive days (6 weeks)
    cur_d = start_date + datetime.timedelta(days=day_idx)
    wk_n = f"S{(day_idx // 7) + 1}"
    jour_fr = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"][cur_d.weekday()]
    
    for p in players_data:
        ath_id = p[0]
        full_name = f"{p[2]} {p[1]}"
        poste = p[3]
        
        # Base Hooper values (1 = best, 7 = worst)
        sommeil_h = round(7.5 + random.uniform(-1.0, 1.2), 1)
        q_sommeil = random.choice([2, 3, 3, 4])
        stress = random.choice([2, 2, 3, 3, 4])
        fatigue = random.choice([2, 3, 3, 4])
        courbatures = random.choice([2, 3, 4])
        douleur = "Non"
        zone_douleur = "-"
        
        # Post-match fatigue (Lundi / MD+1)
        if jour_fr == "Lundi":
            fatigue += random.choice([2, 3])
            courbatures += random.choice([2, 3])
            
        # Target players with overtraining in Weeks 4 and 5
        if ath_id == "ATH04" and wk_n in ["S4", "S5"]: # Koulibaly
            sommeil_h = round(5.5 + random.uniform(-0.5, 0.5), 1)
            q_sommeil = random.choice([5, 6, 7])
            stress = random.choice([5, 6])
            fatigue = random.choice([6, 7])
            courbatures = random.choice([6, 7])
            douleur = "Oui"
            zone_douleur = "Ischio-jambier Droit (Tension)"
        elif ath_id == "ATH11" and wk_n in ["S4", "S5"]: # Claes
            sommeil_h = round(5.8 + random.uniform(-0.4, 0.6), 1)
            q_sommeil = random.choice([5, 6])
            stress = random.choice([5, 6, 7])
            fatigue = random.choice([6, 7])
            courbatures = random.choice([5, 6])
            douleur = "Oui"
            zone_douleur = "Tendinopathie rotulienne Gauche"
        elif ath_id == "ATH06" and wk_n in ["S3", "S4"]: # Dubois
            courbatures = random.choice([5, 6])
            douleur = "Oui"
            zone_douleur = "Mollet Droit"
            
        ws_well.cell(row_w, 1, cur_d).alignment = Alignment(horizontal="center")
        ws_well.cell(row_w, 2, wk_n).alignment = Alignment(horizontal="center")
        ws_well.cell(row_w, 3, jour_fr).alignment = Alignment(horizontal="left")
        ws_well.cell(row_w, 4, ath_id).alignment = Alignment(horizontal="center")
        ws_well.cell(row_w, 5, full_name).alignment = Alignment(horizontal="left")
        ws_well.cell(row_w, 6, poste).alignment = Alignment(horizontal="left")
        ws_well.cell(row_w, 7, sommeil_h).alignment = Alignment(horizontal="center")
        ws_well.cell(row_w, 8, q_sommeil).alignment = Alignment(horizontal="center")
        ws_well.cell(row_w, 9, stress).alignment = Alignment(horizontal="center")
        ws_well.cell(row_w, 10, fatigue).alignment = Alignment(horizontal="center")
        ws_well.cell(row_w, 11, courbatures).alignment = Alignment(horizontal="center")
        
        # Hooper sum = Qualite_sommeil + Stress + Fatigue + Courbatures
        f_hoop = f"=SOMME(H{row_w}:K{row_w})"
        c_h = ws_well.cell(row_w, 12, f_hoop)
        c_h.font = BOLD_FONT
        c_h.alignment = Alignment(horizontal="center")
        
        # Statut
        f_stat = f'=SI(L{row_w}>=20; "ALERTE SURENTRAÎNEMENT"; SI(L{row_w}>=15; "Vigilance Fatigue"; "Récupération Optimale"))'
        ws_well.cell(row_w, 13, f_stat).alignment = Alignment(horizontal="center")
        
        ws_well.cell(row_w, 14, douleur).alignment = Alignment(horizontal="center")
        ws_well.cell(row_w, 15, zone_douleur).alignment = Alignment(horizontal="left")
        
        for ci in range(1, 16):
            ws_well.cell(row_w, ci).border = cell_border
            
        row_w += 1

for col in ws_well.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_well.column_dimensions[col_letter].width = max(max_len + 3, 12)

# ------------------------------------------------------------------------------
# 5. SHEET 04 : RAW_TESTS_NEUROMUSCULAIRES (PRE / MID / POST)
# ------------------------------------------------------------------------------
ws_test = wb.create_sheet(title="RAW_Tests_Neuromusculaires")
ws_test.views.sheetView[0].showGridLines = True

ws_test["A1"] = "TESTS PHYSIQUES & MARQUEURS NEUROMUSCULAIRES (S1 / S3 / S6)"
ws_test["A1"].font = TITLE_FONT
ws_test["A2"] = "Sprint 10m/30m, Détente CMJ, Navette Yo-Yo IR1 et Dérive de Fréquence Cardiaque sous-max"
ws_test["A2"].font = SUBTITLE_FONT

headers_test = [
    "Période", "Semaine", "Date", "Athlete_ID", "Nom_Prenom", "Poste",
    "Sprint_10m (s)", "Sprint_30m (s)", "Saut_CMJ (cm)", "YoYo_IR1 (m)", 
    "FC_SousMax_12kmh (bpm)", "FC_Repos_Matin (bpm)", "Commentaires_Staff"
]

for ci, h in enumerate(headers_test, start=1):
    c = ws_test.cell(4, ci, h)
    c.fill = NAVY_FILL
    c.font = HEADER_FONT
    c.alignment = Alignment(horizontal="center")
    c.border = thick_bottom

periods = [
    ("INITIAL", "S1", datetime.date(2026, 2, 3)),
    ("MI-PARCOURS", "S3", datetime.date(2026, 2, 17)),
    ("FINAL", "S6", datetime.date(2026, 3, 10))
]

row_t = 5
for per_name, per_wk, per_dt in periods:
    for p in players_data:
        ath_id = p[0]
        full_name = f"{p[2]} {p[1]}"
        poste = p[3]
        vma = p[7]
        fc_max = p[8]
        fc_repos = p[9]
        
        # Base tests
        sp10 = round(1.78 + random.uniform(-0.06, 0.08) - (vma - 17.5)*0.03, 2)
        sp30 = round(4.35 + random.uniform(-0.10, 0.12) - (vma - 17.5)*0.06, 2)
        cmj = round(44.0 + random.uniform(-3, 5) + (185 - p[6])*0.1, 1)
        yoyo = int(1800 + (vma - 17.0)*180 + random.randint(-80, 100))
        fc_sub = int(152 + random.randint(-4, 5))
        
        comm = "État normal"
        
        # Mid & Post Evolution
        if per_wk == "S3":
            if ath_id in ["ATH04", "ATH11"]: # Beginning of overreaching
                cmj = round(cmj - 2.5, 1) # drop in jump height (classic fatigue marker)
                fc_sub += 6 # HR drift
                fc_repos += 4
                comm = "Baisse de réactivité neuromusculaire (vigilance)"
            else:
                sp10 = round(sp10 - 0.02, 2)
                cmj = round(cmj + 1.2, 1)
                yoyo += 80
                comm = "Adaptation positive"
        elif per_wk == "S6":
            if ath_id in ["ATH04", "ATH11"]: # Non-functional overreaching / overtraining
                sp10 = round(sp10 + 0.08, 2)
                sp30 = round(sp30 + 0.15, 2)
                cmj = round(cmj - 4.2, 1) # severe jump decrement
                yoyo -= 240 # aerobic collapse
                fc_sub += 11 # massive sympathetic drift
                fc_repos += 8
                comm = "SURENTRAÎNEMENT NON FONCTIONNEL AVÉRÉ (Chute perfs & CMJ)"
            else: # Rest of the team progressed
                sp10 = round(sp10 - 0.04, 2)
                sp30 = round(sp30 - 0.08, 2)
                cmj = round(cmj + 2.8, 1)
                yoyo += 180
                fc_sub -= 4
                fc_repos -= 2
                comm = "Excellente surcompensation athlétique"
                
        ws_test.cell(row_t, 1, per_name).alignment = Alignment(horizontal="center")
        ws_test.cell(row_t, 2, per_wk).alignment = Alignment(horizontal="center")
        ws_test.cell(row_t, 3, per_dt).alignment = Alignment(horizontal="center")
        ws_test.cell(row_t, 4, ath_id).alignment = Alignment(horizontal="center")
        ws_test.cell(row_t, 5, full_name).alignment = Alignment(horizontal="left")
        ws_test.cell(row_t, 6, poste).alignment = Alignment(horizontal="left")
        ws_test.cell(row_t, 7, sp10).alignment = Alignment(horizontal="center")
        ws_test.cell(row_t, 8, sp30).alignment = Alignment(horizontal="center")
        ws_test.cell(row_t, 9, cmj).alignment = Alignment(horizontal="center")
        ws_test.cell(row_t, 10, yoyo).alignment = Alignment(horizontal="center")
        ws_test.cell(row_t, 11, fc_sub).alignment = Alignment(horizontal="center")
        ws_test.cell(row_t, 12, fc_repos).alignment = Alignment(horizontal="center")
        ws_test.cell(row_t, 13, comm).alignment = Alignment(horizontal="left")
        
        for ci in range(1, 14):
            ws_test.cell(row_t, ci).border = cell_border
            
        row_t += 1

for col in ws_test.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws_test.column_dimensions[col_letter].width = max(max_len + 3, 14)

# Save Workbook
f_local = r"docs\public\documents\donnees_exercice_final_outils_informatiques.xlsx"
f_drive = r"C:\Google Drive\Prépas light\HECh\Préparateur physique\Exercices\Exercice 07\donnees_exercice_final_outils_informatiques.xlsx"

wb.save(f_local)
wb.save(f_drive)
print(f"SUCCESS: Created realistic football overtraining dataset in {f_local} and {f_drive}!")
