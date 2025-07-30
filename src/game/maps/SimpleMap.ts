import perlin from "perlin-noise"
import { TMap, TTile } from "../../types/TMap";
import Tree from "../entities/Tree";
import { Assets } from "pixi.js";
import { MOUNTAIN_HEIGHT, TILE_SIZE, WATER_HEIGHT } from "./TerrainVariables";
import Burrow from "../entities/Burrow";

export default (async (): Promise<TMap> => {
    const dataMap: TMap = []
    const WIDTH = 1920
    const HEIGHT = 1088

    const gridWidth = WIDTH / TILE_SIZE
    const gridHeight = HEIGHT / TILE_SIZE

    const per = perlin.generatePerlinNoise(gridWidth, gridHeight)

    // Draw 1 - Terrain
    for (let y = 0; y < gridHeight; y++) {
        dataMap.push([])
        for (let x = 0; x < gridWidth; x++) {
            const height = per[y * gridWidth + x]
            const cellData: TTile = {
                height: height,
                walkable: height > WATER_HEIGHT && height < MOUNTAIN_HEIGHT,
                position: { x, y },
                element: null
            }
            dataMap[y][x] = cellData
        }
    }

    const dataMapWithObjects = await addObjects(gridHeight, gridWidth, dataMap);

    return dataMapWithObjects
})

async function addObjects(gridHeight: number, gridWidth: number, dataMap: TMap): Promise<TMap> {
    let dataMapCp: TMap = [...dataMap]
    const appleTreeTexture = await Assets.load("assets/images/apple_tree.png");
    const burrowTexture = await Assets.load("assets/images/burrow.png");

    let burrowPlaced = false

    const [minCenterY, maxCenterY, minCenterX, maxCenterX] = [
        Math.floor(gridHeight / 2 - 5),
        Math.floor(gridHeight / 2 + 5),
        Math.floor(gridWidth / 2 - 5),
        Math.floor(gridWidth / 2 + 5),
    ];

    // Draw 2 - Elements
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {

            const tile = dataMapCp[y][x];
            // Que les tiles d'herbe
            if (tile.height > WATER_HEIGHT && tile.height < MOUNTAIN_HEIGHT) {
                if (y > minCenterY &&
                    y < maxCenterY &&
                    x > minCenterX &&
                    x < maxCenterX &&
                    Math.random() < 0.10 &&
                    !burrowPlaced) {
                    tile.element = new Burrow(burrowTexture, {
                        x: tile.position.x * TILE_SIZE,
                        y: tile.position.y * TILE_SIZE
                    });
                    burrowPlaced = true;
                }

                if (Math.random() < 0.05) {
                    tile.element = new Tree(appleTreeTexture, {
                        x: tile.position.x * TILE_SIZE,
                        y: tile.position.y * TILE_SIZE
                    });
                }
            }
        }
    }

    // pas réussi à ajouter le départ: restart

    if (!burrowPlaced) {
        dataMapCp = await addObjects(gridHeight, gridWidth, dataMap)
    }

    return dataMapCp;
}
