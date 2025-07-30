import { ECS, Entity } from "../ECS";
import GroundhogTagComponent from "../components/tags/GroundhogTagComponent";
import EnergyComponent from "../components/EnergyComponent";
import MoveIntentComponent from "../components/intents/MoveIntentComponent";
import BurrowHomeComponent from "../components/BurrowHomeComponent";
import MoveToIntentComponent from "../components/intents/MoveToIntentComponent";
import PositionComponent from "../components/PositionComponent";
import CanMoveComponent from "../components/CanMoveComponent";
import MoveUtils from "../utils/MoveUtils";
import TickContext from "./TickContext";
import { TMap } from "../types/TMap";

export default function GroundhogSystem(ecs: ECS) {
    // const result: { entity: Entity, intent: TTickIntent }[] = [];

    // const groundhogs: Entity[] = ecs.getEntitiesWith(GroundhogTagComponent, EnergyComponent, MoveIntentComponent, BurrowHomeComponent);
    const groundhogs: Entity[] = ecs.getEntitiesWith(GroundhogTagComponent);

    for (const e of groundhogs) {
        const energyComponent = ecs.getComponent(e, EnergyComponent)!;
        const burrowHomeComponent = ecs.getComponent(e, BurrowHomeComponent)!;
        const canMoveComponent = ecs.getComponent(e, CanMoveComponent)!;

        const willMove = Math.random() < 0.5;
        const speed = energyComponent.energy / 100;

        if (energyComponent.energy < 10) {
            ecs.addComponent(e, new MoveToIntentComponent(burrowHomeComponent.position, speed))
        } else if (willMove) {
            const newDirection = (canMoveComponent.direction + Math.random() * 20 - 10) % 360;
            if (newDirection) {
                ecs.addComponent(e, new MoveIntentComponent(speed, newDirection))
            }
        } else {
            ecs.addComponent(e, new MoveIntentComponent(0, canMoveComponent.direction))
        }
    }
}
