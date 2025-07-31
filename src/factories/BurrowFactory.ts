import { ECS, Entity } from "../ECS";
import PositionComponent from "../components/PositionComponent";
import DrawableComponent from "../components/DrawableComponent";
import BurrowTagComponent from "../components/tags/BurrowTagComponent";
import { Sprite, Texture } from "pixi.js";
import FoodStockComponent from "../components/FoodStockComponent";
import TPosition from "../types/TPosition";
import { TILE_SIZE } from "../maps/TerrainVariables";

export function createBurrow(ecs: ECS, position: TPosition, texture: Texture) {
    console.log(`[createBurrow] - x:${position.x}, y:${position.y}`)

    const ratio = texture.height / texture.width;

    const entity = ecs.createEntity();
    ecs.addComponent(entity, new BurrowTagComponent());
    ecs.addComponent(entity, new PositionComponent({
        x: position.x + TILE_SIZE / 2,
        y: position.y + TILE_SIZE / 2,
    }));
    ecs.addComponent(entity, new DrawableComponent(new Sprite({
        texture,
        width: TILE_SIZE,
        height: TILE_SIZE * ratio,
    })));
    ecs.addComponent(entity, new FoodStockComponent(100, 10000))
    return entity;
}
