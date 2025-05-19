import { UpdateResearchDto } from 'application/dtos/researchs/UpdateResearchDto';
import { Research } from 'domain/entities/researchs/Research';
import { IResearchRepository } from 'domain/interfaces/researchs/IResearchRepository';

export class UpdateResearchUseCase {
    constructor(private researchRepository: IResearchRepository) {}

    async execute(dto: UpdateResearchDto): Promise<Research> {
        return this.researchRepository.update(dto);
    }
}
