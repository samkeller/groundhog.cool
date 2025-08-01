import { Container } from "pixi.js";
import { Entity } from "../ECS";

export function getLabelForEntity(e: Entity): string {
    return `entity-${e}`
}

export function getEntityContainer(parentContainer: Container, e: Entity): Container {
    let childContainer = parentContainer.getChildByLabel(getLabelForEntity(e))

    if (!childContainer) {
        childContainer = new Container();
        childContainer.label = getLabelForEntity(e);
        parentContainer.addChild(childContainer)
    }
    return childContainer
}