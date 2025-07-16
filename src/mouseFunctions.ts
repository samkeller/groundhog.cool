import { Container } from "pixi.js";

let lastScrollTop = 0
const MIN_SCALE = 0.2;
const MAX_SCALE = 4;

//////////////////////////////////////////
//                SCROLL                //
//////////////////////////////////////////
const onScrollFn = (e: WheelEvent, container: Container) => {
    e.preventDefault();
    if (!container) return;

    const mousePos = { x: e.clientX, y: e.clientY };
    const beforeZoom = container.toLocal(mousePos);

    // Utilise deltaY pour déterminer le zoom
    let scale = container.scale.x;
    if (e.deltaY < 0) {
        // Molette vers le haut = zoom in
        scale *= 1.1;
    } else {
        // Molette vers le bas = zoom out
        scale /= 1.1;
    }
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
    container.scale.set(scale);

    const afterZoom = container.toLocal(mousePos);

    container.x += (afterZoom.x - beforeZoom.x) * container.scale.x;
    container.y += (afterZoom.y - beforeZoom.y) * container.scale.y


}

//////////////////////////////////////////
//                PANNING               //
//////////////////////////////////////////

let isDragging = false;
let lastMousePosition = { x: 0, y: 0 };

const onMouseDownFn = (e: MouseEvent) => {
    e.preventDefault();
    isDragging = true;
    lastMousePosition = { x: e.clientX, y: e.clientY };
};

const onMouseMoveFn = (e: MouseEvent, container: Container) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePosition.x;
    const dy = e.clientY - lastMousePosition.y;
    container.x += dx;
    container.y += dy;
    lastMousePosition = { x: e.clientX, y: e.clientY };
};

const onMouseUpFn = (e: MouseEvent, container: Container) => isDragging = false;


export { onScrollFn, onMouseDownFn, onMouseMoveFn, onMouseUpFn }