import { Component } from "../../ECS";

export default class MoveIntentComponent implements Component {
    constructor(
        public rotation = 0
    ) { }
}
