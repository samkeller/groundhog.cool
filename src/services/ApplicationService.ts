import { Application, Container, Renderer } from "pixi.js";
import { Entity } from "../ECS";
import { TileMap } from "../types/TileMap";
import { GameAssets } from "../utils/AssetLoader";
import MapDraw from "../maps/MapDraw";
import { PixelPosition } from "../types/Position";

export class ApplicationService {

    public stageContainer!: Container;
    public gameContainer!: Container;
    public mapContainer?: Container;
    public objectsContainer?: Container;
    private overlayContainer?: Container;
    private app: Application

    constructor(app: Application) {
        this.app = app;
        this.stageContainer = app.stage;
        const gameContainer = new Container();
        this.stageContainer.addChild(gameContainer);
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

    public getEntityContainer(e: Entity) {
        this.throwIfNotInitCorrectly()
        const label = `entity-${e}`
        let childContainer = this.objectsContainer!.getChildByLabel(label)

        if (!childContainer) {
            childContainer = new Container();
            childContainer.label = label;
            this.objectsContainer!.addChild(childContainer)
        }
        return childContainer
    }

    getOverlayContainer() {
        // Si l'overlay n'existe pas, on le crée et on l'ajoute à la scène
        if (!this.overlayContainer) {
            const overlayContainer = new Container();
            overlayContainer.label = "overlay";
            overlayContainer.width = this.app.screen.width;
            overlayContainer.height = this.app.screen.height;
            this.stageContainer.addChild(overlayContainer);
            this.overlayContainer = overlayContainer
        }
        return this.overlayContainer
    }

    private throwIfNotInitCorrectly() {
        if (!this.objectsContainer || !this.mapContainer) {
            throw new Error("ApplicationService not properly initalized")
        }
    }
}
