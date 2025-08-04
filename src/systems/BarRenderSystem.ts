import { Container, Graphics } from "pixi.js";
import { ECS } from "../ECS";
import { TILE_SIZE } from "../maps/TerrainVariables";
import { BarComponent } from "../components/BarComponent";
import CooldownComponent from "../components/CooldownComponent";
import PositionComponent from "../components/PositionComponent";
import DrawableComponent from "../components/DrawableComponent";
import { AssetService } from "../services/AssetService";
import { ContainerService } from "../services/ContainerService";

const BAR_WIDTH = TILE_SIZE * 0.6;
const BAR_HEIGHT = 2;
const ICON_SIZE = BAR_HEIGHT;
const SPACING = 2;
const CHILD_LABELS = {
    foreground: "foreground",
    cooldown: "cooldown"
}

export default function BarRenderSystem(
    ecs: ECS,
    containerService: ContainerService,
    assetsService: AssetService
) {
    const entities = ecs.getEntitiesWith(BarComponent, PositionComponent, DrawableComponent);
    
    for (const e of entities) {
        const bar = ecs.getComponent(e, BarComponent)!;

        const entityContainer = containerService.getEntityContainer(e);

        const GROUP_LABEL = `entity-${e}-BAR-GROUP`;
        let group = entityContainer.getChildByLabel(GROUP_LABEL) as Container;

        if (!group) {
            group = createBarGroup(e, bar, assetsService)
            entityContainer.addChild(group);
        }


        // Mise à jour de la barre de foreground
        const fg = group.getChildByLabel(CHILD_LABELS.foreground) as Graphics;
        const percentage = bar.getPercentage();
        fg.clear()
            .rect(0, 0, (percentage / 100) * BAR_WIDTH, BAR_HEIGHT)
            .fill(bar.color);

        // Mise à jour du cooldown

        const cdComponent = ecs.getComponent(e, CooldownComponent);
        const cooldown = group.getChildByLabel(CHILD_LABELS.cooldown) as Graphics;

        if (cdComponent) {
            const cooldownRatio = cdComponent.remainingTime / cdComponent.initialTime;
            cooldown.visible = true;

            cooldown
                .clear()
                .rect(0, 0, cooldownRatio * BAR_WIDTH, 0.5)
                .fill(0x9999ff);

        } else {
            cooldown.visible = false;
        }

    }

    function createBarGroup(e: number, bar: BarComponent, assetsService: AssetService): Container {
        const drawable = ecs.getComponent(e, DrawableComponent)!;

        const group = new Container();
        group.position.set(-drawable.sprite.width / 2, -TILE_SIZE * 0.5); // position fixe au-dessus de l'entité

        group.label = `entity-${e}-BAR-GROUP`;

        // Utilisation du service assets pour récupérer les icônes
        const iconGraphicsContext = bar.type === "energy"
            ? assetsService.getIcon('bolt')
            : assetsService.getIcon('apple');

        const icon = new Graphics(iconGraphicsContext);
        icon.label = "icon";
        icon.width = ICON_SIZE;
        icon.height = ICON_SIZE;
        icon.position.set(0, 0);
        group.addChild(icon);

        const barX = ICON_SIZE + SPACING;

        // Barre de fond
        const bg = new Graphics()
            .rect(0, 0, BAR_WIDTH, BAR_HEIGHT)
            .fill(0x808080);
        bg.label = "bg";
        bg.position.set(barX, 0);
        group.addChild(bg);

        // Barre de foreground (initialisée vide, mais avec couleur)
        const fg = new Graphics()
            .rect(0, 0, 0, BAR_HEIGHT) // vide au début
            .fill(bar.color);
        fg.label = CHILD_LABELS.foreground;
        fg.position.set(barX, 0);
        group.addChild(fg);

        // Barre de cooldown — placée juste en dessous de la barre principale
        const cooldown = new Graphics();
        cooldown.label = CHILD_LABELS.cooldown;
        cooldown.position.set(barX, BAR_HEIGHT); // 1px sous la barre d’état
        group.addChild(cooldown);

        return group;
    }
}
