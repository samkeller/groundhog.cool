import TickContext from "../assets/context/TickContext";
import PositionComponent from "../components/PositionComponent";
import VisionComponent from "../components/VisionComponent";
import { ECS, Entity } from "../ECS";
import { TILE_SIZE } from "../maps/TerrainVariables";

const VISION_RANGE = 2 * TILE_SIZE

export default function VisionSystem(ecs: ECS, ctx: TickContext) {
    const entitiesWithVision = ecs.getEntitiesWith(VisionComponent, PositionComponent);

    for (const e of entitiesWithVision) {
        const vision = ecs.getComponent(e, VisionComponent)!;
        const position = ecs.getComponent(e, PositionComponent)!;

        const visibles: Entity[] = [];

        for (let dx = -VISION_RANGE; dx <= VISION_RANGE; dx++) {
            for (let dy = -VISION_RANGE; dy <= VISION_RANGE; dy++) {
                const key = ctx.spatialIndexKeyBuilder({ x: dx, y: dy });
                const entitiesAtTile = ctx.spatialIndex.get(key);
                if (entitiesAtTile) {
                    for (const id of entitiesAtTile) {
                        visibles.push(id);
                    }
                }
            }
        }
        vision.visibles = visibles;
    }
}