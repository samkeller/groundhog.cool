import { Assets, Container, Sprite, Text, Texture } from "pixi.js";
import { randomIntFromInterval } from "../../utils/MathUtils";
import TTickContext from "../../types/TTickContext";
import { TTickIntent } from "../../types/TTickIntent";
import Tickable from "./types/Tickable";
import Burrow from "./Burrow";
import WithEnergy from "./types/IsWithEnergy";
import Drawable from "./types/Drawable";

export default class Groundhog extends Drawable implements Tickable, WithEnergy {
    name = "groundhog"

    helpText: Text

    energy: number

    constructor(
        public texture: Texture,
        public spawnBurrow: Burrow,
    ) {
        super(
            new Sprite(texture),
            { width: 1024 / 50, height: 1536 / 50 }
        );
        this.energy = 100

        this.helpText = new Text({
            label: "help-text",
            text: this.rotation,
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
        const willMove = Math.random() < 0.5
        const speed = this.energy / 100
        if (this.energy < 10) {
            return {
                type: "moveTo",
                object: this,
                toPosition: this.spawnBurrow.position,
                speed: speed
            };
        }
        if (willMove) {
            let newDirection = randomIntFromInterval(this.rotation - 10, this.rotation + 10) % 360;

            return {
                type: "move",
                object: this,
                direction: newDirection,
                speed: speed
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

    draw(container: Container) {
        super.draw(container);

        this.helpText.text = this.rotation;
        this.helpText.position = {
            ...this.position,
            y: this.position.y + 10
        }
        this.helpText.zIndex = 1000
        if (!container.children.includes(this.helpText)) {
            container.addChild(this.helpText);
        }
    }
}