import { SpatialService } from "../services/SpatialService";
import { AssetService } from "../services/AssetService";
import { WorldService } from "../services/WorldService";
import { TileMap } from "../types/TileMap";
import { GameAssets } from "../utils/AssetLoader";
import { ApplicationService } from "../services/ApplicationService";
import { Application } from "pixi.js";

/**
 * Container simple pour gérer les services du jeu.
 */
export class GameServices {
    public readonly spatial: SpatialService;
    public readonly assets: AssetService;
    public readonly world: WorldService;
    public readonly application: ApplicationService

    constructor(
        map: TileMap,
        gameAssets: GameAssets,
        app: Application
    ) {
        // Initialisation des services spécialisés
        this.spatial = new SpatialService();
        this.assets = new AssetService(gameAssets);
        this.world = new WorldService(map);
        this.application = new ApplicationService(app);
    }
}
