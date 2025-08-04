import { GameAssets } from "../utils/AssetLoader";
import { GraphicsContext, Texture } from "pixi.js";

/**
 * Service dédié à la gestion des assets (textures, icônes, sons).
 */
export class AssetService {
    constructor(public assets: GameAssets) {}

    /**
     * Récupère une texture par nom.
     */
    getTexture(name: keyof GameAssets): Texture {
        const texture = this.assets[name];
        if (!texture || !(texture instanceof Texture)) {
            throw new Error(`Texture '${name}' not found or invalid`);
        }
        return texture;
    }

    /**
     * Récupère une icône par nom.
     */
    getIcon(name: keyof GameAssets['icons']): GraphicsContext {
        const icon = this.assets.icons[name];
        if (!icon) {
            throw new Error(`Icon '${name}' not found`);
        }
        return icon;
    }

}
