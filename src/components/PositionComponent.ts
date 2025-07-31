import { Component } from "../ECS";
import TPosition from "../types/TPosition";

export default class PositionComponent implements Component, TPosition {
    x: number;
    y: number;

    // Implémentation unique du constructor
    constructor(position: TPosition) {
        this.x = position.x;
        this.y = position.y;
    }
}
