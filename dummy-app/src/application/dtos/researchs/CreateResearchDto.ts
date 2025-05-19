import { CreateResearchImageDto } from './CreateResearchImageDto';

export class CreateResearchDto {
    title: string;
    description: string;
    bodyText: string;
    secondText: string;
    professionalId: number | null;
    images: CreateResearchImageDto[] | null;

    constructor(
        title: string,
        description: string,
        bodyText: string,
        secondText: string,
        professionalId: number | null,
        images: CreateResearchImageDto[] | null
    ) {
        this.title = title;
        this.description = description;
        this.bodyText = bodyText;
        this.secondText = secondText;
        this.professionalId = professionalId;
        this.images = images;
    }
}
