import Drawable from "../game/entities/Drawable";
import { TMap } from "../types/TMap";

export default class MoveUtils {

    /**
     * Variable arbitraites actuelles
     * @param tile 
     * @returns 
     */
    private isWalkable(tile: any): boolean {
        return tile.height > 0.4 && tile.height < 0.8;
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
    findValidDirection(map: TMap, tileSize: number, object: Drawable, speed: number, direction: number, maxAttempts = 8) {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const { x: nextX, y: nextY } = this.computeNextPosition(object.position.x, object.position.y, direction, speed);
            const tileX = Math.floor(nextX / tileSize);
            const tileY = Math.floor(nextY / tileSize);
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
