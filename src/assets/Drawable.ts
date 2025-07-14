import { Container, Sprite } from "pixi.js";
import TPosition from "../types/TPosition";
import TSize from "../types/TSize";


export default abstract class Drawable {
    /**
     * 0 - 360
     */
    private _rotation: number = 0;
    position: TPosition = { x: 0, y: 0 }
    size: TSize = { width: 0, height: 0 }

    constructor(public sprite: Sprite, size?: TSize) {
        if (size) {
            this.size = size
        }
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
        container.addChild(this.sprite);
    }
}