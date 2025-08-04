import { Application, Container } from "pixi.js";
import { ECS } from "../ECS";
import getTestMap from "../maps/TestMap1";
import { loadAssets } from "../utils/AssetLoader";
import { GameServices } from "./GameServices";
import Colors from "../utils/Colors";

export default async function BuildGameServices(): Promise<[Application, ECS, GameServices]> {
    const app = new Application();

    // Initialize the application
    await app.init({ background: Colors.light, resizeTo: document.body });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Chargement des assets
    const assets = await loadAssets();
    const [ecs, dataMap] = await getTestMap(assets) // DataMap = tiles !

    const gameServices = new GameServices(dataMap, assets, app)
    await gameServices.application.drawMap(dataMap, assets)

    // Initialisation de l'index spatial à partir de la carte
    gameServices.spatial.initializeFromTileMap(dataMap);
    
    return [app, ecs, gameServices]
}
