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
    add_p("Les 4 grandes étapes de réalisation :", bold=True, space_after=Pt(4))
    add_bullet("Connexion à la source externe et ouverture de l'Éditeur Power Query", "Étape 1 : ")
    add_bullet("Contrôle qualité, nettoyage et typage rigoureux des colonnes métrologiques", "Étape 2 : ")
    add_bullet("Calcul des ratios physiologiques relatifs au poids corporel (g/kg/j)", "Étape 3 : ")
    add_bullet("Rédigez vos conclusions", "Étape 4 : ", space_after=Pt(12))

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
    add_p("Cliquez sur OK et attribuez le type Nombre décimal.")

    add_p("Chargement dans Excel : Dans l'onglet Accueil de Power Query, cliquez sur Fermer et charger > Fermer et charger dans... Choisissez Tableau dans une Nouvelle feuille nommée « Extraction_PowerQuery ».", space_after=Pt(10))

    # --- ÉTAPE 4 ---
    add_heading_1("4. Rédigez vos conclusions")
    add_p("À partir de votre tableau extrait sous Excel et en consultant l'onglet « Profils_Reperes_Staff », analysez les données et rédigez vos conclusions (sur une feuille dédiée ou dans un document Word) en répondant précisément aux 4 questions professionnelles suivantes :")

    add_bullet(
        "Comparez les apports glucidiques journaliers rapportés au poids corporel (g/kg/j) lors des séances à haute charge (Mardi et Jeudi, charge RPE > 600 UA). "
        "Identifiez les athlètes qui descendent sous le seuil critique (< 6.0 g/kg/j, comme Camille Bernard le jeudi à 5.0 g/kg avec une récupération 'Fatigué'). "
        "Expliquez les conséquences physiologiques directes sur la resynthèse du glycogène intramusculaire et la perte de puissance lors des séries lactiques à haute intensité.",
        "Question 1 — Disponibilité énergétique & Glucides : "
    )
    add_bullet(
        "Vérifiez si les cibles recommandées (1.6 à 2.2 g/kg/j) sont couvertes pour les athlètes ayant un profil de puissance et de renforcement musculaire (Maxime Laurent, Alexandre Faure, Emma Roux). "
        "Justifiez l'importance stratégique du timing d'ingestion d'une collation riche en acides aminés essentiels / leucine (20 à 30 g) dans les 45 minutes suivant la séance de musculation.",
        "Question 2 — Récupération protéique & Force : "
    )
    add_bullet(
        "Croisez les volumes hydriques déclarés (L/j) avec les kilométrages nagés en bassin (souvent > 10 km/j pour les demi-fondistes comme Lucas Mercier et Sarah Lefebvre). "
        "Rappelez pourquoi la déshydratation est sous-estimée en milieu aquatique (sudation masquée par l'eau) et démontrez son impact sur la dérive cardiovasculaire et l'élévation anormale de la perception de l'effort (RPE).",
        "Question 3 — Hydratation & Thermorégulation : "
    )
    add_bullet(
        "Formulez 3 recommandations nutritionnelles concrètes, individualisées et opérationnelles destinées à l'entraîneur principal et aux nageurs pour la semaine suivante : "
        "mise en place d'une boisson d'effort isotonique d'intra-séance, ajustement des collations de récupération post-bassin et protocole de pesée matinale pour surveiller l'état d'hydratation.",
        "Question 4 — Recommandations pour le staff : ",
        space_after=Pt(14)
    )

    add_p("Fin du tutoriel — Vous disposez d'un flux automatisé et d'une analyse d'aide à la décision rigoureuse pour le staff.", bold=True, italic=True)

    target_path = "docs/public/documents/Exercice-02a-Tutoriel.docx"
    doc.save(target_path)
    print(f"Exercice-02a-Tutoriel.docx mis à jour avec '4. Rédigez vos conclusions' : {target_path}")

if __name__ == "__main__":
    create_tutorial_02a_docx()
