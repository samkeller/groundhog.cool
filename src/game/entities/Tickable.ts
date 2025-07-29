import TTickContext from "../../types/TTickContext";
import { TTickIntent } from "../../types/TTickIntent";

export default abstract class Tickable {
    abstract doTick(context: TTickContext):TTickIntent
}