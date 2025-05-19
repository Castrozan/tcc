import { Professional } from 'domain/entities/professionals/Professional';
import { IProfessionalRepository } from 'domain/interfaces/professionals/IProfessionalRepository';

export class FindByIdProfessionalUseCase {
    constructor(private ProfessionalRepository: IProfessionalRepository) {}

    async execute(id: number): Promise<Professional | null> {
        return this.ProfessionalRepository.findById(id);
    }
}
