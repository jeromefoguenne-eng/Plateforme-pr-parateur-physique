import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

def create_tutorial_02a_docx():
    doc = docx.Document()
    
    # Configuration des marges standards (2.5 cm / ~0.984 inch comme les autres tutoriels)
    for section in doc.sections:
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        section.top_margin = Inches(0.984)
        section.bottom_margin = Inches(0.984)
        section.left_margin = Inches(0.984)
        section.right_margin = Inches(0.984)

    def add_p(text="", bold=False, italic=False, space_after=Pt(6)):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = space_after
        p.paragraph_format.line_spacing = 1.15
        if text:
            r = p.add_run(text)
            r.font.name = "Segoe UI"
            r.bold = bold
            r.italic = italic
        return p

    def add_heading_1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.15
        r = p.add_run(text)
        r.font.name = "Segoe UI"
        r.font.size = Pt(13)
        r.bold = True
        return p

    def add_heading_2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        r = p.add_run(text)
        r.font.name = "Segoe UI"
        r.font.size = Pt(11)
        r.bold = True
        return p

    def add_bullet(text, bold_prefix="", space_after=Pt(3)):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = space_after
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = "Segoe UI"
            r_pre.bold = True
        r = p.add_run(text)
        r.font.name = "Segoe UI"
        return p

    def add_step(num_str, title_str, desc_str):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        r_num = p.add_run(f"Action {num_str} — {title_str} : ")
        r_num.font.name = "Segoe UI"
        r_num.bold = True
        r_desc = p.add_run(desc_str)
        r_desc.font.name = "Segoe UI"
        return p

    # 1. En-tête Tutoriel
    p_top = add_p("TUTORIEL MÉTHODOLOGIQUE PAS-À-PAS", bold=True, space_after=Pt(2))
    p_title = add_p("Exercice 02.a : Extraction Power Query & Monitoring Nutritionnel en Natation", bold=True, space_after=Pt(12))

    # 2. Introduction méthodologique
    add_heading_2("Pourquoi utiliser Power Query en Préparation Physique ?")
    add_p(
        "Dans la pratique quotidienne du préparateur physique, la collecte de données (nutrition, cardio, GPS, questionnaires) "
        "génère des fichiers bruts hétérogènes. Réaliser des copier-coller manuels chaque jour est chronophage et source majeure d'erreurs humaines. "
        "Power Query est le moteur ETL (Extract, Transform, Load) intégré à Microsoft Excel : il enregistre chaque étape de transformation sous forme de script "
        "automatisé. Une fois la requête construite, un simple clic droit sur « Actualiser » met à jour l'ensemble de votre tableau de bord dès qu'un nouvel export est déposé."
    )

    # 3. Sommaire des étapes
    add_p("Les 5 grandes étapes de réalisation :", bold=True, space_after=Pt(4))
    add_bullet("Connexion à la source externe et ouverture de l'Éditeur Power Query", "Étape 1 : ")
    add_bullet("Contrôle qualité, nettoyage et typage rigoureux des colonnes métrologiques", "Étape 2 : ")
    add_bullet("Calcul des ratios physiologiques relatifs au poids corporel (g/kg/j)", "Étape 3 : ")
    add_bullet("Programmation de la règle d'alerte conditionnelle de déficit énergétique", "Étape 4 : ")
    add_bullet("Chargement dans Excel, vérification de la dynamicité et analyse décisionnelle pour le staff", "Étape 5 : ", space_after=Pt(12))

    # --- ÉTAPE 1 ---
    add_heading_1("Étape 1 : Connexion au fichier source et ouverture de Power Query")
    add_p("1. Ouvrez Microsoft Excel avec un nouveau classeur vierge.")
    add_p("2. Enregistrez immédiatement votre classeur sous le nom : « NOM_Prenom_Exercice-02a.xlsx ».")
    add_p("3. Dans le ruban supérieur d'Excel, cliquez sur l'onglet Données.")
    add_p("4. Cliquez sur le menu déroulant Obtenir des données (situé tout à gauche) > À partir d'un fichier > À partir d'un classeur Excel.")
    add_p("5. Naviguez dans vos dossiers et sélectionnez le fichier « Exercice 02a - Donnees brutes nutrition natation.xlsx ».")
    add_p("6. La fenêtre du Navigateur s'ouvre :")
    add_bullet("Cliquez sur l'onglet nommé « Export_Brut_Nutrition ».", "Sélection : ")
    add_bullet("Un aperçu des 56 lignes s'affiche à droite.", "Aperçu : ")
    add_bullet("ATTENTION : Ne cliquez SURTOUT PAS sur « Charger ». Cliquez impérativement sur le bouton « Transformer les données » en bas à droite pour ouvrir l'Éditeur Power Query.", "Règle clé : ", space_after=Pt(10))

    # --- ÉTAPE 2 ---
    add_heading_1("Étape 2 : Typage des données et contrôle qualité métrologique")
    add_p(
        "Dans l'Éditeur Power Query, chaque colonne possède une icône à gauche de son en-tête indiquant son type de données "
        "(ex : 123 = Entier, 1.2 = Nombre décimal, ABC = Texte, Calendrier = Date). "
        "Si un nombre est interprété comme du texte, aucun calcul physiologique ne sera possible dans Excel."
    )
    add_p("Vérifiez et appliquez les types suivants en cliquant sur l'icône de l'en-tête de chaque colonne :")
    add_bullet("Type Date (calendrier)", "• ID_Export, Nom_Prenom, Jour_Semaine, Sexe, Statut_Recup_Matin : Type Texte (ABC)\n• Date : ")
    add_bullet("Type Nombre décimal (1.2) afin de préserver la précision", "• Poids_kg, Distance_km, Hydratation_L : ")
    add_bullet("Type Nombre entier (123)", "• Seances_Jour, Charge_RPE_UA, Calories_kcal, Glucides_g, Proteines_g, Lipides_g : ")
    add_bullet("Dans la colonne [Poids_kg] ou [Distance_km], vérifiez dans le menu déroulant de filtre qu'aucune valeur n'est nulle (0), négative ou vide.", "Contrôle d'anomalie : ", space_after=Pt(10))

    # --- ÉTAPE 3 ---
    add_heading_1("Étape 3 : Calcul des indicateurs nutritionnels relatifs au poids (g/kg/j)")
    add_p(
        "Un apport de 400 g de glucides n'a pas la même signification physiologique pour un nageur de 82 kg que pour une nageuse de 57 kg. "
        "Le préparateur physique doit systématiquement raisonner en grammes par kilogramme de poids corporel par jour (g/kg/j)."
    )
    add_p("Dans le ruban de Power Query, rendez-vous sur l'onglet Ajouter une colonne > Colonne personnalisée :")
    
    add_step("3.1", "Calcul des Glucides relatifs", "Nommez la colonne « Glucides_g_kg ». Dans la boîte de formule, saisissez la formule suivante (en double-cliquant sur les colonnes dans la liste à droite) :")
    add_p("= [Glucides_g] / [Poids_kg]", italic=True)
    add_p("Cliquez sur OK. Puis cliquez sur l'icône de la nouvelle colonne et définissez son type sur Nombre décimal.")

    add_step("3.2", "Calcul des Protéines relatives", "Cliquez à nouveau sur Colonne personnalisée. Nommez la colonne « Proteines_g_kg ». Saisissez la formule :")
    add_p("= [Proteines_g] / [Poids_kg]", italic=True)
    add_p("Cliquez sur OK et attribuez le type Nombre décimal.")

    add_step("3.3", "Calcul des Lipides relatifs", "Cliquez sur Colonne personnalisée. Nommez la colonne « Lipides_g_kg ». Saisissez la formule :")
    add_p("= [Lipides_g] / [Poids_kg]", italic=True)
    add_p("Cliquez sur OK et attribuez le type Nombre décimal.", space_after=Pt(10))

    # --- ÉTAPE 4 ---
    add_heading_1("Étape 4 : Programmation de l'Alerte Conditionnelle de Déficit Énergétique")
    add_p(
        "Pour automatiser la détection des journées à haut risque de déplétion glycogénique et de fatigue anormale, "
        "nous créons une alerte visuelle automatique dès qu'une séance présente une charge RPE élevée (>= 600 UA) "
        "associée à un apport glucidique inférieur à 6.0 g/kg."
    )
    add_p("1. Toujours dans l'onglet Ajouter une colonne, cliquez sur Colonne conditionnelle.")
    add_p("2. Nommez la colonne « Alerte_Glucides ».")
    add_p("3. Configurez la règle de test logique ainsi :")
    add_bullet("Sélectionnez la colonne [Charge_RPE_UA] | Opérateur : « est supérieur ou égal à » | Valeur : 600", "Condition 1 : ")
    add_bullet("Cliquez sur Ajouter une clause. Sélectionnez [Glucides_g_kg] | Opérateur : « est inférieur à » | Valeur : 6", "Condition 2 : ")
    add_bullet("Dans la case « Sortie », écrivez : Alerte Déficit", "Résultat si VRAI : ")
    add_bullet("Dans la case « Sinon » (en bas), écrivez : Conforme", "Résultat par défaut : ")
    add_p("4. Cliquez sur OK. La colonne indique immédiatement « Alerte Déficit » pour les journées critiques (ex : Camille Bernard le Jeudi 09/10).", space_after=Pt(10))

    # --- ÉTAPE 5 ---
    add_heading_1("Étape 5 : Chargement dans Excel et Guide d'Interprétation Staff")
    add_p("1. Dans l'onglet Accueil de Power Query, cliquez sur la flèche sous le bouton Fermer et charger > Fermer et charger dans...")
    add_p("2. Choisissez Tableau, puis Nouvelle feuille de calcul. Nommez l'onglet créé : « Extraction_PowerQuery ».")
    add_p("3. Dans Excel, vérifiez la mise en forme des colonnes (sélectionnez les colonnes des ratios et appliquez le format Nombre à 1 décimale).")
    add_p("4. Rédigez vos conclusions dans un second onglet ou un document Word en suivant la grille d'aide ci-dessous :")
    
    add_bullet(
        "Comparez les journées de Mardi et Jeudi (charge RPE > 600 UA, volume > 6 km). "
        "Remarquez le profil de Camille Bernard (5.0 g/kg le jeudi avec une récupération 'Fatigué') et de Lucas Mercier (8.9 g/kg en demi-fond). "
        "Expliquez pourquoi un apport < 6 g/kg réduit la resynthèse du glycogène musculaire, baisse l'intensité de pointe sur les répétitions lactiques et élève le risque de blessure tendineuse.",
        "Aide Question 1 (Glucides & RED-S) : "
    )
    add_bullet(
        "Analysez les apports protéiques d'Alexandre Faure et Maxime Laurent (souvent > 2.1 g/kg/j). "
        "Validez que le total est optimal pour l'hypertrophie et la réparation myo-fibrillaire. "
        "Soulignez la recommandation du timing : ingestion d'une collation de 20 à 30 g de protéines riches en leucine dans les 45 minutes suivant la musculation.",
        "Aide Question 2 (Protéines & Musculation) : "
    )
    add_bullet(
        "Comparez l'apport hydrique par rapport aux kilomètres nagés. En milieu aquatique, la sudation est invisible mais bien réelle (0.5 à 1.2 L/h). "
        "Une déshydratation de 2 % de masse corporelle élève la fréquence cardiaque à l'effort et augmente artificiellement la perception de l'effort (RPE).",
        "Aide Question 3 (Hydratation de terrain) : "
    )
    add_bullet(
        "Formulez des consignes pragmatiques : ajuster les collations glucidiques liquides d'intra-séance (boisson d'effort isotonique), "
        "surveiller le poids matinal post-miction, et individualiser les rations lors des jours de biquotidiens.",
        "Aide Question 4 (Ajustements staff) : ",
        space_after=Pt(14)
    )

    add_p("Fin du tutoriel — Vous disposez d'une chaîne automatisée reproductible tout au long de la saison sportive.", bold=True, italic=True)

    target_path = "docs/public/documents/Exercice-02a-Tutoriel.docx"
    doc.save(target_path)
    print(f"Exercice-02a-Tutoriel.docx créé avec succès : {target_path}")

if __name__ == "__main__":
    create_tutorial_02a_docx()
