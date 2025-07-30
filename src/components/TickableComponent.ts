import { Component, ECS } from "../ECS";
import TickContext from "../systems/TickContext";

export type TickFn = (entity: number, ecs:ECS, context: TickContext) => void;

export default class TickableComponent implements Component {
    constructor(
        public tick: TickFn
    ) {}
}
