import { Assets, Container, Sprite, Texture } from "pixi.js";
import Drawable from "./Drawable";
import { randomIntFromInterval } from "../utils/MathUtils";

export default class Groundhog extends Drawable {
    constructor(public texture: Texture) {
        super(
            new Sprite(texture),
            { width: 1024 / 50, height: 1536 / 50 }
        );
    }

    draw(container: Container): void {
        const doSpeed = Math.random() < 0.5
        if (doSpeed) {
            this.doRandomMove()
        } else {
            this.stop()
        }
        super.draw(container)
    }
    doRandomMove() {
        this.rotation = randomIntFromInterval(this.rotation - 10, this.rotation + 10)
        this.speed += Math.random()
    }
    stop() {
        this.speed = 0
    }
}