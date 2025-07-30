import { TMap } from "../../types/TMap";
import Drawable from "../entities/types/Drawable";

export default (async (map: TMap) => {
    const drawables: Drawable[] = []
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const cellData = map[y][x];

            if (cellData.element) {
                drawables.push(cellData.element)
            }
         
        }
    }

    return drawables
})