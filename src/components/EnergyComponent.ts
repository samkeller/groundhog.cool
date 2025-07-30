import { Component } from "../ECS";

export default class EnergyComponent implements Component {
    constructor(
        public energy: number,
        public maxEnergy: number
    ) {}
}
