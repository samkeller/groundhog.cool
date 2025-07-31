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

export default function GroundhogSystem(ecs: ECS) {
    const groundhogs: Entity[] = ecs.getEntitiesWith(GroundhogTagComponent);

    for (const e of groundhogs) {
        const energyComponent = ecs.getComponent(e, EnergyComponent)!;
        const burrowHomeComponent = ecs.getComponent(e, BurrowHomeComponent)!;
        const canMoveComponent = ecs.getComponent(e, CanMoveComponent)!;
        const visionComponent = ecs.getComponent(e, VisionComponent)!;

        const speed = energyComponent.energy / 100;

        for (const targetId of visionComponent.visibles) {
            const isTreeComponent = ecs.getComponent(targetId, TreeTagComponent);
            const treePositionComponent = ecs.getComponent(targetId, PositionComponent)!;
            const foodComponent = ecs.getComponent(targetId, FoodStockComponent)!;

            if (isTreeComponent && foodComponent.amount > foodComponent.amountMax / 10) {
                console.log("j'ai trouvé un arbre super")
                ecs.addComponent(e, new MoveToIntentComponent({ ...treePositionComponent }));
                break; // une cible suffit
            }
        }


        // Fatigue -> Rentre à la base
        if (energyComponent.energy < 10) {
            ecs.addComponent(e, new MoveToIntentComponent(burrowHomeComponent.position))
        }
        // Random déplacements
        else if (Math.random() < 0.5) {
            const newDirection = (canMoveComponent.direction + Math.random() * 20 - 10) % 360;
            if (newDirection) {
                ecs.addComponent(e, new MoveIntentComponent(speed, newDirection))
            }
        } else {
            ecs.addComponent(e, new MoveIntentComponent(0, canMoveComponent.direction))
        }
    }
}
