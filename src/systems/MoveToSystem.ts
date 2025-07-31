import { ECS } from "../ECS";
import PositionComponent from "../components/PositionComponent";
import MoveToIntentComponent from "../components/intents/MoveToIntentComponent";
import MoveIntentComponent from "../components/intents/MoveIntentComponent";
import { TMap } from "../types/TMap";
import { directionBetweenPoints } from "../utils/PathUtils";
import CanMoveComponent from "../components/CanMoveComponent";
import PathfindingUtils from "../utils/PathfindingUtils";

export function MoveToSystem(ecs: ECS, map: TMap) {
    const entities = ecs.getEntitiesWith(PositionComponent, MoveToIntentComponent);

    for (const e of entities) {
        const pos = ecs.getComponent(e, PositionComponent)!;
        const moveTo = ecs.getComponent(e, MoveToIntentComponent)!;
        const canMoveComponent = ecs.getComponent(e, CanMoveComponent)!;

        const pathSteps = new PathfindingUtils(map).getTilesPathFinding(pos, moveTo.target)
        if (!pathSteps || pathSteps.length === 0) {
            // Pas de chemin
            // 1. On peut ignorer ou marquer comme bloqué
            // 2. On est arrivés
            ecs.removeComponent(e, MoveToIntentComponent);
            continue;
        }

        const nextStep = pathSteps[pathSteps.length - 1]
        const direction = directionBetweenPoints(pos, nextStep)

        // Ajouter un MovementComponent pour le tick courant
        ecs.addComponent(e, new MoveIntentComponent(canMoveComponent.speed, direction));
    }
}
