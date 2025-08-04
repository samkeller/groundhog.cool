import { Container } from "pixi.js";
import { ECS } from "../ECS";
import getTestMap from "../maps/TestMap1";
import { loadAssets } from "../utils/AssetLoader";
import { GameServices } from "./GameServices";

export default async function BuildGameServices(stage: Container): Promise<[ECS, GameServices]> {

    // Chargement des assets
    const assets = await loadAssets();
    const [ecs, dataMap] = await getTestMap(assets) // DataMap = tiles !

    const gameServices = new GameServices(dataMap, assets, stage)
    await gameServices.containers.drawMap(dataMap, assets)

    return [ecs, gameServices]
}
