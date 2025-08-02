import { Component, Entity } from "../../ECS";

export default class MoveToIntentComponent implements Component {
  constructor(
    public target: Entity,
  ) { }
}
