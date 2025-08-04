import { Entity } from "../ECS";

const MEMORY_TIMEOUT = 1000;

export default class MemoryComponent {
    memories: Map<Entity, number> = new Map()

    constructor() { }

    addMemory(entity: Entity) {
        this.memories.set(entity, MEMORY_TIMEOUT)
    }

    setMemory(entity: Entity, newCooldown: number) {
        this.memories.set(entity, newCooldown)
    }
    removeMemory(entity: Entity) {
        this.memories.delete(entity)
    }

}