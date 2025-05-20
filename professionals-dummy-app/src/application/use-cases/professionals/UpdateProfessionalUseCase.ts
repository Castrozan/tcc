import { UpdateProfessionalDto } from 'application/dtos/professionals/UpdateProfessionalDto';
import { Professional } from 'domain/entities/professionals/Professional';
import { IProfessionalRepository } from 'domain/interfaces/professionals/IProfessionalRepository';

export class UpdateProfessionalUseCase {
    constructor(private ProfessionalRepository: IProfessionalRepository) {}

    async execute(dto: UpdateProfessionalDto): Promise<Professional> {
        return this.ProfessionalRepository.update(dto);
    }
}
