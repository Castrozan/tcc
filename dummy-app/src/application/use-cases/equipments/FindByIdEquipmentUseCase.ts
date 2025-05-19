import { Equipment } from 'domain/entities/equipments/Equipment';
import { IEquipmentRepository } from 'domain/interfaces/equipments/IEquipmentRepository';

export class FindByIdEquipmentUseCase {
    constructor(private equipmentRepository: IEquipmentRepository) {}

    async execute(id: number): Promise<Equipment | null> {
        return this.equipmentRepository.findById(id);
    }
}
