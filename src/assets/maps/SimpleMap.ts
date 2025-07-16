import { Assets, Spritesheet } from "pixi.js";

import spritesJSON from "../images/sprites.json"
import { CompositeTilemap, Tilemap } from "@pixi/tilemap";
import perlin from "perlin-noise"

export default (async () => {
    const tileSize = 16
    const WIDTH = 1920
    const HEIGHT = 1080

    const tilemap = new CompositeTilemap();

    const sheetImage = await Assets.load("assets/images/sprites.png");
    const spritesheet = new Spritesheet(
        sheetImage,
        spritesJSON
    );
    await spritesheet.parse();

    const [
        water,
        grass,
        moutain
    ] = [
            spritesheet.textures['water.png'],
            spritesheet.textures['grass.png'],
            spritesheet.textures['mountain.png']
        ]

    const per = perlin.generatePerlinNoise(WIDTH, HEIGHT)

    for (let y = 0; y < HEIGHT / tileSize; y++) {
        for (let x = 0; x < WIDTH / tileSize; x++) {
            const height = per[y * WIDTH + x]

            if (height <= 0.4) {
                tilemap.tile(water, x * tileSize, y * tileSize);
            } else if (height > 0.4 && height < 0.8) {
                tilemap.tile(grass, x * tileSize, y * tileSize);
            }
            else {
                tilemap.tile(moutain, x * tileSize, y * tileSize);
            }
        }
    }

    return tilemap
})