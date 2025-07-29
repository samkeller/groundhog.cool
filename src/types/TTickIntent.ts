import Drawable from "../game/entities/Drawable"
import TPosition from "./TPosition"

type TTickIntent =
    {
        type: "none"
    }
    | SpawnIntent
    | MoveIntent

interface SpawnIntent {
    type: "spawn",
    prefab: "groundhog",
    position: TPosition,
}

interface MoveIntent {
    type: "move",
    object: Drawable
    direction: number
    speed: number
}

export type { TTickIntent, SpawnIntent, MoveIntent }