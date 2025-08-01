import { ECS } from "../ECS";
import PositionComponent from "../components/PositionComponent";
import MoveToIntentComponent from "../components/intents/MoveToIntentComponent";
import { TileMap } from "../types/TileMap";
import CanMoveComponent from "../components/CanMoveComponent";
import PathfindingUtils from "../utils/PathfindingUtils";
import PathComponent from "../components/PathComponent";

export default function MoveToSystem(ecs: ECS, map: TileMap) {
    // Instanciation unique de PathfindingUtils pour ce tick
    const pathfinder = new PathfindingUtils(map);
    const entities = ecs.getEntitiesWith(PositionComponent, MoveToIntentComponent, CanMoveComponent);

    for (const e of entities) {
        const pos = ecs.getComponent(e, PositionComponent)!;
        const moveTo = ecs.getComponent(e, MoveToIntentComponent)!;
        let pathComponent = ecs.getComponent(e, PathComponent);

        // Cas où le chemin doit être recalculé :
        // - Pas de PathComponent
        // - Chemin vide
        // - La cible a changé
        const shouldRecalculatePath =
            !pathComponent ||
            !pathComponent.path.length ||
             (
                moveTo.target.x !== pathComponent.path[pathComponent.path.length - 1].x ||
                moveTo.target.y !== pathComponent.path[pathComponent.path.length - 1].y
            );
        if (shouldRecalculatePath) {
            const pathSteps = pathfinder.getTilesPathFinding(pos, moveTo.target);
            if (!pathSteps || pathSteps.length === 0) {
                ecs.removeComponent(e, MoveToIntentComponent);
                ecs.removeComponent(e, PathComponent);
                continue;
            }
            ecs.addComponent(e, new PathComponent(pathSteps));
            pathComponent = ecs.getComponent(e, PathComponent);
        }
    }
}
