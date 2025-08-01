import { Component } from "../ECS";

export class BarComponent implements Component {
    constructor(
        private _value: number,
        public maxValue: number,
        public type: "energy" | "foodStock"
    ) {
        this.color = this.getColorByType(type);
    }

    public color: string;

    private getColorByType(type: "energy" | "foodStock"): string {
        switch (type) {
            case "energy":
                return "#00FF00"; // Vert pour l'énergie
            case "foodStock":
            default:
                return "#FFA500"; // Orange pour la nourriture
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
