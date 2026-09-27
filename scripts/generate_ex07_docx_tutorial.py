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
r_title = p_title.add_run("TUTORIEL MÉTHODOLOGIQUE PAS-À-PAS")
r_title.bold = True
r_title.font.name = "Calibri"
r_title.font.size = Pt(18)
r_title.font.color.rgb = RGBColor(30, 58, 138)

p_sub = doc.add_paragraph()
p_sub.paragraph_format.space_after = Pt(12)
r_sub = p_sub.add_run("Exercice 07 : Concevoir son Modèle de Détection & Lutte contre le Surentraînement en Football\nSpécialisation Préparateur Physique — HECh (Évaluation Finale 30 points / 30%)")
r_sub.font.name = "Calibri"
r_sub.font.size = Pt(12)
r_sub.font.italic = True
r_sub.font.color.rgb = RGBColor(100, 116, 139)

add_callout(doc, "Cadre Professionnel de l'Exercice", 
    "Dans le football de haut niveau contemporain, le préparateur physique ne doit plus se limiter à enregistrer des kilomètres. "
    "Son rôle déterminant est de croiser les signaux faibles pour distinguer le surmenage fonctionnel bénéfique (Functional Overreaching) "
    "du surmenage non fonctionnel dangereux (Non-Functional Overreaching) qui mène au syndrome de surentraînement (Overtraining Syndrome) et à la blessure. "
    "Ce tutoriel vous guide pas-à-pas pour bâtir votre propre modèle algorithmique sous Microsoft Excel.")

# Sommaire
p_toc = doc.add_paragraph()
p_toc.paragraph_format.space_before = Pt(6)
p_toc.paragraph_format.space_after = Pt(6)
r_toc = p_toc.add_run("Les 6 Étapes Fondamentales de votre Modèle :")
r_toc.bold = True
r_toc.font.size = Pt(12)

steps = [
    "Étape 1 : Structuration et Contrôle Qualité des Métriques GPS, Cardio et Bien-Être",
    "Étape 2 : Quantification des Ratios de Charge ACWR (Distance, Haute Vitesse HSR, Sprints)",
    "Étape 3 : Détection du Découplage Charge Externe vs Charge Interne & Dérive Cardiaque",
    "Étape 4 : Modélisation Algorithmique du Score de Vulnérabilité au Surentraînement (/100)",
    "Étape 5 : Conception du Cockpit Décisionnel pour le Staff & Plan d'Action Semaine 7",
    "Étape 6 : Prototypage de l'Outil de Collecte Smartphone & Alertes Terrain"
]
for s in steps:
    p_s = doc.add_paragraph(s, style='List Bullet')
    p_s.paragraph_format.space_before = Pt(1)
    p_s.paragraph_format.space_after = Pt(2)

doc.add_paragraph().paragraph_format.space_after = Pt(8)

# ------------------------------------------------------------------------------
# ÉTAPE 1
# ------------------------------------------------------------------------------
h1 = doc.add_heading("Étape 1 : Structuration des Métriques GPS & Contrôle Qualité", level=1)
h1.paragraph_format.space_before = Pt(14)
h1.paragraph_format.space_after = Pt(6)

doc.add_paragraph(
    "Ouvrez le classeur 'donnees_exercice_final_outils_informatiques.xlsx'. Vous disposez des données brutes de 20 joueurs sur 6 semaines. "
    "Avant toute formule complexe, vérifiez l'intégrité de vos variables dans la feuille 'RAW_GPS_Seances_Matchs' :"
)
p1_1 = doc.add_paragraph("• Vérifiez la cohérence entre la Durée (min) et la Distance totale (km).", style='List Bullet')
p1_2 = doc.add_paragraph("• Contrôlez les seuils de vitesse : Faible (<14.4 km/h), Modérée (14.4-19.8 km/h), HSR (19.8-25.2 km/h) et Sprint (>25.2 km/h).", style='List Bullet')
p1_3 = doc.add_paragraph("• Assurez-vous que la colonne Charge_RPE = Durée × RPE soit calculée sans rupture de formule.", style='List Bullet')

# ------------------------------------------------------------------------------
# ÉTAPE 2
# ------------------------------------------------------------------------------
h2 = doc.add_heading("Étape 2 : Quantification des Ratios de Charge ACWR", level=1)
h2.paragraph_format.space_before = Pt(14)
h2.paragraph_format.space_after = Pt(6)

doc.add_paragraph(
    "Le modèle de Gabbett (Acute:Chronic Workload Ratio) compare la charge aiguë des 7 derniers jours (fatigue immédiate) "
    "à la charge chronique des 28 derniers jours (forme et préparation de base). Dans le football moderne, l'ACWR doit être calculé sur :"
)
p2_1 = doc.add_paragraph("• L'ACWR Distance Totale (Charge mécanique globale).", style='List Bullet')
p2_2 = doc.add_paragraph("• L'ACWR Courses à Haute Vitesse (HSR) et Sprints (Facteur d'alerte spécifique pour les ischio-jambiers).", style='List Bullet')
p2_3 = doc.add_paragraph("• La Monotonie de Foster = Moyenne quotidienne / Écart-type (Alerte si > 2.0).", style='List Bullet')

add_callout(doc, "Interprétation des Seuils ACWR",
    "• ACWR < 0.8 : Zone de sous-charge (risque de désentraînement et vulnérabilité).\n"
    "• 0.8 <= ACWR <= 1.3 : 'Sweet Spot' (zone optimale de progression et de tolérance).\n"
    "• 1.3 < ACWR < 1.5 : Zone de vigilance (surveillance accrue).\n"
    "• ACWR >= 1.5 : 'Danger Zone' (sur-charge aiguë majeure, risque de blessure multiplié par 2 à 4).")

# ------------------------------------------------------------------------------
# ÉTAPE 3
# ------------------------------------------------------------------------------
h3 = doc.add_heading("Étape 3 : Détection du Découplage Externe/Interne & Dérive Cardiaque", level=1)
h3.paragraph_format.space_before = Pt(14)
h3.paragraph_format.space_after = Pt(6)

doc.add_paragraph(
    "Le marqueur le plus précoce du surentraînement n'est pas la blessure, mais le découplage physiologique entre la charge produite et l'effort ressenti :"
)

add_callout(doc, "Le Syndrome de Découplage en Pratique",
    "1. Découplage RPE vs Distance : Observez les cas d'Ibrahima Koulibaly (ATH04) et Romain Claes (ATH11) en semaines 4 et 5. "
    "Leur distance parcourue et leur volume de sprint diminuent, alors que leur RPE atteint 9-10/10. Cela indique que l'organisme lutte pour produire un effort modéré.\n"
    "2. Dérive de la Fréquence Cardiaque sous-maximale : Lors du test standardisé à 12 km/h, une élévation de la FC de +8 à +12 bpm à vitesse constante "
    "associée à une perte de détente au saut CMJ (> -8%) signe une fatigue centrale et autonome sévère.\n"
    "3. Dette de sommeil et score Hooper : Tout score Hooper >= 20 associé à moins de 6 heures de sommeil aggrave le risque de surmenage non fonctionnel.")

# ------------------------------------------------------------------------------
# ÉTAPE 4
# ------------------------------------------------------------------------------
h4 = doc.add_heading("Étape 4 : Modélisation Algorithmique du Score de Vulnérabilité", level=1)
h4.paragraph_format.space_before = Pt(14)
h4.paragraph_format.space_after = Pt(6)

doc.add_paragraph(
    "Dans la feuille '01_Modelisation_Algorithme', vous devez créer votre propre formule pondérée pour calculer un Score Composite de Vulnérabilité de 0 à 100 points :"
)

add_callout(doc, "Exemple de Structure de Pondération de votre Score (/100)",
    "• Composante 1 : ACWR Distance & Sprints (Pondération 35%) — Points attribués si ACWR > 1.3 ou > 1.5.\n"
    "• Composante 2 : Score de Récupération Hooper (Pondération 25%) — Points proportionnels à l'élévation du score (4 à 28).\n"
    "• Composante 3 : Découplage RPE / Production mécanique (Pondération 20%) — Points si RPE disproportionné.\n"
    "• Composante 4 : Perte Neuromusculaire CMJ (Pondération 20%) — Points si chute de performance au saut > 5%.\n"
    "Classification : Vert (Score < 45, Optimal) | Jaune (45-60, Vigilance) | Orange (60-75, Surmenage aigu FOR) | Rouge (> 75, Surentraînement NFOR).")

# ------------------------------------------------------------------------------
# ÉTAPE 5
# ------------------------------------------------------------------------------
h5 = doc.add_heading("Étape 5 : Conception du Cockpit Staff & Décisions Semaine 7", level=1)
h5.paragraph_format.space_before = Pt(14)
h5.paragraph_format.space_after = Pt(6)

doc.add_paragraph(
    "Dans la feuille '00_Cockpit_Anti_Surentrainement', créez une interface synthétique pour le staff :"
)
p5_1 = doc.add_paragraph("• Cartes KPI d'impact : Effectif disponible, Nombre de joueurs sous alerte rouge, Qualité moyenne du sommeil.", style='List Bullet')
p5_2 = doc.add_paragraph("• Matrice des cas critiques prioritaires (ex: Koulibaly, Claes, Dubois) avec actions médicales et physiques immédiates.", style='List Bullet')
p5_3 = doc.add_paragraph("• 4 Préconisations argumentées pour la Semaine 7 (tapering collectif, découplage des jeux réduits SSG, titularisations adaptées).", style='List Bullet')

# ------------------------------------------------------------------------------
# ÉTAPE 6
# ------------------------------------------------------------------------------
h6 = doc.add_heading("Étape 6 : Prototypage de l'Application Mobile de Terrain", level=1)
h6.paragraph_format.space_before = Pt(14)
h6.paragraph_format.space_after = Pt(6)

doc.add_paragraph(
    "Détaillez le fonctionnement d'une application smartphone connectée au tableur :"
)
p6_1 = doc.add_paragraph("• Écran Athlète : Check-in matinal Hooper en 30 secondes + RPE post-séance en 2 clics.", style='List Bullet')
p6_2 = doc.add_paragraph("• Écran Préparateur : Notification push automatique dès qu'un athlète dépasse le seuil critique avant l'entraînement.", style='List Bullet')
p6_3 = doc.add_paragraph("• Écran Entraîneur : Feu tricolore de disponibilité de l'effectif pour la mise en place tactique.", style='List Bullet')

f_tut_local = r"docs\public\documents\Exercice-07-Tutoriel.docx"
f_tut_drive = r"C:\Google Drive\Prépas light\HECh\Préparateur physique\Exercices\Exercice 07\Exercice-07-Tutoriel.docx"

doc.save(f_tut_local)
try:
    doc.save(f_tut_drive)
except Exception as e:
    print(f"Drive warning: {e}")
print(f"SUCCESS: Created {f_tut_local} and {f_tut_drive}!")
