import { ECS } from "../ECS";
import PositionComponent from "../components/PositionComponent";
import MoveToIntentComponent from "../components/intents/MoveToIntentComponent";
import { TileMap } from "../types/TileMap";
import CanMoveComponent from "../components/CanMoveComponent";
import PathComponent from "../components/PathComponent";
import { positionsAreEqual } from "../utils/PathUtils";
import { WorldService } from "../services/WorldService";

export default function MoveToSystem(ecs: ECS, worldService: WorldService) {
    // Instanciation unique de PathfindingUtils pour ce tick
    const entities = ecs.getEntitiesWith(PositionComponent, MoveToIntentComponent, CanMoveComponent);

    for (const e of entities) {
        const positionComponent = ecs.getComponent(e, PositionComponent)!;
        const moveToEntity = ecs.getComponent(e, MoveToIntentComponent)!;
        const moveToPosition = ecs.getComponent(moveToEntity.target, PositionComponent)!;
        let pathComponent = ecs.getComponent(e, PathComponent);

        // - On est déjà arrivés
        if (positionsAreEqual(moveToPosition, positionComponent)) {
            ecs.removeComponent(e, PathComponent)
            continue;
        }

        // Cas où le chemin doit être recalculé :
        // - Pas de PathComponent
        // - Chemin vide
        // - La cible a changé
        const shouldRecalculatePath =
            !pathComponent ||
            !pathComponent.path.length ||
            !positionsAreEqual(
                moveToPosition,
                pathComponent.path[pathComponent.path.length - 1]
            );

        if (shouldRecalculatePath) {
            const pathSteps = worldService.getPathBetween(positionComponent, moveToPosition);
            if (!pathSteps || pathSteps.length === 0) {
                // Pas de chemin valide !
                continue;
            }
            ecs.addComponent(e, new PathComponent(pathSteps));
        }
    }
}
