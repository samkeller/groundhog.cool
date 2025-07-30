import { ECS } from "../ECS";
import CanMoveComponent from "../components/CanMoveComponent";
import DrawableComponent from "../components/DrawableComponent";
import PositionComponent from "../components/PositionComponent";
import { Container } from "pixi.js";

export default function DrawSystem(ecs: ECS, container: Container) {
    const entities = ecs.getEntitiesWith(DrawableComponent, PositionComponent);
    for (const entity of entities) {
        const drawable = ecs.getComponent(entity, DrawableComponent);
        const position = ecs.getComponent(entity, PositionComponent);
        const canMoveComponent = ecs.getComponent(entity, CanMoveComponent);

        if (drawable && position) {
            drawable.sprite.x = position.x;
            drawable.sprite.y = position.y;
            if (canMoveComponent) {
                drawable.sprite.angle = canMoveComponent.direction
            }
            if (!container.children.includes(drawable.sprite)) {
                container.addChild(drawable.sprite);
            }
        drawable.sprite.anchor.set(0.5, 0.5);

        }
    }
}
