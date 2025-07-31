import { ECS, Entity } from "../ECS";
import GroundhogTagComponent from "../components/tags/GroundhogTagComponent";
import EnergyComponent from "../components/EnergyComponent";
import MoveIntentComponent from "../components/intents/MoveIntentComponent";
import BurrowHomeComponent from "../components/BurrowHomeComponent";
import MoveToIntentComponent from "../components/intents/MoveToIntentComponent";
import CanMoveComponent from "../components/CanMoveComponent";
import VisionComponent from "../components/VisionComponent";
import TreeTagComponent from "../components/tags/TreeTagComponent";
import PositionComponent from "../components/PositionComponent";
import FoodStockComponent from "../components/FoodStockComponent";
import { positionsAreEqual } from "../utils/PathUtils";

export default function GroundhogSystem(ecs: ECS) {
    const groundhogs: Entity[] = ecs.getEntitiesWith(GroundhogTagComponent);

    for (const e of groundhogs) {
        const energyComponent = ecs.getComponent(e, EnergyComponent)!;
        const burrowHomeComponent = ecs.getComponent(e, BurrowHomeComponent)!;
        const canMoveComponent = ecs.getComponent(e, CanMoveComponent)!;
        const positionComponent = ecs.getComponent(e, PositionComponent)!;
        const moveToIntentComponent = ecs.getComponent(e, MoveToIntentComponent);

        const speed = energyComponent.energy / 100;
        if (
            energyComponent.energy < 10 &&
            !positionsAreEqual(positionComponent, burrowHomeComponent.position) &&
            (
                !moveToIntentComponent ||
                moveToIntentComponent?.target !== burrowHomeComponent.position
            )
        ) { // Fatigue -> Rentre à la base
            console.log("je veux retourner à la maison !")
            // Si déjà une activité en cours -> arrête
            ecs.removeComponent(e, MoveToIntentComponent)
            ecs.addComponent(e, new MoveToIntentComponent(burrowHomeComponent.position))
            continue;
        }

        if (!moveToIntentComponent) { // Cherche un arbre
            const visionComponent = ecs.getComponent(e, VisionComponent)!;
            for (const targetId of visionComponent.visibles) {
                const isTreeComponent = ecs.getComponent(targetId, TreeTagComponent);
                const treePositionComponent = ecs.getComponent(targetId, PositionComponent)!;
                const foodComponent = ecs.getComponent(targetId, FoodStockComponent)!;
                if (
                    isTreeComponent &&
                    foodComponent.amount > foodComponent.amountMax / 10 &&
                    !positionsAreEqual(positionComponent, treePositionComponent)
                ) {
                    console.log("j'ai trouvé un arbre !")
                    ecs.addComponent(e, new MoveToIntentComponent({ ...treePositionComponent }));
                    continue; // une cible suffit
                }
            }
        }

        if (Math.random() < 0.5) { // Random déplacements
            // TODO - MoveUtils.findValidDirection()
            const newDirection = (canMoveComponent.direction + Math.random() * 20 - 10) % 360;
            ecs.addComponent(e, new MoveIntentComponent(speed, newDirection))
            continue;

        }

    }
}
