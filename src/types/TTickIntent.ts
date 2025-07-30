import Drawable from "../game/entities/types/Drawable"
import TPosition from "./TPosition"

type TTickIntent =
    {
        type: "none"
    }
    | SpawnIntent
    | MoveIntent
    | MoveToIntent

interface SpawnIntent {
    type: "spawn",
    prefab: "groundhog",
    position: TPosition,
}

interface MoveIntent {
    type: "move",
    /**
     * Objet à déplacer
     */
    object: Drawable
    direction: number
    speed: number
}

interface MoveToIntent {
    type: "moveTo",
    /**
     * Objet à déplacer
     */
    object: Drawable
    toPosition: TPosition
    speed: number
}

export type { TTickIntent, SpawnIntent, MoveIntent, MoveToIntent }