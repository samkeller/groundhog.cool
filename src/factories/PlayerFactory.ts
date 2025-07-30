import { ECS } from "../ECS";
import PlayerComponent from "../components/PlayerComponent";

export function createPlayer(ecs: ECS) {
    const entity = ecs.createEntity();
    ecs.addComponent(entity, new PlayerComponent());
    return entity;
}
