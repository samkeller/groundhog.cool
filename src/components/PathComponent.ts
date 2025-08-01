import { Component } from "../ECS";
import { PixelPosition } from "../types/Position";

export default class PathComponent implements Component {
    constructor(
        public path: PixelPosition[]
    ) {}
}
