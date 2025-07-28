import { Container, Sprite } from "pixi.js";
import TPosition from "../types/TPosition";
import TSize from "../types/TSize";


export default abstract class Drawable {
    /**
     * 0 - 360
     */
    private _rotation: number = 90;
    position: TPosition = { x: 0, y: 0 }
    direction: TPosition = { x: 0, y: 0 }
    speed: number = 0
    size: TSize = { width: 0, height: 0 }

    constructor(public sprite: Sprite, size?: TSize) {
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
        const rad = this.rotation * Math.PI / 180;
        this.position = {
            x: this.position.x + Math.cos(rad) * this.speed,
            y: this.position.y + Math.sin(rad) * this.speed
        }


        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.sprite.width = this.size.width;
        this.sprite.height = this.size.height;
        this.sprite.rotation = (this.rotation - 270) * Math.PI / 180;
        container.addChild(this.sprite);
    }
}