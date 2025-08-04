import { TileMap, Tile } from "../types/TileMap";
import { PixelPosition, TilePosition } from "../types/Position";
import { pixelToTile } from "../utils/PositionUtils";
import { ECS } from "../ECS";
import getTestMap from "../maps/TestMap1";
import { GameAssets } from "../utils/AssetLoader";

/**
 * Service dédié à la gestion de la carte et du monde de jeu.
 * Remplace la logique map du TickContext pour appliquer le principe de responsabilité unique.
 */
export class WorldService {
    constructor(private map: TileMap) { }

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
     * Récupère la hauteur du terrain à une position donnée.
     */
    getHeightAt(position: PixelPosition): number {
        const tile = this.getTileAtPixel(position);
        return tile?.height ?? 0;
    }

    /**
     * Récupère les dimensions de la carte.
     */
    getDimensions(): { width: number; height: number } {
        return {
            width: this.map[0]?.length ?? 0,
            height: this.map.length
        };
    }

    /**
     * Récupère la carte complète (pour compatibilité avec l'ancien code).
     * À terme, cette méthode devrait être utilisée avec parcimonie.
     */
    getMap(): TileMap {
        return this.map;
    }

}
