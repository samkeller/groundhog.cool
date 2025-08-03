import { ECS } from "../ECS";
import PathComponent from "../components/PathComponent";
import PositionComponent from "../components/PositionComponent";
import MoveIntentComponent from "../components/intents/MoveIntentComponent";
import CanMoveComponent from "../components/CanMoveComponent";
import { directionBetweenPoints, positionsAreEqual } from "../utils/PathUtils";


export default function PathSystem(ecs: ECS) {
    const entities = ecs.getEntitiesWith(PathComponent, PositionComponent, CanMoveComponent);
    for (const e of entities) {
        const path = ecs.getComponent(e, PathComponent)!;
        const pos = ecs.getComponent(e, PositionComponent)!;
        const canMove = ecs.getComponent(e, CanMoveComponent)!;

        const nextStep = path.path[0];
        if (positionsAreEqual(pos, nextStep)) {
            // Etape atteinte !
            path.path.shift();
        }

        if (!path.path.length) {
            // Path Vide
            ecs.removeComponent(e, PathComponent);
            ecs.removeComponent(e, MoveIntentComponent);
            continue;
        }

        // Génère un MoveIntent vers la prochaine étape
        const direction = directionBetweenPoints(pos, nextStep);
        ecs.addComponent(e, new MoveIntentComponent(direction));
    }
}
