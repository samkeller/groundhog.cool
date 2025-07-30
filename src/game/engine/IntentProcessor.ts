import { Assets } from "pixi.js";
import TGameState from "../../types/TGameState";
import { MoveIntent, MoveToIntent, SpawnIntent, TTickIntent } from "../../types/TTickIntent";
import Groundhog from "../entities/Groundhog";
import Tickable from "../entities/types/Tickable";
import MoveUtils, { getNextPosition } from "../../utils/MoveUtils";
import { getSpawnCost } from "../../utils/MathUtils";
import Burrow from "../entities/Burrow";
import { directionBetweenPoints } from "../../utils/PathUtils";
import { TMap } from "../../types/TMap";
import PathfindingUtils from "./PathfindingUtils";
import isWithEnergy from "../../types/Guards/IsWithEnergy";

export default class IntentProcessor {

    private pathFindingUtils: PathfindingUtils;

    constructor(map: TMap) {
        this.pathFindingUtils = new PathfindingUtils(map)
    }

    public async apply(state: TGameState, intent: TTickIntent, source: Tickable) {
        switch (intent.type) {
            case "spawn":
                return this.handleSpawn(state, intent, source);
            case "move":
                return this.handleMove(state, intent, source);
            case "moveTo":
                return this.handleMoveTo(state, intent, source);
            case "none":
            default:
                break;
        }
    }

    private async handleSpawn(state: TGameState, intent: SpawnIntent, source: Tickable) {
        const baseSpawnCosts = {
            groundhog: 10
        };
        // 10 - 20 - 30 - 50 - 80 -

        const prefab = intent.prefab;
        const player = state.player;
        const cost = getSpawnCost(baseSpawnCosts[prefab], player.populationCount);
        if (player.food < cost) {
            return;
        }
        player.food -= cost;
        player.populationCount++;

        const prefabRegistry = {
            groundhog: async () => {
                const texture = await Assets.load("assets/images/groundhog.png");
                return new Groundhog(texture, source as Burrow);
            },
        };


        const newEntity = await prefabRegistry[prefab]();

        newEntity.position = intent.position;

        newEntity.draw(state.container);
        state.tickers.push(newEntity);
    }


    private async handleMove(state: TGameState, intent: MoveIntent, source: Tickable) {
        const map = state.map;
        const { direction, speed } = intent;
        const result = new MoveUtils().findValidDirection(map, intent.object, speed, direction);

        // Mouvement autorisé dans la direction trouvée
        if (!result) {
            throw new Error("cannot find exit")
        }
        intent.object.rotation = result.nextDirection;
        intent.object.position = result.nextPosition;

        if (isWithEnergy(intent.object)) {
            intent.object.energy -= 0.1
        }

        intent.object.draw(state.container);
    }

    private async handleMoveTo(state: TGameState, intent: MoveToIntent, source: Tickable) {
        // direction est une position, il faut calculer l'angle en degrés
        const map = state.map;
        const { toPosition, speed } = intent;
        const fromPosition = intent.object.position;
        const angle = directionBetweenPoints(fromPosition, toPosition);
        const result = new MoveUtils().findValidDirection(map, intent.object, speed, angle);

        if (!result) {
            throw new Error("unable to find path")
        }
        return this.handleMove(state, {
            type: "move",
            direction: result.nextDirection,
            object: intent.object,
            speed: intent.speed
        }, source)
    }

}

