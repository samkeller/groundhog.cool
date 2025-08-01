import { Entity } from "../ECS"
import { TilePosition } from "./Position"

type TileMap = Tile[][]

interface Tile {
    height: number, // 0 - 1
    walkable: boolean,
    position: TilePosition,
    component: Entity | null
}

export type { TileMap, Tile }