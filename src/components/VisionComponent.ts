import { Component, Entity } from "../ECS";

export default class VisionComponent implements Component {

    constructor(public visibles: Entity[]) {}
}
