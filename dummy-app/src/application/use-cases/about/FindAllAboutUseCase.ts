import { About } from 'domain/entities/about/About';
import { IAboutRepository } from 'domain/interfaces/about/IAboutRepository';

export class FindAllAboutsUseCase {
    constructor(private aboutRepository: IAboutRepository) {}

    async execute(): Promise<About[]> {
        return this.aboutRepository.findAll();
    }
}
