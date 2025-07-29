import { Container, Sprite, Texture, Text } from "pixi.js";
import Drawable from "./Drawable";
import TTickContext from "../../types/TTickContext";
import TPosition from "../../types/TPosition";
import { TTickIntent } from "../../types/TTickIntent";
import Tickable from "./Tickable";

export default class Tree extends Drawable implements Tickable {
    food = 0;

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
        this.food + 1
        return {
            type: "none"
        }
    }
    public draw(container: Container) {
        super.draw(container)

        const text = new Text({
            label: this.food.toString(),
            style: {
                fontFamily: "Arial",
                fontSize: 14,
                fill: 0x000000,
                align: "center",
            }
        });

        container.addChild(text)
    }

}