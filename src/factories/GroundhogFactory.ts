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
import { randomIntFromInterval } from "../utils/MathUtils";

export function createGroundhog(
    ecs: ECS,
    position: TPosition,
    texture: Texture,
    spawnBurrow: Entity,
    playerId: Entity
) {
    console.log(`[createGroundhog] - x:${position.x}, y:${position.y}`)
    const entity = ecs.createEntity();
    ecs.addComponent(entity, new GroundhogTagComponent());
    ecs.addComponent(entity, new PositionComponent(position.x, position.y));
    ecs.addComponent(entity, new DrawableComponent(new Sprite({
        texture,
        width: 1024 / 50,
        height: 1536 / 50
    })));
    ecs.addComponent(entity, new EnergyComponent(randomIntFromInterval(80, 100), 100));
    ecs.addComponent(entity, new CanMoveComponent(
        randomIntFromInterval(0, 360),
        randomIntFromInterval(0.2, 0.8)
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
