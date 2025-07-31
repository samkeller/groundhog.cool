import { AStarFinder, DiagonalMovement, Grid, Heuristic, JumpPointFinder } from "pathfinding";
import { TMap } from "../types/TMap";
import TPosition from "../types/TPosition";
import { TILE_SIZE } from "../maps/TerrainVariables";

export default class PathfindingUtils {

    private PFMap: number[][] = []
    constructor(map: TMap) {
        this.PFMap = map.map(c => {
            return c.map(l => l.walkable ? 0 : 1)
        })
    }

    private getPathFinding(from: TPosition, to: TPosition): number[][] {
        const finder = new AStarFinder({
            heuristic: Heuristic.manhattan,
            diagonalMovement: DiagonalMovement.Always,
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
    getTilesPathFinding(from: TPosition, to: TPosition): TPosition[] {
        return this.getPathFinding(
            {
                x: Math.floor(from.x / TILE_SIZE),
                y: Math.floor(from.y / TILE_SIZE),
            },
            {
                x: Math.floor(to.x / TILE_SIZE),
                y: Math.floor(to.y / TILE_SIZE),
            }
        ).map(step => {
            return {
                x: step[0] * TILE_SIZE + TILE_SIZE / 2,
                y: step[1] * TILE_SIZE + TILE_SIZE / 2
            }
        })
    }
}
