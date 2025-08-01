import { Container, Graphics, GraphicsContext } from "pixi.js";
import { BarComponent } from "../components/BarComponent";
import PositionComponent from "../components/PositionComponent";
import { ECS } from "../ECS";
import DrawableComponent from "../components/DrawableComponent";
import { TILE_SIZE } from "../maps/TerrainVariables";
import { getEntityContainer } from "../utils/DrawUtils";

const BAR_WIDTH = TILE_SIZE * 0.6
const BAR_HEIGHT = 2

export default function BarRenderSystem(ecs: ECS, objectContainer: Container) {
    const entities = ecs.getEntitiesWith(BarComponent, PositionComponent, DrawableComponent);
    for (const e of entities) {
        const bar = ecs.getComponent(e, BarComponent)!
        const entityContainer = getEntityContainer(objectContainer, e);

        const BG_LABEL = `entity-${e}-BAR-BG`
        const FG_LABEL = `entity-${e}-BAR-FG`

        // Vérifie si les barres existent déjà
        let bgChild = entityContainer.getChildByLabel(BG_LABEL) as Graphics;
        let fgChild = entityContainer.getChildByLabel(FG_LABEL) as Graphics;

        if (!bgChild) {
            bgChild = new Graphics();
            bgChild.label = BG_LABEL;
            bgChild.rect(-BAR_WIDTH / 2, -10, BAR_WIDTH, BAR_HEIGHT).fill(0x808080);
            entityContainer.addChild(bgChild);
        }

        if (!fgChild) {
            fgChild = new Graphics();
            fgChild.label = FG_LABEL;
            entityContainer.addChild(fgChild);
        }

        const percentage = bar.getPercentage();

        // Mets à jour les dimensions et la couleur de la barre de premier plan
        fgChild.clear();
        fgChild
            .rect(
                -BAR_WIDTH / 2,
                -10,
                (percentage / 100) * BAR_WIDTH,
                BAR_HEIGHT
            )
            .fill(parseInt(bar.color.replace("#", "0x"), 16));
    };

}
