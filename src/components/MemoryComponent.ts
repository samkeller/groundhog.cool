import { Component, Entity } from "../ECS";

const MEMORY_TIMEOUT = 1000;

export default class MemoryComponent implements Component {
    memories: Map<Entity, number> = new Map()

    constructor() { }

    addMemory(entity: Entity) {
        this.memories.set(entity, MEMORY_TIMEOUT)
    }

    updateMemory(entity: Entity, newCooldown: number) {
        this.memories.set(entity, newCooldown)
    }
    removeMemory(entity: Entity) {
        this.memories.delete(entity)
    }

}