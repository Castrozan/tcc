// application/use-case/CreateProfessionalUseCase.ts

import { CreateProfessionalDto } from 'application/dtos/professionals/CreateProfessionalDto';
import { Professional } from 'domain/entities/professionals/Professional';
import { IProfessionalRepository } from 'domain/interfaces/professionals/IProfessionalRepository';

export class CreateProfessionalUseCase {
    constructor(private ProfessionalRepository: IProfessionalRepository) {}

    async execute(dto: CreateProfessionalDto): Promise<Professional> {
        if (!dto) {
            throw new Error('Professional not found');
        }

        return this.ProfessionalRepository.create(dto);
    }
}
