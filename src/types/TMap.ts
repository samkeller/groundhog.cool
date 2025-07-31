import { Component, Entity } from "../ECS"
import TPosition from "./TPosition"

type TMap = TTile[][]

interface TTile {
    height: number, // 0 - 1
    walkable: boolean,
    position: TPosition,
    component: Entity | null
}

export type { TMap, TTile }