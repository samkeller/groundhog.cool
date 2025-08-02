import TickContext from "../components/context/TickContext";
import { ECS } from "../ECS";
import type { TileMap } from "../types/TileMap"
// Intent
import TreeSystem from "./TreeSystem";
import GroundhogSystem from "./GroundhogSystem";
import BurrowSystem from "./BurrowSystem";
// Resolution
import MoveToSystem from "./MoveToSystem";
import PathSystem from "./PathSystem";
import { MoveSystem } from "./MoveSystem";
import { SpawnSystem } from "./SpawnSystem";
import VisionSystem from "./VisionSystem";
import DrawSystem from "./DrawSystem";
import BarRenderSystem from "./BarRenderSystem";
import { Container } from "pixi.js";

export default function RunSystems(
    ecs: ECS,
    dataMap: TileMap,
    context: TickContext,
    objectContainer: Container
) {
    runIntentSystems(ecs);
    runResolutionSystems(ecs, dataMap, context);
    runDrawSystems(ecs, objectContainer, context);
}

function runIntentSystems(ecs: ECS) {
    TreeSystem(ecs);
    GroundhogSystem(ecs);
    BurrowSystem(ecs);
}
function runResolutionSystems(ecs: ECS, dataMap: TileMap, context: TickContext) {
    MoveToSystem(ecs, dataMap);
    PathSystem(ecs);
    MoveSystem(ecs, dataMap, context);
    SpawnSystem(ecs, context);
    VisionSystem(ecs, context);
}
function runDrawSystems(ecs: ECS, objectContainer: Container, context: TickContext) {
    DrawSystem(ecs, objectContainer);
    BarRenderSystem(ecs, objectContainer, context)
}