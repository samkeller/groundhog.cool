import { ECS } from "../ECS";
import PositionComponent from "../components/PositionComponent";
import MoveToIntentComponent from "../components/intents/MoveToIntentComponent";
import MoveIntentComponent from "../components/intents/MoveIntentComponent";
import { TMap } from "../types/TMap";
import MoveUtils from "../utils/MoveUtils";
import { directionBetweenPoints } from "../utils/PathUtils";

export function MoveToSystem(ecs: ECS, map: TMap) {
    const entities = ecs.getEntitiesWith(PositionComponent, MoveToIntentComponent);

    const moveUtils = new MoveUtils();

    for (const e of entities) {

        const pos = ecs.getComponent(e, PositionComponent)!;
        const moveTo = ecs.getComponent(e, MoveToIntentComponent)!;

        const angle = directionBetweenPoints(pos, moveTo.target);
        const result = moveUtils.findValidDirection(map, pos, moveTo.speed, angle);

        if (!result) {
            // Pas de chemin, on peut ignorer ou marquer comme bloqué
            continue;
        }

        // Ajouter un MovementComponent pour le tick courant
        ecs.addComponent(e, new MoveIntentComponent(result.nextDirection, moveTo.speed));

        // Optionnel : supprimer MoveToComponent si on est à destination
        const distSq = (moveTo.target.x - pos.x) ** 2 + (moveTo.target.y - pos.y) ** 2;

        if (distSq < 4) { // ex : à 2 pixels près
            ecs.removeComponent(e, MoveToIntentComponent);
        }
    }
}
