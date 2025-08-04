import MemoryComponent from "../components/MemoryComponent";
import { ECS } from "../ECS";

export default function MemorySystem(ecs: ECS) {
    const entitiesWithMemory = ecs.getEntitiesWith(MemoryComponent);

    for (const e of entitiesWithMemory) {
        const memoryComponent = ecs.getComponent(e, MemoryComponent)!

        for (const memEntity of memoryComponent.memories.keys()) {
            const memCooldown = memoryComponent.memories.get(memEntity)!;
            const newCooldown = memCooldown - 1;

            if (newCooldown <= 0) {
                memoryComponent.removeMemory(memEntity);
            } else {
                memoryComponent.setMemory(memEntity, newCooldown);
            }
        }
    }
}
