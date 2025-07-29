import Drawable from "../game/entities/Drawable";
import { MOUNTAIN_HEIGHT, TILE_SIZE, WATER_HEIGHT } from "../game/maps/TerrainVariables";
import { TMap } from "../types/TMap";

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
     * Calcule la prochaine position à partir d'une direction et d'une vitesse
     */
    private computeNextPosition(x: number, y: number, direction: number, speed: number) {
        const rad = (direction - 180) * Math.PI / 180;
        return {
            x: x + Math.cos(rad) * speed,
            y: y + Math.sin(rad) * speed
        };
    }

    /**
     * Tente de trouver une direction valide pour se déplacer
     */
    findValidDirection(map: TMap, object: Drawable, speed: number, direction: number, maxAttempts = 8) {
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const { x: nextX, y: nextY } = this.computeNextPosition(object.position.x, object.position.y, direction, speed);
            const tileX = Math.floor(nextX / TILE_SIZE);
            const tileY = Math.floor(nextY / TILE_SIZE);
            if (tileY >= 0 && tileY < map.length && tileX >= 0 && tileX < map[0].length) {
                const tile = map[tileY][tileX];
                if (this.isWalkable(tile)) {
                    return { direction, speed, nextX, nextY };
                }
            }
            // Nouvelle direction aléatoire
            direction = Math.random() * 360;
        }
        return null;
    }

}
