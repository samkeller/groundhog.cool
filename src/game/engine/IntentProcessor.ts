import { Assets } from "pixi.js";
import TGameState from "../../types/TGameState";
import { MoveIntent, SpawnIntent, TTickIntent } from "../../types/TTickIntent";
import Groundhog from "../entities/Groundhog";
import Tickable from "../entities/Tickable";

export default class IntentProcessor {
    public async apply(state: TGameState, intent: TTickIntent, source: Tickable) {
        switch (intent.type) {
            case "spawn":
                return this.handleSpawn(state, intent);
            case "move":
                return this.handleMove(state, intent, source);
            case "none":
            default:
                break;
        }
    }

    private async handleSpawn(state: TGameState, intent: SpawnIntent) {
        const spawnCosts = {
            groundhog: 20
        };

        const prefab = intent.prefab;
        const cost = spawnCosts[prefab];
        const player = state.player;

        if (player.food < cost) {
            console.warn(`Not enough food to spawn ${prefab}`);
            return;
        }
        player.food -= cost;

        const prefabRegistry = {
            groundhog: async () => {
                const texture = await Assets.load("assets/images/groundhog.png");
                return new Groundhog(texture);
            },
        };


        const newEntity = await prefabRegistry[prefab]();

        newEntity.position = intent.position;

        newEntity.draw(state.container);
        state.tickers.push(newEntity);
        // autres effets éventuels : log, événement, limitation de population, etc.
    }
    private async handleMove(state: TGameState, intent: MoveIntent, source: Tickable) {
        intent.object.rotation = intent.direction;
        intent.object.speed = intent.speed;
        intent.object.draw(state.container)
    }

}
