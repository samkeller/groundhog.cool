import { Texture } from "pixi.js";
import { TMap } from "../../types/TMap";
import { Entity } from "../../ECS";
import TPosition from "../../types/TPosition";
import { TILE_SIZE } from "../../maps/TerrainVariables";

export default class TickContext {
    map: TMap
    assets: {
        groundhog: Texture
    }
    spatialIndex: Map<string, Set<Entity>>

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

    /**
     * Attention, la dataMap ici ne contient que la vue "tiles", pas la vue "pixels".
     * @param dataMap 
     * @returns 
     */
    private BuildSpatialIndex(dataMap: TMap): TickContext["spatialIndex"] {
        const spatialIndex: Map<string, Set<Entity>> = new Map();
        for (let y = 0; y < dataMap.length; y++) { // Columns
            for (let x = 0; x < dataMap[y].length; x++) { // Rows
                const cell = dataMap[y][x]
                if (cell.component) {

                    const key = this.spatialIndexKeyBuilder({
                        x: x * TILE_SIZE,
                        y: y * TILE_SIZE
                    });
                    spatialIndex.set(key, new Set());
                    spatialIndex.get(key)!.add(cell.component);
                }
            }
        }

        return spatialIndex
    }
}