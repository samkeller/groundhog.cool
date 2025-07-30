import Drawable from "../game/entities/types/Drawable";
import { MOUNTAIN_HEIGHT, TILE_SIZE, WATER_HEIGHT } from "../game/maps/TerrainVariables";
import { TMap } from "../types/TMap";
import TPosition from "../types/TPosition";

export default class MoveUtils {

    /**
     * Variable arbitraites actuelles
     * @param tile 
     * @returns 
     */
    private isWalkable(tile: any): boolean {
        return tile.height > WATER_HEIGHT && tile.height < MOUNTAIN_HEIGHT;
    }

    /**
     * Tente de trouver une direction valide pour se déplacer
     * @param direction degré
     * @returns degré de la prochaine direction
     */
    findValidDirection(
        map: TMap,
        object: Drawable,
        speed: number,
        direction: number
    ): { nextDirection: number, nextPosition: TPosition } | void {
        const fromPosition: TPosition = object.position
        let loops = 0;
        let nextDirection = direction;
        while (loops < 10) {
            const testNext = getNextPosition(fromPosition, nextDirection, speed)
            const tileX = Math.floor(testNext.x / TILE_SIZE);
            const tileY = Math.floor(testNext.y / TILE_SIZE);
            if (tileY >= 0 && tileY < map.length && tileX >= 0 && tileX < map[0].length) {
                const tile = map[tileY][tileX];
                if (this.isWalkable(tile)) {
                    return {
                        nextDirection,
                        nextPosition: testNext
                    };
                }
            }
            // Nouvelle direction (tourne)
            nextDirection = (nextDirection + 20) % 360;
            loops++;
        }
    }

}

/**
 * Calcule la prochaine position à partir d'une position, d'une rotation (en degrés) et d'une vitesse.
 * @param fromPosition Position de départ
 * @param rotation Angle en degrés (0-360)
 * @param speed Distance à parcourir
 * @returns Nouvelle position (TPosition)
 */
export function getNextPosition(fromPosition: TPosition, rotation: number, speed: number): TPosition {
    // Décalage de -90° pour que 0° = haut
    const rad = (rotation - 90) * Math.PI / 180;
    return {
        x: fromPosition.x + Math.cos(rad) * speed,
        y: fromPosition.y + Math.sin(rad) * speed
    };
}
