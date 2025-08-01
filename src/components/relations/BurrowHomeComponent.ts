import { Component } from "../../ECS";
import { PixelPosition } from "../../types/Position";

export default class BurrowHomeComponent implements Component {
  constructor(public position: PixelPosition) { }
}