import { Spritesheet } from "pixi.js";
import spritesJSON from "../assets/images/sprites.json"
import { TileMap } from "../types/TileMap";
import { CompositeTilemap } from "@pixi/tilemap";
import { MOUNTAIN_HEIGHT, TILE_SIZE, WATER_HEIGHT } from "./TerrainVariables";
import { GameAssets } from "../utils/AssetLoader";

export default (async (map: TileMap, assets: GameAssets) => {
    const tilemap = new CompositeTilemap();

    const spritesheet = new Spritesheet(
        assets.sprites,
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
            if (cellData.height <= WATER_HEIGHT) {
                tilemap.tile(water, x * TILE_SIZE, y * TILE_SIZE);
            } else if (cellData.height > WATER_HEIGHT && cellData.height < MOUNTAIN_HEIGHT) {
                tilemap.tile(grass, x * TILE_SIZE, y * TILE_SIZE);
            }
            else {
                tilemap.tile(moutain, x * TILE_SIZE, y * TILE_SIZE);
            }
        }
    }

    return tilemap
})