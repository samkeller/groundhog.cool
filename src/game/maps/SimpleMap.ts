import perlin from "perlin-noise"
import { TMap, TTile } from "../../types/TMap";

export default (async (): Promise<TMap> => {
    const dataMap: TMap = []
    const tileSize = 16
    const WIDTH = 1920
    const HEIGHT = 1080

    const per = perlin.generatePerlinNoise(WIDTH, HEIGHT)

    for (let y = 0; y < HEIGHT / tileSize; y++) {
        dataMap.push([])
        for (let x = 0; x < WIDTH / tileSize; x++) {
            const cellData: TTile = {
                height: per[y * WIDTH + x],
                position: { x, y }
            }
            dataMap[y][x] = cellData
        }
    }

    return dataMap
})