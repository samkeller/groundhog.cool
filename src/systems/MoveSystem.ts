import { ECS } from "../ECS";
import PositionComponent from "../components/PositionComponent";
import MoveIntentComponent from "../components/intents/MoveIntentComponent";
import EnergyComponent from "../components/EnergyComponent";
import { TMap } from "../types/TMap";
import MoveUtils from "../utils/MoveUtils";
import CanMoveComponent from "../components/CanMoveComponent";
import TickContext from "../assets/context/TickContext";

export function MoveSystem(ecs: ECS, map: TMap, context: TickContext) {
  const entities = ecs.getEntitiesWith(MoveIntentComponent);

  for (const e of entities) {
    const positionComponent = ecs.getComponent(e, PositionComponent)!;
    const move = ecs.getComponent(e, MoveIntentComponent)!;
    const energy = ecs.getComponent(e, EnergyComponent);
    const canMoveComponent = ecs.getComponent(e, CanMoveComponent);

    const posCopy = {...positionComponent}
    const result = new MoveUtils().findValidDirection(map, positionComponent, move.speed, move.rotation);

    if (!result) {
      // Pas de déplacement possible
      continue;
    }

    // Mise à jour position + rotation
    positionComponent.x = result.nextPosition.x;
    positionComponent.y = result.nextPosition.y;
    move.rotation = result.nextDirection;

    // Énergie
    if (energy) {
      energy.energy = Math.max(0, energy.energy - 0.1);
    }

    if (canMoveComponent) {
      canMoveComponent.direction = result.nextDirection
    }

    // Nettoyer l'intention après application
    ecs.removeComponent(e, MoveIntentComponent);
    // Update contexte
    context.updateSpatialIndex(e, posCopy, result.nextPosition)
  }
}
