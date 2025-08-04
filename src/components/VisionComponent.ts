import { Component, Entity } from "../ECS";

export default class VisionComponent implements Component {
    public visibles: Entity[] = []
    constructor() { }
}
