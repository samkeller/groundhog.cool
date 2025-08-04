import { TileMap, Tile } from "../types/TileMap";
import { PixelPosition, TilePosition } from "../types/Position";
import { pixelToTile } from "../utils/PositionUtils";
import PathfindingUtils from "../utils/PathfindingUtils";

/**
 * Service dédié à la gestion de la carte et du monde de jeu.
 * Remplace la logique map du TickContext pour appliquer le principe de responsabilité unique.
 */
export class WorldService {
    private pathFindingUtils: PathfindingUtils

    constructor(private map: TileMap) {
        this.pathFindingUtils = new PathfindingUtils(map)
    }

    /**
     * Récupère une tuile à partir de sa position en coordonnées de tuile.
     */
    getTileAt(position: TilePosition): Tile | null {
        if (position.y >= 0 && position.y < this.map.length &&
            position.x >= 0 && position.x < this.map[position.y].length) {
            return this.map[position.y][position.x];
        }
        return null;
    }

    /**
     * Récupère une tuile à partir d'une position en pixels.
     */
    getTileAtPixel(position: PixelPosition): Tile | null {
        const tilePos = pixelToTile(position);
        return this.getTileAt(tilePos);
    }

    /**
     * Vérifie si une position en pixels est praticable.
     */
    isWalkable(position: PixelPosition): boolean {
        const tile = this.getTileAtPixel(position);
        return tile?.walkable ?? false;
    }

    /**
     * Vérifie si une position en tuiles est praticable.
     */
    isTileWalkable(position: TilePosition): boolean {
        const tile = this.getTileAt(position);
        return tile?.walkable ?? false;
    }

    /**
     * Calcule la prochaine position à partir d'une position, d'une rotation et d'une vitesse.
     */
    getNextPosition(fromPosition: PixelPosition, rotation: number, speed: number): PixelPosition {
        // Décalage de -90° pour que 0° = haut
        const rad = (rotation - 90) * Math.PI / 180;
        return {
            x: fromPosition.x + Math.cos(rad) * speed,
            y: fromPosition.y + Math.sin(rad) * speed
        };
    }

    /**
     * Tente de trouver une direction valide pour se déplacer.
     * Utilise la propriété walkable des tuiles qui est calculée lors de la génération de la carte.
     */
    findValidDirection(position: PixelPosition, speed: number, rotation: number): {
        nextDirection: number,
        nextPosition: PixelPosition
    } | undefined {
        const MAX_LOOPS = 10;
        let loops = 0;
        let nextDirection = rotation;
        const increment = 360 / MAX_LOOPS;

        while (loops < MAX_LOOPS) {
            const testNext = this.getNextPosition(position, nextDirection, speed);

            if (this.isWalkable(testNext)) {
                return {
                    nextDirection: nextDirection,
                    nextPosition: testNext
                };
            }

            nextDirection = (nextDirection + increment) % 360;
            loops++;
        }

        // Aucun mouvement possible
        return undefined;
    }

    /**
     * Calcule un chemin entre deux positions en pixels.
     */
    getPathBetween(from: PixelPosition, to: PixelPosition): PixelPosition[] {
        return this.pathFindingUtils.getTilesPathFinding(from, to);
    }

}
