import { ECS } from "../ECS";
import CanMoveComponent from "../components/CanMoveComponent";
import DrawableComponent from "../components/DrawableComponent";
import PositionComponent from "../components/PositionComponent";
import { ApplicationService } from "../services/ApplicationService";

export default function DrawSystem(ecs: ECS, applicationService: ApplicationService) {
    const entities = ecs.getEntitiesWith(DrawableComponent, PositionComponent);

    for (const e of entities) {
        const drawable = ecs.getComponent(e, DrawableComponent);
        const position = ecs.getComponent(e, PositionComponent);
        const canMoveComponent = ecs.getComponent(e, CanMoveComponent);

        if (drawable && position) {
            const entityContainer = applicationService.getEntityContainer(e);

            if (!drawable.initialized) {
                if (drawable.sprite.anchor.x === 0 && drawable.sprite.anchor.y === 0)
                    drawable.sprite.anchor.set(0.5, 0.5);

                drawable.initialized = true;
            }

            entityContainer.x = position.x;
            entityContainer.y = position.y;


            if (canMoveComponent) {
                drawable.sprite.angle = canMoveComponent.direction;
            }

            if (!entityContainer.children.includes(drawable.sprite)) {
                entityContainer.addChild(drawable.sprite);
            }
        }
    }
}
