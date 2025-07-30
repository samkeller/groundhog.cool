import WithEnergy from "../../game/entities/types/IsWithEnergy";

export default function isWithEnergy(object: any): object is WithEnergy {
    return 'energy' in object;
}