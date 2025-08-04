import { Texture } from "pixi.js";
import SpawnIntentComponent from "../components/intents/SpawnIntentComponent";
import { ECS, Entity } from "../ECS";
import { createGroundhog } from "../factories/GroundhogFactory";
import { AssetService } from "../services/AssetService";
import { SpatialService } from "../services/SpatialService";

export function SpawnSystem(ecs: ECS, assetService: AssetService, spatialService: SpatialService) {
    const spawnIntentsIds = ecs.getEntitiesWith(SpawnIntentComponent)
    
    for (const e of spawnIntentsIds) {
        let created: Entity | null = null;

        const spawnIntent = ecs.getComponent(e, SpawnIntentComponent)
        if (!spawnIntent) return;
        
        if (spawnIntent.entity === "groundhog") {
            const groundhogTexture = assetService.getTexture('groundhog') as Texture;
            
            created = createGroundhog(
                ecs,
                spawnIntent.at,
                groundhogTexture ,
                spawnIntent.fromBurrow,
                spawnIntent.ownerId
            );

            // Enregistrement via le service spatial
            spatialService.register(created, spawnIntent.at);
            ecs.removeComponent(e, SpawnIntentComponent);
        }
    }
}
