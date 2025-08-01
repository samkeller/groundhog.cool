import { MOUNTAIN_HEIGHT, TILE_SIZE, WATER_HEIGHT } from "../maps/TerrainVariables";
import { TileMap, Tile } from "../types/TileMap";
import { PixelPosition } from "../types/Position";
import { pixelToTile } from "./PositionUtils";

export default class MoveUtils {

    /**
     * Variable arbitraites actuelles
     * @param tile 
     * @returns 
     */
    private isWalkable(tile: Tile): boolean {
        return tile.height > WATER_HEIGHT && tile.height < MOUNTAIN_HEIGHT;
    }

    /**
     * Tente de trouver une direction valide pour se déplacer
     * @param rotation degré
     * @returns degré de la prochaine direction
     */
    findValidDirection(map: TileMap, position: PixelPosition, speed: number, rotation: number): {
        nextDirection: number,
        nextPosition: PixelPosition
    } | undefined {
        let MAX_LOOPS = 10
        let loops = 0;
        let nextDirection = rotation;
        const increment = 360 / MAX_LOOPS

        while (loops < MAX_LOOPS) {
            const testNext = this.getNextPosition(position, nextDirection, speed);

            const tile = pixelToTile(testNext) 

            if (tile.y >= 0 && tile.y < map.length && tile.x >= 0 && tile.x < map[0].length) {
                const tileData = map[tile.y][tile.x];
                if (this.isWalkable(tileData)) {
                    return {
                        nextDirection: nextDirection,
                        nextPosition: testNext
                    };
                }
            }
            nextDirection = (nextDirection + increment) % 360;
            loops++;
        }

        // Aucun mouvement possible
        return undefined;

    }

    /**
     * Calcule la prochaine position à partir d'une position, d'une rotation (en degrés) et d'une vitesse.
     * @param fromPosition Position de départ
     * @param rotation Angle en degrés (0-360)
     * @param speed Distance à parcourir
     * @returns Nouvelle position (TPosition)
     */
    getNextPosition(fromPosition: PixelPosition, rotation: number, speed: number): PixelPosition {
        // Décalage de -90° pour que 0° = haut
        const rad = (rotation - 90) * Math.PI / 180;
        return {
            x: fromPosition.x + Math.cos(rad) * speed,
            y: fromPosition.y + Math.sin(rad) * speed
        };
    }
}