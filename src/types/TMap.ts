import TPosition from "./TPosition"

type TMap = TTile[][]

interface TTile {
    height: number, // 0 - 1
    position: TPosition
}

export type { TMap, TTile }