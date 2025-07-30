import FoodComponent from "../components/FoodComponent";
import SpawnIntentComponent from "../components/intents/SpawnIntentComponent";
import OwnedByComponent from "../components/relations/OwnedByComponent";
import GroundhogTagComponent from "../components/tags/GroundhogTagComponent";
import { ECS } from "../ECS";
import { createGroundhog } from "../factories/GroundhogFactory";
import TickContext from "./TickContext";

export function SpawnSystem(ecs: ECS, context: TickContext) {
    const spawnIntentsIds = ecs.getEntitiesWith(SpawnIntentComponent)
    for (const intentId of spawnIntentsIds) {
        const spawnIntent = ecs.getComponent(intentId, SpawnIntentComponent)
        if (!spawnIntent) return;
        if (spawnIntent.entity === "groundhog") {
            createGroundhog(
                ecs,
                spawnIntent.at,
                context.assets.groundhog,
                spawnIntent.fromBurrow,
                spawnIntent.ownerId
            );

            ecs.removeComponent(spawnIntent.fromBurrow, SpawnIntentComponent)
        }
    }

}
