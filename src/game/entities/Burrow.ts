import { Sprite, Texture } from "pixi.js";
import Drawable from "./Drawable";
import TTickContext from "../../types/TTickContext";
import TPosition from "../../types/TPosition";
import { TTickIntent } from "../../types/TTickIntent";
import Tickable from "./Tickable";

export default class Burrow extends Drawable implements Tickable {
    name = "burrow"
    constructor(
        public texture: Texture,
        public position: TPosition
    ) {
        super(
            new Sprite(texture),
            { width: 1024 / 50, height: 1536 / 50 }
        );
    }

    public doTick(context: TTickContext): TTickIntent {
        if (context.owner.food > 0) {
            return {
                type: "spawn",
                prefab: "groundhog",
                position: this.position
            }
        }
        return {
            type: "none"
        }
    }

}