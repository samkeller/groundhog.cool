import { ECS } from "../ECS";
import PositionComponent from "../components/PositionComponent";
import MoveToIntentComponent from "../components/intents/MoveToIntentComponent";
import MoveIntentComponent from "../components/intents/MoveIntentComponent";
import { TMap } from "../types/TMap";
import { directionBetweenPoints } from "../utils/PathUtils";
import CanMoveComponent from "../components/CanMoveComponent";
import PathfindingUtils from "../utils/PathfindingUtils";
import PathComponent from "../components/PathComponent";

export function MoveToSystem(ecs: ECS, map: TMap) {
    const entities = ecs.getEntitiesWith(PositionComponent, MoveToIntentComponent, CanMoveComponent);

    for (const e of entities) {
        const pos = ecs.getComponent(e, PositionComponent)!;
        const moveTo = ecs.getComponent(e, MoveToIntentComponent)!;
        let pathComponent = ecs.getComponent(e, PathComponent);

        const pathLastStep = pathComponent?.path[pathComponent.path.length - 1]
        // Si pas de path ou cible différente, recalcule le chemin
        if (!pathComponent ||
            !pathComponent.path.length ||
            (
                moveTo.target.x !== pathLastStep!.x ||
                moveTo.target.y !== pathLastStep!.y
            )
        ) {
            const pathSteps = new PathfindingUtils(map).getTilesPathFinding(pos, moveTo.target);
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
