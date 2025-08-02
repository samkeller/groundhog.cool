import CooldownComponent from "../components/CooldownComponent";
import { ECS } from "../ECS";

export function CooldownSystem(ecs: ECS) {
    const cooldownComponents = ecs.getEntitiesWith(CooldownComponent)
    for (const e of cooldownComponents) {
        const cooldown = ecs.getComponent(e, CooldownComponent)!
        cooldown.remainingTime--

        if (cooldown.remainingTime === 0) {
            ecs.removeComponent(e, CooldownComponent)
        }
    }

}
