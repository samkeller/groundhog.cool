import { Component, Entity } from "../../ECS";
import PositionComponent from "../PositionComponent";

export default class SpawnIntentComponent implements Component {
    constructor(
        public entity: "groundhog",
        public at: PositionComponent,
        public fromBurrow: Entity,
        public ownerId: Entity
    ) { }
}
