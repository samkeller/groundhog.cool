import { Component } from "../ECS";
export default class FoodStockComponent implements Component {
    constructor(
        private _amount: number = 0,
        public amountMax: number = 100
        
    ) { }
    
    public get amount(): number {
        return this._amount;
    }
    public set amount(value: number) {
        if (value > this.amountMax) {
            value = this.amountMax
        }
        this._amount = value;
    }
}
