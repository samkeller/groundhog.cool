import { Component } from "../ECS";
import { PixelPosition } from "../types/Position";

export default class PositionComponent implements Component, PixelPosition {
    x: number;
    y: number;

    // Implémentation unique du constructor
    constructor(position: PixelPosition) {
        this.x = position.x;
        this.y = position.y;
    }
}
