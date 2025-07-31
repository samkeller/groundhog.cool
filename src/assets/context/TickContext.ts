import { Texture } from "pixi.js";
import { TMap } from "../../types/TMap";
import { Component } from "../../ECS";
import TPosition from "../../types/TPosition";

export default class TickContext {
    map: TMap
    assets: {
        groundhog: Texture
    }
    spatialIndex: Map<string, Set<Component>>

    constructor(map: TMap, groundhog: Texture) {
        this.map = map;
        this.assets = { groundhog };
        this.spatialIndex = this.BuildSpatialIndex(map)
    }

    spatialIndexKeyBuilder(position: TPosition) {
        return `${Math.floor(position.x)}:${Math.floor(position.y)}`
    }

    updateSpatialIndex(
        entityId: number,
        oldPos: TPosition,
        newPos: TPosition
    ) {
        const oldKey = this.spatialIndexKeyBuilder(oldPos);
        const newKey = this.spatialIndexKeyBuilder(newPos);

        if (oldKey !== newKey) {
            this.spatialIndex.get(oldKey)?.delete(entityId);

            if (!this.spatialIndex.has(newKey)) {
                this.spatialIndex.set(newKey, new Set());
            }
            this.spatialIndex.get(newKey)!.add(entityId);
        }
    }

    registerInSpatialIndex(
        entityId: number,
        position: TPosition
    ) {
        const key = this.spatialIndexKeyBuilder(position)
        if (!this.spatialIndex.has(key)) {
            this.spatialIndex.set(key, new Set());
        }
        this.spatialIndex.get(key)!.add(entityId);
    }

    private BuildSpatialIndex(dataMap: TMap): TickContext["spatialIndex"] {

        const spatialIndex: Map<string, Set<Component>> = new Map();
        for (let y = 0; y < dataMap.length; y++) {
            for (let x = 0; x < dataMap[y].length; x++) {
                const cell = dataMap[y][x]
                const key = this.spatialIndexKeyBuilder({ x, y });
                if (cell.component) {
                    spatialIndex.set(key, new Set());
                    spatialIndex.get(key)!.add(cell.component);
                }
            }
        }

        return spatialIndex
    }
}