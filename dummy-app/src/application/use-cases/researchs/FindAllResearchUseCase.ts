import { Research } from 'domain/entities/researchs/Research';
import { IResearchRepository } from 'domain/interfaces/researchs/IResearchRepository';

export class FindAllResearchUseCase {
    constructor(private researchRepository: IResearchRepository) {}

    async execute(): Promise<Research[]> {
        return this.researchRepository.findAll();
    }
}
