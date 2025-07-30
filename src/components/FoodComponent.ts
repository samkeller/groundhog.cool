import { Component } from "../ECS";
export default class FoodComponent implements Component {
    constructor(public amount: number = 0) {}
}
