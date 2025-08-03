import { AStarFinder, DiagonalMovement, Grid, Heuristic } from "pathfinding";
import { TileMap } from "../types/TileMap";
import { PixelPosition, TilePosition } from "../types/Position";
import { pixelToTile, tileToPixel } from "./PositionUtils";

export default class PathfindingUtils {

    private PFMap: number[][] = []
    constructor(map: TileMap) {
        this.PFMap = map.map(c => {
            return c.map(l => l.walkable ? 0 : 1)
        })
    }

    private getPathFinding(from: TilePosition, to: TilePosition): number[][] {
        const finder = new AStarFinder({
            heuristic: Heuristic.manhattan,
            diagonalMovement: DiagonalMovement.OnlyWhenNoObstacles,
            dontCrossCorners: true
        });

        const startX = from.x;
        const startY = from.y;
        const endX = to.x;
        const endY = to.y;

        const path = finder.findPath(
            startX, startY, endX, endY, this.getPFGrid()
        );

        return path;
    }

    private getPFGrid(): Grid {
        const grid: Grid = new Grid(this.PFMap);
        return grid.clone()
    }
    /**
     * Donnes le pathFindings en coordonnées directes.
     * Fait abstraction de la taille de genération du terrain.
     * @param from 
     * @param to 
     * @returns 
     */
    getTilesPathFinding(from: PixelPosition, to: PixelPosition): PixelPosition[] {
        const start = pixelToTile(from);
        const end = pixelToTile(to);
         // Exécution du pathfinding
        return this.getPathFinding(start, end)
            .map(([x, y]) => tileToPixel({ x, y }));
    }
}
