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
import CooldownComponent from "../components/CooldownComponent";
import MemoryComponent from "../components/MemoryComponent";

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
        const coolDown = ecs.getComponent(e, CooldownComponent);

        if (coolDown) {
            continue;
        }

        /**
        * Quantité de nourriture à toujours garder sur soi (jamais trop prudent).
        */
        const foodAmountToKeep = foodStockComponent.amountMax * 0.20

        /**
        * A trop de nourriture sur lui.
        */
        const wantToStockFood = foodStockComponent.amount >= foodAmountToKeep;

        // 1. Retourner au terrier
        // 1.1 - Plus d'énergie
        // 1.2 - Trop de nourriture dans le stock
        if (
            !positionsAreEqual(positionComponent, burrowHomePosition) &&
            (
                !moveToIntentComponent ||
                moveToIntentComponent.target !== burrowHomeEntity
            ) &&
            (
                energyComponent.energy < 10 || // 1. Plus d'énergie
                wantToStockFood // 2. Inventaire plein
            )
        ) {
            const reason = energyComponent.energy < 10 ? "fatigue" : "stock"
            logger(e, `Je veux retourner à la maison ! Cause: ${reason}`)
            goToTarget(e, burrowHomeEntity);
            continue;
        }

        if (moveToIntentComponent) {
            const moveToIntentPosition = ecs.getComponent(moveToIntentComponent.target, PositionComponent)!;

            /**
             * X. On voulait arrive quelque part, on y est !
            */
            if (positionsAreEqual(positionComponent, moveToIntentPosition)) {

                if (positionsAreEqual(burrowHomePosition, moveToIntentPosition)) {
                    const burrowHomeFoodStock = ecs.getComponent(burrowHomeEntity, FoodStockComponent)!;

                    if (wantToStockFood) {
                        // position-terrier1. Je stocke le terrier

                        const foodToGive = Math.min(
                            foodStockComponent.amount,
                            burrowHomeFoodStock.amountMax - burrowHomeFoodStock.amount
                        )

                        logger(e, `Je restock le terrier de [${foodToGive}]!`)
                        giveFoodToStock(foodStockComponent, burrowHomeFoodStock, foodToGive);
                        ecs.addComponent(e, new CooldownComponent(100))
                        ecs.removeComponent(e, MoveToIntentComponent)
                        continue;
                    } else if (energyComponent.energy < 10) {
                        // position-terrier2. Je prends de la nourriture
                        const foodToTake = Math.min(
                            foodAmountToKeep,
                            burrowHomeFoodStock.amount,
                            foodStockComponent.amountMax - foodStockComponent.amount
                        )
                        logger(e, `Je prends [${foodToTake}] du terrier!`)
                        giveFoodToStock(burrowHomeFoodStock, foodStockComponent, foodToTake);
                        ecs.addComponent(e, new CooldownComponent(100))
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

                    logger(e, `Je prends [${foodToTake}] de l'arbre !`)

                    // position-terrier3. Je cueille un arbre
                    giveFoodToStock(treeFoodStockComponent, foodStockComponent, foodToTake);
                    ecs.addComponent(e, new CooldownComponent(300))
                    ecs.removeComponent(e, MoveToIntentComponent)
                    continue;
                }

                // Au cas ou
                console.error( ecs, moveToIntentComponent, moveToIntentPosition)
                throw new Error("vers quoi on va en fait ??")

            }
            // Pas encore arrivé.
            continue;
        }

        // X. Cherche un arbre
        const visionComponent = ecs.getComponent(e, VisionComponent)!;
        const memoryComponent = ecs.getComponent(e, MemoryComponent)!;

        const entitiesKnown = new Set([
            ...visionComponent.visibles,
            ...Array.from(memoryComponent.memories.keys()),
        ])

        for (const targetId of entitiesKnown) {
            const isTreeComponent = ecs.getComponent(targetId, TreeTagComponent);
            // Je vois un arbre !
            if (isTreeComponent) {
                const treePositionComponent = ecs.getComponent(targetId, PositionComponent)!;
                const treeFoodStockComponent = ecs.getComponent(targetId, FoodStockComponent)!;

                const foodMissing = foodStockComponent.amountMax - foodStockComponent.amount

                if (
                    !positionsAreEqual(positionComponent, treePositionComponent)
                    && treeFoodStockComponent.amount > foodMissing
                ) {

                    logger(e, `J'ai trouvé un arbre en [x:${treePositionComponent.x}, y:${treePositionComponent.y}], j'y go !`)
                    ecs.addComponent(e, new MoveToIntentComponent(targetId));
                    break; // Pas besoin d'autre chose
                }
            }
        }

        // X. Random déplacements
        if (Math.random() < 0.5) {
            doRandomMove(e, canMoveComponent)
            continue;
        }

    }

    function giveFoodToStock(
        fromStock: FoodStockComponent,
        toStock: FoodStockComponent,
        amount: number
    ) {
        const flooredAmout = Math.floor(amount)
        toStock.amount += flooredAmout;
        fromStock.amount -= flooredAmout;
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
        canMoveComponent: CanMoveComponent
    ) {

        // TODO - MoveUtils.findValidDirection()
        const newDirection = (canMoveComponent.direction + Math.random() * 20 - 10) % 360;
        ecs.addComponent(e, new MoveIntentComponent(newDirection))
    }

    function logger(e: Entity, action: string) {
        console.log(`GroundHogSystem - e:${e} - ${action}`)
    }
}
