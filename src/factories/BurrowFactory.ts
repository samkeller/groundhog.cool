import { ECS, Entity } from "../ECS";
import PositionComponent from "../components/PositionComponent";
import DrawableComponent from "../components/DrawableComponent";
import BurrowTagComponent from "../components/tags/BurrowTagComponent";
import { Sprite, Texture } from "pixi.js";
import FoodComponent from "../components/FoodComponent";

export function createBurrow(ecs: ECS, x: number, y: number, texture: Texture) {
    const entity = ecs.createEntity();
    ecs.addComponent(entity, new BurrowTagComponent());
    ecs.addComponent(entity, new PositionComponent(x, y));
    ecs.addComponent(entity, new DrawableComponent(new Sprite({
        texture,
        width: 1024 / 50,
        height: 1536 / 50
    })));
    ecs.addComponent(entity, new FoodComponent(100))
    return entity;
}
