import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_callout(doc, title, text, bg_hex="EFF6FF", border_hex="1E3A8A"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(6.5)
    
    cell = tbl.cell(0, 0)
    set_cell_background(cell, bg_hex)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="none"/>
            <w:left w:val="single" w:sz="36" w:space="0" w:color="{border_hex}"/>
            <w:bottom w:val="none"/>
            <w:right w:val="none"/>
        </w:tcBorders>
    ''')
    tcPr.append(tcBorders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    run_t = p.add_run(f"📌 {title}\n")
    run_t.bold = True
    run_t.font.name = "Calibri"
    run_t.font.size = Pt(11)
    run_t.font.color.rgb = RGBColor(30, 58, 138)
    
    run_b = p.add_run(text)
    run_b.font.name = "Calibri"
    run_b.font.size = Pt(10)
    run_b.font.color.rgb = RGBColor(51, 65, 85)
    
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(4)
    p_after.paragraph_format.space_after = Pt(6)

doc = docx.Document()

# Page setup
section = doc.sections[0]
section.top_margin = Inches(0.8)
section.bottom_margin = Inches(0.8)
section.left_margin = Inches(0.8)
section.right_margin = Inches(0.8)

# Title
p_title = doc.add_paragraph()
p_title.paragraph_format.space_before = Pt(0)
p_title.paragraph_format.space_after = Pt(2)
r_title = p_title.add_run("EXERCICE 07 — MISSION PROFESSIONNELLE FINALE")
r_title.bold = True
r_title.font.name = "Calibri"
r_title.font.size = Pt(18)
r_title.font.color.rgb = RGBColor(30, 58, 138)

p_sub = doc.add_paragraph()
p_sub.paragraph_format.space_after = Pt(12)
r_sub = p_sub.add_run("Création d'un Modèle Décisionnel de Lutte contre le Surentraînement en Football\nSpécialisation Préparateur Physique — HECh (Épreuve Finale 30 points / 30%)")
r_sub.font.name = "Calibri"
r_sub.font.size = Pt(12)
r_sub.font.italic = True
r_sub.font.color.rgb = RGBColor(100, 116, 139)

add_callout(doc, "Mise en Situation Professionnelle", 
    "Vous êtes Head of Performance (Responsable de la préparation physique) d'un club de football professionnel. "
    "L'entraîneur principal et la direction sportive vous confient une mission stratégique prioritaire : "
    "concevoir et implémenter votre propre modèle prédictif et décisionnel pour lutter contre le surentraînement, anticiper les blessures sans sous-entraîner l'équipe, "
    "et optimiser la disponibilité des joueurs lors des matchs de haute intensité.")

h1 = doc.add_heading("1. Contexte & Données de Terrain Fournies", level=1)
h1.paragraph_format.space_before = Pt(12)
h1.paragraph_format.space_after = Pt(6)

doc.add_paragraph(
    "Durant un mésocycle de 6 semaines en cours de saison régulière, vous avez recueilli les données d'entraînement et de compétition des 20 joueurs de l'effectif professionnel. "
    "Les données sont compilées dans le fichier 'donnees_exercice_final_outils_informatiques.xlsx' et comportent 4 sources complémentaires :"
)

bullet_points = [
    "1. RAW_Effectif : Profil anthropométrique et physiologique (Postes, VMA, FC Max, FC Repos, Âge, Poids).",
    "2. RAW_GPS_Seances_Matchs : Télémétrie GPS des 36 séances et matchs (Distance totale, Course faible <14.4 km/h, Course modérée, Course à haute vitesse HSR 19.8-25.2 km/h, Sprints >25.2 km/h, Nb de sprints, Accélérations >3 m/s², Décélérations <-3 m/s², PlayerLoad, FC moyenne, FC max, Temps >85% FCmax, RPE de Foster).",
    "3. RAW_BienEtre_Hooper : Questionnaire matinal quotidien sur 42 jours consécutifs (Heures de sommeil, Qualité de sommeil, Stress, Fatigue, Courbatures, Score Hooper 4-28, Déclaration de douleur et zone anatomique).",
    "4. RAW_Tests_Neuromusculaires : Tests standardisés réalisés en Semaine 1 (Initial), Semaine 3 (Mi-parcours) et Semaine 6 (Bilan) : Sprint 10m, Sprint 30m, Détente CMJ, Navette Yo-Yo IR1 et Fréquence cardiaque sous-maximale à 12 km/h."
]
for bp in bullet_points:
    p = doc.add_paragraph(bp, style='List Bullet')
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(2)

h2 = doc.add_heading("2. Votre Mission : Concevoir votre Propre Modèle Anti-Surentraînement", level=1)
h2.paragraph_format.space_before = Pt(14)
h2.paragraph_format.space_after = Pt(6)

doc.add_paragraph(
    "Votre mission ne consiste pas à empiler des colonnes de chiffres ou à répéter passivement des formules standards. "
    "Vous devez faire preuve d'expertise méthodologique en concevant votre propre modèle d'arbitrage de la fatigue :"
)

add_callout(doc, "Cahier des Charges du Modèle Attendue",
    "1. Modélisation de la Charge Externe & Ratios ACWR : Calculez la charge aiguë (7j) et chronique (28j) non seulement sur la distance totale, mais également sur les métriques clés de haute intensité (Distance HSR, Sprints, Décélérations).\n"
    "2. Détection du Découplage Charge Externe / Interne : Repérez les athlètes dont le RPE et la FC augmentent de manière anormale alors que leur production mécanique (distance, vitesse de pointe) diminue.\n"
    "3. Intégration de la Récupération Subjektive (Hooper) : Établissez une règle liant le score Hooper à la décision d'entraînement (ex : Hooper >= 20 = alerte critique).\n"
    "4. Score Composite de Vulnérabilité (0 à 100) : Créez un indicateur synthétique classant chaque athlète selon un code couleur (Vert = Optimal / Jaune = Vigilance / Orange = Surmenage fonctionnel aigu / Rouge = Surentraînement non fonctionnel).\n"
    "5. Cockpit Décisionnel pour l'Entraîneur : Un tableau de bord visuel et immédiatement compréhensible lors du briefing matinal du staff technique.\n"
    "6. Plan d'Action Opérationnel Semaine 7 : Formulez au moins 4 préconisations individualisées d'entraînement et de gestion d'effectif pour le prochain match de championnat.")

h3 = doc.add_heading("3. Productions Attendues pour l'Évaluation", level=1)
h3.paragraph_format.space_before = Pt(14)
h3.paragraph_format.space_after = Pt(6)

outputs = [
    "1. Le classeur Microsoft Excel (.xlsx) automatisé comprenant vos calculs, votre algorithme de surentraînement et votre Cockpit décisionnel.",
    "2. Le rapport d'expertise (.docx ou .pdf) détaillant votre démarche méthodologique, la justification de vos seuils physiologiques, l'analyse des cas critiques détectés et vos recommandations pour le staff.",
    "3. Le cahier des charges et la maquette/prototype d'application mobile pour la collecte matinale des joueurs et la restitution d'alertes en temps réel au bord du terrain."
]
for out in outputs:
    p = doc.add_paragraph(out, style='List Bullet')
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(3)

add_callout(doc, "Barème & Critères d'Évaluation (30 points / 30%)",
    "• Rigueur de la structuration et pertinence des formules Excel : 6 pts\n"
    "• Qualité et originalité du modèle algorithmique anti-surentraînement : 8 pts\n"
    "• Ergonomie et lisibilité du Cockpit / Dashboard entraîneur : 6 pts\n"
    "• Justification scientifique et pertinence des décisions d'ajustement : 6 pts\n"
    "• Conception de l'outil de collecte et du prototype mobile : 4 pts")

f_sub_local = r"docs\public\documents\Exercice-07.docx"
f_sub_drive = r"C:\Google Drive\Prépas light\HECh\Préparateur physique\Exercices\Exercice 07\Exercice-07.docx"

doc.save(f_sub_local)
try:
    doc.save(f_sub_drive)
except Exception as e:
    print(f"Drive warning: {e}")
print(f"SUCCESS: Created {f_sub_local} and {f_sub_drive}!")
