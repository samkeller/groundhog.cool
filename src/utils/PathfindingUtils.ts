import PF from "pathfinding";
import { TMap } from "../types/TMap";
import TPosition from "../types/TPosition";

export default class PathfindingUtils {

    private PFMap: number[][] = []
    constructor(map: TMap) {
        this.PFMap = map.map(c => {
            return c.map(l => l.walkable ? 1 : 0)
        })
    }

    getPathFinding(map: TMap, from: TPosition, to: TPosition): number[][] {
        const grid: PF.Grid = new PF.Grid(this.PFMap);
        const finder = new PF.AStarFinder();
        const path = finder.findPath(
            Math.round(from.x),
            Math.round(from.y),
            Math.round(to.x),
            Math.round(to.y),
            grid
        );
        return path;
    }
}
