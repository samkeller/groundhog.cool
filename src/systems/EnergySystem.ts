import { BarComponent } from "../components/BarComponent";
import CanMoveComponent from "../components/CanMoveComponent";
import EnergyComponent from "../components/EnergyComponent";
import FoodStockComponent from "../components/FoodStockComponent";
import { ECS } from "../ECS";

/**
 * 1 de food = 5 d'énergie
 */
const FOOD_ENERGY_MULTIPLIER = 5;

export default function EnergySystem(ecs: ECS) {
    const entities = ecs.getEntitiesWith(EnergyComponent, CanMoveComponent, FoodStockComponent);

    for (const e of entities) {
        const energyComponent = ecs.getComponent(e, EnergyComponent)!
        const foodStockComponent = ecs.getComponent(e, FoodStockComponent)!

        // X. Si l'énergie n'est pas au maximum et qu'il y a de la nourriture
        const missingEnergy = energyComponent.maxEnergy - energyComponent.energy;

        // On mange si
        // 1. On est à -50% d'énergie
        // 2. On a de la nourriture en stock
        if (
            energyComponent.energy < energyComponent.maxEnergy / 2 &&
            foodStockComponent.amount > 0
        ) {

            // Calculer la quantité de nourriture nécessaire pour restaurer l'énergie manquante
            const foodNeeded = Math.min(
                foodStockComponent.amount,
                Math.ceil(missingEnergy / FOOD_ENERGY_MULTIPLIER)
            );
            if (foodNeeded > 0) {
                const energyToRestore = foodNeeded * FOOD_ENERGY_MULTIPLIER;

                // Consommer la nourriture et restaurer l'énergie
                foodStockComponent.amount -= foodNeeded;
                energyComponent.energy += energyToRestore;

            }
        }

        // Met à jour la barre d'énergie
        const barComponent = ecs.getComponent(e, BarComponent)!
        if (
            barComponent &&
            barComponent.type === "energy" &&
            barComponent.value !== energyComponent.energy
        )
            barComponent.value = energyComponent.energy;
    }

}
