import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def generate_nutrition_dataset():
    wb = openpyxl.Workbook()
    
    # -------------------------------------------------------------
    # Onglet 1 : Données Brutes (Export d'application / formulaire)
    # -------------------------------------------------------------
    ws1 = wb.active
    ws1.title = "Export_Brut_Nutrition"
    ws1.views.sheetView[0].showGridLines = True
    
    # Données des 8 nageurs (4 femmes, 4 hommes) sur 7 jours
    # Nageurs :
    # 1. Maxime Laurent (Papillon/Sprint, 78 kg, Objectif: Puissance & Restauration glycogénique)
    # 2. Lucas Mercier (Demi-fond 400/1500m, 74 kg, Objectif: Gros volume, maintien glycogénique)
    # 3. Alexandre Faure (Brasse, 82 kg, Objectif: Puissance musculaire & Hydratation)
    # 4. Théo Dumont (4 Nages, 76 kg, Objectif: Double séance intense)
    # 5. Camille Bernard (Sprint Nage Libre, 62 kg, Objectif: Restauration rapide, vigilance déficit énergétique)
    # 6. Sarah Lefebvre (Demi-fond 800m, 58 kg, Objectif: Haute dépense, apports glucidiques cruciaux)
    # 7. Léa Moreau (Dos, 60 kg, Objectif: Régularité, récupération)
    # 8. Emma Roux (Brasse, 64 kg, Objectif: Récupération musculaire post-bassin)
    
    headers = [
        "ID_Export", "Date", "Jour_Semaine", "Nom_Prenom", "Sexe", "Poids_kg", 
        "Seances_Jour", "Distance_km", "Charge_RPE_UA", 
        "Calories_kcal", "Glucides_g", "Proteines_g", "Lipides_g", 
        "Hydratation_L", "Statut_Recup_Matin"
    ]
    
    raw_data = [
        # Lundi 06/10/2026 - Reprise intensive (Bassin matin + Musculation après-midi)
        ["EXP-101", "2026-10-06", "Lundi", "Maxime Laurent", "H", 78.2, 2, 6.5, 620, 3650, 480, 165, 102, 3.4, "Bon"],
        ["EXP-102", "2026-10-06", "Lundi", "Lucas Mercier", "H", 74.0, 2, 11.0, 750, 4100, 610, 155, 95, 4.0, "Très bon"],
        ["EXP-103", "2026-10-06", "Lundi", "Alexandre Faure", "H", 82.5, 2, 7.0, 680, 3750, 470, 185, 110, 3.2, "Moyen"],
        ["EXP-104", "2026-10-06", "Lundi", "Théo Dumont", "H", 76.4, 2, 8.5, 710, 3900, 530, 160, 100, 3.6, "Bon"],
        ["EXP-105", "2026-10-06", "Lundi", "Camille Bernard", "F", 62.1, 2, 6.0, 580, 2650, 340, 125, 78, 2.7, "Bon"],
        ["EXP-106", "2026-10-06", "Lundi", "Sarah Lefebvre", "F", 57.8, 2, 10.0, 720, 2900, 410, 120, 75, 3.1, "Bon"],
        ["EXP-107", "2026-10-06", "Lundi", "Léa Moreau", "F", 60.3, 2, 7.5, 630, 2750, 360, 122, 74, 2.8, "Bon"],
        ["EXP-108", "2026-10-06", "Lundi", "Emma Roux", "F", 64.0, 2, 7.0, 600, 2800, 365, 130, 77, 2.9, "Très bon"],

        # Mardi 07/10/2026 - Séance spécifique VMA / Tolérance lactique
        ["EXP-109", "2026-10-07", "Mardi", "Maxime Laurent", "H", 77.9, 1, 5.0, 510, 3400, 430, 160, 98, 3.1, "Bon"],
        ["EXP-110", "2026-10-07", "Mardi", "Lucas Mercier", "H", 73.8, 2, 12.5, 820, 4250, 640, 160, 98, 4.2, "Bon"],
        ["EXP-111", "2026-10-07", "Mardi", "Alexandre Faure", "H", 82.2, 1, 5.5, 540, 3500, 440, 175, 105, 3.0, "Fatigué"],
        ["EXP-112", "2026-10-07", "Mardi", "Théo Dumont", "H", 76.1, 2, 9.0, 740, 3950, 540, 165, 102, 3.5, "Bon"],
        ["EXP-113", "2026-10-07", "Mardi", "Camille Bernard", "F", 61.8, 1, 4.5, 480, 2400, 305, 118, 70, 2.5, "Moyen"],
        ["EXP-114", "2026-10-07", "Mardi", "Sarah Lefebvre", "F", 57.5, 2, 11.0, 780, 3050, 440, 125, 78, 3.3, "Bon"],
        ["EXP-115", "2026-10-07", "Mardi", "Léa Moreau", "F", 60.0, 1, 5.5, 520, 2600, 340, 118, 72, 2.6, "Bon"],
        ["EXP-116", "2026-10-07", "Mardi", "Emma Roux", "F", 63.8, 1, 5.0, 490, 2650, 345, 128, 74, 2.7, "Bon"],

        # Mercredi 08/10/2026 - Mercredi charge allégée / Travail technique (1 séance)
        ["EXP-117", "2026-10-08", "Mercredi", "Maxime Laurent", "H", 78.0, 1, 4.0, 320, 3050, 380, 150, 90, 2.8, "Très bon"],
        ["EXP-118", "2026-10-08", "Mercredi", "Lucas Mercier", "H", 73.9, 1, 6.0, 410, 3300, 470, 140, 85, 3.2, "Bon"],
        ["EXP-119", "2026-10-08", "Mercredi", "Alexandre Faure", "H", 82.4, 1, 4.0, 340, 3200, 390, 165, 95, 2.9, "Bon"],
        ["EXP-120", "2026-10-08", "Mercredi", "Théo Dumont", "H", 76.3, 1, 4.5, 350, 3150, 410, 150, 90, 3.0, "Très bon"],
        ["EXP-121", "2026-10-08", "Mercredi", "Camille Bernard", "F", 61.9, 1, 3.5, 290, 2300, 290, 115, 68, 2.4, "Bon"],
        ["EXP-122", "2026-10-08", "Mercredi", "Sarah Lefebvre", "F", 57.7, 1, 5.5, 390, 2550, 350, 115, 70, 2.7, "Très bon"],
        ["EXP-123", "2026-10-08", "Mercredi", "Léa Moreau", "F", 60.1, 1, 4.0, 310, 2400, 310, 115, 68, 2.5, "Très bon"],
        ["EXP-124", "2026-10-08", "Mercredi", "Emma Roux", "F", 63.9, 1, 3.5, 300, 2450, 315, 120, 70, 2.6, "Très bon"],

        # Jeudi 09/10/2026 - Grosse journée aérobie + Renforcement sec
        ["EXP-125", "2026-10-09", "Jeudi", "Maxime Laurent", "H", 77.8, 2, 7.0, 660, 3700, 490, 170, 105, 3.5, "Bon"],
        ["EXP-126", "2026-10-09", "Jeudi", "Lucas Mercier", "H", 73.6, 2, 13.0, 860, 4350, 660, 165, 100, 4.3, "Bon"],
        ["EXP-127", "2026-10-09", "Jeudi", "Alexandre Faure", "H", 82.0, 2, 7.5, 700, 3800, 480, 190, 112, 3.3, "Moyen"],
        ["EXP-128", "2026-10-09", "Jeudi", "Théo Dumont", "H", 75.9, 2, 9.5, 760, 4000, 550, 168, 104, 3.7, "Bon"],
        ["EXP-129", "2026-10-09", "Jeudi", "Camille Bernard", "F", 61.5, 2, 6.5, 610, 2450, 310, 120, 72, 2.5, "Fatigué"], # Apports glucidiques un peu bas (5g/kg)
        ["EXP-130", "2026-10-09", "Jeudi", "Sarah Lefebvre", "F", 57.3, 2, 11.5, 810, 3100, 450, 128, 80, 3.4, "Bon"],
        ["EXP-131", "2026-10-09", "Jeudi", "Léa Moreau", "F", 59.8, 2, 8.0, 670, 2800, 370, 124, 75, 2.9, "Bon"],
        ["EXP-132", "2026-10-09", "Jeudi", "Emma Roux", "F", 63.6, 2, 7.5, 640, 2850, 375, 132, 78, 3.0, "Bon"],

        # Vendredi 10/10/2026 - Travail d'allures de course / Séries chronométrées
        ["EXP-133", "2026-10-10", "Vendredi", "Maxime Laurent", "H", 77.6, 2, 6.0, 590, 3600, 470, 165, 100, 3.3, "Bon"],
        ["EXP-134", "2026-10-10", "Vendredi", "Lucas Mercier", "H", 73.5, 2, 10.5, 730, 4050, 600, 155, 95, 3.9, "Moyen"],
        ["EXP-135", "2026-10-10", "Vendredi", "Alexandre Faure", "H", 81.8, 2, 6.5, 630, 3650, 455, 180, 108, 3.1, "Bon"],
        ["EXP-136", "2026-10-10", "Vendredi", "Théo Dumont", "H", 75.8, 2, 8.0, 680, 3850, 520, 160, 100, 3.5, "Bon"],
        ["EXP-137", "2026-10-10", "Vendredi", "Camille Bernard", "F", 61.4, 2, 5.5, 550, 2500, 320, 122, 72, 2.6, "Moyen"],
        ["EXP-138", "2026-10-10", "Vendredi", "Sarah Lefebvre", "F", 57.2, 2, 9.5, 700, 2950, 420, 122, 76, 3.2, "Bon"],
        ["EXP-139", "2026-10-10", "Vendredi", "Léa Moreau", "F", 59.7, 2, 7.0, 610, 2700, 350, 120, 74, 2.8, "Bon"],
        ["EXP-140", "2026-10-10", "Vendredi", "Emma Roux", "F", 63.5, 2, 6.5, 580, 2750, 355, 130, 75, 2.9, "Bon"],

        # Samedi 11/10/2026 - Simulation de compétition (Matinée chrono maximale)
        ["EXP-141", "2026-10-11", "Samedi", "Maxime Laurent", "H", 77.5, 1, 4.5, 560, 3550, 460, 165, 102, 3.2, "Très bon"],
        ["EXP-142", "2026-10-11", "Samedi", "Lucas Mercier", "H", 73.4, 1, 7.0, 640, 3700, 550, 150, 90, 3.6, "Bon"],
        ["EXP-143", "2026-10-11", "Samedi", "Alexandre Faure", "H", 81.7, 1, 4.5, 570, 3600, 450, 180, 105, 3.0, "Très bon"],
        ["EXP-144", "2026-10-11", "Samedi", "Théo Dumont", "H", 75.6, 1, 5.5, 600, 3650, 490, 160, 98, 3.4, "Très bon"],
        ["EXP-145", "2026-10-11", "Samedi", "Camille Bernard", "F", 61.3, 1, 4.0, 520, 2600, 335, 125, 75, 2.7, "Bon"],
        ["EXP-146", "2026-10-11", "Samedi", "Sarah Lefebvre", "F", 57.0, 1, 6.5, 620, 2900, 410, 125, 78, 3.1, "Bon"],
        ["EXP-147", "2026-10-11", "Samedi", "Léa Moreau", "F", 59.5, 1, 5.0, 540, 2650, 345, 122, 73, 2.7, "Très bon"],
        ["EXP-148", "2026-10-11", "Samedi", "Emma Roux", "F", 63.3, 1, 4.5, 530, 2700, 350, 130, 75, 2.8, "Très bon"],

        # Dimanche 12/10/2026 - Repos complet / Récupération active légère
        ["EXP-149", "2026-10-12", "Dimanche", "Maxime Laurent", "H", 77.8, 0, 0.0, 0, 2700, 320, 140, 85, 2.5, "Repos"],
        ["EXP-150", "2026-10-12", "Dimanche", "Lucas Mercier", "H", 73.7, 0, 0.0, 0, 2900, 380, 135, 88, 2.8, "Repos"],
        ["EXP-151", "2026-10-12", "Dimanche", "Alexandre Faure", "H", 82.1, 0, 0.0, 0, 2800, 330, 150, 92, 2.6, "Repos"],
        ["EXP-152", "2026-10-12", "Dimanche", "Théo Dumont", "H", 76.0, 0, 0.0, 0, 2850, 350, 140, 90, 2.7, "Repos"],
        ["EXP-153", "2026-10-12", "Dimanche", "Camille Bernard", "F", 61.7, 0, 0.0, 0, 2100, 250, 110, 65, 2.2, "Repos"],
        ["EXP-154", "2026-10-12", "Dimanche", "Sarah Lefebvre", "F", 57.5, 0, 0.0, 0, 2300, 300, 110, 68, 2.4, "Repos"],
        ["EXP-155", "2026-10-12", "Dimanche", "Léa Moreau", "F", 59.9, 0, 0.0, 0, 2200, 270, 110, 66, 2.3, "Repos"],
        ["EXP-156", "2026-10-12", "Dimanche", "Emma Roux", "F", 63.7, 0, 0.0, 0, 2250, 280, 115, 68, 2.4, "Repos"],
    ]
    
    # Styles
    font_header = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
    fill_header = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid") # Bleu Marine Pro
    font_data = Font(name="Segoe UI", size=10)
    align_center = Alignment(horizontal="center", vertical="center")
    align_left = Alignment(horizontal="left", vertical="center")
    align_right = Alignment(horizontal="right", vertical="center")
    
    thin_border = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='thin', color='CBD5E1')
    )
    
    # Écriture Header
    for col_idx, h_text in enumerate(headers, 1):
        cell = ws1.cell(row=1, column=col_idx, value=h_text)
        cell.font = font_header
        cell.fill = fill_header
        cell.alignment = align_center
        cell.border = thin_border
    
    # Écriture Données
    fill_zebra = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
    for row_idx, row_val in enumerate(raw_data, 2):
        is_even = (row_idx % 2 == 0)
        for col_idx, val in enumerate(row_val, 1):
            cell = ws1.cell(row=row_idx, column=col_idx, value=val)
            cell.font = font_data
            cell.border = thin_border
            if not is_even:
                cell.fill = fill_zebra
            
            # Alignements spécifiques
            if col_idx in [1, 2, 3, 5, 15]:
                cell.alignment = align_center
            elif col_idx == 4:
                cell.alignment = align_left
            else:
                cell.alignment = align_right
                if col_idx in [6, 8, 14]:
                    cell.number_format = '0.0'
                elif col_idx in [10, 11, 12, 13]:
                    cell.number_format = '#,##0'
                    
    # Auto-ajuster largeurs de colonnes
    for col in ws1.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws1.column_dimensions[col_letter].width = max(max_len + 3, 12)
        
    # -------------------------------------------------------------
    # Onglet 2 : Profils des Athlètes & Repères Physiologiques
    # -------------------------------------------------------------
    ws2 = wb.create_sheet(title="Profils_Reperes_Staff")
    ws2.views.sheetView[0].showGridLines = True
    
    ref_headers = [
        "Nom_Prenom", "Sexe", "Discipline_Principale", "Poids_Ref_kg", 
        "Cible_Glucides_g_kg", "Cible_Proteines_g_kg", "Cible_Hydratation_L_j", "Remarques_Staff"
    ]
    
    ref_data = [
        ["Maxime Laurent", "H", "50m & 100m Papillon", 78.0, "6.0 - 7.0", "1.8 - 2.2", "3.0 - 3.5", "Filière anaérobie lactique, puissance musculaire."],
        ["Lucas Mercier", "H", "400m & 1500m Nage Libre", 74.0, "8.0 - 10.0", "1.6 - 1.8", "3.5 - 4.5", "Volume kilométrique élevé, glycogène critique."],
        ["Alexandre Faure", "H", "100m & 200m Brasse", 82.0, "5.5 - 6.5", "2.0 - 2.2", "3.0 - 3.5", "Gros gabarit, travail de force en salle."],
        ["Théo Dumont", "H", "200m & 400m 4 Nages", 76.0, "7.0 - 8.5", "1.8 - 2.0", "3.2 - 3.8", "Polyvalence technique, charge globale élevée."],
        ["Camille Bernard", "F", "50m & 100m Nage Libre", 62.0, "5.5 - 6.5", "1.7 - 2.0", "2.5 - 3.0", "Vigilance sur le maintien du poids et glucides."],
        ["Sarah Lefebvre", "F", "400m & 800m Nage Libre", 58.0, "7.5 - 9.0", "1.6 - 1.8", "3.0 - 3.5", "Forte dépense énergétique, surveillance RED-S."],
        ["Léa Moreau", "F", "100m & 200m Dos", 60.0, "6.0 - 7.0", "1.7 - 1.9", "2.5 - 3.0", "Bonne régularité nutritionnelle globale."],
        ["Emma Roux", "F", "100m & 200m Brasse", 64.0, "5.5 - 6.5", "1.8 - 2.0", "2.6 - 3.0", "Puissance et récupération post-musculation."]
    ]
    
    fill_header2 = PatternFill(start_color="0D9488", end_color="0D9488", fill_type="solid") # Vert Émeraude / Teal
    for col_idx, h_text in enumerate(ref_headers, 1):
        cell = ws2.cell(row=1, column=col_idx, value=h_text)
        cell.font = font_header
        cell.fill = fill_header2
        cell.alignment = align_center
        cell.border = thin_border
        
    for row_idx, row_val in enumerate(ref_data, 2):
        for col_idx, val in enumerate(row_val, 1):
            cell = ws2.cell(row=row_idx, column=col_idx, value=val)
            cell.font = font_data
            cell.border = thin_border
            if col_idx in [2, 5, 6, 7]:
                cell.alignment = align_center
            elif col_idx in [1, 3, 8]:
                cell.alignment = align_left
            else:
                cell.alignment = align_right
                
    for col in ws2.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws2.column_dimensions[col_letter].width = max(max_len + 3, 14)

    # Sauvegarde
    target_path = "docs/public/documents/Exercice 02a - Donnees brutes nutrition natation.xlsx"
    wb.save(target_path)
    print(f"Jeu de données créé avec succès : {target_path}")

if __name__ == "__main__":
    generate_nutrition_dataset()
