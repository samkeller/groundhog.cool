import { TileMap, Tile } from "../types/TileMap";
import { GameAssets } from "../utils/AssetLoader";
import { ECS } from "../ECS";
import { createBurrow } from "../factories/BurrowFactory";
import { createTree } from "../factories/TreeFactory";
import { tileToPixel } from "../utils/PositionUtils";

export default async function getTestMap(assets: GameAssets): Promise<[ECS, TileMap]> {
    const ecs = new ECS();
    const WIDTH = 15;
    const HEIGHT = 15;
    const dataMap: TileMap = [];

    for (let y = 0; y < HEIGHT; y++) {
        dataMap[y] = [];
        for (let x = 0; x < WIDTH; x++) {
            // Par défaut, tout est "herbe" walkable
            const cellData: Tile = {
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
    dataMap[burrowY][burrowX].component = createBurrow(
        ecs,
        tileToPixel({ x: burrowX, y: burrowY }),
        assets.burrow
    );

    // Arbre à droite
    const treeX = WIDTH - 3, treeY = Math.floor(HEIGHT / 2);
    dataMap[treeY][treeX].component = createTree(
        ecs,
        tileToPixel({ x: treeX, y: treeY }),
        assets.appleTree
    );

    return [ecs, dataMap];
}
