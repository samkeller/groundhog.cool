![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/samkeller/groundhog.cool?utm_source=oss&utm_medium=github&utm_campaign=samkeller%2Fgroundhog.cool&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
## groundhogs.cool (ts version)

groundhogs.cool-ts est un jeu de simulation en TypeScript utilisant PixiJS pour l'affichage 2D. Le joueur contrôle une colonie de marmottes (groundhogs) qui peuvent se déplacer, consommer de l'énergie, et se reproduire à partir d'un terrier (burrow). Le terrain est généré procéduralement avec du bruit de Perlin et contient différents types de tuiles (herbe, eau, montagne) ainsi que des arbres générant de la nourriture.

Architecture
1. Entrée principale
main.ts : Point d’entrée. Initialise PixiJS, la carte, les entités, le joueur, et la boucle de jeu (tick).
2. Cartographie et génération
SimpleMap.ts : Génère la carte avec du bruit de Perlin, place les éléments (arbres, terrier).
MapDraw.ts : Dessine la carte avec @pixi/tilemap.
MapObjects.ts : Extrait les objets dessinables de la carte.
3. Entités
Base : Drawable.ts (hérite de Tickable, possède position, rotation, etc.)
Tickable : Tickable.ts (interface pour entités mises à jour à chaque tick)
Spécifiques :
Burrow.ts : Terrier, peut faire spawn des marmottes.
Groundhog.ts : Marmotte, se déplace, consomme de l’énergie, retourne au terrier si faible énergie.
Tree.ts : Arbre, génère de la nourriture.
4. Moteur de jeu
IntentProcessor.ts : Applique les intentions (spawn, move, moveTo) générées par les entités à chaque tick.
TTickIntent.ts : Définit les types d’intentions possibles.
TTickContext.ts : Contexte passé à chaque entité à chaque tick.
5. Utilitaires
MoveUtils.ts : Calcul de déplacement, vérification de la validité des mouvements.
PathUtils.ts : Calcul d’angle entre deux positions.
PathfindingUtils.ts : Utilise la librairie pathfinding pour trouver des chemins (A*).
6. Overlay et UI
DrawOverlay.ts : Affiche des informations sur le joueur (ex : nourriture).
7. Interaction utilisateur
mouseFunctions.ts : Gestion du zoom et du déplacement de la carte à la souris.
Fonctionnement
Initialisation :

La carte est générée, les entités sont placées.
PixiJS affiche la scène.
Boucle de jeu (tick) :

Chaque entité (Tickable) génère une intention (TTickIntent) selon son état et le contexte.
L’IntentProcessor applique ces intentions : déplacement, spawn, etc.
Les entités sont redessinées à chaque tick.
Déplacement :

Les marmottes se déplacent selon leur énergie et leur logique interne.
Les déplacements sont validés par rapport à la carte (eau, montagne, obstacles).
Ressources :

Les arbres génèrent de la nourriture.
Le joueur utilise la nourriture pour faire apparaître de nouvelles marmottes.
Affichage :

La carte et les entités sont affichées avec PixiJS.
Un overlay affiche les ressources du joueur.
Points techniques
TypeScript strict (voir tsconfig.json)
Webpack pour le bundling.
PixiJS pour le rendu graphique.
Pathfinding pour les déplacements complexes (A*).
Architecture orientée entités/tick : chaque entité décide de son action à chaque tick.
Ce résumé permet à une autre IA de comprendre rapidement la structure, les responsabilités des fichiers, et le fonctionnement global du projet.