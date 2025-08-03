import PositionComponent from "../components/PositionComponent";
import VisionComponent from "../components/VisionComponent";
import { ECS } from "../ECS";
import { TILE_SIZE } from "../maps/TerrainVariables";
import { SpatialService } from "../services/SpatialService";

export default function VisionSystem(ecs: ECS, spatialService: SpatialService) {
    const entitiesWithVision = ecs.getEntitiesWith(VisionComponent, PositionComponent);
    
    for (const e of entitiesWithVision) {
        const vision = ecs.getComponent(e, VisionComponent)!;
        const position = ecs.getComponent(e, PositionComponent)!;

        // Utilisation de la nouvelle API du service spatial
        // Plus besoin de connaître les détails d'implémentation de l'index
        const visibles = spatialService.getNearby(position);
        
        // Filtrage pour exclure l'entité elle-même de sa propre vision
        vision.visibles = visibles.filter(entityId => entityId !== e);
    }
}