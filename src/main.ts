import { Application, Assets, Container } from 'pixi.js';
import { onMouseDownFn, onMouseMoveFn, onMouseUpFn, onScrollFn } from "./mouseFunctions"
import getDataMap from './maps/SimpleMap';
import MapDraw from './maps/MapDraw';
import { ECS } from "./ECS";
import DrawSystem from "./systems/DrawSystem";
import TreeSystem from "./systems/TreeSystem";
import GroundhogSystem from "./systems/GroundhogSystem";
import { MoveSystem } from './systems/MoveSystem';
import { MoveToSystem } from './systems/MoveToSystem';
import BurrowTagComponent from './components/tags/BurrowTagComponent';
import PositionComponent from './components/PositionComponent';
import { createPlayer } from './factories/PlayerFactory';
import OwnedByComponent from './components/relations/OwnedByComponent';
import { SpawnSystem } from './systems/SpawnSystem';
import BurrowSystem from './systems/BurrowSystem';
import VisionSystem from './systems/VisionSystem';
import TickContext from './components/context/TickContext';
import getTestMap from './maps/TestMap1';
import PathSystem from './systems/PathSystem';

(async () => {
    // Déjà initialisé, on ne fait rien
    if ((window as any).__pixi_playground_initialized) return;
    (window as any).__pixi_playground_initialized = true;

    const app = new Application();

    // Initialize the application
    await app.init({ background: '#ccccccff', resizeTo: document.body });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    const gameContainer = new Container();

    app.stage.addChild(gameContainer);

    // Map
    // const [ecs, dataMap] = await getDataMap() // DataMap = tiles !
    const [ecs, dataMap] = await getTestMap() // DataMap = tiles !
    const drawnMap = await MapDraw(dataMap)

    const objectContainer = new Container()
    gameContainer.addChild(drawnMap)
    gameContainer.addChild(objectContainer)

    // Ajout du joueur comme entité ECS
    const playerEntity = createPlayer(ecs);

    // Centrage sur le terrier (à adapter si burrow devient une entité ECS)
    const burrows = ecs.getEntitiesWith(BurrowTagComponent, PositionComponent);
    const burrow = burrows[0]; // Il n’y en a qu’un normalement
    const burrowPos = ecs.getComponent(burrow, PositionComponent)!;
    // ects.find(elem => elem.name === "burrow");
    if (!burrow || !burrowPos) {
        throw new Error("Pas de terrier :(");
    }

    ecs.addComponent(burrow, new OwnedByComponent(playerEntity))

    // Move the container to the burrow
    const centerX = app.renderer.width / 2;
    const centerY = app.renderer.height / 2;
    gameContainer.x = centerX - burrowPos.x;
    gameContainer.y = centerY - burrowPos.y;

    const groundHogAsset = await Assets.load("assets/images/groundhog.png")
    const context = new TickContext(dataMap, groundHogAsset)

    // Boucle principale ECS
    app.ticker.speed = 0.5
    app.ticker.add(() => {

        // Intent
        TreeSystem(ecs);
        GroundhogSystem(ecs);
        BurrowSystem(ecs);

        // Resolution
        MoveToSystem(ecs, dataMap)
        PathSystem(ecs)
        MoveSystem(ecs, dataMap, context)
        SpawnSystem(ecs, context)
        VisionSystem(ecs, context)

        // Draw
        DrawSystem(ecs, objectContainer);

        // TODO: Adapter DrawOverlxay pour ECS (ex: passer l'entité player)
        // DrawOverlay(app, playerEntity)
    });

    // Passe le container à la fonction de zoom avec la molette
    app.canvas.addEventListener("wheel", (evt) => onScrollFn(evt, gameContainer));
    app.canvas.addEventListener("mousedown", (evt) => onMouseDownFn(evt));
    app.canvas.addEventListener("mousemove", (evt) => onMouseMoveFn(evt, gameContainer));
    app.canvas.addEventListener("mouseup", (evt) => onMouseUpFn(evt, gameContainer));
})();
