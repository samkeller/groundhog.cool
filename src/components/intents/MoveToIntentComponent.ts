import { Component } from "../../ECS";
import TPosition from "../../types/TPosition";

export default class MoveToIntentComponent implements Component {
  constructor(
    public target: TPosition,
  ) { }
}
