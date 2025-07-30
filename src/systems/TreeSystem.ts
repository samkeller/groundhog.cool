// TreeSystem.ts
import { ECS } from "../ECS";
import TreeTagComponent from "../components/tags/TreeTagComponent";
import FoodComponent from "../components/FoodComponent";

export default function TreeSystem(ecs: ECS) {
    const trees = ecs.getEntitiesWith(TreeTagComponent, FoodComponent);
    for (const entity of trees) {
        const food = ecs.getComponent(entity, FoodComponent);
        if (food) food.amount += 0.05;
    }
}
