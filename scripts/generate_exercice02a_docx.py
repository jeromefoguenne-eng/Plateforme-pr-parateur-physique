import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_a4_guidelines_doc():
    doc = docx.Document()
    
    # -------------------------------------------------------------
    # Configuration des marges A4 (2 cm partout pour maximiser 1 page)
    # -------------------------------------------------------------
    sections = doc.sections
    for section in sections:
        section.page_width = Inches(8.27)   # A4
        section.page_height = Inches(11.69)  # A4
        section.top_margin = Inches(0.55)    # ~1.4 cm
        section.bottom_margin = Inches(0.55) # ~1.4 cm
        section.left_margin = Inches(0.65)   # ~1.6 cm
        section.right_margin = Inches(0.65)  # ~1.6 cm

    # Couleurs de la charte
    COLOR_PRIMARY = RGBColor(30, 58, 138)    # Bleu marine HECh
    COLOR_SECONDARY = RGBColor(13, 148, 136) # Teal / Vert sport
    COLOR_TEXT = RGBColor(30, 41, 59)        # Slate 800
    COLOR_MUTED = RGBColor(100, 116, 139)    # Slate 500

    # 1. En-tête Institutionnel
    p_header = doc.add_paragraph()
    p_header.paragraph_format.space_before = Pt(0)
    p_header.paragraph_format.space_after = Pt(2)
    p_header.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
    
    r_sub = p_header.add_run("HAUTE ÉCOLE CHARLEMAGNE — SPÉCIALISATION EN PRÉPARATION PHYSIQUE\n")
    r_sub.font.name = "Segoe UI"
    r_sub.font.size = Pt(8.5)
    r_sub.font.bold = True
    r_sub.font.color.rgb = COLOR_MUTED
    
    r_title = p_header.add_run("Exercice 02.a — Extraction Power Query & Monitoring Nutritionnel (Natation)")
    r_title.font.name = "Segoe UI"
    r_title.font.size = Pt(13)
    r_title.font.bold = True
    r_title.font.color.rgb = COLOR_PRIMARY

    # 2. Contexte & Mission du Préparateur Physique
    p_ctx = doc.add_paragraph()
    p_ctx.paragraph_format.space_before = Pt(3)
    p_ctx.paragraph_format.space_after = Pt(4)
    p_ctx.paragraph_format.line_spacing = 1.05
    
    r_ctx_lbl = p_ctx.add_run("🎯 Mise en situation professionnelle :\n")
    r_ctx_lbl.font.name = "Segoe UI"
    r_ctx_lbl.font.size = Pt(9.5)
    r_ctx_lbl.font.bold = True
    r_ctx_lbl.font.color.rgb = COLOR_SECONDARY
    
    r_ctx = p_ctx.add_run(
        "Vous êtes préparateur physique en charge d'un collectif de 8 nageurs de niveau national (sprint et demi-fond) "
        "en pleine phase de charge intensive pré-compétitive (doubles séances biquotidiennes en bassin + musculation). "
        "Pour prévenir les états de fatigue chronique, le syndrome de déficit énergétique relatif dans le sport (RED-S) et "
        "optimiser la surcompensation glycogénique, chaque athlète a saisi son journal nutritionnel quotidien pendant 7 jours. "
        "Votre mission : automatiser l'extraction et la transformation de ces données brutes avec l'outil Power Query d'Excel, "
        "calculer les ratios nutritionnels relatifs au poids corporel (g/kg/j) et produire un diagnostic d'aide à la décision pour le staff."
    )
    r_ctx.font.name = "Segoe UI"
    r_ctx.font.size = Pt(8.5)
    r_ctx.font.color.rgb = COLOR_TEXT

    # 3. Consignes Techniques (Power Query)
    p_steps = doc.add_paragraph()
    p_steps.paragraph_format.space_before = Pt(3)
    p_steps.paragraph_format.space_after = Pt(4)
    p_steps.paragraph_format.line_spacing = 1.05
    
    r_steps_lbl = p_steps.add_run("⚙️ Étape 1 : Extraction & Transformation des données sous Power Query (Excel)\n")
    r_steps_lbl.font.name = "Segoe UI"
    r_steps_lbl.font.size = Pt(9.5)
    r_steps_lbl.font.bold = True
    r_steps_lbl.font.color.rgb = COLOR_PRIMARY
    
    steps_text = (
        "1. Ouvrez un classeur Excel vierge et importez le fichier « Exercice 02a - Donnees brutes nutrition natation.xlsx » "
        "via l'onglet Données > Obtenir des données > À partir d'un fichier > À partir d'un classeur Excel.\n"
        "2. Dans la fenêtre du Navigateur, sélectionnez la table « Export_Brut_Nutrition » et cliquez impérativement sur Transformer les données.\n"
        "3. Dans l'Éditeur Power Query :\n"
        "   • Vérifiez et appliquez les types de données adéquats (Date, Texte, Nombre décimal pour le poids/distance, Nombre entier pour calories/glucides).\n"
        "   • Ajoutez des Colonnes personnalisées calculées pour normaliser les apports selon le poids de corps de chaque athlète :\n"
        "       - [Glucides_g_kg] = [Glucides_g] / [Poids_kg] (arrondi à 1 décimale)\n"
        "       - [Proteines_g_kg] = [Proteines_g] / [Poids_kg] (arrondi à 1 décimale)\n"
        "       - [Lipides_g_kg] = [Lipides_g] / [Poids_kg] (arrondi à 1 décimale)\n"
        "   • Créez une Colonne conditionnelle [Alerte_Glucides] : Si [Charge_RPE_UA] >= 600 et [Glucides_g_kg] < 6.0 alors « Déficit critique », sinon « Conforme ».\n"
        "4. Cliquez sur Fermer et charger dans... et chargez le résultat sous forme de Tableau structuré dans une feuille nommée « Extraction_PowerQuery »."
    )
    r_steps = p_steps.add_run(steps_text)
    r_steps.font.name = "Segoe UI"
    r_steps.font.size = Pt(8.5)
    r_steps.font.color.rgb = COLOR_TEXT

    # 4. Consignes d'Analyse & Interprétation Terrain
    p_ana = doc.add_paragraph()
    p_ana.paragraph_format.space_before = Pt(3)
    p_ana.paragraph_format.space_after = Pt(4)
    p_ana.paragraph_format.line_spacing = 1.05
    
    r_ana_lbl = p_ana.add_run("📊 Étape 2 : Analyse décisionnelle du Préparateur Physique (Grille d'interprétation)\n")
    r_ana_lbl.font.name = "Segoe UI"
    r_ana_lbl.font.size = Pt(9.5)
    r_ana_lbl.font.bold = True
    r_ana_lbl.font.color.rgb = COLOR_PRIMARY
    
    ana_text = (
        "À partir de votre table extraite et de l'onglet « Profils_Reperes_Staff », répondez aux 4 questions professionnelles suivantes :\n"
        "• Question 1 (Disponibilité énergétique & Glucides) : Identifiez le ou les athlètes présentant un apport glucidique insuffisant par rapport à leur volume kilométrique et leur charge RPE lors des journées à haute intensité (Mardi/Jeudi). Quelles sont les conséquences neuromusculaires directes en bassin ?\n"
        "• Question 2 (Récupération protéique) : Les cibles protéiques (1.6 à 2.2 g/kg/j) sont-elles respectées pour les profils axés sur la force (nageurs de brasse et sprint) ? Justifiez l'importance du timing d'ingestion post-séance de musculation.\n"
        "• Question 3 (Hydratation & Charge d'entraînement) : Croisez les apports hydriques (L/jour) avec les distances nagées. Quel nageur présente un risque d'hypohydratation menaçant la thermorégulation et augmentant la perception de l'effort (RPE) ?\n"
        "• Question 4 (Recommandations staff) : Rédigez 3 ajustements nutritionnels concrets et individualisés à transmettre aux entraîneurs pour la semaine suivante."
    )
    r_ana = p_ana.add_run(ana_text)
    r_ana.font.name = "Segoe UI"
    r_ana.font.size = Pt(8.5)
    r_ana.font.color.rgb = COLOR_TEXT

    # 5. Livrables et Critères d'Évaluation
    p_liv = doc.add_paragraph()
    p_liv.paragraph_format.space_before = Pt(3)
    p_liv.paragraph_format.space_after = Pt(0)
    p_liv.paragraph_format.line_spacing = 1.05
    
    r_liv_lbl = p_liv.add_run("📁 Livrable attendu & Barème d'évaluation (Sur 10 points) :\n")
    r_liv_lbl.font.name = "Segoe UI"
    r_liv_lbl.font.size = Pt(9)
    r_liv_lbl.font.bold = True
    r_liv_lbl.font.color.rgb = COLOR_SECONDARY
    
    liv_text = (
        "• Livrable : Déposez sur votre Espace Membre votre classeur Excel (.xlsx) contenant la requête Power Query active "
        "et votre feuille d'interprétation rédigée (ou un document Word d'analyse associé).\n"
        "• Barème : Automatisation de la requête Power Query et colonnes calculées (4 pts) | Diagnostic individualisé des risques (RED-S, glycogène, hydratation) (3 pts) | "
        "Pertinence et réalisme des recommandations pour le staff (2 pts) | Qualité de présentation et rigueur métrologique (1 pt)."
    )
    r_liv = p_liv.add_run(liv_text)
    r_liv.font.name = "Segoe UI"
    r_liv.font.size = Pt(8)
    r_liv.font.italic = True
    r_liv.font.color.rgb = COLOR_TEXT

    target_path = "docs/public/documents/Exercice-02a.docx"
    doc.save(target_path)
    print(f"Document Word A4 créé avec succès : {target_path}")

if __name__ == "__main__":
    create_a4_guidelines_doc()
