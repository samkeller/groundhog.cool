import { Application, Assets, Container } from 'pixi.js';
import { onMouseDownFn, onMouseMoveFn, onMouseUpFn, onScrollFn } from "./mouseFunctions"
import getDataMap from './game/maps/SimpleMap';
import MapDraw from './game/maps/MapDraw';
import Burrow from './game/entities/Burrow';
import Player from './game/Player';
import Tickable from './game/entities/Tickable';
import IntentProcessor from './game/engine/IntentProcessor';
import TGameState from './types/TGameState';
import MapObjects from './game/maps/MapObjects';

(async () => {

    // Déjà initialisé, on ne fait rien
    if ((window as any).__pixi_playground_initialized) return;
    (window as any).__pixi_playground_initialized = true;

    const app = new Application();

    // Initialize the application
    await app.init({ background: '#ccccccff', resizeTo: document.body });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    const container = new Container();
    app.stage.addChild(container);

    // Map
    const dataMap = await getDataMap()
    const drawnMap = await MapDraw(dataMap)
    const objects = await MapObjects(dataMap)
    
    const objectContainer = new Container()
    objects.forEach(o => o.draw(objectContainer))

    container.addChild(drawnMap)
    container.addChild(objectContainer)

    // Move the container to the center
    container.x = (app.screen.width - drawnMap.width) / 2;
    container.y = (app.screen.height - drawnMap.height) / 2;

    const player = new Player(200)

    // const burrowTexture = await Assets.load("assets/images/burrow.png");
    // const startingBurrow = new Burrow(
    //     burrowTexture,
    //     { x: container.width / 2, y: container.height / 2 }
    // )
    // startingBurrow.draw(container)

    const tickers: Tickable[] = [
        ...objects
    ]

    const processor = new IntentProcessor();
    // Listen for animate update
    app.ticker.add(async (time) => {
        for (const ticker of tickers) {
            const intent = ticker.doTick({
                map: dataMap,
                owner: player,
                tickers
            });

            const state: TGameState = {
                container,
                map: dataMap,
                player,
                tickers
            }
            await processor.apply(state, intent, ticker);
        }
    });

    // Passe le container à la fonction de zoom avec la molette
    app.canvas.addEventListener("wheel", (evt) => onScrollFn(evt, container))
    app.canvas.addEventListener("mousedown", (evt) => onMouseDownFn(evt))
    app.canvas.addEventListener("mousemove", (evt) => onMouseMoveFn(evt, container))
    app.canvas.addEventListener("mouseup", (evt) => onMouseUpFn(evt, container))
})();
