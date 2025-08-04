import { ECS } from "../ECS";
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
import { CooldownSystem } from "./CoolDownSystem";
import EnergySystem from "./EnergySystem";
import { GameServices } from "../services/GameServices";

export default function RunSystems(
    ecs: ECS,
    gameServices: GameServices
) {
    runIntentSystems(ecs);
    runResolutionSystems(ecs, gameServices);
    runDrawSystems(ecs, gameServices);
}

function runIntentSystems(ecs: ECS) {
    TreeSystem(ecs);
    GroundhogSystem(ecs);
    BurrowSystem(ecs);
}

function runResolutionSystems(ecs: ECS, gameServices: GameServices) {
    MoveToSystem(ecs, gameServices.world.getMap());
    PathSystem(ecs);
    MoveSystem(ecs, gameServices.world.getMap(), gameServices.spatial);
    SpawnSystem(ecs, gameServices.assets, gameServices.spatial);
    VisionSystem(ecs, gameServices.spatial);
    EnergySystem(ecs);
}

function runDrawSystems(ecs: ECS, gameServices: GameServices) {
    DrawSystem(ecs, gameServices.containers);
    BarRenderSystem(ecs, gameServices.containers, gameServices.assets)
    CooldownSystem(ecs)
}