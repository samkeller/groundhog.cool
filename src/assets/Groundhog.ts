import { Assets, Sprite, Texture } from "pixi.js";
import Drawable from "./Drawable";

export default class Groundhog extends Drawable {
    constructor(public texture: Texture) {
        super(
            new Sprite(texture),
            { width: 40, height: 40 }
        );
    }
}