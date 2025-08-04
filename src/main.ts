import { Application, Container } from 'pixi.js';
import { onMouseDownFn, onMouseMoveFn, onMouseUpFn, onScrollFn } from "./mouseFunctions";
import BurrowTagComponent from './components/tags/BurrowTagComponent';
import PositionComponent from './components/PositionComponent';
import { createPlayer } from './factories/PlayerFactory';
import OwnedByComponent from './components/relations/OwnedByComponent';
import getTestMap from './maps/TestMap1';
import RunSystems from './systems/Systems';
import BuildGameServices from './services/AsyncBuildGameServices';

(async () => {
    // Déjà initialisé, on ne fait rien
    if ((window as any).__pixi_playground_initialized) return;
    (window as any).__pixi_playground_initialized = true;

    const app = new Application();

    // Initialize the application
    await app.init({ background: '#ccccccff', resizeTo: document.body });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    const [ecs, gameServices] = await BuildGameServices(app.stage)

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
