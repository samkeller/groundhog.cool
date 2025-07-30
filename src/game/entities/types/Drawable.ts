import { Container, Sprite } from "pixi.js";
import Tickable from "./Tickable";
import TSize from "../../../types/TSize";
import TPosition from "../../../types/TPosition";

export default abstract class Drawable extends Tickable {
    /**
     * 0 - 360 (degrés)
     */
    private _rotation: number = 0;
    position: TPosition = { x: 0, y: 0 }
    direction: TPosition = { x: 0, y: 0 }
    speed: number = 0
    size: TSize = { width: 0, height: 0 }
    abstract name: string
    constructor(public sprite: Sprite, size?: TSize) {
        super()
        if (size) {
            this.size = size
        }
        this.sprite.anchor.set(0.5, 0.5);
    }

    public get rotation(): number {
        return this._rotation;
    }
    public set rotation(value: number) {
        if (value < 0 || value > 360) {
            return;
        }
        this._rotation = value;
    }

    draw(container: Container) {
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.sprite.width = this.size.width;
        this.sprite.height = this.size.height;
        this.sprite.angle = this.rotation;
        container.addChild(this.sprite);
    }
}