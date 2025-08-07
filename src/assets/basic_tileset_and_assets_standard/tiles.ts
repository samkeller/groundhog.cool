// Auto-generated tile coordinates for terrain_tiles_v2.png (320x512, 32x32 tiles)
// Each tile is 32x32 pixels. There are 10 columns and 16 rows (160 tiles).

export const TILE_SIZE = 32;
export const TILE_COLUMNS = 10;
export const TILE_ROWS = 16;

/**
 * Interface describing a tile entry with its position and index.
 */
export interface TileEntry {
  /** Unique identifier of the tile based on its index (row * columns + col). */
  index: number;
  /** Column in the grid (0-based). */
  col: number;
  /** Row in the grid (0-based). */
  row: number;
  /** X coordinate in pixels within the texture atlas. */
  x: number;
  /** Y coordinate in pixels within the texture atlas. */
  y: number;
}

/**
 * Generates an array of tile entries for a tilesheet.
 * Each entry contains the index, row/col position and pixel coordinates.
 */
export function generateTileEntries(
  columns: number = TILE_COLUMNS,
  rows: number = TILE_ROWS,
  tileSize: number = TILE_SIZE
): TileEntry[] {
  const entries: TileEntry[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      entries.push({
        index,
        col,
        row,
        x: col * tileSize,
        y: row * tileSize,
      });
    }
  }
  return entries;
}

/**
 * Precomputed list of all tile entries for the default tilesheet (10x16 tiles).
 * You can iterate through this list or search by index to get coordinates.
 */
export const TILES: TileEntry[] = generateTileEntries();

/**
 * Retrieves the pixel coordinates for a given tile index.
 *
 * @param index Tile index (0-based).
 * @returns An object containing x and y coordinates in pixels.
 */
export function getTileCoords(index: number): { x: number; y: number } {
  const col = index % TILE_COLUMNS;
  const row = Math.floor(index / TILE_COLUMNS);
  return {
    x: col * TILE_SIZE,
    y: row * TILE_SIZE,
  };
}

/**
 * Retrieves a tile entry for a given column and row.
 *
 * @param col Column index (0-based).
 * @param row Row index (0-based).
 * @returns The tile entry if valid, otherwise undefined.
 */
export function getTileEntry(col: number, row: number): TileEntry | undefined {
  if (col < 0 || col >= TILE_COLUMNS || row < 0 || row >= TILE_ROWS) {
    return undefined;
  }
  const index = row * TILE_COLUMNS + col;
  return {
    index,
    col,
    row,
    x: col * TILE_SIZE,
    y: row * TILE_SIZE,
  };
}
