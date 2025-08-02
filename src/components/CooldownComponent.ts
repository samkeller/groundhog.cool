export default class CooldownComponent {
    initialTime: number;
    remainingTime: number;

    constructor(initialTime: number) {
        this.initialTime = initialTime;
        this.remainingTime = initialTime;
    }
}
