import { Component } from "../ECS";
import { Sprite } from "pixi.js";

export default class DrawableComponent implements Component {
    constructor(
        public sprite: Sprite
    ) {}
}
