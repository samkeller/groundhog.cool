import { Component } from "../ECS";
import TPosition from "../types/TPosition";

export default class PathComponent implements Component {
    constructor(
        public path: TPosition[]
    ) {}
}
