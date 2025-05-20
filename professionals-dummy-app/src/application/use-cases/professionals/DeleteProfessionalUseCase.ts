import { IProfessionalRepository } from 'domain/interfaces/professionals/IProfessionalRepository';

export class DeleteProfessionalUseCase {
    constructor(private ProfessionalRepository: IProfessionalRepository) {}

    async execute(id: number): Promise<void> {
        const Professional = await this.ProfessionalRepository.findById(id);

        if (!Professional) {
            throw new Error('Professional not found');
        }

        await this.ProfessionalRepository.delete(id);
    }
}
