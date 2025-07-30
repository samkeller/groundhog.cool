// TickSystem.ts
import { ECS } from "../ECS";
import TickableComponent from "../components/TickableComponent";
import TickContext from "./TickContext";

export default function TickSystem(ecs: ECS, context: TickContext) {
    const entities = ecs.getEntitiesWith(TickableComponent);
    for (const entity of entities) {
        const tickable = ecs.getComponent(entity, TickableComponent);
        if (tickable) {
            tickable.tick(entity, ecs, context);
        }
    }
}
