import { Assets, Spritesheet } from "pixi.js";
import spritesJSON from "../../assets/images/sprites.json"
import { TMap } from "../../types/TMap";
import { CompositeTilemap } from "@pixi/tilemap";

export default (async (map: TMap) => {
    const tileSize = 16

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

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const cellData = map[y][x];
            if (cellData.height <= 0.4) {
                tilemap.tile(water, x * tileSize, y * tileSize);
            } else if (cellData.height > 0.4 && cellData.height < 0.8) {
                tilemap.tile(grass, x * tileSize, y * tileSize);
            }
            else {
                tilemap.tile(moutain, x * tileSize, y * tileSize);
            }
        }
    }

    return tilemap
})