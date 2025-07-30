import { Entity } from "../../ECS";

export default class OwnedByComponent {
    constructor(public ownerId: Entity) { }
}
