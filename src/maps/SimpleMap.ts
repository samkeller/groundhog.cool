import perlin from "perlin-noise"
import { TMap, TTile } from "../types/TMap";
import { Assets } from "pixi.js";
import { MOUNTAIN_HEIGHT, TILE_SIZE, WATER_HEIGHT } from "./TerrainVariables";
import { ECS } from "../ECS";
import { createBurrow } from "../factories/BurrowFactory";
import { createTree } from "../factories/TreeFactory";

export default (async (): Promise<[ECS, TMap]> => {
    const dataMap: TMap = []
    const ecs = new ECS()
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
                component: null
            }
            dataMap[y][x] = cellData
        }
    }

    const dataMapWithObjects = await addObjects(new ECS(), gridHeight, gridWidth, [...dataMap]);

    console.log(`[SimpleMap.ts] DataMap created, size=[width:${gridWidth}, height:${gridHeight}]`)
    return [ecs, dataMapWithObjects]
})

async function addObjects(ecs: ECS, gridHeight: number, gridWidth: number, dataMap: TMap): Promise<TMap> {
    const appleTreeTexture = await Assets.load("assets/images/apple_tree.png");
    const burrowTexture = await Assets.load("assets/images/burrow.png");

    let burrowPlaced = false

    const [minCenterY, maxCenterY, minCenterX, maxCenterX] = [
        Math.floor(gridHeight / 2 - 5),
        Math.floor(gridHeight / 2 + 5),
        Math.floor(gridWidth / 2 - 5),
        Math.floor(gridWidth / 2 + 5),
    ];

    const treePer = perlin.generatePerlinNoise(gridWidth, gridHeight)

    // Draw 2 - Elements
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {

            const tile = dataMap[y][x];
            // Que les tiles d'herbe
            if (tile.height > WATER_HEIGHT && tile.height < MOUNTAIN_HEIGHT) {
                if (y > minCenterY &&
                    y < maxCenterY &&
                    x > minCenterX &&
                    x < maxCenterX &&
                    Math.random() < 0.10 &&
                    !burrowPlaced) {
                    tile.component = createBurrow(ecs,
                        {
                            x: x * TILE_SIZE,
                            y: y * TILE_SIZE
                        },
                        burrowTexture
                    )
                    burrowPlaced = true;
                    break;
                }
                const treePerCell = treePer[y * gridWidth + x]

                if (
                    treePerCell > 0.85 ||
                    (
                        treePerCell > 0.6 &&
                        tile.height > WATER_HEIGHT + 0.1 &&
                        tile.height < MOUNTAIN_HEIGHT - 0.1
                    ) ||
                    Math.random() > 0.99
                ) {
                    tile.component = createTree(ecs,
                        {
                            x: tile.position.x * TILE_SIZE,
                            y: tile.position.y * TILE_SIZE
                        },
                        appleTreeTexture)
                }
            }
        }
    }

    // pas réussi à ajouter le départ: restart

    if (!burrowPlaced) {
        dataMap = await addObjects(ecs, gridHeight, gridWidth, dataMap)
    }

    return dataMap;
}
