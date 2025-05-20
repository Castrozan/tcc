import { UpdateEquipmentDto } from 'application/dtos/equipments/UpdateEquipmentDto';
import { Equipment } from 'domain/entities/equipments/Equipment';
import { IEquipmentRepository } from 'domain/interfaces/equipments/IEquipmentRepository';

export class UpdateEquipmentUseCase {
    constructor(private equipmentRepository: IEquipmentRepository) {}

    async execute(dto: UpdateEquipmentDto): Promise<Equipment> {
        return this.equipmentRepository.update(dto);
    }
}
