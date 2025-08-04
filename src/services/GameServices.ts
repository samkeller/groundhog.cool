import { SpatialService } from "../services/SpatialService";
import { AssetService } from "../services/AssetService";
import { WorldService } from "../services/WorldService";
import { TileMap } from "../types/TileMap";
import { GameAssets } from "../utils/AssetLoader";
import { ContainerService } from "../services/ContainerService";
import { Container } from "pixi.js";

/**
 * Container simple pour gérer les services du jeu.
 */
export class GameServices {
    public readonly spatial: SpatialService;
    public readonly assets: AssetService;
    public readonly world: WorldService;
    public readonly containers: ContainerService

    constructor(map: TileMap, gameAssets: GameAssets, stageContainer: Container) {
        // Initialisation des services spécialisés
        this.spatial = new SpatialService();
        this.assets = new AssetService(gameAssets);
        this.world = new WorldService(map);
        this.containers = new ContainerService(stageContainer)

        // Initialisation de l'index spatial à partir de la carte
        this.spatial.initializeFromTileMap(map);
        this.containers.drawMap(map, gameAssets)
    }

}
