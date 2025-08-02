import { Container, Graphics, GraphicsContext, Sprite } from "pixi.js";
import { BarComponent } from "../components/BarComponent";
import PositionComponent from "../components/PositionComponent";
import { ECS } from "../ECS";
import DrawableComponent from "../components/DrawableComponent";
import { TILE_SIZE } from "../maps/TerrainVariables";
import { getEntityContainer } from "../utils/DrawUtils";
import TickContext from "../components/context/TickContext";

const BAR_WIDTH = TILE_SIZE * 0.6
const BAR_HEIGHT = 2

export default function BarRenderSystem(ecs: ECS, objectContainer: Container, context: TickContext) {
    const entities = ecs.getEntitiesWith(BarComponent, PositionComponent, DrawableComponent);
    for (const e of entities) {
        const bar = ecs.getComponent(e, BarComponent)!
        const entityContainer = getEntityContainer(objectContainer, e);

        const BG_LABEL = `entity-${e}-BAR-BG`
        const FG_LABEL = `entity-${e}-BAR-FG`
        const ICON_LABEL = `entity-${e}-BAR-ICON`

        // Vérifie si les barres existent déjà
        let iconChild = entityContainer.getChildByLabel(ICON_LABEL) as Graphics;
        let bgChild = entityContainer.getChildByLabel(BG_LABEL) as Graphics;
        let fgChild = entityContainer.getChildByLabel(FG_LABEL) as Graphics;

        if (!iconChild) {
            const iconGraphicsContext = bar.type === "energy" ?
                context.assets.icons.bolt :
                context.assets.icons.apple

            const graphics = new Graphics(iconGraphicsContext);

            graphics.width = BAR_HEIGHT
            graphics.height = BAR_HEIGHT
            graphics.position.x = -8
            graphics.position.y = -BAR_WIDTH - 0.5
            graphics.label = ICON_LABEL

            entityContainer.addChild(graphics);
        }

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
            .fill(bar.color);
    };

}
