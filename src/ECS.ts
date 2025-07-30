// Système de base ECS pour le jeu

export type Entity = number;

export interface Component {
    // Marqueur de composant
}

export class ECS {
    private nextEntityId = 1;
    private components = new Map<string, Map<Entity, Component>>();

    createEntity(): Entity {
        return this.nextEntityId++;
    }

    addComponent<T extends Component>(entity: Entity, component: T): void {
        const name = this.getComponentName(component);
        if (!this.components.has(name)) {
            this.components.set(name, new Map());
        }
        this.components.get(name)!.set(entity, component);
    }

    getComponent<T extends Component>(entity: Entity, componentClass: { new(...args: any[]): T }): T | undefined {
        const name = componentClass.name;
        return this.components.get(name)?.get(entity) as T | undefined;
    }

    getEntitiesWith(...componentClasses: Array<{ new(...args: any[]): Component }>): Entity[] {
        if (componentClasses.length === 0) return [];
        const sets = componentClasses.map(cls => this.components.get(cls.name));
        if (sets.some(s => !s)) return [];
        const [first, ...rest] = sets as Map<Entity, Component>[];
        return Array.from(first.keys()).filter(entity => rest.every(set => set.has(entity)));
    }

    removeComponent<T extends Component>(entity: Entity, componentClass: { new(...args: any[]): T }): void {
        const name = componentClass.name;
        this.components.get(name)?.delete(entity);
    }

    private getComponentName(component: Component): string {
        return component.constructor.name;
    }
}
