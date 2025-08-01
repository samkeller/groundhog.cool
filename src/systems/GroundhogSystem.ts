import { ECS, Entity } from "../ECS";
import GroundhogTagComponent from "../components/tags/GroundhogTagComponent";
import EnergyComponent from "../components/EnergyComponent";
import MoveIntentComponent from "../components/intents/MoveIntentComponent";
import BurrowHomeComponent from "../components/relations/BurrowHomeComponent";
import MoveToIntentComponent from "../components/intents/MoveToIntentComponent";
import CanMoveComponent from "../components/CanMoveComponent";
import VisionComponent from "../components/VisionComponent";
import TreeTagComponent from "../components/tags/TreeTagComponent";
import PositionComponent from "../components/PositionComponent";
import FoodStockComponent from "../components/FoodStockComponent";
import { positionsAreEqual } from "../utils/PathUtils";
import { BarComponent } from "../components/BarComponent";

export default function GroundhogSystem(ecs: ECS) {
    const groundhogs: Entity[] = ecs.getEntitiesWith(GroundhogTagComponent);

    lookup: for (const e of groundhogs) {
        const energyComponent = ecs.getComponent(e, EnergyComponent)!;
        const foodStockComponent = ecs.getComponent(e, FoodStockComponent)!;
        const burrowHomeEntity = ecs.getComponent(e, BurrowHomeComponent)?.burrow!;
        const burrowHomePosition = ecs.getComponent(burrowHomeEntity, PositionComponent)!;
        const canMoveComponent = ecs.getComponent(e, CanMoveComponent)!;
        const positionComponent = ecs.getComponent(e, PositionComponent)!;
        const moveToIntentComponent = ecs.getComponent(e, MoveToIntentComponent);

        const speed = energyComponent.energy / 100;
        const wantToStockFood = foodStockComponent.amount >= foodStockComponent.amountMax * 0.50
        if (foodStockComponent.amount > 0) {
            console.log(foodStockComponent.amount + " de stock de bouffe", wantToStockFood)
        }
        if (
            !positionsAreEqual(positionComponent, burrowHomePosition) &&
            (
                !moveToIntentComponent ||
                moveToIntentComponent?.target !== burrowHomePosition
            ) &&
            (
                energyComponent.energy < 10 || // 1. Plus d'énergie
                wantToStockFood // 2. Inventaire plein
            )
        ) { // Fatigue -> Rentre à la base
            logger(e, `Je veux retourner à la maison pour 
                ${wantToStockFood ? "stocker de la nourriture " : ""}
                ${energyComponent.energy < 10 ? "me reposer " : ""}
                !`)
            // Si déjà une activité en cours -> arrête
            ecs.removeComponent(e, MoveToIntentComponent)
            ecs.addComponent(e, new MoveToIntentComponent(burrowHomePosition))
            continue;
        }

        if (
            positionsAreEqual(positionComponent, burrowHomePosition) &&
            wantToStockFood
        ) {
            // Déposer la nourriture dans le terrier
            logger(e, `Je suis au terrier, je vide !`)

            const burrowFoodStock = ecs.getComponent(burrowHomeEntity, FoodStockComponent)!;
            burrowFoodStock.amount += foodStockComponent.amount;
            foodStockComponent.amount = 0;
            continue;
        }

        if (!moveToIntentComponent) { // Cherche un arbre
            const visionComponent = ecs.getComponent(e, VisionComponent)!;
            for (const targetId of visionComponent.visibles) {
                const isTreeComponent = ecs.getComponent(targetId, TreeTagComponent);
                if (isTreeComponent) {
                    const treePositionComponent = ecs.getComponent(targetId, PositionComponent)!;

                    const isAlreadyOnOtherTree = visionComponent.visibles.some(v => {
                        const isTreeComponent = ecs.getComponent(v, TreeTagComponent);
                        if (!isTreeComponent) return false;
                        const tempTreePositionComponent = ecs.getComponent(v, PositionComponent)!;

                        return positionsAreEqual(positionComponent, tempTreePositionComponent)
                    })

                    const treeFoodStock = ecs.getComponent(targetId, FoodStockComponent)!
                    if (
                        !positionsAreEqual(positionComponent, treePositionComponent) &&
                        !isAlreadyOnOtherTree
                    ) {

                        logger(e, `J'ai trouvé un arbre en [x:${treePositionComponent.x}, y${treePositionComponent.y}, j'y go !]`)
                        ecs.addComponent(e, new MoveToIntentComponent({ ...treePositionComponent }));
                        continue lookup;
                    } else if (
                        positionsAreEqual(positionComponent, treePositionComponent)
                    ) {
                        logger(e, `Je suis dans l'arbre, je récolte !`);

                        const foodToCollect = Math.min(
                            treeFoodStock.amount,
                            foodStockComponent.amountMax - foodStockComponent.amount
                        );
                        treeFoodStock.amount -= foodToCollect;
                        foodStockComponent.amount += foodToCollect;

                        // Log the updated food stock for debugging
                        logger(e, `Nourriture récoltée: ${foodToCollect}, Stock actuel: ${foodStockComponent.amount}`);
                        continue lookup; // Quitte la boucle principale après récolte
                    }
                    // console.log("on devrait pas être la ?",
                    //     positionsAreEqual(positionComponent, treePositionComponent),
                    //     treeFoodStock.amount < treeFoodStock.amountMax

                    // )
                    continue lookup; // Quitte la boucle principale après avoir trouvé un arbre valide
                }
            }
        }

        if (Math.random() < 0.5) { // Random déplacements
            // TODO - MoveUtils.findValidDirection()
            const newDirection = (canMoveComponent.direction + Math.random() * 20 - 10) % 360;
            ecs.addComponent(e, new MoveIntentComponent(speed, newDirection))
            continue;

        }

        const barComponent = ecs.getComponent(e, BarComponent)!; // Récupère la seule barre de l'entité
        barComponent.value = energyComponent.energy; // Met à jour la barre d'énergie

        // Si l'énergie n'est pas au maximum et qu'il y a de la nourriture
        const FOOD_ENERGY_MULTIPLIER = 5;
        const missingEnergy = energyComponent.maxEnergy - energyComponent.energy;
        if (
            energyComponent.energy < energyComponent.maxEnergy / 2 &&
            foodStockComponent.amount > 0 &&
            foodStockComponent.amount * FOOD_ENERGY_MULTIPLIER > missingEnergy
        ) {

            // Calculer la quantité de nourriture nécessaire pour restaurer l'énergie manquante
            const foodNeeded = Math.min(
                foodStockComponent.amount,
                Math.ceil(missingEnergy / FOOD_ENERGY_MULTIPLIER)
            );
            const energyToRestore = foodNeeded * FOOD_ENERGY_MULTIPLIER;
            logger(e, `Je mange ${foodNeeded} de nourritures (${energyComponent} d'énergie)`)

            // Consommer la nourriture et restaurer l'énergie
            foodStockComponent.amount -= foodNeeded;
            energyComponent.energy += energyToRestore;
            if (energyComponent.energy > energyComponent.maxEnergy) {
                energyComponent.energy = energyComponent.maxEnergy;
            }
        }
    }

    function handleGroundhogSeeTree() {

    }
    function logger(e: Entity, action: string) {
        console.log(`GroundHogSystem - e:${e} - ${action}`)
    }
}
