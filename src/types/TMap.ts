import Burrow from "../game/entities/Burrow"
import Tree from "../game/entities/Tree"
import TPosition from "./TPosition"

type TMap = TTile[][]

interface TTile {
    height: number, // 0 - 1
    position: TPosition,
    element: Tree | Burrow |null
}

export type { TMap, TTile }