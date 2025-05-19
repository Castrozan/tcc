import { UpdateAboutImageDto } from './UpdateAboutImageDto';

export class UpdateAboutDto {
    id: number;
    bodyText: string;
    secondText: string;
    images: UpdateAboutImageDto[] | null;

    constructor(
        id: number,
        bodyText: string,
        secondText: string,
        images: UpdateAboutImageDto[] | null
    ) {
        this.id = id;
        this.bodyText = bodyText;
        this.secondText = secondText;
        this.images = images;
    }
}
