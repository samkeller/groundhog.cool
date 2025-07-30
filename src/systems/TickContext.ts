import { Texture } from "pixi.js";
import { TMap } from "../types/TMap";

export default interface TickContext {
  map: TMap,
  assets: {
    groundhog: Texture
  }
}
