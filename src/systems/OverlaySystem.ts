import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { ECS } from "../ECS";
import GroundhogTagComponent from "../components/tags/GroundhogTagComponent";
import OwnedByComponent from "../components/relations/OwnedByComponent";
import BurrowTagComponent from "../components/tags/BurrowTagComponent";
import FoodStockComponent from "../components/FoodStockComponent";
import PlayerComponent from "../components/PlayerComponent";
import { getSpawnCost } from "../utils/MathUtils";
import { ApplicationService } from "../services/ApplicationService";
import Colors from "../utils/Colors";

const OVERLAY_LABELS = {
    statsPanel: "stats-panel",
    groundhogText: "groundhog-text",
    costText: "cost-text",
    foodText: "food-text"
};

export default function OverlaySystem(ecs: ECS, applicationService: ApplicationService) {
    // Trouver l'entité joueur
    const players = ecs.getEntitiesWith(PlayerComponent);
    if (players.length === 0) return; // Pas de joueur trouvé

    const playerEntity = players[0];

    const overlayContainer = applicationService.getOverlayContainer();

    // Récupérer ou créer le panneau des statistiques
    let statsPanel = overlayContainer.getChildByLabel(OVERLAY_LABELS.statsPanel) as Container;
    if (!statsPanel) {
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
    const burrowFood = ecs.getComponent(mainBurrow, FoodStockComponent)!.amount;

    // Met à jour le panneau avec les nouvelles données
    updateStatsPanel(statsPanel, groundhogCount, nextSpawnCost, burrowFood);
}

function createStatsPanel(): Container {
    const panel = new Container();
    panel.x = 20;
    panel.y = 20;
    panel.label = OVERLAY_LABELS.statsPanel;

    // Fond du panneau avec coins arrondis
    const background = new Graphics()
        .roundRect(0, 0, 280, 120, 12)
        .fill({ color: Colors.medium, alpha: 0.9 })
        .stroke({ color: Colors.medium, width: 2, alpha: 0.8 });

    panel.addChild(background);

    // Titre du panneau
    const titleStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 18,
        fontWeight: 'bold',
        fill: Colors.dark,
    });

    const title = new Text({ text: '🏠 Colony Status', style: titleStyle });
    title.x = 15;
    title.y = 10;
    panel.addChild(title);

    // Style pour les statistiques
    const statStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 14,
        fill: Colors.dark,
        lineHeight: 22
    });

    // Textes des statistiques (seront mis à jour)
    const groundhogText = new Text({ text: '', style: statStyle });
    groundhogText.x = 20;
    groundhogText.y = 45;
    groundhogText.style.fill = Colors.dark
    groundhogText.label = OVERLAY_LABELS.groundhogText;
    panel.addChild(groundhogText);

    const costText = new Text({ text: '', style: statStyle });
    costText.x = 20;
    costText.y = 67;
    costText.label = OVERLAY_LABELS.costText;
    panel.addChild(costText);

    const foodText = new Text({ text: '', style: statStyle });
    foodText.x = 20;
    foodText.y = 89;
    foodText.style.fill = Colors.dark
    foodText.label = OVERLAY_LABELS.foodText;
    panel.addChild(foodText);

    return panel;
}

function updateStatsPanel(panel: Container, groundhogCount: number, nextSpawnCost: number, burrowFood: number) {
    const groundhogText = panel.getChildByLabel(OVERLAY_LABELS.groundhogText) as Text;
    const costText = panel.getChildByLabel(OVERLAY_LABELS.costText) as Text;
    const foodText = panel.getChildByLabel(OVERLAY_LABELS.foodText) as Text;

    // Mise à jour avec des icônes et couleurs
    groundhogText.text = `🦫 Groundhogs: ${groundhogCount}`;

    // Couleur différente selon si on peut se permettre le prochain spawn
    const canAfford = burrowFood >= nextSpawnCost;
    const costColor = canAfford ? Colors.green : Colors.light;
    costText.style = new TextStyle({ ...costText.style, fill: costColor });
    costText.text = `💰 Next spawn cost: ${nextSpawnCost}`;

    // Couleur de la nourriture selon la quantité
    foodText.text = `🍎 Burrow food: ${burrowFood}`;
}
