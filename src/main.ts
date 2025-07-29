import { Application, Assets, Container, Text } from 'pixi.js';
import { onMouseDownFn, onMouseMoveFn, onMouseUpFn, onScrollFn } from "./mouseFunctions"
import getDataMap from './game/maps/SimpleMap';
import MapDraw from './game/maps/MapDraw';
import Burrow from './game/entities/Burrow';
import Player from './game/Player';
import Tickable from './game/entities/Tickable';
import IntentProcessor from './game/engine/IntentProcessor';
import TGameState from './types/TGameState';
import MapObjects from './game/maps/MapObjects';
import Drawable from './game/entities/Drawable';
import DrawOverlay from './overlay/DrawOverlay';

(async () => {

    // Déjà initialisé, on ne fait rien
    if ((window as any).__pixi_playground_initialized) return;
    (window as any).__pixi_playground_initialized = true;

    const app = new Application();

    // Initialize the application
    await app.init({ background: '#ccccccff', resizeTo: document.body });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    const player = new Player(200)

    const gameContainer = new Container();
   
    app.stage.addChild(gameContainer);

    // Map
    const dataMap = await getDataMap()
    const drawnMap = await MapDraw(dataMap)
    const objects = await MapObjects(dataMap)

    const objectContainer = new Container()
    gameContainer.addChild(drawnMap)
    gameContainer.addChild(objectContainer)

    // Move the container to the center
    gameContainer.x = (app.screen.width - drawnMap.width) / 2;
    gameContainer.y = (app.screen.height - drawnMap.height) / 2;


    const tickers: Drawable[] = [
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
                container: gameContainer,
                map: dataMap,
                player,
                tickers
            }
            await processor.apply(state, intent, ticker);
        }

        // Redraw (affichage)
        for (const obj of tickers) {
            obj.draw(objectContainer);
        }
        DrawOverlay(app, player)
    });

    // Passe le container à la fonction de zoom avec la molette
    app.canvas.addEventListener("wheel", (evt) => onScrollFn(evt, gameContainer))
    app.canvas.addEventListener("mousedown", (evt) => onMouseDownFn(evt))
    app.canvas.addEventListener("mousemove", (evt) => onMouseMoveFn(evt, gameContainer))
    app.canvas.addEventListener("mouseup", (evt) => onMouseUpFn(evt, gameContainer))
})();
