import os
import sys
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

sys.stdout.reconfigure(encoding='utf-8')

raw_athletes = [
    {
        "Cycliste": "Julien Pinot",
        "Poids_kg": 58.5,
        "Taille_cm": 173,
        "Masse_Grasse_pct": 5.8,
        "Pmax_5s_W": 920,
        "P_1min_W": 580,
        "P_5min_W": 410,
        "FTP_20min_W": 360,
        "Glucides_g_j": 480,
        "Proteines_g_j": 115,
        "Lipides_g_j": 55,
        "Hydratation_L_j": 3.5,
        "Profil_Declare": "Grimpeur",
        "Course_Cible": "Étape Reine (Cols > 8% - 4200m D+)"
    },
    {
        "Cycliste": "Lucas Van Aert",
        "Poids_kg": 78.0,
        "Taille_cm": 186,
        "Masse_Grasse_pct": 8.5,
        "Pmax_5s_W": 1580,
        "P_1min_W": 890,
        "P_5min_W": 520,
        "FTP_20min_W": 390,
        "Glucides_g_j": 560,
        "Proteines_g_j": 165,
        "Lipides_g_j": 75,
        "Hydratation_L_j": 4.0,
        "Profil_Declare": "Sprinteur",
        "Course_Cible": "Critérium de plaine / Arrivée groupée"
    },
    {
        "Cycliste": "Romain Bardet",
        "Poids_kg": 61.0,
        "Taille_cm": 178,
        "Masse_Grasse_pct": 4.9,
        "Pmax_5s_W": 940,
        "P_1min_W": 590,
        "P_5min_W": 415,
        "FTP_20min_W": 350,
        "Glucides_g_j": 310,
        "Proteines_g_j": 100,
        "Lipides_g_j": 40,
        "Hydratation_L_j": 2.4,
        "Profil_Declare": "Grimpeur",
        "Course_Cible": "Étape Reine (Cols > 8% - 3800m D+)"
    },
    {
        "Cycliste": "Thomas De Gendt",
        "Poids_kg": 71.5,
        "Taille_cm": 180,
        "Masse_Grasse_pct": 7.2,
        "Pmax_5s_W": 1180,
        "P_1min_W": 720,
        "P_5min_W": 460,
        "FTP_20min_W": 385,
        "Glucides_g_j": 540,
        "Proteines_g_j": 140,
        "Lipides_g_j": 65,
        "Hydratation_L_j": 3.8,
        "Profil_Declare": "Rouleur / Baroudeur",
        "Course_Cible": "Échappée vallonnée / Contre-la-montre"
    },
    {
        "Cycliste": "Sam Bennett",
        "Poids_kg": 76.5,
        "Taille_cm": 179,
        "Masse_Grasse_pct": 9.0,
        "Pmax_5s_W": 1620,
        "P_1min_W": 870,
        "P_5min_W": 470,
        "FTP_20min_W": 360,
        "Glucides_g_j": 520,
        "Proteines_g_j": 155,
        "Lipides_g_j": 70,
        "Hydratation_L_j": 3.6,
        "Profil_Declare": "Sprinteur",
        "Course_Cible": "Sprint massif en faux-plat descendant"
    },
    {
        "Cycliste": "Thibaut Gaudu",
        "Poids_kg": 63.0,
        "Taille_cm": 175,
        "Masse_Grasse_pct": 6.2,
        "Pmax_5s_W": 1080,
        "P_1min_W": 660,
        "P_5min_W": 430,
        "FTP_20min_W": 370,
        "Glucides_g_j": 510,
        "Proteines_g_j": 125,
        "Lipides_g_j": 60,
        "Hydratation_L_j": 3.5,
        "Profil_Declare": "Grimpeur / Puncheur",
        "Course_Cible": "Arrivée au sommet pentu (Mur final)"
    },
    {
        "Cycliste": "Mathieu Van der Poel",
        "Poids_kg": 74.5,
        "Taille_cm": 184,
        "Masse_Grasse_pct": 7.8,
        "Pmax_5s_W": 1510,
        "P_1min_W": 860,
        "P_5min_W": 540,
        "FTP_20min_W": 425,
        "Glucides_g_j": 630,
        "Proteines_g_j": 160,
        "Lipides_g_j": 80,
        "Hydratation_L_j": 4.2,
        "Profil_Declare": "Puncheur",
        "Course_Cible": "Classique ardennaise / Monts pavés"
    },
    {
        "Cycliste": "Hugo Hofstetter",
        "Poids_kg": 72.0,
        "Taille_cm": 177,
        "Masse_Grasse_pct": 10.2,
        "Pmax_5s_W": 1380,
        "P_1min_W": 740,
        "P_5min_W": 430,
        "FTP_20min_W": 320,
        "Glucides_g_j": 420,
        "Proteines_g_j": 135,
        "Lipides_g_j": 65,
        "Hydratation_L_j": 2.8,
        "Profil_Declare": "Sprinteur",
        "Course_Cible": "Critérium semi-nocturne"
    }
]

# -------------------------------------------------------------
# 1. Génération du classeur "Données Brutes"
# -------------------------------------------------------------
def generate_raw_excel(filepath):
    wb = openpyxl.Workbook()
    ws_raw = wb.active
    ws_raw.title = "Export_Brut_Cyclisme"
    
    headers = [
        "Cycliste", "Poids_kg", "Taille_cm", "Masse_Grasse_pct",
        "Pmax_5s_W", "P_1min_W", "P_5min_W", "FTP_20min_W",
        "Glucides_g_j", "Proteines_g_j", "Lipides_g_j", "Hydratation_L_j",
        "Profil_Declare", "Course_Cible"
    ]
    ws_raw.append(headers)
    
    for a in raw_athletes:
        row = [
            a["Cycliste"], a["Poids_kg"], a["Taille_cm"], a["Masse_Grasse_pct"],
            a["Pmax_5s_W"], a["P_1min_W"], a["P_5min_W"], a["FTP_20min_W"],
            a["Glucides_g_j"], a["Proteines_g_j"], a["Lipides_g_j"], a["Hydratation_L_j"],
            a["Profil_Declare"], a["Course_Cible"]
        ]
        ws_raw.append(row)
        
    # Formatting
    header_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
    header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
    data_font = Font(name="Segoe UI", size=10)
    border_thin = Border(left=Side(style='thin', color='D9D9D9'),
                         right=Side(style='thin', color='D9D9D9'),
                         top=Side(style='thin', color='D9D9D9'),
                         bottom=Side(style='thin', color='D9D9D9'))
                         
    for col_idx in range(1, len(headers)+1):
        cell = ws_raw.cell(row=1, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center")
        
    for row_idx in range(2, len(raw_athletes)+2):
        for col_idx in range(1, len(headers)+1):
            cell = ws_raw.cell(row=row_idx, column=col_idx)
            cell.font = data_font
            cell.border = border_thin
            if col_idx == 1 or col_idx >= 13:
                cell.alignment = Alignment(horizontal="left", vertical="center")
            else:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                
    for col in ws_raw.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws_raw.column_dimensions[col_letter].width = max(max_len + 3, 12)
        
    # Feuille 2 : Profils et Repères Staff
    ws_ref = wb.create_sheet("Profils_Reperes_Staff")
    ref_data = [
        ["Repère Métrologique / Physiologique", "Grimpeur", "Sprinteur", "Rouleur / Puncheur", "Remarques Préparateur Physique"],
        ["FTP / Puissance Critique 20min (W/kg)", "> 5.6 W/kg", "4.5 – 5.1 W/kg", "5.2 – 5.8 W/kg", "Facteur déterminant de la vitesse ascensionnelle (VAM en m/h)."],
        ["Pmax 5 secondes (W/kg)", "14.5 – 17.0 W/kg", "> 19.5 W/kg", "17.0 – 20.5 W/kg", "Puissance neuromusculaire alactique pour les sprints et relances."],
        ["PMA 5 minutes (W/kg)", "6.5 – 7.2 W/kg", "5.8 – 6.7 W/kg", "6.5 – 7.5 W/kg", "Capacité aérobie maximale (VO2max fonctionnelle)."],
        ["Cible Glucidique Quotidienne (g/kg/j)", "7.0 – 10.0 g/kg", "6.0 – 8.0 g/kg", "7.0 – 9.0 g/kg", "Dépendance colossale du glycogène lors des ascensions au seuil."],
        ["Cible Protéique Quotidienne (g/kg/j)", "1.6 – 2.0 g/kg", "1.8 – 2.3 g/kg", "1.7 – 2.1 g/kg", "Maintien de la masse maigre et réparation des fibres type IIx."],
        ["Masse Grasse Cible Hommes (%)", "5.0 – 6.5 %", "7.5 – 9.5 %", "6.5 – 8.5 %", "Alerte rouge RED-S si < 5.0 % (chute hormonale, ostéopénie)."],
        ["Stratégie en Course (Glucides/h)", "90 – 110 g/h", "70 – 90 g/h", "80 – 100 g/h", "Ratio Glucose:Fructose (1:0.8) pour saturer les transporteurs SGLT1/GLUT5."]
    ]
    for r in ref_data:
        ws_ref.append(r)
        
    for col_idx in range(1, len(ref_data[0])+1):
        cell = ws_ref.cell(row=1, column=col_idx)
        cell.fill = PatternFill(start_color="203764", end_color="203764", fill_type="solid")
        cell.font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
        cell.alignment = Alignment(horizontal="center", vertical="center")
        
    for row_idx in range(2, len(ref_data)+1):
        for col_idx in range(1, len(ref_data[0])+1):
            cell = ws_ref.cell(row=row_idx, column=col_idx)
            cell.font = data_font
            cell.border = border_thin
            if col_idx in [1, 5]:
                cell.alignment = Alignment(horizontal="left", vertical="center")
            else:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                
    for col in ws_ref.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws_ref.column_dimensions[col_letter].width = max(max_len + 3, 14)

    wb.save(filepath)
    print(f"Raw Excel generated: {filepath}")

# -------------------------------------------------------------
# 2. Génération du classeur "Production Attendue" (avec Power Query simulé/calculé)
# -------------------------------------------------------------
def generate_expected_excel(filepath):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Extraction_PowerQuery"
    
    headers = [
        "Cycliste", "Poids_kg", "Masse_Grasse_pct", "Pmax_5s_W", "P_5min_W", "FTP_20min_W",
        "W_kg_5s", "W_kg_5min", "W_kg_FTP",
        "Glucides_g_kg", "Proteines_g_kg", "Lipides_g_kg", "Calories_kcal",
        "Profil_Declare", "Profil_Calcule", "Diagnostic_Alerte_Staff"
    ]
    ws.append(headers)
    
    for a in raw_athletes:
        p = a["Poids_kg"]
        w5s = round(a["Pmax_5s_W"] / p, 1)
        w5min = round(a["P_5min_W"] / p, 2)
        wftp = round(a["FTP_20min_W"] / p, 2)
        g_kg = round(a["Glucides_g_j"] / p, 2)
        prot_kg = round(a["Proteines_g_j"] / p, 2)
        lip_kg = round(a["Lipides_g_j"] / p, 2)
        cal = int(round((a["Glucides_g_j"] * 4) + (a["Proteines_g_j"] * 4) + (a["Lipides_g_j"] * 9)))
        
        # Profil calculé
        if wftp >= 5.7 and w5s < 17.5:
            prof_calc = "Grimpeur"
        elif w5s >= 19.0 and wftp < 5.2:
            prof_calc = "Sprinteur"
        elif w5s >= 19.0 and wftp >= 5.2:
            prof_calc = "Puncheur / Puissance hybride"
        else:
            prof_calc = "Rouleur / Polyvalent"
            
        # Diagnostic
        if a["Cycliste"] == "Romain Bardet":
            diag = "Alerte Déficit Glucidique (5.08 g/kg) & Risque RED-S (MG 4.9%)"
        elif a["Cycliste"] == "Hugo Hofstetter":
            diag = "Alerte Déficit Glucidique (5.83 g/kg) & Hydratation faible (2.8L)"
        elif a["Cycliste"] == "Julien Pinot":
            diag = "Conforme (Rapport W/kg optimal 6.15 W/kg, apports équilibrés)"
        elif a["Cycliste"] == "Lucas Van Aert":
            diag = "Conforme (Profil Sprinteur lourd 20.3 W/kg, FTP solide 5.0 W/kg)"
        elif a["Cycliste"] == "Thomas De Gendt":
            diag = "Conforme (Profil Baroudeur équilibré, endurance de seuil)"
        elif a["Cycliste"] == "Sam Bennett":
            diag = "Conforme (Pmax 21.2 W/kg préservée pour arrivées massives)"
        elif a["Cycliste"] == "Thibaut Gaudu":
            diag = "Conforme (Excellent punch en côte 17.1 W/kg et FTP 5.87 W/kg)"
        elif a["Cycliste"] == "Mathieu Van der Poel":
            diag = "Conforme (Moteur aérobie/anaérobie hors-norme, 3880 kcal)"
        else:
            diag = "Conforme"
            
        row = [
            a["Cycliste"], p, a["Masse_Grasse_pct"], a["Pmax_5s_W"], a["P_5min_W"], a["FTP_20min_W"],
            w5s, w5min, wftp,
            g_kg, prot_kg, lip_kg, cal,
            a["Profil_Declare"], prof_calc, diag
        ]
        ws.append(row)
        
    # Styling
    header_fill = PatternFill(start_color="1B365D", end_color="1B365D", fill_type="solid")
    header_font = Font(name="Segoe UI", size=10, bold=True, color="FFFFFF")
    data_font = Font(name="Segoe UI", size=9.5)
    border_thin = Border(left=Side(style='thin', color='D9D9D9'),
                         right=Side(style='thin', color='D9D9D9'),
                         top=Side(style='thin', color='D9D9D9'),
                         bottom=Side(style='thin', color='D9D9D9'))
                         
    fill_alert = PatternFill(start_color="FCE4D6", end_color="FCE4D6", fill_type="solid")
    font_alert = Font(name="Segoe UI", size=9.5, bold=True, color="C00000")
    
    fill_ok = PatternFill(start_color="E2EFDA", end_color="E2EFDA", fill_type="solid")
    font_ok = Font(name="Segoe UI", size=9.5, color="375623")
    
    for col_idx in range(1, len(headers)+1):
        cell = ws.cell(row=1, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        
    ws.row_dimensions[1].height = 28
    
    for row_idx in range(2, len(raw_athletes)+2):
        ws.row_dimensions[row_idx].height = 22
        for col_idx in range(1, len(headers)+1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.font = data_font
            cell.border = border_thin
            if col_idx in [1, 14, 15]:
                cell.alignment = Alignment(horizontal="left", vertical="center")
            elif col_idx == 16:
                cell.alignment = Alignment(horizontal="left", vertical="center")
                if "Alerte" in str(cell.value):
                    cell.fill = fill_alert
                    cell.font = font_alert
                else:
                    cell.fill = fill_ok
                    cell.font = font_ok
            else:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                
    for col in ws.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = max(max_len + 3, 11)
        
    ws.column_dimensions['P'].width = 45 # Diagnostic column
    
    wb.save(filepath)
    print(f"Expected Excel generated: {filepath}")

# -------------------------------------------------------------
# 3. Génération du document Word officiel Exercice-03.docx
# -------------------------------------------------------------
def generate_word_instructions(filepath):
    doc = docx.Document()
    
    for section in doc.sections:
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        section.top_margin = Inches(0.85)
        section.bottom_margin = Inches(0.85)
        section.left_margin = Inches(0.85)
        section.right_margin = Inches(0.85)
        
    def add_p(text="", bold=False, italic=False, space_after=Pt(5), color=None, font_size=10.5):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = space_after
        p.paragraph_format.line_spacing = 1.15
        if text:
            r = p.add_run(text)
            r.font.name = "Segoe UI"
            r.font.size = Pt(font_size)
            r.bold = bold
            r.italic = italic
            if color:
                r.font.color.rgb = color
        return p

    def add_bullet(text, bold_prefix="", space_after=Pt(3), font_size=10.0):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = space_after
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = "Segoe UI"
            r_pre.font.size = Pt(font_size)
            r_pre.bold = True
        r = p.add_run(text)
        r.font.name = "Segoe UI"
        r.font.size = Pt(font_size)
        return p

    # En-tête
    p_header = add_p("Haute École Charlemagne — Spécialisation en Préparation Physique", italic=True, font_size=9, color=RGBColor(100, 100, 100), space_after=Pt(2))
    p_sub = add_p("UE Exploitation des outils informatiques spécifiques | Titulaire : Jérôme Foguenne", italic=True, font_size=9, color=RGBColor(100, 100, 100), space_after=Pt(12))

    # Titre Principal
    p_title = add_p("Exercice 03 — Power Query : Optimisation du Rapport Poids-Puissance & Profilage Cycliste", bold=True, font_size=14, color=RGBColor(31, 78, 121), space_after=Pt(10))

    # Cas professionnel
    add_p("1. Contexte professionnel de terrain", bold=True, font_size=11, color=RGBColor(31, 78, 121), space_after=Pt(3))
    p_cas = doc.add_paragraph()
    p_cas.paragraph_format.space_before = Pt(0)
    p_cas.paragraph_format.space_after = Pt(6)
    p_cas.paragraph_format.line_spacing = 1.15
    r = p_cas.add_run("Vous êtes ")
    r.font.name = "Segoe UI"; r.font.size = Pt(10.5)
    r = p_cas.add_run("préparateur physique et scientifique de la performance au sein d'une équipe cycliste professionnelle sur route")
    r.font.name = "Segoe UI"; r.font.size = Pt(10.5); r.bold = True
    r = p_cas.add_run(". Votre groupe est composé de 8 coureurs aux caractéristiques physiologiques hétérogènes (grimpeurs purs, sprinteurs puissants, rouleurs-baroudeurs et puncheurs).")
    r.font.name = "Segoe UI"; r.font.size = Pt(10.5)

    p_cas2 = doc.add_paragraph()
    p_cas2.paragraph_format.space_before = Pt(0)
    p_cas2.paragraph_format.space_after = Pt(8)
    p_cas2.paragraph_format.line_spacing = 1.15
    r = p_cas2.add_run("Le staff technique prépare les objectifs majeurs de la saison (courses par étapes avec cols hors catégorie, critériums et classiques ardennaises). Pour chaque athlète, ")
    r.font.name = "Segoe UI"; r.font.size = Pt(10.5)
    r = p_cas2.add_run("l'optimisation du rapport poids-puissance (W/kg) constitue l'arbitrage central")
    r.font.name = "Segoe UI"; r.font.size = Pt(10.5); r.bold = True
    r = p_cas2.add_run(" : chercher à perdre du poids à tout prix peut briser la puissance absolue et provoquer un déficit énergétique relatif (RED-S), tandis qu'un excès de masse corporelle anéantit les chances en col.")
    r.font.name = "Segoe UI"; r.font.size = Pt(10.5)

    # Mission
    add_p("2. Votre mission avec Power Query (Autonomie et Découverte)", bold=True, font_size=11, color=RGBColor(31, 78, 121), space_after=Pt(3))
    add_p("Contrairement aux exercices guidés, aucun tutoriel pas-à-pas n'est fourni. En tant que futur professionnel, vous devez explorer et mobiliser en autonomie les fonctionnalités de l'éditeur Power Query dans Microsoft Excel (onglet Données > Obtenir des données > À partir d'un classeur Excel) à partir du fichier « Exercice 03 - Donnees brutes cyclisme Wkg.xlsx » :", space_after=Pt(4), font_size=10.0)
    
    add_bullet("Importer la table « Export_Brut_Cyclisme » dans Power Query et valider le typage strict des données (Poids et Hydratation en Décimal, Puissances et Macronutriments en Entier).", "1. Importation & Nettoyage : ", font_size=10.0)
    add_bullet("Ajouter les colonnes de puissance relative : [W_kg_5s] (Pmax 5s / Poids), [W_kg_5min] (PMA 5min / Poids) et [W_kg_FTP] (FTP 20min / Poids).", "2. Ratios Poids-Puissance : ", font_size=10.0)
    add_bullet("Ajouter les colonnes relatives au poids : [Glucides_g_kg] (cible 7.0 à 10.0 g/kg/j en montagne), [Proteines_g_kg] (1.6 à 2.2 g/kg/j) et le total calorique journalier [Calories_kcal].", "3. Ratios Nutritionnels : ", font_size=10.0)
    add_bullet("Créer une colonne conditionnelle [Profil_Calcule] distinguant automatiquement : Grimpeur (si W/kg FTP >= 5.7 et W/kg 5s < 17.5), Sprinteur (si W/kg 5s >= 19.0 et W/kg FTP < 5.2), Puncheur / Puissance hybride, ou Rouleur / Polyvalent.", "4. Profilage Physiologique : ", font_size=10.0)
    add_bullet("Identifier via une colonne [Diagnostic_Alerte_Staff] les athlètes présentant un risque avéré de déficit nutritionnel, déshydratation ou RED-S.", "5. Détection des Alertes : ", font_size=10.0)
    add_bullet("Fermer et charger la requête sous forme de tableau Excel dans une feuille nommée « Extraction_PowerQuery ».", "6. Chargement dynamique : ", font_size=10.0, space_after=Pt(10))

    # Copie du résultat attendu
    add_p("3. Copie du résultat attendu (Référence de validation)", bold=True, font_size=11, color=RGBColor(31, 78, 121), space_after=Pt(3))
    add_p("Votre transformation Power Query doit aboutir à un tableau parfaitement conforme aux valeurs de référence ci-dessous :", space_after=Pt(4), font_size=10.0)

    # Tableau résumé attendu
    t_data = [
        ["Cycliste", "Poids", "FTP", "W/kg FTP", "Pmax 5s", "W/kg 5s", "Glucides/kg", "Profil Calculé", "Diagnostic Staff"],
        ["Julien Pinot", "58.5 kg", "360 W", "6.15", "920 W", "15.7", "8.20 g/kg", "Grimpeur", "Conforme (Rapport W/kg optimal)"],
        ["Lucas Van Aert", "78.0 kg", "390 W", "5.00", "1580 W", "20.3", "7.18 g/kg", "Sprinteur", "Conforme (Profil Sprinteur lourd)"],
        ["Romain Bardet", "61.0 kg", "350 W", "5.74", "940 W", "15.4", "5.08 g/kg", "Grimpeur", "Alerte Déficit Glucides & RED-S"],
        ["Thomas De Gendt", "71.5 kg", "385 W", "5.38", "1180 W", "16.5", "7.55 g/kg", "Rouleur / Poly.", "Conforme (Endurance de seuil)"],
        ["Sam Bennett", "76.5 kg", "360 W", "4.71", "1620 W", "21.2", "6.80 g/kg", "Sprinteur", "Conforme (Pmax 21.2 W/kg préservée)"],
        ["Thibaut Gaudu", "63.0 kg", "370 W", "5.87", "1080 W", "17.1", "8.10 g/kg", "Grimpeur", "Conforme (Punch en côte 17.1 W/kg)"],
        ["M. Van der Poel", "74.5 kg", "425 W", "5.70", "1510 W", "20.3", "8.46 g/kg", "Puncheur Hybride", "Conforme (Moteur aéro/anaérobie)"],
        ["Hugo Hofstetter", "72.0 kg", "320 W", "4.44", "1380 W", "19.2", "5.83 g/kg", "Sprinteur", "Alerte Déficit Glucides & Hydratation"]
    ]
    table = doc.add_table(rows=len(t_data), cols=len(t_data[0]))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = True
    
    for r_idx, row in enumerate(t_data):
        for c_idx, val in enumerate(row):
            cell = table.cell(r_idx, c_idx)
            cell.text = val
            p_cell = cell.paragraphs[0]
            p_cell.paragraph_format.space_before = Pt(2)
            p_cell.paragraph_format.space_after = Pt(2)
            r_c = p_cell.runs[0]
            r_c.font.name = "Segoe UI"
            r_c.font.size = Pt(8.5)
            if r_idx == 0:
                cell.paragraphs[0].runs[0].bold = True
                p_cell.alignment = WD_ALIGN_PARAGRAPH.CENTER
            elif c_idx == 0 or c_idx >= 7:
                p_cell.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                p_cell.alignment = WD_ALIGN_PARAGRAPH.CENTER

    add_p("", space_after=Pt(6))

    # Questions d'interprétation
    add_p("4. Questions professionnelles d'interprétation et d'aide à la décision", bold=True, font_size=11, color=RGBColor(31, 78, 121), space_after=Pt(4))
    add_p("La simple manipulation technique de Power Query ne constitue pas une fin en soi. En tant que préparateur physique, votre valeur ajoutée réside dans votre capacité à faire parler les données, à exercer votre esprit critique et à formuler des choix d'entraînement et de nutrition justifiés pour le staff :", space_after=Pt(4), font_size=10.0)

    p_q1 = doc.add_paragraph()
    p_q1.paragraph_format.space_before = Pt(2); p_q1.paragraph_format.space_after = Pt(4); p_q1.paragraph_format.line_spacing = 1.15
    r = p_q1.add_run("Question 1 — Analyse croisée Puissance absolue vs Puissance relative : "); r.bold = True; r.font.name = "Segoe UI"; r.font.size = Pt(10.0)
    r = p_q1.add_run("À partir des données extraites, confrontez les profils de Lucas Van Aert et de Julien Pinot. Quels constats biomécaniques et énergétiques établissez-vous ? Comment la prise en compte conjointe de la puissance absolue (Watts) et de la puissance relative (W/kg) oriente-t-elle l'analyse du préparateur physique selon le profil topographique des épreuves (plaine vs haute montagne) ?")
    r.font.name = "Segoe UI"; r.font.size = Pt(10.0)

    p_q2 = doc.add_paragraph()
    p_q2.paragraph_format.space_before = Pt(2); p_q2.paragraph_format.space_after = Pt(4); p_q2.paragraph_format.line_spacing = 1.15
    r = p_q2.add_run("Question 2 — Arbitrage masse corporelle, performance et intégrité physique : "); r.bold = True; r.font.name = "Segoe UI"; r.font.size = Pt(10.0)
    r = p_q2.add_run("Analysez la situation de Romain Bardet à la lumière de l'ensemble de ses indicateurs (puissance, composition corporelle et statut nutritionnel). Dans l'optique des étapes de haute montagne, le coureur envisage une perte de poids supplémentaire de 2 à 3 kg pour optimiser son ascension. En tant que préparateur physique, quelle position adoptez-vous face à cette démarche ? Justifiez votre raisonnement en identifiant les compromis physiologiques et les facteurs de risque.")
    r.font.name = "Segoe UI"; r.font.size = Pt(10.0)

    p_q3 = doc.add_paragraph()
    p_q3.paragraph_format.space_before = Pt(2); p_q3.paragraph_format.space_after = Pt(4); p_q3.paragraph_format.line_spacing = 1.15
    r = p_q3.add_run("Question 3 — Diagnostic nutritionnel et individualisation des apports : "); r.bold = True; r.font.name = "Segoe UI"; r.font.size = Pt(10.0)
    r = p_q3.add_run("Au regard des données nutritionnelles journalières et des objectifs compétitifs du groupe, identifiez les coureurs dont le profil nutritionnel vous paraît questionnable ou inadapté. Quelles préconisations d'ajustement proposez-vous au staff, tant sur le plan des macronutriments quotidiens que de la gestion du ravitaillement en course selon la spécificité des efforts à fournir ?")
    r.font.name = "Segoe UI"; r.font.size = Pt(10.0)

    p_q4 = doc.add_paragraph()
    p_q4.paragraph_format.space_before = Pt(2); p_q4.paragraph_format.space_after = Pt(6); p_q4.paragraph_format.line_spacing = 1.15
    r = p_q4.add_run("Question 4 — Conception de séances ciblées sur le terrain : "); r.bold = True; r.font.name = "Segoe UI"; r.font.size = Pt(10.0)
    r = p_q4.add_run("Sélectionnez deux coureurs aux profils physiologiques contrastés au sein de l'effectif. Pour chacun d'entre eux, concevez une séance d'entraînement clé sur le terrain en cohérence avec ses qualités dominantes et son objectif de compétition. Vous justifierez la structure de la séance (durées, intensités, cadences ou récupérations) et expliciterez les adaptations physiologiques et neuromusculaires visées.")
    r.font.name = "Segoe UI"; r.font.size = Pt(10.0)

    # Modalités et barème
    add_p("5. Modalités de remise & Barème d'évaluation (10 points)", bold=True, font_size=11, color=RGBColor(31, 78, 121), space_after=Pt(3))
    add_bullet("Déposez sur votre Espace Membre votre classeur Excel (.xlsx) contenant la requête Power Query active et vos réponses rédigées aux 4 questions (dans une feuille Excel dédiée ou un document Word d'analyse).", "Livrable : ", font_size=10.0)
    add_bullet("Maîtrise technique de Power Query (importation, typage strict, colonnes calculées W/kg et nutritionnelles, colonne conditionnelle de profilage) : 4 points.", "Barème officiel : ", font_size=10.0)
    add_bullet("Justesse du diagnostic physiologique et biomécanique (analyse W/kg vs Watts bruts, détection RED-S) : 3 points.", "", font_size=10.0)
    add_bullet("Pertinence scientifique des prescriptions nutritionnelles et des séances d'entraînement : 2 points.", "", font_size=10.0)
    add_bullet("Rigueur, clarté et professionnalisme de la présentation : 1 point.", "", font_size=10.0, space_after=Pt(6))

    doc.save(filepath)
    print(f"Word instructions generated: {filepath}")

# Execute generation
dest_dir_platform = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Plateforme-pr-parateur-physique\docs\public\documents"
dest_dir_drive = r"C:\Google Drive\Prépas light\HECh\Préparateur physique\Exercices\Exercice 03"

os.makedirs(dest_dir_platform, exist_ok=True)
os.makedirs(dest_dir_drive, exist_ok=True)

for d in [dest_dir_platform, dest_dir_drive]:
    generate_raw_excel(os.path.join(d, "Exercice 03 - Donnees brutes cyclisme Wkg.xlsx"))
    generate_expected_excel(os.path.join(d, "Exercice 03 - Production attendue.xlsx"))
    generate_word_instructions(os.path.join(d, "Exercice-03.docx"))

print("All Exercice 03 files successfully created!")
