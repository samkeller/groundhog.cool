import { Assets, Container, Sprite, Texture } from "pixi.js";
import Drawable from "./Drawable";
import { randomIntFromInterval } from "../../utils/MathUtils";
import TTickContext from "../../types/TTickContext";
import { TTickIntent } from "../../types/TTickIntent";
import Tickable from "./Tickable";

export default class Groundhog extends Drawable implements Tickable {
    constructor(public texture: Texture) {
        super(
            new Sprite(texture),
            { width: 1024 / 50, height: 1536 / 50 }
        );
    }

    public doTick(context: TTickContext): TTickIntent {
        const willMove = Math.random() < 0.5
        if (willMove) {
            const newDirection = randomIntFromInterval(this.rotation - 10, this.rotation + 10);
            const newSpeed = Math.random(); // entre 0 et 1
            return {
                type: "move",
                object: this,
                direction: newDirection,
                speed: newSpeed
            };
        } else {
            return {
                type: "move",
                object: this,
                direction: this.rotation,
                speed: 0
            };
        }
    }
}