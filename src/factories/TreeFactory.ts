import { ECS } from "../ECS";
import PositionComponent from "../components/PositionComponent";
import DrawableComponent from "../components/DrawableComponent";
import TreeTagComponent from "../components/tags/TreeTagComponent";
import FoodComponent from "../components/FoodComponent";
import { Sprite, Texture } from "pixi.js";

export function createTree(ecs: ECS, x: number, y: number, texture: Texture) {
    const entity = ecs.createEntity();
    ecs.addComponent(entity, new TreeTagComponent());
    ecs.addComponent(entity, new PositionComponent(x, y));
    ecs.addComponent(entity, new DrawableComponent(new Sprite({
        texture,
        width: 1024 / 50,
        height: 1536 / 50
    })));
    ecs.addComponent(entity, new FoodComponent(0));
    return entity;
}
