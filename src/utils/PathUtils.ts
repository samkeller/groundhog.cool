import TPosition from "../types/TPosition";

/**
 * Utilitaire pour calculer la direction (degrés) entre deux positions
 * @param from 
 * @param to 
 * @returns angle en degrés (0-360)
 */
export function directionBetweenPoints(from: TPosition, to: TPosition): number {
    // Obligé de corriger de -90 degrés car par défaut 0 = droite;
    let deg = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI - 90;
    if (deg < 0) deg += 360;
    return deg;
}