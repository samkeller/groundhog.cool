import { Component, Entity } from "../../ECS";

export default class BurrowHomeComponent implements Component {
  constructor(public burrow: Entity) { }
}