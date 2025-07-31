import { ECS, Entity } from "../ECS";
import PositionComponent from "../components/PositionComponent";
import DrawableComponent from "../components/DrawableComponent";
import GroundhogTagComponent from "../components/tags/GroundhogTagComponent";
import EnergyComponent from "../components/EnergyComponent";
import { Sprite, Texture } from "pixi.js";
import MoveIntentComponent from "../components/intents/MoveIntentComponent";
import BurrowHomeComponent from "../components/BurrowHomeComponent";
import TPosition from "../types/TPosition";
import OwnedByComponent from "../components/relations/OwnedByComponent";
import CanMoveComponent from "../components/CanMoveComponent";
import { randomFloatFromInterval, randomIntFromInterval } from "../utils/MathUtils";
import { TILE_SIZE } from "../maps/TerrainVariables";

export function createGroundhog(
    ecs: ECS,
    position: TPosition,
    texture: Texture,
    spawnBurrow: Entity,
    playerId: Entity
) {
    console.log(`[createGroundhog] - x:${position.x}, y:${position.y}`)

    const ratio = texture.height / texture.width;

    const entity = ecs.createEntity();
    ecs.addComponent(entity, new GroundhogTagComponent());
    ecs.addComponent(entity, new PositionComponent(position));
    ecs.addComponent(entity, new DrawableComponent(new Sprite({
        texture,
        width: TILE_SIZE * 0.6,
        height: TILE_SIZE * 0.6 * ratio
    })));
    ecs.addComponent(entity, new EnergyComponent(randomIntFromInterval(80, 100), 100));
    ecs.addComponent(entity, new CanMoveComponent(
        randomIntFromInterval(0, 360),
        randomFloatFromInterval(0.2, 0.8)
    ));
    ecs.addComponent(entity, new MoveIntentComponent());
    ecs.addComponent(entity, new OwnedByComponent(playerId))

    const burrowPos = ecs.getComponent(spawnBurrow, PositionComponent)
    if (!burrowPos) throw new Error("Burrow has no position!");
    ecs.addComponent(entity, new BurrowHomeComponent({
        x: burrowPos.x,
        y: burrowPos.y,
    }));
    return entity;
}
