import Tickable from "../game/entities/Tickable";
import Player from "../game/Player";
import { TMap } from "./TMap";

export default interface TTickContext{
    map: TMap,
    owner: Player,
    tickers: Tickable[],
}