import { IEquipmentRepository } from 'domain/interfaces/equipments/IEquipmentRepository';

export class DeleteEquipmentUseCase {
    constructor(private equipmentRepository: IEquipmentRepository) {}

    async execute(id: number): Promise<void> {
        const equipment = await this.equipmentRepository.findById(id);

        if (!equipment) {
            throw new Error('Equipment not found');
        }

        await this.equipmentRepository.delete(id);
    }
}
