import { Container, Renderer } from "pixi.js";
import { Entity } from "../ECS";
import { TileMap } from "../types/TileMap";
import { GameAssets } from "../utils/AssetLoader";
import MapDraw from "../maps/MapDraw";
import { PixelPosition } from "../types/Position";

export class ContainerService {
    public stageContainer!: Container;
    public gameContainer!: Container;
    public mapContainer!: Container;
    public objectsContainer!: Container;
    public entityContainers = new Map<Entity, Container>();

    constructor(stageContainer: Container) {
        this.stageContainer = stageContainer;
        const gameContainer = new Container();
        stageContainer.addChild(gameContainer);
        this.gameContainer = gameContainer;
    }

    public async drawMap(map: TileMap, assets: GameAssets) {
        const drawnMap = await MapDraw(map, assets)
        if (!this.mapContainer) {
            this.mapContainer = new Container()
            this.gameContainer.addChild(this.mapContainer)
        }
        this.mapContainer.addChild(drawnMap)

        // Objects container après map.
        const objectsContainer = new Container();
        this.gameContainer.addChild(objectsContainer);
        this.objectsContainer = objectsContainer;
        return this.mapContainer
    }

    public centerGameContainer(
        renderer: Renderer,
        centerPosition: PixelPosition
    ) {

        // Move the container to the burrow
        const centerX = renderer.width / 2;
        const centerY = renderer.height / 2;
        this.gameContainer.x = centerX - centerPosition.x;
        this.gameContainer.y = centerY - centerPosition.y;
    }
}
