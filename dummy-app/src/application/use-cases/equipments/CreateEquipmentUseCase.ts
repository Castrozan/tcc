// application/use-case/CreateEquipmentUseCase.ts

import { CreateEquipmentDto } from 'application/dtos/equipments/CreateEquipmentDto';
import { Equipment } from 'domain/entities/equipments/Equipment';
import { IEquipmentRepository } from 'domain/interfaces/equipments/IEquipmentRepository';

export class CreateEquipmentUseCase {
    constructor(private equipmentRepository: IEquipmentRepository) {}

    async execute(dto: CreateEquipmentDto): Promise<Equipment> {
        if (!dto) {
            throw new Error('Equipment not found');
        }

        return this.equipmentRepository.create(dto);
    }
}
