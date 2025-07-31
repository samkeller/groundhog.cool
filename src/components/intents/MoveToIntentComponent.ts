import { Component } from "../../ECS";

export default class MoveToIntentComponent implements Component {
  constructor(
    public target: { x: number; y: number },
  ) { }
}
