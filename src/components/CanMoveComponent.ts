import { Component } from "../ECS";

export default class CanMoveComponent implements Component {
    constructor(
        /**
         * 0 - 360
        */
        private _direction: number,
        /**
         * 0 - 1
        */
        private _speed: number
    ) { }

    public get direction(): number {
        return this._direction;
    }

    public set direction(value: number) {
        this._direction = value % 360;
    }

    public get speed(): number {
        return this._speed;
    }

    public set speed(value: number) {
        if (value < 0) value = 0
        if (value > 1) value = 1
        this._speed = value;
    }
}
