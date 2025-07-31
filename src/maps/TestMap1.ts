import { TMap, TTile } from "../types/TMap";
import { Assets } from "pixi.js";
import { TILE_SIZE } from "./TerrainVariables";
import { ECS } from "../ECS";
import { createBurrow } from "../factories/BurrowFactory";
import { createTree } from "../factories/TreeFactory";

export default async function getTestMap(): Promise<[ECS, TMap]> {
    const ecs = new ECS();
    const WIDTH = 15;
    const HEIGHT = 15;
    const dataMap: TMap = [];

    const appleTreeTexture = await Assets.load("assets/images/apple_tree.png");
    const burrowTexture = await Assets.load("assets/images/burrow.png");

    for (let y = 0; y < HEIGHT; y++) {
        dataMap[y] = [];
        for (let x = 0; x < WIDTH; x++) {
            // Par défaut, tout est "herbe" walkable
            const cellData: TTile = {
                height: 0.5, // milieu
                walkable: true,
                position: { x, y },
                component: null
            };
            // Mur vertical au centre
            if (x === Math.floor(WIDTH / 2) &&
                (y < 13 && y > 2)
            ) {
                cellData.walkable = false;
                cellData.height = 1; // montagne
            }
            dataMap[y][x] = cellData;
        }
    }

    // Terrier à gauche
    const burrowX = 2, burrowY = Math.floor(HEIGHT / 2);
    dataMap[burrowY][burrowX].component = createBurrow(ecs, {
        x: burrowX * TILE_SIZE + TILE_SIZE / 2,
        y: burrowY * TILE_SIZE + TILE_SIZE / 2
    }, burrowTexture);

    // Arbre à droite
    const treeX = WIDTH - 3, treeY = Math.floor(HEIGHT / 2);
    dataMap[treeY][treeX].component = createTree(ecs, {
        x: treeX * TILE_SIZE + TILE_SIZE / 2,
        y: treeY * TILE_SIZE + TILE_SIZE / 2
    }, appleTreeTexture);

    return [ecs, dataMap];
}
