import { CreateResearchDto } from 'application/dtos/researchs/CreateResearchDto';
import { Research } from 'domain/entities/researchs/Research';
import { IResearchRepository } from 'domain/interfaces/researchs/IResearchRepository';

export class CreateResearchUseCase {
    constructor(private researchRepository: IResearchRepository) {}

    async execute(dto: CreateResearchDto): Promise<Research> {
        if (!dto) {
            throw new Error('Research not found');
        }

        return this.researchRepository.create(dto);
    }
}
