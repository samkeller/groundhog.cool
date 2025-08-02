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

const FOOD_ENERGY_MULTIPLIER = 5;

export default function GroundhogSystem(ecs: ECS) {
    const groundhogs: Entity[] = ecs.getEntitiesWith(GroundhogTagComponent);

    for (const e of groundhogs) {
        const energyComponent = ecs.getComponent(e, EnergyComponent)!;
        const foodStockComponent = ecs.getComponent(e, FoodStockComponent)!;
        const burrowHomeEntity = ecs.getComponent(e, BurrowHomeComponent)?.burrow!;
        const burrowHomePosition = ecs.getComponent(burrowHomeEntity, PositionComponent)!;
        const canMoveComponent = ecs.getComponent(e, CanMoveComponent)!;
        const positionComponent = ecs.getComponent(e, PositionComponent)!;
        const moveToIntentComponent = ecs.getComponent(e, MoveToIntentComponent);

        // X. Si l'énergie n'est pas au maximum et qu'il y a de la nourriture
        handleEating(e, energyComponent, foodStockComponent);

        updateEnergyBar(e, energyComponent)

        /**
        * Quantité de nourriture à toujours garder sur soi (jamais trop prudent).
        */
        const foodAmountToKeep = foodStockComponent.amountMax * 0.20

        /**
        * A trop de nourriture sur lui.
        */
        const wantToStockFood = foodStockComponent.amount >= foodAmountToKeep;

        if (foodStockComponent.amount > 0) {
            logger(e, `Actuellement en possession de ${foodStockComponent.amount} nourriture, je ne veux qu'en garder ${foodAmountToKeep}, mon wantToStockFood est donc à ${wantToStockFood}`)
        }
        // 1. Retourner au terrier
        // 1.1 - Plus d'énergie
        // 1.2 - Trop de nourriture dans le stock
        if (
            !positionsAreEqual(positionComponent, burrowHomePosition) &&
            (
                energyComponent.energy < 10 || // 1. Plus d'énergie
                wantToStockFood // 2. Inventaire plein
            )
        ) {
            logger(e, `Je veux retourner à la maison !`)
            goToTarget(e, burrowHomeEntity);
            continue;
        }

        if (moveToIntentComponent) {
            const moveToIntentPosition = ecs.getComponent(moveToIntentComponent.target, PositionComponent)!;

            /**
             * X. On voulait arrive quelque part, on y est !
            */
            if (moveToIntentComponent && positionsAreEqual(positionComponent, moveToIntentPosition)) {

                if (positionsAreEqual(burrowHomePosition, moveToIntentPosition)) {
                    const burrowHomeFoodStock = ecs.getComponent(burrowHomeEntity, FoodStockComponent)!;

                    if (wantToStockFood) {
                        // position-terrier1. Je stocke le terrier

                        const foodToGive = Math.min(
                            foodStockComponent.amount,
                            burrowHomeFoodStock.amountMax - burrowHomeFoodStock.amount
                        )

                        logger(e, `Je restock le terrier de ${foodToGive}!`)
                        giveFoodToStock(foodStockComponent, burrowHomeFoodStock, foodToGive);
                        ecs.removeComponent(e, MoveToIntentComponent)
                        continue;
                    } else {
                        // position-terrier2. Je prends de la nourriture
                        const foodToTake = Math.min(
                            burrowHomeFoodStock.amount,
                            foodStockComponent.amountMax - foodStockComponent.amount
                        )
                        logger(e, `Je mange au terrier ${foodToTake}!`)
                        giveFoodToStock(burrowHomeFoodStock, foodStockComponent, foodToTake);
                        ecs.removeComponent(e, MoveToIntentComponent)
                        continue;
                    }
                }

                const treeTagComponent = ecs.getComponent(moveToIntentComponent.target, TreeTagComponent)

                if (treeTagComponent) {

                    const treeFoodStockComponent = ecs.getComponent(moveToIntentComponent.target, FoodStockComponent)!
                    const foodToTake = Math.min(
                        treeFoodStockComponent.amount,
                        foodStockComponent.amountMax - foodStockComponent.amount
                    )

                    logger(e, `Je colecte l'arbre de ${foodToTake}!`)

                    // position-terrier3. Je cueille un arbre
                    giveFoodToStock(treeFoodStockComponent, foodStockComponent, foodToTake);
                    continue;
                }
                throw new Error("vers quoi on va en fait ??")

            }
            // Pas encore arrivé.
        } else {
            // X. Cherche un arbre
            const visionComponent = ecs.getComponent(e, VisionComponent)!;
            for (const targetId of visionComponent.visibles) {
                const isTreeComponent = ecs.getComponent(targetId, TreeTagComponent);
                // Je vois un arbre !
                if (isTreeComponent) {
                    const treePositionComponent = ecs.getComponent(targetId, PositionComponent)!;

                    if (
                        !positionsAreEqual(positionComponent, treePositionComponent)
                    ) {

                        logger(e, `J'ai trouvé un arbre en [x:${treePositionComponent.x}, y${treePositionComponent.y}, j'y go !]`)
                        ecs.addComponent(e, new MoveToIntentComponent(targetId));
                        break; // Pas besoin d'autre chose
                    }
                }
            }

            // X. Random déplacements
            if (Math.random() < 0.5) {
                doRandomMove(e, energyComponent, canMoveComponent)
                continue;
            }
        }

    }

    function handleEating(
        e: Entity,
        energyComponent: EnergyComponent,
        foodStockComponent: FoodStockComponent,
    ) {
        const missingEnergy = energyComponent.maxEnergy - energyComponent.energy;

        if (energyComponent.energy < energyComponent.maxEnergy / 2 &&
            foodStockComponent.amount > 0 &&
            foodStockComponent.amount * FOOD_ENERGY_MULTIPLIER > missingEnergy) {

            // Calculer la quantité de nourriture nécessaire pour restaurer l'énergie manquante
            const foodNeeded = Math.min(
                foodStockComponent.amount,
                Math.ceil(missingEnergy / FOOD_ENERGY_MULTIPLIER)
            );
            const energyToRestore = foodNeeded * FOOD_ENERGY_MULTIPLIER;
            logger(e, `Je mange ${foodNeeded} de nourritures (${energyComponent} d'énergie)`);

            // Consommer la nourriture et restaurer l'énergie
            foodStockComponent.amount -= foodNeeded;
            energyComponent.energy += energyToRestore;
        }
    }

    function giveFoodToStock(
        fromStock: FoodStockComponent,
        toStock: FoodStockComponent,
        amount: number
    ) {
        toStock.amount += amount;
        fromStock.amount -= amount;
    }

    function goToTarget(
        e: Entity,
        targetEntity: Entity
    ) {
        // Si déjà une activité en cours -> arrête
        ecs.removeComponent(e, MoveToIntentComponent)
        ecs.addComponent(e, new MoveToIntentComponent(targetEntity))
    }

    function doRandomMove(
        e: Entity,
        energyComponent: EnergyComponent,
        canMoveComponent: CanMoveComponent
    ) {
        const speed = energyComponent.energy / 100;

        // TODO - MoveUtils.findValidDirection()
        const newDirection = (canMoveComponent.direction + Math.random() * 20 - 10) % 360;
        ecs.addComponent(e, new MoveIntentComponent(speed, newDirection))
    }

    function updateEnergyBar(
        e: Entity,
        energyComponent: EnergyComponent
    ) {
        const barComponent = ecs.getComponent(e, BarComponent)!; // Récupère la seule barre de l'entité
        barComponent.value = energyComponent.energy; // Met à jour la barre d'énergie
    }
    function logger(e: Entity, action: string) {
        console.log(`GroundHogSystem - e:${e} - ${action}`)
    }
}
