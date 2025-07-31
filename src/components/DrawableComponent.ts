import { Component } from "../ECS";
import { Sprite } from "pixi.js";

export default class DrawableComponent implements Component {
    public initialized = false;
    constructor(
        public sprite: Sprite
    ) {}
}
