import { Application, Assets, Container, Point } from 'pixi.js';
import { onMouseDownFn, onMouseMoveFn, onMouseUpFn, onScrollFn } from "./mouseFunctions"
import Groundhog from './game/Groundhog';
import getSimpleMap from './game/maps/SimpleMap';

(async () => {

    if ((window as any).__pixi_playground_initialized) {
        // Déjà initialisé, on ne fait rien
        return;
    }
    (window as any).__pixi_playground_initialized = true;

    const app = new Application();

    // Initialize the application
    await app.init({ background: '#ccccccff', resizeTo: document.body });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    const container = new Container();
    app.stage.addChild(container);

    // Map
    const map = await getSimpleMap()
    map.position = { x: container.width / 2, y: container.height / 2 }
    container.addChild(map)

    // Move the container to the center
    container.x = (app.screen.width - map.width) / 2;
    container.y = (app.screen.height - map.height) / 2;

    const groundHogTexture = await Assets.load("assets/images/groundhog.png");

    const groundHog = new Groundhog(groundHogTexture)
    groundHog.position = { x: container.width / 2, y: container.height / 2 }
    groundHog.draw(container)

    // Listen for animate update
    app.ticker.add((time) => {
        // Continuously rotate the container!
        // * use delta to create frame-independent transform *
        groundHog.draw(container)
    });

    // Passe le container à la fonction de zoom avec la molette
    app.canvas.addEventListener("wheel", (evt) => onScrollFn(evt, container))
    app.canvas.addEventListener("mousedown", (evt) => onMouseDownFn(evt))
    app.canvas.addEventListener("mousemove", (evt) => onMouseMoveFn(evt, container))
    app.canvas.addEventListener("mouseup", (evt) => onMouseUpFn(evt, container))
})();
