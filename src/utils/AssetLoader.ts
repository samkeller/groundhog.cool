import { Assets, BindableTexture, Texture } from "pixi.js";

export type GameAssets = {
    groundhog: Texture;
    appleTree: Texture;
    burrow: Texture;
    sprites: BindableTexture
};

/**
 * Charge et retourne toutes les textures de jeu.
 */
export async function loadAssets(): Promise<GameAssets> {
    const groundhog = await Assets.load("assets/images/groundhog.png");
    const appleTree = await Assets.load("assets/images/apple_tree.png");
    const burrow = await Assets.load("assets/images/burrow.png");
    const sprites = await Assets.load("assets/images/sprites.png")
    return { groundhog, appleTree, burrow, sprites };
}
