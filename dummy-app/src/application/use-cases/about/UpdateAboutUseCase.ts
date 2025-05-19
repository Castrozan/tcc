import { UpdateAboutDto } from 'application/dtos/about/UpdateAboutDto';
import { About } from 'domain/entities/about/About';
import { AboutImage } from 'domain/entities/about/AboutImage';
import { IAboutRepository } from 'domain/interfaces/about/IAboutRepository';

export class UpdateAboutUseCase {
    constructor(private aboutRepository: IAboutRepository) {}

    async execute(dto: UpdateAboutDto): Promise<About> {
        const aboutToUpdate: Partial<About & { images?: Partial<AboutImage>[] }> = {
            ...dto,
            images: dto.images?.map((image) => ({
                ...image,
                aboutId: dto.id
            }))
        };
        return this.aboutRepository.update(aboutToUpdate);
    }
}
