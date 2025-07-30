import { Component } from "../../ECS";

export default class MoveIntentComponent implements Component {
    constructor(
        public speed: number = 0,
        public rotation = 0
    ) { }
}
