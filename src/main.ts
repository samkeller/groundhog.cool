import { Application, Container } from 'pixi.js';
import { onMouseDownFn, onMouseMoveFn, onMouseUpFn, onScrollFn } from "./mouseFunctions";
import MapDraw from './maps/MapDraw';
import BurrowTagComponent from './components/tags/BurrowTagComponent';
import PositionComponent from './components/PositionComponent';
import { createPlayer } from './factories/PlayerFactory';
import OwnedByComponent from './components/relations/OwnedByComponent';
import getTestMap from './maps/TestMap1';
import { loadAssets } from './utils/AssetLoader';
import RunSystems from './systems/Systems';
import { GameServices } from './services/GameServices';
import { WorldService } from './services/WorldService';

(async () => {
    // Déjà initialisé, on ne fait rien
    if ((window as any).__pixi_playground_initialized) return;
    (window as any).__pixi_playground_initialized = true;

    const app = new Application();

    // Initialize the application
    await app.init({ background: '#ccccccff', resizeTo: document.body });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Chargement des assets
    const assets = await loadAssets();
    const [ecs, dataMap] = await getTestMap(assets) // DataMap = tiles !
    
    const gameServices = new GameServices(dataMap, assets, app.stage)
  
    // Chargement de la map et dessin
    gameServices.containers.drawMap(gameServices.world.getMap(), gameServices.assets.assets)

    // Ajout du joueur comme entité ECS
    const playerEntity = createPlayer(ecs);

    // Centrage sur le terrier (à adapter si burrow devient une entité ECS)
    const burrows = ecs.getEntitiesWith(BurrowTagComponent, PositionComponent);
    const burrow = burrows[0]; // Il n’y en a qu’un normalement
    const burrowPos = ecs.getComponent(burrow, PositionComponent)!;
    if (!burrow || !burrowPos) {
        throw new Error("Pas de terrier :(");
    }

    ecs.addComponent(burrow, new OwnedByComponent(playerEntity))
    console.log(ecs)
    gameServices.containers.centerGameContainer(app.renderer, burrowPos)

    app.ticker.speed = 0.5
  
    app.ticker.add(() => {
        RunSystems(ecs, gameServices)
    });

    // Input event listeners
    app.canvas.addEventListener("wheel", (evt) => onScrollFn(evt, gameServices.containers.gameContainer));
    app.canvas.addEventListener("mousedown", (evt) => onMouseDownFn(evt));
    app.canvas.addEventListener("mousemove", (evt) => onMouseMoveFn(evt, gameServices.containers.gameContainer));
    app.canvas.addEventListener("mouseup", (evt) => onMouseUpFn(evt, gameServices.containers.gameContainer));
})();
