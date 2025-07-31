/**
 * Renvoies un nombre entier entre deux autres
 * @param min 
 * @param max 
 * @returns 
 */
export function randomIntFromInterval(min: number, max: number) {
    return Math.floor(randomFloatFromInterval(min, max));
}

/**
 * Renvoies un float entre deux nombres
 * @param min 
 * @param max 
 * @returns 
 */
export function randomFloatFromInterval(min: number, max: number) {
    return Math.random() * (max - min) + min;
}


/**
 * Si on considère que le cout n est la somme de n-1 & n-2.
 * Alors, si on ne possède que le count, on doit recalculer tout. 
 * @param base 
 * @param populationCount 
 * @returns 
 */
export function getSpawnCost(base: number, populationCount: number): number {
    if (populationCount <= 1) return base;
    let a = base, b = base, cost = base;
    for (let i = 2; i <= populationCount; i++) {
        cost = a + b;
        a = b;
        b = cost;
    }
    return cost;
}