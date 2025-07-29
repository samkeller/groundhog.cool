export function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
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