// TreeSystem.ts
import { ECS } from "../ECS";
import TreeTagComponent from "../components/tags/TreeTagComponent";
import FoodStockComponent from "../components/FoodStockComponent";

export default function TreeSystem(ecs: ECS) {
    const trees = ecs.getEntitiesWith(TreeTagComponent, FoodStockComponent);
    for (const entity of trees) {
        const food = ecs.getComponent(entity, FoodStockComponent);
        if (food) food.amount += 1;
    }
}
