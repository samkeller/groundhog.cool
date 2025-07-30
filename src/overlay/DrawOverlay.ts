import { Application, Container, Renderer, Text } from "pixi.js";

let overlayContainer: Container | null = null;
const playerInfoText = new Text();

export default function DrawOverlay(
    app: Application<Renderer>,
) {
    // Si l'overlay n'existe pas, on le crée et on l'ajoute à la scène
    if (!overlayContainer) {
        overlayContainer = new Container();
        overlayContainer.label = "overlay";
        overlayContainer.width = app.screen.width;
        overlayContainer.height = app.screen.height;
        overlayContainer.addChild(playerInfoText);
        app.stage.addChild(overlayContainer);
    }

    // Met à jour le texte à chaque frame
    playerInfoText.text = `Food: `;
}