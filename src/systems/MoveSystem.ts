import { ECS } from "../ECS";
import PositionComponent from "../components/PositionComponent";
import MoveIntentComponent from "../components/intents/MoveIntentComponent";
import EnergyComponent from "../components/EnergyComponent";
import { TileMap } from "../types/TileMap";
import MoveUtils from "../utils/MoveUtils";
import CanMoveComponent from "../components/CanMoveComponent";
import TickContext from "../components/context/TickContext";

export function MoveSystem(ecs: ECS, map: TileMap, context: TickContext) {
  const entities = ecs.getEntitiesWith(MoveIntentComponent, PositionComponent, CanMoveComponent);

  for (const e of entities) {
    const positionComponent = ecs.getComponent(e, PositionComponent)!;
    const move = ecs.getComponent(e, MoveIntentComponent)!;
    const energyComponent = ecs.getComponent(e, EnergyComponent);
    const canMoveComponent = ecs.getComponent(e, CanMoveComponent)!;

    const posCopy = { ...positionComponent }
    const result = new MoveUtils().findValidDirection(map, positionComponent, canMoveComponent.speed, move.rotation);

    if (!result) {
      // Pas de déplacement possible
      continue;
    }

    // Mise à jour position + rotation
    positionComponent.x = result.nextPosition.x;
    positionComponent.y = result.nextPosition.y;
    move.rotation = result.nextDirection;

    canMoveComponent.direction = result.nextDirection

    // Énergie
    if (energyComponent) {
      energyComponent.energy = Math.floor(
        Math.max(
          0,
          energyComponent.energy - 0.1
        ) * 10
      ) / 10

      const newSpeed = energyComponent ?
        Math.max(
          energyComponent.energy / 10,
          0.1
        ) :
        0.5;
      if (newSpeed !== canMoveComponent.speed) {
        canMoveComponent.speed = newSpeed
      }
    }

    // Nettoyer l'intention après application
    ecs.removeComponent(e, MoveIntentComponent);

    // Update contexte
    context.updateSpatialIndex(e, posCopy, result.nextPosition)
  }
}
