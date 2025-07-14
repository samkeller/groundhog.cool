import { Container } from "pixi.js";

let lastScrollTop = 0
const MIN_SCALE = 0.2;
const MAX_SCALE = 4;


const onScrollFn = (evt: WheelEvent, container: Container) => {
    evt.preventDefault();
    if (!container) return;

    // Utilise deltaY pour déterminer le zoom
    let scale = container.scale.x;
    if (evt.deltaY < 0) {
        // Molette vers le haut = zoom in
        scale *= 1.1;
    } else {
        // Molette vers le bas = zoom out
        scale /= 1.1;
    }
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
    container.scale.set(scale);
}

export { onScrollFn }