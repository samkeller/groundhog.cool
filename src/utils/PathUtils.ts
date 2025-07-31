import { TILE_SIZE } from "../maps/TerrainVariables";
import TPosition from "../types/TPosition";

/**
 * Utilitaire pour calculer la direction (degrés) entre deux positions
 * @param from 
 * @param to 
 * @returns angle en degrés (0-360)
 */
export function directionBetweenPoints(from: TPosition, to: TPosition): number {
    const dx = to.x - from.x;
    const dy = from.y - to.y;       // inversion unique
    const rad = Math.atan2(dx, dy)

    return (rad * 180 / Math.PI + 360) % 360;
}


export function positionsAreEqual(a: TPosition, b: TPosition) {
    // Utilise une tolérance adaptée à la taille d'un tile
    const tolerance = TILE_SIZE / 4;
    return Math.abs(a.x - b.x) < tolerance && Math.abs(a.y - b.y) < tolerance;
}
