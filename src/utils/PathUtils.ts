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
