import { Component } from "../ECS";

export default class VisionComponent implements Component {

    constructor(public visibles: Component[]) {}
}
