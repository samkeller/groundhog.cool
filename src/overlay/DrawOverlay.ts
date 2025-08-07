import { Application, Container, Renderer, Text, Graphics, TextStyle } from "pixi.js";
import { ECS, Entity } from "../ECS";
import GroundhogTagComponent from "../components/tags/GroundhogTagComponent";
import OwnedByComponent from "../components/relations/OwnedByComponent";
import BurrowTagComponent from "../components/tags/BurrowTagComponent";
import FoodStockComponent from "../components/FoodStockComponent";
import { getSpawnCost } from "../utils/MathUtils";

let overlayContainer: Container | null = null;
let statsPanel: Container | null = null;

export default function DrawOverlay(
    app: Application<Renderer>,
    ecs: ECS,
    playerEntity: Entity
) {
    // Si l'overlay n'existe pas, on le crée et on l'ajoute à la scène
    if (!overlayContainer) {
        overlayContainer = new Container();
        overlayContainer.label = "overlay";
        overlayContainer.width = app.screen.width;
        overlayContainer.height = app.screen.height;
        app.stage.addChild(overlayContainer);
        
        // Créer le panneau des statistiques
        statsPanel = createStatsPanel();
        overlayContainer.addChild(statsPanel);
    }

    // 1. Count de groundhogs appartenant au joueur
    const groundhogs = ecs.getEntitiesWith(GroundhogTagComponent, OwnedByComponent).filter(e =>
        ecs.getComponent(e, OwnedByComponent)!.ownerId === playerEntity
    );
    const groundhogCount = groundhogs.length;

    // 2. Coût du prochain spawn
    const nextSpawnCost = getSpawnCost(10, groundhogCount);

    // 3. Nourriture dans le mainBurrow (le terrier appartenant au joueur)
    const playerBurrows = ecs.getEntitiesWith(BurrowTagComponent, OwnedByComponent, FoodStockComponent).filter(e =>
        ecs.getComponent(e, OwnedByComponent)!.ownerId === playerEntity
    );
    
    const mainBurrow = playerBurrows[0]; // Premier terrier trouvé
    const burrowFood = mainBurrow ? ecs.getComponent(mainBurrow, FoodStockComponent)!.amount : 0;

    // Met à jour le panneau avec les nouvelles données
    updateStatsPanel(statsPanel!, groundhogCount, nextSpawnCost, burrowFood);
}

function createStatsPanel(): Container {
    const panel = new Container();
    panel.x = 20;
    panel.y = 20;

    // Fond du panneau avec coins arrondis
    const background = new Graphics()
        .roundRect(0, 0, 280, 120, 12)
        .fill({ color: 0x2c3e50, alpha: 0.9 })
        .stroke({ color: 0x34495e, width: 2, alpha: 0.8 });
    
    panel.addChild(background);

    // Titre du panneau
    const titleStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 18,
        fontWeight: 'bold',
        fill: 0xecf0f1,
        dropShadow: {
            distance: 2,
            angle: Math.PI / 4,
            color: 0x000000,
            alpha: 0.5
        }
    });

    const title = new Text({ text: '🏠 Colony Status', style: titleStyle });
    title.x = 15;
    title.y = 10;
    panel.addChild(title);

    // Style pour les statistiques
    const statStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 14,
        fill: 0xbdc3c7,
        lineHeight: 22
    });

    // Textes des statistiques (seront mis à jour)
    const groundhogText = new Text({ text: '', style: statStyle });
    groundhogText.x = 20;
    groundhogText.y = 45;
    groundhogText.label = 'groundhogText';
    panel.addChild(groundhogText);

    const costText = new Text({ text: '', style: statStyle });
    costText.x = 20;
    costText.y = 67;
    costText.label = 'costText';
    panel.addChild(costText);

    const foodText = new Text({ text: '', style: statStyle });
    foodText.x = 20;
    foodText.y = 89;
    foodText.label = 'foodText';
    panel.addChild(foodText);

    return panel;
}

function updateStatsPanel(panel: Container, groundhogCount: number, nextSpawnCost: number, burrowFood: number) {
    const groundhogText = panel.getChildByLabel('groundhogText') as Text;
    const costText = panel.getChildByLabel('costText') as Text;
    const foodText = panel.getChildByLabel('foodText') as Text;

    // Mise à jour avec des icônes et couleurs
    groundhogText.text = `🦫 Groundhogs: ${groundhogCount}`;
    
    // Couleur différente selon si on peut se permettre le prochain spawn
    const canAfford = burrowFood >= nextSpawnCost;
    const costColor = canAfford ? 0x27ae60 : 0xe74c3c;
    costText.style.fill = costColor;
    costText.text = `💰 Next spawn cost: ${nextSpawnCost}`;
    
    // Couleur de la nourriture selon la quantité
    const foodColor = burrowFood > 100 ? 0x27ae60 : burrowFood > 50 ? 0xf39c12 : 0xe74c3c;
    foodText.style.fill = foodColor;
    foodText.text = `🍎 Burrow food: ${burrowFood}`;
}