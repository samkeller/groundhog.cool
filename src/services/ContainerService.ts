import { Container } from "pixi.js";
import { Entity } from "../ECS";

/**
 * Service de gestion des containers PixiJS pour organiser l'affichage.
 * Sépare clairement la carte, les objets et les entités individuelles.
 */
export class ContainerService {
    public rootContainer: Container;
    public mapContainer!: Container;
    public objectsContainer!: Container;
    public entityContainers = new Map<Entity, Container>();

    constructor(rootContainer: Container) {
        this.rootContainer = rootContainer;
        this.initializeContainers();
    }

    /**
     * Initialise la hiérarchie des containers.
     */
    private initializeContainers(): void {
        // Container pour la carte (fond, tuiles)
        this.mapContainer = new Container();
        this.mapContainer.label = "map-layer";
        this.mapContainer.zIndex = 0;
        this.rootContainer.addChild(this.mapContainer);

        // Container pour tous les objets du jeu (entités, UI)
        this.objectsContainer = new Container();
        this.objectsContainer.label = "objects-layer";
        this.objectsContainer.zIndex = 1;
        this.rootContainer.addChild(this.objectsContainer);

        // Assure l'ordre de rendu
        this.rootContainer.sortChildren();
    }

    /**
     * Récupère ou crée le container pour une entité spécifique.
     */
    getEntityContainer(entityId: Entity): Container {
        let container = this.entityContainers.get(entityId);

        if (!container) {
            container = new Container();
            container.label = `entity-${entityId}`;
            this.entityContainers.set(entityId, container);
            this.objectsContainer.addChild(container);
        }

        return container;
    }

    /**
     * Supprime le container d'une entité quand elle est détruite.
     */
    removeEntityContainer(entityId: Entity): void {
        const container = this.entityContainers.get(entityId);
        if (container) {
            this.objectsContainer.removeChild(container);
            container.destroy();
            this.entityContainers.delete(entityId);
        }
    }

    /**
     * Nettoie tous les containers d'entités orphelines.
     * Utile pour le garbage collection.
     */
    cleanupOrphanedContainers(existingEntities: Set<Entity>): void {
        for (const [entityId, container] of this.entityContainers) {
            if (!existingEntities.has(entityId)) {
                this.objectsContainer.removeChild(container);
                container.destroy();
                this.entityContainers.delete(entityId);
            }
        }
    }

}
