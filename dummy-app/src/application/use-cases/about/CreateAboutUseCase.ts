import { CreateAboutDto } from 'application/dtos/about/CreateAboutDto';
import { About } from 'domain/entities/about/About';
import { IAboutRepository } from 'domain/interfaces/about/IAboutRepository';

export class CreateAboutUseCase {
    constructor(private aboutRepository: IAboutRepository) {}

    async execute(dto: CreateAboutDto): Promise<About> {
        if (!dto) {
            throw new Error('About not found');
        }

        return this.aboutRepository.create({
            ...dto,
            images: dto.images?.map((image) => ({
                ...image,
                id: undefined,
                aboutId: undefined
            }))
        });
    }
}
