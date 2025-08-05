import { ECS } from "../ECS";
import PositionComponent from "../components/PositionComponent";
import DrawableComponent from "../components/DrawableComponent";
import TreeTagComponent from "../components/tags/TreeTagComponent";
import FoodStockComponent from "../components/FoodStockComponent";
import { Sprite, Texture } from "pixi.js";
import { TILE_SIZE } from "../maps/TerrainVariables";
import { randomFloatFromInterval } from "../utils/MathUtils";
import { PixelPosition } from "../types/Position";
import { BarComponent } from "../components/BarComponent";

export function createTree(ecs: ECS, position: PixelPosition, texture: Texture) {

    const entity = ecs.createEntity();

    ecs.addComponent(entity, new TreeTagComponent());
    ecs.addComponent(entity, new PositionComponent({
        x: position.x,
        y: position.y,
    }));
    ecs.addComponent(entity, new DrawableComponent(createSpriteForTile(texture)));
    ecs.addComponent(entity, new FoodStockComponent(0, 200));
    ecs.addComponent(entity, new BarComponent(0, 200, "foodStock"))
    return entity;
}

export function createSpriteForTile(texture: Texture): Sprite {
    const sprite = new Sprite(texture);

    // Adapter à la largeur de tile, conserver le ratio d'origine
    const scaleYFactor = randomFloatFromInterval(1, 1.5)
    const ratio = texture.height / texture.width;
    sprite.width = TILE_SIZE;
    sprite.height = TILE_SIZE * ratio * scaleYFactor;

    sprite.zIndex = 5;
    // Ancrage centré en bas pour coller le pied à la tuile
    sprite.anchor.set(0.5, 0.8);

    return sprite;
}
