import { Component } from "../ECS"
import TPosition from "./TPosition"

type TMap = TTile[][]

interface TTile {
    height: number, // 0 - 1
    walkable: boolean,
    position: TPosition,
    component: Component | null
}

export type { TMap, TTile }