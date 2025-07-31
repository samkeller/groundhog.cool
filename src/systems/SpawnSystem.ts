import TickContext from "../assets/context/TickContext";
import SpawnIntentComponent from "../components/intents/SpawnIntentComponent";
import VisionComponent from "../components/VisionComponent";
import { ECS, Entity } from "../ECS";
import { createGroundhog } from "../factories/GroundhogFactory";

export function SpawnSystem(ecs: ECS, context: TickContext) {
    const spawnIntentsIds = ecs.getEntitiesWith(SpawnIntentComponent)
    for (const intentId of spawnIntentsIds) {
        let created: Entity | null = null;

        const spawnIntent = ecs.getComponent(intentId, SpawnIntentComponent)
        if (!spawnIntent) return;
        if (spawnIntent.entity === "groundhog") {
            created = createGroundhog(
                ecs,
                spawnIntent.at,
                context.assets.groundhog,
                spawnIntent.fromBurrow,
                spawnIntent.ownerId
            );

            // Ajout dans le contexte
            context.registerInSpatialIndex(created, spawnIntent.at)
            ecs.removeComponent(spawnIntent.fromBurrow, SpawnIntentComponent)
        }
    }

}
