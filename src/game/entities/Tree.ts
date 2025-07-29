import { Container, Sprite, Texture, Text } from "pixi.js";
import Drawable from "./Drawable";
import TTickContext from "../../types/TTickContext";
import TPosition from "../../types/TPosition";
import { TTickIntent } from "../../types/TTickIntent";
import Tickable from "./Tickable";

export default class Tree extends Drawable implements Tickable {
    food = 0;
    foodText: Text

    constructor(
        public texture: Texture,
        public position: TPosition
    ) {
        super(
            new Sprite(texture),
            { width: 1024 / 50, height: 1536 / 50 }
        );

        this.foodText = new Text({
            text: this.food.toString(),
            style: {
                fontFamily: "Arial",
                fontSize: 10,
                fill: "FFFFFF",
                align: "center",
            },
            position: this.position
        });
    }

    public doTick(context: TTickContext): TTickIntent {
        this.food += 0.05
        return {
            type: "none"
        }
    }

    public draw(container: Container) {
        super.draw(container)

        this.foodText.text = Math.floor(this.food);
        if (!container.children.includes(this.foodText)) {
            container.addChild(this.foodText);
        }
    }

}