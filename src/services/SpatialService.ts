import { Entity } from "../ECS";
import { TILE_SIZE } from "../maps/TerrainVariables";
import { PixelPosition } from "../types/Position";
import { TileMap } from "../types/TileMap";
import { tileToPixel } from "../utils/PositionUtils";

/**
 * Service dédié à l'indexation spatiale des entités.
 * Remplace la logique spatiale du TickContext pour appliquer le principe de responsabilité unique.
 */
export class SpatialService {
    public spatialIndex = new Map<string, Set<Entity>>();
    private VISION_RANGE = 2 * TILE_SIZE


    /**
     * Construit la clé d'index spatial pour une position donnée.
     */
    private buildSpatialKey(position: PixelPosition): string {
        return `${Math.floor(position.x)}:${Math.floor(position.y)}`;
    }

    /**
     * Enregistre une entité à une position dans l'index spatial.
     */
    register(entityId: Entity, position: PixelPosition): void {
        const key = this.buildSpatialKey(position);

        if (!this.spatialIndex.has(key)) {
            this.spatialIndex.set(key, new Set());
        }

        this.spatialIndex.get(key)!.add(entityId);
    }

    /**
     * Met à jour la position d'une entité dans l'index spatial.
     */
    update(entityId: Entity, oldPos: PixelPosition, newPos: PixelPosition): void {
        const oldKey = this.buildSpatialKey(oldPos);
        const newKey = this.buildSpatialKey(newPos);

        if (oldKey !== newKey) {
            // Supprime de l'ancienne position
            this.spatialIndex.get(oldKey)?.delete(entityId);

            // Ajoute à la nouvelle position
            if (!this.spatialIndex.has(newKey)) {
                this.spatialIndex.set(newKey, new Set());
            }
            this.spatialIndex.get(newKey)!.add(entityId);
        }
    }

    /**
     * Récupère les entités proches d'une position donnée.
     * Pour l'instant, on garde la même logique que l'original, 
     * mais cela pourra être optimisé plus tard.
     * TODO: Optimisation future
     */
    getNearby(position: PixelPosition, range: number = this.VISION_RANGE): Entity[] {
        const entities: Entity[] = [];
        const [minX, maxX] = [position.x - range, position.x + range];
        const [minY, maxY] = [position.y - range, position.y + range];

        for (let dx = minX; dx <= maxX; dx++) {
            for (let dy = minY; dy <= maxY; dy++) {
                const key = this.buildSpatialKey({ x: dx, y: dy });
                const entitiesAtTile = this.spatialIndex.get(key);

                if (entitiesAtTile) {
                    entities.push(...entitiesAtTile);
                }
            }
        }

        return entities;
    }

    /**
     * Initialise l'index spatial à partir d'une carte de tuiles.
     * Appelé une seule fois au démarrage.
     */
    initializeFromTileMap(dataMap: TileMap): void {
        for (let y = 0; y < dataMap.length; y++) {
            for (let x = 0; x < dataMap[y].length; x++) {
                const cell = dataMap[y][x];
                if (cell.component) {
                    const pixelPos = tileToPixel({ x, y });
                    this.register(cell.component, pixelPos);
                }
            }
        }
    }
}
