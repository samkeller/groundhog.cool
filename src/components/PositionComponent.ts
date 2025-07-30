import { Component } from "../ECS";

export default class PositionComponent implements Component {
    constructor(
        public x: number,
        public y: number
    ) {}
}
