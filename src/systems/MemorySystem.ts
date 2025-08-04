import MemoryComponent from "../components/MemoryComponent";
import { ECS } from "../ECS";

export default function MemorySystem(ecs: ECS) {
    const entitiesWithMemory = ecs.getEntitiesWith(MemoryComponent);

    for (const e of entitiesWithMemory) {
        const memoryComponent = ecs.getComponent(e, MemoryComponent)!

        const memoriesToUpdate = Array.from(memoryComponent.memories.entries());

        for (const [memEntity, memCooldown] of memoriesToUpdate) {
            const newCooldown = memCooldown - 1;

            if (newCooldown <= 0) {
                memoryComponent.removeMemory(memEntity);
            } else {
                memoryComponent.updateMemory(memEntity, newCooldown);
            }
        }
    }
}
