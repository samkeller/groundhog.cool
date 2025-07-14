import { Application, Assets, Container, Sprite } from 'pixi.js';
import { onScrollFn } from "./mouseFunctions"

(async () => {
    if ((window as any).__pixi_playground_initialized) {
        // Déjà initialisé, on ne fait rien
        return;
    }
    (window as any).__pixi_playground_initialized = true;

    const app = new Application();

    // Initialize the application
    await app.init({ background: '#1099bb', resizeTo: document.body });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Create and add a container to the stage
    const container = new Container();

    app.stage.addChild(container);

    // Load the bunny texture
    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

    // Create a 5x5 grid of bunnies in the container
    for (let i = 0; i < 25; i++) {
        const bunny = new Sprite(texture);

        bunny.x = (i % 5) * 40;
        bunny.y = Math.floor(i / 5) * 40;
        container.addChild(bunny);
    }

    // Move the container to the center
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    // Center the bunny sprites in local container coordinates
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    // Listen for animate update
    app.ticker.add((time) => {
        // Continuously rotate the container!
        // * use delta to create frame-independent transform *
    });

    // Passe le container à la fonction de zoom avec la molette
    document.addEventListener("wheel", (evt) => onScrollFn(evt, container))
})();
