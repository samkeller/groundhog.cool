import { Container, Graphics } from "pixi.js";
import { ECS, Entity } from "../ECS";
import PositionComponent from "../components/PositionComponent";
import EnergyComponent from "../components/EnergyComponent";
import FoodStockComponent from "../components/FoodStockComponent";

interface BarGraphics {
    container: Container;
    energyBar: Graphics;
    foodBar: Graphics;
}

// Map des barres de status par entité
const bars = new Map<number, BarGraphics>();

// Configuration des barres
const BAR_WIDTH = 40;
const BAR_HEIGHT = 6;
const BAR_SPACING = 2; // espace entre deux barres
const OFFSET_Y = 20; // distance au-dessus de l'entité

export default function StatusBarSystem(ecs: ECS, container: Container) {
    const entities = ecs.getEntitiesWith(PositionComponent);

    for (const id of entities) {
        const position = ecs.getComponent(id, PositionComponent);
        if (!position) continue;

        const energy = ecs.getComponent(id, EnergyComponent);
        const foodStock = ecs.getComponent(id, FoodStockComponent);

        if (!energy && !foodStock) {
            // Pas de barre à afficher, retirer si existant
            const bg = bars.get(id);
            if (bg) {
                container.removeChild(bg.container);
                bars.delete(id);
            }
            continue;
        }

        // Création des barres si pas encore
        let gfx = bars.get(id);
        if (!gfx) {
            const barContainer = new Container();
            const energyBar = new Graphics();
            const foodBar = new Graphics();
            barContainer.addChild(energyBar);
            barContainer.addChild(foodBar);
            container.addChild(barContainer);
            gfx = { container: barContainer, energyBar, foodBar };
            bars.set(id, gfx);
        }

        const { container: barContainer, energyBar, foodBar } = gfx;
        
        // Positionnement au-dessus de l'entité
        barContainer.x = position.x - BAR_WIDTH / 2;
        barContainer.y = position.y - OFFSET_Y;

        let offset = 0;
        // Dessin de la barre d'énergie
        if (energy) {
            energyBar.clear();
            // fond
            energyBar.beginFill(0x555555);
            energyBar.drawRect(0, offset, BAR_WIDTH, BAR_HEIGHT);
            energyBar.endFill();
            // niveau
            const ratio = Math.max(0, Math.min(1, energy.current / energy.max));
            energyBar.beginFill(0x00ff00);
            energyBar.drawRect(0, offset, BAR_WIDTH * ratio, BAR_HEIGHT);
            energyBar.endFill();
            offset += BAR_HEIGHT + BAR_SPACING;
        }

        // Dessin de la barre de stock de nourriture
        if (foodStock) {
            foodBar.clear();
            // fond
            foodBar.beginFill(0x555555);
            foodBar.drawRect(0, offset, BAR_WIDTH, BAR_HEIGHT);
            foodBar.endFill();
            // niveau
            const ratio = Math.max(0, Math.min(1, foodStock.current / foodStock.max));
            foodBar.beginFill(0xffff00);
            foodBar.drawRect(0, offset, BAR_WIDTH * ratio, BAR_HEIGHT);
            foodBar.endFill();
        }
    }
}
