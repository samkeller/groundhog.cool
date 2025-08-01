import { TILE_SIZE } from "../maps/TerrainVariables";
import { PixelPosition, TilePosition } from "../types/Position";

/**
 * Convertit une position en tuiles vers une position en pixels (centre de la tuile).
 */
export function tileToPixel(tile: TilePosition): PixelPosition {
    return {
        x: tile.x * TILE_SIZE + TILE_SIZE / 2,
        y: tile.y * TILE_SIZE + TILE_SIZE / 2,
    };
}

/**
 * Convertit une position en pixels vers une position en tuiles (indice de la tuile).
 */
export function pixelToTile(pixel: PixelPosition): TilePosition {
    return {
        x: Math.floor(pixel.x / TILE_SIZE),
        y: Math.floor(pixel.y / TILE_SIZE),
    };
}
