import { ECS, Entity } from "../ECS";
import BurrowTagComponent from "../components/tags/BurrowTagComponent";
import FoodStockComponent from "../components/FoodStockComponent";
import PositionComponent from "../components/PositionComponent";
import OwnedByComponent from "../components/relations/OwnedByComponent";
import GroundhogTagComponent from "../components/tags/GroundhogTagComponent";
import { getSpawnCost } from "../utils/MathUtils";
import SpawnIntentComponent from "../components/intents/SpawnIntentComponent";
import { BarComponent } from "../components/BarComponent";
import CooldownComponent from "../components/CooldownComponent";

export default function BurrowSystem(ecs: ECS) {
    const burrows: Entity[] = ecs.getEntitiesWith(BurrowTagComponent, FoodStockComponent, PositionComponent, OwnedByComponent);

    for (const e of burrows) {
        const food = ecs.getComponent(e, FoodStockComponent)!;
        const position = ecs.getComponent(e, PositionComponent)!;
        const owner = ecs.getComponent(e, OwnedByComponent)!;
        const coolDown = ecs.getComponent(e, CooldownComponent);

        if (coolDown) {
            continue;
        }

        // 1. Compter les marmottes du joueur
        const marmottes = ecs.getEntitiesWith(GroundhogTagComponent, OwnedByComponent).filter(e =>
            ecs.getComponent(e, OwnedByComponent)!.ownerId === owner.ownerId
        );
        const count = marmottes.length;

        // 2. Calcul du coût
        const cost = getSpawnCost(10, count);

        if (food.amount < cost) return;

        // 3. Déduction de la nourriture
        food.amount -= cost;

        ecs.addComponent(e, new SpawnIntentComponent(
            "groundhog",
            position,
            e,
            owner.ownerId
        ));

        ecs.addComponent(e, new CooldownComponent(cost * 50))

        // Update Bar
        const barComponent = ecs.getComponent(e, BarComponent)!;
        barComponent.value = food.amount; // Met à jour la barre de nourriture
    }
}
