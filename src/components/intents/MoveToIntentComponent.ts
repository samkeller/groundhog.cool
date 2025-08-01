import { Component } from "../../ECS";
import { PixelPosition } from "../../types/Position";

export default class MoveToIntentComponent implements Component {
  constructor(
    public target: PixelPosition,
  ) {}
}
