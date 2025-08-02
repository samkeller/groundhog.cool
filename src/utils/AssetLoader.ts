import { Assets, BindableTexture, GraphicsContext, Texture } from "pixi.js";

export type GameAssets = {
    groundhog: Texture;
    appleTree: Texture;
    burrow: Texture;
    sprites: BindableTexture
    icons: {
        bolt: GraphicsContext,
        apple: GraphicsContext
    }
};

/**
 * Charge et retourne toutes les textures de jeu.
 */
export async function loadAssets(): Promise<GameAssets> {
    const groundhog = await Assets.load("assets/images/groundhog.png");
    const appleTree = await Assets.load("assets/images/apple_tree.png");
    const burrow = await Assets.load("assets/images/burrow.png");
    const sprites = await Assets.load("assets/images/sprites.png")

    const icons = {
        bolt: await Assets.load({
            src: "assets/images/fontawesome/bolt-solid-full.svg",
            data: { parseAsGraphicsContext: true }
        }),
        apple: await Assets.load({
            src: "assets/images/fontawesome/apple-whole-solid-full.svg",
            data: { parseAsGraphicsContext: true }
        })
    }

    return {
        groundhog,
        appleTree,
        burrow,
        sprites,
        icons
    };
}
