import { TileMap } from "../../types/TileMap";
import { Entity } from "../../ECS";
import { PixelPosition } from "../../types/Position";
import { GameAssets } from "../../utils/AssetLoader";
import { tileToPixel } from "../../utils/PositionUtils";

export default class TickContext {
    map: TileMap
    assets: GameAssets
    spatialIndex: Map<string, Set<Entity>>

    constructor(map: TileMap, assets: GameAssets) {
        this.map = map;
        this.assets = assets;
        this.spatialIndex = this.BuildSpatialIndex(map)
    }

    spatialIndexKeyBuilder(position: PixelPosition) {
        return `${Math.floor(position.x)}:${Math.floor(position.y)}`
    }

    updateSpatialIndex(
        entityId: number,
        oldPos: PixelPosition,
        newPos: PixelPosition
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
        position: PixelPosition
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
    private BuildSpatialIndex(dataMap: TileMap): TickContext["spatialIndex"] {
        const spatialIndex: Map<string, Set<Entity>> = new Map();
        for (let y = 0; y < dataMap.length; y++) { // Columns
            for (let x = 0; x < dataMap[y].length; x++) { // Rows
                const cell = dataMap[y][x]
                if (cell.component) {
                    const key = this.spatialIndexKeyBuilder(tileToPixel({x, y}));
                    spatialIndex.set(key, new Set());
                    spatialIndex.get(key)!.add(cell.component);
                }
            }
        }

        return spatialIndex
    }
}