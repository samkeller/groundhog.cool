import { Component } from "../ECS";
import TPosition from "../types/TPosition";

export default class BurrowHomeComponent implements Component {
  constructor(public position: TPosition) { }
}