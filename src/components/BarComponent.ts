import { Color } from "pixi.js";
import { Component } from "../ECS";

export class BarComponent implements Component {
    constructor(
        private _value: number,
        public maxValue: number,
        public type: "energy" | "foodStock"
    ) {
        this.color = this.getColorByType(type);
    }

    public color: Color;

    private colors = {
        yellow: new Color("#ffd449"),
        green: new Color("#548c2f")
    }
    
    private getColorByType(type: "energy" | "foodStock"): Color {
        switch (type) {
            case "energy":
                return this.colors.yellow; // Jaune pour l'énergie'
            case "foodStock":
            default:
                return this.colors.green; // Vert pour la nourriture
        }
    }

    public get value(): number {
        return this._value;
    }
    public set value(value: number) {
        this._value = Math.max(0, Math.min(value, this.maxValue)); // Clamp entre 0 et maxValue
    }

    getPercentage(): number {
        return (this.value / this.maxValue) * 100;
    }

}
