import { ECS, Entity } from "../ECS";
import PositionComponent from "../components/PositionComponent";
import DrawableComponent from "../components/DrawableComponent";
import BurrowTagComponent from "../components/tags/BurrowTagComponent";
import { Sprite, Texture } from "pixi.js";
import FoodStockComponent from "../components/FoodStockComponent";
import { PixelPosition } from "../types/Position";
import { TILE_SIZE } from "../maps/TerrainVariables";
import { BarComponent } from "../components/BarComponent";

export function createBurrow(ecs: ECS, position: PixelPosition, texture: Texture) {
    console.log(`[createBurrow] - x:${position.x}, y:${position.y}`)

    const ratio = texture.height / texture.width;

    const entity = ecs.createEntity();
    ecs.addComponent(entity, new BurrowTagComponent());
    ecs.addComponent(entity, new PositionComponent({
        x: position.x,
        y: position.y,
    }));
    ecs.addComponent(entity, new DrawableComponent(new Sprite({
        texture,
        width: TILE_SIZE,
        height: TILE_SIZE * ratio,
    })));
    ecs.addComponent(entity, new FoodStockComponent(500, 1000))
    ecs.addComponent(entity, new BarComponent(50, 1000, "foodStock"));
    return entity;
}
