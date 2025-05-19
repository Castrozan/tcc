import { Research } from 'domain/entities/researchs/Research';
import { IResearchRepository } from 'domain/interfaces/researchs/IResearchRepository';

export class FindByIdResearchUseCase {
    constructor(private researchRepository: IResearchRepository) {}

    async execute(id: number): Promise<Research | null> {
        return this.researchRepository.findById(id);
    }
}
