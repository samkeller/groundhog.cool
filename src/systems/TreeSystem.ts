// TreeSystem.ts
import { ECS } from "../ECS";
import TreeTagComponent from "../components/tags/TreeTagComponent";
import FoodStockComponent from "../components/FoodStockComponent";
import { BarComponent } from "../components/BarComponent";

export default function TreeSystem(ecs: ECS) {
    const trees = ecs.getEntitiesWith(TreeTagComponent, FoodStockComponent);
    for (const e of trees) {
        const food = ecs.getComponent(e, FoodStockComponent)!;
        const barComponent = ecs.getComponent(e, BarComponent)!
        
        food.amount += 0.1;
        barComponent.value = food.amount
    }
}
